import { notFound } from "next/navigation";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Avatar } from "@/components/Avatar";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { ProfileTabsClient } from "./ProfileTabsClient";
import { requireUser } from "@/lib/auth";
import { FollowButton } from "@/components/FollowButton";

export async function generateMetadata(props: { params?: Promise<{ handle: string }> }): Promise<Metadata> {
  const params = await props.params;
  const handle = params?.handle;
  if (!handle) return { title: "Profile not found" };

  const user = await prisma.user.findFirst({
    where: { OR: [{ handle }, { username: handle }] },
  });

  if (!user) return { title: "Profile not found" };

  const title = `${user.name} (@${user.handle || user.username}) | Convoke`;
  const description = user.bio || `${user.name}'s profile on Convoke.`;
  const image = user.avatarUrl || "https://convoke.xyz/og-profile.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: `https://convoke.xyz/profile/${handle}`,
    },
  };
}

export default async function Profile(props: { params?: Promise<{ handle: string }> }) {
  const params = await props.params;
  const handle = params?.handle;
  if (!handle) return notFound();

  const user = await prisma.user.findFirst({
    where: { OR: [{ handle }, { username: handle }] },
    include: {
      projects: { orderBy: { createdAt: "desc" } },
      research: { orderBy: { createdAt: "desc" } },
      meets: {
        include: { meet: true }
      },
      applications: {
        include: { opportunity: true }
      },
      memberships: {
        include: { organization: { include: { spaces: true } } },
      },
      vouchesRecv: {
        include: { giver: true },
      },
      activity: {
        orderBy: { createdAt: "desc" },
      },
      badges: true,
      follows: true,
      certificates: { orderBy: { createdAt: "desc" } },
      experiences: { orderBy: { startDate: "desc" } },
      educations: { orderBy: { startDate: "desc" } },
      achievements: { orderBy: { date: "desc" } }
    },
  });

  if (!user) return notFound();

  const dbUser = await requireUser().catch(() => null);
  const initialFollowing = dbUser ? (await prisma.follow.findFirst({
    where: { followerId: dbUser.id, targetId: user.id, targetType: "USER" }
  })) !== null : false;
  
  const followersCount = await prisma.follow.count({
    where: { targetId: user.id, targetType: "USER" }
  });

  const spaces = user.memberships.flatMap((m) => m.organization.spaces);
  const vouches = user.vouchesRecv;
  const projects = user.projects;
  const research = user.research;
  const activityDates = user.activity.map((a) => a.createdAt);
  const passportHandle = user.handle || user.username || user.displayName || "builder";

  const followingIds = user.follows.filter(f => f.targetType === "USER").map(f => f.targetId);
  const connections = followingIds.length > 0 ? await prisma.user.findMany({
    where: { id: { in: followingIds } },
    take: 5,
    select: { id: true, name: true, handle: true, username: true, avatarUrl: true }
  }) : [];

  return (
    <Shell>
      <div className="mx-auto max-w-[920px] px-5 py-12 sm:px-8">
        <header className="grid grid-cols-[auto_1fr] items-end gap-6 border-b border-g3 pb-10">
          <Avatar src={user.avatarUrl || ""} name={user.name || "User"} size={120} />
          <div>
            <div className="eyebrow">@{passportHandle}{user.university ? ` · ${user.university}` : ""}</div>
            <h1 className="serif mt-2 text-6xl leading-[0.95] md:text-7xl">{user.name || "Unknown"}</h1>
            <p className="mt-3 max-w-[44ch] text-[16px] text-g6">
              {user.role || "Member"}. {user.bio || "No bio added yet."}
            </p>
            <div className="mt-5 flex items-center gap-6 text-[13px] text-g5">
              <span>
                <b className="text-ink">{followersCount}</b> followers
              </span>
              <span>
                <b className="text-ink">{projects.length}</b> projects
              </span>
              <span>
                <b className="text-ink">{research.length}</b> research
              </span>
              <span>
                <b className="text-ink">{spaces.length}</b> spaces
              </span>
            </div>

            {user.openTo.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-g5 self-center mr-1">Open To</span>
                {user.openTo.map(tag => (
                  <span key={tag} className="bg-green-500/10 text-green-600 border border-green-500/20 px-2 py-0.5 rounded text-[11px] font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {user.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-g5 self-center mr-1">Skills</span>
                {user.skills.map(skill => (
                  <span key={skill} className="bg-g1 text-ink border border-g3 px-2 py-0.5 rounded text-[11px] font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {user.languages.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-g5 self-center mr-1">Languages</span>
                {user.languages.map(lang => (
                  <span key={lang} className="bg-g1 text-ink border border-g3 px-2 py-0.5 rounded text-[11px] font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-3 pb-2 self-start justify-self-end mt-12 md:mt-0">
            {dbUser?.id !== user.id && (
              <div className="flex items-center gap-2">
                <form action={async () => {
                  "use server";
                  const { startDirectMessage } = await import("@/app/actions/messages");
                  const { redirect } = await import("next/navigation");
                  const res = await startDirectMessage(user.id);
                  if (res.success) redirect(`/messages`);
                }}>
                  <button type="submit" className="rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors bg-g2 text-ink border border-g3 hover:bg-g3">
                    Message
                  </button>
                </form>
                <FollowButton 
                  targetId={user.id} 
                  targetType="USER" 
                  initialFollowing={initialFollowing} 
                />
              </div>
            )}
          </div>
        </header>

        {user.badges.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {user.badges.map(badge => (
              <div key={badge.id} className="flex items-center gap-2 bg-g1/50 border border-g3 rounded-full pl-1 pr-3 py-1" title={badge.description || ""}>
                <div className="w-6 h-6 rounded-full bg-[var(--brand)]/20 flex items-center justify-center text-[var(--brand)] text-[12px]">
                  {badge.iconUrl ? <img src={badge.iconUrl} alt="" className="w-4 h-4" /> : "★"}
                </div>
                <span className="text-[12px] font-medium text-ink">{badge.name}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 grid grid-cols-12 gap-10">
          <section className="col-span-12 md:col-span-7">
            <ProfileTabsClient 
              projects={projects} 
              research={research} 
              meetAttendance={user.meets}
              applications={user.applications}
              certificates={user.certificates}
              activityDates={activityDates} 
              Heat={<Heat activityDates={activityDates} />} 
            />
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
                      <p className="mt-1 text-[13px] italic text-g5">"{v.content}"</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-[14px] text-g5">No vouches yet.</div>
            )}

            <div className="eyebrow mb-3 mt-10">Spaces</div>
            {spaces.length > 0 ? (
              <ul className="space-y-2 text-[14px]">
                {spaces.slice(0, 4).map((s) => (
                  <li key={s.id} className="flex justify-between text-g6">
                    <span>{s.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-[14px] text-g5">Not in any spaces yet.</div>
            )}

            <div className="eyebrow mb-3 mt-10">Network</div>
            {connections.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {connections.map((c) => (
                  <Link key={c.id} href={`/profile/${c.handle || c.username || c.id}`} title={c.name || "User"}>
                    <Avatar src={c.avatarUrl || ""} name={c.name || "User"} size={32} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-[14px] text-g5">Not following anyone yet.</div>
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
            className="h-[10px] w-[10px] rounded-[1px] transition-colors duration-300 hover:scale-110"
            style={bgStyle}
            title={`${v} activities`}
          />
        );
      })}
    </div>
  );
}
