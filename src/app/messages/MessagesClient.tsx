"use client";

import { useState } from "react";
import { Search, Send, Image as ImageIcon, Smile, MoreHorizontal, FileText } from "lucide-react";
import Link from "next/link";

const mockThreads = [
  { id: "1", name: "Siddharth Jain", handle: "siddharth", avatar: null, lastMessage: "Are we still on for the integration sync tomorrow?", time: "2h", unread: true },
  { id: "2", name: "Arjun Verma", handle: "arjunv", avatar: null, lastMessage: "The hackathon submission looks solid.", time: "5h", unread: false },
  { id: "3", name: "Priya Sharma", handle: "priya", avatar: null, lastMessage: "Thanks for connecting!", time: "1d", unread: false },
];

const mockMessages = [
  { id: "m1", sender: "Siddharth Jain", text: "Hey! Loved the new repo you open sourced.", time: "10:00 AM", isMe: false },
  { id: "m2", sender: "Me", text: "Thanks Siddharth! Appreciate it.", time: "10:15 AM", isMe: true },
  { id: "m3", sender: "Siddharth Jain", text: "Are we still on for the integration sync tomorrow?", time: "11:30 AM", isMe: false },
];

export function MessagesClient() {
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const selectedThread = mockThreads.find(t => t.id === activeThread);

  return (
    <div className="mx-auto max-w-[1240px] grid grid-cols-1 md:grid-cols-12 border border-g3 rounded-md mt-8 mb-16 overflow-hidden bg-paper-card" style={{ height: "75vh" }}>
      
      {/* Left Sidebar: Threads */}
      <aside className={`col-span-12 md:col-span-4 border-r border-g3 flex flex-col ${activeThread ? "hidden md:flex" : "flex"}`}>
        <div className="p-4 border-b border-g3 flex items-center justify-between bg-g1/30">
          <h1 className="serif text-2xl text-ink">Messages</h1>
          <button className="text-[12px] font-medium text-ink bg-g2 hover:bg-g3 px-3 py-1.5 rounded-full transition-colors">New Message</button>
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

        <div className="flex-1 overflow-y-auto">
          <ul className="divide-y divide-g3/50">
            {mockThreads.map(thread => (
              <li key={thread.id}>
                <button 
                  onClick={() => setActiveThread(thread.id)}
                  className={`w-full text-left p-4 flex gap-3 hover:bg-g1/50 transition-colors ${activeThread === thread.id ? "bg-g1" : ""}`}
                >
                  <div className="w-12 h-12 rounded-full bg-g2 border border-g3 flex-shrink-0 flex items-center justify-center text-g5 font-medium">
                    {thread.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-[14px] text-ink truncate">{thread.name}</span>
                      <span className="text-[11px] text-g4 whitespace-nowrap ml-2">{thread.time}</span>
                    </div>
                    <div className={`text-[13px] truncate ${thread.unread ? "text-ink font-medium" : "text-g5"}`}>
                      {thread.lastMessage}
                    </div>
                  </div>
                  {thread.unread && (
                    <div className="w-2 h-2 rounded-full bg-[var(--brand)] self-center ml-2" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Right Content: Conversation */}
      <section className={`col-span-12 md:col-span-8 flex flex-col bg-paper relative ${!activeThread ? "hidden md:flex" : "flex"}`}>
        {activeThread && selectedThread ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-g3 flex items-center justify-between bg-g1/30">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveThread(null)} className="md:hidden text-g5 hover:text-ink mr-2">
                  &larr; Back
                </button>
                <div className="w-10 h-10 rounded-full bg-g2 border border-g3 flex items-center justify-center text-g5 font-medium">
                  {selectedThread.name.charAt(0)}
                </div>
                <div>
                  <Link href={`/profile/${selectedThread.handle}`} className="font-medium text-[15px] text-ink hover:underline">
                    {selectedThread.name}
                  </Link>
                  <div className="text-[12px] text-g5">@{selectedThread.handle}</div>
                </div>
              </div>
              <button className="text-g4 hover:text-ink p-2 rounded-full hover:bg-g2 transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              <div className="text-center text-[12px] text-g4 uppercase tracking-widest font-medium mb-4">Today</div>
              
              {mockMessages.map(msg => (
                <div key={msg.id} className={`flex flex-col max-w-[75%] ${msg.isMe ? "self-end items-end" : "self-start items-start"}`}>
                  <div className="flex items-end gap-2 mb-1">
                    {!msg.isMe && <span className="text-[11px] font-medium text-g5">{msg.sender}</span>}
                    <span className="text-[10px] text-g4">{msg.time}</span>
                  </div>
                  <div className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed ${
                    msg.isMe 
                      ? "bg-ink text-paper rounded-br-sm" 
                      : "bg-g1 border border-g3 text-ink rounded-bl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Composer */}
            <div className="p-4 border-t border-g3 bg-g1/20">
              <div className="bg-paper border border-g3 rounded-xl flex items-end p-2 shadow-sm focus-within:border-[var(--brand)]/50 transition-colors">
                <button className="p-2 text-g4 hover:text-ink transition-colors"><ImageIcon size={20} /></button>
                <button className="p-2 text-g4 hover:text-ink transition-colors"><FileText size={20} /></button>
                
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message Siddharth..."
                  className="flex-1 max-h-[120px] bg-transparent outline-none resize-none px-3 py-2 text-[14px]"
                  rows={1}
                />
                
                <button className="p-2 text-g4 hover:text-ink transition-colors mr-1"><Smile size={20} /></button>
                <button 
                  className={`p-2 rounded-lg transition-colors ${
                    message.trim() ? "bg-[var(--brand)] text-white hover:opacity-90" : "bg-g2 text-g4"
                  }`}
                >
                  <Send size={18} className={message.trim() ? "ml-0.5" : ""} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-g5">
            <div className="w-16 h-16 rounded-full bg-g1 flex items-center justify-center mb-4">
              <Send size={24} className="text-g4" />
            </div>
            <p className="font-medium text-ink">Your Messages</p>
            <p className="text-[14px] mt-1">Select a conversation or start a new one.</p>
            <button className="mt-6 ink-button px-5 py-2 text-[13px] rounded-full">New Message</button>
          </div>
        )}
      </section>
    </div>
  );
}
