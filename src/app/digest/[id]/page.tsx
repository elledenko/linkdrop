import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DigestView } from "@/components/digest-view";

export default async function DigestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: digest } = await supabase
    .from("digests")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!digest) redirect("/dashboard");

  return <DigestView digest={digest} isPublic={false} />;
}
