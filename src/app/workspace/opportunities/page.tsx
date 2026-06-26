import { PublishStatus } from "@prisma/client";
import { EntityHeader } from "@/components/workspace/EntityHeader";

export default function WorkspaceOpportunitiesPage() {
  return (
    <div>
      <EntityHeader
        title="My Opportunities"
        type=" LIST"
        status={PublishStatus.PUBLISHED}
        entityId="opportunities"
      />
      <div className="premium-card p-6 text-center text-g5">
        <p>List of opportunities you manage will appear here.</p>
        <p className="text-[12px] mt-2">Press ?K to create a new one.</p>
      </div>
    </div>
  );
}

