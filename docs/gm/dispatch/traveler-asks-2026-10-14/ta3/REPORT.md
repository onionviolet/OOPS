# TA3 report: kinds, recurrence and connections

2026-10-14. Docs-only design completed in the assigned ta3 folder. These are proposals for the next build after TA1 play feedback. No runtime code, saves, standing direction or gameplay acceptance changed. Covers TA-C3, TA-C4, TA-L2 and TA-L3.

## F1. What was missing

Live P34 freezes one ordinary item, quantity one and needRevision one. A fulfilled P4 traveler never develops a new supply goal. Its detached save/escrow/history transaction is a useful base, but item matching, person validators, history schema, recap and aftermath all assume that narrow contract. Adding a menu of ask labels would not create services, recurrence or remembered typed outcomes.

The design now distinguishes real world feasibility from present access and knowledge. Amendment 1 supersedes the fresh-player route filter: ready / stretch / unknown asks are valid when a world route exists, unknown clues are honest and knowledge-filtered, and stretch/unknown receive higher quoted rewards. Optional grade predicates stay data-driven and await HV1's actual identity/grade adapter. No harvest plan is presented as shipped behavior.

## A1. Deliverables and authority

| Document | Outcome |
|---|---|
| [KINDS.md](KINDS.md) | Eight ask kinds, each with saved state, settlement, receipt and recap; legacy compatibility, mixture/appearance join, grade field and coin/non-coin rewards |
| [REPEAT.md](REPEAT.md) | Need revisions, real use/cause before renewal, world cadence, escrow/failure policy, bounded retention, standing, callbacks and idle recap |
| [LENSES.md](LENSES.md) | GL4 knowledge grants, unknown clue chains, safe player projection, developer report and reach-band gates |
| [CHECKPOINT.md](CHECKPOINT.md), [BACKLOG.md](BACKLOG.md) | Ownership/scope, amendment recovery and unimplemented acceptance work |

Authority read: dispatch COMMON/PLAN including Amendment 1 and updated TA3 prompt; PROJECT standing priorities and accepted direction; USER_VISION food/desktop direction; harvest PLAN; live P34, P4, P3, P2/GX5 and G1 seams. Existing source and reports were reconciled: G1 is a pure library without a live consumer, P3 authored service-like cards are not general service jobs, P4 people are separate from simulation actors, P2 has regeneration rather than cough treatment, GX5 is appearance recognition rather than new property truth. The original dispatch's next-code-lane play-feedback gate remains in place.

## S. Ranked build slices

Ranks are a proposed execution order, not authorization to start. Each executor recovers live ownership and TA1's actual merged schema/files first. Revision 3 below means the next unused contract revision after TA1. Use the current default Codex model; suggested reasoning levels describe the bounded work, not permission to spawn agents.

### S1. Typed item bundles, reach bands and grade-ready terms

**Player route:** meet a traveler, inspect a ready/stretch/unknown ask, take it, select exact owned stacks and settle one multi-line or quality-qualified delivery. Unknown goals wait while the player explores; clues never reveal sealed answers. Include a real stretch/unknown fee premium and retain that quoted fee after discovery.

**Files:** `src/story_requests.js`, `src/generated_people.js`, `src/generated_people_ui.js`, `src/lore_history_state.js`, `src/lore_history_view.js`, `src/story_aftermath.js`, `src/save_files.js`; narrow `src/main.js` publication bridge if necessary. Reuse the obtainability/table modules TA1 actually introduces, reading traders and quality tables without editing their stock or craft RNG. Extend `scripts/lint_story_spine.mjs`, `scripts/run_story_spine.mjs`, `tests/story_requests.test.js`, `tests/lore_history*.test.js` and `tests/helpers/story_spine.js`. Proposed new grade predicate adapter stays request-owned until HV1 exposes its real reader.

**Saved change / compatibility:** revision-dispatched typed requirement lines, optional `grade` (absent means unrestricted), frozen reach/reward quote basis, exact-key custody and typed receipt metadata. A current reach band is computed, not overwritten into old terms. Preserve rev-1 goals/rows and TA1 rev-2 terms. Expand history schema explicitly for typed effects/refs, reading schema 1 unchanged; unknown versions reject before storage writes. Old envelopes without new owners remain absent. No retrospective grades or reroll.

**Gate:** all/any matching and no shared-stock double debit; below-grade rejection; real-world route/no-route lint; ready/stretch/unknown bands; reward premium and clue privacy; full transaction conservation, stale/storage-failure no-publication; pending/settled native Save/reload/Export/literal-file Import. Rebuild then exercise desktop 1366x768 and 1600x1000 on fresh test origins. Grade field roundtrip first; graded carcass hand-in requires HV1 merged producer/native identity/import proof, otherwise that portion stays OPEN and out of tables. **Executor: high**, due to multiple validators and atomic publication.

### S2. Funded recurring needs with bounded memory

**Player route:** complete one request, let real idle journey/supply use and world cadence create a new eligible need, then take and fulfill its next revision. Old help/residency remains earned; no absence penalty.

**Files:** `src/generated_people.js`, `src/story_requests.js`, `src/generated_people_ui.js`, `src/lore_history_state.js`, `src/lore_history_view.js`, `src/story_aftermath.js`, `src/storylet_deck.js` only for necessary callback pin lifecycle; `src/save_files.js` and narrow native bridge as needed. Reuse `src/seeded_streams.js` and optionally `src/gen_kit.js` without porting existing RNG algorithms. Extend the existing story-spine runner/lint and relevant request/people/history tests.

**Saved change / compatibility:** optional per-person recurrence/cadence revision, bounded new custody, real supply-use cause, latest need revision, standing/memory counters and callback handled-through ordinal. Add an actual purse funding route only if an existing backed economy consumer can support it; otherwise stop safely at unfunded eligibility. Legacy goal/supply/helped facts remain immutable. New histories initialize at enrollment without reconstructing old deeds; old schema-1 receipts still validate. New need draws use new versioned addresses; existing names/goals/deck cursors unchanged.

**Gate:** more than 100 mixed fulfilled revisions and declines with at most 16 rows and 96 shared receipts; pin/causal closure and all-pinned safe refusal; exact fees, custody and aggregate counts; no callback reward resurrection after eviction; no fee minting; idle-long-jump coalescing; decline/reoffer same need versus new fulfilled revision; residence preserved. Native proof of second earned need and persistence, plus waiting across away/return. Byte budget measured, not just row count. **Executor: high**, because retention and old invariants can break otherwise valid saves.

### S3. Identified property-qualified mixtures

**Player route:** pay for inputs, mix, observe one dose, make a matching second vial, then deliver that exact identified vial for its agreed property. Use existing health/stamina properties, not fictional disease treatment.

**Files:** `src/story_requests.js`, `src/generated_people_ui.js`, `src/lore_history_state.js`, `src/lore_history_view.js`, `src/story_aftermath.js`, `src/mixture_state.js`, `src/save_files.js`; new compact-reference adapter if required. Read/reuse `src/mixture_native.js`, `src/mixture_ui.js`, `src/product_appearance_state.js`, `src/product_appearance_view.js` and native item decoding rather than duplicating them. Extend mixture/request/history tests and the existing runner/lint.

**Saved change / compatibility:** versioned property predicate, compact product-reference mapping and exact recipient holder; receipt maps to existing retained canonical P2 product. No change to P2 truth, native physical keys, observations, GX5 appearance allocation or four-slot enrollment. Legacy mixtures without GX5 bindings remain eligible if observed. Older ordinary requests still use their original rules. Referenced products remain retained; no incidental catalogue garbage collection.

**Gate:** actually identified matching versus unknown/nonmatching vial; pre-GX5 product; same appearance is not broad property knowledge; exact transfer and fee conservation without player dose effect; long-ID admission through compact refs; product refs survive receipt/custody after inventory loss. Failed writes leave every owner and stream unchanged. Natural rebuilt experiment/repeat/delivery and literal-file import at both desktop viewports. **Executor: high**, due to full-envelope reference and knowledge boundaries.

### S4. People sight and an honest discovery chain

**Player route:** receive an unknown ask, learn an authored public lead, ask a real contact and discover a route. Separately activate GL4 on a met traveler to reveal one supported need/trait with provenance; turn it off and keep learned knowledge.

**Files:** `src/generated_people.js`, `src/generated_people_ui.js`, TA1's actual obtainability/hint modules, `src/save_files.js`, `src/lore_history_view.js`; new narrow player knowledge/lens adapter under existing cheat/knowledge ownership after live recovery. Extend `scripts/lint_story_spine.mjs` and `scripts/run_story_spine.mjs` with sanitized report output. No universal lens framework or separate solver required.

**Saved change / compatibility:** optional bounded claim/provenance ledger with per-observer subject refs, confidence and learned time. Absent stays absent; grants save knowledge/cost only. Do not set met or P2 observed flags to manufacture compatibility. World truth and quoted contracts stay unchanged as derived bands improve. Unsupported refs/revisions reject before import replacement.

**Gate:** ready/stretch/unknown report and no-world-route failure; unknown-to-stretch-to-ready natural clue journey; higher fee unchanged; source-stock caveat; repeated view purity; truth/stream equality across GL4 grant; provenance survives lens-off/reload/literal-file Import. Synthetic sealed canaries withheld from UI/recap/report/errors. Native desktop evidence required; report alone is SOURCE. **Executor: medium** for a met-person reveal and one clue route; high if the existing knowledge owner needs cross-owner migration. S1 already provides minimal diagnostics, so this rank need not delay reachability checks.

### S5. First witnessed service and a later reward claim

**Player route:** accept a message-carrying job, take custody, meet the intended recipient and obtain acknowledgment, then claim a supported native skill lesson reward. The lesson may be scheduled/queued and resumed; no XP until actual completion. This closes one concrete service before escort/repair expansion.

**Files:** proposed `src/story_request_services.js` for pure progress/settlement predicates; `src/story_requests.js`, `src/generated_people_ui.js`, `src/lore_history_state.js`, `src/lore_history_view.js`, `src/story_aftermath.js`, `src/save_files.js`, plus the exact existing dialogue/job/skill consumer discovered by the executor. Touch `src/storylet_content.js` / `src/simulation.js` only for an explicitly required producer bridge. Extend existing runner/lint, request/history tests and a focused service fixture.

**Saved change / compatibility:** message token/custody/recipient acknowledgment, unique progress IDs, typed service receipt, bounded reward entitlement and lesson completion state. Initial reward uses an existing native skill and real teacher capability. No full message prose in generic receipts. Existing delivery-afterward road advice remains readable and cannot be replayed as the new lesson entitlement. New service schemas are optional; unsupported/future data rejects before publication.

**Gate:** no payment for reading a message or standing near recipient; wrong recipient rejection; canceled/paused job retains/refunds actual custody; acknowledgment and lesson claim each exactly once through reload/import and callback eviction. Full failed-persist/no-native-change proof and natural rebuilt recipient dialogue/lesson journey. **Executor: high**, because two durable stages cross dialogue and reward owners. Escort, target-object repair, evidence-report exchange and player-to-NPC teaching remain separately bounded next slices from KINDS K4/K5/K7/K8, each requiring its real consumer. Do not bundle those speculative systems into S5's done check.

## V1. Checks and limits

SOURCE review covered P34 request/history/recap/aftermath and retention rules; P4 validators/view/native panel; P3 authored cards; P2 product/knowledge/envelope validators; GX5 view/state; P1 seeded stream interfaces; G1 source/API and merged-library limits; existing lint and historical lane reports. Historical test/native counts in those reports are not new TA3 verification.

This lane's verification is document-only: all six expected Markdown deliverables present; five ranked slices present; 23 local Markdown links resolve; zero trailing-whitespace findings; amendment/grade wording reviewed. Scoped `git diff --check` passes, but these files are untracked, so the explicit per-file whitespace check is the relevant evidence. No game suite or build run because runtime files are unchanged. Future executor gates above are requirements, not passing claims. No private save, sealed file truth, source library, staging, commit, push or merge used. Root owns committing this docs lane.

## R1. Remaining gate

TA1's rebuilt play feedback is the next authorization gate for follow-on code lanes under dispatch PLAN. These docs do not add a fresh-player requirement, implement HV1, authorize offline punishment or turn proposals into accepted decisions. Shared-file ownership and the then-live merged contracts must be recovered before implementation.

TA3 delivers the next-build design; implementation and playable acceptance remain open in [BACKLOG](BACKLOG.md).
