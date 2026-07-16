import { GoogleGenAI } from "@google/genai";

export async function GET() {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    return Response.json({ status: "error", message: "GEMINI_API_KEY not set" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: key });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Say hello in Indonesian in 5 words max.",
    });

    return Response.json({
      status: "ok",
      keyPrefix: key.slice(0, 6),
      response: response.text,
    });
  } catch (err) {
    return Response.json({
      status: "error",
      keyPrefix: key.slice(0, 6),
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack?.slice(0, 500) : undefined,
    });
  }
}
