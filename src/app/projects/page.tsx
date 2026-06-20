import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import { prisma } from "@/lib/prisma";
import { ProjectsList } from "./ProjectsList";

export const revalidate = 0; // Fresh listing upon project launches

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
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
        <AmbientGlow className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] opacity-[0.02] dark:opacity-[0.04]" color="var(--brand)" />
        
        <ProjectsList initialProjects={projects} />
      </div>
    </Shell>
  );
}
