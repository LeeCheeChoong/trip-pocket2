// Reads a receipt photo with Claude and returns {merchant, date, total, currency, category}.
// Requires a signed-in user (verify_jwt) and the ANTHROPIC_API_KEY secret.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Anthropic from "npm:@anthropic-ai/sdk";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const MEDIA_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const CATEGORIES = ["stay", "food", "transport", "activities", "shopping", "other"];

const SCHEMA = {
  type: "object",
  properties: {
    merchant: { type: ["string", "null"] },
    date: { type: ["string", "null"], description: "YYYY-MM-DD" },
    total: { type: ["number", "null"] },
    currency: { type: ["string", "null"], description: "ISO 4217 code" },
    category: { type: "string", enum: CATEGORIES },
  },
  required: ["merchant", "date", "total", "currency", "category"],
  additionalProperties: false,
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) return json({ error: "not_configured", message: "ANTHROPIC_API_KEY secret is not set." }, 503);

  let body: { image?: string; mediaType?: string; destination?: string; start?: string; end?: string };
  try { body = await req.json(); } catch { return json({ error: "bad_request", message: "Send JSON." }, 400); }
  const { image, mediaType = "image/jpeg", destination = "", start = "", end = "" } = body;
  if (!image || typeof image !== "string") return json({ error: "bad_request", message: "image (base64) is required." }, 400);
  if (!MEDIA_TYPES.includes(mediaType)) return json({ error: "bad_request", message: "Unsupported image type." }, 400);
  if (image.length > 7_000_000) return json({ error: "too_large", message: "Image is too large; send under 5 MB." }, 413);

  const client = new Anthropic({ apiKey });
  const prompt = `This is a photo of a receipt from a trip to ${String(destination).slice(0, 120)} (${start} to ${end}).
Extract:
- merchant: the shop or restaurant name, short
- date: purchase date as YYYY-MM-DD, or null if not printed
- total: the final amount paid, including tax and service charge, as a plain number
- currency: ISO 4217 code. Infer from symbols, language and the destination (¥ in Japan is JPY, RM is MYR, S$ is SGD, ₩ is KRW)
- category: the best fit of stay, food, transport, activities, shopping, other
Use null for anything you cannot read.`;

  try {
    const response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 2000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: image } },
          { type: "text", text: prompt },
        ],
      }],
    } as never);
    // deno-lint-ignore no-explicit-any
    const r = response as any;
    if (r.stop_reason === "refusal") return json({ error: "refused", message: "The receipt couldn't be read." }, 422);
    const text = (r.content || []).filter((b: { type: string }) => b.type === "text").map((b: { text: string }) => b.text).join("");
    return json(JSON.parse(text));
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) return json({ error: "rate_limited", message: "Too many scans right now." }, 429);
    if (e instanceof Anthropic.AuthenticationError) return json({ error: "not_configured", message: "The Anthropic API key was rejected." }, 503);
    if (e instanceof Anthropic.BadRequestError) return json({ error: "bad_request", message: e.message }, 400);
    if (e instanceof SyntaxError) return json({ error: "unreadable", message: "The receipt wasn't readable." }, 422);
    console.error(e);
    return json({ error: "upstream_error", message: "Receipt reading failed. Try again." }, 502);
  }
});
