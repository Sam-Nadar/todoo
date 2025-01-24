import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Head from 'next/head';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Toodoo",
  description: "A todo app to get your todos done",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <Head>
  <link rel="icon" href="/favicon.png" />
</Head> */}

      <body className={inter.className}>{children}</body>
    </html>
  );
}
