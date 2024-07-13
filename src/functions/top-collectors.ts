"use server";
import { supabase } from "@/db";
import { addressToId } from "./onchain";
import { Database } from "@/db/database.types";

type Tables = Database["public"]["Tables"];
export type Collectors = Tables["collectors"]["Row"];

export const getTopCollectors = async (id: `0x${string}`) => {
  const tokenId = await addressToId(id);

  const { data, error } = await supabase
    .from("collectors")
    .select("*")
    .eq("token_id", tokenId)
    .order("balance", { ascending: false })
    .limit(3);

  if (error) {
    console.log(error);
    return { collectors: [] };
  } else {
    return { collectors: data };
  }
};
