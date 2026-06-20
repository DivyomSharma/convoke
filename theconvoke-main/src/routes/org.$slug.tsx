import { createFileRoute, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { orgs, people } from "@/lib/data";
import { photos } from "@/lib/photos";
import { Avatar } from "@/components/Avatar";

export const Route = createFileRoute("/org/$slug")({
  loader: ({ params }) => {
    const o = orgs.find((x) => x.slug === params.slug);
    if (!o) throw notFound();
    return o;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Organization"} — Convoke` },
      { name: "description", content: `${loaderData?.name ?? ""} on Convoke` },
      { property: "og:image", content: photos.coworking },
    ],
  }),
  notFoundComponent: () => (
    <Shell><div className="mx-auto max-w-xl px-5 py-24 text-center"><h1 className="serif text-5xl">No such organization.</h1></div></Shell>
  ),
  component: Org,
});

function Org() {
  const o = Route.useLoaderData();
  return (
    <Shell>
      <div className="aspect-[3/1] overflow-hidden hairline-b">
        <img src={photos.coworking} alt="" className="w-full h-full object-cover grayscale" />
      </div>
      <div className="mx-auto max-w-[1080px] px-5 sm:px-8 -mt-12">
        <div className="bg-paper hairline p-8 md:p-10">
          <div className="eyebrow">{o.kind} · since {o.since}</div>
          <h1 className="serif text-5xl md:text-7xl leading-[0.95] mt-2">{o.name}</h1>
          <p className="text-g5 text-[15px] mt-3 max-w-[56ch]">Calm tools for solo founders. We hire people who care about quiet craft and ship every week.</p>
          <div className="mt-6 flex gap-6 text-[13px] text-g5">
            <span><b className="text-ink">{o.members}</b> members</span>
            <span><b className="text-ink">4</b> open roles</span>
            <span><b className="text-ink">12</b> events hosted</span>
          </div>
        </div>

        <section className="mt-14">
          <div className="eyebrow mb-4">Team</div>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8">
            {people.map((p) => (
              <li key={p.handle} className="text-center">
                <Avatar src={p.avatar} name={p.name} size={88} />
                <div className="serif text-lg mt-3">{p.name}</div>
                <div className="text-g5 text-[12px] mt-1">{p.role}</div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Shell>
  );
}
