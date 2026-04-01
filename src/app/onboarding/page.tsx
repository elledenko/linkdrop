"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Droplets, ArrowRight, ArrowLeft, Upload, X, Link2, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

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

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [voiceDescription, setVoiceDescription] = useState("");
  const [writingSamples, setWritingSamples] = useState<
    Array<{ content: string; source: string }>
  >([]);
  const [sampleText, setSampleText] = useState("");
  const [sampleSource, setSampleSource] = useState("");
  const [sampleUrl, setSampleUrl] = useState("");
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const [timezone, setTimezone] = useState("America/New_York");
  const [digestHour, setDigestHour] = useState(18);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (TIMEZONES.includes(tz)) setTimezone(tz);
  }, []);

  const addSample = () => {
    if (!sampleText.trim()) return;
    setWritingSamples([
      ...writingSamples,
      { content: sampleText.trim(), source: sampleSource.trim() || "Pasted" },
    ]);
    setSampleText("");
    setSampleSource("");
  };

  const removeSample = (index: number) => {
    setWritingSamples(writingSamples.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      const text = await file.text();
      setWritingSamples((prev) => [
        ...prev,
        { content: text.slice(0, 5000), source: file.name },
      ]);
    }
  };

  const handleAddUrl = async () => {
    if (!sampleUrl.trim()) return;
    setFetchingUrl(true);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: sampleUrl.trim() }),
      });
      if (!res.ok) throw new Error("Could not fetch that page");
      const data = await res.json();
      if (data.content) {
        setWritingSamples((prev) => [
          ...prev,
          { content: data.content.slice(0, 5000), source: data.title || sampleUrl.trim() },
        ]);
        toast.success("Imported writing from URL!");
        setSampleUrl("");
      } else {
        toast.error("Could not extract text from that URL — try pasting the content directly");
      }
    } catch {
      toast.error("Could not fetch that page — try pasting the content directly");
    } finally {
      setFetchingUrl(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Session expired — please log in again");
        router.push("/login");
        return;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          display_name: displayName || null,
          bio: bio || null,
          voice_description: voiceDescription || null,
          timezone,
          digest_hour: digestHour,
          onboarding_complete: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
        toast.error("Failed to save profile — please try again");
        setLoading(false);
        return;
      }

      if (writingSamples.length > 0) {
        const { error: samplesError } = await supabase
          .from("writing_samples")
          .insert(
            writingSamples.map((s) => ({
              user_id: user.id,
              content: s.content,
              source: s.source,
            }))
          );
        if (samplesError) {
          console.error("Samples insert error:", samplesError);
        }
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Onboarding error:", err);
      toast.error("Something went wrong — please try again");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-text">LinkDrop</span>
          <span className="ml-auto text-sm text-text-secondary">
            Step {step} of 3
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-border rounded-full mb-10">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Step 1: About You */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-text">Tell us about you</h2>
              <p className="text-text-secondary mt-1">
                This helps LinkDrop write your daily digest in a voice that
                sounds like you.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Display name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 bg-cream-light border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-text placeholder:text-text-secondary/50"
                placeholder="What should we call you?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                What do you do?
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-cream-light border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-text placeholder:text-text-secondary/50 resize-none"
                placeholder={"e.g., \"I'm a VC who writes about fintech and developer tools...\""}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Describe your writing style
              </label>
              <textarea
                value={voiceDescription}
                onChange={(e) => setVoiceDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-cream-light border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-text placeholder:text-text-secondary/50 resize-none"
                placeholder='e.g., "Casual but smart. I use humor and analogies. Short paragraphs."'
              />
            </div>
          </div>
        )}

        {/* Step 2: Writing Samples */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-text">Writing samples</h2>
              <p className="text-text-secondary mt-1">
                Link to your existing writing, paste text, or upload files.
                This is how we learn your voice.
              </p>
            </div>

            {/* URL import */}
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Link to your writing
              </label>
              <p className="text-xs text-text-secondary mb-2">
                Blog posts, LinkedIn articles, Substack newsletters, Medium posts — we&apos;ll read them and learn your style
              </p>
              <div className="flex gap-3">
                <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-cream-light border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                  <Link2 className="w-4 h-4 text-text-secondary shrink-0" />
                  <input
                    type="url"
                    value={sampleUrl}
                    onChange={(e) => setSampleUrl(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-text placeholder:text-text-secondary/50 focus:outline-none"
                    placeholder="https://your-blog.com/my-post"
                  />
                </div>
                <button
                  onClick={handleAddUrl}
                  disabled={!sampleUrl.trim() || fetchingUrl}
                  className="px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {fetchingUrl ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Reading...
                    </>
                  ) : (
                    "Import"
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-text-secondary text-sm">or paste text</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Paste text */}
            <div className="space-y-3">
              <textarea
                value={sampleText}
                onChange={(e) => setSampleText(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-cream-light border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-text placeholder:text-text-secondary/50 resize-none"
                placeholder="Paste a writing sample here..."
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  value={sampleSource}
                  onChange={(e) => setSampleSource(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-cream-light border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm text-text placeholder:text-text-secondary/50"
                  placeholder="Source label (optional)"
                />
                <button
                  onClick={addSample}
                  disabled={!sampleText.trim()}
                  className="px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-text-secondary text-sm">or upload files</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <label className="block border-2 border-dashed border-border rounded-xl p-5 text-center cursor-pointer hover:border-primary/50 transition-colors">
              <Upload className="w-6 h-6 text-text-secondary mx-auto mb-1.5" />
              <p className="text-sm text-text-secondary">
                Upload text files (.txt, .md)
              </p>
              <input
                type="file"
                accept=".txt,.md,.text"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {writingSamples.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-text">
                  <Check className="w-4 h-4 inline text-tab-sage mr-1" />
                  {writingSamples.length} sample
                  {writingSamples.length !== 1 ? "s" : ""} added
                </p>
                {writingSamples.map((sample, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-2.5 bg-cream-light border border-border rounded-xl"
                  >
                    {sample.source.startsWith("http") ? (
                      <Link2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    ) : null}
                    <span className="flex-1 text-sm text-text truncate">
                      {sample.source}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {sample.content.length} chars
                    </span>
                    <button
                      onClick={() => removeSample(i)}
                      className="text-text-secondary hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-text-secondary">
              Samples are optional but highly recommended. The more examples you
              provide, the better your digest will sound.
            </p>
          </div>
        )}

        {/* Step 3: Schedule */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-text">
                Digest schedule
              </h2>
              <p className="text-text-secondary mt-1">
                When should LinkDrop compile your daily digest?
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Your timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-3 bg-cream-light border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-text"
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
                Generate digest at
              </label>
              <select
                value={digestHour}
                onChange={(e) => setDigestHour(Number(e.target.value))}
                className="w-full px-4 py-3 bg-cream-light border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-text"
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>
                    {formatHour(h)}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-cream-light border border-border rounded-xl">
              <p className="text-sm text-text-secondary">
                Your daily digest will be generated at{" "}
                <span className="font-medium text-text">
                  {formatHour(digestHour)}
                </span>{" "}
                in{" "}
                <span className="font-medium text-text">
                  {timezone.replace(/_/g, " ")}
                </span>
                . You can always generate one manually from the dashboard.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-10">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-4 py-2.5 text-text-secondary hover:text-text transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-colors"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {loading ? "Setting up..." : "Let's go!"}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
