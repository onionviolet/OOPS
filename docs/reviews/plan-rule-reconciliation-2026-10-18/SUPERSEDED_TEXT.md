# Superseded text from the 2026-10-18 plan/rule pass

Historical wording, not executable instructions. These are the exact removed/replaced fragments relative to the task-start copy of each edited file. All unrelated text remains in its owner. The earlier gap-report round-4 changes predate this turn and are not reconstructed here.

## docs/RULES_INDEX.md

```text
| Architecture rules | AR1–AR16 | Standing 2026-10-16 | All runtime code: composition root, domain registry, save slices, seams | [ARCHITECTURE_RULES](ARCHITECTURE_RULES.md) |
```

```text
| Making rules | MR1–MR36 | Standing 2026-10-15 | Potions, cooking, smithing, runes, enchanting, formations, constructs, any making | [MAKING_RULES](MAKING_RULES.md) |
```

```text
| Generation foundation rules | GR1–GR17 | Proposal 2026-10-14 | Contract for every generator | [GENERATION_FOUNDATION_RULES](GENERATION_FOUNDATION_RULES_2026-10-14.md) |
```

```text
| World absorption rules | WA1–WA21 | Proposal 2026-10-17 | Turning a read source into a world pack the shared engine plays: canon status, laws as rules, generated gaps, IDs, proof | [WORLD_ABSORPTION_RULES](WORLD_ABSORPTION_RULES.md) |
| Body and health rules | BHR1–BHR30 | Proposal 2026-10-17 (BHR1, BHR6, BHR14, BHR16 restate accepted AD13, AD8, AD19 and no hunger death; BHR21, BHR30 accepted through AD38) | Bodies, carriers, injury, illness, poison, healing, medicine, recovery, body wear across worlds | [BODY_AND_HEALTH_RULES](BODY_AND_HEALTH_RULES.md) |
| Combat rules | CBR1–CBR30 | Proposal 2026-10-18 (CBR1, CBR7, CBR9, CBR10, CBR13, CBR18 restate accepted AD19, AD20, AD25, AD28, AD8, AD38) | Fights, encounters, enemies, weapons in use, defeat and victory outcomes, fleeing, pursuit, captives, idle combat, nonviolent conflict | [COMBAT_RULES](COMBAT_RULES.md) |
| Economy rules | ECR1–ECR33 | Proposal 2026-10-18 (ECR1, ECR24, ECR27 restate accepted AD27, AD31, AD11) | Money, prices, merchants, trade, currencies, credit, wealth, property, carryover of wealth | [ECONOMY_RULES](ECONOMY_RULES.md) |
| Skill and learning rules | SLR1–SLR39 | Proposal 2026-10-18 (SLR2, SLR5, SLR17 restate standing MR21–MR23; SLR3, SLR15, SLR20, SLR24–SLR26, SLR32–SLR33, SLR38 restate accepted AD lines) | Skills, practice, teaching, texts, rust and loss, carrying skills across lives and worlds | [SKILL_AND_LEARNING_RULES](SKILL_AND_LEARNING_RULES.md) |
```

```text
| Any runtime code | AR1–AR16; AR14 for lane briefs, AR16 before calling it done | [ARCHITECTURE_RULES](ARCHITECTURE_RULES.md) |
```

```text
| Making or crafting of any kind | MR1–MR36, AD9, AD38 | [CRAFTING_ENGINE](CRAFTING_ENGINE.md) |
```

```text
| Generators, RNG, seeds | MR2–MR3, MR28, SR20, Rulebook 9; GR1–GR17 as the recommended contract | [Procedural status](PROCEDURAL_GENERATION_STATUS_2026-10-13.md) |
| A new world or book adaptation | Rulebook 2–3, AD1–AD5, MR11–MR15, SR1–SR3; WA1–WA21 for turning the source into a pack | [Rulebook precedent](RULES_FROM_SCRATCH.md#cross-world-audit-precedent-special-rules-and-little-details-2026-10-12), [completion standard](WORLD_COMPLETION_STANDARD.md), source research |
```

```text
| Bodies, health, injury, illness, medicine, healing | AD13, AD19, AD8, AD38, MR1–MR36; BHR1–BHR30 as the proposed rulebook | [Part 35 palette](worlds/world-depth-2026-10-13/35_HEALTH_INJURY_ILLNESS_DEATH.md), [body and health palette](BODY_AND_HEALTH_CONSIDERATIONS_2026-10-17.md) |
| Combat, enemies, weapons in use, defeat outcomes, fleeing, captives, conflict | AD8, AD19–AD21, AD25, AD28, AD38, BHR11, BHR13, BHR15; CBR1–CBR30 as the proposed rulebook | [Combat palette](COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md), [W2 combat grammar](worlds/world-core-kit-2026-10-14/W2_LAWS_POWER_COMBAT.md), [encounters and pursuit](ENCOUNTERS_AND_PURSUIT.md) |
| Skills, practice, teaching, talents that change learning, skill loss or carryover | MR21–MR23, AD3, AD6, AD8, AD11, AD17, AD38; SLR1–SLR39 as the proposed rulebook | [Skills and learning palette](SKILLS_AND_LEARNING_CONSIDERATIONS_2026-10-18.md), [SKILLS_AND_TALENTS](SKILLS_AND_TALENTS.md), [skill mechanisms](worlds/SKILL_MECHANISMS_AND_MEANS_2026-10-13.md) |
```

```text
| Economy, trade, property | AD27, AD31, AD38, MR5, SR15, SR19; ECR1–ECR33 as the proposed rulebook | [Requests and markets](gm/dispatch/procgen-2026-10-13/p11/REQUESTS_AND_MARKETS.md), [selling and merchant sinks round](gm/dispatch/procgen-2026-10-13/p11/REQUESTS_AND_MARKETS.md#selling-merchant-sinks-and-money-fun-consideration-round-1-2026-10-18), [economy palette](ECONOMY_AND_TRADE_CONSIDERATIONS_2026-10-18.md) |
```

```text
| Saves and persistence | Rulebook 9, AR6, MR3, MR30, MR33, SR22, AGENTS safety | Migration or explicit compatibility decision required |
```

```text
| AD38 | **Things work by how they work.** If a method, item or plan reasonably works by the mechanisms in play, it works, whatever its label, category or origin; nothing needs a permission list to happen. Costs, means and the world's actual mechanisms decide "reasonably". | [Things work by how they work](USER_VISION.md#things-work-by-how-they-work-2026-10-17) |
```

## PROJECT.md

```text
the codes that apply and restates accepted decisions as AD1–AD37 for aspects
```

```text
abilities, exploration and everyday interactions: readiness recovery,
conditional hardening, the existing stopped M3 gate, then one cross-domain reuse
proof. [EI13–EI22](docs/ENGINE_EXPANSION.md#future-fit-engine-plan-useful-depth-and-iteration-2026-10-16)
```

```text
There are 16 unit tests; nothing is wired into play yet. [Owner and open gates](docs/CRAFTING_ENGINE.md).
```

## docs/ARCHITECTURE_RULES.md

```text
| AR6 | **Namespaced save slices inside the existing envelope.** Each domain owns one key. A missing key means an older save: load it untouched with defaults. Changes need a migration or an explicit compatibility decision (AGENTS.md Safety). Keep the existing validation order and cross-owner checks when moving validators | Extraction silently breaking old saves or reordering validation that another owner depended on |
```

```text
## Status
```

## docs/GENERATION_FOUNDATION_RULES_2026-10-14.md

```text
| GR7 | **Tables select by tag query, not ID list.** "Things tagged `herb` and `wet` and not `toxic`." New content joins every relevant table by being tagged. | Every new item needing edits in ten tables; content nobody can reach |
```

```text
| GR17 | **Keyed by game time, not ticks.** Daily and hourly draws key on the in-game day or hour, never tick count, frame or real time. | Different results when the tab was backgrounded or offline catch-up ran |
```

## docs/BODY_AND_HEALTH_RULES.md

```text
| BHR28 | **Routines reroute around injury** to a fitting verb still available, and stop only when nothing fitting remains (AD16). (BHC6) | Silent idle loss, or idle work ignoring a broken arm |
```

## docs/COMBAT_RULES.md

```text
| CBR12 | **Each enemy template declares whether it can yield, flee, track and capture.** (CBC29, CBC30) | Animals that negotiate and bandits that fight to the death |
```

## docs/ECONOMY_RULES.md

```text
| ECR7 | **Several channels, each a real choice:** universal buyer for convenience, specialists for value, deep-pocketed buyers for volume, plus services, consignment and standing orders. None wins in every case. (M3, M4, M10, M5.2) | One dominant channel that makes the rest dead weight |
```

```text
| ECR9 | **Merchants price what they can judge.** A buyer cannot pay for a hidden property it cannot appraise, and a perfect appraiser is an identification means. (N2, A7, AD6–AD8) | Prices leaking sealed or unknown truths |
```

```text
| ECR15 | **Every coin has a named source and sink,** and every transfer conserves value. Intended money engines are allowed; this is accounting, not a cap. (ECC4, N5, AD22) | Coin appearing or vanishing without a cause |
| ECR16 | **One money authority:** one purse per currency, transactions through one seam, integer minor units per currency, and a plan for very large values. (ECC25, ECX1, A10, A15, A18; a target: 14+ direct writes exist today) | Features writing money directly, and overflow errors in long idle runs |
```

## docs/SKILL_AND_LEARNING_RULES.md

```text
| SLR20 | **Each layer carries by its carrier (accepted, AD11, CA2).** Understanding follows the journey's memory; fluency stays with the body; sources follow their custody; tools and notes follow item custody. (SLC28) | Full power in a new body, or full erasure of what the soul knows |
```

## docs/CRAFTING_ENGINE.md

```text
Date: 2026-10-15. Status: **engine source and unit tests only.** It is not imported by
`src/main.js`, has no UI and is not playable yet. Weibao's request is recorded in
```

```text
## Open gates (not done)
```

## docs/gm/dispatch/modular-seams-2026-10-16/BRIEF.md

```text
it does not launch or resume the run. M1/M2 have reported passing evidence; M3
is STOPPED, implemented-unverified, and M4 has not started. Read the current
checkpoint and M3 report before acting. The original dispatch is retained at
```

## docs/GENETICS_AND_HERO_START_PLAN_2026-10-17.md

```text
build plan; it does not restart them. Codes **GHS1–GHS111** are new and unused elsewhere
(round 1: GHS1–GHS40; round 2: GHS41–GHS65; round 3: GHS66–GHS83; round 4: GHS84–GHS111).
```

```text
`tests/domain_registry.test.js`, `tests/save_files.test.js` and `save_compatibility.test.js`
(slices, old-save load), `tests/character_bio.test.js` (heritage rows), `npm run check:arch`
```

```text
1366×768 with save, reload, Export and Import on a fresh, an old custom-bio and a mid-creation save.
```

```text
| GHS26 | **S1: Recorded beginnings** (first slice, one round) | `start` domain and slice; receipt written by PLAY, Roll and Begin; Beginning view with the existing three axes plus a **family** axis (orphan, farm family, scholar's household) and a **life stage** axis (adult default, youth) as tags and text; draft of three; Biography "How you began"; Journal first entry; old-save line | Fresh game: Choose a beginning, adopt a draft card, Begin; the card's facts show in Biography and Journal; save, reload, Export, Import keep the receipt and never reroll; old custom-bio save loads unchanged with the "before beginnings" line; PLAY one-click still works; classic starts; 1920×1080 and 1366×768 evidence; `check:arch` passes | Balanced implementer, strong reviewer for the save slice | M |
| GHS27 | **S2: Founder heredity and constitution** | `heredity` domain; `frontier.plain` model with about four small factors and two constitution traits (reuse Natural balance as one); founder draw from the receipt; expression into body sources and a `heritage` levelable bucket (GHS66, GHS69: one aptitude, one drawback aptitude); `selfHeritageView`; one discovery route in the Village (a healer or an elder's family memory reveals one latent factor) | A new character shows expressed traits exact and one "not yet known" row; the Village route turns it into a seen claim with its basis; reload keeps the draw; old save stays `drawn:false` until the route, then gains latent factors only | Balanced implementer, strong reviewer | M |
```

```text
| GHS39 | Time and offline (AD15–AD16) | Aging and growth use `game_time`; offline body time by formula only (MT2–MT3) |
```

```text
| GHS40 | Settings (AD21) | Body realism is a comfort setting (NA2); heredity effect size is a world dial, explained when changed |
```

## docs/audits/TOPIC_EXPANSION_AUDIT_PLAYBOOK.md

```text
7. **Commit** with [commit_own_paragraphs.py](tools/commit_own_paragraphs.py)
```

## docs/audits/WORLD_CORE_KIT_CORE_AUDIT.md

```text
8. **Commit** only this run's paths: `commit_list.py` for whole files and
```

## docs/audits/COMPANIONS_CORE_AUDIT.md

```text
   index with only your paragraphs (see the playbook), then reset those paths
   in the real index. Push and merge only on Weibao's explicit yes; the branch
```

```text
- Playable claims only with rebuilt browser evidence at 1366x768 (none so far).
```

## docs/reviews/SUBTLE_RULE_GAPS_2026-10-18.md

```text
| G4 | **One tag vocabulary.** A registry of tags with definitions, world-qualified extensions and a lint for near-synonyms. | GR7 tables select by tag, BHR23 interactions use tags, AD38 "works by mechanism" will lean on tags. `wet` versus `damp` silently drops content from tables. | GR7, GR8, BHR23 | Two docs mention a registry; none owns one |
```

```text
| G8 | **A small library of golden populated saves.** A few named saves (fresh, mid, late, multi-world) that every migration and UI discoverability check loads. | UR checks need "a populated save", GR16 wants golden snapshots, AR6 needs migrations. Each lane builds its own throwaway save, so old-save breakage is found late. | AR6, GR16, UI_RULES | No shared fixture save set |
```

```text
| G17 | **Frozen time is a large power, so it has an in-world cost.** Candidates: cheat or realm fuel, aging, supply drain, isolation effects, realm capacity. Weibao is the only player (AD22), so the cost is for the fiction, not anti-exploit. | Threats and rivals freeze too (AD25), so this is where "power is relative" (AD28) lives for time. |
```

