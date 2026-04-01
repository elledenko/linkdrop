# LinkDrop — Build Plan

## Phase 1: Core Shell + Auth + Design System
**Goal:** App shell with filing cabinet layout, auth, onboarding, and design tokens.

### Tasks
1. Install dependencies (Supabase, Anthropic SDK, content extraction libs, utilities)
2. Create Supabase migration: profiles, writing_samples tables
3. Set up Supabase auth helpers (client, server, middleware)
4. Build design system: color tokens, typography, base components
5. Build auth page (login/signup with Google, GitHub, email)
6. Build onboarding flow (about you, writing style, samples, timezone, digest time)
7. Build app shell: sidebar with date list + main content area (filing cabinet layout)
8. Auth middleware (protect dashboard routes)

### Milestone
User can sign up, complete onboarding, and see an empty dashboard with the filing cabinet layout.

---

## Phase 2: Link Engine
**Goal:** Paste links, auto-extract metadata, AI summarization, file uploads, daily folder view.

### Tasks
1. Create Supabase migration: links, uploads tables + storage bucket
2. Build link input component (paste URL modal)
3. Build API route: POST /api/links — save link
4. Build API route: POST /api/summarize — extract content + Claude summary
5. Build API route: POST /api/og — fetch OG metadata
6. Build API route: POST /api/upload — file upload to Supabase Storage
7. Build link card component (title, source, OG image, AI summary, user note)
8. Build upload card component
9. Build daily folder view — fetch and display links/uploads for a date
10. Wire up sidebar date navigation
11. Add user note editing on link cards

### Milestone
User can paste a URL, see it auto-summarized by Claude, add their own note, upload files, and browse daily folders.

---

## Phase 3: Daily Digest Generator
**Goal:** Generate newsletter-style digests in user's voice, shareable public pages, platform export.

### Tasks
1. Create Supabase migration: digests table
2. Build API route: POST /api/digest — generate digest on demand
3. Build digest generation logic (fetch links + voice profile + writing samples → Claude prompt)
4. Build platform-specific formatters (LinkedIn, Medium, X, Substack)
5. Build digest view page (/digest/[id]) — magazine-style layout
6. Build public digest page (/d/[slug]) — no auth, shareable
7. Build export buttons component (copy formatted for each platform + share link)
8. Add "Generate Today's Digest" button to dashboard
9. Wire up digest list in sidebar

### Milestone
User can generate a daily digest written in their voice, view it in a magazine layout, copy it formatted for any platform, and share via public URL.

---

## Phase 4: Browser Extension + Bookmarklet
**Goal:** Save links from anywhere.

### Tasks
1. Build Chrome extension (Manifest V3): popup, background service worker
2. Build bookmarklet (JS snippet)
3. Add extension/bookmarklet install instructions to settings page
4. Build settings page (voice profile editing, schedule config, extension install)

### Milestone
User can save links from any webpage via extension or bookmarklet.

---

## Phase 5: Polish + Launch
**Goal:** Landing page, error states, final polish, full deploy.

### Tasks
1. Build landing page (value prop, features, CTA)
2. Add loading states, empty states, error handling throughout
3. Write README.md
4. Smoke test full user flow
5. Final deploy + tag v0.1.0

### Milestone
Complete, polished V0.1 live on Vercel with full user flow working end-to-end.
