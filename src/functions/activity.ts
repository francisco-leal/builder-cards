"use server";
import { supabase } from "@/db";
import { Database } from "@/db/database.types";
import { unstable_cache } from "next/cache";
import { CACHE_24_HOURS } from "@/constants";

type Tables = Database["public"]["Tables"];

export type Collects = Tables["collects"]["Row"];

// Who has collected a specific BuilderCard and when
//
export const getBuilderActivities = async (address: `0x${string}`) => {
  try {
    // TODO: Need to improve. This query has a problem if we have too many collects for a given address
    console.debug(`address=*${address}*`);

    const addressToSearchFor = address.toLowerCase();

    console.debug(`Address to search For=*${addressToSearchFor}*`);

    const { data, error } = await supabase
      .from("collects")
      .select("*")
      .ilike("address", addressToSearchFor)
      .order("created_at", { ascending: false })
      .throwOnError();

    if (error) {
      console.error("Error getting 'collects'", error);
      return { activities: [] };
    } else {
      console.debug("'collects' data", data);
      return { activities: data };
    }
  } catch (error) {
    console.error(error);
    return { activities: [] };
  }
};
