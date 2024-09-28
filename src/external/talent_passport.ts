"use server";
import { unstable_cache } from "next/cache";
import { CACHE_24_HOURS } from "@/constants";

const TALENT_PROTOCOL_KEY = process.env.TALENT_PROTOCOL_KEY || "";
const TALENT_PASSPORT_URL = process.env.TALENT_PASSPORT_API_URL || "";

export type TalentPassport = {
  score: number;
  connections_score: number;
  credentials_score: number;
  credibility_score: number;
  main_wallet: `0x${string}`;
  passport_id: number;
  verified: boolean;
  passport_profile: {
    display_name: string;
    image_url: string;
    bio: string;
    name: string;
  };
};

type TalentPassportResponse = {
  passports: TalentPassport[];
  pagination: { current_page: number; last_page: number; total: number };
};

export const searchPassports = async (
  query: string,
  currentPage: number
): Promise<TalentPassportResponse> => {
  return unstable_cache(
    async (query: string, currentPage: number) => {
      try {
        console.debug("Will call fetch to get passports");

        const request = await fetch(
          `${TALENT_PASSPORT_URL}/passports?keyword=${query}&page=${currentPage}`,
          {
            method: "GET",
            headers: {
              "X-API-KEY": TALENT_PROTOCOL_KEY,
            },
          }
        );

        console.debug("After fetch call to get passports");

        return await request.json();
      } catch (e) {
        console.log(e);
        return [];
      }
    },
    [`search_${query}_${currentPage}`],
    { revalidate: CACHE_24_HOURS }
  )(query, currentPage);
};

export const getPassportById = async (
  id: string
): Promise<{ passport: TalentPassport }> => {
  return unstable_cache(
    async (id: string) => {
      try {
        const request = await fetch(`${TALENT_PASSPORT_URL}/passports/${id}`, {
          method: "GET",
          headers: {
            "X-API-KEY": TALENT_PROTOCOL_KEY,
          },
        });
        return await request.json();
      } catch (e) {
        console.log(e);
        return [];
      }
    },
    [`user_${id}`],
    { revalidate: CACHE_24_HOURS }
  )(id);
};
