import { Box, Avatar, Skeleton, Typography, Link } from "@mui/joy";
import { Collects } from "@/functions/activity";
import { BLOCKSCOUT_URL } from "@/constants";
import { DateTime } from "luxon";
import { OpenInNew } from "@mui/icons-material";

export const Activity = ({ activities }: { activities: Collects[] }) => {
  const dateToDifferenceFromNow = (date: string) => {
    return DateTime.fromISO(date).toRelative();
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (activities.length === 0) {
    return <Box marginBottom={"100px"}></Box>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        paddingX: 2,
        alignSelf: { xs: "start", lg: "center" },
        marginBottom: "100px",
        width: "calc(100% - 32px)",
      }}
    >
      <Typography level="h3" textAlign={"center"}>
        Activity
      </Typography>
      {activities.map((i) => (
        <Box
          key={`${i.id}-activity`}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Avatar
            src={""}
            sx={{
              borderWidth: "3px",
              borderColor: "black",
              width: "32px",
              height: "32px",
            }}
          >
            <Skeleton loading={true} />
          </Avatar>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography>
              <Skeleton loading={!i.collector}>
                {shortenAddress(i.collector)}
              </Skeleton>
            </Typography>
            <Link href={`${BLOCKSCOUT_URL}tx/${i.hash}`} target="_blank">
              <Typography
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Skeleton loading={!i.hash}>
                  {dateToDifferenceFromNow(i.created_at)} <OpenInNew />
                </Skeleton>
              </Typography>
            </Link>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
