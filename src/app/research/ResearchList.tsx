"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Link2, Loader2, Plus, Share2, Upload, User, X } from "lucide-react";
import { createResearch } from "@/app/actions/workspace";

type ResearchPaper = {
  id: string;
  title: string;
  abstract: string | null;
  url: string | null;
  createdAt: Date;
  user: {
    name: string | null;
    handle: string | null;
  } | null;
};

export function ResearchList({ papers }: { papers: ResearchPaper[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [paperDataUrl, setPaperDataUrl] = useState("");
  const [paperFileName, setPaperFileName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePaperUpload = (file?: File) => {
    if (!file) return;
    const allowed = ["application/pdf", "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type) && !file.name.endsWith(".md")) {
      setError("Upload a PDF, DOCX, TXT, or Markdown file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPaperDataUrl(String(reader.result));
      setPaperFileName(file.name);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setError("Research title is required.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await createResearch({
        title,
        abstract,
        url: paperDataUrl || undefined,
      });
      setOpen(false);
      setTitle("");
      setAbstract("");
      setPaperDataUrl("");
      setPaperFileName("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish research.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between hairline-b pb-6">
        <div>
          <h1 className="serif text-5xl md:text-6xl tracking-tight text-ink">Research</h1>
          <p className="text-g5 mt-3 text-lg">Academic papers, peer reviews, and weekly readings from frontier minds.</p>
        </div>
        <button onClick={() => setOpen(true)} className="ink-button mt-4 px-6 text-[14px] font-medium md:mt-0">
          <Plus size={16} />
          <span>Drop a Paper</span>
        </button>
      </div>

      {papers.length === 0 ? (
        <div className="py-32 text-center relative z-10 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center text-g5 mb-6">
            <FileText size={28} className="text-brand" />
          </div>
          <h3 className="serif text-3xl text-ink mb-2">No research publications dropped yet</h3>
          <p className="text-g5 text-[15px] max-w-[40ch] leading-relaxed mb-8">Share your findings with the builder community.</p>
          <button onClick={() => setOpen(true)} className="ink-button px-6 text-[14px] font-medium">
            Drop a Paper
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-12 mt-12 relative z-10">
          <div className="space-y-6">
            <div className="eyebrow pb-4 border-b border-g3">Latest Publications ({papers.length})</div>
            {papers.map((paper) => (
              <div key={paper.id} className="premium-card p-6 md:p-8 flex flex-col group transition-all duration-300 hover:translate-y-[-2px]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-g1 border border-g3 flex items-center justify-center text-brand">
                    <User size={14} />
                  </div>
                  <div>
                    <Link href={`/profile/${paper.user?.handle || "researcher"}`} className="text-[14px] font-medium text-ink hover:underline">
                      {paper.user?.name || "Anonymous Researcher"}
                    </Link>
                    <span className="text-g5 text-[12px] ml-2">@{paper.user?.handle || "anonymous"}</span>
                  </div>
                  <span className="ml-auto mono text-[11px] text-g4">{new Date(paper.createdAt).toLocaleDateString()}</span>
                </div>

                <h3 className="serif text-2xl md:text-3xl text-ink mb-3 group-hover:text-brand transition-colors duration-300">{paper.title}</h3>
                <p className="text-g5 text-[15px] leading-relaxed mb-6">{paper.abstract}</p>

                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-g3 text-[13px] mono text-g5">
                  {paper.url && (
                    <a href={paper.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-ink hover:underline text-brand font-medium">
                      <Link2 size={14} /> Read Paper
                    </a>
                  )}
                  <button className="flex items-center gap-1.5 hover:text-ink ml-auto">
                    <Share2 size={14} /> Share
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="premium-card p-6 space-y-6">
              <h3 className="serif text-2xl text-ink">Publishing Guidelines</h3>
              <p className="text-g5 text-[14px] leading-relaxed">Convoke is a repository of active builder thoughts and deep computer science drops.</p>
              {["frontier deep learning", "cryptography & security", "systems programming", "design & interaction code"].map((item) => (
                <div key={item} className="flex items-start gap-2 text-[13px] text-g6 mono">
                  <span className="text-brand">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {open ? (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.72 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-4 top-[7vh] z-50 mx-auto flex max-h-[86vh] w-[min(760px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[34px] border border-g3 bg-paper-elevated/90 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between border-b border-g3/60 px-6 py-5">
                <div>
                  <div className="eyebrow text-brand">Research Studio</div>
                  <h2 className="serif mt-1 text-3xl text-ink">Drop a Paper</h2>
                </div>
                <button onClick={() => setOpen(false)} className="rounded-full p-2 text-g5 transition-colors hover:bg-g1 hover:text-ink">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid gap-6 overflow-y-auto p-6 md:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-[28px] border border-dashed border-g3 bg-g1/50 p-5">
                  <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-[22px] border border-g3 bg-g2 text-center text-g5">
                    <Upload size={28} className="mb-3 text-brand" />
                    <span className="text-[14px]">{paperFileName || "Upload PDF, DOCX, TXT, or MD"}</span>
                  </div>
                  <label className="mt-4 flex h-11 cursor-pointer items-center justify-center rounded-2xl border border-g3 bg-paper-elevated px-4 text-sm font-medium text-ink transition-all hover:border-brand/45">
                    <input type="file" accept=".pdf,.docx,.txt,.md" className="sr-only" onChange={(event) => handlePaperUpload(event.target.files?.[0])} />
                    Choose file
                  </label>
                </div>

                <div className="space-y-5">
                  {error ? <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-xs text-red-500">{error}</div> : null}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-ink">Title</label>
                    <input value={title} onChange={(event) => setTitle(event.target.value)} className="h-11 w-full rounded-2xl border border-g3 bg-transparent px-4 text-sm text-ink outline-none focus:border-brand/55" placeholder="Paper title" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-ink">Abstract</label>
                    <textarea value={abstract} onChange={(event) => setAbstract(event.target.value)} rows={8} className="w-full resize-none rounded-2xl border border-g3 bg-transparent p-4 text-sm text-ink outline-none focus:border-brand/55" placeholder="Summarize the paper and what builders should take away." />
                  </div>
                </div>
              </form>

              <div className="flex gap-3 border-t border-g3/60 bg-g1/20 px-6 py-4">
                <button type="button" onClick={() => setOpen(false)} className="h-11 flex-1 rounded-full border border-g3 text-xs font-semibold text-ink hover:bg-g1">
                  Cancel
                </button>
                <button type="button" onClick={handleSubmit} disabled={loading} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-ink text-xs font-semibold text-paper">
                  {loading ? <Loader2 size={14} className="animate-spin" /> : null}
                  Publish Research
                </button>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
