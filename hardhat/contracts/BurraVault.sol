// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

//this vault will do arbitrage when the GHO price will be up-pegged
contract BurraVault is ERC4626 {
// VAULT FLOW 
// 0. vault has for example WETH
// 1. vault get some leverage using the WETH in the vault
// 2. vault use this leverage as collateral to mint GHO when the price is more than 1$ at 1$ --> vault has GHO now
// 3. vault sell on market for 1$+ --> vault has another asset
// 4. vault waits for the price to come back to 1 dollar
// 5. vault buy GHO on the market again using WETH --> now vault has GHO
// 5. vault repays the GHO debt --> get back the collateral
// 6. vault has done the arbitrage


// TODO the following functions:
//      deposit, 
//      get leverage, 
//      mint GHO
//      swap token from gho to asset
//      swap token asset to gho
//      swap (sell) token asset to gho
//      repay (sell) gho debt

    constructor(ERC20 _asset) ERC4626 (_asset)  ERC20("Burra","bu"){}


}