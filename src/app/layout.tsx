import type { Metadata } from "next";
import { Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const fontSans = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontSerif = Instrument_Serif({
  variable: "--font-serif",
  weight: ["400"],
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Convoke",
    default: "Convoke | Where ambitious people gather.",
  },
  description: "A calm, editorial operating system for builders, researchers, and creators. Join spaces, find opportunities, and build momentum.",
  metadataBase: new URL("https://convoke.com"),
  openGraph: {
    title: "Convoke",
    description: "Where ambitious people gather.",
    url: "https://convoke.com",
    siteName: "Convoke",
    images: [
      {
        url: "/og-default.jpg", // Needs to be added to public
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased h-full`}>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
