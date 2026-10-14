# Free text worlds: five source families aspect pass, 2026-10-14

URR shipped 0.10.4d bytecode; official Progress Quest web captures; Achaea/Iron Realms and Godville public descriptions; two distinct Gu store identities. No account, signup or game launch. A sub-source matrix follows each aggregate row so gaps do not disappear into grouped coverage.

All recommendations are PROPOSALS. No runtime implementation or accepted decision. No game was launched, downloaded code run, personal save opened, account used, install changed, git staged, committed or pushed. Only assigned aspect folders and asp-text scratch were written. Desktop first; one realm/one prestige remains the milestone; no fixed solo once restriction is adopted.

SHOWN means statically inspected artifact behavior. STATED means documented by source/help/store. INFERRED identifies our interpretation. Covered is a bounded aspect answer, not exhaustive content or runtime verification.

## A01 Dialogue and conversation

Status: partial

URR SHOWN: first_talking_message derives appearance/equipment text from an NPC; conversation_ending_class_statement chooses role-specific closure variants. Its built-in conversation guide STATES range, sleep, politeness, topic knowledge and title-gated book questions; those guide statements are not full predicate implementation proof. Achaea STATED: GREET starts NPC interaction; loyal denizens accept commands, village witnesses affect reputation. Godville STATED: diary and optional godvoice/influence, not a conventional NPC tree. PQ SHOWN: generated task/plot prose, no branching dialogue graph found in inspected core. Gu: dialogue corpus and conditions unread.

- SHOWN: [URR0104d.py bytecode, first_talking_message, original first line 807797](/Users/weiwei/.codex/research/asp-text/extract/urr-first_talking_message.dis.txt). official 0.10.4d; prior CRC-verified PyInstaller entry.
- SHOWN: [URR0104d.py bytecode, conversation_ending_class_statement, original first line 180895](/Users/weiwei/.codex/research/asp-text/extract/urr-conversation_ending_class_statement.dis.txt). official 0.10.4d; prior CRC-verified PyInstaller entry.
- SHOWN: [URR0104d.py bytecode, conversations_diagram, original first line 18757](/Users/weiwei/.codex/research/asp-text/extract/urr-conversations_diagram.dis.txt). official 0.10.4d; prior CRC-verified PyInstaller entry.
- STATED: [7.1 DENIZENS, current public help](https://www.achaea.com/game-help?what=denizens). 2026-10-14 read; dated posts retain their own date.
- SHOWN: [InterplotCinematic, Dequeue](https://progressquest.com/play/main.js). prior official 2026-10-14 capture, re-read static bytes.
- STATED: [prior captured store; B站蛊道求真](https://store.steampowered.com/app/3443480/). 2026-10-14 read; dated posts retain their own date.
- STATED: [prior captured store; LIHAONAN](https://store.steampowered.com/app/4218540/). 2026-10-14 read; dated posts retain their own date.

PROPOSAL: Use actor facts for description and role-aware replies; unlock inquiries from learned facts rather than universal NPC omniscience. Owner: `docs/worlds/DIALOGUE_AND_INTERACTIONS.md`.

| Sub-source | Status | Boundary |
|---|---|---|
| URR | partial | Fact-based introduction and role-specific closure shown; guide topic gates stated. |
| Progress Quest | absent | No branching NPC graph in inspected web core; plot/task grammar present. |
| Iron Realms / Achaea | partial | GREET/loyal commands stated, server line conditions unread. |
| Godville | partial | Diary/optional godvoice stated; server conversation rules unread. |
| Gu 3443480 / 4218540 | unread | No conversation source/build. |

## A02 Narrative delivery

Status: partial

URR SHOWN prior History routine composes dated prose from civilization/religion facts; new closure/introduction routines ground speech in NPC fields. PQ SHOWN queues task and plot beats with nested bars. Godville STATED diary/hero ID update on achievements. Achaea STATED NPC quest rewards and social memory. Gu store mentions story tasks but no journal/branch code. None establishes a complete narrative catalogue.

- SHOWN: [URR0104d.py bytecode, first_talking_message, original first line 807797](/Users/weiwei/.codex/research/asp-text/extract/urr-first_talking_message.dis.txt). official 0.10.4d; prior CRC-verified PyInstaller entry.
- SHOWN: [InterplotCinematic, CompleteQuest](https://progressquest.com/play/main.js). prior official 2026-10-14 capture, re-read static bytes.
- STATED: [April 5, June 9, July 17 and August 28 2026 developer posts](https://godvillegame.com/blog/). 2026-10-14 read; dated posts retain their own date.
- STATED: [7.1 DENIZENS, current public help](https://www.achaea.com/game-help?what=denizens). 2026-10-14 read; dated posts retain their own date.
- STATED: [prior captured store; B站蛊道求真](https://store.steampowered.com/app/3443480/). 2026-10-14 read; dated posts retain their own date.
- STATED: [prior captured store; LIHAONAN](https://store.steampowered.com/app/4218540/). 2026-10-14 read; dated posts retain their own date.

PROPOSAL: Render histories and return summaries from committed events; preserve source facts outside funny text. Owner: `docs/PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md`.

| Sub-source | Status | Boundary |
|---|---|---|
| URR | covered | Prior History facts and current dialogue descriptions. |
| Progress Quest | covered | Queued plot/task beats and quest/plot horizons. |
| Iron Realms / Achaea | partial | NPC quests/social memory stated; full journal unread. |
| Godville | partial | Automatic diary/hero records stated. |
| Gu 3443480 / 4218540 | partial | Original store story tasks promised; graph unread. |

## A03 Implementation architecture

Status: partial

URR SHOWN: large Python 3.7 PyInstaller entry and libtcod calls; recovered index has 1,041 code objects. New static save routines use shelve and spatial chunks. PQ SHOWN: JavaScript/jQuery client, worker sends 50 ms tick, page owns simulation, config.js holds RNG/content/storage. Achaea/Godville server internals unavailable. Gu engine remains unread despite store art/tags.

- SHOWN: [URR0104d.py bytecode, new_save, original first line 85860](/Users/weiwei/.codex/research/asp-text/extract/urr-new_save.dis.txt). official 0.10.4d; prior CRC-verified PyInstaller entry.
- SHOWN: [URR0104d.py bytecode, new_load_game, original first line 1113539](/Users/weiwei/.codex/research/asp-text/extract/urr-new_load_game.dis.txt). official 0.10.4d; prior CRC-verified PyInstaller entry.
- SHOWN: [worker start/stop](https://progressquest.com/play/clock.js). prior official 2026-10-14 capture, re-read static bytes.
- SHOWN: [Alea, storage adapters](https://progressquest.com/play/config.js). prior official 2026-10-14 capture, re-read static bytes.

PROPOSAL: Separate source/clock/storage boundaries; server marketing and package symbols do not establish gameplay architecture. Owner: `docs/ENGINE_EXPANSION.md`.

| Sub-source | Status | Boundary |
|---|---|---|
| URR | covered | Python 3.7/tcod entry, spatial shelve seams. |
| Progress Quest | covered | JS/jQuery page plus worker clock and config/storage. |
| Iron Realms / Achaea | unread | No server code acquired. |
| Godville | unread | Server implementation unavailable. |
| Gu 3443480 / 4218540 | unread | Engine/source unread. |

## A04 Save and persistence

Status: partial

URR SHOWN: new_save stores Outside and Buildings in per-coordinate shelves, replacing unloaded maps with a saved sentinel; new_load retrieves those fields. quit_save2 writes a central world shelf including Worlddata, Schedule, Tracker, Time, Player, Unlocks and Squares, with version metadata elsewhere in the flow. new_load_game recalculates path maps. Exact migration, corruption rejection and RNG restoration unread. PQ SHOWN: JSON roster, UTF-8-safe base64 export/import, SaveGame stores stamp and Alea state, LoadGame resumes and patches renamed spells. Achaea/Godville/Gu save internals unread; automatic server activity is not proof of an offline formula.

- SHOWN: [URR0104d.py bytecode, new_save, original first line 85860](/Users/weiwei/.codex/research/asp-text/extract/urr-new_save.dis.txt). official 0.10.4d; prior CRC-verified PyInstaller entry.
- SHOWN: [URR0104d.py bytecode, new_load, original first line 88757](/Users/weiwei/.codex/research/asp-text/extract/urr-new_load.dis.txt). official 0.10.4d; prior CRC-verified PyInstaller entry.
- SHOWN: [URR0104d.py bytecode, quit_save2, original first line 85272](/Users/weiwei/.codex/research/asp-text/extract/urr-quit_save2.dis.txt). official 0.10.4d; prior CRC-verified PyInstaller entry.
- SHOWN: [URR0104d.py bytecode, new_load_game, original first line 1113539](/Users/weiwei/.codex/research/asp-text/extract/urr-new_load_game.dis.txt). official 0.10.4d; prior CRC-verified PyInstaller entry.
- SHOWN: [SaveGame, LoadGame](https://progressquest.com/play/main.js). prior official 2026-10-14 capture, re-read static bytes.
- SHOWN: [b64_stringify, dropGuy](https://progressquest.com/play/roster.js). prior official 2026-10-14 capture, re-read static bytes.

PROPOSAL: Separate committed world state, derived path/UI state and recoverable chunk state; preserve pending task and RNG context together. Owner: `docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md`.

| Sub-source | Status | Boundary |
|---|---|---|
| URR | partial | Chunk/world shelves shown; rejection and migration unread. |
| Progress Quest | covered | JSON roster, UTF-8 base64 transfer, seed restore and spell patch. |
| Iron Realms / Achaea | unread | Server save/clock internals unavailable. |
| Godville | unread | Save/offline formulas unavailable. |
| Gu 3443480 / 4218540 | unread | Save/refinement retention unread. |

## A05 AI and NPC behavior

Status: partial

URR SHOWN: Schedule.next_turn pops the current turn bucket; day/night gates affect crowd handling. NPC.do_turn checks role, place, task and AI state; the merchant branch places or withdraws actual shop items. Full planner, knowledge flow and sleep admission remain partial. Achaea STATED: loyal orders and witness propagation can change village reaction; server rule implementation unread. Godville STATED auto hero behavior with optional intervention. PQ SHOWN automatic routine transitions, not deep NPC lives. Gu AI unread.

- SHOWN: [URR0104d.py bytecode, NPC.do_turn, original first line 188587](/Users/weiwei/.codex/research/asp-text/extract/urr-NPC.do_turn.dis.txt). official 0.10.4d; prior CRC-verified PyInstaller entry.
- SHOWN: [URR0104d.py bytecode, Schedule.next_turn, original first line 145657](/Users/weiwei/.codex/research/asp-text/extract/urr-Schedule.next_turn.dis.txt). official 0.10.4d; prior CRC-verified PyInstaller entry.
- SHOWN: [URR0104d.py bytecode, meet_up_with_changing_npc, original first line 151437](/Users/weiwei/.codex/research/asp-text/extract/urr-meet_up_with_changing_npc.dis.txt). official 0.10.4d; prior CRC-verified PyInstaller entry.
- STATED: [7.1 DENIZENS, current public help](https://www.achaea.com/game-help?what=denizens). 2026-10-14 read; dated posts retain their own date.
- STATED: [April 5, June 9, July 17 and August 28 2026 developer posts](https://godvillegame.com/blog/). 2026-10-14 read; dated posts retain their own date.
- SHOWN: [Dequeue](https://progressquest.com/play/main.js). prior official 2026-10-14 capture, re-read static bytes.

PROPOSAL: Define actor knowledge and witnessed social events with real causes; keep automatic routines distinct from autonomous planning. Owner: `docs/CHARACTERS_AND_WORLD_EVENTS.md`.

| Sub-source | Status | Boundary |
|---|---|---|
| URR | partial | NPC and Schedule turn routines sampled, full integration unread. |
| Progress Quest | absent | No independent NPC planner in core; automatic player routine exists. |
| Iron Realms / Achaea | partial | Witness/loyalty/reputation stated, implementation unread. |
| Godville | partial | Automatic hero activity stated, planner unread. |
| Gu 3443480 / 4218540 | unread | NPC/enemy behavior unread. |

## A06 UI and information design

Status: partial

URR SHOWN tcod guide and render calls, appearance messages and save-progress display. PQ SHOWN multiple task/XP/quest/plot bars and roster export/import controls. Godville STATED contextual help, special-enemy icons, one-event alerts and discoverable zones. Achaea text commands/help documented. Gu desktop layout unverified. No UI was exercised.

- SHOWN: [URR0104d.py bytecode, conversations_diagram, original first line 18757](/Users/weiwei/.codex/research/asp-text/extract/urr-conversations_diagram.dis.txt). official 0.10.4d; prior CRC-verified PyInstaller entry.
- SHOWN: [URR0104d.py bytecode, quit_save2, original first line 85272](/Users/weiwei/.codex/research/asp-text/extract/urr-quit_save2.dis.txt). official 0.10.4d; prior CRC-verified PyInstaller entry.
- SHOWN: [loadGames](https://progressquest.com/play/roster.js). prior official 2026-10-14 capture, re-read static bytes.
- STATED: [April 5, June 9, July 17 and August 28 2026 developer posts](https://godvillegame.com/blog/). 2026-10-14 read; dated posts retain their own date.
- STATED: [7.1 DENIZENS, current public help](https://www.achaea.com/game-help?what=denizens). 2026-10-14 read; dated posts retain their own date.

PROPOSAL: At 1440x900 with 1366x768 follow-up, show task, location, project and causal log together; mobile optimization deferred. Owner: `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`.

| Sub-source | Status | Boundary |
|---|---|---|
| URR | partial | tcod guide/render/save feedback only. |
| Progress Quest | partial | Bars/roster source read, no desktop use. |
| Iron Realms / Achaea | partial | Commands/help stated; live desktop unread. |
| Godville | partial | Dated help/icons/alerts posts, no live UI. |
| Gu 3443480 / 4218540 | unread | Live layout/control evidence unavailable. |

## A07 Content authoring and modding

Status: partial

URR shipped monolithic recovered bytecode is not a supported mod API. PQ config arrays and queue strings drive names/tasks; storage and render code are ordinary JS. Godville STATED community Ideabox review supplies new text/monsters/quests. Achaea prior help lists creative trades and permissions, not public server modding. Gu store Workshop badge is not a read authoring API.

- SHOWN: [K.* arrays](https://progressquest.com/play/config.js). prior official 2026-10-14 capture, re-read static bytes.
- SHOWN: [Q, InterplotCinematic](https://progressquest.com/play/main.js). prior official 2026-10-14 capture, re-read static bytes.
- STATED: [April 5, June 9, July 17 and August 28 2026 developer posts](https://godvillegame.com/blog/). 2026-10-14 read; dated posts retain their own date.
- STATED: [prior captured store; B站蛊道求真](https://store.steampowered.com/app/3443480/). 2026-10-14 read; dated posts retain their own date.
- STATED: [prior captured store; LIHAONAN](https://store.steampowered.com/app/4218540/). 2026-10-14 read; dated posts retain their own date.

PROPOSAL: Use small validated variant pools with predicates and factual references; keep submission review distinct from automatic acceptance. Owner: `docs/ENGINE_AUTHORING.md`.

| Sub-source | Status | Boundary |
|---|---|---|
| URR | partial | Recovered bytecode, no supported mod API read. |
| Progress Quest | covered | Content arrays and task queue strings; no server editor claim. |
| Iron Realms / Achaea | partial | Creative professions stated; public server mod API unread. |
| Godville | partial | Ideabox content review stated, data format unread. |
| Gu 3443480 / 4218540 | partial | Original Workshop listing is not a verified API. |

## A08 Balance and numbers

Status: partial

PQ SHOWN: Alea retains four state values; Random(n) uses uint32 modulo n, named-monster selection takes closest level among five samples. This is not a pity guarantee or unbiased sampling proof. URR prior generators use pools/constraints and RNG calls; whole-world deterministic replay unread. Achaea lesson costs and commodity prices stated, matching algorithm unread. Godville/Gu precise numeric systems unread.

- SHOWN: [Alea.state, Random](https://progressquest.com/play/config.js). prior official 2026-10-14 capture, re-read static bytes.
- SHOWN: [NamedMonster](https://progressquest.com/play/main.js). prior official 2026-10-14 capture, re-read static bytes.
- SHOWN: [URR0104d.py bytecode, new_save, original first line 85860](/Users/weiwei/.codex/research/asp-text/extract/urr-new_save.dis.txt). official 0.10.4d; prior CRC-verified PyInstaller entry.

PROPOSAL: Keep authoritative random outcomes addressed and persisted; flavor sampling must not invent authority or imply fair odds. Owner: `docs/GENERATION_FOUNDATION_RULES_2026-10-14.md`.

| Sub-source | Status | Boundary |
|---|---|---|
| URR | partial | Prior generators sampled; full RNG continuation unread. |
| Progress Quest | covered | Alea state and five-sample nearest-level selection. |
| Iron Realms / Achaea | partial | Help costs/prices stated; algorithms unread. |
| Godville | unread | Exact costs, RNG and numeric formulas unread. |
| Gu 3443480 / 4218540 | unread | Refinement odds/costs unread. |

## A09 Time and scheduling

Status: partial

PQ SHOWN: worker ticks every 50 ms; page delta capped to 100 ms; saved stamp is not replayed as absence in LoadGame. URR central shelf stores Time and Schedule; Time.take_turn changes calendar and travel-supply state, while recalculated path data differs from retained clock state. Its starvation/death branches are source behavior, not proposed YAIRPG policy. Full scheduler integration remains partial. Godville STATED daily anomalies and auto activity but exact simulation clock unread. Achaea public help states reputation decays over game time. Gu feeding/cooldown schedules unread.

- SHOWN: [tick interval](https://progressquest.com/play/clock.js). prior official 2026-10-14 capture, re-read static bytes.
- SHOWN: [Timer1Timer, LoadGame](https://progressquest.com/play/main.js). prior official 2026-10-14 capture, re-read static bytes.
- SHOWN: [URR0104d.py bytecode, quit_save2, original first line 85272](/Users/weiwei/.codex/research/asp-text/extract/urr-quit_save2.dis.txt). official 0.10.4d; prior CRC-verified PyInstaller entry.
- SHOWN: [URR0104d.py bytecode, Time.take_turn, original first line 832490](/Users/weiwei/.codex/research/asp-text/extract/urr-Time.take_turn.dis.txt). official 0.10.4d; prior CRC-verified PyInstaller entry.
- STATED: [7.1 DENIZENS, current public help](https://www.achaea.com/game-help?what=denizens). 2026-10-14 read; dated posts retain their own date.
- STATED: [April 5, June 9, July 17 and August 28 2026 developer posts](https://godvillegame.com/blog/). 2026-10-14 read; dated posts retain their own date.

PROPOSAL: An idle summary should report actual elapsed work, blockers and remaining budget; do not invent offline catch-up from continuous progression. Owner: `docs/TIMELINES_AND_DIVERGENCE.md`.

| Sub-source | Status | Boundary |
|---|---|---|
| URR | partial | Time and Schedule retained; selected turn code decoded. |
| Progress Quest | covered | 50 ms worker, 100 ms delta cap, no absence replay in LoadGame. |
| Iron Realms / Achaea | partial | Game-time reputation decay stated; exact scheduler unread. |
| Godville | partial | Daily anomaly rhythm stated; server clock unread. |
| Gu 3443480 / 4218540 | unread | Upkeep/time schedules unread. |

## A10 Onboarding and reveal

Status: partial

URR built-in guide describes topic families and knowledge-gated questions. PQ roster separates creation/resume/export; tutorial flow outside captured core remains unread. Godville contextual help can be disabled and zones reveal through experience/influence. Achaea public help is command-oriented. Gu only store feature promises, no onboarding code.

- SHOWN: [URR0104d.py bytecode, conversations_diagram, original first line 18757](/Users/weiwei/.codex/research/asp-text/extract/urr-conversations_diagram.dis.txt). official 0.10.4d; prior CRC-verified PyInstaller entry.
- SHOWN: [load](https://progressquest.com/play/roster.js). prior official 2026-10-14 capture, re-read static bytes.
- STATED: [April 5, June 9, July 17 and August 28 2026 developer posts](https://godvillegame.com/blog/). 2026-10-14 read; dated posts retain their own date.
- STATED: [7.1 DENIZENS, current public help](https://www.achaea.com/game-help?what=denizens). 2026-10-14 read; dated posts retain their own date.

PROPOSAL: Reveal complexity through useful inquiry and observed effects, with direct context help and readable fallback. Owner: `docs/worlds/DIALOGUE_AND_INTERACTIONS.md`.

| Sub-source | Status | Boundary |
|---|---|---|
| URR | partial | Built-in conversation guide; first-run play unread. |
| Progress Quest | partial | Roster entry/resume shown; creation page unread. |
| Iron Realms / Achaea | partial | Public help only, live onboarding unread. |
| Godville | partial | Context help and observed location reveal stated. |
| Gu 3443480 / 4218540 | unread | Onboarding build unavailable. |

## A11 Little touches

Status: covered

Bounded SHOWN/STATED examples: URR role-aware closure, gear-derived appearance, chunk save progress and derived path rebuild; PQ RNG continuation, UTF-8-safe export, duplicate-name overwrite prompt, file drop import, spelling migration and nested horizons; Godville optional contextual help, selected completion alert and special monster feed icons; Achaea group reputation shaped by witnesses. Gu quality-of-life details remain unread.

- SHOWN: [URR0104d.py bytecode, first_talking_message, original first line 807797](/Users/weiwei/.codex/research/asp-text/extract/urr-first_talking_message.dis.txt). official 0.10.4d; prior CRC-verified PyInstaller entry.
- SHOWN: [URR0104d.py bytecode, quit_save2, original first line 85272](/Users/weiwei/.codex/research/asp-text/extract/urr-quit_save2.dis.txt). official 0.10.4d; prior CRC-verified PyInstaller entry.
- SHOWN: [LoadGame spell patch](https://progressquest.com/play/main.js). prior official 2026-10-14 capture, re-read static bytes.
- SHOWN: [dropGuy, loadGames](https://progressquest.com/play/roster.js). prior official 2026-10-14 capture, re-read static bytes.
- STATED: [April 5, June 9, July 17 and August 28 2026 developer posts](https://godvillegame.com/blog/). 2026-10-14 read; dated posts retain their own date.
- STATED: [7.1 DENIZENS, current public help](https://www.achaea.com/game-help?what=denizens). 2026-10-14 read; dated posts retain their own date.

PROPOSAL: Spend polish on recoverable progress, clear causal feedback and optional detail; keep hero humor separate from the event record. Owner: `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`.

| Sub-source | Status | Boundary |
|---|---|---|
| URR | covered | Factual gear description, role closure, chunk progress. |
| Progress Quest | covered | Import controls, seed continuation, spelling repair. |
| Iron Realms / Achaea | partial | Witnesses and explicit orders stated. |
| Godville | partial | One-event alert and profile update stated. |
| Gu 3443480 / 4218540 | unread | Polish not inferred from marketing. |

## A12 Other systems

Status: partial

URR prior culture/religion/heresy/history/art constraints; Achaea mining, commodity listings, title/permissions, offices and trades; Godville anomaly discovery and hero records; PQ inventory-selling-gear loops; Gu promised raising/use/refinement/killer-move distinction. Iron Realms siblings are not interchangeable: Aetolia overview and Lusternia political help sampled; Imperian/Starmourn catalogue only.

- SHOWN: [Dequeue](https://progressquest.com/play/main.js). prior official 2026-10-14 capture, re-read static bytes.
- STATED: [public help](https://www.achaea.com/game-help?what=mines-and-mining). 2026-10-14 read; dated posts retain their own date.
- STATED: [April 5, June 9, July 17 and August 28 2026 developer posts](https://godvillegame.com/blog/). 2026-10-14 read; dated posts retain their own date.
- STATED: [prior captured store; B站蛊道求真](https://store.steampowered.com/app/3443480/). 2026-10-14 read; dated posts retain their own date.
- STATED: [prior captured store; LIHAONAN](https://store.steampowered.com/app/4218540/). 2026-10-14 read; dated posts retain their own date.

PROPOSAL: Province War may cite Achaea holdings, workers, storage and jurisdiction; solo demand and conflict remain an original proposed design. Owner: `docs/CHARACTERS_AND_WORLD_EVENTS.md`.

| Sub-source | Status | Boundary |
|---|---|---|
| URR | partial | Culture, religion, heresy, history, art and travel identified. |
| Progress Quest | covered | Inventory sale, gear purchase and nested progression. |
| Iron Realms / Achaea | partial | Professions, housing, mining, market, governments; sibling parity limited. |
| Godville | partial | Anomalies, hero ID and optional adventure layers stated. |
| Gu 3443480 / 4218540 | partial | Separate stores promise cultivation or roguelike Gu systems. |
