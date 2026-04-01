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

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const date = (formData.get("date") as string) || new Date().toISOString().split("T")[0];
  const userNote = formData.get("user_note") as string | null;

  if (!file) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  // Upload to Supabase Storage
  const fileName = `${Date.now()}-${file.name}`;
  const storagePath = `${user.id}/uploads/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("user-content")
    .upload(storagePath, file, {
      contentType: file.type,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: uploadError.message },
      { status: 500 }
    );
  }

  // Get public URL for images
  let publicUrl: string | null = null;
  if (file.type.startsWith("image/")) {
    const { data: urlData } = supabase.storage
      .from("user-content")
      .getPublicUrl(storagePath);
    publicUrl = urlData.publicUrl;
  }

  // Create upload record
  const { data, error } = await supabase
    .from("uploads")
    .insert({
      user_id: user.id,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      storage_path: storagePath,
      public_url: publicUrl,
      user_note: userNote,
      upload_date: date,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
