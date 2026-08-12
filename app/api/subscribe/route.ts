import { NextResponse } from "next/server";

export const runtime = "edge";

/**
 * Early-access sign-ups.
 *
 * There is deliberately no silent success path. If no destination is
 * configured the route reports that plainly and the form falls back to
 * opening a mail draft, so an address is never accepted and then lost.
 *
 * Configure ONE of these in the Vercel project's environment variables:
 *   SUBSCRIBE_WEBHOOK_URL  any endpoint that accepts {email, source, ts}
 *   RESEND_API_KEY + NOTIFY_EMAIL   emails each sign-up to you
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Small in-memory throttle. Per-instance only — a determined script gets
// around it. Real abuse protection belongs at the edge (Vercel WAF).
const seen = new Map<string, { n: number; t: number }>();
const WINDOW = 60_000;
const LIMIT = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const rec = seen.get(ip);
  if (!rec || now - rec.t > WINDOW) {
    seen.set(ip, { n: 1, t: now });
    return false;
  }
  rec.n += 1;
  return rec.n > LIMIT;
}

export async function POST(req: Request) {
  let email = "";
  let hp = "";

  try {
    const body = (await req.json()) as { email?: unknown; company?: unknown };
    email = typeof body.email === "string" ? body.email.trim() : "";
    hp = typeof body.company === "string" ? body.company : "";
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-request" }, { status: 400 });
  }

  // Honeypot: a hidden field only a bot fills in. Accept and discard.
  if (hp) return NextResponse.json({ ok: true });

  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, reason: "invalid-email" }, { status: 422 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  }

  const payload = { email, source: "kemist.in", ts: new Date().toISOString() };

  const webhook = process.env.SUBSCRIBE_WEBHOOK_URL;
  if (webhook) {
    try {
      const r = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(String(r.status));
      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json({ ok: false, reason: "store-failed" }, { status: 502 });
    }
  }

  const resend = process.env.RESEND_API_KEY;
  const notify = process.env.NOTIFY_EMAIL;
  if (resend && notify) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resend}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Kemist <onboarding@resend.dev>",
          to: [notify],
          subject: "Kemist early access — new sign-up",
          text: `${email}\n\nReceived ${payload.ts}`,
          reply_to: email,
        }),
      });
      if (!r.ok) throw new Error(String(r.status));
      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json({ ok: false, reason: "store-failed" }, { status: 502 });
    }
  }

  // Nothing configured. Say so rather than pretending the address was kept.
  return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 501 });
}
