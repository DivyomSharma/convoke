import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import { GlobalOnboardingCheck } from "@/components/GlobalOnboardingCheck";
import { Toaster } from "sonner";
import "./globals.css";

const fontSans = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: "400",
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
  metadataBase: new URL("https://www.theconvoke.xyz"),
  openGraph: {
    title: "Convoke",
    description: "Where ambitious people gather.",
    url: "https://www.theconvoke.xyz",
    siteName: "Convoke",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Convoke",
    description: "Where ambitious people gather.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl="/auth"
      signUpUrl="/auth"
      appearance={{
        variables: {
          colorBackground: 'var(--paper)',
          colorPrimary: 'var(--brand)',
          fontFamily: 'var(--font-sans)',
          borderRadius: '4px',
        },
        elements: {
          card: "bg-paper border border-g3 shadow-none rounded-md",
          headerTitle: "font-serif text-3xl text-ink",
          headerSubtitle: "text-g5 font-sans text-base",
          formButtonPrimary: "bg-ink text-paper hover:bg-ink/90 shadow-none transition-all border-none font-medium text-sm rounded-md",
          formFieldInput: "bg-transparent border-g3 text-ink focus:border-ink focus:ring-0 transition-all rounded-md",
          formFieldLabel: "text-ink font-medium text-sm",
          socialButtonsBlockButton: "bg-transparent border border-g3 hover:bg-g1 text-ink transition-all rounded-md",
          socialButtonsBlockButtonText: "text-ink font-medium",
          dividerLine: "bg-g3",
          dividerText: "text-g5 font-mono text-[11px] uppercase tracking-wider",
          footerActionLink: "text-ink font-medium hover:underline",
          userButtonPopoverCard: "bg-paper border border-g3 shadow-none rounded-md overflow-hidden",
          userButtonPopoverActionButton: "hover:bg-g1 transition-colors",
          userButtonPopoverActionButtonText: "text-ink font-sans font-medium",
          userButtonPopoverActionButtonIcon: "text-ink",
          userButtonPopoverFooter: "hidden",
          userPreviewMainIdentifier: "text-ink font-medium font-sans",
          userPreviewSecondaryIdentifier: "text-g5 font-sans",
          profileSectionTitle: "text-ink font-medium font-sans border-b border-g3 pb-2",
          profileSectionTitleText: "text-ink font-sans",
          navbarButton: "text-g5 hover:text-ink hover:bg-g1 font-sans rounded-md",
          navbarButtonActive: "text-ink bg-g1 font-sans rounded-md",
          breadcrumbsItem: "text-ink font-sans",
          breadcrumbsItemDivider: "text-g5",
          scrollBox: "bg-paper rounded-md",
        }
      }}
    >
      <html lang="en" suppressHydrationWarning className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased h-full`}>
        <body className="min-h-full flex flex-col font-sans overflow-x-hidden">
          <PostHogProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {publishableKey ? children : <MissingClerkKey />}
              <GlobalOnboardingCheck />
              <Toaster theme="dark" position="bottom-center" toastOptions={{ className: "campus-frame font-mono text-[12px] uppercase tracking-widest" }} />
            </ThemeProvider>
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

function MissingClerkKey() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6 text-center">
      <div className="max-w-md rounded-[24px] border border-g3 bg-paper-elevated p-8">
        <div className="eyebrow text-brand">Clerk not configured</div>
        <h1 className="serif mt-4 text-4xl tracking-tight text-ink">Missing publishable key</h1>
        <p className="mt-4 text-[15px] leading-7 text-g6">
          Set <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> in your environment so the auth flow can load.
        </p>
      </div>
    </main>
  );
}
