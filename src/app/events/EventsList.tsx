"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createEvent } from "@/app/actions/workspace";
import { getFallbackPhoto } from "@/lib/photos";
import { CardRing } from "@/components/ui/card-ring";

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
  const [creationOpen, setCreationOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [timeframe, setTimeframe] = useState<"ALL" | "TODAY" | "WEEK" | "UPCOMING">("ALL");
  const [sort, setSort] = useState<"ASC" | "DESC">("ASC");

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerFileName, setBannerFileName] = useState("");
  const [spaceId, setSpaceId] = useState(spaces[0]?.id || "");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("ONLINE");
  const [venue, setVenue] = useState("");
  const [capacity, setCapacity] = useState("");
  const [requirements, setRequirements] = useState("");
  const nowForFilters = new Date();
  const todayForFilters = new Date(nowForFilters.getFullYear(), nowForFilters.getMonth(), nowForFilters.getDate());
  const tomorrowForFilters = new Date(todayForFilters.getTime() + 24 * 60 * 60 * 1000);
  const endOfWeekForFilters = new Date(todayForFilters.getTime() + 7 * 24 * 60 * 60 * 1000);
  const visibleEvents = events
    .filter((event) => {
      const haystack = `${event.title} ${event.description || ""} ${event.space.name} ${event.space.organization.name} ${event.location || ""}`.toLowerCase();
      const startsOn = new Date(event.startTime);
      const matchesQuery = !query.trim() || haystack.includes(query.toLowerCase().trim());
      const matchesTimeframe =
        timeframe === "ALL" ||
        (timeframe === "TODAY" && startsOn >= todayForFilters && startsOn < tomorrowForFilters) ||
        (timeframe === "WEEK" && startsOn >= todayForFilters && startsOn <= endOfWeekForFilters) ||
        (timeframe === "UPCOMING" && startsOn >= nowForFilters);

      return matchesQuery && matchesTimeframe;
    })
    .sort((a, b) => {
      const diff = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      return sort === "ASC" ? diff : -diff;
    });

  const handleBannerUpload = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file for the meet banner.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setBannerUrl(String(reader.result));
      setBannerFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

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
        setCreationOpen(false);
        setTitle("");
        setDescription("");
        setBannerUrl("");
        setBannerFileName("");
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
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-g3 pb-8 z-10 relative">
        <div>
          <div className="mono text-[11px] tracking-[0.2em] uppercase text-g5">
            (04) Meets
          </div>
          <h1 className="serif text-5xl md:text-7xl mt-4 tracking-tight">Meets</h1>
          <p className="text-g5 mt-4 text-[16px] max-w-[50ch] leading-relaxed">
            Conferences, meetups, gatherings, seminars, workshops, founder circles, and quiet rooms worth entering.
          </p>
        </div>
        <button 
          onClick={() => setCreationOpen(true)}
          className="ink-button px-5 text-[14px] font-medium flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus size={15} />
          <span>Host Meet</span>
        </button>
      </div>

      <div className="relative z-10 mt-6 grid gap-3 rounded-[28px] border border-g3 bg-paper-elevated/55 p-3 backdrop-blur-xl md:grid-cols-[1fr_auto_auto]">
        <label className="flex h-11 items-center gap-3 rounded-full border border-g3 bg-paper-card/70 px-4">
          <Search size={15} className="text-brand" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search meets, spaces, cities..."
            className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-g4"
          />
        </label>
        <select
          value={timeframe}
          onChange={(event) => setTimeframe(event.target.value as typeof timeframe)}
          className="h-11 rounded-full border border-g3 bg-paper-card/70 px-4 text-[13px] text-ink outline-none"
        >
          <option value="ALL">All meets</option>
          <option value="TODAY">Today</option>
          <option value="WEEK">This week</option>
          <option value="UPCOMING">Upcoming</option>
        </select>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as typeof sort)}
          className="h-11 rounded-full border border-g3 bg-paper-card/70 px-4 text-[13px] text-ink outline-none"
        >
          <option value="ASC">Soonest first</option>
          <option value="DESC">Newest first</option>
        </select>
      </div>

      {visibleEvents.length === 0 ? (
        <section className="mt-16 text-center py-20 relative z-10">
          <h2 className="serif text-4xl text-ink font-light">No meets found</h2>
          <p className="mx-auto mt-4 max-w-[36ch] text-[15px] leading-relaxed text-g5">
            Adjust the filters or launch the first mixer, circle, seminar, or code sprint.
          </p>
          <button 
            onClick={() => setCreationOpen(true)}
            className="ink-button px-5 mt-8 text-[14px] font-medium cursor-pointer"
          >
            Create the first meet
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

            const todayEvents = visibleEvents.filter(e => {
              const d = new Date(e.startTime);
              return d >= today && d < tomorrow;
            });
            const tomorrowEvents = visibleEvents.filter(e => {
              const d = new Date(e.startTime);
              return d >= tomorrow && d < dayAfterTomorrow;
            });
            const thisWeekEvents = visibleEvents.filter(e => {
              const d = new Date(e.startTime);
              return d >= dayAfterTomorrow && d <= endOfWeek;
            });
            const upcomingEvents = visibleEvents.filter(e => {
              const d = new Date(e.startTime);
              return d > endOfWeek;
            });
            const pastEvents = visibleEvents.filter(e => {
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
                        <div key={event.id} className="group grid gap-0 lg:grid-cols-12 lg:items-stretch premium-card campus-frame overflow-hidden relative border border-[#1a1a1a] hover:border-[#2f2f2f] transition-all duration-700 hover:-translate-y-[2px] ease-[cubic-bezier(0.22,0.61,0.36,1)]">
                          
                          {/* Event Card Ring */}
                          <div className="absolute -right-[15%] top-1/2 -translate-y-1/2 opacity-8 group-hover:opacity-25 transition-opacity duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] hidden md:block">
                            <CardRing size={600} text="CONVOKE • FOR PEOPLE BUILDING THE FUTURE • " />
                          </div>

                          {/* Event B/W Photography Banner */}
                          <div className="lg:col-span-4 relative z-10">
                            <Link href={`/events/${event.id}`} className="block overflow-hidden bg-g1 aspect-[3/2] h-full relative">
                              <img 
                                src={banner} 
                                alt={event.title} 
                                className="w-full h-full object-cover" 
                              />
                            </Link>
                          </div>

                          {/* Event details */}
                          <div className="lg:col-span-8 flex flex-col justify-between p-6 md:p-8 relative z-10">
                            <div>
                              <div className="flex flex-wrap items-center gap-3 text-[11px] mono uppercase tracking-[0.25em] font-medium text-[var(--brand)] mb-3">
                                <span>{isLive ? "LIVE NOW" : "MEET"}</span>
                                <span>•</span>
                                <span>{event.location || "SAN FRANCISCO"}</span>
                              </div>

                              <Link href={`/events/${event.id}`} className="block mt-2">
                                <h3 className="serif text-3xl leading-tight text-ink md:text-5xl group-hover:text-g5 transition-colors font-light">
                                  {event.title}
                                </h3>
                              </Link>

                              <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.6] text-g5 font-sans">
                                {event.description || "Gathering details are forming. Stay tuned for details."}
                              </p>

                              <div className="mt-8 flex flex-wrap gap-4 text-[13px] font-sans text-g5">
                                <span>
                                  {startsOn.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  {" "}•{" "}
                                  {startsOn.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </span>
                                <span>•</span>
                                <span>{event._count.attendance}+ going</span>
                              </div>
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

      {/* Creation Studio */}
      <AnimatePresence>
        {creationOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.72 }}
              exit={{ opacity: 0 }}
              onClick={() => setCreationOpen(false)}
              className="fixed inset-0 z-40 bg-[#000000] backdrop-blur-md"
            />

            <motion.div 
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-4 top-[5vh] z-50 mx-auto flex max-h-[90vh] w-[min(980px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[34px] border border-g3 bg-paper-elevated/90 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-g3/60">
                <div>
                  <div className="eyebrow text-brand">Creation Studio</div>
                  <h2 className="serif mt-1 text-3xl text-ink">Host a Meet</h2>
                  <p className="text-xs text-g5 mt-1">Publish a conference, meetup, gathering, seminar, or workshop.</p>
                </div>
                <button 
                  onClick={() => setCreationOpen(false)}
                  className="p-2 rounded-full hover:bg-g1/80 text-g5 hover:text-ink transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid flex-1 gap-6 overflow-y-auto px-6 py-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-5">
                  <div className="rounded-[28px] border border-dashed border-g3 bg-g1/50 p-5">
                    <div className="aspect-[16/10] overflow-hidden rounded-[22px] border border-g3 bg-g2">
                      {bannerUrl ? (
                        <img src={bannerUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-center text-[13px] leading-6 text-g5">
                          Upload a banner image to preview the meet cover.
                        </div>
                      )}
                    </div>
                    <label className="mt-4 flex h-11 cursor-pointer items-center justify-center rounded-2xl border border-g3 bg-paper-elevated px-4 text-sm font-medium text-ink transition-all hover:border-brand/45">
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(event) => handleBannerUpload(event.target.files?.[0])}
                      />
                      {bannerFileName || "Upload banner image"}
                    </label>
                    <p className="mt-3 text-[12px] leading-5 text-g5">Images are selected from your device and previewed instantly. Production storage can be switched to UploadThing when keys are configured.</p>
                  </div>
                </div>

                <div className="space-y-5">
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center">
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Meet Title <span className="text-red-500">*</span></label>
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                </div>

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Meet Description</label>
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
                </div>
              </form>

              <div className="px-6 py-4 border-t border-g3/60 bg-g1/20 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setCreationOpen(false)}
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
                  <span>Publish Meet</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
