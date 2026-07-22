import Groq from "groq-sdk";

const GROQ_MODEL = "llama-3.3-70b-versatile";

if (!process.env.GROQ_API_KEY) {
  console.warn("[Groq] GROQ_API_KEY is not set. AI features will be disabled.");
}

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

export async function generateText(prompt: string): Promise<string> {
  if (!groq) throw new Error("GROQ_API_KEY is not configured");

  const startTime = Date.now();

  try {
    const response = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const latency = Date.now() - startTime;
    const tokenUsage = response.usage;

    console.log("[Groq]", {
      Model: GROQ_MODEL,
      Latency: `${latency}ms`,
      "Token Usage": tokenUsage,
    });

    return response.choices[0]?.message?.content?.trim() || "";
  } catch (err) {
    console.error("[Groq generateText error]", err);
    throw new Error("AI sedang sibuk, silakan coba beberapa saat lagi.");
  }
}

export const isAIConfigured = () => !!process.env.GROQ_API_KEY;
