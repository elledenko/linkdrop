"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import {
  Droplets,
  ArrowLeft,
  Save,
  X,
  Upload,
  Bookmark,
} from "lucide-react";
import type { Profile, WritingSample } from "@/lib/types";

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Kolkata",
  "Australia/Sydney",
  "Pacific/Auckland",
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function formatHour(h: number): string {
  if (h === 0) return "12:00 AM";
  if (h === 12) return "12:00 PM";
  return h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [samples, setSamples] = useState<WritingSample[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data.profile);
        setSamples(data.samples || []);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);

    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        display_name: profile.display_name,
        bio: profile.bio,
        voice_description: profile.voice_description,
        timezone: profile.timezone,
        digest_hour: profile.digest_hour,
        digest_enabled: profile.digest_enabled,
        phone_number: profile.phone_number?.trim() || null,
        sms_enabled: profile.sms_enabled,
      }),
    });

    toast.success("Settings saved!");
    setSaving(false);
  };

  const handleDeleteSample = async (id: string) => {
    await supabase.from("writing_samples").delete().eq("id", id);
    setSamples(samples.filter((s) => s.id !== id));
    toast.success("Sample removed");
  };

  const handleAddSample = async (content: string, source: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("writing_samples")
      .insert({ user_id: user.id, content, source })
      .select()
      .single();

    if (data) setSamples([...samples, data]);
  };

  const [newSample, setNewSample] = useState("");
  const [newSource, setNewSource] = useState("");

  const bookmarkletCode = `javascript:void(window.open('${typeof window !== "undefined" ? window.location.origin : ""}/dashboard?add=' + encodeURIComponent(window.location.href)))`;

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-cream-light border-b border-border">
        <div className="max-w-2xl mx-auto px-8 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-text-secondary hover:text-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-text">Settings</span>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-8 py-8 space-y-8">
        {/* Voice Profile */}
        <section className="bg-cream-light border border-border rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-bold text-text">Voice Profile</h2>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Display name
            </label>
            <input
              type="text"
              value={profile.display_name || ""}
              onChange={(e) =>
                setProfile({ ...profile, display_name: e.target.value })
              }
              className="w-full px-4 py-3 bg-cream border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              About you
            </label>
            <textarea
              value={profile.bio || ""}
              onChange={(e) =>
                setProfile({ ...profile, bio: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-3 bg-cream border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-text resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Writing style
            </label>
            <textarea
              value={profile.voice_description || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  voice_description: e.target.value,
                })
              }
              rows={3}
              className="w-full px-4 py-3 bg-cream border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-text resize-none"
            />
          </div>

          {/* Writing samples */}
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Writing samples
            </label>
            {samples.map((sample) => (
              <div
                key={sample.id}
                className="flex items-center gap-3 px-4 py-2.5 bg-cream border border-border rounded-xl mb-2"
              >
                <span className="flex-1 text-sm text-text truncate">
                  {sample.source || "Sample"}
                </span>
                <span className="text-xs text-text-secondary">
                  {sample.content.length} chars
                </span>
                <button
                  onClick={() => handleDeleteSample(sample.id)}
                  className="text-text-secondary hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <textarea
              value={newSample}
              onChange={(e) => setNewSample(e.target.value)}
              rows={3}
              placeholder="Paste a writing sample..."
              className="w-full px-4 py-3 bg-cream border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm text-text resize-none mt-2"
            />
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
                placeholder="Source label (optional)"
                className="flex-1 px-3 py-2 bg-cream border border-border rounded-xl text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                onClick={() => {
                  if (newSample.trim()) {
                    handleAddSample(
                      newSample.trim(),
                      newSource.trim() || "Pasted"
                    );
                    setNewSample("");
                    setNewSource("");
                  }
                }}
                disabled={!newSample.trim()}
                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        </section>

        {/* Digest Schedule */}
        <section className="bg-cream-light border border-border rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-bold text-text">Digest Schedule</h2>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Timezone
            </label>
            <select
              value={profile.timezone}
              onChange={(e) =>
                setProfile({ ...profile, timezone: e.target.value })
              }
              className="w-full px-4 py-3 bg-cream border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Generate at
            </label>
            <select
              value={profile.digest_hour}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  digest_hour: Number(e.target.value),
                })
              }
              className="w-full px-4 py-3 bg-cream border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {HOURS.map((h) => (
                <option key={h} value={h}>
                  {formatHour(h)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-text">
              Auto-generate digest
            </label>
            <button
              onClick={() =>
                setProfile({
                  ...profile,
                  digest_enabled: !profile.digest_enabled,
                })
              }
              className={`w-10 h-6 rounded-full transition-colors relative ${
                profile.digest_enabled ? "bg-primary" : "bg-border"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                  profile.digest_enabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </section>

        {/* SMS */}
        <section className="bg-cream-light border border-border rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-bold text-text">SMS</h2>
          <p className="text-sm text-text-secondary">
            Text links directly to LinkDrop from your phone.
          </p>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Your phone number
            </label>
            <input
              type="tel"
              value={profile.phone_number || ""}
              onChange={(e) =>
                setProfile({ ...profile, phone_number: e.target.value })
              }
              className="w-full px-4 py-3 bg-cream border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-text">
              SMS enabled
            </label>
            <button
              onClick={() =>
                setProfile({
                  ...profile,
                  sms_enabled: !profile.sms_enabled,
                })
              }
              className={`w-10 h-6 rounded-full transition-colors relative ${
                profile.sms_enabled ? "bg-primary" : "bg-border"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                  profile.sms_enabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {process.env.NEXT_PUBLIC_TWILIO_PHONE_NUMBER && (
            <div className="p-4 bg-cream border border-border rounded-xl">
              <p className="text-sm text-text">
                Text links to:{" "}
                <span className="font-mono font-medium">
                  {process.env.NEXT_PUBLIC_TWILIO_PHONE_NUMBER}
                </span>
              </p>
            </div>
          )}
        </section>

        {/* Bookmarklet */}
        <section className="bg-cream-light border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-text">
            Bookmarklet & Extension
          </h2>
          <div>
            <p className="text-sm text-text-secondary mb-3">
              Drag this button to your bookmarks bar to save links from any
              page:
            </p>
            <a
              href={bookmarkletCode}
              onClick={(e) => e.preventDefault()}
              draggable
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl cursor-grab"
            >
              <Bookmark className="w-4 h-4" />
              Save to LinkDrop
            </a>
          </div>
        </section>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
