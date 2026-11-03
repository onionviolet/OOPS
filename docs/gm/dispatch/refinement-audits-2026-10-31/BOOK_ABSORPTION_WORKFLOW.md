# Book absorption workflow (proposal, 2026-11-02; AD32, nothing here is accepted)

Goal: absorb the whole first novel (8 volumes, 1,430 chapters, about 2.7M words; volume 1 is 213 chapters, 418,683 words) as Klein's playable journey, faster than one episode at a time. Measured serial baseline, KJ3I and KJ3J: about 3 min source read, 8-12 min authoring, 3-7 min native proof per episode of 5-6 intents, 0 late presence corrections. Folding stays off (fold-test proxy failed; [plan](LOTM_KLEIN_FULL_JOURNEY_PLAN.md)). Units are the arc, sub-arc and window of plan round 3.

## What runs in parallel, what cannot

| Dimension | Parallel? | Why |
| --- | --- | --- |
| Text reading and brief writing (any window) | Parallel by default, ahead of builders | Needs only the text, the alias table and the ledgers, not game state |
| Brief check against the text | **Yes**, a Sonnet checker plus the coordinator's quiet-row sample | Independent of builds; haiku misses quiet text |
| Authoring and native proof, windows inside one arc | Serial by default (dial: parallel only if a window's start state is fixed by the source) | Each starts from the previous real checkpoint (money, place, facts); earned checkpoints come only from native runs |
| Whole arcs that depend only on a source-fixed state | Parallel by default after Tingen, when the seam is source-fixed | The seam state is stated by the text; the merge reconciles gaps |
| Pack merge, cast IDs, bundle, commit | **No**, one integrator | One reviewed pack and shared cast IDs |

## The line (per arc, pipelined)

1. **Prep (deterministic):** spine, payloads under 12,000 words (AU10), cumulative alias table, ledgers. No model.
2. **Row reader (haiku, k+2):** one read per window in the sweep-row schema plus seams, `withheld`, plants. Read once; the output feeds both the brief and the seam contract.
3. **Brief (k+1):** the coordinator or a Sonnet checker corrects rows against the text, pins the fact keys the window sets and requires, lists withheld and plant consumers.
4. **Build (k):** one Sonnet single writer per arc, native route to green, receipt. While it runs, steps 2-3 proceed for later windows.
5. **Batch gate:** after 2-3 windows, one route on the current bundle and one path-scoped commit.

## Smoothing backlog (ranked; proposals, not dispatched)

| # | Item | Effort | Done when |
| --- | --- | --- | --- |
| T1 | 200-character pre-scan in the builder template, reports every over-length string at once (KJ3J failed four times) | tiny | one run lists all offenders |
| T2 | Pin fact keys in the brief (`book.lotm.<slice>.<name>`); builders reuse them | tiny | a later window's required keys all resolve in the prior checkpoint |
| T3 | Durable proof bundle: store the bundle copy with its sha outside `/tmp` (proofs ran on KJ3E's `919b17d3…`; the repo bundle has drifted) | tiny | receipts name a retrievable sha |
| T4 | Runner generator from `reviewed-episode.json` (KJ3I and KJ3J runners are near copies) | small | a new episode needs no hand-written runner |
| T5 | Arc handoff file and ledgers (alias, plants, withheld) | small | an owner restarted from files continues without rereading |
| T6 | Receipt fields auto-filled from the browser result (timings, boots, imports, sha) | small | receipt table needs no hand copying |
| T7 | Path-scoped commit helper that stages only named hunks (today's RULES_INDEX commit needed a hand-built index) | small | a mixed file commits only its own lines by default |
| T8 | Single writer rule for the shared cast pack at merge | small | two arcs rarely mint conflicting IDs and any conflict is caught at merge |

## Order and gates

Build ch23 next by the pipeline (it brings the new places and actors the PF13 rule still needs); ch23-31 windows are in `private/kj-lanes-2026-11-02/` (five windows, chain check PASS, with money, clock and ID unknowns listed). Seam and row reads run one arc ahead, not the whole book. Anything beyond one arc ahead needs a recorded AU13 plan and Weibao's go-ahead. Arc lanes in parallel wait for the first source-fixed independent seam after Tingen. Record per episode: read, authoring and proof minutes, late corrections, bundle sha.

## Dispositions (reconciled 2026-11-02 after the advisor review; replaces the first more-to-consider list)

**Accepted (Weibao, 2026-11-02, [USER_VISION](../../../USER_VISION.md), AD48):** a runtime mechanism lane run by separate, capable implementers. Everything else here is a proposal under AD32.

| # | Finding | Disposition | Owner and done check |
| --- | --- | --- | --- |
| M | **Mechanism lane.** KJ3 is content-mainly because systems exist; later arcs need runtime code | Accepted lane (AD48). First task is a read-mainly gap probe of the mechanisms the seams tag for ch32-54 against `src/` (Seer is hand-authored in `book_world_lotm_actions.js`; abilities, divination rows, rites and craft rows exist), not a blind build. Missing or partial rows become implementer briefs | Probe table: exists, partial, missing, owner file, consumer locator. Done when each missing row has a brief |
| D | **Depth dial.** The 140M-token figure is an upper bound inflated by the ch16-22 precedent (11 intents for 1.5 chapters), not a forecast | Keep current depth through Tingen. The lever is per-episode overhead (window-sized episodes about 1.8 chapters, T1, T4), not fewer decisions. Intents drop mainly where the source has nothing to decide, and each keeps CLR6's elements (choices, inputs and outputs, time and order, who was there, place, outcomes, what was noticed), consistent with the accepted reachability floor ([USER_VISION](../../../USER_VISION.md)) | Weibao sets depth per arc after Tingen; the receipts record intents per chapter |
| P | **Pack growth** (one 4.2 MB `cast.json`; boot 18-21 s, import 24 s) | Measure once: boot a minimal pack against the full pack to see whether the pack drives those seconds. Chunking changes the pack schema and needs a persistence decision, so it waits for a stated trigger (a slice's boot over twice today's, or a pack over about 20 MB) | One measurement line in the next batch receipt |
| R | **Chain replay.** Slices are proved from the previous slice's checkpoint; every builder rewrites the shared pack, so a later revision can break an earlier slice | Lineage check run 2026-11-02: the KJ3F-KJ3J runners each seed from the prior slice's `completed-checkpoint.json` (a path reference in `play-episode.mjs`, not a hash comparison). At each batch gate: every slice's existing runner in order on the current bundle and pack; this is the route to "works end to end on the current build" | Batch receipt names the bundle sha and the runners run |
| C | **Civil clock.** The ch23-31 contract says Friday daytime; ch21 ends at sunset and ch22 is the same visit, so the hour is unresolved. The pack already has `clockClaims` and `anchors` | Resolve by reading ch23 P001-P050 clock words before kjw1; fix drift with day-turn acts on stated source times; no new clock system | The brief states the day and hour with locators |
| $ | **Money ledger** | Small table in the arc ledger (pence, soli, pound; known or assumed) from the contracts' figures | The next brief reads the ledger, not the sweep rows |
| H | **Review export** | `completed-export.txt` exists per slice; confirm the latest imports on the repo bundle before offering it | One import on the current bundle, recorded |
| I | **Cast IDs** | Verify the 2 Daffodil Street ID before kjw4; single cast-pack writer at merge (T8) | ID resolved against the pack |
| B | **Proof bundle (T3)** | Done 2026-11-02: KJ3E's bundle copied to `private/proof-bundles/kj3e-bundle-919b17d3/` (sha `919b17d3a114e5c622d0efd81f53a84c927012d10537c863fdb851ba2d7c9abf`); the mechanism lane will rebuild the repo bundle, so content proofs keep using this copy until a batch gate | Receipts name this path |

## Mechanism lane: separate, capable implementers (lane accepted, AD48; the rest proposal)

- **Dispatch:** one fresh session per mechanism (`start_session`; a worktree when writers overlap or when clean `npm test` and build need isolation, since this checkout's `src/` and `dist/` are dirty from other sessions). Merge into the shared branch waits for Weibao's yes. One writer per file area.
- **Capability:** Sonnet at high effort by default for a bounded seam; Opus only for cross-system design or a failed Sonnet lane, with an advisor opinion and the reason in the spawn prompt (his routing preference). Content builders do not write runtime code.
- **Brief** (from `LANE_BRIEF_TEMPLATE.md`): the seam; AR1-AR16, PRF1-PRF8, FLR1-FLR6 links (MR1-MR36 for making); the consumer locator (chapter and paragraph); a failure scenario and the focused test file; the six-line floor; the write boundary; a save-slice migration if new state is added; the content lane's pinned fact keys it must satisfy.
- **Sequencing:** the seam pass tags mechanism seams one arc ahead, so runtime work for an arc is queued before its content builders reach it.
