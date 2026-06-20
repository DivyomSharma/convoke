"use client";

import { useState, useRef, useEffect } from "react";
import { postMessage } from "@/app/actions/workspace";
import { Avatar } from "@/components/Avatar";
import { Send, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export type ChatMessage = {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    name: string | null;
    handle: string | null;
    avatarUrl: string | null;
  };
};

export function SpaceChatClient({ 
  spaceId, 
  initialMessages 
}: { 
  spaceId: string; 
  initialMessages: ChatMessage[];
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on load/new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [initialMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    setLoading(true);
    try {
      const res = await postMessage(spaceId, content);
      if (res.success) {
        setContent("");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[60vh] md:h-[70vh] rounded-md border border-g3 glass-panel overflow-hidden">
      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
        {initialMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-g5">
            <span className="serif text-xl italic">Silence is golden.</span>
            <p className="text-[13px] mt-1">Be the first to speak in this space.</p>
          </div>
        ) : (
          initialMessages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-4">
              <Avatar src={msg.user.avatarUrl || ""} name={msg.user.name || "User"} size={36} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-[14px] font-semibold text-ink">{msg.user.name || "User"}</span>
                  <span className="text-[11px] text-g5">@{msg.user.handle || "anonymous"}</span>
                  <span className="text-[10px] text-g4 mono ml-auto">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[14px] text-g6 mt-1.5 whitespace-pre-line leading-relaxed break-words bg-g1/30 p-3 rounded-lg border border-g3/40">
                  {msg.content}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={handleSubmit} className="border-t border-g3 p-4 bg-paper/60 backdrop-blur-md flex items-center gap-3">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Message this space..."
          className="flex-1 bg-g1 border border-g3 rounded-sm px-4 py-3 text-[14px] text-ink placeholder:text-g4 outline-none focus:border-[var(--brand)]/50 focus:ring-1 focus:ring-[var(--brand)]/30 transition-all"
        />
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="w-10 h-10 rounded-sm bg-ink text-paper hover:bg-ink-2 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center shrink-0 border border-[var(--brand)]/20 shadow"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </form>
    </div>
  );
}
