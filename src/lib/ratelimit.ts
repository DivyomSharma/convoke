import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Fallback to essentially a no-op limiter if Redis isn't configured
export const ratelimit = {
  createOrg: redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(1, "1 m") }) : null,
  createEvent: redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "1 m") }) : null,
  applyOpportunity: redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1 m") }) : null,
  globalSearch: redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(60, "1 m") }) : null,
};
