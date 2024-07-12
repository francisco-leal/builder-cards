"use server";
import { Box, Skeleton } from "@mui/joy";
import { searchPassports } from "@/external/talent_passport";
import { BuilderListItem } from "@/components/builder-list-item";

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
        <Box key={i} sx={{ width: "100%", marginBottom: 2 }}>
          <Skeleton loading={true} variant="rectangular" sx={{ width: "100%" }}>
            A big display name maybe?
          </Skeleton>
        </Box>
      ))}
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
  const { passports } = await searchPassports(query, currentPage);

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
    </Box>
  );
};
