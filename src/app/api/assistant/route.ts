import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Try to get GROQ_API_KEY from environment variables
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      // If no key is configured, return a mock response for now
      return NextResponse.json({ 
        reply: "Convoke AI is currently in preview. To enable live responses, please configure your GROQ_API_KEY in the environment settings." 
      });
    }

    const groq = new Groq({ apiKey });
    
    // Check if the user is asking about Convoke
    const systemPrompt = `You are the Convoke Assistant. 
Convoke is an ecosystem graph for people building the future.
Keep your answers brief, inspiring, and helpful. 
You help builders navigate the platform, answer questions about communities, events (meets), opportunities, projects, and research.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      model: "llama3-8b-8192", // Use a fast default model
    });

    const reply = chatCompletion.choices[0]?.message?.content || "I couldn't process that request.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Groq Assistant Error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
