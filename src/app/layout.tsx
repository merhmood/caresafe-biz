import type { Metadata } from "next";
import type { Viewport } from "next";
import LocalFont from "next/font/local";
import "./globals.css";

const inter = LocalFont({ src: "../assets/fonts/Satoshi-Variable.ttf" });

export const metadata: Metadata = {
  title: "caresafe | Business",
  description: "Enabling care giver providing their services easily",
  icons: "/logo.svg",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/logo.svg" />
      </head>
      <body className={inter.className}>
        <div id="modal"></div>
        {children}
      </body>
    </html>
  );
}
