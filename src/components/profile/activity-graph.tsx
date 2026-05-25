"use client";

import { motion } from "framer-motion";

export function ActivityGraph({ activities }: { activities: any[] }) {
  // A GitHub-style or Bento-style momentum graph
  const weeks = 52;
  const daysPerWeek = 7;
  const totalDays = weeks * daysPerWeek;
  
  // Dummy generate activity intensity for visual effect
  const activityMap = new Map();
  activities.forEach(a => {
    const day = new Date(a.date).getDay(); // simplifying mapping for visual dummy
    activityMap.set(day, (activityMap.get(day) || 0) + 1);
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end gap-1 overflow-hidden h-24">
        {Array.from({ length: 40 }).map((_, i) => {
          // Generate a staggered random height for a bar graph look
          const height = Math.floor(Math.random() * 80) + 20;
          return (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: `${height}%`, opacity: 1 }}
              transition={{ delay: i * 0.02, duration: 0.5 }}
              key={i}
              className="w-full flex-1 rounded-t-sm bg-gradient-to-t from-emerald-500/20 to-emerald-500/80 hover:to-emerald-400 transition-colors"
            />
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-muted font-medium uppercase tracking-widest">
        <span>Building Momentum</span>
        <span>{activities.length} Actions</span>
      </div>
    </div>
  );
}
