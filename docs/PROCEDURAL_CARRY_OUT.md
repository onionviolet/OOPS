# Procedural carry-out

*Proposal for Weibao, 2026-11-12, and a proposal throughout (AD32). Companion to the [procedural core](PROCEDURAL_CORE.md): that doc says what and why, this one says who does what in which file, how each piece is checked, and how the whole plan is kept from stalling. Codes continue the core's: PC51-PC66 here, PC67-PC88 in the core, PC89-PC99 here again. **Read PC95 first: it sets the engine world as the bar and defers game tie-in.** File facts were read from the tree at a77fda00c plus that day's uncommitted files. Every number is a dial with a reason.*

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
- **PC62 · Ratchets on four numbers (trimmed by PC94 to the compression baseline alone).** Coverage floors, the compression baseline, cross-domain couplings among loaded packs, and unreachable `src` files (165 today) each have a baseline file that moves one way. Dial: an owner may reset one with a reason in the same change. Reason: a ratchet catches a quiet regression without turning a percentage into a gate.
- **PC63 · A new module is on the game's path, or names who will put it there (withdrawn as a check by PC94; kept as a line in each brief).** Default: a new `src` file that `reachable.mjs` cannot reach fails the check unless it is listed in a small allowlist with the packet that will load it. Reason: F1 and F7. This is the step that stops a library from growing beside the game.
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
| RC13 | The core's Q1 (may headline numbers fall) is open, while `hp_spells` typed runs fell from 80 to 42 in Wave 12 because 38 rows now carry a case and are typed `expressed-authored` | Genuine disagreement between an open question and delivered work | Core Q1; S's ledger | `docs/coverage/README.md` side-by-side table: typed 42, computed expressed 38 | Left as delivered, with both figures shown. Weibao's answer to Q1 either keeps it or restores the old typing for case rows |
| RC14 | PC49's four phases, PC91's order, PC95's order and PC99's family starts each state an order | Duplicate, with later ones superseding | This doc | Sections read | The [canon-first run order](gm/dispatch/foundation-run-2026-11-12/RUN.md#canon-first-wave-order-2026-11-12) owns dispatch. Earlier schedules record how the work was planned at the time |
| RC15 | PC94 caps a wave at three code lanes; Waves 11 and 12 ran five and seven | Compatible variant, by Weibao's instruction to use the Fable allowance | Run record | Run record Wave 12 | The cap returns to three under a Codex coordinator unless Weibao says otherwise |
| RC16 | The first PC99 wording gave body alteration "one slot rule" and "capacity" as limits | Evidence correction, from Weibao's words | PC99 | PC99 as corrected | Fixed: capacity is a default with a cost curve and five ways around it |
| RC17 | Core F15 said 177 potion formulas were already written down | Evidence correction | Core F15; `w11-formulas` return | 3 named, 1 partly, 173 not named | Fixed in the core; the 173 are a reading job |
| RC18 | `tests/headless/*.test.js` is outside the suite glob (`tests/*.test.js`), and `tests/headless/away_bank_equivalence.test.js` fails its woodcutting case | Missing proof | Away bank (TMR4); no wave in this run touched it | Fails the same way on a clean checkout of `0876c3906` | Open: not caused by this run. Its owner decides whether headless tests join the suite |
| RC19 | Two focused runs in this run's records (Wave 11 fold and the Codex fold) passed fewer files than intended, because the shell did not split a file list | Evidence correction | Run record | Rerun with one argument per file: 26 files, 281 tests, 278 pass, 0 fail, 3 skipped | Wave 11's full suite already covered the first; the Codex fold is covered by the rerun and by Wave 12's full suite |
| RC20 | The run record, handoff and playbook did not mention these docs (RC6) | Resolved | Run record | Takeover block and Waves 10 to 12 cite them | Closed. The earlier uncommitted edits to the playbook and the first Codex handoff are still not this run's and stay uncommitted |

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

## Readjusted from the details (PC89-PC93, 2026-11-12)

Weibao (2026-11-12): "I meant details, readjust the finer plans based on the details and the end goal". This section changes the packets above where the readings check (core F14-F21) and Wave 10 found the facts differ from what the plan assumed. Where a line here conflicts with PC51-PC55, this line is the current one.

### The end goal as five numbers (PC89)

Proposal. The run is done when these are true, each printed by a script that exists now or is named below. They restate the core's goals as what the game does.

| # | End state | Number | Today (Wave 10) |
| --- | --- | --- | --- |
| G1 | Canon runs as data in the game | Computed `runs` above zero in every ledger, with the share reported | 0 in all seven (`npm run check:coverage`) |
| G2 | The shared world is the game's world | Substrate packs loaded by the game | 1 of 11 (`npm run report:couplings`) |
| G3 | Systems meet with no join code | Cross-domain couplings among loaded packs | 0, against 5 among all packs |
| G4 | New things execute in play | Generators reachable from the game, with executes above zero | 0 |
| G5 | Bespoke code shrinks | C1 and C2 in the compression ledger | 36 and 65 |

Everything canon cannot be derived by rule counts under PC84's `authored` state, so G1 has an honest remainder.

### What the details change (PC90)

| Detail found | Plan assumed | Readjustment |
| --- | --- | --- |
| One module in `src` composes a substrate world, and it is a private chamber world (`src/meadow_shell_state.js`). The effect host needs a world to land on | A spell host on the game's path was one import away (P1.2) | New packet **P1.7, a live world per place**: one owner module that composes the substrate from a registered pack list and holds the world for the player's current place, saved under its own slice. It is the precondition for G2, G3 and for landing any effect in play |
| The game's spell path is `src/spellbook_host.js` through `spell_working.js`; `spell_law.js` is library | The spell law was the consumer | **P1.2b** lands the spellbook cast through `landEffect` on P1.7's world. `spell_working` keeps its shape for now; C3 falls later |
| Spell words (fire, water, access, harm, mood) return `unmapped`; a map `P_OBJECT_OF` already exists in `src/spell_effects.js` | One effect vocabulary | **P1.6, vocabulary fold (PC81)** goes before P1.2b: the host accepts spell words through the existing map, the stray verbs join or map, and `luck` and `soul` are added with their two-world evidence |
| 25 of 109 executed sentences were refused for missing amounts, destinations or fields | A sentence was enough to execute | A `coverageCase` supplies `details` (amount, destination) from the source where it gives one and from the pack default otherwise. The first real cases come from the 55 that landed |
| C5 is 10 fixture grammars and labellers | 2 | Queue item 4 (grammars into world packs) is a medium move with six grammars; it splits per world, Hogwarts first because its cases are the first rows for G1 |
| No Gu row has a diet | Body facet was mostly data | A2 starts with the feeding pass (PC86). The Moonlight Gu row in phase 2 ships its body fields as `unknown` where no chapter gives them, and that counts |
| The dose-to-body joint is proven in a fixture with the Draught of Living Death (`tests/brew_body_delivery.test.js`) | Cure for Boils was the potion row | The phase 2 potion row is the **Draught of Living Death**, which already brews as data and now reaches a body in a fixture. Cure for Boils becomes the second potion row |
| The light chain (colony light to wild movement to a rival's choice) and the residue chain exist as fixtures on packs the game does not load | Phase 2 had to build a chain | Phase 2's chain work is loading those packs through P1.7 and adding them to the known-chains file. The chain itself is built |
| The creatures ledger has no Hogwarts creature | A Hogwarts creature was the body facet's second consumer | The second consumer for the body facet is the house cat and sheep rows that already run, until a reading pass adds a Hogwarts creature row |
| About fifteen canon failures are already in notes. For the 177 blocked Lord of the Mysteries potions the earlier claim was wrong: the rule means no pack row exists, and how many have a formula in the pathway table is uncounted (core F15) | Reading was the next step | Count first, move what the table names, leave the rest for reading (PC85), as a Codex lane |

### Revised phase 1 and 2 order (PC91)

| Order | Packet | Owner | Depends on | Done check |
| --- | --- | --- | --- | --- |
| Done | P1.1 tooling, P1.2 library, P1.3, P1.5 | | | Wave 10 fold in the run record |
| Dropped from phase 1 | P1.4 absorption matrix | | | Withdrawn by PC94; revisit when a second system is being absorbed |
| 1 | P1.6 vocabulary fold | P with S | None | A spellbook word that was `unmapped` lands in the host test; one list, with the map's rows named |
| 1 | P1.7 live world per place | W with the composition root | None | The world is created, advanced, saved, reloaded and imported on one existing route with the shell regulator moved onto it; G2 reads 1 of 11 through the registry, then each added pack raises it |
| 2 | P1.2b spellbook cast lands | S with W | P1.6, P1.7 | A cast of the wand-lighting charm raises light at the practice place in the built game; browser proof with save, reload, export and import |
| 2 | P1.8 Hogwarts effect grammar into a world pack with `coverageCase` | S | P1.1 | Computed `runs` above zero for `hp_spells`; C5 falls by the Hogwarts entries |
| 3 | Phase 2 rows: wand-lighting charm, Draught of Living Death into a body, house cat, Moonlight Gu | S, B with L, L, G | P1.7, P1.2b | PC52's steps, with the changes in PC90 |
| 3 | Load the light and residue packs through P1.7 | E with L and B | P1.7 | G3 above zero; two chains in the known-chains file |
| Beside | Data moves on Codex: formulas, canon negatives, Gu feeding pass | B, P, G | None | PC85, PC86 |

Reason for P1.7's place: it is the one piece every end-state number except G5 waits on, and nothing in the earlier packets built it.

### More to consider (PC92)

**ACCOUNT FOR NOW**

- **PC92a · A live world changes saves.** P1.7 adds a save slice. Old saves are disposable, so the default is a versioned slice with no migration, and the route proof includes import of a save made before the slice existed.
- **PC92b · One world or one per place.** Default: one world record per place the player has visited, advanced in detail where the player is and by rates elsewhere (PFP12), since that is what the substrate's detail levels were built for. Dial: a single world for small test beds.
- **PC92c · The chamber world moves, it is not copied.** `meadow_shell_state.js` becomes the first consumer of P1.7, and its private world goes away with its route proof kept at parity. Reason: two worlds in one game would not meet, which defeats G3.
- **PC92d · Cost.** A world advanced every tick for every visited place is the idle-time risk on the 8 GB target. P1.7's done check includes one far place settled by rates with the same totals.
- **PC92e · Each new loaded pack is a behavior change in play.** Loading the brew steam or light packs makes existing routes read new quantities. Each load is its own small packet with a parity check on the routes that share the place.

**LATER / DELEGATE**

- **PC92f · Resolve the three computed pack declarations** (`c.contest`, `m.market`, `w.sky`) so the coupling map reads them. Level sonnet, effort low. Done check: no `unresolved` rows.

### Status script (PC93)

Withdrawn by PC94. The five numbers are read by running `npm run check:coverage`, `npm run report:couplings` and `npm run report:compression` in sequence.

## Keep it small (PC94, 2026-11-12)

Weibao (2026-11-12): "do take into consider these too", with a screenshot of a thread summary on AI overengineering. Its points: agents pile on validations, safeguards and patches where stepping back would be simpler; an unattended run can build a bureaucracy around the goal and miss it; set clear completion criteria, review the plan and changes, and stop runaway retry loops.

That describes a risk in this plan. In one day these two docs reached 94 codes, four proposed ratchets, an allowlist and three new report scripts, while the game loads one pack of eleven. The readjustment, as defaults:

| Rule | What it changes here |
| --- | --- |
| **Completion is five numbers** (PC89). Work that moves none of G1 to G5 needs a stated reason before it starts | Each packet names the number it moves. A packet that moves none is tooling, and tooling is capped below |
| **No new checker until an old one is used.** Three report scripts exist. The next script is written when a coordinator step is being done by hand for the third time | P1.4's absorption matrix is dropped from phase 1. PC59's status script is not built as its own tool; the three existing reports are run in sequence. PC60's generated tracker is filled by hand once per wave |
| **One ratchet, already built.** The compression baseline stays | PC62's other three ratchets and PC63's allowlist for unloaded modules are withdrawn. The loaded-pack count (G2) reports the same problem with no gate |
| **Two tries, then stop.** A lane that misses its done check gets one corrected brief. If the second return also misses, the coordinator stops that packet and writes what was learned | Applies to every packet from Wave 11. A failed route check is rerun once when the cause looks like load, as in Wave 10, and diagnosed in source after that |
| **A wave is small enough to review.** At most three code lanes, each with a named file list, and the coordinator reads every diff before the gate | Already the practice; now a stop condition if a lane returns more files than its list |
| **Delete before adding.** A packet that adds a module to `src` names what it replaces, or says it is new mechanism with its first loaded consumer | P1.7 replaces the chamber's private world. P1.2b adds no module |
| **The plan stops growing.** No new plan section unless Weibao asks for one or a wave's facts contradict a line | From here, findings go to the run record as receipts. These two docs change by editing lines, and the tracker |
| **Report at each wave, in outcomes.** A wave ends with what changed in the game, the five numbers, and usage read | Stops a long unattended stretch from hiding drift |

What is kept on purpose: the full suite once per merge wave, the existing arch, rules and coverage checks, browser proof for anything the game loads, and the guarded commit. Those predate this plan and each has caught a real fault.

## Engine first, tie-in later (PC95, 2026-11-12)

Weibao (2026-11-12): "Because foundational first, We can omit game tie in until foundational and procedural systems work?" and, after the trade-off was laid out, "reconcile accordingly, we can absorb bespoke into the system".

This is direction, and it overrides earlier lines in both docs. Wherever the core or this doc says "reachable from `src/main.js`", "the game loads it", "in the game" or "in play" as a bar for counting something, read "runs in the engine world" until the tie-in phase.

- **The engine world.** One headless module composes every substrate pack from a registered list, holds holders for places, bodies and things, advances time near and far, and serializes and restores. It is the integration target in place of the game. A spell, a potion, a Gu and a creature run in that one world on one clock, with no code written for a pair.
- **Dropped until tie-in:** wiring into `src/main.js` or live routes, browser passes and save, reload, export and import proofs for new foundation work, and game save slices for the world. Existing routes are left as they are.
- **Kept, so tie-in is hosting and not redesign:** the engine world uses the kernel's save shape (KW10) and the same one-jump-or-many settlement tests the game needs. The full suite, arch, rules and coverage checks stay.
- **Bespoke code is absorbed now, deleted at tie-in.** A bespoke module counts as absorbed when its behavior is re-expressed as rows and laws in the engine world and a parity fixture shows the same outcomes as the old module on the same inputs. The old module stays in place while the game still imports it. Deleting it is tie-in work.
- **Tie-in is its own phase**, after phase 4 and before slices: host the engine world in the game, move live routes onto it, delete absorbed modules, and run the browser and save proofs once.

The five numbers (PC89) at the start of PC95. See the resume line below for the current run evidence.

| # | End state | Number | Today |
| --- | --- | --- | --- |
| G1 | Canon runs as data | Computed `expressed` above zero in every ledger, through the generic runner in the engine world | 0 in all seven |
| G2 | One shared world | Packs composed by the engine world | No engine world yet; 11 packs exist |
| G3 | Systems meet with no join code | Cross-domain couplings among engine-world packs that a run exercises | 5 declared among all packs; not run together |
| G4 | New things execute | Generators whose output executes in the engine world | 0 |
| G5 | Bespoke code is absorbed | Bespoke Gu modules with a passing parity fixture, of the 65 Keeper modules and 36 activation callers | 0 counted this way; 7 modules were deleted outright in earlier waves |

Revised order, replacing PC91's rows from "1" down:

| Order | Packet | Owner | Moves | Done check |
| --- | --- | --- | --- | --- |
| 1 | P1.7 engine world | W | G2 | One module composes all eleven packs with no pack importing another; a mixed run advances in one jump and in steps to the same state and restores from its save |
| 1 | P1.6 vocabulary fold | P with S | G1 | A spell word that was `unmapped` lands through the host; one list with the map's rows named |
| 1 | P1.8 Hogwarts effect grammar into a world pack with `coverageCase` | S | G1 | Computed `expressed` above zero for `hp_spells`; C5 falls by the Hogwarts entries |
| 2 | Phase 2 rows in the engine world: wand-lighting charm, Draught of Living Death into a body, house cat, Moonlight Gu | S, B with L, L, G | G1, G3 | PC52's steps with D7 read as "couples in the engine world" |
| 2 | First absorption with parity: one Keeper scene re-expressed as rows | G | G5 | The parity fixture matches the old module's outcomes on its existing test inputs |
| 2 | The light and residue chains run in the engine world | E | G3 | Both signatures appear in a mixed run with no case-specific code |
| Beside | Data moves on Codex: formulas, canon negatives, Gu feeding pass | B, P, G | G1 | PC85, PC86 |
| Deferred to tie-in | P1.2b spellbook cast lands; game save slice; route parity; module deletion | | | Tie-in phase |

## Loops and levels (PC96, 2026-11-12)

Weibao (2026-11-12): "More to consider? other systems we might be missing? Anything worth starting concurrently? I mean emergent behavior at multiple levels, overall, in comning game feautres and domains, systems that creates subsystems like in creating creatures and genetics, can lead to stuff like optimizing creatures and more, and similar things can apply everywhere else?"

Proposal, kept to one section (PC94). Facts read that day: heredity already has genomes with loci, mutation, mutagens raised by world conditions, and hidden genes learned by testing or from offspring (`src/heredity.js`, `src/living_genomes.js`, `src/lineage_traits.js`). A budgeted search and a best-per-niche archive already exist (`src/kernel_search.js`, `createNicheArchive` in `src/effect_checks.js`).

**The improvement loop is one pattern, and breeding is its first case.** A domain supports optimizing when it has five things. Each already has an owner, so this is a checklist for domain packs, with no new module.

| Part | Creatures | Potions | Spells | Gu and techniques | Made things |
| --- | --- | --- | --- | --- | --- |
| A space of variants (V3 parts) | Genes | Ingredients, amounts, order, timing | Roots, gesture, intent | Which Gu fill which role; refinement inputs | Materials, form, joins |
| A result the world computes, with no score sheet | How the animal lives and works | What the dose does in a body | What the cast changes | What the move changes | Where it fails under load |
| A way to keep a gain | Heredity | A written recipe | A practiced form | A refined Gu, a taught move | A pattern |
| A cost or trade-off, so there is no single best | Fine wool against hardiness | Potency against side effects | Power against cost and control | Strength against upkeep and backlash | Strength against weight |
| What the maker can and cannot see | Genotype hidden, phenotype seen | Properties unidentified until assayed | Mishap causes unclear | Roles and conflicts learned by trial | Flaws hidden until stressed |

Default: "best" depends on place and purpose, because the result is computed in a world with its own quantities. Reason: that is what keeps optimizing a long game and makes two breeders want different animals.

**Emergence by level.** PC34 named three sources. They also stack, and each level has its own clock.

| Level | What emerges | State holder | Where it stands |
| --- | --- | --- | --- |
| 0 Inside a thing | A whole that does what no part does | Technique, recipe, genome | Composition exists; interactions not built |
| 1 Between things | Steam, light, residue reaching another system | Engine world quantities | Fixtures; P1.7 runs them together |
| 2 One actor | Noticing and responding | A's actors | Library |
| 3 A population | Drift, selection, predator and prey, contagion | L's cohorts | Cohorts exist; rates across generations not exercised |
| 4 A society | Prices, rival breeders and brewers, arms races, fashions | M | A contract, with no run yet |
| 5 A history | Lineages, schools, a move that outlives its maker | Descent graph, PG4 | Later |

A chain that climbs levels is the payoff: an optimized ewe changes a price, a rival starts breeding, the hill's grazing shifts. The harness signature already records domains; it gains the level of each link, by default, so climbing chains can be counted.

**Systems the plan was missing or had only by implication.**

| Code | System | Why it matters here | Owner |
| --- | --- | --- | --- |
| MS-A | **Assay and measurement.** Instruments, tests and trials that turn a hidden value into knowledge, with error | Every improvement loop needs a way to read results. Heredity has it; potions, spells and Gu do not share it | N, with each domain supplying its tests |
| MS-B | **Standing programs.** A working repeated under a policy over a long stretch: breed the best two each season, brew until stock is thirty | This is an idle game. A breeding program run over years of game time is the idle form of the loop, and it needs the far-time rate form (PC42a) | K for the repeat, A for the policy |
| MS-C | **Sources of materials.** Where an ingredient or a wild kind comes from, by a place's quantities | Scarcity and place-dependent quality feed every trade-off | X with L and W |
| MS-D | **Contagion and spread.** Afflictions, pests and also ideas moving through a population | The cheapest population-level emergence, on bodies and cohorts that exist | L, N |
| MS-E | **Decay and waste.** Spoilage, wear, residue, death | Closes the loops so stock does not pile up; residue already starts chains | B, F, L |

**Worth starting beside the next wave.** The three Claude lanes are P1.7, P1.6 and P1.8. These are disjoint from them and from each other, sized for Codex lanes, and each names its number:

| Lane | Deliverable | Files | Moves |
| --- | --- | --- | --- |
| Formulas | Count which of the 177 blocked potions have a main material in the pathway table; move those into pack rows (PC85) | The brew pack's data | G1 |
| Feeding pass | Diet fields for the 78 chapter-checked Gu from their chapters (PC86) | `src/gu_catalogue.js` | G1 |
| Breeding program fixture | Over twenty generations of the existing sheep genome, select for one trait and show the gain, its cost in another trait, and that hidden genes limit the breeder until tested. A second run with a different goal ends with a different flock | One new test file on `src/heredity.js` and the lifecycle | G4, and it is the worked example of the loop above |

Not started now: MS-A to MS-E. Each waits for a consumer in phase 2 or 3, by PC94.

## Direct operators: science-fiction and magical tweaks (PC97, 2026-11-12)

Weibao (2026-11-12): "consider sci fi and magical aspects and tweaks too, like cloning, gmo, other stuff and more? Same level of depth for each group".

Proposal. PC96's loop improves a thing slowly, by variation and selection. A direct operator reaches into a thing's parts and changes them. Cloning and gene editing are two of six, and each has a counterpart in every group, at the same depth.

| Operator | Creatures | Potions | Spells | Gu and techniques | Made things |
| --- | --- | --- | --- | --- | --- |
| **Copy** the design | Clone; a cutting; a twin grown from a sample | Reverse a sample into its recipe; rebrew to a reference | Transcribe to a scroll; steal or imitate a cast | Replicate a mortal Gu; teach a move exactly | Mold, pattern, print |
| **Edit** one part | Set one gene (GMO); awaken or suppress a trait | Purify, concentrate, swap one property | Change one slot: reach, duration, target, cost | Reforge one aspect; retune a role in a move | Retrofit one part; re-temper |
| **Graft** two wholes | Chimera, hybrid across kinds, a transplanted organ | Blend two finished potions; layer doses | Fuse two spells into one casting | Fuse two Gu; splice two moves | Composite materials; hybrid mechanisms |
| **Induce** change by condition | Mutagens, radiation, a storm, a potion in the feed | Catalysts, moonlight, aging, vessel history | Wild surges, ley conditions, emotional state | Dao mark infusion, tribulation tempering | Stress hardening, weathering, enchantment by exposure |
| **Transfer** a part across things | Bloodline infusion; a trait moved into another kind; a mind into a new body | An ingredient's property extracted and carried into another base | A spell bound into an object or a body | A move refined into a Gu; a Gu's ability lent to a host | A property moved from one object to another; a living item |
| **Make from nothing born** | Homunculus, construct, vat-grown or summoned body | Synthesis of the active property with no natural source | A spell derived from first principles, with no tradition | An artificial Gu; a designed move with no lineage | Self-building or grown artifacts |

How this fits what exists, as defaults:

- **Operators are workings on parts.** The effect vocabulary already has `copy`, `transform`, `bind`, `move` and `alter`. An operator is one of those aimed at another thing's parts, so the parts have to be addressable in the engine world as properties on a holder (a body's genes, a recipe's steps, a spell's slots). That is the one new requirement, and identity (KW22-KW26) is where it lands.
- **Science and magic are two carriers for the same operator.** A gene edit by laboratory and a bloodline infusion by ritual are both an Edit or a Transfer; they differ in carrier, cost, what the maker must know and what goes wrong. Which carriers a world has is pack data. Default: an operator is available wherever the world has a mechanism for it, at that world's cost.
- **Every operator has a price that follows from how it works.** Copy raises the question of whether the copy is the same individual (KW24) and loses what was learned after birth. Edit needs the part to be known first (assay, MS-A) and can miss. Graft risks rejection or interference (PC69's tables). Induce is cheap and blind. Transfer takes from a donor. Immortal Gu uniqueness constrains ordinary Copy. Apply source-attested exceptions at their stated price and judge invented routes by how they avoid, alter or satisfy the underlying law (AD5, AD38).
- **Expansions can reach around local rules.** A route may use local means or compatible means brought across a world boundary (XWR7, XWR10, XWR28). Either origin can have source-attested or invented routes. Keep the route's provenance and state what makes it work, what the character needs to access it, and where difficulty comes from. An imported tool that supplies a missing function, for example, still needs passage, a working power source and any upkeep its design requires. See [Weibao's direction](gm/USER_VISION_LOG_2026-11.md#ways-around-world-rules-in-expansions-2026-11-12).
- **Each feeds the higher levels (PC96).** A cloned flock has one weakness, so one contagion takes all of it. An edited kind that escapes changes the wild cohort. A copied spell or potion moves its price and its maker's standing. A society can forbid, tax or worship an operator.

Not started now (PC94). First worked example, when the two lifecycle faults from Wave 11 are fixed: Copy and Edit on the sheep genome in the breeding fixture, showing a cloned pen losing to a storm-borne affliction that a bred pen survives.

## Crafts, other features, and absorbing a power system (PC98, 2026-11-12)

Weibao (2026-11-12): "other opertator types we should consider? runes? forging? other stuff? Other game featues that could benefit from a procedural system? Absorbing a world's power system into something, like what we ddi for gu? So maybe like superpowers, maybe from potions, for something like the perfect run?"

Proposal, one section (PC94).

### Runes and forging are crafts, and crafts come in four families

PC97's six operators say what is done to a design. A craft is how it is done. Each family below is one mechanism that several crafts share, so building the mechanism once gives every craft in its row.

| Family | Crafts in it | The shared mechanism | What exists |
| --- | --- | --- | --- |
| **Stored workings** | Runes, talismans, scrolls, enchanted items, wards, traps, formations, potions held ready, programmed constructs | A working bound to a carrier thing with a trigger, a charge and a decay. It fires later, for someone else, or on a condition | The sentence has a `triggered` time; `src/rune_grammar.js` already resolves rune pairs by a table where an unnamed pair still gives a result. `src/stored_working.js` provides the shared record and its engine host. See the [ward and condition proposal](ABILITY_RULES.md#wards-and-effects-on-people-long-term-proposal) for the remaining consumers |
| **Process crafts** | Forging, tempering, brewing, cooking, refining, distilling, firing, curing | A thing's state moved along a path of steps where order, heat, time and tool matter, and the path is part of the result | Brewing has it (`src/brew_law.js`), and a thermal process exists for craft. Forging has no law on it yet |
| **Body alteration** | Implants, cybernetics, tattoos, grafts, permanent potions, cultivation methods, a Gu in an aperture, an Elixir | A lasting change held in a body slot with limited capacity, an upkeep and a rejection risk | Organs and apertures on L; `src/implant_service.js`; no shared slot rule |
| **Bindings** | Contracts, oaths, familiars, taming, summoning, soul bonds, sworn items | A lasting relation between two holders with terms, a price and a breach | Oaths in the kernel (KW35-KW39); ties and custody |

Default: a new craft is a pack on one of the four, plus a thin law for what only it does. A rune is a stored working whose parts interact by a pair table. A forged blade is a process craft whose result lands as properties another law reads.

### Other features the same treatment helps

Each already has an owner in the plan; the note is what "procedural" would mean there.

| Feature | What becomes data over rules | Owner |
| --- | --- | --- |
| Quests and situations | A pressure, actors, stakes and a clock, arising from the world's state | D |
| Sites, dungeons, ruins | A place generated from its history and quantities; what is found follows from who lived there | X |
| Loot and found items | A thing made by a maker in the world, with its lineage, and found where it was left | F, identity |
| Shops and prices | Stock from what is made nearby, price from scarcity | M |
| Skills and training | Practice of a technique changing cost and failure; teaching with drift | N, R |
| Illness, injury, medicine | Courses on a body that doses and care change | L, B |
| Names and descriptions | Words built from a thing's parts | P with the naming and prose rules |
| Weather and seasons | Sky quantities every other system reads | W |
| Rivals and companions | Actors on the player's rules with their own improvement loops | A |

### Absorbing a world's power system: eight questions

What was done for Gu, written as a recipe. A power system is absorbed when a world pack answers these with rows, and a thin law holds what no other world shares.

| # | Question | Owner | Gu | Lord of the Mysteries | Hogwarts | The Perfect Run (from memory of the book, not a reading) |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Where does the power come from? | Making, sources | A Gu, refined or caught | A potion brewed from a formula | Inborn talent, a wand | An Elixir, drunk |
| 2 | Where does it sit, and how much fits? | L's body slots | The aperture | One Sequence at a time | The person | One power per Elixir |
| 3 | What does using it cost? | W quantities | Primeval essence | Spirituality | Stamina, focus | Varies by power |
| 4 | What does it do? | K working, effect sentence | Abilities | Sequence abilities, rituals | Spells | The power |
| 5 | How does it grow? | R | Rank, feeding, refinement | Digestion by acting | Study and practice | Mastery and understanding |
| 6 | What does it cost to hold, and what goes wrong? | Laws on the body | Feeding, backlash | Loss of control | Mishaps, rebounds | A second Elixir breaks the mind |
| 7 | How do powers combine? | Technique, interaction tables | Killer moves | Rituals, sealed artifacts | Combined casting | Teams and synergies |
| 8 | Who controls access? | M | Clans, inheritances | Churches, formula keepers | The Ministry, schools | Makers and sellers of Elixirs |

For powers that come from potions, the path already exists in fixtures: brewing makes the dose (B), the dose enters a body (`tests/brew_body_delivery.test.js`), the body gains an ability row in a slot (question 2), and the ability is an effect sentence the host lands. A second dose meeting the first is question 6, answered by an interaction table on the body. A generated power is a draw from the grammar by the Elixir's kind, which makes superpowers the natural test of generation (G4).

The Perfect Run is in the library as a prepared capture of 130 chapters (`docs/research/LIBRARY_INDEX.md`). The October 11 design pass read the opening chapter and sampled later scenes and companion openings. The column above remains a sketch for power-system absorption, which still needs broader source coverage. A power that rewinds time to a saved point is the conceptual tail (PC84), close to the game's own cheat and rebirth rules, and it would be authored there before any rule derives it. [Bounded reading receipt](gm/dispatch/parallel-book-design-2026-10-11/perfect-run/REPORT.md)

Not started now. The first use of the recipe is the next world pack after Hogwarts spells compute as running; a superpower world is a good candidate for the second-world verticals (PC58b) because its powers are few per person and varied in kind.

## Gate rule, craft families in the order, and body alteration (PC99, 2026-11-12)

Weibao (2026-11-12): "keep going, more to consider? Consider if suite is skippable? Reconcile these long term, should we start on each faimly now? Consider more to consider? For bodyalteration, consider biotech that exists in cyberpunk too, consider how to implement the sandevestan, I know it gives initiative but then in the anime it is shown doing much more too".

### When the full suite is skipped

Default from Wave 12, as coordinator practice under AD36: the full suite runs when a wave changes any `src` file the game loads (`node scripts/reachable.mjs --is <file>` exits 0), any shared test helper, the build, or `package.json` dependencies. Otherwise the wave's gate is the focused set: every test that imports a changed module or reads a changed data file (found by grep on the module and file names), plus `check:arch`, `check:rules`, `check:coverage` and `check:docs`. Reason: engine-first work is in modules the game does not import, so the other six thousand tests cannot see it, and eight to twelve minutes per wave buys nothing. Dial: one full suite per day of waves in any case, and one before any tie-in work. Known gap: a test that reads a file without importing it is found by name search alone, so data-file changes get a wider search.

### Should each craft family start now

By PC94 a family starts when it has two consumers waiting. Read against what the engine has today:

| Family | Consumers waiting | Start | First packet |
| --- | --- | --- | --- |
| Body alteration | A Gu in an aperture, a potion that grants a lasting power, a Sequence, an implant, the Sandevistan below | **Now** | One slot mechanism on a body with capacity as a cost curve, load, upkeep and rejection, the ways around it, and three consumer rows in a fixture |
| Stored workings | Runes and talismans (already in the game), wards, a potion held ready, a sustained part of a technique (TG1) | **Now** | One stored-working shape on the kernel: carrier, trigger, charge, decay; a rune strip and a ward as rows |
| Process crafts | Brewing uses it; forging has no law | **Now** (Weibao, 2026-11-12: "Start the other families accordingly, each with their own fable directing codex") | A census of Making, then a forging row on the shared process mechanism |
| Bindings | Oaths exist in the kernel; taming and familiars have no engine consumer yet | **Now**, by the same instruction | One binding shape on the kernel's oaths, with a tamed animal and a familiar as rows |

All four families started and have engine fixtures on master. Body alteration and stored workings support the phase 2 cases. Process crafts continue with Making in phase 3, and bindings continue with the custody and contest facets. [Family fold receipts](gm/dispatch/foundation-run-2026-11-12/RUN.md#codex-coordinator-fold-2026-11-12)

### Body alteration, with cyberpunk biotech

One shared slot mechanism, six carriers. The carrier decides the numbers; the mechanism is shared.

Weibao (2026-11-12), on the first wording of this section: "'One slot rule' 'Capacity' There are always ways around everything? Dont forget our core rules too". Corrected here. Capacity is a default with a dial and an in-world reason (AD5, AD22, AD38), and it is a pressure, not a wall: going past it works, at a rising cost, and every world has ways around it. "One Elixir per person" and "one Sequence at a time" describe the ordinary case; the exceptions exist with their reason and their price.

| Way around a capacity | Examples | What it costs |
| --- | --- | --- |
| Raise it | A larger aperture by rank or treasure; training; a better frame or a second heart | Time, materials, risk during the change |
| Go past it | A second Elixir, an overloaded aperture, chrome beyond the budget | A cost curve on the body or mind that steepens; canon's failures are the far end of that curve |
| Stabilize the excess | Suppressants, a sealing artifact, a ritual anchor, a regulating Gu | Upkeep, and dependence on the stabilizer |
| Move the load elsewhere | Carried in an item, a familiar, a second body, a shared pool between partners | Custody risk; the carrier can be lost or taken |
| Change what counts | Fuse two into one, compress, digest fully, swap the body | The operators in PC97, each with its own price |

| Carrier | Examples | Capacity it draws on | Upkeep | What goes wrong |
| --- | --- | --- | --- | --- |
| Hardware | Cyberlimbs, optics, reflex boosters, a spine-mounted speed rig | Body budget and a mind budget (the scout's CW1: one pool each install reduces) | Power, maintenance, a clinic | Rejection, malfunction, the mind pressure that ends in cyberpsychosis (CW35) |
| Grown tissue (bioware) | Grafted muscle, skin weave, cloned organs, enhanced antibodies, toxin filters | Body budget, lighter on the mind | Nutrition, time to heal in | Immune response, overgrowth |
| Nanotech | Repair swarms, blood filters | A small standing load | Feedstock | Runaway, depletion |
| Genetic | Somatic edits in one body; germline edits that breed true | None after it takes | None | Off-target change; it reaches offspring (PC97 Edit meets heredity) |
| Chemical | Combat drugs, boosters, immunosuppressants | Tolerance | Each dose | Dependence, a crash, interactions in the body |
| Magical | A Gu in an aperture, a tattoo, a permanent potion, an Elixir | The aperture, the soul, one power per person, by world | Feeding, essence | Backlash, loss of control, a second power breaking the first |

Default: capacity, load and rejection are quantities on the body in the engine world, so a suppressant dose (B) lowering rejection, a clinic visit, and a second implant crowding the first all meet with no code for the pair.

### The Sandevistan as the worked example

The tabletop reading is an initiative bonus for a short window with a cooldown. The anime shows a user moving through a scene that has all but stopped: crossing rooms, carrying people, stepping around bullets, and paying for it in the body afterwards. Proposal: both are the same quantity read at two levels of detail.

- **The alteration** is a hardware row in a spine slot, with its load on the body and mind budgets.
- **The activation** is a working whose effect raises one quantity on the holder for a few seconds: their **pace**, the rate at which that holder's own steps settle against the world's clock. In sentence terms it is `alter` on `time`, target self, sustained.
- **Near, in detail**, pace multiplies how many of the holder's steps fit in the window. Because it applies to every working the holder starts, it covers moving, carrying, sensing and dodging as well as striking. Nothing is written per use.
- **Far, or in a coarse contest**, the same pace is read as acting first and acting more: the initiative bonus. This is PFP12's near and far forms for one quantity, and the two have to agree on totals.
- **The price** is strain: a quantity on the body that rises with pace times duration, feeds an affliction course (nosebleeds, tremor, collapse), and recovers with rest. A cooldown is strain above a threshold, with no separate timer. A military-grade unit has a higher pace and a steeper strain curve. Heavy use plus other installs pushes the mind budget.
- **What follows with no extra rules:** two users cancel to the ratio of their paces; an area effect or a held ward (stored working) ignores who moved first; a suppressant or a booster changes the strain curve through the body; a brewer or a smith with the rig gets more steps in a timed process, and pays the same strain.

The kernel consequence, stated once because it is the costly part: steps settle on one world clock today. Pace needs a holder-local rate inside a window, with the same result in one jump or many (KW5). Default: the window is split at its start and end, and the holder's steps inside it are scaled, so no second clock exists. That is a request to K when the fixture needs it.

### More to consider

**ACCOUNT FOR NOW**

- **Capacity is the common pressure.** Aperture size, implant budget, the usual one Elixir per person, the usual one Sequence at a time and tolerance are one adjective, "how much fits" (AD22), with the number, its in-world reason and its ways around per world. The slot mechanism carries it once, as a cost curve and not a refusal.
- **Skipping the suite moves risk to tie-in.** The focused gate protects the engine. The first full suite after a long gap may surface several failures at once, which is the reason for the daily run.
- **Stored workings change who acts.** A ward fires with nobody present, so authority is read at storing and again at firing (KW12), and the receipt names both.
- **Pace interacts with idle settlement.** A sped-up holder during a long far settlement would multiply output for the whole stretch unless strain bounds it. The strain curve is what keeps the rate form honest.
- **More lanes at once.** Weibao asked to use the Fable allowance. Wave 12 runs five Fable lanes on disjoint files, above PC94's three; the coordinator still reads every diff, and the count drops back if a fold finds overlap.

## Fang Yuan's first capability run (2026-11-12)

Weibao selected Fang Yuan first and asked for a long-term approach, with combat
and possible parallel LOTM and Reincarnation Paradise work. [Direction log](gm/USER_VISION_LOG_2026-11.md#protagonist-capability-runs-2026-11-12).
This is the Moonlight Gu vertical in PC52, exercised headlessly under PC95. The
scope below applies AD38, AD44, AD49, AD51, AR3/AR7/AR10, SKR1/SKR3/SKR21,
WKR21 and WPR4/WPR5/WPR30. LOTM-first remains
the campaign order. The parallel slices below are proposals.

| Finding | Existing path and current evidence | Remaining work |
| --- | --- | --- |
| F1 · Acquisition and control | Fang Yuan's [selection](../src/world_packs/book_gu_lead_selection.js) awards the physical unrefined carrier. His [first attempt](../src/world_packs/book_gu_lead_refinement.js) spends essence and leaves it unrefined. [Successful refinement](../src/world_packs/book_gu_lead_vital.js) consumes the bag item and sets an actor fact. The separate [academy novice](../src/world_packs/book_gu_life.js) transfers a titled carrier and controller on the same body. [Keeper stock](../src/gu_moonlight_stock.js) changes custody through the creature lifecycle. The [headless control working](../src/world_packs/gu_first_control.js) now reads custody, body and essence at settlement and writes control to the original specimen. | Tie the working to the real sources of aperture, custody and intervening refinement support at integration. The fixture declares these means and follows the two known scene outcomes. It does not give Moonlight a vital bond. The fixture charges at settlement. The story route reserves on admission and refunds unfinished work. Preserve that distinction in the parity check. |
| F2 · Feeding | Fang Yuan's [dorm actions](../src/world_packs/book_gu_lead_dorm.js) buy petals and settle authored meals. The academy has repeatable care with a finite perishable lot and four petals on one daily deadline. The [catalogue](../src/gu_catalogue.js) gives two petals morning and evening (ch23) and records rock dormancy as a starvation response (ch40). The [engine food case](../src/world_packs/gu_body_cases.js) spends two petals, restores satiety and checks the wrong-food control. | Compatible academy variant and an incomplete lead loop. Buy or gather finite supplies and feed the same specimen at its local cadence. Keep expiry on the actual lot. Derive activation readiness from body condition and settle how hunger, starvation and dormancy affect it using source evidence. The academy allows a hungry living Gu to cast. The working law refuses when its `fedThrough` threshold lapses. The fixture's hunger mapping is a discriminator for that gap, with no claim that every missed meal disables a canon Moonblade. |
| F3 · Activation and combat | The [Gu working](../src/gu_working_law.js) spends essence and emits the effect. The [contest pack](../src/contest_packs/gu_world.js) can consume it, including a Little Light combination and an unfunded fallback. Existing duel and wolf fixtures start with authored entrants, and the duel bridge fills in fed, alive and held defaults for stub profiles. The [Fang Yuan scene](../src/world_packs/book_gu_lead_early_duel.js) settles its own authored actions. | Incomplete integration. Quote and settle from live specimen, controller and essence state at use time, bind the actual target, and land harm through the existing body/contest owner. Carry injury, withdrawals and costs into the next action. Contest readiness uses tenths of a second and the world clock uses minutes. Keep that unit boundary when hosting a contest that can cross care or support deadlines. |
| F4 · End-to-end proof | The [headless fixture](../tests/fang_yuan_capability.test.js) acquires one Gu from clan stock. The first infusion spends 30 parts and meets resistance. The supported infusion spends one part and gives control on the same ID, including after restoring mid-attempt. The same holder eats, supplies a Moonblade that lands combat damage, and survives serialization. Losing support, custody or essence before refinement settlement refuses without a new debit. | Fixture verified. It uses a contest-entry snapshot for readiness and the Wang Er scenario as a combat consumer, without claiming a contiguous chapter route. Ordinary actions and native save/export/import are tie-in work. The [prior ch140 replay](gm/dispatch/cross-world-systems-2026-11-07/CHECKPOINT.md#first-arcs-resumed-on-authorized-credits) remains historical campaign evidence. |

**Next Fang Yuan comparison.** Hold the opponent fixed and change preparation,
distance or defense. Recheck live control and readiness when the blade releases.
Win, withdrawal and injury should matter to what Fang Yuan can do next. Tie-in
later replaces the equivalent scene operations with ordinary controls, using
the existing desktop and save checks in AD43. The current fixture uses automatic
contest choice.

**Long-term capability runs.** Keep one row per useful action family in the
world's existing mechanism or campaign record. Record how the lead acquires the
means, uses them again, recovers or changes plans, and what outcome another action
reads. Use book scenes to calibrate and reuse the same actions in the lead's life.
For Fang Yuan, the next candidates are Liquor Worm conversion funding a stronger
cast, White Jade or another guard changing a specific hit, and refinement or
fusion producing a Gu whose traits change a later fight. After that, scouting and
concealment change what opponents can detect, healing changes readiness for a
return trip, and food production, trade and injuries change the cost of maintaining
a loadout. Retreat, reserve recovery and ordinary weapons stay useful alongside Gu.

| Parallel candidate | Current floor and next concrete proof |
| --- | --- |
| LOTM · Klein's divination | The [Bogda fixture](../tests/lotm_bogda_consultation.test.js) uses the [chapter 82 rows](../src/lotm_divination_rows.js). Tarot and dream divination spend Spirituality and produce attributed signals and separate interpretations. The dream reading binds Bogda's actual ring and birth notes. Two distinct grounds support pursuing the Glacis lead. The fixture declares Klein's Seer power and learned methods. The existing [Seer route](../tests/lotm_seer_slice.test.js) is precedent for earning them. Actual inquiry travel or testimony, and amulets or ritual combat, can build on the result. |
| Reincarnation Paradise · Su Xiao's Dragon Flash | The [chapter 196 fixture](../tests/paradise_dragon_flash.test.js) retires TC·Jack once, preserves Dragon Flash's identity and compares both passive choices in the same opposed contest. The comparison represents the four-second bleed with a supplemental hit. Timed, stacking wounds remain open. The [Paradise brief](worlds/paradise-hub/WORLD_BRIEF.md#su-xiaos-next-capability-runs) owns the follow-ons for paid training, Hunter work, Soul Eater, companion scouting and alchemy. |

LOTM and Paradise can prepare world rows and run focused fixtures in parallel
with Fang Yuan. Each lane owns its world files. Use one writer for shared
identity, costs, clock and combat changes. LOTM can proceed with its existing
knowledge consumer while the combat boundary is being settled. Paradise can
prove item identity and the donor transaction before attaching a passive to
combat. If either exposes a shared gap, return the smallest case to that owner
and exercise both worlds after the change. World laws, power sources and era
requirements stay with their worlds. The follow-up started both headless lanes
in parallel with the paid Moonlight control working.

**Checks.** Input `4d4505223` plus the named capability work on the shared
checkout. The combined `node --test` selection passed 61/61 across the three
capability runs and adjacent engine, Gu body, contest and LOTM consumers.
`check:arch`, `check:rules`, `check:coverage` and
scoped `git diff --check` passed. `check:docs` flagged a pre-existing wording
issue in `docs/gm/dispatch/foundation-run-2026-11-12/W18_GAME_SEAM.md:29`.
These checks cover headless engine cases. The browser tie-in and ordinary
protagonist actions remain open.

## Capability runs in the game UI (2026-11-12)

The [follow-up](gm/USER_VISION_LOG_2026-11.md#capability-runs-in-the-ui-and-combat-scale-2026-11-12)
selects three playable capability starts. Open **Capability runs** from the game
bar. The ST3 center view uses the existing Back and Escape controls, with Reports
alongside it (DSG1/DSG5, UR9/UR70–UR75, AR2/AR3/AR6/AR7, AD43). Target desktop
1920×1080. Each start declares its place and prior means, advances its own scene,
and keeps its engine world in the game save through the domain registry. The
main character's inventory, location and clock are outside these separate lives.
Mobile optimization and the full campaign joins remain future work.

| Run | On screen and in settlement |
| --- | --- |
| Fang Yuan | Academy start with two refined Gu. Feed Moonlight with petals and Liquor Worm with wine, convert two initial parts per middle part, then choose the actual essence pool for the first-touch spar. The same four initial parts buy either a 30-point hit or the two middle parts for a 45-point hit on the 100-vitality partner. These are authored drill values, documented in the [combat scale proposal](COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md#what-hp-and-damage-should-mean-2026-11-12). Stock, control, satiety, both reserves, costs, refusal reasons, vitality and results are visible. |
| Klein | Pay Spirituality for the readings, borrow and return the ring, pass on Glacis's lead, compare accounts, and take a carriage to the shop. The board shows location, reserve and custody, attributed testimony and Klein's direct observation at the door. The chapter transition compresses the intervening days. |
| Su Xiao | Spar, pay 1,000 Paradise Coins, finish the hour with Koshiro's image, then try the same first-touch drill. The balance, pending lesson, elapsed time and learned timing are visible. The image landed first at 0.9 seconds before practice. Su Xiao landed first at 0.7 seconds afterward. Those timings are authored. |

**Proof.** Build `02ade05b4fff53eeae1a91e8ccfdf7d7c0beb6b4bd4fb18aa03177654235e518`
from the shared checkout into an isolated output. Fresh headless Chrome at
1920×1080 clicked all three starts and their actions. The walk checked a refused
Fang Yuan action, all three outcomes, Escape, a reload with paid practice in
flight, and native Export and Import of all three results. No page errors.
Focused checks cover the equal-cost Gu comparison, route registration, Fang's
prior refinement, Klein's reads and visit, and Su Xiao's practice settlement.
The final focused selection passed 35/35, including the creature ledger and
PROJECT shape. The earlier full suite caught a coverage-only case module pulled
into the runtime by the Gu UI. The production run now uses the living-body owner
directly and the creature ledger regression passed on that change.

### Moonblade target comparison

This receipt records the original vitality-only comparison. The [injury follow-up](#sword-practice-and-moonblade-injury-follow-up)
describes the current playable replay.

In Fang Yuan's Capability run, feed Moonlight Gu and select **Test Moonblade
against three targets**. The rehearsal runs the existing contest and Gu
activation laws on fresh target snapshots. It uses the same attacker, seed,
range abstraction and cut per grade. Its own supplies leave the run's live
stock untouched. Each row shows grade, parts spent, applicable guard, vitality
lost and left, and whether the target stays standing. Target tolerance and guard
are authored calibration. The rehearsal models incapacitation at zero vitality
and records neither lasting wounds nor recovery. The research chat is locating
source outcomes to replace or refine those assumptions.

| Target | Initial-stage Moonblade | Middle-stage Moonblade |
| --- | --- | --- |
| Exposed mortal, 30 vitality | 30 lost, incapacitated | 30 lost, incapacitated |
| Guarded Gu Master, 100 vitality, 25 guard | 5 lost, standing | 20 lost, standing |
| Reinforced higher-rank body, 180 vitality, 35 guard | Blocked | 10 lost, standing |

Rebuilt bundle `7009a97a4700766763a29af97212b3e46b7bb7774eb16f3983b3ae390aec57d1`.
Fresh headless Chrome at 1920×1080 clicked the comparison, checked all six rows,
and recovered them after native Export and Import. The focused selection passed
36/36, plus the UI surface and route contract and the architecture check. The
broader UI token check still flags spacing in the unrelated plot draft.

### Capability gaps before the next build

This inventory covers the three selected lives. Each proof starts with the
means the player actually has and ends where a later decision reads the result.

| Capability | Existing proof | Gap and first useful comparison |
| --- | --- | --- |
| Fang Yuan · care and combat | Moonlight acquisition/control in a fixture. Feeding, conversion, sparring and a forearm wound replay in the UI. | Join custody and care to a normal life. Compare ready, late and unfunded Jade Skin on the same shot. Carry guard expense, withdrawal and the wound into a real treatment action, then test whether grip or casting returns. The source supports different effects for tissue, protection and fuel. |
| Fang Yuan · advance and make | Liquor Worm conversion and existing fusion and Gu upkeep fixtures. | Follow one precursor through fusion, feed the resulting Gu and show its actual change to reach, power or cost in a fight. Then test a supply shortage that forces a trade, substitution or different loadout. |
| Klein · investigate and prepare | Readings, testimony and the visit to Lawson's closed shop are playable. Amulet work has a separate engine case. | Connect a clue to an alternate lead the player can actually pursue. Compare weak or missing evidence with a corroborated lead. Join a paid preparation or amulet to an expedition, including what it costs Klein and what happens when it fails. |
| Su Xiao · train and equip | Sword Practice and observation in the Test Hall. Dragon Flash's donor upgrade and passive choices in a headless contest. | Bring a trained timing benefit and the selected blade passive to the same fight. Compare them against distinct opponents and keep wound timing, stamina, weapon identity and skill XP through the return. Then try an opponent whose opening differs from the training image. |
| Su Xiao · work between fights | Source anchors for Hunter work, Soul Eater, companion scouting and alchemy. | Prove one contract from lead and preparation to withdrawal or payout. Record what Soul Eater actually gains in one eligible encounter. Make a companion report change a route, and a finite alchemy batch change recovery. Existing evidence and narrower cases live in the [Paradise brief](worlds/paradise-hub/WORLD_BRIEF.md#su-xiaos-next-capability-runs). |

### Sword Practice and Moonblade injury follow-up

The [Moonblade research](research/RI_MOONBLADE_DAMAGE_CALIBRATION_2026-11-12.md)
supersedes the prior replay's automatic mortal incapacitation. The fixed
forearm contact now resolves an initial-stage flesh cut and a middle-stage
fracture that stops the rush while leaving flight possible. Jade Skin's block
uses the book's stated matchup. The reinforced body remains an analogue. HP,
guard capacity, bone thresholds and the four vitality lost in one untreated
minute are authored dials. Stabilization stops the loss and leaves the fracture.
The observation advances the replay by one bounded minute. The comparison
retains its own supplies and wound state.

Su Xiao's completed paid lesson grants 100 Sword Practice XP. The level-one
drill grants 25 XP. Recognizing and studying the image's opening takes ten
minutes and grants 75 XP once. Level two releases the same cut in 0.6 seconds
after the 0.7-second level-one cut. The drill timings and XP thresholds are
authored. Legacy completed lessons and recorded drills supply the corresponding
XP on read. A pending lesson still settles through its saved working.

Build `b8747bec85dd7a23b3baae6da45ebcbb9d66e0c40123da5ecf6132e53c9ce127`.
At 1920×1080, headless Chrome played the untreated and stabilized branches,
finished the saved lesson, advanced to level two, and verified the faster
cut. Native export/import preserved all three capability runs. Zero page
errors. Focused tests passed 43/43. Architecture, rules and coverage passed.
The docs lint still flags the existing Wave 18 seam note.

## Tie-in considerations: seam, fun, screen and the fight system (2026-11-12)

Weibao asked what it takes to bring the engine features, spells and combat into
the playable game, then how to make sure it is fun, whether the UI makes sense
and whether a new combat system is needed
([log](gm/USER_VISION_LOG_2026-11.md#tie-in-fun-ui-and-the-fight-system-2026-11-12)).
Proposal throughout (AD32). Nothing here changes PC95's order. Evidence is the
[seam probe](gm/dispatch/foundation-run-2026-11-12/W18_GAME_SEAM.md) (M1 to M9),
the area guide's fights row and a read of the live hosts. Costs are a reading,
not measured.

**What tie-in takes.**

| Code | Work | Default |
| --- | --- | --- |
| T1 | One owner for the player (M2). The game keeps deficits, money and JSON-keyed items; an engine holder keeps plain amounts, and `stamina` and `coin` are declared twice with different bounds | The game owns the player. The engine reads them at each sync and its debits leave as a game plan. Engine-side, so it can be settled before tie-in |
| T2 | Save growth (M1). Every receipt is kept and the game saves each tick | Roll finished receipts into tallies before hosting |
| T3 | The host (M3 to M9) | One registered domain synced to the absolute root minute, the game's night hours, the game's draw root, one engine world per game world, unreadable records kept inert |
| T4 | One front door for fights | `tempo_fight` stays the shell the player sees (openers, panel, allies, exits) with `contest.js` as the resolver under it. Far settlement and rehearsals can move first |
| T5 | One cast everywhere | The spellbook stays the door. A cast settles through `spell_law` and the effect host, and the same cast is a contest move in a fight |
| T6 | Ordinary verbs from a fresh life (FLR2, UR156) | No engine menu. Capability runs trade their declared starting means for earned ones |
| T7 | Parity before deletion (G5) | A bespoke route moves when its parity fixture passes |

**No new combat system.** The repo already has the Village battler, four native
battle modules, `tempo_fight`, the contest and the notch contest. The contest is
the new system and it is built. The work is folding, plus four gaps in it: what
each side learned from a fight (CFC13), contests that are not fights (CFC14),
wounds that run on a timer or stack, and distance or target area beyond the
current range abstraction. World differences stay in pack rows and resolvers.
The Village keeps its battler unless a reason appears.

**Fun.**

| Code | Check | Why |
| --- | --- | --- |
| N1 | By default each tie-in step ends with a named save and about twenty minutes of play (SPR6); review stays optional (AD42) | Contract tests cannot judge tension, so a played save is the most direct check available |
| N2 | Policy spread. Run the same fight headlessly under several policies (the automatic chooser, all-out, guarded, prepared, a different loadout) and compare outcomes and costs | If every policy ends the same, the fight holds no decision, whatever its numbers. The contest is pure, so this is cheap |
| N3 | The result is read by the next action: a wound, spent stock, what the opponent now knows (FLR4, SPR14) | A fight whose result nothing reads is a meter |
| N4 | An ordinary day pulls it (SPR1): upkeep, supplies and a reason to prepare tomorrow | Otherwise fights happen only when a chapter says so |
| N5 | Fights can run on a stated policy paid from real stock (CBR26), since near and far are one rule (CFC12) | In an idle game much of the play is the setup. The player should be able to watch any fight closely or let it settle |
| N6 | Each result says what decided it in one line | Depth the player cannot see reads as luck |
| N7 | `check:pacing` and `check:feedback` on each hosted start | First payoff, dead stretches and silent presses |

**Screen.**

| Code | Default |
| --- | --- |
| TV1 | The contest supplies the view the fight panel already draws: move label, text, cost, an odds word and the reason a move is refused. `quoteContestOdds` exists for the odds |
| TV2 | Tenths of a second stay inside. The player sees who acts next and what is winding up |
| TV3 | Opponent numbers are learned (CBR13, CBR14) and an unknown names the missing fact (UR157) |
| TV4 | A spell's quote names cost, time, target and what it will change before the cast; targets come from the place's links |
| TV5 | The three-target Moonblade comparison becomes an in-world rehearsal (a practice yard, a puppet) the player can reach, which also teaches the system |
| TV6 | Proof is a rebuilt bundle in headless Chrome at 1920×1080 with a populated fight (AD43, PRF7) |

**More to consider.**

| Code | Disposition | Finding |
| --- | --- | --- |
| TC1 | Account for now | A body has three readings today: the game's health deficit, contest vitality and harm rungs. Settle a hit once (T1, the combat scale proposal) or the tooltip and the fight will disagree |
| TC2 | Account for now | A lethal contest law has to end through the defeat publisher (CBR2), or engine deaths bypass forgiving recovery (AD19) |
| TC3 | Account for now | The world ticks once a second. A fight measured in tenths has to hold the clock while the player chooses; the clock owner already supports a waiting choice. Care deadlines that fall inside a fight settle after it |
| TC4 | Account for now | Every opponent needs an engine body and move rows. A bridge that reads an existing stat block into the `strike` resolver keeps old enemies usable on day one, with richer rows added per world |
| TC5 | Account for now | The 30, 45 and 100 drill values are authored. Tune with N2 and source outcomes (AD49) before polishing numbers |
| TC6 | Account for now | Old saves with a tempo fight in flight: resetting them is allowed when the receipt says so ([old-save direction](USER_VISION.md#platform-performance-and-saves), 2026-10-17); new state still has to survive save, reload, export and import |
| TC7 | Later | A developer trace that explains one hit from the contest log (read-only) |
| TC8 | Later | Opponents who remember and tell others, built on CFC13 |
| TC9 | Later | Debates, trials and intimidation as contest laws (CFC14) |

### Round 2: kinds of fight, spell fights, world sense, the Gu panel and enchanted gear (2026-11-12)

Weibao's follow-up ([log](gm/USER_VISION_LOG_2026-11.md#kinds-of-fight-spell-fights-gu-panel-and-enchanted-gear-2026-11-12)).
Proposal throughout (AD32); palette rows, with no build order implied. Evidence:
`src/contest.js`, the two contest packs, `src/ui/gu_house_view.js`, the
capability runs panel and
[enchantment rounds 5 to 7](WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md#round-5-what-an-enchantment-changes-2026-11-12).

**Kinds of fight.** Default: describe a fight by five dials and treat named kinds
as presets, so a new kind costs a row (CX3).

| Dial | Range |
| --- | --- |
| Stakes | Pride, a wager, standing, property, freedom, a body part, a life |
| Ending | First touch, disarmed, yielded, out of means, driven off, captured, downed, intervention, objective taken, killed |
| Frame | Who watches, who steps in and when, what law answers afterwards, where the hurt recover |
| Means | What each side actually holds and knows at the start, including what the place offers |
| Scale and distance | One on one to a battlefield; touching to out of sight; played closely or settled from afar |

| Code | Preset | State |
| --- | --- | --- |
| FK1 | Drill or first touch | Playable (Fang Yuan, Su Xiao) |
| FK2 | Formal duel with rules, a referee and perhaps a wager | Headless (Duelling Club) |
| FK3 | Brawl: unruled, witnessed, and by default it stops short of killing | Move rows exist; no case yet |
| FK4 | Hunt: the quarry flees, tracks and bites | Headless (wolves) |
| FK5 | Ambush: one side starts unaware (CFC5) | Rule exists |
| FK6 | Pursuit and escape (CFC11, the chase range bridge) | Rule exists |
| FK7 | Capture: the aim is the person | Outcome exists |
| FK8 | Holding a place: wards, stored workings and time on the defender's side | Parts exist, not joined |
| FK9 | Skirmish and battle: crowding, morale, far settlement | Dials exist |
| FK10 | Technique against technique: a move aimed at another working | Headless for landed effects: one Finite ends both named charms in the [Duelling Club test](../tests/hp_duelling_club.test.js). Cutting a working still winding up happens through a hard hit or a `staggers` move (CFC6); the three-move Hogwarts contest law has no counter row |
| FK11 | Attrition: the reserve or the supplies decide | Ending exists (`noMeans`) |
| FK12 | Contests that are not fights: debate, trial, intimidation, a mind against a mind, a game | CFC14, not built |

**FK13, account for now.** CFC9 puts lethality on the contest law
(`c.hogwarts` false, `c.gu_world` true), read where `contest.js` assigns
outcomes. The combat palette already wants more than that: the world card names
its usual lethality (CBC37, CBR6) and subduing is a stance (CBC32). Today a
troll in a Hogwarts corridor or a stopped spar in the Gu world needs a second
law with its own copy of the moves, and stakes cannot change once a contest
has begun. Default: the world supplies the usual frame, each contest carries
its own stakes, and a move stays capable of killing or not. This would amend
CFC9 and is a proposal.

**Spell fights.**

| Code | Default | Evidence or gap |
| --- | --- | --- |
| SF1 | A spell duel turns on tempo and means before bodies: cast time against interruption, the wand in hand, and disarming as the ordinary ending | The Hogwarts pack already contests focus, composure and footing, with no vitality ending |
| SF2 | A shield is a guard on what it blocks; a counter ends the other working | Guards exist and are chosen under threat. Finite Incantatem is a spell row that ends landed effects; a counter row inside the contest law is the open part (FK10) |
| SF3 | By default a caster answers what they recognize. A silent cast hides its wind-up; knowing the counter is knowledge, and a world can offer a blanket shield at its own cost | Ties to TV2 and TV3; knowledge owner exists |
| SF4 | The place is means: a thing levitated, a floor frozen, light put out, cover | Place holders and links exist. First check below |
| SF5 | Jinxes leave conditions that outlast the fight and need a remedy | Affliction track and mind pack exist; contest hand-off open |
| SF6 | A wand, a fist, a Gu and a bite share one clock | A mixed case (a first-year against a wolf) is a cheap sanity run |

**Making worlds make sense.** Default: how deadly fights are follows from
reasons in the world, and the reasons are data in the frame.

| Code | World | Usual frame and when it changes |
| --- | --- | --- |
| WS1 | Hogwarts | Fights end in disarming, a jinx, a bind or a teacher arriving. Reasons: a student's repertoire is jinxes, adults step in, the Ministry and Azkaban answer serious harm, a wand keeps a record of its casts. Deadlier frames come with creatures, dark wizards, places with no adult near and the war years, each with its cost (CBR29) |
| WS2 | Gu world | Killing is common outside the walls. Inside the academy an elder stops a spar, and clan law prices a death |
| WS3 | Lord of the Mysteries | Inference from the readings, not chapter-checked here: open fights are rare and dangerous; preparation, information and loss of control decide them more than exchange of blows |
| WS4 | Reincarnation Paradise | Inference, not chapter-checked here: missions are deadly; the hub and its Test Hall are safe |
| WS5 | Sense check for any world | Hold back source fights and see whether the rules reproduce who won and what decided it (SPR14, SPR22). For Hogwarts the first is the troll: a levitated club falling on its owner, which tests SF4 and AD38 together |

**The Gu panel.** Capability breadth still leads Gu UI design (GKM261), so this
is a palette for tie-in. Existing pieces: the Gu house (gauges, feed timers,
stipend ledger) and the capability run board (stock, control, satiety, both
reserves, costs, refusals).

| Code | Part | What the player decides there |
| --- | --- | --- |
| GP1 | Aperture | Essence by grade, capacity, recovery, and what in-flight workings have reserved |
| GP2 | One card per Gu | Keeper, controller and loan terms as separate facts; satiety and the next meal; condition; what it can do now, at what cost, or why not |
| GP3 | Upkeep ledger | What the whole loadout eats per day and how many days of stock remain. Which Gu to keep is the recurring decision |
| GP4 | Moves | A killer move as roles to fill: which Gu fills each, what is missing, total cost and beats |
| GP5 | Rehearsal | The move against a known target, with unknown facts marked (TV5, UR157) |
| GP6 | Refinement bench | Known recipe or experiment, what raises the odds, what a failure keeps and loses |
| GP7 | Other people's Gu | Shown as learned, with the source of each fact |

**Enchanted gear.** ENF1 to ENF22 already cover making, fitting, lending,
wards, copying and appraisal in the engine. What remains for it to matter in
play:

| Code | Finding |
| --- | --- |
| AE1 | The timed contest does not yet read the worn loadout at release (ENF20). Until it does, armor and wards are proven beside the fight and not inside it |
| AE2 | The fixtures use their own torso slot. The game's equipment slots are the same owner question as T1 |
| AE3 | A choice of enchantment matters most when opponents differ by damage type or carrier. The stat-block bridge (TC4) would make every old enemy a plain physical striker, so typed attacks belong in the first opponent rows |
| AE4 | `gear_ward` reads its layers from `gu_defense.js`. A shield charm, an armor ward and a Gu guard want one layer reader under a neutral name |
| AE5 | Each world has its own carriers: shield clothing, dragonhide and goblin silver at Hogwarts, amulets and sealed artifacts in Lord of the Mysteries, defensive Gu in the Gu world |

**Other aspects.**

| Code | Disposition | Finding |
| --- | --- | --- |
| TC10 | Account for now | By default opponents use the same systems: wards, potions, upkeep, knowledge of the player. A fight reads fairly when both sides run on one rule |
| TC11 | Account for now | A potion or item used mid-fight is a move with steps and stock (`ready_stock`) |
| TC12 | Later | Raised or bred creatures and allies entering a contest as entrants (`tempo_allies`, the living-things packs) |
| TC13 | Later | Recovery as a place and a loop: the hospital wing, a healing Gu, a paid healer |
| TC14 | Later | Fights avoided: scouting, intimidation, a bribe, a warning from a divination |

**How other games do it.** The [decomp re-fit onto these gaps](research/DECOMP_REFIT_TIE_IN_2026-11-12.md) maps the existing game dossiers to the TV, N, TC, FK, SF, GP and AE rows above (TR1–TR50), and lists what the dossiers do not hold (TM1–TM9).

### Reconciliation of both rounds (2026-11-12)

Checked against the contest contract, the combat palette, the enchantment
rounds, the seam probe and current source. Evidence level: source and docs
read, `check:docs` and `check:rules` run; no test, build or play was run for
this pass. Receipts quoted above keep their own dates.

| ID | Finding | Class | Disposition |
| --- | --- | --- | --- |
| RT1 | FK10 and SF2 said nothing emits an ending for a working. Finite Incantatem is a spell row and the Duelling Club test ends two charms with it | Evidence correction | Rows rewritten; the open part is a counter row in the contest law |
| RT2 | FK13 said a Hogwarts troll cannot kill. A second law can; the limit is duplicated moves and stakes fixed at the start | Evidence correction | Paragraph rewritten, tied to CFC9, CBC32, CBC37 and CBR6 |
| RT3 | This section's C and V codes collided with the compression ledger's C1 to C6 and the variant parts in this doc | Duplicate code | Renamed TC and TV; other codes had no clash in the rules index |
| RT4 | AE1 repeats ENF20; T1 to T3 restate seam rows M1 to M9 | Duplicate by reference | Kept as pointers; the enchantment palette and seam note stay the owners |
| RT5 | WS3 and WS4 were written from memory of the readings | Missing proof | Labelled inference |
| RT6 | TC6 cited old-save direction with no locator | Stale reference | Linked to its owner line |
| RT7 | The combat, Gu and enchantment palettes had no route to these rounds | Incomplete integration | One pointer added in each, and in the writeup register |
| RT8 | PC94 says the plan stops growing unless Weibao asks | Compatible | Both rounds answer his questions; no packet, gate or order was added |

Unmapped: the UI rulebook was not searched row by row for overlaps with TV1 to
TV6 and GP1 to GP7, and the per-world lethality numbers CBL10 asks for were not
filled. `check:rules` reports two warnings that predate this work (an exam day
counter, the PROJECT log sync).

### References for procedural interactions

These are proposed transfers under AD38 and AD51. Each starts with a current owner and a behavior we can observe. The canon-first order in the run record still supplies the first inputs.

| Ref | Reference | OOPS transfer and proof |
| --- | --- | --- |
| F1 | **Breath of the Wild.** Nintendo's chemistry-engine talk describes interactions between elements and materials. [Developer talk](https://www.gdcvault.com/play/1024562/Change-and-Constant-Breaking-ConventionsInteresting) | Use the world substrate to carry the same heat from a Gu or a spell. A fire ward absorbs heat until its charge runs out. Residual heat then reaches the same clothing and harm readers. Changing the heat source should preserve those consequences when the delivered exposure is equal. Start with the saved Red Fire hand-burn case. [Combat owner](COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md#saved-hand-burn-idea) |
| F2 | **Cataclysm: Dark Days Ahead.** Its data describes materials, anatomy, and faults with distinct requirements and fixes. [Game data reference](https://docs.cataclysmdda.org/JSON/JSON_INFO.html) | A damaged glove, a spent ward and an injured hand should lead to different actions: repair, recharge or treat. Exercise one grasp-dependent action after the same hit and restore the same impairment after reload. Use the existing protection and harm owners. |
| F3 | **Factorio.** Circuit networks expose state to devices and let a comparator drive a response. [Developer notes](https://direct.factorio.com/blog/post/fff-88) | Build on the humidity regulator proof. Let a player set a threshold or choose the device that answers it. Show the reading, intervention and yield on one cause chain. Save during a pending intervention and verify the same brew result after reload. [Regulator pack](../src/world_substrate_packs/gu_brew_regulator.js) |
| F4 | **Dwarf Fortress.** Bay 12 describes using recorded history to give ruins and their contents a reason to be there. [Developer discussion](https://bay12games.com/media/df_talk_12_transcript.html) | Let a failed refinement or a residue spill leave something an actor can later find. A discovery reads the saved place and event, then shows the links available to the observer. This is a small consumer of the existing chain and PG4, with one traceable incident as the proof. [History and discovery owners](PROCEDURAL_FOUNDATION_PLAN.md#the-generators-on-top) |
| F5 | **Hypothesis.** Its stateful testing generates sequences of operations and checks invariants. [Stateful testing guide](https://hypothesis.readthedocs.io/en/latest/stateful.html) | Use seeded sequences in the existing test runner across feed, bind, begin, lose custody and reload. Assert that costs match the settled stages, a missing core produces no effect, and the resumed run matches the uninterrupted run. Keep the known canon fixtures as expected-result checks. |

The first follow-through remains the Moonlight and Little Light care-to-cast loop. It tests the link from a living specimen's condition to a combined action that matters. Use the ward-and-burn case as the next test of shared consequences across Gu and spells. The regulator and history ideas can build on those same recorded causes. [Gu design owner](GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md#raising-gu-for-a-procedure)

### Text RPG and sandbox play

**ACT NOW.** Record the project-wide sandbox direction as a proposal under AD32, AD38, AD51 and AD52. Book worlds already aim to be places the player can live in. The question is how much of play can run from reusable actions and persistent world state. The [Keeper cord trial](gm/dispatch/foundation-run-2026-11-12/RUN.md#keeper-care-and-the-distant-cord) is playable and checks care, a composed cast and a latch. It is a prepared practice scene. The broader proof is whether the same care, building and delivery rules give the player a choice across activities and at a second location. The current run order still owns dispatch.

**ACCOUNT FOR NOW.** A text sandbox can present a place, its connected locations, people, things and the actions the character can currently take. Authored scenes supply characters, situations, prose and canon reference outcomes. Shared actions supply changes to stock, condition, place and knowledge that later scenes can read. Let a scene react to a changed situation where the mechanisms support it. Put the resulting consequence in the same world state that farming, travel or combat already read.

| Scope | What it proves | Main work |
| --- | --- | --- |
| Add optional activities inside a chapter | An earned outing can change the next scene | Link that scene to actual inventory, care or injury rather than duplicating those facts |
| Give one district an ongoing sandbox loop | A player can choose a goal, pursue it by several means, and return to a changed place | Connect the existing action, clock, inventory, construction and place owners. Surface costs, next useful actions and consequences in text |
| Simulate an entire world with autonomous actors | NPCs and institutions can make changes that reach the player over time | Actor decisions, offscreen settlement, believable persistence, discovery, and narrative responses across locations |

**Player-built place first, 2026-11-12.** Weibao clarified the sandbox goal: “We dont need things to be too alieve, just the ability for the player to build their own place and more?” Use the district as the setting for a place the player can shape. Start with a yard or work plot the Keeper has permission to improve. Give the player a choice of which project to start, where to put it where siting matters, and how to use its output. Let the place carry those choices across visits. The plan keeps the existing run order.

**ACCOUNT FOR NOW.** Start with a Moon Orchid bed and optional shade frame. An exposed site can take more tending, while a sheltered site can use space the player wanted for a different project. These are original design examples. Let bought petals and the harvest feed the same Gu. Buying solves today's need. Growing takes time and can leave useful stock for a later goal. The player can keep their stock for care or choose a different use where an existing trade or recipe reads it. A further improvement earns its place by changing work the player can do there, such as a drying rack making a ration the existing upkeep law can read. Use the [home and construction owners](AREA_GUIDE.md#homes) where their access, projects and condition fit. Reuse existing stock and clock owners. Show the chosen site, what is being built, what is ready, and the next available action in the place view. Name a 1920×1080 desktop proof when the first view is built. Batch routine work once its tradeoffs are understood (AD52).

**Second use for the Keeper Gu.** Try the existing [drainage rig and waterwheel](GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md#from-a-cut-cord-to-a-working-waterwheel). The current rig already accepts a plain Moonblade at its tether and carries the released log through impact to milling when the downstream conditions are met. The proposed variant gives the player a covered position beyond plain reach and a closer position they can reach by an exposed or slower approach. Keep the original route. Rebind the same Moonlight and fed Little Light specimens from the practice plan to the rig's actual tether. Compare a fed cast from cover, a hungry support refusal, a plain cast that falls short from cover, and the closer plain cast. Both successful cuts release the same rig into the existing clock, impact and mill rules. Show what the reach costs, and let the player return to use the infrastructure. The variant and approaches are proposed. The existing receipts cover the cord trial and the plain-blade rig separately. [Care receipt](gm/dispatch/foundation-run-2026-11-12/RUN.md#keeper-care-and-the-distant-cord) · [Rig owner](../src/gu_keeper_drain.js)

| Reference | What to take for a small district |
| --- | --- |
| [Stardew Valley](https://www.stardewvalley.net/about/) | A plot becomes the player's through chosen crops, machines and layout. A few authored routines tell the player when people are available. Use one steward's hours if they change a real option such as collection, a loan, or access to the mill. |
| [Cataclysm DDA camps](https://github.com/CleverRaven/Cataclysm-DDA/blob/feb2e6336fb5233b71622f51a45b81efbf1a7f74/doc/JSON/BASECAMP.md) | A built improvement enables practical work. Let a shed preserve stock or a mill take an actual job. Use paid work and functional place state already present in OOPS. |
| [HITMAN](https://ioi.dk/hitman/game-features) | An authored location can support many approaches. Give the player a reason to choose among routes based on their time, means and position. OOPS can express those choices through its current text view. |
| [Overboard!](https://www.inklestudios.com/overboard/) | Its small cast moves on a shared clock and remembers what it witnesses. For the district, a timed delivery or an agreed collection can supply the relevant change. Settle it at its due time and show evidence the Keeper can observe on return. Add a witness or a stock event when a player decision actually depends on it. |

**LATER / DELEGATE.** First prove one owned or permitted plot, one useful improvement and one downstream use. Compare buying feed today with growing it for a later need. Save mid-project, leave and return, and verify the built improvement, crop, and actual Gu feeding settle once. Use the rig as the second-use comparison and check a pending release across restore. Both are moderate bounded systems cases with an existing consumer. Further district activity can use a scheduled arrival or change in stock before expanding actor autonomy. Free placement and a map become useful when the player needs to reason about more locations or physical layouts. [Keeper yard proposal](GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md#keeper-sandbox-proposal) · [Foundations and generators](PROCEDURAL_FOUNDATION_PLAN.md#the-generators-on-top)

#### Choosing, expanding and customizing a place

**ACT NOW.** Extend the player-built place proposal above. The [home owner](AREA_GUIDE.md#homes) already provides tenure rights, condition, staged work and world registration. [Home construction](../src/home_building_model.js) includes fixed local building and camp paths. The [room grid](../src/home_layout.js) already makes placement meaningful in one manor. The [place graph](gm/dispatch/foundation-run-2026-11-12/W18_PLACE_GRAPH.md) gives the foundation a way to represent real links between sites. A Keeper plot with player-chosen projects and expansion is the missing consumer. Reuse these owners according to their scope under AD38, AD51, AR3, MR29–MR33 and SR1. The first site and fittings below are proposals.

| Choice | Reference | OOPS proposal and proof |
| --- | --- | --- |
| **Choose a site for a purpose** | [Vintage Story](https://www.vintagestory.at/) makes climate, soil and geology matter. [Valheim](https://valheim.com/faq/) includes farms and outposts. | Survey two permitted sites. A low bank offers nearby water and room for a mill approach, with an exposed store. A sheltered terrace offers a better drying site and a longer water haul. Show known rights, access, and relevant conditions. Give the bank a workable way to shelter stock and the terrace a way to bring in water. Prove one site difference through an existing job or resource reader. |
| **Build toward the work you want** | [Cataclysm DDA camps](https://github.com/CleverRaven/Cataclysm-DDA/blob/feb2e6336fb5233b71622f51a45b81efbf1a7f74/doc/JSON/BASECAMP.md) make upgrades enable practical jobs. [Stardew Valley](https://www.stardewvalley.net/about/) gives players crops, animals and machines to develop their plot. | Put a bed, shade frame, drying rack and workbench in the same project vocabulary. A grower can add shade and storage. A maker can prioritize a bench and access to the mill. Capabilities come from the actual fittings, supplies and local conditions. Two builds on the same plot should change the available work. |
| **Expand in several directions** | [Valheim's official overview](https://valheim.com/faq/) describes building outposts alongside gathering and farming. | Let the player add an adjoining area, repurpose an existing space, or secure a second site near a useful resource. Check actual tenure and routes. Try moving a drying rack to the sheltered annex with its stored lot tracked by the inventory owner. A job that needs the rack must follow its actual location and readiness. |
| **Save a design and adapt it** | [Factorio's parameterized blueprints](https://factorio.com/blog/post/fff-392) let one plan take different settings when placed. [Luanti schematics](https://docs.luanti.org/for-creators/schematic/) expose the shape and placement of a structure separately. | Save a tested layout as a plan with positions, fittings and materials. On a second site, check the current footprint, access, supports and bill of materials before scheduling work. A plan carries the design, while construction transfers the actual materials. Use Luanti as a format comparison and keep placement in the OOPS owners. |

**ACCOUNT FOR NOW.** Start with named positions whose relationships affect use. A bed can sit under a frame, a store can be near the path, and a bench can share shelter. Let players name, rearrange, replace and repurpose what they build as costs, tenure and the fittings allow. Add room footprints or a grid where an actual decision depends on distance, shape, access or support. The manor grid is a reference for such a case. Decorative choices can stay cheap. As an original magical extension, a removable Gu support could hold a frame during a job. Taking it away would make the frame fall back to its ordinary support and any backup brace. That lets the same yard grow into a Gu workspace without a separate construction system. Timed growth, construction and an optional delivery can give the place continuity at the scale the player needs.

**LATER / DELEGATE.** Start absorption with a moderate foundation fixture. Quote the same useful fitting on two sites, settle one build from actual stock, then demonstrate that the placed fitting changes one real use. Restore during construction and compare the completed site, paid materials and downstream outcome with uninterrupted settlement. Show a shortage or site constraint and a reasonable alternative. Once the shared path is ready for tie-in, the first desktop journey is survey, choose, build, leave, return and use at 1920×1080. Larger footprints, outposts, design reuse and magical supports are expansion proposals. Terrain editing and whole-world simulation remain separate scope choices.

#### Reshaping a plot and designing rooms

**ACT NOW.** Record a second customization round. The existing manor grid shows that a fitting's position can affect what the player gets from a room. The Keeper's garden host already reads a living producer, daylight and a harvest clock. Those are separate proofs. A change to land that feeds room use, crafting or Gu care is the proposed connection. [Manor layout](../src/home_layout.js) · [Keeper garden](../src/gu_garden_host.js)

| Freedom | Proposed OOPS behavior | Reference |
| --- | --- | --- |
| **Reshape the ground** | Level a bench pad, raise a damp bed or cut a drainage trench as a paid project. The changed ground then supplies footing, grade or drainage to the work that reads it. Check that removing fill accounts for excavated material and any fitting that relied on it. | [Valheim terrain modification](https://www.valheim.com/ja/news/patch-1-0-16/) · [Factorio foundations and removal](https://www.factorio.com/blog/post/fff-383) |
| **Design and reuse rooms** | Place walls, doors, roofs and fittings. A partition can give a bed shelter, separate a smoky operation, or keep an enclosure secure. Name rooms freely. Derive the work they support from actual fittings, access and conditions. A shared room can support several uses when their requirements agree. | [Valheim construction](https://valheim.com/faq/) · [Dragon Quest Builders 2 construction and fields](https://na.store.square-enix-games.com/dragon-quest-builders-2) |
| **Change purpose over time** | Use the same site ID, route and tenure for a home, a workshop, a Gu farm or a mix. Preserve the shell, changes to the ground, stock and living occupants when replacing fittings. Let the player choose where displaced equipment and specimens go. A saved design can suggest a new arrangement and quote the work against what is already there. | [Factorio's parameterized plans](https://factorio.com/blog/post/fff-392) · [Stardew Valley plot development](https://www.stardewvalley.net/about/) |

**ACCOUNT FOR NOW.** Start with named areas and directional links where those are enough to explain water, doors and access. Add a small room grid when moving a door, fitting or partition changes a real use. Terrain, enclosure, fittings and live occupants can each have their own state. Use a bed, a bench, or a shade frame as a meaningful use of the same shelter. Allow mixed uses and reversible remodeling. A trench can improve drainage while taking space for a path. A roof can shelter a bench while taking light from a crop. Decoration can be a player choice with modest costs. These are design examples under AD38, AD51, SR1 and MR29–MR33.

**LATER / DELEGATE.** The earlier site-choice chat owns the first fitting proof. A later medium systems fixture can reuse that result to remodel one plot. Settle a drainage or footing change, move a fitting, compare a real rest, work or harvest result, and restore while the remodeling is pending. Check that the shell and occupants survive and the material ledger accounts for what was moved or removed. Use the same preview to explain support or access loss before a player confirms a change. Larger terrain tools, room drawing and saved designs can build on that proof.

#### In-game room plan practice plot

**ACT NOW.** The primary checkout has an opt-in Room plan practice plot in the rebuilt OOPS shell. It uses the current workspace and theme. Open a fresh local build with `?plot-draft`, choose **Play**, then choose **Room plan**. At 1920×1080 the player can place and move walls, doors and fittings, toggle roof cover, raise ground, dig trenches and inspect room uses. A rebuilt headless browser exercise checked door access, a moved door and bed, a roof-dependent bench, and a low orchid bed before and after drainage or raised ground. The example has disposable state. Its readouts model proposed local conditions and do not execute rest, crafting or harvest jobs.

**ACCOUNT FOR NOW.** Use three levels of detail on the same place. The place view shows projects, uses and paths in prose. The plan draws the selected plot when a placement choice matters. Inspect a room or fitting for the reason its use is ready or blocked. In the draft, walls and doors outline rooms, doors permit entry, and a roof or terrain change affects the fitting that reads it. A name and decoration can express the player's intent. Keep mixed uses possible where their conditions agree. Give walls and doors distinct marks and show valid destinations when moving a fitting. Keep click and keyboard placement available alongside any future drag controls. Use the [existing manor placement panel](../src/home_layout_panel.js) as a reference for the fee and confirmation flow.

**LATER / DELEGATE.** Connect one demonstrated use to its actual owner when the selected tie-in is ready. Quote access, support and material changes before a paid remodel, then publish the real project state, use and material receipt. Add undo for unpaid edits. Completed work can have a separate move, repair or salvage cost. The open design comparisons are roof support, drainage direction and downstream effects, shared access between rooms, and whether plan and use views benefit from a layer toggle. Keep the plot overview readable before adding finer geometry. Live settlement, save/import and mobile interaction remain future proof.

Practice build receipt: `BUILD_OUT="$PWD/work/plot-preview" npm run build` in the primary checkout produced bundle SHA-256 `9e917a913b852b5937bfc26248214460c0faf205048ff5d2c9621a6c1b1d56ed`. The headless browser check used a fresh origin and recorded zero page errors. Architecture, rules and the seven existing home layout tests passed. The isolated build reported the existing duplicate `dial` warning.

#### Dragging and how much detail a house needs

**ACT NOW.** The practice plot provides select-and-place and a two-click move. The live manor already quotes a fitting move and shows its effect on sleep through warmth and smoke. The [portable shelter fixture](/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/foundation-run-2026-11-12/PLAYER_BUILT_PLACE_FIXTURE.md) separately proves that a paid, placed roof enables the real rainy-day drying job. These are two different consumers. Dragging and a more general house model are proposals. [Manor layout](../src/home_layout.js) · [Drag and drop rule UR110](UI_RULES.md#every-element-the-element-sheet)

| Where detail pays off | Proposed default and comparison |
| --- | --- |
| **Drag an existing fitting** | Pick up a visible piece and preview its landing square, what accepts it, and which use changes. Dropping applies the same draft edit as click-to-place. Esc cancels. Keep a click and keyboard route. For walls, try a straight edge stroke as a later shortcut. For doors, start with a single edge and show which rooms it connects. |
| **Plan a room quickly** | Offer a few editable starting rooms and let the player move individual fittings. A room outline can be placed or resized as one draft gesture. [Factorio's construction tools](https://www.factorio.com/blog/post/fff-255) and [undo design](https://direct.factorio.com/blog/post/fff-412) motivate copy and undo at the plan level. Show material, labor and access changes before the actual order. A finished build uses normal move, repair or salvage actions. |
| **Choose which parts matter** | Ordinary housing can start with shelter, access, one bed and a useful fitting. Individual positions earn detail when a real use depends on them. Try a warmer bed that also catches more smoke, or a roof that lets a rack dry feed while shading the orchid bed next to it. Cosmetic placement can remain expressive and low effort. |
| **Make a specialized cultivation room** | [Amazing Cultivation Simulator](https://store.steampowered.com/app/955900/Amazing_Cultivation_Simulator/) builds feng shui around Five Elements interactions. The [local source inspection](/Users/weiwei/code/yet-another-idle-rpg/docs/research/amazing-cultivation-simulator/aspects-2026-10-14/ASPECTS.md#a12-other-systems) found room state, layout and conditional relics feeding actual modifiers. Borrow the idea that a room can support a particular practice through its conditions. Use one local source and one reader, such as a Gu enclosure with measured light or a cultivation seat that can use the current field. Show the cause and the affected use. Local law decides whether an element, facing, relic or neighboring room matters. |
| **Keep a place useful while life changes** | Compare a home shared with work against separate spaces when smoke, damp, access, noise or storage affects an actual activity. An early annex can do several jobs. Let the player specialize it, move work outside, or build a second room when a concrete conflict arises. A short place overview can show what is ready and what needs attention, with optional plan layers for shelter, access and local effects. |

**ACCOUNT FOR NOW.** Use the same placement proposal for dragging, keyboard and clicks. Snap fittings to squares and walls or doors to edges. Preview the loss of access, a new room boundary, or a changed downstream result before confirming work. Reject an occupied or incompatible target without moving the source. Allow undo on the unpaid draft, with enough information to restore a move and its affected edges as one edit. Keep the text view usable for routine actions. A room's displayed use should follow its real readers, and the readout should show just the relevant condition for the selected task.

**LATER / DELEGATE.** Small desktop practice comparison at 1920×1080. Move the same bed, bench or rack with click and drag, cancel once, and try an invalid drop. Both paths should produce the same room reading and preserve the original on cancellation. A medium systems follow-up can compare one existing use before and after a move under real conditions, with material and job settlement at the owning domain. Try a local cultivation source or light reader after that. Treat wholesale Five Elements scoring, room decay, multistory support and bulk moving as separate design questions. Each becomes worth exercising when it changes a player choice or supports the desired expressive building.

#### A house that changes an encounter

**ACT NOW.** Record an original comparison for house upgrades and unexpected events. Existing evidence covers a place graph with typed reach and a contest that resolves effects through workings. The room-plan prototype shows placement and access on disposable state. A window attack that reads a player-built opening and leaves persistent damage is proposed. [Place graph evidence](gm/dispatch/foundation-run-2026-11-12/W18_PLACE_GRAPH.md) · [Contest owner](CONTEST_CONTRACT.md)

**ACCOUNT FOR NOW.** Give the player everyday reasons to remodel. A shutter can trade daylight and airflow for privacy and cover. A rear door can shorten the route to the yard and give the household a way out. Moving a bed can change exposure without replacing the room. A bench or ward can protect a specific activity or asset. Keep the comfort, craft and care uses even in a quiet life. Let a house stay readable as rooms and routes, with grid positions where the choice depends on them.

For an assassination attempt, bind one actual rival or hired attacker, an established motive, their information about the house, a means and an approach. Use a bounded draw for timing or which plausible opportunity they take. Use the saved clock and draw owner, and retain a pending working when the attacker has committed. An existing situation can hold the cause and witnesses if it fits the route. The player may hear a latch or notice a shadow if their position and senses allow it. A sleeping or unobservant character can instead discover the opening blow. Preserve what the character can observe when reporting why the encounter started.

Give one persistent opening a physical state and let it supply the relevant movement, sight, sound and attack routes to the place graph. The same shutter can admit muffled sound while stopping sight and a direct shot. A window the attacker can shoot through may still be too high or narrow to climb through. The home or structure owner retains the condition and damage. Derive the available routes from that state. Use the same read for a player opening a window, a burglar trying it and an attacker forcing it. A ward can use the existing [stored working](../src/stored_working.js) when the world supports its trigger. Prefer named places such as outside the window, beside the bed and at the rear door. Add finer cover or reach when those places cannot express a choice.

| Start from the same attempt | Proposed comparison |
| --- | --- |
| Open window and target in reach | An attack may resolve from outside. If the threat remains active, hand the actual positions, awareness, injuries and available gear to the existing contest. Count the opener once. The defender can seek cover, flee, call for help or fight where those means exist. |
| Barred or shuttered window | The direct approach changes. A suitable attacker can spend time forcing it, try another available route or leave. A surviving scrape or broken shutter gives the player something to investigate or repair later. |
| Target away or move interrupted | Recheck presence when the strike would land. The attacker can withdraw or change plans under their policy. Damage already done and costs already paid persist. A later encounter uses the changed house. |

**Reference fit.** Cataclysm DDA gives terrain and furniture independent properties such as smash-triggered alarms. HITMAN gives attackers several approaches through the same authored place. RimWorld demonstrates selecting disruptions through a storyteller. Borrow pacing for eligible incidents, while the local actor, means and environment decide what can happen. Pair hostile cases with ordinary uses of the same openings, such as airing a workroom, passing a parcel or leaving by the yard. [DDA terrain flags](https://docs.cataclysmdda.org/JSON/JSON_FLAGS.html) · [HITMAN approaches](https://ioi.dk/hitman/game-features) · [RimWorld](https://rimworldgame.com/)

**LATER / DELEGATE.** Medium foundation fixture. Start with one window, one known rival, one threat and one ordinary use. Run the same committed approach with the window open, barred and with the target away. Restore before the approach settles, then compare opening damage, contest start or withdrawal, and what the house and body show afterward. The missing join is between a built opening, the attack working and the encounter host. Start from the existing clock, link, harm and contest owners. A repeated attempt with different timing can follow the first deterministic comparison. Richer planning and district-wide event selection are separate follow-ups.

#### Incidents in the room plan

**ACT NOW.** The opt-in primary-checkout practice plot adds a staged window attack at one marked edge. Closing the shutter leaves visible damage. Leaving uses the plot's exit check. Staying with an exposed opening hands a wounded practice body to the existing contest engine. The first shot is a separate prototype debit, and the contest resolves after the player chooses to fight back. The trial uses disposable state, a fixed setup and simple approach rules. Live encounter scheduling, native harm and save integration remain open.

The rebuilt desktop browser check at 1920×1080 exercised shutter damage retained after the trial, departure, removal of the escape option when the doorway was walled off, a single opening injury before contest settlement, and a blocked approach after replacing the window with a wall. Zero page errors. Bundle SHA-256 `70e18f922a26223e46fd72b7f7f09989649e903d1e6f1c9050d22a20b9fa5ccb`. Architecture and 20 existing contest and home layout tests passed.

| Other incident | Shared state it would read and change |
| --- | --- |
| Theft or a Gu escape | An opening admits a person or creature of the right size. A thief takes actual stock or a Gu leaves its enclosure. A witness or ward may raise an alarm. The player can secure the route, pursue or recover the missing thing. |
| Smoke, fire or a storm | A shutter or door changes airflow, exposure and escape. Close one route to keep sparks out or open another to vent smoke. Use the same damage, access and body readers as the attack. |
| A delivery or an injured visitor | One opening can admit a parcel, sound or a small creature while people need a door. A knock can lead to accepting goods, sheltering a visitor, refusing entry or responding to a threat. |
| A rival cuts your water or releases a tether | A reachable fitting is the target. Damage changes a real job or route. Repair, reroute or confront the rival where the same place and contest rules can handle it. |

**ACCOUNT FOR NOW.** In the text shell, show what the character notices, the few places and exits that matter, and the actions available at that moment. Highlight the relevant opening on the optional plot plan. A short report after settlement can name a cracked shutter and the way it changed the encounter. Keep the turn-based choice readable at 1920×1080 and usable by keyboard. Use the plan for building and inspecting. For a live incident, enter a dedicated encounter view through the existing controller. The engine can keep named positions and typed connections. Finer geometry belongs where it changes reach, cover or escape.

Cataclysm DDA's [terrain and furniture flags](https://docs.cataclysmdda.org/JSON/JSON_FLAGS.html#furniture-and-terrain) show how one opening can have distinct physical and alarm behaviors. [Overboard!](https://www.inklestudios.com/overboard/) makes a bounded text setting work through time, independent characters and what they notice. [Into the Breach](https://subsetgames.com/itb.html) shows how advance notice helps the player compare responses. OOPS can surface the threat when the character can perceive it. Borrow a clear indication of the next consequence where the character has enough evidence.

**LATER / DELEGATE.** Medium foundation work. Bind a saved opening to its structure state and the real place graph, then have one ordinary use and one hostile approach read it. Verify that changing the opening changes both uses where appropriate. Recheck the target and route at release, and verify that a restored attempt applies the shot and starts the contest once. At tie-in, retain the player's actual position and follow existing body, cost and save owners. Add the next incident when it gives that same opening a distinct use.

#### A Gu slips through an opening

**ACT NOW.** The opt-in Room plan practice plot has a Gu escape trial. It starts during handling, with the Keeper close enough to see the escape. The small flying specimen can pass the upper-left window. The Keeper must reach the yard through a separate route. A shutter can contain the specimen. A nearby door can make recapture possible, while a blocked or longer path changes the available response. The practice plot counts route steps and uses the existing [Gu flight and capture functions](../src/gu_flight.js) with a three-step comparison window. This duration and the specimen are original test choices.

**ACCOUNT FOR NOW.** A Gu leaving should follow its own behavior, current control, and an actual opening. A wild specimen slipping away during handling is plausible where its nature and the procedure support it. A securely controlled Gu that stays in an aperture or safe housing needs a real change before escape becomes an option. The prototype tests the capability. Selection for a real route depends on the world, specimen and situation. The existing crown flight gives a separate example with its own cause, capture windows and defenses.

Warnings depend on who or what observes the event. In a small room the Keeper might see the Gu, feel a container shift, or discover an empty perch later. In a larger facility, a watcher, bell, sensor or ward can extend notice across rooms when its range, trigger and means support that. A small workshop can also install a simple alarm if the player wants one. Report the cue and the response the character can reasonably take. A witness can know a Gu reached the yard. A latch alarm may establish that the hatch opened without identifying what passed through it. If nobody notices in time, the escape can settle and leave evidence to investigate.

**LATER / DELEGATE.** The first live candidate should come from a case with a real reason for loss of control. Prove one observed escape and one discovery after the fact with the same specimen and route rules. Use native time, observation, place and custody. An optional facility warning can become another reader once a room or enclosure actually needs remote coverage. Leave forced incidents, automatic alerts and layout changes during a committed escape outside this first comparison. The practice plot stays available as a design test.

Rebuilt desktop check at 1920×1080 verified recapture by the near door, a blocked route, a longer route that misses the window, and containment by the shutter. The room layout and window attack comparisons passed in the same journey with zero page errors. Bundle SHA-256 `516b60957276acd36945674730dc631c1337db5ddb6d926ea9c9c968b3272efd`.

#### How much control an idle house needs

**ACT NOW.** Record a proposal for the home and encounter depth under AD52 and [ACR1–ACR14](ACTIVITY_ABSTRACTION_RULES.md). The practice plot demonstrates hand placement and changed options in staged incidents. The portable shelter fixture demonstrates a roof changing a real drying job. Neither supplies a live house incident, paid layout workflow or offline proof.

| When | Player control and what settles |
| --- | --- |
| Choosing or remodeling | Pick a purpose, site and budget. Offer an editable starter plan and individual placement where it changes access, shelter, light or a use. Fine placement is an optional way to design, including for appearance. The ordinary place view can offer a direct project quote. |
| Using a familiar place | Set a feeding, tending or production routine with actual stock, time and labor. Batch the work up to a declared limit or shortage. A player can intervene at a meaningful stage, such as changing a brew or choosing what to harvest. Preserve exact specimens and paid work where they matter. |
| Responding to an unusual event | Open the relevant choice when the character can observe it and act. In a Gu escape the nearby door can permit pursuit and a shutter can contain the Gu. If the character was elsewhere, retain the real outcome and the evidence they can later discover. Standing instructions can cover predictable work where a person or device can actually carry them out. |

**ACCOUNT FOR NOW.** Keep one world state beneath the text overview, room plan and close encounter. Let the room plan show the practical difference from a move, such as a dry rack, a blocked exit or a newly sheltered bench. Put frequent choices in text. A player who likes building can spend a session refining a layout, then use that layout for many routine jobs. The amount of detail follows the activity, stakes and player preference. No change to the current run order.

Use the existing [time rules](TIME_RULES.md) TMR5 and TMR8. Closed time is banked and spent through the game clock. A bank spend or a routine can settle ordinary work and stop when a meaningful response is due. A later discovery can give the player a choice about what to do next even when the original event was unwitnessed. Use the [return recap rule](TIME_RULES.md) TMR10 for what changed and why time stopped. An incident still needs its own in-world cause and a reason to be in the route.

**LATER / DELEGATE.** Small to medium comparison. Configure one useful fitting and one supply routine. Run it manually, then spend the same amount of banked time with the same plan. Compare actual stock, elapsed time and the first shortage or choice. If a later selected incident reads the same fitting or route, check that manual and banked play reach the same decision boundary with the same available actions. Richer layouts earn more detail when they change what the player can build, use or express.

## Tracker

The table below records the initial state. The resume line and run record carry later evidence.

*Filled by hand on 2026-11-12 from the commands named; PC60 replaces this with generated output. "Open" means the check fails or its script does not exist yet.*

| Phase | Check | Source of truth | State |
| --- | --- | --- | --- |
| 1 | Ledger states computed by the runner | `npm run check:coverage` | The runner computes 38 of 80 `hp_spells` rows as expressed in its vocabulary probe. Running cases through the common engine-world constructor remains open. The other six ledgers have no cases yet |
| 1 | A settled spell changes a world through one host | Focused tests | Met in the engine (Waves 10 to 12). Hosting on the game's spellbook cast is tie-in work (PC95) |
| 1 | Compression ledger prints with a baseline | `npm run report:compression` | Met (Wave 10): C1 36, C2 65, C3 5, C4 4, C5 10, C6 0 of 7 |
| 1 | Absorption matrix prints | | Withdrawn (PC94) |
| 1 | Coupling map prints | `npm run report:couplings` | Met (Wave 10): 11 packs, 5 cross-domain couplings, 1 pack loaded |
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
| 3 | Data already read is in the ledgers (PC85) | Coverage README | Open: 177 potions on `formula-in-notes`, of which the share with a formula in the table is uncounted; no `canon_negatives` ledger |
| Reading | Chapter-checked share of Gu kinds, moves and ingredients | Coverage README | 78 of 1,466 kinds; 23 of 776 moves; 20 of 409 ingredients running, 79 more with evidence rows |

For current coverage, dispatch order and verification, see the [foundation run resume block](gm/dispatch/foundation-run-2026-11-12/RUN.md#current-resume-block). Open policy questions remain in the [core](PROCEDURAL_CORE.md#open-questions).
