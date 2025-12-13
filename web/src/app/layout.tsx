import type { Metadata } from "next";
import { Exo_2, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/store/StoreProvider";

const exo = Exo_2({ weight: "400", subsets: ["cyrillic"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Casino App",
  description: "Bet and win big!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${exo.className}`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
