"use client";

import { format, parseISO } from "date-fns";
import { Plus, Newspaper } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LinkCard } from "@/components/link-card";
import { UploadCard } from "@/components/upload-card";
import { AddLinkModal } from "@/components/add-link-modal";
import type { Link, Upload, Digest } from "@/lib/types";

const TAB_COLORS = [
  "var(--color-tab-coral)",
  "var(--color-tab-amber)",
  "var(--color-tab-gold)",
  "var(--color-tab-sage)",
  "var(--color-tab-teal)",
  "var(--color-tab-slate)",
  "var(--color-tab-mauve)",
  "var(--color-tab-rose)",
];

function formatHour(h: number): string {
  if (h === 0) return "12:00 AM";
  if (h === 12) return "12:00 PM";
  return h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`;
}

export function DayView({
  date,
  links,
  uploads,
  digest,
  profile,
  isToday,
}: {
  date: string;
  links: Link[];
  uploads: Upload[];
  digest: Digest | null;
  profile: { timezone: string; digest_hour: number } | null;
  isToday: boolean;
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const router = useRouter();

  const dateObj = parseISO(date);
  const dayIndex = dateObj.getDate() % TAB_COLORS.length;
  const tabColor = TAB_COLORS[dayIndex];

  const handleGenerateDigest = async () => {
    if (links.length === 0 && uploads.length === 0) {
      toast.error("Nothing to digest — add some links first!");
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch("/api/digest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate digest");
      }
      const data = await res.json();
      toast.success("Digest generated!");
      router.push(`/digest/${data.id}`);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to generate digest"
      );
    } finally {
      setGenerating(false);
    }
  };

  const totalItems = links.length + uploads.length;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Date header */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-4 h-12 rounded-sm"
          style={{ backgroundColor: tabColor }}
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-text">
            {isToday ? "Today" : format(dateObj, "EEEE, MMMM d, yyyy")}
          </h1>
          <p className="text-sm text-text-secondary">
            {totalItems} item{totalItems !== 1 ? "s" : ""}
            {isToday && " so far"}
          </p>
        </div>
        {isToday && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Link
          </button>
        )}
      </div>

      {/* Items feed */}
      {totalItems === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-cream-light border-2 border-dashed border-border rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-text-secondary" />
          </div>
          <h3 className="text-lg font-medium text-text mb-1">
            {isToday ? "No links yet today" : "No links this day"}
          </h3>
          {isToday && (
            <p className="text-text-secondary text-sm mb-4">
              Paste a URL or drop a file to get started
            </p>
          )}
          {isToday && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover transition-colors"
            >
              Add your first link
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Interleave links and uploads by created_at */}
          {[
            ...links.map((l) => ({ type: "link" as const, item: l, time: l.created_at })),
            ...uploads.map((u) => ({
              type: "upload" as const,
              item: u,
              time: u.created_at,
            })),
          ]
            .sort(
              (a, b) =>
                new Date(b.time).getTime() - new Date(a.time).getTime()
            )
            .map((entry) =>
              entry.type === "link" ? (
                <LinkCard key={entry.item.id} link={entry.item as Link} />
              ) : (
                <UploadCard
                  key={entry.item.id}
                  upload={entry.item as Upload}
                />
              )
            )}
        </div>
      )}

      {/* Digest bar */}
      {totalItems > 0 && (
        <div className="mt-8 p-5 bg-cream-light border border-border rounded-2xl flex items-center gap-4">
          <Newspaper className="w-6 h-6 text-primary shrink-0" />
          <div className="flex-1">
            {digest ? (
              <p className="text-sm text-text">
                <span className="font-medium">Digest ready</span> —{" "}
                <a
                  href={`/digest/${digest.id}`}
                  className="text-primary hover:underline"
                >
                  View digest
                </a>
              </p>
            ) : (
              <p className="text-sm text-text">
                <span className="font-medium">Generate today&apos;s digest</span>
                {profile && (
                  <span className="text-text-secondary">
                    {" "}
                    · Auto-generates at {formatHour(profile.digest_hour)}
                  </span>
                )}
              </p>
            )}
          </div>
          {!digest && (
            <button
              onClick={handleGenerateDigest}
              disabled={generating}
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {generating ? "Generating..." : "Generate Now"}
            </button>
          )}
        </div>
      )}

      {showAddModal && (
        <AddLinkModal
          date={date}
          onClose={() => setShowAddModal(false)}
          onAdded={() => {
            setShowAddModal(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
