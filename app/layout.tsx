import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ClientOnly } from "@/components/client-only";
import { PwaProvider } from "@/providers/pwa";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trade Journal",
  description: "记录你的股市点点滴滴",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Trade Journal",
    startupImage: [
      {
        url: "/splash-screen-ipad.png",
        media: "(min-device-width: 1024px) and (orientation: portrait)",
      },
      {
        url: "/splash-screen-iphone.png",
        media: "(max-device-width: 1023px) and (orientation: portrait)",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-w-[370px]`}
      >
        <Toaster richColors position={"top-center"} duration={1500} />
        <ClientOnly>
          <PwaProvider>{children}</PwaProvider>
        </ClientOnly>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
