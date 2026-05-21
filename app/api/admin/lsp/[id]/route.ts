import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { sendLSPApprovedEmail, sendLSPRejectedEmail } from "@/lib/email";

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/admin/lsp/[id]">
) {
  try {
    const { id } = await ctx.params;
    const { status, rejectionNote } = await request.json();

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    const lsp = await prisma.lSP.update({
      where: { id },
      data: {
        status,
        rejectionNote: status === "REJECTED" ? (rejectionNote || "") : null,
      },
    });

    // Send email notification (non-blocking — don't fail the request if email fails)
    try {
      if (status === "APPROVED") {
        await sendLSPApprovedEmail(lsp.email, lsp.companyName);
      } else if (status === "REJECTED") {
        await sendLSPRejectedEmail(lsp.email, lsp.companyName, rejectionNote);
      }
    } catch (emailErr) {
      console.error("[Admin LSP PATCH] Email send failed:", emailErr);
    }

    return Response.json(lsp);
  } catch (err) {
    console.error("[Admin LSP PATCH]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/admin/lsp/[id]">
) {
  try {
    const { id } = await ctx.params;
    const lsp = await prisma.lSP.findUnique({
      where: { id },
      include: { containers: true },
    });
    if (!lsp) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(lsp);
  } catch (err) {
    console.error("[Admin LSP GET]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
