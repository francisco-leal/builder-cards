// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BuilderCard is ERC1155 {
    mapping(uint256 _id => uint256 _balanceOfId) _balancesOfIds;
    uint256 _nftBalance;

    constructor(string memory uri_) ERC1155(uri_) {}

    function uri(uint256 _id) public view override returns (string memory) {
        return
            string.concat(super.uri(_id), "/", Strings.toString(_id), ".json");
    }

    function collect(uint256 _id) public {
        _mint(msg.sender, _id, 1, "");
        _balancesOfIds[_id] += 1;
        _nftBalance += 1;
    }

    function balanceOfToken(
        uint256 _id
    ) public view returns (uint256 _balance) {
        _balance = _balancesOfIds[_id];
    }

    function balance() public view returns (uint256 _nftBln) {
        _nftBln = _nftBalance;
    }
}
