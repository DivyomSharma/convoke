"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Download, Share2, Plus, X, Loader2 } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { motion, AnimatePresence } from "framer-motion";
import { createProject } from "@/app/actions/workspace";

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
      <div className="flex items-end justify-between hairline-b pb-6 relative z-10">
        <div>
          <h1 className="serif text-5xl md:text-6xl tracking-tight">Projects Gallery</h1>
          <p className="text-g5 mt-3 text-lg">Proof of work. Discover what ambitious people are building.</p>
        </div>
        <button 
          onClick={() => setDrawerOpen(true)}
          className="flex items-center justify-center gap-2 bg-ink text-paper px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-all active:scale-95 border border-[var(--brand)]/25 shadow-md cursor-pointer"
        >
          <Plus size={16} />
          <span>Launch Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="py-32 text-center relative z-10 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center text-g5 mb-6">
            <Eye size={28} className="text-[var(--brand)]" />
          </div>
          <h3 className="serif text-3xl text-ink mb-2">No projects shipped yet</h3>
          <p className="text-g5 text-[15px] max-w-[40ch] leading-relaxed mb-8">
            Share what you are building.
          </p>
          <button 
            onClick={() => setDrawerOpen(true)}
            className="bg-ink text-paper px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-all active:scale-95 border border-[var(--brand)]/20 shadow-md cursor-pointer"
          >
            Launch Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 relative z-10">
          {projects.map((proj) => (
            <div key={proj.id} className="premium-card overflow-hidden flex flex-col group">
              <Link href={`/projects/${proj.id}`} className="block relative h-48 overflow-hidden bg-gradient-to-br from-g2 to-g1 flex items-center justify-center border-b border-g3">
                {proj.bannerUrl ? (
                  <img src={proj.bannerUrl} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-g3/80 bg-paper flex items-center justify-center shadow-md">
                    {proj.user.avatarUrl ? (
                      <img src={proj.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="serif text-xl text-g5 font-bold uppercase">
                        {(proj.user.name || "B").slice(0, 1)}
                      </span>
                    )}
                  </div>
                )}
              </Link>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar src={proj.user.avatarUrl || ""} name={proj.user.name || "Builder"} size={24} />
                  <Link href={`/profile/${proj.user.handle || proj.user.id}`} className="text-[13px] font-medium text-ink hover:underline">
                    {proj.user.name || "Builder"}
                  </Link>
                </div>
                <Link href={`/projects/${proj.id}`} className="block flex-1">
                  <h3 className="serif text-2xl group-hover:text-[var(--brand)] transition-colors">{proj.title}</h3>
                  <p className="text-g5 text-[14px] mt-2 line-clamp-2">{proj.description}</p>
                </Link>
                
                <div className="mt-6 flex items-center justify-between text-g5 text-[13px] hairline-t pt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5"><Eye size={16} /> {proj.views}</div>
                    <div className="flex items-center gap-1.5"><Download size={16} /> {proj.downloads}</div>
                  </div>
                  <button className="hover:text-ink transition-colors"><Share2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
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
                    className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Tech Stack (comma separated)</label>
                  <input 
                    type="text"
                    value={stack}
                    onChange={(e) => setStack(e.target.value)}
                    placeholder="E.g. Next.js, Prisma, Framer Motion"
                    className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
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
                      className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Figma / Design URL</label>
                    <input 
                      type="url"
                      value={figmaUrl}
                      onChange={(e) => setFigmaUrl(e.target.value)}
                      placeholder="https://figma.com/file/..."
                      className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
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
                      className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Project Website URL</label>
                    <input 
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://landingpage.com"
                      className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
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
                    className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Project Description</label>
                  <textarea 
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what your project does, how you built it, the problem it solves, and its features..."
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
