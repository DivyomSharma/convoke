import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';

// Groq AI configuration
export const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export const MODELS = {
  FAST: 'qwen-2.5-32b',
  REASONING: 'deepseek-r1-distill-llama-70b',
  GENERAL: 'llama-3.3-70b-versatile',
  FALLBACK: 'mixtral-8x7b-32768'
};

export async function processCommand(query: string, context: string) {
  const lowerQuery = query.toLowerCase();
  let modelName = MODELS.GENERAL;

  // Simple heuristic router based on Llama 4 Maverick concept
  if (lowerQuery.length < 30 || lowerQuery.includes("find") || lowerQuery.includes("who")) {
    modelName = MODELS.FAST;
  } else if (lowerQuery.includes("why") || lowerQuery.includes("generate") || lowerQuery.includes("plan")) {
    modelName = MODELS.REASONING;
  }

  try {
    return streamText({
      model: groq(modelName),
      system: `You are the AI Operating System for Convoke, a platform for builders, founders, and creators.
Your goal is to be helpful, concise, and act like a terminal command center.
Current Context: ${context}

Never refer to yourself as an AI or language model. Respond directly to the user's command.`,
      prompt: query,
    });
  } catch (error) {
    // Fallback to mixtral
    return streamText({
      model: groq(MODELS.FALLBACK),
      system: "You are the AI Operating System for Convoke. Respond directly to the user's command.",
      prompt: query,
    });
  }
}