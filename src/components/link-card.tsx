"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  Loader2,
  MoreHorizontal,
  Trash2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import type { Link } from "@/lib/types";

export function LinkCard({ link }: { link: Link }) {
  const [note, setNote] = useState(link.user_note || "");
  const [editingNote, setEditingNote] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const handleSaveNote = async () => {
    await fetch(`/api/links/${link.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_note: note }),
    });
    setEditingNote(false);
    router.refresh();
  };

  const handleDelete = async () => {
    await fetch(`/api/links/${link.id}`, { method: "DELETE" });
    toast.success("Link removed");
    setShowMenu(false);
    router.refresh();
  };

  const hostname = (() => {
    try {
      return new URL(link.url).hostname.replace("www.", "");
    } catch {
      return link.url;
    }
  })();

  return (
    <div className="bg-cream-light border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors">
      {/* OG image */}
      {link.image_url && (
        <div className="w-full h-40 bg-cream overflow-hidden">
          <img
            src={link.image_url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-semibold text-text hover:text-primary transition-colors line-clamp-2 flex items-center gap-1.5"
            >
              {link.title || link.url}
              <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-50" />
            </a>
            <p className="text-xs text-text-secondary mt-0.5">
              {link.site_name || hostname}
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-text-secondary hover:text-text rounded-lg hover:bg-cream transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-8 z-20 bg-cream-light border border-border rounded-xl shadow-lg py-1 min-w-[140px]">
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-cream transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* AI Summary */}
        {link.status === "pending" && (
          <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Summarizing...
          </div>
        )}
        {link.ai_summary && (
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-medium text-accent">AI</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              {link.ai_summary}
            </p>
          </div>
        )}

        {/* User note */}
        {editingNote ? (
          <div className="space-y-2">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              autoFocus
              className="w-full px-3 py-2 bg-cream border border-border rounded-xl text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              placeholder="What's interesting about this?"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveNote}
                className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary-hover transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditingNote(false);
                  setNote(link.user_note || "");
                }}
                className="px-3 py-1.5 text-text-secondary text-xs hover:text-text transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : link.user_note ? (
          <div
            onClick={() => setEditingNote(true)}
            className="cursor-pointer group"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs font-medium text-primary">You</span>
            </div>
            <p className="text-sm text-text leading-relaxed group-hover:text-primary/80 transition-colors">
              {link.user_note}
            </p>
          </div>
        ) : (
          <button
            onClick={() => setEditingNote(true)}
            className="text-sm text-text-secondary hover:text-primary transition-colors"
          >
            ✏️ Add your take...
          </button>
        )}
      </div>
    </div>
  );
}
