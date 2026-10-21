CHECKPOINT: KL-MAP-A, 2026-10-19. Doc-level, one new file. Nothing else edited, committed, switched or pushed; no raw novel text opened, nothing acquired, no agents or API spend. Everything below is a proposal, not an accepted decision. Written from cards, ledgers, deep dives and code headers. Sibling file: [KL_MAP_B](KL_MAP_B_ANIME_AND_OTHERS.md) covers the anime worlds.

# KL-MAP-A: lenses KL1 to KL12 for the book worlds

Fills the book-world half of the Round 21 per-world map ([successor root, Round 21](../../worlds/WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md#round-21-deep-level-lenses-for-every-world-2026-10-19), lenses KL1 to KL12, lessons KR21-1 to KR21-10). Worlds: Mother of Learning (MoL), Lord of the Mysteries (LotM), Circle of Inevitability (COI), Shadow Slave (SS), Reincarnation Paradise (RP), the five TTKS books (B1 to B5), and A Soldier's Life (SL).

## 0. Conventions, privacy and where the cards are thin

- **Labels.** Unmarked cells in the TTKS and SS tables inherit the label of the card row or deep-dive row they cite. SHOWN = read in a file at the locator. STATED = a doc or ledger asserts it, locator given. INFERRED = my reading, labelled each time. MEMORY = recall; I confirmed nothing from it. Status = evidenced (a file carries the structure with locators), partial (some of it, or as INFERRED/proposal), none (searched, nothing found), silent (searched, the ledger does not say; that is not the same as none). A stated absence in a ledger is its own case and is marked "stated absence".
- **Locators.** `card/<name>:N` = [cards](../../worlds/world-core-kit-2026-10-14/cards/) line N. `rn/` = `docs/research/novels/` (private, gitignored; named here by path, not quoted). `ph/` = `docs/worlds/paradise-hub/`. `mol/` = `docs/worlds/mother-of-learning/`. Law codes (ML-L1 and so on) are the W2 K2 rows on the cards.
- **Privacy (SHOWN rule, `rn/.../REPORT.md` for SL; LotM deep dive header).** Private-pack canon: this file keeps counts, IDs and locators, not name tables, source prose or character detail. No sealed secret is cited; I read no K11 secret content, so none is referenced.
- **F1 (SHOWN, thin cards).** The ten cards are W19 consolidations of one template; their checkpoint says W19 did no new canon research or semantic verification (`card/mother-of-learning:5`, same line pattern in the others). Most K-section floors are boilerplate ("deep: UNASSESSED"). The lens-relevant content on a card sits in its W2 law rows (K2, K3) and little else. A card says nothing about tier ladders, relation graphs or formula structure as such; those come from the deep dives and ledgers below.
- **F2 (SHOWN, scope of my reading).** Per card I read the header, the W2 law rows and K3/K10 text, not the 760 to 997 lines. Other K sections (K5 to K9, K11 to K20) were not read, so "none" under KL3, KL7, KL8, KL10 means "not found in the files I opened", and is listed in section 10.
- **F3 (SHOWN).** The root keeps the worlds as one profile type with "Defaults and dials" in each card header (`card/mother-of-learning:19` pattern) but no typed dial registry exists (root Round 21, KL1 row, `WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md:268`). KL1 is therefore at best partial for every world.
- **F4 (SHOWN, live code).** Two worlds have dedicated runtime modules, by file name: `src/book_world_mol_*.js` (ids, content, state, actions, host, native; headers state "definitions initialize no means", `book_world_mol_ids.js:1-2`) and `src/book_world_paradise_*.js` (ids, content, carriers, campaign facts/host/runtime; `book_world_paradise_campaign_facts.js:1-2`). A name grep over `src/` for LotM, SS, TTKS and COI strings hits generic files (`book_world_player_agency_contracts.js`, `feature_expansion_book_recognition.js`, `realm_traveler_profiles.js`); I did not open them. No code encodes a tier ladder, relation graph or formula grammar for any of these worlds.
- **Framing.** Default + Dial + Reason throughout. A row says what the source or ledger shows by default, which setting could turn per world, and the in-world reason; nothing is a fixed rule for every world.

## 1. Cross-cutting lead check summary (KL4, KL5, KL6)

| World | Round 21 lead (MEMORY in the root) | Verdict | One-line reason |
|---|---|---|---|
| MoL | Ward and mind-magic rule structure (KL5, KL6) | KL6 partly confirmed, KL5 corrected | `MAGIC_SYSTEM.md` has a Warding subsection: architecture plus material, geometry, interactions and a power budget; entrance-level versus full wards; breaking by siphon, break or bypass with stated conditions (`:226-232`), and a 92-row list of spells and items with branch and cost labels including wards (`:341-436`). That is rule structure (KL6). Counter-type rows exist as single facts (a dispelling wave counters spells `:356`, anti-divination wards block locate and scry `:375,377`), not a graph, so KL5 stays partial. Mind magic: resisted by mages (`:74`), a guild-punished branch (`:330`), a named exercise family (`:134`). Circles: five are named (0th, 1st, 2nd, 3rd, 7th) and spell membership is mostly UNKNOWN (STATED, `:473`). |
| LotM | Sequence ladder as ordinal tier (KL4); formula structure (KL6) | Confirmed, plus a KL5 find | 22 pathways by Sequence 9 to 0 (`rn/lord-of-mysteries/PATHWAYS_DEEP_DIVE_2026-10-10.md:43`), formula schema (`:138-139`). The root map omitted KL5: neighbor-swap groups with locators (`:107-115`). |
| COI | Unknown, check the card | Evidenced now | Same ladder family as LotM (`rn/full-book/circle-of-inevitability/POWERS.md:18-22`; deep dive `:56-70`), plus boons graded 9 to 0 and characteristic folding. |
| SS | Rank ladder as tier (KL4) | Corrected | Two ordinal axes, not one: seven human ranks and a seven-step class by soul-core count (`rn/shadow-slave/SYSTEMS_DEEP_DIVE_2026-10-10.md:50-51,67-82`). Rank-up is a gate event, not a threshold (`:52`). |
| RP | Instance rule families (KL1) | Partly confirmed, emphasis corrected | Mission lifecycle with explicit Dial language exists (`ph/DERIVED_WORLDS_AND_MISSIONS_2026-10-14.md:103-122`). The deeper structure is a tier/attribute/enhancement/currency ladder (F17 to F22, `ph/CANON_PRIORITY_PLAN_2026-10-14.md:44-49`). No catalogue of per-instance rule families exists in what I read. |
| TTKS B1 to B5 | Power-bill cost structure as a dial (KL1) | Corrected for meaning, confirmed for B5 | The phrase belongs to B5: a power bill is observable evidence, so utility contracts and local generation become useful paths (STATED proposal, `docs/gm/dispatch/procgen-2026-10-13/p9/TTKS_B5.md:33`; `p9/REPORT.md:66`; kit root `docs/worlds/WORLD_CORE_KIT_2026-10-14.md:73`). It is an information trace, not itself a cost dial. B5's cost dial is electricity per charge (R3). The other four books have different cost structures (section 6). |
| SL | Low-magic supply and ration structure (KL3) | Low-magic half corrected; ration half unverified | The world has dimensional-storage magic with fuel and attention costs (`rn/soldiers-life-world-2026-10-09/DESIGN.md:26,28,46`). `DESIGN.md` and the world-depth `REPORT.md` have zero hits for ration, but `rn/world-depth-2026-10-11/source/SOURCE_INVENTORY.json` has 20 ration/rations tokens (counted, content unread under the opaque-ID rule). Whether they form a ration structure: unverified. |

## 2. Mother of Learning (MoL)

Sources: [card](../../worlds/world-core-kit-2026-10-14/cards/mother-of-learning.md), [brief](../../worlds/mother-of-learning/WORLD_BRIEF.md), `rn/mother-of-learning/SYSTEMS_DEEP_DIVE_2026-10-10.md` (108 chapters plus epilogue; chapters 56 to 82 and 90 to 106 as keyword windows, `:11-14`), readers `MAGIC_SYSTEM.md` (92 spells and items, 36 shaping exercises) and `LOOP_INERTIA.md`. Live code: `src/book_world_mol_*.js` (narrow retained-visitor branch; `card/mother-of-learning:378-383` says the wider native-mage system is missing).

| Lens | Status | Evidence pointer (label) |
|---|---|---|
| KL1 dials | partial | Inertia is a per-world setting; MoL takes the weak setting (STATED, deep dive §3, `rn/mother-of-learning/SYSTEMS_DEEP_DIVE_2026-10-10.md:60-69`). Loop budget and carrier classes are settings candidates (`:44-58`). No registry. |
| KL2 material families | partial | Personal mana, environmental source and ward/device fuel are distinct (SHOWN, ML-L1 `card/mother-of-learning:378`); ambient mana is toxic with a hazard order (STATED, deep dive `:30-31`). Axis mapping to the frontier axes: unchecked. |
| KL3 supply forms | partial | Finite counted stock of paper, ink, cube, rope, oil and paid specialist mana (SHOWN, `mol/WORLD_BRIEF.md:31,39`). Donor/route supply for native mages: none found. |
| KL4 interaction laws, tier | partial | Ordinal tier exists: circles of clearance and difficulty (STATED, `MAGIC_SYSTEM.md:94`); five circles are named (0th, 1st, 2nd, 3rd, 7th) and spell membership is mostly UNKNOWN (STATED, `:473`). Neutralize-type row: dispel versus ordinary fuel (ML-L3 `card/...:380`). Saturate: mind-lesson diminishing returns (`MAGIC_SYSTEM.md:149`). Law-family labels are INFERRED. |
| KL5 relation graph | partial | Single counter facts, not a graph: dispelling wave versus spells, anti-divination wards versus locate and scry, three ward-breaking methods with conditions (STATED/SHOWN, `MAGIC_SYSTEM.md:231,356,375,377`); card text on enemy wards as specific protections is a proposal (`card/mother-of-learning:418`). |
| KL6 rule-grammar | partial | Ward structure: material, geometry, interactions and a power budget, with a breaking taxonomy (STATED, `MAGIC_SYSTEM.md:226-232`). Exercise prerequisite graph and per-exercise mastery/speed (STATED, `MAGIC_SYSTEM.md:134,168`); formula must anchor an actual spell, copy is not function (ML-L4 `card/...:381`; brief `:31`). Grammar derivation itself: none. |
| KL7 tags, subtle properties | partial | Presence versus degree: soul perception is a gate with three routes of different cost (STATED, deep dive `:36-42`); mana "magnitude" is degree (`:16-22`). Look-alikes and residues: silent. |
| KL8 knowledge claims | partial | Information items carry type, decay clock and carrier (INFERRED engine shape, deep dive `:79-83`); foreknowledge half-life (STATED `:53-58`). Teacher reliability: silent. |
| KL9 naming | none | Spells and exercises are named lists; no structure-in-names evidence found. |
| KL10 display | none | No lens-specific display evidence. Card K14 not read (F2). |
| KL11 source tier and cost | evidenced | Ledger-first is cheap: two reader files plus the brief. Named coverage gap: chapters 56 to 82 and 90 to 106 read as keyword windows (STATED, `SYSTEMS_DEEP_DIVE:11-14`). |
| KL12 golden cases | partial | Source-law table MOL-C001/002/011/PS036 in the brief (`mol/WORLD_BRIEF.md:27-31`) and a worked specimen (`mol/GW1_GW3_LOCAL_RULE_AND_APPROACHES_2026-10-15.md`). Not framed as derivation goldens. |

- **Cheapest next lane (KMA-1).** Ledger-based: turn `MAGIC_SYSTEM.md` circles, the Warding subsection, exercise prerequisites and diminishing-returns rows into one sidecar table with locators (circle tier, prerequisite edges, saturation note).
- **Done check.** Every circle/exercise row has a `MAGIC_SYSTEM.md` locator and a label; five rows chosen as goldens each reproduce from the table; the table states what is silent (counter rows, circle count).
- **Reading cost vs AU3.** 0 source words (reader files exist). If a gap read is later chosen for the keyword-window chapters, one AU3 default envelope (four invocations, 48,000 source words, AU10 12,000 words per reader) is the ceiling; actual chapter word counts not measured here.
- **Top risks.** R1: the narrow visitor branch is a nonmage by design (`card/mother-of-learning:372-376`), so native-mage lens data could be built before any consumer exists. R2: inference of "circle" as a numeric ladder from one sentence; the full circle count and which spells sit in which circle are unverified (`MAGIC_SYSTEM.md:473`).

## 3. Lord of the Mysteries (LotM) and Circle of Inevitability (COI)

Sources LotM: [card](../../worlds/world-core-kit-2026-10-14/cards/lord-of-mysteries.md), `rn/lord-of-mysteries/PATHWAYS_DEEP_DIVE_2026-10-10.md` (424 lines; targeted reading of 1,394 chapters, not cover to cover, `:10-15`), readers `LOTM_PATHWAYS_A/B/C.md`, `LOTM_RULES.md`, `WIKI_CROSSCHECK_2026-10-10.md`, `REFINEMENT_CASES.md` (96 lines), [HP/LOTM next feature doc](../../worlds/HP_LOTM_NEXT_PLAYABLE_FEATURE_2026-10-15.md). Sources COI: [card](../../worlds/world-core-kit-2026-10-14/cards/circle-of-inevitability.md), full-book folder `rn/full-book/circle-of-inevitability/` (COVERAGE.md: 1,178 of 1,178 narrative members read, reviewed and integrated; 3,161 integrated claims; unauthenticated compilation with suspected machine translation, `COVERAGE.md:3-12`), `POWERS.md`, `claims.json`. No runtime module for these two (F4).

### 3a. LotM

| Lens | Status | Evidence pointer (label) |
|---|---|---|
| KL1 dials | partial | Several conflicts are explicitly "settle per world, not errors" (e.g. swap point, sefirah assignments from wiki, STATED, deep dive `:116-118`). Heredity (L11) and loss-of-control causes (L7) are dial candidates (`:53,49`). No registry. |
| KL2 material families | partial | In the stated ordinary case characteristics are not destroyed and are conserved within a pathway (L2, L3, `:44-45`); formula = main[] plus aux[{item, qty}] (`:138-139`). |
| KL3 supply forms | partial | Formulas trade for money (STATED, `:339`); markets, church custody (LM-L5 `card/lord-of-mysteries:370`); a Tingen market stub in the slice proposal (`:395-409`). Wild-site supply: silent. |
| KL4 interaction laws, tier | evidenced | Ordinal ladder: 22 pathways by Sequence 9 to 0, groups 9-8 low, 7-5 mid, 4-3, 2-1 (SHOWN/STATED L1, `:43`; 220 slots named, about 205 from books, rest wiki, `:100-103`). Conservation within a pathway and aggregation (L3, L4) are saturate/synergize-shaped (INFERRED mapping). |
| KL5 relation graph | evidenced | Neighbor-swap groups stated with locators: eight groups plus one pathway with no standard neighbor (my count of `:107-115`; INFERRED count), non-neighbor switch ends advancement (L8, `:50`). This is a ready relation graph the root map missed. Opposites/counters: silent. |
| KL6 rule-grammar | partial | Potion-name principles (L6, `:48`: about three acting principles per potion name in COI) and formula schema; full formula chains exist for five pathways, about 50 formulas across 220 slots (STATED, `:103,361`). Abilities thin above Sequence 5; formulas above Sequence 5 missing for most pathways (`:420`). |
| KL7 tags, subtle properties | partial | Mythical-creature form from Sequence 4 as a toggle with strain (L10, `:52`); folded characteristics (COI addition, `:56-58`). Residues from rushing: stated as a loss-of-control cause (L7). |
| KL8 knowledge claims | evidenced | Divination misleads, has rank limits and can be blocked (L12, `:54`; LM-L4 `card/lord-of-mysteries:369`). Reader files label shown/stated/inferred/memory (`:22-24`). |
| KL9 naming | partial | Honorific names reach their owner; wrong names draw hostile attention (L12). Key on the Chinese because English glosses vary for at least two Abyss steps (STATED, `:116-118`). Under KR21-3 the potion-name-to-principle link is source-stated here, so it is a labelled hint, not an effect source. |
| KL10 display | none | No lens display evidence found. |
| KL11 source tier and cost | evidenced | Ledger-first is rich. Named gaps: formulas above Sequence 5, Fool/Error/Door swap point, sefirah assignments from the wiki (`:416-424`). |
| KL12 golden cases | partial | `REFINEMENT_CASES.md` is "pending original case and fixture specification, not implemented" (SHOWN, `:3`); slice proposal Seer 9 to 7 with real formulas (`:395-409`). No derivation goldens. |

- **Lead check.** KL4 and KL6 leads confirmed; KL5 added (neighbor swaps). Verdict above.
- **Cheapest next lane (KMA-2).** Ledger-based: a LotM relation sidecar with the swap groups, the singular-seat rule (L5) and the five stated loss-of-control causes (L7) as rows with locators, plus the ladder as an ordinal tier row set (counts).
- **Done check.** Group membership counts sum to 22; each edge has a `PATHWAYS_DEEP_DIVE` or reader locator; the Fool/Error/Door swap point is carried as an explicit conflict row.
- **Reading cost vs AU3.** 0 words for the sidecar. A formulas-above-Sequence-5 gap read would be one AU3 default envelope at most, with exact chapter ranges taken from `INTAKE.md` and the reader files before dispatch (KR21-7). The Chinese text has no measured words-per-chapter ratio in my files; any word estimate would be INFERRED and I give none.
- **Top risks.** R1: the deep dive says readers were Sonnet subagents with core laws rechecked by Claude (`:27`); the neighbor groups are reader output with locators, not independently re-read. R2: wiki-sourced slots (about 15 of 220 names, three sefirah groups) can leak into the sidecar as if book-stated.

### 3b. COI

| Lens | Status | Evidence pointer (label) |
|---|---|---|
| KL1 dials | partial | Boons versus potions have different acquisition and burden (CI-L1 `card/circle-of-inevitability:367`); numerical danger statements stay attributed (card `:372` area). No registry. |
| KL2 material families | partial | Characteristics fuse with their storage after two to three days; swap storage every 24 hours (STATED, `POWERS.md` row at line 23); a characteristic is 20 to 30 percent more dangerous than a potion at low Sequence (c, `POWERS.md`). |
| KL3 supply forms | partial | Characteristics trade as stock at stated prices (w, `POWERS.md`); boons come from patrons. |
| KL4 interaction laws, tier | evidenced | Same Sequence ladder; boons are graded 9 to 0 for convenience (STATED, LotM deep dive `:59-63`). Storage fusion over days is age-shaped (INFERRED mapping). |
| KL5 relation graph | partial | Neighbor switch is stated and risky (c, `POWERS.md:18`); a fuller COI neighbor list is in `rn/lord-of-mysteries/readers-2026-10-10/COI_PATHWAYS_*.md` (not opened). |
| KL6 rule-grammar | partial | Acting is per actor and "no universal table" for principles (STATED, `POWERS.md:21`); formula chains for just two COI lines, so coverage is thin (STATED, deep dive `:103`). |
| KL7 tags, subtle properties | partial | A boon carries the bestower's imprint, may mismatch the body, several raise overload risk (c, `POWERS.md:36-37`). |
| KL8 knowledge claims | evidenced | Strongest of the set: every claim carries status w (witnessed), n (narrator), c (character claim), a (actor inference); claims are attributed, not truth (SHOWN, `POWERS.md:7-9`). |
| KL9 naming | partial | Translation is suspected machine translation, so naming is a low-confidence layer (STATED, `COVERAGE.md:3`). |
| KL10 display | none | No evidence. |
| KL11 source tier and cost | evidenced | 1,178 of 1,178 members integrated; 3,161 claims; but the edition is unauthenticated (`COVERAGE.md:3,10-12`). |
| KL12 golden cases | partial | A 131-claim stratified sample with eight EPUB checks found 11 errors, all repaired (SHOWN, `COVERAGE.md` final audit); two paragraph-check receipts exist. These test the ledger, not a grammar. |

- **Lead check.** Round 21 said "Unknown, check the card". The card (`card/circle-of-inevitability:356-372`) carries six law rows and no lens content; the ledger answers the lead as above. Corrected from unknown to evidenced.
- **Cheapest next lane (KMA-3).** Ledger-based delta file for COI against the LotM sidecar: boon grade rows, folding, storage-fusion timing, each with claim IDs from `claims.json` and the w/n/c/a status.
- **Done check.** Every delta row cites a `POWERS.md` claim ID and its status letter; character claims stay attributed; a row says which LotM sidecar row it extends or contradicts.
- **Reading cost vs AU3.** 0 source words. This is the strongest ledger in the set.
- **Top risks.** R1: treating a suspected machine-translated, unauthenticated edition as canon for names and numbers (`COVERAGE.md:3,10`). R2: COI is a related work, so merging it into the LotM sidecar could erase edition differences (a conflicts-per-world rule applies, deep dive `:116`).

## 4. Shadow Slave (SS)

Sources: [card](../../worlds/world-core-kit-2026-10-14/cards/shadow-slave.md), `rn/shadow-slave/SYSTEMS_DEEP_DIVE_2026-10-10.md` (295 lines; 2,999 of the first 3,000 chapters merged, ongoing so a snapshot; targeted search plus full reads of key chapters, `:8-21`), readers `RANKS.md`, `ASPECTS_FLAWS.md`, `SPELL_NIGHTMARES_WORLD.md`, `ITEMS_SOCIETY.md`, `LATE_VOLUMES.md`. No runtime module (F4).

| Lens | Status | Evidence pointer (label) |
|---|---|---|
| KL1 dials | partial | Inertia: big beats repeat inside Nightmares, details bend (STATED, S4 `:53` and inertia table in the MoL deep dive §3). Aspect/Flaw severity coupling (S5 `:54`). No registry. |
| KL2 material families | evidenced | Shards, essence pool, Memories (rank and tier), Echoes (S6 to S8, `:55-57`); shard value doubles per rank (STATED, `:55`). |
| KL3 supply forms | evidenced | Shards drop per core and trade; by default Master rank and above carry them between worlds, a per-world dial with a source reason about transit (STATED, S6 `:55`); Gates and Seeds as encounter source (S12 `:61`, P5 `:133`). |
| KL4 interaction laws, tier | evidenced | Two ordinal axes: seven human ranks (two naming sets) and a seven-step class by core count (STATED, S1/S2 `:50-51`; ladder table `:67-82`). Rank-up is a "Seal broken" event (S3 `:52`). Card SS-L2 `card/shadow-slave:368` warns rank, class, Aspect grade and mastery are separate axes and says the exact roster is a source gate. |
| KL5 relation graph | silent | No opposite, cycle or counter rows found in the deep dive or the card. Not "none": I did not open the reader files. |
| KL6 rule-grammar | partial | Aspect and Flaw are one transaction (S5); data shapes for Character, Creature, Memory, Echo, Seed (INFERRED, `:86-95`). Aspect stages as five fixed slots (P6 `:138`). Grammar derivation: none. |
| KL7 tags, subtle properties | partial | Defilement and corruption as creeping attributes, not status effects (STATED, `:64-65`); `fated` flag and True Name (S11 `:60`). |
| KL8 knowledge claims | partial | A character infers the grade (S4 `:53`); wiki cross-check exists (`WIKI_CROSSCHECK_2026-10-10.md`, 65 lines, not opened). |
| KL9 naming | partial | Two rank name sets for one ladder; True Names are in-world structure (S1, S11). Shadow counter caps are "not mapped to rank" (STATED gap, `:292`). |
| KL10 display | none | No evidence. |
| KL11 source tier and cost | evidenced | Rich ledger; roster of Aspects is a named gap (`card/shadow-slave:368`). |
| KL12 golden cases | none | Not found in files read; `WORLD_AUDIT.md` and `world-design-2026-10-11/DESIGN.md` not opened. |

- **Lead check.** Corrected: tier is a two-axis ladder. Counter/relation structure is silent, not none.
- **Cheapest next lane (KMA-4).** Ledger-based: write the two-axis tier table (rank by class) as a sidecar with explicit "different axes" note and the Aspect/Flaw coupling as one cost-dial row.
- **Done check.** Seven rows per axis with `SYSTEMS_DEEP_DIVE` or `RANKS.md` locators; one row states what is silent (counter rows, shadow cap mapping); no row converts rank to another world's tier.
- **Reading cost vs AU3.** 0 source words for the table. Opening `RANKS.md` and `ASPECTS_FLAWS.md` first is a read of existing reader files, not a book read. A roster gap read would need exact chapter ranges first and fits one AU3 default envelope at most (INFERRED; word counts unmeasured).
- **Top risks.** R1: ongoing novel, a snapshot (`:9-15`), so late-rank rows may change. R2: assuming creature rank/class equals human rank/class by name; the deep dive says same ranks, two names, with caveats not fully read.

## 5. Reincarnation Paradise (RP)

Sources: [card](../../worlds/world-core-kit-2026-10-14/cards/reincarnation-paradise.md), `ph/WORLD_BRIEF.md`, `ph/CANON_PRIORITY_PLAN_2026-10-14.md` (253 lines, F-rows), `ph/DERIVED_WORLDS_AND_MISSIONS_2026-10-14.md`, `rn/NS01_REINCARNATION_PARADISE.md`. Reading base: supplied English machine-translation reading, 4,505 distinct bodies over 4,656 spine members, fidelity unknown (STATED, `ph/WORLD_BRIEF.md:7`). Live code: `src/book_world_paradise_*.js` (bounded first-Goa depth seam, `card/reincarnation-paradise:~420`, not the novel's whole system).

| Lens | Status | Evidence pointer (label) |
|---|---|---|
| KL1 dials | evidenced | The mission pipeline uses explicit Default and Dial wording (reuse instance by default; dial era, synchronization, dream reset; STATED/PROPOSAL, `ph/DERIVED_WORLDS_AND_MISSIONS_2026-10-14.md:103-122`). Start dial: contractor, employee, visitor, companion (`CANON_PRIORITY_PLAN:92`). Still no registry. |
| KL2 material families | partial | Soul Crystals in five forms, ten fragments to one small, medium to large not freely convertible by purity (STATED, F22 `CANON_PRIORITY_PLAN:49`). |
| KL3 supply forms | evidenced | Currencies with different uses: Paradise Coins, Soul Coins, local money, merit, medals, World Source; a stated exchange example (F21 `:48`). |
| KL4 interaction laws, tier | evidenced | Typed Tier 1 to 9 nominal bands, INFERRED and not automatic advancement; access level overlaps tier at boundaries (F17 `:44`); attribute stage barrier (F18 `:45`); enhancement grades with failed-attempt rules (F20 `:47`). |
| KL5 relation graph | silent | Mission/faction relations exist as institutions in the hub docs; no opposite/counter graph found. |
| KL6 rule-grammar | partial | Eight-phase mission pipeline from contract to settlement (PROPOSAL, `DERIVED_WORLDS:105-117`); extraction states (RP-L8 `card/reincarnation-paradise:381`); grammar of skills/enhancements: silent. |
| KL7 tags, subtle properties | partial | Origin return retains attributes/passives and blocks most acquired actives/items (RP-L7 `:380`). |
| KL8 knowledge claims | evidenced | Evidence vocabulary SHOWN/STATED(system/narrator/person)/INFERRED/UNKNOWN used throughout (`DERIVED_WORLDS_AND_MISSIONS:9`); notice differs by edition (RP-L9 `card/...:382`). |
| KL9 naming | partial | Original Chinese versus machine-translation notice differences are recorded as edition conflicts (RP-L9); `NS01` pins the original Chinese title and alias. |
| KL10 display | none | Panel text (SHOWN/STATED by panels, F17) exists as source; no display design for lenses. |
| KL11 source tier and cost | evidenced | Named recheck ranges already exist: chapters 3984, 833, 4032, plus 3987, 4032, 4034 for ninth-tier promotion (`CANON_PRIORITY_PLAN:44`). |
| KL12 golden cases | partial | Verification rows VRP1 onward in the priority plan (`:222` area, proposals); not derivation goldens. |

- **Lead check.** See section 1: partly confirmed, emphasis corrected.
- **Cheapest next lane (KMA-5).** Ledger-based: a tier/attribute/enhancement/currency table from F17 to F22 with the F17 INFERRED label kept and the two recheck ranges listed as open.
- **Done check.** Each F-row has its `CANON_PRIORITY_PLAN` locator; the INFERRED Tier 1 to 9 bands are tagged INFERRED in the sidecar; the open recheck chapters appear as named gaps.
- **Reading cost vs AU3.** 0 words for the table. Closing the F17 recheck: five distinct chapters (3984, 833, 4032, 3987, 4034); words unmeasured; well inside one AU3 default envelope on count (INFERRED), but it is a source read, so it waits for Weibao to open it.
- **Top risks.** R1: machine-translated reading of unknown fidelity (`ph/WORLD_BRIEF.md:7`); numbers like the 80-point barrier may mistranslate. R2: tier bands are INFERRED; storing them as facts would hide that.

## 6. TTKS books B1 to B5 (one section, one row per book where it differs)

Sources: five cards ([B1](../../worlds/world-core-kit-2026-10-14/cards/ttks-b1.md) to [B5](../../worlds/world-core-kit-2026-10-14/cards/ttks-b5.md)), `rn/ttks-novels-2026-10-10/B*/DEEP_DIVE_2026-10-10.md` and `B*/readers-2026-10-10/`. Coverage authority: `CHECKPOINT.md` (every chapter of all five books read in full on 2026-10-10: B1 three readers, B2 five, B3 three, B4 two, B5 eight). **`COVERAGE.json` (file time 01:29) is older than `CHECKPOINT.md` (18:24) and still lists B1 as unread; I treat it as stale.** Editions: Traditional Chinese ttks.tw copies, all ongoing; B1 and B4 complete "as of 2026-10-10" snapshots. Card note: each book needs its own definitions and import policy (`card/ttks-b1:W2 header`). No runtime module (F4).

| Lens | B1 mimic wizards | B2 annual traits | B3 challenge board | B4 humanity's heir | B5 border inspector |
|---|---|---|---|---|---|
| KL1 dials | partial: overdraw and voice burden (TT1-L3, TT1-L6, `card/ttks-b1:376,379`) | partial: cooldown grows per run, and a run costs almost no real time (R6, `rn/ttks-novels-2026-10-10/B2/DEEP_DIVE_2026-10-10.md:24`) | partial: lives, loadout and win conditions belong to each challenge (TT3-L3 `card/ttks-b3:376`) | partial: purity bands with patronage exceptions (TT4-L6 `card/ttks-b4:379`) | evidenced: cost per charge in electricity (R3 `B5/DEEP_DIVE:23`; TT5-L2 `card/ttks-b5:376`) |
| KL2 material families | partial: veins and anchors (TT1-L1, L4) | partial: trait rarity colors (`B2/DEEP_DIVE:39-49`) | none found | partial: credential types (TT4-L5) | evidenced: collected skills with levels, infection sources graded by four tiers plus letter (R8 `B5/DEEP_DIVE:28`) |
| KL3 supply forms | none found | partial: settlement whitelist (TT2-L4) | partial: reward techniques are redesigns (TT3-L5) | partial: private ownership versus public service (TT4-L4) | evidenced: cooperation-gated search, electricity supply (R1, R3) |
| KL4 tier or laws | evidenced: ranks apprentice, formal, senior, then two higher grades (L3 `B1/DEEP_DIVE:29`); a domain counters a domain (L5 `:31`) | partial: realm sets odds (TT2-L2); world power ceiling (R11 `:29`) | partial: counter-stage taxonomy of four stages (STATED, `B3/DEEP_DIVE:127`) | stated absence: psionic ladder has no numeric tiers (`B4/DEEP_DIVE:129`) | evidenced: skill levels with odds halving per level (R1 `:21`); rule states three kinds (R9 `:29`) |
| KL5 relation graph | partial: soul-level gates (L7 `:33`) | silent | partial: anti-domain toolkit at four stages (`B3/DEEP_DIVE:74`) | silent | silent |
| KL6 rule-grammar | silent | silent | partial: vows, domains, techniques as world rules (`B3/DEEP_DIVE` heading, not read in full) | silent | partial: fusion of same-level skills, mutation on extra charge (R6 `:26`) |
| KL7 tags | partial: look-alike mimics with folk tells (`B1/DEEP_DIVE:69`) | partial | partial | partial | partial: copies may carry a seed or hazardous information (TT5-L3) |
| KL8 knowledge claims | partial | evidenced: simulated future loses timing reliability after intervention (TT2-L5 `card/ttks-b2:378`) | partial | partial | partial: false-result accountability (TT5-L7, INFERRED) |
| KL9 naming | none | partial: trait wording constrains effects (TT2-L6) | none | none | none |
| KL10 display | none | none | none | none | none |
| KL11 source tier and cost | evidenced: whole book read | evidenced: chapters 1 to 10 free official, 11 to 665 browser copy | evidenced | evidenced | evidenced |
| KL12 golden cases | none | none | none | none | none |

- **Lead check.** Corrected as in section 1. The phrase "power bill" is defined for B5 in `p9/TTKS_B5.md:33` as an observable trace, tied to B5's electricity-per-charge cost (R3). B2 and B1 costs are cooldown and burden, not a bill. B4's costs are credentials, not charges.
- **Card note.** B3's card describes a challenge board; the deep dive matches (challenge contracts per segment, `B3/DEEP_DIVE:19-23`).
- **Cheapest next lane (KMA-6).** Ledger-based: one cost-dial row per book from the deep dives and law rows (B5 electricity, B2 cooldown/lifespan, B1 overdraw/voice, B3 per-challenge lives, B4 credential expiry), each with its dial name, locator and in-world reason.
- **Done check.** Five rows (one per book), each with deep-dive and card locators; B4's row marks a credential dial and states that no charge-style cost was found; no row asserts a shared "bill".
- **Reading cost vs AU3.** 0 source words. The reader folders exist (112 to 972 KB each; sizes, not word counts).
- **Top risks.** R1: the five books are different worlds; a shared sidecar would erase this (`card/ttks-b1:W2 header`). R2: stale `COVERAGE.json` and ongoing books; any "complete" claim needs the CHECKPOINT date.

## 7. A Soldier's Life (SL)

Sources: [card](../../worlds/world-core-kit-2026-10-14/cards/soldiers-life.md) (runtime paused, documentation-level, `card/soldiers-life:W2 header`), `rn/soldiers-life-world-2026-10-09/DESIGN.md`, `rn/world-depth-2026-10-11/source/REPORT.md` and `SOURCE_LEDGER.json` (five pinned editions, hashes matched; 319-chapter inherited read claim kept separate from five direct paragraph inspections, `REPORT.md` F1; 383 inherited claim rows, 26 detail cards, F2/F3). Public rule: opaque IDs and counts (`REPORT.md` header), so I name no characters or scenes. Live code: none for the world; the private pack is optional and opt-in (`DESIGN.md:7`).

| Lens | Status | Evidence pointer (label) |
|---|---|---|
| KL1 dials | partial | Premise previews and a swapped-premise option (`DESIGN.md:17-20`); the card's dials are planning text (`card/soldiers-life:19`). |
| KL2 material families | partial | Affinity, core imprint, control, shaping, fuel and trained technique are distinct (STATED qualification S6, `DESIGN.md:46`); card SL-L1 `card/soldiers-life:337`. |
| KL3 supply forms | partial | Issue ledger, sealed supply vials, wage deductions, dimensional-storage fuel and selective transfer (STATED, `DESIGN.md:26,28,34,46`). Ration structure: unverified (20 token mentions in `SOURCE_INVENTORY.json`, unread). |
| KL4 interaction laws, tier | partial | Rank and promotion by completed work, no parallel XP bar (`DESIGN.md:36`); military rank is social (SL-L4 `card/...:340`, INFERRED, passages open). Magical tier: none found. |
| KL5 relation graph | silent | Not found. |
| KL6 rule-grammar | partial | Storage grammar: open-space transfer versus practiced item selection costs fuel/attention (S10, `DESIGN.md:46`). Spell/skill grammar: silent. |
| KL7 tags, subtle properties | partial | Acquired materials and essences carry provenance (SL-L2, INFERRED "exact W1-SRC binding still needed", `card/...:338`). |
| KL8 knowledge claims | partial | Confidential explanations and hostile testimony stay attributed; observed exceptions correct universal readings (`REPORT.md` F2). |
| KL9 naming | none | Not found. |
| KL10 display | partial | Present/complete/stored UI captures exist in the folder (`present*.txt`, `present.png`; not opened). |
| KL11 source tier and cost | evidenced | Strong ledger; residual entity extraction across five volumes is a named open task (W1-RES-ENTITY-EXTRACTION, `REPORT.md` F3). |
| KL12 golden cases | partial | 26 detail cards with locators and acceptance joins; behavior cases are unrun (STATED, `REPORT.md` F2, V1). |

- **Lead check.** Low-magic half corrected, ration half unverified (section 1). Every SL law row on the card is INFERRED with "exact passages open" (`card/soldiers-life:337-341`), so the card is thin; the research folder is the real evidence.
- **Cheapest next lane (KMA-7).** Held. If Weibao resumes SL, a ledger-based lens table from `DETAIL_CARDS.json` (counts and S IDs) and `DESIGN.md` S6/S10, keeping the task owner's pause in force.
- **Done check.** Table lists S IDs and card IDs with counts, no names or prose; states the paused owner; flags any card row still INFERRED.
- **Reading cost vs AU3.** 0 source words.
- **Top risks.** R1: the task is paused; the card is not authority to restart (`card/soldiers-life:W2 header`). R2: public-reference rules; names or scene detail would leak into a tracked file.

## 8. Cross-world lens shapes (all INFERRED mappings)

Shapes: T = ordinal tier ladder, G = relation graph with locators, F = formula or part structure, C = cost dial, X = other structure noted.

| World | T | G | F | C | Notes |
|---|---|---|---|---|---|
| MoL | circles (five named, membership unknown) | single counter facts | ward structure, exercise prerequisites, formula must anchor spell | mana magnitude, loop budget | strongest on F |
| LotM | 22 pathways x Sequence 9 to 0 | neighbor-swap groups | acting principles, formula main/aux | loss-of-control causes, strain | strongest on T and G |
| COI | same ladder, boons 9 to 0 | partial | per-actor principles | overload from several boons | shares the LotM shape; claim-status letters (KL8) |
| SS | two axes: rank and core-count class | silent | Aspect plus Flaw pairing | Flaw severity | two-axis is the odd shape |
| RP | Tier 1 to 9 (INFERRED), access level | silent | mission pipeline phases | currency per service | lifecycle shape |
| TTKS B1 | ranks to two higher grades | soul-level gates (the domain rule sits under KL4) | route and anchor | overdraw, voice burden | |
| TTKS B2 | realm gates, world ceiling | silent | trait whitelist | cooldown growth, lifespan | |
| TTKS B3 | n/a | four counter-stages | vow/domain/technique | stamina, per-challenge lives | |
| TTKS B4 | stated absence | silent | credential types | credential expiry | |
| TTKS B5 | skill levels, odds halve per level | silent | fusion of same-level skills | electricity per charge | |
| SL | none (social rank) | silent | storage selection grammar | fuel, wage deductions | thin |

- **Shared sidecar candidates (proposals).** (1) Ordinal-ladder sidecar: LotM, COI, SS (two axes), RP, TTKS B1, B5 and MoL circles share "named steps with a gate event and a count"; a two-axis variant serves SS, one axis serves the rest. (2) Relation-graph sidecar: LotM and COI (swap groups), TTKS B3 (counter-stages) and B1 (domain counters) can share an edge-with-locator row; MoL, SS and RP are silent. (3) Cost-dial row family: B5, B2, B1, SS (Flaw), COI (boon overload), MoL (mana), RP (currencies). Dial name, default, reason and cost per row; this is the Default + Dial + Reason form the lenses already use. (4) Claim-status letters: COI's w/n/c/a, RP's SHOWN/STATED(...) and the HP/DND SHOWN/STATED/INFERRED/MEMORY labels are one pattern; a shared claim-status field would serve KL8 for all.
- **Reason it may not generalize.** The ladders differ in what a gate event is (potion digestion, Nightmare completion, promotion boundary); a shared field set must carry the gate type as a dial, not assume a threshold.

## 9. Ranked next steps (proposals; none selects build scope, KR21-10)

Codes are the per-world lane codes from sections 2 to 7 (KMA-1 MoL, KMA-2 LotM, KMA-3 COI, KMA-4 SS, KMA-5 RP, KMA-6 TTKS, KMA-7 SL held); the list below ranks them.

| Rank | Lane | Level | Effort | Done check |
|---|---|---|---|---|
| 1 | KMA-2 + KMA-3: LotM and COI ladder and relation sidecar | sidecar data, doc-level | small | Group counts sum to 22; each edge has a locator; COI deltas cite claim IDs and status letters |
| 2 | KMA-4: SS two-axis tier table | sidecar | small | Seven rows per axis with locators; silent items listed |
| 3 | KMA-6: cost-dial rows for TTKS B1 to B5 | dial rows | small | One row per book with locator and in-world reason; no shared "bill" |
| 4 | KMA-5: RP F17 to F22 table with INFERRED tags | sidecar | small; the recheck read waits for Weibao's go | Each F row located; INFERRED bands tagged; recheck chapters listed as open |
| 5 | KMA-1: MoL circles and exercise graph | sidecar | small | Five goldens reproduce from the table; circle count marked unverified (five circles are named, `MAGIC_SYSTEM.md:473`) |

Ranking reason (INFERRED): rank 1 reuses the richest ledgers at zero reading cost and serves two worlds with one shape; the rest follow by ledger strength and by how few open source gaps they carry. KMA-7 stays held with the paused task owner.

## 10. What I did not check

- Card sections other than the header, W2 law rows and K3/K10 text; K5 to K9, K11 to K20 and lanes W3 to W37 (F2). KL3, KL7, KL8, KL10 "none" or "silent" rows mean not found in what I opened.
- Reader files themselves (`LOTM_PATHWAYS_*`, `COI_PATHWAYS_*`, `RANKS.md`, `ASPECTS_FLAWS.md`), `WIKI_CROSSCHECK`, SS `WORLD_AUDIT.md`, `world-design-2026-10-11/DESIGN.md` for LotM/MoL/SS, `ph/HUB_LIFE_*` and `BEINGS_*`, the SL UI captures, the B-book reader folders. I used the deep dives and ledgers that cite them.
- Counts I derived (eight swap groups, 220 slots, about 50 formulas, 22-way sum) come from deep-dive prose; I did not recount in the underlying readers.
- The Chinese-source word cost of any gap read; no measured ratio exists in what I read, so none is estimated.
- Whether any live code outside the two `book_world_*` families implements a lens; I read file headers (F4).
- No dial registry, resolver or pack profile file was opened; KL1 statuses rest on card and doc text.
- Every claim in this file is a proposal for lane design, not source truth.
