import Groq from "groq-sdk";

export async function GET() {
  const key = process.env.GROQ_API_KEY;

  if (!key) {
    return Response.json({ status: "error", message: "GROQ_API_KEY not set" });
  }

  try {
    const groq = new Groq({ apiKey: key });

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: "Say hello in Indonesian in 5 words max." }],
    });

    return Response.json({
      status: "ok",
      keyPrefix: key.slice(0, 6),
      response: response.choices[0]?.message?.content?.trim(),
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
