// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BuilderCard is ERC1155 {
    address _platformAddress;

    mapping(uint256 _id => uint256 _balanceOfId) _balancesOfIds;

    mapping(address _collector => uint256 _balanceOfCollector) _balancesOfCollectors;

    mapping(address _builder => uint256 _id) public builderIds;

    mapping(address _beneficiary => uint256 _earning) _earnings;

    uint256 _nftBalance;

    uint256 _idSequence;

    uint256 constant TOTAL_COLLECT_FEE = 0.001 ether;
    uint256 constant BUILDER_REWARD = 0.0005 ether;
    uint256 constant FIRST_COLLECTOR_REWARD = 0.0003 ether;
    uint256 constant PLATFORM_FEE = 0.0002 ether;

    constructor(string memory uri_, address _pa) ERC1155(uri_) {
        _platformAddress = _pa;
    }

    function uri(uint256 _id) public view override returns (string memory) {
        return
            string.concat(super.uri(_id), "/", Strings.toString(_id), ".json");
    }

    function collect(address _builder) public payable {
        require(
            msg.value >= TOTAL_COLLECT_FEE,
            "not enough value send in the transaction"
        );

        uint256 _id = builderIds[_builder];
        bool firstMint = false;

        if (_id == 0) {
            firstMint = true;
            _idSequence += 1;
            _id = _idSequence;
            builderIds[_builder] = _id;
        }

        _mint(msg.sender, _id, 1, "");

        _balancesOfIds[_id] += 1;

        _nftBalance += 1;

        _balancesOfCollectors[msg.sender] += 1;

        // Financial part starts here:
        //----------------------------
        if (firstMint) {
            payable(msg.sender).transfer(FIRST_COLLECTOR_REWARD);
            _earnings[msg.sender] += FIRST_COLLECTOR_REWARD;
        }

        payable(_builder).transfer(BUILDER_REWARD);
        _earnings[_builder] += BUILDER_REWARD;

        uint256 _platformEarning = TOTAL_COLLECT_FEE -
            FIRST_COLLECTOR_REWARD -
            BUILDER_REWARD;
        payable(_platformAddress).transfer(_platformEarning);
        _earnings[_platformAddress] += _platformEarning;
    }

    function balanceOfBuilder(
        address _builder
    ) public view returns (uint256 _balance) {
        uint256 _id = builderIds[_builder];

        _balance = _balancesOfIds[_id];
    }

    function balance() public view returns (uint256 _nftBln) {
        _nftBln = _nftBalance;
    }

    function balanceOfCollectorForBuilder(
        address _collector,
        address _builder
    ) public view returns (uint256) {
        uint256 _id = builderIds[_builder];

        return super.balanceOf(_collector, _id);
    }

    function balanceOfCollector(
        address _collector
    ) public view returns (uint256) {
        return _balancesOfCollectors[_collector];
    }

    function earnings(address _beneficiary) public view returns (uint256) {
        return _earnings[_beneficiary];
    }
}
