import { requireUser } from "@/lib/auth";

export default async function CalendarPage() {
  await requireUser();
  return (
    <div className="max-w-[800px] mx-auto py-12 px-5">
      <h1 className="text-2xl font-serif text-ink mb-8">Calendar</h1>
      <div className="flex gap-4 border-b border-g3/60 mb-6 overflow-x-auto no-scrollbar">
        {["Meets", "Challenges", "Deadlines", "Applications", "Event Series"].map((tab) => (
          <button key={tab} className="text-[13px] font-medium text-g5 hover:text-ink whitespace-nowrap pb-3 border-b-2 border-transparent transition-colors">
            {tab}
          </button>
        ))}
      </div>
      <div className="text-[13px] text-g5">You have no upcoming events in your calendar.</div>
    </div>
  );
}
