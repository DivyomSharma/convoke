import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getActiveIdentity } from "@/lib/identity";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const lowerPrompt = prompt.toLowerCase();
    let reply = "I'm not sure how to help with that. Try asking about 'meets', 'opportunities', 'hackathons', 'spaces', or 'projects'.";

    if (lowerPrompt.includes("opportunity") || lowerPrompt.includes("opportunities") || lowerPrompt.includes("hackathon")) {
      const opps = await prisma.opportunity.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
        include: { organization: true }
      });
      if (opps.length > 0) {
        reply = "Here are some recent opportunities you might be interested in:\n\n" + opps.map(o => `- **${o.title}** at ${o.organization?.name || 'Community'}\n  ${o.location || 'Remote'} · ${o.compensation || 'Competitive'}`).join("\n\n");
      } else {
        reply = "I couldn't find any opportunities matching your request at the moment.";
      }
    } else if (lowerPrompt.includes("meet") || lowerPrompt.includes("event")) {
      const meets = await prisma.meet.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
        include: { space: true }
      });
      if (meets.length > 0) {
        reply = "Here are some upcoming meets:\n\n" + meets.map(m => `- **${m.title}** hosted by ${m.space.name}\n  Starts at ${m.startTime.toLocaleString()}`).join("\n\n");
      } else {
        reply = "There are no upcoming meets right now.";
      }
    } else if (lowerPrompt.includes("space") || lowerPrompt.includes("community") || lowerPrompt.includes("communities")) {
      const spaces = await prisma.space.findMany({
        take: 3,
        orderBy: { createdAt: "desc" }
      });
      if (spaces.length > 0) {
        reply = "Check out these spaces on Convoke:\n\n" + spaces.map(s => `- **${s.name}**\n  ${s.description?.substring(0, 50)}...`).join("\n\n");
      } else {
        reply = "I couldn't find any active spaces at the moment.";
      }
    } else if (lowerPrompt.includes("project")) {
      const projects = await prisma.project.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
        include: { user: true }
      });
      if (projects.length > 0) {
        reply = "Here are some recent projects built by the community:\n\n" + projects.map(p => `- **${p.title}** by ${p.user.name}\n  ${p.description?.substring(0, 50)}...`).join("\n\n");
      } else {
        reply = "No projects found.";
      }
    }

    const identity = await getActiveIdentity();
    let systemContext = "";
    if (identity.type === "org") {
      systemContext = `[Context: Acting as Organization - ${identity.org.name}]\n\n`;
    } else if (identity.type === "space") {
      systemContext = `[Context: Acting as Space - ${identity.space.name}]\n\n`;
    }

    return NextResponse.json({ reply: systemContext + reply });
  } catch (error) {
    console.error("Assistant Error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
