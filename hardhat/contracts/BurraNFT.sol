// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {GhoToken} from "./GhoToken.sol";

//this vault will do arbitrage when the GHO price will be up-pegged
contract BurraNFT is ERC721 {
    address private facilitator;
    constructor(address _facilitator) ERC721("burraNFT", "BFT") {
        facilitator = _facilitator;
    }

    uint256 private latestTokenId = 0;
    mapping(address owner => uint256 tokenId) private ownerToToken;


    function mint(address receiver, bool isTest) public {
        require((msg.sender == facilitator || isTest), "you can't call this");
        uint256 tokenId = latestTokenId + 1;
        _safeMint(receiver, tokenId);
        latestTokenId = tokenId;
        ownerToToken[receiver] = tokenId;
    }

    function burn(uint256 tokenId) public {
        _burn(tokenId);
    }

    function getTokenId(address owner) public view returns (uint256) {
        return ownerToToken[owner];
    }
}
