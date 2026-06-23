import { Shell } from "@/components/Shell";

const sections = [
  {
    title: "What We Collect",
    body: "Convoke stores the information needed to run an opportunity and ecosystem platform: account identity, profile details, applications, registrations, memberships, saved items, certificates, organizer activity, and files you choose to upload.",
  },
  {
    title: "How We Use It",
    body: "We use this data to authenticate users, power discovery, process applications and registrations, issue certificates, notify members, support organizers, prevent abuse, and improve reliability across the platform.",
  },
  {
    title: "Organizer Visibility",
    body: "When you apply, register, volunteer, join a space, or message an organizer, the relevant organization may see the details required to review or manage that workflow. Your private account credentials are never shared with organizers.",
  },
  {
    title: "Email And Notifications",
    body: "Convoke may send transactional email for login, application updates, meet reminders, announcements, sponsorship workflows, merchandise requests, and security notices. You can control non-essential updates from your account settings as those controls become available.",
  },
  {
    title: "Data Processors",
    body: "We rely on trusted infrastructure providers for authentication, database hosting, file storage, email delivery, analytics, and payments where applicable. These providers process data only to help operate Convoke.",
  },
  {
    title: "Your Choices",
    body: "You may request profile corrections, account export, or account deletion by contacting the Convoke team. Some records may be retained where required for fraud prevention, legal compliance, dispute resolution, certificate verification, or organizer audit trails.",
  },
];

export default function PrivacyPolicy() {
  return (
    <Shell>
      <main className="relative mx-auto max-w-[960px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="absolute left-1/2 top-20 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/10 blur-[100px]" />
        <p className="mono text-[11px] uppercase tracking-[0.34em] text-brand">Convoke Trust</p>
        <h1 className="serif mt-5 max-w-[760px] text-5xl leading-[0.94] tracking-[-0.05em] text-ink sm:text-7xl">
          Privacy that respects real people and real spaces.
        </h1>
        <p className="mt-6 max-w-[700px] text-[16px] leading-8 text-g5">
          Effective June 21, 2026. This policy explains how Convoke handles data for students, builders,
          organizers, sponsors, creators, and spaces using the platform.
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
          For privacy requests, security concerns, or data questions, contact the Convoke operations team through
          the support channel linked in your workspace. This page is product policy information and is not a
          substitute for independent legal advice.
        </div>
      </main>
    </Shell>
  );
}
