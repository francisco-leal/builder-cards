import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const URI = "https://builder.card/api/builder";

// npx hardhat ignition deploy ./ignition/modules/BuilderCard.ts --network baseSepolia --deployment-id base-sepolia-deployment-01

const BuilderCardModule = buildModule("BuilderCard", (m) => {
  const builderCard = m.contract("BuilderCard", [URI]);

  return { builderCard };
});

export default BuilderCardModule;
