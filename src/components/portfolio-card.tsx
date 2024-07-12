import { Box, Chip, Typography } from "@mui/joy";

export const PortfolioCard = ({
  image,
  name,
  displayName,
  score,
  collectedCount,
  mutual,
}: {
  image: string;
  name: string;
  displayName: string;
  score: number;
  collectedCount: number;
  mutual: boolean;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRight: { xs: "0px", lg: "1px solid rgba(99, 107, 116, 0.2)" },
        borderLeft: { xs: "0px", lg: "1px solid rgba(99, 107, 116, 0.2)" },
        borderTop: { xs: "0px", lg: "1px solid rgba(99, 107, 116, 0.2)" },
        borderBottom: "1px solid rgba(99, 107, 116, 0.2)",
        padding: { xs: 1, lg: 3 },
        paddingBottom: { xs: 3, lg: 5 },
        position: "relative",
        width: { xs: "100%", lg: "auto" },
        borderRadius: { xs: 0, lg: "8px" },
      }}
    >
      <img src={image} alt={`${name}-image`} width={300} height={300} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography level="h3" sx={{ marginTop: "24px" }}>
          {displayName}
        </Typography>
        <Typography level="body-md">Builder Score: {score}</Typography>
      </Box>
      {mutual && (
        <Chip
          size="sm"
          variant="solid"
          sx={{
            backgroundColor: "black",
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
        sx={{
          backgroundColor: "black",
          position: "absolute",
          bottom: "8px",
          right: "8px",
        }}
      >
        x{collectedCount}
      </Chip>
    </Box>
  );
};
