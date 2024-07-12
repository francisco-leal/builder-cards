import { Box, Button, Chip, Divider, Typography } from "@mui/joy";

export const BuilderDetails = ({
  displayName,
  bio,
}: {
  displayName: string;
  bio: string;
}) => {
  return (
    <Box
      sx={{
        maxWidth: { xs: "100%", lg: "300px" },
        padding: 3,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Typography level="h3">{displayName}</Typography>
      <Typography level="body-md">{bio}</Typography>
      <Divider />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography level="body-sm">Top collector</Typography>
        <Typography
          level="body-sm"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
          textColor="common.black"
          fontWeight="bold"
        >
          leal.eth{" "}
          <Chip size="sm" variant="solid" sx={{ backgroundColor: "black" }}>
            x10
          </Chip>
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography level="body-sm">First collector</Typography>
        <Typography level="body-sm" textColor="common.black" fontWeight="bold">
          leal.eth
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography level="body-sm">Builder earnings</Typography>
        <Typography level="body-sm" textColor="common.black" fontWeight="bold">
          0.33 ETH
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography level="body-sm">Unique collectors</Typography>
        <Typography level="body-sm" textColor="common.black" fontWeight="bold">
          13
        </Typography>
      </Box>
      <Divider />
      <Button sx={{ width: "100%", backgroundColor: "black" }}>Collect</Button>
      <Typography level="body-sm" textColor="common.black" textAlign={"center"}>
        791 collects
      </Typography>
    </Box>
  );
};
