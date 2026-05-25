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
  { label: "Profile", href: "/workspace", icon: User, section: "main" },
  { label: "Workspace", href: "/workspace", icon: LayoutDashboard, section: "main" },
  { label: "Applications", href: "/workspace#applications", icon: Briefcase, section: "tracking" },
  { label: "Registrations", href: "/workspace#registrations", icon: CalendarDays, section: "tracking" },
  { label: "Certificates", href: "/workspace#certificates", icon: FileBadge2, section: "tracking" },
  { label: "Communities", href: "/workspace#communities", icon: Users, section: "tracking" },
  { label: "Organizer Tools", href: "/workspace/organize", icon: Wrench, section: "tools" },
  { label: "Settings", href: "/workspace", icon: Settings, section: "tools" },
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

  // Build profile href dynamically
  const profileHref = user.username ? `/u/${user.username}` : "/workspace";
  const dynamicMenuItems = menuItems.map((item) =>
    item.label === "Profile" ? { ...item, href: profileHref } : item,
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-line bg-white/[0.04] py-1.5 pl-1.5 pr-3 transition hover:border-bronze/40 hover:bg-white/[0.08]"
      >
        {user.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={user.fullName ?? ""}
            className="size-7 rounded-full object-cover"
          />
        ) : (
          <span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-bronze to-rust text-xs font-semibold text-black">
            {initials}
          </span>
        )}
        <ChevronDown className={`size-3.5 text-muted transition ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-[#0c0c0e]/95 p-1.5 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-2 border-b border-line px-3 pb-3 pt-2">
              <p className="text-sm font-medium text-foreground">{user.fullName ?? user.username}</p>
              <p className="mt-0.5 text-xs text-muted">{user.primaryEmailAddress?.emailAddress}</p>
            </div>

            {["main", "tracking", "tools"].map((section, sectionIndex) => (
              <div key={section}>
                {sectionIndex > 0 && <div className="my-1 h-px bg-line" />}
                {dynamicMenuItems
                  .filter((item) => item.section === section)
                  .map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-white/[0.06] hover:text-foreground"
                    >
                      <item.icon className="size-4" />
                      {item.label}
                    </Link>
                  ))}
              </div>
            ))}

            <div className="my-1 h-px bg-line" />
            <button
              onClick={() => {
                setOpen(false);
                signOut({ redirectUrl: "/" });
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-white/[0.06] hover:text-foreground"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function NavNotificationBell() {
  return (
    <Link
      href="/workspace#notifications"
      className="relative grid size-9 place-items-center rounded-full border border-line bg-white/[0.03] text-muted transition hover:border-bronze/40 hover:text-foreground"
      aria-label="Notifications"
    >
      <Bell className="size-4" />
    </Link>
  );
}

export function NavSavedButton() {
  return (
    <Link
      href="/workspace#saved"
      className="relative grid size-9 place-items-center rounded-full border border-line bg-white/[0.03] text-muted transition hover:border-bronze/40 hover:text-foreground"
      aria-label="Saved items"
    >
      <Bookmark className="size-4" />
    </Link>
  );
}
