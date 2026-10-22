# Other procedural systems and general opportunities

Date: 2026-10-16. Weibao asked: "Other procedural thing to consider? Other things
the game could make use of in general?" ([USER_VISION](USER_VISION.md#other-procedural-systems-and-general-opportunities-2026-10-16)).
This is a palette, not a spec. No implementation is selected or dispatched.
The parallel consideration pass below evaluates all rows without changing build priorities.

**Current focus, 2026-10-16:** Weibao subsequently deprioritized NPC-heavy systems
and requested more focus on ruins and world/environment consideration.
[Accepted scope](USER_VISION.md#procedural-focus-ruins-and-world-first-2026-10-16).
The commissions-first rankings below are preserved history, not the current
recommendation. [Ruin/world consideration](gm/dispatch/procgen-2026-10-13/p11/DUNGEON_CONTENT.md#ruins-and-world-first-consideration-2026-10-16)
proposes site function and aftermath, useful resources, environmental obstacles,
discovery and persistent changes inside authored places/routes. The supporting
[world/site palette](gm/dispatch/procgen-2026-10-13/p11/WORLD_SITE_PALETTE_2026-10-16.md)
adds world types, discovery routes, useful finds/restoration and subtle interactions.
The [workshop and spring/grove journeys](gm/dispatch/procgen-2026-10-13/p11/WORKSHOP_AND_NATURAL_SITE_JOURNEYS_2026-10-16.md)
save the deeper concrete examples, preparation/making loops, partial outcomes and
world variants requested next.
The [library, temple, mine/cave and map expansion](gm/dispatch/procgen-2026-10-13/p11/LIBRARIES_TEMPLES_MINES_CAVES_AND_MAPS_2026-10-16.md)
preserves further site families, bought maps and related interactions. Requested
[standing site/exploration rules](SITE_AND_EXPLORATION_RULES.md) SR1–SR24 guide
future decisions. Specific mechanics remain proposals; no implementation is
authorized. Generated layouts stay deferred.

**PG1 deeper consideration:** [commissions, bounties and their consequences](gm/dispatch/procgen-2026-10-13/p11/REQUESTS_AND_MARKETS.md#deeper-commissions-and-bounties-consideration-2026-10-16)
expands real needs, buyer knowledge, crafting choices, funding, proof, reputation
and absence. Requested as design only; no implementation selected.

**Coverage note.** The [procedural status map](PROCEDURAL_GENERATION_STATUS_2026-10-13.md)
and [idea index](IDEA_INDEX.md) already own most topics: storylets, people, secrets,
lore, storyteller, rivals, cosmic events, genetics, resources and crafting. This
doc does not restate them. It focuses on two things:

- systems that reuse the patterns described by the [crafting engine](CRAFTING_ENGINE.md)
  and [making rules](MAKING_RULES.md), with source tests separate from playable proof;
- general tooling the game could add or extend.

A keyword scan across `docs/` was not informative, because almost every topic is
mentioned somewhere. Rows marked *(overlap likely)* should be folded into their
owner rather than built twice.

## The reusable pattern

The crafting work established a shape that fits most generators:

- **families** with integer ranges and correlations;
- **overlays** by tag (core, world, region, person);
- **freeze on reveal**;
- **three separate chance sources** (world truth, per-attempt execution, rare authored exceptions);
- **observer projection** for anything shown;
- **receipts** that explain why.

New procedural systems should use this shape (GR1-GR17, MR1-MR5, MR31) rather than
inventing a fresh draw or freeze. `generateMaterial` in `src/craft_materials.js` is
already a general "trait bundle from a family" generator. Extract it into a shared
helper only when a second real consumer arrives (AXR1, earn it twice).

## PG. Other procedural systems

| Code | System | What gets generated | Reader that makes it matter (GR12) | Notes |
|---|---|---|---|---|
| PG1 | Needs-driven commissions and bounties | Requests from actual NPC needs: a healer lacks a salve, a farmer has pests, a sect needs a pill | Crafting, harvesting, combat and reputation | The strongest reader for the crafting engine. No quest exists unless a real need does. |
| PG2 | Regional fauna and enemy variants | Creature families with ranges and correlations per region, like material families; habitats, behaviors, parts | Combat, harvesting (living donors) and drops | Canon creatures stay pinned (MR25). *(overlap likely: enemy systems research)* |
| PG3 | Markets and restock | Shop stock as regrowing source nodes; prices from scarcity, quality and the merchant's knowledge | Trading, crafting inputs and economy | Reuses `craft_sources.js` nodes; an expert's offer is a clue (SP12) |
| PG4 | Weather and seasons per world calendar | Daily weather and season state keyed by game day | Harvest gates, travel, mood and events | Shares WR9 calendar. *(overlap likely: P8 ecology, `weather.js`)* |
| PG5 | Rumors and news | Statements over fact IDs with a source and reliability; some are false | Leads to spots, people and events (RS11) | Text is grammar over facts (GR15); false rumors never change truth |
| PG6 | Disease and remedy | Illness families with routes, stages and resistances | Potions and body ledger (PD1), people simulation | Pairs naturally with potions; contagion spreads through real contacts |
| PG7 | Places inside canon nodes | Stalls, rooms, camps and benches with stock and occupancy | Services, harvesting and events | Fill layer only: never new canon landmarks |
| PG8 | Names and languages per culture | Name grammars shared by people, materials, potions and places | Every display | One naming owner (E6) instead of per-feature name lists |
| PG9 | In-world documents | Recipe notebooks, letters, notices and ledgers, frozen once written | Knowledge routes (WR5), clues and trade | Annotated copies carry provenance (PD12) |
| PG10 | Festivals and recurring events | Per-world calendar events with local variation | Markets, social and storylets | Era-bound in canon worlds (RS9) |
| PG11 | History layers and ruins | Past events that leave sites, artifacts and grudges | Exploration, resource spots and rivals | Respects causal commitment (GW5) |
| PG12 | Omens, dreams and visions | Signals tied to storyteller state and sealed secrets | Foreshadowing and cheats | Route-gated; never leaks a secret's truth |
| PG13 | Insignia and appearances | Faction marks and per-save looks for unknown items | Recognition without truth | `product_appearance_*` already does this for mixtures |
| PG14 | Titles and deeds | Titles generated from actual recorded deeds | Titles owner (E4) | Never awarded for things that did not happen |
| PG15 | Expedition layouts | Abstract node graphs (routes, rooms, hazards) rather than tile maps | Expeditions | Dungeon maps stay backburnered; graphs give most of the value |

## GN. Things the game could use in general

| Code | Tool or system | Why it helps |
|---|---|---|
| GN1 | **World atlas and generator inspector (dev)** | See canon anchors versus generated content, evidence labels and "why this?" receipts in one view. Sealed truth stays hidden outside dev. Extends crafting L4. |
| GN2 | **Content pack validator CLI** | Checks citations, exclusions, calendars and revisions for every pack before it loads. Extends crafting L5. |
| GN3 | **Headless balance simulator** | Runs the idle economy for N game days to find runaway loops, free duplication (MR5) and dead ends before players do |
| GN4 | **Replay and determinism harness** | Records commands and replays them to prove the same results (A5, MR34) |
| GN5 | **Named scenario saves** | Load a labelled test state in one step, with DEV SEEDED marking (UI rules) |
| GN6 | **Secret-safe save inspector** | Explains a save through the player's projection, useful for bug reports without spoilers |
| GN7 | **Player codex generated from knowledge** | Glossary, bestiary, herbarium and recipe book built from what the player has actually observed |
| GN8 | **While-you-were-away digest** | Summarizes idle results and stop reasons (builds on `away_ledger.js`) |
| GN9 | **Spoiler-free hints** | Points at reachable but unused mechanics without revealing truths |
| GN10 | **Localization pipeline** | Name and text grammars per locale (`locales/` exists) |
| GN11 | **Performance budgets** | Per-generator budgets (GR11) with a profiling check in tests |
| GN12 | **Data-only player packs** | Packs are pure data, so a later option could load user packs without running code. Validation (GN2) is the gate. |
| GN13 | **Branch and undo saves** | Builds on the [branch save research](research/PROFILE_AND_BRANCH_SAVE_SHAPE_2026-10-14.md) |

## Initial dispositions, superseded ranking retained

**ACCOUNT FOR NOW**

- **A1:** every new generator uses the reusable pattern above and the GR and MR rules. No fresh draw or freeze code.
- **A2:** rows marked as overlaps fold into their owner, not this doc.
- **A3:** weather, markets and calendars should share one world calendar context (WR9) and one source-node model.

**Historical proposal ranking, superseded by the ruin/world focus above**

1. PG1 needs-driven commissions, because they give crafting and harvesting a reason to exist in play.
2. PG3 market restock on source nodes.
3. GN1 plus GN2, the atlas and validator, so canon fidelity and generation stay checkable.
4. PG2 regional fauna on the family generator.
5. GN3, the headless balance simulator.

## Parallel consideration and deferral pass, 2026-10-16

**Historical review:** the later user direction above supersedes its PG1-first
ranking and integration order. Other constraints remain reference material;
they are not a requirement to build all support tools before exploring a ruin.

Weibao asked to consider each in parallel, noting that translation support can be
deferred. Two read-only investigations considered PG and GN independently; the
controlling pass reconciled dependencies and existing owners. These are proposals,
not accepted feature selections or authority to interrupt current playable work.

### Corrections to the palette's shorthand

- **F1 Existing foundations:** these are not all missing systems. Requests already
  reserve real NPC funds and transfer supplies in [story_requests.js](../src/story_requests.js).
  Pack validation, source replay tests, profiling and an adventure notebook also
  exist. Extend their owners around an actual consumer.
- **F2 Commitment:** freeze-on-reveal must not replace already committed hidden
  causes. [GW5](GENERATION_FOUNDATION_RULES_2026-10-14.md#gw5-causal-commitment-before-observation-2026-10-15)
  records this proposed clarification. Three chance categories are a useful
  separation where relevant, not a requirement to add three random draws to every
  system. Many titles, document contents and calendar events should follow facts.
- **F3 Restock:** renewable supply nodes are useful for some stock, but shipments,
  finite lots and owned merchandise cannot simply regrow. The
  [request/market owner](gm/dispatch/procgen-2026-10-13/p11/REQUESTS_AND_MARKETS.md)
  joins existing trader pricing to the
  [supply owner](gm/dispatch/procgen-2026-10-13/p8/TRADE_SUPPLY.md).
  Reconcile scarcity with existing saturation/haggling once; merchant knowledge
  can support a price clue only through information that merchant actually has.
- **F4 Layout scope:** abstract graphs are still layouts. The
  [dungeon owner](gm/dispatch/procgen-2026-10-13/p11/DUNGEON_CONTENT.md)
  defers procedural adjacency and proposes generated content on authored routes.
  A simpler representation does not by itself lift that deferral.

### PG dispositions

“Soon” means a candidate when a relevant slice is selected, not a new queue.
“Account now” means retain the constraint without building the full feature.

| Code | Proposed disposition | Smallest useful application and dependency |
|---|---|---|
| PG1 | First playable candidate | One real, reachable NPC need with funded terms, one harvested/crafted accepted product and exact delivery. Extend existing requests; reject stale needs and settle once. A bounty additionally needs a real target/problem and supported proof of resolution. |
| PG2 | Later, when combat/harvest needs variation | One regional creature family with a meaningful behavior or material yield. Preserve pinned canon creatures; names and stat reskins alone do not justify a generator. |
| PG3 | After or alongside the local PG1 loop | One merchant and supported supply source with finite stock, real refill cause and one quote calculation. A trade network is unnecessary. |
| PG4 | Account now; richer generation later | Use one world calendar context for existing season/hour gates. Add weather variation only with a harvest, travel or event consequence; reuse existing weather. |
| PG5 | Small lead soon; broad news later | One attributed rumor about a reachable source or need. Save who said/believed it separately from truth; investigate through supported routes. |
| PG6 | Later | One condition with a readable cause and useful remedy before generated disease families. Contagion/contact simulation is a separate expansion, not a potion prerequisite. |
| PG7 | Small local fill soon | One service stall or workbench inside an existing location, with owner, access and occupancy. No new canon landmark or general room generator. |
| PG8 | Account now | Stable identity separate from display name; reuse the E6 culture naming owner when a second consumer needs it. Cultural naming and GN10 translation are distinct. |
| PG9 | Small knowledge route soon | One recipe note or letter carrying the writer's knowledge and provenance, frozen when written. A document can be mistaken without changing world truth. |
| PG10 | Later | One world-calendar occasion with temporary local effects and an end condition, after those effects have real consumers. |
| PG11 | Later | One causally supported remnant in an existing site. Full simulated history is unnecessary; preserve prior commitments and canon boundaries. |
| PG12 | Later, route-specific | One qualified dream/omen route over permitted signals. Projection must cover wording, counts and timing; do not invent a universal prophecy generator. |
| PG13 | Reuse appearance handling; insignia later | Extend current unknown-product appearance handling for recognition. Generated faction marks wait for a recognition consumer; copying a mark does not grant authority. Appearance never identifies an unknown effect by accident. |
| PG14 | Account now; implement with a deed consumer | Read actual deed receipts through the titles owner. Powers, transfer and rewards remain world/cheat-dependent, rather than a universal bonus ladder. |
| PG15 | Generated layouts deferred | An authored node route may host varied content. Generated adjacency needs explicit selection plus connectivity, exit and recovery checks. |

### GN dispositions

| Code | Proposed disposition | Smallest useful application and dependency |
|---|---|---|
| GN1 | Small inspector soon; graphical atlas later | A table of one pack's anchors, generated sites, evidence and receipts. Default to safe projection; synthetic unsealed fixtures support truth debugging without revealing actual secrets to the director. |
| GN2 | Extend soon with the selected pack | CLI over [existing validators](../src/content_packs.js), adding relevant citations, exclusions, calendar and revision checks. Do not replace all pack schemas. Validation establishes structural admission, not sourced truth or gameplay. |
| GN3 | Bounded scenario soon | Run the selected craft/deliver/restock loop headlessly over game days; check stock/money conservation, shortages and unattended stopping. A universal economy simulator waits. |
| GN4 | Extend existing checks soon | Add the selected consumer to [determinism replay tests](../tests/determinism_replay.test.js), including save splits and stream isolation. Full UI command recording is later; these tests are SOURCE evidence. |
| GN5 | Use named fixtures soon | Reuse [field fixtures](../scripts/field_fixtures.mjs); label seed, build and content revision, with DEV SEEDED marking. Keep user saves private and untouched. |
| GN6 | Account now; inspector later | Build diagnostics from explicit projected fields, never raw save serialization followed by visual hiding. Add an export/view when shared projections support it. |
| GN7 | Small notebook extension soon | Show discovered herbs/products/methods in the [existing notebook](../src/adventure_notebook.js). Separate observation, inference and demonstrated method; a full codex can wait. |
| GN8 | With real routine settlement | Summarize actual completed work, costs and stop reasons under [OD4](DIRECTION_SUMMARY.md). [away_ledger.js](../src/away_ledger.js) is a calculator, not proof of a general integrated offline host. A digest does not authorize invented accrual or changed absence policy. |
| GN9 | Account now; general selector later | Offer a local hint from public eligibility and reachable actions. General hints wait for reliable knowledge/reachability data; undiscovered does not imply currently reachable. |
| GN10 | Defer translation pipeline | Keep stable IDs separate from display text and preserve grammar parameters now. No whole-project string extraction or multi-locale content requirement for current slices. |
| GN11 | Apply bounded checks now | Count draws, generated entities and output/save size for the selected generator; reuse profiling tools. Keep machine-dependent timing trends separate from deterministic limits. |
| GN12 | Defer player pack product | Keep content data-only with namespaces, revisions and bounded validation. Public loading, compatibility UI and distribution wait for GN2 and a proven authored-pack path. Data-only content still needs admission checks. |
| GN13 | Defer branch and undo implementation | Follow the [profile/branch research](research/PROFILE_AND_BRANCH_SAVE_SHAPE_2026-10-14.md). Branch creation and action undo are separate; define ownership, active clocks, knowledge, committed chance and pending paid jobs before offering either. |

### Proposed integration order

1. **P1:** after the current slice, consider one needs-driven crafting journey:
   real need → obtain ingredients → make a useful product → deliver → remembered
   consequence. A real need need not always yield a public commission; the issuer
   must have a reason and supported means to ask.
2. **P2:** attach only the validator, replay case, named fixture and bounded
   performance/balance checks needed to verify that journey. Add a small inspector
   if a concrete generation question needs it.
3. **P3:** extend to one merchant or one rumor/document discovery route where it
   makes that same journey richer. Do not make all PG/GN rows prerequisites.

**Verification of this consideration pass:** read-only owner/source inspection and
two parallel reviews, followed by reconciliation. No runtime change, build,
gameplay test, source test execution, commit or push. The crafting engine's live
wiring and rebuilt desktop/persistence gates remain open in [its owner](CRAFTING_ENGINE.md).

## Core-rule reconciliation, 2026-10-18

AD33/SR4 still prioritize authored ruins/world/environment work; NPC-heavy
commissions and generated layouts are not prerequisites. For the selected site
slice, a discovered route, access, custody and the means to act stay separate
(SR5/SR8/SR15/SR19). An unknown hazard still acts (MR1), but warnings, route
badges and recap reveal only known facts (AR8). Withdrawal retains real changed
site state and spent supplies; renewal names its cause and clock (SR14/SR20/SR21,
G26–G28). One useful find → preparation/use → persistent aftermath is the proof,
not a count of generated sites. No new site implementation is selected.

## More-to-consider round, engine modularity and procedural gaps, 2026-10-22

Read-only pass over `check:arch`, the AR rules, this palette and the generation
code. No runtime change, build or test run. Proposals, not accepted decisions.

**Evidence.** `gen_kit.js`, `seeded_streams.js` and `hash_rng.js` exist, with
tests, and `gen_kit` is imported by about 15 `src` modules (craft, check, mixture,
world_pack). Its header still says "Proposal". `tests/determinism_replay.test.js`,
`replay_harness.test.js`, `scripts/field_fixtures.mjs` and `scripts/simfuzz` exist.
Nothing in `src` or `scripts` generates sites, fauna, markets or weather variety
beyond the crafting families. Cycles: 226 grandfathered edges.

**ACCOUNT FOR NOW**
- Header drift: `gen_kit.js` says "Proposal" but has many consumers. Treat it as
  the live generation seam (AR2/AR11) and update the header when next touched.
- Distribution checks: the generators have determinism tests but no
  many-seed tail/degenerate check. Add one per generator with its first real
  reader (GN11, games lens).
- Content versioning: saves that store only a seed break when a generator
  changes. Address generated output by world/life/table revision (already the
  gen_kit rule) and record the migration or compatibility decision (AR6).

**LATER / DELEGATE**
- GN1 small inspector and GN3 bounded headless balance run, attached to the
  selected P1 journey only (level: sonnet, effort: medium, done check: one
  scenario saved as a named fixture).
- PG2 regional fauna as the second proof of the generation seam (AR11): needs a
  reader (combat or harvest) before any generator.
- PG15 expedition node graphs over authored routes, after SR4 site work.

## Crafting-journey lanes S1/S2/S3, gaps saved 2026-10-22

Weibao asked for the crafting journey as a potion, an armor and a Harry Potter potion
and then to save the gaps. Three lanes built them in separate worktrees; nothing is
merged, committed or pushed. These are lane reports, not combined-build evidence.
Gaps below are proposals, not authorized work. Lane records (in their branches):
S1 `claude/s1-potion-journey-bdb6a0` `docs/gm/dispatch/potion-journey-2026-10-22/TASK.md`;
S2 `claude/s2-armor-journey-29349a` `docs/gm/dispatch/armor-cold-journey-2026-10-22/TASK.md`;
S3 `claude/s3-hp-potion-b624c8` `docs/gm/dispatch/hp-polyjuice-2026-10-22/MORE_TO_CONSIDER_ROUND1.md`
(C1-C4 constraints, L1-L8 later rows; not copied here).

**ACCOUNT FOR NOW**
- G1 (all): lane evidence is per-worktree. A merged build needs the full gates plus a
  combined browser journey; recheck `check:arch` after merge.
- G2 (S1): `frontier.brew` moved to revision 2, so old products fail law-ref validation.
  Allowed by the 2026-10-17 reset/drop decision; the AR6 record lives in S1's TASK.md and
  should be restated in PROJECT.md when the lane merges.
- G3 (S1, S3): two craft carriers. S3 keeps its own purse and lots outside Inventory and
  money. Move them onto `craft_product_registry` after S1 merges (S3 C3, MR29), not a
  second inventory.
- G4 (S3): the Polyjuice transformation has no reader (MR32) and the recipe panel shows
  all slots with no knowledge route (AD6, MR10). Until fixed, call it a craft proof with a
  recipe-known start condition.

**LATER / DELEGATE**
- G5 (S1): a `Toxin binding` ward against new poison needs a hook in the native
  effect-apply path. Today it only shortens existing poison. Sonnet, small to medium;
  done check: a ward blocks a fresh poison and survives Save/reload/Import.
- G6 (S1): the browser run used a DEV SEEDED venom. Add a venom met in play.
- G7 (S2): 1366 width untested; hazard uses smoothed temperature while the display adds the
  pacing offset (small mismatch); the need's discovery and balance are unaccepted proposals;
  Export used `window.save_to_file`, not the button.
- G8 (S3): staged additions, glass-reaction cue, donor-presence consent, clothes misfit,
  diversion route, dev-only truth inspector (L1-L8 in the S3 round).
- G9 (all): human play acceptance for all three journeys is open.
