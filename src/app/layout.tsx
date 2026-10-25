import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNavbar from "@/components/layout/BottomNavbar";
import TopNavbar from "@/components/layout/TopNavbar";
import SOSButton from "@/components/layout/SOSButton";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YatraTN - Tamil Nadu Tourism",
  description: "Discover the heart of Tamil Nadu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "antialiased min-h-screen flex flex-col"
        )}
      >
        <TopNavbar />

        <main className="flex-1">{children}</main>
        <BottomNavbar />
        <SOSButton />
      </body>
    </html>
  );
}
