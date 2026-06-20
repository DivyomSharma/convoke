import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function OrganizationDetailRedirectPage(props: { params?: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params?.id;
  if (!id) return notFound();

  const org = await prisma.organization.findUnique({
    where: { id: id },
    select: { slug: true }
  });

  if (!org) {
    return notFound();
  }

  redirect(`/org/${org.slug}`);
}
