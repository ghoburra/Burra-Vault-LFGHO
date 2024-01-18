
import { expect } from "chai";
import { ethers, network } from "hardhat";
import { Signer } from "ethers";
import { ArbitrageVault, ArbitrageVault__factory, BurraNFT as BurraNFTContr, ERC20, GhoToken, GhoToken__factory, IGhoToken, ERC20Permit as PermitContr } from "../typechain-types";
import * as ERC20Json from "../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json"
import * as BurraNFT from "../artifacts/contracts/BurraNFT.sol/BurraNFT.json"

import { signERC2612Permit } from 'eth-permit';



const WETH_ADDRESS = process.env.WETH_ADDRESS || ""
const GHO_ADDRESS = process.env.GHO_ADDRESS || ""
const MY_ACCOUNT_ADDRESS = process.env.MY_ACCOUNT || ""
const FACILITATOR_LABEL = "BURRA_FACILITATOR"
const AGGREGATOR_ADDRESS = process.env.AGGREGATOR_ADDRESS || ""
const DAI_ADDRESS = "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357"


type Facilitator = {
  bucketCapacity: number,
  bucketLevel: number,
  label: string
}



describe('Test Forking sepolia', () => {
  it('testing the forked network', async () => {
    const balance = await ethers.provider.getBalance(MY_ACCOUNT_ADDRESS);
    expect(balance).to.be.equal(process.env.ACCOUNT_BALANCE);


  });



});

describe('ArbitrageVault', () => {
  let vault: ArbitrageVault;
  let deployer: Signer;
  let an_user: Signer;
  let ghoToken: GhoToken
  let burraNFT: BurraNFTContr
  let dai: ERC20
  let VAULT_ADDRESS: string;
  let AN_USER_ADDRESS: string;
  let DEPLOYER_ADDRESS: string;
  let BURRA_NFT_ADDRESS: string;
  let GHO_ADDRESS: string;

  beforeEach(async () => {
    [deployer, an_user] = await ethers.getSigners();
    DEPLOYER_ADDRESS = await deployer.getAddress()
    AN_USER_ADDRESS = await an_user.getAddress()

    // const ERC20Contract = new ethers.Contract(WETH_ADDRESS, ERC20.abi, deployer) as unknown as ERC20Contr
    // burraNFT = new ethers.Contract(BURRA_NFT_ADDRESS, BurraNFT.abi, deployer) as unknown as BurraNFTContr

    // Deploy the custom GHOToken contract
    const GHOTokenFactory = (await ethers.getContractFactory('GhoToken', deployer)) as GhoToken__factory
    ghoToken = await GHOTokenFactory.deploy(DEPLOYER_ADDRESS)
    GHO_ADDRESS = await ghoToken.getAddress()

    // Deploy the ArbitrageVault contract
    const ArbitrageVaultFactory = (await ethers.getContractFactory('ArbitrageVault', deployer)) as ArbitrageVault__factory;

    vault = await ArbitrageVaultFactory.deploy(ghoToken, DAI_ADDRESS, AGGREGATOR_ADDRESS)
    await vault.waitForDeployment();
    VAULT_ADDRESS = await vault.getAddress()

    const bucketCapacity = ethers.parseEther('100');

    await ghoToken.connect(deployer).addFacilitator(VAULT_ADDRESS, FACILITATOR_LABEL, bucketCapacity)


    dai = new ethers.Contract(DAI_ADDRESS, ERC20Json.abi, deployer) as unknown as ERC20
    expect(await dai.decimals()).equals(18)
    const deployerDaiBalance = await dai.balanceOf(DEPLOYER_ADDRESS)
    expect(deployerDaiBalance).greaterThan(0)

  });

  it('Should verify that the vault is a facilitator', async () => {

    const facilitator: IGhoToken.FacilitatorStructOutput = await ghoToken.getFacilitator(VAULT_ADDRESS);
    expect(FACILITATOR_LABEL).to.equal(facilitator.label)
  });
  it('Should verify that the underlying is DAI', async () => {
    expect(await vault.asset()).equals(DAI_ADDRESS)
  });
  it('Should test an oracle to have the market price of gho', async () => {
    const ghoMarketPrice = await vault.getGHOMarketPrice()
    expect(ghoMarketPrice).greaterThan(0)
  });

  it('Should allow user to mint GHO after depositing collateral', async () => {
    //MINT GHO
    const depositAmount = 100n
    await dai.connect(deployer).approve(vault, depositAmount)
    expect(await dai.allowance(DEPLOYER_ADDRESS, vault)).equals(depositAmount)

    const borrowTx = await vault.connect(deployer).borrowGho(depositAmount)
    await expect(borrowTx).to.emit(vault, 'GHOBorrowed');
    expect(await dai.balanceOf(VAULT_ADDRESS)).equals(depositAmount)

    expect(await vault.getDepositForUser(DEPLOYER_ADDRESS)).equals(depositAmount)
    expect(await ghoToken.balanceOf(DEPLOYER_ADDRESS)).equals(depositAmount)


  });
  it('Should allow user to Burn GHO and get back collateral', async () => {
    //MINT GHO
    const depositAmount = 1000_000_000_000_000_000n
    await dai.connect(deployer).approve(vault, depositAmount)
    expect(await dai.allowance(DEPLOYER_ADDRESS, vault)).equals(depositAmount)

    const borrowTx = await vault.connect(deployer).borrowGho(depositAmount)
    await expect(borrowTx).to.emit(vault, 'GHOBorrowed');
    expect(await dai.balanceOf(VAULT_ADDRESS)).equals(depositAmount)

    expect(await vault.getDepositForUser(DEPLOYER_ADDRESS)).equals(depositAmount)
    expect(await ghoToken.balanceOf(DEPLOYER_ADDRESS)).equals(depositAmount)

    const repayAmount = 1000_000_000_000_000_000n / 2n

    await ghoToken.connect(deployer).approve(vault, repayAmount);
    expect(await ghoToken.allowance(DEPLOYER_ADDRESS, vault)).equals(repayAmount)
    const totalToPay = await vault.getTotalInterestToPay(DEPLOYER_ADDRESS, repayAmount)
    // console.log("TOTAL INTEREST TO PAY:", totalToPay)
    // console.log("total deposited", depositAmount)
    // console.log("repay amount", repayAmount)
    // console.log("GHO market price", await vault.getGHOMarketPrice())
    // console.log("Interest strategy for user", await vault.getInterestStrategyForUser(DEPLOYER_ADDRESS))
    const repayTx = await vault.connect(deployer).repayGHO(repayAmount)
    await expect(repayTx).to.emit(vault, 'GHORepaid');

    const depositAfterWithdraw = await vault.getDepositForUser(DEPLOYER_ADDRESS)
    expect(depositAfterWithdraw).equals(depositAmount-totalToPay)

  });


});

