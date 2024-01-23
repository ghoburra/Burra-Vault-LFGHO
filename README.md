# Burra Vault

## Overview

Burra vault is a ERC 4626 vault which act as a GHO facilitator. It can mint GHO to users who deposit in the vault.
The special thing of Burra is that it determines the interest borrow rate basing on the price. if GHO is overpegged, the rate will be smaller, incentivizing users to mint (borrow) GHO at a low interest.
This would cause the supply of GHO to increase, and the price to be back at 1$. In the opposite scenario, when GHO is underpegged (price <1$) to the dollar, the rate will be higher, deterring users to mint new GHO.
Users that deposit into Burra, are issued with Burra (BU) shares. These shares represent the debt position of each user. Users can List part of their shares for sale, allowing other users to buy their debt.
Immagine, I borrow gho with a low interest rate because the price is overpegged and the rates are low. after some week, GHO is underpegged, rates grow and borrowing GHO is not optimal.
I can sell my shares representing the debt I got at a lower rate than the current one making profit.
This secondary market would deter user to mint new gho when the rates are high while maintaing the circulation of GHO active.

## How it's made
- a ERC4626 vault 
- tests for the vault
- forked AAve user interface to represent the app
I used Solidity and hardhat to write, deploy and test the contracts. I deployed a forked GHOToken and the facilitator.

## Addresses:

GhoToken address: 0x3308ff248A0Aa6EB7499A39C4c26ADF526825B0d

ArbitrageVault address: 0xdEC90AA22d77af136588F54F44ec66492409D740

## Relevant Pieces of Code
Vault: https://github.com/fabriziogianni7/Burra-Vault-LFGHO/blob/main/hardhat/contracts/ArbitrageVault.sol

Tests: https://github.com/fabriziogianni7/Burra-Vault-LFGHO/blob/main/hardhat/test/ArbitrageVault.ts

APY calculation: https://github.com/fabriziogianni7/Burra-Vault-LFGHO/blob/27be4779594be8c1e71f09bf8051db28e0f03da9/hardhat/contracts/ArbitrageVault.sol#L113

Interest rate formula: https://github.com/fabriziogianni7/Burra-Vault-LFGHO/blob/27be4779594be8c1e71f09bf8051db28e0f03da9/hardhat/contracts/ArbitrageVault.sol#L190
