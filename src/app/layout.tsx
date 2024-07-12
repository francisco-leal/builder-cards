import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Context } from "@/context";
import { Box } from "@mui/joy";
import { Header } from "@/components";

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
        <body className={inter.className} style={{ margin: 0 }}>
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
            {children}
          </Box>
        </body>
      </Web3Context>
    </html>
  );
}
