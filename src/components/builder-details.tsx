import {
  Box,
  Button,
  Chip,
  Divider,
  Typography,
  AspectRatio,
  Avatar,
} from "@mui/joy";
import { Share, ShowChart, MoreVert, LocalActivity } from "@mui/icons-material";

export const BuilderDetails = ({
  displayName,
  bio,
  image,
}: {
  displayName: string;
  bio: string;
  image: string;
}) => {
  return (
    <Box
      sx={{
        maxWidth: { xs: "100%", lg: "300px" },
        display: "flex",
        flexDirection: "column",
        gap: 1,
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            padding: "5.644px 11.944px 5.644px 6.885px",
            backgroundColor: "white",
            borderRadius: "16px",
            alignItems: "center",
          }}
        >
          <AspectRatio
            ratio="1/1"
            sx={{ width: 40, height: 40, borderRadius: "10px" }}
          >
            <img src={image} width={40} height={40} />
          </AspectRatio>
          <Typography level="body-md" sx={{ marginLeft: 2 }}>
            {displayName}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            padding: "-5.644px -11.944px -5.644px -6.885px",
          }}
        >
          <Button
            variant="outlined"
            color="neutral"
            size="sm"
            sx={{ padding: "0.75rem", background: "white" }}
          >
            <Share />
          </Button>
          <Button
            variant="outlined"
            color="neutral"
            size="sm"
            sx={{ padding: "0.75rem", background: "white" }}
          >
            <ShowChart />
          </Button>
          <Button
            variant="outlined"
            color="neutral"
            size="sm"
            sx={{ padding: "0.75rem", background: "white" }}
          >
            <MoreVert />
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", border: "0px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            paddingY: "12px",
            paddingX: "16px",
            backgroundColor: "black",
            borderTopRightRadius: "16px",
            borderTopLeftRadius: "16px",
            background: "black",
          }}
        >
          <Typography level="body-md" textColor="common.white">
            Top Collectors
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            paddingY: "12px",
            paddingX: "16px",
            borderBottom: "1px solid rgba(0, 0, 0, 0.19)",
            alignItems: "center",
            background: "white",
          }}
        >
          <Avatar src={image} sx={{ width: "38", height: "38" }} />
          <Typography level="body-md" sx={{ marginLeft: 2 }}>
            {displayName}
          </Typography>
          <Chip
            variant="solid"
            color="neutral"
            size="sm"
            sx={{ marginLeft: "auto", paddingY: "4px" }}
          >
            x8
          </Chip>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            paddingY: "12px",
            paddingX: "16px",
            borderBottom: "1px solid rgba(0, 0, 0, 0.19)",
            alignItems: "center",
            background: "white",
          }}
        >
          <Avatar src={image} sx={{ width: "38", height: "38" }} />
          <Typography level="body-md" sx={{ marginLeft: 2 }}>
            {displayName}
          </Typography>
          <Chip
            variant="solid"
            color="neutral"
            size="sm"
            sx={{ marginLeft: "auto", paddingY: "4px" }}
          >
            x8
          </Chip>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            paddingY: "12px",
            paddingX: "16px",
            borderBottom: "1px solid rgba(0, 0, 0, 0.19)",
            alignItems: "center",
            background: "white",
            borderBottomLeftRadius: "16px",
            borderBottomRightRadius: "16px",
          }}
        >
          <Avatar src={image} sx={{ width: "38", height: "38" }} />
          <Typography level="body-md" sx={{ marginLeft: 2 }}>
            {displayName}
          </Typography>
          <Chip
            variant="solid"
            color="neutral"
            size="sm"
            sx={{ marginLeft: "auto", paddingY: "4px" }}
          >
            x8
          </Chip>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "calc(100% - 32px)",
          backgroundColor: "#F0EFF7",
          padding: "16px",
          zIndex: 10,
        }}
      >
        <Typography
          level="body-sm"
          textColor="common.black"
          textAlign={"center"}
        >
          x72 collected
        </Typography>
        <Button
          size="lg"
          sx={{ width: "100%", backgroundColor: "black" }}
          startDecorator={<LocalActivity />}
        >
          Collect
        </Button>
      </Box>
    </Box>
  );
};
