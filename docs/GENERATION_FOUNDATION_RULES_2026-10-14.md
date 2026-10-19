# Generation foundation rules: one contract for every generator

Date: 2026-10-14. Weibao asked for "procedural generation/foundation
generation rules to make everything else easier", plus more to consider and
subtle stuff. GR1–GR17 were accepted 2026-10-18 as the standing generator contract (Weibao: "accept based on base and existing rules"; no conflict with MR2 or AD22). Suggested order, lanes and top picks below remain proposals. It sits under the
[procedural status map](PROCEDURAL_GENERATION_STATUS_2026-10-13.md) and turns
the one-paragraph root note (V in [story considerations](PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#v-generator-architecture-root-note))
into rules a builder can check.

Why it matters now: wave 1 shipped four generators on four branches (streams,
mixing, storylets, people) and P5 queued five more. Each one so far invents
its own draw, pick, freeze and fallback. If they share one contract, a new
generator is a content file plus a consumer, not a new engine. Owners it leans
on: [E1 seeded streams](emergent/E1_SEEDED_STREAMS.md), [E4 tags and rules](emergent/E4_TAGS_AND_RULES.md),
[core scorecard](CORE_FOUNDATIONS_SCORECARD_2026-10-14.md) (U04, K1, F4),
lanes A2 tags and A5 determinism, P32 level of detail.

Verified at write time (SHOWN): 63 `Math.random` calls in `src/`;
`src/seeded_streams.js` exists only on unmerged `proc/p1-streams`
(`7b787fdd`); `proc/wave1-integration` is being integrated by another session.
Update 01:15: wave 1 is merged into `codex/gameplay-foundations`
(`src/seeded_streams.js`, `mixture_*`, `storylet_*` present) and
`Math.random` is down to 27 calls.

## The rules (GR)

Each rule names the failure it prevents.

| Code | Rule | Prevents |
|---|---|---|
| GR1 | **One generator shape.** `generate(address, inputs, tables, draws) -> { value, receipt }`. Pure: same address, inputs, table revision and root seed give the same value. No `Math.random`, `Date.now`, wall-clock or DOM reads inside. | Generators nobody can test, replay or reason about |
| GR2 | **Address draws, do not count them.** A draw is `hash(root, streamKey, subjectId, slot, attempt)`, not "the next number in a shared sequence". Stream keys name purpose and subject: `village.trader.stock/npc:oren/day:12`. | Adding one roll to shopping shifts every fight after it (E1 V2) |
| GR3 | **Freeze on reveal.** Unseen things may be regenerated from their address. Once the player has seen a thing, save the value, not the seed. | A content edit silently rewrites a known NPC's name or a learned potion (P5 F4) |
| GR4 | **Lazy, stable addresses.** Things exist as addresses (`gen:village:person:7f3a`) until observed. IDs are namespaced strings, never array indexes. Promotion from summary to detail follows P32 level of detail. | Save bloat; IDs that shift when a list grows |
| GR5 | **Truth and knowledge are separate writes.** The generator writes truth. A projection writes what the player knows and how it is named or looks. | Identification, appearance shuffles, rumors and sealed secrets each re-solving "what does the player see" |
| GR6 | **Constrain, retry, fall back.** Generate, validate against declared constraints, retry with `attempt` in the address, cap retries, then use a named authored fallback. Count fallbacks. | Infinite loops, impossible combos, silent empty rewards |
| GR7 | **Tables select by tag query, not ID list.** "Things tagged `herb` and `wet` and not `toxic`." Tags admit content to relevant selectors; mechanism compatibility is resolved by the owning law, not tag presence alone (AD38). | Every new item needing edits in ten tables; a selector becoming a permission list |
| GR8 | **Layer tables, never copy them.** Core table, then world overlay, region overlay and person modifiers that add, remove or reweight by tag. | Seven forked Village tables drifting apart |
| GR9 | **Integer weights with a stated reason.** Weights are integers. Each pick can return its top contributors ("why this?"). | Float drift; weights nobody can debug; cheats like "see fate" with nothing to show |
| GR10 | **Tables carry `id@rev`.** Receipts store the revision. Frozen values keep their old revision; unseen addresses use the new one. | Patch day quietly changes a save's past |
| GR11 | **Declare a budget.** Each generator states max entities, max draws per game day and cost class. P32 enforces it. | Idle catch-up that generates ten thousand people |
| GR12 | **No generator without a reader.** A generator lands with at least one action, cost or gate that reads its output. | Write-only fields that look done in reports (scorecard F4) |
| GR13 | **Same rules for NPCs and player.** NPC crafters, rivals and heirs call the same generator as the player. | Two economies, two balance passes (crafting NP) |
| GR14 | **Scope streams to world and life.** Stream roots derive from world and life IDs per E1 section 6, so crossings and rebirths stay independent and replayable. | One world's events reshaping another's |
| GR15 | **Text is a grammar over fact IDs.** Generated text stores slot references and renders at display time through knowledge, so renames and discoveries propagate. Only in-world documents (a letter, a carving) freeze rendered text. | Stale names in old logs; accidental secret leaks in prose |
| GR16 | **Every generator ships three tests.** Seed sweep (N seeds, invariants hold, distribution inside a band), golden snapshot for three fixed seeds, and save/reload/import gives the same next value. | Determinism bugs found by Weibao in play |
| GR17 | **Keyed by the owning game clock, not ticks.** Each time-based draw names its world, body or space clock; repeatable actions also retain the committed attempt identity (GR2). Equivalent segmented/catch-up processing retains the same draws. | Background timing changing results; frozen world dates repeating every personal practice draw |

## Subtle stuff (SB)

These break generators quietly and are cheap to prevent once.

- **SB1 Previews must peek, not draw.** Quote-then-commit (U11) must read draws without consuming them. A preview that consumes is a hidden reroll and the most likely bug in this codebase.
- **SB2 Cancel after quote must not shift anything.** Follows from GR2 if the attempt counter only advances on commit.
- **SB3 Object key order.** JS reorders integer-like keys. Iterate sorted arrays when the order feeds a draw.
- **SB4 String sorting.** `localeCompare` varies by locale and engine. Sort by code point for anything that feeds a draw.
- **SB5 Modulo bias.** `hash % n` skews small tables. Use a 32-bit fraction or rejection.
- **SB6 Hash width.** Stream keys need a 64-bit-ish hash (two 32-bit lanes). Seven copied xorshift variants (scorecard U04) are a collision and drift risk.
- **SB7 Float sums.** Summing float weights in different orders gives different picks. Integer weights (GR9) remove this.
- **SB8 Dilution.** Each new card added to a tag table quietly lowers the odds of every other. Pick a category first, then an item inside it (stratified pick), so categories keep their share.
- **SB9 Rare things never seen.** A 1-in-500 event may never appear in 40 hours. Use scheduled rarity: guaranteed at least once per N eligible windows, per world adjective.
- **SB10 Streaks feel unfair.** Independent rolls cluster. Offer shuffle bags or pity counters as a per-world "luck shape" adjective, not a global rule.
- **SB11 Repetition memory belongs to the player, not the stream.** "Recently seen" penalties key on what Weibao saw, so two streams do not serve the same card back to back.
- **SB12 Correlated generation.** Siblings, apprentices and same-batch products should share inputs (parent fields, batch ID), not roll independently. Genetics and households need this.
- **SB13 Name hygiene.** Filter generated names against canon names, existing cast and a small blocklist of accidental real words.
- **SB14 Retries consume addresses, not luck.** Put `attempt` in the address so a rejected candidate never shifts the next subject.
- **SB15 Seed visibility vs sealed secrets.** A displayed world code plus readable source reveals rolled secrets. Fine for a solo player, but the UI never prints the truth, and debug seed overrides live only behind a dev URL flag.
- **SB16 Cross-world items keep their home rules.** A generated item carries its origin world tag and is judged by that world's laws unless a crossing rule says otherwise.
- **SB17 Migration of old saves.** Old saves get a fresh root for new streams (P1 already does this). Never back-derive a root from save contents.

## More to consider (MC)

- **MC1 Generator composition graph.** Quest calls people calls names calls culture. Declare dependencies as a small graph so a change in names reports which generators and golden tests it touches.
- **MC2 Sample and score.** Draw K candidates, score for interest, novelty and relevance to current goals, take the best with a deterministic tie-break. Cheap way to make random feel authored.
- **MC3 Author-time generation.** Agents pre-generate pools offline (names, rumors, recipes), Weibao or a reviewer skims them, runtime only picks. Cheaper, reviewable and no runtime text model. Pairs with P15 batch lint.
- **MC4 Shareable world codes and daily seeds.** One string recreates a fresh start; a dated seed gives a "today's world" run. Optional, per world.
- **MC5 What-if branches.** Fork a save at a receipt and replay with one changed input. The same machinery serves regression cheats (E1 7.6) and balance testing.
- **MC6 Headless seed farms.** Run thousands of seeds headless to find broken economies, dead tables and never-reached content. P18 owns the harness; these rules give it the hooks.
- **MC7 Generated rules, not just content.** A world's laws can mutate per run (E9), within per-world adjectives. Same table machinery applied to rule cards.
- **MC8 Generated visuals.** Sigils, vial colors and map tints from the same address, so a thing looks the same everywhere it appears.
- **MC9 Player-facing generators.** Some cheats are generators the player drives (write a recipe, name a technique, design a sect). They should call the same kit with the player as the scorer.
- **MC10 Director overrides.** Pin, ban or reweight any table entry from a dev panel without code edits, saved as an overlay (GR8). Pairs with P22 director tools.
- **MC11 Plausibility vs surprise.** A per-world adjective for how often generation breaks pattern. Grounded slice-of-life worlds sit low; chaos worlds sit high.
- **MC12 Explain for the player.** In worlds that allow it, "why did this happen?" shows a knowledge-filtered version of GR9's reasons. Doubles as the "see fate" cheat surface.

## Suggested order (proposal)

1. ~~Merge `proc/p1-streams`~~ Done (wave 1 merged, 2026-10-14).
2. Build a small shared kit (lane G1): addressed draws, integer weighted pick, stratified pick, shuffle bag, sample and score, bounded retry with fallback, explain record. New file plus tests, no edits to existing generators.
3. Audit existing generators against GR and SB (lane G2) so migration targets are ranked, with SB1 previews first.
4. Specify tag-query tables and overlays (lane G3) on top of the A2 tag store, with Village plus two worlds worked through.
5. Adapt P3 storylets onto the kit as a separate migration candidate after integration lands; the existing Village mixture reader already demonstrates a bounded kit consumer. P3 remains unselected and not dispatched.

## Lanes dispatched

[Generation rules lanes](gm/dispatch/gen-rules-2026-10-14/COMMON.md): G1 kit
(code, own worktree and branch `gen/g1-kit`), G2 conformance audit (docs),
G3 tag-query tables and overlays (docs). All proposal until root review.

---

## Round 2 (2026-10-14): comic worlds, generation cheats, overarching shape, abstractions

Request: "Considering comic worlds and stuff and more? ... Cheats that would
show stuff like these and more? ... Subtle stuff too? Overarching stuff?
Implementation implications and more? Abstraction that's needed? Merging,
committing or pushing?"

The world-level answer to the same prompt is
[World core kit round 6](worlds/WORLD_CORE_KIT_2026-10-14.md#round-6-comic-worlds-cheats-that-show-the-kit-overarching-shape-abstractions-2026-10-14)
(CW comic traits, CL lens cheats, OV, AX abstractions, II27-II36). This round
covers only the generation side and reuses those codes. Comic data source:
[comics wiki pilot](research/comics/REPORT.md) and
[playthrough targets](research/comics/PLAYTHROUGH_TARGETS.md).

### Comic worlds as generation problems (CG)

Comics are the best stress test for these rules because the genre is already
procedural: variants, legacies, events and retcons are its native moves.

| Code | Comic move | Generation reading | Rule it leans on |
|---|---|---|---|
| CG1 | **Earth-N variants** (CW1) | A counterpart is the same person address plus a continuity salt. Shared root traits, divergent rolls. Cheap multiverse | GR2, GR8 overlay per continuity |
| CG2 | **Codenames** | Grammar over power tags, origin, era and tone (Silver Age "Captain X" vs modern one-word). Filter canon and trademark names | GR15, SB13 |
| CG3 | **Origins** (CW3) | Roll origin family first (mutant, tech, magic, alien, trained), then powers inside it. Stratified pick keeps rare origins rare | SB8 |
| CG4 | **Power grid** (CW4) | Roll on the world's native scale (Marvel grid, Worm classes, MHA quirk); the scale is a table, the reading is a social fact | GR7 |
| CG5 | **Rogues gallery and nemesis** | A villain generated as a mirror of a hero's traits: counter power, shared origin, personal grudge from a receipt. Per-world dial on how tailored | GR12, SB21 below |
| CG6 | **Costume and look** | Palette, emblem and silhouette from the same address, so a cape looks the same on every panel and in every log line | MC8 |
| CG7 | **Legacy mantles** (CW12) | The mantle is a persistent object; holders are generated or chosen successors who inherit its regard and enemies | GR3, AX17 persona |
| CG8 | **Crossover events** (CW7) | A world-scope situation picks tie-in beats per district from tagged tables; tie-ins key on event phase, not ticks | GR17, AX8 |
| CG9 | **Retcons** (CW6) | A retcon is the one sanctioned way to change frozen truth: write a new revision over the old, keep the old as residue (CWS2) | GR3, GR10 |
| CG10 | **Sliding time** (CW2) | Day-keyed draws keep working, but "era" becomes an input so tech and tone shift around ageless heroes | GR17, CW15 |
| CG11 | **Henchmen and civilians** (CW10, CW11) | The ordinary cast is mass-generated at low detail and promoted when the player looks (P32) | GR4, GR11 |
| CG12 | **Status quo gravity** | Damage and deaths regenerate on a per-world repair clock; repaired things keep a scar receipt | GR3, CW6 dial |

First comic world for generation, if one is picked: Worm/Ward or MHA (CW16),
because their power rules are tight enough to roll against.

### Cheats that act on generation (GC)

CL lenses show the world. These show or bend the dice. E1 section 7 already
names the verbs (see, reroll, pin, bias, steal, branch, blind); this table is
the cheat catalog on top, with framings per world.

| Code | Cheat | What it reads or does | Framings (illustrative) |
|---|---|---|---|
| GC1 | **Odds sight** | Shows the real chance of an outcome before you act, pity included | Probability eyes, Luck stat window, Doctor Strange's "14 million futures" |
| GC2 | **Table sight** | Shows the menu: what could have dropped, spawned or happened here | Loot table vision, "the possible", Gamer's appraise |
| GC3 | **Why sight** | GR9 explain record for any event: top causes and weights | Threads of cause (CL2) at the dice layer |
| GC4 | **Fixed or fluid** | Marks which things are frozen and which can still change | Time-loop veteran's sense (Mother of Learning), Seer |
| GC5 | **Pity meter** | Shows luck-shape counters and the rarity clock (SB9, SB10) | Gacha sense, "you are due" |
| GC6 | **Pin** | Lock one unseen draw to a chosen visible option, saved as an overlay | Fate binding, wish, prophecy you make |
| GC7 | **Reroll** | Spend a cost to redraw one unseen address with a new attempt | Second chance, Luck Eater, gambler's cheat |
| GC8 | **Bias** | Shift weights by tag for a period (more herbs, fewer bandits) | Blessing, favored by heaven, Domino's luck |
| GC9 | **Kin sight** | Shows when two things share a root (siblings, same batch, counterparts) | Bloodline sense, Multiverse watcher (CL7) |
| GC10 | **Branch preview** | Run a short what-if from a receipt and show the result, no commit | Regression peek, Precognition, Spider-sense future |
| GC11 | **Thin-world sense** | Notices when a generator fell back to an authored default (fallback count, GR6) | "This place feels unfinished", a fourth-wall joke (CL14) |
| GC12 | **Counterpart call** | Meets your Earth-N variant (CG1) and trades one trait or memory | Spider-Verse, Multiverse of Madness |
| GC13 | **Retcon** | Rewrite one small frozen fact with residue (CG9); CL13 at the dice layer | Comic retcon, Echo Anchor |
| GC14 | **Seed reader** | Learns a world code (SB15) and can foresee unseen rolls in one domain | Seed Cartographer (cheat library 5) |

Generation cheat rules (GCR):

- GCR1 **Cheats call kit hooks, never generators.** Peek, pin, reroll, bias and branch are kit operations with receipts. A cheat that edits a generator's internals is a bug.
- GCR2 **Shown odds are true odds.** GC1 and GC5 read the same weights the pick will use, after overlays and pity. Lying odds are a per-world fiction choice that must be labeled in data, never accidental.
- GCR3 **Foresight is conditional.** A foreseen roll holds "if nothing changes". If inputs change, the cheat shows that the vision shifted, not a silent mismatch.
- GCR4 **Sealed truth stays sealed.** Table sight and seed reader never list a sealed secret's options outside its discovery route (CLR3).
- GCR5 **Strength ladder and costs per world,** same as CLR2 and CLR4.
- GCR6 **NPC cheaters use the same hooks.** A rival with luck manipulation biases the same tables, and GC3 can catch it.

### Overarching shape for generation (OG)

- OG1 **One address space for everything.** Authored canon, AU changes and procedural content all live at addresses. Canon is a pinned address, an AU is an overlay, generated content is unpinned. Divergence from canon is unpinning.
- OG2 **Generation is a tree.** World seed, then laws, places, people, items, events, text. Each level reads the levels above through addresses, never through draw order.
- OG3 **Truth, knowledge, surface.** The generator writes truth, projection writes knowledge, presentation writes surface (OV3, GR5). Cheats can open any of the three, one lens at a time.
- OG4 **Explain is a product feature.** The same record serves debug, director tools, golden tests and "why" cheats (OV7, GR9).
- OG5 **Freeze is what makes a world real.** What the player saw does not change except through a named, in-fiction mechanism (retcon, regression, rewrite cheat).
- OG6 **Authors and agents generate offline, the runtime picks.** Runtime generation stays small and pure; richness comes from reviewed pools (MC3).

### Abstractions needed (GA)

Each maps to a kit AX row where one exists, so there is one owner per idea.

| Code | Abstraction | One-line interface | Maps to | Status |
|---|---|---|---|---|
| GA1 | Address | Namespaced path string, canonical order | AX13 picker input | New, G1 building |
| GA2 | Draw | `draw(root, address)`; `peek` vs `commit` | U04, P1 streams | New, G1 building |
| GA3 | Table | Tag query, integer weights, strata, `id@rev`, budget | AX13 MicroTable | Spec in G3 |
| GA4 | Overlay | Add, remove, reweight, pin, ban by tag; core to director order | AX14 | Spec in G3; extend AX14 |
| GA5 | Pin store | Address to fixed value; canon pins and cheat pins share it | New | Spec in G6 |
| GA6 | Freeze record | Seen value plus revision and receipt | AX15 receipt | Extend AX15 |
| GA7 | Projection | Truth to knowledge to surface | AX6 observation, AX5 perception | Extend |
| GA8 | Generator registry | Name, inputs, outputs, budget, deps, golden seeds | MC1 graph | New, small |
| GA9 | Draw hook | Peek, pin, reroll, bias, branch for cheats, with receipts | AX18 lens for the dice | New, spec in G5 |
| GA10 | Continuity salt | Per-continuity root derivation for variants | AX14, CG1 | New, comics and multiverse |

Abstraction rules: AXR1 "earn it twice" applies. GA5 passes (canon pins in
every book world, plus pin cheats). GA9 passes (every GC cheat, plus NPC
cheaters). GA10 passes (comics, Mother of Learning loops, multiverse hub,
regression).

### Implementation implications (GI)

- GI1 **G1's kit needs hook points** for GA9 (peek already in its prompt; pin, reroll attempt and bias are not). Add them in a follow-up after G1 reports, not by editing a running lane.
- GI2 **Pins and freeze records are save data.** Additive maps keyed by address; old saves load with empty maps. Compaction per E1 4.5.
- GI3 **Wave 1 is merged,** so the first port target (storylets onto the kit) is now unblocked once G1 lands.
- GI4 **27 `Math.random` calls remain.** G2's conformance table ranks them; A5's ratchet should stop new ones.
- GI5 **Explain records cost memory.** Keep only the top three contributors and only for recent or frozen picks.
- GI6 **Variants multiply saves.** A counterpart stores only its divergences from the root person (overlay), never a full copy.
- GI7 **Retcon is a migration in fiction.** It writes a new revision and keeps residue, so it rides the same machinery as content revisions (GR10).
- GI8 **Comic presentation (CW13) needs no generator changes,** only the surface layer reading the same truth.

### Subtle stuff, round 2 (SB18-SB26)

- **SB18 Retcon versus freeze.** If anything other than a named mechanism changes a frozen fact, it is a bug, even when the new value is "better".
- **SB19 Counterparts share roots, not knowledge.** Your Earth-2 self knowing what you learned is a leak unless a cheat says so.
- **SB20 Comic time and day keys.** Under sliding time, keying by "day" still works but "age" and "era" must be inputs, or ageless heroes reroll their birthday.
- **SB21 Tailored villains read hidden stats.** A nemesis built from your traits can reveal traits you have not discovered. Build from observed receipts, not hidden truth.
- **SB22 Tailoring feels like rubber-banding.** If every generated threat scales to you, growth feels empty. Per-world dial, and some things stay fixed strength.
- **SB23 Pinning an unseen address** must survive table revisions; a pin to an option that a new revision removed falls back with a visible note, not silently.
- **SB24 Foresight and peek ordering.** Peeking ten future draws must give the same values the commits later use (addressed draws make this free; sequential streams do not).
- **SB25 Odds display rounding.** "0%" for a 1-in-500 event lies. Show "<1%" and keep integer weights underneath.
- **SB26 Name collisions across continuities.** Two Earths may both generate "Captain Ember"; that can be a feature (counterparts) only when they share a root, otherwise rename.

### Other stuff and more (MC13-MC18)

- MC13 **Genre presets for generators.** Comic, academy, cultivation and horror presets reweight the same tables (KX43).
- MC14 **Generated issue structure.** Comic worlds could pace events as "issues" and "arcs", each a storylet bundle with a cover line.
- MC15 **Fan and press layer.** Generated tabloid rankings and trading cards from the same truth, with errors only when a source is unreliable (CWS7).
- MC16 **Player seeds as gifts.** A world code from one run can seed a counterpart in another world (multiverse echo).
- MC17 **Variant drafting.** Pick from three generated starts or three generated counterparts, each showing its divergence (keeps every option reachable).
- MC18 **Generation achievements.** Quiet records for seeing every option in a table, catching a fallback, or meeting all variants of one person.

### Lanes dispatched, round 2

G4 comic-world generation profiles, G5 generation cheats and draw hooks, G6
address space and pins (canon, AU and generated as one). All docs, all
proposal. See [lane folder](gm/dispatch/gen-rules-2026-10-14/COMMON.md).

---

## Fold: G1-G6 lane returns (2026-10-14)

Status: **wave folded.** Six lane returns read in full and reconciled here.
Lane files were committed by the gameplay-foundations session in `fd176f27`;
G1's kit is merged (`adaa4e18`, `src/gen_kit.js`). Everything below stays
proposal. No new lanes. Links: [G1](gm/dispatch/gen-rules-2026-10-14/g1/REPORT.md),
[G2](gm/dispatch/gen-rules-2026-10-14/g2/REPORT.md),
[G3](gm/dispatch/gen-rules-2026-10-14/g3/REPORT.md),
[G4](gm/dispatch/gen-rules-2026-10-14/g4/REPORT.md),
[G5](gm/dispatch/gen-rules-2026-10-14/g5/REPORT.md),
[G6](gm/dispatch/gen-rules-2026-10-14/g6/REPORT.md).

### What each lane adds

| Lane | Adds | Evidence level |
|---|---|---|
| G1 kit | `src/gen_kit.js` (194 lines, no imports): addressed two-lane hash, integer weighted and stratified picks with explain receipts, JSON shuffle bag, pity, sample-and-score, bounded retries with named fallback, peek/commit. 15-line P3 storylet example | 27/27 kit tests, 661/661 suite on its branch. Merged. Bounded Village mixture readers bind `gen_kit` in source (`mixture_rules.js`, `mixture_native.js`); [T3](gm/dispatch/chain-build-2026-10-14/t3/REPORT.md) records its delivered source/build/browser and persistence gates. This is local adoption, not universal GR/G1 adoption |
| G2 audit | [Conformance table](gm/dispatch/gen-rules-2026-10-14/g2/CONFORMANCE.md) for 37 generator groups against GR1-GR17; [subtle bug hits](gm/dispatch/gen-rules-2026-10-14/g2/SUBTLE_BUGS.md) with file:line; nine new failure modes | 12 read-only source probes. No harness, build or browser |
| G3 tables | Table format, tag query grammar, integer strata, `id@rev`, budgets; overlay merge order and saved director overlays; Village, HP and JJK worked views where a new tagged item joins three selectors with zero table edits; offline pool pipeline; MC19-MC28 | JSON and arithmetic doc checks only. A2 tag API still absent |
| G4 comics | Profiles for Worm/Ward, MHA, a Big Two pattern and an original Masked City; three-Earth variant, mantle and retcon save sketches; name grammars with collision filters; CG13-CG20, SB27-SB36 | Doc checks; Worm passages verified against the local edition; MHA glossary checked live. Big Two stays MEMORY-labeled |
| G5 cheats | GA9 hook spec (peek, pin, reroll, bias, branch preview, blind); all 14 GC cards in the live cheat-card shape with costs and framings per world; odds honesty rules and 18 builder test cases; GC15-GC28 | 14/14 cards pass live `validateCheatCard` and `grantCheat`. Data shape only |
| G6 address space | Address grammar mapped to live IDs; pin store shared by canon and cheats with typed authority; migration decisions G6-CD1 to CD4; 15 risks | 16/16 source assertions against live modules |

### Corrections to this doc (root was wrong or overstated)

- **C1, SB17 (G2 F2).** "Old saves get a fresh root; P1 already does this" is false. `src/seeded_streams.js:25,38-44` back-derives new stream roots from the saved legacy RNG, and craft streams ignore world scope. Corrected rule: the migration choice is an open compatibility decision for the integrator. Do not overwrite merged roots.
- **C2, SB1 (G2 F1).** "Previews consuming draws is the most likely bug" was inference. G2 found no live preview leak. Real ordering risks are locale/JSON tie sorts and sequential per-stream rolls (`src/main.js:4738-4742`, `src/simulation.js:527-550`, `src/storylet_deck.js:31,62-64`). SB1 stays a rule; it is not a known bug.
- **C3, OG1 (G6).** "Canon is a pinned address" is too literal. Canon events are conditional expectations: divergence changes real causes, and generated observed facts stay stable without pins. Corrected OG1: one **read interface** over addresses, with typed authority (canon expectation, cheat pin, freeze record, draw) behind it. One pin envelope, several meanings.
- **C4, GR9 explain (G1, G5 F4).** The kit's top-five receipt explains table shares, not modifier arithmetic. Odds sight (GC1) needs the full resolver snapshot the commit uses, not just the receipt.
- **C5, GA4 (G3, G5).** Category pins and multiplicative bias are not in G3's overlay v1. They are named extensions, needed before GC6 category pins and GC8.

### Duplicates and code collisions

- G2 numbered its additions **SB18-SB26**, colliding with root round 2. Root renumbers G2's set to **SB37-SB45** in the same order (rounded endpoints, falsy-zero chance, frozen value rechecked against today's law, unbounded keyed receipts, cosmetic labels as identity, name-scan collisions, surrogate drop, forever-pinned requests, unbounded combinatorial search). G2's own file keeps its old labels.
- G2 SB24 (surrogate drop) and G1 D1 are the same finding from two sides: P1's hash and four other sites drop the low surrogate of emoji and rare CJK. G1 fixed it in the kit; the live sites remain.
- G3's pin envelope and G6's pin store overlap. G6 owns pin storage and authority; G3 owns overlay ordering that reads it. G5 hooks call both and own neither.
- G4 SB36 and G5 GCR4 both guard sealed truth in diagnostics; keep one lint (P15) with both cases.

### Contradictions left open

- G1 deliberately does not reproduce P1's draw values (two lanes, multiply-high, no cursor mutation). Porting a live consumer changes its numbers. Frozen values must keep old readers (G2 F4); unseen ones may switch with a revision bump.
- G5 says G1 was not yet an ancestor of HEAD; it now is. Its gate wording is stale only on that point.
- G6 F3: no live stream takes continuity, pass or life as input, so GA10 salts and time loops need an adapter, not a config flag.

### Top picks (proposal, ranked across lanes)

1. **Fix the shared hash and ordering basics** (G2 F1 plus SB37-SB45 items surrogate drop, falsy zero, cosmetic labels): small, removes bugs before more content keys spread. A5 owns the replay checks.
2. **Port P3 storylets onto the kit** (G1 example, G2 F3, G3 S3): a separate, still-unselected storylet migration, with game-time addresses, integer weights and quiet outcome kept. Gate: rebuilt fresh-origin desktop route at 1366x768 with Save/reload/literal Import keeping the next pick.
3. **Decide stream migration and scope** (C1, G2 F2, G6 CD1-CD4): one compatibility decision covering legacy roots, craft scope and life/continuity inputs.
4. **Odds plus why lens on the status window** (G5 S1): the first generation cheat, reading the same resolver snapshot as commit. Waits on pick 2.
5. **Table compiler on A2 tags with one Village material pool** (G3 S1): waits on A2's actual API.

Comic slices (G4 S1 Worm case desk first) and G6 address resolver stay
reachable but behind the canon-first order; they are not promoted here.

### Remaining gates

The Village mixture path is a bounded current `gen_kit` reader; its dated T3
report records that slice's delivery evidence. This does not establish broad
framework adoption or select wider generation horizons. The P3 storylet port stays
separate and unselected, with its own acceptance gate. Other native, persistence,
browser and director acceptance gates remain OPEN. Unresolved owner inputs: A2
tag API, A1 consolidation plan, A5 replay harness.

## GW5 causal commitment before observation, 2026-10-15

[Wider pass](gm/DIRECTION_DETAILS_REVIEW_2026-10-15.md#wider-gameplay-and-world-design-pass-2026-10-15)
identifies a **proposed contract clarification**, not a proved generator defect:
GR3's freeze-on-reveal and GR4/GR10's lazy/revisioned unseen detail must also respect
actual already-committed causes under OD7/OD8. Distinguish pinned canon/starting
facts, generated truth already consumed by an event/effect, and genuinely
uncommitted detail. Hidden is not automatically uncommitted. Preserve required
actor/resource/time/custody bindings before later reveal/promotion; fill only
uncommitted detail lazily within those constraints. No need to generate every
unseen person or simulate an entire universe in advance.

Learning/reinterpreting a cause changes knowledge, not automatically its past truth.
Actual illusion/fate/time powers may change their appropriate layers within scope.
For selected content, retain the relevant source/definition revision and causal
bindings through promotion and save/import; prove that consumer rather than launch
another generator framework. No generator/source/runtime change made here. Existing
GR rules and older source counts retain their original proposal/evidence status.

## Cross-audit clarification, 2026-10-18

GR7 and GR17 above are revised proposals under the requested reconciliation,
not newly accepted universal world laws. Historical GR7 described automatic
joining "every relevant table by being tagged"; historical GR17 named only the
in-game day/hour. The owning mechanism and clock now qualify those shortcuts.
See [G27/G30](reviews/SUBTLE_RULE_GAPS_2026-10-18.md#round-4-latest-audits-together-2026-10-18).
A world-time credit does not itself freeze a world. Current `computeAway` has
one positive elapsed rate; a dual-clock plan must name the missing integration.
