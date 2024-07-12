import { Suspense } from "react";
import { Box, Typography } from "@mui/joy";
import {
  Header,
  SearchBar,
  BuildersTable,
  BuildersTableSkeleton,
} from "@/components";

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        minWidth: "100vw",
        backgroundColor: "background.default",
        gap: 2,
      }}
    >
      <Header />
      <Typography fontWeight={"bold"} level="body-lg">
        Collect your favorite builders
      </Typography>
      <SearchBar placeholder="Search for builders..." />
      <Suspense key={query + currentPage} fallback={<BuildersTableSkeleton />}>
        <BuildersTable query={query} currentPage={currentPage} />
      </Suspense>
    </Box>
  );
}
