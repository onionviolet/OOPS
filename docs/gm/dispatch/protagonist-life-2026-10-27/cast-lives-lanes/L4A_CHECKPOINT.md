# L4a checkpoint: living cast host, 2026-10-28

Status: **implemented, below floor**. Agent-verified, not human-reviewed. No commit,
staging, push, reset, stash, user-save access, or edits to the L3 cast source.
The required ordinary player journey remains incomplete at the scope boundary below.

Authority: [L4a brief](L4A_LIVING_WEEK_BRIEF.md), [L3 checkpoint](L3_CHECKPOINT.md),
[cast plan](../CAST_LIVES_PLAN_2026-10-28.md), and the coordinator's 2026-10-28
clarification in this chat permitting beside-only host action-list and dynamic
away-refusal hunks. Rules: AR1-AR16, AD36, AD43, WER3/WER9/WER11/WER16, WA24;
player surface follows [.claude/rules/player-ui.md](../../../../../.claude/rules/player-ui.md).
Target: existing Tingen service panel, 1920x1080 desktop. Visible result: fifth
start and cast talk controls with named away reasons. Mobile optimization is deferred.

## F1. Files and ownership

| Path | Change |
| --- | --- |
| `src/book_world_lotm_cast_days.js` | Relative scene bindings, address-to-scene reader, dated schedule projection and bound beat exports for L4b. |
| `src/book_world_lotm_cast_host.js` | Clock projection, alias resolution, cast definitions, location sync, continuity definition, principal talk commands and shared refusal quote. |
| `src/book_world_lotm_lives.js` | Add `beside` after the four existing profiles. |
| `src/book_world_lotm_content.js` | Register optional cast definitions/commands/situation; enroll cast bodies and the separate continuity for beside. |
| `src/book_world_lotm_host.js` | Sync caller-owned state copies before preview/commit, sync committed plans/tick, include beside talks and revalidate their dynamic refusal. |
| `tests/lotm_cast_week.test.js` | Focused timing, compatibility, talk, movement and persistence scenarios. |
| This checkpoint | Evidence, scope questions and remaining floor lines. |

These paths were clean or absent before edits. Unrelated working-tree changes were
preserved. Core-owner files touched: zero. New cycle edges: zero. Registration
uses the existing LOTM content definition, with no main/save/display line.

## D1. Timing proposal and compatibility

Step 0 was implemented and checked before host wiring. There are **60 bindings
across four relative civil days**: 58 source scenes plus two retained L3 subscenes.
Binding labels: I=60, S=0, T=0, U=0. No scene in this slice has an established
absolute date; the June 30 interview is an appointment claim, not a dated scene.
The stated/proposed claims retain their independent labels in `LOTM_CAST_CLOCK_BINDINGS`.
The Monday countdown places the proposed gathering on relative day 6, outside the
four-day scene window; this does not fabricate another on-scene gathering.

Source-order timing is a reversible proposal. The remote night montage advances
to the earliest next night; dream dawn does not advance the civil day. Verified
06:00, 07:00, 12:30, after-02:00, after-04:00 and 14:00 claims bound the local
sequence. Exact minutes between those claims are authored spacing, with I labels.
Scenes with successive addresses divide their actor's window, rather than
competing for the whole band. No source scene is left unbound. All 69 non-fill
schedule rows are `once` rows. The eight fill proposals keep their recurrence:
three daily service fills end with day 4; five dormant fills stay irregular because
forward anchors remain undated. Full L3 forward-anchor probes pass against the
projected schedule; no daily forward-anchor phasing is claimed.

Compatibility decision: additive profile and optional people in new beside lives;
no new location field, envelope shape or migration. All four existing profiles
retain their enrolled people sets and full action lists at the four original
places, compared with SHA-256 baselines captured before editing their producers.

Thirty-four living bodies are enrolled. The historical-reference record is not
spawned as a living person; the young investigator role shares Leonard's body.
Benson remains unplaced and away, without an invented return appointment. Remote
cast addresses stay remote; they have not been converted to Tingen destinations.

The location authority remains `simulation.people[id].location`. Day index is
`floor((clock - initializedAt) / 1440) + 1`; this profile's start-time offset is 0.
The projection is recomputed from that clock and writes no second timer or saved
availability field. No active row retains the last address but fails the host's
talk gate, even if the player stands at that retained address. World facts
`lotm.cast.window.<scene>` are true on the bound day for L4b's later consumer.
No beats, fate locks, or weights are executed in this lane.

## F2. Checks and evidence

| Command or route | Result | Gaps |
| --- | --- | --- |
| `node --test tests/lotm_cast_week.test.js` | PASS 5/5 on final owned sources. | Two successful principal meetings use an explicitly named player co-location fixture; no ordinary cast travel route is claimed. |
| `BUILD_OUT=/tmp/yairpg-l4a-living-week npm run build` | PASS. Bundle SHA-256 `1b2a16ba24ebe496690b14209cfeb9d7925312639dfd70072fd321bb633ef15d`. | Isolated output; tracked `index.html` and `dist/` untouched. |
| `npm run check:arch` | PASS. Main -30, display -37, save 0 against baselines; 205 grandfathered cyclic edges, 6 grandfathered main imports, zero new edges. | Shared live checkout, not a frozen combined candidate. |
| `npm run check:rules` | PASS, zero warnings/problems. | Full suite belongs to coordinator/committer. |
| `git diff --check` on owned tracked paths plus owned new-file whitespace scan | PASS. | No commit performed. |
| MCP `game_freeze`, then `game_new` seed 41, session `l4a-living-week`, panel `lotm`; pick beside, confirm | PASS: fresh Village to fifth start to Tingen lodging; zero page errors. | Native travel cannot reach the imported cast addresses yet. |
| MCP `game_step` 180 minutes, export and local assertion against `whereabouts()` | PASS: principal physically moves on the native tick; zero page errors. | This demonstrates autonomous movement, not a successful player meeting. |
| MCP `game_save`, `game_export`, `game_reload`, `game_load`, second `game_export` after movement; local decoded test-save comparison | PASS: all 34 positions and clock match before/after native Save/reload/Export/Import; zero page errors. | Generated private test saves only; no user save read. |
| `node /tmp/lotm-l4a-browser.cjs` over the isolated rebuilt bundle and a fresh Chrome origin/profile, 1920x1080 | PASS: eight away talk controls show their reasons; zero page errors. Screenshot `/tmp/lotm-l4a-away.png`, DOM receipt `/tmp/lotm-l4a-browser.json`. | Imported MCP-generated beside-life fixture. No present-person screenshot; no literal browser Import click. |

MCP frozen instrumented bundle: `7dc75bf679b3e8e84dd18e9d032f2773b3b263dd4e25f9722203695bc8b04b7d`;
manifest `7668eb6c50eaa7f8be7615ccc2a24954a4f7512cb57f49face282f6ac009adca`.
The native screenshot mirror produced an unrelated Village view and was not
counted as evidence. The direct rebuilt Chrome route above supplied the useful
away screenshot. No browser or MCP sandbox block was encountered. The isolated
MCP session and temporary browser/server processes were closed.

Final source input identities (SHA-256):

| Path | Hash |
| --- | --- |
| `src/book_world_lotm_cast_days.js` | `62adbf743f931492b9e47875efff283f9e4c2d50a8576a66408017d31bdbb08e` |
| `src/book_world_lotm_cast_host.js` | `aa1945689aba6c30166d40e5ba2efc7b63820f487a65f0a7ed056193ad862e67` |
| `src/book_world_lotm_lives.js` | `bcaee9e9302969197e3106e57a7ebc772b24c40d7563e7b65cf7a81c8d2d0aaa` |
| `src/book_world_lotm_content.js` | `bfe59e49ea12e38dc3340dfedef1a24c6fdebb86dd22bfbc5a026ace88b8f2c9` |
| `src/book_world_lotm_host.js` | `5ab2f3868c640dac14b77d454dd7efada619236cdd8bab4e80d42d190a44cbef` |
| `tests/lotm_cast_week.test.js` | `2c894d4e61b36a70c030f58cc983566f739d57d8cebc51d91fc8d756ca4ee1d6` |

## R1. Scope boundary and remaining acceptance

Two asynchronous scope questions are pending in this chat. No answer has been
assumed. The brief's host restriction, even after the clarification, permits
beside action-list/refusal wiring but does not authorize new travel plumbing.
The following remain for coordinator assignment or explicit scope extension:

1. Beside-only travel to the concrete Tingen cast addresses, through timed walks,
   native location registration and envelope validation. Current native travel
   and `LOTM_PLACES` accept the four original addresses; silently folding the
   Moretti flat into probationer lodging would misrepresent co-location.
2. Beside-specific entry answers. `entryAnswers()` currently gives the fifth
   crossing the existing clerk's church probation, contradicting an ordinary
   resident. The existing entry owner is outside the reserved files. No new
   church contract or reporting obligation has been invented in this lane.
3. After those changes, the ordinary two-person journey, a present talk screenshot,
   and browser Save/reload/Export/Import on the final rebuilt candidate.

FLR1: PASS, isolated bundle above. FLR2: PARTIAL, fresh enrollment/native movement
plus fixture meetings, ordinary meeting route open. FLR3: PARTIAL, away screenshot
and reasons proven, present screenshot/ordinary entry answers open. FLR4: PASS,
co-location/refusal and seen knowledge note have real host consumers. FLR5: native
MCP persistence PASS; literal browser operations open. FLR6: implemented, below
floor, agent-verified, not human-reviewed. Full `npm test` remains the coordinator's
pre-commit gate.
