// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./IBuilderCard.sol";

import "hardhat/console.sol";

contract BuilderCard is ERC1155Supply, IBuilderCard {
    uint256 public constant COLLECTION_FEE = 0.001 ether;
    uint256 public constant BUILDER_REWARD = 0.0005 ether;
    uint256 public constant FIRST_COLLECTOR_REWARD = 0.0003 ether;

    mapping(address _owner => uint256 _balanceOfOwner)
        private _balancesOfOwners;

    mapping(uint256 _id => address _firstCollector) private _firstCollectors;

    address private _contractOwner;

    mapping(address _account => uint256 _accountEarning)
        private _accountEarnings;

    error WrongValueForCollectionFee(uint256 _required, uint256 _provided);

    error UnauthorizedCaller();

    error InsufficientSmartContractBalance(
        uint256 _balance,
        uint256 _amountRequested
    );

    modifier onlyOwner() {
        if (msg.sender != _contractOwner) {
            revert UnauthorizedCaller();
        }
        _;
    }

    constructor(string memory uri_) ERC1155(uri_) {
        _contractOwner = msg.sender;
    }

    function collect(address _builder) public payable {
        if (msg.value != COLLECTION_FEE) {
            revert WrongValueForCollectionFee(COLLECTION_FEE, msg.value);
        }

        uint256 remainingValue = msg.value;

        uint256 _tokenId = _builderIdFromAddress(_builder);
        if (balanceOf(msg.sender, _tokenId) == 0) {
            _mint(msg.sender, _tokenId, 1, "");

            // Finances

            payable(_builder).transfer(BUILDER_REWARD);
            remainingValue -= BUILDER_REWARD;
            _accountEarnings[_builder] += BUILDER_REWARD;

            if (_firstCollectors[_tokenId] == address(0)) {
                // this is the first collection for this token
                _firstCollectors[_tokenId] = msg.sender;

                payable(msg.sender).transfer(FIRST_COLLECTOR_REWARD);
                remainingValue -= FIRST_COLLECTOR_REWARD;
                _accountEarnings[msg.sender] += FIRST_COLLECTOR_REWARD;
            }
        }

        if (remainingValue > 0) {
            _accountEarnings[address(this)] += remainingValue;
        }
    }

    function balanceFor(address _builder) external view returns (uint256) {
        uint256 _tokenId = _builderIdFromAddress(_builder);
        return totalSupply(_tokenId);
    }

    function balanceFor() external view returns (uint256) {
        return totalSupply();
    }

    function balanceOf(
        address _owner,
        address _builder
    ) external view returns (uint256) {
        uint256 tokenId = _builderIdFromAddress(_builder);
        return balanceOf(_owner, tokenId);
    }

    function balanceOf(address _owner) external view returns (uint256) {
        return _balancesOfOwners[_owner];
    }

    function withDraw(uint256 _amount) external onlyOwner {
        uint256 _contractBalance = address(this).balance;
        if (_contractBalance < _amount) {
            revert InsufficientSmartContractBalance(_contractBalance, _amount);
        }
        payable(_contractOwner).transfer(_amount);
    }

    function earnings(address _account) external view returns (uint256) {
        return _accountEarnings[_account];
    }

    // -------------- internal ------------------------------------

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal virtual override {
        super._update(from, to, ids, values);

        if (to == address(0) && from == address(0)) {
            return;
        }

        uint256 sumOfValues;
        uint256 valuesLength = values.length;

        for (uint256 i = 0; i < valuesLength; i++) {
            sumOfValues += values[i];
        }

        if (to != address(0)) {
            _balancesOfOwners[to] += sumOfValues;
        }

        if (from != address(0)) {
            _balancesOfOwners[from] -= sumOfValues;
        }
    }

    function _builderIdFromAddress(
        address _builder
    ) internal pure returns (uint256) {
        return uint256(uint160(_builder));
    }
}
