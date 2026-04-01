import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generateDigest } from "@/lib/claude";
import { format } from "date-fns";

export const maxDuration = 120;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { date } = await request.json();
  const targetDate = date || format(new Date(), "yyyy-MM-dd");

  // Check if digest already exists
  const { data: existing } = await supabase
    .from("digests")
    .select("id")
    .eq("user_id", user.id)
    .eq("digest_date", targetDate)
    .single();

  if (existing) {
    // Delete existing to regenerate
    await supabase
      .from("digests")
      .delete()
      .eq("id", existing.id)
      .eq("user_id", user.id);
  }

  // Fetch links for this date
  const { data: links } = await supabase
    .from("links")
    .select("title, url, ai_summary, user_note, site_name")
    .eq("user_id", user.id)
    .eq("link_date", targetDate)
    .order("created_at", { ascending: true });

  // Fetch uploads for this date
  const { data: uploads } = await supabase
    .from("uploads")
    .select("file_name, user_note")
    .eq("user_id", user.id)
    .eq("upload_date", targetDate);

  if ((!links || links.length === 0) && (!uploads || uploads.length === 0)) {
    return NextResponse.json(
      { error: "No links or uploads to digest" },
      { status: 400 }
    );
  }

  // Fetch voice profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("bio, voice_description, display_name")
    .eq("id", user.id)
    .single();

  // Fetch writing samples
  const { data: samples } = await supabase
    .from("writing_samples")
    .select("content")
    .eq("user_id", user.id);

  // Generate digest
  const result = await generateDigest(
    links || [],
    uploads || [],
    {
      bio: profile?.bio || null,
      voice_description: profile?.voice_description || null,
      writing_samples: samples?.map((s) => s.content) || [],
    },
    targetDate
  );

  // Create slug
  const displayName = profile?.display_name || "user";
  const slug = `${displayName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${targetDate}`;

  // Save digest
  const { data: digest, error } = await supabase
    .from("digests")
    .insert({
      user_id: user.id,
      digest_date: targetDate,
      title: result.title,
      content: result.content,
      slug,
      link_count: links?.length || 0,
      upload_count: uploads?.length || 0,
      export_linkedin: result.export_linkedin,
      export_x: result.export_x,
      export_medium: result.export_medium,
      export_substack: result.export_substack,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(digest);
}
