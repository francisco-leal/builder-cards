import { Box, Typography, AspectRatio } from "@mui/joy";

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
        padding: { xs: 2, lg: 4 },
        borderRadius: "22px",
        border: "2px solid #454547",
        background: "#FFF",
      }}
    >
      <AspectRatio ratio="1/1" sx={{ borderRadius: "22px", width: "300px" }}>
        <img src={image} alt={`${name}-image`} width={300} height={300} />
      </AspectRatio>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography level="h3" sx={{ marginTop: "16px" }}>
          {displayName}
        </Typography>
        <Typography level="body-md">Builder Score: {score}</Typography>
      </Box>
    </Box>
  );
};
