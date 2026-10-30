# World absorption rules

Weibao, 2026-10-17: "create a set of rules to absorb worlds accordingly? Or
expand what we have? Code to implement rules? More to consider?" This followed
the recommendation to turn each book into data that a shared engine reads,
instead of hand-coding every world.

Answer: both. This rulebook is new because no existing owner covers the step
from a read source to playable data. It composes the existing owners rather
than restating them:

| Owner | What it keeps | Used here as |
| --- | --- | --- |
| [Source deep dive playbook](research/SOURCE_DEEP_DIVE_PLAYBOOK.md) | How to read a source once and save evidence | Stage 1 |
| [World core kit](worlds/WORLD_CORE_KIT_2026-10-14.md) K1–K24 | What a world needs, floor and deep | The parts every record sorts into |
| [Completion standard](WORLD_COMPLETION_STANDARD.md) S00–S14 | Detail ledger, joins, evidence states | Acceptance and ledger shape |
| [Generation rules](GENERATION_FOUNDATION_RULES_2026-10-14.md) GR1–GR17 | Generator contract | Stage 4 gap filling |
| [Architecture rules](ARCHITECTURE_RULES.md) AR1–AR16 | Runtime seams, saves, proof | Landing and proof |
| [Rulebook](RULES_FROM_SCRATCH.md#the-rulebook-accepted-2026-10-10) 2–3, AD1–AD5 | Worlds set their own rules | Authority for world law |

Status: accepted 2026-10-18 as standing defaults (Weibao: "accept based on base
and existing rules"; no conflict with Rulebook 1–12 or AD1–AD38). Agents use the
WA rules to absorb a world once a world is selected. They do not
select a world, accept lore, or authorize implementation of any world's slice.
WA22-WA24 were added and accepted 2026-10-27 (Weibao: "Yes", answering whether
the presence ladder, dated whereabouts and forward anchors should become standing rules;
source: [round 4](#more-to-consider-round-4-everything-the-book-mentions-lead-first-2026-10-27)).

## The pipeline

Read, sort, encode, fill gaps, prove. Reuse the source ledger and its locators
across stages; reopen consequential, conflicting or changed claims at their
locators under WPR2/WPR19. This avoids redundant whole-book reads without
turning a saved extraction into unquestionable source authority.

1. **Read.** Deep dive playbook. Output: a private fact ledger with locators.
2. **Sort.** Every fact lands in a kit part (K1–K24) as a pack record.
3. **Encode.** Laws become rule modules or engine facts; things become tagged
   records; the world's loop names the shared verbs it uses.
4. **Fill gaps.** Generators produce what the book never named, under that
   world's laws, labelled as generated.
5. **Prove.** Lint the pack, then play the world's signature loop in a rebuilt
   browser with save, reload and import.

## Rules (WA)

Each rule is a default with a dial and a reason. A world may propose an
exception and must say why.

### Shape

| Code | Rule | Dial | Mistake it prevents |
| --- | --- | --- | --- |
| WA1 | **A world lands as a pack: data plus rule modules over shared verbs.** New code is written only for a verb no world has yet, and that verb joins the shared engine. | A world whose signature mechanic is truly unique keeps a local domain module (AR12); the pack names it | Six bespoke files per world (`book_world_mol_*`), so world N+1 costs as much as world 1 |
| WA2 | **The pack cites, it does not quote.** Records carry fact IDs, locators and short paraphrase. Raw text and full tables stay in the private ledger (AD35). | Direct recreations stay in the private pack (AD1) | Copyrighted prose in commits; packs that need the book to be understood |
| WA3 | **Every fact and record carries a canon status:** source, supplement, inferred, authored, generated or fan. Source, supplement and fan cite a locator or a cited fact. | Status can be upgraded only by new evidence, never by repetition | Agent guesses passing as canon; fanfiction filling book gaps silently |
| WA4 | **A law is a rule, not a sentence.** Each world law names a rule module or engine fact and gives the player-readable reason it blocks or permits. Prose-only laws do not count toward K2. | A law can stay prose while it is texture (T1) | "Magic costs mana" written in a brief and enforced nowhere |
| WA5 | **The engine owns verbs; the world owns nouns, numbers and laws.** Study, craft, fight, trade, travel, learn and appraise are shared. A world changes what they cost, need and produce. | A world can retire a shared verb (no trade in a world without exchange) with an in-world reason | Each world reinventing crafting; fixes that help one world only |
| WA6 | **Floor before deep.** K2 laws, K3 power, K6 cast, K8 daily life and K13 signature loop reach their floor before any other part goes past T2. The pack declares a tier per part. | A slice focused on one part may push it deeper first if the slice brief says why | Deep item tables in a world nobody can live in yet |

### Gaps and truth

| Code | Rule | Dial | Mistake it prevents |
| --- | --- | --- | --- |
| WA7 | **Gaps are generated under the world's own laws.** Generated records name their generator; generators follow GR1–GR17, name their table as `id@rev` and the action that reads them. Generated output never claims source truth. | A world can forbid generation in a part (a fixed canon cast) | Canon contaminated by procedural filler; write-only generators |
| WA8 | **Unknown stays unknown.** An unresolved source detail is recorded as an open question, not filled as canon and not treated as forbidden. | An authored answer can fill it, labelled authored, with the question kept | Silent gap fills that later contradict the book |
| WA9 | **Stable namespaced IDs.** Every ID sits in the world namespace. Released IDs never get renamed; content changes bump revisions. | An existing world keeps its released prefix (`book.mol.`) | Saves breaking when a list is reordered or a name is fixed |
| WA10 | **Pin the source and the pack.** A pack names its source snapshot and represented boundary, and carries `id@revision`. Saves record the pack revision they used. | A pack may cover several editions if each record says which | Patch day quietly rewriting a save's past (GR10) |
| WA11 | **Secrets are sealed in the pack too.** A sealed record's public fields hold only ID, discovery route and status; the truth lives in a sealed owner. | Public franchise twists are not sealed | A pack file or inspector spoiling the world for Weibao |
| WA12 | **Truth and knowledge are separate records.** The pack holds world truth; what a start knows is its own list per start (AD6, AD7). | A foreknowledge start (reader, regressor) lists what it knows and how sure | Every character knowing the whole pack |

### Crossing and time

| Code | Rule | Dial | Mistake it prevents |
| --- | --- | --- | --- |
| WA13 | **Starts are coherent packages** with body, means, debts, access and knowledge (K4, AD23). | Specific starts depend on means | Random bags of traits that cannot do anything on day one |
| WA14 | **Carry is declared per edge.** What crosses in, what is suppressed and how locals read an outlier are records (K15, Rulebook 5). | A world can suppress or amplify any import with an in-world reason | Imported powers working everywhere by default |
| WA15 | **Canon events are causal.** Each event lists its preconditions; averting a cause can avert it (AD2). | Authored plot versus simulation varies by world and mode | Forced plot, or plot that ignores what the player did |

### Proof and process

| Code | Rule | Dial | Mistake it prevents |
| --- | --- | --- | --- |
| WA16 | **Declare budgets.** A pack states its record ceiling; each generator states entity and daily draw budgets (GR11). | Budgets rise with demonstrated need | Idle catch-up generating ten thousand people |
| WA17 | **Converting a hand-coded world is a structural move.** It changes no gameplay and is proved by the same journey before and after (AR9). | Behavior changes follow in a separate change | A "cleanup" that quietly changes Cyoria |
| WA18 | **Continuity is a label, not a fork.** Canon, divergent, AU, fan and original continuities share one pack shape and differ by records and status. | AU overlays add, remove or reweight records instead of copying the pack (GR8) | Seven forked copies of one world drifting apart |
| WA19 | **Lint passing means "pack valid", not "absorbed".** Absorbed means the signature loop was played in a rebuilt browser with save, reload and import (AR10). | None | Clean data reported as gameplay |
| WA20 | **A second, different world proves the format.** Revise the format after it absorbs a world unlike the pilot (AR11). | The format may change freely before that second world ships | A format shaped by one world that every later world works around |
| WA21 | **A pack is plain data.** It survives a JSON round trip and hashes to a fingerprint that saves can record next to `id@revision` (added round 2). | A JS builder may assemble a pack (the Cyoria pilot does), but its output must be plain data | Functions hidden in content; a changed pack under an unchanged revision |

### Census and off-page entities (accepted 2026-10-27)

| Code | Rule | Dial | Mistake it prevents |
| --- | --- | --- | --- |
| WA22 | **Every mention gets a rung.** Each entity the source mentions sits on the presence ladder: M0 mentioned, M1 placed (an address that resolves to a place or plane, an era window and an evidence status), M2 shallow runtime, M3 lead-touched, M4 world- or seat-complete. The source pass brings every mention to M1. | How far M2 reaches per world; an entity the source never locates stays M0 with the question kept (WA8) | "They exist somewhere" as a promise nothing can read; characters lost between passes |
| WA23 | **Whereabouts are dated.** An address is a list of rows with era windows and evidence status, never one overwritten field. A rumor gives a `claimed` address. | A world without dates uses source order as the window | A person found in the wrong city for the year; rumor treated as fact |
| WA24 | **Forward anchors bind filling.** Anything generated or authored for an entity between its canon mentions must not contradict its later canon mentions. Player-caused divergence (WA15) may change them and is labelled; generator-caused divergence may not. | A divergent or AU continuity (WA18) declares which anchors it drops | Early filler that kills, moves or marries someone the book still needs |

### Lead runs, actions, loops and reading (WA25-WA41 accepted 2026-10-27 as adjustable working direction; WA42-WA47 proposed)

WA25-WA41 were accepted 2026-10-27 as adjustable working direction by Weibao's adoption instruction ([record](USER_VISION.md#adopt-this-sessions-proposals-as-adjustable-working-direction-2026-10-27), [register 5b](gm/WRITEUP_REGISTER.md#5b-adoption-2026-10-27)); a later dated entry may change them, and earlier wording stays as history. WA42-WA47 remain agent proposals. Evidence: [protagonist-life plan rounds 5 and 6](gm/dispatch/protagonist-life-2026-10-27/PLAN.md#13-round-5-measured-reading-time-precision-read-ahead-and-the-lead-play-flow-2026-10-27),
six measured haiku reads of LOTM volume 1 chapters 1-15.

| Code | Rule | Dial | Mistake it prevents |
| --- | --- | --- | --- |
| WA25 | **Every action is classed.** Each step the lead takes, each untaken option and each background routine names a shared verb class (study, practice, research, craft, trade, work, travel, fight, socialize, rest, care, appraise, ritual, other) plus the world's nouns, inputs, time, outputs, gains, requirements and an evidence label (WA5). | `other` is allowed with a reason; a world may add a class only through the shared engine (WA1) | Free-form verbs ("pocket", "rotate") that no engine system can run |
| WA26 | **Loops are extracted per source.** Anything the lead does more than once or as a stated habit becomes a loop record: trigger, steps (classes), rewards, rhythm (schedule, deadline or opportunity), the YAIRPG owner that runs it, or `gap`. | Repeat threshold per world (default: twice, or once if stated as a habit) | A world that is a chain of plot beats with nothing to do between them (DWF99) |
| WA27 | **Progression comes from loops.** Every skill, knowledge, rank, standing or advancement gain is mapped to the loop or the beat that produced it; a beat grants only what the text shows it granting. | A world may grant by beat when the source does, with the locator | Power that arrives on a plot date instead of through play |
| WA28 | **Untaken options stay possible.** Each named or plausible option the lead did not take is recorded with its needs and kept at a lower rung (WA22): a stub action with cost, requirement and a plain result, or a gap row naming what is missing. | Depth per world; options that need a mechanism the engine lacks wait as `blocked by mechanism` | A world where only the book's path exists, so deviating hits a wall |
| WA29 | **Time precision follows the clock.** Minutes are recorded only where they change play: an overlap with another life, a deadline, opening hours, transit, a bell or an appointment. Elsewhere a band or a day is enough. | Per world; a world built on exact timing raises the default | Spending reading effort on minutes nothing reads, or missing the ones that matter |
| WA30 | **Reading shards are measured and gated.** A reader takes about 2-3 chapters (8,000-11,500 source characters for Chinese text), split at a scene boundary, works in four tool calls or fewer, runs the lint itself before returning, and the coordinator opens at least five locators and every claimed source conflict before folding (WPR18-WPR19). | Shard size moves with measured cost and error per run | One-chapter shards that pay the fixed overhead each time; unlinted returns; reader misreadings folded as canon |
| WA31 | **Read-ahead ledgers carry their freshness.** Each shard's files record schema version, reader model, source hash, date, lint result and audit grade. An implementor uses a shard only if its grade passes, converts minor schema versions by script, and rereads only on a major version change or a failed audit. | Grade threshold per world | Advance reading that later work cannot trust or cannot tell is stale |
| WA32 | **Book conflicts are recorded by outcome, not choreography.** A canon fight, chase, standoff, questioning or contest records sides, stakes, means, terrain, the stated outcome as an assertion (CBR2) and the unseen parts as fills; the engine resolves it with its own model, and any route that reaches the outcome counts. | A world may pin a route when the source makes the route itself the point. Applied 2026-10-28 (Weibao): the protagonist's own run pins the book's route and holds the canon result while its inputs match; untaken options are recorded per WA28, locked in the forced canon run and playable in a later open run ([LSD61-LSD70, LSD103-LSD125](gm/dispatch/protagonist-life-2026-10-27/LEAD_LIFE_SYSTEMS_DESIGN.md#12-canon-results-in-the-leads-run-reconciled-weibao-2026-10-28)) | Scripted cutscenes that a player cannot change or reach another way |
| WA33 | **Prose becomes stats by band and calibration.** Each strength, skill, rank, wealth, influence or knowledge claim becomes a band in the world's own scale (WAC23) with its evidence label; stated outcomes are calibration targets, and when the bands fail to reproduce them, the bands change, not the book. Qualities no mechanic reads stay qualitative. | Band width per world; calibration sample size per test | Numbers invented from impressions that contradict the book's own results |
| WA34 | **Allies are lives with ledgers.** Allies, contacts, organizations and enemies are NPC lives with trust, a favour and obligation ledger, shared goals and leaving conditions from their motives; party membership is a temporary state, not a kind of person. | How many lives get full ledgers per world (AD33 sequencing) | Companions who exist only inside a party screen, or loyalty on a timer |
| WA35 | **Each codified fact is faithful, approximate or open.** Stated outcomes, prices, dates and rules are faithful (asserted); the mechanisms behind them are approximate (banded, dialed); what the book leaves unsettled stays open (WA8). Claims keep their speaker (WA23) and contradictions keep both readings (WPR20). | Which facts a world treats as faithful when sources disagree | Over-fitting every detail as law, or loosening stated facts to make a system convenient |
| WA36 | **Environment is sourced, keyed facts.** Weather, season, light, crowding, noise, district character, interiors and routes are records keyed by place and day; stated values override generated ones; each changes play only through a stated mechanism (exposure, travel time, hours, risk, visibility). | Which aspects a world models; the shared rain cycle is a fallback, not a world's weather | Flat weather modifiers; generated weather contradicting a stated storm |
| WA37 | **Every event has a kind and a key.** Scheduled events come from calendar records, reactive events from the action that caused them, ambient events from keyed draws by place and day, canon beats from beat records with footprints; all repeat on replay and obey forward anchors (WA24). | Ambient density per world | Replays that drift; a random incident removing someone the book still needs |
| WA38 | **Fills are layered, replaceable and calibrated.** Each unstated fact names its layer (stated, implied, period, invented), its basis and `replaceableBy`; a later stated fact supersedes it without reusing its id; unnamed people get stable ids from place and role; stated amounts must reconcile by arithmetic and calibrate generated prices and wages. | How far invention goes per world | Merchants and prices that silently become canon, or a purse that cannot add up |
| WA39 | **Talks change facts.** Every interaction yields typed results (information, price, trust, access); book-shown talks keep their results with our own wording; extrapolated talks follow the speaker's stated manner. | Which talk types a world supports | Conversations that are only prose and change nothing |
| WA40 | **Held state has a canon layer, a seeded layer and player deltas.** Inventory, purse, clothing, documents, home contents and similar states keep the book's dated facts as assertions, fill the rest by keyed draws with stable ids that never exceed stated amounts or introduce later canon items, and apply the player's changes as deltas over both; each canon date checks the result. | Which states a world layers | Generated clutter overwriting what the book says the lead had, or a purse that holds more than the text allows |
| WA41 | **Extract what a consumer will read.** Beyond beats and facts, readers take voice, idiom, units, customs, procedures, technology, routes, notices, rumors, tone, open questions and hooks only when a named consumer reads that field within one milestone; foreshadowing stays sealed by ID. | Per-world extras list | Schemas that grow fields nobody reads, raising the cost of every shard |
| WA42 | **Relationships are designed from the book's choices.** For each choice a person makes in the source, record the motives, needs, information, obligations and circumstances behind it; store that state; resolve decisions by utility from state plus a seeded roll with the reasons shown; calibrate so the state reproduces the book's choice on its date, and change the state, not the book, when it does not. | How many choices per person are calibrated | Meters that drive behavior no one can explain, or characters who act against the book for no stored reason |
| WA43 | **People carry detail by tier.** Principal, recurring, role and crowd tiers carry progressively fewer relationship and life fields; people move between tiers by play and presence rungs (WA22). | Tier assignment per world | Over-modelling every passer-by, or principals as thin as a crowd |
| WA44 | **Every pilot hands its measurements forward.** A world pilot records cost per chapter and per row, lint failure and recall rates, reader error rate found by checks, and the share of buildable untaken options, and hands the next world its schemas, lint, id registry, loop library and calibration harness. | Which metrics a world adds | Each new world rediscovering the same costs and mistakes |
| WA45 | **Systems that drive a person's choices are designed top down and calibrated.** Money, household, knowledge, law, danger and later systems start from what the source shows people choosing, store the state that makes each choice natural, resolve by utility plus a seeded roll with reasons, and pass a shared calibration test (the book's option wins in most seeded runs, and flipping the input the text names flips the choice). | Pass threshold and run count per world | Systems built bottom up from meters that cannot reproduce the book's own people |
| WA46 | **Recurring roles are archetypes implemented once.** Merchants, brewers, landladies, clerks, guards, healers, teachers, brokers, couriers, informants, crafters, household members and similar roles share one definition each (services, stock or recipes, schedule, relationship hooks, decision profile, talk slots, price rules, failures, keyed variation, canon overrides, fill markers, UI contract, tests); named canon people are instances with overrides, unnamed ones are keyed draws, and every archetype and instance passes one conformance test. | Which archetypes a world uses; per-world field values | Every shopkeeper written as new code, drifting apart and costing a lane each |
| WA47 | **One recipe shape for every made thing.** Potions, brews, crafts and invented recipes use the same fields (inputs as role slots, process steps and time, skill check, failure by mechanism, quality, effects by the world's law, secrecy per actor, source) on the shared recipe grammar and process envelope. | A world's laws decide effects and failure kinds | A separate brewing system per world that cannot share tools or tests |
| WA48 | **Seams are shaped on the whole source.** Before a lane fixes the data shape of a seam (rites, potions, crafts, schedules, hours, abilities, stats or any record type), it samples rows of that kind from across the whole read source, not only the slice it is building (default: about 20 rows spread over every later volume or arc), and records which fields, step kinds or value ranges the slice lacks. The shape holds them; the lane authors only the slice's own data. Accepted 2026-10-30 (Weibao: "write ... somewhere for future books too since that is something important to consider", [record](USER_VISION.md#whole-book-seams-gap-register-and-character-records-2026-10-30)). | Sample size per world; a source not yet read beyond the slice uses the deep-dive synthesis or wiki as the sample, labelled `I`; a one-volume source needs no sample | A volume 1 schema that later volumes force into a rewrite, or per-volume duplicate seams (AD45 allows the refactor; this avoids paying for it) |
| WA49 | **Whole-source gap register before slices.** Once a source is read and merged, a coarse pass groups its rows into mechanism families and labels each one *has seam, content gap*, *mechanism gap* or *outside the seat*, with the volumes and counts behind it, ordered by the lead's path (next place, next rungs, first long journey). Results are rows in the existing gap register ([reading gap map](research/READING_GAP_MAP_2026-10-28.md), GM codes), not a new register. Family names describe mechanisms, never plot; changed truths stay sealed by ID. Across books, a family-by-book table marks seams two or more worlds need, which is the case for making a feature world-neutral. Proposed 2026-10-30 ([wave plan WB2-WB8](gm/dispatch/sonnet-wave-2026-10-30/PLAN.md#whole-book-gaps-pass-more-to-consider-round-1-2026-10-30-0130)). | Family grain and ordering per world; row-level ledgers (`coverage_ledger.mjs`) stay for the slice being absorbed | Gap workers facing a row list that reads 100% missing, or features shaped by whichever book was read first |
| WA50 | **Every person has a dated character record, deep by tier.** A person's record joins what the source states about them into one time-indexed sheet: identities and personas, affiliation and rank, power path and level, abilities with conditions, costs and limits, stat bands calibrated to stated outcomes (WA33), skills, held items and money (WA40), routines and whereabouts (WA23), relations, attitudes and motives (WA42), knowledge with dates, and condition. Each field keeps its evidence label and locator and is valid from a date or chapter, so the sheet can be read "as of" any point. Depth follows tier (WA43): principals get the full sheet across the source, recurring people get bands, identity and routine, crowd people are derived on demand. Actual capability, what the person shows and what observers believe stay separate ([hidden strength](CHARACTERS_AND_WORLD_EVENTS.md#hidden-strength-combat-profiles-and-threat-estimates-2026-10-02)). Sheets live in the private pack; identity reveals and sealed truths are fields gated by their discovery route. Proposed 2026-10-30 (Weibao asked to digitize each character, "stats wise, ability wise and everything"). | Fields and tier cut-offs per world; bands use the world's own scale | Abilities and stats scattered over rule rows nobody joins; a principal whose power is the same in volume 1 and volume 6; spoilers shown through a sheet |

Accepted 2026-10-27 (WA25-WA41): see the status line above. Earlier "to accept" wording for WA25-WA31, WA32-WA35, WA36-WA39 and WA40-WA41 is settled by that adoption.

To accept WA42-WA47: Weibao's "yes to WA42-WA47". To accept WA49-WA50: "yes to WA49-WA50".

## Code that enforces it

[`src/world_pack.js`](../src/world_pack.js) is a pure lint and coverage read
model. It owns no state, save slice, tick or UI, and adds nothing to `main.js`.

- `lintWorldPack(pack, {registry, facts})` returns every issue at once, each
  tagged with its WA code. It checks namespaces and duplicates (WA9), canon
  status and locators (WA3), prose-only laws and law reasons (WA4), law modules
  through the shared `validateRuleModule` (WA4), generator table, reader and
  budget (WA7, WA16), generated records claiming source truth (WA7), sealed
  fields and opaque sealed IDs (WA11), causal event preconditions (WA15), carry
  records (WA14), tiers that claim depth without records (WA6), summary length
  (WA2), fan content in a canon continuity (WA18), confidence labels (WA3),
  plain data (WA21) and, given `engineFacts`, laws that name a fact nothing
  reads (WA4).
- `worldPackFingerprint(pack)` returns `id@revision#hash` for saves and receipts.
- `worldPackCoverage(pack)` reports records per kit part, declared tiers,
  canon mix, laws encoded as rules, unknowns and whether the WA6 core floor is
  met.

[`src/world_pack_mol.js`](../src/world_pack_mol.js) is the pilot. It derives a
pack read-only from the existing Cyoria content. It lints clean and shows two
real gaps: K2 laws (two of Cyoria's laws are engine facts, the rest are prose
in briefs and bespoke commands) and K8 daily life (jobs, meals and prices exist
as commands but are not yet pack records). The lint also caught one real
overlap: `book.mol.formula_operator` is both a technique source and a power.

Tests: [`tests/world_pack.test.js`](../tests/world_pack.test.js).

Status: engine ready. The Cyoria runtime now installs from the bundled `book.mol`
pack (P2, 2026-10-19; see [Round 3 outcome](#p2-outcome-2026-10-19)); no other world
does yet (AR10).

## More to consider, round 1 (2026-10-17)

### ACT NOW (done)

- **WAC1 Duplicate ID across sources and powers.** Pilot lint found it. Handled
  in the adapter with one record per ID; the runtime sharing is left as is.
- **WAC2 Namespace dial.** Cyoria's released IDs use `book.mol.`, not its world
  ID. WA9 gained the released-prefix dial instead of renaming released IDs.

### ACCOUNT FOR NOW

- **WAC3 Two kinds of "rule".** `rule_modules.js` is built around the village
  mix resolver (one parameter target, a small fact set). World laws mostly need
  gates and observations, which it already supports; parameter laws for other
  targets need the resolver to grow before packs can use them. Packs should
  prefer engine-fact laws until then.
- **WAC4 Loader shape.** When a runtime reads packs, it lands through the domain
  registry (AR2) as one domain that installs records into existing owners
  (people, items, powers). It must not become a second truth store (AR3).
- **WAC5 Save identity.** A save that used Cyoria before packs has no pack
  revision. Old-save compatibility is deferred for now
  ([2026-10-17](USER_VISION.md#old-save-compatibility-deferred-2026-10-17)), so
  the loader may reset such state and say so; new pack refs still survive save,
  reload, Export and Import.
- **WAC6 Inspector only after a consumer.** Coverage is a read model for an
  author inspector. Building the panel waits for the loader, since it would
  otherwise report on data nothing plays.
- **WAC7 Tiers are claims.** Declared tiers are author claims; they should later
  be checked against evidence (a T4 loop needs a recorded journey), not trusted.

### LATER / DELEGATE

| Code | Item | Level, effort | Done check |
| --- | --- | --- | --- |
| WAC8 | Cyoria conversion: install people, items and techniques from the pack instead of `book_world_mol_content.js` | Strong coder, one focused session, structural only (WA17) | Same rebuilt journey before and after, save/reload/import identical |
| WAC9 | Encode Cyoria's remaining K2 laws (5–10) as engine facts or gate modules | Designer plus coder, small | Pilot coverage shows K2 at T2 with laws as rules |
| WAC10 | Map K8 jobs, meals and prices into pack records | Coder, small | Coverage K8 at floor |
| WAC11 | Second world through the format, contrasting with Cyoria (LOTM pathways or Worm powers) | Coordinator plus readers under AU13 | Pack lints clean; format changes recorded here (WA20) |
| WAC12 | Ledger to pack scaffolder: turn a deep dive's fact ledger into draft records with status and locators | Coder, medium | A saved ledger produces a pack that lints with only WA4 law gaps |
| WAC13 | Evidence-checked tiers: tie a declared tier to a recorded journey ID | Coder, small, after WAC8 | Lint flags a T4 claim with no journey |

## More to consider, round 2 (2026-10-17)

### ACT NOW (done)

- **WAC14 Sealed IDs leaked truth.** IDs are public, so `secret.king_is_a_dragon`
  spoils its own secret. WA11 now requires an opaque ending such as `.s2`,
  matching the S2-style references in AGENTS.
- **WAC15 Fan content in canon.** Nothing stopped a fan fact or record inside a
  canon continuity. Lint now refuses it (WA18).
- **WAC16 Confidence was free text.** It now uses the research lens labels
  (shown, stated, inferred) plus `translated` for unverified or machine
  translated sources, the (U) mark in the entry matrix.
- **WAC17 Code could hide in a pack.** New WA21: packs must be plain JSON data.
- **WAC18 Laws could name facts nothing reads.** Given `engineFacts`, lint
  flags them. The pilot test now collects the facts Cyoria's definitions
  actually read and confirms both pilot laws point at real ones.
- **WAC19 No content identity.** `worldPackFingerprint` hashes the pack
  through the shared `gen_kit` address, so a missed revision bump shows up.
  The first test run caught a real formatting bug in it (`hash64` returns two
  halves, not a string), fixed before saving.

### ACCOUNT FOR NOW

- **WAC20 One ledger, not two.** The completion standard already keeps a
  detail ledger (Frontier's `COMPLETION_LEDGER.json`). Pack records hold the
  content; ledger rows track evidence and cite pack record IDs. Neither copies
  the other (AD7).
- **WAC21 Law reasons are truth.** AD3 starts a world's special rules hidden. A
  law's `reason` is author truth; what the player sees goes through the
  projection (AR8). Before discovery the player gets a plain grounded result
  ("the lamp stays dark"), not the law text.
- **WAC22 Build-time versus run-time generation.** `generated` records in a
  pack were produced by an author run and reviewed. Run-time output freezes into
  the save on reveal (GR3) and never writes back into the pack.
- **WAC23 Local units only.** Packs keep their own units (mana, crowns,
  ratings). There is no universal power scale; conversion happens only at
  crossing edges through carry records (AD27, AD28, WA14).
- **WAC24 Private packs.** Direct recreations (AD1) live in a gitignored pack
  path. A committed pack paraphrases; lint cannot see file location, so the
  task record states which kind it is.

### LATER / DELEGATE

| Code | Item | Level, effort | Done check |
| --- | --- | --- | --- |
| WAC25 | Serials and retcons: facts gain `supersededBy`; a source update bumps the pack and lists contradicted records | Coder, small | A superseded fact cited by a live record is flagged |
| WAC26 | Pack diff tool: changed, added and removed records between two revisions, with which ones saves may have frozen | Coder, medium, after a loader | Diff of the pilot against an edited copy lists exactly the edits |
| WAC27 | Canon contradictions: a `conflicts` list on facts and the reading the pack chose, keeping both sources (unbiased lens) | Designer, small | A record citing one side of a conflict names the chosen reading |
| WAC28 | Lint every registered pack inside `npm test` once packs have a registry | Coder, small, after WAC8 | Adding a broken pack fails the suite |
| WAC29 | Author CLI: `node scripts/lint_world_pack.mjs <pack>` printing coverage and issues by WA code | Coder, small | Running it on the pilot prints the K2 and K8 gaps |
| WAC30 | Native-script names and aliases for translated sources (Reverend Insanity, LOTM) so readers and packs match terms | Designer plus coder, small | Two translations of one term resolve to one record |

## Cross-audit application, 2026-10-18

WA6 floors describe authoring readiness, not a prerequisite bundle for every
selected playable feature. Its slice exception remains usable. WA8/WA12 keep
source uncertainty, character knowledge and implementation coverage distinct:
"unknown in source", "unknown to this character" and "not built" are different
facts. A pack coverage read cannot enforce fictional impossibility (AD38).

WA14 crossings resolve the actual origin, carrier and destination mechanisms;
origin tags are provenance rather than automatic permission or suppression.
WA15 events retain causal prerequisites, including an intervention's committed
intermediate effects. A content-edge pause follows the existing
[RLCE owner](RELATIONSHIPS_AND_CANON_CONSIDERATIONS_2026-10-18.md#rlce-content-edges),
with an observer-safe explanation and exact time/resource settlement
([G26–G30](reviews/SUBTLE_RULE_GAPS_2026-10-18.md#round-4-latest-audits-together-2026-10-18)).
WA's proposed status and current world/layout/NPC deferrals remain unchanged.

## P2 outcome (2026-10-19)

Task record: [world-pack-p2](gm/dispatch/world-pack-p2-2026-10-19/CHECKPOINT.md).
[`src/world_pack_registry.js`](../src/world_pack_registry.js) loads the bundled
list through `loadWorldPacks` and registers a `world_packs` domain with a pack
identity projection and no save slice. `book_world_mol_content.js` and
`book_world_mol_actions.js` are adapters over `book.mol`; the pack file is the
authority for Cyoria's people, items, stock, powers, sources, conditions, commands,
controllers, encounters and situations.

- **WAC8 done.** Exports are byte-identical to the hand-coded baseline (pinned
  hash in the registry test).
- **WAC9 done in part.** Six laws point at facts `molFacts` already reads; K2 is T2.
  Laws with no existing fact stay prose (a new gate would change gameplay, WA17).
- **WAC10 done.** K8 job, food and price records cite command IDs and store no price.
- **WAC28 done.** `tests/world_pack_registry.test.js` loads the same list the runtime
  installs and fails on a broken pack.
- **WA20 format finding.** The manifest's `native` block was specified as a schema-2
  structured pack. Cyoria's definitions are already in the engine's simulation shape,
  so `native` carries them as a definitions payload that nothing compiles. Adopting
  schema-2 compilation for hand-coded worlds is a separate behavior-risking change.
- **WA10 save pin not done.** The `world_packs` domain writes no save slice, so saves
  are byte-identical in shape. Pinning pack revision in saves is the next slice.


## More to consider, round 3: world optimization and implementation (2026-10-22)

Weibao, 2026-10-22: "World optimization and implementation rules? more to
consider?" Proposals, not accepted rules; none changes code or WA1-WA21. Read from
source and docs, no new measurements. Dispositions: A = ACCOUNT FOR NOW (a
constraint on the next world pack), L = LATER / DELEGATE.

| Code | Consideration | Why it matters here | Disp. |
|---|---|---|---|
| WO1 | **Cost scales with active worlds, not installed worlds.** Every per-tick, per-render and per-save cost a world adds gets a "dormant" answer: a world the save has not entered costs one registry row. The loader already has `dormant` (`world_pack_loader.js`); the engine paths around it (scheduler scans, panel polls, save validation, ER1-F1..F10) do not yet promise the same | Hotspot audit ranks whole-envelope save per joined tick and 250 ms panel polls first; each new world multiplies them | A |
| WO2 | **A world declares its tick footprint** next to WA16: expected entities, daily draws, boundaries per game day, panel refresh sources. Lint compares declaration to a counted fixture, the way record ceilings are compared now | WA16 bounds records and generators, not recurring simulation work | A |
| WO3 | **Optimize by measuring the world's own signature loop** at late-game counts (GR11, WDI31), one sample before and one after, on a rebuilt bundle. No speculative caching; cache keys are world revision + fact hash (WDI31) | A cache without a revision key is a stale-truth bug | A |
| WO4 | **Lazy load per world is a bundle concern, not a rules one.** Dynamic `import()` per world (PF4, ER2-C) only after a pack is plain data (WA21) and the cyclic SCCs it touches are broken. Chunks must be versioned with the save's pack `id@revision` (WA10) or players load mismatched code | 6.4 MB bundle; ER2 found 55- and 36-module import cycles that block clean splits | L |
| WO5 | **Data before code.** Prefer a pack record or a fact the engine already reads over a new hand-coded module (WA1, WA17). Hand-coded worlds (LOTM, Cyoria) are converted only as structural moves, same journey before and after | Each hand-coded world adds files to `main.js`-adjacent seams (AR1, AR13) | A |
| WO6 | **Implementation order inside a world:** floor (K2 laws, K3 power, K6 cast, K8 daily life, K13 signature loop) then rings (DWF6). Optimization of a ring waits until its journey passes at C2 | Optimizing before the loop plays tunes the wrong code | A |
| WO7 | **Separate three costs in every report:** content size (records, bytes), recurring sim cost (per tick), and UI cost (render and poll). A single "perf" number hides which one grew | The 250 ms poll and the save transaction are different fixes | A |
| WO8 | **Generated content has an eviction story.** Catch-up generation (WA7) writes records the save must keep; say which are re-derivable from seed + revision (store only the seed) and which are frozen (store the row). Re-derivable rows must regenerate identically after a generator change, or be frozen at first sight | Save size and "generator change reshuffles my world" are the same decision | A |
| WO9 | **Offline and idle catch-up per world has a declared cap** (boundaries drained per slice, as the 512-boundary chronicle budget does), with a visible "caught up through day N" readout rather than a silent truncation | Synchronous drain blocks the UI; silent truncation breaks AD16/AD17 | A |
| WO10 | **Pack diff and rollback before the second revision.** WAC26 (pack diff) and WAC25 (supersededBy) land before any released pack ships revision 2, so frozen save rows are known at bump time | Revision bumps without a diff tool guess which saves are affected | L |
| WO11 | **Optimization never changes what a world allows** (AD38, AD22). A performance limit is a technical retain-and-continue (AR3), never an in-world prohibition; unfinished work is kept and resumed | Prevents "too many NPCs, so the village can't grow" becoming a fictional rule | A |
| WO12 | **Author-time cost report:** `lint_world_pack` (WAC29) prints record count, generator budgets, declared tick footprint and dormant status per WA code | Cheap, makes WO1-WO2 checkable before a browser run | L |
| WO13 | **Debug view, inspection only:** per-world counters (records, entities, last tick cost, dormant reason) read from the projection (AR8), no mutation, no sealed truth (WA11). Pairs with `authorReport` | Lets Weibao see which world is expensive without devtools | L |

Evidence gate when any WO is built: rebuilt bundle, 1920x1080 for any panel,
fresh origin, save, reload, Export and literal Import; late-game fixture for
WO1-WO3 and WO9. Until then these are specified-not-run.

## More to consider, round 4: everything the book mentions, lead first (2026-10-27)

Weibao, 2026-10-27: "wait, we shoud implement every thing and every part that is mentioned
in the book? so even if other characters exist, they exist in some place in some plane and
we can jsut slowly fill in in the future? More to consider? We should set up absorbtion
rules?" Context: the [protagonist-life plan](gm/dispatch/protagonist-life-2026-10-27/PLAN.md)
(LOTM volume 1 proposed as pilot). Proposals only; WA1-WA21 are unchanged. Evidence:
this file, [deep world workflow](DEEP_WORLD_WORKFLOW_2026-10-19.md) DWF3, DWF35, DWF67-DWF72,
DWF96, the LOTM census JSONL (fields `kind`, `containedIn`, `era`, `canonWeight`) and
`src/book_world_lotm_ids.js`. Codes WAL1-WAL17.

**Short answer.** Yes: every thing the book mentions gets a record, and depth grows by
touch. The absorption rules for this already exist and are accepted (WA1-WA21): a census of
every named person, place, thing, law and event at the catalog rung (DWF3), a shallow
runtime rung (DWF96) with an "unwritten" marker (DWF72), and unknowns kept unknown (WA8).
What is missing is the link between that census and the lead-first pipeline, plus a few
rules for things that exist off the page. Those are below.

### ACT NOW (done)

- **WAL1 The plan's source lane records every mention, not only the lead's touches.**
  P1 readers read every chapter of the volume anyway, so each mention becomes a census row
  at the same pass; the marginal cost is a few fields per row. PLAN.md round 2 updates P1's
  done check.

### ACCOUNT FOR NOW

| Code | Consideration | Default, dial and reason |
| --- | --- | --- |
| WAL2 | **Presence ladder.** Every mentioned entity sits on one rung: M0 *mentioned* (census row, locator, label), M1 *placed* (an address that resolves: place or plane, era window, status), M2 *shallow* (exists at runtime: hear of, inspect, meet as a stub, DWF96), M3 *lead-touched* (all facts the lead run needs), M4 *world- or seat-complete*. | Default: every mention reaches M1 in the source pass; M2 when some life could reach it; M3 and M4 by the pipeline. Dial: how far M2 goes per world. Reason: "exists somewhere" is then a fact the engine can read, not a promise. |
| WAL3 | **Whereabouts are time-sliced.** An entity's address has an era window, so "in Backlund in 1349, at sea later" is two rows, not one overwritten field (extends DWF68). | Default: each mention's locator adds a dated whereabouts row. Reason: a placed person must be findable where the book has them, when it has them. |
| WAL4 | **Forward anchors bind later filling.** Anything generated or authored for an entity between mentions must not contradict that entity's later canon mentions: a filled-in 1349 life cannot kill, move or marry someone the book still needs in 1350. | Default: fill reads the entity's future anchors as constraints; a player-caused divergence (WA15) is allowed and labelled, a generator-caused one is not. Reason: slow filling is only safe if early fills cannot break later canon. |
| WAL5 | **Off-page lives are lazy.** An M1 or M2 person between mentions has no simulated day; their state resolves when a life first meets them, using the NPC-absence clocks, then freezes (GR3, WAC22). | Default: lazy. Reason: thousands of mentions cost nothing until touched (WO1). |
| WAL6 | **Unreachable is not forbidden.** A person or place on another plane, or with no known route, stays M1 with `route: none known`. A mechanism that reasonably reaches it works (AD38). | Default: record the access mechanism the book gives, if any. Reason: the world is whole even where no player can go yet. |
| WAL7 | **A mention is a claim.** "Rumored to live in the capital" records the speaker and the claimed-versus-true mark (DWF79); a placed address from a rumor is `claimed`. | Default: address status follows the evidence label. Reason: canon characters are often wrong about each other. |
| WAL8 | **Implied is not mentioned.** A city with newspapers implies printers; those are derived or generated under the world's laws (WA7, DWF27), labelled, never census rows with a locator. | Reason: keeps the census honest and cheap (DWF35). |
| WAL9 | **One identity, many names.** Translated and Chinese names, titles, code names and aliases resolve to one id (WAC30), and new prose references names through the resolver (CAE-E1/E4), so a later rename or reveal does not break saved text. | Reason: LOTM's local source is Chinese and characters use several names. |
| WAL10 | **First-mention volume on every row.** It lets a spoiler dial hide rows a "new reader" life has not reached and lets public reports count rows without naming them. Sealed rows use opaque IDs (WA11). | Reason: a full-book census is the largest spoiler surface the project will have. |
| WAL11 | **Census ids and pack ids must map once.** The LOTM census uses `lotm.loc.*`-style ids; the runtime uses `book.lotm.*` (`src/book_world_lotm_ids.js`). A single mapping table, written before the first M2 promotion, keeps WA9's stable ids. | Reason: two id spaces drift and break saves on promotion. |
| WAL12 | **The existing LOTM runtime is an original slice.** Its header says every person, place and price there is an authored proposal, not a canon claim. Canon rows join beside it with their own ids; neither overwrites the other. | Reason: current saves and the existing probationer lives stay playable (WA17). |
| WAL13 | **Fill order is a queue, not a wave.** "Slowly fill in" ranks M1 rows for promotion by reachability from existing lives, mention count and lead touch, one small lane per batch; local churn may draft under review (DWF65, DWF83). | Default: reachability first. Reason: depth goes where play goes (S5, DWF99). |

### LATER / DELEGATE

| Code | Item | Level, effort | Done check |
| --- | --- | --- | --- |
| WAL14 | Done 2026-10-27: WAL2-WAL4 accepted as WA22-WA24 on Weibao's yes | Docs | RULES_INDEX register and router rows updated in the same change |
| WAL15 | Census row schema v2: `whereabouts[]` with era windows, `firstMention`, `addressStatus`, `rung`, `aliases[]`, `futureAnchors[]` | Sonnet, small; schema lint | The LOTM census converts with no lost rows; lint flags a fill that contradicts a future anchor |
| WAL16 | Census-to-pack id map for LOTM | Sonnet, small | Every census id that has a runtime counterpart maps once; no runtime id renamed |
| WAL17 | Rung counter in the depth meter (DWF105): mentioned, placed, shallow, touched, complete per world and volume | Sonnet low, after DWF105 | Counts print per rung; IDs only, no names |
