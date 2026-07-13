import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css"; // Ensure complete implementation Tailwind variables imports mapping
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "SponsorVault | Discover Monetization Deals Instantly",
  description: "Enterprise curated access map matching strategic target partners scaling structural production paths for content producers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-neutral-950 font-sans text-neutral-50 antialiased", inter.variable)}>
        {children}
      </body>
    </html>
  );
}
