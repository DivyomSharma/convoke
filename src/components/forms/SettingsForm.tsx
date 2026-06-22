"use client";

import { useState } from "react";
import { updateSettings } from "@/app/actions/settings";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function SettingsForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Identity");
  const [formData, setFormData] = useState({
    displayName: user.displayName || "",
    username: user.username || "",
    headline: user.headline || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
    githubUrl: user.github || "",
    linkedinUrl: user.linkedin || "",
    twitterUrl: user.twitter || "",
    readcvUrl: user.portfolio || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await updateSettings(formData);
    
    if (res.success) {
      toast.success("Profile updated successfully");
    } else {
      toast.error(res.error || "Failed to update profile");
    }
    
    setLoading(false);
  };

  const tabs = ["Identity", "Links", "Integrations"];

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
          <div className="py-6 text-center text-g5 text-[14px]">
            Third-party integrations coming soon!
          </div>
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
