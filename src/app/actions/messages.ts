"use server";

import { prisma } from "@/lib/prisma";
import { } from "@/lib/auth";
import { revalidatePath } from "next/cache";

import { getActiveIdentity } from "@/lib/identity";

export async function sendMessage(conversationId: string, content: string) {
  const identity = await getActiveIdentity();

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { participants: true },
  });

  if (!conversation) return { error: "Conversation not found" };
  
  // Check if participant is in conversation
  const isParticipant = conversation.participants.some(p => {
    if (identity.type === "org") return p.organizationId === identity.org.id;
    if (identity.type === "space") return p.spaceId === identity.space.id;
    return p.userId === identity.user.id;
  });

  if (!isParticipant) return { error: "Not a participant" };

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: identity.user.id,
      senderOrgId: identity.type === "org" ? identity.org.id : undefined,
      senderSpaceId: identity.type === "space" ? identity.space.id : undefined,
      content,
    },
  });

  revalidatePath("/messages");
  return { success: true, message };
}

export async function startDirectMessage(targetUserId: string) {
  const identity = await getActiveIdentity();
  if (identity.type === "personal" && identity.user.id === targetUserId) return { error: "Cannot message yourself" };

  // Check if they already have a 1-on-1 DM conversation
  const existingConv = await prisma.conversation.findFirst({
    where: {
      isGroup: false,
      participants: {
        every: {
          OR: [
            { 
              userId: identity.user.id,
              organizationId: identity.type === "org" ? identity.org.id : null,
              spaceId: identity.type === "space" ? identity.space.id : null
            },
            { userId: targetUserId }
          ]
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
    where: { followerId: targetUserId, targetId: identity.user.id, targetType: "USER" }
  });
  
  const status = follow ? "ACCEPTED" : "PENDING"; // Needs to accept if not mutual

  const conversation = await prisma.conversation.create({
    data: {
      isGroup: false,
      participants: {
        create: [
          { 
            userId: identity.user.id, 
            organizationId: identity.type === "org" ? identity.org.id : undefined,
            spaceId: identity.type === "space" ? identity.space.id : undefined,
            status: "ACCEPTED" 
          },
          { userId: targetUserId, status }
        ]
      }
    }
  });

  revalidatePath("/messages");
  return { success: true, conversationId: conversation.id };
}

export async function acceptMessageRequest(conversationId: string) {
  const identity = await getActiveIdentity();
  await prisma.conversationParticipant.updateMany({
    where: { 
      conversationId, 
      userId: identity.user.id,
      organizationId: identity.type === "org" ? identity.org.id : null,
      spaceId: identity.type === "space" ? identity.space.id : null,
    },
    data: { status: "ACCEPTED" }
  });
  revalidatePath("/messages");
  return { success: true };
}

export async function rejectMessageRequest(conversationId: string) {
  const identity = await getActiveIdentity();
  await prisma.conversationParticipant.updateMany({
    where: { 
      conversationId, 
      userId: identity.user.id,
      organizationId: identity.type === "org" ? identity.org.id : null,
      spaceId: identity.type === "space" ? identity.space.id : null,
    },
    data: { status: "REJECTED" }
  });
  revalidatePath("/messages");
  return { success: true };
}
