"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Box, Input } from "@mui/joy";
import { SearchOutlined } from "@mui/icons-material";
import { useDebouncedCallback } from "use-debounce";

export function SearchBar({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <Box sx={{ maxWidth: "485px", width: "100%" }}>
      <Input
        placeholder={placeholder}
        sx={{ width: "100%", paddingX: 2 }}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
        endDecorator={<SearchOutlined />}
      />
    </Box>
  );
}
