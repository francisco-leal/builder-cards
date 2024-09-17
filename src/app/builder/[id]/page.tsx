import { getPassportById } from "@/external/talent_passport";
import { Box } from "@mui/joy";
import { Activity, BuilderCard, BuilderDetails } from "@/components";
import { getBuilderActivities } from "@/functions/activity";
import { getBuilderCard } from "@/functions/builder";
import { getTopCollectors } from "@/functions/top-collectors";
import { balanceFor } from "@/functions/onchain";

export default async function BuilderPage({
  params,
}: {
  params: { id: `0x${string}` };
}) {
  const { passport } = await getPassportById(params.id);
  const { activities } = await getBuilderActivities(params.id);
  const { card } = await getBuilderCard(params.id);
  const { collectors } = await getTopCollectors(params.id);
  const totalSupply = await balanceFor(params.id);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 2,
        }}
      >
        <BuilderCard
          name={passport.passport_profile.name}
          image={passport.passport_profile.image_url}
          displayName={passport.passport_profile.display_name}
          score={passport.score}
        />
        <BuilderDetails
          displayName={passport.passport_profile.display_name}
          image={passport.passport_profile.image_url}
          tokenId={passport.passport_id}
          totalSupply={totalSupply}
          wallet={passport.main_wallet}
          collectors={collectors}
        />
      </Box>
      <Activity activities={activities} />
    </>
  );
}
