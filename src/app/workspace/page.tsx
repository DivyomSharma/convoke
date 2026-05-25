import { updateOpportunityApplicationStatus } from "@/app/actions";
import { getDashboardData } from "@/lib/platform-service";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/marketing/site-header";
import { Footer } from "@/components/marketing/footer";
import { StudentWorkspace } from "@/components/workspace/student-workspace";
import { OrganizerWorkspace } from "@/components/workspace/organizer-workspace";
import { FounderWorkspace } from "@/components/workspace/founder-workspace";
import { CreatorWorkspace } from "@/components/workspace/creator-workspace";

export default async function WorkspacePage() {
  const dashboard = await getDashboardData();
  
  if (!dashboard || dashboard.viewer.id === "guest") {
    redirect("/auth/sign-in");
  }

  // Choose the right workspace view based on role
  let WorkspaceView = StudentWorkspace;
  switch (dashboard.role) {
    case "ORGANIZER":
    case "COMMUNITY_ADMIN":
    case "PLATFORM_ADMIN":
      WorkspaceView = OrganizerWorkspace;
      break;
    case "FOUNDER":
    case "STARTUP":
      WorkspaceView = FounderWorkspace;
      break;
    case "CREATOR":
    case "DEVELOPER":
    case "DESIGNER":
      WorkspaceView = CreatorWorkspace;
      break;
    default:
      WorkspaceView = StudentWorkspace;
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-5 pb-24 pt-28 md:px-8">
        <WorkspaceView dashboard={dashboard} />
      </main>
      <Footer />
    </>
  );
}
