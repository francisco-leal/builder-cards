import { Box, Typography } from "@mui/joy";

export default function Home() {
  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 3,
        backgroundColor: "background.default",
      }}
    >
      <Typography level="h1" sx={{ marginBottom: 2 }}>
        Builder Cards
      </Typography>
      <Typography level="body-lg">Collect your favorite builders</Typography>
    </Box>
  );
}
