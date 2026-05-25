import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/providers/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://convoke.app"),
  title: {
    default: "Convoke - Communities, Opportunities, and Events in Motion",
    template: "%s | Convoke",
  },
  description:
    "Convoke is the ecosystem where ambitious people discover opportunities, communities, collaborators, hackathons, internships, events, and momentum.",
  openGraph: {
    title: "Convoke",
    description: "Communities, opportunities, collaborators, events, and momentum in one living ecosystem.",
    url: "https://convoke.app",
    siteName: "Convoke",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Convoke",
    description: "Communities, opportunities, collaborators, events, and momentum in one living ecosystem.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className="noise min-h-full flex flex-col bg-background">
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
