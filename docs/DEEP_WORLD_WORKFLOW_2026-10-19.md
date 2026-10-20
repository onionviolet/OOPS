# Deep world workflow: from source to past it (proposal, 2026-10-19)

Weibao, 2026-10-19: "workflow to deeply implement a world? all aspects of its
source material? extending beyond it? more to consider?"

**Status: proposal.** Nothing here is accepted (AD32), no runtime code changed and
no agent run started. Codes **DWF1 to DWF40** (prefix checked unused by `git grep`
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

## The stages

| Code | Stage | Owner | Input | Output | Done gate | Stop rule |
| --- | --- | --- | --- | --- | --- | --- |
| DWF1 | **Recover** what exists | Actionability P1, [world core kit audit](worlds/WORLD_CORE_KIT_AUDIT_PLAYBOOK.md) | Repo search for the source | Inventory: research, packets, code, open IDs | Every prior file has a disposition | Stop when new searches find nothing new |
| DWF2 | **Read** once, under budget | Deep dive playbook, AU1 to AU15 | Local text, wiki, fan routes | Private fact ledger with locators (AD35) | Coverage file shows read and reviewed spans | Read only spans a horizon needs (CX1) |
| DWF3 | **Census** the whole canon as data | Scale plan S5, kit K1 to K24, S00 to S14 | Ledger | Catalog records at Count/Address rung for every named person, place, thing, law, event | Coverage printout per kit part and section | Catalog, not playable; no tuning here |
| DWF4 | **Grammar and dials** | [Rule grammars](WORLD_RULE_GRAMMARS_AND_DERIVED_DETAIL_2026-10-19.md) DG, [world dials](WORLD_DIALS_AND_INTERPRETER_CONSIDERATIONS_2026-10-19.md) WDI, [deep-level lenses](worlds/WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md#round-21-deep-level-lenses-for-every-world-2026-10-19) KL1 to KL12 | Ledger laws and structures | Grammar rows that derive per-thing tags; dial profile | Each derived tag cites its grammar row; inference labelled | Derive only where the source states the rule |
| DWF5 | **Pack** | WA1 to WA21, `src/world_pack*.js` | Census, grammar, dials | Pack `id@revision` that lints | Lint clean except named WA4 law gaps | Lint is "pack valid", not absorbed (WA19) |
| DWF6 | **Rings** of play | WA6, scale plan S5 and P6, completion P4 | Pack | One playable ring at a time, signature loop first | Rebuilt browser at 1920×1080 and 1366×768 with save, reload, Export, Import (AR10) | One ring per checkpoint Weibao can play |
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
| DWF3 | Not started as catalog data | Research exists as prose and claims |
| DWF4 | Not started | DG-C lists LOTM as a target only |
| DWF5 | Not started; the Seer slice is hand-coded `book_world_lotm_*` files | [Initiation plan, runtime authorization](gm/LOTM_INITIATION_IMPLEMENTATION_PLAN_2026-10-15.md#runtime-authorization-and-first-engine-slice-2026-10-19), [LTS1 to LTS10](worlds/LOTM_SEER_SLICE_LAWS_2026-10-19.md) |
| DWF6 | Engine test slice passes; no native binding, UI or browser proof | Same; LP5 not started |
| DWF7 | COI planned as an era overlay (LC2) | Scale plan |
| DWF8 | Backlog named in the initiation plan | LIP3, LIP4 |

Another session owns the Seer slice files. This file cites them and changes nothing there.

## A runnable version (not run)

The stages map onto a Workflow script without new tooling. One pass for one ring,
under the session's ten-agent guideline:

1. One recover agent (DWF1), read only.
2. Up to four census readers in parallel, one kit-part group each, writing their own files (DWF3).
3. One grammar and dials agent (DWF4).
4. One pack scaffolder (DWF5), then lint.
5. One ring builder that owns the slice files (DWF6), then a separate verifier that rebuilds and drives the browser (DWF8).

Rough cost (**E**): eight or nine agents, most of it in census reading; readers at
Sonnet medium (AU5), the law encoding reviewed at Opus. Running it needs Weibao to
ask for a workflow run, and the ring builder must not overlap a session that owns
the same files (AR15).

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
