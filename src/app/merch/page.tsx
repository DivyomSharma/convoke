"use client";

import { useState, useTransition } from "react";
import { ArrowRight, Loader2, MessageCircle } from "lucide-react";
import { createMerchInquiry } from "@/app/actions";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export default function MerchPage() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    apparelType: "",
    quantity: "100",
    budget: "",
    timeline: "",
    city: "",
    references: "",
    stylePreferences: "",
  });

  return (
    <>
      <SiteHeader />
      <main className="px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr]">
          <section>
            <h1 className="text-6xl font-semibold tracking-[-0.05em] md:text-8xl">
              Merch, built into organizer flow.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
              Request event apparel, volunteer kits, sponsor gifting, startup drops, or creator merchandise through the same ecosystem where your event and community already live.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Volunteer hoodies",
                "Event tees",
                "Sponsor gifting kits",
                "Startup welcome packs",
                "Creator drop apparel",
                "Swag boxes",
              ].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, apparelType: label }))}
                  className="rounded-[8px] border border-line bg-white/[0.035] p-4 text-left text-sm text-muted transition hover:border-bronze/60 hover:text-foreground"
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <Panel className="p-5 md:p-7">
            <div className="mb-6">
              <h2 className="text-2xl font-medium">Start a merch request</h2>
              <p className="mt-2 text-sm text-muted">
                No sample orders or mock data here. Submit a real inquiry and continue on WhatsApp if needed.
              </p>
            </div>
            <form
              className="grid gap-4 md:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                setMessage(null);
                startTransition(async () => {
                  try {
                    const result = await createMerchInquiry({
                      apparelType: form.apparelType,
                      quantity: Number(form.quantity),
                      budget: form.budget,
                      timeline: form.timeline,
                      city: form.city,
                      references: form.references
                        .split("\n")
                        .map((item) => item.trim())
                        .filter(Boolean),
                      stylePreferences: form.stylePreferences || undefined,
                    });
                    setMessage(`Request created with status ${result.status}.`);
                    const whatsapp = `https://wa.me/918744069597?text=${encodeURIComponent(result.whatsappMessage)}`;
                    window.open(whatsapp, "_blank", "noopener,noreferrer");
                  } catch (error) {
                    setMessage(error instanceof Error ? error.message : "Could not create merch request.");
                  }
                });
              }}
            >
              {[
                { key: "apparelType", label: "Product", placeholder: "Volunteer hoodies" },
                { key: "quantity", label: "Quantity", placeholder: "100" },
                { key: "budget", label: "Budget", placeholder: "INR 900 - 1200 per piece" },
                { key: "timeline", label: "Timeline", placeholder: "Needed 2 weeks before event" },
                { key: "city", label: "City", placeholder: "Pune" },
              ].map((field) => (
                <label key={field.key} className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">{field.label}</span>
                  <input
                    value={form[field.key as keyof typeof form]}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, [field.key]: event.target.value }))
                    }
                    placeholder={field.placeholder}
                    className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none transition focus:border-bronze"
                  />
                </label>
              ))}

              <label className="space-y-2 md:col-span-2">
                <span className="text-xs uppercase tracking-[0.22em] text-muted">References</span>
                <textarea
                  value={form.references}
                  onChange={(event) => setForm((current) => ({ ...current, references: event.target.value }))}
                  placeholder="Paste links, notes, or moodboard references. One per line."
                  className="min-h-28 w-full rounded-[8px] border border-line bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-bronze"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-xs uppercase tracking-[0.22em] text-muted">Style preferences</span>
                <textarea
                  value={form.stylePreferences}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, stylePreferences: event.target.value }))
                  }
                  placeholder="Fit, finish, fabric, print direction, or overall taste."
                  className="min-h-32 w-full rounded-[8px] border border-line bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-bronze"
                />
              </label>

              {message ? (
                <div className="rounded-[8px] border border-line bg-black/30 px-4 py-3 text-sm text-muted md:col-span-2">
                  {message}
                </div>
              ) : null}

              <Button type="submit" className="md:col-span-2">
                {isPending ? <Loader2 className="size-4 animate-spin" /> : <MessageCircle className="size-4" />}
                {isPending ? "Submitting..." : "Create request and continue"}
              </Button>
              <a
                href="https://merch.theplotarmour.xyz/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line bg-white/[0.035] px-5 text-sm font-medium text-foreground transition hover:border-bronze/60 hover:bg-white/[0.08] md:col-span-2"
              >
                Open PlotArmour Merch
                <ArrowRight className="size-4" />
              </a>
            </form>
          </Panel>
        </div>
      </main>
      <Footer />
    </>
  );
}
