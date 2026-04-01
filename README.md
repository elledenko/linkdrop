# LinkDrop

**Your daily finds, in your voice.**

Paste links throughout the day. AI summarizes each one. At the end of the day, get a newsletter-style post written in your voice — ready to share on LinkedIn, Medium, X, or Substack.

## Features

- **Paste any link** — auto-extracts metadata, OG images, and full article content
- **AI summarization** — Claude Opus 4.6 reads each link and writes a concise summary
- **Voice profiling** — set up your writing style during onboarding, upload writing samples
- **Daily folders** — links organized by date in a filing-cabinet-style UI
- **Daily digest** — AI compiles all your links into a cohesive newsletter post in your voice
- **Export anywhere** — one-click copy formatted for LinkedIn, Medium, X, or Substack
- **Shareable links** — every digest gets a public URL you can share
- **File uploads** — images, screenshots, PDFs alongside your links
- **Chrome extension** — save links from any page
- **Bookmarklet** — works in any browser

## Tech Stack

- **Frontend:** Next.js 16 (App Router) + Tailwind CSS 4
- **Backend:** Supabase (Auth, Postgres, Storage)
- **AI:** Claude API (Opus 4.6) via @anthropic-ai/sdk
- **Deployment:** Vercel
- **Language:** TypeScript

## Getting Started

```bash
# Clone
git clone https://github.com/elledenko/linkdrop.git
cd linkdrop

# Install
npm install

# Set up environment
cp .env.example .env.local
# Fill in your Supabase and Anthropic API keys

# Run migrations
supabase link --project-ref <your-ref>
supabase db push --linked

# Start dev server
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude |

## Chrome Extension

1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/` directory

## Project Structure

```
linkdrop/
├── src/
│   ├── app/          # Next.js pages and API routes
│   ├── components/   # React components
│   └── lib/          # Supabase clients, Claude API, extractors
├── extension/        # Chrome extension (Manifest V3)
├── supabase/         # Database migrations
├── docs/             # Product docs, architecture, wireframes
└── notes/            # Progress notes, feature notes, postmortem
```

## License

MIT
