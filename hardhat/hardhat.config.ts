import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();
const config: HardhatUserConfig = {
  networks: {

    hardhat: {
      accounts: [{
        privateKey: `${process.env.ACCOUNT_PK}`,
        balance: `${process.env.ACCOUNT_BALANCE}`
      },
      {
        privateKey: `${process.env.ACCOUNT_2_PK}`,
        balance: `${process.env.ACCOUNT_BALANCE}`
      }],
      forking: {
        url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
        blockNumber: 5102534,
      }
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`${process.env.ACCOUNT_PK}`],
    },
  },
  solidity: "0.8.20",
};

export default config;
