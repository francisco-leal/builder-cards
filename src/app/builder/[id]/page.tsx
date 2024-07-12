import { getPassportById } from "@/external/talent_passport";
import { Box } from "@mui/joy";
import { Activity, BuilderCard, BuilderDetails } from "@/components";

export default async function BuilderPage({
  params,
}: {
  params: { id: string };
}) {
  const { passport } = await getPassportById(params.id);
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
          bio={passport.passport_profile.bio}
        />
      </Box>
      <Activity />
    </>
  );
}
