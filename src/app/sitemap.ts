import type { MetadataRoute } from "next";
import { featuredEvents } from "@/data/platform";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://convoke.xyz";
  const staticRoutes = ["", "/discover", "/communities/north-grid", "/merch", "/workspace", "/auth/sign-in"];
  const eventRoutes = featuredEvents.map((event) => `/events/${event.slug}`);

  return [...staticRoutes, ...eventRoutes].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route.startsWith("/events") ? "weekly" : "daily",
    priority: route === "" ? 1 : 0.8,
  }));
}
