# LinkDrop — Technical Resource Document

## Tech Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Framework | Next.js (App Router) | 15.x | Server components, API routes, Vercel-native deployment |
| Styling | Tailwind CSS | 4.x | Rapid UI development, design token support |
| Language | TypeScript | 5.x | Type safety across full stack |
| Auth & DB | Supabase | latest | Auth (email + OAuth), Postgres, Storage, Edge Functions, pg_cron |
| AI | Claude API (Opus 4.6) | claude-opus-4-6 | High-quality summarization + voice-matched digest writing |
| AI SDK | @anthropic-ai/sdk | latest | Official Anthropic TypeScript SDK |
| Deployment | Vercel | — | Zero-config Next.js hosting, preview deploys, env management |
| Content Extraction | @extractus/article-extractor | latest | Fast URL→article extraction for ~80% of sites |
| OG Metadata | open-graph-scraper | latest | Extract title, description, image from any URL |
| HTML→Markdown | turndown | latest | Convert extracted HTML to clean markdown for Claude input |
| Readability Fallback | @mozilla/readability + jsdom | latest | Fallback extractor for sites article-extractor can't handle |

## Third-Party Services

| Service | Purpose | Dashboard URL | Env Var |
|---------|---------|--------------|---------|
| Supabase | Auth, Postgres, Storage, Edge Functions | https://supabase.com/dashboard | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| Anthropic | Claude API for summarization + digest generation | https://console.anthropic.com | `ANTHROPIC_API_KEY` |
| Vercel | Hosting + deployment | https://vercel.com/dashboard | Managed via CLI |
| GitHub | Source control | https://github.com | Managed via CLI |

## Environment Variables

### .env.local (real secrets — gitignored)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
SUPABASE_SERVICE_ROLE_KEY=eyJhb...
ANTHROPIC_API_KEY=sk-ant-...
```

### .env.example (placeholders — committed)
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

## Key Libraries & Dependencies

### Core
- `next` — App framework
- `react`, `react-dom` — UI
- `typescript` — Language
- `tailwindcss` — Styling
- `@supabase/supabase-js` — Supabase client
- `@supabase/ssr` — Supabase server-side auth helpers for Next.js

### AI & Content
- `@anthropic-ai/sdk` — Claude API client
- `@extractus/article-extractor` — URL content extraction
- `open-graph-scraper` — OG metadata
- `turndown` — HTML to markdown conversion
- `@mozilla/readability` — Fallback content extraction
- `jsdom` — DOM parser for Readability

### Utilities
- `date-fns` — Date formatting and timezone handling
- `date-fns-tz` — Timezone-aware date operations
- `lucide-react` — Icon library (clean, minimal)
- `sonner` — Toast notifications

## Development Environment Setup

```bash
# Clone the repo
git clone https://github.com/elledenko/linkdrop.git
cd linkdrop

# Install dependencies
npm install

# Copy env file and fill in real values
cp .env.example .env.local

# Run Supabase migrations
supabase link --project-ref <ref>
supabase db push --linked

# Start dev server
npm run dev
```

## Deployment

- **Platform:** Vercel
- **Build command:** `next build`
- **Output directory:** `.next`
- **Node.js version:** 20.x
- **Environment variables:** Set via Vercel CLI for production + development environments
- **Cron/scheduling:** Supabase pg_cron + Edge Functions (not Vercel cron — Hobby plan limits are too restrictive for AI workloads)

## Cost Estimates (V0.1 at 10 users)

| Service | Plan | Estimated Monthly Cost |
|---------|------|----------------------|
| Supabase | Free tier | $0 (500MB DB, 1GB storage, 2GB bandwidth) |
| Anthropic | Pay-as-you-go | ~$15-30 (assuming ~5 links/user/day, 10 users) |
| Vercel | Hobby | $0 |
| **Total** | | **~$15-30/mo** |
