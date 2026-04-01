# Phases 1-3 Feature Notes

## Phase 1: Core Shell + Auth + Design System
- Supabase auth with email, Google, GitHub
- Session middleware protecting dashboard routes
- Auto-redirect unauthenticated users to login
- Auto-redirect to onboarding if profile incomplete
- 3-step onboarding: about you → writing samples → digest schedule
- Filing cabinet sidebar layout with color-coded daily tabs (Variadex-inspired)
- Warm editorial design system: cream (#FDF6EC), amber, orange, coral palette
- Auto-creates profile on signup via database trigger

## Phase 2: Link Engine
- Paste URL → save to daily folder
- Background content extraction via @extractus/article-extractor
- Auto-summarization via Claude Opus 4.6
- OG metadata extraction (title, description, image, site name)
- User notes on each link card
- File/image uploads via Supabase Storage
- Upload cards with preview for images
- Daily folder view with interleaved links + uploads sorted by time
- Sidebar date navigation (last 30 days)
- Add link modal with URL input + file drop zone

## Phase 3: Daily Digest Generator
- Claude Opus 4.6 generates newsletter-style digest from daily links
- Voice matching using user's bio, writing style description, and writing samples
- Theme grouping with emoji section headers
- Platform-specific exports: LinkedIn, Medium, X, Substack
- One-click copy buttons for each platform
- Public shareable digest pages at /d/[slug]
- OG metadata on public pages for rich link previews
- Magazine-style digest reading layout with serif typography
- Manual "Generate Now" button on dashboard
- Digest archive in sidebar
