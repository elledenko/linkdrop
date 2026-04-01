import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { extractFromUrl } from "@/lib/extractor";
import { summarizeContent } from "@/lib/claude";

export const maxDuration = 60;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { linkId, url } = await request.json();

  try {
    // Extract content from URL
    const extracted = await extractFromUrl(url);

    // Update link with extracted metadata
    await supabase
      .from("links")
      .update({
        title: extracted.title,
        description: extracted.description,
        image_url: extracted.image,
        site_name: extracted.source,
        extracted_content: extracted.content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", linkId)
      .eq("user_id", user.id);

    // Generate AI summary if we have content
    if (extracted.content || extracted.description) {
      const contentToSummarize =
        extracted.content || extracted.description || "";
      const summary = await summarizeContent(
        extracted.title || url,
        contentToSummarize
      );

      await supabase
        .from("links")
        .update({
          ai_summary: summary,
          status: "summarized",
          updated_at: new Date().toISOString(),
        })
        .eq("id", linkId)
        .eq("user_id", user.id);

      return NextResponse.json({ success: true, summary });
    } else {
      // No content to summarize — mark as summarized with just metadata
      await supabase
        .from("links")
        .update({
          status: "summarized",
          updated_at: new Date().toISOString(),
        })
        .eq("id", linkId)
        .eq("user_id", user.id);

      return NextResponse.json({ success: true, summary: null });
    }
  } catch (err) {
    // Mark as failed
    await supabase
      .from("links")
      .update({
        status: "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", linkId)
      .eq("user_id", user.id);

    return NextResponse.json(
      { error: "Failed to summarize" },
      { status: 500 }
    );
  }
}
