export type OpportunityCard = {
  id: string;
  slug: string;
  title: string;
  organization: string;
  organizationSlug: string;
  community?: string;
  communitySlug?: string;
  type: string;
  location: string;
  isRemote: boolean;
  stipend: string | null;
  deadlineLabel: string;
  description: string;
  skills: string[];
  perks: string[];
  applicants: number;
  postedAgo: string;
  saved?: boolean;
  applied?: boolean;
  featured?: boolean;
};

export type OpportunityView = OpportunityCard & {
  organizationDescription?: string;
  positionsAvailable: number;
  duration?: string | null;
  requirements: string[];
  related: OpportunityCard[];
};

export type CommunityCard = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  location: string;
  members: number;
  image: string;
  type: string;
  momentum: number;
  featured?: boolean;
};

export type EventCard = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  city: string;
  venue?: string;
  date: string;
  category: string;
  price: number;
  mode: string;
  organizer: string;
  organizerSlug: string;
  community?: string;
  communitySlug?: string;
  attendees: number;
  waitlist: number;
  image: string;
  palette: string;
  saved?: boolean;
  registered?: boolean;
  featured?: boolean;
};

export type SpotlightPerson = {
  id: string;
  username: string;
  name: string;
  initials: string;
  role: string;
  headline: string;
  community?: string;
  reputation?: number;
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
  reputation: number;
  socials: { label: string; href: string }[];
  badges: string[];
  skills: string[];
  interests: string[];
  stats: { label: string; value: string }[];
  experiences: { id: string; title: string; org: string; period: string; description?: string }[];
  projects: { id: string; name: string; description: string; url?: string; technologies: string[] }[];
  communities: { id: string; name: string; role: string; slug: string }[];
  recentEvents: { id: string; title: string; role: string; slug: string }[];
  certificates: { id: string; title: string; type: string; issuedAt: string }[];
  memberSince?: string;
  activityTimeline?: { id: string; type: string; title: string; date: string; description: string }[];
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
  momentum: number;
  stats: { label: string; value: string }[];
  links: { label: string; href: string }[];
  events: EventCard[];
  opportunities: OpportunityCard[];
  members: SpotlightPerson[];
  announcements: { id: string; title: string; content: string; publishedAt: string }[];
  galleries: { id: string; title: string; items: string[] }[];
  joined?: boolean;
};

export type EventView = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  city: string;
  venue?: string;
  date: string;
  category: string;
  mode: string;
  organizer: string;
  organizerSlug: string;
  community?: string;
  communitySlug?: string;
  description: string;
  image: string;
  palette: string;
  attendees: number;
  volunteers: number;
  price: number;
  waitlist: number;
  saved: boolean;
  registered: boolean;
  ticketTypes: { id: string; name: string; priceInr: number; sold: number; capacity: number | null }[];
  schedules: { id: string; title: string; description?: string; startsAt: string; endsAt: string; location?: string }[];
  tracks: { id: string; name: string; description?: string }[];
  speakers: { id: string; name: string; title: string; organization?: string; bio?: string; talkTitle?: string }[];
  judges: { id: string; name: string; title?: string; organization?: string; bio?: string }[];
  sponsors: { id: string; companyName: string; tier: string; benefits: string[] }[];
  faqs: { q: string; a: string }[];
  galleries: string[];
};

export type DashboardView = {
  viewer: SpotlightPerson;
  role: string;
  metrics: { label: string; value: string; detail: string }[];
  roleActions: { title: string; copy: string; href: string }[];
  activity: { id: string; actor: string; action: string; detail: string; createdAt: string }[];
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
      userEmail?: string;
      eventTitle: string;
      role: string;
      status: string;
    }[];
    applications: {
      id: string;
      applicantName: string;
      applicantEmail: string;
      opportunityTitle: string;
      status: string;
      portfolioUrl?: string;
      createdAt: string;
    }[];
    sponsorLeads: {
      id: string;
      companyName: string;
      stage: string;
      contactEmail: string;
      eventTitle?: string;
    }[];
    merchInquiries: {
      id: string;
      apparelType: string;
      quantity: number;
      status: string;
      city: string;
    }[];
    studioRequests: {
      id: string;
      title: string;
      type: string;
      status: string;
    }[];
  };
};
