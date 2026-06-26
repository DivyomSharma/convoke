"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, Sparkles, Building2, Users, CalendarDays, Briefcase, Target, Folder, BookOpen, Diamond, Coins, X } from "lucide-react";
import "./command-center.css"; // We will add styling here since cmdk requires custom CSS for nice UI

export function CommandCenter({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [value, setValue] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleCreate = (type: string) => {
    // In reality, this would hit an API route to create a DRAFT entity, then redirect to its workspace.
    // For now, we will just route to the workspace placeholder
    router.push(`/workspace/${type}/new`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/45 px-4 pt-[12vh]" onClick={onClose}>
      <div
        className="premium-card campus-frame relative w-full max-w-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Command Center" className="command-center-root">
          <div className="flex items-center gap-3 border-b border-g3 px-5 py-4 shrink-0">
            <Search size={16} className="text-[var(--brand)]" />
            <Command.Input
              autoFocus
              value={value}
              onValueChange={setValue}
              placeholder="Search or type a command (e.g. 'Create event')..."
              className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-g4"
            />
            <button onClick={onClose} className="text-g4 hover:text-ink transition-colors">
              <X size={16} />
            </button>
          </div>

          <Command.List className="overflow-auto max-h-[50vh] p-2 no-scrollbar">
            <Command.Empty className="py-6 text-center text-[13px] text-g5">No results found.</Command.Empty>

            <Command.Group heading="Create" className="command-group text-[11px] uppercase tracking-wider text-g5 font-semibold px-3 pt-3 pb-1">
              <Command.Item onSelect={() => handleCreate("spaces")} className="command-item">
                <Users size={14} className="text-g4" />
                <span>Create Space</span>
              </Command.Item>
              <Command.Item onSelect={() => handleCreate("organizations")} className="command-item">
                <Building2 size={14} className="text-g4" />
                <span>Create Organization</span>
              </Command.Item>
              <Command.Item onSelect={() => handleCreate("events")} className="command-item">
                <CalendarDays size={14} className="text-g4" />
                <span>Create Event</span>
              </Command.Item>
              <Command.Item onSelect={() => handleCreate("challenges")} className="command-item">
                <Target size={14} className="text-g4" />
                <span>Create Challenge</span>
              </Command.Item>
              <Command.Item onSelect={() => handleCreate("opportunities")} className="command-item">
                <Briefcase size={14} className="text-g4" />
                <span>Create Opportunity</span>
              </Command.Item>
              <Command.Item onSelect={() => handleCreate("projects")} className="command-item">
                <Folder size={14} className="text-g4" />
                <span>Create Project</span>
              </Command.Item>
              <Command.Item onSelect={() => handleCreate("research")} className="command-item">
                <BookOpen size={14} className="text-g4" />
                <span>Create Research</span>
              </Command.Item>
              <Command.Item onSelect={() => handleCreate("sponsor-requests")} className="command-item">
                <Coins size={14} className="text-g4" />
                <span>Create Sponsor Request</span>
              </Command.Item>
              <Command.Item onSelect={() => handleCreate("merchandise")} className="command-item">
                <Diamond size={14} className="text-g4" />
                <span>Create Merchandise</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Navigation" className="command-group text-[11px] uppercase tracking-wider text-g5 font-semibold px-3 pt-3 pb-1">
              <Command.Item onSelect={() => { router.push("/workspace"); onClose(); }} className="command-item">
                <Folder size={14} className="text-g4" />
                <span>Go to Workspace</span>
              </Command.Item>
              <Command.Item onSelect={() => { router.push("/explore"); onClose(); }} className="command-item">
                <Search size={14} className="text-g4" />
                <span>Explore Network</span>
              </Command.Item>
            </Command.Group>

          </Command.List>

          <div className="flex items-center justify-between border-t border-g3 px-5 py-3 text-[11px] text-g4 mono shrink-0">
            <span>Use ↑↓ arrows to navigate</span>
            <span>Enter to select</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
