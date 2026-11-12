# Procedural carry-out

*Proposal for Weibao, 2026-11-12, and a proposal throughout (AD32). Companion to the [procedural core](PROCEDURAL_CORE.md): that doc says what and why, this one says who does what in which file, how each piece is checked, and how the whole plan is kept from stalling. Codes continue the core's: PC51-PC66 (the core resumes at PC67). File facts were read from the tree at a77fda00c plus that day's uncommitted files. Every number is a dial with a reason.*

Weibao (2026-11-12): "Fine details for each one too? MOre to consider? steps to make sure all is carried out?"

## Phase 1 packets (PC51)

One packet is one brief, one writer and one receipt. Phase 1 has five, and the first unblocks the rest.

| Packet | What it builds | Files | Steps | Done command and result | Trap to avoid |
| --- | --- | --- | --- | --- | --- |
| P1.1 Reach and true states (queue 1) | The reachability tool, the three ledger states and the generic runner | new `scripts/reachable.mjs`; `scripts/coverage_report.mjs`; `tests/coverage_report.test.js`; `docs/coverage/*.jsonl` | 1. Walk static and literal dynamic imports from `src/main.js`; print counts and take `--json`. 2. Add `catalogued`, `expressed-*`, `runs-*` as PC9 defines them. 3. Runner loads a row's `case` module, executes it and compares `expect`. 4. Rows whose test asserts a label become `catalogued`. 5. Print old and new counts side by side for one run (Q1 default) | `npm run check:coverage` passes; a hand-typed `runs-*` row fails it; the walk reports 1,491 of 1,656 or today's true figure | A pack loaded through a computed path is missed by a static walk. List any such loader in the tool and test it |
| P1.2 Effect host (queue 2) | One function from a settled K effect to `applySentence`; an executing runs check | `src/effect_grammar.js` or a neutral host file (Q4); `src/effect_checks.js`; `src/spell_law.js`; one spell host the game loads | 1. Host takes `{sentence, details}` and applies it. 2. Spell law emits the sentence as its effect. 3. `checkEffect` applies the candidate in a probe world. 4. Import the host from one module on the game's path | Focused `tests/world_effects.test.js`, `tests/effect_grammar.test.js` and the spell law test pass; `reachable.mjs` lists `world_effects.js` and `effect_grammar.js` | Six objects lower to nothing (PC7). Count them as publishes waiting for an owner; do not give them a placeholder act |
| P1.3 Compression ledger (queue 3) | Counts C1-C6 with a baseline that moves one way | new `scripts/compression_report.mjs` and baseline json | 1. Count each row from the tree. 2. Write the baseline. 3. Fail on a move the wrong way | Prints C1 37, C2 24 + 41, C3 5, C4 4, C5 2, C6 0 of 7 or today's true figures | Counting by file name alone; C1 counts call sites of `resolveGuActivation(` |
| P1.4 Absorption matrix (A1) | System by facet rungs (PC24) | new `scripts/absorption_matrix.mjs` | 1. Read system patterns and facet owners from one data file. 2. Compute rungs from reachability, ledgers and the compression rows | Prints the PC28 systems against the PC23 facets | Typing a rung by hand to fill an empty cell |
| P1.5 Coupling map (E1) | Writers and readers of every W quantity and effect kind | new `scripts/coupling_map.mjs`; pack declarations under `src/world_substrate_packs/` | 1. Read each pack's declared reads and writes. 2. Group by domain. 3. Print couplings, unread writes, unwritten reads | Prints the cc1 humidity coupling between B and L | A pack that reads a quantity without declaring it. Compare declarations against a traced run for one case |

Order: P1.1 first. P1.2 next, since phase 2 stands on it. P1.3 to P1.5 are independent scripts and can run beside P1.2.

## Phase 2 verticals (PC52-PC53)

- **PC52 · Four named rows, each climbed through all seven steps.** Default picks are rows that already have chapter or book locators and a plain mechanism. Dial: the domain's chat may swap in another row with a reason in its receipt.

| Step | Gu: Moonlight Gu | Potion: Cure for Boils | Spell: the wand-lighting charm | Pet: house cat |
| --- | --- | --- | --- | --- |
| D1 Corpus | `moonlight` in `gu_kinds`, chapter-checked | `hp.potion.cure_for_boils`, running by authored test | `light` in `hp_spells`; if it does not lower to light, use `levitation` | `house_cat` in `creatures` |
| D2 Vocabulary | Path, function `cut`, rank, fuel, cost; body fields diet, ration and stages from the chapter that gives them, else `unknown` (PC32b) | Each ingredient's property axes, its preparation, the ordered steps and vessel | Root, gesture, intent, carrier and cost (`HP_ROOT_LEXICON`, `CARRIER_COST`) | Kind row fields; the bond as a tie plus what the keeper knows of this cat |
| D3 Law | `src/gu_working_law.js` | `src/brew_law.js` | `src/spell_law.js` | `src/creature_lifecycle.js`, `src/living_body.js` |
| D4 Effects land | A sentence that removes vitality along a line, applied by the host | A dose entering an L body and ending an affliction course (`src/dose_process.js`, `src/affliction_track.js`). This is the body door 82 potions wait on | A sentence that adds light at a place while sustained | Feeding as a working whose effect adds to the body's stores |
| D5 Canon runs | `expect`: the target's vitality is lower | `expect`: the boils course ends sooner than untreated | `expect`: the place's light is higher during the cast and back afterwards | `expect`: hunger lower after feeding; the stage advances at maturity |
| D6 Generates | One recombined variant with a changed target or time, executed | One ingredient swapped for another with the same property, with the changed result explained | A root swap rediscovers the canon darkening charm from held-out data | A litter with traits drawn from both parents |
| D7 Couples | Writes light; reads essence | Residue reaches a field quantity (`src/world_substrate_packs/residue_flow.js`) | Writes light that a light-seeking kind reads | Reads a prey cohort; writes to it by hunting |

Phase 2's shared chain, by default: light written by the charm or the Gu draws a light-seeking living kind (`src/world_substrate_packs/forage_attraction.js`, `tests/gu_light_attraction.test.js`), matching at both detail levels.

- **PC53 · Each domain also names one hard row now, and starts phase 3 with it.** Reason: four easy rows can pass while the hard joints stay hidden. Default picks: for Gu, `earth-communication-ear-grass` (a sense effect that publishes information for N); for potions, Polyjuice (a body form change); for spells, a memory charm (an object that lowers to nothing today); for living things, a Gu body with feeding such as the liquor worm. The hard row does not gate phase 2's exit. Its misses are written as the first backlog rows of phase 3.

## Phases 3 and 4 in detail (PC54-PC55)

The detail here is thinner on purpose: phase 2's misses decide much of it.

- **PC54 · Phase 3 is five repeating loops, one per domain plus the shared ones.**

| Loop | Each pass does | Owner | Counted by |
| --- | --- | --- | --- |
| Vocabulary | Run PC47 on the next batch of chapter-checked rows; add values; shrink `other` | Each domain chat | Vocabulary report |
| Reading | Chapter passes that turn wiki-only rows into checked rows, starting with the 79 ingredients that have evidence and the move leads (PC33b) | Readers, by AU rules | Blocking-rule counts in the coverage README |
| Owner answers | N, A and L answer the publishes PC7 counts (Hogwarts: N 16, K 14, A 7; Gu: L 8, K 6, N 5, A 1) | The owner named in the count | Unanswered publishes per owner |
| Compression | Move ten `resolveGuActivation` callers per pass onto the host and delete what the shared path now covers (queue item 5) | G | C1, C2 |
| Shared contracts | Techniques, identity, contest (A3 to A5), each with its second consumer (PC30) | K, C with the domains | Absorption matrix |

- **PC55 · Phase 4 order.** First the generation fit report and one generator the game loads (queue item 6). Then near and far parity (E2). Then A's actors loaded with one actor-driven chain. Then composition interactions (PC27). Soak worlds (E3) come last, since they need a place generator and actors. Reason: each step gives the soak one more source of chains (PC34), so running it earlier would measure coupling alone.

## More to consider (PC56-PC58)

**ACT NOW** (done in this edit)

- **PC56 · The carry-out steps below and the tracker are written**, and the core links here.

**ACCOUNT FOR NOW**

- **PC57a · A live run already owns the tree.** The Codex coordinator's Wave 9 is uncommitted on the primary checkout and its [RUN.md](gm/dispatch/foundation-run-2026-11-12/RUN.md) is the run's record. This doc changes neither. The coordinator adopts these packets when Weibao says so; until then they are a proposal beside the run.
- **PC57b · Two packets want the same file.** P1.2 and the spell chat both edit `src/effect_grammar.js` and `src/spell_law.js`, and queue item 5 and the Keeper compression lane both edit Gu callers. One writer per file (PFP4): the packet's brief names the file owner, and the other side sends a request.
- **PC57c · Reading is the real limit on coverage.** 1,388 Gu kinds, 753 move leads and 380 ingredients wait on text, and reading spends usage. Coverage past the chapter-checked rows moves at the speed of the reading loop, whatever the engine can do. The tracker shows this as its own line so slow coverage is not mistaken for a stalled engine.
- **PC57d · Three owner chats are on the critical path earlier than the plan's order suggests.** N answers 21 publishes, A 8 and L 8. Their v0 contracts need to exist by the start of phase 3, so their briefs go out during phase 2.
- **PC57e · Verification cost.** Packets run focused tests; the full suite runs once per merge wave (AD36). The status script (PC59) reads the tree and takes seconds, so it can run at every step.
- **PC57f · A vertical can pass by special-casing.** PC50 (c) is checked by the runner: a `coverageCase` exporter that branches on a row id fails. The same lint applies to laws (D3).
- **PC57g · Debug views help the agent as much as the player.** The facets inspector (PC33a) and chain viewer (PC43a) give browser evidence for phase exits. They are development surfaces, desktop viewport, and no player UI is owed until slices resume.
- **PC57h · The 8 GB target gets a number in phase 4.** The soak run records peak memory and time per world day, so a chain-rich world that cannot run on the target shows up before slices depend on it.

**LATER / DELEGATE**

- **PC58a · The status table as a page.** Publish the tracker as a small generated page for reading on another device. Level haiku, effort low. Done check: the page matches the script's output for the same commit.
- **PC58b · Second-world verticals.** Repeat PC52 with a Lord of the Mysteries potion and a D&D spell, as the second consumers PC30 asks for. Level sonnet, effort medium. Done check: each row runs through the same laws with pack data alone.

## Steps to make sure it is carried out (PC59-PC66)

The run so far lost ground in three ways: states typed by hand, code built beside the game, and new modules added while old ones stayed. Each step below closes one of those or keeps the plan resumable.

- **PC59 · One status script decides what is done.** Proposal: `scripts/procedural_status.mjs` runs every exit check in this doc and the core's phase table from the tree and prints pass or fail with the number behind it. A packet is closed when its line flips, and a worker's report alone does not close it. Default: report, exit 0. Dial: `--gate <phase>` exits non-zero for a coordinator that wants a hard stop. Reason: F3.
- **PC60 · The tracker is generated.** The table at the end of this doc is rewritten by the status script, like the coverage README. Until the script exists, the table is filled by hand from commands named in each row and says so.
- **PC61 · One packet, one brief, one receipt.** A brief names its packet id, files, owner, the PC codes it applies and its done command. A receipt records the command, the input commit, the result and the gaps, in the packet's existing dispatch folder.
- **PC62 · Ratchets on four numbers.** Coverage floors, the compression baseline, cross-domain couplings among loaded packs, and unreachable `src` files (165 today) each have a baseline file that moves one way. Dial: an owner may reset one with a reason in the same change. Reason: a ratchet catches a quiet regression without turning a percentage into a gate.
- **PC63 · A new module is on the game's path, or names who will put it there.** Default: a new `src` file that `reachable.mjs` cannot reach fails the check unless it is listed in a small allowlist with the packet that will load it. Reason: F1 and F7. This is the step that stops a library from growing beside the game.
- **PC64 · Deleting is part of done.** A packet that replaces bespoke code lists the files it deletes, and its done check includes the compression row falling. Dial: an adapter of 30 lines or fewer may stay for one phase.
- **PC65 · A wave ritual for the coordinator.** 1. Run the status script and read the tracker. 2. Pick the lowest-numbered failing check whose inputs exist. 3. Dispatch its packet with the brief in PC61. 4. Merge, run the full suite once, rerun the status script. 5. Check PC50's three change signals. 6. Update the resume line under the tracker. The ritual fits the [foundation run playbook](gm/FOUNDATION_RUN_PLAYBOOK.md) as its picking rule, by default.
- **PC66 · A phase exit is shown, then reported.** At each phase exit: one browser pass on the combined bundle from a fresh origin (PFP8), with save, reload, export and import for any facet that reached the game; then a short report to Weibao in outcomes he can try, with "agent-verified, not human-reviewed" (AD42).

## Reconciliation, 2026-11-12

Scope: the core (PC1-PC50, PC67-PC80) and this doc against the [foundation plan](PROCEDURAL_FOUNDATION_PLAN.md), the run record, `PROJECT.md`, the [rules index](RULES_INDEX.md) and the [area guide](AREA_GUIDE.md), on the tree at a77fda00c plus uncommitted files. Evidence reached: current source and docs read. No test was rerun for this pass; `check:docs` and `check:rules` were.

| ID | Claim and locator | Class | Owner and consumer | Evidence | Disposition |
| --- | --- | --- | --- | --- | --- |
| RC1 | The core's palette column lists `kernel_identity`, `contest` and `agency` (PC20) while its queues need them (A4, A5, phase 4) | Genuine disagreement inside one doc | Core; the K, C and A chats | Both passages read | Fixed: PC20 moves them to core with the reason |
| RC2 | F8 says three chains are pending | Stale documentation | E's case file; the coordinator | Run record waves 6 to 9 report fixtures for all three; three test files exist; not rerun | F8 amended. The known-chains file still holds cc1 alone, which queue item 7 covers |
| RC3 | Two progress vocabularies: the plan's MS1-MS7, used by the run record, and the core's four phases | Compatible variant | Plan and run record; coordinator | Both tables read | Mapped below. The run keeps reporting MS until the coordinator adopts the phases |
| RC4 | The rules index registers the K, P, A, C, M and R contracts and has no row for the core | Incomplete integration | Rules index; lane briefs | `docs/RULES_INDEX.md` rows 68, 97-101 | Row added as proposed, with no code range: the index check accepts a range when every code is a bold lead ending in a period, and these docs use another form |
| RC5 | `PC1` to `PC3` here against lowercase `pc1` to `pc3` chain ids in the run record | Naming hazard | Both | Run record lines 118-147 | Note added at the top of the core |
| RC6 | The run record, handoff and playbook do not mention the core or this doc | Incomplete integration | Coordinator's files, modified and uncommitted by another session | `grep` found no reference | Left alone: another writer owns them. Waits on Weibao's answer about adoption |
| RC7 | `PROJECT.md` points at the plan, and the plan's third line points at the core | None found | `PROJECT.md` | Lines read | No change |
| RC8 | The area guide lists the grammar and substrate as abstractions to build on, while the grammar stack is not loaded by the game (F1) | Missing proof in the guide | Area guide; anyone choosing a module | Guide lines 338 and 366; reachability walk | Unchanged here: the guide describes what to build on, and P1.1's tool will give it a figure to cite |
| RC9 | Q2 and Q5 defer work and are not in the limiting lines review | Compatible variant | Core's open questions | Review is a dated 2026-11-10 audit | Left in the core's open questions, which is where they are answered |
| RC10 | The core says the plan "grew to 748 lines"; the core is now about 590 | Stale framing | Core | `wc -l` | A section map was added at the top of the core. Splitting it is a later tidy, with no content change |
| RC11 | S checkpoint line 77 says 94 of 117 spells run; `docs/coverage/hp_spells.jsonl` and the coverage README say 80 | Stale documentation or a later ledger change | S chat; coverage report | Both read; cause not traced | Open: S confirms which is current. P1.1 makes the ledger the computed source either way |
| RC12 | PC29 called the Gu body facet mostly data; no Gu row has a diet | Evidence correction | Core; L and G | `src/gu_catalogue.js`, `docs/coverage/gu_kinds.jsonl` | Fixed in the core (F14, PC86) |

Unmapped: the plan's GN, IH, DG, BL, LN, SPD, PTD, MD, FN, OA and BX families were not compared row by row against PC48; the per-chat checkpoints under `docs/gm/dispatch/foundation-*-2026-11-12/` were read for L and B alone.

### Milestones and phases (RC3)

| Plan milestone | Run record says (not rerun) | Lands in |
| --- | --- | --- |
| MS1 ledgers classified | Verified | Before phase 1. PC9 keeps the rows and changes what `runs` means |
| MS2 effect layer | Report delivered; 70% target open | Phase 1 replaces the target with expressibility (PC10's note) |
| MS3 runs as data, ten Keeper deletions | Seven of ten | Phase 2 for the four rows, phase 3 for the rest and the compression rows |
| MS4 moves and composition | Four canon cases, one generated archived move | Phase 3 (A3) and phase 4 (generation) |
| MS5 works in play | Open | Each phase's exit, by PC66 |
| MS6 breadth and three chains | Engine fixtures reported for all three chains | Phase 3 for N, A and L v0; phase 4 for chains on loaded packs |
| MS7 long tail | Ongoing | The reading loop (PC54) |

## Tracker

*Filled by hand on 2026-11-12 from the commands named; PC60 replaces this with generated output. "Open" means the check fails or its script does not exist yet.*

| Phase | Check | Source of truth | State |
| --- | --- | --- | --- |
| 1 | Ledger states computed by the runner | `npm run check:coverage` | Open: states are typed (F3) |
| 1 | A settled spell changes a W world through one host on the game's path | `scripts/reachable.mjs`, focused tests | Open: `world_effects.js` and `effect_grammar.js` unreachable (F1) |
| 1 | Compression ledger prints with a baseline | `scripts/compression_report.mjs` | Open: no script |
| 1 | Absorption matrix prints | `scripts/absorption_matrix.mjs` | Open: no script |
| 1 | Coupling map prints | `scripts/coupling_map.mjs` | Open: no script |
| 2 | Moonlight Gu at D7 | Runner, matrix | Open |
| 2 | Cure for Boils at D7 | Runner, matrix | Open: runs by authored test; body door missing |
| 2 | Wand-lighting charm at D7 | Runner, matrix | Open |
| 2 | House cat at D7 | Runner, matrix | Open: runs by authored test |
| 2 | One chain across two of the four, near and far | Emergence harness | Open |
| 3 | `other` rate at its dial per domain | Vocabulary report | Open: no report |
| 3 | C1 and C3 at their floors for Gu | Compression ledger | Open: 37 and 5 |
| 3 | Unanswered publishes per owner | Runner | Open: 57 counted in PC7 |
| 3 | Techniques, identity and contest loaded with a second consumer | Matrix | Open |
| 4 | Generated Gu, move, potion and spell reachable in play | Runner, reachability | Open |
| 4 | Soak reports discovered chains from all three sources | Emergence harness | Open |
| 3 | Data already read is in the ledgers (PC85) | Coverage README | Open: 177 potions on `formula-in-notes`; no `canon_negatives` ledger |
| Reading | Chapter-checked share of Gu kinds, moves and ingredients | Coverage README | 78 of 1,466 kinds; 23 of 776 moves; 20 of 409 ingredients running, 79 more with evidence rows |

Resume line: phase 1 not started under this plan. Next packet P1.1. Questions waiting: Q1, Q2, Q5, Q7 in the [core](PROCEDURAL_CORE.md#open-questions).
