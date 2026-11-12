# Procedural carry-out

*Proposal for Weibao, 2026-11-12, and a proposal throughout (AD32). Companion to the [procedural core](PROCEDURAL_CORE.md): that doc says what and why, this one says who does what in which file, how each piece is checked, and how the whole plan is kept from stalling. Codes continue the core's: PC51-PC66 here, PC67-PC88 in the core, PC89-PC96 here again. **Read PC95 first: it sets the engine world as the bar and defers game tie-in.** File facts were read from the tree at a77fda00c plus that day's uncommitted files. Every number is a dial with a reason.*

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
| 177 Lord of the Mysteries formulas and about fifteen canon failures are already in notes | Reading was the next step | Data moves first (PC85), as Codex lanes |

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

The five numbers (PC89), restated:

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
| Formulas | The 177 Lord of the Mysteries formulas into potion rows (PC85) | B's ledger script and pack data | G1 |
| Feeding pass | Diet fields for the 78 chapter-checked Gu from their chapters (PC86) | `src/gu_catalogue.js` | G1 |
| Breeding program fixture | Over twenty generations of the existing sheep genome, select for one trait and show the gain, its cost in another trait, and that hidden genes limit the breeder until tested. A second run with a different goal ends with a different flock | One new test file on `src/heredity.js` and the lifecycle | G4, and it is the worked example of the loop above |

Not started now: MS-A to MS-E. Each waits for a consumer in phase 2 or 3, by PC94.

## Tracker

*Filled by hand on 2026-11-12 from the commands named; PC60 replaces this with generated output. "Open" means the check fails or its script does not exist yet.*

| Phase | Check | Source of truth | State |
| --- | --- | --- | --- |
| 1 | Ledger states computed by the runner | `npm run check:coverage` | Open: runner and README columns exist (Wave 10); no row has a `case`, so computed runs are 0 |
| 1 | A settled spell changes a W world through one host on the game's path | `scripts/reachable.mjs`, focused tests | Open: `src/effect_host.js` lands a spell in tests (Wave 10); unreachable from the game. Next: P1.2b on `src/spellbook_host.js` |
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
| 3 | Data already read is in the ledgers (PC85) | Coverage README | Open: 177 potions on `formula-in-notes`; no `canon_negatives` ledger |
| Reading | Chapter-checked share of Gu kinds, moves and ingredients | Coverage README | 78 of 1,466 kinds; 23 of 776 moves; 20 of 409 ingredients running, 79 more with evidence rows |

Resume line: phase 1 under way. P1.1 tooling, P1.2 library, P1.3 and P1.5 landed in Wave 10. Next, by PC95: P1.7 (engine world), P1.6 (vocabulary fold), P1.8 (Hogwarts grammar as a world pack with cases). Game tie-in is deferred. Questions waiting: Q1, Q2, Q5, Q7 in the [core](PROCEDURAL_CORE.md#open-questions).
