import { Shell } from "@/components/Shell";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookmarksClient } from "./BookmarksClient";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Bookmarks | Convoke",
};

export default async function BookmarksPage() {
  const user = await requireUser();
  if (!user) return notFound();

  const rawBookmarks = await prisma.bookmark.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const meets = [];
  const opportunities = [];
  const challenges = [];
  const projects = [];
  const research = [];

  for (const b of rawBookmarks) {
    if (b.itemType === "MEET") {
      const meet = await prisma.meet.findUnique({ where: { id: b.itemId }, include: { space: true } });
      if (meet) meets.push({ bookmark: b, item: meet });
    } else if (b.itemType === "OPPORTUNITY") {
      const opp = await prisma.opportunity.findUnique({ where: { id: b.itemId }, include: { organization: true, space: true } });
      if (opp) {
        if (opp.type === "HACKATHON/CHALLENGE") {
          challenges.push({ bookmark: b, item: opp });
        } else {
          opportunities.push({ bookmark: b, item: opp });
        }
      }
    } else if (b.itemType === "PROJECT") {
      const proj = await prisma.project.findUnique({ where: { id: b.itemId }, include: { user: true } });
      if (proj) projects.push({ bookmark: b, item: proj });
    } else if (b.itemType === "RESEARCH") {
      const res = await prisma.research.findUnique({ where: { id: b.itemId }, include: { user: true } });
      if (res) research.push({ bookmark: b, item: res });
    }
  }

  return (
    <Shell wide>
      <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 min-h-[80vh]">
        <h1 className="serif text-4xl text-ink mb-2">Bookmarks</h1>
        <p className="text-g5 text-[15px] max-w-[60ch] mb-10">
          Your saved items across Convoke, neatly organized.
        </p>
        
        <BookmarksClient 
          meets={meets}
          opportunities={opportunities}
          challenges={challenges}
          projects={projects}
          research={research}
        />
      </div>
    </Shell>
  );
}
