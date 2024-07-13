import { HardhatUserConfig, vars, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const BASE_SEPOLIA_API_KEY = vars.get("BASE_SEPOLIA_API_KEY", "");
const PRIVATE_KEY = vars.get(
  "PRIVATE_KEY",
  "0x0000000000000000000000000000000000000000000000000000000000000000"
);
const BASE_API_KEY = vars.get("BASE_API_KEY", "");

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
    customChains: [
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
    ],
  },
};

export default config;
