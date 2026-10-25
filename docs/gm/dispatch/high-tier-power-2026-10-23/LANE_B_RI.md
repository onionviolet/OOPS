# Lane B: Reverend Insanity Gu Immortal tier (Rank 6, with 7-9)

**Status: Proposed 2026-10-23.** Early design consideration for
[HTP](../../../HIGH_TIER_POWER_CONSIDERATIONS_2026-10-23.md) sections 1-4.
Planning only: no code, build, commit or push. Reverend Insanity (RI) stays
documentation-only by Weibao's direction (HTP3). Codes use the prefix HTB.
Every row is a default with a dial and an in-world reason (AD5, AD38), and
nothing here is accepted.

**Labels.** *saved* = a saved owner, cited with its code or file. *source* =
read in the local epub this pass, cited by chapter number (`chNNN`).
*wiki-only* = Fandom wiki via [WIKI_CROSSCHECK](../../../research/novels/reverend-insanity/WIKI_CROSSCHECK_2026-10-10.md).
*code* = read in this repo today. Quotes are 15 words or fewer.

**Reading budget.** About 40 targeted windows from the epub (extracted to a
scratch directory outside the repo), roughly 10,000 words of raw text, under
the 12,000 cap. The library file was not modified. The chapter index
`docs/research/full-book/reverend-insanity/INDEXES.json` does not exist (the
institutions doc already records this as C6), so locators are chapter numbers
checked against this epub. Numbers are translation-edition numbers; pack rows
should cite locator and edition (institutions doc, section 12).

## 0. What this pass found (read first)

| Code | Finding | Label |
|---|---|---|
| HTB1 | **The blessed-land kit does not need ascension.** A mortal Fang Yuan owns Hu Immortal's blessed land through its land spirit and plans to "resist the continuous earthly calamities" before he is an immortal. So a first slice can be "a mortal inherits a dead immortal's blessed land." That proves the owned place, the scheduled threat and the land spirit with no ascension procedure. | source ch408-409, ch745 |
| HTB2 | **Scarcity changes kind at Rank 6.** One green grape bead fills the aperture with near-endless primeval essence, so essence stops binding. What binds is feeding: each Immortal Gu eats a named material, often in the tens of thousands of units, and hibernation only halves it. | saved RANKS_ECONOMY s3; source ch671-672 |
| HTB3 | **Three clocks.** Calamities run on aperture time. Aging runs on the clock the body is in. Canon events run on outside time. At 1:16 a ten-year earthly calamity lands about every 7.5 outside months; at 1:38 about every 3.2. A better grade means more threat per outside year. | saved + source ch409, ch745; arithmetic mine |
| HTB4 | **Ascension converts the mortal inventory into a number.** Human qi is the sum of everything the Gu Master accumulated, and mortal Gu are usually destroyed. The prerequisite is an accumulation ledger plus a vital Gu and core Gu, not a carried-over Gu collection. | source ch600, ch632 |
| HTB5 | **The Heavenly Dao is a balancer, not only a hostile agent.** It trims surplus (calamities aim at the most valuable feature), favored Primordial Origin when variant humans upset balance, and lets lifespan Gu supply fall in a venerable's era. Give HTP17 a reason and two directions. | source ch826, ch2085 |

## 1. Per-rank table

Ranks 1-5 are the mortal world (HTP3). Ranks 6-9 below. "Essence" is the
tier's immortal essence. Calamity years are aperture years (HTB3).

| | Rank 6 | Rank 7 | Rank 8 | Rank 9 (Venerable) |
|---|---|---|---|---|
| **New in kind** | Mortal aperture shattered, immortal aperture (blessed land) formed. Immortal essence. First Immortal Gu possible. Dao marks and calamities begin. | Blessed land expands a level. Grand tribulation joins the schedule. Rank 7 Immortal Gu exist (calamity beckoning). | Blessed land becomes a grotto-heaven. Earthly calamity stops, three tribulation tiers run. Rank 8 Immortal Gu Houses and sect first supreme elders. | Origin core yields yellow apricot essence. Ten Venerables in three million years. |
| **Gate in** | Rank 5 peak, then the three-qi procedure (section 2). "Might only be one" famous rank 5 succeeds (ch600). | Three heavenly tribulations survived, about 300 aperture years (ch740, ch1007). | Three grand tribulations, about 300 years (saved RANKS s3; ch1007). | Four conditions: white lychee essence, 300,000 dao marks on the main path, supreme grandmaster attainment, then break the Heavenly Dao blockade (ch2085). |
| **Essence** | Green grape. One stone converts to one bead (ch666). | Red date. | White lychee. | Yellow apricot, "skull-sized" beads (saved s3). |
| **Calamity schedule** | Earthly every 10 y; heavenly every 100 y. | Earthly 10; heavenly 50; grand 100. | No earthly; heavenly 10; grand 50; myriad 100. | Not stated in what was read. Replaced by the blockade and its three parts (below). |
| **Aperture** | Blessed land: small under 2,000 km2 (10+ beads), medium 2,000-4,000 (20+), high 4,000-6,000 (30+), super 6,700-13,000 (Ten Extreme only). Examples: 1:16 with 22 beads, 1:33 with 36, 1:38 super (ch633, ch745, ch750). | Same land, one level larger (ch740). | Grotto-heaven; a nine-heavens fragment can be fused in, which removes calamities and lets it outlive the owner (ch740). | Grotto-heaven annexing; not traced past ch2085. |
| **Costs and upkeep** | Feeding Immortal Gu, calamity prep, aperture management, lifespan; these cap how many a Gu Immortal can hold (saved s3). Time-dilated aging at ratio. | Same, with grand tribulation prep. | Rank 8s mostly sleep in Heavenly Court to slow their clocks (ch1007). | Lifespan Gu falls in a venerable's era; lifespans run 3,000 to 25,000 y (saved s3). |
| **Risks** | Assimilation by heaven and earth qi at ascension (ch600). Calamity kills (Hu Immortal died on the 5th, ch745, ch826). Land-spirit rejection and self-detonation (ch610). Immortal Gu aura draws hunters (ch568). | Grand tribulation deaths. Bo Qing passed two myriad tribulations and died on the third try (ch1007). | Myriad tribulation, called "apocalyptic" (ch1007). | Tribulation blockade, lifespan Gu and fate Gu (destroyed in canon) (ch2085). |
| **Evidence** | source plus saved: strong | source plus saved: medium | saved plus ch1007: medium | ch2085 only: thin |

**HTB6, the "advance when" rule is calamity-driven, not a trial.** Rank 6 to 7
and 7 to 8 come from surviving a count of tribulations on a fixed clock, not
from a breakthrough attempt (ch740, ch1007). `src/breakthrough_trial.js` is a
single roll; it does not model a schedule that is itself the gate. Default: the
ladder crossing type `trial` carries a count fact fed by the calamity ledger
(HTB24).

**HTB7, the escapes are trade-offs the player can choose.** Slow the aperture
clock with time path or hibernation; cut the river-of-time tributary (no
calamities, no essence, no dao growth, ch1007); fuse a nine-heavens fragment
at rank 8 (ch740). Each one trades one axis against another, which is
exactly what an idle game wants to show.

## 2. The ascension procedure (gap 1)

Saved summary: [RANKS_ECONOMY s3](../../../research/novels/reverend-insanity/readers-2026-10-10/RANKS_ECONOMY.md)
and deep dive R10. What this pass added:

| Code | Point | Label |
|---|---|---|
| HTB8 | Human qi is the sum of battle strength, body, soul, Gu familiarity, understanding of heaven and earth, self-awareness, luck, talent, aptitude, encounters and insights (ch600). Heaven and earth qi can be drawn in up to the level of human qi; more drawn raises the chance. | source ch600 |
| HTB9 | Failure mode: little accumulation means human qi is small while heaven and earth qi arrives in large amounts, and the Gu Master is assimilated and dies (ch600). A man qi Immortal Gu collects others' human qi and removes this test. The one in the book sits in a Giant Sun true inheritance. | source ch600, ch568 |
| HTB10 | Three steps: shatter the aperture, take in heaven and earth qi (surplus condenses into the first calamity and tribulation), then place the vital Gu so the mixed qi becomes the aperture. | saved s3 (ch607, ch609) |
| HTB11 | Cost: mortal Gu are normally destroyed and a new immortal often has almost nothing (ch632). Essence-keeping Gu let a new immortal retain some primeval essence after the aperture shatters (ch629, a bystander's remark); a patron's support kept Tai Bai Yun Sheng's Gu supplied (ch632). | source |
| HTB12 | Grade is set at ascension (aptitude and path, Ten Extreme gives super). Fang Yuan's medium land came out at 1:16; the ratio was lowered by the Spring Autumn Cicada drinking the river of time (saved s3, ch633). | saved + source |

**What a player would prepare (proposal).** Raise accumulation across the
listed dimensions (each is a ledger the mortal runtime must already track),
hold or borrow a man qi Gu, bank vital and core Gu and essence-keeping Gu,
choose how much heaven and earth qi to draw (higher chance, larger first
calamity), and pick a place and hour with few watchers. Dial: the surplus
becoming the first calamity is the player-facing choice, not a hidden roll.
Reason: the book treats qi intake as a graded choice, so a single risk
permille (`breakthrough_trial.js` shape) understates it (HTB6).

## 3. Blessed land day to day (gap 2)

| Code | Fact | Label |
|---|---|---|
| HTB13 | **Time.** One outside day is five here for Hu Immortal's land (1:5). You age at the same ratio: a year and three months of cultivation per three outside months, paid in lifespan (ch409). | source |
| HTB14 | **Residents and produce.** Hu land held about 860,000 rank 1 Gu in 52 kinds, 130,000 rank 2, 5,000 rank 3, 60 rank 4 and one rank 5 fox skin Gu, plus fox groups, rockmen, hairy men and wolf and fish groups. Numbers fall steeply by rank (ch409, ch826). Beast tiers run beast kings, mutated, desolate, ancient desolate, immemorial desolate. | source |
| HTB15 | **Produce loop.** Green grape beads come at fixed intervals of aperture time, about monthly (ch750). A land can feed a super clan and could house five or six small clans (ch409). The land's value is its Gu herds, its beads and its time. | source |
| HTB16 | **Land spirit.** A dead immortal's obsession fused with heavenly power. It knows everything in the land, obeys the owner, rejects an unqualified one and may self-detonate (ch409-410). The owner can order it to close the land, open it slightly, or drive off rivals (ch408, ch418). It is "rigid and not flexible" (ch610). | source |
| HTB17 | **Outsiders.** Default closed. The owner or the spirit opens it. A forced breach of a land with a spirit needs about three rank 6 immortals at least, and the land can sit under a protecting mountain (ch407). Time ratio and entrance can be repaired by Immortal Gu (ch745). Permanent venue links exist: a connecting heaven Gu planted in the land links it to Treasure Yellow Heaven and cannot be changed (ch466). | source |
| HTB18 | **Degrade and loss.** Calamity targets the land's most valuable feature: a swamp crab calamity turned Dang Hun mountain toward mud (ch826). Dead apertures (zombie owners) produce no essence and must buy it (ch652, saved s3 ch818). A prior owner can die on a calamity (ch745). Decoys work: Fang Yuan dug hundreds of poison blood lakes (ch826). | source |
| HTB19 | **Calamity pays.** Each survived calamity adds dao marks that reshape ecology. The swamp crab left enslavement marks (herd control and breeding) and earth marks (soil, mountain support) (ch826). | source |

**Fit with repo modules (code).** `src/home_domain.js` is a frontier
residence domain (wiring for named places, furniture, household work) and is a
weak host: its state is `homes.properties` with tenure and condition, not a
second world with terrain, herds and a ratio. `src/home_inheritance.js` hands
over residences on an ended life; a blessed land changes hands by land-spirit
acceptance (ch610), which is a different gate. `src/world_calendar.js` can
project a second clock: it already resolves per-instance clocks
(`instance.clock.elapsed` with `instanceId`), but its unit is fixed to
`played_minutes`, so the 1:N ratio has to be applied by the owner before the
call. Verdict: a new owned-place domain is needed (HTP12 is a new slice, not a
`home_*` extension), reusing the calendar leaf for projection.

## 4. Immortal essence (gap 3)

| Code | Fact | Label |
|---|---|---|
| HTB20 | Produced by the aperture at fixed aperture-time intervals, in beads of the rank's colour. Spent on Immortal Gu use (Fixed Immortal Travel costs one bead per use, ch665), on feeding, and as "unlimited primeval essence once diluted" (ch608, ch611). | saved s3 + source |
| HTB21 | Conversion: one stone becomes one bead of your own essence (ch666). Stones are made only by Heavenly Court (ch466) and are worth more than the bead as money; the narrator says two stones exceed 200 million primeval stones, order of magnitude only. Conversion is up, not down (saved RANKS s3, s5). | saved + source |
| HTB22 | Income examples: land spirit trades about 60 stones a month; a mortal recipe set 66 stones; a rank 5 killer move half a stone; one stone buys three small information documents (saved s5). Selling Immortal Gu recipes feeds the stone supply: three "100%" recipes to a land spirit (ch665-666). Remnant recipes can be resold, but each sale dims the treasure light and the price (ch469). | saved + source |
| HTB23 | Mortal demand rises when immortals avoid Immortal Gu use (saved s5 ch668). Wartime uses merit and sect points in place of stones (saved s5 ch667). | saved |

**Kit fit.** HTP13 (tier currency) is right: a two-currency ledger with
conversion only upward, and a second axis where the mortal market keeps its own
prices (HTP19). The price anchors above are too thin to tune a market; the fee
percentage at Treasure Yellow Heaven was not found.

## 5. Calamity and tribulation calendar (gap 4)

| Code | Point | Label |
|---|---|---|
| HTB24 | The schedule table is in section 1. Strength order: earthly calamity, heavenly, grand, myriad. A lone immortal is judged by heavenly tribulations survived (ch740). They strike apertures only, not the five regions or the nine heavens (ch740). | saved + source |
| HTB25 | **What targets what.** Calamities and tribulations aim at the owner's surplus: the stronger the foundation, the stronger the hit, and they "would weaken you" where you are superior (ch826). The book says this is a high-probability rule, not absolute. | source |
| HTB26 | **What preparation does.** Raise defenses and Gu counts for the hit; build decoys; slow the clock with time path (most prominent rank 8s hibernate, ch1007); sell or move at-risk assets; recruit helpers (Fang Yuan's support kept Tai Bai Yun Sheng's Gu from running out, ch632). Preparing does not choose the calamity's type. | source |
| HTB27 | Mortal Gu Masters at rank 4-5 are not on this clock, but their own apertures can collapse (saved s3). A mortal owner of a blessed land is: Hu Immortal's land had passed seven earthly calamities by ch826, the 5th killing the earlier owner. | saved + source |

**Fit.** `breakthrough_trial.js` (code) is an unwired single-roll breakthrough
with pay-for-safety. It fits the preparation purchase (pay to lower risk, floor
above zero) but not a recurring schedule and not "survival count is the
gate" (HTB6). Reuse its quote and floor vocabulary, add a calendar and a wave
list, and let a world set the floor to a value that allows death (its header
says failure is "never the life itself" by default). HTP15 stands.

## 6. Immortal Gu as singletons (gap 5)

| Code | Fact | Label |
|---|---|---|
| HTB28 | One of each kind exists in the world; not sold for stones, only swapped Gu for Gu (ch537). A rich immortal can hold none (Xue Song Zi, decades at rank 6). | source ch537 |
| HTB29 | Making one: a mortal Gu is refined by the aperture's heavenly power, and a high grade land has spare qi for it (saved s3). Recipes are tradeable goods; Fang Yuan sold three "100%" recipes (ch665) and remnant recipes at Treasure Yellow Heaven (ch466-469). | saved + source |
| HTB30 | **Feeding is the real cost.** Examples (ch672): calamity beckoning eats black blood of a desolate snake; worldly wave trace needs tens of thousands of jellyfish and thousands of eels; cleanse soul needs flesh of 10,000+ silkworm Gu; connect luck needs 5,000 kg of sand; Woman's Heart eats women's hearts. Spring Autumn Cicada drinks the river of time. Fixed Immortal Travel can last years on one bead, shortened by use. Raising a Gu is "like supporting a mistress" (ch652). | source |
| HTB31 | Hibernation: mortal Gu need no feeding in a special domain; Immortal Gu still need half food (ch671). Immortal Gu hungry in fights, and a still-healthy one signals which are fed (ch693). | source |
| HTB32 | Who knows who holds them: aura leaks if one is carried outside an aperture, so storage is in the immortal aperture and exposure draws coveters (ch568). Ownership otherwise stays secret; Immortal Gu Houses are named, fixed objects (saved s3). | source + saved |
| HTB33 | Immortal Gu have a will-adjacent character and a path; a match raises power and a mismatch cuts it to about 60-70% (checked R8). | saved R8 |

**Fit (code).** `src/heir_inheritance.js`, `src/carry_ledger.js` and the heirloom
records can hold an item with an owner, but none enforces "only one exists in
this world save." HTP14 needs a registry with `state` (held, stored,
hibernating, lost, destroyed), a diet row and a holder-knowledge map (who knows).

## 7. Dao marks and attainment as a second axis (gap 6)

| Code | Fact | Label |
|---|---|---|
| HTB34 | Marks accumulate per path from survived calamities and from insight; the owner's land also carries marks (saved R8, ch826). The count is the Venerable gate: 300,000 on the main path (ch2085). | saved + source |
| HTB35 | Attainment is a nine-step realm per path: ordinary, quasi-master, master, quasi-grandmaster, grandmaster, quasi-great, great, quasi-supreme, supreme grandmaster (ch687). Most keep ordinary for life. Each step is "an astonishing upgrade" in power (ch687). | source |
| HTB36 | Marks and attainment are separate numbers: Fang Yuan had enough marks on four paths yet fell short on attainment (ch2085). Attainment grows by insight, true meanings and inheritances (saved R9). | source + saved |

No numeric effect values for attainment steps were found (still a gap).
Proposal: `marks{path}` and `attainment{path}` as two counters per path on the
character, per-region marks on the land, and Gu power read from the match
(R8). Marks and attainment are what Venerable play adds on top of the rank bar
(HTB38).

## 8. Heaven's Will and other pushback (gap 7)

| Code | Fact | Label |
|---|---|---|
| HTB37 | Heavenly Dao balance: it takes surpluses and fills deficits; calamities and tribulations are part of the "Heavenly Dao blockade" that grows stronger as one rises (ch2085). | source |
| HTB38 | Three blockade parts: a tribulation far above any myriad, lifespan Gu (a heaven-path Gu that cannot be refined by people, whose natural supply falls while a venerable exists), and fate Gu (destroyed in canon) (ch2085). | source |
| HTB39 | Heaven's will favors by need: Primordial Origin was favored when variant humans broke balance; Red Lotus had human-path favor, and three Dukes blocked a tribulation for him. Human-path methods and luck are the known ways around the blockade (ch2085). | source |
| HTB40 | Heaven and Giant Sun's will and Heavenly Court hunt "otherworldly demons" (saved N1, ch619, ch1789). Giant Sun's will lingers in his arrangements and acts through them (ch568, ch607). | saved + source |

**Fit.** HTP17 holds as "a law is an in-world agent with a reason": here the
reason is balance. Default: the Heavenly Dao as a pressure with a visible
trigger (surplus relative to world), not a hidden difficulty slider. NPCs meet
the same law (GTR20): Hu Immortal died on it, Bo Qing died on it.

## 9. Immortal-scale institutions (gap 8)

| Code | Fact | Label |
|---|---|---|
| HTB41 | **Treasure Yellow Heaven.** A grotto-heaven fused with a yellow-heaven fragment by a rank 8 (hence no calamities), run on a rank 8 treasure light Immortal Gu that appraises value as light height. Sellers need a connecting heaven Gu (fixed once planted). A processing fee is deducted. Stronger light, higher price; resales dim it until it recovers; lights cannot detect tampering, so buyers refine their own (ch466-469). Rank 1-3 treasure light Gu are common, 4-5 sit with large forces. | source |
| HTB42 | **Merit obelisk (Dragon Whale Paradise).** A rank 8 Immortal Gu House object. Missions limit how far you move, you cannot reach Treasure Yellow Heaven or talk to other immortals inside; you recite "return" three times to come back; people leave notes by the obelisk. Failing a mission can cost merit; the first supreme elder went negative and had ten days to get positive or be barred (ch1658, ch1911). | source |
| HTB43 | **Sect immortals.** A sect votes on stone budgets (a motion for 360 stones against a past 200 budget). A rank 8 first supreme elder sets order and silences debate by bell (ch697). Ten great sects hold about 80% of the Central Continent's resources (saved s3). | source + saved |
| HTB44 | **Justice and other unread windows.** Immortal justice, master and disciple, alliances and late-book markets: ch884-885, ch1820, ch2145, ch2008, ch1870, ch1877, ch828-829, ch696-705, ch839, ch1008, ch1456, ch1896, ch2122 remain unread (institutions doc s11). | saved |

## 10. What changes in kind: kit mapping

Maps to HTP12-HTP17, plus pieces the root doc lacks.

| Code | Kit piece | RI use | Verdict |
|---|---|---|---|
| HTB45 | HTP12 owned place with its own clock | Blessed land: terrain, herds, residents, beads, ratio, marks, land spirit | Needs a new domain; home_domain is a weak host (section 3). Calendar leaf reusable. |
| HTB46 | HTP13 tier currency | Green grape beads and stones; conversion up only; stones from Heavenly Court | Matches. Add a feeding sink as the real constraint (HTB2). |
| HTB47 | HTP14 world-unique items | Immortal Gu with diet, hunger, state, holder-knowledge | Needs a registry; state machine is not just ownership. |
| HTB48 | HTP15 scheduled threats | Calamity and tribulation ledger by rank, with a preview and a decoy or preparation list | Reuse risk quote and floor; add schedule and survival count. |
| HTB49 | HTP16 several bodies | Gu itself is a ranked subject | See HTB50. |
| HTB50 | **Two ranked subjects (missing from root doc; ASC3, ASC21).** Master rank and Gu rank are separate. A Gu death injures the master; a Gu may be worth more than its owner. | Needed. | New kit piece. |
| HTB51 | HTP17 laws that push back | Heavenly Dao balance with two directions (HTB5) | Reason and trigger are known. |
| HTB52 | **Land spirit as a gatekeeper agent (missing).** An NPC attached to a place, with obsession, rules for owner qualification, open and close orders, and self-detonation. | Needed. | New. |
| HTB53 | **Dead aperture or zombie state (missing).** A body that cannot produce essence and must buy it. | Needed in RI; small elsewhere. | New state flag on the owned place. |
| HTB54 | **Permanent venue binding (missing).** A Gu planted once cannot be changed; links a land to a market. | Needed. | Small. |
| HTB55 | **Rule-bound arena (missing).** Merit obelisk: movement radius, no outside comms, expulsion on negative merit. Similar to a trial place (SR rules). | Needed for obelisk play. | New; probably a place type with its own rule row. |
| HTB56 | **Storage gating (missing).** An Immortal Gu aura leaks outside an aperture, so a pocket world is also a vault. | Needed. | Small, ties to HTB32. |
| HTB57 | **Accumulation ledger feeding ascension (missing).** Human qi is a sum over many tracked dimensions. | Needed. | Reads existing mortal state; no new slice if those stay live. |

## 11. The mortal prerequisite (sized)

The immortal tier reads the mortal world. Minimum Rank 1-5 runtime, with size:

| Code | Need | Why immortals read it | Size |
|---|---|---|---|
| HTB58 | Aperture and primeval essence with aptitude cap and regen; four small realms; ranks 1-5 | Gate in; essence tier below beads | M |
| HTB59 | Gu as living items with diet, upkeep, health, vital Gu (deep dive R4, R5) | Ascension keeps vital and core Gu; herds in the land are mortal Gu | M-L |
| HTB60 | Primeval stone economy and clan or market (RANKS s4) | Immortals buy mortal Gu and sell herds (HTP19); two-currency ledger needs both | M |
| HTB61 | Refinement recipes and killer moves (R5, R6) | Immortal killer moves and Immortal Gu recipes extend them | M |
| HTB62 | Accumulation ledger: battle, body, soul, Gu familiarity, understanding, luck, insights | Feeds human qi (HTB57) | S-M, mostly aggregation |
| HTB63 | Lifespan budget about 100 years (R13) | Time-dilated aging in the land has bite only if lifespan exists | S |
| HTB64 | Clan, merit board, inheritance as dungeon (P5, P6) | Land inheritances are the cheapest way into a land (HTB1) | M |

Rough total: ASC21 (rank-one aperture slice with two ranked subjects) plus
the Gu diet and recipe slice, then the wolf-tide and clan slice. About 3-4
medium waves before a Rank 6 slice makes sense, so do not start the immortal
kit until the first RI runtime wave exists (HTP28).

## 12. Early implementation sketch: first Rank 6 slice (proposal only)

**Name: "The inherited blessed land."** Target viewport (UI rule): laptop
desktop first; mobile deferred. Visible outcome: one owned place with its own
clock, a land spirit you can order, a calamity preview, and two or three
Immortal Gu to feed. Not in the slice: the ascension procedure (HTB8-HTB12),
ranks 7-9, Treasure Yellow Heaven, sect play, killer moves of immortal rank.

| Step | Reuses | New | Effort |
|---|---|---|---|
| 1. Owned-place domain with ratio, herds (counts by rank), beads, marks, closed or open state | `world_calendar.js` projection; `registerDomain` pattern from home_domain | A new domain and save slice (HTP22, HTP12) | M-L |
| 2. Land spirit gatekeeper: accept owner, open, close, refuse | Existing NPC and role records | HTB52 | S-M |
| 3. Immortal Gu registry (3 items) with diet, hunger, state, holder-knowledge | heirloom ideas from `heir_inheritance.js` | HTP14 | M |
| 4. Calamity ledger with preview and a decoy and defense purchase | `breakthrough_trial.js` quote and floor vocabulary | A schedule, survival count, wave list; world dial for lethal floor | M |
| 5. Two-currency view: beads and stones, up-only conversion, feeding sink | economy standing, GTR16 vocabulary | HTP13 rows | S-M |
| 6. Time-ratio aging for the owner | `aging_contact.js` | HTB13 factor | S |
| 7. Path engine: expose rank 6 to 7 as a count-fact ladder | `ascension_paths.js` `definePath` with `trial` crossing and a count fact | Facts fed by step 4 | S |

Total about L plus. **Done check (proposal):** from a fresh test origin, an
inherited-land start plays three outside months at 1:16, one earthly calamity
arrives on schedule with a preview and a chosen preparation, one Immortal Gu
starves if not fed and a fed one stays usable, the spirit refuses a rival
owner, the clock and aging read the ratio, and save, reload and import
preserve the registry and calamity ledger. Single authoritative gate:
browser evidence at the laptop viewport; mobile checks cannot substitute.

Rejected default for the slice: a full ascension minigame first. Reason: it
would build the largest unknown (HTB8-HTB12 gates) before the place it
produces exists, and HTB1 shows the place can be tested without it.

## 13. More to consider

| Code | Class | Item and reason |
|---|---|---|
| HTB65 | ACT NOW | Note in the root doc that the blessed land can start from inheritance, so HTP12 and HTP15 prove out before ascension. Reason: it changes the build order in HTP section 8. |
| HTB66 | ACT NOW | Correct HTP17: the Heavenly Dao works in two directions (trim surplus, favor by need). Reason: a one-directional "hostile" law flattens the pushback design. |
| HTB67 | ACT NOW | Add HTB50, HTB52-HTB57 to the root doc's kit list. Reason: HTP16 describes the master only, and the others are built nowhere. |
| HTB68 | ACCOUNT FOR NOW | Calamity interval in outside time depends on grade (HTB3). Any RI schedule row stores aperture years and ratio, not outside years. Reason: avoids a save migration. |
| HTB69 | ACCOUNT FOR NOW | Gu and master are separate ranked records (ASC21) from the first RI runtime wave. Reason: retrofitting after Rank 1 ships breaks saves. |
| HTB70 | ACCOUNT FOR NOW | Upkeep scales with count and rank of Gu, so build "how many can you feed" as the first limit. Reason: the book caps immortals by upkeep (ch745, ch749). |
| HTB71 | ACCOUNT FOR NOW | The lethal floor for calamities is a world dial. Reason: `breakthrough_trial.js` defaults to non-lethal; RI's own text kills owners. |
| HTB72 | ACCOUNT FOR NOW | Sealed secrets: only the secrets a world randomizes are sealed; the public canon above is not (HTP end note). Reason: keeps design docs open for Weibao. |
| HTB73 | LATER | Treasure Yellow Heaven as a fee, appraisal and tamper-risk market with a dimming light. Reason: needs fee data first (not found). |
| HTB74 | LATER | Merit obelisk as a rule-bound arena. Reason: reuses site and trial rules once an arena type exists. |
| HTB75 | LATER | Sect immortal votes on stones. Reason: needs the sect unread windows (HTB44). |
| HTB76 | LATER | Venerable ascension as three meters plus an event, with the blockade's three parts as separate checks. Reason: one source chapter only. |
| HTB77 | LATER | Immortal zombie as a character state beyond HTB53. Reason: only sampled (ch652, saved s3). |
| HTB78 | LATER | Time path as a tool to slow the aperture clock and its cost ("cannot stay paused long", ch1007). Reason: a real dial but unmodeled. |

## 14. Remaining gaps

| Code | Gap |
|---|---|
| HTB79 | Attainment step numeric effects, and the rule converting dao marks into attainment (not found; ch319, ch826, ch1007 held no formula). |
| HTB80 | Rank 9 calamity schedule and the rank 8 to 9 mechanics beyond ch2085's four conditions. |
| HTB81 | Treasure Yellow Heaven fee percentage. Immortal auction windows ch747-752 unread. |
| HTB82 | Immortal justice, information brokers and divination: ch884-885, ch838, ch983 unread. |
| HTB83 | How many Gu Immortals exist and their tier distribution (HTP18). Not given. |
| HTB84 | Whether a land spirit's rejection has a stated qualification test beyond "requirements to become the owner" (ch610). |
| HTB85 | Mortal rank 4 to 5 breakthrough mechanics (deep dive s8) still untraced, and they are the prerequisite for the ascension gate. |
| HTB86 | Chapter index file named in the brief does not exist at the stated path; locators here are checked against the epub only. |
| HTB87 | Wiki-only items: none new this pass; ranks and Venerable framing match WIKI_CROSSCHECK s1. |
