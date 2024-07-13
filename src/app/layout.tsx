import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Context } from "@/context";
import { Box } from "@mui/joy";
import { Header } from "@/components";
import { CssVarsProvider } from "@mui/joy/styles";
import { theme } from "@/theme";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Builder Cards",
  description: "Collect your favorite builders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Web3Context>
        <CssVarsProvider theme={theme}>
          <Box
            component="body"
            className={inter.className}
            sx={{
              margin: 0,
              background: "#F0EFF7",
            }}
          >
            <Box
              component="main"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: "100vh",
                gap: 2,
                paddingX: 2,
                paddingBottom: 2,
              }}
            >
              <Header />
              {children}
              <Toaster />
            </Box>
          </Box>
        </CssVarsProvider>
      </Web3Context>
    </html>
  );
}
