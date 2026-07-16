import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("[Gemini] GEMINI_API_KEY is not set. AI features will be disabled.");
}

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

export async function generateText(prompt: string): Promise<string> {
  if (!ai) throw new Error("GEMINI_API_KEY is not configured");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return response.text ?? "";
  } catch (err) {
    console.error("[Gemini generateText error]", err);
    throw err;
  }
}

export const isGeminiConfigured = () => !!process.env.GEMINI_API_KEY;
