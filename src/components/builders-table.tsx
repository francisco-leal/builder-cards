"use server";
import { Box, Skeleton, Avatar, Button } from "@mui/joy";
import { searchPassports } from "@/external/talent_passport";
import { BuilderListItem } from "@/components/builder-list-item";
import { Pagination } from "@/components/pagination";

export const BuildersTableSkeleton = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "485px",
        width: "100%",
      }}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <Box
          key={i}
          sx={{
            width: "100%",
            marginBottom: 2,
            height: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 2,
          }}
        >
          <Avatar
            src={""}
            sx={{
              borderWidth: "3px",
              borderColor: "black",
              width: "62px",
              height: "62px",
            }}
          >
            <Skeleton loading={true} />
          </Avatar>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: "100%",
            }}
          >
            <Skeleton
              loading={true}
              variant="rectangular"
              sx={{ width: "100%", height: "100%" }}
            >
              A big display name maybe?
            </Skeleton>
            <Skeleton
              loading={true}
              variant="rectangular"
              sx={{ width: "100%", height: "100%" }}
            >
              A big display name maybe?
            </Skeleton>
          </Box>
        </Box>
      ))}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Button variant="outlined" color="neutral" disabled={true}>
          <Skeleton
            animation="wave"
            variant="text"
            level="body-sm"
            sx={{ width: "100px" }}
          />
        </Button>
        <Button variant="outlined" color="neutral" disabled={true}>
          <Skeleton
            animation="wave"
            variant="text"
            level="body-sm"
            sx={{ width: "100px" }}
          />
        </Button>
      </Box>
    </Box>
  );
};

export const BuildersTable = async ({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) => {
  const { passports, pagination } = await searchPassports(query, currentPage);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "485px",
      }}
    >
      {passports.map((builder) => (
        <Box key={builder.passport_id} sx={{ width: "100%", marginBottom: 2 }}>
          <BuilderListItem builder={builder} />
        </Box>
      ))}
      <Pagination count={pagination.total} />
    </Box>
  );
};
