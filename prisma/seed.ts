import { PrismaClient, UserRole, OrganizationType, MembershipRole, CommunityCategory, EventMode, RegistrationStatus, OpportunityType, ApplicationStatus, TicketTypeCategory, CertificateType, NotificationType, SponsorStage } from "@prisma/client";

const prisma = new PrismaClient();

function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function hoursFromNow(hours: number) {
  const d = new Date();
  d.setHours(d.getHours() + hours);
  return d;
}

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

async function main() {
  console.log("🌱 Seeding Convoke ecosystem...");

  // ─── Organizations ───────────────────────────────────────────
  const orgs = await Promise.all([
    prisma.organization.create({
      data: {
        slug: "plotarmour",
        name: "PlotArmour",
        type: OrganizationType.STARTUP,
        description: "Building India's most ambitious community-tech ecosystem.",
        website: "https://theplotarmour.xyz",
        city: "Delhi",
        state: "Delhi",
        verified: true,
      },
    }),
    prisma.organization.create({
      data: {
        slug: "build-club-india",
        name: "Build Club India",
        type: OrganizationType.COMMUNITY,
        description: "A builder-first community for founders, developers, and designers shipping real products.",
        website: "https://buildclub.in",
        city: "Bangalore",
        state: "Karnataka",
        verified: true,
      },
    }),
    prisma.organization.create({
      data: {
        slug: "techstar-delhi",
        name: "TechStar Delhi",
        type: OrganizationType.COLLEGE_SOCIETY,
        description: "Delhi University's largest tech society bridging campus talent with industry.",
        city: "Delhi",
        state: "Delhi",
        verified: true,
      },
    }),
    prisma.organization.create({
      data: {
        slug: "indie-hackers-mumbai",
        name: "Indie Hackers Mumbai",
        type: OrganizationType.CREATOR_COLLECTIVE,
        description: "Bootstrapped founders and indie makers building profitable products together.",
        city: "Mumbai",
        state: "Maharashtra",
        verified: true,
      },
    }),
    prisma.organization.create({
      data: {
        slug: "growthx-labs",
        name: "GrowthX Labs",
        type: OrganizationType.STARTUP,
        description: "Growth marketing collective helping startups achieve product-market fit.",
        website: "https://growthx.club",
        city: "Bangalore",
        state: "Karnataka",
        verified: true,
      },
    }),
    prisma.organization.create({
      data: {
        slug: "startup-grind-bangalore",
        name: "Startup Grind Bangalore",
        type: OrganizationType.COMMUNITY,
        description: "Educating, inspiring, and connecting founders in India's startup capital.",
        city: "Bangalore",
        state: "Karnataka",
        verified: true,
      },
    }),
    prisma.organization.create({
      data: {
        slug: "open-source-india",
        name: "Open Source India",
        type: OrganizationType.COMMUNITY,
        description: "India's open-source movement — contributing, learning, and shipping together.",
        city: "Hyderabad",
        state: "Telangana",
        verified: true,
      },
    }),
    prisma.organization.create({
      data: {
        slug: "campus-connect-network",
        name: "Campus Connect",
        type: OrganizationType.PLATFORM,
        description: "Connecting college students across India with events, internships, and communities.",
        city: "Pune",
        state: "Maharashtra",
        verified: true,
      },
    }),
  ]);

  console.log(`✅ Created ${orgs.length} organizations`);

  // ─── Users ───────────────────────────────────────────────────
  const usersData = [
    { name: "Arjun Mehta", username: "arjunmehta", email: "arjun@convoke.app", role: UserRole.ORGANIZER, headline: "Co-founder at PlotArmour | Community builder", city: "Delhi", skills: ["Community Building", "Product Strategy", "Event Management"], interests: ["Startups", "Design", "Community"] },
    { name: "Priya Sharma", username: "priyasharma", email: "priya@convoke.app", role: UserRole.ORGANIZER, headline: "Community lead at Build Club India", city: "Bangalore", skills: ["Marketing", "Content Strategy", "Growth"], interests: ["Growth", "Marketing", "Creator Economy"] },
    { name: "Rohan Kapoor", username: "rohankapoor", email: "rohan@convoke.app", role: UserRole.COMMUNITY_ADMIN, headline: "President, TechStar Delhi | Full-stack developer", city: "Delhi", skills: ["React", "Node.js", "System Design", "Python"], interests: ["Open Source", "AI", "Web3"] },
    { name: "Neha Gupta", username: "nehagupta", email: "neha@convoke.app", role: UserRole.PARTICIPANT, headline: "CS undergrad | Open source contributor", city: "Mumbai", skills: ["Python", "Machine Learning", "Data Science"], interests: ["AI", "Research", "Open Source"] },
    { name: "Karan Singh", username: "karansingh", email: "karan@convoke.app", role: UserRole.CREATOR, headline: "Design creator | 45K on Instagram", city: "Bangalore", skills: ["UI/UX Design", "Figma", "Branding", "Motion Design"], interests: ["Design", "Creator Economy", "Branding"] },
    { name: "Ananya Reddy", username: "ananyareddy", email: "ananya@convoke.app", role: UserRole.PARTICIPANT, headline: "Final year B.Tech | Looking for SDE roles", city: "Hyderabad", skills: ["Java", "DSA", "Spring Boot", "React"], interests: ["Startups", "Backend", "System Design"] },
    { name: "Vikram Joshi", username: "vikramjoshi", email: "vikram@convoke.app", role: UserRole.ORGANIZER, headline: "Startup Grind Bangalore Chapter Director", city: "Bangalore", skills: ["Entrepreneurship", "Public Speaking", "Fundraising"], interests: ["Startups", "VC", "Leadership"] },
    { name: "Sneha Patel", username: "snehapatel", email: "sneha@convoke.app", role: UserRole.VOLUNTEER, headline: "Volunteer coordinator | Event enthusiast", city: "Pune", skills: ["Event Management", "Coordination", "Social Media"], interests: ["Events", "Volunteering", "Social Impact"] },
    { name: "Aditya Kumar", username: "adityakumar", email: "aditya@convoke.app", role: UserRole.STARTUP, headline: "Building an AI startup | YC S24 applicant", city: "Delhi", skills: ["AI/ML", "Product Management", "Fundraising", "Python"], interests: ["AI", "Startups", "Product"] },
    { name: "Ishita Verma", username: "ishitaverma", email: "ishita@convoke.app", role: UserRole.PARTICIPANT, headline: "MBA student | Aspiring product manager", city: "Mumbai", skills: ["Product Management", "Analytics", "SQL", "Strategy"], interests: ["Product", "Strategy", "Startups"] },
    { name: "Rahul Desai", username: "rahuldesai", email: "rahul@convoke.app", role: UserRole.CREATOR, headline: "Tech YouTuber | 120K subscribers", city: "Pune", skills: ["Video Production", "Technical Writing", "Public Speaking"], interests: ["Creator Economy", "Tech", "Education"] },
    { name: "Meera Nair", username: "meeranair", email: "meera@convoke.app", role: UserRole.PARTICIPANT, headline: "Frontend developer | React enthusiast", city: "Chennai", skills: ["React", "TypeScript", "Next.js", "CSS"], interests: ["Frontend", "Design Systems", "Open Source"] },
    { name: "Siddharth Rao", username: "siddharthrao", email: "siddharth@convoke.app", role: UserRole.ORGANIZER, headline: "Open Source India maintainer", city: "Hyderabad", skills: ["Go", "Kubernetes", "DevOps", "Open Source"], interests: ["Open Source", "Cloud", "Infrastructure"] },
    { name: "Kavya Iyer", username: "kavyaiyer", email: "kavya@convoke.app", role: UserRole.PARTICIPANT, headline: "UX researcher | Human-centered design", city: "Bangalore", skills: ["UX Research", "Figma", "User Testing", "Design Thinking"], interests: ["Design", "Research", "Psychology"] },
    { name: "Dev Choudhary", username: "devchoudhary", email: "dev@convoke.app", role: UserRole.SPONSOR, headline: "Partnerships lead at a Series B startup", city: "Delhi", skills: ["Business Development", "Partnerships", "Sales"], interests: ["Startups", "Growth", "Networking"] },
    { name: "Tanya Bose", username: "tanyabose", email: "tanya@convoke.app", role: UserRole.PARTICIPANT, headline: "Data analyst | Kaggle expert", city: "Kolkata", skills: ["Python", "SQL", "Tableau", "Statistics"], interests: ["Data Science", "AI", "Analytics"] },
    { name: "Manish Agarwal", username: "manishagarwal", email: "manish@convoke.app", role: UserRole.ORGANIZER, headline: "GrowthX community manager", city: "Bangalore", skills: ["Community Management", "Growth Marketing", "Analytics"], interests: ["Growth", "Community", "Marketing"] },
    { name: "Riya Saxena", username: "riyasaxena", email: "riya@convoke.app", role: UserRole.PARTICIPANT, headline: "Aspiring designer | Learning Figma", city: "Jaipur", skills: ["Figma", "Illustration", "Canva"], interests: ["Design", "Art", "Branding"] },
    { name: "Aarav Malhotra", username: "aaravmalhotra", email: "aarav@convoke.app", role: UserRole.PARTICIPANT, headline: "2nd year CS student | Competitive programmer", city: "Chennai", skills: ["C++", "DSA", "Competitive Programming"], interests: ["Algorithms", "Competitive Programming", "Open Source"] },
    { name: "Diya Chopra", username: "diyachopra", email: "diya@convoke.app", role: UserRole.PARTICIPANT, headline: "Social impact enthusiast | NGO volunteer", city: "Delhi", skills: ["Project Management", "Fundraising", "Content Writing"], interests: ["Social Impact", "NGO", "Education"] },
  ];

  const users = await Promise.all(
    usersData.map((u) =>
      prisma.user.create({
        data: {
          email: u.email,
          username: u.username,
          clerkId: `user_seed_${u.username}`,
          displayName: u.name,
          role: u.role,
          headline: u.headline,
          bio: `${u.headline}. Active in the Indian startup and community ecosystem.`,
          city: u.city,
          skills: u.skills,
          interests: u.interests,
          badges: u.role === UserRole.ORGANIZER ? ["Organizer", "Early Adopter"] : ["Early Adopter"],
          reputation: Math.floor(Math.random() * 400) + 50,
        },
      }),
    ),
  );

  console.log(`✅ Created ${users.length} users`);

  // ─── Memberships (users → organizations) ─────────────────────
  const membershipPairs = [
    [0, 0, MembershipRole.OWNER],
    [1, 1, MembershipRole.OWNER],
    [2, 2, MembershipRole.OWNER],
    [3, 3, MembershipRole.ADMIN],
    [4, 4, MembershipRole.OWNER],
    [6, 5, MembershipRole.OWNER],
    [12, 6, MembershipRole.OWNER],
    [7, 7, MembershipRole.ADMIN],
    [8, 0, MembershipRole.MEMBER],
    [16, 4, MembershipRole.ADMIN],
  ] as const;

  await Promise.all(
    membershipPairs.map(([ui, oi, role]) =>
      prisma.membership.create({
        data: { userId: users[ui].id, organizationId: orgs[oi].id, role },
      }),
    ),
  );

  console.log("✅ Created memberships");

  // ─── Communities ─────────────────────────────────────────────
  const communitiesData = [
    { orgIdx: 0, name: "PlotArmour Community", category: CommunityCategory.STARTUP, tagline: "Where ambition meets execution", city: "Delhi", members: 2400, momentum: 92, featured: true },
    { orgIdx: 1, name: "Build Club India", category: CommunityCategory.STARTUP, tagline: "Ship products, not slide decks", city: "Bangalore", members: 1800, momentum: 88, featured: true },
    { orgIdx: 2, name: "TechStar Delhi", category: CommunityCategory.COLLEGE, tagline: "Delhi University's tech powerhouse", city: "Delhi", members: 950, momentum: 76, featured: true },
    { orgIdx: 3, name: "Indie Hackers Mumbai", category: CommunityCategory.CREATOR, tagline: "Bootstrapped and profitable", city: "Mumbai", members: 640, momentum: 71, featured: false },
    { orgIdx: 4, name: "GrowthX Community", category: CommunityCategory.STARTUP, tagline: "Growth is a team sport", city: "Bangalore", members: 3200, momentum: 95, featured: true },
    { orgIdx: 5, name: "Startup Grind BLR", category: CommunityCategory.STARTUP, tagline: "Educate. Inspire. Connect.", city: "Bangalore", members: 1500, momentum: 82, featured: true },
    { orgIdx: 6, name: "Open Source India", category: CommunityCategory.OPEN_SOURCE, tagline: "Contribute. Learn. Ship.", city: "Hyderabad", members: 2100, momentum: 85, featured: true },
    { orgIdx: 7, name: "Campus Connect", category: CommunityCategory.COLLEGE, tagline: "Every college, one network", city: "Pune", members: 4500, momentum: 90, featured: true },
    { orgIdx: 0, name: "PlotArmour Creators", category: CommunityCategory.CREATOR, tagline: "Creators building together", city: "Delhi", members: 780, momentum: 68, featured: false },
    { orgIdx: 1, name: "AI Builders India", category: CommunityCategory.AI, tagline: "Building the future with AI", city: "Bangalore", members: 1200, momentum: 87, featured: true },
    { orgIdx: 6, name: "Design Open Source", category: CommunityCategory.DESIGN, tagline: "Open-source design systems and tools", city: "Hyderabad", members: 520, momentum: 62, featured: false },
    { orgIdx: 7, name: "Campus Gaming League", category: CommunityCategory.GAMING, tagline: "College esports and gaming culture", city: "Pune", members: 890, momentum: 73, featured: false },
  ];

  const communities = await Promise.all(
    communitiesData.map((c) =>
      prisma.community.create({
        data: {
          slug: slug(c.name),
          organizationId: orgs[c.orgIdx].id,
          name: c.name,
          category: c.category,
          tagline: c.tagline,
          description: `${c.tagline}. Join ${c.members.toLocaleString()} members building, learning, and growing together in ${c.city}.`,
          city: c.city,
          isFeatured: c.featured,
          memberCount: c.members,
          momentumScore: c.momentum,
        },
      }),
    ),
  );

  console.log(`✅ Created ${communities.length} communities`);

  // ─── Community Memberships ───────────────────────────────────
  for (let i = 0; i < users.length; i++) {
    const numCommunities = Math.floor(Math.random() * 3) + 1;
    const communityIndices = new Set<number>();
    while (communityIndices.size < numCommunities) {
      communityIndices.add(Math.floor(Math.random() * communities.length));
    }
    for (const ci of communityIndices) {
      await prisma.communityMembership.create({
        data: {
          userId: users[i].id,
          communityId: communities[ci].id,
          role: i < 5 ? MembershipRole.ADMIN : MembershipRole.MEMBER,
        },
      }).catch(() => {}); // skip duplicates
    }
  }

  console.log("✅ Created community memberships");

  // ─── Events ──────────────────────────────────────────────────
  const eventsData = [
    { orgIdx: 0, comIdx: 0, title: "Converge 2025", short: "India's boldest community-tech summit. 2 days of talks, workshops, and collisions.", category: "Conference", city: "Delhi", mode: EventMode.OFFLINE, days: 14, featured: true, regs: 1240, volunteers: 45, img: "/globe.svg" },
    { orgIdx: 1, comIdx: 1, title: "ShipIt Weekend", short: "48-hour hackathon for builders. Come with an idea, leave with a product.", category: "Hackathon", city: "Bangalore", mode: EventMode.OFFLINE, days: 7, featured: true, regs: 380, volunteers: 20, img: "/globe.svg" },
    { orgIdx: 2, comIdx: 2, title: "Delhi Hacks 4.0", short: "DU's flagship hackathon — 500+ hackers, 24 hours, and ₹5L in prizes.", category: "Hackathon", city: "Delhi", mode: EventMode.OFFLINE, days: 21, featured: true, regs: 520, volunteers: 60, img: "/globe.svg" },
    { orgIdx: 4, comIdx: 4, title: "Growth Masterclass", short: "Learn growth frameworks from operators who scaled to 1M+ users.", category: "Workshop", city: "Bangalore", mode: EventMode.HYBRID, days: 3, featured: true, regs: 850, volunteers: 10, img: "/globe.svg" },
    { orgIdx: 5, comIdx: 5, title: "Founder Fireside: Jan 2025", short: "Intimate fireside chat with a unicorn founder. Limited seats.", category: "Meetup", city: "Bangalore", mode: EventMode.OFFLINE, days: 5, featured: true, regs: 120, volunteers: 8, img: "/globe.svg" },
    { orgIdx: 6, comIdx: 6, title: "Hacktoberfest India Meetup", short: "Celebrate open source. Contribute, learn, and win swag.", category: "Meetup", city: "Hyderabad", mode: EventMode.HYBRID, days: 10, featured: true, regs: 340, volunteers: 15, img: "/globe.svg" },
    { orgIdx: 3, comIdx: 3, title: "Indie Revenue Summit", short: "How bootstrapped founders hit $10K MRR without funding.", category: "Conference", city: "Mumbai", mode: EventMode.ONLINE, days: 28, featured: false, regs: 680, volunteers: 5, img: "/globe.svg" },
    { orgIdx: 7, comIdx: 7, title: "Campus Fest 2025", short: "The largest inter-college fest connecting 100+ campuses.", category: "Festival", city: "Pune", mode: EventMode.OFFLINE, days: 35, featured: true, regs: 2800, volunteers: 120, img: "/globe.svg" },
    { orgIdx: 0, comIdx: 8, title: "Creator Economy Roundtable", short: "15 creators. One room. No cameras. Real talk about building an audience.", category: "Meetup", city: "Delhi", mode: EventMode.OFFLINE, days: -5, featured: false, regs: 15, volunteers: 3, img: "/globe.svg" },
    { orgIdx: 1, comIdx: 9, title: "AI Demo Day", short: "Watch 10 AI startups demo live. Vote for the best product.", category: "Demo Day", city: "Bangalore", mode: EventMode.HYBRID, days: 12, featured: true, regs: 420, volunteers: 12, img: "/globe.svg" },
    { orgIdx: 4, comIdx: 4, title: "Marketing Teardown Night", short: "We pick 5 startups and publicly tear down their marketing. Brutal. Helpful.", category: "Workshop", city: "Bangalore", mode: EventMode.ONLINE, days: 2, featured: false, regs: 290, volunteers: 0, img: "/globe.svg" },
    { orgIdx: 2, comIdx: 2, title: "Resume Roast Workshop", short: "Get your resume reviewed by engineers from FAANG and top startups.", category: "Workshop", city: "Delhi", mode: EventMode.ONLINE, days: -10, featured: false, regs: 180, volunteers: 6, img: "/globe.svg" },
    { orgIdx: 5, comIdx: 5, title: "Pitch Practice Night", short: "Practice your startup pitch in front of real investors. Get feedback.", category: "Meetup", city: "Bangalore", mode: EventMode.OFFLINE, days: 18, featured: false, regs: 45, volunteers: 4, img: "/globe.svg" },
    { orgIdx: 7, comIdx: 11, title: "Inter-College Esports Championship", short: "Valorant and BGMI tournaments across 50+ colleges.", category: "Tournament", city: "Pune", mode: EventMode.HYBRID, days: 25, featured: false, regs: 1600, volunteers: 30, img: "/globe.svg" },
    { orgIdx: 6, comIdx: 10, title: "Design Systems Workshop", short: "Build a production-ready design system from scratch in 3 hours.", category: "Workshop", city: "Hyderabad", mode: EventMode.ONLINE, days: 8, featured: false, regs: 210, volunteers: 0, img: "/globe.svg" },
  ];

  const events = await Promise.all(
    eventsData.map((e) =>
      prisma.event.create({
        data: {
          slug: slug(e.title),
          organizationId: orgs[e.orgIdx].id,
          communityId: communities[e.comIdx].id,
          organizerId: users[e.orgIdx < 4 ? e.orgIdx : 6].id,
          title: e.title,
          shortDescription: e.short,
          description: `${e.short}\n\nJoin ${e.regs.toLocaleString()} others who have already registered. This is going to be an incredible experience.`,
          city: e.city,
          venue: e.mode !== EventMode.ONLINE ? `${e.city} Convention Center` : undefined,
          category: e.category,
          mode: e.mode,
          startsAt: daysFromNow(e.days),
          endsAt: daysFromNow(e.days + (e.category === "Hackathon" ? 2 : 1)),
          heroImageUrl: e.img,
          featured: e.featured,
          registrationsCount: e.regs,
          waitlistCount: Math.floor(e.regs * 0.1),
          volunteerCount: e.volunteers,
          isPaid: e.category === "Conference" || e.category === "Festival",
          ticketTypes: {
            create: [
              {
                name: "General Pass",
                category: TicketTypeCategory.GENERAL,
                priceInr: e.category === "Conference" ? 499 : e.category === "Festival" ? 299 : 0,
                capacity: Math.floor(e.regs * 1.5),
                sold: e.regs,
              },
              ...(e.featured
                ? [
                    {
                      name: "Early Bird",
                      category: TicketTypeCategory.EARLY_BIRD,
                      priceInr: e.category === "Conference" ? 299 : 0,
                      capacity: Math.floor(e.regs * 0.3),
                      sold: Math.floor(e.regs * 0.3),
                    },
                  ]
                : []),
            ],
          },
          schedules: {
            create: [
              { title: "Opening keynote", startsAt: daysFromNow(e.days), endsAt: hoursFromNow(e.days * 24 + 1), location: "Main Stage" },
              { title: "Networking break", startsAt: hoursFromNow(e.days * 24 + 1), endsAt: hoursFromNow(e.days * 24 + 2) },
              { title: "Workshops & breakout sessions", startsAt: hoursFromNow(e.days * 24 + 2), endsAt: hoursFromNow(e.days * 24 + 5) },
            ],
          },
          faqs: {
            create: [
              { question: "Is this event free?", answer: e.category === "Conference" ? "Paid event. Early bird passes available." : "Yes, completely free to attend!", order: 0 },
              { question: "Can I bring a friend?", answer: "Absolutely! Share the registration link with them.", order: 1 },
            ],
          },
          speakers: {
            create: e.featured
              ? [
                  { name: "Invited Speaker", title: "Industry Expert", organization: "Tech Company", bio: "Leading expert in the field." },
                ]
              : [],
          },
        },
      }),
    ),
  );

  console.log(`✅ Created ${events.length} events`);

  // ─── Registrations ───────────────────────────────────────────
  const registrationPairs: [number, number][] = [];
  for (let ui = 0; ui < users.length; ui++) {
    const numEvents = Math.floor(Math.random() * 4) + 1;
    const eventIndices = new Set<number>();
    while (eventIndices.size < numEvents) {
      eventIndices.add(Math.floor(Math.random() * events.length));
    }
    for (const ei of eventIndices) {
      registrationPairs.push([ui, ei]);
    }
  }

  await Promise.all(
    registrationPairs.map(([ui, ei]) =>
      prisma.registration.create({
        data: {
          userId: users[ui].id,
          eventId: events[ei].id,
          status: Math.random() > 0.2 ? RegistrationStatus.APPROVED : RegistrationStatus.PENDING,
          qrCode: `QR-${users[ui].id.slice(0, 6)}-${events[ei].id.slice(0, 6)}-${randomId()}`,
        },
      }).catch(() => {}), // skip duplicates
    ),
  );

  console.log("✅ Created registrations");

  // ─── Opportunities ───────────────────────────────────────────
  const opportunitiesData = [
    { orgIdx: 0, comIdx: 0, title: "Community Growth Intern", type: OpportunityType.INTERNSHIP, location: "Delhi", remote: false, short: "Help scale PlotArmour's community from 2K to 10K members.", skills: ["Community Building", "Social Media", "Content"], stipend: "₹15,000/month", duration: "3 months", positions: 2, featured: true },
    { orgIdx: 1, comIdx: 1, title: "Frontend Developer Intern", type: OpportunityType.INTERNSHIP, location: "Bangalore", remote: true, short: "Build the next version of Build Club's platform with React and Next.js.", skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"], stipend: "₹20,000/month", duration: "6 months", positions: 3, featured: true },
    { orgIdx: 2, comIdx: 2, title: "Campus Ambassador", type: OpportunityType.AMBASSADOR, location: "Delhi", remote: false, short: "Represent TechStar at your college. Organize workshops and recruit talent.", skills: ["Public Speaking", "Event Management", "Networking"], stipend: null, duration: "1 year", positions: 20, featured: true },
    { orgIdx: 4, comIdx: 4, title: "Growth Marketing Associate", type: OpportunityType.STARTUP_HIRING, location: "Bangalore", remote: true, short: "Drive user acquisition for GrowthX's SaaS tools. Data-driven growth.", skills: ["Growth Marketing", "Analytics", "SEO", "Ads"], stipend: "₹6,00,000/year", duration: "Full-time", positions: 1, featured: true },
    { orgIdx: 3, comIdx: 3, title: "Technical Writer", type: OpportunityType.FREELANCE_GIG, location: "Mumbai", remote: true, short: "Write technical tutorials and case studies for indie makers.", skills: ["Technical Writing", "JavaScript", "Markdown"], stipend: "₹2,000/article", duration: "Ongoing", positions: 5, featured: false },
    { orgIdx: 5, comIdx: 5, title: "Event Volunteer Lead", type: OpportunityType.VOLUNTEER_ROLE, location: "Bangalore", remote: false, short: "Lead a team of 20 volunteers for Startup Grind's flagship events.", skills: ["Leadership", "Event Management", "Communication"], stipend: null, duration: "6 months", positions: 2, featured: false },
    { orgIdx: 6, comIdx: 6, title: "Open Source Contributor", type: OpportunityType.VOLUNTEER_ROLE, location: "Remote", remote: true, short: "Contribute to India's top open-source projects. Mentorship included.", skills: ["Git", "Python", "Go", "Documentation"], stipend: null, duration: "Flexible", positions: 10, featured: true },
    { orgIdx: 0, comIdx: 8, title: "Creator Collaboration Manager", type: OpportunityType.CREATOR_COLLABORATION, location: "Delhi", remote: true, short: "Manage collaborations between PlotArmour and 50+ creators.", skills: ["Creator Economy", "Partnerships", "Social Media"], stipend: "₹25,000/month", duration: "6 months", positions: 1, featured: false },
    { orgIdx: 7, comIdx: 7, title: "Campus Coordinator Intern", type: OpportunityType.INTERNSHIP, location: "Pune", remote: false, short: "Coordinate activities across 100+ partner colleges.", skills: ["Coordination", "Communication", "Excel", "Outreach"], stipend: "₹10,000/month", duration: "3 months", positions: 5, featured: true },
    { orgIdx: 1, comIdx: 9, title: "AI Research Intern", type: OpportunityType.INTERNSHIP, location: "Bangalore", remote: true, short: "Work on cutting-edge AI projects with our research team.", skills: ["Python", "PyTorch", "NLP", "Computer Vision"], stipend: "₹30,000/month", duration: "6 months", positions: 2, featured: true },
    { orgIdx: 4, comIdx: 4, title: "Product Design Intern", type: OpportunityType.INTERNSHIP, location: "Bangalore", remote: true, short: "Design user experiences for products used by 10K+ marketers.", skills: ["Figma", "UI/UX", "Prototyping", "Design Systems"], stipend: "₹18,000/month", duration: "3 months", positions: 1, featured: false },
    { orgIdx: 2, comIdx: 2, title: "Social Media Manager", type: OpportunityType.FREELANCE_GIG, location: "Delhi", remote: true, short: "Run TechStar's social media presence across Instagram, LinkedIn, and Twitter.", skills: ["Social Media", "Content Creation", "Analytics", "Canva"], stipend: "₹12,000/month", duration: "Ongoing", positions: 1, featured: false },
    { orgIdx: 5, comIdx: 5, title: "Startup Grind Ambassador", type: OpportunityType.AMBASSADOR, location: "Any city", remote: false, short: "Launch a Startup Grind chapter in your city.", skills: ["Community Building", "Entrepreneurship", "Networking"], stipend: null, duration: "1 year", positions: 10, featured: true },
  ];

  const opportunities = await Promise.all(
    opportunitiesData.map((o, idx) =>
      prisma.opportunity.create({
        data: {
          slug: slug(o.title),
          organizationId: orgs[o.orgIdx].id,
          communityId: communities[o.comIdx].id,
          title: o.title,
          type: o.type,
          location: o.location,
          isRemote: o.remote,
          shortDescription: o.short,
          description: `${o.short}\n\nWe're looking for passionate individuals who want to make an impact. Apply now before positions fill up.`,
          requirements: ["Strong communication skills", "Self-motivated and proactive", "Available for the full duration"],
          skills: o.skills,
          perks: ["Certificate of completion", "Letter of recommendation", "Network access"],
          stipend: o.stipend,
          duration: o.duration,
          applicationDeadline: daysFromNow(Math.floor(Math.random() * 30) + 5),
          positionsAvailable: o.positions,
          featured: o.featured,
          active: true,
        },
      }),
    ),
  );

  console.log(`✅ Created ${opportunities.length} opportunities`);

  // ─── Opportunity Applications ────────────────────────────────
  for (let i = 3; i < Math.min(users.length, 12); i++) {
    const numApps = Math.floor(Math.random() * 3) + 1;
    const oppIndices = new Set<number>();
    while (oppIndices.size < numApps) {
      oppIndices.add(Math.floor(Math.random() * opportunities.length));
    }
    for (const oi of oppIndices) {
      await prisma.opportunityApplication.create({
        data: {
          userId: users[i].id,
          opportunityId: opportunities[oi].id,
          status: [ApplicationStatus.APPLIED, ApplicationStatus.REVIEWING, ApplicationStatus.SHORTLISTED][Math.floor(Math.random() * 3)],
          coverLetter: "I'm excited about this opportunity and believe my skills are a great fit.",
        },
      }).catch(() => {});
    }
  }

  console.log("✅ Created opportunity applications");

  // ─── Activity Feed ───────────────────────────────────────────
  const activities = [
    { user: 0, action: "launched", detail: "Converge 2025 — India's boldest community-tech summit" },
    { user: 3, action: "registered for", detail: "ShipIt Weekend in Bangalore" },
    { user: 4, action: "joined", detail: "PlotArmour Creators community" },
    { user: 5, action: "applied to", detail: "Frontend Developer Intern at Build Club India" },
    { user: 1, action: "published", detail: "3 new opportunities for the Build Club community" },
    { user: 8, action: "registered for", detail: "AI Demo Day in Bangalore" },
    { user: 10, action: "earned", detail: "Participation certificate for Creator Economy Roundtable" },
    { user: 2, action: "launched", detail: "Delhi Hacks 4.0 — registrations open now" },
    { user: 6, action: "hosted", detail: "Founder Fireside with 120 attendees" },
    { user: 9, action: "applied to", detail: "Growth Marketing Associate at GrowthX Labs" },
    { user: 7, action: "volunteered at", detail: "Campus Fest 2025 in Pune" },
    { user: 11, action: "joined", detail: "Open Source India community" },
    { user: 13, action: "applied to", detail: "Product Design Intern at GrowthX Labs" },
    { user: 12, action: "contributed to", detail: "3 open-source projects this month" },
    { user: 15, action: "registered for", detail: "Growth Masterclass — filling fast" },
    { user: 14, action: "partnered with", detail: "PlotArmour for Converge 2025 sponsorship" },
    { user: 16, action: "organized", detail: "Marketing Teardown Night — 290 attendees" },
    { user: 17, action: "joined", detail: "AI Builders India community" },
    { user: 18, action: "registered for", detail: "Delhi Hacks 4.0" },
    { user: 19, action: "applied to", detail: "Campus Coordinator Intern at Campus Connect" },
  ];

  await Promise.all(
    activities.map((a, idx) =>
      prisma.userActivity.create({
        data: {
          userId: users[a.user].id,
          communityId: communities[Math.min(a.user, communities.length - 1)].id,
          actorName: usersData[a.user].name,
          action: a.action,
          detail: a.detail,
          createdAt: new Date(Date.now() - idx * 3600000 * 2), // stagger by 2 hours
        },
      }),
    ),
  );

  console.log("✅ Created activity feed");

  // ─── Certificates ────────────────────────────────────────────
  const certData = [
    { userIdx: 3, title: "Participant — Creator Economy Roundtable", type: CertificateType.PARTICIPATION },
    { userIdx: 5, title: "Participant — Resume Roast Workshop", type: CertificateType.PARTICIPATION },
    { userIdx: 7, title: "Volunteer — Campus Fest 2025", type: CertificateType.VOLUNTEER },
    { userIdx: 10, title: "Participant — Creator Economy Roundtable", type: CertificateType.PARTICIPATION },
    { userIdx: 0, title: "Organizer — Converge 2025", type: CertificateType.ORGANIZER },
    { userIdx: 1, title: "Organizer — ShipIt Weekend", type: CertificateType.ORGANIZER },
    { userIdx: 2, title: "Organizer — Delhi Hacks 4.0", type: CertificateType.ORGANIZER },
    { userIdx: 11, title: "Participant — Hacktoberfest India Meetup", type: CertificateType.PARTICIPATION },
    { userIdx: 4, title: "Creator Badge — PlotArmour", type: CertificateType.BADGE },
    { userIdx: 9, title: "Participant — Growth Masterclass", type: CertificateType.PARTICIPATION },
  ];

  await Promise.all(
    certData.map((c) =>
      prisma.certificate.create({
        data: {
          userId: users[c.userIdx].id,
          eventId: events[Math.min(c.userIdx, events.length - 1)].id,
          type: c.type,
          title: c.title,
          description: `Awarded for participation and contribution.`,
          issuedAt: daysFromNow(-Math.floor(Math.random() * 30)),
        },
      }),
    ),
  );

  console.log("✅ Created certificates");

  // ─── Notifications ───────────────────────────────────────────
  await Promise.all(
    users.slice(0, 10).map((u) =>
      prisma.notification.create({
        data: {
          userId: u.id,
          type: NotificationType.EVENT_REMINDER,
          title: "Welcome to Convoke! 🎉",
          message: "Your profile is live. Discover events, apply to opportunities, and join communities.",
        },
      }),
    ),
  );

  console.log("✅ Created notifications");

  // ─── Sponsor Leads ───────────────────────────────────────────
  await Promise.all([
    prisma.sponsorLead.create({ data: { organizationId: orgs[0].id, eventId: events[0].id, companyName: "Razorpay", contactEmail: "sponsors@razorpay.com", stage: SponsorStage.CONFIRMED, valueInr: 200000 } }),
    prisma.sponsorLead.create({ data: { organizationId: orgs[0].id, eventId: events[0].id, companyName: "Vercel", contactEmail: "partnerships@vercel.com", stage: SponsorStage.NEGOTIATING, valueInr: 150000 } }),
    prisma.sponsorLead.create({ data: { organizationId: orgs[1].id, eventId: events[1].id, companyName: "GitHub", contactEmail: "community@github.com", stage: SponsorStage.CONFIRMED, valueInr: 100000 } }),
    prisma.sponsorLead.create({ data: { organizationId: orgs[2].id, eventId: events[2].id, companyName: "Google for Startups", contactEmail: "india@google.com", stage: SponsorStage.CONTACTED } }),
  ]);

  console.log("✅ Created sponsor leads");

  // ─── Event Sponsors (visible on event pages) ─────────────────
  await Promise.all([
    prisma.eventSponsor.create({ data: { eventId: events[0].id, name: "Razorpay", tier: "Title", benefits: ["Logo on main stage", "Keynote slot", "Booth"] } }),
    prisma.eventSponsor.create({ data: { eventId: events[0].id, name: "Vercel", tier: "Gold", benefits: ["Logo on website", "Workshop slot"] } }),
    prisma.eventSponsor.create({ data: { eventId: events[1].id, name: "GitHub", tier: "Title", benefits: ["Swag for participants", "Prizes"] } }),
    prisma.eventSponsor.create({ data: { eventId: events[7].id, name: "Red Bull", tier: "Title", benefits: ["Energy drinks", "Main stage branding"] } }),
  ]);

  console.log("✅ Created event sponsors");

  // ─── Announcements ───────────────────────────────────────────
  await Promise.all([
    prisma.announcement.create({ data: { organizationId: orgs[0].id, communityId: communities[0].id, title: "Converge 2025 early bird passes are live!", content: "Get 40% off on early bird passes. Limited to the first 200 registrations." } }),
    prisma.announcement.create({ data: { organizationId: orgs[1].id, communityId: communities[1].id, title: "ShipIt Weekend teams forming now", content: "Find your team on our Discord. Solo hackers welcome too!" } }),
    prisma.announcement.create({ data: { organizationId: orgs[2].id, communityId: communities[2].id, title: "Delhi Hacks 4.0 — prize pool increased to ₹5L", content: "Thanks to our sponsors, we've doubled the prize pool. Register now!" } }),
  ]);

  console.log("✅ Created announcements");

  // ─── Bookmarks ───────────────────────────────────────────────
  for (let i = 0; i < 8; i++) {
    await prisma.bookmark.create({
      data: {
        userId: users[i].id,
        eventId: events[(i + 2) % events.length].id,
      },
    }).catch(() => {});
    if (i < 5) {
      await prisma.bookmark.create({
        data: {
          userId: users[i].id,
          opportunityId: opportunities[(i + 1) % opportunities.length].id,
        },
      }).catch(() => {});
    }
  }

  console.log("✅ Created bookmarks");

  console.log("\n🎉 Convoke ecosystem seeded successfully!");
  console.log(`   ${orgs.length} organizations`);
  console.log(`   ${users.length} users`);
  console.log(`   ${communities.length} communities`);
  console.log(`   ${events.length} events`);
  console.log(`   ${opportunities.length} opportunities`);
  console.log(`   ${activities.length} activity feed items`);
  console.log(`   ${certData.length} certificates`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
