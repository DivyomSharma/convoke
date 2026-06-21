import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import { prisma } from "@/lib/prisma";
import { ResearchList } from "./ResearchList";

export const revalidate = 60;

export default async function ResearchPage() {
  const papers = await prisma.research.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  }).catch(() => []);

  return (
    <Shell>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12 relative min-h-screen">
        <AmbientGlow className="top-10 -left-20 w-[600px] h-[600px] opacity-[0.03] dark:opacity-[0.08]" color="var(--brand)" />
        <AmbientGlow className="bottom-40 -right-20 w-[800px] h-[800px] opacity-[0.02] dark:opacity-[0.05]" color="var(--brand)" />
        <ResearchList papers={papers} />
      </div>
    </Shell>
  );
}
