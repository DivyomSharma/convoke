import { cn } from "@/lib/utils";

export function Panel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[24px] border border-white/[0.06] bg-[#0A0A0A]/60 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl transition duration-500 hover:border-bronze/30 hover:shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(198,161,111,0.05)]",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 transition duration-500 group-hover:opacity-100 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
