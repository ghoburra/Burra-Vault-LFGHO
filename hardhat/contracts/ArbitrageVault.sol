// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {GhoToken} from "./GhoToken.sol";
import {PriceConsumerV3} from "./PriceConsumerV3.sol";
import "./aaveLibraries/WadRayMath.sol";
import "./aaveLibraries/MathUtils.sol";

/**
@notice Ideally the users who mint here are advantaged because they have a different interest rate.
I want to try to make up an  InterestStrategy to incetivize people to mintwhen gho market price is >1$ and burn when gho market price is < 1$
Inspired by the discount on interest rate for stkAAVE holders
*/

contract ArbitrageVault is ERC4626 {
    struct InterestStrategy {
        uint256 start_block;
        uint256 rate;
    }

    mapping(address => uint256) private usersToDeposit;
    mapping(address => uint256) private listedBurra;
    mapping(address => uint256) private usersToShares;
    mapping(address => InterestStrategy) private userToInterestStrategy;

    GhoToken public gho;
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
    event  BurraListed(
        address indexed owner,
        uint256 amount
    );

    constructor(
        GhoToken _gho,
        IERC20 _underlying,
        address aggregator
    ) ERC4626(_underlying) ERC20("Burra", "bu") {
        gho = _gho;
        priceConsumerV3 = new PriceConsumerV3(aggregator);
    }

    /**  
    @dev should:
     1. deposit collateral (underlying asset defined in the vault)
        1a. give the borrower vault shares
     2. set a discountRate (or interest rate dky) basing on gho market price
                  2a.check if holder has burraNFT, if so, user has more advantage
     3. mint new gho
     this should give as much gho as much deposit is put in the vault
     this should have a disadvantaging dicount strategy if gho price < 1
     this should have a advantaging dicount strategy if gho price > 1
    */
    function borrowGho(uint256 depositAmount) public {
        //deposit and give shares
        uint256 shares = previewDeposit(depositAmount);
        _deposit(msg.sender, msg.sender, depositAmount, depositAmount);
        usersToShares[msg.sender] = usersToShares[msg.sender] + shares;

        // select interest strategy and mint GHO
        uint256 ghoMarketPrice = getGHOMarketPrice();
        uint256 interestRate = _determineInterestRate(ghoMarketPrice);
        userToInterestStrategy[msg.sender] = InterestStrategy({
            start_block: block.timestamp,
            rate: 1 * interestRate
        });
        _mintGHO(depositAmount);
        emit GHOBorrowed(msg.sender, depositAmount, interestRate);
    }

    /**
    @dev this function should repay a gho debt applying the interestStrategy when user borrowed GHO
    revert if user doesn't have a deposit position in this vault
    gives back collateral to user
     */
    function repayGHO(uint256 nominalAmount) public {
        uint256 totalDeposit = usersToDeposit[msg.sender];
        require(totalDeposit > 0, "user has not a borrow position");
        require(totalDeposit >= nominalAmount, "user want to repay more?");

        uint256 debitPlusInterest = getDebtToPay(msg.sender, nominalAmount);

        _withdraw(
            msg.sender,
            msg.sender,
            address(this),
            nominalAmount,
            nominalAmount //should change to shares
        );
        _burnGHO(debitPlusInterest);
        usersToDeposit[msg.sender] = totalDeposit - debitPlusInterest;
        emit GHORepaid(msg.sender, nominalAmount, debitPlusInterest);
    }

    /**
    @notice calculate the API using MathUtils.calculateLinearInterest from aave 
     */
    function calculateAPY(
        uint256 amount,
        InterestStrategy memory strategy
    ) public view returns (uint256) {
        uint256 rate = WadRayMath.wadToRay(strategy.rate);
        uint256 i = WadRayMath.rayToWad(
            MathUtils.calculateLinearInterest(
                rate,
                uint40(strategy.start_block)
            )
        );

        return WadRayMath.wadMul((i - WadRayMath.WAD), amount) + amount;
    }

    /**
    @dev need to override that to move the funds accounting to who's buying the shares of the vault, same for transferfrom
     */
    function transfer(
        address to,
        uint256 value
    ) public override(IERC20, ERC20) returns (bool) {
        address owner = _msgSender();
        uint256 shares = convertToShares(value);
        _transfer(owner, to, value);
        gho.transferFrom(owner, to, value);
        usersToDeposit[to] = usersToDeposit[to] + value;
        usersToDeposit[_msgSender()] = usersToDeposit[_msgSender()] - value;
        usersToShares[to] = usersToShares[to] + shares;
        usersToShares[_msgSender()] = usersToShares[_msgSender()] - shares;
        return true;
    }

    /**
    @dev need to override that to move the funds accounting to who's buying the shares of the vault, same for transferfrom
     */
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public override(IERC20, ERC20) returns (bool) {
        address spender = _msgSender();
        uint256 shares = convertToShares(value);
        _spendAllowance(from, spender, value);
        _transfer(from, to, value);
        gho.transferFrom(from, to, value);

        usersToDeposit[to] = usersToDeposit[to] + value;
        usersToDeposit[from] = usersToDeposit[from] - value;

        usersToShares[to] = usersToShares[to] + shares;
        usersToShares[from] = usersToShares[from] - shares;
        return true;
    }

    /**
    @dev list burra for sales. part of the deposit is put in sales
     */
    function listBurra(uint256 amount) public {
        uint256 totalDeposit = usersToDeposit[msg.sender];
        require(totalDeposit > 0, "user has not a borrow position");
        listedBurra[msg.sender] = listedBurra[msg.sender] + amount;
        emit BurraListed(msg.sender,amount);
    }

    ////////////////////////// internal functions //////////////////////////
    function _mintGHO(uint256 amount) internal {
        gho.mint(msg.sender, amount);
    }

    /**
    @notice interest rate: this is a stable interest rate that get rebalanced depending on gho market price
    Stable rate parameters:
        my formula is
        Interest Rate=Base Interest Rate+(Market Price−Threshold)×Sensitivity
     */

    function _determineInterestRate(
        uint256 ghoMarketPrice
    ) internal pure returns (uint256) {
        uint256 sensitivity = 17000000000000000;
        uint256 rate;
        // Interest Rate=Base Interest Rate+(Market Price−Threshold)×Sensitivity
        if (ghoMarketPrice >= 1000000000000000000) {
            uint256 baseRate = 15000000000000000; //1.5%
            uint256 threshold;
            unchecked {
                threshold = ghoMarketPrice - 1000000000000000000;
            }

            rate = WadRayMath.wadDiv(
                baseRate - WadRayMath.wadMul(threshold, sensitivity),
                WadRayMath.WAD
            );
        } else {
            uint256 baseRate = 30000000000000000; //3%
            uint256 threshold;
            unchecked {
                threshold = 1000000000000000000 - ghoMarketPrice;
            }

            rate = WadRayMath.wadDiv(
                baseRate + WadRayMath.wadMul(threshold, sensitivity),
                WadRayMath.WAD
            );
        }
        return rate;
    }

    /**
    @dev overridden from ERC4626
     */
    function _deposit(
        address caller,
        address receiver,
        uint256 assets,
        uint256 shares
    ) internal override {
        IERC20 _asset = IERC20(asset());
        SafeERC20.safeTransferFrom(_asset, caller, address(this), assets);
        _mint(receiver, shares);
        usersToDeposit[msg.sender] = usersToDeposit[msg.sender] + assets;
        emit Deposit(caller, receiver, assets, shares);
    }

    /**
    @dev send back the collateral to the borrower before burning the gho tokens
     */
    function _withdraw(
        address caller,
        address receiver,
        address owner,
        uint256 assets,
        uint256 shares
    ) internal override {
        IERC20 _asset = IERC20(asset());
        _burn(msg.sender, shares);
        SafeERC20.safeTransfer(_asset, receiver, assets);
        emit Withdraw(caller, receiver, owner, assets, shares);
    }

    function _burnGHO(uint256 amount) internal {
        gho.transferFrom(msg.sender, address(this), amount);
        gho.burn(amount);
    }

    ////////////////////////// getters //////////////////////////
    function getGHOMarketPrice() public view returns (uint256) {
        return uint256(priceConsumerV3.getLatestPrice() * 10000000000); // chainlink return 8 decimals
    }

    function getDepositForUser(address user) public view returns (uint256) {
        return usersToDeposit[user];
    }

    function getInterestStrategyForUser(
        address user
    ) public view returns (InterestStrategy memory) {
        return userToInterestStrategy[user];
    }

    function getDebtToPay(
        address borrower,
        uint256 nominalAmount
    )
        public
        view
        returns (
            // uint256 timestamp
            uint256
        )
    {
        uint256 debitPlusInterest = calculateAPY(
            nominalAmount,
            userToInterestStrategy[borrower]
        );
        return debitPlusInterest;
    }

    function getBorrowRate() public view returns (uint256) {
        uint256 ghoMarketPrice = getGHOMarketPrice();
        return _determineInterestRate(ghoMarketPrice);
    }

    function getShareToken() public view returns (string memory) {
        return name();
    }

    function getInterestRate() public view returns (uint256) {
        uint256 ghoPrice = getGHOMarketPrice();
        return _determineInterestRate(ghoPrice);
    }

    function getInterestRateAtPrice(
        uint256 ghoPrice
    ) public pure returns (uint256) {
        return _determineInterestRate(ghoPrice);
    }
    
    function getListedBurra(
        address owner
    ) public view returns (uint256) {
        return listedBurra[owner];
    }
    
}
