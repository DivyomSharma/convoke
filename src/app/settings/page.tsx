import { Shell } from "@/components/Shell";

const sections = [
  { eyebrow: "Identity", title: "Name, handle, photo, one-line", fields: ["Display name", "Handle", "Bio (1 line)", "Photo"] },
  { eyebrow: "Account", title: "Email, password, sessions", fields: ["Email", "Password", "Active sessions"] },
  { eyebrow: "Notifications", title: "What to surface, when", fields: ["Vouches", "RSVPs", "Drops in your spaces", "Office hours nearby"] },
  { eyebrow: "Integrations", title: "Connect the rest of your stack", fields: ["GitHub", "Calendar", "Read.cv", "Linear"] },
  { eyebrow: "Privacy", title: "Who sees what", fields: ["Profile visibility", "Vouch visibility", "Search indexing"] },
];

export default function Settings() {
  return (
    <Shell>
      <div className="mx-auto max-w-[820px] px-5 sm:px-8 py-12">
        <div className="hairline-b pb-6">
          <div className="eyebrow">Account</div>
          <h1 className="serif text-5xl mt-2">Settings.</h1>
        </div>
        <div className="mt-10 space-y-16">
          {sections.map((s) => (
            <section key={s.eyebrow}>
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 md:col-span-4">
                  <div className="eyebrow">{s.eyebrow}</div>
                  <h2 className="serif text-2xl mt-2 leading-tight">{s.title}</h2>
                </div>
                <div className="col-span-12 md:col-span-8 space-y-3">
                  {s.fields.map((f) => (
                    <div key={f} className="hairline-b py-3 flex items-center justify-between">
                      <span className="text-[14px]">{f}</span>
                      <button className="mono text-[11px] uppercase text-g5 hover:text-ink">Edit</button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </Shell>
  );
}
