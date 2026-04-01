"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileIcon, Image, FileText, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Upload } from "@/lib/types";

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return Image;
  if (type.includes("pdf")) return FileText;
  return FileIcon;
}

function formatSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadCard({ upload }: { upload: Upload }) {
  const [note, setNote] = useState(upload.user_note || "");
  const [editingNote, setEditingNote] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const Icon = getFileIcon(upload.file_type);
  const isImage = upload.file_type.startsWith("image/");

  const handleSaveNote = async () => {
    await fetch(`/api/upload/${upload.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_note: note }),
    });
    setEditingNote(false);
    router.refresh();
  };

  const handleDelete = async () => {
    await fetch(`/api/upload/${upload.id}`, { method: "DELETE" });
    toast.success("Upload removed");
    setShowMenu(false);
    router.refresh();
  };

  return (
    <div className="bg-cream-light border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors">
      {isImage && upload.public_url && (
        <div className="w-full h-48 bg-cream overflow-hidden">
          <img
            src={upload.public_url}
            alt={upload.file_name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          {!isImage && (
            <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center">
              <Icon className="w-5 h-5 text-text-secondary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text truncate">
              {upload.file_name}
            </p>
            <p className="text-xs text-text-secondary">
              Uploaded · {formatSize(upload.file_size)}
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
                  setNote(upload.user_note || "");
                }}
                className="px-3 py-1.5 text-text-secondary text-xs hover:text-text transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : upload.user_note ? (
          <div
            onClick={() => setEditingNote(true)}
            className="cursor-pointer group"
          >
            <p className="text-sm text-text leading-relaxed group-hover:text-primary/80 transition-colors">
              {upload.user_note}
            </p>
          </div>
        ) : (
          <button
            onClick={() => setEditingNote(true)}
            className="text-sm text-text-secondary hover:text-primary transition-colors"
          >
            ✏️ Add a note...
          </button>
        )}
      </div>
    </div>
  );
}
