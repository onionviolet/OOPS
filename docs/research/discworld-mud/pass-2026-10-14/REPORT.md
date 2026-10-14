# Discworld MUD, second pass, 2026-10-14

Discworld stays alive by making its setting usable: guild jobs, local money, language lessons, homes, public services, NPC routines and book-scene quests. It mixes eras and bends canon for continued play. **No evidence found establishes a global simulation that advances through the novels.** Also, “licensed” is unproven: no formal franchise licence was located. The public mudlib's code terms are a separate matter.

Use-based growth is tuned in layers: task difficulty, action category, stat influence, skill-level decay and repeated-award checks. Paid lessons provide another path. The recovered distribution is historical, not today's server source. It differs from current help on learning from failure, skill-tree names and teaching. Treat its numbers as a worked design, not current live balance.

All findings below are **shown** in statically read public code, **stated** in a cited page, or **inferred** from those sources. Nothing was played. No source, save, build, PROJECT.md or USER_VISION.md was edited. Proposals are unaccepted and do not resume paused work or change the one-realm/one-prestige milestone.

## Ranked PROPOSALS

| Rank/code | Proposed adaptation and disposition | Existing owner | Cost and meaningful acceptance gate |
|---|---|---|---|
| 1 / P1 | **Adapt: a practice challenge band.** Give useful queued work an authored difficulty; progress falls as that task becomes routine. Keep alternate training paths available. | `docs/worlds/SKILL_MECHANISMS_AND_MEANS_2026-10-13.md`; `src/models/skill.js` | Medium. Compare below-band, learning-band and mastered work; prove useful output and causal XP on a rebuilt fresh desktop origin, then save/reload/import. No click-variety requirement. |
| 2 / P2 | **Adapt: canon event plus aftermath.** For one already-prioritized book world, author a scene, an intervention seam and a persistent local consequence. Keep canon and AU starts explicit. | `docs/worlds/WORLD_DEPTH_CONSIDERATIONS_2026-10-13.md`; `docs/worlds/BOOK_WORLD_ENTRY_MATRIX.md` | Medium/high content cost. Two starts must produce the right NPC/location state and retain it through import. This extends YAIRPG's owners; a global event engine is not proven by Discworld. |
| 3 / P3 | **Adapt: lessons as quoted transactions.** Preview time, XP, materials and likely gain; confirm eligible teacher and unchanged learner state at completion. | Skill mechanisms owner; existing `src/audited_workshop_lesson.js` | Medium. Stop/move/pause/reload must neither double-charge nor double-award; NPC/self-study alternatives keep solo progress reachable. |
| 4 / P4 | **Trial: language as usable comprehension.** Separate speech and reading, seed basic knowledge through lessons, then learn through supported exposure. | `docs/worlds/world-depth-2026-10-13/02_MOL_HP_JJK_DND.md` | Medium. The same sign/dialogue reveals stable partial meaning; trained improvement opens a real interaction. Accessible readable presentation remains available. |
| 5 / P5 | **Adapt: guilds as services and obligations.** Regional training packages and useful jobs define a profession beyond combat stats. | `docs/worlds/world-depth-2026-10-13/32_SOCIAL_SPINE.md`; skills owner | Medium. Show two regional paths with different useful work. Obligations should be opt-in contracts with visible costs, not compulsory theft quotas. |
| 6 / P6 | **Adapt: lived-in homes.** Derive a room's description and routines from placed functional objects; make guests, permissions and storage observable. | Existing `src/home_furnishing_*.js`; household/community owner | Low/medium extension. Moving a lamp or workbench changes a real use and survives import; do not infer absence from this source-only pass. |
| 7 / P7 | **Park pending an authorized death slice: ghosts as a changed action set.** Preserve identity and a clear return route with NPC help. | `docs/research/DEATH_AND_RESET_CONSIDERATIONS_2026-10-10.md`; `docs/worlds/world-depth-2026-10-13/35_HEALTH_INJURY_ILLNESS_DEATH.md` | High persistence cost. Death/ghost/revival transitions need exact saves and no duplicate body/inventory. No eight-human gate or fixed solo “once” limit. |
| 8 / P8 | **Adapt: local currency and accent presentation.** Use common internal values, local coin names and explicit exchange quotes; let players choose accent labels or altered text. | World depth owner; existing economy and information-design owners | Low/medium per authored region. Correct quote/rounding, insufficient local cash and readable accent mode at 1440x900. Mobile optimization deferred. |

## Prior lane reconciliation

| Code | Prior finding | This pass confirms, corrects or extends it |
|---|---|---|
| F1 | Canon is a static snapshot; NPC behavior unknown | **Correct/extend.** The 2008 study documents book incidents reenacted in quests and responsive canon NPC interaction. PC Gamer describes clock/NPC activity and continued Holy Wood availability. There is living local behavior, mixed chronology and deliberate divergence; an advancing global book timeline remains unverified. [Canon digest](CANON_AND_GUILDS.md). |
| F2 | Public mudlib could reveal formulas | **Shown.** v20.0 mirror pinned at `8c8619c64c0a41f09e406a97ee1e0a084ff92a60`; README bars commercial code use. Only paraphrase retained here. A free download is not a permissive code licence. [Mechanism digest](SKILL_GROWTH.md). |
| F3 | Success and failure can teach | **Stated current help; differs from shown release.** Historical `attempt_task` and `attempt_task_e` return on failure before the award roll. Do not “correct” current help using old code, or claim old code proves failure learning. |
| F4 | Bonus is logarithmic in level and stats | **Correct historical description.** Released `calc_bonus` is piecewise linear in level, with slopes 5, 2.5, 1 and 0.5. Its stat modifier uses logarithms. Wikipedia's broad description is not this exact implementation. |
| F5 | Seven roots, primaries cap at 300 | **Version boundary.** Current help has seven roots; the archived wiki counts languages separately as an eighth. Release has six, including `other`; released warrior's 300 is its guild teaching ceiling for primaries, not a universal skill cap. |
| F6 | Current effective teaching bonus and reward check | **Not verified from release.** Old teaching instead uses subject-bonus ratio and pays teacher 10% of learner XP at completion. Timed teaching also exists in this old source, so a 2026 timing change cannot mean timing never existed earlier. Current replacement formula remains help-derived, not source-verified here. |
| F7 | Death has lives, ghost restrictions and rare final return | **Partly shown.** Release initializes seven max deaths, installs ghost behavior and blocks ordinary final return; current official 2012 blog introduces AshkEnte recovery. Death NPC and modern rite implementations are omitted from distribution. |
| F8 | Wiki inaccessible | **Partly recovered.** Seven archived pages read in full: Death, Skills, Teaching, Languages, Thieves' Guild, Priests' Guild and Witches' Guild. Five remain itemized in CHECKPOINT. No live challenge bypass. |
| F9 | Housing and languages broad outline | **Extended.** Registry/room persistence, local banks, arrears and permissions are shown in old code. Archived language page details entry lessons, speech/reading and exposure practice; some figures explicitly need community research. [Everyday systems](EVERYDAY_SYSTEMS.md). |
| F10 | Six guild pages; crafts/currency/accents unread | **Closed for official pages.** Six official guild pages and three help topics read. Their current content is summarized in the digests. Archived guild coverage is separate. |

## Direct answers and limits

F11, **stated by founder**: the goal was evocative place and atmosphere with player-controlled social systems, rather than a single narrated plot. The [founder interview](https://web.archive.org/web/20100924002936/http://www.armchairarcade.com/neo/node/364) explains this intent. It is a primary account, not current runtime verification.

F12, **stated/observed historically**: [Karlsen's field study](https://gamestudies.org/0801/articles/karlsen) reports that some quests reenact book events, but most do not depend on the books. It also records opaque syntax and inadequate clues. Adapting canon does not excuse an unguessable action. This pass proposes hintable causal scenes, not syntax guessing.

F13, **stated by reviewer**: the [PC Gamer tour](https://www.pcgamer.com/uk/saturday-crapshoot-discworld-mud/) describes ambient time, moving NPCs, torch replacement and Holy Wood surviving its novel's ending. These are historical observations. They support local life and selectable continuity, not a current event scheduler guarantee.

F14, **inferred for YAIRPG**: preserve canon identity through institutions, routines and consequences. Let a source event have causes and an aftermath, then let a chosen divergence change them. This is a proposal beyond what the historical source proves. Discworld itself is not promoted above the accepted priority worlds.

See [SOURCE_LEDGER.md](SOURCE_LEDGER.md) for the full Wikipedia/reference trail and access limits; [IMPLEMENTATION_PACKETS.md](IMPLEMENTATION_PACKETS.md) for bounded candidate work; [CHECKPOINT.md](CHECKPOINT.md) for exact gaps.
