"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { ContextProvider } from "@/context/SocketProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ContextProvider>
        <body className={inter.variable}>{children}</body>
      </ContextProvider>
    </html>
  );
}
