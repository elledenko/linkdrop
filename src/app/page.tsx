import Link from "next/link";
import { Droplets, Link2, Sparkles, Share2 } from "lucide-react";

const TAB_COLORS = [
  "#E07A5F",
  "#F4A261",
  "#E9C46A",
  "#81B29A",
  "#5B8E7D",
  "#7B9EA8",
  "#C77DBA",
  "#D4A5A5",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-text">LinkDrop</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-text hover:text-primary transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/login"
            className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold font-serif text-text leading-tight mb-6">
          Drop your links.
          <br />
          <span className="text-primary">Get a daily digest.</span>
          <br />
          Written in your voice.
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
          Paste links throughout the day. AI summarizes each one. At the end of
          the day, get a newsletter-style post ready to share on LinkedIn,
          Medium, X, or Substack.
        </p>
        <Link
          href="/login"
          className="inline-flex px-8 py-4 bg-primary text-white text-lg font-semibold rounded-2xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
        >
          Get Started — Free
        </Link>

        {/* Filing cabinet tabs */}
        <div className="flex justify-center gap-2 mt-16">
          {TAB_COLORS.map((color, i) => (
            <div
              key={i}
              className="w-8 h-14 rounded-t-md"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-8 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-cream-light border border-border rounded-2xl p-8">
            <div className="w-12 h-12 bg-tab-coral/10 rounded-xl flex items-center justify-center mb-4">
              <Link2 className="w-6 h-6 text-tab-coral" />
            </div>
            <h3 className="text-lg font-bold text-text mb-2">
              Paste anything
            </h3>
            <p className="text-text-secondary leading-relaxed">
              Drop any link, file, or image. We&apos;ll extract the content,
              grab the metadata, and organize it into your daily folder.
            </p>
          </div>

          <div className="bg-cream-light border border-border rounded-2xl p-8">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-bold text-text mb-2">
              AI-powered digests
            </h3>
            <p className="text-text-secondary leading-relaxed">
              Claude reads everything you saved, understands your writing style,
              and generates a cohesive newsletter-style post in your voice.
            </p>
          </div>

          <div className="bg-cream-light border border-border rounded-2xl p-8">
            <div className="w-12 h-12 bg-tab-sage/10 rounded-xl flex items-center justify-center mb-4">
              <Share2 className="w-6 h-6 text-tab-sage" />
            </div>
            <h3 className="text-lg font-bold text-text mb-2">
              Share everywhere
            </h3>
            <p className="text-text-secondary leading-relaxed">
              One-click export formatted for LinkedIn, Medium, X, or Substack.
              Every digest gets a shareable public link.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold font-serif text-text text-center mb-12">
          How it works
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              step: "1",
              title: "Drop links",
              desc: "Paste URLs or upload files throughout the day",
            },
            {
              step: "2",
              title: "Auto-summarize",
              desc: "AI reads each link and writes a concise summary",
            },
            {
              step: "3",
              title: "Daily digest",
              desc: "At your set time, get a newsletter post in your voice",
            },
            {
              step: "4",
              title: "Share it",
              desc: "Copy for any platform or share the public link",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                {item.step}
              </div>
              <h3 className="font-bold text-text mb-1">{item.title}</h3>
              <p className="text-sm text-text-secondary">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-8 py-20 text-center">
        <div className="bg-cream-light border border-border rounded-3xl p-12">
          <h2 className="text-3xl font-bold font-serif text-text mb-4">
            Start curating today
          </h2>
          <p className="text-text-secondary mb-8 max-w-lg mx-auto">
            Join the people who turn their daily link-hoarding into
            share-worthy content — effortlessly.
          </p>
          <Link
            href="/login"
            className="inline-flex px-8 py-4 bg-primary text-white text-lg font-semibold rounded-2xl hover:bg-primary-hover transition-colors"
          >
            Get Started — Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-8 py-8 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
              <Droplets className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-medium text-text-secondary">
              LinkDrop
            </span>
          </div>
          <p className="text-sm text-text-secondary">
            &copy; 2026 LinkDrop
          </p>
        </div>
      </footer>
    </div>
  );
}
