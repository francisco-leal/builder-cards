import { Link, Box, Avatar, Typography, Chip } from "@mui/joy";
import { TalentPassport } from "@/external/talent_passport";
import { Verified } from "@mui/icons-material";

export const BuilderListItem = ({ builder }: { builder: TalentPassport }) => {
  const realName =
    builder.passport_profile.display_name || builder.passport_profile.name;
  return (
    <Box
      component={Link}
      href={`/builder/${builder.main_wallet}`}
      sx={{
        display: "flex",
        gap: 2,
        width: "100%",
        alignItems: "center",
        position: "relative",
        borderRadius: "50px",
        "&:hover": {
          backgroundColor: "#f5f5f5",
        },
      }}
      underline="none"
    >
      <Avatar
        variant="outlined"
        src={builder.passport_profile.image_url}
        alt={realName}
        sx={{
          borderWidth: "3px",
          borderColor: "black",
          width: "54px",
          height: "54px",
        }}
      />
      <Chip
        variant="solid"
        size="sm"
        sx={{
          position: "absolute",
          bottom: "-8px",
          left: "8px",
          backgroundColor: "black",
        }}
      >
        {builder.score}
      </Chip>
      <Box sx={{ display: "flex", flexDirection: "column", paddingY: 1 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Typography level="body-md" sx={{ textDecoration: "none" }}>
            {realName}
          </Typography>
          <Verified htmlColor="black" />
        </Box>
        <Typography level="body-sm" sx={{ textDecoration: "none" }}>
          Talent Passport #{builder.passport_id}
        </Typography>
      </Box>
    </Box>
  );
};
