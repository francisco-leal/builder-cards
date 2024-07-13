"use server";
import { supabase } from "@/db";
import { Database } from "@/db/database.types";
import { unstable_cache } from "next/cache";
import { CACHE_24_HOURS } from "@/constants";
import { addressToId } from "./onchain";

type Tables = Database["public"]["Tables"];

export type Collects = Tables["collects"]["Row"];

export const getBuilderActivities = async (id: `0x${string}`) => {
  return unstable_cache(
    async (id: `0x${string}`) => {
      try {
        // Get the token ID of this wallet
        const tokenId = await addressToId(id);

        const { data, error } = await supabase
          .from("collects")
          .select("*")
          .eq("token_id", tokenId)
          .throwOnError();

        if (error) {
          return { activities: [] };
        } else {
          return { activities: data };
        }
      } catch (error) {
        console.error(error);
        return { activities: [] };
      }
    },
    [`activities_${id}`],
    { revalidate: CACHE_24_HOURS }
  )(id);
};
