import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { DayView } from "@/components/day-view";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const today = format(new Date(), "yyyy-MM-dd");

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user.id)
    .eq("link_date", today)
    .order("created_at", { ascending: false });

  const { data: uploads } = await supabase
    .from("uploads")
    .select("*")
    .eq("user_id", user.id)
    .eq("upload_date", today)
    .order("created_at", { ascending: false });

  const { data: digest } = await supabase
    .from("digests")
    .select("*")
    .eq("user_id", user.id)
    .eq("digest_date", today)
    .single();

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone, digest_hour")
    .eq("id", user.id)
    .single();

  return (
    <DayView
      date={today}
      links={links || []}
      uploads={uploads || []}
      digest={digest}
      profile={profile}
      isToday={true}
    />
  );
}
