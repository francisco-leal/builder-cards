"use server";
import { getContract } from "viem";
import BuilderCardABI from "@/lib/abi/BuilderCard.json";
import { BUILDER_CARD_CONTRACT } from "@/constants";
import createTestnetPublicClient from "@/utils/createTestnetPublicClient";

export const balanceFor = async (address: `0x${string}`) => {
  const client = createTestnetPublicClient();

  const balance: bigint = (await client.readContract({
    address: BUILDER_CARD_CONTRACT,
    abi: BuilderCardABI,
    functionName: "balanceFor",
    args: [address],
  })) as bigint;

  console.debug(`balanceFor(${address}) = ${balance.toString()}`);

  return Number(balance);
};

export const balanceOfCollectorForBuilder = async (
  collector: `0x${string}`,
  builder: `0x${string}`
) => {
  const client = createTestnetPublicClient();

  const balance: bigint = (await client.readContract({
    address: BUILDER_CARD_CONTRACT,
    abi: BuilderCardABI,
    functionName: "balanceOf",
    args: [collector, builder],
  })) as bigint;

  return Number(balance);
};
