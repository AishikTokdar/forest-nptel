import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from 'next/dynamic';
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeToggleWrapper from "@/components/ThemeToggleWrapper";

// Dynamically import components that are not needed for initial render
const Navbar = dynamic(() => import('@/components/Navbar'), {
  ssr: true,
  loading: () => <div className="h-16 bg-white dark:bg-gray-900" />
});

const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: true,
  loading: () => <div className="h-32 bg-white dark:bg-gray-900" />
});

// Configure Inter font with fallback options
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  fallback: ['system-ui', 'arial'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://forest-nptel.vercel.app"),
  title: "Forest NPTEL - Learn Forest Management",
  description: "Your comprehensive learning platform for the NPTEL Forest Management course. Practice with our specialized quizzes, access study materials, and ace your FAT exam.",
  keywords: "NPTEL, Forest Management, Quiz, Study Material, Conservation, Biodiversity",
  authors: [{ name: "Forest NPTEL Team" }],
  openGraph: {
    title: "Forest NPTEL - Learn Forest Management",
    description: "Your comprehensive learning platform for the NPTEL Forest Management course. Practice with our specialized quizzes, access study materials, and ace your FAT exam.",
    url: "https://forest-nptel.vercel.app",
    siteName: "Forest NPTEL",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Forest NPTEL",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Forest NPTEL - Learn Forest Management",
    description: "Your comprehensive learning platform for the NPTEL Forest Management course. Practice with our specialized quizzes, access study materials, and ace your FAT exam.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable}`}>
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300`}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow pt-16">
              {children}
            </main>
            <Footer />
            <ThemeToggleWrapper />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
