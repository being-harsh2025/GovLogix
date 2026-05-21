import { NextRequest } from "next/server";
import { Resend } from "resend";

// Quick diagnostic route — remove after confirming email works
export async function GET(request: NextRequest) {
  const key = process.env.RESEND_API_KEY;
  const to = new URL(request.url).searchParams.get("to") || "harsh.shrivastav911@gmail.com";

  if (!key) {
    return Response.json({
      ok: false,
      error: "RESEND_API_KEY is not set in environment. Restart the dev server after adding it to .env",
    }, { status: 500 });
  }

  const resend = new Resend(key);

  try {
    const result = await resend.emails.send({
      from: "GovLogix <onboarding@resend.dev>",
      to,
      subject: "✅ GovLogix Email Test",
      html: `<p>This is a test email from GovLogix. If you received this, Resend is working correctly.</p><p>Key prefix: <code>${key.slice(0, 8)}…</code></p>`,
    });

    if (result.error) {
      return Response.json({ ok: false, error: result.error }, { status: 500 });
    }

    return Response.json({ ok: true, emailId: result.data?.id, sentTo: to });
  } catch (err: any) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
