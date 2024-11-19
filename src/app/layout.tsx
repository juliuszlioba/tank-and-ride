import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";

import "./globals.css";
import WebsiteAuth from "@/components/Auth";

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tank and Ride",
  description: "App to track your fuel consumption",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${josefinSans.className} antialiased`}>
        <div className="p-2 md:p-4">{children}</div>
        <WebsiteAuth />
      </body>
    </html>
  );
}
