import { Box, Typography } from "@mui/joy";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

export function Header() {
  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginY: "16px",
        width: "100%",
      }}
    >
      <Typography level="h3" sx={{ marginLeft: "32px" }}>
        Builder Cards
      </Typography>
      <Box sx={{ marginRight: "32px" }}>
        <DynamicWidget />
      </Box>
    </Box>
  );
}
