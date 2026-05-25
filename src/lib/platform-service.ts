import { NotificationStatus, UserRole } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import type {
  CommunityCard,
  CommunityView,
  DashboardView,
  EventCard,
  EventView,
  OpportunityCard,
  OpportunityView,
  ProfileView,
  SpotlightPerson,
} from "@/lib/platform-types";
import { getAuthenticatedDbUser } from "@/lib/viewer";

type ViewerContext = {
  userId: string | null;
  username: string | null;
};

function logDataAccessError(scope: string, error: unknown) {
  console.error(`[platform-service:${scope}]`, error);
}

function prismaSafe() {
  try {
    if (!process.env.DATABASE_URL) return null;
    return getPrisma();
  } catch {
    return null;
  }
}

function formatRole(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(value: Date | null | undefined, withTime = false) {
  if (!value) return "Open";
  return new Intl.DateTimeFormat("en-IN", withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "medium" }).format(value);
}

function relativeDate(value: Date) {
  const diffMs = Date.now() - value.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function palette(index: number) {
  return [
    "from-rust/65 via-black/20 to-steel/35",
    "from-bronze/60 via-black/15 to-rust/35",
    "from-steel/55 via-black/20 to-bronze/35",
    "from-bronze/45 via-black/15 to-steel/35",
  ][index % 4];
}

async function resolveViewer(): Promise<ViewerContext> {
  const prisma = prismaSafe();
  if (!prisma) return { userId: null, username: null };
  try {
    const user = await getAuthenticatedDbUser();
    return user ? { userId: user.id, username: user.username } : { userId: null, username: null };
  } catch {
    return { userId: null, username: null };
  }
}

function mapEventCard(
  event: {
    id: string;
    slug: string;
    title: string;
    shortDescription: string;
    city: string;
    venue: string | null;
    category: string;
    startsAt: Date;
    mode: string;
    heroImageUrl: string | null;
    registrationsCount: number;
    waitlistCount: number;
    featured: boolean;
    organization: { name: string; slug: string };
    community: { name: string; slug: string } | null;
    ticketTypes: { priceInr: number }[];
  },
  index: number,
  state?: { saved?: boolean; registered?: boolean },
): EventCard {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    tagline: event.shortDescription,
    city: event.city,
    venue: event.venue ?? undefined,
    date: formatDate(event.startsAt),
    category: event.category,
    price: event.ticketTypes[0]?.priceInr ?? 0,
    mode: formatRole(event.mode),
    organizer: event.organization.name,
    organizerSlug: event.organization.slug,
    community: event.community?.name,
    communitySlug: event.community?.slug,
    attendees: event.registrationsCount,
    waitlist: event.waitlistCount,
    image: event.heroImageUrl ?? "/window.svg",
    palette: palette(index),
    featured: event.featured,
    saved: state?.saved,
    registered: state?.registered,
  };
}

function mapOpportunityCard(
  opportunity: {
    id: string;
    slug: string;
    title: string;
    type: string;
    location: string;
    isRemote: boolean;
    shortDescription: string;
    skills: string[];
    perks: string[];
    stipend: string | null;
    featured: boolean;
    applicationDeadline: Date | null;
    createdAt: Date;
    organization: { name: string; slug: string };
    community: { name: string; slug: string } | null;
    _count: { applications: number };
  },
  state?: { saved?: boolean; applied?: boolean },
): OpportunityCard {
  return {
    id: opportunity.id,
    slug: opportunity.slug,
    title: opportunity.title,
    organization: opportunity.organization.name,
    organizationSlug: opportunity.organization.slug,
    community: opportunity.community?.name,
    communitySlug: opportunity.community?.slug,
    type: formatRole(opportunity.type),
    location: opportunity.location,
    isRemote: opportunity.isRemote,
    stipend: opportunity.stipend,
    deadlineLabel: formatDate(opportunity.applicationDeadline),
    description: opportunity.shortDescription,
    skills: opportunity.skills,
    perks: opportunity.perks,
    applicants: opportunity._count.applications,
    postedAgo: relativeDate(opportunity.createdAt),
    featured: opportunity.featured,
    saved: state?.saved,
    applied: state?.applied,
  };
}

function mapCommunityCard(
  community: {
    id: string;
    slug: string;
    name: string;
    tagline: string;
    city: string;
    coverImageUrl: string | null;
    category: string;
    memberCount: number;
    momentumScore: number;
    isFeatured: boolean;
  },
): CommunityCard {
  return {
    id: community.id,
    slug: community.slug,
    name: community.name,
    tagline: community.tagline,
    location: community.city,
    members: community.memberCount,
    image: community.coverImageUrl ?? "/globe.svg",
    type: formatRole(community.category),
    momentum: community.momentumScore,
    featured: community.isFeatured,
  };
}

function roleActions(role: string) {
  const base = [
    { title: "Discover what is moving", copy: "Track active events, communities, and openings instead of browsing dead directories.", href: "/discover" },
    { title: "Sharpen your public profile", copy: "Turn communities, projects, and certificates into visible momentum.", href: "/workspace" },
  ];

  if (["ORGANIZER", "COMMUNITY_ADMIN", "PLATFORM_ADMIN"].includes(role)) {
    return [
      { title: "Run your next event", copy: "Own registrations, volunteers, waitlists, and announcements from one graph.", href: "/workspace/organize" },
      { title: "Recruit through opportunities", copy: "Post internships, volunteer roles, creator asks, and startup openings.", href: "/workspace/organize" },
      { title: "Move sponsor and merch workflows", copy: "Keep sponsorship conversations and PlotArmour support inside the same operating surface.", href: "/merch" },
    ];
  }

  return base;
}

async function getBookmarkState(viewerId: string | null) {
  const prisma = prismaSafe();
  if (!prisma || !viewerId) {
    return { eventIds: new Set<string>(), opportunityIds: new Set<string>(), communityIds: new Set<string>() };
  }

  try {
    const bookmarks = await prisma.bookmark.findMany({ where: { userId: viewerId } });
    return {
      eventIds: new Set(bookmarks.map((bookmark) => bookmark.eventId).filter(Boolean) as string[]),
      opportunityIds: new Set(bookmarks.map((bookmark) => bookmark.opportunityId).filter(Boolean) as string[]),
      communityIds: new Set(bookmarks.map((bookmark) => bookmark.communityId).filter(Boolean) as string[]),
    };
  } catch (error) {
    logDataAccessError("getBookmarkState", error);
    return { eventIds: new Set<string>(), opportunityIds: new Set<string>(), communityIds: new Set<string>() };
  }
}

export async function listHomeData() {
  const prisma = prismaSafe();
  if (!prisma) {
    return {
      events: [] as EventCard[],
      opportunities: [] as OpportunityCard[],
      communities: [] as CommunityCard[],
      people: [] as SpotlightPerson[],
      activity: [] as DashboardView["activity"],
      counts: { communities: 0, opportunities: 0, people: 0, events: 0 },
    };
  }

  try {
    const viewer = await resolveViewer();
    const bookmarkState = await getBookmarkState(viewer.userId);

    const [events, opportunities, communities, people, activity] = await Promise.all([
      prisma.event.findMany({
        where: { featured: true },
        take: 6,
        orderBy: [{ startsAt: "asc" }],
        include: {
          organization: true,
          community: true,
          ticketTypes: true,
          registrations: { where: { userId: viewer.userId ?? "" }, select: { id: true } },
        },
      }),
      prisma.opportunity.findMany({
        where: { active: true },
        take: 6,
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        include: {
          organization: true,
          community: true,
          _count: { select: { applications: true } },
          applications: { where: { userId: viewer.userId ?? "" }, select: { id: true } },
        },
      }),
      prisma.community.findMany({
        take: 6,
        orderBy: [{ isFeatured: "desc" }, { momentumScore: "desc" }],
      }),
      prisma.user.findMany({
        take: 8,
        orderBy: [{ createdAt: "desc" }],
        include: {
          
          communityMemberships: { include: { community: true } },
        },
      }),
      prisma.userActivity.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      events: events.map((event, index) =>
        mapEventCard(event, index, {
          saved: bookmarkState.eventIds.has(event.id),
          registered: Array.isArray(event.registrations) ? event.registrations.length > 0 : false,
        }),
      ),
      opportunities: opportunities.map((opportunity) =>
        mapOpportunityCard(opportunity, {
          saved: bookmarkState.opportunityIds.has(opportunity.id),
          applied: Array.isArray(opportunity.applications) ? opportunity.applications.length > 0 : false,
        }),
      ),
      communities: communities.map((community) => mapCommunityCard(community)),
      people: people.map((person) => ({
        id: person.id,
        username: person.username,
        name: person.displayName,
        initials: initials(person.displayName),
        role: formatRole(person.role),
        headline: person.headline ?? "Community member",
        community: person.communityMemberships[0]?.community.name,
        reputation: person.reputation ?? 0,
      })),
      activity: activity.map((item) => ({
        id: item.id,
        actor: item.actorName,
        action: item.action,
        detail: item.detail,
        createdAt: relativeDate(item.createdAt),
      })),
      counts: {
        communities: communities.length,
        opportunities: opportunities.length,
        people: people.length,
        events: events.length,
      },
    };
  } catch (error) {
    logDataAccessError("listHomeData", error);
    return {
      events: [] as EventCard[],
      opportunities: [] as OpportunityCard[],
      communities: [] as CommunityCard[],
      people: [] as SpotlightPerson[],
      activity: [] as DashboardView["activity"],
      counts: { communities: 0, opportunities: 0, people: 0, events: 0 },
    };
  }
}

export async function getHomepageStats() {
  const prisma = prismaSafe();
  if (!prisma) return ["0 communities", "0 opportunities", "0 active profiles", "0 live events"];
  try {
    const [communities, opportunities, users, events] = await Promise.all([
      prisma.community.count(),
      prisma.opportunity.count({ where: { active: true } }),
      prisma.user.count(),
      prisma.event.count(),
    ]);
    return [`${communities} communities`, `${opportunities} opportunities`, `${users} active profiles`, `${events} live events`];
  } catch (error) {
    logDataAccessError("getHomepageStats", error);
    return ["0 communities", "0 opportunities", "0 active profiles", "0 live events"];
  }
}

export async function listOpportunityDirectory() {
  const prisma = prismaSafe();
  if (!prisma) return [] as OpportunityCard[];
  try {
    const viewer = await resolveViewer();
    const bookmarkState = await getBookmarkState(viewer.userId);
    const appliedIds = viewer.userId
      ? new Set(
          (
            await prisma.opportunityApplication.findMany({
              where: { userId: viewer.userId },
              select: { opportunityId: true },
            })
          ).map((application) => application.opportunityId),
        )
      : new Set<string>();

    const opportunities = await prisma.opportunity.findMany({
      where: { active: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      include: {
        organization: true,
        community: true,
        _count: { select: { applications: true } },
      },
    });

    return opportunities.map((opportunity) =>
      mapOpportunityCard(opportunity, {
        saved: bookmarkState.opportunityIds.has(opportunity.id),
        applied: appliedIds.has(opportunity.id),
      }),
    );
  } catch (error) {
    logDataAccessError("listOpportunityDirectory", error);
    return [] as OpportunityCard[];
  }
}

export async function getOpportunityPageData(slug: string): Promise<OpportunityView | null> {
  const prisma = prismaSafe();
  if (!prisma) return null;
  try {
    const viewer = await resolveViewer();
    const bookmarkState = await getBookmarkState(viewer.userId);

    const opportunity = await prisma.opportunity.findUnique({
      where: { slug },
      include: {
        organization: true,
        community: true,
        _count: { select: { applications: true } },
      },
    });

    if (!opportunity) return null;

    const applied = viewer.userId
      ? Boolean(
          await prisma.opportunityApplication.findFirst({
            where: { userId: viewer.userId, opportunityId: opportunity.id },
            select: { id: true },
          }),
        )
      : false;

    const relatedItems = await prisma.opportunity.findMany({
      where: {
        active: true,
        id: { not: opportunity.id },
        OR: [
          { organizationId: opportunity.organizationId },
          ...(opportunity.communityId ? [{ communityId: opportunity.communityId }] : []),
          { type: opportunity.type },
        ],
      },
      include: {
        organization: true,
        community: true,
        _count: { select: { applications: true } },
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 3,
    });

    return {
      ...mapOpportunityCard(opportunity, {
        saved: bookmarkState.opportunityIds.has(opportunity.id),
        applied,
      }),
      organizationDescription: opportunity.organization.description,
      positionsAvailable: opportunity.positionsAvailable,
      duration: opportunity.duration,
      requirements: opportunity.requirements,
      related: relatedItems.map((item) =>
        mapOpportunityCard(item, {
          saved: bookmarkState.opportunityIds.has(item.id),
        }),
      ),
    };
  } catch (error) {
    logDataAccessError("getOpportunityPageData", error);
    return null;
  }
}

export async function listCommunityDirectory() {
  const prisma = prismaSafe();
  if (!prisma) return [] as CommunityCard[];
  try {
    const communities = await prisma.community.findMany({
      orderBy: [{ isFeatured: "desc" }, { momentumScore: "desc" }, { memberCount: "desc" }],
    });
    return communities.map((community) => mapCommunityCard(community));
  } catch (error) {
    logDataAccessError("listCommunityDirectory", error);
    return [] as CommunityCard[];
  }
}

export async function getCommunityPageData(slug: string): Promise<CommunityView | null> {
  const prisma = prismaSafe();
  if (!prisma) return null;
  try {
    const viewer = await resolveViewer();
    const bookmarkState = await getBookmarkState(viewer.userId);

    const community = await prisma.community.findUnique({
      where: { slug },
      include: {
        organization: true,
        members: {
          include: {
            user: true,
          },
          take: 10,
          orderBy: { joinedAt: "desc" },
        },
        events: {
          orderBy: { startsAt: "asc" },
          include: { organization: true, community: true, ticketTypes: true },
        },
        opportunities: {
          where: { active: true },
          orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
          include: { organization: true, community: true, _count: { select: { applications: true } } },
        },
        announcements: {
          orderBy: { publishedAt: "desc" },
          take: 6,
        },
      },
    });

    if (!community) return null;

    const joined = viewer.userId
      ? Boolean(
          await prisma.communityMembership.findFirst({
            where: { userId: viewer.userId, communityId: community.id },
            select: { id: true },
          }),
        )
      : false;

    const galleries = await prisma.gallery.findMany({
      where: {
        OR: [
          { event: { is: { communityId: community.id } } },
          { organizationId: community.organizationId },
        ],
      },
      take: 2,
      include: { items: { orderBy: { order: "asc" } } },
    });

    return {
      id: community.id,
      slug: community.slug,
      name: community.name,
      type: formatRole(community.category),
      description: community.description,
      website: community.organization.website ?? undefined,
      avatarUrl: community.organization.logoUrl ?? undefined,
      bannerUrl: community.coverImageUrl ?? community.organization.bannerUrl ?? undefined,
      location: community.city,
      momentum: community.momentumScore,
      joined,
      stats: [
        { label: "Members", value: community.memberCount.toLocaleString("en-IN") },
        { label: "Momentum", value: `${community.momentumScore}/100` },
        { label: "Events", value: String(community.events.length) },
        { label: "Opportunities", value: String(community.opportunities.length) },
      ],
      links: [
        ...(community.organization.website ? [{ label: "Website", href: community.organization.website }] : []),
        { label: "Organization", href: `/communities/${community.slug}` },
      ],
      events: community.events.map((event, index) =>
        mapEventCard(event, index, { saved: bookmarkState.eventIds.has(event.id) }),
      ),
      opportunities: community.opportunities.map((opportunity) =>
        mapOpportunityCard(opportunity, { saved: bookmarkState.opportunityIds.has(opportunity.id) }),
      ),
      members: community.members.map((membership) => ({
        id: membership.user.id,
        username: membership.user.username,
        name: membership.user.displayName,
        initials: initials(membership.user.displayName),
        role: formatRole(membership.role),
        headline: membership.user.headline ?? membership.user.bannerUrl ?? "Community member",
        community: community.name,
        reputation: membership.user.reputation ?? 0,
      })),
      announcements: community.announcements.map((announcement) => ({
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        publishedAt: formatDate(announcement.publishedAt),
      })),
      galleries: galleries.map((gallery) => ({
        id: gallery.id,
        title: gallery.title,
        items: gallery.items.map((item) => item.url),
      })),
    };
  } catch (error) {
    logDataAccessError("getCommunityPageData", error);
    return null;
  }
}

export async function getEventPageData(slug: string): Promise<EventView | null> {
  const prisma = prismaSafe();
  if (!prisma) return null;
  try {
    const viewer = await resolveViewer();
    const bookmarkState = await getBookmarkState(viewer.userId);

    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        organization: true,
        community: true,
        ticketTypes: true,
        schedules: { orderBy: { startsAt: "asc" } },
        tracks: { orderBy: { order: "asc" } },
        faqs: { orderBy: { order: "asc" } },
        speakers: true,
        judges: true,
        sponsors: true,
        galleries: { include: { items: { orderBy: { order: "asc" } } } },
      },
    });

    if (!event) return null;

    const registration = viewer.userId
      ? await prisma.registration.findFirst({ where: { userId: viewer.userId, eventId: event.id } })
      : null;

    return {
      id: event.id,
      slug: event.slug,
      title: event.title,
      tagline: event.shortDescription,
      city: event.city,
      venue: event.venue ?? undefined,
      date: `${formatDate(event.startsAt, true)} to ${formatDate(event.endsAt, true)}`,
      category: event.category,
      mode: formatRole(event.mode),
      organizer: event.organization.name,
      organizerSlug: event.organization.slug,
      community: event.community?.name,
      communitySlug: event.community?.slug,
      description: event.description,
      image: event.heroImageUrl ?? "/window.svg",
      palette: palette(0),
      attendees: event.registrationsCount,
      volunteers: event.volunteerCount,
      price: event.ticketTypes[0]?.priceInr ?? 0,
      waitlist: event.waitlistCount,
      saved: bookmarkState.eventIds.has(event.id),
      registered: Boolean(registration),
      ticketTypes: event.ticketTypes.map((ticket) => ({
        id: ticket.id,
        name: ticket.name,
        priceInr: ticket.priceInr,
        sold: ticket.sold,
        capacity: ticket.capacity,
      })),
      schedules: event.schedules.map((schedule) => ({
        id: schedule.id,
        title: schedule.title,
        description: schedule.description ?? undefined,
        startsAt: formatDate(schedule.startsAt, true),
        endsAt: formatDate(schedule.endsAt, true),
        location: schedule.location ?? undefined,
      })),
      tracks: event.tracks.map((track) => ({
        id: track.id,
        name: track.name,
        description: track.description ?? undefined,
      })),
      speakers: event.speakers.map((speaker) => ({
        id: speaker.id,
        name: speaker.name,
        title: speaker.title ?? "",
        organization: speaker.organization ?? undefined,
        bio: speaker.bio ?? undefined,
        talkTitle: speaker.talkTitle ?? undefined,
      })),
      judges: event.judges.map((judge) => ({
        id: judge.id,
        name: judge.name,
        title: judge.title ?? undefined,
        organization: judge.organization ?? undefined,
        bio: judge.bio ?? undefined,
      })),
      sponsors: event.sponsors.map((sponsor) => ({
        id: sponsor.id,
        companyName: sponsor.name,
        tier: sponsor.tier,
        benefits: sponsor.benefits,
      })),
      faqs: event.faqs.map((faq) => ({ q: faq.question, a: faq.answer })),
      galleries: event.galleries.flatMap((gallery) => gallery.items.map((item) => item.url)),
    };
  } catch (error) {
    logDataAccessError("getEventPageData", error);
    return null;
  }
}

export async function getProfilePageData(username: string): Promise<ProfileView | null> {
  const prisma = prismaSafe();
  if (!prisma) return null;
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        
        communityMemberships: { include: { community: true } },
        memberships: { include: { organization: true } },
        projects: true,
        registrations: { include: { event: true }, orderBy: { createdAt: "desc" }, take: 6 },
        certificates: { orderBy: { issuedAt: "desc" }, take: 8 },
        opportunityApplications: { include: { opportunity: true }, orderBy: { createdAt: "desc" }, take: 5 },
      },
    });

    if (!user) return null;

    const visibleRole = formatRole(user.role);
    const eventRoles = user.registrations.map((registration) => ({
      id: registration.event.id,
      title: registration.event.title,
      role: formatRole(registration.status),
      slug: registration.event.slug,
    }));

    const activityTimeline = [
      ...user.registrations.map(r => ({
        id: `reg-${r.id}`,
        type: 'event',
        title: r.event.title,
        date: formatDate(r.createdAt),
        description: `Registered for event`,
        timestamp: r.createdAt.getTime()
      })),
      ...user.communityMemberships.map(m => ({
        id: `com-${m.id}`,
        type: 'community',
        title: m.community.name,
        date: formatDate(m.joinedAt),
        description: `Joined community`,
        timestamp: m.joinedAt.getTime()
      })),
      ...user.opportunityApplications.map(a => ({
        id: `opp-${a.id}`,
        type: 'opportunity',
        title: a.opportunity.title,
        date: formatDate(a.createdAt),
        description: `Applied for opportunity`,
        timestamp: a.createdAt.getTime()
      }))
    ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);

    return {
      id: user.id,
      username: user.username,
      name: user.displayName,
      role: visibleRole,
      headline: user.headline ?? "Community member",
      bio: user.bio ?? "Building through communities, opportunities, and events on Convoke.",
      avatarFallback: initials(user.displayName),
      location: user.city ?? undefined,
      website: user.bannerUrl ?? undefined,
      reputation: user.reputation ?? 0,
      socials: [
        user.bannerUrl ? { label: "LinkedIn", href: (user.socials as any)?.linkedinUrl } : null,
        user.bannerUrl ? { label: "GitHub", href: (user.socials as any)?.githubUrl } : null,
        user.bannerUrl ? { label: "Instagram", href: (user.socials as any)?.instagramUrl } : null,
        user.bannerUrl ? { label: "Portfolio", href: (user.socials as any)?.portfolioUrl } : null,
      ].filter(Boolean) as { label: string; href: string }[],
      badges: user.badges ?? [],
      skills: user.skills ?? [],
      interests: user.interests ?? [],
      stats: [
        { label: "Reputation", value: String(user.reputation ?? 0) },
        { label: "Communities", value: String(user.communityMemberships.length) },
        { label: "Events", value: String(user.registrations.length) },
        { label: "Certificates", value: String(user.certificates.length) },
      ],
      experiences: user.memberships.map((membership) => ({
        id: membership.id,
        title: membership.title ?? formatRole(membership.role),
        org: membership.organization.name,
        period: `Joined ${formatDate(membership.joinedAt)}`,
        description: membership.organization.description,
      })),
      projects: (user.projectsData as any[]) || [],
      communities: user.communityMemberships.map((membership) => ({
        id: membership.community.id,
        name: membership.community.name,
        role: formatRole(membership.role),
        slug: membership.community.slug,
      })),
      recentEvents: eventRoles,
      certificates: user.certificates.map((certificate) => ({
        id: certificate.id,
        title: certificate.title,
        type: formatRole(certificate.type),
        issuedAt: formatDate(certificate.issuedAt),
      })),
      memberSince: formatDate(user.createdAt),
      activityTimeline: activityTimeline.map(({ id, type, title, date, description }) => ({ id, type, title, date, description })),
    };
  } catch (error) {
    logDataAccessError("getProfilePageData", error);
    return null;
  }
}

function emptyDashboard(): DashboardView {
  return {
    viewer: {
      id: "guest",
      username: "guest",
      name: "Guest",
      initials: "G",
      role: "Participant",
      headline: "Sign in to start building momentum on Convoke",
    },
    role: "PARTICIPANT",
    metrics: [],
    roleActions: roleActions("PARTICIPANT"),
    activity: [],
    bookmarks: { events: [], opportunities: [], communities: [] },
    registrations: [],
    applications: [],
    certificates: [],
    communities: [],
    notifications: [],
  };
}

export async function getDashboardData(): Promise<DashboardView> {
  const prisma = prismaSafe();
  if (!prisma) return emptyDashboard();
  try {
    const viewer = await resolveViewer();
    if (!viewer.userId) return emptyDashboard();

    const user = await prisma.user.findUnique({
      where: { id: viewer.userId },
      include: {
        
        memberships: { include: { organization: true } },
        communityMemberships: { include: { community: true } },
      },
    });

    if (!user) return emptyDashboard();

    const bookmarkState = await getBookmarkState(user.id);

    const [savedEvents, savedOpportunities, savedCommunities, registrations, applications, certificates, notifications, activity] = await Promise.all([
      bookmarkState.eventIds.size
        ? prisma.event.findMany({
            where: { id: { in: [...bookmarkState.eventIds] } },
            include: { organization: true, community: true, ticketTypes: true },
          })
        : Promise.resolve([]),
      bookmarkState.opportunityIds.size
        ? prisma.opportunity.findMany({
            where: { id: { in: [...bookmarkState.opportunityIds] } },
            include: { organization: true, community: true, _count: { select: { applications: true } } },
          })
        : Promise.resolve([]),
      bookmarkState.communityIds.size
        ? prisma.community.findMany({
            where: { id: { in: [...bookmarkState.communityIds] } },
          })
        : Promise.resolve([]),
      prisma.registration.findMany({
        where: { userId: user.id },
        include: { event: true, ticketType: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.opportunityApplication.findMany({
        where: { userId: user.id },
        include: { opportunity: { include: { organization: true } } },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.certificate.findMany({
        where: { userId: user.id },
        orderBy: { issuedAt: "desc" },
        take: 8,
      }),
      prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.userActivity.findMany({
        where: {
          OR: [
            { userId: user.id },
            { communityId: { in: user.communityMemberships.map((membership) => membership.communityId) } },
          ],
        },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ]);

    const dashboard: DashboardView = {
      viewer: {
        id: user.id,
        username: user.username,
        name: user.displayName,
        initials: initials(user.displayName),
        role: formatRole(user.role),
        headline: user.headline ?? "Community member",
        community: user.communityMemberships[0]?.community.name,
        reputation: user.reputation ?? 0,
      },
      role: user.role,
      metrics: [
        { label: "Applications", value: String(applications.length), detail: "Active opportunity pipeline across the ecosystem" },
        { label: "Registrations", value: String(registrations.length), detail: "Events you are already attached to" },
        { label: "Communities", value: String(user.communityMemberships.length), detail: "Rooms where your identity now compounds" },
        { label: "Reputation", value: String(user.reputation ?? 0), detail: "Public proof from participation and output" },
      ],
      roleActions: roleActions(user.role),
      activity: activity.map((item) => ({
        id: item.id,
        actor: item.actorName,
        action: item.action,
        detail: item.detail,
        createdAt: relativeDate(item.createdAt),
      })),
      bookmarks: {
        events: savedEvents.map((event, index) => mapEventCard(event, index, { saved: true })),
        opportunities: savedOpportunities.map((opportunity) => mapOpportunityCard(opportunity, { saved: true })),
        communities: savedCommunities.map((community) => mapCommunityCard(community)),
      },
      registrations: registrations.map((registration) => ({
        id: registration.id,
        eventTitle: registration.event.title,
        eventSlug: registration.event.slug,
        status: formatRole(registration.status),
        ticketType: registration.ticketType?.name,
        createdAt: formatDate(registration.createdAt),
      })),
      applications: applications.map((application) => ({
        id: application.id,
        title: application.opportunity.title,
        organization: application.opportunity.organization.name,
        status: formatRole(application.status),
        appliedAt: formatDate(application.createdAt),
      })),
      certificates: certificates.map((certificate) => ({
        id: certificate.id,
        title: certificate.title,
        type: formatRole(certificate.type),
        issuedAt: formatDate(certificate.issuedAt),
      })),
      communities: user.communityMemberships.map((membership) => ({
        id: membership.community.id,
        slug: membership.community.slug,
        name: membership.community.name,
        role: formatRole(membership.role),
      })),
      notifications: notifications.map((notification) => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        createdAt: relativeDate(notification.createdAt),
        unread: notification.status === NotificationStatus.UNREAD,
      })),
    };

    if (([UserRole.ORGANIZER, UserRole.COMMUNITY_ADMIN, UserRole.PLATFORM_ADMIN] as UserRole[]).includes(user.role)) {
      const organizationIds = user.memberships.map((membership) => membership.organizationId);
      const [orgEvents, orgOpportunities, orgRegistrations, volunteerApplications, opportunityApplications, sponsorLeads, merchInquiries, studioRequests] = await Promise.all([
        prisma.event.findMany({
          where: { organizationId: { in: organizationIds } },
          include: { organization: true, community: true, ticketTypes: true },
          orderBy: { startsAt: "asc" },
        }),
        prisma.opportunity.findMany({
          where: { organizationId: { in: organizationIds } },
          include: { organization: true, community: true, _count: { select: { applications: true } } },
          orderBy: { createdAt: "desc" },
        }),
        prisma.registration.findMany({
          where: { event: { is: { organizationId: { in: organizationIds } } } },
          include: { user: true, event: true },
          orderBy: { createdAt: "desc" },
          take: 12,
        }),
        prisma.volunteerApplication.findMany({
          where: { event: { is: { organizationId: { in: organizationIds } } } },
          include: { user: true, event: true },
          orderBy: { createdAt: "desc" },
          take: 12,
        }),
        prisma.opportunityApplication.findMany({
          where: { opportunity: { is: { organizationId: { in: organizationIds } } } },
          include: { user: true, opportunity: true },
          orderBy: { createdAt: "desc" },
          take: 15,
        }),
        prisma.sponsorLead.findMany({
          where: { organizationId: { in: organizationIds } },
          include: { event: true },
          orderBy: { updatedAt: "desc" },
          take: 10,
        }),
        prisma.merchInquiry.findMany({
          where: { organizationId: { in: organizationIds } },
          orderBy: { updatedAt: "desc" },
          take: 10,
        }),
        prisma.studioRequest.findMany({
          where: { organizationId: { in: organizationIds } },
          orderBy: { updatedAt: "desc" },
          take: 10,
        }),
      ]);

      dashboard.organizerData = {
        organizations: user.memberships.map((membership) => ({
          id: membership.organization.id,
          slug: membership.organization.slug,
          name: membership.organization.name,
        })),
        events: orgEvents.map((event, index) => mapEventCard(event, index)),
        opportunities: orgOpportunities.map((opportunity) => mapOpportunityCard(opportunity)),
        registrations: orgRegistrations.map((registration) => ({
          id: registration.id,
          userName: registration.user.displayName,
          userEmail: registration.user.email,
          status: formatRole(registration.status),
          eventTitle: registration.event.title,
        })),
        volunteerApplications: volunteerApplications.map((application) => ({
          id: application.id,
          userName: application.user.displayName,
          userEmail: application.user.email,
          eventTitle: application.event.title,
          role: application.role,
          status: formatRole(application.status),
        })),
        applications: opportunityApplications.map((application) => ({
          id: application.id,
          applicantName: application.user.displayName,
          applicantEmail: application.user.email,
          opportunityTitle: application.opportunity.title,
          status: formatRole(application.status),
          portfolioUrl: application.portfolioUrl ?? undefined,
          createdAt: formatDate(application.createdAt),
        })),
        sponsorLeads: sponsorLeads.map((lead) => ({
          id: lead.id,
          companyName: lead.companyName,
          stage: formatRole(lead.stage),
          contactEmail: lead.contactEmail,
          eventTitle: lead.event?.title,
        })),
        merchInquiries: merchInquiries.map((inquiry) => ({
          id: inquiry.id,
          apparelType: inquiry.apparelType,
          quantity: inquiry.quantity,
          status: formatRole(inquiry.status),
          city: inquiry.city,
        })),
        studioRequests: studioRequests.map((request) => ({
          id: request.id,
          title: request.title,
          type: formatRole(request.type),
          status: formatRole(request.status),
        })),
      };
    }

    return dashboard;
  } catch (error) {
    console.error("[getDashboardData] Hydration error:", error);
    logDataAccessError("getDashboardData", error);
    return emptyDashboard();
  }
}

export async function getOrganizerFormOptions() {
  const prisma = prismaSafe();
  if (!prisma) {
    return { organizations: [], communities: [] as { id: string; name: string; organizationId: string; slug: string }[] };
  }

  const viewer = await resolveViewer();
  if (!viewer.userId) {
    return { organizations: [], communities: [] as { id: string; name: string; organizationId: string; slug: string }[] };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: viewer.userId },
      include: {
        memberships: { include: { organization: true } },
      },
    });

    if (!user) {
      return { organizations: [], communities: [] as { id: string; name: string; organizationId: string; slug: string }[] };
    }

    const organizations = user.memberships.map((membership) => ({
      id: membership.organization.id,
      name: membership.organization.name,
      slug: membership.organization.slug,
      role: formatRole(membership.role),
    }));

    const communities = organizations.length
      ? await prisma.community.findMany({
          where: { organizationId: { in: organizations.map((organization) => organization.id) } },
          orderBy: { name: "asc" },
          select: { id: true, name: true, organizationId: true, slug: true },
        })
      : [];

    return { organizations, communities };
  } catch (error) {
    logDataAccessError("getOrganizerFormOptions", error);
    return { organizations: [], communities: [] as { id: string; name: string; organizationId: string; slug: string }[] };
  }
}
