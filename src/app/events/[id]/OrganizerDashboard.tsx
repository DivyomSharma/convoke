"use client";

import { useState, useTransition } from "react";
import { promoteAttendee, checkInAttendee } from "@/app/actions/workspace";
import { Avatar } from "@/components/Avatar";
import { Loader2, Search, Camera, Download, Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Attendee {
  id: string;
  userId: string;
  status: string;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
    handle: string | null;
    avatarUrl: string | null;
  };
}

export function OrganizerDashboard({
  eventId,
  eventTitle,
  initialAttendance,
}: {
  eventId: string;
  eventTitle: string;
  initialAttendance: Attendee[];
}) {
  const [attendees, setAttendees] = useState<Attendee[]>(initialAttendance);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAction = async (userId: string, actionStatus: string) => {
    startTransition(async () => {
      try {
        let res;
        if (actionStatus === "CHECKED_IN") {
          res = await checkInAttendee(eventId, userId);
        } else {
          res = await promoteAttendee(eventId, userId, actionStatus);
        }
        
        if (res.success) {
          // Update local state
          setAttendees((prev) =>
            prev
              .map((att) => {
                if (att.userId === userId) {
                  return { ...att, status: actionStatus === "REJECTED" ? "REJECTED" : actionStatus };
                }
                return att;
              })
              .filter((att) => att.status !== "REJECTED")
          );
          router.refresh();
        }
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to execute action.");
      }
    });
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Status", "Joined At"];
    const rows = attendees.map((a) => [
      a.user.name || "Anonymous",
      a.user.email,
      a.status,
      new Date(a.createdAt).toISOString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendees-${eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = attendees.filter((a) => {
    const name = (a.user.name || "").toLowerCase();
    const email = a.user.email.toLowerCase();
    const query = search.toLowerCase();
    return name.includes(query) || email.includes(query);
  });

  return (
    <div className="border border-g3 rounded-sm p-6 bg-paper-card text-ink space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-g3/60 pb-5">
        <div>
          <h2 className="serif text-2xl font-light">Organizer Control</h2>
          <p className="text-xs text-g5 mt-0.5">Manage waitlist approvals, check-ins, and certificates.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/events/${eventId}/scanner`}
            className="inline-flex items-center gap-2 border border-g3 rounded-full px-4 h-9 text-xs mono uppercase tracking-wider hover:bg-g1 hover:text-ink transition-colors"
          >
            <Camera size={13} className="text-brand" />
            <span>Open Scanner</span>
          </Link>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 border border-g3 rounded-full px-4 h-9 text-xs mono uppercase tracking-wider hover:bg-g1 hover:text-ink transition-colors cursor-pointer"
          >
            <Download size={13} className="text-brand" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-g4" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-sm border border-g3 bg-transparent text-sm text-ink outline-none focus:border-brand/50 transition-colors"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-g3/60 mono text-[10px] uppercase tracking-wider text-g5">
              <th className="py-3 font-medium">Attendee</th>
              <th className="py-3 font-medium">Status</th>
              <th className="py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-g1">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-g5 italic">
                  No attendees matching filter.
                </td>
              </tr>
            ) : (
              filtered.map((att) => (
                <tr key={att.id} className="group">
                  <td className="py-4 flex items-center gap-3">
                    <Avatar src={att.user.avatarUrl || ""} name={att.user.name || "Builder"} size={28} />
                    <div>
                      <div className="font-medium text-ink">{att.user.name || "Anonymous Builder"}</div>
                      <div className="text-[11px] text-g5">@{att.user.handle || att.userId.slice(0, 8)}</div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-sm text-[10px] mono uppercase tracking-wider ${
                        att.status === "CHECKED_IN"
                          ? "bg-brand/10 text-brand"
                          : att.status === "GOING"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      {att.status}
                    </span>
                  </td>
                  <td className="py-4 text-right space-x-3">
                    {isPending ? (
                      <Loader2 size={14} className="animate-spin inline-block text-g4" />
                    ) : (
                      <>
                        {att.status === "WAITLISTED" && (
                          <button
                            onClick={() => handleAction(att.userId, "GOING")}
                            className="text-[11px] mono uppercase tracking-wider text-brand hover:underline cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        {att.status === "GOING" && (
                          <button
                            onClick={() => handleAction(att.userId, "CHECKED_IN")}
                            className="text-[11px] mono uppercase tracking-wider text-green-500 hover:underline cursor-pointer"
                          >
                            Check In
                          </button>
                        )}
                        {att.status !== "CHECKED_IN" && (
                          <button
                            onClick={() => handleAction(att.userId, "REJECTED")}
                            className="text-[11px] mono uppercase tracking-wider text-red-500 hover:underline cursor-pointer"
                          >
                            Reject
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
