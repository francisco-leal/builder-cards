import type { NextRequest } from "next/server";
import { createPublicClient, http, parseAbiItem } from "viem";
import { baseSepolia } from "viem/chains";
import { supabase } from "@/db";
import { revalidateTag, revalidatePath } from "next/cache";
import { BUILDER_CARD_CONTRACT } from "@/constants";

type RequestBody = {
  hash: `0x${string}`;
  wallet: `0x${string}`;
};

export async function POST(request: NextRequest) {
  const { hash, wallet } = (await request.json()) as RequestBody;

  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  const transaction = await client.getTransaction({ hash });

  const logs = await client.getLogs({
    address: BUILDER_CARD_CONTRACT,
    event: parseAbiItem(
      "event CardCollected(address indexed _builder,address indexed _collector)"
    ),
    blockHash: transaction.blockHash,
  });

  for (const log of logs) {
    console.debug("log", log);

    const { _builder, _collector } = log.args;

    if (!_builder || !_collector) {
      continue;
    }

    // insert into cards
    const { error } = await supabase.from("cards").insert({
      hash: transaction.hash.toLowerCase(),
      address: _builder.toLowerCase(),
    });

    if (error) {
      console.error(error);
    }

    // insert into collects
    await supabase.from("collects").insert({
      collector: _collector.toLowerCase(),
      hash: transaction.hash.toLowerCase(),
      address: _builder.toLowerCase(),
    });

    // insert into collectors
    await supabase.from("collectors").insert({
      balance: 1,
      collector: _collector.toLowerCase(),
      address: _builder.toLowerCase(),
    });

    revalidateTag(`activities_${_builder}`);

    // create supabase rpc call to update the number of holders && totalSupply of the card or use onchain data?
    // await supabase.rpc("update_all_stats");

    revalidateTag(`cards_${_builder}`);

    revalidatePath(`/builder/${wallet}`);
  }

  return Response.json(
    {
      message: "OK",
    },
    { status: 200 }
  );
}
