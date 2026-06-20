"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock3, MapPin, Plus, Users, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createEvent } from "@/app/actions/workspace";
import { getFallbackPhoto } from "@/lib/photos";

interface EventWithDetails {
  id: string;
  title: string;
  description: string | null;
  bannerUrl: string | null;
  startTime: Date;
  endTime: Date;
  location: string | null;
  venue: string | null;
  capacity: number | null;
  waitlistCount: number;
  space: {
    name: string;
    organization: {
      name: string;
    };
  };
  _count: {
    attendance: number;
  };
}

interface SpaceOption {
  id: string;
  name: string;
  organization: {
    name: string;
  };
}

export function EventsList({ 
  initialEvents, 
  spaces 
}: { 
  initialEvents: EventWithDetails[];
  spaces: SpaceOption[];
}) {
  const router = useRouter();
  const [events, setEvents] = useState<EventWithDetails[]>(initialEvents);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [spaceId, setSpaceId] = useState(spaces[0]?.id || "");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("ONLINE");
  const [venue, setVenue] = useState("");
  const [capacity, setCapacity] = useState("");
  const [requirements, setRequirements] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !spaceId || !startTime || !endTime) {
      setError("Title, space, start time, and end time are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await createEvent({
        title,
        spaceId,
        startTime,
        endTime,
        description: description || undefined,
        bannerUrl: bannerUrl || undefined,
        location: location || undefined,
        venue: venue || undefined,
        capacity: capacity ? Number(capacity) : undefined,
        requirements: requirements || undefined,
      });

      if (res.success && res.event) {
        setDrawerOpen(false);
        setTitle("");
        setDescription("");
        setBannerUrl("");
        setStartTime("");
        setEndTime("");
        setLocation("ONLINE");
        setVenue("");
        setCapacity("");
        setRequirements("");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Failed to host event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="campus-frame premium-card p-7 md:p-10 z-10 relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="eyebrow">Live calendar</div>
            <h1 className="mt-3 serif text-5xl tracking-tight md:text-7xl">
              Events built for momentum, not optics.
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-g5 md:text-[17px]">
              Workshops, campus mixers, founder circles, demo nights, and technical gatherings that actually connect people to rooms, roles, and collaborators.
            </p>
          </div>
          <button 
            onClick={() => setDrawerOpen(true)}
            className="ink-button px-5 text-[14px] font-medium flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Plus size={16} />
            <span>Host Event</span>
          </button>
        </div>
      </section>

      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-g3 pb-8 z-10 relative">
        <div>
          <div className="mono text-[11px] tracking-[0.2em] uppercase text-g5">
            (04) Calendar
          </div>
          <h1 className="serif text-5xl md:text-7xl mt-4 tracking-tight">Events</h1>
          <p className="text-g5 mt-4 text-[16px] max-w-[50ch] leading-relaxed">
            Gatherings built for momentum, not optics. Paper reviews, circles, and demo nights.
          </p>
        </div>
        <button 
          onClick={() => setDrawerOpen(true)}
          className="ink-button px-5 text-[14px] font-medium flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus size={15} />
          <span>Host Event</span>
        </button>
      </div>

      {events.length === 0 ? (
        <section className="mt-16 text-center py-20 relative z-10">
          <h2 className="serif text-4xl text-ink font-light">No gatherings scheduled</h2>
          <p className="mx-auto mt-4 max-w-[36ch] text-[15px] leading-relaxed text-g5">
            Launch the first mixer, circle, or code sprint.
          </p>
          <button 
            onClick={() => setDrawerOpen(true)}
            className="ink-button px-5 mt-8 text-[14px] font-medium cursor-pointer"
          >
            Create the first event
          </button>
        </section>
      ) : (
        <div className="mt-12 space-y-16 relative z-10">
          {(() => {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
            const dayAfterTomorrow = new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000);
            const endOfWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

            const todayEvents = events.filter(e => {
              const d = new Date(e.startTime);
              return d >= today && d < tomorrow;
            });
            const tomorrowEvents = events.filter(e => {
              const d = new Date(e.startTime);
              return d >= tomorrow && d < dayAfterTomorrow;
            });
            const thisWeekEvents = events.filter(e => {
              const d = new Date(e.startTime);
              return d >= dayAfterTomorrow && d <= endOfWeek;
            });
            const upcomingEvents = events.filter(e => {
              const d = new Date(e.startTime);
              return d > endOfWeek;
            });
            const pastEvents = events.filter(e => {
              const d = new Date(e.startTime);
              return d < today;
            });

            const renderSection = (title: string, list: EventWithDetails[]) => {
              if (list.length === 0) return null;
              return (
                <div className="border-b border-g3/60 pb-12 last:border-0 last:pb-0">
                  <h2 className="serif text-3xl italic text-ink border-b border-g3/40 pb-2 mb-8 font-light">
                    {title}
                  </h2>
                  <div className="flex flex-col gap-12">
                    {list.map((event) => {
                      const startsOn = new Date(event.startTime);
                      const endsOn = new Date(event.endTime);
                      const isLive = new Date() >= startsOn && new Date() <= endsOn;
                      const banner = event.bannerUrl || getFallbackPhoto(event.id, 'event');

                      return (
                        <div key={event.id} className="group grid gap-8 lg:grid-cols-12 lg:items-center">
                          {/* Event B/W Photography Banner */}
                          <div className="lg:col-span-5">
                            <Link href={`/events/${event.id}`} className="block overflow-hidden rounded-sm bg-g1 aspect-[16/10] relative">
                              <img 
                                src={banner} 
                                alt={event.title} 
                                className="w-full h-full object-cover" 
                              />
                            </Link>
                          </div>

                          {/* Event details */}
                          <div className="lg:col-span-7 flex flex-col justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-3 text-[11px] mono uppercase tracking-wider text-g5 mb-4">
                                <span className={isLive ? "text-brand" : ""}>
                                  {isLive ? "Live now" : startsOn.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </span>
                                <span>•</span>
                                <span>{startsOn.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                                <span>•</span>
                                <span>{event.space.organization.name}</span>
                              </div>

                              <Link href={`/events/${event.id}`} className="block mt-2">
                                <h3 className="serif text-3xl leading-tight text-ink md:text-4xl group-hover:underline decoration-1 decoration-g4 underline-offset-4 font-light">
                                  {event.title}
                                </h3>
                              </Link>

                              <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.6] text-g5">
                                {event.description || "Gathering details are forming. Stay tuned for details."}
                              </p>

                              <div className="mt-6 flex flex-wrap gap-4 text-[11px] mono uppercase tracking-wider text-g4">
                                <span>Location: {event.location || "Online"}</span>
                                <span>•</span>
                                <span>Attendance: {event._count.attendance} / {event.capacity || "Open"}</span>
                              </div>
                            </div>

                            <div className="mt-8">
                              <Link 
                                href={`/events/${event.id}`}
                                className="text-[13px] font-medium text-ink hover:underline underline-offset-4 inline-flex items-center gap-2"
                              >
                                <span>View Gathering</span>
                                <span className="text-[11px] opacity-70">→</span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            };

            return (
              <>
                {renderSection("Today", todayEvents)}
                {renderSection("Tomorrow", tomorrowEvents)}
                {renderSection("This Week", thisWeekEvents)}
                {renderSection("Upcoming", upcomingEvents)}
                {renderSection("Archive", pastEvents)}
              </>
            );
          })()}
        </div>
      )}

      {/* Creation Drawer Overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-[#000000] z-40 backdrop-blur-sm"
            />

            {/* Slide-over Drawer */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full max-w-[500px] bg-paper border-l border-g3/80 shadow-[0_0_80px_rgba(0,0,0,0.8)] z-50 flex flex-col h-full"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-g3/60">
                <div>
                  <h2 className="serif text-2xl text-ink">Host an Event</h2>
                  <p className="text-xs text-g5 mt-0.5">Publish a workshop, mixer, or demo night.</p>
                </div>
                <button 
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-full hover:bg-g1/80 text-g5 hover:text-ink transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Form */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center">
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Event Title <span className="text-red-500">*</span></label>
                  <input 
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="E.g. AI Builder Circle: Mixer #1"
                    className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Target Space <span className="text-red-500">*</span></label>
                  {spaces.length === 0 ? (
                    <div className="text-xs text-amber-500 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      You must create an organization and a space first before you can host an event.
                    </div>
                  ) : (
                    <select 
                      value={spaceId}
                      onChange={(e) => setSpaceId(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-g3 bg-paper text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                    >
                      {spaces.map((sp) => (
                        <option key={sp.id} value={sp.id}>
                          {sp.name} ({sp.organization.name})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Start Date & Time <span className="text-red-500">*</span></label>
                    <input 
                      type="datetime-local"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">End Date & Time <span className="text-red-500">*</span></label>
                    <input 
                      type="datetime-local"
                      required
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Location Type</label>
                    <select 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-g3 bg-paper text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                    >
                      <option value="ONLINE">Online</option>
                      <option value="IN_PERSON">In Person</option>
                      <option value="HYBRID">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Venue Name</label>
                    <input 
                      type="text"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="E.g. Seminar Hall, Zoom Link"
                      className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Capacity (Max Seats)</label>
                    <input 
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="Leave empty for unlimited"
                      className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Banner Image URL</label>
                    <input 
                      type="url"
                      value={bannerUrl}
                      onChange={(e) => setBannerUrl(e.target.value)}
                      placeholder="https://unsplash.com/... or direct image link"
                      className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Event Description</label>
                  <textarea 
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details about what will happen at the event, who it's for, speakers, agendas, etc..."
                    className="w-full p-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Participation Requirements / Pre-requisites</label>
                  <textarea 
                    rows={3}
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="E.g. Laptop required, bring github project, RSVP required, etc."
                    className="w-full p-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all resize-none"
                  />
                </div>
              </form>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-g3/60 bg-g1/20 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="flex-1 h-11 rounded-full border border-g3 text-xs font-semibold hover:bg-g1 text-ink transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || spaces.length === 0}
                  className="flex-1 h-11 rounded-full bg-ink hover:opacity-95 text-paper text-xs font-semibold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 border border-[var(--brand)]/20 cursor-pointer"
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  <span>Host Gathering</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
