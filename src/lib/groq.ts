import Groq from "groq-sdk";

// Initialize the Groq client. It expects GROQ_API_KEY in the environment.
const apiKey = process.env.GROQ_API_KEY;

export const groq = apiKey ? new Groq({ apiKey }) : null;

export const GROQ_MODEL = "llama-3.3-70b-versatile";
