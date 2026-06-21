"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: false, // captured manually in Next.js
      });
    }
  }, []);

  const { user } = useUser();

  useEffect(() => {
    if (user && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
      });
    } else if (!user && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.reset();
    }
  }, [user]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
