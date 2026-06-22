"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { City, Country, State } from "country-state-city";
import { completeOnboarding } from "@/app/actions/onboarding";

type InitialUser = {
  displayName: string | null;
  username: string | null;
  name: string | null;
  handle: string | null;
  bio: string | null;
  headline: string | null;
  pronouns: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  timezone: string | null;
  visibility: string | null;
  website: string | null;
  portfolio: string | null;
  linkedin: string | null;
  github: string | null;
  twitter: string | null;
  currentRole: string | null;
  company: string | null;
  themePreference: string | null;
};

const visibilities = [
  { value: "public", label: "Public" },
  { value: "members", label: "Members only" },
  { value: "private", label: "Private" },
] as const;

export function OnboardingClient({ initialUser }: { initialUser: InitialUser }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [displayName, setDisplayName] = useState(initialUser.displayName || initialUser.name || "");
  const [username, setUsername] = useState(initialUser.username || initialUser.handle || "");
  const [headline, setHeadline] = useState(initialUser.headline || "");
  const [pronouns, setPronouns] = useState(initialUser.pronouns || "");
  const [bio, setBio] = useState(initialUser.bio || "");
  const [website, setWebsite] = useState(initialUser.website || "");
  const [portfolio, setPortfolio] = useState(initialUser.portfolio || "");
  const [linkedin, setLinkedin] = useState(initialUser.linkedin || "");
  const [github, setGithub] = useState(initialUser.github || "");
  const [twitter, setTwitter] = useState(initialUser.twitter || "");
  const [currentRole, setCurrentRole] = useState(initialUser.currentRole || "");
  const [company, setCompany] = useState(initialUser.company || "");
  const [country, setCountry] = useState(initialUser.country || "India");
  const [state, setState] = useState(initialUser.state || "");
  const [city, setCity] = useState(initialUser.city || "");
  const [timezone, setTimezone] = useState(initialUser.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [visibility, setVisibility] = useState<"public" | "members" | "private">((initialUser.visibility as any) || "public");

  const countries = useMemo(() => Country.getAllCountries(), []);
  const states = useMemo(() => {
    const selected = countries.find((item) => item.name === country);
    return selected ? State.getStatesOfCountry(selected.isoCode) : [];
  }, [country, countries]);
  const cities = useMemo(() => {
    const selected = countries.find((item) => item.name === country);
    const selectedState = selected && state ? states.find((item) => item.name === state) : null;
    return selected && selectedState ? City.getCitiesOfState(selected.isoCode, selectedState.isoCode) : [];
  }, [country, state, countries, states]);

  const locationPreview = [city, state, country].filter(Boolean).join(" · ") || "Your location";

  const handleSubmit = async (meet: React.FormEvent) => {
    meet.preventDefault();
    setSaving(true);
    setError("");
    try {
      await completeOnboarding({
        displayName,
        username,
        headline,
        pronouns,
        bio,
        website,
        portfolio,
        linkedin,
        github,
        twitter,
        currentRole,
        company,
        country,
        state,
        city,
        timezone,
        visibility,
      });
      router.push("/workspace");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save onboarding.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={handleSubmit}
      className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]"
    >
      <div className="space-y-5">
        <div className="premium-card p-6 md:p-7">
          <div className="eyebrow mb-5 text-brand">Identity</div>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Display name" value={displayName} onChange={setDisplayName} placeholder="Divyom Sharma" />
            <Field label="Username" value={username} onChange={setUsername} placeholder="divyom" />
            <Field label="Headline" value={headline} onChange={setHeadline} placeholder="Student builder" className="md:col-span-2" />
            <Field label="Pronouns" value={pronouns} onChange={setPronouns} placeholder="they/them" />
            <Field label="Current role" value={currentRole} onChange={setCurrentRole} placeholder="Founder" />
            <Field label="Company" value={company} onChange={setCompany} placeholder="Convoke" />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <SelectField label="Country" value={country} onChange={setCountry} options={countries.map((item) => item.name)} />
            <SelectField label="State" value={state} onChange={setState} options={states.map((item) => item.name)} />
            <SelectField label="City" value={city} onChange={setCity} options={cities.map((item) => item.name)} />
          </div>

          <div className="mt-5">
            <Field label="Timezone" value={timezone} onChange={setTimezone} placeholder="Asia/Kolkata" />
          </div>

          <div className="mt-5">
            <label className="mb-1.5 block text-xs font-medium text-ink">Bio</label>
            <textarea
              value={bio}
              onChange={(meet) => setBio(meet.target.value)}
              rows={4}
              placeholder="A short line about what you are building, learning, or chasing."
              className="w-full resize-none rounded-2xl border border-g3 bg-transparent p-4 text-sm text-ink outline-none focus:border-brand/55"
            />
          </div>
        </div>

        <div className="premium-card p-6 md:p-7">
          <div className="eyebrow mb-5 text-brand">Presence</div>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Website" value={website} onChange={setWebsite} placeholder="https://..." />
            <Field label="Portfolio" value={portfolio} onChange={setPortfolio} placeholder="https://..." />
            <Field label="LinkedIn" value={linkedin} onChange={setLinkedin} placeholder="https://linkedin.com/in/..." />
            <Field label="GitHub" value={github} onChange={setGithub} placeholder="https://github.com/..." />
            <Field label="Twitter" value={twitter} onChange={setTwitter} placeholder="https://x.com/..." className="md:col-span-2" />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="ink-button px-6 text-[14px]">
            {saving ? "Saving..." : "Continue"}
          </button>
          <button type="button" className="ghost-button text-[14px]" onClick={() => router.push("/workspace")}>
            Save for later
          </button>
        </div>

        {error ? <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">{error}</div> : null}
      </div>

      <aside className="space-y-5">
        <div className="premium-card overflow-hidden p-5">
          <div className="aspect-[4/5] rounded-[24px] border border-g3 bg-[radial-gradient(circle_at_top,color-mix(in_srgb,var(--brand)_18%,transparent),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent)] p-5">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-brand">Live passport preview</div>
                <div className="mt-5 text-3xl font-light leading-tight text-ink">{displayName || "Your name"}</div>
                <div className="mt-2 text-[14px] text-g5">{headline || "Your headline goes here"}</div>
                <div className="mt-2 text-[13px] text-g6">@{username || "username"}</div>
              </div>
              <div className="space-y-3 text-[13px] text-g6">
                <div>{locationPreview}</div>
                <div>{pronouns || "Pronouns not set"}</div>
                <div>{currentRole || "Current role not set"} {company ? `· ${company}` : ""}</div>
                <div>{visibility === "public" ? "Public profile" : visibility === "members" ? "Members only profile" : "Private profile"}</div>
                <div>{timezone}</div>
              </div>
            </div>
          </div>
        </div>

      </aside>
    </motion.form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium text-ink">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(meet) => onChange(meet.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-2xl border border-g3 bg-transparent px-4 text-sm text-ink outline-none focus:border-brand/55"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-ink">{label}</label>
      <select
        value={value}
        onChange={(meet) => onChange(meet.target.value)}
        className="h-11 w-full rounded-2xl border border-g3 bg-transparent px-4 text-sm text-ink outline-none focus:border-brand/55"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
