# LinkDrop — Roadmap

## Milestone 1: Core Shell + Auth
**Complexity:** S
- Next.js app scaffolded with Tailwind
- Supabase auth (email + Google + GitHub)
- Voice profile onboarding flow (about you, writing samples, timezone, digest time)
- Database schema for users, profiles, voice settings
- Filing cabinet layout shell (sidebar + daily folder view)
- Warm editorial design system (colors, typography, spacing)

## Milestone 2: Link Engine
**Complexity:** L
- Paste URL input with auto-fetch (metadata, OG image, content)
- Claude API integration for auto-summarization on paste
- User notes field alongside AI summary
- File/image uploads via Supabase Storage
- Links organized into daily folders automatically
- Filing cabinet UI with color-coded daily tabs

## Milestone 3: Daily Digest Generator
**Complexity:** L
- Scheduled digest generation at user-set time + timezone
- Claude API reads all daily links, summaries, and user notes
- Generates cohesive newsletter-style post in user's voice (using voice profile + writing samples)
- Digest view — magazine-style reading layout
- Shareable public URL per digest
- Export buttons — one-click copy formatted for LinkedIn, Medium, X, Substack

## Milestone 4: Browser Extension + Bookmarklet
**Complexity:** M
- Chrome extension: "Save to LinkDrop" button on any page
- Bookmarklet fallback for non-Chrome browsers
- Both auto-trigger summarization on save

## Milestone 5: Polish + Launch Readiness
**Complexity:** M
- Landing page / marketing homepage
- README + documentation
- Error handling, loading states, empty states
- Responsive tweaks for tablet
- Smoke test full user flow end-to-end
- Final deployment + tagging

## Dependencies
```
Milestone 1 → 2 → 3 (sequential, each builds on the last)
Milestone 4 (can run after 2)
Milestone 5 (final, after all others)
```

## Risks
- **Content extraction quality** — some sites block scraping. Fallback: user pastes content manually, or Chrome extension grabs from rendered page.
- **Voice matching quality** — depends on prompt engineering with writing samples. Will need iteration.
- **Scheduled jobs on Vercel** — Vercel Hobby cron limited to 10s. Using Supabase pg_cron + Edge Functions instead (150s limit).
