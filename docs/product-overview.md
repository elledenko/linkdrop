# LinkDrop — Product Overview

## Problem
People find cool stuff online all day — articles, tools, tweets, videos — and have no good way to collect it, make sense of it, and share it. They copy-paste into Notes, bookmark and forget, or manually assemble newsletter-style posts. Nothing connects "save a link" to "publish a curated daily digest in my voice."

## Target User
Content-curious professionals — developers, creators, VCs, journalists, knowledge workers — who consume a lot and want to share what they find without the overhead of running a full newsletter.

## Core Value Proposition
Paste links throughout the day. AI summarizes each one. At your chosen time, LinkDrop compiles everything into a newsletter-style daily digest written in your voice — ready to copy and export to LinkedIn, Medium, Substack, or X.

## V0.1 Feature Set

### In
- **User accounts** — email + social login (Google, GitHub), multi-user (cap 10 for V0.1)
- **Voice profile onboarding** — "About you" section, writing sample uploads, tone/style capture
- **Timezone + digest time** — user sets when their daily digest auto-generates
- **Link input** — paste URL, browser bookmarklet, browser extension (Chrome)
- **Auto-summarization** — on paste, AI fetches the page and generates a summary
- **User notes** — add your own take alongside the AI summary on any link
- **File uploads** — images, screenshots, PDFs, any file type alongside links
- **Daily folders** — links auto-organized by date, filing-cabinet style UI
- **Daily digest generation** — AI reads all the day's links + summaries + user notes, writes a cohesive newsletter-style post in the user's voice
- **Export buttons** — one-click copy formatted for LinkedIn, Medium, X, Substack
- **Shareable digest link** — each daily digest gets a unique URL anyone can view

### Out (for now)
- Direct platform integrations (post to LinkedIn/X automatically)
- Payments / subscription billing
- Mobile-native app (responsive web only)
- Team/collaboration features
- RSS feed import
- Analytics on shared digests
- Browser extension for Firefox/Safari

## Tech Stack
- **Frontend:** Next.js (App Router) + Tailwind CSS
- **Backend:** Supabase (Auth, Postgres, Storage)
- **AI:** Claude API (Opus 4.6) — link summarization + voice-matched digest writing
- **Deployment:** Vercel
- **Language:** TypeScript

## Design Direction
- **Filing cabinet metaphor** — daily folders as color-coded tabbed dividers (inspired by Remington Rand Variadex + Sam's Secret Files)
- **Warm editorial palette** — cream, amber, orange, coral backgrounds. Not clinical SaaS
- **Reading-friendly typography** — magazine/book feel for the digest view
- **Illustrated onboarding** — warm, inviting signup flow
- **Desktop-first** — spacious layout, sidebar navigation

## Success Metric
A user can paste 5 links throughout the day and get a well-written, voice-matched daily digest they'd actually want to share.
