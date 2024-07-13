// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BuilderCard is ERC1155 {
    constructor(string memory uri_) ERC1155(uri_) {}

    function uri(uint256 _id) public view override returns (string memory) {
        return
            string.concat(super.uri(_id), "/", Strings.toString(_id), ".json");
    }
}
