import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const URI = "https://builder.card/api/builder";
const PLATFORM_WALLET_ADDRESS = "0xec4a93E2e955d97F0bE36e3E3533259629EaE7cA";

// npx hardhat ignition deploy ./ignition/modules/BuilderCard.ts --network baseSepolia --deployment-id base-sepolia-deployment-02

const BuilderCardModule = buildModule("BuilderCard", (m) => {
  const builderCard = m.contract("BuilderCard", [URI, PLATFORM_WALLET_ADDRESS]);

  return { builderCard };
});

export default BuilderCardModule;
