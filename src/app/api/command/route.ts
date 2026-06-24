import { requireUser } from "@/lib/auth";
import { processCommand } from "@/lib/ai/router";
import { globalSearch } from "@/app/actions/search";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const { prompt, mode } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    const query = prompt;

    // If it's a direct entity search, we don't stream, we return JSON
    if (mode === 'search') {
      const results = await globalSearch(query);
      return NextResponse.json({ results });
    }

    // Otherwise, we process it as a natural language command via Groq
    const searchResults = await globalSearch(query);
    const context = `User Context: Name: ${user?.name}, Role: ${user?.role}. Returning top 5 search matches if relevant to query: ${JSON.stringify(searchResults.slice(0, 5))}`;
    
    const result = await processCommand(query, context);
    
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Command API Error:", error);
    return NextResponse.json({ error: "Failed to process command" }, { status: 500 });
  }
}