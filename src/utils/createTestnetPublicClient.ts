import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

const createTestnetPublicClient = () =>
  createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

export default createTestnetPublicClient;
