import nodemailer from "nodemailer";

// Sends FROM your Gmail TO the user directly — no domain needed
function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("GMAIL_USER or GMAIL_APP_PASSWORD is not set in environment variables.");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

const FROM_NAME = "GovLogix <harsh.shrivastav911@gmail.com>";

/* ── LSP Registration Confirmation ── */
export async function sendLSPRegistrationEmail(to: string, name: string, refId: string) {
  return getTransporter().sendMail({
    from: FROM_NAME,
    to,
    subject: "✅ LSP Application Submitted — GovLogix",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:580px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);padding:40px 40px 32px;text-align:center;">
      <div style="display:inline-block;background:#1a56db;color:#fff;font-weight:800;font-size:18px;padding:10px 22px;border-radius:10px;letter-spacing:-0.3px;margin-bottom:20px;">
        🇮🇳 GovLogix
      </div>
      <div style="width:64px;height:64px;background:rgba(16,185,129,0.15);border:2px solid rgba(16,185,129,0.4);border-radius:50%;margin:0 auto 16px;line-height:64px;text-align:center;font-size:28px;">✅</div>
      <h1 style="color:#f9fafb;font-size:22px;font-weight:700;margin:0 0 8px;">Application Submitted!</h1>
      <p style="color:#94a3b8;font-size:14px;margin:0;">Your registration is under review</p>
    </div>

    <!-- Body -->
    <div style="padding:36px 40px;">
      <p style="color:#1e293b;font-size:16px;margin:0 0 8px;">Dear <strong>${name}</strong>,</p>
      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 24px;">
        Thank you for registering as a Logistics Service Provider on <strong>GovLogix</strong> — India's premier government logistics management platform. Your application has been received and is currently under review by our team.
      </p>

      <!-- Reference ID -->
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #1a56db;border-radius:8px;padding:20px 24px;margin-bottom:24px;">
        <div style="font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">Reference ID</div>
        <div style="font-family:'Courier New',monospace;font-size:15px;font-weight:700;color:#1a56db;letter-spacing:0.04em;">${refId}</div>
        <div style="font-size:12px;color:#94a3b8;margin-top:6px;">Keep this safe — use it to track your application status</div>
      </div>

      <!-- Timeline -->
      <div style="margin-bottom:28px;">
        <div style="font-size:13px;font-weight:600;color:#1e293b;margin-bottom:14px;">What happens next?</div>
        <div style="display:flex;gap:14px;margin-bottom:14px;align-items:flex-start;">
          <div style="width:36px;height:36px;background:#f1f5f9;border-radius:50%;text-align:center;line-height:36px;font-size:16px;flex-shrink:0;">🔍</div>
          <div><div style="font-size:13px;font-weight:600;color:#1e293b;">Application Review</div><div style="font-size:12px;color:#64748b;margin-top:2px;">Our team verifies your GST, PAN and company details</div></div>
        </div>
        <div style="display:flex;gap:14px;margin-bottom:14px;align-items:flex-start;">
          <div style="width:36px;height:36px;background:#f1f5f9;border-radius:50%;text-align:center;line-height:36px;font-size:16px;flex-shrink:0;">⏱️</div>
          <div><div style="font-size:13px;font-weight:600;color:#1e293b;">Decision in 48 Hours</div><div style="font-size:12px;color:#64748b;margin-top:2px;">You will be notified once a decision is made</div></div>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <div style="width:36px;height:36px;background:#f1f5f9;border-radius:50%;text-align:center;line-height:36px;font-size:16px;flex-shrink:0;">🚀</div>
          <div><div style="font-size:13px;font-weight:600;color:#1e293b;">Start Listing</div><div style="font-size:12px;color:#64748b;margin-top:2px;">Once approved, list containers and receive bookings</div></div>
        </div>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin-bottom:28px;">
        <a href="https://govlogix.vercel.app/lsp/dashboard" style="display:inline-block;background:linear-gradient(135deg,#1a56db,#2563eb);color:#fff;font-weight:600;font-size:14px;padding:13px 32px;border-radius:10px;text-decoration:none;box-shadow:0 4px 12px rgba(26,86,219,0.3);">
          Track Application Status →
        </a>
      </div>

      <!-- Summary -->
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:18px 20px;">
        <div style="font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;">Registration Summary</div>
        <div style="display:flex;justify-content:space-between;font-size:13px;padding:5px 0;border-bottom:1px solid #f1f5f9;">
          <span style="color:#64748b;">Email</span><span style="color:#1e293b;font-weight:500;">${to}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;padding:5px 0;">
          <span style="color:#64748b;">Submitted</span><span style="color:#1e293b;font-weight:500;">${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
      <p style="color:#94a3b8;font-size:12px;margin:0 0 4px;">Ministry of Logistics &amp; Supply Chain · GovLogix Platform</p>
      <p style="color:#cbd5e1;font-size:11px;margin:0;">This is an automated message. Please do not reply directly to this email.</p>
    </div>
  </div>
</body>
</html>`,
  });
}

/* ── LSP Approved ── */
export async function sendLSPApprovedEmail(to: string, companyName: string) {
  return getTransporter().sendMail({
    from: FROM_NAME,
    to,
    subject: "🎉 Your LSP Application is Approved — GovLogix",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:580px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <div style="background:linear-gradient(135deg,#064e3b 0%,#065f46 100%);padding:40px 40px 32px;text-align:center;">
      <div style="display:inline-block;background:#1a56db;color:#fff;font-weight:800;font-size:18px;padding:10px 22px;border-radius:10px;margin-bottom:20px;">🇮🇳 GovLogix</div>
      <div style="font-size:48px;margin-bottom:12px;">🎉</div>
      <h1 style="color:#f9fafb;font-size:24px;font-weight:700;margin:0 0 8px;">Application Approved!</h1>
      <p style="color:#6ee7b7;font-size:14px;margin:0;">You are now a verified LSP on GovLogix</p>
    </div>

    <div style="padding:36px 40px;">
      <p style="color:#1e293b;font-size:16px;margin:0 0 8px;">Dear <strong>${companyName}</strong>,</p>
      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 24px;">
        Congratulations! Your LSP registration has been <strong style="color:#059669;">approved</strong> by the GovLogix admin team. You are now a verified Logistics Service Provider on India's premier government logistics platform.
      </p>

      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px 24px;margin-bottom:24px;text-align:center;">
        <div style="font-size:32px;margin-bottom:8px;">✅</div>
        <div style="font-size:16px;font-weight:700;color:#059669;">Account Verified &amp; Active</div>
        <div style="font-size:12px;color:#6b7280;margin-top:4px;">${to}</div>
      </div>

      <div style="margin-bottom:28px;">
        <div style="font-size:13px;font-weight:600;color:#1e293b;margin-bottom:14px;">You can now:</div>
        <div style="display:flex;gap:14px;margin-bottom:12px;align-items:flex-start;">
          <div style="width:36px;height:36px;background:#f0fdf4;border-radius:50%;text-align:center;line-height:36px;font-size:16px;flex-shrink:0;">📦</div>
          <div><div style="font-size:13px;font-weight:600;color:#1e293b;">List Containers</div><div style="font-size:12px;color:#64748b;margin-top:2px;">Add your container spaces and set pricing</div></div>
        </div>
        <div style="display:flex;gap:14px;margin-bottom:12px;align-items:flex-start;">
          <div style="width:36px;height:36px;background:#f0fdf4;border-radius:50%;text-align:center;line-height:36px;font-size:16px;flex-shrink:0;">📋</div>
          <div><div style="font-size:13px;font-weight:600;color:#1e293b;">Receive Bookings</div><div style="font-size:12px;color:#64748b;margin-top:2px;">Accept bookings from customers across India</div></div>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <div style="width:36px;height:36px;background:#f0fdf4;border-radius:50%;text-align:center;line-height:36px;font-size:16px;flex-shrink:0;">💰</div>
          <div><div style="font-size:13px;font-weight:600;color:#1e293b;">Track Revenue</div><div style="font-size:12px;color:#64748b;margin-top:2px;">Monitor earnings from your LSP dashboard</div></div>
        </div>
      </div>

      <div style="text-align:center;">
        <a href="https://govlogix.vercel.app/lsp/dashboard" style="display:inline-block;background:linear-gradient(135deg,#059669,#047857);color:#fff;font-weight:600;font-size:14px;padding:13px 32px;border-radius:10px;text-decoration:none;box-shadow:0 4px 12px rgba(5,150,105,0.3);">
          Go to LSP Dashboard →
        </a>
      </div>
    </div>

    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
      <p style="color:#94a3b8;font-size:12px;margin:0 0 4px;">Ministry of Logistics &amp; Supply Chain · GovLogix Platform</p>
      <p style="color:#cbd5e1;font-size:11px;margin:0;">This is an automated message. Please do not reply directly to this email.</p>
    </div>
  </div>
</body>
</html>`,
  });
}

/* ── LSP Rejected ── */
export async function sendLSPRejectedEmail(to: string, companyName: string, reason?: string) {
  return getTransporter().sendMail({
    from: FROM_NAME,
    to,
    subject: "❌ LSP Application Not Approved — GovLogix",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:580px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <div style="background:linear-gradient(135deg,#1e293b 0%,#374151 100%);padding:40px 40px 32px;text-align:center;">
      <div style="display:inline-block;background:#1a56db;color:#fff;font-weight:800;font-size:18px;padding:10px 22px;border-radius:10px;margin-bottom:20px;">🇮🇳 GovLogix</div>
      <div style="font-size:48px;margin-bottom:12px;">❌</div>
      <h1 style="color:#f9fafb;font-size:22px;font-weight:700;margin:0 0 8px;">Application Not Approved</h1>
      <p style="color:#9ca3af;font-size:14px;margin:0;">We were unable to approve your application at this time</p>
    </div>

    <div style="padding:36px 40px;">
      <p style="color:#1e293b;font-size:16px;margin:0 0 8px;">Dear <strong>${companyName}</strong>,</p>
      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 24px;">
        After carefully reviewing your LSP registration application, we are unable to approve it at this time.
      </p>
      ${reason ? `
      <div style="background:#fef2f2;border:1px solid #fecaca;border-left:4px solid #ef4444;border-radius:8px;padding:18px 20px;margin-bottom:24px;">
        <div style="font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">Reason for Rejection</div>
        <div style="font-size:14px;color:#dc2626;">${reason}</div>
      </div>` : ""}
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:18px 20px;margin-bottom:24px;">
        <div style="font-size:13px;font-weight:600;color:#1e293b;margin-bottom:8px;">What can you do?</div>
        <ul style="color:#475569;font-size:13px;line-height:1.8;margin:0;padding-left:18px;">
          <li>Review and correct the information provided</li>
          <li>Ensure your GST and PAN details are accurate</li>
          <li>Contact support if you believe this is an error</li>
          <li>Reapply with updated information</li>
        </ul>
      </div>
      <div style="text-align:center;">
        <a href="https://govlogix.vercel.app/lsp/register" style="display:inline-block;background:linear-gradient(135deg,#1a56db,#2563eb);color:#fff;font-weight:600;font-size:14px;padding:13px 32px;border-radius:10px;text-decoration:none;">
          Reapply Now →
        </a>
      </div>
    </div>

    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
      <p style="color:#94a3b8;font-size:12px;margin:0 0 4px;">Ministry of Logistics &amp; Supply Chain · GovLogix Platform</p>
      <p style="color:#cbd5e1;font-size:11px;margin:0;">This is an automated message. Please do not reply directly to this email.</p>
    </div>
  </div>
</body>
</html>`,
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

  return getTransporter().sendMail({
    from: FROM_NAME,
    to,
    subject: "📦 Booking Confirmed — GovLogix",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:580px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <div style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);padding:40px 40px 32px;text-align:center;">
      <div style="display:inline-block;background:#1a56db;color:#fff;font-weight:800;font-size:18px;padding:10px 22px;border-radius:10px;margin-bottom:20px;">🇮🇳 GovLogix</div>
      <div style="font-size:48px;margin-bottom:12px;">🎉</div>
      <h1 style="color:#f9fafb;font-size:24px;font-weight:700;margin:0 0 8px;">Booking Confirmed!</h1>
      <p style="color:#93c5fd;font-size:14px;margin:0;">Payment received · Container reserved</p>
    </div>

    <div style="padding:36px 40px;">
      <p style="color:#1e293b;font-size:16px;margin:0 0 8px;">Dear <strong>${bookerName}</strong>,</p>
      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 24px;">
        Your payment was successful and your container booking is now confirmed.
      </p>

      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:24px;">
        <div style="background:#1e293b;padding:12px 20px;">
          <div style="font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">Booking Details</div>
        </div>
        <div style="padding:4px 0;">
          <div style="display:flex;justify-content:space-between;padding:10px 20px;border-bottom:1px solid #f1f5f9;font-size:13px;"><span style="color:#64748b;">Container</span><span style="color:#1e293b;font-weight:500;">${containerName}</span></div>
          <div style="display:flex;justify-content:space-between;padding:10px 20px;border-bottom:1px solid #f1f5f9;font-size:13px;"><span style="color:#64748b;">Location</span><span style="color:#1e293b;font-weight:500;">${city}</span></div>
          <div style="display:flex;justify-content:space-between;padding:10px 20px;border-bottom:1px solid #f1f5f9;font-size:13px;"><span style="color:#64748b;">Start Date</span><span style="color:#1e293b;font-weight:500;">${fmt(startDate)}</span></div>
          <div style="display:flex;justify-content:space-between;padding:10px 20px;border-bottom:1px solid #f1f5f9;font-size:13px;"><span style="color:#64748b;">End Date</span><span style="color:#1e293b;font-weight:500;">${fmt(endDate)}</span></div>
          <div style="display:flex;justify-content:space-between;padding:14px 20px;font-size:15px;"><span style="color:#1e293b;font-weight:700;">Total Paid</span><span style="color:#1a56db;font-weight:800;">₹${totalAmount.toLocaleString("en-IN")}</span></div>
        </div>
      </div>

      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-left:4px solid #1a56db;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
        <div style="font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">Booking ID</div>
        <div style="font-family:'Courier New',monospace;font-size:13px;font-weight:700;color:#1a56db;">${bookingId}</div>
      </div>

      <div style="text-align:center;">
        <a href="https://govlogix.vercel.app/booking/${bookingId}" style="display:inline-block;background:linear-gradient(135deg,#1a56db,#2563eb);color:#fff;font-weight:600;font-size:14px;padding:13px 32px;border-radius:10px;text-decoration:none;box-shadow:0 4px 12px rgba(26,86,219,0.3);">
          View Booking Details →
        </a>
      </div>
    </div>

    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
      <p style="color:#94a3b8;font-size:12px;margin:0 0 4px;">Ministry of Logistics &amp; Supply Chain · GovLogix Platform</p>
      <p style="color:#cbd5e1;font-size:11px;margin:0;">This is an automated message. Please do not reply directly to this email.</p>
    </div>
  </div>
</body>
</html>`,
  });
}
