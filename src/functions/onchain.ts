"use server";
import { createPublicClient, http, parseAbiItem, getContract } from "viem";
import { baseSepolia } from "viem/chains";
import BuilderCardABI from "@/lib/abi/BuilderCard.json";

const baseRPC = process.env.BASE_RPC as string;
const contractAddress = process.env
  .NEXT_PUBLIC_BUILDER_CARD_CONTRACT as `0x${string}`;

export const addressToId = async (address: `0x${string}`) => {
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(baseRPC),
  });

  const contract = getContract({
    address: contractAddress,
    abi: BuilderCardABI,
    client,
  });

  const id = await contract.read.builderIds([address]);

  return Number(id);
};
