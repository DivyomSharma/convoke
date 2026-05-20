import {
  Bookmark,
  NotificationStatus,
  OpportunityType,
  UserRole,
} from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import {
  seedAnnouncements,
  seedEventFaqs,
  seedEventSchedules,
  seedGalleryImages,
  seedOpportunities,
  seedOrganizations,
  seedSponsorLeads,
  seedUsers,
  seedVolunteerApplications,
} from "@/lib/platform-seed";
import type {
  CommunityCard,
  CommunityView,
  DashboardView,
  EventCard,
  EventView,
  OpportunityCard,
  ProfileView,
  SpotlightPerson,
} from "@/lib/platform-types";
import { getAuthenticatedDbUser } from "@/lib/viewer";

type ViewerContext = {
  dbUserId: string | null;
  username: string | null;
};

function prismaSafe() {
  try {
    if (!process.env.DATABASE_URL) return null;
    return getPrisma();
  } catch {
    return null;
  }
}

function toRoleLabel(role: string) {
  return role
    .toLowerCase()
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function opportunityLabel(type: OpportunityType | string) {
  return type
    .toLowerCase()
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function eventPalette(index: number) {
  return [
    "from-rust/65 via-black/20 to-steel/35",
    "from-bronze/60 via-black/15 to-rust/35",
    "from-steel/55 via-black/20 to-bronze/35",
  ][index % 3];
}

function readableDate(date: Date | null | undefined) {
  if (!date) return "Open";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(date);
}

function relativeDate(date: Date) {
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

async function resolveViewer(): Promise<ViewerContext> {
  const prisma = prismaSafe();
  if (!prisma) return { dbUserId: null, username: null };
  let localUser = null;
  try {
    localUser = await getAuthenticatedDbUser();
  } catch {
    return { dbUserId: null, username: null };
  }
  if (!localUser) return { dbUserId: null, username: null };

  return { dbUserId: localUser.id, username: localUser.username };
}

function mapSeedOpportunity(opportunity: (typeof seedOpportunities)[number]): OpportunityCard {
  return {
    id: opportunity.id,
    slug: opportunity.slug,
    title: opportunity.title,
    organization: opportunity.organization,
    organizationSlug: opportunity.organizationSlug,
    type: opportunity.type,
    location: opportunity.location,
    isRemote: opportunity.isRemote,
    stipend: opportunity.stipend,
    deadlineLabel: opportunity.deadline,
    description: opportunity.description,
    skills: opportunity.skills,
    applicants: opportunity.applicants,
    postedAgo: opportunity.postedAgo,
  };
}

function mapSeedCommunity(organization: (typeof seedOrganizations)[number]): CommunityCard {
  return {
    id: organization.slug,
    slug: organization.slug,
    name: organization.name,
    tagline: organization.description,
    location: organization.location,
    members: organization.membersCount,
    image: organization.avatarUrl,
    type: organization.type,
  };
}

function mapSeedEvent(event: (typeof import("@/data/platform").featuredEvents)[number], index: number): EventCard {
  return {
    id: event.slug,
    slug: event.slug,
    title: event.title,
    tagline: event.tagline,
    city: event.city,
    date: event.date,
    category: event.category,
    price: event.price,
    mode: event.mode,
    organizer: event.organizer,
    organizerSlug: event.organizerSlug,
    attendees: event.attendees,
    image: event.image,
    palette: event.palette ?? eventPalette(index),
  };
}

function mapSeedUser(user: (typeof seedUsers)[number]): SpotlightPerson {
  return {
    id: user.username,
    username: user.username,
    name: user.name,
    initials: user.avatarFallback,
    role: toRoleLabel(user.role),
    headline: user.headline ?? user.role,
    community: user.organizationSlug
      ? seedOrganizations.find((organization) => organization.slug === user.organizationSlug)?.name
      : undefined,
  };
}

export async function listHomeData() {
  const prisma = prismaSafe();

  if (!prisma) {
    const { featuredEvents } = await import("@/data/platform");
    return {
      events: featuredEvents.map(mapSeedEvent),
      opportunities: seedOpportunities.map(mapSeedOpportunity),
      communities: seedOrganizations.map(mapSeedCommunity),
      people: seedUsers.map(mapSeedUser),
      counts: {
        communities: seedOrganizations.length,
        opportunities: seedOpportunities.length,
        people: seedUsers.length,
        events: featuredEvents.length,
      },
    };
  }
  try {
    const viewer = await resolveViewer();
    const [events, opportunities, communities, people] = await Promise.all([
      prisma.event.findMany({
        take: 8,
        orderBy: { startsAt: "asc" },
        include: {
          organization: true,
          ticketTypes: true,
          registrations: { select: { id: true, userId: true } },
        },
      }),
      prisma.opportunity.findMany({
        take: 12,
        where: { active: true },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        include: {
          organization: true,
          applications: { select: { id: true, userId: true } },
        },
      }),
      prisma.organization.findMany({
        take: 8,
        orderBy: { membersCount: "desc" },
      }),
      prisma.user.findMany({
        take: 12,
        orderBy: { createdAt: "desc" },
        include: { profile: true, memberships: { include: { organization: true } } },
      }),
    ]);

    const bookmarks = viewer.dbUserId
      ? await prisma.bookmark.findMany({ where: { userId: viewer.dbUserId } })
      : [];

    return {
      events: events.map((event, index) => ({
        id: event.id,
        slug: event.slug,
        title: event.title,
        tagline: event.category === "Hackathons"
          ? "Build, ship, and meet the people pushing things forward."
          : `Join ${event.organization.name} and ${event.registrations.length}+ participants.`,
        city: event.city,
        date: readableDate(event.startsAt),
        category: event.category,
        price: event.ticketTypes[0]?.priceInr ?? 0,
        mode: event.mode,
        organizer: event.organization.name,
        organizerSlug: event.organization.slug,
        attendees: event.registrations.length,
        image: event.heroImageUrl || seedOrganizations[index % seedOrganizations.length].bannerUrl,
        palette: eventPalette(index),
        saved: bookmarks.some((bookmark) => bookmark.eventId === event.id),
        registered: viewer.dbUserId
          ? event.registrations.some((registration) => registration.userId === viewer.dbUserId)
          : false,
      })),
      opportunities: opportunities.map((opportunity) => ({
        id: opportunity.id,
        slug: opportunity.id,
        title: opportunity.title,
        organization: opportunity.organization.name,
        organizationSlug: opportunity.organization.slug,
        type: opportunityLabel(opportunity.type),
        location: opportunity.location,
        isRemote: opportunity.isRemote,
        stipend: opportunity.stipend,
        deadlineLabel: readableDate(opportunity.applicationDeadline),
        description: opportunity.description,
        skills: opportunity.skills,
        applicants: opportunity.applications.length,
        postedAgo: relativeDate(opportunity.createdAt),
        saved: bookmarks.some((bookmark) => bookmark.opportunityId === opportunity.id),
        applied: viewer.dbUserId
          ? opportunity.applications.some((application) => application.userId === viewer.dbUserId)
          : false,
      })),
      communities: communities.map((organization) => ({
        id: organization.id,
        slug: organization.slug,
        name: organization.name,
        tagline: organization.description || `${organization.name} is active on Convoke.`,
        location: organization.website?.includes("Pan-India") ? "Pan-India" : organization.slug.replace(/-/g, " "),
        members: organization.membersCount,
        image: organization.bannerUrl || organization.avatarUrl || seedOrganizations[0].bannerUrl,
        type: organization.type,
      })),
      people: people.map((user) => ({
        id: user.id,
        username: user.username,
        name: user.name,
        initials: user.name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        role: toRoleLabel(user.role),
        headline: user.profile?.headline || user.headline || "Community member",
        community: user.memberships[0]?.organization.name,
      })),
      counts: {
        communities: communities.length,
        opportunities: opportunities.length,
        people: people.length,
        events: events.length,
      },
    };
  } catch {
    const { featuredEvents } = await import("@/data/platform");
    return {
      events: featuredEvents.map(mapSeedEvent),
      opportunities: seedOpportunities.map(mapSeedOpportunity),
      communities: seedOrganizations.map(mapSeedCommunity),
      people: seedUsers.map(mapSeedUser),
      counts: {
        communities: seedOrganizations.length,
        opportunities: seedOpportunities.length,
        people: seedUsers.length,
        events: featuredEvents.length,
      },
    };
  }
}

export async function listOpportunityDirectory() {
  const prisma = prismaSafe();
  if (!prisma) {
    return seedOpportunities.map(mapSeedOpportunity);
  }

  try {
    const viewer = await resolveViewer();
    const [opportunities, bookmarks, applications] = await Promise.all([
      prisma.opportunity.findMany({
        where: { active: true },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        include: { organization: true, applications: true },
      }),
      viewer.dbUserId
        ? prisma.bookmark.findMany({ where: { userId: viewer.dbUserId } })
        : Promise.resolve<Bookmark[]>([]),
      viewer.dbUserId
        ? prisma.opportunityApplication.findMany({ where: { userId: viewer.dbUserId } })
        : Promise.resolve([]),
    ]);

    return opportunities.map((opportunity) => ({
      id: opportunity.id,
      slug: opportunity.id,
      title: opportunity.title,
      organization: opportunity.organization.name,
      organizationSlug: opportunity.organization.slug,
      type: opportunityLabel(opportunity.type),
      location: opportunity.location,
      isRemote: opportunity.isRemote,
      stipend: opportunity.stipend,
      deadlineLabel: readableDate(opportunity.applicationDeadline),
      description: opportunity.description,
      skills: opportunity.skills,
      applicants: opportunity.applications.length,
      postedAgo: relativeDate(opportunity.createdAt),
      saved: bookmarks.some((bookmark) => bookmark.opportunityId === opportunity.id),
      applied: applications.some((application) => application.opportunityId === opportunity.id),
    }));
  } catch {
    return seedOpportunities.map(mapSeedOpportunity);
  }
}

export async function listCommunityDirectory() {
  const prisma = prismaSafe();
  if (!prisma) {
    return seedOrganizations.map(mapSeedCommunity);
  }

  try {
    const organizations = await prisma.organization.findMany({
      orderBy: [{ membersCount: "desc" }, { createdAt: "desc" }],
    });

    return organizations.map((organization) => ({
      id: organization.id,
      slug: organization.slug,
      name: organization.name,
      tagline: organization.description || `${organization.name} on Convoke`,
      location: organization.website || "India",
      members: organization.membersCount,
      image: organization.bannerUrl || organization.avatarUrl || seedOrganizations[0].bannerUrl,
      type: organization.type,
    }));
  } catch {
    return seedOrganizations.map(mapSeedCommunity);
  }
}

export async function getCommunityPageData(slug: string): Promise<CommunityView | null> {
  const prisma = prismaSafe();
  if (!prisma) {
    const organization = seedOrganizations.find((item) => item.slug === slug);
    if (!organization) return null;

    return {
      id: organization.slug,
      slug: organization.slug,
      name: organization.name,
      type: organization.type,
      description: organization.description,
      website: organization.website,
      avatarUrl: organization.avatarUrl,
      bannerUrl: organization.bannerUrl,
      location: organization.location,
      stats: [
        { label: "Members", value: organization.membersCount.toLocaleString("en-IN") },
        { label: "Events", value: String(organization.eventsCount) },
        { label: "Opportunities", value: String(organization.opportunitiesCount) },
      ],
      links: [
        { label: "Website", href: organization.website },
        { label: "Instagram", href: `https://instagram.com/${organization.slug}` },
      ],
      events: (await listHomeData()).events.filter((event) => event.organizerSlug === slug),
      opportunities: seedOpportunities
        .filter((opportunity) => opportunity.organizationSlug === slug)
        .map(mapSeedOpportunity),
      members: seedUsers
        .filter((user) => user.organizationSlug === slug)
        .map(mapSeedUser),
      announcements: seedAnnouncements
        .filter((announcement) => announcement.organizationSlug === slug)
        .map((announcement, index) => ({
          id: `${slug}-announcement-${index}`,
          title: announcement.title,
          content: announcement.content,
          publishedAt: readableDate(new Date(announcement.publishedAt)),
        })),
      galleries: [
        {
          id: `${slug}-gallery`,
          title: `${organization.name} gallery`,
          items: [organization.bannerUrl, organization.avatarUrl],
        },
      ],
    };
  }

  try {
  const organization = await prisma.organization.findUnique({
    where: { slug },
    include: {
      members: {
        include: { user: { include: { profile: true } } },
        orderBy: { joinedAt: "desc" },
        take: 8,
      },
      events: {
        include: { registrations: true, ticketTypes: true },
        orderBy: { startsAt: "asc" },
      },
      opportunities: {
        where: { active: true },
        include: { applications: true },
        orderBy: { createdAt: "desc" },
      },
      announcements: {
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        take: 6,
      },
      galleries: {
        include: { items: { orderBy: { order: "asc" } } },
        take: 2,
      },
    },
  });

  if (!organization) return null;

  return {
    id: organization.id,
    slug: organization.slug,
    name: organization.name,
    type: organization.type,
    description: organization.description || `${organization.name} is building active community momentum on Convoke.`,
    website: organization.website || undefined,
    avatarUrl: organization.avatarUrl || undefined,
    bannerUrl: organization.bannerUrl || undefined,
    location: organization.website ? "Pan-India" : organization.slug.replace(/-/g, " "),
    stats: [
      { label: "Members", value: organization.membersCount.toLocaleString("en-IN") },
      { label: "Events", value: String(organization.events.length) },
      { label: "Opportunities", value: String(organization.opportunities.length) },
    ],
    links: organization.website ? [{ label: "Website", href: organization.website }] : [],
    events: organization.events.map((event, index) => ({
      id: event.id,
      slug: event.slug,
      title: event.title,
      tagline: event.category,
      city: event.city,
      date: readableDate(event.startsAt),
      category: event.category,
      price: event.ticketTypes[0]?.priceInr ?? 0,
      mode: event.mode,
      organizer: organization.name,
      organizerSlug: organization.slug,
      attendees: event.registrations.length,
      image: event.heroImageUrl || organization.bannerUrl || seedOrganizations[0].bannerUrl,
      palette: eventPalette(index),
    })),
    opportunities: organization.opportunities.map((opportunity) => ({
      id: opportunity.id,
      slug: opportunity.id,
      title: opportunity.title,
      organization: organization.name,
      organizationSlug: organization.slug,
      type: opportunityLabel(opportunity.type),
      location: opportunity.location,
      isRemote: opportunity.isRemote,
      stipend: opportunity.stipend,
      deadlineLabel: readableDate(opportunity.applicationDeadline),
      description: opportunity.description,
      skills: opportunity.skills,
      applicants: opportunity.applications.length,
      postedAgo: relativeDate(opportunity.createdAt),
    })),
    members: organization.members.map((membership) => ({
      id: membership.user.id,
      username: membership.user.username,
      name: membership.user.name,
      initials: membership.user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      role: membership.role,
      headline: membership.user.profile?.headline || membership.user.headline || membership.role,
      community: organization.name,
    })),
    announcements: organization.announcements.map((announcement) => ({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      publishedAt: readableDate(announcement.publishedAt || announcement.createdAt),
    })),
    galleries: organization.galleries.map((gallery) => ({
      id: gallery.id,
      title: gallery.title,
      items: gallery.items.map((item) => item.url),
    })),
  };
  } catch {
    const organization = seedOrganizations.find((item) => item.slug === slug);
    if (!organization) return null;

    return {
      id: organization.slug,
      slug: organization.slug,
      name: organization.name,
      type: organization.type,
      description: organization.description,
      website: organization.website,
      avatarUrl: organization.avatarUrl,
      bannerUrl: organization.bannerUrl,
      location: organization.location,
      stats: [
        { label: "Members", value: organization.membersCount.toLocaleString("en-IN") },
        { label: "Events", value: String(organization.eventsCount) },
        { label: "Opportunities", value: String(organization.opportunitiesCount) },
      ],
      links: [
        { label: "Website", href: organization.website },
        { label: "Instagram", href: `https://instagram.com/${organization.slug}` },
      ],
      events: (await listHomeData()).events.filter((event) => event.organizerSlug === slug),
      opportunities: seedOpportunities
        .filter((opportunity) => opportunity.organizationSlug === slug)
        .map(mapSeedOpportunity),
      members: seedUsers
        .filter((user) => user.organizationSlug === slug)
        .map(mapSeedUser),
      announcements: seedAnnouncements
        .filter((announcement) => announcement.organizationSlug === slug)
        .map((announcement, index) => ({
          id: `${slug}-announcement-${index}`,
          title: announcement.title,
          content: announcement.content,
          publishedAt: readableDate(new Date(announcement.publishedAt)),
        })),
      galleries: [
        {
          id: `${slug}-gallery`,
          title: `${organization.name} gallery`,
          items: [organization.bannerUrl, organization.avatarUrl],
        },
      ],
    };
  }
}

export async function getEventPageData(slug: string): Promise<EventView | null> {
  const prisma = prismaSafe();
  if (!prisma) {
    const { featuredEvents } = await import("@/data/platform");
    const event = featuredEvents.find((item) => item.slug === slug);
    if (!event) return null;

    return {
      id: event.slug,
      slug: event.slug,
      title: event.title,
      tagline: event.tagline,
      city: event.city,
      date: event.date,
      category: event.category,
      mode: event.mode,
      organizer: event.organizer,
      organizerSlug: event.organizerSlug,
      description: `${event.title} brings together ambitious people building through ${event.category.toLowerCase()}.`,
      image: event.image,
      palette: event.palette,
      attendees: event.attendees,
      volunteers: event.volunteers,
      price: event.price,
      spotsLeft: Math.max(0, 2500 - event.attendees),
      saved: false,
      registered: false,
      ticketTypes: [
        { id: `${event.slug}-general`, name: "General", priceInr: event.price, sold: event.attendees, capacity: 2500 },
      ],
      schedules: (seedEventSchedules.find((schedule) => schedule.eventSlug === slug)?.items ?? []).map((item, index) => ({
        id: `${slug}-schedule-${index}`,
        title: item.title,
        description: item.description,
        startsAt: item.startsAt,
        endsAt: item.endsAt,
        location: item.location,
      })),
      speakers: seedUsers.slice(0, 4).map((user, index) => ({
        id: `${slug}-speaker-${index}`,
        name: user.name,
        title: user.headline ?? user.role,
        organization:
          seedOrganizations.find((organization) => organization.slug === user.organizationSlug)?.name ?? undefined,
        bio: user.bio,
        talkTitle: `${event.title} session ${index + 1}`,
      })),
      sponsors: seedSponsorLeads
        .filter((lead) => lead.eventSlug === slug)
        .map((lead, index) => ({
          id: `${slug}-sponsor-${index}`,
          companyName: lead.companyName,
          tier: lead.stage,
          benefits: ["Brand visibility", "Talent access"],
        })),
      faqs: seedEventFaqs[slug] ?? [
        { q: "Who is this event for?", a: "People looking to participate, collaborate, and build momentum." },
      ],
      galleries: seedGalleryImages[slug] ?? [event.image],
    };
  }

  try {
  const viewer = await resolveViewer();
  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      organization: true,
      ticketTypes: true,
      registrations: true,
      schedules: { orderBy: { startsAt: "asc" } },
      speakers: true,
      sponsors: true,
      volunteerApps: true,
      galleries: {
        include: { items: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!event) return null;

  const bookmarks = viewer.dbUserId
    ? await prisma.bookmark.findMany({ where: { userId: viewer.dbUserId, eventId: event.id } })
    : [];

  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    tagline: `${event.organization.name} is hosting ${event.title}.`,
    city: event.city,
    date: readableDate(event.startsAt),
    category: event.category,
    mode: event.mode,
    organizer: event.organization.name,
    organizerSlug: event.organization.slug,
    description: event.blocks ? "Built from event builder blocks." : `${event.title} is active on Convoke.`,
    image: event.heroImageUrl || event.organization.bannerUrl || seedOrganizations[0].bannerUrl,
    palette: eventPalette(0),
    attendees: event.registrations.length,
    volunteers: event.volunteerApps.length,
    price: event.ticketTypes[0]?.priceInr ?? 0,
    spotsLeft:
      event.ticketTypes[0]?.capacity != null
        ? Math.max(0, event.ticketTypes[0].capacity - event.registrations.length)
        : 0,
    saved: bookmarks.length > 0,
    registered: viewer.dbUserId
      ? event.registrations.some((registration) => registration.userId === viewer.dbUserId)
      : false,
    ticketTypes: event.ticketTypes.map((ticketType) => ({
      id: ticketType.id,
      name: ticketType.name,
      priceInr: ticketType.priceInr,
      sold: ticketType.sold,
      capacity: ticketType.capacity,
    })),
    schedules: event.schedules.map((schedule) => ({
      id: schedule.id,
      title: schedule.title,
      description: schedule.description || undefined,
      startsAt: schedule.startsAt.toISOString(),
      endsAt: schedule.endsAt.toISOString(),
      location: schedule.location || undefined,
    })),
    speakers: event.speakers.map((speaker) => ({
      id: speaker.id,
      name: speaker.name,
      title: speaker.title || "Speaker",
      organization: speaker.organization || undefined,
      bio: speaker.bio || undefined,
      talkTitle: speaker.talkTitle || undefined,
    })),
    sponsors: event.sponsors.map((sponsor) => ({
      id: sponsor.id,
      companyName: sponsor.companyName,
      tier: sponsor.tier,
      benefits: sponsor.benefits,
    })),
    faqs: seedEventFaqs[slug] ?? [
      { q: "Can I participate through Convoke?", a: "Yes. Registration, waitlists, and certificates all run through the platform." },
    ],
    galleries:
      event.galleries.flatMap((gallery) => gallery.items.map((item) => item.url)).length > 0
        ? event.galleries.flatMap((gallery) => gallery.items.map((item) => item.url))
        : [event.heroImageUrl || seedOrganizations[0].bannerUrl],
  };
  } catch {
    const { featuredEvents } = await import("@/data/platform");
    const event = featuredEvents.find((item) => item.slug === slug);
    if (!event) return null;

    return {
      id: event.slug,
      slug: event.slug,
      title: event.title,
      tagline: event.tagline,
      city: event.city,
      date: event.date,
      category: event.category,
      mode: event.mode,
      organizer: event.organizer,
      organizerSlug: event.organizerSlug,
      description: `${event.title} brings together ambitious people building through ${event.category.toLowerCase()}.`,
      image: event.image,
      palette: event.palette,
      attendees: event.attendees,
      volunteers: event.volunteers,
      price: event.price,
      spotsLeft: Math.max(0, 2500 - event.attendees),
      saved: false,
      registered: false,
      ticketTypes: [
        { id: `${event.slug}-general`, name: "General", priceInr: event.price, sold: event.attendees, capacity: 2500 },
      ],
      schedules: (seedEventSchedules.find((schedule) => schedule.eventSlug === slug)?.items ?? []).map((item, index) => ({
        id: `${slug}-schedule-${index}`,
        title: item.title,
        description: item.description,
        startsAt: item.startsAt,
        endsAt: item.endsAt,
        location: item.location,
      })),
      speakers: seedUsers.slice(0, 4).map((user, index) => ({
        id: `${slug}-speaker-${index}`,
        name: user.name,
        title: user.headline ?? user.role,
        organization:
          seedOrganizations.find((organization) => organization.slug === user.organizationSlug)?.name ?? undefined,
        bio: user.bio,
        talkTitle: `${event.title} session ${index + 1}`,
      })),
      sponsors: seedSponsorLeads
        .filter((lead) => lead.eventSlug === slug)
        .map((lead, index) => ({
          id: `${slug}-sponsor-${index}`,
          companyName: lead.companyName,
          tier: lead.stage,
          benefits: ["Brand visibility", "Talent access"],
        })),
      faqs: seedEventFaqs[slug] ?? [
        { q: "Who is this event for?", a: "People looking to participate, collaborate, and build momentum." },
      ],
      galleries: seedGalleryImages[slug] ?? [event.image],
    };
  }
}

export async function getProfilePageData(username: string): Promise<ProfileView | null> {
  const prisma = prismaSafe();
  if (!prisma) {
    const user = seedUsers.find((item) => item.username === username);
    if (!user) return null;
    const organization = user.organizationSlug
      ? seedOrganizations.find((item) => item.slug === user.organizationSlug)
      : null;

    return {
      id: user.username,
      username: user.username,
      name: user.name,
      role: toRoleLabel(user.role),
      headline: user.headline ?? user.role,
      bio: user.bio,
      avatarFallback: user.avatarFallback,
      location: user.location,
      website: user.website,
      socials: [
        { label: "LinkedIn", href: user.socials.linkedin },
        { label: "GitHub", href: user.socials.github },
        { label: "Instagram", href: user.socials.instagram },
      ],
      badges: user.badges,
      skills: user.skills,
      stats: [
        { label: "Events attended", value: String(user.stats.eventsAttended) },
        { label: "Events organized", value: String(user.stats.eventsOrganized) },
        { label: "Volunteer hours", value: String(user.stats.volunteerHours) },
        { label: "Communities joined", value: String(user.stats.communitiesJoined) },
      ],
      experiences: [
        {
          id: `${user.username}-exp-1`,
          title: user.experience.position,
          org: user.experience.company,
          period: "2026 - Present",
          description: user.experience.description,
        },
      ],
      projects: [
        {
          id: `${user.username}-project-1`,
          name: user.project.name,
          description: user.project.description,
          url: user.website,
          technologies: user.project.technologies,
        },
      ],
      communities: organization
        ? [{ id: organization.slug, name: organization.name, role: toRoleLabel(user.role), slug: organization.slug }]
        : [],
      recentEvents: (await listHomeData()).events.slice(0, 3).map((event) => ({
        id: event.id,
        title: event.title,
        role: user.role === "ORGANIZER" ? "Organizer" : "Participant",
        slug: event.slug,
      })),
      certificates: [
        {
          id: `${user.username}-certificate-1`,
          title: "Community participation certificate",
          type: "PARTICIPATION",
          issuedAt: "May 2026",
        },
      ],
    };
  }

  try {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      profile: true,
      experiences: { orderBy: { startsAt: "desc" } },
      projects: { where: { visible: true }, orderBy: { createdAt: "desc" } },
      memberships: { include: { organization: true }, orderBy: { joinedAt: "desc" } },
      registrations: { include: { event: true }, orderBy: { createdAt: "desc" }, take: 6 },
      certificatesIssued: { orderBy: { issuedAt: "desc" }, take: 6 },
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    role: toRoleLabel(user.role),
    headline: user.profile?.headline || user.headline || "Community member",
    bio: user.bio || user.profile?.headline || "Building through events, communities, and opportunities on Convoke.",
    avatarFallback: user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    location: user.profile?.location || undefined,
    website: user.profile?.website || undefined,
    socials: [
      user.profile?.linkedinUrl ? { label: "LinkedIn", href: user.profile.linkedinUrl } : null,
      user.profile?.githubUrl ? { label: "GitHub", href: user.profile.githubUrl } : null,
      user.profile?.instagramUrl ? { label: "Instagram", href: user.profile.instagramUrl } : null,
      user.profile?.portfolioUrl ? { label: "Portfolio", href: user.profile.portfolioUrl } : null,
    ].filter(Boolean) as { label: string; href: string }[],
    badges: user.profile?.badges ?? [],
    skills: user.profile?.skills ?? [],
    stats: [
      { label: "Events attended", value: String(user.profile?.eventsAttended ?? user.registrations.length) },
      { label: "Events organized", value: String(user.profile?.eventsOrganized ?? 0) },
      { label: "Volunteer hours", value: String(user.profile?.volunteerHours ?? 0) },
      { label: "Communities joined", value: String(user.profile?.communitiesJoined ?? user.memberships.length) },
    ],
    experiences: user.experiences.map((experience) => ({
      id: experience.id,
      title: experience.position,
      org: experience.company,
      period: `${experience.startsAt ? readableDate(experience.startsAt) : "Start"} - ${
        experience.current ? "Present" : experience.endsAt ? readableDate(experience.endsAt) : "Present"
      }`,
      description: experience.description || undefined,
    })),
    projects: user.projects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description || "Project work on Convoke",
      url: project.url || undefined,
      technologies: project.technologies,
    })),
    communities: user.memberships.map((membership) => ({
      id: membership.organization.id,
      name: membership.organization.name,
      role: membership.role,
      slug: membership.organization.slug,
    })),
    recentEvents: user.registrations.map((registration) => ({
      id: registration.event.id,
      title: registration.event.title,
      role: registration.status,
      slug: registration.event.slug,
    })),
    certificates: user.certificatesIssued.map((certificate) => ({
      id: certificate.id,
      title: certificate.title,
      type: certificate.type,
      issuedAt: readableDate(certificate.issuedAt),
    })),
  };
  } catch {
    const user = seedUsers.find((item) => item.username === username);
    if (!user) return null;
    const organization = user.organizationSlug
      ? seedOrganizations.find((item) => item.slug === user.organizationSlug)
      : null;

    return {
      id: user.username,
      username: user.username,
      name: user.name,
      role: toRoleLabel(user.role),
      headline: user.headline ?? user.role,
      bio: user.bio,
      avatarFallback: user.avatarFallback,
      location: user.location,
      website: user.website,
      socials: [
        { label: "LinkedIn", href: user.socials.linkedin },
        { label: "GitHub", href: user.socials.github },
        { label: "Instagram", href: user.socials.instagram },
      ],
      badges: user.badges,
      skills: user.skills,
      stats: [
        { label: "Events attended", value: String(user.stats.eventsAttended) },
        { label: "Events organized", value: String(user.stats.eventsOrganized) },
        { label: "Volunteer hours", value: String(user.stats.volunteerHours) },
        { label: "Communities joined", value: String(user.stats.communitiesJoined) },
      ],
      experiences: [
        {
          id: `${user.username}-exp-1`,
          title: user.experience.position,
          org: user.experience.company,
          period: "2026 - Present",
          description: user.experience.description,
        },
      ],
      projects: [
        {
          id: `${user.username}-project-1`,
          name: user.project.name,
          description: user.project.description,
          url: user.website,
          technologies: user.project.technologies,
        },
      ],
      communities: organization
        ? [{ id: organization.slug, name: organization.name, role: toRoleLabel(user.role), slug: organization.slug }]
        : [],
      recentEvents: (await listHomeData()).events.slice(0, 3).map((event) => ({
        id: event.id,
        title: event.title,
        role: user.role === "ORGANIZER" ? "Organizer" : "Participant",
        slug: event.slug,
      })),
      certificates: [
        {
          id: `${user.username}-certificate-1`,
          title: "Community participation certificate",
          type: "PARTICIPATION",
          issuedAt: "May 2026",
        },
      ],
    };
  }
}

async function getSeedDashboardData(): Promise<DashboardView> {
  const viewer = seedUsers[0];
  const home = await listHomeData();
  const organizerEvents = home.events.filter(
    (event) => event.organizerSlug === viewer.organizationSlug,
  );

  return {
    viewer: mapSeedUser(viewer),
    role: viewer.role,
    bookmarks: {
      events: home.events.slice(0, 2),
      opportunities: seedOpportunities.slice(0, 2).map(mapSeedOpportunity),
      communities: seedOrganizations.slice(0, 2).map(mapSeedCommunity),
    },
    registrations: home.events.slice(0, 3).map((event, index) => ({
      id: `${event.slug}-registration`,
      eventTitle: event.title,
      eventSlug: event.slug,
      status: index === 0 ? "APPROVED" : "PENDING",
      ticketType: "General",
      createdAt: "May 2026",
    })),
    applications: seedOpportunities.slice(0, 3).map((opportunity, index) => ({
      id: `${opportunity.id}-application`,
      title: opportunity.title,
      organization: opportunity.organization,
      status: ["APPLIED", "SHORTLISTED", "REVIEWING"][index],
      appliedAt: opportunity.postedAgo,
    })),
    certificates: [
      {
        id: `${viewer.username}-certificate`,
        title: "Forge Hack participation certificate",
        type: "PARTICIPATION",
        issuedAt: "May 2026",
      },
    ],
    communities: seedOrganizations.slice(0, 2).map((organization) => ({
      id: organization.slug,
      slug: organization.slug,
      name: organization.name,
      role: organization.slug === viewer.organizationSlug ? "Core member" : "Participant",
    })),
    notifications: [
      {
        id: "notification-1",
        title: "Application updated",
        message: "Your Frontend Engineering Intern application moved to reviewing.",
        createdAt: "2 hours ago",
        unread: true,
      },
    ],
    organizerData:
      viewer.role === "ORGANIZER"
        ? {
            organizations: seedOrganizations
              .filter((organization) => organization.slug === viewer.organizationSlug)
              .map((organization) => ({
                id: organization.slug,
                slug: organization.slug,
                name: organization.name,
              })),
            events: organizerEvents,
            opportunities: seedOpportunities
              .filter((opportunity) => opportunity.organizationSlug === viewer.organizationSlug)
              .map(mapSeedOpportunity),
            registrations: organizerEvents.map((event, index) => ({
              id: `${event.id}-registration-${index}`,
              userName: seedUsers[index]?.name ?? "Convoke member",
              userEmail: seedUsers[index]?.email ?? "hello@convoke.seed",
              status: index % 2 === 0 ? "APPROVED" : "WAITLISTED",
              eventTitle: event.title,
            })),
            volunteerApplications: seedVolunteerApplications
              .filter((application) => application.eventSlug === "forge-hack")
              .map((application) => ({
                id: `${application.username}-${application.role}`,
                userName:
                  seedUsers.find((user) => user.username === application.username)?.name ??
                  application.username,
                eventTitle: "Forge Hack",
                role: application.role,
                status: application.status,
              })),
            sponsorLeads: seedSponsorLeads
              .filter((lead) => lead.organizationSlug === viewer.organizationSlug)
              .map((lead) => ({
                id: `${lead.organizationSlug}-${lead.companyName}`,
                companyName: lead.companyName,
                stage: lead.stage,
                contactEmail: lead.contactEmail,
                eventTitle: lead.eventSlug
                  ? home.events.find((event) => event.slug === lead.eventSlug)?.title
                  : undefined,
              })),
          }
        : undefined,
  };
}

export async function getDashboardData(): Promise<DashboardView> {
  const prisma = prismaSafe();
  if (!prisma) {
    return getSeedDashboardData();
  }

  try {

  const viewer = await resolveViewer();
  let user = viewer.dbUserId
    ? await prisma.user.findUnique({
        where: { id: viewer.dbUserId },
        include: {
          profile: true,
          memberships: { include: { organization: true } },
        },
      })
    : null;

  if (!user) {
    user = await prisma.user.findFirst({
      include: {
        profile: true,
        memberships: { include: { organization: true } },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  if (!user) {
    const fallbackViewer = seedUsers[0];
    return {
      viewer: mapSeedUser(fallbackViewer),
      role: fallbackViewer.role,
      bookmarks: {
        events: [],
        opportunities: [],
        communities: [],
      },
      registrations: [],
      applications: [],
      certificates: [],
      communities: [],
      notifications: [],
    };
  }

  const role = user.role;
  const [
    bookmarks,
    registrations,
    applications,
    certificates,
    notifications,
  ] = await Promise.all([
    prisma.bookmark.findMany({ where: { userId: user.id } }),
    prisma.registration.findMany({
      where: { userId: user.id },
      include: { event: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.opportunityApplication.findMany({
      where: { userId: user.id },
      include: { opportunity: { include: { organization: true } } },
      orderBy: { appliedAt: "desc" },
    }),
    prisma.certificate.findMany({
      where: { userId: user.id },
      orderBy: { issuedAt: "desc" },
    }),
    prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const eventIds = bookmarks.map((bookmark) => bookmark.eventId).filter(Boolean) as string[];
  const opportunityIds = bookmarks
    .map((bookmark) => bookmark.opportunityId)
    .filter(Boolean) as string[];
  const organizationIds = bookmarks
    .map((bookmark) => bookmark.organizationId)
    .filter(Boolean) as string[];

  const [savedEvents, savedOpportunities, savedOrganizations] = await Promise.all([
    eventIds.length
      ? prisma.event.findMany({
          where: { id: { in: eventIds } },
          include: { organization: true, registrations: true, ticketTypes: true },
        })
      : Promise.resolve([]),
    opportunityIds.length
      ? prisma.opportunity.findMany({
          where: { id: { in: opportunityIds } },
          include: { organization: true, applications: true },
        })
      : Promise.resolve([]),
    organizationIds.length
      ? prisma.organization.findMany({
          where: { id: { in: organizationIds } },
        })
      : Promise.resolve([]),
  ]);

  const dashboard: DashboardView = {
    viewer: {
      id: user.id,
      username: user.username,
      name: user.name,
      initials: user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      role: toRoleLabel(role),
      headline: user.profile?.headline || user.headline || "Community member",
      community: user.memberships[0]?.organization.name,
    },
    role,
    bookmarks: {
      events: savedEvents.map((event, index) => ({
        id: event.id,
        slug: event.slug,
        title: event.title,
        tagline: event.category,
        city: event.city,
        date: readableDate(event.startsAt),
        category: event.category,
        price: event.ticketTypes[0]?.priceInr ?? 0,
        mode: event.mode,
        organizer: event.organization.name,
        organizerSlug: event.organization.slug,
        attendees: event.registrations.length,
        image: event.heroImageUrl || seedOrganizations[index % seedOrganizations.length].bannerUrl,
        palette: eventPalette(index),
        saved: true,
      })),
      opportunities: savedOpportunities.map((opportunity) => ({
        id: opportunity.id,
        slug: opportunity.id,
        title: opportunity.title,
        organization: opportunity.organization.name,
        organizationSlug: opportunity.organization.slug,
        type: opportunityLabel(opportunity.type),
        location: opportunity.location,
        isRemote: opportunity.isRemote,
        stipend: opportunity.stipend,
        deadlineLabel: readableDate(opportunity.applicationDeadline),
        description: opportunity.description,
        skills: opportunity.skills,
        applicants: opportunity.applications.length,
        postedAgo: relativeDate(opportunity.createdAt),
        saved: true,
      })),
      communities: savedOrganizations.map((organization) => ({
        id: organization.id,
        slug: organization.slug,
        name: organization.name,
        tagline: organization.description || organization.name,
        location: organization.website || "India",
        members: organization.membersCount,
        image: organization.bannerUrl || organization.avatarUrl || seedOrganizations[0].bannerUrl,
        type: organization.type,
      })),
    },
    registrations: registrations.map((registration) => ({
      id: registration.id,
      eventTitle: registration.event.title,
      eventSlug: registration.event.slug,
      status: registration.status,
      ticketType: undefined,
      createdAt: readableDate(registration.createdAt),
    })),
    applications: applications.map((application) => ({
      id: application.id,
      title: application.opportunity.title,
      organization: application.opportunity.organization.name,
      status: application.status,
      appliedAt: readableDate(application.appliedAt),
    })),
    certificates: certificates.map((certificate) => ({
      id: certificate.id,
      title: certificate.title,
      type: certificate.type,
      issuedAt: readableDate(certificate.issuedAt),
    })),
    communities: user.memberships.map((membership) => ({
      id: membership.organization.id,
      slug: membership.organization.slug,
      name: membership.organization.name,
      role: membership.role,
    })),
    notifications: notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      createdAt: relativeDate(notification.createdAt),
      unread: notification.status === NotificationStatus.UNREAD,
    })),
  };

  if (
    role === UserRole.ORGANIZER ||
    role === UserRole.COMMUNITY_ADMIN ||
    role === UserRole.STARTUP_FOUNDER ||
    role === UserRole.ADMIN
  ) {
    const organizationIdsForUser = user.memberships.map((membership) => membership.organizationId);
    const [organizationEvents, organizationOpportunities, organizationRegistrations, volunteerApplications, sponsorLeads] =
      await Promise.all([
        prisma.event.findMany({
          where: { organizationId: { in: organizationIdsForUser } },
          include: { organization: true, registrations: true, ticketTypes: true },
          orderBy: { startsAt: "asc" },
        }),
        prisma.opportunity.findMany({
          where: { organizationId: { in: organizationIdsForUser } },
          include: { organization: true, applications: true },
          orderBy: { createdAt: "desc" },
        }),
        prisma.registration.findMany({
          where: { event: { organizationId: { in: organizationIdsForUser } } },
          include: { user: true, event: true },
          orderBy: { createdAt: "desc" },
          take: 20,
        }),
        prisma.volunteerApplication.findMany({
          where: { event: { organizationId: { in: organizationIdsForUser } } },
          include: { user: true, event: true },
          orderBy: { appliedAt: "desc" },
          take: 20,
        }),
        prisma.sponsorLead.findMany({
          where: { organizationId: { in: organizationIdsForUser } },
          include: { event: true },
          orderBy: { updatedAt: "desc" },
        }),
      ]);

    dashboard.organizerData = {
      organizations: user.memberships.map((membership) => ({
        id: membership.organization.id,
        slug: membership.organization.slug,
        name: membership.organization.name,
      })),
      events: organizationEvents.map((event, index) => ({
        id: event.id,
        slug: event.slug,
        title: event.title,
        tagline: event.category,
        city: event.city,
        date: readableDate(event.startsAt),
        category: event.category,
        price: event.ticketTypes[0]?.priceInr ?? 0,
        mode: event.mode,
        organizer: event.organization.name,
        organizerSlug: event.organization.slug,
        attendees: event.registrations.length,
        image: event.heroImageUrl || seedOrganizations[index % seedOrganizations.length].bannerUrl,
        palette: eventPalette(index),
      })),
      opportunities: organizationOpportunities.map((opportunity) => ({
        id: opportunity.id,
        slug: opportunity.id,
        title: opportunity.title,
        organization: opportunity.organization.name,
        organizationSlug: opportunity.organization.slug,
        type: opportunityLabel(opportunity.type),
        location: opportunity.location,
        isRemote: opportunity.isRemote,
        stipend: opportunity.stipend,
        deadlineLabel: readableDate(opportunity.applicationDeadline),
        description: opportunity.description,
        skills: opportunity.skills,
        applicants: opportunity.applications.length,
        postedAgo: relativeDate(opportunity.createdAt),
      })),
      registrations: organizationRegistrations.map((registration) => ({
        id: registration.id,
        userName: registration.user.name,
        userEmail: registration.user.email,
        status: registration.status,
        eventTitle: registration.event.title,
      })),
      volunteerApplications: volunteerApplications.map((application) => ({
        id: application.id,
        userName: application.user.name,
        eventTitle: application.event.title,
        role: application.role,
        status: application.status,
      })),
      sponsorLeads: sponsorLeads.map((lead) => ({
        id: lead.id,
        companyName: lead.companyName,
        stage: lead.stage,
        contactEmail: lead.contactEmail,
        eventTitle: lead.event?.title,
      })),
    };
  }

  return dashboard;
  } catch {
    return getSeedDashboardData();
  }
}

export async function getHomepageStats() {
  const data = await listHomeData();
  return [
    `${data.counts.communities} communities`,
    `${data.counts.opportunities} opportunities`,
    `${data.counts.people} active profiles`,
    `${data.counts.events} live event paths`,
  ];
}
