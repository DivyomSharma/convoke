import { Resend } from "resend";
import { env } from "@/lib/env";

let resend: Resend | null = null;

export function getResend() {
  if (!env.RESEND_API_KEY) {
    throw new Error("Resend API key is not configured.");
  }

  if (!resend) {
    resend = new Resend(env.RESEND_API_KEY);
  }

  return resend;
}
