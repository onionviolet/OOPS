# Prompt: implement the protagonist's life, then open the seat (2026-10-27)

Status: a brief for a GM session. Not launched. Proposals from the canon-protagonist
report (Parts G and H); nothing here is accepted until Weibao says so. Register row:
[WRITEUP_REGISTER](WRITEUP_REGISTER.md). Weibao's request: work through implementing
the protagonist's life from the book worlds; implement everything that life requires;
then transfer that to playing as someone else and to the rest of the world's detail.

## The brief (paste into a fresh GM session)

Role: GM for the protagonist-first world pipeline. Opus plans and reviews; Sonnet lanes
build; Haiku reads bounded shards (AU rules, one coordinator, one shared budget).
Read first: `AGENTS.md`, `docs/GROUND_RULES.md`, `docs/RULES_INDEX.md` (cite codes),
`docs/research/CANON_PROTAGONIST_INTERACTIONS_2026-10-27.md` Parts G and H (PX43 to
PX64), `docs/research/TIME_TRAVEL_AND_SEEDED_WORLDS_2026-10-27.md` (C1 to C12),
`docs/research/CONCEPTUAL_ABILITIES_ENGINE_AUDIT_2026-10-27.md` (resolver, deltas),
`docs/WORLD_ENTRY_RULES.md`, `docs/WORLD_COMPLETION_STANDARD.md`, `docs/WORLD_PASS_RULES.md`,
`docs/gm/WRITEUP_REGISTER.md`, `docs/gm/SHARED_WORKTREE_PRACTICE.md`.

Goal: for each target world, build a playable, testable run of the **protagonist's
life** (their path, every place, item, price, law and person they touch), proven by a
scripted lead and a null-player golden run; then use what that run required as the
checked core of the world; then open the seat to a player who is not the protagonist.

Order of work (stop at each gate and write a checkpoint):

1. **Plan pass (Opus, docs only).** Write `docs/gm/dispatch/protagonist-life-2026-10-27/PLAN.md`:
   targets in order (Village mini-line PX64 first, then HP routine beats, then the LOTM
   one-month pilot; a public-domain book such as *Dracula* only after an edition check);
   lane table with owned files, model, effort, done check; engine prerequisites in order
   (C1/C2 keyed shop-stock test; CAE-E1/E2/E4 reference resolver) and who owns each;
   evidence labels; stop conditions. Ask the advisor once on build order before lanes start.
2. **Lead-run table (per world).** One row per beat: date, place, dependencies, touched
   facts, evidence label ([S] source locator, [I] inference, [U] unsettled). Paraphrase
   only; raw source text stays in gitignored `docs/research/<source>/private/` (research
   rules). Sealed truths appear by ID only.
3. **World facts for the touched set.** Create every place, item, price, law and person
   the lead run touches as pack data, using existing seams (world packs, WA5: engine owns
   verbs, worlds own nouns). Engine changes only where the prerequisites in step 1 say so.
4. **Scripted lead and golden run.** A bot plays the lead through the same public commands
   a player uses (no teleport, no cheat verbs). Canon outcomes are assertions on their
   dates. The null-player run (player absent, lead as NPC) must reproduce the same outcomes.
   Seeded-day determinism is required so the run repeats; if it is not yet landed, build
   the C1/C2 slice first.
5. **Open the seat.** Same world with the lead as an NPC and the player `beside`
   (recommended default), then `follow` and `bystander`. Add exposure by beat footprint
   (PX43 to PX46), role slots (PX47), and the influence ledger (PX42) only as the lead
   run needs them. Bystander smoke test: seven world days with lodging, food, work, rumor.
6. **Transfer to the rest of the world.** Take the touched-set pattern (facts, schedules,
   clocks as records scoped to life facts, return-note lines) and extend to districts and
   people the lead never touched, in layers L1 then L2 (report H.1). Mark each layer
   `lead-complete`, `world-complete` or `seat-complete`; completion is authored delivery,
   not a required playthrough (WORLD_COMPLETION_STANDARD).

Gates for every step: AD36 efficient verification, AD43 six-line floor, focused tests
only in lanes, one full `npm test` by the committer, `check:arch` and `check:rules`;
browser evidence at 1920x1080 and 1536x864 for UI claims; label anything unexercised as
implemented-unverified. Save, reload and import must keep beat results (M8). One line
per check in the checkpoint; "agent-verified, not human-reviewed" unless Weibao reviewed.

Authority and stops. This brief authorizes the plan pass and the Village mini-line. It
does not authorize: pushing, merging a branch, bulk source collection (needs Weibao's
yes, AU13), changing a save schema without an additive migration, or accepting any
proposal. Stop and ask Weibao on: the LOTM start month and HP cohort offset (D3), the
WER11 rewording (D2), edition choice for a book, any change that alters existing saves,
and any outward-facing step. Agent proposals are not "accepted". Pronouns: they/them for
people whose pronouns are not stated; canon characters use their canon pronouns.

Parallelism: one writer per file area; no overlapping lanes; lane briefs name their
codes and link their owners. Detach long runs; stop by PID or group, never `pkill -f`.
Commit only your own paths from a fresh HEAD; no stash, reset or force; no push; no
`Co-Authored-By` trailer.

Report when done with a step: files changed, checks run (command, result, gaps), what
the lead run required that was not on the first list (this is the finding that improves
the next world), and the remaining gate.

## More to consider (for the brief itself)

- **The finding that matters is the delta.** What the lead run needed that the first
  world list missed is the checklist for the next world; record it per world.
- **Order by cheapest to verify**, not by importance: public mini-line, then HP, then LOTM.
- **Do not let the bot cheat.** A passing run through a shortcut proves nothing.
- **Time travel and determinism come first.** Without repeatable days the golden run
  cannot be trusted.
- **Keep the protagonist out of the player's way.** The lead is an NPC life with their own
  needs and information limits (PX32, PX38); the player influences, does not puppeteer.
- **Spoiler and prose rules:** perception text per witness level (PX49); sealed truths
  by ID; changed or randomized truths stay sealed.

## Update 2026-10-27 (Weibao): start with a real book world, pick the pilot by score

Weibao's words: "We should start with an actuall book world, maybe the first arc or
volume or something, or consider the best series to do this on for the most results?"
This supersedes the "Village mini-line first" order above: the mini-line stays only as a
small engine harness, not the pilot. The plan pass must choose the pilot book and its
first arc or volume by score, then default to the highest score.

**Pilot criteria (score each 0 to 3, show the table):**
1. *Dated beats:* the arc has dates or a clear order the extractor can use.
2. *Bounded cast and places:* few enough to finish the touched set in one pass.
3. *Existing implementation:* how much of the touched set already exists in `src/`.
4. *Source in hand:* local file or already-summarized deep dive (`docs/research/<source>/`,
   `docs/research/novels/LOCAL_LIBRARY.md`); no new bulk collection.
5. *Lead-run clarity:* the protagonist's path is well defined, with known consequences.
6. *Determinism fit:* repeatable days matter (a loop or a calendar helps the golden run).
7. *Reusability:* how much the finished touched set teaches the next world.
8. *Spoiler and sealed-secret load:* lower is easier (sealed truths stay by ID).
9. *Weibao's interest and the project's existing investment.*
Shortlist to score (add others if the plan pass finds a better fit): Lord of the Mysteries
volume 1 (Klein in Tingen; deepest existing implementation, local epub), Harry Potter
year 1 (school calendar gives schedules), Mother of Learning arc 1 (a repeating month
suits golden runs and the seeded-day work), and the public-domain *Dracula* as the
method dry run. Default if scores tie or the plan pass cannot read enough: LOTM volume 1.
The plan pass also states which arc boundary counts as "first arc" and what is out of scope.
