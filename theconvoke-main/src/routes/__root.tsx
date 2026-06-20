import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="min-h-screen bg-paper text-ink flex items-center justify-center px-6">
      <div className="max-w-lg">
        <div className="eyebrow">404 · off the map</div>
        <h1 className="serif text-6xl md:text-7xl mt-4 leading-[0.95]">
          We can't find that page.
        </h1>
        <p className="mt-5 text-g5 max-w-sm">
          The URL has moved or was never here. Head back to the feed and keep
          building.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="underline-link text-ink text-[15px]"
          >
            Return home →
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="min-h-screen bg-paper text-ink flex items-center justify-center px-6">
      <div className="max-w-lg">
        <div className="eyebrow">Something broke</div>
        <h1 className="serif text-5xl md:text-6xl mt-4 leading-[0.95]">
          This page didn't load.
        </h1>
        <p className="mt-5 text-g5">
          Something went wrong on our end. Try again or head home.
        </p>
        <div className="mt-8 flex gap-6 text-[15px]">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="underline-link"
          >
            Try again →
          </button>
          <a href="/" className="underline-link text-g5">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Convoke — Where ambitious people gather" },
      {
        name: "description",
        content:
          "Convoke is the home of students, founders, developers, creators and communities building their future together. Events, spaces, opportunities, and proof of work — in one feed.",
      },
      { name: "author", content: "Convoke" },
      { property: "og:title", content: "Convoke — Where ambitious people gather" },
      {
        property: "og:description",
        content:
          "Events, communities, opportunities and projects in one editorial feed.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@convoke" },
      { name: "twitter:title", content: "Convoke — Where ambitious people gather" },
      { name: "description", content: "Convoke is a platform for ambitious individuals to connect, collaborate, and build their future." },
      { property: "og:description", content: "Convoke is a platform for ambitious individuals to connect, collaborate, and build their future." },
      { name: "twitter:description", content: "Convoke is a platform for ambitious individuals to connect, collaborate, and build their future." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/Z2zpQqVnKCOpS1ba6lLFJgk2OV42/social-images/social-1781911893788-notion_feed.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/Z2zpQqVnKCOpS1ba6lLFJgk2OV42/social-images/social-1781911893788-notion_feed.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
