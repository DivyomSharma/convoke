"use client";

import { useState } from "react";
import { updateSettings, updatePreferences } from "@/app/actions/settings";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type SettingsFormUser = {
  displayName?: string | null;
  username?: string | null;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  portfolio?: string | null;
};

type SettingsFormSettings = {
  theme?: string | null;
  emailNotifs?: boolean | null;
} | null | undefined;

export function SettingsForm({ user, settings }: { user: SettingsFormUser; settings?: SettingsFormSettings }) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Identity");
  const [formData, setFormData] = useState({
    displayName: user.displayName ?? "",
    username: user.username ?? "",
    headline: user.headline ?? "",
    bio: user.bio ?? "",
    location: user.location ?? "",
    website: user.website ?? "",
    githubUrl: user.github ?? "",
    linkedinUrl: user.linkedin ?? "",
    twitterUrl: user.twitter ?? "",
    readcvUrl: user.portfolio ?? "",
  });

  const [prefData, setPrefData] = useState({
    theme: settings?.theme ?? "system",
    emailNotifs: settings?.emailNotifs ?? true,
  });

  const handlePrefChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const target = e.currentTarget;
    const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
    setPrefData((current) => ({ ...current, [target.name]: value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (activeTab === "Preferences") {
      const res = await updatePreferences(prefData);
      if (res.success) toast.success("Preferences updated");
      else toast.error("Failed to update preferences");
    } else {
      const res = await updateSettings(formData);
      if (res.success) toast.success("Profile updated successfully");
      else toast.error(res.error || "Failed to update profile");
    }
    
    setLoading(false);
  };

  const tabs = ["Identity", "Links", "Integrations", "Preferences"];

  return (
    <form onSubmit={handleSubmit} className="premium-card p-6 md:p-8">
      <div className="flex flex-wrap gap-2 border-b border-g3 pb-6 mb-8">
        {tabs.map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
              activeTab === tab 
                ? "bg-ink text-paper" 
                : "text-g5 hover:text-ink hover:bg-g1"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-6 max-w-xl">
        {activeTab === "Identity" && (
          <>
            <div>
              <label className="block text-[13px] font-medium mb-1.5">Display Name</label>
              <input
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-[14px] outline-none focus:border-[var(--brand)]"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium mb-1.5">Handle (Username)</label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-[14px] outline-none focus:border-[var(--brand)]"
                placeholder="janedoe"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium mb-1.5">Headline</label>
              <input
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-[14px] outline-none focus:border-[var(--brand)]"
                placeholder="Building the future"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium mb-1.5">Bio (Short summary)</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full min-h-[100px] px-4 py-3 rounded-xl border border-g3 bg-transparent text-[14px] outline-none focus:border-[var(--brand)] resize-y"
                placeholder="Tell us a bit about yourself..."
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium mb-1.5">Location</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-[14px] outline-none focus:border-[var(--brand)]"
                placeholder="San Francisco, CA"
              />
            </div>
          </>
        )}

        {activeTab === "Links" && (
          <>
            <div>
              <label className="block text-[13px] font-medium mb-1.5">Personal Website</label>
              <input
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-[14px] outline-none focus:border-[var(--brand)]"
                placeholder="https://janedoe.com"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium mb-1.5">GitHub URL</label>
              <input
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-[14px] outline-none focus:border-[var(--brand)]"
                placeholder="https://github.com/janedoe"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium mb-1.5">LinkedIn URL</label>
              <input
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-[14px] outline-none focus:border-[var(--brand)]"
                placeholder="https://linkedin.com/in/janedoe"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium mb-1.5">Twitter / X URL</label>
              <input
                name="twitterUrl"
                value={formData.twitterUrl}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-[14px] outline-none focus:border-[var(--brand)]"
                placeholder="https://twitter.com/janedoe"
              />
            </div>
          </>
        )}

        {activeTab === "Integrations" && (
          <div className="py-8 border border-g3 rounded-xl p-6 bg-g1/30">
            <h3 className="text-ink font-medium mb-1 text-[15px]">Developer Integrations</h3>
            <p className="text-g5 text-[13px] mb-4">Connect external accounts and webhooks to sync your Convoke profile.</p>
            <div className="flex items-center justify-between p-4 bg-paper border border-g3 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-g2 rounded-full flex items-center justify-center text-ink font-bold">GH</div>
                <div>
                  <div className="text-[14px] font-medium text-ink">GitHub</div>
                  <div className="text-[12px] text-g5">Sync repositories and commits</div>
                </div>
              </div>
              <button type="button" className="text-[12px] font-medium px-4 py-1.5 border border-g3 rounded-full hover:bg-g1 transition-colors text-ink">Connect</button>
            </div>
          </div>
        )}

        {activeTab === "Preferences" && (
          <>
            <div>
              <label className="block text-[13px] font-medium mb-1.5">Theme</label>
              <select
                name="theme"
                value={prefData.theme}
                onChange={handlePrefChange}
                className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-[14px] outline-none focus:border-[var(--brand)]"
              >
                <option value="system">System (Auto)</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            
            <div className="flex items-center gap-3 pt-4">
              <input
                type="checkbox"
                id="emailNotifs"
                name="emailNotifs"
                checked={prefData.emailNotifs}
                onChange={handlePrefChange}
                className="w-4 h-4 rounded border-g3 text-[var(--brand)] focus:ring-[var(--brand)] bg-transparent"
              />
              <label htmlFor="emailNotifs" className="text-[14px] font-medium text-ink cursor-pointer">
                Receive Email Notifications
              </label>
            </div>
          </>
        )}
      </div>

      <div className="mt-10 pt-6 border-t border-g3 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[14px] font-medium text-paper transition-transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-70"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  );
}
