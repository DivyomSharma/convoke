"use client";

import { useState } from "react";
import { Shell } from "@/components/Shell";
import { Mail, MessageSquare, ShieldAlert, CheckCircle, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Mock submit latency
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <main className="relative mx-auto max-w-[1140px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="absolute left-1/4 top-20 -z-10 h-80 w-80 rounded-full bg-[var(--brand)]/10 blur-[110px]" />
        
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Info Side */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="mono text-[11px] uppercase tracking-[0.34em] text-[var(--brand)]">Get in touch</p>
              <h1 className="serif mt-5 text-5xl leading-[0.94] tracking-[-0.05em] text-ink sm:text-7xl">
                Let&apos;s build together.
              </h1>
              <p className="mt-6 text-[16px] leading-8 text-g5">
                Have a question about organizers, spaces, meets, security, or platform capabilities? We are here to help student builders and collectives.
              </p>
            </div>

            <div className="mt-12 space-y-6">
              {[
                {
                  icon: MessageSquare,
                  title: "General Inquiries",
                  copy: "For partnerships, sponsorships, and custom deployments.",
                  email: "hello@theconvoke.xyz"
                },
                {
                  icon: Mail,
                  title: "Platform Support",
                  copy: "Get assistance with your workspace, passport, or meets.",
                  email: "support@theconvoke.xyz"
                },
                {
                  icon: ShieldAlert,
                  title: "Security & Trust",
                  copy: "Report vulnerabilities, guidelines violations, or identity abuse.",
                  email: "security@theconvoke.xyz"
                }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4 p-5 rounded-md border border-g3 bg-g1/30 backdrop-blur-md">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-ink/10 border border-g3 text-[var(--brand)]">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
                      <p className="mt-1 text-xs text-g4">{item.copy}</p>
                      <a href={`mailto:${item.email}`} className="mt-2.5 inline-block text-xs font-semibold text-[var(--brand)] hover:underline">
                        {item.email}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Side */}
          <div className="premium-card p-8 md:p-10">
            <h2 className="serif text-2xl text-ink">Send a message</h2>
            <p className="mt-2 text-sm text-g5">Our operations team typically responds within a business day.</p>

            {success ? (
              <div className="mt-8 flex flex-col items-center justify-center p-8 rounded-md border border-green-500/20 bg-green-500/5 text-center">
                <CheckCircle size={44} className="text-green-500 mb-4" />
                <h3 className="text-base font-semibold text-ink">Message Sent</h3>
                <p className="mt-2 text-xs text-g5 max-w-[280px]">
                  Thank you. We have received your message and will reach out to you shortly.
                </p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="mt-6 px-5 py-2.5 rounded-full border border-g3 bg-g1/50 text-[12px] font-semibold text-ink hover:bg-g2 transition-all cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {error && (
                  <div className="p-4 rounded-sm bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center">
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Your Name</label>
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ananya Rao"
                    className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Email Address</label>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@university.edu"
                    className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Subject</label>
                  <input 
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Inquiry about organizing a hackathon"
                    className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Message</label>
                  <textarea 
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we support your vision?"
                    className="w-full p-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-full bg-ink hover:opacity-95 text-paper font-semibold text-sm transition-all active:scale-98 flex items-center justify-center gap-2 border border-[var(--brand)]/20 mt-6"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </Shell>
  );
}
