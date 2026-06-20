import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/nav-bar";
import "./globals.css";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontSerif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Convoke",
  description: "Build your future together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fontSans.variable} ${fontSerif.variable} antialiased h-full`}>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavBar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
