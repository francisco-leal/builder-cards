// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

import "./IBuilderCard.sol";

import "hardhat/console.sol";

contract BuilderCard is ERC1155Supply, Pausable, IBuilderCard {
    struct ChargingPolicy {
        uint256 collectionFee;
        uint256 builderReward;
        uint256 firstCollectorReward;
    }

    ChargingPolicy private _chargingPolicy;

    mapping(address _owner => uint256 _balanceOfOwner)
        private _balancesOfOwners;

    mapping(uint256 _id => address _firstCollector) private _firstCollectors;

    address private _contractOwner;

    mapping(address _account => uint256 _accountEarning)
        private _accountEarnings;

    // --------------------- Errors ---------------------------------------

    error WrongValueForCollectionFee(uint256 _required, uint256 _provided);

    error UnauthorizedCaller();

    error InsufficientSmartContractBalance(
        uint256 _balance,
        uint256 _amountRequested
    );

    error RecipientAlreadyCollectorOfBuilderCard();

    error ChargingPolicyError(string _message);
    //---------------------------------------------------------------------

    modifier onlyOwner() {
        if (msg.sender != _contractOwner) {
            revert UnauthorizedCaller();
        }
        _;
    }

    constructor(
        string memory uri_,
        ChargingPolicy memory chargingPolicy_
    ) ERC1155(uri_) {
        _contractOwner = msg.sender;
        _chargingPolicy = chargingPolicy_;
    }

    function collect(address _builder) public payable whenNotPaused {
        if (msg.value != _chargingPolicy.collectionFee) {
            revert WrongValueForCollectionFee(
                _chargingPolicy.collectionFee,
                msg.value
            );
        }

        uint256 remainingValue = msg.value;

        uint256 _tokenId = _builderIdFromAddress(_builder);

        bool collected = false;

        if (balanceOf(msg.sender, _tokenId) == 0) {
            _mint(msg.sender, _tokenId, 1, "");

            collected = true;

            // Finances

            payable(_builder).transfer(_chargingPolicy.builderReward);
            remainingValue -= _chargingPolicy.builderReward;
            _accountEarnings[_builder] += _chargingPolicy.builderReward;

            if (_firstCollectors[_tokenId] == address(0)) {
                // this is the first collection for this token
                _firstCollectors[_tokenId] = msg.sender;

                payable(msg.sender).transfer(
                    _chargingPolicy.firstCollectorReward
                );
                remainingValue -= _chargingPolicy.firstCollectorReward;
                _accountEarnings[msg.sender] += _chargingPolicy
                    .firstCollectorReward;
            }
        }

        if (remainingValue > 0) {
            _accountEarnings[address(this)] += remainingValue;
        }

        if (collected) {
            emit CardCollected(_builder, msg.sender);
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

    function setChargingPolicy(
        uint256 collectionFee_,
        uint256 builderReward_,
        uint256 firstCollectorReward_
    ) external onlyOwner {
        if (collectionFee_ == 0) {
            revert ChargingPolicyError("Collection fee should be positive");
        }

        if (builderReward_ + firstCollectorReward_ >= collectionFee_) {
            revert ChargingPolicyError(
                "Collection fee should be greater than the sum of the builder and first collector reward"
            );
        }

        _chargingPolicy.collectionFee = collectionFee_;
        _chargingPolicy.builderReward = builderReward_;
        _chargingPolicy.firstCollectorReward = firstCollectorReward_;
    }

    function getCollectionFee() external view returns (uint256) {
        return _chargingPolicy.collectionFee;
    }

    function getBuilderReward() external view returns (uint256) {
        return _chargingPolicy.builderReward;
    }

    function getFirstCollectorReward() external view returns (uint256) {
        return _chargingPolicy.firstCollectorReward;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // -------------- internal ------------------------------------

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal virtual override whenNotPaused {
        uint256 valuesLength = values.length;

        // check that recipient is not already a collector
        // -----------------------------------------------
        if (to != address(0)) {
            for (uint256 i = 0; i < valuesLength; i++) {
                if (balanceOf(to, ids[i]) > 0) {
                    revert RecipientAlreadyCollectorOfBuilderCard();
                }
            }
        }

        super._update(from, to, ids, values);

        if (to == address(0) && from == address(0)) {
            return;
        }

        // update balance of owners
        // ------------------------
        uint256 sumOfValues;

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
