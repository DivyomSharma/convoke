import type { Metadata } from "next";
import Image from "next/image";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Panel } from "@/components/ui/panel";

export const metadata: Metadata = {
  title: "North Grid Societies - Convoke Community",
  description: "Delhi's premier student collective driving innovation, entrepreneurship, and cultural exchange across 15+ colleges.",
};

export default function CommunityPage() {
  return (
    <>
      <SiteHeader />
      <main className="px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <h1 className="max-w-4xl text-6xl font-semibold tracking-[-0.05em] md:text-8xl">
              North Grid Societies
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-muted">
              Delhi's premier student collective driving innovation, entrepreneurship, and cultural exchange across 15+ colleges.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted">
                <span className="size-4 text-bronze">📍</span>
                Delhi NCR
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted">
                <span className="size-4 text-bronze">👥</span>
                12,400+ Members
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted">
                <span className="size-4 text-bronze">🎯</span>
                15 Colleges
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted">
                <span className="size-4 text-bronze">💡</span>
                200+ Events/Year
              </span>
            </div>
          </div>
          
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* About Panel */}
            <Panel className="min-h-[300px] p-6">
              <h2 className="text-2xl font-medium mb-4">About North Grid Societies</h2>
              <p className="leading-7 text-muted">
                North Grid Societies is a federation of student organizations from premier colleges across Delhi NCR, including DU, JNU, IIT Delhi, IIIT Delhi, and more. We believe in the power of collective action to drive meaningful change on campus and beyond.
              </p>
              <p className="mt-4 leading-7 text-muted">
                Our mission is to create platforms for interdisciplinary collaboration, foster entrepreneurial mindsets, and amplify student voices in decision-making processes. Through hackathons, conferences, cultural festivals, and social initiatives, we've built one of India's most vibrant student ecosystems.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="bg-bronze/10 text-bronze px-3 py-1 rounded text-xs font-medium">Technology</span>
                <span className="bg-bronze/10 text-bronze px-3 py-1 rounded text-xs font-medium">Entrepreneurship</span>
                <span className="bg-bronze/10 text-bronze px-3 py-1 rounded text-xs font-medium">Arts & Culture</span>
                <span className="bg-bronze/10 text-bronze px-3 py-1 rounded text-xs font-medium">Social Impact</span>
                <span className="bg-bronze/10 text-bronze px-3 py-1 rounded text-xs font-medium">Policy & Governance</span>
              </div>
            </Panel>
            
            {/* Stats Panel */}
            <Panel className="min-h-[300px] p-6">
              <h2 className="text-2xl font-medium mb-4">Community Impact</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Events Organized</span>
                  <span className="text-sm font-semibold text-foreground">1,200+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Students Reached</span>
                  <span className="text-sm font-semibold text-foreground">50,000+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Startups Incubated</span>
                  <span className="text-sm font-semibold text-foreground">80+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Hours Volunteered</span>
                  <span className="text-sm font-semibold text-foreground">250,000+</span>
                </div>
              </div>
            </Panel>
          </div>
          
          {/* Members Section */}
          <section className="mt-16">
            <h2 className="text-3xl font-medium tracking-[-0.03em] mb-6">Featured Members</h2>
            <p className="mb-8 text-lg leading-7 text-muted max-w-3xl">
              Meet some of the passionate individuals driving change through North Grid Societies.
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Member Card 1 */}
              <div className="border border-white/[0.08] rounded-xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="grid size-10 place-items-center rounded-full bg-bronze/10 text-bronze">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 8v4m0 4h.01"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Aarav Mehta</h3>
                    <p className="text-sm text-muted">IIT Delhi | Robotics Club Lead</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="bg-bronze/10 text-bronze px-2 py-1 rounded text-xs">Robotics</span>
                      <span className="bg-bronze/10 text-bronze px-2 py-1 rounded text-xs">AI/ML</span>
                      <span className="bg-bronze/10 text-bronze px-2 py-1 rounded text-xs">Hardware</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted line-clamp-3">
                  Aarav leads the Robotics Club at IIT Delhi, organizing workshops and competitions that have engaged over 500 students in hands-on STEM learning.
                </p>
                <ButtonLink href="#" className="mt-4">
                  View Profile
                </ButtonLink>
              </div>
              
              {/* Member Card 2 */}
              <div className="border border-white/[0.08] rounded-xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="grid size-10 place-items-center rounded-full bg-bronze/10 text-bronze">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Sneha Kapoor</h3>
                    <p className="text-sm text-muted">Delhi University | Economics Society President</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="bg-bronze/10 text-bronze px-2 py-1 rounded text-xs">Economics</span>
                      <span className="bg-bronze/10 text-bronze px-2 py-1 rounded text-xs">Policy</span>
                      <span className="bg-bronze/10 text-bronze px-2 py-1 rounded text-xs">Research</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted line-clamp-3">
                  Sneha has led initiatives connecting economics students with real-world policy projects, bridging academia and government through research internships and fellowships.
                </p>
                <ButtonLink href="#" className="mt-4">
                  View Profile
                </ButtonLink>
              </div>
              
              {/* Member Card 3 */}
              <div className="border border-white/[0.08] rounded-xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="grid size-10 place-items-center rounded-full bg-bronze/10 text-bronze">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M4 4v16h16V4"/>
                      <path d="M8 8h8v8H8z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Arjun Singh</h3>
                    <p className="text-sm text-muted">IIIT Delhi | Coding Club Coordinator</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="bg-bronze/10 text-bronze px-2 py-1 rounded text-xs">Web Dev</span>
                      <span className="bg-bronze/10 text-bronze px-2 py-1 rounded text-xs">Open Source</span>
                      <span className="bg-bronze/10 text-bronze px-2 py-1 rounded text-xs">Mentorship</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted line-clamp-3">
                  Arjun coordinates weekly coding sessions and hackathon preparation workshops that have helped 300+ students land internships at top tech companies.
                </p>
                <ButtonLink href="#" className="mt-4">
                  View Profile
                </ButtonLink>
              </div>
              
              {/* Member Card 4 */}
              <div className="border border-white/[0.08] rounded-xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="grid size-10 place-items-center rounded-full bg-bronze/10 text-bronze">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Priya Desai</h3>
                    <p className="text-sm text-muted">JNU | Cultural Exchange Lead</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="bg-bronze/10 text-bronze px-2 py-1 rounded text-xs">Culture</span>
                      <span className="bg-bronze/10 text-bronze px-2 py-1 rounded text-xs">Dance</span>
                      <span className="bg-bronze/10 text-bronze px-2 py-1 rounded text-xs">Events</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted line-clamp-3">
                  Priya organizes cultural festivals celebrating India's diversity, bringing together students from different regions for music, dance, and artistic collaborations.
                </p>
                <ButtonLink href="#" className="mt-4">
                  View Profile
                </ButtonLink>
              </div>
            </div>
          </section>
          
          {/* Events Section */}
          <section className="mt-16">
            <h2 className="text-3xl font-medium tracking-[-0.03em] mb-6">Upcoming Events</h2>
            <p className="mb-8 text-lg leading-7 text-muted max-w-3xl">
              Check out what's happening in the North Grid ecosystem this month.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Event Card 1 */}
              <div className="border border-white/[0.08] rounded-xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="grid size-10 place-items-center rounded-lg bg-bronze/10 text-bronze">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Delhi Startup Summit 2026</h3>
                    <p className="text-sm text-muted">Oct 15-16, 2026 • IIT Delhi Campus</p>
                  </div>
                </div>
                <p className="text-sm text-muted line-clamp-3">
                  Asia's largest student startup conference featuring 100+ student ventures, VC panels, and pitch competitions with ₹50 lakhs in prizes.
                </p>
                <ButtonLink href="#" className="mt-4">
                  Learn More →
                </ButtonLink>
              </div>
              
              {/* Event Card 2 */}
              <div className="border border-white/[0.08] rounded-xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="grid size-10 place-items-center rounded-lg bg-bronze/10 text-bronze">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m6 6v7"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">North Grid Cultural Fest</h3>
                    <p className="text-sm text-muted">Nov 2-4, 2026 • Delhi University</p>
                  </div>
                </div>
                <p className="text-sm text-muted line-clamp-3">
                  A 3-day celebration of art, music, dance, and food from across India, featuring performances by student groups and renowned artists.
                </p>
                <ButtonLink href="#" className="mt-4">
                  Learn More →
                </ButtonLink>
              </div>
              
              {/* Event Card 3 */}
              <div className="border border-white/[0.08] rounded-xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="grid size-10 place-items-center rounded-lg bg-bronze/10 text-bronze">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 16v-4"/>
                      <path d="M8 12h8"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Women in Tech Conference</h3>
                    <p className="text-sm text-muted">Sep 30, 2026 • Online</p>
                  </div>
                </div>
                <p className="text-sm text-muted line-clamp-3">
                  Empowering women in technology through talks, workshops, and networking sessions with industry leaders from Google, Microsoft, and Adobe.
                </p>
                <ButtonLink href="#" className="mt-4">
                  Learn More →
                </ButtonLink>
              </div>
              
              {/* Event Card 4 */}
              <div className="border border-white/[0.08] rounded-xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="grid size-10 place-items-center rounded-lg bg-bronze/10 text-bronze">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 4.141 2.652 7.72 6.28 9.82a2 2 0 002.42 0c3.628-2.1 6.28-5.679 6.28-9.82z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">GridHacks 2026</h3>
                    <p className="text-sm text-muted">Dec 10-12, 2026 • IIIT Delhi</p>
                  </div>
                </div>
                <p className="text-sm text-muted line-clamp-3">
                  48-hour hackathon focused on solving urban challenges in Delhi, with tracks in smart mobility, waste management, and public safety.
                </p>
                <ButtonLink href="#" className="mt-4">
                  Learn More →
                </ButtonLink>
              </div>
            </div>
          </section>
          
          {/* Call to Action */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Join North Grid Societies
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
              Become part of Delhi's most dynamic student community. Gain access to exclusive events, leadership opportunities, and a network of passionate changemakers.
            </p>
            <ButtonLink href="/workspace" className="inline-flex items-center gap-2">
              Get Involved
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </ButtonLink>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// ButtonLink component (simple version for this page)
function ButtonLink({ 
  href, 
  children, 
  className = "" 
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a 
      href={href} 
      className={`inline-flex items-center justify-center rounded-md border border-transparent bg-bronze px-4 py-2 text-sm font-medium text-background hover:bg-bronze/90 focus:outline-none focus:ring-2 focus:ring-bronze focus:ring-offset-2 disabled:opacity-50 transition-colors ${className}`}
    >
      {children}
    </a>
  );
}
