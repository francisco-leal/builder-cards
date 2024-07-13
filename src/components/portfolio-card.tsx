"use client";
import { Button, Box, Chip, Typography, Avatar } from "@mui/joy";
import { useRouter } from "next/navigation";

export const PortfolioCard = ({
  image,
  name,
  displayName,
  score,
  collectedCount,
  mutual,
  tokenId,
}: {
  image: string;
  name: string;
  displayName: string;
  score: number;
  collectedCount: number;
  mutual: boolean;
  tokenId: number;
}) => {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push(`/builder/${tokenId}`)}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRight: { xs: "0px", lg: "1px solid rgba(99, 107, 116, 0.2)" },
        borderLeft: { xs: "0px", lg: "1px solid rgba(99, 107, 116, 0.2)" },
        borderTop: { xs: "0px", lg: "1px solid rgba(99, 107, 116, 0.2)" },
        borderBottom: "1px solid rgba(99, 107, 116, 0.2)",
        position: "relative",
        width: { xs: "180px", lg: "auto" },
        borderRadius: "12px",
        backgroundColor: "white",
        paddingTop: { xs: 2, lg: 4 },
        paddingBottom: { xs: 4, lg: 6 },
      }}
      variant="plain"
    >
      <Avatar
        src={image}
        alt={`${name}-image`}
        sx={{ width: 100, height: 100, borderRadius: "22px" }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography level="body-lg" sx={{ marginTop: "12px" }}>
          {displayName}
        </Typography>
        <Typography level="body-sm">Builder Score: {score}</Typography>
      </Box>
      {mutual && (
        <Chip
          size="sm"
          variant="solid"
          color="neutral"
          sx={{
            position: "absolute",
            bottom: "8px",
            left: "8px",
          }}
        >
          Mutual
        </Chip>
      )}
      <Chip
        size="sm"
        variant="solid"
        color="neutral"
        sx={{
          position: "absolute",
          bottom: "8px",
          right: "8px",
        }}
      >
        x{collectedCount}
      </Chip>
    </Button>
  );
};
