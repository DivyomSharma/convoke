"use client";

import { useState } from "react";
import { Search, Send, Image as ImageIcon, Smile, MoreHorizontal, FileText } from "lucide-react";
import Link from "next/link";



export function MessagesClient() {
  const activeThread = null;

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

        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-g5">
          <div className="w-12 h-12 rounded-full bg-g1 flex items-center justify-center mb-4">
            <Search size={18} className="text-g4" />
          </div>
          <p className="text-[14px]">No conversations found.</p>
        </div>
      </aside>

      {/* Right Content: Conversation */}
      <section className={`col-span-12 md:col-span-8 flex flex-col bg-paper relative ${!activeThread ? "hidden md:flex" : "flex"}`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-g5 text-center px-6">
          <div className="w-16 h-16 rounded-full bg-g1 flex items-center justify-center mb-6">
            <Send size={24} className="text-g4" />
          </div>
          <p className="font-medium text-ink mb-2">Direct Messaging is currently disabled.</p>
          <p className="text-[14px] max-w-[40ch] leading-relaxed">
            Messaging is rolling out progressively to verified users to ensure trust and safety across the Convoke network.
          </p>
        </div>
      </section>
    </div>
  );
}
