import { Suspense } from "react";
import { Typography } from "@mui/joy";
import { SearchBar, BuildersTable, BuildersTableSkeleton } from "@/components";

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
    <>
      <Typography fontWeight={"bold"} level="body-lg">
        Collect your favorite builders
      </Typography>
      <SearchBar placeholder="Search for builders..." />
      <Suspense key={query + currentPage} fallback={<BuildersTableSkeleton />}>
        <BuildersTable query={query} currentPage={currentPage} />
      </Suspense>
    </>
  );
}
