import { Shell } from "@/components/Shell";

const sections = [
  {
    title: "Using Convoke",
    body: "Convoke exists for legitimate opportunities, events, communities, projects, sponsorships, certificates, and collaboration. You agree to provide accurate information and to use the platform in a way that protects participants, organizers, sponsors, and creators.",
  },
  {
    title: "Accounts And Roles",
    body: "Your access depends on your role and permissions. Participants, organizers, community admins, sponsors, startups, creators, volunteers, and platform admins may see different workflows. You are responsible for activity performed through your account.",
  },
  {
    title: "Organizer Responsibilities",
    body: "Organizations must publish truthful event and opportunity details, review applications fairly, honor commitments made to participants, and avoid misleading claims about sponsorships, certificates, hiring, compensation, prizes, or affiliations.",
  },
  {
    title: "Participant Responsibilities",
    body: "Participants must submit truthful applications, respect community guidelines, avoid spam or harassment, and follow organizer instructions for events, hackathons, volunteering, interviews, and team collaboration.",
  },
  {
    title: "Content And Files",
    body: "You retain ownership of content you submit, but grant Convoke the rights needed to host, display, process, share, and preserve it for platform workflows such as applications, registrations, profiles, galleries, certificates, and organizer review.",
  },
  {
    title: "Safety And Enforcement",
    body: "Convoke may limit, suspend, remove, or investigate accounts, organizations, listings, messages, files, or workflows that appear fraudulent, unsafe, unlawful, abusive, spammy, or harmful to the ecosystem.",
  },
  {
    title: "Platform Availability",
    body: "We work to keep Convoke fast and reliable, but availability can be affected by maintenance, third-party services, network issues, or abuse prevention. Critical organizer workflows should keep appropriate backups and confirmation records.",
  },
];

export default function TermsOfService() {
  return (
    <Shell>
      <main className="relative mx-auto max-w-[960px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="absolute right-8 top-20 -z-10 h-80 w-80 rounded-full bg-brand/10 blur-[110px]" />
        <p className="mono text-[11px] uppercase tracking-[0.34em] text-brand">Operating Terms</p>
        <h1 className="serif mt-5 max-w-[780px] text-5xl leading-[0.94] tracking-[-0.05em] text-ink sm:text-7xl">
          Clear rules for a high-trust opportunity network.
        </h1>
        <p className="mt-6 max-w-[700px] text-[16px] leading-8 text-g5">
          Effective June 21, 2026. These terms govern access to Convoke across discovery, applications,
          registrations, communities, sponsorship workflows, merchandise requests, and organizer infrastructure.
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
          Questions about these terms can be raised through the support channel in your workspace. These terms are
          product operating rules and should be reviewed by counsel before relying on them as final legal documents.
        </div>
      </main>
    </Shell>
  );
}
