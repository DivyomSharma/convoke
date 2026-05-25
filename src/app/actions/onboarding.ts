"use server";

import { auth } from "@clerk/nextjs/server";
import { getPrisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { groq, GROQ_MODEL } from "@/lib/groq";
import { z } from "zod";

const extractedProfileSchema = z.object({
  headline: z.string().describe("Ambitious, modern startup-native headline. E.g., 'AI Builder • Community Organizer • Full-stack Developer'"),
  bio: z.string().describe("A clean, confident short bio highlighting momentum and ecosystem focus. Don't sound corporate."),
  skills: z.array(z.string()).describe("List of core skills, e.g., 'React', 'Growth', 'Go', 'Figma'"),
  interests: z.array(z.string()).describe("High-level ecosystem interests, e.g., 'AI', 'Startups', 'Hackathons'"),
  tags: z.array(z.string()).describe("Ecosystem roles/tags, e.g., 'builder', 'organizer', 'designer', 'founder'"),
});

export async function extractProfileAI(text: string) {
  if (!text.trim()) {
    throw new Error("No text provided");
  }

  if (!groq) {
    // Fallback if GROQ_API_KEY is not configured
    console.warn("GROQ_API_KEY not found. Using heuristic fallback.");
    return fallbackExtract(text);
  }

  try {
    const response = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: `You are Convoke's intelligence layer. 
Your job is to parse resumes, LinkedIn summaries, or portfolio text and output a clean, modern, ambitious ecosystem profile.
Rules:
- Do NOT sound corporate, robotic, or like a resume parser.
- Sound startup-native, creator-native, and ecosystem-aware.
- The headline should use bullet separators (•) and highlight the user's builder identity.
- Output strictly in valid JSON matching the required schema.`
        },
        {
          role: "user",
          content: `Parse this profile text:\n\n${text}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const resultText = response.choices[0]?.message?.content;
    if (!resultText) throw new Error("No response from Groq");

    const parsed = JSON.parse(resultText);
    return extractedProfileSchema.parse(parsed);
  } catch (error) {
    console.error("Groq extraction failed:", error);
    return fallbackExtract(text);
  }
}

function fallbackExtract(text: string) {
  const t = text.toLowerCase();
  const extracted = {
    headline: "Ecosystem Builder",
    skills: [] as string[],
    interests: [] as string[],
    bio: text.slice(0, 150) + (text.length > 150 ? "..." : ""),
    tags: ["builder"]
  };

  if (t.includes("founder") || t.includes("ceo") || t.includes("startup")) {
    extracted.headline = "Startup Founder & Builder";
    extracted.tags.push("founder");
  } else if (t.includes("developer") || t.includes("engineer") || t.includes("software")) {
    extracted.headline = "Software Engineer & Builder";
    extracted.tags.push("developer");
  } else if (t.includes("design") || t.includes("ui/ux")) {
    extracted.headline = "Product Designer";
    extracted.tags.push("designer");
  }

  const skillKeywords = ["javascript", "typescript", "react", "nextjs", "node", "python", "figma", "marketing", "sales"];
  skillKeywords.forEach(k => {
    if (t.includes(k)) extracted.skills.push(k.charAt(0).toUpperCase() + k.slice(1));
  });

  const interestKeywords = ["ai", "crypto", "web3", "startups", "gaming", "design", "open source"];
  interestKeywords.forEach(k => {
    if (t.includes(k)) extracted.interests.push(k.charAt(0).toUpperCase() + k.slice(1));
  });

  return extracted;
}

export async function completeOnboarding(data: {
  displayName: string;
  username: string;
  headline: string;
  role: UserRole;
  interests: string[];
  skills: string[];
  bio: string;
  tags?: string[];
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prisma = getPrisma();
  
  const existing = await prisma.user.findUnique({
    where: { username: data.username }
  });
  
  if (existing && existing.clerkId !== userId) {
    throw new Error("Username already taken");
  }

  await prisma.user.update({
    where: { clerkId: userId },
    data: {
      displayName: data.displayName,
      username: data.username,
      headline: data.headline,
      role: data.role,
      interests: data.interests,
      skills: data.skills,
      bio: data.bio,
      badges: data.tags || [], // Store tags in badges or a custom array
      onboardingDone: true
    }
  });

  return { success: true };
}
