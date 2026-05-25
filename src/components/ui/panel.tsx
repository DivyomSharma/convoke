import { cn } from "@/lib/utils";

export function Panel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass-sheen rounded-[8px] border border-line bg-white/[0.035] shadow-[0_24px_80px_rgba(0,0,0,0.28)]",
        className,
      )}
      {...props}
    />
  );
}
