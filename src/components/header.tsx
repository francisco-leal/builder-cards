"use client";
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
        sx={{ display: "flex", flexDirection: "row", padding: 0 }}
      >
        <Typography level="h3" fontWeight={"600"}>
          Builder
        </Typography>
        <Typography level="h3" fontWeight={"200"}>
          .Cards
        </Typography>
      </Button>
      <DynamicWidget />
    </Box>
  );
}
