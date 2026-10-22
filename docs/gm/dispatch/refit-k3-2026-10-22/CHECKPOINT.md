# Re-fit K3: manual route beside the teacher route (2026-10-22)

Owner: K3 side session started from the decomp re-fit session. Source row:
[DECOMP_REFIT K3](../../../research/DECOMP_REFIT_2026-10-22.md) (RWP3, SD-I3, ZP2,
S-I5; TW-P3 page-level manuals out of scope).

Rule codes applied: SLR4 (every gain records its cause), SLR14 (teaching passes
understanding, the learner still builds fluency), SLR16 (lessons are
transactions), SLR18 (texts are claims; this one is correct by default),
MR21–MR23, AD5, AD38, AR1–AR16 (no new main.js registration line; facts added to
an existing context builder), CRL49 (native reading already pays Literacy XP and
the finished copy already supports home study), UR rules via
`.claude/rules/player-ui.md` (existing technique panel, no new surface).

## Outcome

Rat-step can now be understood two ways that end in the same `understood`
evidence and the same practice:

| Route | Action | Cost and pace (proposal) | Needs |
| --- | --- | --- | --- |
| Guide (teacher) | `frontier.rat_step.study` (unchanged) | 2 wooden coins, 3 min | observation, Village |
| Manual (self-study) | `frontier.rat_step.find_notes` then native reading then `frontier.rat_step.manual_study` | no fee; 2 min search + 8 reading units at native Literacy pace + 6 min study | observation, Village, the copy held, reading finished |

Both routes stop at `understood`. Neither grants `owned`, proficiency or
practice; internalize/practice gates are untouched. Study grants no Literacy XP
because native reading of the copy already pays it (CRL49). Selling or shelving
the copy afterwards does not undo understanding.

Defaults, dials and reasons (AD5/AD38, all proposals):
- **Observation stays a shared prerequisite.** Reason: the notes are diagrams of
  cues; words need a movement already seen to map onto. Dial: a world with
  illustrated or embodied texts may let a manual supply observation evidence.
- **Finished reading, not a Literacy level.** Reason: Literacy 1 costs 120 XP and
  would stall a fresh character; the reading time already scales with native
  Literacy. Dial: dense or foreign-script texts can add a Literacy level gate.
- **The manual is correct.** SLR18 allows wrong or partial texts; this first copy
  is accurate. Dial: later copies can carry errors that testing settles.
- **Acquisition is a find, not a purchase.** Reason: an old hunter's notes in a
  blind beside the rat path; costs time, not coin. Dial: shops or teachers may sell
  copies where a world has a book trade.

## Seam deviation (named)

The brief listed `audited_workshop_lesson.js::auditedLessonFacts` (Eda's resin
lesson) as the teacher seam. Not used for this slice: `validateAuditedLesson`
binds `audit_lesson.resin_setting` knowledge to exactly one completed paid
lesson inside a single earned choice, and the route sits behind a long
expansion9/10 entry chain. A second route there means rewriting those
invariants. Rat-step (`techniques.js`, `technique_content.js`) already had the
observe/understand/own/practice split and a paid guide study, so the manual is
its consumer. Next K3 follow-up: a manual route to Eda's controlled resin
setting, which needs a revision of the single-choice invariant.

## Persistence decision

`understood` evidence gains an optional `origin` (`teacher` | `manual`). Missing
origin reads as `teacher`, so every existing save and any frozen guide-study job
keeps loading with no migration. A present origin is validated in
`validateTechniqueEffect` (only on `understand`) and `validateTechniqueRecords`.
The guide action definition is unchanged, so in-flight jobs keep their frozen
effects. The manual is an ordinary native Book (`book_stats` entry); its reading
progress persists through the native save.

## Files

- `src/techniques.js`: `UNDERSTANDING_ORIGINS`, `understandingOrigin`, origin
  validation and recording.
- `src/technique_content.js`: manual constants and the two new actions.
- `src/items.js`: one Book template and BookData (hunk only).
- `src/main.js`: import widened; `ratStep.manualHeld` / `ratStep.manualRead`
  facts beside `village.notesHeld` / `village.notesRead` (hunk only).
- `src/technique_ui.js`: progress line names the understanding origin.
- `tests/techniques.test.js`: K3 regression.

## Verification (2026-10-22)

Failure scenario chosen before editing (AD36): a manual route that skips
observation, consumes or requires coin, grants ownership/proficiency, loses its
origin across save/import, or rejects older saves without an origin.

| Check | Input | Result |
| --- | --- | --- |
| `node --test tests/techniques.test.js tests/character_bio.test.js` | working tree with this slice | 12/12 pass, including the new K3 regression (unobserved rejected; unread/unheld rejected with reason; no fee, longer than guide; origin `manual`; no owned/proficiency; copy kept; understanding survives losing the copy; JSON reload keeps origin; unknown origin rejects; guide record without origin reads as teacher and reloads) |
| `npm run build && npm test` | same tree, shared checkout | build ok; 2554 pass, 1 fail. The failure is `tests/ui_contract.test.js` UR65–UR68 on `src/mixture_ui.js` cssText (K1/K2 session's file); no finding names a file in this slice. The same test also failed in an earlier run in this session. |
| Rerun `npm run build && npm test`, `check:arch`, `check:rules` | HEAD `ce39b5b69` + working tree, bundle `8f03f44ecc056e43` | build ok; **2561 pass, 0 fail** (the mixture_ui UR test now passes); arch pass (main.js 10115 vs baseline 10115); rules PASS (4 warnings on other sessions' untracked files) |
| `npm run check:arch` | same tree | pass; main.js 10274 lines vs baseline 10310 (no new registration line) |
| `npm run check:rules` | same tree | PASS (4 warnings about other sessions' untracked dispatch files) |

Rebuilt browser proof, `dist/bundle.js` sha256 prefix `1d78fdc066e327cd`, fresh
origins served from this checkout, generated saves only (no personal saves):

- **Teacher route**, `http://localhost:19861/`, 1920×1080 then 1536×864: new
  game, greet the elder, Notebook → Practice. Observe (3 min) showed both the
  guide study and the blind search. Paid study → "Understood via a guide's
  analysis"; manual cards hidden; practice cards shown.
- **Manual route**, `http://localhost:19862/`, 1920×1080: observe; search the
  blind (2 min) put "Hunter's Rat-step drill notes" in inventory; the self-study
  card showed disabled with "Read … through first (8 minutes of ordinary
  reading)". Native Read from Item details finished the book (report "Finished
  the book …"). Self-study enabled, ran 6 min → "Understood via your own drill
  notes"; purse unchanged at 10C 2W; copy still held; the same three practice
  cards as the guide route.
- **Persistence**, manual origin: Save → localStorage holds
  `"understood":{…,"origin":"manual"}`. Page reload → "No issues in the loading
  process", panel still "via your own drill notes", copy held. Export via
  `window.save_to_file` (what the Export button calls) captured
  `origin: manual, proficiency 0`. Slow practice then raised proficiency to 2.
  Import of that export via `window.load_progress` (what the Import file input
  calls) reloaded the page; saved state and panel returned to proficiency 0 with
  `origin: manual`; no console errors.

- **1800×1040**, manual origin after import: Practice → Rat-step shows
  "Understood via your own drill notes" wrapping inside the panel, three
  practice cards, no overflow.
- **Read-but-unstudied reload** (code check, not browser): native load replays
  saved `accumulated_time` through `Book.addProgress` (`src/main.js:6874`),
  which calls `setAsFinished` once required time is reached, so
  `ratStep.manualRead` holds after reload without a mirror flag.

Text-size pass (closes the earlier backlog item; requested by Weibao through the
parent session, "close their open verification gaps"). Rebuilt at HEAD
`ce39b5b69` plus working tree, `dist/bundle.js` sha256 prefix `8f03f44ecc056e43`,
fresh origin `http://localhost:19863/`. New game, elder, observe, search the
blind, so both route cards show and the self-study card shows its
gate reason (the text-heaviest state). Text size was set through Appearance →
"Text size 21" (the saved preset). Each cell measured the technique panel, its
visible cards and card buttons for `scrollWidth > clientWidth`, plus document
horizontal scroll:

| Viewport | 14px | 21px |
| --- | --- | --- |
| 1920×1080 | no overflow, no page h-scroll, panel 707px in view | same, font 21px |
| 1800×1040 | same, panel 659px, screenshot clean | same, card headings wrap inside the card |
| 1536×864 | same, panel 485px; center column scrolls vertically | same |

No console errors. At 21px the card headings scale. The description and status
copy keep the panel's existing small type role. That predates this slice: these
are `expedition_preview`/`expedition_state` classes shared with other panels. The
screenshot tool crops the frame at 1920×1080 in this pane, so that row rests on
the DOM measurements. The post-study "Understood via your own drill notes" line
was checked at 14px (1920 and 1800) in the earlier pass, not again at 21px.

Export/import used the page functions behind the buttons, not the OS file
picker. Mobile deferred per standing UI priority.

Known edge (default, dial, reason): the blind holds one copy, so
`find_notes` is not repeatable. A player who sells or drops the notes before
studying sees the search card again, disabled with "Already committed or
completed"; the guide route stays open. Dial: a world with a book trade can sell
further copies, or a scribe can copy them.

## State

Committed by the guarded temp-index procedure after Weibao's relayed instruction
("Tell both sessions to close their open verification gaps, then commit only
their own paths with the guarded procedure. No push."). Own paths:
`src/techniques.js`, `src/technique_content.js`, `src/technique_ui.js`,
`tests/techniques.test.js`, this checkpoint, plus only this slice's hunks in the
shared `src/items.js` (import line and the Book/BookData block after
`ROUTE_NOTES`) and `src/main.js` (widened `technique_content.js` import and the
`ratStep.manualHeld`/`ratStep.manualRead` facts line). Other sessions' hunks in
those files and `dist/` stay uncommitted in the working tree. Not pushed.
