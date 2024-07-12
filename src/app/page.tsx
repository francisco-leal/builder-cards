import { Box, Typography } from "@mui/joy";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

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
        gap: 2,
      }}
    >
      <Typography level="h1">Builder Cards</Typography>
      <Typography level="body-lg">Collect your favorite builders</Typography>
      <DynamicWidget />
    </Box>
  );
}
