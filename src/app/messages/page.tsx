import { Shell } from "@/components/Shell";
import { MessagesClient } from "./MessagesClient";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Messages | Convoke",
};

export default async function Messages() {
  const user = await requireUser();

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: { userId: user.id }
      }
    },
    include: {
      participants: {
        include: { user: true }
      },
      messages: {
        orderBy: { createdAt: "asc" }
      }
    },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <Shell wide>
      <div className="pt-[100px] px-5 sm:px-8 max-w-[1440px] mx-auto pb-10">
        <MessagesClient currentUserId={user.id} initialConversations={conversations} />
      </div>
    </Shell>
  );
}
