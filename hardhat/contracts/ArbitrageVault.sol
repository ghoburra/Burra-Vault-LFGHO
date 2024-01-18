// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {GhoToken} from "./GhoToken.sol";
import {BurraNFT} from "./BurraNFT.sol";
import {PriceConsumerV3} from "./PriceConsumerV3.sol";

//this vault will do arbitrage when the GHO price will be up-pegged
contract ArbitrageVault is ERC4626 {
    //Ideally the users who mint here are advantaged because they have a different interest rate.

    // I want to try to make up an  InterestStrategy to incetivize people to mint when gho market price is >1$ and burn when gho market price is < 1$
    // Inspired by the discount on interest rate for stkAAVE holders

    mapping(address => uint256) private usersToDeposit;
    mapping(address => uint256) private userToInterestStrategy;

    GhoToken public gho;
    BurraNFT public burraNFT;
    PriceConsumerV3 public priceConsumerV3;

    event GHOBorrowed(
        address indexed borrower,
        uint256 amount,
        uint256 discountStrategy
    );
    event GHORepaid(
        address indexed borrower,
        uint256 amount,
        uint256 totalPaidInDollars
    );

    constructor(
        GhoToken _gho,
        IERC20 _underlying,
        address aggregator
    ) ERC4626(_underlying) ERC20("Burra", "bu") {
        gho = _gho;
        burraNFT = new BurraNFT(address(this));
        priceConsumerV3 = new PriceConsumerV3(aggregator);
    }

    /**  @dev should:
     deposit collateral (underlying asset defined in the vault)
     set a discountRate (or interest rate dky) basing on gho market price
                  check if holder has burraNFT, if so, user has more advantage
     mint new gho
     this should give as much gho as much deposit is put in the vault
     this should have a disadvantaging dicount strategy if gho price < 1
     this should have a advantaging dicount strategy if gho price > 1
    */
    function borrowGho(uint256 depositAmount) public {
        _deposit(depositAmount);
        uint256 ghoMarketPrice = getGHOMarketPrice();
        uint256 discountStrategy = _determineDiscountStrategy(ghoMarketPrice);
        userToInterestStrategy[msg.sender] = 1 * discountStrategy;
        _mintGHO(depositAmount);
        emit GHOBorrowed(msg.sender, depositAmount, discountStrategy);
    }

    /**
    @dev in progress
    should set the discount rate for the user at the time of minting
    if gho market price is up the rate should be disadvantageus for the user
    otherwise should be very good, incentivizing user to mint
    @dev should fetch the current rates maybe
     */
    function _determineDiscountStrategy(
        uint256 ghoMarketPrice
    ) internal view returns (uint256) {
        uint256 priceMultiplier;
        if (ghoMarketPrice >= 1000000000000000000) {
            //set strategy for user
            priceMultiplier = 1; 
        } else {
            priceMultiplier = 3;
            //set strategy for user
        }
        uint256 tokenId = burraNFT.getTokenId(msg.sender);
        if (tokenId != 0) {
            //add advantage
        }

        return priceMultiplier;
    }

    function calculatePercentage(
        uint256 amount,
        uint256 bps
    ) public pure returns (uint256) {
        return (amount * bps) / 10_000;
    }

    function _deposit(uint256 depositAmount) internal {
        IERC20 underlying = IERC20(asset());
        require(
            (underlying.balanceOf(msg.sender) >= depositAmount),
            "Insufficient balance"
        );
        require(
            (underlying.allowance(msg.sender, address(this)) == depositAmount),
            "Insufficient allowance"
        );

        bool paymentSuccess = underlying.transferFrom(
            msg.sender,
            address(this),
            depositAmount
        );
        require(paymentSuccess, "Could not transfer tokens from user to here");
        usersToDeposit[msg.sender] = usersToDeposit[msg.sender] + depositAmount;
    }

    function _mintGHO(uint256 amount) internal {
        gho.mint(msg.sender, amount);
    }

    /**
    @dev this function should repay a gho debt applying the interestStrategy when user borrowed GHO
    revert if user doesn't have a deposit position in this vault
     */
    function repayGHO(uint256 ghoAmountToRepay) public {
        uint256 totalDeposit = usersToDeposit[msg.sender];
        require(
            usersToDeposit[msg.sender] > 0,
            "user has not a borrow position"
        );

        uint256 debitPlusInterest = getTotalInterestToPay(
            msg.sender,
            ghoAmountToRepay
        );
        _withdrawCollateral(debitPlusInterest, totalDeposit);
        _burnGHO(ghoAmountToRepay);
        emit GHORepaid(msg.sender, ghoAmountToRepay, debitPlusInterest);
    }

    /**
    @dev send back the collateral to the borrower before burning the gho tokens
     */
    function _withdrawCollateral(
        uint256 withdrawAmount,
        uint256 totalDeposit
    ) internal {
        ERC20 underlying = ERC20(asset());
        require(withdrawAmount <= totalDeposit, "Insufficient deposit");

        require(
            (underlying.balanceOf(address(this)) >= totalDeposit),
            "Insufficient collateral"
        );
        underlying.approve(address(this), withdrawAmount);
        bool paymentSuccess = underlying.transfer(msg.sender, withdrawAmount);
        require(paymentSuccess, "Could not transfer tokens from vault to user");

        usersToDeposit[msg.sender] = totalDeposit - withdrawAmount;
    }

    function _burnGHO(uint256 amount) internal {
        gho.transferFrom(msg.sender, address(this), amount); // need to transfer here go first... maybe
        uint256 balance = gho.balanceOf(msg.sender);
        require(balance >= amount, "not enough balance to burn");
        gho.burn(amount);

        // issue a burraNFT, this NFT gives additional advantages when minting new GHO
        burraNFT.mint(msg.sender, false);
        userToInterestStrategy[msg.sender] = 0;
    }

    ////////////////////////// getters //////////////////////////
    function getGHOMarketPrice() public view returns (uint256) {
        return uint256(priceConsumerV3.getLatestPrice() * 10000000000); // chainlink return 8 decimals
    }

    function getBurraNFTAddress() public view returns (address) {
        return address(burraNFT);
    }

    function getDepositForUser(address user) public view returns (uint256) {
        return usersToDeposit[user];
    }

    function getInterestStrategyForUser(
        address user
    ) public view returns (uint256) {
        return userToInterestStrategy[user];
    }

    function getTotalInterestToPay(
        address borrower,
        uint256 ghoAmountToRepay
    ) public view returns (uint256 debitPlusInterest) {
        return
            debitPlusInterest =
                calculatePercentage(
                    ghoAmountToRepay,
                    userToInterestStrategy[borrower]
                ) +
                ghoAmountToRepay;
    }
}
