# Feature scout fold proposal, 2026-10-14

**PROPOSAL only.** Nothing here edits [PACKETS.md](../cross-game-synthesis-2026-10-14/PACKETS.md) or [modular production chains](../../MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md) until Weibao says yes. No packet rank, owner or gate changes; these are new source comparisons only.

Inputs: the "Feature answers" tables of the ten lanes in [feature scout SESSIONS](../../gm/dispatch/feature-scout-2026-10-14/SESSIONS.md). All ten exited by 21:08 with CHECKPOINT Status **PARTIAL**; every lane answered all of its feature questions, and PARTIAL refers to aspects, runtime and named gaps (see [section 4](#4-partial-lanes-and-gaps-worth-a-resume)).

Labels follow the lanes: **shown** = read in installed source, decoded data or decompiled code (no lane launched a game; Kittens Game also ran controlled browser fixtures); **stated** = wiki, tutorial or UI text; **inferred** = analysis. Every citation proposed below rests on at least one shown claim.

## 1. Summary

| Code | Packet | New donors proposed (shown claim) | Strongest new evidence | Gap no donor closed |
|---|---|---|---|---|
| FP1 | P01 | RimWorld, Project Zomboid, Kittens Game, Sapiens, Potionomics | Zomboid drying tooltip names pause cause and keeps progress; RimWorld binds the message to the actual scanner | No donor shows a durable last-result receipt; three show what to avoid |
| FP2 | P03 | Project Zomboid, RimWorld, Stardew Valley, Potionomics, Magical Diary | Zomboid and RimWorld keep learned XP or recipes on the actor after the book | Sapiens shows no teaching route (negative result) |
| FP3 | P19 | Magical Diary, Potionomics, Stardew Valley | Wolf Hall's paid poetry prep is read by a later scene | Rune Factory 5's paid branch stayed unread |
| FP4 | P02 | Stardew Valley, Potionomics, RimWorld, Rune Factory 5 | One parsnip, five shown destinations | No donor quotes destinations side by side; YAIRPG would be first |
| FP5 | P04 | Kittens Game, Project Zomboid, Sapiens, Magical Diary | Kittens tech fields split unlocked, researched, affordable and storage-limited, checked in browser fixtures | Only Sapiens shows an ownership layer |
| FP6 | Chains, bodies, research | TFC, Vintage Story, Sapiens, Zomboid, Stardew; RimWorld, Zomboid; Sapiens, RimWorld | Stage-specific interrupt policies (TFC) and lot-carried drying progress (VS) | Research donors show evidence-gated unlocks, not uncertainty or revision |

## 2. Proposed PACKETS.md "Source comparisons" edits

Each proposal appends to the existing line; nothing is removed. Link paths are relative to PACKETS.md (same depth as this file). Format matches the current lines: `[Name](path) (finding codes; proposal codes)`.

### FP1. P01 (PACKETS.md line 34)

**Append:**

> , [RimWorld feature pass](../rimworld/feature-pass-2026-10-14/REPORT.md) (F1; RWP1), [Project Zomboid](../project-zomboid/REPORT.md) (F5; ZP1), [Kittens Game](../kittens-game/REPORT.md) (F1/F2; K-P1/K-P2), [Sapiens](../sapiens/REPORT.md) (F5; S-P1), [Potionomics](../potionomics/REPORT.md) (F4; PO1/PO6).

Why each one counts:

- **RimWorld F1 (shown):** the work menu clears a fail reason, asks the actual job scanner, then shows a disabled option with that reason. Bill checks name low skill, medicine restriction or capacity. Caution, also shown: missing-material text names unmet requirement groups, not an exact stock deficit; some gates return no reason; one global last-reason slot. Takeaway: bind the blocker to the real predicate; do not copy the single slot.
- **Zomboid F5 (shown):** drying shows wetness, temperature, rate, paused state and cause, and saved work resumes when conditions improve. Counterexample in the same game: handcraft can log a failed predicate and stop silently; base timed actions return booleans only.
- **Kittens F1/F2 (shown by browser fixtures plus source):** shortage rows name resource and held/required amount; ETA appears only for a positive rate. Caution, shown: an impossible capped price still gets an arithmetic ETA. Causes are split across worker counts, rate stacks and logs, with no shared cause-plus-next-action receipt (absence inferred from bounded paths).
- **Sapiens F5 (shown):** plans keep typed missing tool, resource, storage, craft area, role, light, path and distance flags, and the UI formats them as concrete counts. Caution: `missingSkill` means "no allowed worker", not "no skilled worker".
- **Potionomics F4 (shown quote fields; overnight settlement unverified):** before brewing, the view quotes target, tier, price, counts, capacity and stability; after, result rows report actual quality change. Discard tooltip (stated) says progress and ingredients are lost. Takeaway: forecast and actual receipt as separate rows.

Cross-donor note for the P01 owner: none of the five shows a durable "last result" receipt joined to the blocker. That part of P01 stays YAIRPG's own, which matches the round 5 slice ([NEXT_SLICE_P01](../../gm/dispatch/topic-wave-2026-10-14/NEXT_SLICE_P01.md)).

### FP2. P03 (PACKETS.md line 57)

**Append:**

> , [Project Zomboid](../project-zomboid/REPORT.md) (F1/F2; ZP2), [RimWorld feature pass](../rimworld/feature-pass-2026-10-14/REPORT.md) (F4; RWP3), [Stardew Valley](../stardew-valley/REPORT.md) (F4; SD-P3), [Potionomics](../potionomics/REPORT.md) (F3; PO3), [Magical Diary: Wolf Hall](../magical-diary-wolf-hall/REPORT.md) (Q1/Q4; MD-P1).

- **Zomboid F1 (shown):** skill books give a retained page-progress multiplier for one two-level band, not XP; magazines teach recipe IDs kept on the actor; TV/VHS grants direct XP. Three routes, different costs, one actor state. Closest donor to "losing the book keeps the knowledge."
- **RimWorld F4 (shown):** lessons pair teacher and student jobs at desks; work watching reads the adult's real job skill; books train skills below quality ceilings and XP stays on the pawn. Do not import its caps or daily slowdown.
- **Stardew F4 (shown; friendship-mail path unread):** level-ups, TV episodes, letters, friendship-tagged recipes and shop recipe items all write the same learned-recipe dictionary, independent of ingredients.
- **Potionomics F3 (shown):** relationship rank-up dialogue grants stable-ID haggle cards; library and active deck are separate; friendship and romance branches can grant the same card. Teacher route only, no manual route.
- **Magical Diary Q1 (shown):** a successful class check teaches a spell that is then usable in the dungeon; study raises Smart (MP capacity) with stress cost. Assessment reads dungeon actions, not a grade roll. Q4 compares it with Academagia (judgment inferred).

Negative result worth recording beside the line: **Sapiens F2** found no teacher-to-learner route (search-scoped inferred negative); it supports practice (P09), not P03.

### FP3. P19 (PACKETS.md line 80)

**Append:**

> , [Magical Diary: Wolf Hall](../magical-diary-wolf-hall/REPORT.md) (Q2; MD-P3/MD-P5), [Potionomics](../potionomics/REPORT.md) (F1; PO4), [Stardew Valley](../stardew-valley/REPORT.md) (F3; SD-P4).

- **Magical Diary Q2 (shown):** poetry prep offers a $16 anthology, $4 magazine or own writing; the broke fallback adds 3 stress; a later performance reads that preparation plus Smart 25 and changes relationship gain. A failed relationship-gated attempt removes that candidate for the exchange. Best fit for "spends a real resource, can fail, failure changes later actions." Caution: Smart thresholds are gates, not costs.
- **Potionomics F1 (shown):** haggle cards spend customer patience; stress at 100 fails first; a closer can finish before the patience check, so the zero-patience tooltip omits an exception. Failure goes to refusal dialogue; stress is retained in the profile and can spoil later draws (stated). No long-term relationship or offer penalty was shown, so do not invent one.
- **Stardew F3 (shown):** event keys combine an ID with conditions; one event requires friendship points, funds and calendar/location, then offers a paid fork; `$r` responses can change friendship. Caution, shown: generic event money commands clamp below zero, so it is not a stale-quote guarantee.

Not cited: **Rune Factory 5 F3** shows choice and gold-change command IDs, but its paid or failed branch is unread (gap G3 below).

### FP4. P02 (PACKETS.md line 103)

**Append:**

> , [Stardew Valley](../stardew-valley/REPORT.md) (F1; SD-P1), [Potionomics](../potionomics/REPORT.md) (F2; PO2), [RimWorld feature pass](../rimworld/feature-pass-2026-10-14/REPORT.md) (F2; RWP2), [Rune Factory 5](../rune-factory-5/REPORT.md) (F1; RF-P1).

- **Stardew F1 (shown):** one parsnip item is sale stock, gift, soup ingredient, bundle contribution and machine input; each route has its own menu and quote style.
- **Potionomics F2 (shown):** 206 ingredient rows feed 20 ratio rows; one element-bearing root can serve two potions; potions go to shop, requests, competition and adventure, ingredients also to gifts.
- **RimWorld F2 (shown; cross-system reading inferred):** bills scan in bench order and reserve actual stacks; stockpile priority picks hauling destinations, not bill entitlement; target mode pauses and resumes at thresholds. Takeaway: quote from one owner's free stock and keep transport priority separate from allocation.
- **Rune Factory 5 F1 (shown schema and values; runtime admission inferred):** destinations join through item identity across recipe, strengthening, NPC-preference and price tables; not every item is valid everywhere.

Shared finding for the P02 owner: all four donors, plus Kittens F4 (stated), expose competing uses in separate views. **No donor quotes them side by side.** The packet's side-by-side quote is YAIRPG's own design, with these donors as evidence that the multi-destination stock itself is common and readable.

### FP5. P04 (PACKETS.md line 126)

**Append:**

> , [Kittens Game](../kittens-game/REPORT.md) (F3; K-P4), [Project Zomboid](../project-zomboid/REPORT.md) (F2; ZP4), [Sapiens](../sapiens/REPORT.md) (F3; S-P2), [Magical Diary: Wolf Hall](../magical-diary-wolf-hall/REPORT.md) (Q3; MD-P4).

- **Kittens F3 (shown by controlled tech-model fixtures plus source):** tech unlocked and researched, building unlockable/unlocked/count/on, affordability and storage limit are separate fields and evaluators. Not an actor permission system.
- **Zomboid F2 (shown; rendering untested):** `knownRecipes`, `needToBeLearn`, required skill, selected inputs, kept tools, surface and output capacity are separate; the panel shows each and disables Craft when the cached predicate fails. A nearby recipe reference can bridge a one-level skill shortfall. No ownership or legal permission layer shown.
- **Sapiens F3 (shown; "whole now" distinction inferred):** discovered skills gate plans; role priority permits workers; storage owner, alliance and local overrides permit stock use; tools, facility, light and path decide feasibility. **The only new donor with an ownership/permission-to-use-stock layer.**
- **Magical Diary Q3 (shown branches):** spells stay learned when MP or target conditions block casting; rules are authored social constraints, not a global gate.

Also relevant, not proposed for the line: **TFC P02/P04 guide row** (shown that guide entries are read by default and recipe transfer ignores fluids; the "four layers" conclusion is inferred). It belongs in the chains note below.

## 3. Proposed notes for modular production chains

Proposed as a new **Round 6** section after round 5, codes `FS1..FS9` (no collision found in the doc). Corrections first, then evidence. None changes the round 5 pick order (P01 slice, then T4 narrowed dry, kit, useful use).

### Corrections or cautions (proposal)

| Code | Root or round claim | Feature scout evidence | Source |
|---|---|---|---|
| FS1 | MS stages could share one interruption rule | TFC shows three policies on one mod: early unseal resets hide and brining elapsed time with inputs unchanged; wet brick drying resets in rain; invalid pit kiln cancels firing, consumes fuel, keeps contents. Vintage Story blocks early barrel opening. Stage-specific policy, not one rule | [TFC](../minecraft/tfc-chains-2026-10-14/REPORT.md) (CH barrels, drying; P1), [VS](../vintage-story/REPORT.md) (F1) |
| FS2 | Climate as a general chain modifier (round 5 pick 5, "one local drying law") | TFC hide recipes have no season or temperature predicate; only brick drying checks rain. Attach climate only to stages whose predicate reads it, as P6 already parks | [TFC](../minecraft/tfc-chains-2026-10-14/REPORT.md) (G5; P6) |

### New evidence (proposal)

| Code | Donor, shown claim | Angle for chains | Owner it touches |
|---|---|---|---|
| FS3 | Vintage Story F2: a stack carries transition durations, elapsed effective hours and last update; old conditions settle before a move | Progress belongs to the lot; settle then move | T4 dry stage, round 5 pick 5 |
| FS4 | Sapiens F4: passive drying evolves items on world-time callbacks (covered x4), while firing and cooking are staffed sequences; the urn returns through grinding and dough | Separate passive change from staffed work; return containers | T4, MS stages, AG who does each stage |
| FS5 | Zomboid F3: hide chain branches by butchering method; size-specific racks dry hides unattended and weather-sensitive; forge and kiln are staffed bench recipes | Real branch points and job-specific clocks | FC3 branching graph, T4 |
| FS6 | Stardew F2: machines keep an input snapshot and rule ID; removing an unfinished ordinary machine loses consumed inputs, a cask ejects its item; failed collection keeps output | Name consumed inputs, recoverable custody and uncollected output separately; choose cancel rules explicitly | P01 receipts, salvage |
| FS7 | TFC kit row: tool head plus rod copies the forging bonus from the head; copper pick mold always breaks. VS F5: API supports copy, merge and averaging, but vanilla flags are unread | A part carries selected properties into the kit; declare a per-part output contract, do not promise all traits survive | T4 kit branch, TFC P2, VS P5 |

### Bodies and research (proposal; owners outside chains, note only)

| Code | Donor, shown claim | Takeaway | Owner |
|---|---|---|---|
| FS8 | RimWorld F5: gender, body and head type, health hediffs and gene tracker are separate saved fields; xenotype is a definition plus gene lists, not the whole body. Zomboid F4: each trait has named readers (reading time, XP, wound timers); medical UI reads per-part wounds. Both warn that separate storage does not prove independent behavior | Field-by-reader matrix; name each field's real reader before adding one | Bodies owner (RWP6, ZP5) |
| FS9 | Sapiens F1: research needs an eligible action, tools and materials, and tribe knowledge outlives the investigator. RimWorld F3: techprints, bench, hidden prerequisites and books are separate gates | Evidence-gated unlocks are shown; **uncertainty and revision are not**: both lanes found no correction ledger in scoped paths. Keep P11 (Heaven's Vault et al.) as the revision donor | P11 / research owner (S-P4, RWP5) |

## 4. PARTIAL lanes and gaps worth a resume

All ten lanes ended PARTIAL. All feature questions are answered; PARTIAL covers aspects, runtime (launch was forbidden) and named gaps. Ranked by value to the five packets; the rest are not worth a resume now.

| Rank | Code | Lane | Gap | Why it pays |
|---|---|---|---|---|
| 1 | Q1 | fs-kittens | Natural build/craft progression, worker starvation and engineer stops, save/reload/import | Only free browser game: a native run is allowed and would give P01 an observed (not source-only) blocker and receipt donor |
| 2 | Q2 | fs-rune-factory-5 | G3 binary event commands and the paid or failed branch | Would turn RF5 into a P19 citation; pack and index are already acquired |
| 3 | Q3 | fs-potionomics | Overnight brew reducer, final quantities | Closes the forecast-versus-actual receipt end to end for P01 |
| 4 | Q4 | fs-stardew | Friendship-recipe letter enqueue and duplicate handling | Bounded; confirms a social route into the shared recipe dictionary for P03 |
| 5 | Q5 | fs-rune-factory-5 | G4 helper output destination and exact blockers | Second P01 helper-work comparison |

Not worth a resume now: Vintage Story (needs paid assets or runtime), Zomboid and TFC runtime gaps (launch forbidden), RimWorld native and DLC breadth (bf-rimworld owns native; it can use the extract at `~/.codex/research/fs-rimworld-features/extract/`), Sapiens (its checkpoint says feature questions need no further search), Magical Diary final assessment (low packet value).

Resume route (from [SESSIONS.md](../../gm/dispatch/feature-scout-2026-10-14/SESSIONS.md)), run from `docs/gm/dispatch/feature-scout-2026-10-14/`:

```bash
python3 runs/launch.py <lane> <prompt_file> <session id>
```

`launch.py` runs `codex exec resume <id> <prompt>`, so the prompt file becomes the next message. Pass a short gap-only prompt (for example "Resume Q2: decode G3 only; update REPORT F3, FINDINGS and CHECKPOINT; same rules") rather than the original lane prompt, or the lane will restart its whole brief. Session ids are in the SESSIONS table. Kittens Q1 also needs the prompt to permit a local browser run, which its original prompt allowed only as controlled fixtures.

## 5. Housekeeping observed

- All game-level `private/` folders created by these lanes are gitignored (`git check-ignore` passed). No nested `private/` under `rimworld/feature-pass-2026-10-14/` or `minecraft/tfc-chains-2026-10-14/`; RimWorld kept deep detail in its `~/.codex` work area instead.
- Nothing committed. The coordinator commits each lane output dir per SESSIONS.md.
