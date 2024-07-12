import { Box, Typography, Button } from "@mui/joy";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import Link from "next/link";

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
      <Button
        component={Link}
        href="/"
        variant="plain"
        sx={{ marginLeft: "32px" }}
      >
        <Typography level="h3">Builder Cards</Typography>
      </Button>
      <Box sx={{ marginRight: "32px" }}>
        <DynamicWidget />
      </Box>
    </Box>
  );
}
