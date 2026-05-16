"use client";

import { useMemo, useState } from "react";
import { ArrowRight, MessageCircle, Upload } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Panel } from "@/components/ui/panel";
import { merchProducts } from "@/data/platform";

const steps = ["Product", "Quantity", "Budget", "Timeline", "City"];

export default function MerchPage() {
  const [form, setForm] = useState({
    product: "Oversized tees",
    quantity: "250",
    budget: "₹600-₹900 per piece",
    timeline: "3 weeks",
    city: "Bengaluru",
  });
  const [fileName, setFileName] = useState<string | null>(null);

  const whatsappUrl = useMemo(() => {
    const message = `Convoke merch inquiry:%0AProduct: ${form.product}%0AQuantity: ${form.quantity}%0ABudget: ${form.budget}%0ATimeline: ${form.timeline}%0ACity: ${form.city}`;
    return `https://wa.me/919999999999?text=${message}`;
  }, [form]);

  return (
    <>
      <SiteHeader />
      <main className="px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <section>
            <h1 className="text-6xl font-semibold tracking-[-0.05em] md:text-8xl">
              Merch, treated like infrastructure.
            </h1>
            <p className="mt-7 text-lg leading-8 text-muted">
              Plan apparel, sponsor kits, startup swag, creator drops, and
              event collections with PlotArmour Merch production workflows.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {merchProducts.map((product) => (
                <button
                  key={product}
                  onClick={() => setForm((current) => ({ ...current, product }))}
                  className="rounded-full border border-line bg-white/[0.035] px-4 py-2 text-sm text-muted transition hover:border-bronze/60 hover:text-foreground"
                >
                  {product}
                </button>
              ))}
            </div>
          </section>

          <Panel className="p-5 md:p-7">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-medium">Bulk inquiry</h2>
              <span className="font-mono text-xs text-muted">CRM: reviewing</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {steps.map((step) => {
                const key = step.toLowerCase() as keyof typeof form;
                return (
                  <label key={step} className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.22em] text-muted">
                      {step}
                    </span>
                    <input
                      value={form[key]}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          [key]: event.target.value,
                        }))
                      }
                      className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none transition focus:border-bronze"
                    />
                  </label>
                );
              })}
              <label className="cursor-pointer rounded-[8px] border border-dashed border-line p-4 text-sm text-muted transition hover:border-bronze/60 md:col-span-2">
                <Upload className="mb-3 size-5 text-steel" />
                {fileName
                  ? `Attached: ${fileName}`
                  : "Attach reference uploads, tech packs, moodboards, and logos."}
                <input
                  type="file"
                  className="sr-only"
                  onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
                />
              </label>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-rust px-5 text-sm font-medium text-white transition hover:bg-[#cf7542]"
            >
              <MessageCircle className="size-4" />
              Continue on WhatsApp
            </a>
            <a
              href="https://merch.theplotarmour.xyz"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-line bg-white/[0.035] px-5 text-sm font-medium text-foreground transition hover:border-bronze/60 hover:bg-white/[0.08]"
            >
              Redirect to merch portal
              <ArrowRight className="size-4" />
            </a>
          </Panel>
        </div>
      </main>
      <Footer />
    </>
  );
}
