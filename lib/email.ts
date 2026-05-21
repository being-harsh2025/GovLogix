import { Resend } from "resend";

const FROM = "GovLogix <onboarding@resend.dev>";

// All emails are routed to this address until a custom domain is verified on Resend.
// The actual registrant's email is shown in the subject and body.
const ADMIN_EMAIL = "harsh.rtx911@gmail.com";

// Lazy initializer — only throws at call time, not at module load/build time
function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY is not set in environment variables.");
  }
  return new Resend(key);
}

/* ── LSP Registration Confirmation ── */
export async function sendLSPRegistrationEmail(to: string, name: string, refId: string) {
  return getResend().emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `✅ [${to}] LSP Application Submitted — GovLogix`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0a1628;color:#f9fafb;padding:32px;border-radius:12px;">
        <div style="background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.3);border-radius:8px;padding:10px 14px;margin-bottom:20px;font-size:0.8rem;color:#fbbf24;">
          📬 This notification is for: <strong>${to}</strong>
        </div>
        <div style="text-align:center;margin-bottom:24px;">
          <div style="display:inline-block;background:#1a56db;color:#fff;font-weight:800;font-size:1.2rem;padding:10px 20px;border-radius:8px;">GovLogix</div>
        </div>
        <h2 style="color:#fbbf24;margin-bottom:8px;">Application Submitted Successfully</h2>
        <p style="color:#d1d5db;line-height:1.7;">Dear <strong style="color:#f9fafb;">${name}</strong>,</p>
        <p style="color:#d1d5db;line-height:1.7;">
          Your LSP registration application has been received and is currently under review by our team.
          You will receive a decision within <strong style="color:#f9fafb;">48 hours</strong>.
        </p>
        <div style="background:#111827;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px;margin:20px 0;">
          <div style="font-size:0.8rem;color:#9ca3af;margin-bottom:4px;">Registered Email</div>
          <div style="font-weight:700;color:#93c5fd;margin-bottom:12px;">${to}</div>
          <div style="font-size:0.8rem;color:#9ca3af;margin-bottom:4px;">Reference ID</div>
          <div style="font-family:monospace;font-weight:700;color:#fbbf24;font-size:1rem;">${refId}</div>
        </div>
        <p style="color:#d1d5db;line-height:1.7;font-size:0.875rem;">
          Keep this reference ID safe. You can use it to track your application status.
        </p>
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;" />
        <p style="color:#6b7280;font-size:0.78rem;text-align:center;">
          Ministry of Logistics &amp; Supply Chain · GovLogix Platform<br/>
          This is an automated message. Please do not reply.
        </p>
      </div>
    `,
  });
}

/* ── LSP Approved ── */
export async function sendLSPApprovedEmail(to: string, companyName: string) {
  return getResend().emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `🎉 [${to}] LSP Application Approved — GovLogix`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0a1628;color:#f9fafb;padding:32px;border-radius:12px;">
        <div style="background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.3);border-radius:8px;padding:10px 14px;margin-bottom:20px;font-size:0.8rem;color:#fbbf24;">
          📬 This notification is for: <strong>${to}</strong>
        </div>
        <div style="text-align:center;margin-bottom:24px;">
          <div style="display:inline-block;background:#1a56db;color:#fff;font-weight:800;font-size:1.2rem;padding:10px 20px;border-radius:8px;">GovLogix</div>
        </div>
        <div style="text-align:center;font-size:3rem;margin-bottom:16px;">🎉</div>
        <h2 style="color:#34d399;margin-bottom:8px;text-align:center;">Application Approved!</h2>
        <p style="color:#d1d5db;line-height:1.7;">Dear <strong style="color:#f9fafb;">${companyName}</strong>,</p>
        <p style="color:#d1d5db;line-height:1.7;">
          Congratulations! Your LSP registration has been <strong style="color:#34d399;">approved</strong> by the GovLogix admin team.
          You are now a verified Logistics Service Provider on India's premier government logistics platform.
        </p>
        <div style="background:#111827;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px;margin:20px 0;">
          <div style="font-size:0.8rem;color:#9ca3af;margin-bottom:4px;">Registered Email</div>
          <div style="font-weight:700;color:#93c5fd;">${to}</div>
        </div>
        <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:8px;padding:16px;margin:20px 0;">
          <p style="color:#34d399;margin:0;font-weight:600;">✅ What they can do now:</p>
          <ul style="color:#d1d5db;margin:8px 0 0;padding-left:20px;line-height:1.8;">
            <li>List container spaces on the platform</li>
            <li>Receive and manage bookings</li>
            <li>Connect with logistics coordinators</li>
          </ul>
        </div>
        <div style="text-align:center;margin-top:24px;">
          <a href="https://govlogix.vercel.app/lsp/dashboard" style="display:inline-block;background:#1a56db;color:#fff;padding:12px 28px;border-radius:8px;font-weight:600;text-decoration:none;">
            Go to LSP Dashboard →
          </a>
        </div>
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;" />
        <p style="color:#6b7280;font-size:0.78rem;text-align:center;">
          Ministry of Logistics &amp; Supply Chain · GovLogix Platform
        </p>
      </div>
    `,
  });
}

/* ── LSP Rejected ── */
export async function sendLSPRejectedEmail(to: string, companyName: string, reason?: string) {
  return getResend().emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `❌ [${to}] LSP Application Rejected — GovLogix`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0a1628;color:#f9fafb;padding:32px;border-radius:12px;">
        <div style="background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.3);border-radius:8px;padding:10px 14px;margin-bottom:20px;font-size:0.8rem;color:#fbbf24;">
          📬 This notification is for: <strong>${to}</strong>
        </div>
        <div style="text-align:center;margin-bottom:24px;">
          <div style="display:inline-block;background:#1a56db;color:#fff;font-weight:800;font-size:1.2rem;padding:10px 20px;border-radius:8px;">GovLogix</div>
        </div>
        <h2 style="color:#f87171;margin-bottom:8px;">Application Not Approved</h2>
        <p style="color:#d1d5db;line-height:1.7;">Dear <strong style="color:#f9fafb;">${companyName}</strong>,</p>
        <p style="color:#d1d5db;line-height:1.7;">
          After reviewing the LSP registration application, we are unable to approve it at this time.
        </p>
        <div style="background:#111827;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px;margin:20px 0;">
          <div style="font-size:0.8rem;color:#9ca3af;margin-bottom:4px;">Registered Email</div>
          <div style="font-weight:700;color:#93c5fd;">${to}</div>
        </div>
        ${reason ? `
        <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:16px;margin:20px 0;">
          <div style="font-size:0.8rem;color:#9ca3af;margin-bottom:4px;">Rejection Reason</div>
          <div style="color:#f87171;">${reason}</div>
        </div>
        ` : ""}
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;" />
        <p style="color:#6b7280;font-size:0.78rem;text-align:center;">
          Ministry of Logistics &amp; Supply Chain · GovLogix Platform
        </p>
      </div>
    `,
  });
}

/* ── Booking Confirmation ── */
export async function sendBookingConfirmationEmail(
  to: string,
  bookerName: string,
  bookingId: string,
  containerName: string,
  city: string,
  startDate: string,
  endDate: string,
  totalAmount: number
) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  return getResend().emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `📦 [${to}] Booking Confirmed — GovLogix`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0a1628;color:#f9fafb;padding:32px;border-radius:12px;">
        <div style="background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.3);border-radius:8px;padding:10px 14px;margin-bottom:20px;font-size:0.8rem;color:#fbbf24;">
          📬 This notification is for: <strong>${to}</strong>
        </div>
        <div style="text-align:center;margin-bottom:24px;">
          <div style="display:inline-block;background:#1a56db;color:#fff;font-weight:800;font-size:1.2rem;padding:10px 20px;border-radius:8px;">GovLogix</div>
        </div>
        <div style="text-align:center;font-size:3rem;margin-bottom:16px;">🎉</div>
        <h2 style="color:#34d399;margin-bottom:8px;text-align:center;">Booking Confirmed!</h2>
        <p style="color:#d1d5db;line-height:1.7;">Dear <strong style="color:#f9fafb;">${bookerName}</strong>,</p>
        <p style="color:#d1d5db;line-height:1.7;">
          Payment was successful and the container booking is now confirmed.
        </p>
        <div style="background:#111827;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px;margin:20px 0;">
          <table style="width:100%;border-collapse:collapse;font-size:0.875rem;">
            <tr><td style="color:#9ca3af;padding:6px 0;">Booker Email</td><td style="color:#93c5fd;font-weight:600;text-align:right;">${to}</td></tr>
            <tr><td style="color:#9ca3af;padding:6px 0;">Container</td><td style="color:#f9fafb;font-weight:600;text-align:right;">${containerName}</td></tr>
            <tr><td style="color:#9ca3af;padding:6px 0;">Location</td><td style="color:#f9fafb;font-weight:600;text-align:right;">${city}</td></tr>
            <tr><td style="color:#9ca3af;padding:6px 0;">Start Date</td><td style="color:#f9fafb;font-weight:600;text-align:right;">${fmt(startDate)}</td></tr>
            <tr><td style="color:#9ca3af;padding:6px 0;">End Date</td><td style="color:#f9fafb;font-weight:600;text-align:right;">${fmt(endDate)}</td></tr>
            <tr style="border-top:1px solid rgba(255,255,255,0.08);">
              <td style="color:#f9fafb;font-weight:700;padding:10px 0 4px;">Total Paid</td>
              <td style="color:#fbbf24;font-weight:800;font-size:1.1rem;text-align:right;">₹${totalAmount.toLocaleString("en-IN")}</td>
            </tr>
          </table>
        </div>
        <div style="background:#111827;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:12px 16px;margin-bottom:20px;">
          <div style="font-size:0.78rem;color:#9ca3af;margin-bottom:4px;">Booking ID</div>
          <div style="font-family:monospace;font-weight:700;color:#fbbf24;font-size:0.9rem;">${bookingId}</div>
        </div>
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;" />
        <p style="color:#6b7280;font-size:0.78rem;text-align:center;">
          Ministry of Logistics &amp; Supply Chain · GovLogix Platform
        </p>
      </div>
    `,
  });
}
