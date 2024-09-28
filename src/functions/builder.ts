"use server";
import { supabase } from "@/db";
import { unstable_cache } from "next/cache";
import { CACHE_24_HOURS } from "@/constants";

export const getBuilderCard = async (address: `0x${string}`) => {
  try {
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("address", address)
      .single()
      .throwOnError();

    if (error) {
      console.error("Error when selecting from 'cards'", error);

      return { card: null };
    } else {
      return { card: data };
    }
  } catch (error) {
    console.error(error);
    return { card: null };
  }
};
