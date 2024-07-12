import { Box, Typography } from "@mui/joy";

export const BuilderCard = ({
  image,
  name,
  displayName,
  score,
}: {
  image: string;
  name: string;
  displayName: string;
  score: number;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRight: { xs: "0px", lg: "1px solid black" },
        borderLeft: { xs: "0px", lg: "1px solid black" },
        borderTop: "1px solid black",
        borderBottom: "1px solid black",
        padding: { xs: 1, lg: 3 },
        paddingBottom: { xs: 3, lg: 5 },
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
    </Box>
  );
};
