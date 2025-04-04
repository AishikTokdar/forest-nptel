import type { Metadata } from "next";
import "./globals.css";
import { inter, jetbrainsMono } from './fonts';
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "NPTEL Forest Quiz",
  description: "Practice quiz for NPTEL Forest course",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-black min-h-screen">
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
