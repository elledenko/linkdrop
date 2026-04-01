import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(request: Request) {
  // Parse Twilio's form-encoded body
  const formData = await request.formData();
  const body = formData.get("Body") as string;
  const from = formData.get("From") as string;

  if (!body || !from) {
    return new Response("<Response><Message>Invalid request</Message></Response>", {
      headers: { "Content-Type": "text/xml" },
    });
  }

  // Validate Twilio signature
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (authToken) {
    const signature = request.headers.get("x-twilio-signature") || "";
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL ? request.url : request.url}`;

    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value as string;
    });

    const isValid = twilio.validateRequest(authToken, signature, request.url, params);
    if (!isValid) {
      return new Response("<Response><Message>Unauthorized</Message></Response>", {
        status: 403,
        headers: { "Content-Type": "text/xml" },
      });
    }
  }

  // Look up user by phone number
  const supabase = await createAdminClient();

  // Normalize phone number (Twilio sends +1XXXXXXXXXX format)
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, sms_enabled")
    .eq("phone_number", from)
    .single();

  if (!profile) {
    return twiml("Hey! This number isn't linked to a LinkDrop account. Add your phone number in Settings to start texting links.");
  }

  if (!profile.sms_enabled) {
    return twiml("SMS is disabled for your account. Enable it in LinkDrop Settings.");
  }

  // Extract URLs from message body
  const urlRegex = /https?:\/\/[^\s]+/gi;
  const urls = body.match(urlRegex) || [];

  if (urls.length === 0) {
    return twiml("No links found in your message. Text a URL to save it to today's drop!");
  }

  // Everything that's not a URL becomes the user note
  let noteText = body;
  urls.forEach((url) => {
    noteText = noteText.replace(url, "").trim();
  });
  const userNote: string | null = noteText.replace(/\s+/g, " ").trim() || null;

  const today = new Date().toISOString().split("T")[0];

  // Save each URL as a link
  for (const url of urls) {
    const { data: link, error } = await supabase
      .from("links")
      .insert({
        user_id: profile.id,
        url: url.trim(),
        user_note: userNote,
        link_date: today,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to save link via SMS:", error);
      continue;
    }

    // Trigger summarization with service role auth
    const appUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://linkdrop-inky.vercel.app";
    fetch(`${appUrl}/api/summarize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ linkId: link.id, url: url.trim(), userId: profile.id }),
    }).catch(() => {});
  }

  // Count total links today
  const { count } = await supabase
    .from("links")
    .select("*", { count: "exact", head: true })
    .eq("user_id", profile.id)
    .eq("link_date", today);

  const linkWord = urls.length === 1 ? "link" : "links";
  const msg = `Saved ${urls.length} ${linkWord}! You've got ${count} in today's drop.`;

  return twiml(msg);
}

function twiml(message: string) {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(message)}</Message></Response>`,
    { headers: { "Content-Type": "text/xml" } }
  );
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
