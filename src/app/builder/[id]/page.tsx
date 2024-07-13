import { getPassportById } from "@/external/talent_passport";
import { Box } from "@mui/joy";
import { Activity, BuilderCard, BuilderDetails } from "@/components";
import { getBuilderActivities } from "@/functions/activity";
import { getBuilderCard } from "@/functions/builder";

export default async function BuilderPage({
  params,
}: {
  params: { id: string };
}) {
  const { passport } = await getPassportById(params.id);
  const { activities } = await getBuilderActivities(params.id);
  const { card } = await getBuilderCard(params.id);

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
          totalSupply={card?.total_supply}
        />
      </Box>
      <Activity activities={activities} />
    </>
  );
}
