import { Shell } from "@/components/Shell";

const sections = [
  {
    title: "How We Use Cookies",
    body: "Cookies are small text files stored by your browser when you visit websites. Convoke uses cookies, local storage, and session storage to provide a secure, seamless, and high-performance experience. We do not use third-party tracking or advertising cookies.",
  },
  {
    title: "Essential Cookies & Storage",
    body: "These cookies and storage items are strictly necessary for the platform to function. They handle authentication sessions (provided securely by Clerk), security tokens to prevent cross-site request forgery (CSRF), and user preferences such as your interface theme (light/dark mode).",
  },
  {
    title: "Performance & Security",
    body: "We use secure storage mechanisms to run our opportunity discovery algorithms, remember temporary state in applications or forms, caching assets to load pages faster, and protect against network abuse or unauthorized access attempts.",
  },
  {
    title: "Managing Your Preferences",
    body: "You can control and manage cookie settings directly in your browser. However, since all cookies and storage items used on Convoke are essential for authentication and security, blocking or deleting them will prevent you from signing in or using the platform's core workflows.",
  },
];

export default function CookiePolicy() {
  return (
    <Shell>
      <main className="relative mx-auto max-w-[960px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="absolute right-8 top-20 -z-10 h-80 w-80 rounded-full bg-[var(--brand)]/10 blur-[110px]" />
        <p className="mono text-[11px] uppercase tracking-[0.34em] text-[var(--brand)]">Cookie Policy</p>
        <h1 className="serif mt-5 max-w-[780px] text-5xl leading-[0.94] tracking-[-0.05em] text-ink sm:text-7xl">
          Clean storage for secure operations.
        </h1>
        <p className="mt-6 max-w-[700px] text-[16px] leading-8 text-g5">
          Effective June 21, 2026. This policy explains what cookies and local storage items are used on Convoke and why they are necessary to keep your passport secure.
        </p>

        <div className="mt-12 grid gap-4">
          {sections.map((section) => (
            <section key={section.title} className="premium-card p-6 sm:p-7">
              <h2 className="text-[18px] font-semibold text-ink">{section.title}</h2>
              <p className="mt-3 text-[15px] leading-7 text-g5">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-[28px] border border-g2 bg-g1/55 p-6 text-[14px] leading-7 text-g5">
          If you have any questions about how we store and secure data, please reach out to the operations team via the contact form or support channels.
        </div>
      </main>
    </Shell>
  );
}
