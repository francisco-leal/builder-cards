"use client";
import { extendTheme } from "@mui/joy/styles";

const colors = {
  backgroundDefault: "#F0EFF7",
};

export const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        background: {
          body: colors.backgroundDefault,
        },
      },
    },
  },
});
