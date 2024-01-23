import { ethers } from "hardhat";
import { Signer } from "ethers";
import { ArbitrageVault, ArbitrageVault__factory, GhoToken, GhoToken__factory, ERC20 } from "../typechain-types";
import * as GHOTokenJson from "../artifacts/contracts/GhoToken.sol/GhoToken.json"

import * as ERC20Json from "../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json";

const DAI_ADDRESS = "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357";
const AGGREGATOR_ADDRESS = process.env.AGGREGATOR_ADDRESS || "";

async function deployContracts(): Promise<void> {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();

  // get GHOTOKEN CONTRAXT GhoToken

  const GHO_ADDRESS = "0x8a4FcC53C2D19C69AEB51dfEF05a051d40927CE2"
  const VAULT_ADDRESS = "0x78A3022d16340412eCf82BAF5d5b6486CCc95869"
  const ghoToken: GhoToken = new ethers.Contract(GHO_ADDRESS, GHOTokenJson.abi,deployer ) as unknown as GhoToken;



  // Add ArbitrageVault as a facilitator in GhoToken
  const bucketCapacity = ethers.parseEther('1000');
  const tx = await ghoToken.connect(deployer).setFacilitatorBucketCapacity(VAULT_ADDRESS, bucketCapacity)
  console.log("setFacilitatorBucketCapacity tx:", tx)
}

deployContracts()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
