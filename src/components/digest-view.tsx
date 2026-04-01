"use client";

import { format, parseISO } from "date-fns";
import { ArrowLeft, Copy, Link2, Check, Droplets } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Digest } from "@/lib/types";

function MarkdownContent({ content }: { content: string }) {
  // Basic markdown rendering — handles headers, bold, italic, links, lists
  const lines = content.split("\n");

  return (
    <div className="prose-linkdrop space-y-3">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-3" />;

        // Headers
        if (line.startsWith("### "))
          return (
            <h3
              key={i}
              className="text-lg font-bold text-text mt-6 mb-2"
            >
              {line.slice(4)}
            </h3>
          );
        if (line.startsWith("## "))
          return (
            <h2
              key={i}
              className="text-xl font-bold text-text mt-8 mb-3"
            >
              {line.slice(3)}
            </h2>
          );
        if (line.startsWith("# "))
          return (
            <h1 key={i} className="text-2xl font-bold text-text mt-8 mb-3">
              {line.slice(2)}
            </h1>
          );

        // Horizontal rule
        if (line.match(/^[-]{3,}$/) || line.match(/^[─]{3,}$/))
          return <hr key={i} className="border-border my-6" />;

        // List items
        if (line.match(/^[-*] /))
          return (
            <li key={i} className="text-text leading-relaxed ml-4 list-disc">
              <InlineMarkdown text={line.slice(2)} />
            </li>
          );

        // Regular paragraph
        return (
          <p key={i} className="text-text leading-relaxed">
            <InlineMarkdown text={line} />
          </p>
        );
      })}
    </div>
  );
}

function InlineMarkdown({ text }: { text: string }) {
  // Handle bold, italic, links, and →
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[([^\]]+)\]\(([^)]+)\)|→)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        if (part.startsWith("**") && part.endsWith("**"))
          return (
            <strong key={i} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        if (part.startsWith("*") && part.endsWith("*"))
          return <em key={i}>{part.slice(1, -1)}</em>;
        if (part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)) {
          const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
          if (match)
            return (
              <a
                key={i}
                href={match[2]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {match[1]}
              </a>
            );
        }
        if (part === "→")
          return (
            <span key={i} className="text-primary">
              →
            </span>
          );
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

const PLATFORMS = [
  { key: "export_linkedin", label: "LinkedIn", icon: "in" },
  { key: "export_medium", label: "Medium", icon: "M" },
  { key: "export_x", label: "X", icon: "𝕏" },
  { key: "export_substack", label: "Substack", icon: "S" },
] as const;

export function DigestView({
  digest,
  isPublic,
}: {
  digest: Digest;
  isPublic: boolean;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const router = useRouter();

  const handleCopy = async (
    key: keyof Digest,
    label: string
  ) => {
    const text = digest[key] as string;
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`Copied for ${label}!`);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyShareLink = async () => {
    const url = `${window.location.origin}/d/${digest.slug}`;
    await navigator.clipboard.writeText(url);
    setCopied("link");
    toast.success("Share link copied!");
    setTimeout(() => setCopied(null), 2000);
  };

  const dateObj = parseISO(digest.digest_date);

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-cream/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-3xl mx-auto px-8 py-4 flex items-center gap-4">
          {isPublic ? (
            <a href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <Droplets className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-text">LinkDrop</span>
            </a>
          ) : (
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-text-secondary hover:text-text transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <div className="flex-1" />
          {!isPublic && (
            <button
              onClick={handleCopyShareLink}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-secondary hover:text-text border border-border rounded-lg hover:bg-cream-light transition-colors"
            >
              {copied === "link" ? (
                <Check className="w-3.5 h-3.5 text-green-600" />
              ) : (
                <Link2 className="w-3.5 h-3.5" />
              )}
              Share
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      <article className="max-w-2xl mx-auto px-8 py-12">
        {/* Date + title */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            {format(dateObj, "EEEE, MMMM d, yyyy")}
          </p>
          <h1 className="text-3xl font-bold font-serif text-text mb-3">
            {digest.title || "Daily Digest"}
          </h1>
          <p className="text-sm text-text-secondary">
            {digest.link_count} link{digest.link_count !== 1 ? "s" : ""}
            {digest.upload_count > 0 &&
              ` · ${digest.upload_count} upload${digest.upload_count !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Digest body */}
        <div className="font-serif text-base leading-[1.8]">
          <MarkdownContent content={digest.content} />
        </div>
      </article>

      {/* Export bar */}
      <div className="sticky bottom-0 bg-cream-light/80 backdrop-blur-sm border-t border-border">
        <div className="max-w-2xl mx-auto px-8 py-4">
          <div className="flex items-center gap-3 flex-wrap">
            {PLATFORMS.map((platform) => (
              <button
                key={platform.key}
                onClick={() => handleCopy(platform.key, platform.label)}
                className="flex items-center gap-2 px-4 py-2 bg-cream border border-border rounded-xl text-sm font-medium text-text hover:border-primary/50 hover:text-primary transition-colors"
              >
                {copied === platform.label ? (
                  <Check className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {platform.label}
              </button>
            ))}
            <button
              onClick={handleCopyShareLink}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors ml-auto"
            >
              {copied === "link" ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Link2 className="w-3.5 h-3.5" />
              )}
              Copy Share Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
