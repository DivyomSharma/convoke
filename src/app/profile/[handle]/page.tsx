import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { Avatar } from "@/components/Avatar";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export async function generateMetadata(props: { params?: Promise<{ handle: string }> }): Promise<Metadata> {
  const params = await props.params;
  const handle = params?.handle;
  if (!handle) return { title: "Profile not found" };

  const user = await prisma.user.findFirst({
    where: { OR: [{ handle: handle }, { id: handle }] },
  });

  if (!user) return { title: "Profile not found" };

  return {
    title: `${user.name} (@${user.handle})`,
    description: user.bio || `${user.name}'s profile on Convoke.`,
  };
}

export default async function Profile(props: { params?: Promise<{ handle: string }> }) {
  const params = await props.params;
  const handle = params?.handle;
  if (!handle) return notFound();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { handle: handle },
        { id: handle }
      ]
    },
    include: {
      projects: true,
      memberships: {
        include: { organization: { include: { spaces: true } } }
      },
      vouchesRecv: {
        include: { giver: true }
      },
      activity: {
        orderBy: { createdAt: "desc" }
      }
    }
  });
  
  if (!user) return notFound();

  const spaces = user.memberships.flatMap(m => m.organization.spaces);
  const vouches = user.vouchesRecv;
  const projects = user.projects;
  const activityDates = user.activity.map(a => a.createdAt);

  return (
    <Shell>
      <div className="mx-auto max-w-[920px] px-5 sm:px-8 py-12">
        <header className="hairline-b pb-10 grid grid-cols-[auto_1fr] gap-6 items-end">
          <Avatar src={user.avatarUrl || ""} name={user.name || "User"} size={120} />
          <div>
            <div className="eyebrow">@{user.handle || user.id.slice(0, 8)} {user.university && `· ${user.university}`}</div>
            <h1 className="serif text-6xl md:text-7xl leading-[0.95] mt-2">{user.name || "Unknown"}</h1>
            <p className="text-g6 text-[16px] mt-3 max-w-[44ch]">{user.role || "Member"}. {user.bio || "No bio added yet."}</p>
            <div className="mt-5 flex gap-6 text-[13px] text-g5">
              <span><b className="text-ink">{projects.length}</b> projects</span>
              <span><b className="text-ink">{spaces.length}</b> spaces</span>
              <span><b className="text-ink">{vouches.length}</b> vouches</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-10 mt-12">
          <section className="col-span-12 md:col-span-7">
            <div className="eyebrow mb-4">Momentum · last 24 weeks</div>
            <Heat activityDates={activityDates} />
            <div className="mt-12">
              <div className="eyebrow mb-4">Selected work</div>
              {projects.length > 0 ? (
                <ul className="divide-y divide-g3">
                  {projects.map((w) => (
                    <li key={w.id} className="grid grid-cols-[60px_1fr_auto] gap-4 py-4 text-[15px]">
                      <span className="mono text-[12px] text-g5">{w.createdAt.getFullYear()}</span>
                      <span>{w.title}</span>
                      <span className="mono text-[11px] uppercase text-[var(--brand)] font-medium">shipped</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-g5 text-[14px]">No selected work to show yet.</div>
              )}
            </div>
          </section>

          <aside className="col-span-12 md:col-span-5">
            <div className="eyebrow mb-3">Vouches</div>
            {vouches.length > 0 ? (
              <ul className="space-y-5">
                {vouches.slice(0, 3).map((v) => (
                  <li key={v.id} className="flex gap-3">
                    <Avatar src={v.giver.avatarUrl || ""} name={v.giver.name || "User"} size={36} />
                    <div>
                      <div className="text-[14px]">{v.giver.name || "User"}</div>
                      <p className="text-g5 text-[13px] mt-1 italic">"{v.content}"</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-g5 text-[14px]">No vouches yet.</div>
            )}
            
            <div className="eyebrow mt-10 mb-3">Spaces</div>
            {spaces.length > 0 ? (
              <ul className="space-y-2 text-[14px]">
                {spaces.slice(0, 4).map((s) => (
                  <li key={s.id} className="flex justify-between text-g6">
                    <span>{s.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-g5 text-[14px]">Not in any spaces yet.</div>
            )}
          </aside>
        </div>
      </div>
    </Shell>
  );
}

function Heat({ activityDates }: { activityDates: Date[] }) {
  const weeks = 24;
  const days = 7;
  const totalDays = weeks * days;
  const cells = Array.from({ length: totalDays }, () => 0);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  activityDates.forEach((date) => {
    const actDate = new Date(date);
    const actStart = new Date(actDate.getFullYear(), actDate.getMonth(), actDate.getDate());
    const diffTime = todayStart.getTime() - actStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays < totalDays) {
      cells[totalDays - 1 - diffDays]++;
    }
  });

  return (
    <div className="grid grid-flow-col gap-[3px]" style={{ gridTemplateRows: `repeat(${days}, 1fr)` }}>
      {cells.map((v, i) => {
        let bgStyle = {};
        if (v === 0) {
          bgStyle = { backgroundColor: "rgba(120, 120, 120, 0.08)" };
        } else {
          const opacity = Math.min(0.25 + (v - 1) * 0.15, 1.0);
          bgStyle = { backgroundColor: `rgba(198, 163, 107, ${opacity})` };
        }
        return (
          <span 
            key={i} 
            className="w-[10px] h-[10px] rounded-[1px] transition-colors duration-300 hover:scale-110" 
            style={bgStyle} 
            title={`${v} activities`} 
          />
        );
      })}
    </div>
  );
}
