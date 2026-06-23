import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";

export default async function AdminSpaces() {
  const user = await requireUser();
  if (user.role !== "ADMIN" && user.email !== "admin@convoke.com") {
    // strict mode
  }

  const spaces = await prisma.space.findMany({
    orderBy: { createdAt: "desc" },
    include: { organization: true },
    take: 50,
  });

  return (
    <div className="p-8 md:p-12">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl serif text-ink mb-2">Spaces</h1>
          <p className="text-g5 text-[15px]">Manage community hubs.</p>
        </div>
        <div className="text-[13px] text-g5 mono">Showing {spaces.length} most recent</div>
      </div>

      <div className="border border-g3 rounded-xl overflow-hidden bg-paper">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-g1/50 border-b border-g3 text-g5">
            <tr>
              <th className="px-6 py-4 font-medium">Space Name</th>
              <th className="px-6 py-4 font-medium">Parent Org</th>
              <th className="px-6 py-4 font-medium">Created</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-g3">
            {spaces.map((s) => (
              <tr key={s.id} className="hover:bg-g1/30 transition-colors">
                <td className="px-6 py-4">
                  <Link href={`/spaces/${s.id}`} className="font-medium text-ink hover:underline">
                    {s.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-g5">
                  {s.organization ? s.organization.name : <span className="text-g4 italic">Independent</span>}
                </td>
                <td className="px-6 py-4 text-g5">
                  {new Date(s.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[13px] font-medium text-red-500 hover:underline">Suspend</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
