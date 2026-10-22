# Four cultivation references as avenues into different worlds

2026-10-22. Requested by Weibao after the [discovery pass](../PROTOLIKE_AND_CULTIVATION_DISCOVERY_2026-10-22.md): investigate NekoRPG, Cultivation: Sect Chronicle, Cultivation Stories and Endless Path more deeply; identify implemented behavior and incremental value beyond existing YAIR; use them as a basis for implementing mechanically different worlds.

This report is research and proposed incorporation, not a runtime dispatch or an accepted world roster. Relevant authority: AD1–AD8, AD15–AD19, AD23, AD32–AD38, AD41; WA1–WA21; AR1–AR16, MR and SR for the proposed consumers. [USER_VISION](../../USER_VISION.md), [PROJECT](../../../PROJECT.md), [world absorption rules](../../WORLD_ABSORPTION_RULES.md), [BF64 and BF71–BF94](../../worlds/BOOK_WORLD_FEATURE_GAPS_2026-10-15.md) remain authoritative. One realm/one prestige is the first milestone, not a ceiling on the broader world vision.

## What was actually checked

| Reference | Input inspected | Established here | Still unproved |
| --- | --- | --- | --- |
| NekoRPG | Public JS at `652237ec361239b355172a1f97d7608636ef2eac`; 24 selected source/document files captured | Selected progression, clock, clan and reactor control flow; two small extracted-function probes | Ordinary campaign reachability, later-game balance and save roundtrip |
| Sect Chronicle | Free itch v0.5 Windows archive; REA PCK extraction, then GDRE 2.7.4 scripts-only recovery | Selected executable GDScript behavior and callers; monthly schedule, Hall Master policies, breakthroughs, succession and background generation | Fresh UI journeys, balancing, complete phase interaction and persistence trials |
| Cultivation Stories | Free itch demo 0.2.5.7 Linux archive; ILSpy 11.1 decompilation of `Xianxia.Nucleo.dll` | Selected generation, cultivation and injury consumers; isolated probes against the shipped assembly | Client/UI reachability and save roundtrip; all implications of partially obfuscated code |
| Endless Path | Public source at `430b3f1c748fba86d6fa5ca197663be72b6e2ab6`; 742/750 selected files captured, including all selected `.gd` files | Selected cycling, reward, ability/technique unlock, adventure-budget and advancement control flow | Native Godot playthrough; eight missing scene/data records; broad content completeness |

Raw artifacts, recovered/decompiled code, capture gaps, source hashes, command receipts and probes are private at `/Users/weiwei/.codex/research/protolike-deep-2026-10-22/`. `EVIDENCE.json` binds the external revisions and dirty YAIR source inputs. Recovering 641 Sect scripts and exporting 855 Stories C# files establishes availability, not whole-source semantic coverage. Only the spans and call paths discussed below were traced.

## F6 / NekoRPG: advancement changes the rules around the character

Primary sources: [repository](https://github.com/btly0711/NekoRPG), [character progression](https://github.com/btly0711/NekoRPG/blob/652237ec361239b355172a1f97d7608636ef2eac/src/character.js), [main runtime](https://github.com/btly0711/NekoRPG/blob/652237ec361239b355172a1f97d7608636ef2eac/src/main.js), [clock](https://github.com/btly0711/NekoRPG/blob/652237ec361239b355172a1f97d7608636ef2eac/src/game_time.js).

**Implemented in the traced source:**

- `character.js` around lines 200–320 applies explicit major bottlenecks rather than allowing XP to cross every threshold. Crossing selected major thresholds changes available attributes and abilities, XP scaling and combat modifiers as well as ordinary stats. These are hard-coded transitions, not a general world-law engine.
- Its calendar implements 180-hour days and 50-day years. Runtime advancement changes its time step with realm and sleep; shops and clan updates consume the resulting dates. This illustrates a genuinely different calendar and progression-timescale relationship. Comments/help disagree on some rates, so the code, not a comment, is the evidence for each operation.
- `main.js::update_family_daily` tracks realm cohorts. Deaths and breakthroughs redistribute counts; selected policies affect risk, advancement and earnings; higher cohorts produce income/influence; planned births consume money through a nonlinear cost curve. It is **an aggregate clan economy**, not individual genealogy, relationships or autonomous named-member lives. A few authored arrivals do not change that model.
- The reactor activity really updates fuel, power, radiation and temperature, feeds back through fuel behavior and cooling, then produces materials or applies a failure consequence. It uses a separate real-time interval. Its interesting contribution is process state producing a particular material, rather than a generic progress bar labelled crafting.
- Save construction retains `family_data` and activity-related `inf_combat` state. Source serialization is not a save/reload demonstration.

**Incremental value for YAIR:** ordinary equipment quality, components, skill XP, gathering and conditions are already present. Their existence in Neko is not a new gap. The useful question is whether one world's advancement should change an actual capability, resource interaction or institutional access, and whether its large organization needs cohort-level handling alongside named people.

Do not reproduce Neko's global player-level clock acceleration or an entire population ledger without a selected consumer. YAIR already has owning clocks and world/body boundaries. Adapt a world's cadence through those owners. Similarly, use existing material lineage and process owners for a reactor-like craft; its output needs a property that a later use actually reads.

**Probe:** executed the captured `Game_time` and `get_baby_cost` functions in an isolated Node VM. Crossing 179:59 advanced to the next day at 00:00. Per-newborn cost increased between 10,000, 100,000 and 1,000,000 births. These prove those formulas only, not the complete clan loop.

## F4 / Sect Chronicle: a sect persists beyond its current leader

Primary public context: [game/build](https://matogrand.itch.io/cultivation-sect-chronicle), [v0.5 developer notes](https://matogrand.itch.io/cultivation-sect-chronicle/devlog/1712890/free-playtest-update-v05-bug-fixes-redesign-new-features). Implementation evidence is in the privately recovered shipped scripts.

**Implemented in the traced source:**

- `campaign_runtime/schedule.gd` names and orders real monthly phases: lifecycle, actions, cultivation, production/upkeep, NPC sects, travel, relationships, family, commitments, knowledge/history and reporting. Callers in `simulation_manager.gd` connect the relevant services. This is substantially more than disconnected feature classes; complete phase correctness remains untested here.
- `cultivation_breakthrough_rules.gd` checks peak/readiness, travel, conflicts, expeditions and recovery constraints. Success probability reads target realm, spiritual root, comprehension, fortune and recorded alchemical preparation. `cultivation_breakthrough_system.gd::resolve_attempt` draws from the campaign RNG, updates realm/stage on success and records outcomes. NPC systems use the same rule family.
- `hall_master_service.gd` appoints an actual living adult member, begins paused and checks their location, recovery and other commitments. Policies include spending allowance, cash/resource floors, desired supplies, permissions, workforce and equipment policies. `spending_room` uses the tighter available treasury amount after reserves and remaining allowance; actual purchase consumers debit the sect and credit sellers. This is bounded delegated management, not an automatic resource grant.
- `player_succession_service.gd::transfer` validates a voluntary handover, changes offices, removes incompatible appointments, recomputes disciple ranks and marks active commitments as inherited with an identified prior issuer. The death-successor `choose` path selects a living member and retains the campaign; it is a separate path and does not visibly repeat all voluntary-transfer logic. The UI/session calls these services.
- Background generation uses authored world-history facts, filters them by the character's lifetime/location, selects an impact and creates personal facts with causal links and trait/mood consequences. `EstablishedWorld.initialize` also endows existing people and seeds bonds/families. **This is not proof that its initial past was produced by simulating centuries.**

**Incremental value for YAIR:** funded workers, finite supplies, rest, appointments, requests and household obligations already exist. Property/heir inheritance already exists too. The new useful combination is **institutional continuity**: an office with a budget and permissions, independently owned institutional stock, and agreements that may need review by the next office-holder.

That could support a sect, school, ship's crew, guild or estate under different local rules. A person does not become transferable equipment; an office-holder's succession does not automatically convey their personal mastery, friends or body. Exact rights and obligations belong to the world's institutions and actual agreements.

## F5 / Cultivation Stories: the world's past and the character's foundation matter

Primary context: [game/build](https://timany19.itch.io/cultivation-stories), [mechanical-fix devlog](https://timany19.itch.io/cultivation-stories/devlog/1693509/0185-no-more-stutter-qinggong-dashes-a-body-path-you-can-see-and-choices-that-come-back). The shipped simulation assembly is the main evidence here; its names and strings are partly obfuscated.

**Implemented in the traced assembly:**

- `A/G.cs` contains a generation route that builds a map, creates founders, advances a year range, creates legends and returns the resulting simulation. The year pipeline mutates people/world state, prunes dead people, records births, updates economy/social processing and retains snapshots. It therefore goes beyond selecting a starting biography. All individual historical claims and their eventual dialogue effects were not audited.
- `D/K.cs` reads spiritual roots, principal technique, local qi, compression seasons, toxicity, comprehension/preparation and other modifiers during breakthrough calculation. On success it computes foundation quality before clearing compression, stores opened meridians and an actual advancement history record, and applies foundation consequences.
- `G/Q.cs` computes a diminishing compression contribution and reads it into Dantian/foundation calculations. It also computes the corresponding qi capacity/attack projection. This makes preparation potentially valuable after the threshold, rather than simply postponing a level-up.
- `c/T.cs` branches on the body path, maintains separate tempering/stage state, maps body stages to advancement and updates the next tempering requirement. A shared enum also names a mind path, but an enum is insufficient evidence of an equally complete mind campaign.
- `O/B.cs` and `O/A.cs` model six body parts with layered injuries. Bone/organ damage can disable parts; disabled arms affect wielding and disabled legs affect time/movement factors. Combat and character consumers read the body. This is more specific than a single low-health multiplier.

**Probed against the shipped DLL:** compression contributions for 0/20/200/2,000 seasons were 0/12.857/30.508/35.363, approaching a bound of 36. Those are foundation contributions, **not** direct percentages of attack. A healthy body's movement factor was 1; a broken left-leg bone changed it to 0.5; breaking both arm bones made weapon wielding false. The probes instantiate disposable objects and touch no game save.

**Incremental value for YAIR:** body capabilities/conditions, lineage, source-qualified rule profiles and retained outcome records already exist. The additional connections are preparation quality carried into later capabilities, and world initialization whose historical outcomes populate present institutions/sites/relations. Neither needs another independent history log or generic cultivation meter.

Current `lore_history_state.js` explicitly validates a Frontier/Village outcome vocabulary. It cannot be claimed to be a general multiverse prehistory engine merely because it retains causes. Current population generation provides deterministic identities/presence and derived relations, but does not itself advance centuries. These are concrete extension/binding questions.

For an original world, generated history may establish an old feud and an abandoned workshop whose present owners and stock follow that history. For a canon world, use its source-qualified era as the initial truth; generation fills qualified gaps or an explicitly recorded AU branch. A game inspired by cultivation is not authority for a novel's canon.

## F7 / Endless Path: practice, stored power and execution are different things

Primary sources: [repository](https://github.com/LionelEisenberg/EndlessPath), [cultivation manager](https://github.com/LionelEisenberg/EndlessPath/blob/430b3f1c748fba86d6fa5ca197663be72b6e2ab6/singletons/cultivation_manager/cultivation_manager.gd), [path manager](https://github.com/LionelEisenberg/EndlessPath/blob/430b3f1c748fba86d6fa5ca197663be72b6e2ab6/singletons/path_manager/path_manager.gd).

**Implemented in the traced source:**

- Cycling uses an authored path and timing zones. Tracking accuracy scales Madra earned per cycle; successful timing-zone clicks award Core Density XP. The starting technique has a path, duration and base Madra but no authored timing-zone list in its captured record. Technique unlocks/equipping are stored separately.
- Core Density levels award path points. Path-node purchases check costs, prerequisites and stage; ability and technique unlock effects call their actual managers. Abilities have a persistent pool and four-slot loadout.
- Adventure entry checks a Madra threshold and derives an expedition budget. The adventure initializes combat resources from that budget. Resource availability, practitioner growth and action execution thus have distinct representations.
- Real-time combat code checks resource costs/cooldowns and applies effects. Quest completion processes authored effects. These are actual mechanisms, though ordinary reachability was not exercised here.
- `attempt_breakthrough()` is an immediate return. Numeric path effects aggregate into a cached summary, but searches across the captured runtime scripts found no gameplay readers of `get_effects`, its numeric fields or `effects_changed` outside the producing manager. Ability/technique unlock consumers are present. Scripting, elixirs and soulsmithing remain planned rather than established features.

**Incremental value for YAIR:** energy capacity/output/control/efficiency/strain and active/idle technique practice already have owners. A separate generic Madra bar or another skill tree would duplicate foundations. Useful new work would make a **particular path** change which source can be taken in, how it is processed and which technique can spend it, with real combat/craft consequences.

The live dirty Mistglass work already adds practiced absorption/refinement tradeoffs and frozen purification odds. Its checkpoint advanced during this research: it now records a passing rebuilt native journey and three save/reload/import states, plus passing source/build gates; a final CSS visual continuation and normal-app adoption remain distinct. Those are the other task's recorded results, not checks rerun here. Do not dispatch a duplicate of that work as a discovery from Endless Path. Optional embodied practice could later add a genuinely different interaction, but it need not become a compulsory timing test for every world or every learner.

## Proposed world-building applications

These are four signature loops, not four selected production worlds. Each needs its own source/fiction, ordinary life, cast and declared depth; a source-inspired name does not supply those. The existing world pack/instance/actor/clock/save owners remain the foundation (WA1, WA4–WA6, WA13–WA16).

| Code | Distinct loop to author | Existing substrate | Additional behavior to bind | First playable proof |
| --- | --- | --- | --- | --- |
| W1 / Advancement and materials | Work as a local repairer; learn an applicable preparation method; transform owned material; use its changed property in a tool or an advancement preparation. | Making/process and material lineage, gear workshop, energy/technique rules, world-local capabilities | One process-derived property with two actual consumers; one advancement changes an available operation or result rather than just its multiplier | Same stock takes different valid preparation routes; outputs differ in a named later task; a supported tool/alternate method still works; save/import preserves each lot and earned capability |
| W2 / Institutional life | Enter a sect as a worker/student, earn office, appoint a qualified steward, fund a disclosed policy and later hand the office to a living successor. | People/roles, finite treasuries and custody, funded jobs, household availability, inheritance | Institution-owned office/permissions and policy-driven replenishment; an actual agreement requiring successor review | Steward replenishes within reserve/stock constraints, pauses when unavailable, and the successor retains institutional resources while personal mastery and individual relationships remain their own |
| W3 / Historical world entry | Arrive in a town after a past event; hear an observer's account; inspect its surviving consequence; use that consequence to negotiate access, restoration or a different route. | World instance seeds, population, site state, knowledge and causal outcome structures | Historical fact binds present ownership/site/relationship state and a discovered account; source era or authored/generated branch is explicit | Two initial histories change an actual owner, viable route or obligation; the player learns only supported evidence; reopening/reloading does not regenerate the past |
| W4 / Path practice and expenditure | Learn a path, practice the method, prepare a reserve, choose a compatible technique and spend it on an encounter or precise craft. | Technique practice, energy capacity/output/control/efficiency/strain, shared effects and native work | Path-specific intake/conversion and technique consumers; quality/control changes a demonstrable outcome beyond throughput | Two paths differ in a supported action or preparation requirement; practice changes one actual result; foreign-world/body context follows the pack policy; save/reload/import retains path and reserve |

For a Cradle adaptation, Endless Path supplies implementation ideas, while the novel's source owner must establish Madra/path/advancement laws. For another cultivation world, author its own relationships among root, body, comprehension, material preparation and breakthrough. The shared verbs may be the same while those causal relationships differ.

### Incorporation sequence and useful small details

**P1 / Finish the active method slice, then select one consumer-rich world loop.** Do not require an abstract universal world engine expansion first. The current substrate is already substantial; bind the smallest missing behavior when its world journey needs it. W4 is close to current work; W1 adds material consequences; W2/W3 need more retained social/history structure and should be sequenced as their own slices.

**P2 / Make advancement legible through changed actions.** A new rank can alter a method, apparatus, institution or source interaction where the world supports it. A changed label with the same attack formula is not the same result. Avoid a universal list of permissions: actual means, control, material and social mechanisms decide the outcome (AD38).

**P3 / Delegate decisions with terms.** Sect Chronicle's useful control is the agreement between an actual person, budget, permissions, targets and exceptions. Reuse funded-job/custody rules, expose the reason an officer pauses, and let ordinary work remain available when the player does not hold office.

**P4 / Show causes at the point of use.** Explain a preparation's present effect, show why a past promise opens a conversation, distinguish stored reserve from mastery, and display the actual source of a modifier. Existing known/unknown and observer rules still apply. These are presentation ideas for the native surfaces, not authorization for a new layout.

**P5 / Keep local time and ongoing lives coherent.** Neko's custom calendar, Sect Chronicle's monthly management and Stories' yearly prehistory are different clocks/purposes. Translate their lessons through current world clock/lease owners. Generated past, played actions and authorized off-world work should not secretly share a real-time timer.

## Delivery, dispatch and remaining evidence

This task changed research documents only. No source/gameplay/save changes, release, commit or push. No whole-suite or built-browser gameplay claim is made. The two probe scripts and their passing outputs are private; complete UI campaigns, native-world acceptance and persistence demonstrations remain future gates for selected implementations.

Weibao clarified that the new chat is for **the other additional finds**, not these four. Created local project chat `01a1620b-2dd5-7642-b0b3-ae8e53464dbb`, titled “Investigate additional cultivation game references.” It owns research under `docs/research/additional-cultivation-2026-10-22/` for shlocko's CultivationIdle, Myriad Immortal Sect, Nine Heavens Ascent, Idle Cultivation World and Cultivation Quest. It was dispatched as investigation and incorporation proposals, with no runtime authorization or overlapping write scope. A later compact snapshot confirmed completion, and its [report](../additional-cultivation-2026-10-22/REPORT.md) was read. C7/C9 have the strongest traced consumer lessons, C10 has useful personnel reservations with inaccurate-preview qualifications, C8 stopped at registration, and C11 has a reachable opening with environmental systems still partial.

Method/tool receipts: official [Godot RE Tools documentation](https://github.com/GDRETools/gdsdecomp) supports scripts-only recovery; installed REA's native PCK extractor retained artifact identity. Sect archive SHA-256 `6ba883a5b8f52aea40bfbe8c48c010a38d70f404201f1e5cc77aeded1294dea9`; Stories core assembly SHA-256 `8bec70ed4bd56e4a6ddf3dbd851f88d00756d4e14235efcb2e57570fb75f8423`. External code stays private and is not proposed for literal import. Existing licenses and source qualifications apply if a later concrete code reuse is selected.
