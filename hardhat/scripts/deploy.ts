import { ethers } from "hardhat";
import { Signer } from "ethers";
import { ArbitrageVault, ArbitrageVault__factory, GhoToken, GhoToken__factory, ERC20 } from "../typechain-types";

import * as ERC20Json from "../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json";

const DAI_ADDRESS = "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357";
const AGGREGATOR_ADDRESS = process.env.AGGREGATOR_ADDRESS || "";

async function deployContracts(): Promise<void> {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();

  // Deploy GhoToken
  const ghoTokenFactory = (await ethers.getContractFactory('GhoToken', deployer)) as GhoToken__factory;
  const ghoToken = await ghoTokenFactory.deploy(deployerAddress);
  await ghoToken.waitForDeployment();
  const GHO_ADDRESS = await ghoToken.getAddress()

  // Deploy ArbitrageVault
  const vaultFactory = (await ethers.getContractFactory('ArbitrageVault', deployer)) as ArbitrageVault__factory;
  const vault = await vaultFactory.deploy(GHO_ADDRESS, DAI_ADDRESS, AGGREGATOR_ADDRESS);
  await vault.waitForDeployment();
  const VAULT_ADDRESS = await vault.getAddress()

  // Add ArbitrageVault as a facilitator in GhoToken
  const bucketCapacity = ethers.parseEther('100');
  await ghoToken.connect(deployer).addFacilitator(VAULT_ADDRESS, "BURRA_FACILITATOR", bucketCapacity);

  console.log("GhoToken address:", GHO_ADDRESS);
  console.log("ArbitrageVault address:",VAULT_ADDRESS);
}

deployContracts()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
