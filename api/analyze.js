const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
const MAX_OUTPUT_TOKENS = 2000;

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY is not configured" });
  }

  const { system, messages, max_tokens: requestedMaxTokens } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "A non-empty messages array is required" });
  }

  const maxTokens = Math.min(
    Math.max(Number(requestedMaxTokens) || 1200, 1),
    MAX_OUTPUT_TOKENS,
  );

  const payload = {
    model: DEFAULT_MODEL,
    max_tokens: maxTokens,
    messages: messages.slice(0, 20),
  };

  if (typeof system === "string" && system.trim()) {
    payload.system = system.slice(0, 12000);
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown upstream error";
    return res.status(500).json({ error: message });
  }
}
