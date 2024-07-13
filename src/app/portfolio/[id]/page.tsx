import { getPassportById } from "@/external/talent_passport";
import { Box, Avatar, Typography, Divider, Button, Chip } from "@mui/joy";
import { PortfolioCard } from "@/components";
import { OpenInNew } from "@mui/icons-material";

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
          sx={{ width: "100px", height: "100px", borderRadius: "24px" }}
        />
        <Typography level="h3" textAlign={"center"} fontWeight={500}>
          {passport.passport_profile.display_name}
        </Typography>
        <Typography level="body-md" textAlign={"center"}>
          {passport.passport_profile.bio}
        </Typography>
        <Button
          variant="outlined"
          color="neutral"
          component="a"
          sx={{ borderRadius: "24px" }}
          href={`https://passport.talentprotocol.com/profile/${params.id}`}
          target="_blank"
          endDecorator={<OpenInNew />}
        >
          View Profile
        </Button>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "8px 10px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              padding: "8px 10px",
              backgroundColor: "black",
              borderRadius: "8px",
              gap: 1,
            }}
          >
            <Typography
              level="body-sm"
              textAlign={"center"}
              fontWeight={"bold"}
              textColor="common.white"
            >
              Owned
            </Typography>
            <Chip
              variant="solid"
              size="sm"
              color="neutral"
              sx={{ backgroundColor: "white", color: "black" }}
            >
              32
            </Chip>
          </Box>
          <Divider orientation="vertical" />
          <Typography
            level="body-sm"
            textAlign={"center"}
            fontWeight={"bold"}
            textColor="common.black"
          >
            Collectors
          </Typography>
          <Chip variant="solid" size="sm" color="neutral">
            76
          </Chip>
          <Divider orientation="vertical" />
          <Typography
            level="body-sm"
            textAlign={"center"}
            fontWeight={"bold"}
            textColor="common.black"
          >
            Mutuals
          </Typography>
          <Chip variant="solid" size="sm" color="neutral">
            12
          </Chip>
        </Box>
      </Box>
      <Typography
        level="body-lg"
        sx={{ marginRight: "auto" }}
        textColor={"common.black"}
      >
        Cards Owned
      </Typography>
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
            tokenId={passport.passport_id}
            collectedCount={i}
            mutual={i % 2 === 0}
          />
        ))}
      </Box>
    </>
  );
}
