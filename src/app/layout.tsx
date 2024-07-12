import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Context } from "@/context";

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
        <body className={inter.className}>{children}</body>
      </Web3Context>
    </html>
  );
}
