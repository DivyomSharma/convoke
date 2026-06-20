import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, Link2, Plus, Share2, User } from "lucide-react";

export const revalidate = 60;

export default async function ResearchPage() {
  // Fetch real research drops from Prisma database
  const dbResearch = await prisma.research.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  }).catch(() => []);

  // Mock papers for unseeded databases to keep quality Lovable Level
  const mockPapers = [
    {
      id: "mock-r1",
      title: "Latency-Aware Mixture of Experts Routing",
      abstract: "We introduce a routing algorithm for sparse Mixture of Experts (MoEs) that optimizes for token-to-token latency constraints. By learning routing policies that balance capacity limits with compute costs, we achieve a 35% reduction in inference latency with zero loss in training accuracy.",
      url: "https://arxiv.org/abs/2403.10412",
      createdAt: new Date("2026-03-12"),
      user: {
        name: "Marcus Hill",
        handle: "marcus",
      },
    },
    {
      id: "mock-r2",
      title: "Optimal Sparse Attention for Long Context Windows",
      abstract: "Transformers struggle with quadratic compute complexity over long contexts. We detail a sparse attention mechanism that uses localized clusters of query-key vectors. Our model handles 1M+ tokens dynamically with O(N log N) scaling and fits on commodity GPU clusters.",
      url: "https://arxiv.org/abs/2402.08910",
      createdAt: new Date("2026-02-18"),
      user: {
        name: "Ilya Sutskever",
        handle: "ilya",
      },
    },
    {
      id: "mock-r3",
      title: "Multimodal World Models for Robotics Control",
      abstract: "We describe Lumen-WM, a world model trained on high-framerate action-video sequences. By mapping visual frames, tactile sensor feedback, and force inputs into a joint latent space, the model predicts action consequences with high fidelity, achieving state-of-the-art dexterous manipulation.",
      url: "https://lumen.so/research",
      createdAt: new Date("2026-01-24"),
      user: {
        name: "Ananya Rao",
        handle: "ananya",
      },
    },
  ];

  const papers = dbResearch.length > 0 ? dbResearch : mockPapers;

  return (
    <Shell>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12 relative min-h-screen">
        {/* Background Ambient Glows */}
        <AmbientGlow className="top-10 -left-20 w-[600px] h-[600px] opacity-[0.03] dark:opacity-[0.08]" color="var(--brand)" />
        <AmbientGlow className="bottom-40 -right-20 w-[800px] h-[800px] opacity-[0.02] dark:opacity-[0.05]" color="var(--brand)" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between hairline-b pb-6 relative z-10">
          <div>
            <h1 className="serif text-5xl md:text-6xl tracking-tight text-ink">Research</h1>
            <p className="text-g5 mt-3 text-lg">Academic papers, peer reviews, and weekly readings from frontier minds.</p>
          </div>
          <button className="mt-4 md:mt-0 flex items-center justify-center gap-2 bg-ink text-paper px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-all active:scale-95 border border-[var(--brand)]/20 shadow-md">
            <Plus size={16} />
            <span>Drop a Paper</span>
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-12 mt-12 relative z-10">
          
          {/* Left Column: Papers List */}
          <div className="space-y-6">
            <div className="eyebrow pb-4 border-b border-g3">Latest Publications ({papers.length})</div>
            {papers.map((paper) => (
              <div 
                key={paper.id} 
                className="premium-card p-6 md:p-8 flex flex-col group transition-all duration-300 hover:translate-y-[-2px]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-g1 border border-g3 flex items-center justify-center text-[var(--brand)]">
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

                <h3 className="serif text-2xl md:text-3xl text-ink mb-3 group-hover:text-[var(--brand)] transition-colors duration-300">
                  {paper.title}
                </h3>
                
                <p className="text-g5 text-[15px] leading-relaxed mb-6">
                  {paper.abstract}
                </p>

                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-g3 text-[13px] mono text-g5">
                  {paper.url && (
                    <a 
                      href={paper.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-1.5 hover:text-ink hover:underline text-[var(--brand)] font-medium"
                    >
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

          {/* Right Column: Submission Guidelines / Sidebar */}
          <div className="space-y-6">
            <div className="premium-card p-6 space-y-6">
              <h3 className="serif text-2xl text-ink">Publishing Guidelines</h3>
              <p className="text-g5 text-[14px] leading-relaxed">
                Convoke is a repository of active builder thoughts and deep computer science drops. We encourage papers on:
              </p>
              
              <ul className="space-y-2.5 text-[13px] text-g6 mono">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--brand)]">•</span>
                  <span> frontier deep learning</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--brand)]">•</span>
                  <span> cryptography & security</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--brand)]">•</span>
                  <span> systems programming</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--brand)]">•</span>
                  <span> design & interaction code</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-g3">
                <div className="flex items-center gap-3 text-[14px] text-g6">
                  <FileText size={16} className="text-[var(--brand)]" />
                  <span>Peer reviewed by campus admins</span>
                </div>
              </div>
            </div>

            {/* Reading list */}
            <div className="premium-card p-6">
              <h3 className="serif text-2xl text-ink mb-4">Reading Club</h3>
              <p className="text-g5 text-[13px] mb-4">Weekly discussions and paper review mix meetings. Join the next event.</p>
              <Link 
                href="/events"
                className="block text-[13px] font-medium text-ink hover:underline text-[var(--brand)] mono"
              >
                Browse events →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </Shell>
  );
}
