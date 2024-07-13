import type { NextRequest } from "next/server";
import { createPublicClient, http, parseAbiItem } from "viem";
import { baseSepolia } from "viem/chains";
import { supabase } from "@/db";
import { revalidateTag } from "next/cache";

type RequestBody = {
  hash: `0x${string}`;
};

const baseRPC = process.env.BASE_RPC as string;
const contractAddress = process.env
  .NEXT_PUBLIC_BUILDER_CARD_CONTRACT as `0x${string}`;

export async function POST(request: NextRequest) {
  const { hash } = (await request.json()) as RequestBody;

  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(baseRPC),
  });

  const transaction = await client.getTransaction({ hash });

  const logs = await client.getLogs({
    address: contractAddress,
    event: parseAbiItem(
      "event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)"
    ),
    blockHash: transaction.blockHash,
  });

  for (const log of logs) {
    const { to, id } = log.args;

    if (!to || !id) {
      continue;
    }

    // insert into cards
    await supabase.from("cards").upsert(
      {
        hash: transaction.hash,
        token_id: parseInt(id?.toString()),
      },
      {
        onConflict: "tokenId",
      }
    );

    // insert into collects
    await supabase.from("collects").upsert(
      {
        collector: to,
        hash: transaction.hash,
        token_id: parseInt(id?.toString()),
      },
      {
        onConflict: "hash",
      }
    );

    revalidateTag(`activities_${id}`);

    // create supabase rpc call to update the number of holders && totalSupply of the card or use onchain data?
    await supabase.rpc("update_card_stats");
    revalidateTag(`cards_${id}`);
  }

  return Response.json(
    {
      message: "OK",
    },
    { status: 200 }
  );
}
