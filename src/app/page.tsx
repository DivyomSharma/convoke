import { Shell } from "@/components/Shell";
import { prisma } from "@/lib/prisma";
import { HomeClient } from "@/components/HomeClient";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  // Get today's bounds in local/UTC time
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  // 1. Fetch statistics counts from the database
  const [
    eventsTodayCount,
    hackathonsCount,
    opportunitiesCount,
    projectsCount,
    officeHoursCount,
    buildersCount,
    newMembersCount,
    communitiesCount,
  ] = await Promise.all([
    prisma.event.count({
      where: {
        startTime: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    }).catch(() => 0),
    prisma.opportunity.count({
      where: {
        type: {
          in: ["HACKATHON", "CHALLENGE"],
        },
      },
    }).catch(() => 0),
    prisma.opportunity.count({
      where: {
        type: "ROLE",
      },
    }).catch(() => 0),
    prisma.project.count().catch(() => 0),
    prisma.event.count({
      where: {
        title: {
          contains: "office hour",
          mode: "insensitive",
        },
      },
    }).catch(() => 0),
    prisma.user.count().catch(() => 0),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    }).catch(() => 0),
    prisma.space.count().catch(() => 0),
  ]);

  // Filter out statistics that have a count of 0 to avoid clutter
  const stats = [
    { count: eventsTodayCount, label: "Events Today" },
    { count: hackathonsCount, label: "Hackathons Open" },
    { count: opportunitiesCount, label: "Opportunities Hiring" },
    { count: projectsCount, label: "Projects Launched" },
    { count: officeHoursCount, label: "Founder Office Hours" },
    { count: buildersCount, label: "Builders Active" },
    { count: newMembersCount, label: "New Members" },
    { count: communitiesCount, label: "Communities Growing" },
  ].filter((s) => s.count > 0);

  // 2. Fetch live feed items from the database
  const [todayEvents, recentProjects, recentOpportunities, recentSpaces] = await Promise.all([
    prisma.event.findMany({
      where: {
        startTime: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      include: {
        space: {
          include: {
            organization: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
      take: 5,
    }).catch(() => []),
    prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
      take: 5,
    }).catch(() => []),
    prisma.opportunity.findMany({
      where: {
        type: "ROLE",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        organization: true,
      },
      take: 5,
    }).catch(() => []),
    prisma.space.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        organization: true,
      },
      take: 5,
    }).catch(() => []),
  ]);

  // Construct final feed items from DB queries
  const feedItems: any[] = [];

  todayEvents.forEach((e: any) => {
    const isLive = new Date() >= e.startTime && new Date() <= e.endTime;
    const timeStr = e.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    feedItems.push({
      id: `event-${e.id}`,
      tag: isLive ? "LIVE NOW" : "TONIGHT",
      title: e.title,
      meta: `${e.location || "Online"} · ${timeStr}`,
      link: `/events/${e.id}`,
      actionText: isLive ? "Join" : "RSVP",
      timestamp: e.startTime.getTime(),
    });
  });

  recentProjects.forEach((p: any) => {
    const hoursAgo = Math.max(1, Math.round((Date.now() - p.createdAt.getTime()) / (1000 * 60 * 60)));
    const timeStr = hoursAgo < 24 ? `${hoursAgo} hours ago` : p.createdAt.toLocaleDateString();
    feedItems.push({
      id: `project-${p.id}`,
      tag: "NEW PROJECT",
      title: p.title,
      meta: `Shipped ${timeStr} by ${p.user?.name || "Builder"}`,
      link: `/projects`,
      actionText: "View",
      timestamp: p.createdAt.getTime(),
    });
  });

  recentOpportunities.forEach((o: any) => {
    feedItems.push({
      id: `opp-${o.id}`,
      tag: "NOW HIRING",
      title: o.title,
      meta: `${o.organization?.name || "Organization"} · ${o.location || "Remote"}`,
      link: `/opportunities`,
      actionText: "Apply",
      timestamp: o.createdAt.getTime(),
    });
  });

  recentSpaces.forEach((s: any) => {
    feedItems.push({
      id: `space-${s.id}`,
      tag: "NEW COMMUNITY",
      title: s.name,
      meta: s.description || "A new space on Convoke",
      link: `/spaces`,
      actionText: "Join",
      timestamp: s.createdAt.getTime(),
    });
  });

  // Sort and select prominent items
  const liveAndTonight = feedItems.filter((item) => item.tag === "LIVE NOW" || item.tag === "TONIGHT");
  const otherFeed = feedItems
    .filter((item) => item.tag !== "LIVE NOW" && item.tag !== "TONIGHT")
    .sort((a, b) => b.timestamp - a.timestamp);

  const finalFeed = [...liveAndTonight, ...otherFeed].slice(0, 10);

  // Example fallbacks for clean database states
  const fallbackFeed = [
    {
      id: "feed-1",
      tag: "LIVE NOW",
      title: "OpenAI Student Chapter",
      meta: "218 builders online",
      link: "/spaces",
      actionText: "Join",
    },
    {
      id: "feed-2",
      tag: "TONIGHT",
      title: "Founders Before Product",
      meta: "IIT Delhi · 7:00 PM",
      link: "/events",
      actionText: "RSVP",
    },
    {
      id: "feed-3",
      tag: "NEW PROJECT",
      title: "PlotArmour",
      meta: "Launched 2 hours ago",
      link: "/projects",
      actionText: "View",
    },
    {
      id: "feed-4",
      tag: "NOW HIRING",
      title: "Backend Engineer",
      meta: "Remote · Full-time",
      link: "/opportunities",
      actionText: "Apply",
    },
    {
      id: "feed-5",
      tag: "NEW COMMUNITY",
      title: "AI Research Collective",
      meta: "42 members joined today",
      link: "/spaces",
      actionText: "Join",
    },
  ];

  const displayFeed = finalFeed.length > 0 ? finalFeed : fallbackFeed;

  // 3. Fetch Featured entities from DB
  const [dbFeaturedEvent, dbFeaturedOrg, dbFeaturedProject, dbFeaturedOpp, dbFeaturedUser, dbFeaturedResearch] =
    await Promise.all([
      prisma.event.findFirst({
        orderBy: { views: "desc" },
        include: { space: { include: { organization: true } } },
      }).catch(() => null),
      prisma.organization.findFirst({
        orderBy: { views: "desc" },
      }).catch(() => null),
      prisma.project.findFirst({
        orderBy: { views: "desc" },
        include: { user: true },
      }).catch(() => null),
      prisma.opportunity.findFirst({
        orderBy: { views: "desc" },
        include: { organization: true },
      }).catch(() => null),
      prisma.user.findFirst({
        orderBy: { createdAt: "desc" },
      }).catch(() => null),
      prisma.research.findFirst({
        orderBy: { createdAt: "desc" },
        include: { user: true },
      }).catch(() => null),
    ]);

  // Construct final featured contents using fallbacks where missing (e.g. unseeded entities)
  const featured = {
    event: dbFeaturedEvent
      ? {
          title: dbFeaturedEvent.title,
          description: dbFeaturedEvent.description || "A major campus gathering for builders.",
          meta: `Happening at ${dbFeaturedEvent.location || "Online"} · ${dbFeaturedEvent.startTime.toLocaleDateString()}`,
          link: `/events/${dbFeaturedEvent.id}`,
          actionText: "RSVP Today",
        }
      : {
          title: "Founders Before Product",
          description: "A weekly gathering of early stage founders and builders sharing raw demos and feedback.",
          meta: "IIT Delhi · 7:00 PM Tonight",
          link: "/events",
          actionText: "RSVP Today",
        },
    org: dbFeaturedOrg
      ? {
          title: dbFeaturedOrg.name,
          description: dbFeaturedOrg.description || "Join this growing hub on Convoke campus.",
          meta: `Ecosystem Hub · Since ${dbFeaturedOrg.createdAt.getFullYear()}`,
          link: `/org/${dbFeaturedOrg.slug}`,
          actionText: "Enter Hub",
        }
      : {
          title: "Lumen Labs",
          description: "Building next-generation developer tooling and compiler designs for modern software teams.",
          meta: "Startup Hub · 11 members active",
          link: "/organizations",
          actionText: "Enter Hub",
        },
    project: dbFeaturedProject
      ? {
          title: dbFeaturedProject.title,
          description: dbFeaturedProject.description || "Shaping the frontier of technology.",
          meta: `Shipped by ${dbFeaturedProject.user?.name || "Builder"}`,
          link: `/projects`,
          actionText: "Explore Work",
        }
      : {
          title: "PlotArmour",
          description: "A real-time security scanning tool and vulnerability analyzer for AI-generated code snippets.",
          meta: "Shipped by Kenji Watanabe (@kenji)",
          link: "/projects",
          actionText: "Explore Work",
        },
    opportunity: dbFeaturedOpp
      ? {
          title: dbFeaturedOpp.title,
          description: dbFeaturedOpp.description || "Open application for ambitious builders.",
          meta: `Hiring at ${dbFeaturedOpp.organization?.name} · ${dbFeaturedOpp.location || "Remote"}`,
          link: `/opportunities`,
          actionText: "Apply Now",
        }
      : {
          title: "Backend Systems Engineer",
          description: "Open roles at high-growth organizations within the campus ecosystem. Looking for 0→1 builders.",
          meta: "Hiring at Lumen Labs · Remote",
          link: "/opportunities",
          actionText: "Apply Now",
        },
    builder: dbFeaturedUser
      ? {
          title: dbFeaturedUser.name || "Anonymous Builder",
          description: dbFeaturedUser.bio || "Building future systems on the Convoke digital campus.",
          meta: `@${dbFeaturedUser.handle || dbFeaturedUser.id.slice(0, 8)} · ${dbFeaturedUser.role || "Builder"}`,
          link: `/profile/${dbFeaturedUser.handle || dbFeaturedUser.id}`,
          actionText: "View Passport",
        }
      : {
          title: "Ananya Rao",
          description: "Tinkering with Rust compilers, distributed key-value databases, and early-stage network routing protocols.",
          meta: "@ananya · Founder, Lumen Labs",
          link: "/explore",
          actionText: "View Passport",
        },
    research: dbFeaturedResearch
      ? {
          title: dbFeaturedResearch.title,
          description: dbFeaturedResearch.abstract || "A scientific paper published on campus.",
          meta: `Published by ${dbFeaturedResearch.user?.name || "Researcher"}`,
          link: `/explore`,
          actionText: "Read Paper",
        }
      : {
          title: "Latency-Aware Mixture of Experts Routing",
          description: "A novel routing algorithm for sparse MoEs that optimizes for inference latency alongside training efficiency.",
          meta: "Published by Marcus Hill (@marcus)",
          link: "/explore",
          actionText: "Read Paper",
        },
  };

  return (
    <Shell>
      <HomeClient stats={stats} feedItems={displayFeed} featured={featured} />
    </Shell>
  );
}
