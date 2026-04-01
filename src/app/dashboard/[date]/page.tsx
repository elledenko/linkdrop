import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { format, isToday, parseISO } from "date-fns";
import { DayView } from "@/components/day-view";

export default async function DatePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user.id)
    .eq("link_date", date)
    .order("created_at", { ascending: false });

  const { data: uploads } = await supabase
    .from("uploads")
    .select("*")
    .eq("user_id", user.id)
    .eq("upload_date", date)
    .order("created_at", { ascending: false });

  const { data: digest } = await supabase
    .from("digests")
    .select("*")
    .eq("user_id", user.id)
    .eq("digest_date", date)
    .single();

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone, digest_hour")
    .eq("id", user.id)
    .single();

  return (
    <DayView
      date={date}
      links={links || []}
      uploads={uploads || []}
      digest={digest}
      profile={profile}
      isToday={isToday(parseISO(date))}
    />
  );
}
