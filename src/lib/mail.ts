import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendWelcomeEmail(to: string, name: string) {
  if (!resend) return;
  await resend.emails.send({
    from: "Convoke <onboarding@theconvoke.xyz>",
    to,
    subject: "Welcome to Convoke.",
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
      <h1 style="font-family: serif; font-size: 32px;">Convoke.</h1>
      <p>Welcome, ${name}. Your passport is active. Start exploring spaces, shipping projects, and finding opportunities.</p>
    </div>`,
  });
}

export async function sendRSVPEmail(to: string, eventTitle: string, status: string) {
  if (!resend) return;
  await resend.emails.send({
    from: "Convoke <meets@theconvoke.xyz>",
    to,
    subject: `RSVP Confirmed: ${eventTitle}`,
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
      <h1 style="font-family: serif; font-size: 32px;">Convoke.</h1>
      <p>Your RSVP for <strong>${eventTitle}</strong> is confirmed. Current status: ${status}.</p>
    </div>`,
  });
}
