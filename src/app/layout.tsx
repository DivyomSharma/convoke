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
  metadataBase: new URL("https://convoke.xyz"),
  title: {
    default: "Convoke - Events, Ideas, and People Moving Forward",
    template: "%s | Convoke",
  },
  description:
    "Convoke is for events, ideas, and people moving things forward across campuses, creators, startups, NGOs, and ambitious communities.",
  openGraph: {
    title: "Convoke",
    description: "For events, ideas, and people moving things forward.",
    url: "https://convoke.xyz",
    siteName: "Convoke",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Convoke",
    description: "For events, ideas, and people moving things forward.",
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
