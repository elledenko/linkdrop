"use client";

import { useState, useRef } from "react";
import { X, Link2, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AddLinkModal({
  date,
  onClose,
  onAdded,
}: {
  date: string;
  onClose: () => void;
  onAdded: () => void;
}) {
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmitLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), user_note: note.trim() || null, date }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save link");
      }

      toast.success("Link saved! Summarizing...");
      onAdded();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save link"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("date", date);
        if (note.trim()) formData.append("user_note", note.trim());

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to upload file");
        }
      }

      toast.success("File uploaded!");
      onAdded();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to upload"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-cream-light border border-border rounded-2xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text">Drop a link</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-text-secondary hover:text-text rounded-lg hover:bg-cream transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitLink} className="space-y-4">
          <div>
            <div className="flex items-center gap-2 px-4 py-3 bg-cream border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
              <Link2 className="w-4 h-4 text-text-secondary shrink-0" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-transparent text-text placeholder:text-text-secondary/50 focus:outline-none text-sm"
                placeholder="https://"
                autoFocus
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-text-secondary text-xs">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <label className="block border-2 border-dashed border-border rounded-xl p-5 text-center cursor-pointer hover:border-primary/50 transition-colors">
            <Upload className="w-6 h-6 text-text-secondary mx-auto mb-1.5" />
            <p className="text-sm text-text-secondary">
              Drop a file, image, or screenshot
            </p>
            <p className="text-xs text-text-secondary/50 mt-0.5">
              PNG, JPG, PDF, up to 50MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Add your take (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 bg-cream border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm text-text placeholder:text-text-secondary/50 resize-none"
              placeholder="What's interesting about this?"
            />
          </div>

          <button
            type="submit"
            disabled={loading || uploading || !url.trim()}
            className="w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading || uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {uploading ? "Uploading..." : "Saving..."}
              </>
            ) : (
              "Save to Today's Drop"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
