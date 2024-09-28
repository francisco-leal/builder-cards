"use server";
import { supabase } from "@/db";
import { Database } from "@/db/database.types";
import { IsAddressEqualReturnType } from "viem";

type Tables = Database["public"]["Tables"];
export type Collectors = Tables["collectors"]["Row"];

export const getTopCollectors = async (address: `0x${string}`) => {
  const { data, error } = await supabase
    .from("collectors")
    .select("*")
    .like("address", address.toLowerCase())
    .order("balance", { ascending: false })
    .limit(3);

  if (error) {
    console.log(error);
    return { collectors: [] };
  } else {
    return { collectors: data };
  }
};
