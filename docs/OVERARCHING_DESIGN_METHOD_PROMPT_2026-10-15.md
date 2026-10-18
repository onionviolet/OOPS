# Prompt: find the core and other aspects of YAIR's overarching design

Saved 2026-10-15. Weibao: "make a prompt to decide the best way to figure out
core and Other aspects to consider? We need to work on the overarching design
level stuff accordingly? Like representations, style, and much more?"

## Live direction question workflow, 2026-10-15

Saved at [Weibao's request](USER_VISION.md#anchors-trade-cheat-correction-and-discussion-workflow-2026-10-15).
Use this section for the ongoing conversation. The original discovery-audit
prompt below is preserved for a separately requested rerun; do not restart that
audit, dispatch workers or implement its proposals merely to continue discussion.

Read the [direction summary](DIRECTION_SUMMARY.md), [live handoff](gm/OVERARCHING_DIRECTION_HANDOFF_2026-10-15.md),
latest original answer in USER_VISION, PROJECT accepted rows and only the relevant
owner sections. Inspect dirty state before writing; current chat owns shared
gameplay direction docs, while the representation chat has its own exclusive
record. No unsolicited full reread, reference survey or new decision registry.

| Step | Repeatable action and check |
| --- | --- |
| QW1, recover | Find the pending question and exact latest correction. Existing accepted direction outranks agent defaults, audits and old handoffs. |
| QW2, interpret | Separate an explicit acceptance from tentative examples, requests for consideration and unresolved details. "Sure" accepts the immediately stated default only as qualified by the rest of the answer, not every adjacent proposal. Preserve ambiguity when it does not block progress. |
| QW3, reflect | Apply more-to-consider proportionately: trace consequences, interacting systems, lore/means, lifecycle, recovery and knowledge. Inspect a named uncertainty; use source research only when needed, and label what was not verified. Add useful options without turning every implication into an implementation gate. |
| QW4, record | Quote the answer verbatim in USER_VISION. Update PROJECT and affected existing design owners for accepted direction; save implications as proposals there or in the core audit. Summary links owners. Keep codes stable; do not fabricate acceptance for suggested rules. |
| QW5, reconcile | Mark conflicting old proposals as dated history, preserving their reasoning/text where material. Fix current summaries at the point of use; chronological quotes stay intact. Do not broadly retire unrelated direction on the strength of an audit allegation. |
| QW6, verify | Check own edits for lost paragraphs, local links/anchors, formatting and consistency with the latest answer. Distinguish documentation from source/build/browser/save/human acceptance. No gameplay claim follows from saving direction. |
| QW7, continue | Briefly report the saved outcome, material implications/corrections and one next question. Give a reasoned default plus reachable dials, with a concrete example when useful. Ask at most one consequential decision question when needed; answer all the user's other questions before it. |

### Question triage refinement, 2026-10-15

[Later user instruction](USER_VISION.md#experiment-predictions-and-consolidating-remaining-details-2026-10-15):
"alot of stuff can be answered stragiht forwardly". Do not extend this interview
by requesting confirmation of each implication of an already accepted rule.
Resolve routine reversible authoring/technical details within authorized scope;
label derived decisions and unaccepted recommendations accurately. A new default
is not accepted just because it sounds compatible with existing direction.

For an unresolved point, first classify it: already answered; straightforward
derivation; reversible implementation choice for a future slice; consequential
player preference; or uncertainty requiring focused evidence. Only a genuinely
consequential preference needs a user question. Investigate actual uncertainty
before asking. Batch useful adjacent details into the owning record; defer numeric
tuning until a concrete playable slice makes the tradeoff observable.

Ask at most one question in a discussion turn when needed, not exactly one in
every reply regardless of value. If no meaningful decision is ready, report what
was settled and what bounded review/evidence will identify the next one. A separate
authorized gap review may return at most five ranked questions with proposed
defaults, alternatives and why the answer changes play, without dispatching more
chats or implementing their suggestions. Preserve existing scope/ownership.

Choose the next question by actual unresolved dependency, not a mandatory numeric
OD order. User-raised restart/access uncertainty can precede remaining economy,
voice or recap topics. Do not ask the user to repeat an established preference.
Numeric tuning, schemas and implementation can wait until their parent direction
is clear. If no consequential choice remains for a topic, summarize and move on.

Keep gameplay, representation and engineering questions coordinated through
existing owners. Recommending a chat is distinct from an explicit request to
create/dispatch it. Authorized chats get disjoint scope/write ownership, relevant
accepted answers and an observable done check. No commit/push, source work or
messaging is implied by discussion or saving; follow current explicit authority.

Before context handoff, update the pending question, latest accepted answers,
remaining uncertainty, active chats and exclusive write scopes in the existing
handoff. Link this workflow rather than copy a competing contract.

## Original discovery-audit prompt (historical rerun mode)

Paste everything below the line into a fresh Claude or Codex session in
`/Users/weiwei/code/yet-another-idle-rpg`. It is a consideration run: no
source, build or dispatch changes.

---

## Task

YAIR keeps meeting design-level questions one at a time (format, Hanzi view,
Proto23 identity, tokens, way-back, scene panel). Each round finds "other
aspects" late. Your job is to (1) pick the best method for finding the
**core** overarching design aspects and the **other** aspects around them,
(2) run that method once, and (3) save it so it can be rerun.

"Overarching design" means decisions that shape every screen, world or
system at once: representation, visual style, voice, information hierarchy,
interaction grammar and more. Feature design is out of scope unless a
feature exposes a missing overarching rule.

## Read first (owners; link them, do not restate)

- `AGENTS.md`, `PROJECT.md` accepted decisions, `docs/USER_VISION.md`
  (standing UI priority, everything possible reasonably, sealed secrets,
  the 2026-10-14 and 2026-10-15 format/UI entries)
- `docs/FORMAT_AND_VIEW_DECISION_AUDIT_2026-10-14.md` (decision register,
  status keys W/P/O/N) and its rounds 2 and 3:
  `docs/UI_IDENTITY_AND_REPRESENTATION_CONSIDERATIONS_2026-10-14.md`,
  `docs/UI_FOUNDATION_DESIGN_ROUND_2026-10-15.md`
- `docs/YAIR_FORMAT_AND_STORY_DELIVERY_2026-10-14.md`,
  `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`,
  `docs/PRESENTATION_AND_FOURTH_WALL.md`, `docs/LIFE_SIM_NORTH_STAR.md`,
  `docs/DIRECTION_SYNTHESIS.md`, `docs/CORE_FOUNDATIONS_SCORECARD_2026-10-14.md`
- `docs/audits/TOPIC_EXPANSION_AUDIT_PLAYBOOK.md` (existing method for one
  topic; this prompt is the method for the level above topics)
- `docs/DESIGN_DEFAULTS_AUDIT.md`: how agent paraphrases became fake
  "rules", and the default / dial / reasonably rewrite. Every pillar and
  default you write must pass it
- Sibling owners at this level, headings first:
  `docs/UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md` (navigation, information,
  comfort, many worlds), `docs/SHARED_FOUNDATIONS_AUDIT_2026-10-12.md`,
  `docs/GENERATION_FOUNDATION_RULES_2026-10-14.md`,
  `docs/PLAY_BEYOND_MENU_SELECTORS_CONSIDERATIONS_2026-10-14.md`,
  `docs/RULEBOOKS_FOR_WORLDS_AND_GM_CONSIDERATIONS_2026-10-14.md`,
  `docs/worlds/MULTIVERSE_STRUCTURES.md`, `docs/WORLD_COMPLETION_STANDARD.md`
- Search `docs/` for any other owner before writing a new row.

Several owners are large (LIFE_SIM_NORTH_STAR is about 450 KB, UI_AT_SCALE
about 85 KB, DIRECTION_SYNTHESIS about 80 KB). Read headings, then grep;
never load them whole. No pillars document exists yet; that is a finding,
not permission to invent one.

The ui-foundation Codex lane (`docs/gm/dispatch/ui-foundation-2026-10-15/`)
owns the accepted Q4/Q5 build. Do not redesign what it is building; flag
conflicts only.

## Step 1: choose the method

Compare these candidate methods in one short table (what each finds, what it
misses, cost). Recommend a combination, with one sentence on why it works.

| Code | Method | Finds |
| --- | --- | --- |
| M1 | Inventory: harvest every design-level decision already in docs, with status | What exists, contradictions, orphans |
| M2 | Pillars top-down: 3 to 5 identity statements every decision must serve | The "why", tie-breakers |
| M3 | Player journey walk: first minute, first hour, a world jump, a prestige, a return after a week | Aspects felt in play that no doc owns |
| M4 | Cross-world stress test: apply each rule to 6 unlike worlds (base village, a Chinese cultivation book, JJK or Bleach, a status-window LitRPG, a nonhuman start, a comic-medium world) | Rules that only fit one world |
| M5 | Reference teardown: Proto23, NetHack, Bitburner, Dwarf Fortress, CDDA, Kenshi or others the docs name | Proven patterns and their costs |
| M6 | Retrofit-cost ranking: what gets expensive if decided late | Ordering |
| M7 | External critique via prompt-roundtrip skill | Blind spots |
| M8 | Weibao-quote mining: pull his own words on feel, style and taste from USER_VISION and PROJECT.md (for example "restraint makes effects land" in PRESENTATION_AND_FOURTH_WALL, "inherit more of Proto23's identity", "everything possible, reasonably") | Pillars grounded in his words, not agent paraphrase |
| M9 | Rule-drift scan: find agent-made absolutes posing as decisions, per DESIGN_DEFAULTS_AUDIT | Fake constraints before they become pillars |

Expected answer, to confirm or overturn with evidence: M1 + M9 to harvest
and clean, M8 to source the pillars (M2 drafts them only from M8 quotes),
M3 + M4 to find what no doc owns, ranked by M6. M5 and M7 only for a named
uncertainty.

## Step 2: run it

Seed aspect list. Extend it; drop nothing without a reason.

- **Identity:** pillars, tone, what YAIR is not
- **Semantic layer under representation:** the format audit's DV1 (one
  place model, skins draw it) generalized. Does each entity kind (place,
  person, item, ability, time, number, the player self) have one model that
  any skin, view, log line or cheat reads? Likely the strongest core
  candidate; verify it against code seams, do not assume it
- **Representation:** places, people, items, time, abilities, numbers, the
  player self across bodies and nonhuman starts, unknowns (Hanzi, ASCII,
  icons, prose, diagrams, portraits), diegetic vs overlay (status windows
  as in-world objects, fourth wall)
- **Style:** tokens, type, frame language, color meaning, motion, per-world
  skins over one base
- **Voice and text:** narrator, log grammar, naming, numbers in prose vs
  tables, line budget, localization and bilingual
- **Information hierarchy:** always visible, on demand, discovered; density
- **Interaction grammar:** modes, back rule, keyboard, confirm, undo,
  selectors beyond menus
- **Pacing and attention:** idle vs active, interrupts, notifications,
  session length, offline return
- **Discovery and knowledge:** what UI may reveal, sealed-secret leaks via
  layout, the player's knowledge vs the character's
- **World variation:** what changes per world vs stays fixed
- **Scale:** many worlds, many systems, hundreds of panels, long saves
- **Feedback and juice:** text VFX, receipts, numbers, sound (if ever)
- **Accessibility and comfort:** contrast, glyph names, font size, colorblind
- **Onboarding and legibility:** how a new system teaches itself
- **Governance:** contracts and tests that stop drift across parallel
  lanes; a writing and naming guide for the agents who author text, since
  they produce most of the voice
- **Cost of style:** font weight (CJK subsets), DOM size, animation budget
- **Settings and saves:** which representation choices are player settings,
  whether they save, and that saves stay skin-independent (format audit MC5)
- **Inspection:** how debug and cheat views look and what they may reveal

Sort every aspect with these tests:

- **Core** if at least two hold: touches every screen or world; costly to
  retrofit; defines identity; parallel lanes drift without it.
- **Account for now** if one holds or a current lane depends on it.
- **Later** otherwise, with the trigger that promotes it.

Follow everything possible, reasonably: write each as default, dial and
"reasonably" (the in-world reason and cost when it changes), never
either/or. Idea rows are palettes for fitting worlds and moments, not specs.

Evidence route for taste: where an aspect can only be judged by looking
(skins, tokens, density), name the cheapest specimen that would show it,
such as the format audit's LD3 one-pocket skin comparison page. Propose it;
do not build it. Technical proof and Weibao's feel acceptance stay separate
gates (foundation round OA8).

## Step 3: output

One file: `docs/OVERARCHING_DESIGN_CORE_AUDIT_2026-10-15.md` with

1. Method chosen and why (short)
2. Pillars draft (P, proposals)
3. Aspect register: code (OD1...), aspect, tier, status W/P/O/N, owner link
   or "none", default and dials, retrofit cost, evidence label
   (SHOWN / STATED / INFERRED / MEMORY)
4. Contradictions between owners, and gaps with no owner
5. Journey and stress-test findings that produced new rows
6. At most five questions for Weibao, each with a default if he says "sure"
7. Rerun section: triggers, inputs, steps, so the next round reuses it

Also: add a dated entry to `docs/USER_VISION.md` quoting Weibao's request,
one line in `docs/IDEA_INDEX.md`, and a link from round 3 of the format
audit. Edit shared docs from disk, hunk only. Do not commit unless asked.

## Live work and execution

- The ui-foundation lane is editing `src/` and `styles/` in the shared
  working tree right now. Touch no source, style, build or test file.
- Other sessions edit USER_VISION, PROJECT.md and IDEA_INDEX. Re-read each
  from disk right before the edit, change one hunk, and grep afterward that
  no other paragraph was lost.
- Executor: one strong model owns judgment (method choice, tiering,
  pillars). Cheap readers may harvest M1 inventory rows per owner cluster,
  each returning rows with file:line evidence; the coordinator checks them
  before they count. Any Codex lane needs included subscription usage, no
  API billing.
- Done check: the audit file exists with all seven sections, every W row
  quotes Weibao or cites PROJECT.md accepted decisions, every row has an
  owner link or "none", and USER_VISION, IDEA_INDEX and the format audit
  link it.

## Rules

- Proposals stay proposals. Only Weibao's words or PROJECT.md accepted
  decisions are W.
- Sealed secrets: refer by ID and route, never truth.
- Desktop 1366x768 first; mobile deferred.
- Report sources as they are, contradictions included.
- Style: plain, direct, no em dashes; lists the reader acts on stay at five
  or fewer.
- Finish with: what you saved, where, the top five core aspects, open
  questions, and which Codex lanes (if any) would be useful next. Do not
  dispatch them.
