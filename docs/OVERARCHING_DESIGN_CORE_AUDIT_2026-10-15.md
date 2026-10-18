# Overarching design core audit, 2026-10-15

Weibao asked for a way to find the core and other aspects at the overarching
design level ("representations, style, and much more"), then for this run,
then: "another chat is working on ui, we need to work on long standing design
direction and more?"

So this round is about **long-standing game direction**. UI and visual style
belong to the UI chat (the [foundation lane](gm/dispatch/ui-foundation-2026-10-15/COMMON.md)
and [surface types](UI_SURFACE_TYPES_AND_DRAWING_BOARD_2026-10-15.md)). The UI
findings from this run go into a [handoff list](#ui-handoff-for-the-ui-chat),
not into new proposals.

Consideration run only. No source, style, build or dispatch changes. Every
row below is a proposal unless it quotes Weibao or cites PROJECT.md accepted
decisions. Method and rerun steps: [the prompt](OVERARCHING_DESIGN_METHOD_PROMPT_2026-10-15.md).

## 1. Method used

| Code | Method | Used how | Result |
| --- | --- | --- | --- |
| M1 | Inventory | Five read-only readers over about 50 owner docs, by cluster | About 250 rows. Most are proposals, and many concepts are owned 3 to 6 times |
| M9 | Rule-drift scan | One reader grepped the presentation and UI owners for absolutes | 15 hits, 13 of them real drift |
| M8 | Quote mining | 46 verbatim Weibao quotes from USER_VISION and PROJECT.md | 7 theme clusters, which became the pillar draft |
| M3 | Journey walk | Saved natural-play evidence at 1366×768 (absorb-all `checks/natural-play*`), plus code greps. **No live play this run** because the UI lane owns the running tree | First minute and first combat were seen. World jump, prestige and the week-later return were **not exercised**: they are not playable yet |
| M4 | Cross-world stress test | Base village, a Chinese cultivation book, JJK/Bleach, a status-window LitRPG, a nonhuman start, a comic world | 5 new rows (section 5) |
| M6 | Retrofit-cost ranking | Applied to every row | Ordered the register |

Skipped: M5 (the docs already hold reference teardowns) and M7 (no single
uncertainty needed an outside critique yet).

**Why this combination works:** the inventory finds what exists, the drift
scan removes fake rules before they harden, the quotes keep pillars in
Weibao's words, and the journey and stress test find what nobody owns.

**Headline finding.** The project has no direction spine. Direction lives in
about 30 palette docs plus PROJECT.md, and PROJECT.md still carries rows that
later decisions superseded without marking them. The eight undecided
questions in [section 3](#core-tier) sit under almost every palette. Each
new topic round re-asks them locally, which is why "other aspects" keep
turning up late.

## 2. Pillars draft (proposals, from Weibao's words)

Each pillar uses only Weibao's quotes (IDs from the quote harvest, listed with
lines in [section 8](#8-quote-ledger)). It is written as default and dial, per
his "There shoudnt be absolutes". **Status: P, all of them.**

| Code | Pillar | His words |
| --- | --- | --- |
| PL1 | **Many worlds, each with its own rules.** Worlds differ in law, power and economy, canon first. Nothing is global except crossing, conversion and saves | "different worlds with different systems/powersystems"; "everything needs to make sense in their respective worlds" |
| PL2 | **Everything possible, reasonably.** Defaults stay modest; other answers stay reachable through a world, a means, a cheat or a choice | "the goal is everything is possible reasonably"; "Nothing has to only work 'once'" |
| PL3 | **A lived world that moves around you, in time.** Worlds keep their natural course; lives age; you choose what to touch | "World that moves around me... Stuff that I shant meddle in until I have the power"; "make time have meaning" |
| PL4 | **You know what your means reveal.** Discovery, appraisal and sealed truth apply to the player and to NPCs alike | "I wont know whats so special about the mmyself until its discovered"; "decided by means, on both sides" |
| PL5 | **An idle RPG first, with active depth, vanilla kept.** Passive growth is the backbone; mechanics, not just numbers, give it depth | "it should be able to level up passibely"; "I just dont want to lose the 'vanilla' experience" |
| PL6 | **Restraint makes effects land; one coherent look.** Presentation pillar, owned by the UI chat | "this is to make any effect that does show up that much more impactful"; "inherit more of Proto23's identity" |

Constraints, not pillars: desktop first, sealed secrets, save safety, the
solo player.

## 3. Aspect register

Tier tests: **Core** if two of these hold: touches every world or system,
costly to retrofit, defines identity, or parallel lanes drift without it.
**Account for now** if one holds. **Later** otherwise.

Status: W is Weibao's words or PROJECT.md accepted. P is a proposal. O is
open. N needs evidence. Evidence labels: SHOWN (seen in code or play
evidence), STATED (a doc says it), INFERRED.

### Core tier

Historical discovery framing: these were the eight undecided core questions.
The discussion below now supplies broad answers; current status is in each row
and the linked direction summary. Exact technical contracts remain distinct.

| Code | Aspect | Status | Owners now (none synthesizes) | Leading default and dials, from existing docs | Retrofit cost | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| OD1 | **Unit of play: what one life or run is** | W, broad default accepted 2026-10-15; continuation mechanics open (discussion below) | [PROJECT](../PROJECT.md#accepted-decisions), [rulebook](RULES_FROM_SCRATCH.md), [continuation choice](worlds/CONTINUATION_CHOICE_CONSIDERATION_2026-10-13.md), [succession](worlds/SUCCESSION_BY_WORLD.md), [selves](SELVES_AND_ECHOES.md), [timelines](TIMELINES_AND_DIVERGENCE.md) | Current: one life follows one person; the journey can continue across lives or indefinitely through means. Body/soul identity and transitions open; earlier one-body/death-bound default is historical | Very high: saves, prestige, heirs and records all key off it | STATED |
| OD2 | **Prestige: what resets and what carries** | W, carryover direction accepted 2026-10-15; detailed mechanics open (discussion below) | PROJECT ("reset and retention rules" undecided), [north star](LIFE_SIM_NORTH_STAR.md) ("first prestige layer is death and the next life"), [direction synthesis](DIRECTION_SYNTHESIS.md) (return to the beginning), continuation choice | Current: memories/base cheat persist; other retention via world/means and improvable. Death-only reset and blanket no-stat-inflation are historical proposals | Very high: the first milestone is "one prestige layer" | STATED |
| OD3 | **Death's role** | W: defeat stays unconsciousness; aging out is accepted (rule 7). O: death as run end | PROJECT, succession, rulebook | Default: native defeat stays unconsciousness; true death is a per-world dial that ends the life and feeds OD2 | High | STATED |
| OD4 | **Active vs idle, and offline time** | W, broad direction accepted 2026-10-15; detailed rates and policies open (discussion below) | [USER_VISION](USER_VISION.md), rulebook idle table, [format](YAIR_FORMAT_AND_STORY_DELIVERY_2026-10-14.md) R2, nonhuman CF12, engine RT8 | Default: the current life progresses while idle; absent worlds hold still (rule 7, W); offline is a policy per system; no unattended irreversible choices. Harsh modes opt in | High: every system needs an offline policy | STATED. Contradiction C5 |
| OD5 | **How worlds connect** | W, means-based routes/returns and same-world/fresh-parallel access accepted 2026-10-15; detailed mechanisms open | [multiverse structures](worlds/MULTIVERSE_STRUCTURES.md), rulebook rules 2 and 5, [cheat cosmology](CHEAT_COSMOLOGY.md), world core kit K15 | Default: independent worlds joined by carrier edges, with durable histories and bounded first visits. Dials: tabletop-informed multiverse types | High | STATED |
| OD6 | **Who the player is** (soul, person or guide) | W, continuing self plus means-based identity/control alternatives accepted 2026-10-15 | [player identity](worlds/PLAYER_CHARACTER_IDENTITY_AND_CONTROL_2026-10-13.md), north star A/B/C, nonhuman frame | Default: the player is the traveler's self across bodies; the log voice follows the current life. Dials per world (possession, reincarnation, guide) | High: voice, knowledge and nonhuman starts all depend on it | STATED |
| OD7 | **Story grammar and the director** | W, authored plots/simulation by world/mode and natural canon course accepted 2026-10-15; mechanisms open | format D2, [emergent systems](EMERGENT_SYSTEMS.md) E2/E5/E6, [procedural story](PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md), [generation rules](GENERATION_FOUNDATION_RULES_2026-10-14.md), [rulebooks and GM](RULEBOOKS_FOR_WORLDS_AND_GM_CONSIDERATIONS_2026-10-14.md) | Default: authored scenes, plus state-driven encounters, plus simulation, plus a journal. One director reads per-world dials (storyteller, cruelty, natural course). Text is grammar over fact IDs | High: every world's content pipeline | STATED |
| OD8 | **One authoritative record per subject**, with truth/knowledge/representations separate (including skills) | W, accepted 2026-10-15; schema/technical consolidation open | [format audit](FORMAT_AND_VIEW_DECISION_AUDIT_2026-10-14.md) DV1; nothing for other kinds | Default: one id, name, known-state and description record per kind, projected through knowledge. The existing view projectors (`worldIdentityView`, `skill_discovery.js`) are the pattern to copy | **Highest, and growing.** Code check: person, time and self are FRAGMENTED; place, item, ability and stats are PARTIAL; place literals sit in about 197 files | SHOWN |

OD8 is the engine form of Weibao's "simple rules to help implement everything
else" (Q44). It is also the one core row that gets more expensive every
week, because each new pack adds parallel name strings.

### Account for now

| Code | Aspect | Status | Owner | Default and dials | Evidence |
| --- | --- | --- | --- | --- | --- |
| OD9 | **Direction spine**: short linked summary | W, requested and delivered 2026-10-15 | [Direction summary](DIRECTION_SUMMARY.md), derived from USER_VISION and PROJECT | Accepted answers and open decisions; pillars remain proposals | Documentation checked, not gameplay proof |
| OD10 | **Random entry mechanics**: pool, odds, reroll, stranger or heir | W, guided randomness plus full random/specific options accepted 2026-10-15; detailed access open | PROJECT, [starts palette](STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md) P5 | Depends on OD1 and OD2. Answer it after them | STATED |
| OD11 | **Economy philosophy across worlds** | W, local economies and means-based cross-world trade/arbitrage accepted 2026-10-15; exact mechanics open | scattered: world core kit K8, technology, nonhuman society | Default: each world's economy is a world-card field; cross-world value moves only through carriers and conversion (OD5) | STATED |
| OD12 | **Difficulty and reload policy** | W, forgiving recovery/save-reload and separate danger/recovery accepted 2026-10-15; detailed policies open | direction synthesis (fixed bands), north star (gentle rewind, ironman) | Default: fixed authored bands, readable mechanics, rewind as a per-life setting. Tailored nemeses stay a dial | STATED |
| OD13 | **Voice and register guide for authoring agents** | W, direct narration and variable voices/discovery accepted 2026-10-15; precise style/mechanics open | none | Agents write most player text. Rules for tense, person (OD6), naming and world register, and **no dev words in player text** (J2) | SHOWN |
| OD14 | **Knowledge store, one owner** | W for OD8 separation; technical owner consolidation still P | presentation, shared foundations, procedural story, engine runtime, generation rules, scorecard | Merge into one contract under OD8: truth, knowledge and surface as separate writes | STATED |
| OD15 | **Returning-player recap, one owner** | W, short adjustable/known recap and intent reminders accepted 2026-10-15; technical consolidation open | presentation, procedural story BF5/T1, comic CK7/CK18, direction synthesis | One digest owner; worlds skin it | STATED |
| OD16 | **One settings and dials model** (difficulty, storyteller, offline, effects, meta, text speed) | W, comfort/prospective mode/in-world means separation accepted 2026-10-15; exact policies open | scattered (life-start card, presentation toggles, panel kit) | Two layers: per-life dials chosen at start, and per-browser comfort settings. The UI chat owns the screen | STATED |

Additional account-for-now topic surfaced by the discussion:

| Code | Aspect | Status | Existing owner | Proposed default |
| --- | --- | --- | --- | --- |
| OD24 | Player goals and guidance in independent lives | W, player pursuits/guidance/campaign options and cheat/relationship/responsibility sources accepted 2026-10-15; continuity/mechanics open | Character/world-event, story and world/start owners | Player chooses pursuits; known opportunities and suggested next steps help, without requiring one global main quest. Local obligations/canon consequences remain real. |

Additional open discussion topic, not an implementation gate:

| Code | Aspect | Status | Existing owners | Proposed default |
| --- | --- | --- | --- | --- |
| OD25 | Experimentation and creative power applications | W, known actions plus means-based research/experiments, failed learning and cheat help accepted 2026-10-15; mechanisms open | Play-beyond-menus, ability/cheat and world owners | Clear known actions plus supported research/experiments to discover new uses, beyond only named preset combinations. Exact scope/feedback open. |

### Later, with triggers

| Code | Aspect | Promote when |
| --- | --- | --- |
| OD17 | Content rating and horror policy | The first world with graphic content enters a wave |
| OD18 | Localization and Chinese text | The Hanzi field ships or a Chinese-source world is campaigned |
| OD19 | Audio policy | Any sound asset is proposed |
| OD20 | Privacy and telemetry (play log, share card) | Any export or share feature is built |
| OD21 | Data-mod governance | A second author or modder appears |
| OD22 | Code-ID registry across docs (X, P, IM, SB, CW collide today) | The next audit cites a colliding code. A cheap prefix rule fixes it |

## 4. Contradictions and gaps

Stale direction is the main source of drift. Each item needs a dated-history
mark in its owner, not a rewrite.

| Code | Conflict | Files |
| --- | --- | --- |
| C1 | "Original UI is the baseline, no separate windows" is still listed as accepted, beside the 10-15 Proto23 look and surface types | PROJECT.md:370 vs :33, :41 |
| C2 | Jade Hollow is still presented as "first slice" | EXPANSION_DESIGN.md:5-18 vs PROJECT.md:368 (retired 10-01) |
| C3 | Four meanings of prestige | PROJECT.md:290, north star:3900, direction synthesis:241, continuation choice:13 |
| C4 | "Lives age and end" vs "true death remains a proposal" | PROJECT.md:402 vs :378 |
| C5 | Offline: "no faction decay offline" vs "factions act while you idle" vs "a policy per system" | direction synthesis:375, rulebooks RB2, engine RT8 |
| C6 | **Both from Weibao:** random start, Frontier optional vs vanilla opening kept | PROJECT.md:353 vs :365, north star:4485 |
| C7 | Per-world creation screen vs creation screen parked | north star:2383 vs PROJECT.md:158 |
| C8 | The north star's "does this make one life feel lived?" is still written as a gate for every wave; cheat tiers say "higher tier wins" | north star:15 and :1275 vs rulebook:211 (softened) and cheat cosmology (no rank) |
| C9 | The heir slice is marked "code change pending" but was built 10-13 | PROJECT.md:409 vs rulebook:50-58 |
| C10 | The format audit says Q1 was "recorded as accepted in PROJECT.md"; no such entry exists. Storyteller and cruelty dials claim "accepted 2026-10-09" with no quote | format audit:109; rulebooks:82, 110 |
| C11 | Frontier's world card calls it "the home world" | WORLD_CARDS.md:38 vs PROJECT.md:353 and rulebook (home is a relationship) |

**Gaps with no owner:** OD1 to OD8 as syntheses, OD9 spine, OD13 voice guide,
OD16 settings model, OD17 to OD21.

**Rule drift outside UI** (rewrites proposed for each owner, not applied):
the presentation doc's P1 ("effects never... hide information") conflicts
with its own darkness effects. Notes "never unlock" appraisal (UI at scale,
line 789) clashes with PL4 means. Reveals that fire "once and never replay"
clash with Weibao's no-"once" stance. Full list: [appendix A](#appendix-a-rule-drift-list).

## 5. Journey and stress-test findings

| Code | Finding | Evidence | Row it fed |
| --- | --- | --- | --- |
| J1 | The first screen shows about 20 surfaces, including dev controls (Authoring, Layout, "dummy hit counter") and opt-in proposals above core actions | SHOWN: natural-play `01-fresh.png` | UI handoff U1 |
| J2 | Player text carries development status. 22 `(proposal` strings in `src/` reach the screen ("Combat options (proposal)", "Hazardous storm/gust profile (proposal, off by default)") | SHOWN: natural-play-2 `03`, `07`; grep | OD13 |
| J3 | The log shows "1006 new" unread inside Reports after one short session | SHOWN: natural-play `26-final-frontier.png` | OD15; UI handoff |
| J4 | World jump, prestige, death into the next life, and a week-later return could not be walked: they are not playable | INFERRED from evidence and PROJECT | Confirms OD1 to OD4 as the unbuilt core |
| S1 | Status-window LitRPG: the status panel is in-world there and an overlay elsewhere. Diegesis is a per-world dial that nothing owns | INFERRED | OD7, OD16 |
| S2 | Nonhuman start: "Talk to someone", equipment slots and vitals assume a human body. Verbs and slots must come from the self record | SHOWN: self is FRAGMENTED, no nonhuman model in `src/` | OD8, OD6 |
| S3 | Cultivation book and JJK: realm numbers, voice register and pacing (combat-forward) differ by world. Voice needs a per-world register, not one narrator | INFERRED | OD13, OD7 |
| S4 | Comic world: a medium layer (panels, captions, SFX lines) sits above skins. The comic doc already separates world law from presentation skin | STATED: comic CO1/CA2 | OD7 |
| S5 | Base village: every core question still holds, so none of OD1 to OD8 is a book-world-only concern | INFERRED | Tiering |

## 6. Questions for Weibao

At most five. Each has a default that applies if he says "sure".

| Code | Question | Default if "sure" |
| --- | --- | --- |
| Q1 | Unit of play (OD1) | W 2026-10-15: one person per life; journey across lives; indefinite continuation through means. Earlier one-body default is historical |
| Q2 | Carryover (OD2) | W 2026-10-15: memories/base cheat persist; other retention via world/means and improvable. Death/reset details open; no blanket raw-stat ban |
| Q3 | Idle and offline (OD4) | W 2026-10-15: routines continue, stop for important choices/resources; return summary; optional world-dependent aging; inactive worlds pause by default |
| Q4 | Consolidate accepted direction and conflicting history | W, requested and delivered 2026-10-15; linked direction summary and reconciliation below |
| Q5 | Opening/OD10 | W 2026-10-15: guided randomness default; full random/specific starts via means, possible unlocks; known-risk warnings. Village-first superseded |

Next round, after these: OD5 world connection, OD6 who the player is, OD7
story grammar, and OD8 semantic records (engine design with a strong model).

## UI handoff for the UI chat

Findings only. The UI chat decides.

| Code | Item | Source |
| --- | --- | --- |
| U1 | First-screen budget: dev controls and proposals are on the play surface (J1). Surface types already cover proposals; dev controls are not covered | natural-play evidence |
| U2 | Three competing layout skeletons: DU3 (Proto23), ZN1 (five regions), MA1 (traveler's desk). Only DU3's top panels are accepted | UI identity:79, UI at scale:295, :1257 |
| U3 | Proto23 navy and teal fills vs Vivid role tints; role tints are written as "never per world" (drift against PL1) | thematic UI:244, panel kit:36 |
| U4 | Esc layering: "pops the center mode" vs "peels one layer without cancelling work"; F6 is intercepted by browsers | foundation OA6, UI at scale:1221, :1014 |
| U5 | `definePanel` vs the contribution registry: the relationship is not stated. 6 of 48 `*_ui.js` files register; no token file; about 182 raw colors in `styles/` | code check |
| U6 | Life pace and mortality are chronicle-panel buttons; they belong on the life-start threshold (Round 2, OX5) | `chronicle_ui.js` |

## 7. Rerun

**Triggers:** Weibao asks "other aspects", "overarching", "design direction"
or "core"; a core row (OD1 to OD8) gets an answer; a new world family or a
new progression layer enters a wave; or two rounds of a topic audit re-ask a
core question.

**Inputs:** [the method prompt](OVERARCHING_DESIGN_METHOD_PROMPT_2026-10-15.md),
this file, PROJECT.md accepted decisions, and USER_VISION entries since the
last round.

**Steps:**
1. Re-harvest only owners changed since the last round (`git log --since`).
2. Re-mine quotes added since then.
3. Update row status and close answered questions.
4. Rerun the drift scan on changed owners.
5. Walk any newly playable journey from fresh-origin evidence.
6. Write a round section here with new codes.

Keep the UI split: UI rows go to the UI chat's owners.

**Cost note:** the harvest suits cheap readers, at about five in parallel,
each owning one cluster. Tiering, pillars and questions stay with one strong
coordinator.

## 8. Quote ledger

Line numbers are USER_VISION.md unless a file is named. Q-IDs here are
harvest IDs, separate from section 6.

PL1: Q30 (1993), Q40 (166), Q41 (1224), Q42 (3002).
PL2: Q25 (448), Q26 (431), Q27 (507), Q28 (1832), Q29 (1902), Q31 (1997), Q44 (976).
PL3: Q34 (852), Q35 (598), Q36 (1492), Q43 (393), Q45 (1326).
PL4: Q32 (1868), Q33 (1872), and PROJECT.md accepted means and sealed rules.
PL5: Q21 (1514), Q22 (1314), Q37 (2317), Q38 (668), Q39 (1106).
PL6: Q2 (3082), Q13 (1876; PRESENTATION_AND_FOURTH_WALL:22), Q14 (1848), Q23 (1156).

## Round 2: gameplay representation of the core questions, 2026-10-15

Weibao: "Lets ciscuss, but we need to consider the gameplay representations
and more? mroe to consider?"

"Gameplay representation" here means how each core answer shows up in play:
the thing in the world, the verb, the moment and the feeling. Screen layout
stays with the UI chat. All rows are proposals.

### What already exists (code check)

| Code | Fact | Evidence |
| --- | --- | --- |
| RF1 | **The clock is about one game minute per tick, at one tick per second.** A game year (360 days) is about 6 real days of continuous play at 1x. The mortal chronicle's 18-to-80 life is about a real year of nonstop play. Travel and sleep skip faster, so this is an upper bound | SHOWN: `config.js` tickrate 1; undo proof shows 5 ticks = 5 minutes; `life_record.js` LIFE_YEAR_MINUTES |
| RF2 | Mortality is an opt-in choice when you enroll in the chronicle: "Begin chronicle · age 18, no old-age ending" or "Begin mortal chronicle · age 18, life ends at 80". These are buttons in the Elder & chronicle panel | SHOWN: `chronicle_ui.js` |
| RF3 | **Next life is partly built.** An ended life offers an heir (`beginHeir`, with a preview of what the life left) or an independent life. The ended life is archived as its own save key | SHOWN: `main.js` beginHeir and beginIndependentLife; `heir_inheritance.js` |
| RF4 | The life record is a lossy biography: kinds include beginning, journey, loss, family and legacy. "Remember this day" is a manual player verb | SHOWN: `life_record.js`, `life_record_ui.js` |
| RF5 | The world stays "Unknown world" until learned | SHOWN: `world_knowledge.js` worldIdentityView |
| RF6 | No offline-progress system was found. Closing the tab appears to pause the life | INFERRED: no offline or away-time code in `src/` |
| RF7 | Native defeat is counted as `total_deaths` in the save, while design calls it unconsciousness | SHOWN: save envelope in the undo proof |

### New core row

| Code | Aspect | Why core | Leading default and dials |
| --- | --- | --- | --- |
| OD23 | **Time scale and compression**: how fast years pass in play. **W, broad direction accepted 2026-10-15; detailed rules deferred** (see discussion below) | It informs OD1, OD3 and OD4. At the native rate (RF1), a life never ends inside normal play, so "lives age and end" (rule 7) is invisible unless something compresses time | Default: the minute clock during scenes and routines, plus a "let the years pass" verb that folds a settled routine into seasons or years, ending in a recap. Dials: a per-world time ratio, a life-pace setting at life start, and world calendars |

### Representation by question

| Code | Question | In the world | Player verb | The moment | Feeling it serves |
| --- | --- | --- | --- | --- | --- |
| OR1 | OD1 unit of play | The life record (RF4) as the life's book; age stages (child, youth, adult, elder) as chapters; the career as a thread across books | Live, remember, let years pass (OD23) | A chapter title line when a stage turns, said once and quietly (PL6) | A life that is felt as lived (PL3) |
| OR2 | OD2 prestige | An inheritance ledger: things, records, people, standing, blood, unfinished business (rulebook). The heir preview (RF3) already is this | Read the will; choose heir, independent or random life | A threshold screen between lives (surface types: world start already gets a full screen) | Consequence: what you built persists in the world, not as a number |
| OR3 | OD3 death | The last page of the life record and an epitaph. Old age shows first as body changes and slower recovery | Prepare: teach, bequeath, settle debts; or seek per-world ways to extend life | One of the few places where a strong effect is earned (restraint) | Weight, without punishing the solo player |
| OR4 | OD4 idle and offline | A routine (job, training, study) the character keeps, and standing policies that answer small choices, labeled | Set a routine and policies before leaving | A return digest with the biggest change first (OD15) | Trust: nothing irreversible happened behind your back |
| OR5 | C6 opening | The Village as the first life's home; later lives start somewhere random and learn the world's name by living there (RF5) | Choose at the life threshold: the Village, or a random life (dial) | "Unknown world" resolving into a name | The vanilla keeps its place, and suspense comes from later lives |

### Interactions that change the answers

| Code | Interaction | Consequence |
| --- | --- | --- |
| OX1 | OD23 sits under everything. With offline aging at the native rate, a real week away is about a game year. That is a real life-sim cadence (one life is about a real year), but it also means leaving for a holiday ages you | Decide OD23 first, then OD4's aging-offline dial. The rulebook's "no aging while closed" (P) is the safe default; aging offline is a dial |
| OX2 | OD2's default is already partly built (RF3), so it is not hypothetical. The heir derives from the saved envelope, so a life's boundary is a save boundary | Accepting OD2 mostly means renaming and placing what exists, plus a legacy rule for knowledge |
| OX3 | Player knowledge carries across lives even when the character's does not (PL4) | Default: the player's own memory is free; in-world knowledge needs a carrier (records, a teacher, déjà-vu cheats). That matches the rulebook's carrier rule |
| OX4 | The idle genre expects a number that grows across resets; PL5 says idle first | Default: no raw stat multiplier. A small, visible legacy trait (a family name's standing, a soul mark) can be the growing number. Dial per world |
| OX5 | Mortality is a panel button today (RF2), but it is a life-start decision | UI handoff U6: life pace and mortality belong on the life threshold, not in a records panel |
| OX6 | "Deaths" in the save mean knockouts (RF7) | Keep the internal name and say "defeated" in player text when true death ships (OD13 voice) |
| OX7 | Death in another world: whose rules apply, and where does the heir start? | Default: the world you die in decides the death; the heir starts where the life's home relationship is (rulebook: home is a relationship) |
| OX8 | Testing OD1 to OD4 needs reaching old age, death and long absence | LATER: inspection controls (age this life, end this life, simulate an absence) that go through real paths and never leak into normal saves |

### Disposition

- **ACCOUNT FOR NOW:** OD23 joins the core and is answered before Q1. OX3, OX6 and OX7 are default constraints for whoever designs OD1 to OD4.
- **LATER / DELEGATE:** OX8 inspection controls. U6 (life threshold placement) goes to the UI chat.

### Discussion order (revised)

1. **OD23 time scale.** It decides how the other answers feel.
2. Q1 unit of play.
3. Q3 idle and offline, including the aging-offline dial.
4. Q2 prestige, building on what exists (RF3).
5. Q5 opening.
6. Q4 spine, once these are answered.

## Appendix A: rule-drift list

These are absolutes written as decisions with no Weibao quote or PROJECT.md
citation. Each rewrite is a proposal for that file's owner. UI-owned rows go
to the UI chat.

| Code | File:line | Absolute | Proposed default and dial |
| --- | --- | --- | --- |
| RD1 | THEMATIC_UI:244 | Role tints "never per world" | Stable hues by default; a world may override, at an orientation cost (UI chat) |
| RD2 | UI_FOUNDATION:39 (OA3) | Everything else "on demand" | Keep panels visible when the screen allows, per Weibao's "dont condense" (UI chat) |
| RD3 | UI_FOUNDATION:40 (OA4) | "never per-panel CSS" | Prefer token overrides; an exception needs a reason (UI chat) |
| RD4 | UI_IDENTITY:49, :81 | Esc "always" closes; "always" a visible back | Default for replaced views; takeovers and trials may differ (UI chat) |
| RD5 | UI_AT_SCALE:367 | A cheat "never" gets its own popup channel | Shared attention queue by default; a cheat may earn a channel |
| RD6 | UI_AT_SCALE:381 | Enemy cheats "never" get a player panel unless stolen | Observed only by default; appraisal can open one |
| RD7 | UI_AT_SCALE:285; THEMATIC_UI:317 | A reveal fires "once and never replays" | Once by default; a world or setting may replay it |
| RD8 | UI_AT_SCALE:789 | Notes "never unlock" dialogue or appraisal | Not knowledge by default; a journal skill or recorder can make them count |
| RD9 | PRESENTATION:48 (P1) | Effects "never" hide information | Default; in-fiction darkness or blindness may hide it |
| RD10 | PRESENTATION:524 (L11) | The caster "never" dies by accident | Default; per-world dial |
| RD11 | FORMAT_AUDIT:92 (MC3) | A glyph alone "never" carries meaning | Accessible name by default; decorative glyphs exempt |
| RD12 | FORMAT_AUDIT:42 (DV8) | The traveler "always" sees home glyphs | An option: home glyphs or the world's |
| RD13 | UI_FOUNDATION:42 (OA6) | "Click-only parity stays" | Default: shortcuts never remove click paths (UI chat) |

Two absolutes are justified and only need a citation: save-safety lines in
PRESENTATION:214, :354 (AGENTS.md) and hidden traits "never named" in
UI_IDENTITY:93 (sealed secrets, PROJECT.md).


## OD23 discussion answer and focused expansion, 2026-10-15

**W:** ordinary play advances time, settled routines can be compressed, and
pacing varies by world and lifespan. [Verbatim answer](USER_VISION.md#overarching-direction-discussion-od23-2026-10-15).
Detailed rates and lifespan rules can wait until the core is clearer. Earlier
OD23 defaults are historical proposals wherever they go beyond this acceptance;
no mandatory manual-only aging, minute ratio, mortality or offline policy is selected.

### Original-game comparison (source inspection, not play verification)

Local `upstream/master` snapshot `e3356432` (v0.5.5.30, 2026-06-23):
`src/game_time.js` advances a calendar; `src/main.js:5248` advances one minute
normally and six while sleeping, or a supplied duration. `character_creation.js:110`
stores `character.personal.age`; `display.js:5437` displays it. A source-wide
search found no lifespan/aging mechanic and no other `personal.age` consumers.
Thus this snapshot implements calendar time and age metadata, not a mortal-life
loop. It does not establish the author's intentions or the latest upstream state.
The fork's `src/chronicle.js` separately adds opt-in enrollment, age calculation,
and a mortal deadline (defaults: age 18, lifespan 80), alongside an open mode.
Existing implementation does not settle the desired future policy.

### ACCOUNT FOR NOW (proposals, not additional accepted rules)

- **T4:** distinguish elapsed world time, bodily aging and progression rate.
  Usually they align; stasis, long-lived bodies and world crossings may separate
  them through explicit world rules. Longer lifespan need not mean slower actions.
- **T5:** compressed routines account for costs, growth and world events, with
  results explainable afterward. Exact interruption/consent policies remain open;
  neither ignoring consequences nor stopping at every trivial event is a useful
  assumed default.
- **T6:** preserve ordinary idle play when choosing rates. Mortality pressure
  could otherwise make safe training feel like wasting a life. Balance against
  canon calendars and long projects after OD1/OD2/OD4 clarify their purpose.

**LATER:** numeric ratios, target real hours per life, age effects, mortality
rules, offline aging and compression mechanics. No implementation, build, browser
verification or dispatch in this discussion. Next: OD1, one question at a time.


## OD1 discussion answer, 2026-10-15

**W:** one life follows one person, and the broader journey can continue across
lives; longevity or world-specific means can allow indefinite continuation.
[Verbatim answer](USER_VISION.md#overarching-direction-discussion-od1-2026-10-15).
This supersedes the earlier proposed requirement that a life is precisely one
body ending only at death or retirement; soul/body identity details remain open.

**Consideration, tentative:** a "base cheat" could allow returning or starting
something new after death, possibly also before death. Do not resolve "go back"
into rewind, resurrection, an earlier save or a world return without a later
answer. Timing, costs, world causality and what carries belong to OD2 and remain
open. Access to a fresh life need not imply retaining all power or undoing events.

Next: OD4 (Q3), idle and offline progress. No source/build/save changes or commit.


## OD4 discussion answer and expansion, 2026-10-15

**W:** chosen routines progress while away, stopping for important choices or
exhausted supplies, with a return summary. Offline aging is optional and
world-dependent; inactive worlds pause by default. [Verbatim answer](USER_VISION.md#overarching-direction-discussion-od4-2026-10-15).
Earlier blanket no-offline-aging proposals are superseded as universal policy;
no particular world's aging default, progress cap or rate is fixed.

**ACCOUNT FOR NOW, considerations:**

- **T7, elapsed practice:** actual routine time produces rewards and consumes
  its relevant costs. A recap explains both. Disabling bodily aging does not by
  itself decide whether the world calendar advances; that distinction stays open.
- **T8, simulated experience:** a cheat could simulate life and transfer specified
  gains without equivalent external time. Specify whether it transfers memories,
  skills, bodily changes or objects; simulation alone does not establish that real
  people were met or real objects created. Exact rules remain proposals.
- **T9, timeline change:** forward compression, rewinding the same history and
  starting a different branch are distinct possibilities. Reward retention and
  the fate of the previous history need explicit rules if adopted. Do not silently
  turn return/rewind into duplication or strip away gains without a chosen policy.
- **T10, flexible significance:** calendar pressure can matter strongly in one
  world and lightly in another. Keep the accepted ordinary passage of time, while
  leaving deadline pressure and mortality configurable through relevant means.

Detailed mechanisms deferred. No source/build/save edits, runtime proof or dispatch.
Next: OD2 (Q2), retention and reset, including the proposed base cheat.


## OD2 discussion answer and proposed design rules, 2026-10-15

**W:** memories and the base cheat persist; other carryover depends on world
and means; carryover can improve. [Verbatim answer](USER_VISION.md#overarching-direction-discussion-od2-2026-10-15).
Earlier OD2/Q2/OX4 blanket no-stat-inflation proposals are dated history where
they exclude earned means of retaining power. They are not accepted constraints.
Life transition, rewind, fresh start and world travel remain distinct mechanics;
this answer does not make death mandatory or adopt irreversible permadeath.

### Proposed rules for later design, not additional accepted decisions

- **CR1, carriers:** explain retention through an actual means. A soul mark,
  spiritual tether or record-bearing artifact are possible base-cheat lore,
  not selected truths. Where it came from can remain discoverable in play.
- **CR2, developable retention:** progression may improve fidelity, capacity,
  permitted kinds or reconstruction. Remembering a technique, rebuilding the
  needed body and possessing its energy source can be separate capabilities.
  Powerful eventual retention remains possible through the chosen means.
- **CR3, roguelike variety:** a life can supply its own opportunities, discoveries
  and temporary build while the continuing journey gains means and options.
  Candidates include new starts, retained techniques, affinities and portable
  tools, not just a mandatory global multiplier. No currency or upgrade tree chosen.
- **CR4, explicit time stakes:** world rules identify meaningful calendars, age,
  deadlines, loops and allowed time manipulation. School years and dated canon
  events, cultivation lifespans, or repeating-day worlds are possible uses.
  Calendar advancement, bodily aging and simulated experience remain distinct.
- **CR5, legible transitions:** before committing a known transition, explain
  known retention/loss and its cause at the character's knowledge level. Unknown
  outcomes stay unknown; sealed truths are not revealed by a preview. Exact
  policies for rewind rewards, prior histories and early departure remain open.

**Next question correction:** C6, Q5 and OR5 had incorrectly treated Village-first
as the solution. PROJECT's already accepted random entry (2026-10-11) controls;
vanilla remains playable and is not a required first campaign. OR5's Village-first
representation is historical proposal, not direction. Next discuss how much
control accompanies random entry: broad preferences as a proposed default,
with full surprise and chosen starts as possible dials. No answer yet.

Documentation only. No source/build/save changes, dispatch or gameplay proof.


## OD10 discussion answer and entry considerations, 2026-10-15

**W:** guided randomness by default, plus full random and specific starts as
options depending on means. Unlock gates are a possibility. Warn about known
risks or opportunities missed without relevant cheats/means. [Verbatim answer](USER_VISION.md#overarching-direction-discussion-od10--q5-2026-10-15).
The Q5/OR5 Village-first proposal remains superseded. No mandatory cheat roster,
universal unlock tax or exact random pool is selected.

### ACCOUNT FOR NOW, proposed entry rules

- **ER1, access versus advice:** separate an actually unavailable start (no means
  to reach it) from a reachable but difficult or limited start. A warning alone
  need not block an informed player. Specific unlocks should confer identifiable
  access, knowledge or targeting capability rather than arbitrary permission.
- **ER2, truthful warnings:** use only relevant known facts and label uncertainty.
  Warn about useful consequences such as incompatible power, inability to learn
  a local system, a short calendar window or missing return capability; do not
  reveal sealed world truths. Unknown-world starts may have limited forecasts.
- **ER3, bounded randomness:** full random still needs a declared eligible pool;
  broader risk pools can be an explicit option. Do not silently override guided
  preferences when the pool is empty. Exact fallback/reroll policies remain open.
- **ER4, opportunity versus danger:** distinguish likely difficulty, actual loss,
  and a missed opportunity. A missing cheat need not make a whole world pointless;
  alternate local routes or a later visit may matter where that world's rules
  allow them. Do not promise revisits, paused deadlines or preserved rewards.
- **ER5, changing means:** check entry advice against current capabilities, known
  conversion rules and the actual start/era, not a permanently assigned world
  difficulty label. Retention improvements may make an earlier warning obsolete.

No UI implementation assigned to this chat. These are behavior considerations
for existing world/start/cheat owners, not a replacement schema or accepted rules.
Next: Q4 / OD9, short linked direction summary; then OD5, world connection.
Documentation only, no gameplay verification or commit.


## Direction reconciliation, 2026-10-15

[Direction summary](DIRECTION_SUMMARY.md) is the requested navigation surface;
USER_VISION and PROJECT retain authority. Register/questions now reflect the
answers. Original changed wording is preserved below as historical proposal.
Other audit rounds remain subordinate dated considerations.

| Conflict | Disposition in this bounded consolidation |
| --- | --- |
| C1 | PROJECT's original-panel restriction labeled historical; live Proto23/surface-type/UI rules control. No UI edit. |
| C2 | EXPANSION_DESIGN's Jade Hollow first slice labeled retired history under the existing 2026-10-01 decision. |
| C3 | OD2/Q2 and continuation/north-star/synthesis owners reconciled: memory/base cheat persist; other retention via means and improvable. Exact reset/death/replay open. |
| C4 | Rulebook notice narrows aging/end language: no mandatory death loop inferred. Native defeat remains unconsciousness; detailed true death unselected. |
| C5 | Rulebook/synthesis notices defer to accepted routines, choice/resource stops and optional world-specific offline aging. Event/decay policies open. |
| C6 | North-star/WORLD_CARDS first-campaign wording marked historical. Guided randomness accepted, vanilla preserved and optional. |
| C7 | North-star creation proposal marked as future idea; parked current screen unchanged. |
| C8 | North-star every-wave test marked as a lens, not a universal gate. Cheat rank/equalization remains with its existing owner; no new restriction inferred. |
| C9 | PROJECT pending-heir statement corrected to rulebook's dated built-first-slice report, not fresh runtime verification. |
| C10 | Earlier audit allegation is not proof of absent authority: USER_VISION's 2026-10-09 accepted-principle passage explicitly supports cruelty per world/storyteller and storyteller stacking. Do not downgrade them based on this audit. Format Q1 is a conditional question, not proof acceptance occurred. Quote-level review remains outside this consolidation. |
| C11 | WORLD_CARDS compulsory/default Frontier origin labeled historical. No new home-relationship law accepted. |

### Preserved pre-consolidation register/question wording

Historical proposal, not current direction:

> | Q1 | Unit of play (OD1): is a life one body, and a career the chain of lives? | Yes, with per-world dials. Recorded in PROJECT.md and used by OD2 and OD3 |

> | Q2 | First prestige layer (OD2, OD3): death and the next life, carrying legacy (records, knowledge, a vault) but not raw stats? | Yes. True death becomes a per-world dial; native defeat stays unconsciousness |

> | Q3 | Idle and offline (OD4): the current life keeps living while away, absent worlds hold still, and nothing irreversible happens unattended? | Yes, as the default. Harsh offline modes opt in |

> | Q4 | Write a direction spine (OD9) and mark stale rows C1 to C11 as dated history? | One page under 200 lines, linked from PROJECT.md. A cheap doc-only lane |

> | Q5 | Opening/OD10: how much control accompanies random entry? | Historical Village-first proposal superseded 2026-10-15: PROJECT already accepts random entry for the expanded run, with vanilla preserved and optional. Discuss broad start preferences versus full surprise; no new answer yet |

> | OD9 | **Direction spine**: one short page with pillars, core answers and links, kept current | O | none (PROJECT.md is the de facto spine, with stale rows) | A page under 200 lines that links owners and restates nothing. PROJECT.md summary points to it | SHOWN (C1 to C8 below) |

> Default: a life is one body from start to death or retirement, and a career is the traveler's chain of lives. Dials: a world may bind a life to a soul, a lineage or a loop

> Default: the first layer is death and the next life (fresh random or heir), carrying legacy (records, knowledge, a vault), not stat inflation. Dials per world


### Engine and other discussion routes: recommendation only

A bounded technical review is worthwhile if it catches expensive assumptions
before implementation. Reuse current engine owners rather than a parallel product
specification. Inspect life/world/branch identity, clocks/catch-up, retention
transactions, knowledge projections and save compatibility. Return concrete
constraints and only questions that materially change player experience.
This chat retains gameplay decisions; UI stays with its existing lane.
Capability: current capable model, strong reasoning for coupled save/system
questions. No model override or worker created. Done check: source-linked
findings with alternatives/costs and a finite question list, no runtime changes
or invented product defaults. Dispatch is not requested.

OD5 next, one question at a time: propose independent world histories with
means-based routes and returns, while hubs, linked cosmologies, pockets and
branches remain possible structures. Whether to adopt that default is unanswered.


## OD5 discussion answer and representation boundary, 2026-10-15

**W:** own world histories, connections/returns through means, growing access,
same-world revisits and fresh/parallel versions. Crossing alone does not reset
history; supported cosmologies can coexist. [Original answer](USER_VISION.md#overarching-direction-discussion-od5-2026-10-15).
Multiverse/timeline owners updated; exact cheats and branch mechanisms unselected.

### ACCOUNT FOR NOW, proposed considerations

- **WC1, destination identity:** returning to a changed world, visiting a parallel
  counterpart and generating a fresh version produce different histories. Explain
  the known destination through actual means, without spoiling sealed differences.
- **WC2, meaningful parallelism:** a fresh version need not erase the original.
  Prior relationships/claims belong to their actual people/history unless a means
  transfers them. A counterpart may differ; no universal sameness or difference
  is inferred, and power/cargo conversion remains world/edge dependent.
- **WC3, cheat scope:** route finding, creating a fork, rewriting an event, linking
  versions and merging worlds are different possible effects. Name what a chosen
  cheat actually changes and what it retains. These are options, not a required
  cheat catalog, prohibition on strong powers or automatic entitlement to rewards.
- **WC4, access versus time:** an existing return route need not be open at every
  moment; interrupted visits or asymmetric passages are possibilities. They need
  readable known consequences under the entry-warning direction. Exact timing,
  recovery and offline-world exceptions stay open.

### U7, separate representation questions for the existing UI owner

Weibao asks to distinguish UI direction, including 2D or subject-specific
representations. Consider which form best supports each task: prose for events,
a spatial view for actual navigation, a timeline/branch view for histories, or
symbols/portraits for recognized entities. A view must reflect actual known state;
no map layout establishes world topology, no hidden truth is revealed by a branch
viewer, and no view is universally required. These are considerations, not an
accepted 2D direction, implementation request, or replacement for existing UI rules.
No cross-chat message or new chat dispatched. Desktop/laptop remains primary.

Next OD6: continuing self versus other identity/control premises. No answer yet.
Documentation only; no runtime proof or commit.


## OD6 discussion answer and special-start considerations, 2026-10-15

**W:** one continuing self by default; possession, shared minds and multiple
bodies through means; coherent lore for special starts. [Verbatim answer](USER_VISION.md#overarching-direction-discussion-od6-2026-10-15).
Identity owner updated. Previous O1/O8 recommendation is no longer merely a
proposal at this broad level; exact ontology/control mechanisms remain open.

### ACCOUNT FOR NOW, proposed considerations

- **IC1:** body, self, memories and power source may have different continuities.
  Explain special starts through a selected premise, such as incarnation,
  displacement, an awakened vessel or a shared bond. No origin selected.
- **IC2:** shared minds need an actual knowledge/communication relationship;
  multiple bodies need a rule for attention, independent routines and whose
  experience is retained. One continuing self need not entail every body sharing
  all senses, skills or injuries instantly. Such sharing can itself be a power.
- **IC3:** local people recognize what their means reveal; a remembered bond
  does not automatically prove identity to someone else. Body/soul/contract-bound
  powers and obligations follow their actual holders and supported transfer.
- **IC4:** unusual starts must have useful first actions and understandable known
  control terms. Lore explains their playable situation without forcing an early
  exposition dump or revealing sealed truths.

Representation-direction chat explicitly authorized in this answer; gameplay
continues here with OD7. Engine review remains recommended, not dispatched.
No runtime changes, tests of gameplay or commit.


### Representation chat launch, 2026-10-15

Created user-owned chat **Representation direction: 2D views and subject-specific
forms**, thread `01a13e01-3e4d-7ca0-bf59-6feb1c981fdc`, local project checkout.
Initial scope is consideration and one-question-at-a-time discussion, no UI
implementation. Initial write area is only
`docs/gm/REPRESENTATION_DIRECTION_DISCUSSION_2026-10-15.md`; shared direction/UI
owners remain outside that chat's write scope until explicit transfer. It was
instructed to read existing UI owners and respect dirty state/active workers.
This chat retains gameplay decisions; engine review is still not dispatched.


## OD7 story direction and authoring chain, 2026-10-15

**W:** authored plots/simulation by world/mode; canon follows its natural course
unless changed. [Verbatim answer](USER_VISION.md#overarching-direction-discussion-od7-2026-10-15).
Books/AUs/fanfiction and storyteller/cheat effects are requested considerations.
Timeline owner updated; earlier generic medium canon-pressure/fixed-point defaults
remain proposals, not accepted universal settings.

**ACCOUNT FOR NOW:** distinguish AU starting premise, changed causes, attempted
versus effective intervention, knowledge propagation and a supported fate effect.
Surviving motives generate possible new actions through remaining means. No
automatic replacement villain, forced canon restoration or compulsory punishment
for success. Those outcomes can occur through actual causes/world rules, not
merely to rescue a planned scene. NPC/world actions can also change a course;
not every divergence needs direct player intent.

Extended the existing [writer workflow](worlds/self-as-player-expansion-2026-10-13/NARRATIVE_AUTHOR_WORKFLOW.md#od7-writing-and-continuation-chain-2026-10-15):
W1 baseline, W2 disturbance, W3 propagation, W4 playable beat, W5 aftermath/resume.
This provides a finite writing/continuation packet while preserving current owners.
It is not a new staffing hierarchy, runtime engine or mandatory full-world simulator.
No newly inspected book/fanfic example or research dispatch is claimed.

Next OD8: whether shared underlying records should keep world truth, character
knowledge and representations consistent, with per-world law/power definitions.
No answer yet. Engine review remains recommended, not dispatched.


## OD8 answer and causal-correction clarification, 2026-10-15

**W:** authoritative underlying subject record, with truth/knowledge/views
separate, including skills and other subjects; cheats and illusions act through
means. [Original answer](USER_VISION.md#overarching-direction-discussion-od8-2026-10-15).
Heavenly will, fate and historical correction can actually restore canon where
a world provides that mechanism. OD7's rejection of arbitrary plot repair is
not a ban on these powers. Timeline and writer-chain owners clarify this.

Implications saved in [shared foundations](SHARED_FOUNDATIONS_AUDIT_2026-10-12.md#od8-accepted-direction-and-implications-2026-10-15):
KR1 subject identity/components; KR2 skill capability versus understanding;
KR3 perception/belief/memory versus truth changes; KR4 scoped discovery;
KR5 consistent consumers and historical accounts. These implications are
proposed constraints, not an accepted monolithic database or schema rewrite.
OD14's separation is answered broadly; exact owner consolidation remains open.

The initial core discussion has broad answers. Next proposed gameplay question
is OD12 difficulty/recovery/reload, because replay/return and optional harsher
worlds need a player-experience policy distinct from in-world time cheats.
No answer yet, no engine dispatch, no runtime proof or commit.


## OD12 recovery answer, 2026-10-15

**W:** forgiving recovery and ordinary save/reload by default; world danger and
recovery strictness separate; means/cheats affect recovery. Harsher modes or
consequences optional or forewarned. [Original answer](USER_VISION.md#overarching-direction-discussion-od12-2026-10-15).
This does not accept fixed enemy scaling, a particular ironman system, mandatory
permadeath, universal rescue or a penalty table. Existing native defeat/recovery
remains unchanged.

Implications saved under [OD12 in direction synthesis](DIRECTION_SYNTHESIS.md#od12-forgiving-recovery-direction-2026-10-15):
RC1 coherent recovery causes; RC2 stakes without required erasure; RC3 meaningful
strong protection; RC4 viable next steps; RC5 separate world danger, in-world
recovery and player save policy. These are proposals, with exact means/losses open.
Next OD11: economy philosophy and cross-world value. No answer yet, no dispatch,
no runtime proof or commit.


## OD11 answer and restart/recovery refinement, 2026-10-15

[Verbatim answer](USER_VISION.md#overarching-direction-discussion-od11-and-recovery-refinement-2026-10-15).
**W:** local economies, means-based trade/shared currencies, arbitrage and useful
knowledge/items across worlds. Cheat-selling/transfer is possible design scope,
with actual mechanism open. EC1–EC5 implications and adjacent opportunities saved
in the multiverse owner; no automatic market equalization, advantage cancellation
or new universal scarcity rule.

**Recovery correction:** locally unwinnable/trapped loops can exist; continuing
may mean trying elsewhere or restarting within the same life or another life.
RC4 in direction synthesis updated with its earlier proposal preserved as history.
Forgiving recovery does not guarantee every encounter or situation is winnable.
Actual backup availability, same-/different-life restart and simultaneous-life
semantics remain open. The continuation owner separates self/life/body, history,
date, retained gains/claims and concurrency instead of conflating them.

Next question: OD3/OD2 restart/recovery anchors and their available meanings.
This follows the user's new uncertainty before moving to remaining OD13/15/16.
No answer yet. Documentation checked; no runtime implementation, dispatch or commit.


## Anchors, commerce correction and saved workflow, 2026-10-15

[Original answer](USER_VISION.md#anchors-trade-cheat-correction-and-discussion-workflow-2026-10-15).
**W:** anchors via means/cheats; same-/other-life restart including at the same
calendar date; anchors improvable. AN1 in the summary is a local reference code,
not a new system or chosen schema. Starting access/earning and concurrency open.
Continuation owner saves roguelike options and proposes a modest starter plus
improved targeting/retention/reach through play or chosen starts. No answer yet.

**Correction:** prior OD11/EC4 cheat-sale interpretation was wrong for this
request. "Selling cheats" means commerce-oriented powers. PROJECT and multiverse
owner corrected; old EC4 retained as dated history, not user direction. Literal
cheat transfer in unrelated library proposals is neither selected nor prohibited.

The [live question workflow](OVERARCHING_DESIGN_METHOD_PROMPT_2026-10-15.md#live-direction-question-workflow-2026-10-15)
now records QW1–QW7: recover, interpret, reflect, record, reconcile, verify,
continue with one question. Original audit prompt remains historical rerun mode.
A cheat-access/design chat is worthwhile before implementation but not dispatched
on the exploratory question alone. Representation chat remains separate.
Next: initial base-cheat continuation versus earned anchor/retention access.
No runtime changes, implementation tests, dispatch or commit.


## Starting continuation answer and cheat-design launch, 2026-10-15

[Original answer](USER_VISION.md#starting-continuation-research-and-cheat-design-dispatch-2026-10-15).
**W:** modest continuation by default, better anchors/carryover earned through
play or special starts; research is one improvement route. Exact starter/upgrade
mechanics remain open. Continuation owner records research versus actual
modification and alternative practice/insight/teacher/craft/bargain routes as
considerations, not mandatory gates or a selected tech tree.

Created user-owned chat **Cheat access and design: starting continuation, research
and anchors**, thread `01a13e1b-6f99-79a2-8172-b0b5940e78a6`, local checkout.
Explicit authorization in this answer. Initial writable area only
`docs/gm/CHEAT_ACCESS_DESIGN_DISCUSSION_2026-10-15.md`. It owns discussion and a
bounded proposed implementation brief, not shared canonical files, runtime,
tests/build, saves, commits or implementation. It was told the current direction,
commerce-cheat correction, saved workflow, and existing representation ownership.
No engine review dispatched. This chat retains shared gameplay direction.

Next OD16: distinguish browser comfort settings, mode/difficulty/recovery policy
changes and actual in-world rule-changing powers. Whether and how mid-life mode
changes work is still unanswered. No runtime work or commit.


## OD16 settings answer and cheat improvement implications, 2026-10-15

[Original answer](USER_VISION.md#overarching-direction-discussion-od16-2026-10-15).
**W:** comfort freely changeable, difficulty/recovery changes explained and
normally prospective, actual rules alterable through suitable cheats/means.
Older per-life dials chosen only at start remain historical suggestions where
they imply universal locks; explicit stricter commitments are still possible.

Implications saved in [rulebook/GM considerations](RULEBOOKS_FOR_WORLDS_AND_GM_CONSIDERATIONS_2026-10-14.md#od16-settings-versus-in-world-rule-changes-2026-10-15):
MD1 comfort unearned; MD2 pending commitments versus future policy; MD3 actual
law/exception/enforcement/perception/history powers; MD4 discovery/access/acquisition/
use/mastery; MD5 local versus carried improvement. These are proposed distinctions,
not a fixed override hierarchy, universal currency, unlock tree or engine schema.
No new dispatch or message to the cheat chat; its exclusive record stays separate.
Next OD15: recap and resumption, building on accepted offline summaries/choice stops.
No new gameplay implementation, runtime proof or commit.


## OD15 return answer and time-free progress consideration, 2026-10-15

[Original answer](USER_VISION.md#overarching-direction-discussion-od15-and-time-free-benefits-2026-10-15).
**W:** short adjustable recap, important choices paused, intent reminders, only
available knowledge through means/cheats. Existing-game learning requested.
Recap owner records RR1 actual outcomes, RR2 intent/resume, RR3 known scope and
RR4 truthful time accounting as considerations. Existing Melvor audit provides a
source-limited design lead; live references were inaccessible, so no newly verified
two-game comparison is claimed. No fresh game behavior or screenshots observed.

Time-free benefits are a possible unlock, not selected default. Direction synthesis
separates wall time, routine duration, calendar, bodily age and actual cheat effects.
Next: OD4/OD23 calendar clarification, ordinary routine duration advances current
world calendar by proposed default; aging optional, time-free means unlockable.
No answer yet. No extra dispatch/message, implementation or commit.


## Offline calendar answer and responsibilities, 2026-10-15

[Original answer](USER_VISION.md#offline-world-time-decisions-and-responsibilities-2026-10-15).
**W:** ordinary offline progress advances current-world time, aging by world/settings,
means/cheats/capabilities can alter those relationships. Exact ratios not selected.
Important choices remain paused, but the scope of that pause is unresolved.

[Character/world-event owner](CHARACTERS_AND_WORLD_EVENTS.md#offline-decisions-and-responsibilities-consideration-2026-10-15)
saves DR1 standing instructions, DR2 actual commitments, DR3 delegation, DR4
meaningful stops and DR5 coherent clocks as proposals. Next question proposes
stopping current-world catch-up at the first unsupported important decision,
with linked deadlines/rewards at the same time. Remainder banking/resume is not
selected; do not silently grant a time-free production cheat. Other explicit
policies/means may differ. No implementation, worker/message or commit.


## Choice-pause answer and offline time bank consideration, 2026-10-15

[Original answer](USER_VISION.md#current-world-pause-and-unused-offline-time-2026-10-15).
**W:** current-world pause at important choices, with supported policy/helper/cheat
exceptions. Linked deadlines and normal production stop consistently. Character/
world-event owner now marks the pause model accepted at this broad level.

Question about saving unused time answered with a proposal in [banking considerations](DIRECTION_SYNTHESIS.md#banking-unused-offline-time-consideration-2026-10-15):
BT1 unused eligible remainder only, BT2 actual forward play, BT3 separate time
powers, BT4 balance scope/continuity and BT5 clear spending/stop control.
Next question proposes a continuing-journey bank usable across lives/worlds;
portability, caps/expiry, exact rates/restart treatment are not yet accepted.
No bank implementation, save schema, extra dispatch or commit.


## Continuing time-bank answer and improvements, 2026-10-15

[Original answer](USER_VISION.md#continuing-journey-time-bank-and-improvements-2026-10-15).
**W:** bank follows continuing journey across lives/worlds, use affected by world/
mode/cheat, capacity and efficiency improvable. Direction synthesis now marks the
previous bank-scope baseline accepted, and saves BT6 capacity, BT7 spending speed,
BT8 credit conversion, BT9 output per simulated duration and BT10 continuity as
proposed distinctions. No fixed cap/expiry, numeric rates, universal upgrade tree
or automatic compounding rule accepted. Summary TBANK is the broad bank topic row;
BT1-BT10 in the owner remain detailed local consideration codes.
Next OD13 narration/voice. No runtime code, migration, extra chat/message or commit.


## OD13 narration answer and base-cheat discovery, 2026-10-15

[Original answer](USER_VISION.md#overarching-direction-discussion-od13-2026-10-15).
**W:** direct narration with world/mode/means-dependent voices; base-cheat powers
are discovered in play; talking cheats/unreliable narrators/media inspiration are
possible. Voice owner NR1-NR5 and discovery owner save implications without
selecting or exposing a secret, source work or narrator personality. Basic starter
usability versus hidden deeper functions is a proposal preserving prior grants.

The initial core and account-for-now direction questions now have broad answers,
except technical consolidation/precise contracts that need scoped engineering.
Next proposed gameplay question: OD12 challenge growth/scaling. Earlier authored
strength-band suggestions remain proposals; accepted recovery policy does not
choose them. Distinguish actual rival/world progression from automatic matching
of player strength, with world/mode exceptions still possible. No answer yet.
No new research, dispatch/message, runtime edit or commit.


## Cause-driven challenge answer, 2026-10-15

[Original answer](USER_VISION.md#cause-driven-threats-world-agendas-and-adaptation-2026-10-15).
**W:** cause-driven threats, not automatic matching; world/fate/mode/cheat causes
and rival adaptation possible. Rival owner TG1-TG5 and storyteller owner save
implications without adopting a universal agenda controller or new source lore.
Focused pursuit/storylet source observations show reusable seams, not a general
implemented learning adversary. Identity/evidence-to-action integration, world-clock
and branch persistence, and content combinations are concrete difficulties.
Future bounded proofs remain proposals, not implementation assignments.

Next OD24 goals/guidance added as open account-for-now: causal worlds and independent
starts need useful player direction; a global compulsory quest path isn't selected.
This is a new question in the discussion, not a priority change or a new runtime
requirement for existing slices. No answer yet, no dispatch, build or commit.


## OD24 goals answer and continuity question, 2026-10-15

[Original answer](USER_VISION.md#overarching-direction-discussion-od24-2026-10-15).
**W:** player pursuits with guidance/optional campaigns; goals from cheats,
relationships/responsibilities too. Character/world-event owner saves GG1 sources/
terms, GG2 evolving aims, GG3 conflicts, GG4 quiet play and GG5 knowledge/continuity
as proposals. No compulsory global quest chain or automatically accepted offer.
Actual binding means can still impose their selected terms.

Next question proposes optional remembered personal threads across lives and
returns, with actual commitments retained/transferred by their participants,
history and means. This distinguishes parked personal intent from broken promises;
no universal duty inheritance or automatic erasure selected. No answer yet.
No source/runtime change, new chat/message or commit.


## Goal-continuity answer and soul-bound carryover, 2026-10-15

[Original answer](USER_VISION.md#remembered-goals-cross-run-plans-and-soul-bound-duties-2026-10-15).
**W:** optional remembered goals, notes for separate-run possibilities, actual
duties through world/history/means; soul contracts/cheats can preserve benefits
and burdens across lives. Character/world-event owner marks earlier baseline
accepted. Continuation owner SC1-SC5 saves holder, scope/enforcement, benefits/
burdens, known explanation and potential remedies as proposals. No specific
binding, hidden soul truth, contract UI or unconditional cleansing selected.

Next question: harmful carryover policy, known warnings and supported remedies,
with optional safer-mode protection. Do not infer every obligation follows the
soul, every counterpart owes it, or every restart clears it. No answer yet.
No source/runtime work, extra dispatch/message or commit.


## Binding-remedy answer and exchange interactions, 2026-10-15

[Original answer](USER_VISION.md#binding-remedies-and-exchange-cheat-interactions-2026-10-15).
**W:** bindings carry by actual rules/means, known warnings, research/cheats can
detect/remove/change them. Exchange of a bond for rolls/resources is a possibility,
not a chosen universally available cheat. Continuation owner marks broad remedy
baseline answered; cosmology owner saves BX1 subject, BX2 authority/participants,
BX3 burden value, BX4 bundled effects and BX5 settlement/continuity as proposals.
No arbitrary rank, ban on repeated profitable loops, guaranteed omniscient quote
or universal contract law is selected. Specific worlds/means decide interactions.

Next OD25 experimentation introduced as an open consideration topic because the
user raises creative applications not necessarily named in a fixed action list.
Use existing interaction/ability/cheat owners; no AI resolver, UI rewrite or
universal combination framework authorized. No answer yet or new dispatch/commit.


## OD25 experimentation answer, 2026-10-15

[Original answer](USER_VISION.md#overarching-direction-discussion-od25-2026-10-15).
**W:** known actions plus experiments/research through means, failures can teach,
cheats can help discover combinations. Interaction owner saves EX1-EX5 evidence,
practice, useful trial, assistance and actionable learning distinctions. Ability
owner saves modular/procedural considerations: actual supported effects, local
exceptions, generated hypotheses versus proven outcomes, ordering/combination and
knowledge/persistence difficulties. No universal grammar/resolver/framework chosen.
Next question: how much pre-experiment guidance is the default, with known costs/
risks, investigative purpose and uncertain undiscovered results; modes/means can
supply deeper hints. No answer yet, no extra dispatch, implementation or commit.


## Experiment-guidance answer and detail-review routing, 2026-10-15

[Original answer](USER_VISION.md#experiment-predictions-and-consolidating-remaining-details-2026-10-15).
**W:** known costs/risks, uncertain knowledge-/means-dependent predictions, improved
by expertise/cheats. Interaction owner marks prior guidance default answered and
records forecast scope/precision/confidence versus observed results as implications.

Workflow revised at user's request: routine consequences/derivations are handled
directly, new proposals are not falsely accepted, and only real consequential
choices prompt questions. At most one question when needed, not mandatory one
per reply. Broad direction is mostly answered; exact engineering/implementation,
world-local authoring, scope and playtested tuning need classification rather
than an indefinitely expanding interview.

Useful review areas: existing engine contracts and compatibility; interruption/
clock/banked-time semantics; progression/economy/active-idle tuning tied to actual
play; world/canon/AU authoring; experiment/discovery procedures. Representation
and concrete cheat design remain with their already created chats. No new product
priority or runtime gate is inferred from this inventory.


Created user-owned **Direction detail review: resolve defaults and identify
consequential gaps**, thread `01a13e47-e9d3-76a3-ac9c-e21475e8ff96`, local checkout.
Only initial writable path: `docs/gm/DIRECTION_DETAILS_REVIEW_2026-10-15.md`.
Task: execute a bounded review, resolve straightforward derivations in the report,
propose routine defaults, distinguish source/runtime evidence and return at most
five consequential human questions. No shared-owner/source edits, implementation,
commit, worker dispatch or messages authorized. Parent keeps canonical integration.
Next question will be selected from an actual remaining tradeoff, not invented
before the review. No substantive review completion claimed at creation.

## Detail review fold and cheat-answer reconciliation, 2026-10-15

[Weibao authorized the fold](USER_VISION.md#direction-review-fold-and-cheat-answer-reconciliation-2026-10-15).
The [review](gm/DIRECTION_DETAILS_REVIEW_2026-10-15.md) found no additional
consequential question ready within its non-cheat/non-representation scope.
Existing broad direction controls; old audit allegations and source fragmentation
counts were not freshly established. Do not reopen answered questions or turn
adjacent features into gates.

Accepted CA1–CA13 answers now have original quotes in USER_VISION and homes in
[continuation](worlds/CONTINUATION_CHOICE_CONSIDERATION_2026-10-13.md#cheat-chat-answers-reconciled-2026-10-15),
[research/prototypes](TECHNOLOGY_AND_PROGRESSION.md#research-and-prototype-answers-reconciled-2026-10-15)
and [repeatability](TIMELINES_AND_DIVERGENCE.md#repeatability-answer-and-research-across-rewinds-2026-10-15).
The summary/PROJECT/handoff now route to those answers. CA13 quiet-faculty default is now accepted with means-based systems/voices;
the bounded brief is prepared as a proposal. Its Q1 fresh-life profile remains
consequential and open, not a reason to reopen settled continuation access.

Review U1 is reconciled. U2–U5 are folded as proposed slice-local contracts,
clock/stop distinctions, play-evidence comparisons and authoring/trial details
in their existing owners. They authorize no new slice, framework, schema, worker
or test run. Exact implementation and taste acceptance remain distinct.

### Superseded summary open wording, before this fold

The following passage is retained verbatim as dated history. Current answers
above supersede its broad uncertainty; not every “open” item is still unanswered.

> **Next: triage remaining consequential gaps.** Experiment guidance is accepted:
> known costs/risks and uncertain outcomes through knowledge/means; expertise/cheats
> can improve forecasts. Resolve straightforward details directly and ask only
> meaningful unresolved choices. A bounded detail-review chat is authorized; its
> exclusive report is `docs/gm/DIRECTION_DETAILS_REVIEW_2026-10-15.md`, thread
> `01a13e47-e9d3-76a3-ac9c-e21475e8ff96`. It is reviewing, not implementing. Numeric tuning and technical consolidation need
> concrete slices; exact rewards, time-bank, restart/retention/concurrency remain open.
> OD8 is accepted design direction; exact schemas and technical consolidation remain
> open. OD14 truth/knowledge separation is covered broadly by OD8, not an implemented
> merged store.
>
> A base-cheat mark or spiritual connection, return after death, voluntary early
> restart, simulated-life rewards and rewind remain possibilities. Parallel-version
> access is accepted; exact branch-switching mechanisms remain open.
> Their lore, timing, costs, retained gains and effects on histories are unresolved.
> True-death mechanics and whether a transition requires death remain open;
> native defeat stays unconsciousness. No universal prohibition on retaining power.
>
> Exact rates, progress caps, world-calendar versus bodily aging, warning knowledge,
> random pools, eligibility and rerolls remain open. Proposed **CR1–CR5** and
> **ER1–ER5** in the audit guide consideration, not automatic feature commitments.

## Fresh-life answer and prior question history, 2026-10-15

[Weibao answered Q1](USER_VISION.md#voluntary-fresh-life-history-and-paused-former-life-2026-10-15):
separate history by default, former life/history paused, return by actual means;
same-world rebirth/active former body can be supported through cheats/means.
[Continuation owner](worlds/CONTINUATION_CHOICE_CONSIDERATION_2026-10-13.md#fresh-life-answer-and-transition-implications-2026-10-15)
records accepted consequences and separately labeled implementation/representation
proposals. Summary, PROJECT and handoff are reconciled. The exclusive cheat brief
predates this answer and is not edited by this chat. No new broad question is
required; propose concrete activation/restore contracts and a walkthrough before
requesting more preferences. No source/build/gameplay proof or dispatch follows.

### Superseded Q1 proposal, before acceptance

> **Q1, genuinely consequential and pending:** for ordinary voluntary fresh-life
> continuation, which start/date/body is created, and what becomes of the departed
> embodiment/history? Fresh-life availability is answered; this asks about its
> consequence. Recommended profile for consideration: a guided new life in a
> separate history, preserving the prior history paused; returns follow actual
> means rather than granting unrestricted switching. Do not automatically simulate
> an autonomous former self. This is a proposal, not an accepted default. Same-history
> rebirth or leaving a still-active body behind are alternative profiles with real
> relationship/custody/control consequences; either needs suitable means and an
> explicit body/history contract. No numeric tuning is needed to discuss that choice.

## Worked activation/recovery profile, 2026-10-15

[User request](USER_VISION.md#activation-recovery-and-fresh-life-walkthrough-request-2026-10-15)
completed as a design pass in the
[continuation owner](worlds/CONTINUATION_CHOICE_CONSIDERATION_2026-10-13.md#activation-recovery-profile-and-fresh-life-return-walkthrough-2026-10-15).
AR1–AR8 propose concrete routine behavior; WT1–WT6 trace two histories of one realm
and a means-supported return. OM1–OM7 map affected owners and bounded inspected
source seams; representation/compatibility and FC1–FC3 describe material challenges.
These are proposals/source observations, not accepted runtime behavior or a new
framework, build, test or dispatch. Existing completed work retains its own proofs.

Latest accepted means-dependent embodiment clarification is in USER_VISION and
the identity owner. CA14 was a genuine choice when this profile started, then
was [answered in the cheat chat](USER_VISION.md#unconscious-return-access-and-automatic-recovery-consideration-2026-10-15)
and reconciled: unconscious-body choice access subject to actual means/suppression.
AU1–AU4 automatic terminal-choice/standing-instruction rules remain recommendations.
No further broad preference question is ready; no added numeric/interview queue,
shared-source or exclusive-discussion-record edits. Actual native terminal events,
snapshot coverage, compatibility and behavior require future evidence.

## Concrete continuation coverage pass, 2026-10-15

[User request](USER_VISION.md#concrete-continuation-coverage-and-compatibility-request-2026-10-15)
completed in the [source/compatibility plan](gm/CONTINUATION_STATE_COVERAGE_AND_COMPATIBILITY_2026-10-15.md).
It maps 83 direct serializer root names, conditional adapter/dormant/browser state,
existing fresh-game/preflight/save seams and missing mastery/occupied-state/root
joins. This is bounded source evidence; old fragmentation counts are not reused
as findings. B1–B5 require engineering or measured compatibility, not a new global
product interview. Proposed state topology and K/T cases are not implemented,
accepted schemas, migrations, new runtime gates or a dispatched worker. Existing
one-realm/one-prestige and deferred world/representation scope remain unchanged.

## Reciprocal return and deliberate loops reconciled, 2026-10-15

[New original answers](USER_VISION.md#intentional-loops-and-reciprocal-return-reconciled-2026-10-15)
resolve MC1 and accept intentional repeats as a player option. The
[continuation owner](worlds/CONTINUATION_CHOICE_CONSIDERATION_2026-10-13.md#reciprocal-return-and-intentional-loop-direction-2026-10-15)
now carries exact scope and RL1–RL5 implications. Ordinary reciprocal access is
means-dependent and specific to the supported living paused departure life/history;
not unrestricted travel or resurrection. One deliberate new cycle and another
processing of the same attempt differ. Responsive automation stop does not grant
in-world escape. Defaults/numeric tuning remain labeled recommendations.

Cheat chat owns CP1–CP7 runtime execution/reservations; this chat retains canonical
doc reconciliation. Existing source inspection is a snapshot, not current progress
proof. No new broad human question is ready. Only evidence forcing a materially
different retention/control/recovery or destructive compatibility choice should
return for decision. No runtime/source/save, worker/message, commit or exclusive
cheat/representation-record changes by this fold.

## Current-rule reconciliation, 2026-10-18

The opening "no direction spine" finding and sections 3–5 describe the initial
2026-10-15 discovery pass. Later OD answers here, DIRECTION_SUMMARY and
RULES_INDEX now own the synthesized accepted direction. Do not reopen those
questions from the earlier gap register or treat the pillar draft as acceptance.

[The current plan/rule reconciliation](reviews/PLAN_RULE_RECONCILIATION_2026-10-18.md)
checks the live plan families and records actual coverage. AD38 constrains local
mechanisms; AD21 separates comfort from actual world-law changes; AD33 sequences
complexity without making every adjacent system a prerequisite. G26–G30 are
composed boundary scenarios, not a replacement engine plan. New runtime work
still selects one useful playable slice and recovers its current owners first.
