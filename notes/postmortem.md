# LinkDrop — Living Postmortem

## Phase 1: INTAKE — 2026-03-31T23:00:00Z

**What happened:** User described a link curation app with daily folders, auto-summaries, and shareable daily digest. Clear vision from the start.
**What worked:** User had a strong mental model of the product. Summary confirmed quickly.
**What didn't:** Nothing — clean intake.
**Adjustment:** This user is a builder with clear vision. Keep things moving fast, don't over-explain.

## Phase 2: RESEARCH — 2026-03-31T23:10:00Z

**What happened:** Full market research — competitors, market sizing, target users. Found strong go signal. Pocket shutdown created a market window. No tool connects paste→summarize→digest→share.
**What worked:** Competitor table format was clear. Gap analysis resonated.
**What didn't:** Nothing notable — user was ready to go quickly.
**Adjustment:** User reads fast, decides fast. Don't belabor research findings.

## Phase 3: DEFINE — 2026-03-31T23:15:00Z

**What happened:** Onboarding questions, deep questions, inspo collection. User added key differentiator mid-flow: voice profiling + platform-specific export. Wants Claude Opus 4.6 for quality.
**What worked:** Batched questions worked well. User responded quickly with clear answers. Inspo images were excellent — vintage filing cabinet aesthetic with warm editorial palette.
**What didn't:** Nothing — smooth flow.
**Adjustment:** User contributes ideas mid-flow (voice profiling came unprompted). Leave room for that. User values quality — chose Opus 4.6 over cheaper models.

## Phase 4: ROADMAP — 2026-03-31T23:20:00Z

**What happened:** 5 milestones laid out. User approved immediately.
**What worked:** Clean sequential dependencies, realistic scope.
**What didn't:** Nothing.
**Adjustment:** Keep roadmaps concise. This user doesn't need extensive justification.

## Phase 5: FOUNDATION — 2026-03-31T23:25:00Z

**What happened:** Wrote all three foundation docs — tech resources, system architecture, wireframes. 7 wireframes covering full user flow.
**What worked:** Filing cabinet wireframes captured the inspo well. System architecture comprehensive — 5 tables, full API design, RLS policies.
**What didn't:** Nothing flagged by user.
**Adjustment:** User responds "luv" to good work — brief positive signals. Don't ask for elaboration, just keep moving.

## Phase 6: SETUP — 2026-03-31T23:35:00Z

**What happened:** Scaffolded Next.js app, created Supabase project (had to use fiire org due to free tier limits on elledenko's org), pushed to GitHub, deployed to Vercel.
**What worked:** CLI-driven setup was smooth. Supabase provisioning, Vercel linking, env var setup all automated.
**What didn't:** Supabase free tier limit hit on first org — had to switch orgs. Git push auth failed initially (needed gh auth setup-git). User got a macOS keychain prompt they didn't understand.
**Adjustment:** Always check org billing status before creating projects. Run gh auth setup-git proactively.

## BUILD Phases 1-3 — 2026-04-01T00:00:00Z

**What happened:** Built the entire app in one session — auth, onboarding, link engine, digest generator, landing page. User asked to work independently without check-ins until V1 is on Vercel.
**What worked:** Combined phases 1-3 into one build push to move fast. Build compiled on second attempt. All routes working. Clean deployment.
**What didn't:** Two build errors: (1) JSX single quote escaping in onboarding placeholder, (2) article-extractor doesn't accept headers option. Both fixed quickly.
**Adjustment:** User prefers autonomous work — "don't check in until v1 is on vercel." Respect this and batch work. Test builds early to catch type errors.

## BUILD Phase 4: Extension + Bookmarklet — 2026-04-01T00:05:00Z

**What happened:** Built Chrome extension (Manifest V3) with popup UI, save functionality, and simple generated icons. Bookmarklet available in settings.
**What worked:** Extension follows the app's design language (warm cream, orange accents).
**What didn't:** Extension auth is basic — relies on stored session token. Will need proper OAuth flow for production.
**Adjustment:** For V0.1, simple auth is fine. Extension is a nice-to-have, not the core product.

## BUILD Phase 5: Polish + README — 2026-04-01T00:10:00Z

**What happened:** Wrote comprehensive README, progress notes, feature notes. Final deployment.
**What worked:** Clean build, all routes rendering, full feature set deployed.
**What didn't:** No smoke test of actual user flow yet (needs Anthropic API key + email confirmation disabled).
**Adjustment:** Need to verify the full flow once user adds their API key.
