"use server";
import { supabase } from "@/db";
import { unstable_cache } from "next/cache";
import { CACHE_24_HOURS } from "@/constants";

export const getBuilderCard = async (id: string) => {
  return unstable_cache(
    async (id: string) => {
      try {
        const { data, error } = await supabase
          .from("cards")
          .select("*")
          .eq("tokenId", id)
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
    },
    [`cards_${id}`],
    { revalidate: CACHE_24_HOURS }
  )(id);
};
