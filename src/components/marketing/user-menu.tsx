"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Bookmark,
  Briefcase,
  CalendarDays,
  ChevronDown,
  FileBadge2,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  Users,
  Wrench,
} from "lucide-react";

const menuItems = [
  { label: "Profile", href: "/u/[username]", icon: User, section: "main" },
  { label: "Workspace", href: "/workspace", icon: LayoutDashboard, section: "main" },
  { label: "Applications", href: "/workspace/applications", icon: Briefcase, section: "tracking" },
  { label: "Registrations", href: "/workspace/registrations", icon: CalendarDays, section: "tracking" },
  { label: "Certificates", href: "/workspace/certificates", icon: FileBadge2, section: "tracking" },
  { label: "Communities", href: "/workspace/communities", icon: Users, section: "tracking" },
  { label: "Organizer Tools", href: "/workspace/organize", icon: Wrench, section: "tools" },
  { label: "Settings", href: "/workspace/settings", icon: Settings, section: "tools" },
];

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!user) return null;

  const initials = (user.fullName ?? user.username ?? "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const profileHref = user.username ? `/u/${user.username}` : "/workspace";
  const dynamicMenuItems = menuItems.map((item) =>
    item.label === "Profile" ? { ...item, href: profileHref } : item,
  );

  const staggerVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 30,
        staggerChildren: 0.03,
      }
    },
    exit: { 
      opacity: 0, 
      y: 8, 
      scale: 0.96,
      transition: { duration: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -4 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div ref={ref} className="relative z-50">
      <button
        onClick={() => setOpen((v) => !v)}
        className="group flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] py-1.5 pl-1.5 pr-3 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition duration-300 hover:border-bronze/50 hover:bg-white/[0.06] hover:shadow-[0_0_20px_rgba(198,161,111,0.15)]"
      >
        {user.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={user.fullName ?? ""}
            className="size-7 rounded-full object-cover border border-white/10 group-hover:border-bronze/50 transition duration-300"
          />
        ) : (
          <span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-bronze to-rust text-xs font-semibold text-black">
            {initials}
          </span>
        )}
        <ChevronDown className={`size-3.5 text-muted transition-transform duration-300 ${open ? "rotate-180 text-foreground" : "group-hover:text-foreground"}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={staggerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0A0A]/80 p-2 shadow-[0_8px_40px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-2xl"
          >
            <motion.div variants={itemVariants} className="mb-2 px-3 pb-3 pt-2">
              <p className="text-sm font-medium text-foreground tracking-tight">{user.fullName ?? user.username}</p>
              <p className="mt-0.5 text-xs text-muted truncate">{user.primaryEmailAddress?.emailAddress}</p>
            </motion.div>

            {["main", "tracking", "tools"].map((section, sectionIndex) => (
              <div key={section}>
                {sectionIndex > 0 && <div className="my-1.5 h-px bg-white/[0.06]" />}
                {dynamicMenuItems
                  .filter((item) => item.section === section)
                  .map((item) => (
                    <motion.div key={item.label} variants={itemVariants}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="group flex items-center gap-3 rounded-[10px] px-3 py-2 text-[13px] font-medium text-muted transition duration-200 hover:bg-white/[0.08] hover:text-foreground"
                      >
                        <item.icon className="size-4 opacity-70 transition duration-200 group-hover:opacity-100 group-hover:text-bronze" />
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
              </div>
            ))}

            <div className="my-1.5 h-px bg-white/[0.06]" />
            <motion.div variants={itemVariants}>
              <button
                onClick={() => {
                  setOpen(false);
                  signOut({ redirectUrl: "/" });
                }}
                className="group flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-[13px] font-medium text-muted transition duration-200 hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut className="size-4 opacity-70 transition duration-200 group-hover:opacity-100" />
                Sign out
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function NavNotificationBell() {
  return (
    <Link
      href="/workspace/notifications"
      className="relative grid size-9 place-items-center rounded-full border border-white/[0.08] bg-white/[0.02] text-muted transition duration-300 hover:border-bronze/40 hover:bg-white/[0.06] hover:text-foreground hover:shadow-[0_0_15px_rgba(198,161,111,0.15)]"
      aria-label="Notifications"
    >
      <Bell className="size-4" />
    </Link>
  );
}

export function NavSavedButton() {
  return (
    <Link
      href="/workspace/saved"
      className="relative grid size-9 place-items-center rounded-full border border-white/[0.08] bg-white/[0.02] text-muted transition duration-300 hover:border-bronze/40 hover:bg-white/[0.06] hover:text-foreground hover:shadow-[0_0_15px_rgba(198,161,111,0.15)]"
      aria-label="Saved items"
    >
      <Bookmark className="size-4" />
    </Link>
  );
}
