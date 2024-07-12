import { Box, Avatar, Skeleton, Typography, Link } from "@mui/joy";

export const Activity = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        paddingX: 2,
        marginBottom: 3,
        alignSelf: "start",
      }}
    >
      <Typography level="h3" textAlign={"center"}>
        Activity
      </Typography>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <Box
          key={`${i}-activity`}
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
              <Skeleton loading={true}>
                leal.eth but its a really long text because why
              </Skeleton>
            </Typography>
            <Typography>
              <Skeleton loading={true}>
                leal.eth but its a really long text because why
              </Skeleton>
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
