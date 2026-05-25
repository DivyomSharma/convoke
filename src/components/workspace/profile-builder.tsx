"use client";

import { useState } from "react";
import { Plus, X, Briefcase, Link as LinkIcon, User, Code } from "lucide-react";
import { updatePublicProfile } from "@/app/actions";
import { FormSubmitButton } from "@/components/ui/form-submit-button";

export function ProfileBuilder({ initialData }: { initialData: any }) {
  const [bio, setBio] = useState(initialData.bio || "");
  
  const [skills, setSkills] = useState<string[]>(initialData.skills || []);
  const [skillInput, setSkillInput] = useState("");
  
  const [experience, setExperience] = useState<any[]>(initialData.experience || []);
  const [socials, setSocials] = useState<any[]>(initialData.socials || []);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const addExperience = () => {
    setExperience([...experience, { title: "", org: "", period: "", description: "" }]);
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const newExp = [...experience];
    newExp[index][field] = value;
    setExperience(newExp);
  };

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const addSocial = () => {
    setSocials([...socials, { label: "", href: "" }]);
  };

  const updateSocial = (index: number, field: string, value: string) => {
    const newSocials = [...socials];
    newSocials[index][field] = value;
    setSocials(newSocials);
  };

  const removeSocial = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index));
  };

  return (
    <form action={async () => {
      await updatePublicProfile({ bio, skills, experience, socials });
    }} className="space-y-10">
      
      {/* Bio */}
      <section className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-medium">
          <User className="size-5 text-bronze" /> About You
        </h3>
        <div>
          <label className="block text-sm font-medium text-muted">Bio</label>
          <textarea 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell your story. What are you building?"
            className="mt-2 min-h-32 w-full rounded-[8px] border border-line bg-black/40 px-4 py-3 text-sm text-foreground outline-none transition focus:border-bronze" 
          />
        </div>
      </section>

      {/* Skills */}
      <section className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-medium">
          <Code className="size-5 text-emerald-400" /> Skills
        </h3>
        <div className="flex gap-2">
          <input 
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
            placeholder="e.g. React, UI Design, Marketing"
            className="h-11 flex-1 rounded-[8px] border border-line bg-black/40 px-4 text-sm text-foreground outline-none transition focus:border-emerald-500" 
          />
          <button type="button" onClick={addSkill} className="flex h-11 items-center justify-center rounded-[8px] bg-white/[0.05] px-4 text-sm font-medium transition hover:bg-white/10 hover:text-emerald-400">
            Add
          </button>
        </div>
        {skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="flex items-center gap-1.5 rounded-full border border-line bg-white/5 py-1 pl-3 pr-1 text-sm">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)} className="grid size-5 place-items-center rounded-full transition hover:bg-white/10 hover:text-red-400">
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Experience */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-medium">
            <Briefcase className="size-5 text-indigo-400" /> Experience
          </h3>
          <button type="button" onClick={addExperience} className="flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300">
            <Plus className="size-4" /> Add role
          </button>
        </div>
        
        <div className="space-y-4">
          {experience.map((exp, index) => (
            <div key={index} className="relative rounded-xl border border-line bg-black/20 p-5">
              <button type="button" onClick={() => removeExperience(index)} className="absolute right-4 top-4 text-muted hover:text-red-400">
                <X className="size-4" />
              </button>
              <div className="grid gap-4 md:grid-cols-2 pr-6">
                <div>
                  <label className="text-xs text-muted">Title / Role</label>
                  <input value={exp.title} onChange={(e) => updateExperience(index, "title", e.target.value)} placeholder="e.g. Frontend Engineer" className="mt-1 h-10 w-full rounded border border-line bg-black/40 px-3 text-sm outline-none focus:border-indigo-400" required />
                </div>
                <div>
                  <label className="text-xs text-muted">Organization / Community</label>
                  <input value={exp.org} onChange={(e) => updateExperience(index, "org", e.target.value)} placeholder="e.g. Vercel" className="mt-1 h-10 w-full rounded border border-line bg-black/40 px-3 text-sm outline-none focus:border-indigo-400" required />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-muted">Time Period</label>
                  <input value={exp.period} onChange={(e) => updateExperience(index, "period", e.target.value)} placeholder="e.g. 2022 - Present" className="mt-1 h-10 w-full rounded border border-line bg-black/40 px-3 text-sm outline-none focus:border-indigo-400" required />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-muted">Description (Optional)</label>
                  <textarea value={exp.description} onChange={(e) => updateExperience(index, "description", e.target.value)} placeholder="What did you build or achieve?" className="mt-1 h-20 w-full rounded border border-line bg-black/40 p-3 text-sm outline-none focus:border-indigo-400" />
                </div>
              </div>
            </div>
          ))}
          {experience.length === 0 && (
            <div className="rounded-xl border border-line border-dashed p-8 text-center text-muted">
              Add your past roles, hackathons won, or communities led.
            </div>
          )}
        </div>
      </section>

      {/* Socials */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-medium">
            <LinkIcon className="size-5 text-rust" /> Social Links
          </h3>
          <button type="button" onClick={addSocial} className="flex items-center gap-1.5 text-sm font-medium text-rust hover:text-rust/80">
            <Plus className="size-4" /> Add link
          </button>
        </div>
        
        <div className="space-y-4">
          {socials.map((social, index) => (
            <div key={index} className="flex gap-3">
              <input value={social.label} onChange={(e) => updateSocial(index, "label", e.target.value)} placeholder="e.g. GitHub" className="h-11 w-1/3 rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none focus:border-rust" required />
              <input value={social.href} onChange={(e) => updateSocial(index, "href", e.target.value)} placeholder="https://..." type="url" className="h-11 flex-1 rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none focus:border-rust" required />
              <button type="button" onClick={() => removeSocial(index)} className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-line bg-white/5 hover:bg-white/10 hover:text-red-400">
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end border-t border-line pt-6">
        <FormSubmitButton className="rounded-full px-8">Save Profile</FormSubmitButton>
      </div>
    </form>
  );
}
