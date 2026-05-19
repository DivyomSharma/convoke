import Link from "next/link";

export default function OpportunitiesPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Opportunities
        </h1>
        <p className="text-xl text-muted max-w-2xl mx-auto">
          Discover internships, startup roles, creator collaborations, and more
          from ambitious communities across India.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Opportunity Card 1 */}
        <Link href="/opportunities/google-summer-of-code" className="group">
          <div className="border border-white/[0.08] rounded-xl p-6 hover:border-bronze/40 transition-group">
            <div className="flex items-start gap-4 mb-4">
              <div className="grid size-10 place-items-center rounded-lg bg-bronze/10 text-bronze">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-bronze transition">
                  Google Summer of Code
                </h3>
                <p className="text-sm text-muted">
                  Open source internship program for students
                </p>
                <span className="inline-flex items-center gap-2 mt-2 text-xs text-bronze">
                  <span>•</span>
                  <span>Remote</span>
                  <span>•</span>
                  <span>Summer 2026</span>
                </span>
              </div>
            </div>
            <p className="text-sm text-muted line-clamp-3">
              GSoC is a global program focused on bringing more student developers into open source software development.
            </p>
            <ButtonLink href="#" className="mt-4">
              Learn More
            </ButtonLink>
          </div>
        </Link>

        {/* Opportunity Card 2 */}
        <Link href="/opportunities/microsoft-engage" className="group">
          <div className="border border-white/[0.08] rounded-xl p-6 hover:border-bronze/40 transition-group">
            <div className="flex items-start gap-4 mb-4">
              <div className="grid size-10 place-items-center rounded-lg bg-bronze/10 text-bronze">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-bronze transition">
                  Microsoft Engage
                </h3>
                <p className="text-sm text-muted">
                  Mentorship program for women in tech
                </p>
                <span className="inline-flex items-center gap-2 mt-2 text-xs text-bronze">
                  <span>•</span>
                  <span>Hybrid</span>
                  <span>•</span>
                  <span>Spring 2026</span>
                </span>
              </div>
            </div>
            <p className="text-sm text-muted line-clamp-3">
              Microsoft Engage is a mentorship program that aims to encourage and motivate women to pursue careers in technology.
            </p>
            <ButtonLink href="#" className="mt-4">
              Learn More
            </ButtonLink>
          </div>
        </Link>

        {/* Opportunity Card 3 */}
        <Link href="/opportunities/amazon-wow" className="group">
          <div className="border border-white/[0.08] rounded-xl p-6 hover:border-bronze/40 transition-group">
            <div className="flex items-start gap-4 mb-4">
              <div className="grid size-10 place-items-center rounded-lg bg-bronze/10 text-bronze">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 2l30 9H4L12 2z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-bronze transition">
                  Amazon Women of Wisdom
                </h3>
                <p className="text-sm text-muted">
                  Leadership development program
                </p>
                <span className="inline-flex items-center gap-2 mt-2 text-xs text-bronze">
                  <span>•</span>
                  <span>Online</span>
                  <span>•</span>
                  <span>Fall 2026</span>
                </span>
              </div>
            </div>
            <p className="text-sm text-muted line-clamp-3">
              Amazon WOW is a pre-placement internship program for female engineering students in their pre-final year.
            </p>
            <ButtonLink href="#" className="mt-4">
              Learn More
            </ButtonLink>
          </div>
        </Link>

        {/* Opportunity Card 4 */}
        <Link href="/opportunities/adobe-india-women-in-technology" className="group">
          <div className="border border-white/[0.08] rounded-xl p-6 hover:border-bronze/40 transition-group">
            <div className="flex items-start gap-4 mb-4">
              <div className="grid size-10 place-items-center rounded-lg bg-bronze/10 text-bronze">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M8 12h8"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-bronze transition">
                  Adobe India Women in Technology
                </h3>
                <p className="text-sm text-muted">
                  Internship and mentorship program
                </p>
                <span className="inline-flex items-center gap-2 mt-2 text-xs text-bronze">
                  <span>•</span>
                  <span>Hybrid</span>
                  <span>•</span>
                  <span>Winter 2026</span>
                </span>
              </div>
            </div>
            <p className="text-sm text-muted line-clamp-3">
              Adobe India Women in Technology program aims to nurture and develop female tech talent in India.
            </p>
            <ButtonLink href="#" className="mt-4">
              Learn More
            </ButtonLink>
          </div>
        </Link>

        {/* Opportunity Card 5 */}
        <Link href="/opportunities/flipkart-grid" className="group">
          <div className="border border-white/[0.08] rounded-xl p-6 hover:border-bronze/40 transition-group">
            <div className="flex items-start gap-4 mb-4">
              <div className="grid size-10 place-items-center rounded-lg bg-bronze/10 text-bronze">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-bronze transition">
                  Flipkart GRiD
                </h3>
                <p className="text-sm text-muted">
                  Graduate recruitment program
                </p>
                <span className="inline-flex items-center gap-2 mt-2 text-xs text-bronze">
                  <span>•</span>
                  <span>Bangalore</span>
                  <span>•</span>
                  <span>Summer 2026</span>
                </span>
              </div>
            </div>
            <p className="text-sm text-muted line-clamp-3">
              Flipkart GRiD is a holistic learning and development program designed for fresh graduates.
            </p>
            <ButtonLink href="#" className="mt-4">
              Learn More
            </ButtonLink>
          </div>
        </Link>

        {/* Opportunity Card 6 */}
        <Link href="/opportunities/tesla-internship" className="group">
          <div className="border border-white/[0.08] rounded-xl p-6 hover:border-bronze/40 transition-group">
            <div className="flex items-start gap-4 mb-4">
              <div className="grid size-10 place-items-center rounded-lg bg-bronze/10 text-bronze">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M4.93 9.07l13.06 7.55a1 1 0 001.5-.43L22 7l-4-5-10.07 5.8a1 1 0 00-.79.24l-5 3a1 1 0 00-.21.43v2l7.36 4.25a1 1 0 01-.5 1.81l-8.43-4.88a1 1 0 01-.5-1.81V8l7.36-4.25a1 1 0 00.21-.43L16 4l4 5z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-bronze transition">
                  Tesla Internship Program
                </h3>
                <p className="text-sm text-muted">
                  Engineering and business internships
                </p>
                <span className="inline-flex items-center gap-2 mt-2 text-xs text-bronze">
                  <span>•</span>
                  <span>Various Locations</span>
                  <span>•</span>
                  <span>Year Round</span>
                </span>
              </div>
            </div>
            <p className="text-sm text-muted line-clamp-3">
              Tesla offers internships across engineering, manufacturing, business, and more for students and recent graduates.
            </p>
            <ButtonLink href="#" className="mt-4">
              Learn More
            </ButtonLink>
          </div>
        </Link>
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-6">
          Have an opportunity to share?
        </h2>
        <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
          Post internships, jobs, collaborations, or programs to reach our community of ambitious students and creators.
        </p>
        <ButtonLink href="/workspace" className="inline-flex items-center gap-2">
          Post an Opportunity
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </ButtonLink>
      </div>
    </div>
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