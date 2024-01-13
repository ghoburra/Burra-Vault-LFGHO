import { expect } from "chai";
import { ethers, network } from "hardhat";
import { Signer } from "ethers";
import { BurraVault, BurraVault__factory, ERC20 as ERC20Contr } from "../typechain-types";
import * as ERC20 from "../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json"


const WETH = process.env.WETH_ADDRESS || ""
describe('Test Forked sepolia', () => {
  it('testing the forked network', async () => {
    const balance = await ethers.provider.getBalance("0x1C9E05B29134233e19fbd0FE27400F5FFFc3737e");
    expect(balance).to.be.equal(process.env.ACCOUNT_BALANCE);


  });



});

describe('BurraVault', () => {
  let vault: BurraVault;
  let deployer: Signer;

  beforeEach(async () => {
    [deployer] = await ethers.getSigners();

    // Deploy the BurraVault contract
    const BurraVaultFactory = (await ethers.getContractFactory('BurraVault', deployer)) as BurraVault__factory;
    vault = await BurraVaultFactory.deploy(WETH);
    await vault.waitForDeployment();

  });

  it('BurraVault contract should be deployed', async () => {
    expect(await vault.getAddress()).to.not.equal(0);
  });

  it('the asset in the vault should be WETH', async () => {
    const asset = await vault.asset()
    expect(asset).to.equal(WETH);
  });
  it('test the view functions in vault', async () => {
    const totalAssets = await vault.totalAssets()
    const convertToShares = await vault.convertToShares(1)
    const maxDeposit = await vault.maxDeposit(deployer)

    expect(totalAssets).to.equal(0n);
    expect(convertToShares).to.equal(1n);
    expect(maxDeposit).to.be.greaterThan(0n);
  });

  it('Should deposit assets into the vault', async () => {
    const WETHHolderAddress = "0x210126146B8fC472f0969d6E1369c3406cf515Ca"

    // need to impersonate an account holding some of WETH and deposit
    const impersonated = await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [WETHHolderAddress],
    })



    expect(impersonated).to.be.true

    const WETHHolder = await ethers.getSigner(WETHHolderAddress)


    const depositAmount = ethers.parseEther('1');
    const ERC20Contract = new ethers.Contract(WETH, ERC20.abi, deployer) as unknown as ERC20Contr

    const approveTx = await ERC20Contract.approve(WETHHolder, depositAmount);
    expect(approveTx).to.be.not.undefined;
    

    // const deposited = await vault.connect(WETHHolder).mint(depositAmount,WETHHolderAddress)
    const deposited = await vault.connect(WETHHolder).deposit(depositAmount, WETHHolderAddress)

    console.log("deposited: ", deposited)


  });
});

