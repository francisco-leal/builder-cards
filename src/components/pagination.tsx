"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Box, Button } from "@mui/joy";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

export function Pagination({ count }: { count: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleNext = () => {
    const page = searchParams.get("page") || "1";
    const params = new URLSearchParams(searchParams);
    params.set("page", (parseInt(page) + 1).toString());
    replace(`${pathname}?${params.toString()}`);
  };

  const handlePrevious = () => {
    const page = searchParams.get("page") || "1";
    if (page === "1") {
      return;
    }

    const params = new URLSearchParams(searchParams);
    params.set("page", (parseInt(page) - 1).toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Box
      sx={{
        maxWidth: "485px",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 2,
      }}
    >
      <Button
        onClick={handlePrevious}
        variant="outlined"
        color="neutral"
        startDecorator={<ArrowBack />}
        disabled={searchParams.get("page") === "1"}
      >
        Previous
      </Button>
      <Button
        onClick={handleNext}
        variant="outlined"
        color="neutral"
        endDecorator={<ArrowForward />}
        disabled={searchParams.get("page") === count.toString()}
      >
        Next
      </Button>
    </Box>
  );
}
