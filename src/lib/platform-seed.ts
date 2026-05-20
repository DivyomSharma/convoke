import {
  communities,
  featuredEvents,
  opportunities,
  seedPeople,
} from "@/data/platform";

function usernameFor(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export const seedOrganizations = communities.map((community, index) => ({
  slug: community.slug,
  name: community.name,
  type: community.tags[0] ?? "Community",
  description: community.tagline,
  website: `https://${community.slug}.theconvoke.xyz`,
  avatarUrl: community.image,
  bannerUrl: community.image,
  location: community.location,
  membersCount: community.members,
  eventsCount: featuredEvents.filter((event) => event.organizerSlug === community.slug).length,
  opportunitiesCount: opportunities.filter(
    (opportunity) => opportunity.organizationSlug === community.slug,
  ).length,
  socialLinks: [
    `https://instagram.com/${community.slug}`,
    `https://x.com/${community.slug}`,
  ],
  index,
}));

export const seedUsers = seedPeople.map((person, index) => {
  const organization = seedOrganizations.find((item) => item.name === person.community);
  const role =
    person.role.includes("Founder") || person.role.includes("Organizer")
      ? "ORGANIZER"
      : person.role.includes("Volunteer")
        ? "VOLUNTEER"
        : person.role.includes("Creator")
          ? "CREATOR"
          : person.role.includes("Ambassador")
            ? "COMMUNITY_ADMIN"
            : "ATTENDEE";

  return {
    username: usernameFor(person.name),
    email: `${usernameFor(person.name)}@convoke.seed`,
    name: person.name,
    headline: person.role,
    role,
    bio: `${person.name} is part of ${person.community}, building momentum through events, opportunities, and community projects.`,
    location: organization?.location ?? "India",
    website: `https://portfolio.theconvoke.xyz/${usernameFor(person.name)}`,
    socials: {
      github: `https://github.com/${usernameFor(person.name)}`,
      instagram: `https://instagram.com/${usernameFor(person.name)}`,
      linkedin: `https://linkedin.com/in/${usernameFor(person.name)}`,
    },
    skills:
      role === "ORGANIZER"
        ? ["Community building", "Events", "Operations", "Partnerships"]
        : role === "VOLUNTEER"
          ? ["Coordination", "People ops", "Logistics", "Execution"]
          : ["Product", "Design", "Growth", "Collaboration"],
    badges:
      role === "ORGANIZER"
        ? ["Organizer", "Community Builder", "Event Lead"]
        : role === "VOLUNTEER"
          ? ["Volunteer", "Execution", "Campus Crew"]
          : ["Builder", "Explorer", "Contributor"],
    stats: {
      eventsAttended: 3 + (index % 5),
      eventsOrganized: role === "ORGANIZER" ? 1 + (index % 3) : 0,
      volunteerHours: role === "VOLUNTEER" ? 20 + index * 3 : 6 + index,
      communitiesJoined: 1 + (index % 3),
    },
    experience: {
      company: person.community,
      position: person.role,
      description: `Driving initiatives inside ${person.community} through Convoke.`,
    },
    project: {
      name: `${person.community} momentum board`,
      description: "A portfolio case study covering events, collaborations, and outcomes.",
      technologies: ["Next.js", "Community Ops", "Design Systems"],
    },
    organizationSlug: organization?.slug,
    avatarFallback: initials(person.name),
  };
});

export const seedAnnouncements = seedOrganizations.flatMap((organization, index) => [
  {
    organizationSlug: organization.slug,
    title: `${organization.name} applications are open`,
    content: `Fresh opportunities, registrations, and collaborations are now live inside ${organization.name}.`,
    publishedAt: new Date(Date.UTC(2026, 4, 1 + index)).toISOString(),
  },
]);

export const seedOpportunities = opportunities.map((opportunity, index) => ({
  ...opportunity,
  slug: `opportunity-${index + 1}-${opportunity.organizationSlug}`,
  location: opportunity.location,
  organizationSlug: opportunity.organizationSlug,
  applicationDeadline:
    opportunity.deadline === "Rolling" || opportunity.deadline === "Open"
      ? null
      : new Date(`${opportunity.deadline} 23:59:59 GMT+0530`).toISOString(),
  featured: index < 4,
}));

export const seedEventFaqs: Record<string, { q: string; a: string }[]> = {
  "summit-zero": [
    { q: "Who is this for?", a: "Founders, operators, student builders, and startup-curious people." },
    { q: "Are there startup showcases?", a: "Yes. Demos, mentor rooms, and founder sessions are part of the event flow." },
  ],
  "campus-protocol": [
    { q: "Can multiple societies attend?", a: "Yes. The event is designed for societies, clubs, and campus collectives." },
    { q: "Do volunteers get certificates?", a: "Yes. Approved volunteers receive profile-linked certificates." },
  ],
  "forge-hack": [
    { q: "Can I join solo?", a: "Yes. Team formation happens at check-in and during the first build block." },
    { q: "Do you support waitlists?", a: "Yes. If capacity fills, Convoke moves users into a waitlist state." },
  ],
};

export const seedEventSchedules = featuredEvents.map((event, index) => ({
  eventSlug: event.slug,
  items: [
    {
      title: `${event.title} opening`,
      description: "Registration, welcome, and orientation.",
      startsAt: new Date(Date.UTC(2026, 4, 20 + index, 4)).toISOString(),
      endsAt: new Date(Date.UTC(2026, 4, 20 + index, 5)).toISOString(),
      location: event.city,
    },
    {
      title: "Community sessions",
      description: "Talks, workshops, and breakout rooms.",
      startsAt: new Date(Date.UTC(2026, 4, 20 + index, 6)).toISOString(),
      endsAt: new Date(Date.UTC(2026, 4, 20 + index, 10)).toISOString(),
      location: event.city,
    },
    {
      title: "Closing mixer",
      description: "Networking, announcements, and next steps.",
      startsAt: new Date(Date.UTC(2026, 4, 20 + index, 11)).toISOString(),
      endsAt: new Date(Date.UTC(2026, 4, 20 + index, 12)).toISOString(),
      location: event.city,
    },
  ],
}));

export const seedVolunteerApplications = seedUsers
  .slice(0, 6)
  .map((user, index) => ({
    username: user.username,
    eventSlug: featuredEvents[index % featuredEvents.length].slug,
    role: ["Check-in", "Community Desk", "Stage", "Media", "Logistics", "Mentor Crew"][index],
    status: index < 3 ? "APPROVED" : "PENDING",
    hours: 10 + index * 4,
  }));

export const seedSponsorLeads = [
  {
    organizationSlug: "convoke-labs",
    eventSlug: "forge-hack",
    companyName: "Zephyr Labs",
    contactEmail: "partnerships@zephyrlabs.com",
    stage: "NEGOTIATING",
    valueInr: 300000,
  },
  {
    organizationSlug: "north-grid",
    eventSlug: "campus-protocol",
    companyName: "CloudNine Tech",
    contactEmail: "campus@cloudnine.tech",
    stage: "REPLIED",
    valueInr: 150000,
  },
  {
    organizationSlug: "plotarmour-studio",
    eventSlug: "summit-zero",
    companyName: "Urban Brew Co.",
    contactEmail: "brand@urbanbrew.co",
    stage: "CONTACTED",
    valueInr: 50000,
  },
];

export const seedMerchInquiries = [
  {
    organizationSlug: "convoke-labs",
    apparelType: "Oversized tees",
    quantity: 250,
    budget: "INR 600-900 per piece",
    timeline: "3 weeks",
    city: "Pune",
    references: ["https://merch.theplotarmour.xyz"],
    stylePreferences: "Heavyweight, oversized, minimal front chest mark.",
    status: "QUOTATION_SENT",
  },
];

export const seedGalleryImages = featuredEvents.reduce<Record<string, string[]>>(
  (accumulator, event, index) => {
    accumulator[event.slug] = [
      event.image,
      communities[index % communities.length].image,
      communities[(index + 1) % communities.length].image,
    ];
    return accumulator;
  },
  {},
);
