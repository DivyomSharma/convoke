"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export async function createTeam(challengeId: string, name: string, about: string) {
  const user = await requireUser();

  // Check if user is already in a team for this opportunity
  const existingMember = await prisma.teamMember.findFirst({
    where: {
      userId: user.id,
      team: { challengeId }
    }
  });

  if (existingMember) {
    return { success: false, error: "You are already in a team for this challenge." };
  }

  const team = await prisma.team.create({
    data: {
      name,
      about,
      challengeId,
      leaderId: user.id,
      members: {
        create: {
          userId: user.id,
          role: "Leader"
        }
      }
    }
  });

  revalidatePath(`/challenges/${challengeId}`);
  return { success: true, teamId: team.id };
}

export async function requestToJoinTeam(teamId: string, message: string) {
  const user = await requireUser();

  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) return { success: false, error: "Team not found." };

  const existingRequest = await prisma.teamRequest.findFirst({
    where: { teamId, userId: user.id, status: "PENDING" }
  });

  if (existingRequest) {
    return { success: false, error: "Request already pending." };
  }

  await prisma.teamRequest.create({
    data: {
      teamId,
      userId: user.id,
      status: "PENDING",
      type: "APPLY",
      message
    }
  });

  revalidatePath(`/challenges/${team.challengeId}`);
  return { success: true };
}

export async function respondToTeamRequest(requestId: string, status: "ACCEPTED" | "REJECTED") {
  const user = await requireUser();

  const request = await prisma.teamRequest.findUnique({
    where: { id: requestId },
    include: { team: true }
  });

  if (!request || request.team.leaderId !== user.id) {
    return { success: false, error: "Unauthorized or not found." };
  }

  await prisma.$transaction(async (tx) => {
    await tx.teamRequest.update({
      where: { id: requestId },
      data: { status }
    });

    if (status === "ACCEPTED") {
      await tx.teamMember.create({
        data: {
          teamId: request.teamId,
          userId: request.userId,
          role: "Member"
        }
      });
    }
  });

  revalidatePath(`/challenges/${request.team.challengeId}`);
  return { success: true };
}
