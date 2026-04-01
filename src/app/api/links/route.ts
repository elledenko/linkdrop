import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url, user_note, date } = await request.json();

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Insert the link
  const { data: link, error } = await supabase
    .from("links")
    .insert({
      user_id: user.id,
      url,
      user_note: user_note || null,
      link_date: date || new Date().toISOString().split("T")[0],
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Trigger summarization in the background
  const origin = request.headers.get("origin") || request.headers.get("host");
  const protocol = origin?.startsWith("localhost") ? "http" : "https";
  const baseUrl = origin?.startsWith("http") ? origin : `${protocol}://${origin}`;

  fetch(`${baseUrl}/api/summarize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: request.headers.get("cookie") || "",
    },
    body: JSON.stringify({ linkId: link.id, url }),
  }).catch(() => {
    // Fire and forget — summarization happens in background
  });

  return NextResponse.json(link);
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  let query = supabase
    .from("links")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (date) {
    query = query.eq("link_date", date);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
