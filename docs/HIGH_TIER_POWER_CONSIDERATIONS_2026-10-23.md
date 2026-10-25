# High-tier power: what Rank 6, Sequence 5 and their peers would take

**Status: Proposed 2026-10-23.** Agent considerations for Weibao's question
"what would it take to implement high power levels like Gu Immortals (Rank 6),
Sequence 5 in LotM and other higher-level stuff across other worlds". Nothing
here is accepted direction; no code changed. Codes use the prefix HTP. Rows are
defaults with dials (AD5, AD38). This extends, and does not replace,
[ascension paths ASC1 to ASC12](RESEARCH_CULTIVATION_PATHS.md#round-2026-10-22-digitized-paths-of-ascension),
[raising the cap UC1 to UC13](CHEAT_COSMOLOGY.md#raising-the-cap-proposal-2026-10-10)
and [progression gates GTR1 to GTR27](PROGRESSION_GATE_RULES.md).

Evidence labels: **code** (read in this repo today), **saved** (a saved source
owner with chapter cites), **recall** (public canon from memory, not yet checked
against a saved source; verify before building).

## 1. Where the ceiling sits today (code and saved)

| Code | Fact | Evidence |
|---|---|---|
| HTP1 | The LotM ladders (Seer, Corpse Collector) stop at Sequence 8. Sequence 7 exists as a rung whose crossing reads `fact:'never'`. | code, `src/book_world_lotm_path.js:4,17,30`; LTS14 in [Seer slice laws](worlds/LOTM_SEER_SLICE_LAWS_2026-10-19.md) |
| HTP2 | The path engine already handles more rungs: ladder, tree, web, wheel, stack and field shapes; nine crossing types (ingest, trial, recognition and so on); a `ceiling` a world imposes; `known` for `???` stages. It holds no state. | code, `src/ascension_paths.js:8-11,41-57` |
| HTP3 | Reverend Insanity has evidence records in `src/feature_expansion_book_cultivation.js` (primeval essence, rank, recipe custody) but no playable runtime. The 2026-10-23 LotM lives entry keeps RI documentation-only. | code; [USER_VISION](USER_VISION.md#lotm-lives-pathways-and-regions-build-queue-2026-10-23) |
| HTP4 | The RI immortal tier is already mapped with chapter cites in the private 2026-10-10 systems deep dive: nine ranks (R1), singleton Immortal Gu (R7), dao marks (R8), ascension by heaven, earth and human qi into an aperture pocket world with its own time ratio and a calamity calendar (R10), and the Venerable conditions (R11). Chapters past 700 were keyword-sampled, and the immortal-scale institutions chapters are unread. | saved, `research/novels/reverend-insanity/SYSTEMS_DEEP_DIVE_2026-10-10.md` (gitignored); [RI institutions](worlds/REVEREND_INSANITY_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md) lines 191-222 |
| HTP5 | The LotM pathway table (all 22 pathways, Seq 9 to 0) and the rule that rituals start at Sequence 5 (L9) are in the private 2026-10-10 pathways deep dive. Its gaps: formulas above Seq 5 for most pathways, and a few swap points. The LotM wiki digest is blocked (HTTP 403). | saved, `research/novels/lord-of-mysteries/PATHWAYS_DEEP_DIVE_2026-10-10.md` (gitignored); [LotM institutions](worlds/LORD_OF_THE_MYSTERIES_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md) F9, F13, F15 |
| HTP6 | ~~The Breakthrough trial is not wired into live play.~~ Corrected in round 2: it is live through the pledges domain (`src/pledges.js:6`); the "not wired" line in its own header (`breakthrough_trial.js:9`) is stale. | code (HTC1) |

## 2. The core finding

**HTP7: adding rungs is cheap; a high tier is a new set of state domains and verbs.**
Sequence 7 is a data entry plus acting acts on the existing pattern. Rank 6 and
Sequence 5 are different: what changes at those tiers is what the character
*owns, controls and is watched by*, not a bigger number (UC4). Most of the cost
is building those domains once, as shared kit, so each world's high tier becomes
data on top.

What changes at each tier (correction, same day: the RI and LotM rows are backed by the saved deep dives in HTP4 and HTP5, not recall; the other rows are recall until lane C reports):

| World | Tier | What changes in kind | Engine domain it needs |
|---|---|---|---|
| Reverend Insanity | Rank 6 Gu Immortal | Mortal aperture becomes an immortal aperture: a blessed land, a place with its own terrain, time flow and produce. Primeval essence gives way to immortal essence (green grape at Rank 6), a separate currency. Immortal Gu are one of a kind in the world. Earthly calamities and heavenly tribulations strike the aperture on a schedule. Dao marks on the body make paths conflict. Killer moves combine several Gu. Heaven's Will is hostile to outliers. | Owned place with its own clock (HTP12); tier currency swap (HTP13); world-unique item registry (HTP14); scheduled threat (HTP15); a second ranked subject, the Gu (ASC3) |
| Lord of the Mysteries | Sequence 7 to 5 (Seer: Magician, Faceless, Marionettist; Death: Spirit Medium, Spirit Guide, Gatekeeper) | Seq 7 and 6 are more ingest-and-act on the current pattern. Seq 5 Marionettist controls other bodies through spirit-body threads, so the player runs several bodies. Mid Sequences need Beyonder ingredients from creatures of matching Sequence, so ingredients become hunts and purchases. Higher potions raise loss-of-control risk and the pull of characteristics (Law of Conservation, aggregation). Seq 4 is a demigod with a mythical creature form and an advancement ritual. | Multi-body control (HTP16); ingredient sourcing as hunts and markets (HTP13); conservation as a world law (HTP17); rituals as staged checks (GTR12, GTR14) |
| Circle of Inevitability | Mid Sequences | Same family as LotM; reuse its kit with its own pathways | As LotM |
| Shadow Slave | Awakened to Ascended and above | Each rank comes through a Nightmare trial; Memories and Echoes are bound items and companions; the Dream Realm is a place with its own danger clock | Trials as places (SR rules); bound items (HTP14); companions as bodies (HTP16) |
| Reincarnation Paradise | Tier 2 and up | Credentials issued by the Paradise; tasks and evaluation decide promotion | Credential records (GTR25, the [Paradise catalog](worlds/paradise-hub/PROGRESSION_GATES_2026-10-23.md), GTL9) |
| Mother of Learning | Archmage-level skill | No tier ladder; power is mana capacity, shaping skill, soul magic and the loop's knowledge | Skills and knowledge gates; no rank kit needed |
| Harry Potter | Exceptional wizards | No ladder; power is knowledge, rare artifacts and forbidden magic with costs | Unique items (HTP14); knowledge gates |

## 3. Path to Sequence 5 (LotM)

| Code | Step | Effort | Notes |
|---|---|---|---|
| HTP8 | Seq 7 for both live pathways: Magician and Spirit Medium. New rung data, a digestion act set fitting each role, and an assessment or purchase route for the dose. | small | Default first slice. Same ingest-then-act pattern as LTS11-LTS14. Needs the Seq 8 abilities to be read by something (the slice laws list Clown abilities in use as still excluded) |
| HTP9 | Seq 6: formula and characteristic as market goods priced from F13 and F15, with the fake-formula risk the Hanged Man describes. | medium | First real use of the ingredient market |
| HTP10 | Seq 5: the Marionettist turns a defeated or prepared body into a puppet the player can act through. Needs HTP16. Gatekeeper equivalent opens a spirit-world place. | large | The kit cost lands here |
| HTP11 | Higher-sequence risk: loss of control on undigested or wrong-order drinking (H3-H7 in the slice laws), characteristic recovery after death, aggregation pulling same-path characteristics together. | medium | Lets failure produce a world object (a characteristic, a sealed artifact) rather than only a game over |

Above Seq 5, Seq 4 adds a ritual and a mythical form, and the church's attention
model changes: demigods are counted and known to the top of each church.

## 4. Shared kit that high tiers need

Each row lists the existing module to extend, so the kit is wiring and data, not
a parallel system (AR rules).

| Code | Kit piece | What it is | Reuse |
|---|---|---|---|
| HTP12 | **Owned place with its own clock** | A place the character holds, with terrain, produce, residents and a time ratio to the outside. Rank 6 blessed land; LotM sealed spaces; Shadow Slave citadels. | `home_*` modules and `world_calendar.js`; ASC8 for away time |
| HTP13 | **Tier currency and ingredient layers** | A higher tier adds a new currency or ingredient class that converts from the lower one at a cost, instead of inflating lower prices. Immortal essence vs primeval stones; mid-Sequence characteristics vs pounds. | Economy standing and market modules; GTR16 overflow vocabulary for conversion |
| HTP14 | **World-unique items** | A record that only one of a thing exists in a world, who holds it, and who wants it. Immortal Gu; Sealed Artifacts; Memories. Losing one changes the world. | `home_inheritance.js` and heirloom records; one registry per world save slice |
| HTP15 | **Scheduled threats to what you own** | Calamity and tribulation clocks that scale with your tier and target your place, with preview and preparation. | `breakthrough_trial.js` (unwired), the risk quote (GTR14), cosmic events |
| HTP16 | **Several bodies under one player** | Act through puppets, Echoes, clones or a Gu that is itself ranked. Each body has its own position, condition and observer view. | `party_battle.js`, `companion_roster.js`; the selves and echoes palette |
| HTP17 | **World laws that push back** | Heaven's Will against outliers; Beyonder conservation and aggregation; church attention on demigods. A law is an in-world agent with a reason (no forced balance). | Fate's heat and attention mechanics in the cheat cosmology; GTR20 so NPCs meet the same law |

## 5. Keeping low life meaningful (UC5)

| Code | Point |
|---|---|
| HTP18 | **Tier distributions per world.** Each world states how many people sit at each tier in a place (a county has no Rank 6; Tingen has a handful of mid Sequences). This is what makes a Rank 6 feel high, and it also places secretly strong NPCs (USER_VISION 2026-10-02 NPC power levels). |
| HTP19 | **Lower tiers stay useful to higher ones.** Gu Immortals need mortal Gu Masters to farm and fight; a demigod still needs a lawyer. High-tier play reads low-tier labor and goods, so earlier systems stay live. |
| HTP20 | **Others read your tier by means (ASC6, AD6).** A Rank 6 can hide as Rank 3; a Faceless can be anyone. Hiding and being seen become play, and credentials stay institutional records (GTR25). |
| HTP21 | **Old obstacles get easy, not deleted.** A wolf tide that once killed you becomes a chore you can delegate. Show that change; do not remove the content. |

## 6. Saves, time and idle

| Code | Point |
|---|---|
| HTP22 | Each tier's state is an optional child schema, absent by default (ASC7). The owned place and unique-item registry are new slices, so they need a compatibility decision when they first ship. |
| HTP23 | Canon time scales are long (years of digestion, decades per rank). The idle clock covers accrual; irreversible steps (drinking, ascension, a tribulation) stop and wait for the player (ASC8). Ageing and lifespan (`aging_contact.js`) need to know that a Rank 6 or a Saint lives far longer. |
| HTP24 | Grants are evaluated where the body is (ASC9), and there is no cross-world effective rank (ASC10). A Rank 6 who travels does not become Sequence 4 elsewhere; each world reads the actual mechanisms the body carries. |

## 7. Source gaps and route

| Code | Gap | Route |
|---|---|---|
| HTP25 | RI immortal tier is unread (`[S]` chapters). Everything in the RI row above is recall. | `source-deep-dive` on the RI immortal arc, reading the chapters the institutions doc already lists (ch466-469, ch747-752, ch884-885, ch1658, ch1911) |
| HTP26 | LotM Seq 7 to 5 abilities, ingredient lists and ritual rules are recall; the wiki route is blocked. | `source-deep-dive` from the local text, Seer and Death pathways first |
| HTP27 | Shadow Slave, Circle of Inevitability and Paradise rows are recall apart from the Paradise catalog. | Their own deep dives when a slice reaches them |

If a world later changes or randomizes a high-tier truth, that truth becomes a
sealed secret under the standard rule; public canon stays unsealed.

## 8. Proposed build order (default, with effort)

1. **HTP8 LotM Seq 7** on both pathways, after HTP26 confirms the abilities. Small, uses existing code, and continues the live LotM branch.
2. **HTP12 owned place** and **HTP14 unique items** as shared kit, proven first in a low-stakes use (a LotM sealed artifact, a home with its own produce clock). Medium each.
3. **HTP9 and HTP11** (Seq 6 market and loss-of-control world objects). Medium.
4. **HTP16 multi-body** and **HTP10 Seq 5**. Large.
5. **RI Rank 6** once Weibao opens RI to runtime (HTP3) and HTP25 is read: blessed land on HTP12, immortal Gu on HTP14, tribulations on HTP15, essence on HTP13. Large, and mostly data once 2 to 4 exist.

## 9. Risks

| Code | Risk |
|---|---|
| HTP28 | Sequencing: the first milestone is one realm and one prestige layer. Each step above is its own playable slice; running several at once spreads verification thin. |
| HTP29 | Building a high tier from recall risks wrong mechanics that later need save migrations. HTP25 and HTP26 come before any rung ships. |
| HTP30 | Treating a high tier as multipliers would break UC4 and flatten worlds into one ladder (ASC10). The table in section 2 is the check: if a tier adds no new domain or verb, it is not ready. |

## Round 2: source dives, 2026-10-23

Weibao: "Dive each in parallel, we can just consider early accordingly, consider
other worlds with similar power teirs too and more?" Three sonnet lanes ran in
parallel ([checkpoint](gm/dispatch/high-tier-power-2026-10-23/CHECKPOINT.md)):

| Lane | File | Codes | Source read |
|---|---|---|---|
| A LotM Seq 7 to 4 | [LANE_A_LOTM](gm/dispatch/high-tier-power-2026-10-23/LANE_A_LOTM.md) | HTA1-HTA47, gaps G1-G9 | saved owners plus about 4,500 words of the EPUB |
| B RI Rank 6 to 9 | [LANE_B_RI](gm/dispatch/high-tier-power-2026-10-23/LANE_B_RI.md) | HTB1-HTB87 | saved owners plus about 10,000 words (40 windows) |
| C Other worlds | [LANE_C_OTHER_WORLDS](gm/dispatch/high-tier-power-2026-10-23/LANE_C_OTHER_WORLDS.md) | HTC1-HTC45 | saved owners only |

Lane files hold the per-tier tables and evidence. This section keeps only what
changes the root doc. Everything stays a proposal.

### Corrections to round 1

| Code | Correction |
|---|---|
| HTP31 | HTP6 was wrong: the breakthrough trial is live through pledges (HTC1). HTP15 already has a proving ground. |
| HTP32 | HTP17's "Fate's heat" reuse is a name with no saved mechanics (HTC44). RI's Heavenly Dao is a balancer that works in two directions: it trims surplus (calamities aim at the most valuable feature) and favors by need (HTB5, ch826, ch2085). Pushback is often an institution, and Paradise's tier descriptor with rights and duties (RPG48) is a ready host. |
| HTP33 | HTP12's "own clock" is new work. `world_calendar.js` does fixed arithmetic only (HTC3). Long lifespans are a one-row data change in `aging_contact.js` `AGING_DIALS` (HTC4). |
| HTP34 | The LotM ladder cannot take Seq 7 as data. `book_world_lotm_pathways.js` holds one acting count and one assessed flag; Seq 7 needs a rung list with per-rung facts (HTA10). Nothing reads the Seq 8 sources yet (`grants: []`). |
| HTP53 | Locator check, same day ([LOCATOR_CHECK_LOTM](gm/dispatch/high-tier-power-2026-10-23/LOCATOR_CHECK_LOTM.md)): six lane A rows corrected (HTA1, HTA20, HTA24, HTA27, HTA28, HTA30; listed at the end of lane A). Default promotion wait is three years plus an assessment (Nighthawks, [18 p56], [106 p55]); a one-year pace is one character's fast record. HTP39 stands: Marionettist timings are estimates. |
| HTP54 | Refines HTP53: three years plus an assessment is the default for an ordinary member who lacks the acting method. The exam reads digestion and soundness, not elapsed time; Klein digested in about a month and passed a senior deacon's on-site exam on merit. Routes and costs are WT1-WT10 in the locator check addendum. Higher tiers keep this shape: a time default, a knowledge route that costs secrecy, and an outside route that costs exposure. |

### What the dives found that changes the plan

| Code | Finding | From |
|---|---|---|
| HTP35 | **RI: the owned place comes before ascension.** A mortal can hold a dead immortal's blessed land through its land spirit (ch408-409). The first Rank 6 slice is "the inherited blessed land", with no ascension procedure. | HTB1 |
| HTP36 | **RI: feeding binds at Rank 6, not essence.** One green grape bead gives near-endless primeval essence; Immortal Gu eat named materials in the tens of thousands, halved by hibernation (ch671-672). HTP13's tier currency needs a feeding sink. | HTB2 |
| HTP37 | **Three clocks.** Calamities run on aperture time, aging on the clock the body is in, canon events on outside time. Store aperture years and the ratio. At 1:16 a ten-year calamity lands about every 7.5 outside months. | HTB3 |
| HTP38 | **Ascension converts the mortal inventory into a number** (human qi as a sum of accumulation; mortal Gu are usually destroyed). The mortal world must exist first: about 3 to 4 medium waves before a Rank 6 slice makes sense. | HTB4, HTB58-HTB64 |
| HTP39 | **LotM Marionettist numbers are a character's early estimate** (about 20 seconds to first control, 5 minutes to a permanent puppet), not stated rules; full conversion is irreversible. Author them as dials. | HTA, source 0684 |
| HTP40 | **LotM rituals carry a counterweight by mechanism.** The Seq 5 mermaid song neutralises thread corrosion; any equivalent sound or ability can substitute (AD38). | HTA13 |
| HTP41 | **LotM Death line Seq 7 to 5** has no acting principle, formula or ritual in the text searched; those acts would be authored and labelled so. | HTA gap G2 |
| HTP42 | **Shadow Slave, ORV and CoI have the richest high-tier evidence and no runtime.** Prove kit pieces on the frontier home or Paradise first, then make those worlds data. | HTC2 |

### Consolidated kit (round 1 HTP12-HTP17 plus what the lanes added)

Duplicates across lanes are merged. Each piece names its first proving ground.

| Code | Kit piece | Merges | First proving ground |
|---|---|---|---|
| HTP43 | **Rung-list ladders with per-rung facts** | HTA10 | LotM, inside the queued B2 pathway extraction |
| HTP44 | **Acts that count on a counterpart's reaction** (audience, spirit, onlookers) | HTA9 | LotM Seq 8 digestion |
| HTP45 | **Owned place with its own clock**, plus land-spirit gatekeeper, dead or closed state, storage gating | HTP12, HTB52, HTB53, HTB56 | Frontier home first (HTC), then RI inherited land |
| HTP46 | **Unique items with state and a `blocks` slot**: singletons with diet and hunger, characteristics that drop on death and are conserved, titles and concepts that block others by existing | HTP14, HTA15, HTB47, HTC9 | LotM characteristic as an item |
| HTP47 | **Two ranked subjects and retinues**: a Gu with its own rank, puppets, spirits and Echoes with capacity, upkeep and control state | HTP16, HTA12, HTB50 | `companion_roster.js` and `party_battle.js` |
| HTP48 | **Persona and form records**: identities worn and who believes them; body changes such as mythical form with harm to lower-tier onlookers | HTA11, HTA14, HTC10 | LotM Faceless |
| HTP49 | **Rank-gap and observer table per world**: who can see your tier by what means, and how a gap changes what an action does (not just its size) | HTA16, HTC11, ASC6 | Paradise (credentials already exist) |
| HTP50 | **Support ledger and territory field**: followers, worship, sponsors or anchors that fuel power and also watch you; a projected area on the shared map with subjects and rivals | HTC7, HTC8 | Paradise or a later SS slice |
| HTP51 | **Scheduled threats with survival counts**: calamity ledger, preview, decoys and preparation; rank-up by surviving a count | HTP15, HTB48 | Pledges' live trial |
| HTP52 | **Accumulation ledger** that sums mortal state into one gate value (human qi) | HTB57 | RI mortal waves |

Naming: "domain" in `domain_registry.js` means a save and tick slice. Use
"territory field" for a world's projected area (HTC6).

### Revised build order (default, with effort)

1. **LotM rung list, Seq 8 digestion and readers, then Seq 7** (HTA packet P1-P7). Medium-large. P1 runs inside the queued B2 extraction, one writer for `src/book_world_lotm_*`.
2. **Owned place with a time ratio and unique items** (HTP45, HTP46), proven on the frontier home and a LotM characteristic. Medium each.
3. **Rank-gap and observer table** (HTP49) on Paradise credentials. Small-medium.
4. **LotM Seq 6 and 5** on HTP47 and HTP48. Large.
5. **RI**: mortal Rank 1-5 waves first (HTP38), then "the inherited blessed land" (HTB slice, L+). Only once Weibao opens RI to runtime.
6. **SS, ORV, CoI** as data on the finished kit.

### More to consider, round 2

**ACT NOW (done):** corrected HTP6 and the recall labels; merged lane kit
pieces into HTP43-HTP52; recorded the "domain" naming split.

**ACCOUNT FOR NOW**

- Namespace ladder facts by rung (`lotm.rung.seq8.acting`) so a save at Seq 8 survives the refactor (HTA P1, HTP22).
- Store owned-place time as its own years plus a ratio, never as outside years (HTP37).
- A rank gap changes the verb, not only the number: below a demigod, seeing the form is itself harm (HTP48, HTP49).
- High-tier scarcity moves: essence stops binding, feeding and ingredients start (HTP36). Price tables need a sink, not inflation.
- The stale header in `breakthrough_trial.js` will mislead the next reader; fix it when that file is next touched (AR1, no sweep).

**LATER / DELEGATE**

| Item | Level | Effort | Done check |
|---|---|---|---|
| Read RI ch747-752, ch884-885, ch838, ch983 (Treasure Yellow Heaven fee, immortal justice) | haiku reader | small | Lane B gaps closed with locators |
| LotM Death line Seq 7-5 acting principles from later volumes or CoI parallels | haiku reader | small | G2 closed or marked authored |
| Cradle, Coiling Dragon and other blocked digests | sonnet, on a working route | medium | HTC36 rows upgraded from leads |
| Per-world tier headcount tables (HTP18) for LotM Tingen and Paradise | sonnet | small | A table each, used by HTP49 |
