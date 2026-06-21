"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Download, Share2, Plus, X, Loader2, ArrowRight } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { motion, AnimatePresence } from "framer-motion";
import { createProject } from "@/app/actions/workspace";
import { getFallbackPhoto } from "@/lib/photos";
import { CardRing } from "@/components/ui/card-ring";

interface ProjectWithDetails {
  id: string;
  title: string;
  description: string | null;
  bannerUrl: string | null;
  url: string | null;
  demoUrl: string | null;
  githubUrl: string | null;
  figmaUrl: string | null;
  stack: string | null;
  views: number;
  downloads: number;
  user: {
    handle: string | null;
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
}

export function ProjectsList({ initialProjects }: { initialProjects: ProjectWithDetails[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectWithDetails[]>(initialProjects);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [url, setUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [figmaUrl, setFigmaUrl] = useState("");
  const [stack, setStack] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setError("Project title is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await createProject({
        title,
        description: description || undefined,
        bannerUrl: bannerUrl || undefined,
        url: url || undefined,
        demoUrl: demoUrl || undefined,
        githubUrl: githubUrl || undefined,
        figmaUrl: figmaUrl || undefined,
        stack: stack || undefined,
      });

      if (res.success && res.project) {
        setDrawerOpen(false);
        setTitle("");
        setDescription("");
        setBannerUrl("");
        setUrl("");
        setDemoUrl("");
        setGithubUrl("");
        setFigmaUrl("");
        setStack("");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Failed to launch project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between hairline-b pb-8 relative z-10 gap-6">
        <div>
          <div className="eyebrow">Recent Work</div>
          <h1 className="serif text-5xl md:text-6xl tracking-tight mt-2">Case studies.</h1>
          <p className="text-g5 mt-2 text-md">A quiet gallery of products, designs, and technical shipments from the community.</p>
        </div>
        <button 
          onClick={() => setDrawerOpen(true)}
          className="ink-button px-6 text-[13px] font-medium flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus size={16} />
          <span>Launch Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="py-24 text-center relative z-10 flex flex-col items-center justify-center border border-dashed border-g3 rounded-md mt-10">
          <div className="w-14 h-14 rounded-full border border-g3 bg-g1 flex items-center justify-center text-[var(--brand)] mb-4">
            <Eye size={24} />
          </div>
          <h3 className="serif text-2xl text-ink mb-1">No projects shipped yet</h3>
          <p className="text-g5 text-[14px] max-w-[36ch] leading-relaxed mb-6">
            Be the first to share your breakthrough with the community.
          </p>
          <button 
            onClick={() => setDrawerOpen(true)}
            className="ink-button px-6 text-[13px] font-medium cursor-pointer"
          >
            Launch Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 mt-12 relative z-10">
          {projects.map((proj) => {
            const banner = proj.bannerUrl || getFallbackPhoto(proj.id, "project");
            return (
              <div key={proj.id} className="group flex flex-col premium-card campus-frame p-6 relative border border-[#1a1a1a] hover:border-[#2f2f2f] transition-all duration-700 hover:-translate-y-[2px] ease-[cubic-bezier(0.22,0.61,0.36,1)] overflow-hidden">
                <div className="absolute -right-[20%] top-1/2 -translate-y-1/2 opacity-8 group-hover:opacity-25 transition-opacity duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] hidden md:block">
                  <CardRing size={500} text="PROJECT • PROJECT • PROJECT • PROJECT • " />
                </div>
                
                <Link 
                  href={`/projects/${proj.id}`} 
                  className="relative aspect-[16/10] w-full overflow-hidden bg-g1 block z-10"
                >
                  <img 
                    src={banner} 
                    alt={proj.title} 
                    className="w-full h-full object-cover transition-all duration-700" 
                  />
                </Link>

                <div className="mt-5 flex-1 flex flex-col z-10 relative">
                  {/* Builder details */}
                  <div className="flex items-center gap-2.5 mb-3.5">
                    <Avatar src={proj.user.avatarUrl || ""} name={proj.user.name || "Builder"} size={22} />
                    <Link href={`/profile/${proj.user.handle || proj.user.id}`} className="text-[12px] font-medium text-g6 hover:text-ink hover:underline">
                      {proj.user.name || "Builder"}
                    </Link>
                    <span className="text-g3">•</span>
                    <span className="mono text-[10px] text-[var(--brand)] uppercase tracking-[0.2em] font-medium">
                      {proj.stack ? proj.stack.split(",")[0] : "Product"}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <Link href={`/projects/${proj.id}`} className="block group-hover:opacity-90 transition-opacity">
                    <h3 className="serif text-3xl tracking-tight text-ink group-hover:text-[var(--brand)] transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-g5 text-[14px] leading-relaxed mt-2.5 line-clamp-2">
                      {proj.description || "A showcase of custom building and engineering craftsmanship."}
                    </p>
                  </Link>

                  {/* Actions & Metrics */}
                  <div className="mt-5 flex items-center justify-between text-g5 text-[12px] pt-4 border-t border-g3/60">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Eye size={14} className="text-g4" /> 
                        <span>{proj.views}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Download size={14} className="text-g4" /> 
                        <span>{proj.downloads}</span>
                      </div>
                    </div>
                    <Link href={`/projects/${proj.id}`} className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-[var(--brand)] font-semibold hover:text-ink transition-colors">
                      <span>Case Study</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
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

            {/* Creation modal */}
            <motion.div 
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-4 top-[5vh] z-50 mx-auto flex max-h-[90vh] w-[min(760px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[34px] border border-g3 bg-paper-elevated/90 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-g3/60">
                <div>
                  <h2 className="serif text-2xl text-ink">Launch Project</h2>
                  <p className="text-xs text-g5 mt-0.5">Showcase your project in the proof of work gallery.</p>
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
                  <label className="text-ink font-medium text-xs mb-1.5 block">Project Title <span className="text-red-500">*</span></label>
                  <input 
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="E.g. Convoke Search v2"
                    className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)] transition-all"
                  />
                </div>

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Tech Stack (comma separated)</label>
                  <input 
                    type="text"
                    value={stack}
                    onChange={(e) => setStack(e.target.value)}
                    placeholder="E.g. Next.js, Prisma, Framer Motion"
                    className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)] transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">GitHub Repository URL</label>
                    <input 
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/username/repo"
                      className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Figma / Design URL</label>
                    <input 
                      type="url"
                      value={figmaUrl}
                      onChange={(e) => setFigmaUrl(e.target.value)}
                      placeholder="https://figma.com/file/..."
                      className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Live Demo URL</label>
                    <input 
                      type="url"
                      value={demoUrl}
                      onChange={(e) => setDemoUrl(e.target.value)}
                      placeholder="https://myproject.com"
                      className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Project Website URL</label>
                    <input 
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://landingpage.com"
                      className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Banner Image URL</label>
                  <input 
                    type="url"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    placeholder="https://unsplash.com/... or direct image link"
                    className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)] transition-all"
                  />
                </div>

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Project Description</label>
                  <textarea 
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what your project does, how you built it, the problem it solves, and its features..."
                    className="w-full p-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)] transition-all resize-none"
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
                  disabled={loading}
                  className="flex-1 h-11 rounded-full bg-ink hover:opacity-95 text-paper text-xs font-semibold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 border border-[var(--brand)]/20 cursor-pointer"
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  <span>Launch Project</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
