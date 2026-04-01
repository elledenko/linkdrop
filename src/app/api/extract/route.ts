import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { extractFromUrl } from "@/lib/extractor";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url } = await request.json();

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const extracted = await extractFromUrl(url);
    return NextResponse.json({
      title: extracted.title,
      content: extracted.content,
      description: extracted.description,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to extract content" },
      { status: 500 }
    );
  }
}
