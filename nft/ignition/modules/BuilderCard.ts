import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { BuilderCard } from "../../typechain-types/contracts/BuilderCard";
import { ethers } from "hardhat";

const URI = "https://builder.card/api/builder/{id}.json";

const PLATFORM_WALLET_ADDRESS = "0xec4a93E2e955d97F0bE36e3E3533259629EaE7cA";

const COLLECTION_FEE_IN_WEI = ethers.parseEther("0.001");
const BUILDER_REWARD_IN_WEI = ethers.parseEther("0.0005");
const FIRST_COLLECTOR_REWARD_IN_WEI = ethers.parseEther("0.0003");

// npx hardhat ignition deploy ./ignition/modules/BuilderCard.ts --network baseSepolia --deployment-id base-sepolia-deployment-02

const BuilderCardModule = buildModule("BuilderCard", (m) => {
  const chargingPolicy: BuilderCard.ChargingPolicyStruct = {
    collectionFee: COLLECTION_FEE_IN_WEI,
    builderReward: BUILDER_REWARD_IN_WEI,
    firstCollectorReward: FIRST_COLLECTOR_REWARD_IN_WEI,
  };

  const builderCard = m.contract("BuilderCard", [
    URI,
    chargingPolicy,
    PLATFORM_WALLET_ADDRESS,
  ]);

  return { builderCard };
});

export default BuilderCardModule;
