import { cookies } from "next/headers";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User, Organization, Space } from "@prisma/client";

export type ActiveIdentity = 
  | { type: "personal"; user: User }
  | { type: "org"; org: Organization; user: User }
  | { type: "space"; space: Space; user: User };

export async function getActiveIdentity(): Promise<ActiveIdentity> {
  const user = await requireUser();
  const store = await cookies();
  const cookie = store.get("convoke_active_identity");

  if (!cookie) {
    return { type: "personal", user };
  }

  try {
    const { type, id } = JSON.parse(cookie.value);

    if (type === "org" && id) {
      const membership = await prisma.membership.findUnique({
        where: {
          userId_organizationId: {
            userId: user.id,
            organizationId: id,
          },
        },
      });

      if (membership && ["ADMIN", "FOUNDER"].includes(membership.role)) {
        const org = await prisma.organization.findUnique({ where: { id } });
        if (org) return { type: "org", org, user };
      }
    }

    if (type === "space" && id) {
      const membership = await prisma.spaceMembership.findUnique({
        where: {
          userId_spaceId: {
            userId: user.id,
            spaceId: id,
          },
        },
      });

      if (membership && ["ADMIN", "FOUNDER", "LEAD", "ORGANIZER"].includes(membership.role.toUpperCase())) {
        const space = await prisma.space.findUnique({ where: { id } });
        if (space) return { type: "space", space, user };
      }
      
      // Fallback: If not a direct space admin, check if they are an admin of the parent organization
      const space = await prisma.space.findUnique({ where: { id } });
      if (space && space.organizationId) {
        const orgMembership = await prisma.membership.findUnique({
          where: {
            userId_organizationId: {
              userId: user.id,
              organizationId: space.organizationId,
            },
          },
        });
        if (orgMembership && ["ADMIN", "FOUNDER"].includes(orgMembership.role)) {
          return { type: "space", space, user };
        }
      }
    }
  } catch (error) {
    console.error("Failed to parse or resolve active identity", error);
  }

  // Fallback to personal if cookie is invalid, expired, or permissions were revoked
  return { type: "personal", user };
}
