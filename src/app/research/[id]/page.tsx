import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { Avatar } from "@/components/Avatar";
import { BookOpen, Calendar, ExternalLink, Bookmark, Share } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(props: { params?: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const id = params?.id;
  if (!id) return { title: "Research not found" };

  const res = await prisma.research.findUnique({
    where: { id: id },
  });

  if (!res) return { title: "Research not found" };

  return {
    title: `${res.title} | Convoke Research`,
    description: res.abstract || `Read research by Convoke members.`,
  };
}

export default async function ResearchDetailPage(props: { params?: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params?.id;
  if (!id) return notFound();

  const research = await prisma.research.findUnique({
    where: { id },
    include: {
      user: true,
      space: {
        include: { organization: true }
      }
    }
  });

  if (!research) return notFound();

  const dbUser = await requireUser().catch(() => null);

  return (
    <Shell wide>
      <div className="relative min-h-screen bg-paper pb-20 pt-[100px]">
        <div className="mx-auto max-w-[900px] px-5 sm:px-8">
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-g1 flex items-center justify-center border border-g3">
              <BookOpen size={20} className="text-[var(--brand)]" />
            </div>
            <div>
              <div className="mono text-[11px] uppercase tracking-wider text-g5">Published Research</div>
              <div className="text-[13px] text-g6 font-medium">
                {new Date(research.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </div>
            </div>
          </div>

          <h1 className="serif text-4xl md:text-5xl leading-tight text-ink mb-8">
            {research.title}
          </h1>

          <div className="flex flex-col sm:flex-row gap-6 justify-between items-start border-y border-g3 py-6 mb-10">
            <div className="flex items-center gap-4">
              <Avatar src={research.user.avatarUrl || ""} name={research.user.name || "User"} size={48} />
              <div>
                <Link href={`/${research.user.handle || research.user.username}`} className="font-medium text-[15px] text-ink hover:underline">
                  {research.user.name || "User"}
                </Link>
                <div className="text-[13px] text-g5">@{research.user.handle || research.user.username}</div>
              </div>
            </div>

            {research.space && (
              <div className="flex flex-col items-end text-right">
                <span className="text-[11px] uppercase tracking-wider text-g4 mb-1 mono">Published In</span>
                <Link href={`/spaces/${research.space.id}`} className="font-medium text-[14px] text-ink hover:underline">
                  {research.space.organization?.name} / {research.space.name}
                </Link>
              </div>
            )}
          </div>

          {/* Abstract */}
          <div className="mb-10">
            <h2 className="serif text-2xl mb-4 text-ink">Abstract</h2>
            <div className="prose prose-invert max-w-none text-g6 leading-relaxed text-[15px]">
              {research.abstract ? (
                <p className="whitespace-pre-wrap">{research.abstract}</p>
              ) : (
                <p className="italic">No abstract provided.</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 border-t border-g3 pt-8">
            {research.url && (
              <a 
                href={research.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ink-button px-6 py-3 rounded-full text-[14px] font-medium flex items-center gap-2"
              >
                Read Full Paper <ExternalLink size={16} />
              </a>
            )}
            <button className="px-6 py-3 rounded-full border border-g3 hover:bg-g1 transition-colors text-[14px] font-medium flex items-center gap-2 text-ink">
              <Bookmark size={16} /> Bookmark
            </button>
            <button className="px-6 py-3 rounded-full border border-g3 hover:bg-g1 transition-colors text-[14px] font-medium flex items-center gap-2 text-ink">
              <Share size={16} /> Share
            </button>
          </div>

        </div>
      </div>
    </Shell>
  );
}
