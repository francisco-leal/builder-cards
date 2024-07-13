import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const BASE_SEPOLIA_API_KEY = vars.get("BASE_SEPOLIA_API_KEY");
const PRIVATE_KEY = vars.get("PRIVATE_KEY");
const BASE_API_KEY = vars.get("BASE_API_KEY");

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    baseSepolia: {
      url: `https://api.developer.coinbase.com/rpc/v1/base-sepolia/${BASE_SEPOLIA_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      baseSepolia: BASE_API_KEY,
    },
  },
};

export default config;
