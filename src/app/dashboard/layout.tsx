import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarding_complete) redirect("/onboarding");

  // Get dates with links
  const { data: linkDates } = await supabase
    .from("links")
    .select("link_date")
    .eq("user_id", user.id)
    .order("link_date", { ascending: false });

  // Get dates with digests
  const { data: digestDates } = await supabase
    .from("digests")
    .select("id, digest_date, title")
    .eq("user_id", user.id)
    .order("digest_date", { ascending: false });

  const uniqueDates = [
    ...new Set(linkDates?.map((l) => l.link_date) || []),
  ];

  return (
    <div className="min-h-screen bg-cream flex">
      <Sidebar
        dates={uniqueDates}
        digests={digestDates || []}
        profile={profile}
      />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
