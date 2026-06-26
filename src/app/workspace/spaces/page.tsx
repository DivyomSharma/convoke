import { PublishStatus } from "@prisma/client";
import { EntityHeader } from "@/components/workspace/EntityHeader";

export default function WorkspaceSpacesPage() {
  return (
    <div>
      <EntityHeader
        title="My Spaces"
        type="SPACE LIST"
        status={PublishStatus.PUBLISHED}
        entityId="spaces"
      />
      
      <div className="premium-card p-6 text-center text-g5">
        <p>List of spaces you manage will appear here.</p>
        <p className="text-[12px] mt-2">Press ⌘K to create a new Space.</p>
      </div>
    </div>
  );
}
