import { getPassportById } from "@/external/talent_passport";
import { Box, Avatar, Typography, Divider } from "@mui/joy";
import { PortfolioCard } from "@/components";

export default async function PortfolioPage({
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
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar
          src={passport.passport_profile.image_url}
          sx={{ width: "100px", height: "100px" }}
        />
        <Typography level="h3" textAlign={"center"}>
          {passport.passport_profile.display_name}
        </Typography>
        <Typography level="body-md" textAlign={"center"}>
          {passport.passport_profile.bio}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Typography level="body-md" textAlign={"center"} fontWeight={"bold"}>
            My collection
          </Typography>
          <Typography
            level="body-md"
            textAlign={"center"}
            sx={{ marginRight: "8px" }}
          >
            121
          </Typography>
          <Typography
            level="body-md"
            textAlign={"center"}
            fontWeight={"bold"}
            sx={{ marginLeft: "8px" }}
          >
            Collectors
          </Typography>
          <Typography level="body-md" textAlign={"center"}>
            78
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reverse().map((i) => (
          <PortfolioCard
            key={`${i}-portfolio-card`}
            name={passport.passport_profile.name}
            image={passport.passport_profile.image_url}
            displayName={passport.passport_profile.display_name}
            score={passport.score}
            collectedCount={i}
            mutual={i % 2 === 0}
          />
        ))}
      </Box>
    </>
  );
}
