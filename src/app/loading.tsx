import { Shell } from "@/components/Shell";
import { ConvokeLoader } from "@/components/ui/convoke-loader";

export default function Loading() {
  return (
    <Shell>
      <div className="min-h-[80vh] flex items-center justify-center animate-in fade-in duration-300">
        <ConvokeLoader size={128} />
      </div>
    </Shell>
  );
}
