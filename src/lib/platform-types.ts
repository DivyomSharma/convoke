export type OpportunityCard = {
  id: string;
  slug: string;
  title: string;
  organization: string;
  organizationSlug: string;
  type: string;
  location: string;
  isRemote: boolean;
  stipend: string | null;
  deadlineLabel: string;
  description: string;
  skills: string[];
  applicants: number;
  postedAgo: string;
  saved?: boolean;
  applied?: boolean;
};

export type CommunityCard = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  location: string;
  members: number;
  image: string;
  type?: string;
};

export type EventCard = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  city: string;
  date: string;
  category: string;
  price: number;
  mode: string;
  organizer: string;
  organizerSlug: string;
  attendees: number;
  image: string;
  palette: string;
  saved?: boolean;
  registered?: boolean;
};

export type SpotlightPerson = {
  id: string;
  username: string;
  name: string;
  initials: string;
  role: string;
  headline: string;
  community?: string;
};

export type ProfileView = {
  id: string;
  username: string;
  name: string;
  role: string;
  headline: string;
  bio: string;
  avatarFallback: string;
  location?: string;
  website?: string;
  socials: { label: string; href: string }[];
  badges: string[];
  skills: string[];
  stats: { label: string; value: string }[];
  experiences: { id: string; title: string; org: string; period: string; description?: string }[];
  projects: { id: string; name: string; description: string; url?: string; technologies: string[] }[];
  communities: { id: string; name: string; role: string; slug: string }[];
  recentEvents: { id: string; title: string; role: string; slug: string }[];
  certificates: { id: string; title: string; type: string; issuedAt: string }[];
};

export type CommunityView = {
  id: string;
  slug: string;
  name: string;
  type: string;
  description: string;
  website?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  location: string;
  stats: { label: string; value: string }[];
  links: { label: string; href: string }[];
  events: EventCard[];
  opportunities: OpportunityCard[];
  members: SpotlightPerson[];
  announcements: { id: string; title: string; content: string; publishedAt: string }[];
  galleries: { id: string; title: string; items: string[] }[];
};

export type EventView = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  city: string;
  date: string;
  category: string;
  mode: string;
  organizer: string;
  organizerSlug: string;
  description: string;
  image: string;
  palette: string;
  attendees: number;
  volunteers: number;
  price: number;
  spotsLeft: number;
  saved: boolean;
  registered: boolean;
  ticketTypes: { id: string; name: string; priceInr: number; sold: number; capacity: number | null }[];
  schedules: { id: string; title: string; description?: string; startsAt: string; endsAt: string; location?: string }[];
  speakers: { id: string; name: string; title: string; organization?: string; bio?: string; talkTitle?: string }[];
  sponsors: { id: string; companyName: string; tier: string; benefits: string[] }[];
  faqs: { q: string; a: string }[];
  galleries: string[];
};

export type DashboardView = {
  viewer: SpotlightPerson;
  role: string;
  bookmarks: {
    events: EventCard[];
    opportunities: OpportunityCard[];
    communities: CommunityCard[];
  };
  registrations: {
    id: string;
    eventTitle: string;
    eventSlug: string;
    status: string;
    ticketType?: string;
    createdAt: string;
  }[];
  applications: {
    id: string;
    title: string;
    organization: string;
    status: string;
    appliedAt: string;
  }[];
  certificates: { id: string; title: string; type: string; issuedAt: string }[];
  communities: { id: string; slug: string; name: string; role: string }[];
  notifications: { id: string; title: string; message: string; createdAt: string; unread: boolean }[];
  organizerData?: {
    organizations: { id: string; slug: string; name: string }[];
    events: EventCard[];
    opportunities: OpportunityCard[];
    registrations: {
      id: string;
      userName: string;
      userEmail: string;
      status: string;
      eventTitle: string;
    }[];
    volunteerApplications: {
      id: string;
      userName: string;
      eventTitle: string;
      role: string;
      status: string;
    }[];
    sponsorLeads: {
      id: string;
      companyName: string;
      stage: string;
      contactEmail: string;
      eventTitle?: string;
    }[];
  };
};
