# Deep world workflow: from source to past it (proposal, 2026-10-19)

Weibao, 2026-10-19: "workflow to deeply implement a world? all aspects of its
source material? extending beyond it? more to consider?"

**Status: proposal workflow (AD32).** The initial workflow round changed no runtime
code. Later dated rounds below record actual research runs; the separately authorized
LOTM slice records its own implementation. Codes **DWF1 to DWF40** (prefix checked unused by `git grep`
2026-10-19). Rounds are appended, never rewritten.

## Why a new file

Every stage already has an owner. None chains them end to end with the tools that
landed after 2026-10-17:

| Owner | What it covers | What it does not |
| --- | --- | --- |
| [Actionability GM](gm/WORLD_ACTIONABILITY_GM_PROMPT.md) P1 to P5 | Whole-world planning: audits, starts, cheats, contracts | Predates packs, the loader, AU budgets; stops at contracts |
| [Source deep dive playbook](research/SOURCE_DEEP_DIVE_PLAYBOOK.md) | Reading once, readers, wiki, synthesis | Stops at research |
| [World absorption rules](WORLD_ABSORPTION_RULES.md) WA1 to WA21 | Read, sort, encode, fill gaps, prove for one pack | Says little about whole-canon breadth or what lies past canon |
| [Completion standard](WORLD_COMPLETION_STANDARD.md) S00 to S14 | Sections, ledger, evidence states | Planning shape, not a run order |
| [Scale plan](IDEABOARD_SCALE_PLAN_2026-10-19.md) S1 to S13, P1 to P8 | Rings, pipeline, overlays, beyond-ambition ideas | Project-wide, not per world |

This file is only the run order. Each row names its owner; the owner keeps the detail.

**Different lives, 2026-10-21:** [BF28–BF70](worlds/BOOK_WORLD_FEATURE_GAPS_2026-10-15.md#round-3-different-lives-in-each-book-world-2026-10-21)
apply DWF5–DWF8 to student, smuggler and other world-specific lives. BF28 owns
the proposed operation/source/state/consumer worksheet; BF29 owns mixed-life
interactions; BF30–BF70 deepen 41 setting/profile entries. Use the selected world's
source owner and existing runtime seam. These worksheets are not new admitted
pack fields or a generic interpreter, and this link authorizes no runtime wave.

**Shared engine and niche specialties, 2026-10-21:** the
[next BF71–BF94 round](worlds/BOOK_WORLD_FEATURE_GAPS_2026-10-15.md#round-4-shared-engine-gaps-and-specialties-across-lives-2026-10-21)
maps existing runtime owners to remaining shared joins, composes specialties
without a profession-per-system design, and adds a local rule/counterexample for
each of the 41 setting/profile entries. BF87 gives the bounded authoring loop;
BF90–BF94 give proposed implementation opportunities and proof gates. Choose
the selected feature's actual missing seam instead of requiring every shared
extension before a useful life can play. Existing source, runtime and delivery
owners retain authority.

## The stages

| Code | Stage | Owner | Input | Output | Done gate | Stop rule |
| --- | --- | --- | --- | --- | --- | --- |
| DWF1 | **Recover** what exists | Actionability P1, [world core kit audit](worlds/WORLD_CORE_KIT_AUDIT_PLAYBOOK.md) | Repo search for the source | Inventory: research, packets, code, open IDs | Every prior file has a disposition | Stop when new searches find nothing new |
| DWF2 | **Read** once, under budget | Deep dive playbook, AU1 to AU15 | Local text, wiki, fan routes | Private fact ledger with locators (AD35) | Coverage file shows read and reviewed spans | Read only spans a horizon needs (CX1) |
| DWF3 | **Census** the whole canon as data | Scale plan S5, kit K1 to K24, S00 to S14 | Ledger | Catalog records at Count/Address rung for every named person, place, thing, law, event | Coverage printout per kit part and section | Catalog, not playable; no tuning here |
| DWF4 | **Grammar and dials** | [Rule grammars](WORLD_RULE_GRAMMARS_AND_DERIVED_DETAIL_2026-10-19.md) DG, [world dials](WORLD_DIALS_AND_INTERPRETER_CONSIDERATIONS_2026-10-19.md) WDI, [deep-level lenses](worlds/WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md#round-21-deep-level-lenses-for-every-world-2026-10-19) KL1 to KL12 | Ledger laws and structures | Grammar rows that derive per-thing tags; dial profile | Each derived tag cites its grammar row; inference labelled | Derive only where the source states the rule |
| DWF5 | **Pack** | WA1 to WA21, `src/world_pack*.js` | Census, grammar, dials | Pack `id@revision` that lints | Lint clean except named WA4 law gaps | Lint is "pack valid", not absorbed (WA19) |
| DWF6 | **Rings** of play | WA6, scale plan S5 and P6, completion P4 | Pack | One playable ring at a time, signature loop first | Rebuilt browser at 1920×1080, with 1536×864 desktop-floor evidence where relevant, and save, reload, Export, Import (AR10); 1366×768 retired | One ring per checkpoint Weibao can play |
| DWF7 | **Past canon** | See [beyond the source](#beyond-the-source) | Pack plus play evidence | Overlays, generators, starts, carry records | Each overlay lints against the base pack; generated records labelled | Only what a ring or a start needs next |
| DWF8 | **Prove and fold** | WA19, AD36, completion P5 | Ring evidence | Ledger update, remaining gates, next ring | Evidence states kept distinct; backlog named | Ends at a checkpoint, not a batch boundary |

Two horizons run side by side, as the completion standard already says: the
**whole-world blueprint** (DWF1 to DWF4, wide and cheap) and the **next playable
ring** (DWF5 to DWF8, narrow and proven). By default a ring does not substitute for the census,
and the census does not block a ring; a ring that needs a census fact reads just that slice.

## All aspects of the source

"All aspects" means every axis below has a census row or a recorded reason it does
not apply. Missing work is not "not applicable" (completion standard).

| Code | Axis | Where the census row lands |
| --- | --- | --- |
| DWF9 | Laws, cosmology, history, eras | K2, S01; laws as rules (WA4) |
| DWF10 | Power systems, acquisition, mastery, costs, failure | K3, S07; ability authoring |
| DWF11 | People, factions, institutions, motives | K6, S04; canon spine authored, gaps generated |
| DWF12 | Daily life, work, food, money, prices, housing | K8, S05 |
| DWF13 | Places, routes, hazards, materials | S03; [site rules](SITE_AND_EXPLORATION_RULES.md) SR |
| DWF14 | Items, crafting, recipes, technology | S06; [crafting engine](CRAFTING_ENGINE.md), MR |
| DWF15 | Combat, danger, recovery | S08; CBR, BHR |
| DWF16 | Secrets, knowledge, identification | S09; sealed by ID (WA11), truth versus knowledge (WA12) |
| DWF17 | Canon events and natural course | S10, S11; causal preconditions (WA15, AD2) |
| DWF18 | Small details that change play | Completion standard "preserve the little details"; DG derived detail |
| DWF19 | Voice, register, look | Narration, UI theme (UR), cheat looks (AD26) |
| DWF20 | Media and editions | Playbook SM rows; edition and translation confidence (WA3, WA10) |

## Beyond the source

Ranked by cost to value. Each one is a default with a dial; a world can switch any
of them off with a reason.

| Code | Route past canon | Owner | Default |
| --- | --- | --- | --- |
| DWF21 | **Generated gaps under the world's own laws** | WA7, GR1 to GR17 | Unnamed people, shops, jobs, ruins filled by generators, labelled, frozen on reveal |
| DWF22 | **Divergence from player action** | AD2, WA15 | Canon runs its natural course until a cause is averted |
| DWF23 | **Starts beside or instead of the protagonist** | Playbook M3, [living beside protagonists](research/LIVING_BESIDE_PROTAGONISTS_2026-10-10.md), WA13 | Coherent start packages with their own knowledge lists |
| DWF24 | **Era, AU and sequel overlays** | WA18, GR8, scale plan S9 | Overlays add, remove or reweight records; no forked copies |
| DWF25 | **Before and after the book** | Timelines, S11 | Pre-canon eras and post-ending continuing life as overlays with authored status |
| DWF26 | **Carry in and out** | WA14, Rulebook 5 | Per-edge records for what crosses, what is suppressed, how locals read it |
| DWF27 | **Derived detail** | DG | Per-thing meaning from grammar rows instead of one authoring pass each |
| DWF28 | **Combination search** | Scale plan beyond-ambition 4, CX3 | Tag rules find interactions; a report lists unplanned synergies |
| DWF29 | **Director overlay** | Scale plan beyond-ambition 3, WDI | Weibao edits dials and decks in game, saved as a revisioned overlay |
| DWF30 | **Fan premises** | Playbook fan routes | Fan status (WA3); kept out of a canon continuity by default, carried in a fan or AU overlay (WA18) |

## LOTM as the worked example

Weibao picked the LOTM Seer slice as the next deep world implementation on 2026-10-19 ([initiation plan, runtime authorization](gm/LOTM_INITIATION_IMPLEMENTATION_PLAN_2026-10-15.md#runtime-authorization-and-first-engine-slice-2026-10-19)). Where it stands, by stage:

| Stage | LOTM state | Evidence |
| --- | --- | --- |
| DWF1 | Done in effect | [Scale plan LC1 to LC13](IDEABOARD_SCALE_PLAN_2026-10-19.md#lotm-and-coi-readiness-more-to-consider-2026-10-19) |
| DWF2 | Book 1: all 1,402 entries read, 363 reviewed; COI: 1,178 of 1,178 reviewed | Coverage and checkpoint files (scale plan LC1, LC3) |
| DWF3 | Catalog census delivered: 466 LOTM rows, with per-row evidence limits | Round 2 below; notes/search coverage is not primary verification |
| DWF4 | 27 grammar rows and bounded ingredient/interchangeability follow-ups delivered; inference and gaps remain | DWF50/DWF52/DWF57/DWF59 below; not a general recipe generator |
| DWF5 | Not started; the Seer slice is hand-coded `book_world_lotm_*` files | [Initiation plan, runtime authorization](gm/LOTM_INITIATION_IMPLEMENTATION_PLAN_2026-10-15.md#runtime-authorization-and-first-engine-slice-2026-10-19), [LTS1 to LTS10](worlds/LOTM_SEER_SLICE_LAWS_2026-10-19.md) |
| DWF6 | Native join and opt-in workroom prototype delivered with recorded scratch-browser/persistence observations; acceptance incomplete | [Native join receipt](gm/LOTM_INITIATION_IMPLEMENTATION_PLAN_2026-10-15.md#native-join-save-and-desktop-ui-2026-10-19-lip3lip4); Export-click, target-view evidence and travel guard remain open |
| DWF7 | COI planned as an era overlay (LC2) | Scale plan |
| DWF8 | Partial technical proof and exact unrun gates recorded; no whole-world or human acceptance | Initiation plan native-join receipt and its current gate note |

Another session owns the Seer slice files. This file cites them and changes nothing there.

## A runnable version (not run)

The stages can share one coordinator and existing evidence instead of a fixed
eight-or-nine-agent swarm. Use AU1–AU15: preassemble only the selected missing
source spans, qualify one bounded Luna pilot, then release disjoint fresh jobs
under the same finite budget with at most two active workers. The coordinator
reconciles canon, lifecycle and shared integration. Reuse completed census and
grammar outputs; a selected ring reads only its consequential dependencies.

No workflow run is dispatched by this template. A future selected run records
its input manifest, model/effort, invocation/source/output ceilings, shared
allowance stop and exact unread remainder before launching. Stronger review is
for a named unresolved judgment, not an automatic tier for every law row.

## More to consider, round 1 (2026-10-19)

### ACT NOW (done)

- **DWF31 Selection cited to its owner.** The LOTM pick is recorded in the initiation plan's runtime authorization, not the scale plan (which ends "Not decided"); the worked example cites the former.
- **DWF32 Census to pack seam checked.** `src/world_pack_manifest.js` already has a `catalog` content family and the loader accepts catalog-only packs ("catalog and inspectable content only"). `src/world_pack.js` lints a different shape: records sorted by kit part. So DWF3 can land catalog records today; one census row feeding both the manifest family and kit-part coverage is unverified (see DWF33).
- **DWF33 Blanket claims swept** to default and dial (ring versus census, fan premises).

### ACCOUNT FOR NOW

- **DWF34 Conversion timing for the Seer slice.** The slice is local modules (`book_world_lotm_*`, authorized with a named seam; WA1's dial allows a local module) because no second world has been through the pack format yet (scale plan P3, WA20). Default: finish the slice as is, then convert it as a structural move with the same journey before and after (WA17) once P3 lands. Converting early rewrites in-flight work; converting late moves more files.
- **DWF34a Two pack shapes meet at the census.** The manifest's content families and the lint's kit parts are separate shapes. Before DWF38 writes many records, settle which one census rows use and how the other reads them, or the census gets written twice.
- **DWF35 The census is cheap only if it stays catalog.** Count/Address rung records with locators and status, no tuning, no prose. Otherwise it becomes the six-month authoring pass the rings exist to avoid.
- **DWF36 Reviewed spans gate rings, not the census.** LOTM's 1,039 unreviewed entries block only rings that reach later spans (LC3). The census can mark them "read, unreviewed" with lower confidence.
- **DWF37 Sealed truths travel through every stage by ID.** Census, grammar and overlay records hold the route and status only (WA11); a combination report must not print a sealed record's truth.

### LATER / DELEGATE

| Code | Item | Level, effort | Done check |
| --- | --- | --- | --- |
| DWF38 | LOTM census as catalog records (DWF3) from the reviewed span | Sonnet medium, four bounded readers | Coverage printout per kit part; every record cites a fact ID |
| DWF39 | LOTM grammar pass: Sequence names, pathway structure, potion formula shape (DWF4, DG-C) | Opus design, one session | Grammar rows derive tags for every Seer-pathway item already in the slice, inference labelled |
| DWF40 | Seer slice to pack conversion (DWF34) after the second-world proof; extends scale plan LC12 (pack draft), which stays the owner of the draft | Strong coder, one structural session | Same rebuilt journey before and after; `check:arch` shows fewer world files |

## Round 2: LOTM and Harry Potter, data first (2026-10-19)

Weibao: "Deep world implementation for lotm and HP, referring to source text
accordingly, and relevant datastuff and other stuff, spell books and more? more to
consider?" **Status: proposal.** Codes continue from DWF41. This round ran DWF3
(census) for both worlds as private catalog data and changed no runtime code. The
LOTM Seer slice files belong to another session and are untouched (AR15). HP gets no
runtime ring until the Seer slice has its DWF6 browser checkpoint, since AGENTS says
finish one playable slice before starting the next.

### What ran (AU ledger)

| Item | Detail |
| --- | --- |
| Mode | Reuse and targeted check, not a full read ([playbook modes](research/SOURCE_DEEP_DIVE_PLAYBOOK.md#saved-sources-first)) |
| Budget | AU1 to AU15: two Sonnet readers, one per world, one at a time slot each, own output files, no sub-agents. HP reader printed about 5,900 source words (cap 12,000); it used one response more than the six allowed. LOTM reader reused about 200 KB of existing notes plus five EPUB spot-checks. |
| HP source | Seven novels, prepared text and FTS index in the private [source preparation](research/novels/harry-potter/source-preparation-2026-10-11/README.md). Extraction is reproducibility, not reading. |
| LOTM source | Reader notes with inherited locators; Book 1 stays 1,402 read and 363 reviewed (LC1, LC3). |
| Outputs (private, gitignored) | `research/novels/harry-potter/census-2026-10-19/` and `research/novels/lord-of-mysteries/census-2026-10-19/`: a JSONL census and a report each |

| World | Records | Evidence state |
| --- | --- | --- |
| HP | 256: 100 spells, 32 textbooks, 18 plants, 18 creatures, 14 potions, 14 subjects, 15 offices, 29 objects and artifacts, 12 wand woods and cores, 4 ingredients | 33 read in full passages, 223 located by search only (name seen at a locator, nothing more). No wiki or memory rows. |
| LOTM | 466: 22 pathways, 220 sequences, 63 potion formula rows, 27 rituals, 45 rules, 33 organizations, 11 sealed artifacts, 26 persons, 19 locations | 462 from notes, 4 checked in the EPUB; one more check was inconclusive. 14 of 22 pathways have all ten Sequence names. 12 note conflicts are listed, not resolved. |

### ACT NOW (done)

- **DWF41 Census shape settled (answers DWF34a for catalog rows).** Census rows use the
  pack manifest's `catalog` record fields (`id, label, kind, locator, era, canonWeight,
  containedIn, licence, counterpartOf`, in `src/world_pack_manifest.js`) plus four
  sidecar fields: `kit` (kit part), `evidence`, `confidence`, `note`. One row then serves
  the manifest family and kit-part coverage. Proposal; whether the lint accepts the
  sidecar fields is unverified, and nothing was loaded. Rows carry licence
  `private-research`, which the loader refuses by design (`REFUSED_LICENCES`), so the
  private census can never ship by accident; a shippable catalog is a later filtered copy.
- **DWF42 HP ledger correction.** The 2026-10-03 [HP source ledger](worlds/harry-potter/SOURCE_LEDGER.md)
  says no book text was acquired. That is superseded by the 2026-10-11 source
  preparation (seven novels extracted, 4,441 searchable passages); only the 2026-10-15
  pass added no novel reading. Read the ledger as dated history.
- **DWF43 Coverage labels are per row.** `read`, `searched`, `notes`, `checked` are
  different claims. Only 33 of 256 HP rows and 4 of 466 LOTM rows were checked against
  text this run; do not report the census as source-verified.

### ACCOUNT FOR NOW

- **DWF44 Knowledge items versus powers.** Spell books, booklists, margin notes and
  LOTM formula papers all hold a recipe or incantation that the owner may not be able to
  use. Model them as one item family that confers a knowledge state only (AD6, SLR
  rows): reading the Standard Book of Spells does not give a casting skill; a formula
  sheet does not give a potion or a Sequence. HP's wand-mediated method and LOTM's
  potion plus acting are the consumers.
- **DWF45 Grammar rows to derive, not author.** The most valuable next pass is the
  grammar (DWF4): LOTM formula shape (main and supplementary ingredient classes from
  neighbouring Sequences, as the notes state it), the honorific-name rite, and HP's
  incantation, wand-affinity and class-taught layers. Derive only where the text states
  the rule; label the rest inferred.
- **DWF46 Name layers.** LOTM canon names exist in Chinese and in translation (WAC30).
  Census labels hold the working English name; add the native-script name when the
  pack is built. HP has US and UK titles (`Sorcerer's` versus `Philosopher's` Stone):
  keep both as aliases of one record.
- **DWF47 Spoilers stay in the private folder.** Tracked docs cite pathway, Sequence
  and spell records by ID only; sealed in-game secrets stay out of the canon census
  entirely (WA11).
- **DWF48 Edition boundary.** HP rows are the seven novels. Cursed Child, films, games
  and the companion writings are separate source sets (SM rows, WA3). LOTM rows are
  Book 1 plus notes; COI is an era overlay (LC2), not merged.

### LATER / DELEGATE

| Code | Item | Level, effort | Done check |
| --- | --- | --- | --- |
| DWF49 | Promote HP `searched` rows to `read`: one reader per two books, spells and textbooks first, taught-in scene and counter relations | Sonnet medium, bounded shards under AU13 | Coverage printout: share of rows `read`, counters filled where stated |
| DWF50 | LOTM conflicts and gaps: resolve the 12 listed conflicts and 8 incomplete pathways by targeted EPUB checks | Sonnet medium, small | Conflict list closed or kept open with locators |
| DWF51 | HP companion books as in-world spell books: Fantastic Beasts, Quidditch Through the Ages, Beedle the Bard are real published texts (SM7). Not held locally; buying needs Weibao's yes. | Acquisition by Weibao, then a reader | Receipt plus census rows tagged `supplement` |
| DWF52 | Grammar pass for both worlds (DWF45), LOTM first since it is the active ring | Opus design, one session | Grammar rows derive tags for every Seer-slice item already in the code, inference labelled |
| DWF53 | Hogwarts Legacy and similar games as SM5 number sources for spell and potion tables | Game-read, existing standing task | Rows tagged `game`, kept out of the novel baseline |
| DWF54 | HP first ring proposal (after Seer DWF6): a beginner potion or charm lesson built on the [beginner potion proposal](research/novels/harry-potter/craft-integration-2026-10-12/BEGINNER_POTION_PROPOSAL.md), wand tool contract from the [HP and LOTM comparison](worlds/HP_LOTM_NEXT_PLAYABLE_FEATURE_2026-10-15.md) | Strong coder, one ring | Rebuilt 1920×1080 journey, relevant 1536×864 floor check, with save, reload, Export, Import |
| DWF55 | Combination report over both censuses once grammar rows exist (DWF28), e.g. where a formula sheet and a spell book route share a consumer | Script plus review | Report lists unplanned interactions without printing sealed truths |

### DWF49 result: HP searched rows checked against text (2026-10-19)

Ran the HP promotion from round 2. AU ledger: four Sonnet readers, one shard each, two at a
time, each reading one preassembled file of about 8,200 to 9,700 source words (37,199 in all
across 223 rows; the total is above the 12,000 cap only because it is split over four fresh
readers, none above it). Each window is about 1,200 characters of text around the term on the
row's page, built offline from the private source preparation. A shard reader read each
window and judged the row. The first of the four wrote its rows but the harness would not let
it write a report file, so counts come from the outputs.

| Evidence state after merge | Rows |
| --- | --- |
| `read` (round 2 full passages) | 33 |
| `read-window` (confirmed in a 1,200-character window) | 195 |
| `searched` (partial, not in window) | 27 |
| `rejected` (word found in another sense: Wolfsbane potion, only the plant shown) | 1 |

- **Meaning of `read-window`.** The named thing appears in that window in the row's sense. It
  is not a full-scene read and says nothing about who teaches it, counters or later changes.
  Roughly 11 rows gained a stated relation; most spell types stay null because windows
  rarely state them.
- **Partial rows** (24) are mostly chapter or contents titles (Dementor, Boggart, Marauder's
  Map, Sectumsempra, Felix Felicis and so on). Their sense needs a later in-text scene.
- **Not in window** (3): Quidditch Through the Ages, Philosopher's Stone (first hit was the
  opening page) and a Skeeter-book title. Keep them as `searched`.
- **Label fixes recorded as aliases**: Cleansweep Seven, Full Body-Bind, Pixie, Pepperup
  potion, Bat Bogey Hex, Muggle-Repelling Charm, Curse-breaker. One spell label
  (`funnunculus`) probably carries an OCR slip for the nearby Furnunculus spelling;
  unresolved.
- **Unchanged limits.** Still no counters, wiki contradictions or taught-in scenes beyond the
  windows. The pre-merge file is kept as `HP_CENSUS.pre-dwf49.jsonl`. DWF49's done check
  ("share of rows read, counters filled where stated") is met for the share (228 of 256
  text-checked), not for counters.

### DWF50 and DWF52 results: LOTM conflicts and grammar (2026-10-19)

Weibao asked for both next steps. AU ledger: two Sonnet readers, one each, no sub-agents, run
together. Outputs are private (`research/novels/lord-of-mysteries/census-2026-10-19/dwf50/` and
`.../grammar/`); this entry paraphrases. The reader notes were not written into tracked files.

**DWF50, conflicts and gaps.** 14 EPUB member lookups, about 4,900 of 12,000 source characters.
Of 20 items: 2 resolved, 5 narrowed, 2 open, 11 not attempted (the budget went to conflicts that
change a Sequence name or rank).
- Resolved: the Fool, Error and Door swap point is Sequence 3 as Azik states it; the Sequence 4
  figure was Klein's own guess. Swaps begin at the step into Sequence 4.
- Narrowed: Death's Spirit Guide at Sequence 5 versus 6 (kept 6); the Ferryman label; Paragon
  Sequence 1; Error Sequences 2 and 1; the Reader/White Tower Sequence 8 name, which the in-world
  book leaves blank.
- Hermit Sequence 8 was not actually checked, and may be a pathway mismatch in the census.
- Evidence state: `checked` lookups plus any items the reader labelled `memory`.

**DWF52, grammar.** 27 rows (9 high, 14 medium, 4 low confidence); no new reading.
- Derives well: the Sequence ladder and tiers, advancement and acquisition, sealed-artifact
  grades, the prayer rite.
- Does not derive: **the potion ingredient rule.** Main and supplementary ingredient classes are
  only inferred and only the Seer line is complete; the census states no relation between
  neighbouring Sequences. This is the key finding: a per-thing ingredient generator cannot be
  grammar-driven yet, so Seer formulas stay authored rows.
- Seer slice check: the prepared dose derives its tags (pathway, Sequence 9, tier, formula).
  The comparator and two sample lots have no supporting grammar row. Nine gaps are listed in
  the private file.

**ACCOUNT FOR NOW (DWF56).** Treat the comparator and sample lots as authored original rows
(the slice already labels them so), not canon-derived items. Do not build an ingredient
generator for other pathways until a source pass states the rule; the old ACT NOW "derive tags
for every Seer item" done check of DWF52 is only partly met.

**LATER (DWF57).** Finish DWF50's 11 unattempted items; a focused source pass on potion formula
ingredient patterns (needed before any non-Seer pathway ring). Sonnet medium, one bounded shard.
Done check: ingredient relation stated or recorded as not stated, with locators.

### DWF57 result: potion ingredient rule (2026-10-19)

AU ledger: one Sonnet reader, 12 EPUB members, about 5,100 of 12,000 source characters, plus the
census and reader notes. Private output in `research/novels/lord-of-mysteries/census-2026-10-19/dwf57/`.

- **Bounded verdict: no general ingredient relation across Sequences or pathways was established in the 12 inspected members plus reused notes.** This is not a proof of absence from the complete novel.
  "Not stated" means not found in the members searched and the reader notes, not a proof of
  absence in all 1,402 entries.
- **Stated, but not an ingredient rule:** Beyonder characteristics are conserved, and a dead
  Beyonder's characteristic is "a potion without auxiliaries", so auxiliaries are still needed
  and Sequences cannot be skipped.
- **Shown:** a main ingredient can be replaced by a same-Sequence characteristic; some formulas
  list alternate mains.
- **Inferred only:** a few materials recur across pathways (for example one octopus blood in two
  pathways) with no stated reason.
- **Consequence (DWF58, ACCOUNT FOR NOW).** Ingredient lists stay authored per formula. A
  generator may safely derive only the stated parts: characteristic conservation, the
  auxiliaries requirement, no skipping, and same-Sequence main-ingredient substitution. Any
  cross-pathway ingredient pattern is a labelled `inferred` tag, never a law. This closes DWF57's
  done check and settles that the Seer formula stays an authored row.

### DWF59 result: interchangeable materials in LOTM and HP (2026-10-19)

Weibao: online lookup is allowed, and this ties into interchangeable materials with the same or
similar qualities. Owners already exist: [CRAFTING_ENGINE](CRAFTING_ENGINE.md) WR3 (substitution
policy: exact identity, functional profile or none), TQ7, UV8, MA5, IX22 and the E4B profile
substitution notes. This pass supplies world evidence for WR3; it adds no new rule. AU ledger: two
Sonnet readers, at most 12 fetches each, outputs private
(`.../harry-potter/census-2026-10-19/dwf59/` and `.../lord-of-mysteries/census-2026-10-19/dwf59/`).
Fetch limits: the Fandom wiki answered 402 on both worlds, so online evidence is search summaries and
a few official pages, not full wiki pages; no revision ids were captured.

| Material kind | HP evidence | LOTM evidence | Reading for WR3 |
| --- | --- | --- | --- |
| Potion main ingredient | Named formula identities; no working swap shown in the inspected windows | Named formula identities; two stated stand-ins: a listed alternate main (one formula), and a same-Sequence Beyonder characteristic | Named-formula requirements and documented alternatives; other mixes still resolve under MR6–MR7 |
| Supplementary ingredient | Exact identity; names for one plant (monkshood, wolfsbane, aconite) are aliases | Exact identity; a low-confidence wiki line shows alternates with different amounts, so not 1:1 | Aliases are one record; alternates carry their own quantity |
| Effect class | Bezoar protects against "most" poisons and stood in for an unfinished antidote (B6) | Not found | A bounded effect class can stand in, with a stated limit |
| Tools | Borrowed or won wand works at reduced quality until allegiance changes (B7); no wood-core pairing table | Not applicable | Graded substitution is the only HP case, and it is quality, not yes/no |
| Functional profile swaps | Not stated | Not stated; no pathway-affinity swap rule | Neither world states one |

**Source-reading boundary.** The inspected examples document named formulas and particular substitutions; they do not establish an exhaustive permission list for making.
Silence is not prohibition: AD38 (things work by how they work) and AD5 let a player-found
substitute work when its mechanism reasonably does, at a cost. Canon therefore sets the default
profile, and improvisation is a discovery route with risk, not a gap in canon.

- **DWF60 (ACCOUNT FOR NOW).** Keep source-qualified named-formula matches and stated alternates as
  attractors, with their evidence attached; free mixing remains valid under MR6–MR7,
  including accidental exact matches, degraded near matches and original outcomes.
  Allow functional-profile improvisation as a learned, costed, partly failable
  route (MA5, UV8 "only substitute what you understand"). HP wand quality is graded, never a
  hard cannot-cast (matches the BF1 correction).
- **DWF61 (ACCOUNT FOR NOW).** Substitution rows keep `relation` (`stands_in`, `equivalent_class`,
  `complements`, `not_interchangeable`) and `basis` (stated, shown or inferred). Their `basis` is
  `inferred` unless the text states it, so a generator never turns an inference into a law.
- **DWF62 (LATER).** Improvised and bought substitutes in LOTM, and HP dragon and unicorn products,
  have no evidence yet. Needs a novel pass or the wiki through the in-app browser (the scripted
  route is blocked). Sonnet medium, one bounded shard each; done check: rows added or "not
  stated" recorded with locators.
- **DWF63 (LATER).** HP wand wood and core pairing came from search summaries only. Fetch the
  official wand-wood and flexibility pages' pairing statements already linked in the HP ledger,
  or the Wizarding World wand pages, before encoding any pairing.

### On-demand lore item audits (2026-10-19)

Weibao: "we can audit for specific lore items as needed and more." Recorded as the standing route
for checking one named lore item (a spell, potion, ingredient, ritual, Sequence, artifact, person
or place) instead of re-reading a source. It reuses what exists; no new tool.

| Step | What happens | Owner |
| --- | --- | --- |
| 1 | Find the item's census row (`hp.*` or `lotm.*`). No row: add one from step 3. | Private census JSONL |
| 2 | Read the row's `evidence`: `read`, `read-window`, `notes`, `checked`, `searched` or `rejected`. Stop if it already answers the question at the needed depth. | Row |
| 3 | Targeted check: HP through the prepared FTS index and page locator; LOTM through the reader-note locator and one EPUB member; wiki or official pages online as a secondary source (Fandom may answer 402, then use search summaries or the in-app browser). | [Playbook](research/SOURCE_DEEP_DIVE_PLAYBOOK.md) |
| 4 | Update the row (`evidence`, `locator`, `scene`, relations, alias) and keep the old state as history. | Row |
| 5 | If the answer changes a rule or a recorded conflict, say so in the owning grammar or router entry. | Router, grammar file |

Defaults and dials: one item per check, a few source windows (AU10 bounds), no sub-agent unless the
question needs more than one lookup. A cluster of items goes to one reader with a preassembled
window file, as in DWF49. Sealed in-game secrets are referenced by ID only (WA11). The result is
research and proposal until Weibao accepts it.

### Open lore audits sent out (2026-10-19)

Weibao: "send accordingly", read as running the open lore audits from DWF50, DWF62 and DWF63. AU
ledger: two Sonnet readers, one each, outputs private (`.../harry-potter/census-2026-10-19/audit2/`,
`.../lord-of-mysteries/census-2026-10-19/audit2/`).

**HP.** The 28 rows that had only a chapter-title or contents hit each gained an in-text scene
(about 3,500 words printed, an estimate). Three are mention-level only (potions, astronomy, ancient
runes): no lesson scene was read. Wolfsbane now resolves as a potion. Census state: 223
`read-window`, 32 `read`, 1 `searched`. Merged; the earlier file is kept as
`HP_CENSUS.pre-audit2.jsonl`. **Wand pairing (DWF63):** two official pages were fetched (class
C-X); neither states which woods pair with which cores. The wood and core pairing guidance
appears only in a search summary of an already-checked page, so it stays low confidence and
nothing is encoded.

**LOTM.** 14 of 16 lookups, about 3,000 of 12,000 source characters, six-response cap reached.
- Resolved: Hanged Man Sequence 3 is the Chinese name for a three-headed hall (the translated
  "Trinity Templar" is not in the text); the Sun swap-group chapters do not conflict; Hermit
  Sequence 8 was a false gap, since the Sequence 8 name is blank in the in-world book.
- Narrowed: the church has 13 archbishops and 9 senior deacons, with no checked chapter tying
  Sequence 4 to a rank.
- Not found: the named Sequence 2 names and Paragon Sequence 5.
- Not attempted: C4, C9, Chained 2, White Tower 2 and the DWF62 substitute-ingredient lookup.
- The reader's own report miscounts "resolved" as 4; the correct count is 3.

**Net open (DWF64, LATER).** About nine LOTM items stay open or unattempted. A fresh bounded shard
should take C4, C9, Chained 2, White Tower 2, the Sequence 2 names and Paragon 5, with the wiki
through the in-app browser as a second route. Sonnet medium; done check: each item resolved or
recorded as not found with locators.

## Round 3: whole worlds, characters, dialogue and a local churn (2026-10-20)

Weibao: "what else is missing to implement entire worlds? what about characters? dialogue? more to
consider? Have local AI slow churn through them?" Design and tooling only; no runtime, save or
canon change. Evidence: [completion standard](WORLD_COMPLETION_STANDARD.md) S00-S14, the dialogue
owner's Missing D1-D6 ([dialogue](worlds/DIALOGUE_AND_INTERACTIONS.md#inspected-native-fit-and-missing-adapters)),
[characters](CHARACTERS_AND_WORLD_EVENTS.md) headings, and `scripts/lint_story_spine.mjs`.

The S-sections already name people (S04), dialogue (S10) and knowledge (S09), and D1-D6 already
list the engine gaps. What none of them names is below: tiers, time, volume, repetition and the
layer a line comes from. All items are proposals.

### ACT NOW (done)

- **DWF65 Local churn set up and piloted.** [Runner and queue](audits/local_churn_2026-10-20/run.mjs),
  21 tasks (worlds, characters, dialogue, each through 7 lenses) in `tasks.json`. One serial
  request at a time to the installed `qwen3.8:27b` (thinking off, 8k context), `nice 10`,
  detached in its own process group (PID in `queue.pid`, log in `queue.log`), resumable because a
  finished `out/<id>.md` is skipped. Pilot `dlg-verify`: 38 s, 639 tokens, about 17 tokens a
  second including load (one sample). Stop by PID or group, never `pkill -f`.
- **DWF66 Pilot read.** Items 1, 3, 4 and 10 (knowledge leak test, refusal state, return memory,
  tree cycles) are real checks; 5, 9 and 11 repeat D4 or are generic. The local model saw only
  document headings, so output is generic by design. Treat the queue as a cheap net, not a source.

### ACCOUNT FOR NOW (what is missing)

**Worlds**
- **DWF67 Cast tiers.** Default: principals authored, recurring people from templates plus overrides, crowd derived from name, occupation and look grammars the way items are. The dial is per world; reason: a book with 40 named people and a city with 40,000 cannot share one authoring route.
- **DWF68 Time-sliced character state.** Knowledge, goal, place and directed relationships at a timeline point, because divergence (S11) moves them and "who knows what when" is the commonest canon error. Sealed facts stay by ID (DWF37).
- **DWF69 Role vacancy.** When a named teacher, shopkeeper or antagonist dies or leaves, who fills the role. Default: a derived successor from the role template, with an in-world delay and cost, so a world never develops a hole.
- **DWF70 Everyone-knows layer.** News, rumors, festivals, idiom, local currency names, weather talk. It is separate from secrets (S09) and derived from the event log with a travel delay, so rumor speed matches the map.
- **DWF71 Long-play soak per world.** Advance N in-game years idle and measure dead states, stuck people, economy drift and text repetition. Crashes are the cheap half; repetition is what a player notices first.
- **DWF72 Thin-world fallback.** A partly written world should still play, with generic fill and a visible "unwritten" marker. Missing functionality is not not-applicable (completion standard), so the marker is how a gap stays honest.
- **DWF73 Content-volume ledger.** Per world: lines, scenes and people, by route (authored, grammar, local draft, frontier), with review state. This is where cost per world becomes visible.

**Characters**
- **DWF74 Voice sheet.** For each principal: diction, register, address forms per listener, taboo topics, tics, what they lie about, three anchor lines. Small enough to write, and it is the input that makes bulk drafting by a weaker model usable.
- **DWF75 Directed attitude to the player** by identity, body and reputation, using the identity owner's L4 rather than a second relationship model.

**Dialogue**
- **DWF76 Line layers.** Default stack: authored key scenes; templated barks keyed by voice, situation and knowledge channel; rumor and news lines derived from facts; optional runtime local-model expression limited to admitted facts (P15/T5 stay the owners). Each line records its layer, and every layer has a deterministic fallback.
- **DWF77 Dialogue lint.** Extend the `lint_story_spine.mjs` pattern (it already has a sealed-string canary): speaker cites a fact they cannot know, unreachable line, dead-end node, tree cycle, repeated-line rate, over-length, voice-sheet taboo hit. Static and cheap, so it also screens local drafts.
- **DWF78 Repetition budget.** Variant count and cooldown per speaker and situation; metric is the unique-line ratio over a one-hour idle session.
- **DWF79 Claimed versus true.** People may lie or withhold, so a line needs a "claimed" mark distinct from truth, feeding the evidence ledger (D5). Without it the player cannot be legitimately misled.
- **DWF80 Partial comprehension display.** How unknown-language speech renders as skill grows. The dialogue owner says learning needs practice; the on-screen form is unowned.
- **DWF81 Text can start before D1-D6.** Voice sheets, scene files and barks are plain text per the scene-writer packet, so content authoring and the knowledge-aware bridge can proceed in parallel.

### LATER / DELEGATE

| Code | Item | Level, effort | Done check |
| --- | --- | --- | --- |
| DWF82 | Triage `out/*.md`: dedupe against owners, land survivors in the right palette, drop the rest | Sonnet medium, one session | Each survivor has an owner link; each drop a reason |
| DWF83 | Second queue with real inputs: voice sheet plus fact packet per principal, then bark and variant drafts (LM1 first-pass, LM6 accuracy gate on 3-5 samples) | Local draft, frontier review of a sample | Sampled error rate recorded; drafts labelled `machine-drafted` until checked |
| DWF84 | Dialogue lint (DWF77) as a script with fixtures | Strong coder, one session | Fixtures for leak, cycle, unreachable and repetition fail as intended |
| DWF85 | Cast tier and crowd grammar for one world (LOTM first, since it has the census) | Opus design | Crowd records derive for one city district with no hand-written names |
| DWF86 | Soak harness with a repetition metric | Strong coder | One world advanced 10 in-game years, report of dead states and unique-line ratio |

### Churn triage (DWF82 done, 2026-10-20)

All 21 outputs finished, none failed. After de-duplication about 8 of roughly 250 items were new;
the rest repeat existing owners or each other. [Full triage](audits/local_churn_2026-10-20/TRIAGE.md)
lists routes and drops. Survivors are leads to check, since only item titles were reviewed.

- **DWF87 Memory growth.** Named people accumulate memory for years. Default: recent detail kept, older detail compressed into a relationship summary; dial per world; reason: save size and legible recall. Existing capped memory prose is the starting point.
- **DWF88 Line provenance mark.** Record and, where it helps, show whether a line is authored, templated, derived or model-expressed, and keep a log of which accepted speech came from where. Extends DWF76 and the frozen-speech rule.
- **DWF89 Rumor and refusal fixtures.** A rumor must not reach a place sooner than travel allows and decays without reinforcement; repeated refusal or persuasion must neither farm a reward nor lose all meaning. Both join DWF77's fixtures.
- **DWF90 Soak counters.** Add stale-loop count and accumulated lore contradictions to DWF71's report.
- **DWF91 Fixture set.** Random-start usable action (S02), one companion not duplicated across worlds (S12), trait and title conflicts, and name collisions within a district.
- **DWF92 Sealed canary in prompts.** Runtime or batch local prompts carry only admitted facts, and a canary string in sealed material proves it never reached a prompt or output. Reuses the lint's sealed-string canary.
- **DWF93 Voice swap test.** Remove speaker names from a sample of lines; a reviewer (or the lint, against the voice sheet) should still tell speakers apart. A cheap check on DWF74.
- **DWF94 Next queue needs real inputs.** Repeats DWF83: the next local run takes voice sheets and fact packets, with a 3-5 sample accuracy gate before any bulk run.

Local-model fit (measured once at about 17 tokens a second): good for brainstorm lenses, bark and
variant drafts from a voice sheet, name pools and census structuring (LM4); poor for canon
accuracy, key-scene prose and anything reasoning over sealed truth. Disk was 144 GiB free at
setup. Nothing here is accepted direction until Weibao says so.


## World-pack detail corrections, 2026-10-20

The [bounded correction audit](audits/world_pack_details_2026-10-20/REPORT.md)
reconciles current status against later receipts, without claiming a new world
implementation. HP now has 256 census rows: 32 full-passage and 224 window-level
checks; the final subject locator was directly checked in extracted text. A
spell spelling variant is retained with its stable ID and source windows.
These counts do not mean complete scenes, counters, instruction or seven-book
coverage. LOTM's 466 catalog rows still have 462 note-derived and four checked
evidence labels; targeted later resolutions live in sidecars and do not
automatically upgrade all catalog rows. Twelve-member ingredient sampling cannot
prove that a law is absent everywhere in the novel.

**ACCOUNT FOR NOW:** encode only the selected operation's supported source
conditions; preserve acquisition versus knowledge versus execution, sampled
observation versus author truth, settled transformations versus reusable tools,
and actual local-time/absence policy. Formulas remain attractors, not admission
gates (MR6–MR7); no missing grammar permits a formula-only canon world.

**LATER / DELEGATE:** resolve the exact LOTM sidecar IDs or an HP spell/recipe
scene only when the selected ring consumes them. Level: Luna low for a supplied
locator/field correction, Luna medium for bounded extraction, coordinator for
conflicting canon or shared mechanisms. Done check: each selected claim has a
locator, bounded scope and explicit disposition; its eventual runtime journey
uses the actual state owner and survives current-format round trips. Wider
catalog enrichment and full-world depth remain parallel proposals, not a new
barrier to the authorized Seer slice.
