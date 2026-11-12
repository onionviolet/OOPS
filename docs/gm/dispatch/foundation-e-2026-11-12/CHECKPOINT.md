# Chat E · Emergence harness, checkpoint

*Chat E of the [procedural foundation plan](../../../PROCEDURAL_FOUNDATION_PLAN.md#two-more-chats) (PFP13, PFP15, MC16). Branch `claude/fdn-e-emergence-8a4157`. Scripts and tests only: no domain, kernel or substrate file is edited here. Run record: [foundation run](../foundation-run-2026-11-12/RUN.md).*

## Done check (plan)

> Each run reports the chains it found and the loops it damped; the three chains above appear without join code.

Plus MC16 (settlement time per simulated day, a budget and a test that fails when it is exceeded) and P's done check share (one place-driven and one actor-driven generation in a seeded world run). From master 2fff2285e (plan section "Making all achievable"): **GL4** the context layer's canon test with P (a seeded world produces things in the places and under the pressures the source shows), **MS5** the combined browser pass at the end, **MS6** E's three chains, and **PR3 with MC16** settlement time per simulated day for any search a generator runs.

| Part | State |
| --- | --- |
| Harness reports chains, contacts, damped loops, runaway versus rhythm, cost per day | **built** (phase 1) |
| Same result after one jump, many steps and a reload | **built**, CC1 and its departure variant, seeds 1 and 5 |
| MC16 budget and failing test | **built**: 800 segments per simulated day (far CC1 runs about 632); wall time recorded under a 2,000 ms ceiling |
| pc1 a regulating Gu leaves mid-brew | partial: departure, latch and stored heat run; "batch finishes weaker" waits on B (the brew reads nothing the regulator moves) |
| pc2 rinse water, field, sheep | waits on B, W, L |
| pc3 fireflies, wild Gu, rival keeper | waits on W, L, A |
| Place-driven and actor-driven generation in a seeded run | place-driven **built** (gl4-context: Gu kinds from P's grammar with cause `place` at two places each dusk, placed as things, same after jump, cuts and reload); actor-driven waits on A and P |
| GL4 context canon test | metric **built** (`contextFit`); baseline on P v0: **0 of 2** places fit at seeds 1 to 3 (the grammar does not read the place, PGB5); a test-only overlay control fits 2 of 2. Source-quantified expectations wait on G's habitat rows |
| PR3 and MC16 for generator searches | **built**: calls, trials and ms per simulated day per search name; budget 400 draws per day (gl4 uses 149); a tighter budget fails |
| MS5 combined browser pass | not started: runs at the end, after domains reach play |

## What was built (phase 1, 2026-11-12)

- [`scripts/emergence_harness.mjs`](../../../../scripts/emergence_harness.mjs): `runCase`, `runEquivalence`, `overBudget`, `describeReport`, `seededRandom`. Reads only the substrate's public calls (`advanceWorld`, `applyWorldOps`, `serializeWorld`, `restoreWorld`).
  - **Harvest.** Cuts at least every 60 minutes (`windowMinutes` dial) in harvested modes, so the 200-record chain cap never trims a record before it is read. A day of CC1 publishes about 400 records; a day-only cut lost a fifth of them, which is how this was found. Gaps are reported, never hidden.
  - **Chains.** Root-to-leaf signatures of publishing pack, effect kind and answering reactor. Depth 0 effects name their pack from the decision cause; deeper ones from the parent's reaction list.
  - **Quantity contacts.** From ledgers: a holder quantity written by two packs and read by a third. A threshold decision (a law with watches) is tagged with the contact only when another pack moved that quantity in the same or previous window, so the shell's own rhythm stays single-domain and only the pulls that brew steam fed count as `[bl]`.
  - **Loops.** Damped by the cascade dial; a repeat of (pack, kind, holder) on one path; runaway when a signature's last-day count is at least twice its first and at least 12 a day (dials); otherwise a steady recurring signature is a rhythm.
  - **Cost (MC16).** Segments and wall ms per simulated day, spread by minutes over each cut. The jump run is the cost of record: it has no harness cuts.
  - **Equivalence.** jump, day, odd (seeded odd minutes plus case-named ones such as the departure minute) and reload (serialize and restore at seeded minutes) must reach one world fingerprint; the three harvested modes must reach one chain fingerprint.
- [`scripts/emergence_cases.mjs`](../../../../scripts/emergence_cases.mjs): CC1 run long under the `w.sky` pack, four days, one brew a day at a drawn minute with a drawn hold; the departure variant carries the shell out while the burner still burns and back next morning. Draws are identical in both variants, so they differ only by the keeper's moves. Cases compose packs and schedule outside ops; the test checks they define no law or reactor. `PENDING_CHAINS` names the three plan chains and what each waits on.
- [`scripts/emergence_known_chains.json`](../../../../scripts/emergence_known_chains.json): known multi-domain signatures per case (seeds 1 to 8). A multi-domain chain not in it is reported as new.
- [`scripts/emergence_run.mjs`](../../../../scripts/emergence_run.mjs): `node scripts/emergence_run.mjs [--case id|all] [--seed N] [--days N] [--mode jump|day|odd|reload|all] [--json]`; exits 1 when modes disagree.
- Phase 2a (2026-11-12, after merging master 2fff2285e): a scheduled op may be a function of the world as it stands, given `ctx.search(name, fn)` (metered per simulated day, PR3) and `ctx.generated(row)` (the generation log); `contextFit` measures GL4 lift per place against the corpus rate; [`tests/fixtures/emergence/context_case.mjs`](../../../../tests/fixtures/emergence/context_case.mjs) is the gl4 case (in tests because P's grammar is a test fixture; it moves to the cases file when G owns a Gu kind grammar in src).
- [`tests/emergence_harness.test.js`](../../../../tests/emergence_harness.test.js) E1 to E8, with test-only toy packs in [`tests/fixtures/emergence/toy_packs.mjs`](../../../../tests/fixtures/emergence/toy_packs.mjs) as positive controls (an echo only the cascade dial stops; a swarm that doubles each day).

## Run report (seeds 1 and 5, four days each)

| Case | Multi-domain chains found | Loops | Far cost | Modes agree |
| --- | --- | --- | --- | --- |
| cc1-steam-shell | smoke from the brew startles the shell (with or without a pull the inlet follows); brew steam feeds about 79 of the shell's pulls through workshop humidity | 0 damped, 0 runaway, 6 rhythms (the shell's draft cycle, the sky) | about 632 segments, under 35 ms per day | yes |
| cc1-steam-shell-depart | the same three, plus single-domain: smoke with nobody to answer, the inlet hearing the shell leave, and after the return the inlet no longer following | same | same | yes |

Findings:

- **F1 · The smoke chain and the steam contact appear with no join code.** Signatures pinned in the known list; E1 is their regression.
- **F2 · pc1 is half there.** With the shell gone mid-brew, humidity and the inlet change but every batch finishes exactly as it would have (E3 asserts this, so the test turns into the pc1 regression when B's law reads what the regulator moves).
- **F3 · Far settlement is barely cheaper with a regulator running.** The shell flips about every 7 minutes, and each flip cuts a segment: about 632 segments a day far against 1,440 near. Fine at this scale; it is the number to watch when many places run far (request W3 below).
- **F5 · P v0 generates under the corpus rate in every place.** Generated kinds carry the place's matching path less often than the corpus does (lift 0.56 to 1.25), which matches P's own report that slots drawn apart produce canon pairs only 56% of the time (GL5). Place weights (PGB5) and joint conditioning (GL5) are the two P items GL4 waits on.
- **F4 · The returned shell is not relinked until its next pull.** After `keeper.returns`, the inlet follows nothing until the shell's next state change publishes `shell.pull`; this reads correctly in-world (the fitting reconnects when the shell moves) and is recorded, not a defect.

## Requests

To other chats (owners decide; E edits none of their files):

- **W1 · Publisher pack on effect rows.** Records carry `by` (a holder) and a cause; the harness recovers the pack from the parent's reaction list, which is ambiguous when two packs react from one holder. A `pack` field on each record would make chains exact.
- **W2 · Effect-kind vocabulary.** A misspelled kind reaches no reactor silently (contract "cannot express yet"). The harness would flag unanswered kinds that no loaded reactor listens for.
- **W3 · Far rates for a cycling regulator (MC16, SPR28).** A cycle-average far law for the shell and inlet, or partitioned detail, would cut F3's 632 segments a day. E's budget test is the gate.
- **W4 · Light and between-place flow.** pc3 needs light as a place quantity; pc2 needs drainage or flow from a vessel's place into a field.
- **B1 · The brew reads a regulated quantity.** pc1's "batch finishes weaker" needs the brew law to read humidity or ambient heat that the regulator moves. **B2 · Rinse water and residue** by substance as an effect or quantity (pc2).
- **L1 · The shell regulator as a living body pack** at embed, and a Gu-as-creature body able to regulate (pc1 with G). **L2 · Crop uptake and grazing** bodies reading residue (pc2); a colony that writes light and wild cohorts that move toward it (pc3).
- **G1 · A regulating Gu as an L body** on the substrate, so pc1 runs with a Gu instead of the shell.
- **A1 · A rival actor** that reads what it knows of a place and picks a working (pc3).
- **P1 · Place-driven weights (PGB5).** gl4-context calls `generate` with cause `place`; the grammar should read the place (W quantities or aspect) so the GL4 baseline lifts. The test's overlay control shows the size of lift the metric looks for. **P2 · One generated thing with cause `inventor`** from an actor, handed to a working, for the actor-driven run.
- **G2 · Habitat rows.** Where each catalogue kind arises (place quantities, care, carrier marks) with locators, so GL4 expectations come from the source instead of the plan default.

## Backlog (E)

- **EB1 · Chain explanations in the player's words.** Signatures are engine words; a Reports line per chain waits on D or the owners of Reports (PRS rules).
- **EB2 · Longer runs.** Four days covers the brew cycle and one moon step; a 30-day run waits on cases where months matter (moon windows, crop growth).
- **EB3 · Exact quantity attribution.** The window tag is coarse (an hour). Per-decision attribution needs W to record which rates moved a watched quantity in the segment before a decision.

## Counts (PFP2, harness form)

Plan chains running with no join code: 0 of 3 complete (pc1 partial). Contact cases in the harness: 2. Generation cases: 1 (place-driven). GL4 places fitting: 0 of 2 on P v0. Bespoke join modules: 0.

## Checks

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/emergence_harness.test.js` | 8 pass, 0 fail (phase 2a) | CC1 and gl4 only; the plan chains wait on domain packs |
| `node scripts/emergence_run.mjs --seed 1` and `--seed 5` | all modes agree, 0 new chains, exit 0 | |
| `npm run check:arch` | pass | |
| `npm run check:rules` | pass (one lint warning beyond baseline is in `src/book_world_hp_exams.js`, not this branch's work) | |

Compatibility line (MC4): unchanged. No game save key and no runtime file touched.

```receipt
build: n/a
route: n/a
state: built
viewport: n/a
persistence: unchanged
tests: focused tests/emergence_harness.test.js (8 pass); check:arch and check:rules pass
review: diff-scoped
surface: new harness scripts emergence_harness, emergence_cases, emergence_run and known chains; test file, test-only toy packs and the gl4 context case; not wired into play
```

## Next

Phase 2: as B, L, G and A land substrate packs on master or their branches, add pc1, pc2 and pc3 as cases (no join code), pin what they find, and add the place-driven and actor-driven generation runs with P.

Read-only look at sibling branches (2026-11-12, not merged, so not importable here):

- W `claude/fdn-w-substrate-ee40b6@0e2336350`: substrate v1 with light, residue, temperature, noise and scent families and effect primitives (`world_effects.js`). This answers W4 and parts of pc2 and pc3. W-B1 (partitioned detail) waits on E's cost number: F3 is that number.
- L `claude/fdn-l-living-dd64ac@0b652a2c8`: a living body substrate pack (`world_substrate_packs/living_body.js`). pc1 and pc2 bodies become runnable once it merges.
- B `claude/fdn-b-brewing-afd93a@b700490af`: brew law on the kernel working, tested against the substrate. pc1's weaker batch is runnable once B's law reads a regulated quantity (B1) and merges.
- G `claude/fdn-g-gu-312887@57476c596`, A, P: no substrate pack yet for a regulating Gu or a rival actor.

Phase 2 waits on those merges; the coordinator merges and messages E.
