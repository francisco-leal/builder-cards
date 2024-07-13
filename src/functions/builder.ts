"use server";
import { supabase } from "@/db";
import { unstable_cache } from "next/cache";
import { CACHE_24_HOURS } from "@/constants";
import { addressToId } from "./onchain";

export const getBuilderCard = async (id: `0x${string}`) => {
  try {
    const tokenId = await addressToId(id);

    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("token_id", tokenId)
      .single()
      .throwOnError();

    if (error) {
      return { card: null };
    } else {
      return { card: data };
    }
  } catch (error) {
    console.error(error);
    return { card: null };
  }
};
