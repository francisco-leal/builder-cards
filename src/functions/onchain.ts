"use server";
import { createPublicClient, http, parseAbiItem, getContract } from "viem";
import { baseSepolia } from "viem/chains";
import BuilderCardABI from "@/lib/abi/BuilderCard.json";
import { Bluetooth } from "@mui/icons-material";
import { BUILDER_CARD_CONTRACT } from "@/constants";

export const balanceFor = async (address: `0x${string}`) => {
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  const contract = getContract({
    address: BUILDER_CARD_CONTRACT,
    abi: BuilderCardABI,
    client,
  });

  const balance: bigint = (await client.readContract({
    address: BUILDER_CARD_CONTRACT,
    abi: BuilderCardABI,
    functionName: "balanceFor",
    args: [address],
  })) as bigint;

  console.debug(`balanceFor(${address}) = ${balance.toString()}`);

  return Number(balance);
};
