"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock3, MapPin, Plus, Users, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createEvent } from "@/app/actions/workspace";

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

      {events.length === 0 ? (
        <section className="mt-8 premium-card p-12 text-center relative z-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-g3 bg-g1 text-[var(--brand)]">
            <CalendarDays size={26} />
          </div>
          <h2 className="mt-6 serif text-3xl">No events are live yet</h2>
          <p className="mx-auto mt-3 max-w-[42ch] text-[15px] leading-7 text-g5">
            Launch the first gathering for your community, startup, or college chapter. This directory only fills with real events.
          </p>
          <div className="mt-8">
            <button 
              onClick={() => setDrawerOpen(true)}
              className="ink-button px-5 text-[14px] font-medium cursor-pointer"
            >
              <Plus size={16} />
              <span>Create the first event</span>
            </button>
          </div>
        </section>
      ) : (
        <section className="mt-8 grid gap-5 relative z-10">
          {events.map((event) => {
            const startsOn = new Date(event.startTime);
            const endsOn = new Date(event.endTime);
            const isLive = new Date() >= startsOn && new Date() <= endsOn;

            return (
              <Link key={event.id} href={`/events/${event.id}`} className="premium-card campus-frame block p-6 md:p-8">
                <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-[color:var(--brand)]/25 bg-[color:var(--brand)]/10 px-3 py-1 mono text-[11px] uppercase tracking-[0.18em] text-[var(--brand)]">
                        {isLive ? "Live now" : "Upcoming"}
                      </span>
                      <span className="mono text-[11px] uppercase tracking-[0.18em] text-g4">
                        {event.space.organization.name}
                      </span>
                    </div>
                    <h2 className="mt-5 serif text-3xl tracking-tight md:text-5xl">{event.title}</h2>
                    <p className="mt-4 max-w-3xl text-[15px] leading-7 text-g5 line-clamp-2">
                      {event.description || "No event brief published yet."}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3 text-[13px] text-g5">
                      <span className="inline-flex items-center gap-2 rounded-full border border-g3 bg-g1/60 px-3 py-2">
                        <CalendarDays size={14} className="text-[var(--brand)]" />
                        {startsOn.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-g3 bg-g1/60 px-3 py-2">
                        <Clock3 size={14} className="text-[var(--brand)]" />
                        {startsOn.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-g3 bg-g1/60 px-3 py-2">
                        <MapPin size={14} className="text-[var(--brand)]" />
                        {event.location || "Online"}
                      </span>
                    </div>
                  </div>

                  <div className="glass-panel rounded-[26px] p-5 md:p-6">
                    <div className="eyebrow">Attendance</div>
                    <div className="mt-3 serif text-4xl">{String(event._count.attendance).padStart(2, "0")}</div>
                    <div className="mt-2 text-[14px] leading-6 text-g5">
                      {event.capacity ? `${event.capacity} seats available in total.` : "Open capacity for all interested members."}
                    </div>

                    <div className="mt-6 space-y-3 border-t border-g3 pt-5 text-[13px] text-g5">
                      <div className="flex items-center justify-between">
                        <span>Space</span>
                        <span className="text-ink">{event.space.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Waitlist</span>
                        <span className="text-ink">{event.waitlistCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Venue</span>
                        <span className="text-ink">{event.venue || "TBA"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
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
