import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import React from "react";
const popins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font--poppins",
});

export const metadata: Metadata = {
  title: "StoreIt",
  description: "Store it the Only Storage Solution You Need",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${popins.variable}antialiasing font-poppins`}>
        {children}
      </body>
    </html>
  );
}
