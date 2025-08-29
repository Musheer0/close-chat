import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook, WebhookEvent } from "@clerk/nextjs/webhooks";
import prisma from "@/prisma";

export const GET = async () => {
  return NextResponse.json({ message: "Webhook endpoint alive" });
};

export const POST = async (req: NextRequest) => {
  let wh: WebhookEvent;

  try {
    wh = await verifyWebhook(req, { signingSecret: process.env.CLER_WH! });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  if (!wh) {
    return NextResponse.json({ error: "No webhook data" }, { status: 400 });
  }

  try {
    if (wh.type === "user.created") {
      const { id, username, primary_email_address_id, email_addresses, image_url } = wh.data;
      const primaryEmail = email_addresses?.find((e) => e.id === primary_email_address_id)?.email_address;
      if (!primaryEmail) {
        return NextResponse.json({ error: "No primary email found" }, { status: 400 });
      }

      await prisma.user.create({
        data: {
          id,
          username: username || primaryEmail.split("@")[0],
          email: primaryEmail,
          image: image_url,
        },
      });

      return NextResponse.json({ success: true });
    }

    if (wh.type === "user.updated") {
      const { id, username, primary_email_address_id, email_addresses, image_url } = wh.data;
      const primaryEmail = email_addresses?.find((e) => e.id === primary_email_address_id)?.email_address;
      if (!primaryEmail) {
        return NextResponse.json({ error: "No primary email found" }, { status: 400 });
      }

      await prisma.user.update({
        where: { id },
        data: {
          username: username || primaryEmail.split("@")[0],
          email: primaryEmail,
          image: image_url,
        },
      });

      return NextResponse.json({ success: true });
    }

    // Unhandled events
    console.log("Unhandled event type:", wh.type);
    return NextResponse.json({ message: "Event type not handled", type: wh.type });
  } catch (err) {
    console.error("DB operation failed:", err);
    return NextResponse.json({ error: "Database operation failed" }, { status: 500 });
  }
};
