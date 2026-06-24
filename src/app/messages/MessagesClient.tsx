"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Send, CheckCircle, Clock, Ban } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { sendMessage, acceptMessageRequest, rejectMessageRequest } from "@/app/actions/messages";

type ConversationData = {
  id: string;
  status?: string;
  messages: { id: string; content: string; senderId: string; createdAt: Date | string }[];
  participants: { userId: string; status: string; user: { id: string; name: string | null; handle: string | null; avatarUrl: string | null; username?: string | null } }[];
  updatedAt: string | Date;
};

export function MessagesClient({ 
  currentUserId, 
  initialConversations 
}: { 
  currentUserId: string; 
  initialConversations: ConversationData[]; 
}) {
  const [conversations, setConversations] = useState<ConversationData[]>(initialConversations);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeThread = conversations.find(c => c.id === activeThreadId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThread?.messages]);

  const getOtherParticipant = (conv: ConversationData) => {
    return conv.participants.find((p) => p.userId !== currentUserId)?.user;
  };

  const getMyParticipant = (conv: ConversationData) => {
    return conv.participants.find((p) => p.userId === currentUserId);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !activeThreadId) return;

    setIsSending(true);
    const result = await sendMessage(activeThreadId, content);
    if (result.success) {
      setContent("");
      // Optimistic update locally
      setConversations(prev => prev.map(c => {
        if (c.id === activeThreadId) {
          return { ...c, messages: [...c.messages, result.message] };
        }
        return c;
      }));
    } else {
      alert(result.error);
    }
    setIsSending(false);
  };

  const handleAccept = async (convId: string) => {
    await acceptMessageRequest(convId);
    setConversations(prev => prev.map(c => {
      if (c.id === convId) {
        return { 
          ...c, 
          participants: c.participants.map((p) => 
            p.userId === currentUserId ? { ...p, status: "ACCEPTED" } : p
          ) 
        };
      }
      return c;
    }));
  };

  const handleReject = async (convId: string) => {
    await rejectMessageRequest(convId);
    setConversations(prev => prev.filter(c => c.id !== convId));
    if (activeThreadId === convId) setActiveThreadId(null);
  };

  return (
    <div className="mx-auto max-w-[1240px] grid grid-cols-1 md:grid-cols-12 border border-g3 rounded-md mt-8 mb-16 overflow-hidden bg-paper-card" style={{ height: "75vh" }}>
      
      {/* Left Sidebar: Threads */}
      <aside className={`col-span-12 md:col-span-4 border-r border-g3 flex flex-col ${activeThread ? "hidden md:flex" : "flex"}`}>
        <div className="p-4 border-b border-g3 flex items-center justify-between bg-g1/30">
          <h1 className="serif text-2xl text-ink">Messages</h1>
        </div>
        
        <div className="p-3 border-b border-g3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-g4" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full bg-g1 border border-g3 rounded-md pl-9 pr-3 py-2 text-[13px] outline-none focus:border-[var(--brand)]/50 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {conversations.length > 0 ? (
            <ul className="divide-y divide-g3">
              {conversations.map(conv => {
                const other = getOtherParticipant(conv);
                const me = getMyParticipant(conv);
                const lastMessage = conv.messages[conv.messages.length - 1];
                const isPending = me?.status === "PENDING";

                return (
                  <li key={conv.id}>
                    <button 
                      onClick={() => setActiveThreadId(conv.id)}
                      className={`w-full text-left p-4 hover:bg-g1/50 transition-colors flex gap-3 ${activeThreadId === conv.id ? "bg-g1" : ""}`}
                    >
                      <Avatar src={other?.avatarUrl || ""} name={other?.name || "User"} size={44} />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[14px] font-medium text-ink truncate">{other?.name || "User"}</span>
                          {lastMessage && (
                            <span className="text-[11px] text-g4 shrink-0">{new Date(lastMessage.createdAt).toLocaleDateString()}</span>
                          )}
                        </div>
                        {isPending ? (
                          <span className="text-[12px] font-medium text-[var(--brand)] flex items-center gap-1">
                            <Clock size={12} /> Message Request
                          </span>
                        ) : (
                          <p className="text-[13px] text-g5 truncate">
                            {lastMessage ? lastMessage.content : "No messages yet"}
                          </p>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 text-g5 h-full">
              <div className="w-12 h-12 rounded-full bg-g1 flex items-center justify-center mb-4">
                <Search size={18} className="text-g4" />
              </div>
              <p className="text-[14px]">No conversations yet.</p>
            </div>
          )}
        </div>
      </aside>

      {/* Right Content: Conversation */}
      <section className={`col-span-12 md:col-span-8 flex flex-col bg-paper relative ${!activeThread ? "hidden md:flex" : "flex"}`}>
        {activeThread ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-g3 flex items-center gap-3 bg-g1/30">
              <button className="md:hidden text-g5 hover:text-ink mr-2" onClick={() => setActiveThreadId(null)}>
                &larr; Back
              </button>
              <Avatar 
                src={getOtherParticipant(activeThread)?.avatarUrl || ""} 
                name={getOtherParticipant(activeThread)?.name || "User"} 
                size={36} 
              />
              <div>
                <div className="text-[14px] font-medium text-ink">
                  {getOtherParticipant(activeThread)?.name || "User"}
                </div>
                <div className="text-[12px] text-g5">
                  @{getOtherParticipant(activeThread)?.handle || getOtherParticipant(activeThread)?.username}
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeThread.messages.length > 0 ? (
                activeThread.messages.map((msg) => {
                  const isMe = msg.senderId === currentUserId;
                  return (
                    <div key={msg.id} className={`flex flex-col max-w-[75%] ${isMe ? "ml-auto items-end" : "mr-auto items-start"}`}>
                      <div className={`px-4 py-2 rounded-2xl text-[14px] ${isMe ? "bg-[var(--brand)] text-paper rounded-br-sm" : "bg-g2 text-ink rounded-bl-sm"}`}>
                        {msg.content}
                      </div>
                      <div className="text-[10px] text-g4 mt-1 px-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-g5">
                  <p className="text-[14px]">This is the beginning of your conversation.</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area or Request Actions */}
            {getMyParticipant(activeThread)?.status === "PENDING" ? (
              <div className="p-4 border-t border-g3 bg-g1/50">
                <div className="text-center mb-4">
                  <p className="text-[14px] font-medium text-ink mb-1">Message Request</p>
                  <p className="text-[13px] text-g5">If you reply, this user will be able to call you and see information like your Read Receipts.</p>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <button onClick={() => handleReject(activeThread.id)} className="px-6 py-2 text-[13px] font-medium text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-full transition-colors flex items-center gap-2">
                    <Ban size={14} /> Delete
                  </button>
                  <button onClick={() => handleAccept(activeThread.id)} className="ink-button px-6 py-2 text-[13px] font-medium flex items-center gap-2">
                    <CheckCircle size={14} /> Accept
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSend} className="p-4 border-t border-g3 bg-paper flex items-center gap-3">
                <input 
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Message..."
                  className="flex-1 bg-g1 border border-g3 rounded-full px-4 py-2.5 text-[14px] outline-none focus:border-[var(--brand)]/50 transition-colors"
                />
                <button 
                  type="submit" 
                  disabled={!content.trim() || isSending}
                  className="w-10 h-10 rounded-full bg-ink text-paper flex items-center justify-center disabled:opacity-50 hover:bg-ink-2 transition-colors shrink-0"
                >
                  <Send size={16} className="ml-1" />
                </button>
              </form>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-g5 text-center px-6">
            <div className="w-16 h-16 rounded-full bg-g1 flex items-center justify-center mb-6">
              <Send size={24} className="text-g4" />
            </div>
            <p className="font-medium text-ink mb-2">Your Messages</p>
            <p className="text-[14px] max-w-[40ch] leading-relaxed">
              Select a conversation or start a new one to connect with builders.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
