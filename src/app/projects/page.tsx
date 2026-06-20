import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import Link from "next/link";
import { Heart, MessageSquare, Share } from "lucide-react";
import { Avatar } from "@/components/Avatar";

const mockProjects = [
  { id: 1, title: "Luna OS", description: "A beautiful, minimalist operating system built on web technologies.", author: "Divyom Sharma", handle: "divyom", likes: 342, comments: 45, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop" },
  { id: 2, title: "Nexus GraphQL", description: "High performance GraphQL engine for edge computing.", author: "Alice Chen", handle: "alice", likes: 890, comments: 120, image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop" },
  { id: 3, title: "Synthetix AI", description: "Generative AI music engine using transformer architectures.", author: "Bob Smith", handle: "bob", likes: 512, comments: 88, image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop" },
];

export default function ProjectsPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12 relative">
        <AmbientGlow className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] opacity-[0.02] dark:opacity-[0.04]" />
        
        <div className="flex items-end justify-between hairline-b pb-6 relative z-10">
          <div>
            <h1 className="serif text-5xl md:text-6xl tracking-tight">Projects Gallery</h1>
            <p className="text-g5 mt-3 text-lg">Proof of work. Discover what ambitious people are building.</p>
          </div>
          <button className="bg-ink text-paper px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-colors">
            Launch Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 relative z-10">
          {mockProjects.map((proj) => (
            <div key={proj.id} className="premium-card overflow-hidden flex flex-col group">
              <Link href={`/projects/${proj.id}`} className="block relative h-48 overflow-hidden bg-g1">
                <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </Link>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar src="" name={proj.author} size={24} />
                  <Link href={`/profile/${proj.handle}`} className="text-[13px] font-medium text-ink hover:underline">{proj.author}</Link>
                </div>
                <Link href={`/projects/${proj.id}`} className="block">
                  <h3 className="serif text-2xl group-hover:text-[var(--brand)] transition-colors">{proj.title}</h3>
                  <p className="text-g5 text-[14px] mt-2 line-clamp-2">{proj.description}</p>
                </Link>
                
                <div className="mt-6 flex items-center justify-between text-g5 text-[13px] hairline-t pt-4">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 hover:text-ink transition-colors"><Heart size={16} /> {proj.likes}</button>
                    <button className="flex items-center gap-1.5 hover:text-ink transition-colors"><MessageSquare size={16} /> {proj.comments}</button>
                  </div>
                  <button className="hover:text-ink transition-colors"><Share size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
