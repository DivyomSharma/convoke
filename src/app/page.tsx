import { Shell } from "@/components/Shell";
import { prisma } from "@/lib/prisma";
import { HomeClient } from "@/components/HomeClient";
import { getFallbackPhoto } from "@/lib/photos";
import { challengeTypes, isChallengeType } from "@/lib/challenge-types";

export const revalidate = 60;

type HomeFeedItem = {
  id: string;
  tag: string;
  title: string;
  meta: string;
  link: string;
  actionText: string;
  timestamp: number;
  logoUrl?: string | null;
  logoName: string;
};

export default async function HomePage() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

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
    prisma.meet.count({
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
          in: challengeTypes.map((type) => type.value),
        },
      },
    }).catch(() => 0),
    prisma.opportunity.count({
      where: {
        type: "ROLE",
      },
    }).catch(() => 0),
    prisma.project.count().catch(() => 0),
    prisma.meet.count({
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

  const stats = [
    { count: eventsTodayCount, label: "Meets Today" },
    { count: hackathonsCount, label: "Hackathons Open" },
    { count: opportunitiesCount, label: "Opportunities Hiring" },
    { count: projectsCount, label: "Projects Launched" },
    { count: officeHoursCount, label: "Founder Office Hours" },
    { count: buildersCount, label: "Builders Active" },
    { count: newMembersCount, label: "New Members" },
    { count: communitiesCount, label: "Communities Growing" },
  ].filter((s) => s.count > 0);

  const [todayEvents, recentProjects, recentOpportunities, recentSpaces] = await Promise.all([
    prisma.meet.findMany({
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

  const feedItems: HomeFeedItem[] = [];

  todayEvents.forEach((e) => {
    const isLive = new Date() >= e.startTime && new Date() <= e.endTime;
    const timeStr = e.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    feedItems.push({
      id: `event-${e.id}`,
      tag: isLive ? "LIVE NOW" : "TONIGHT",
      title: e.title,
      meta: `${e.location || "Online"} · ${timeStr}`,
      link: `/meets/${e.id}`,
      actionText: isLive ? "Join" : "RSVP",
      timestamp: e.startTime.getTime(),
      logoUrl: e.space.organization?.logoUrl,
      logoName: e.space.organization?.name || "Community",
    });
  });

  recentProjects.forEach((p) => {
    const hoursAgo = Math.max(1, Math.round((Date.now() - p.createdAt.getTime()) / (1000 * 60 * 60)));
    const timeStr = hoursAgo < 24 ? `${hoursAgo} hours ago` : p.createdAt.toLocaleDateString();
    feedItems.push({
      id: `project-${p.id}`,
      tag: "NEW PROJECT",
      title: p.title,
      meta: `Shipped ${timeStr} by ${p.user?.name || "Builder"}`,
      link: `/projects/${p.id}`,
      actionText: "View",
      timestamp: p.createdAt.getTime(),
      logoUrl: p.user?.avatarUrl,
      logoName: p.user?.name || "Builder",
    });
  });

  recentOpportunities.forEach((o) => {
    feedItems.push({
      id: `opp-${o.id}`,
      tag: "NOW HIRING",
      title: o.title,
      meta: `${o.organization?.name || "Organization"} · ${o.location || "Remote"}`,
      link: `/opportunities/${o.id}`,
      actionText: "Apply",
      timestamp: o.createdAt.getTime(),
      logoUrl: o.organization?.logoUrl,
      logoName: o.organization?.name || "Organization",
    });
  });

  recentSpaces.forEach((s) => {
    feedItems.push({
      id: `space-${s.id}`,
      tag: "NEW SPACE",
      title: s.name,
      meta: s.description || "A new space on Convoke",
      link: `/spaces/${s.id}`,
      actionText: "Join",
      timestamp: s.createdAt.getTime(),
      logoUrl: s.organization?.logoUrl,
      logoName: s.organization?.name || "Community",
    });
  });

  const liveAndTonight = feedItems.filter((item) => item.tag === "LIVE NOW" || item.tag === "TONIGHT");
  const otherFeed = feedItems
    .filter((item) => item.tag !== "LIVE NOW" && item.tag !== "TONIGHT")
    .sort((a, b) => b.timestamp - a.timestamp);

  const finalFeed = [...liveAndTonight, ...otherFeed].slice(0, 10);
  const displayFeed = finalFeed;

  const [dbFeaturedEvent, dbFeaturedOrg, dbFeaturedProject, dbFeaturedOpp, dbFeaturedUser, dbFeaturedResearch] =
    await Promise.all([
      prisma.meet.findFirst({
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

  const featured = {
    meet: dbFeaturedEvent
      ? {
          title: dbFeaturedEvent.title,
          description: dbFeaturedEvent.description || "A major network gathering for builders.",
          meta: `Happening at ${dbFeaturedEvent.location || "Online"} · ${dbFeaturedEvent.startTime.toLocaleDateString()}`,
          link: `/meets/${dbFeaturedEvent.id}`,
          actionText: "RSVP Today",
          imageUrl: getFallbackPhoto(dbFeaturedEvent.id, "meet"),
        }
      : {
          title: "No upcoming meets",
          description: "Bring builders together for a technical paper review, workshop, or space mixer.",
          meta: "Create the first meet in the network",
          link: "/meets",
          actionText: "Host Meet",
          imageUrl: getFallbackPhoto("empty-event", "meet"),
        },
    org: dbFeaturedOrg
      ? {
          title: dbFeaturedOrg.name,
          description: dbFeaturedOrg.description || "Join this growing hub on Convoke network.",
          meta: `Ecosystem Hub · Since ${dbFeaturedOrg.createdAt.getFullYear()}`,
          link: `/org/${dbFeaturedOrg.slug}`,
          actionText: "Enter Hub",
          imageUrl: getFallbackPhoto(dbFeaturedOrg.id, "space"),
        }
      : {
          title: "No collectives registered",
          description: "Start a builder organization for your startup hub, college club, or hacking team.",
          meta: "Launch a builder space",
          link: "/organizations",
          actionText: "Create Org",
          imageUrl: getFallbackPhoto("empty-org", "space"),
        },
    project: dbFeaturedProject
      ? {
          title: dbFeaturedProject.title,
          description: dbFeaturedProject.description || "Shaping the frontier of technology.",
          meta: `Shipped by ${dbFeaturedProject.user?.name || "Builder"}`,
          link: `/projects/${dbFeaturedProject.id}`,
          actionText: "Explore Work",
          imageUrl: getFallbackPhoto(dbFeaturedProject.id, "project"),
        }
      : {
          title: "No projects shipped yet",
          description: "Launch what you're working on to gather feedback, downloads, and builder momentum.",
          meta: "Share your latest build with the network",
          link: "/projects",
          actionText: "Launch Project",
          imageUrl: getFallbackPhoto("empty-project", "project"),
        },
    opportunity: dbFeaturedOpp
      ? {
          title: dbFeaturedOpp.title,
          description: dbFeaturedOpp.description || "Open application for builders.",
          meta: `Hiring at ${dbFeaturedOpp.organization?.name} · ${dbFeaturedOpp.location || "Remote"}`,
          link: isChallengeType(dbFeaturedOpp.type) 
            ? `/challenges/${dbFeaturedOpp.id}` 
            : `/opportunities/${dbFeaturedOpp.id}`,
          actionText: "Apply Now",
          imageUrl: getFallbackPhoto(dbFeaturedOpp.id, "opportunity"),
        }
      : {
          title: "No active opportunities",
          description: "Hire founding developers, post roles, or offer research fellowships to builders in the network.",
          meta: "Post a role to source builder talent",
          link: "/opportunities",
          actionText: "Post Role",
          imageUrl: getFallbackPhoto("empty-opportunity", "opportunity"),
        },
    builder: dbFeaturedUser
      ? {
          title: dbFeaturedUser.name || "Anonymous Builder",
          description: dbFeaturedUser.bio || "Building future systems on the Convoke digital network.",
          meta: `@${dbFeaturedUser.handle || dbFeaturedUser.username || dbFeaturedUser.displayName || "builder"} · ${dbFeaturedUser.role || "Builder"}`,
          link: `/profile/${dbFeaturedUser.handle || dbFeaturedUser.username || dbFeaturedUser.displayName || "builder"}`,
          actionText: "View Passport",
          imageUrl: dbFeaturedUser.avatarUrl || getFallbackPhoto(dbFeaturedUser.id, "space"),
        }
      : {
          title: "Setup your passport",
          description: "Passports verify builder identity, contribution history, memberships, and space vouches.",
          meta: "Verify your developer passport today",
          link: "/explore",
          actionText: "Explore Passports",
          imageUrl: getFallbackPhoto("empty-builder", "space"),
        },
    research: dbFeaturedResearch
      ? {
          title: dbFeaturedResearch.title,
          description: dbFeaturedResearch.abstract || "A scientific paper published in the network.",
          meta: `Published by ${dbFeaturedResearch.user?.name || "Researcher"}`,
          link: "/research",
          actionText: "Read Paper",
          imageUrl: getFallbackPhoto(dbFeaturedResearch.id, "project"),
        }
      : {
          title: "No research publications",
          description: "Drop academic papers, system architectures, white papers, or tech notes for peer review.",
          meta: "Drop the first technical paper",
          link: "/research",
          actionText: "Publish Paper",
          imageUrl: getFallbackPhoto("empty-research", "project"),
        },
  };

  return (
    <Shell>
      <HomeClient stats={stats} feedItems={displayFeed} featured={featured} />
    </Shell>
  );
}
