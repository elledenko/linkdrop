export interface Profile {
  id: string;
  display_name: string | null;
  bio: string | null;
  voice_description: string | null;
  timezone: string;
  digest_hour: number;
  digest_enabled: boolean;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface WritingSample {
  id: string;
  user_id: string;
  content: string;
  source: string | null;
  created_at: string;
}

export interface Link {
  id: string;
  user_id: string;
  url: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  site_name: string | null;
  extracted_content: string | null;
  ai_summary: string | null;
  user_note: string | null;
  link_date: string;
  status: "pending" | "summarized" | "failed";
  created_at: string;
  updated_at: string;
}

export interface Upload {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  file_size: number | null;
  storage_path: string;
  public_url: string | null;
  user_note: string | null;
  upload_date: string;
  created_at: string;
}

export interface Digest {
  id: string;
  user_id: string;
  digest_date: string;
  title: string | null;
  content: string;
  slug: string;
  link_count: number;
  upload_count: number;
  is_published: boolean;
  export_linkedin: string | null;
  export_x: string | null;
  export_medium: string | null;
  export_substack: string | null;
  created_at: string;
  updated_at: string;
}
