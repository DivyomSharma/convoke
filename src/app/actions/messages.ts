"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function sendMessage(conversationId: string, content: string) {
  const user = await requireUser();

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { participants: true },
  });

  if (!conversation) return { error: "Conversation not found" };
  const isParticipant = conversation.participants.some(p => p.userId === user.id);
  if (!isParticipant) return { error: "Not a participant" };

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: user.id,
      content,
    },
  });

  revalidatePath("/messages");
  return { success: true, message };
}

export async function startDirectMessage(targetUserId: string) {
  const user = await requireUser();
  if (user.id === targetUserId) return { error: "Cannot message yourself" };

  // Check if they already have a 1-on-1 DM conversation
  const existingConv = await prisma.conversation.findFirst({
    where: {
      isGroup: false,
      participants: {
        every: {
          userId: { in: [user.id, targetUserId] }
        }
      }
    },
    include: {
      participants: true
    }
  });

  if (existingConv && existingConv.participants.length === 2) {
    return { success: true, conversationId: existingConv.id };
  }

  // Check if targetUser follows user to determine status
  const follow = await prisma.follow.findFirst({
    where: { followerId: targetUserId, targetId: user.id, targetType: "USER" }
  });
  
  const status = follow ? "ACCEPTED" : "PENDING"; // Needs to accept if not mutual

  const conversation = await prisma.conversation.create({
    data: {
      isGroup: false,
      participants: {
        create: [
          { userId: user.id, status: "ACCEPTED" },
          { userId: targetUserId, status }
        ]
      }
    }
  });

  revalidatePath("/messages");
  return { success: true, conversationId: conversation.id };
}

export async function acceptMessageRequest(conversationId: string) {
  const user = await requireUser();
  await prisma.conversationParticipant.update({
    where: { conversationId_userId: { conversationId, userId: user.id } },
    data: { status: "ACCEPTED" }
  });
  revalidatePath("/messages");
  return { success: true };
}

export async function rejectMessageRequest(conversationId: string) {
  const user = await requireUser();
  await prisma.conversationParticipant.update({
    where: { conversationId_userId: { conversationId, userId: user.id } },
    data: { status: "REJECTED" }
  });
  revalidatePath("/messages");
  return { success: true };
}
