"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Droplets, ArrowRight, ArrowLeft, Upload, X } from "lucide-react";

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

  const handleComplete = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
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

    if (writingSamples.length > 0) {
      await supabase.from("writing_samples").insert(
        writingSamples.map((s) => ({
          user_id: user.id,
          content: s.content,
          source: s.source,
        }))
      );
    }

    router.push("/dashboard");
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
                Paste or upload examples of your writing — blog posts, tweets,
                newsletters. This is how we learn your voice.
              </p>
            </div>

            <div className="space-y-3">
              <textarea
                value={sampleText}
                onChange={(e) => setSampleText(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 bg-cream-light border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-text placeholder:text-text-secondary/50 resize-none"
                placeholder="Paste a writing sample here..."
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  value={sampleSource}
                  onChange={(e) => setSampleSource(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-cream-light border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm text-text placeholder:text-text-secondary/50"
                  placeholder="Source (optional) — e.g., 'My blog'"
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
              <span className="text-text-secondary text-sm">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <label className="block border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
              <Upload className="w-8 h-8 text-text-secondary mx-auto mb-2" />
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
                  {writingSamples.length} sample
                  {writingSamples.length !== 1 ? "s" : ""} added
                </p>
                {writingSamples.map((sample, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-2.5 bg-cream-light border border-border rounded-xl"
                  >
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
