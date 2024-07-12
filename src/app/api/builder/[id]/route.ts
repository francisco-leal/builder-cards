import type { NextRequest } from "next/server";
import { getPassportById } from "@/external/talent_passport";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { passport } = await getPassportById(id);

  return Response.json(
    {
      name: passport.passport_profile.name,
      description: passport.passport_profile.bio,
      image: passport.passport_profile.image_url,
      builder_score: passport.score,
    },
    { status: 200 }
  );
}
