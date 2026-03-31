# LinkDrop — System Architecture

## High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │  Next.js App  │  │  Bookmarklet │  │  Chrome Extension     │  │
│  │  (Desktop UI) │  │  (JS snippet)│  │  (Manifest V3)        │  │
│  └──────┬───────┘  └──────┬───────┘  └───────────┬───────────┘  │
│         │                 │                       │              │
└─────────┼─────────────────┼───────────────────────┼──────────────┘
          │                 │                       │
          ▼                 ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER (Next.js)                        │
│                                                                 │
│  /api/links        POST — save link, trigger summarization      │
│  /api/links        GET  — fetch user's links for a date         │
│  /api/links/[id]   PATCH/DELETE — update/delete a link          │
│  /api/summarize    POST — extract content + Claude summarization│
│  /api/digest       POST — generate daily digest on demand       │
│  /api/digest/[id]  GET  — fetch a specific digest               │
│  /api/upload       POST — file upload to Supabase Storage       │
│  /api/profile      GET/PATCH — voice profile + settings         │
│  /api/og           POST — fetch OG metadata for a URL           │
│  /api/cron/digest  POST — called by Supabase pg_cron            │
│                                                                 │
└────────────┬────────────────────────────┬───────────────────────┘
             │                            │
             ▼                            ▼
┌────────────────────────┐   ┌────────────────────────────────────┐
│      CLAUDE API        │   │           SUPABASE                 │
│                        │   │                                    │
│  Opus 4.6              │   │  Auth — email, Google, GitHub      │
│  • Link summarization  │   │  Postgres — all application data  │
│  • Digest generation   │   │  Storage — user file uploads      │
│  • Voice matching      │   │  Edge Functions — digest cron     │
│                        │   │  pg_cron — scheduled triggers     │
└────────────────────────┘   └────────────────────────────────────┘
```

## Component Breakdown

### Frontend (Next.js App Router)

| Route | Purpose |
|-------|---------|
| `/` | Landing page (unauthenticated) |
| `/login` | Auth page — email + Google + GitHub |
| `/onboarding` | Voice profile setup (about you, samples, timezone, digest time) |
| `/dashboard` | Main app — filing cabinet view with daily folders |
| `/dashboard/[date]` | Single day view — all links + uploads for that date |
| `/digest/[id]` | Digest view — read the generated newsletter |
| `/d/[slug]` | Public shareable digest page (no auth required) |

### Backend (Next.js API Routes)

All API routes use Supabase server client with `@supabase/ssr`. Auth is validated on every request via the session cookie.

**Link Pipeline:**
1. User pastes URL → `POST /api/links` saves the URL to DB
2. Background: `POST /api/summarize` extracts content + calls Claude for summary
3. Summary saved back to the link record
4. User can add their own notes via `PATCH /api/links/[id]`

**Digest Pipeline:**
1. Supabase pg_cron runs hourly → calls Edge Function
2. Edge Function queries users whose digest time matches current hour (in their timezone)
3. For each user: calls `POST /api/cron/digest` with service role auth
4. API route fetches all links for that user's "today", reads voice profile + writing samples
5. Calls Claude Opus 4.6 with all link summaries + user notes + voice profile
6. Saves generated digest to DB with a public slug
7. User can also manually trigger via `POST /api/digest`

### Database (Supabase Postgres)

### Data Model

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,                          -- "About you" from onboarding
  voice_description TEXT,            -- How they describe their writing style
  timezone TEXT DEFAULT 'America/New_York',
  digest_hour INTEGER DEFAULT 18,    -- 0-23, hour in their timezone to generate digest
  digest_enabled BOOLEAN DEFAULT true,
  onboarding_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Writing samples for voice matching
CREATE TABLE public.writing_samples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,              -- The writing sample text
  source TEXT,                        -- Where it's from (optional label)
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Links saved by users
CREATE TABLE public.links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,                         -- Extracted or OG title
  description TEXT,                   -- OG description
  image_url TEXT,                     -- OG image
  site_name TEXT,                     -- Source site name
  extracted_content TEXT,             -- Full article text (markdown)
  ai_summary TEXT,                    -- Claude-generated summary
  user_note TEXT,                     -- User's own commentary
  link_date DATE NOT NULL DEFAULT CURRENT_DATE,  -- Which daily folder this belongs to
  status TEXT DEFAULT 'pending',      -- pending | summarized | failed
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- File uploads
CREATE TABLE public.uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,            -- MIME type
  file_size INTEGER,                  -- bytes
  storage_path TEXT NOT NULL,         -- Path in Supabase Storage
  public_url TEXT,                    -- Public URL if needed
  user_note TEXT,                     -- User's commentary on the upload
  upload_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Generated daily digests
CREATE TABLE public.digests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  digest_date DATE NOT NULL,
  title TEXT,                         -- AI-generated digest title
  content TEXT NOT NULL,              -- The full newsletter-style digest (markdown)
  slug TEXT UNIQUE NOT NULL,          -- Public URL slug (e.g., "elle-2026-03-31")
  link_count INTEGER DEFAULT 0,
  upload_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,  -- Whether the public link is active
  export_linkedin TEXT,               -- Pre-formatted for LinkedIn
  export_x TEXT,                      -- Pre-formatted for X/Twitter
  export_medium TEXT,                 -- Pre-formatted for Medium
  export_substack TEXT,               -- Pre-formatted for Substack
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, digest_date)
);

-- Indexes
CREATE INDEX idx_links_user_date ON public.links(user_id, link_date DESC);
CREATE INDEX idx_uploads_user_date ON public.uploads(user_id, upload_date DESC);
CREATE INDEX idx_digests_user_date ON public.digests(user_id, digest_date DESC);
CREATE INDEX idx_digests_slug ON public.digests(slug);
```

### Row Level Security

```sql
-- Profiles: users can only read/update their own
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Links: users can only CRUD their own
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own links" ON public.links FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own links" ON public.links FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own links" ON public.links FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own links" ON public.links FOR DELETE USING (auth.uid() = user_id);

-- Writing samples: users can only CRUD their own
ALTER TABLE public.writing_samples ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own samples" ON public.writing_samples FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own samples" ON public.writing_samples FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own samples" ON public.writing_samples FOR DELETE USING (auth.uid() = user_id);

-- Uploads: users can only CRUD their own
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own uploads" ON public.uploads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own uploads" ON public.uploads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own uploads" ON public.uploads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own uploads" ON public.uploads FOR DELETE USING (auth.uid() = user_id);

-- Digests: users can CRUD their own, anyone can read published digests
ALTER TABLE public.digests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own digests" ON public.digests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view published digests" ON public.digests FOR SELECT USING (is_published = true);
CREATE POLICY "Users can insert own digests" ON public.digests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own digests" ON public.digests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own digests" ON public.digests FOR DELETE USING (auth.uid() = user_id);
```

### Storage

```
Bucket: "user-content" (private, RLS-protected)
  ├── {user_id}/uploads/          — user file uploads (images, PDFs, etc.)
  └── {user_id}/writing-samples/  — uploaded writing sample files

Bucket: "public-assets" (public)
  └── digest-images/              — OG images for shared digest pages
```

### Authentication & Authorization

- **Provider:** Supabase Auth
- **Methods:** Email/password + Google OAuth + GitHub OAuth
- **Session:** Cookie-based via `@supabase/ssr`
- **Authorization:** Row Level Security on all tables — users can only access their own data
- **Public access:** Digest pages (`/d/[slug]`) bypass auth, query by slug with `is_published = true`
- **Service role:** Used only by cron/Edge Functions for cross-user digest generation

### Scheduled Digest Generation

```
Supabase pg_cron (runs every hour at :00)
    │
    ▼
Supabase Edge Function: "generate-digests"
    │
    ├── Query: SELECT users WHERE digest_hour = current_hour AND timezone matches
    │
    ├── For each matched user:
    │   ├── Fetch all links + uploads for today
    │   ├── Fetch voice profile + writing samples
    │   ├── Call Claude Opus 4.6 with digest prompt
    │   ├── Generate platform-specific exports (LinkedIn, X, Medium, Substack)
    │   └── Save digest to DB with public slug
    │
    └── Log results
```

### File/Folder Structure

```
linkdrop/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout (fonts, metadata)
│   │   ├── page.tsx                   # Landing page
│   │   ├── login/page.tsx             # Auth page
│   │   ├── onboarding/page.tsx        # Voice profile setup
│   │   ├── dashboard/
│   │   │   ├── layout.tsx             # App shell (sidebar + filing cabinet)
│   │   │   ├── page.tsx               # Today's folder (default view)
│   │   │   └── [date]/page.tsx        # Specific date folder
│   │   ├── digest/[id]/page.tsx       # Private digest view
│   │   ├── d/[slug]/page.tsx          # Public shareable digest
│   │   └── api/
│   │       ├── links/route.ts         # CRUD links
│   │       ├── links/[id]/route.ts    # Single link operations
│   │       ├── summarize/route.ts     # Content extraction + Claude summary
│   │       ├── digest/route.ts        # Generate digest on demand
│   │       ├── digest/[id]/route.ts   # Fetch specific digest
│   │       ├── upload/route.ts        # File uploads
│   │       ├── profile/route.ts       # Voice profile CRUD
│   │       ├── og/route.ts            # OG metadata fetcher
│   │       └── cron/digest/route.ts   # Called by Supabase cron
│   ├── components/
│   │   ├── ui/                        # Base UI components (buttons, inputs, cards)
│   │   ├── filing-cabinet/            # Filing cabinet layout components
│   │   ├── link-card.tsx              # Individual link display
│   │   ├── link-input.tsx             # URL paste input
│   │   ├── digest-view.tsx            # Newsletter-style digest reader
│   │   ├── export-buttons.tsx         # Platform export copy buttons
│   │   └── voice-profile-form.tsx     # Onboarding voice setup
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts              # Browser Supabase client
│   │   │   ├── server.ts              # Server Supabase client
│   │   │   └── admin.ts               # Service role client (cron only)
│   │   ├── claude.ts                  # Claude API wrapper
│   │   ├── extractor.ts              # URL content extraction
│   │   ├── digest-generator.ts        # Digest composition logic
│   │   └── formatters.ts             # Platform-specific export formatters
│   └── types/
│       └── index.ts                   # Shared TypeScript types
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_storage_buckets.sql
│   │   └── 003_cron_setup.sql
│   └── functions/
│       └── generate-digests/
│           └── index.ts               # Edge Function for cron-triggered digest gen
├── extension/                          # Chrome extension (Manifest V3)
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   ├── background.js
│   └── content.js
├── public/
│   └── bookmarklet.js                 # Bookmarklet source
├── docs/
├── notes/
├── .venture/
├── .env.local
├── .env.example
├── vercel.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
├── package.json
└── README.md
```

### Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| AI model | Claude Opus 4.6 | Highest quality for voice matching + newsletter writing |
| Content extraction | article-extractor + Readability fallback | Fast primary path, robust fallback |
| Scheduling | Supabase pg_cron + Edge Functions | Vercel Hobby cron limited to 10s execution — too short for Claude API calls |
| Storage | Supabase Storage | Unified platform, RLS-protected, generous free tier |
| Export format | Pre-rendered per platform, stored in DB | One-click copy without re-processing |
| Public digests | Slug-based public routes | Clean shareable URLs, no auth required to read |
| Auth | Supabase Auth with cookie sessions | Server-side rendering support, built-in OAuth |
