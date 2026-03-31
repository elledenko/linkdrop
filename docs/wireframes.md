# LinkDrop — Wireframes

Design direction: Filing cabinet metaphor, warm editorial palette (cream, amber, orange, coral), desktop-first, magazine-style reading.

---

## Color System

```
Background:     #FDF6EC (warm cream)
Surface:        #FFF8F0 (light warm white)
Primary:        #E8720C (burnt orange)
Primary Hover:  #D4650A (darker orange)
Accent:         #F4A261 (amber/golden)
Text Primary:   #2D2319 (warm dark brown)
Text Secondary: #7A6B5D (warm gray)
Border:         #E8DDD0 (warm light border)
Tab Colors:     Rotating palette inspired by Variadex —
                #E07A5F (coral), #F4A261 (amber), #E9C46A (gold),
                #81B29A (sage), #5B8E7D (teal), #7B9EA8 (slate blue),
                #C77DBA (mauve), #D4A5A5 (dusty rose)
```

---

## 1. Landing Page (`/`)

```
┌─────────────────────────────────────────────────────────────────────┐
│  ┌─────────┐                              [Log In]  [Get Started]  │
│  │ LinkDrop│                                                       │
│  └─────────┘                                                       │
│                                                                     │
│                                                                     │
│          Drop your links. Get a daily digest.                       │
│          Written in your voice.                                     │
│                                                                     │
│          Paste links throughout the day. AI summarizes each one.    │
│          At the end of the day, get a newsletter-style post         │
│          ready to share on LinkedIn, Medium, X, or Substack.       │
│                                                                     │
│                    [ Get Started — Free ]                            │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                                                             │    │
│  │          [ Illustration of filing cabinet with              │    │
│  │            colorful tabs, links flowing in,                 │    │
│  │            newsletter flowing out ]                         │    │
│  │                                                             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  📎 Paste    │  │  🤖 AI       │  │  📰 Share    │              │
│  │  Drop any    │  │  Auto-summary│  │  One-click   │              │
│  │  link, file, │  │  + voice-    │  │  export to   │              │
│  │  or image    │  │  matched     │  │  any platform│              │
│  │              │  │  digest      │  │              │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                     │
│                         LinkDrop © 2026                              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Login Page (`/login`)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐    │
│  │                          │  │                              │    │
│  │   [ Warm illustration    │  │   Welcome to LinkDrop        │    │
│  │     of person at desk    │  │                              │    │
│  │     with filing cabinet  │  │   ┌────────────────────────┐ │    │
│  │     and floating links ] │  │   │ Continue with Google   │ │    │
│  │                          │  │   └────────────────────────┘ │    │
│  │                          │  │   ┌────────────────────────┐ │    │
│  │                          │  │   │ Continue with GitHub   │ │    │
│  │   "Your daily finds,     │  │   └────────────────────────┘ │    │
│  │    in your voice."       │  │                              │    │
│  │                          │  │   ──── or sign up with ───── │    │
│  │                          │  │                              │    │
│  │                          │  │   Email                      │    │
│  │                          │  │   ┌────────────────────────┐ │    │
│  │                          │  │   │                        │ │    │
│  │                          │  │   └────────────────────────┘ │    │
│  │                          │  │   Password                   │    │
│  │                          │  │   ┌────────────────────────┐ │    │
│  │                          │  │   │                        │ │    │
│  │                          │  │   └────────────────────────┘ │    │
│  │                          │  │                              │    │
│  │                          │  │   [ Continue ─── orange btn] │    │
│  │                          │  │                              │    │
│  └──────────────────────────┘  └──────────────────────────────┘    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Onboarding — Voice Profile (`/onboarding`)

Multi-step form. Warm cream background, progress bar at top.

```
┌─────────────────────────────────────────────────────────────────────┐
│  LinkDrop                                           Step 2 of 4    │
│  ═══════════════════════════════░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │
│                                                                     │
│                                                                     │
│         Tell us about you                                           │
│                                                                     │
│         This helps LinkDrop write your daily digest                 │
│         in a voice that sounds like you.                            │
│                                                                     │
│         What do you do?                                             │
│         ┌────────────────────────────────────────────────┐          │
│         │ e.g., "I'm a VC who writes about fintech..."  │          │
│         │                                                │          │
│         │                                                │          │
│         └────────────────────────────────────────────────┘          │
│                                                                     │
│         Describe your writing style                                 │
│         ┌────────────────────────────────────────────────┐          │
│         │ e.g., "Casual but smart. I use humor and      │          │
│         │ analogies. Short paragraphs."                  │          │
│         └────────────────────────────────────────────────┘          │
│                                                                     │
│         Upload writing samples (optional)                           │
│         ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐          │
│           Drop files here or click to upload                        │
│         │ Blog posts, tweets, newsletters — anything    │          │
│           that sounds like you                                      │
│         └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘          │
│         sample_post.txt ✕                                           │
│         my_newsletter.md ✕                                          │
│                                                                     │
│                          [Back]  [Continue →]                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Onboarding steps:**
1. Welcome — name, email confirmed
2. About You — bio, writing style, sample uploads (shown above)
3. Preferences — timezone picker, digest time (hour selector)
4. Ready — confirmation, go to dashboard

---

## 4. Dashboard — Filing Cabinet View (`/dashboard`)

The main app view. Left sidebar, center is the filing cabinet with daily tabs.

```
┌─────────────────────────────────────────────────────────────────────┐
│  LinkDrop                                    🔔  [+ Add Link]  👤  │
├──────────┬──────────────────────────────────────────────────────────┤
│          │                                                          │
│  TODAY   │  ┌─── March 31, 2026 ──────────────────────────────────┐ │
│          │  │ CORAL TAB                                     12 links│
│  ────    │  ├─────────────────────────────────────────────────────┐ │
│          │  │                                                     │ │
│  Mar 31 ◄│  │  ┌─────────────────────────────────────────────┐   │ │
│  Mar 30  │  │  │ 🔗 The Future of AI Agents                  │   │ │
│  Mar 29  │  │  │ techcrunch.com                               │   │ │
│  Mar 28  │  │  │                                              │   │ │
│  Mar 27  │  │  │ AI: Explores how autonomous agents are      │   │ │
│  Mar 26  │  │  │ reshaping software development workflows...  │   │ │
│  Mar 25  │  │  │                                              │   │ │
│          │  │  │ You: "This is exactly what we're building    │   │ │
│  ────    │  │  │ at work. The multi-agent pattern is 🔑"     │   │ │
│          │  │  │                                    [···]     │   │ │
│  DIGESTS │  │  └─────────────────────────────────────────────┘   │ │
│  ────    │  │                                                     │ │
│  Mar 30  │  │  ┌─────────────────────────────────────────────┐   │ │
│  Mar 29  │  │  │ 📷 screenshot.png                           │   │ │
│  Mar 28  │  │  │ Uploaded • 2.4 MB                           │   │ │
│          │  │  │                                              │   │ │
│  ────    │  │  │ You: "Insane UI from the new Linear update" │   │ │
│          │  │  │                                    [···]     │   │ │
│  ⚙️      │  │  └─────────────────────────────────────────────┘   │ │
│ Settings │  │                                                     │ │
│          │  │  ┌─────────────────────────────────────────────┐   │ │
│          │  │  │ 🔗 Why Every Developer Should Write         │   │ │
│          │  │  │ dev.to                                       │   │ │
│          │  │  │                                              │   │ │
│          │  │  │ AI: A compelling argument for developers     │   │ │
│          │  │  │ to maintain a writing practice...            │   │ │
│          │  │  │                                              │   │ │
│          │  │  │ ✏️ Add your note...                          │   │ │
│          │  │  │                                    [···]     │   │ │
│          │  │  └─────────────────────────────────────────────┘   │ │
│          │  │                                                     │ │
│          │  └─────────────────────────────────────────────────────┘ │
│          │                                                          │
│          │  ┌─────────────────────────────────────────────────────┐ │
│          │  │  📰 Generate Today's Digest    [ Generate Now ]    │ │
│          │  │  Auto-generates at 6:00 PM EST                     │ │
│          │  └─────────────────────────────────────────────────────┘ │
│          │                                                          │
└──────────┴──────────────────────────────────────────────────────────┘
```

**Key elements:**
- **Left sidebar:** Date list (filing cabinet tabs — each date gets a color from the rotating palette), digest archive, settings
- **Center:** Today's links and uploads in a scrollable feed
- **Each link card:** Title, source domain, OG image (if available), AI summary (labeled "AI:"), user note (labeled "You:"), action menu (edit, delete)
- **Upload cards:** Thumbnail, filename, size, user note
- **Bottom bar:** Digest generation trigger + scheduled time display
- **Top right:** Add link button (opens paste modal), notifications, avatar

---

## 5. Add Link Modal

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Drop a link                                          ✕    │
│                                                             │
│   ┌───────────────────────────────────────────────────────┐ │
│   │ https://                                              │ │
│   └───────────────────────────────────────────────────────┘ │
│                                                             │
│   ── or ──                                                  │
│                                                             │
│   ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ │
│     Drop a file, image, or screenshot here                  │
│   │                                                       │ │
│     PNG, JPG, PDF, up to 50MB                               │
│   └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘ │
│                                                             │
│   Add your take (optional)                                  │
│   ┌───────────────────────────────────────────────────────┐ │
│   │ What's interesting about this?                        │ │
│   └───────────────────────────────────────────────────────┘ │
│                                                             │
│                                    [ Save to Today's Drop ] │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Digest View (`/digest/[id]`)

Magazine-style reading layout. This is the same view for private and public (`/d/[slug]`), just with/without edit controls.

```
┌─────────────────────────────────────────────────────────────────────┐
│  LinkDrop                              [← Back]  [Share]  [Export] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                                                             │    │
│  │              Monday, March 31, 2026                         │    │
│  │              ─────────────────────                          │    │
│  │                                                             │    │
│  │              Today's Drop                                   │    │
│  │              12 links · 3 uploads                           │    │
│  │                                                             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────── article width ───────────────────────┐    │
│  │                                                             │    │
│  │  Happy Monday! Today was a deep dive into the AI agent      │    │
│  │  space, with a few design gems sprinkled in. Here's         │    │
│  │  what caught my eye...                                      │    │
│  │                                                             │    │
│  │  ── 🤖 AI & AGENTS ──────────────────────────────────────   │    │
│  │                                                             │    │
│  │  The Future of AI Agents (TechCrunch)                       │    │
│  │  Autonomous agents are finally moving from demo to          │    │
│  │  production. The key shift? Multi-agent orchestration       │    │
│  │  patterns that let agents delegate to specialists...        │    │
│  │  → Read the full article                                    │    │
│  │                                                             │    │
│  │  Why Every Developer Should Write (dev.to)                  │    │
│  │  A surprisingly good argument for developers maintaining    │    │
│  │  a regular writing habit. The ROI isn't just "thought       │    │
│  │  leadership" — it's clearer thinking...                     │    │
│  │  → Read the full article                                    │    │
│  │                                                             │    │
│  │  ── 🎨 DESIGN ───────────────────────────────────────────   │    │
│  │                                                             │    │
│  │  [screenshot.png thumbnail]                                 │    │
│  │  Linear just dropped an update and the UI is *chef's kiss*. │    │
│  │  The attention to micro-interactions here is next level...  │    │
│  │                                                             │    │
│  │  ── 🔗 EVERYTHING ELSE ──────────────────────────────────   │    │
│  │                                                             │    │
│  │  ...                                                        │    │
│  │                                                             │    │
│  │  ───────────────────────────────────────────────────────    │    │
│  │  That's today's drop. See you tomorrow.                     │    │
│  │                                                             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────── Export ───────────────────────────────┐   │
│  │                                                              │   │
│  │  [ 📋 LinkedIn ]  [ 📋 Medium ]  [ 📋 X ]  [ 📋 Substack ] │   │
│  │                                                              │   │
│  │  [ 🔗 Copy Share Link ]                                     │   │
│  │  linkdrop.app/d/elle-2026-03-31                              │   │
│  │                                                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Key elements:**
- **Header area:** Date, title, link/upload count
- **Body:** AI-generated newsletter in the user's voice, organized by theme/category
- **Links within:** Each referenced article has a "Read the full article" link back to the original
- **Images:** Uploaded images displayed inline in the digest
- **Export bar:** One-click copy buttons for each platform, shareable public URL
- **Typography:** Large, readable serif or clean sans-serif. Magazine feel. Generous line height and margins.

---

## 7. Settings (`/settings`)

```
┌─────────────────────────────────────────────────────────────────────┐
│  LinkDrop                                                     👤   │
├──────────┬──────────────────────────────────────────────────────────┤
│          │                                                          │
│  Profile │   Settings                                               │
│  Voice   │   ─────────────────                                      │
│  Schedule│                                                          │
│  Account │   VOICE PROFILE                                          │
│          │   ┌─────────────────────────────────────────────────┐    │
│          │   │ About you                                       │    │
│          │   │ ┌─────────────────────────────────────────────┐ │    │
│          │   │ │ I'm a VC who writes about fintech and      │ │    │
│          │   │ │ developer tools...                          │ │    │
│          │   │ └─────────────────────────────────────────────┘ │    │
│          │   │                                                 │    │
│          │   │ Writing style                                   │    │
│          │   │ ┌─────────────────────────────────────────────┐ │    │
│          │   │ │ Casual but smart. Short paragraphs.        │ │    │
│          │   │ └─────────────────────────────────────────────┘ │    │
│          │   │                                                 │    │
│          │   │ Writing samples                                 │    │
│          │   │ sample_post.txt ✕                               │    │
│          │   │ my_newsletter.md ✕                              │    │
│          │   │ [+ Upload more samples]                         │    │
│          │   └─────────────────────────────────────────────────┘    │
│          │                                                          │
│          │   DIGEST SCHEDULE                                        │
│          │   ┌─────────────────────────────────────────────────┐    │
│          │   │ Timezone:  [America/New_York        ▾]         │    │
│          │   │ Generate at: [6:00 PM               ▾]         │    │
│          │   │ Auto-generate: [ON]                             │    │
│          │   └─────────────────────────────────────────────────┘    │
│          │                                                          │
│          │   BOOKMARKLET & EXTENSION                                │
│          │   ┌─────────────────────────────────────────────────┐    │
│          │   │ Drag this to your bookmarks bar:                │    │
│          │   │ [ 📎 Save to LinkDrop ]  ← draggable            │    │
│          │   │                                                 │    │
│          │   │ Chrome Extension:                               │    │
│          │   │ [ Install Extension → ]                         │    │
│          │   └─────────────────────────────────────────────────┘    │
│          │                                                          │
│          │                              [ Save Changes ]            │
│          │                                                          │
└──────────┴──────────────────────────────────────────────────────────┘
```

---

## User Flow Summary

```
Sign Up → Onboarding (about, voice, timezone, digest time)
    │
    ▼
Dashboard (filing cabinet — today's folder)
    │
    ├── Paste URL → auto-fetch → AI summary → card appears
    ├── Upload file → card appears
    ├── Add notes to any card
    │
    ▼
End of day → digest auto-generates (or manual trigger)
    │
    ▼
Digest View (newsletter-style post in user's voice)
    │
    ├── Copy for LinkedIn
    ├── Copy for Medium
    ├── Copy for X
    ├── Copy for Substack
    └── Share public link → linkdrop.app/d/username-2026-03-31
```
