"use client";

import { useEffect, useState, useRef } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Search, Sparkles, User, Building2, Calendar, FileText, ArrowRight, Loader2 } from "lucide-react";

export function ConvokeAssistant() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  const askAssistant = async () => {
    if (!inputValue.trim()) return;
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputValue })
      });
      const data = await res.json();
      if (data.reply) {
        setResponse(data.reply);
      } else {
        setResponse("Sorry, I encountered an error.");
      }
    } catch (e) {
      setResponse("Failed to connect to assistant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Invisible trigger to test functionality if needed */}
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Convoke Assistant"
        className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh] bg-g1/50 backdrop-blur-sm"
        shouldFilter={false} // We handle filtering or want full control
      >
        <div className="w-full max-w-[600px] overflow-hidden rounded-xl border border-g3 bg-paper shadow-2xl">
          <div className="flex items-center border-b border-g3 px-3">
            <Search className="mr-2 h-5 w-5 shrink-0 text-g4" />
            <Command.Input
              value={inputValue}
              onValueChange={setInputValue}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  // If it's a known command, cmdk handles it.
                  // If it's a question, we trigger Groq.
                  if (inputValue.startsWith("?")) {
                    e.preventDefault();
                    askAssistant();
                  }
                }
              }}
              placeholder="Type a command or start with '?' to ask AI..."
              className="flex h-14 w-full rounded-md bg-transparent py-3 text-[15px] text-ink outline-none placeholder:text-g5"
            />
            {inputValue.startsWith("?") && (
              <button 
                onClick={askAssistant}
                disabled={loading}
                className="ml-2 flex h-8 w-8 items-center justify-center rounded-md bg-[var(--brand)]/10 text-[var(--brand)] hover:bg-[var(--brand)]/20 transition-colors"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              </button>
            )}
          </div>

          <Command.List className="max-h-[400px] overflow-y-auto overflow-x-hidden p-2">
            <Command.Empty className="py-6 text-center text-[14px] text-g5">
              {loading ? "Thinking..." : "No results found."}
            </Command.Empty>

            {response && (
              <div className="p-4 mb-2 bg-[var(--brand)]/5 border border-[var(--brand)]/10 rounded-lg text-[14px] text-ink leading-relaxed whitespace-pre-line">
                <div className="flex items-center gap-2 mb-2 font-medium text-[var(--brand)]">
                  <Sparkles size={16} /> Convoke AI
                </div>
                {response}
              </div>
            )}

            {!inputValue.startsWith("?") && !response && (
              <>
                <Command.Group heading={<span className="text-[11px] font-medium text-g5 uppercase tracking-wider px-2 py-1 block">Navigation</span>}>
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/explore"))}
                    className="flex cursor-pointer items-center rounded-md px-3 py-2.5 text-[14px] text-g6 hover:bg-g1 hover:text-ink aria-selected:bg-g1 aria-selected:text-ink"
                  >
                    <ArrowRight className="mr-2 h-4 w-4" /> Explore Feed
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/spaces"))}
                    className="flex cursor-pointer items-center rounded-md px-3 py-2.5 text-[14px] text-g6 hover:bg-g1 hover:text-ink aria-selected:bg-g1 aria-selected:text-ink"
                  >
                    <Building2 className="mr-2 h-4 w-4" /> Spaces
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/meets"))}
                    className="flex cursor-pointer items-center rounded-md px-3 py-2.5 text-[14px] text-g6 hover:bg-g1 hover:text-ink aria-selected:bg-g1 aria-selected:text-ink"
                  >
                    <Calendar className="mr-2 h-4 w-4" /> Meets
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/projects"))}
                    className="flex cursor-pointer items-center rounded-md px-3 py-2.5 text-[14px] text-g6 hover:bg-g1 hover:text-ink aria-selected:bg-g1 aria-selected:text-ink"
                  >
                    <FileText className="mr-2 h-4 w-4" /> Projects
                  </Command.Item>
                </Command.Group>
                
                <Command.Group heading={<span className="text-[11px] font-medium text-g5 uppercase tracking-wider px-2 py-1 block mt-2">Actions</span>}>
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/settings"))}
                    className="flex cursor-pointer items-center rounded-md px-3 py-2.5 text-[14px] text-g6 hover:bg-g1 hover:text-ink aria-selected:bg-g1 aria-selected:text-ink"
                  >
                    <User className="mr-2 h-4 w-4" /> Update Profile
                  </Command.Item>
                  <Command.Item
                    onSelect={() => {
                      setInputValue("?");
                    }}
                    className="flex cursor-pointer items-center rounded-md px-3 py-2.5 text-[14px] text-[var(--brand)] hover:bg-[var(--brand)]/10 aria-selected:bg-[var(--brand)]/10"
                  >
                    <Sparkles className="mr-2 h-4 w-4" /> Ask Convoke AI
                  </Command.Item>
                </Command.Group>
              </>
            )}
          </Command.List>
        </div>
      </Command.Dialog>
    </>
  );
}
