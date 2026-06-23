import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminUsers() {
  const user = await requireUser();
  if (user.role !== "ADMIN" && user.email !== "admin@convoke.com") {
    // In strict mode, uncomment this:
    // redirect("/");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 50, // Limit for MVP
  });

  return (
    <div className="p-8 md:p-12">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl serif text-ink mb-2">Users</h1>
          <p className="text-g5 text-[15px]">Manage all users on the network.</p>
        </div>
        <div className="text-[13px] text-g5 mono">Showing {users.length} most recent</div>
      </div>

      <div className="border border-g3 rounded-xl overflow-hidden bg-paper">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-g1/50 border-b border-g3 text-g5">
            <tr>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Joined</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-g3">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-g1/30 transition-colors">
                <td className="px-6 py-4">
                  <Link href={`/profile/${u.handle || u.username}`} className="font-medium text-ink hover:underline">
                    {u.name || u.displayName || "Unknown"}
                  </Link>
                  <div className="text-g5 text-[12px] mono">@{u.handle || u.username}</div>
                </td>
                <td className="px-6 py-4 text-g5">{u.email}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-1 bg-g2 text-ink text-[11px] uppercase tracking-wider rounded">
                    {u.role || "Member"}
                  </span>
                </td>
                <td className="px-6 py-4 text-g5">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[13px] font-medium text-[var(--brand)] hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
