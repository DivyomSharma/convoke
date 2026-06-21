"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { City, Country, State } from "country-state-city";
import { completeOnboarding } from "@/app/actions/onboarding";

type InitialUser = {
  id: string;
  name: string | null;
  handle: string | null;
  bio: string | null;
  headline: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  dob: string | Date | null;
  country: string | null;
  state: string | null;
  city: string | null;
  timezone: string | null;
  visibility: string | null;
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
  const [name, setName] = useState(initialUser.name || "");
  const [handle, setHandle] = useState(initialUser.handle || "");
  const [headline, setHeadline] = useState(initialUser.headline || "");
  const [bio, setBio] = useState(initialUser.bio || "");
  const [dob, setDob] = useState(initialUser.dob ? new Date(initialUser.dob).toISOString().slice(0, 10) : "");
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await completeOnboarding({
        name,
        handle,
        headline,
        bio,
        dob: dob || undefined,
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
      className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
    >
      <div className="space-y-5">
        <div className="premium-card p-6 md:p-7">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="First name" value={name} onChange={setName} placeholder="Aarav" />
            <Field label="Username" value={handle} onChange={setHandle} placeholder="aarav.builds" />
            <Field label="Headline" value={headline} onChange={setHeadline} placeholder="Product builder at the edge of campus and startup life" className="md:col-span-2" />
            <Field label="Date of birth" value={dob} onChange={setDob} type="date" />
            <Field label="Timezone" value={timezone} onChange={setTimezone} placeholder="Asia/Kolkata" />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <SelectField label="Country" value={country} onChange={setCountry} options={countries.map((item) => item.name)} />
            <SelectField label="State" value={state} onChange={setState} options={states.map((item) => item.name)} />
            <SelectField label="City" value={city} onChange={setCity} options={cities.map((item) => item.name)} />
          </div>

          <div className="mt-5">
            <label className="mb-1.5 block text-xs font-medium text-ink">Bio</label>
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={4}
              placeholder="A short line about what you’re building, learning, or chasing."
              className="w-full resize-none rounded-2xl border border-g3 bg-transparent p-4 text-sm text-ink outline-none focus:border-brand/55"
            />
          </div>

          <div className="mt-5">
            <label className="mb-1.5 block text-xs font-medium text-ink">Profile visibility</label>
            <div className="grid gap-2 sm:grid-cols-3">
              {visibilities.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setVisibility(option.value)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition-all ${
                    visibility === option.value ? "border-brand bg-brand/5 text-ink" : "border-g3 bg-paper-card/70 text-g5"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error ? <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">{error}</div> : null}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="ink-button px-6 text-[14px]">
            {saving ? "Saving..." : "Continue"}
          </button>
          <button type="button" className="ghost-button text-[14px]" onClick={() => router.push("/workspace")}>
            Save for later
          </button>
        </div>
      </div>

      <aside className="space-y-5">
        <div className="premium-card overflow-hidden p-5">
          <div className="aspect-[4/5] rounded-[24px] border border-g3 bg-[radial-gradient(circle_at_top,color-mix(in_srgb,var(--brand)_18%,transparent),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent)] p-5">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-brand">Live preview</div>
                <div className="mt-5 text-3xl font-light leading-tight text-ink">{name || "Your name"}</div>
                <div className="mt-2 text-[14px] text-g5">{headline || "Your headline goes here"}</div>
              </div>
              <div className="space-y-3 text-[13px] text-g6">
                <div>{locationPreview}</div>
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
        onChange={(event) => onChange(event.target.value)}
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
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-2xl border border-g3 bg-paper-card/70 px-4 text-sm text-ink outline-none focus:border-brand/55"
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
