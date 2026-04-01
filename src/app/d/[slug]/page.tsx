import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { DigestView } from "@/components/digest-view";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: digest } = await supabase
    .from("digests")
    .select("title, content")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!digest) return { title: "LinkDrop" };

  return {
    title: `${digest.title} — LinkDrop`,
    description: digest.content.slice(0, 200),
    openGraph: {
      title: digest.title || "Daily Digest",
      description: digest.content.slice(0, 200),
      type: "article",
    },
  };
}

export default async function PublicDigestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: digest } = await supabase
    .from("digests")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!digest) notFound();

  return <DigestView digest={digest} isPublic={true} />;
}
