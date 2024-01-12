import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { BurraVault, BurraVault__factory } from "../typechain-types";







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
    vault = await BurraVaultFactory.deploy("0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9");
    await vault.waitForDeployment();
  });

  it('BurraVault contract should be deployed', async () => {
    expect(await vault.getAddress()).to.not.equal(0);
  });

  it('the asset in the vault should be WETH', async () => {
    const asset = await vault.asset()
    expect(asset).to.equal("0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9");
  });
  it('test the view functions in vault', async () => {
    const totalAssets = await vault.totalAssets()
    const convertToShares = await vault.convertToShares(1)
    const maxDeposit = await vault.maxDeposit(deployer)

    expect(totalAssets).to.equal(0n);
    expect(convertToShares).to.equal(1n);
    expect(maxDeposit).to.be.greaterThan(0n);
  });



  // it('Should deposit assets into the vault', async () => {
  //   const depositAmount = ethers.utils.parseEther('1');

  //   const vaultBalance = await assetIn.balanceOf(vault.address);
  //   expect(vaultBalance).to.equal(depositAmount);
  // });
});

