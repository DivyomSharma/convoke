import { Shell } from "@/components/Shell";

export default function Loading() {
  return (
    <Shell>
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-12 w-full animate-pulse">
        <div className="h-8 bg-g2 w-48 mb-4 rounded-sm" />
        <div className="h-16 bg-g2 w-3/4 max-w-xl mb-12 rounded-sm" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="h-64 bg-g2 rounded-sm" />
          <div className="h-64 bg-g2 rounded-sm" />
          <div className="h-64 bg-g2 rounded-sm" />
        </div>
      </div>
    </Shell>
  );
}
