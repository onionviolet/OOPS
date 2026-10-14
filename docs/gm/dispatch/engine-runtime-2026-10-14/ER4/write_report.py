from pathlib import Path
import json, subprocess, hashlib
lane=Path('docs/gm/dispatch/engine-runtime-2026-10-14/ER4')
b=lane/'sources'
repos={}
for p in b.iterdir():
 if not p.is_dir() or p.name=='external':continue
 if (p/'REVISION.txt').exists(): repo,sha=(p/'REVISION.txt').read_text().splitlines()[:2]
 elif (p/'.git').exists():
  sha=subprocess.check_output(['git','-C',str(p),'rev-parse','HEAD'],text=True).strip()
  repo=subprocess.check_output(['git','-C',str(p),'remote','get-url','origin'],text=True).strip().removeprefix('https://github.com/').removesuffix('.git')
 else:continue
 repos[p.name]={'repo':repo,'sha':sha}
(lane/'VERIFIED_SOURCE_REVISIONS.json').write_text(json.dumps(repos,indent=2)+'\n')
def ref(k,path,a,z=None):
 r= repos[k];z=z or a
 return f"[{path}:{a}-{z}](https://github.com/{r['repo']}/blob/{r['sha']}/{path}#L{a}-L{z})"
def refs(k,rows):return 'READ: '+ '; '.join(ref(k,*r) for r in rows)+'.'
games=[]
def add(code,name,evidence,fields):games.append((code,name,evidence,fields))
add('ER4-G1','Antimatter Dimensions',refs('antimatter',[('src/core/intervals.js',56,74),('src/game.js',422,451),('src/game.js',895,1030),('src/core/storage/storage.js',83,89),('src/core/storage/serializer.js',1,110),('src/core/storage/migrations.js',1210,1241),('src/core/glyphs/glyph-generator.js',1,117),('src/core/ui.js',12,150),('package.json',15,40)]),[
'Interval selected by player update rate; `gameLoop` uses elapsed wall milliseconds and separates real/game time. Offline simulation starts from a nominal 50 ms step.',
'Long gaps can enter hibernation catch-up. Replay count is bounded, then remaining time is divided among remaining ticks. Async batches yield; Speed up and Skip reduce accuracy while still consuming elapsed time. Some offline rewards use separate formulas.',
'`break_infinity.js` dependency and Decimal operations on currencies. This supports huge magnitudes, not exact accounting of arbitrarily small increments.',
'JSON, UTF-8, pako deflate, printable base64-derived encoding and named format/version markers. Ordered gameplay migrations, save slots and rotating backups are distinct from the encoding version.',
'No spatial actor LOD in these paths. Coarser numerical integration is an offline accuracy tradeoff, not a dormant-world model.',
'Saved xorshift glyph seeds and Gaussian cache; separate real/fake/music glyph streams. `Math.random` also remains in interval code. Whole-game deterministic replay is not established.',
'Vue components subscribe to update events; Promise batching flushes UI events. The authoritative player object is intentionally kept out of Vue deep reactivity.'])
add('ER4-G2','Kittens Game',refs('kittens',[('game.js',2289),('game.js',2890,3095),('game.js',3300,3585),('game.js',4490,4528),('game.js',5250,5340),('js/time.js',190,321),('js/resources.js',632,657),('js/resources.js',843,893),('js/calendar.js',1,70)]),[
'Five ticks per second by default. The optional worker posts tick messages; `tick()` still invokes game update and calendar on the page thread.',
'Redshift reconciles a wall timestamp, rounds to game days and applies a cap of 10 or 40 game years under the read conditions. Managers fast-forward separately, enforce resource limits and optionally handle queue boundaries. It is not a replay of every tick.',
'Ordinary JS numbers. Resource updates clamp to `Number.MAX_VALUE`; carrying caps further constrain values. Formatting large numbers does not restore precision.',
'JSON in local storage, with LZString base64/UTF-16 routes. `saveVersion` and stepwise migrations normalize old state; read snapshot declares version 15.',
'Per-manager bulk fast-forward is a system-level approximation. Not evidence of general spatial or world LOD.',
'No whole-game replay contract established. Calendar and other state are saved, but a saved calendar is not an RNG continuation guarantee.',
'Tick/update methods, UI update calls, published notifications and a separate intended UI cadence during accelerated time. Worker timing does not remove DOM cost.'])
add('ER4-G3','Melvor Idle',refs('melvor-types',[('src/gameTypes/game.d.ts',1,45),('src/gameTypes/game.d.ts',139,161),('src/gameTypes/game.d.ts',355,440),('src/gameTypes/saveWriter.d.ts',1,35),('src/gameTypes/saveWriter.d.ts',189,211),('src/gameTypes/serializeSave.d.ts',312,346)])+' STATED: [developer v0.21 notes](https://wiki.melvoridle.com/w/V0.21), [offline client announcement](https://news.melvoridle.com/offline-client-public-beta-now-available-on-steam-mobile/), checked 2026-10-14. Type declarations are an official API contract, not executable implementation.',[
'Official declarations expose elapsed processing, `runTicks`, `tick` and online/offline loop methods. Historical v0.21 developer notes specify a 50 ms combat tick; that post alone does not prove the current whole-engine cadence.',
'Current declaration constants: enter offline at 60,000 ms, maximum 86,400,000 ms, exit remainder 500 ms, GC ratio 0.95. Snapshot/report and entry/exit events are exposed. Offline installation is separately documented and is not the same feature as catch-up.',
'API exposes numeric fields and binary float accessors. No arbitrary-magnitude numeric core established by this slice.',
'`SaveWriter` extends `BinaryWriter`, with header, namespace-to-numeric ID mappings, versioned decode and compatibility helpers. This verifies the declared binary codec seam, not its live byte layout or migration correctness.',
'Active-action and subsystem seams are exposed. General actor/world LOD not established.',
'Full RNG persistence and exact offline/online equivalence not established from declarations. Do not turn an API signature into runtime proof.',
'Explicit `renderQueue`, render methods and separate tick/loop methods. The declaration establishes a deferred-render seam, not current render cost.'])
add('ER4-G4','Evolve (idle)',refs('evolve',[('src/main.js',840,882),('src/main.js',12810,12827),('src/functions.js',112,224),('src/vars.js',1,5),('src/vars.js',64,110),('src/vars.js',108,160)]),[
'Fast, mid and long loops share `loopTick`, ordered fast before mid before callbacks before long. Baseline fast period 250 ms, mid 1 s and game day 5 s; traits and accelerated time change the period.',
'Absence earns a capped accelerated-time bank, then consumes it through faster live play, rather than immediately replaying the whole absence. `execGameLoops` also caps one catch-up call to one minute of simulation. A timer worker sends messages to page-side simulation.',
'Ordinary numbers in inspected arithmetic. No broad Decimal economy found in these paths; safe supported ranges are not established.',
'LZString UTF-16 compressed JSON in local storage, base64 export. Global version checks perform compatibility transforms in `vars.js`.',
'Multiple system cadences; not proof of active/coarse/frozen world tiers.',
'Saved `seed` and `warseed` advance a named seeded generator. `Math.random` helpers also exist. Seeded challenge generation is narrower than deterministic whole-session continuation.',
'jQuery DOM operations sit inside simulation loops, including fast-loop craft labels. Coarser loops reduce some work but do not make the core DOM-free.'])
add('ER4-G5','Trimps',refs('trimps',[('main.js',180,222),('main.js',2674,2709),('main.js',2878,2990),('main.js',5533,5575),('main.js',15835,15872),('main.js',19897,19945),('main.js',300,327)]),[
'100 ms simulation step; loop-count divisors run selected work every 300 ms, 400 ms, 500 ms, second and slower.',
'Time Warp runs `gameLoop(true)` in batches, adjusts batch size based on wall execution time and yields via `setTimeout`. Replay has a 24-hour path and mode-specific fallback for excess. Catch-up UI exposes progress and limited controls.',
'Economy largely uses native numbers; Decimal with 30-digit precision is specifically used for breeding arithmetic. This is a good example of targeting precision to one subsystem.',
'LZString base64 compressed JSON, version checks and extensive compatibility patches. Import rejects/flags incompatible version cases.',
'Work is split by cadence. Offline paths suppress some drawing and rebuild UI on finish; this is not general NPC/world LOD.',
'Seeded daily/generation paths coexist with `Math.random` combat rolls. Replaying ticks does not imply that reload recreates the same future random sequence.',
'Direct DOM updates; catch-up progress view replaces routine presentation, followed by redraw of buildings/upgrades/equipment/jobs.'])
add('ER4-G6','Cookie Clicker',refs('cookie-mirror',[('main.js',2083),('main.js',2871,2887),('main.js',3038,3080),('main.js',3113,3148),('main.js',3468,3474),('main.js',3535,3597),('main.js',16555,16578),('main.js',17017,17026),('main.js',17165,17243),('README.md',1,8)])+' The official JS URL was unavailable to web extraction and returned 403 on direct fetch. These are READ claims about an identified third-party mirror, not proof of current official bytes or an open-source license.',[
'30 FPS logic loop, recursive timeout with wall-latency compensation. Accumulated delay is clamped to five seconds and drained with extra logic steps.',
'Sleep timeout can stop overloaded inactive play. Load computes offline production with upgrade-dependent efficiency/time windows and reduced efficiency beyond the window; buffs load after offline CpS computation. Selected timers and resources have separate absence rules.',
'Native JS numbers, parseFloat save values and Infinity display handling. No arbitrary-precision currency type in the inspected route.',
'Custom delimited versioned string, base64/escaped export and local storage routes. Positional fields and version-specific compatibility logic. Despite a comment using the word compressed, the inspected export branch is base64, not proof of compression.',
'Selected logic cadence and hidden-page draw gating; no general actor LOD.',
'Many `Math.random` consumers. Saving a seed field does not establish a saved state for every random stream.',
'Separate Logic/Draw functions, scheduled menu refreshes and visible-only drawing. In this snapshot the rAF alternatives are commented out; do not cite those comments as active scheduling.'])
add('ER4-G7','A Dark Room (web)',refs('darkroom',[('script/engine.js',272,301),('script/engine.js',834,851),('script/state_manager.js',75,115),('script/state_manager.js',219,320),('script/state_manager.js',350,391)]),[
'Several module timers, including one-second recurring income timeout. Timer wrappers support mobile/double-time behavior; no unified pure fixed-step core here.',
'Inspected load restores saved state and upgrades it; income decrements per callback. No wall-gap catch-up in these read paths. INFERRED: those paths freeze when not running, with hidden-tab slowdown possible. Native mobile ports are out of scope.',
'Native numbers for stores and counters; no huge-number library established.',
'JSON state in local storage; legacy fields are moved into StateManager domains by versioned `updateOldState` transforms.',
'Active module gates some income behavior. No general world/NPC LOD established.',
'Whole-game seeded replay not established. Engine has `Math.random` use; module random paths were not exhaustively audited.',
'StateManager emits document state-update events, optionally saves, and supports suppressing intermediate notifications. Useful small precedent for domain events.'])
add('ER4-G8','Progress Knight (original)',refs('progressknight',[('js/main.js',27),('js/main.js',962,1037),('js/main.js',1148,1158),('js/HackTimer.js',14,31),('js/HackTimer.js',67,103),('index.html',298)]),[
'20 updates per second; each update advances age, promotion, learning, current job/skill, expenses and UI.',
'HackTimer routes timeout/interval requests through a worker. No timestamp-based closed-game settlement in the inspected original load/update path. INFERRED: background timer activity and closed-tab progress differ; later forks are not this source.',
'Native JS numbers with speed scaling. Exact supported growth limits not established.',
'JSON `gameDataSave`, base64 import/export. Load fills missing keys, removes obsolete keys and reattaches methods. This is definition reconciliation, not a fully versioned migration registry.',
'One job and one skill advance; all row requirements update. No broad LOD.',
'No whole-game replay contract found in this slice. The read update arithmetic is mostly direct, but that does not establish replay across versions.',
'Every update invokes broad UI row/header/text/hide passes. Simple implementation, weak reference for large actor rosters.'])
add('ER4-G9','Idle Loops (Omsi fork)',refs('idleloops',[('loops/driver.js',1,100),('loops/driver.js',525,549),('loops/saving.js',157,162),('loops/saving.js',418,435),('loops/saving.js',456,488),('loops/saving.js',724,747),('loops/views/main.view.js',1,42)]),[
'Elapsed-ms accumulator, nominal 50 mana steps per second, speed-dependent step consumption and queued action execution. Worker timing wakes the page-side loop.',
'Load adds elapsed time to an offline-ms bank, capped at 2,678,400,000 ms in the read path. Bonus mode spends banked time at 5x. A backlog over 2 s triggers a refund/bank path instead of an unbounded synchronous replay.',
'Native numbers in the read timer/resource helpers; no arbitrary-magnitude core established.',
'Local JSON and `ILSV01` LZString base64 export, legacy import fallback and version75 migration flag.',
'Queued actions and retained progression versus per-loop resources separate scopes. No general spatial LOD.',
'No saved RNG continuation contract established by this slice; equal queue/time inputs alone do not prove equal random outcomes.',
'Explicit view update calls after loop work; targeted resource/action updates plus slower graph refresh. Rendering is still page-side.'])
ngu='https://store.steampowered.com/news/app/1147690/view/4742798819311197688'
nguold='https://store.steampowered.com/news/app/1147690/view/2404285581875498636'
add('ER4-G10','NGU Idle',f'STATED: [4G Build 1.130, 2020-05-14]({ngu}); [Build 1.001, 2019-10-21]({nguold}), checked 2026-10-14 via the Steam news API; exact bodies retained in ER4/sources/external/ngu-news.json. No original engine source inspected.',[
'Not established by primary evidence collected.',
'Developer notes explicitly add offline Infinity Cube calculations and repair offline ITOPOD/Titan bonus handling. Supports subsystem-specific offline formulas, not an assertion of exact full replay.',
'Not established. Do not import community tick or numeric-limit claims as checked engine facts.',
'Original format and migration chain not established.',
'Offline subsystem policy is established; spatial/world LOD is not.',
'Not established.',
'Older developer notes mention hiding UI until nearer unlocks and shortcut tooltips. Engine render scheduling not established.'])
add('ER4-G11','Candy Box (original)',refs('candybox-original',[('scripts/main.js',41,82),('scripts/candies.js',1,40),('scripts/save.js',13,55)])+' STATED: [creator hosting note](https://candybox2.wordpress.com/), checked 2026-10-14. The creator warns that the hosted first game cannot save; a source save routine is not evidence of functioning hosted persistence.',[
'Separate 100 ms conversion and one-second production timers; cookie autosave timer in source.',
'No elapsed reconciliation in the read loop. INFERRED: production is callback-based; closed-tab catch-up not established.',
'Native counters and rates, no huge-number type established.',
'Source emits named text fields and reads cookie state at startup. Historical hosting changes make live save availability a separate gate; migration chain unverified.',
'No general LOD established.',
'No replay contract established.',
'Direct DOM-facing resource setters called by timer production. No independent reactive render model established.'])
add('ER4-G12','Candy Box 2',refs('candybox',[('code/main/Game.ts',161,169),('code/main/Game.ts',769,826),('code/main/LocalSaving.ts',14,64),('code/main/Saving.ts',138,212),('code/main/Save.ts',81,110),('code/main/Resource.ts',1,36)])+' STATED: [creator source/license page](https://candybox2.github.io/source_code.html), checked 2026-10-14.',[
'One-second production/autosave callback and roughly 100 ms quest callback with speed/slowdown adjustments.',
'No wall-gap catch-up in read load/loop paths. INFERRED: these production timers depend on execution.',
'TypeScript `number`, parseFloat loading and current/accumulated/max resource values. TypeScript itself does not change numeric range.',
'Separate bool/number/string registries; local slots write many storage keys. File export emits typed named text fields. No ordered version migration chain established.',
'Quest versus normal callbacks separate rates; no general actor LOD.',
'Whole-game saved RNG contract not established.',
'Callback collections connect resources, places and timers to rendering, with explicit callback reset on transitions.'])
add('ER4-G13','Dwarf Fortress','STATED: [Bay 12 development log, 2014-03-10 and 2014-03-13](https://www.bay12games.com/dwarves/dev_2014.html); [shipped 0.44.01/0.44.03 notes, 2017-11-22 and 2017-12-25](https://www.bay12games.com/dwarves/dev_2017.html), checked 2026-10-14. These are historical developer records, not a current engine source audit. The current roadmap is explicitly future work and was excluded as shipped proof.',[
'World time and local simulation exist in developer accounts; exact present scheduler/cadence not established.',
'Off-map activity during in-game time is documented. Wall-clock closed-game catch-up not established.',
'Numeric types/overflow policies not established.',
'Developer notes address old-save arrivals and off-loaded item restoration. Actual file codec and current migration contract not established.',
'Individually tracked figures coexist with abstract populations. Abstract populations can supply new leadership; off-site squads return with reports. Identity and reintegration matter at the boundary.',
'World generation seed and full continuation determinism are not established by these sources.',
'Return reports and world-map interactions are documented. Render scheduling not established.'])
add('ER4-G14','RimWorld','STATED: [HugsLib author, Custom Tick Scheduling, 2018-03-02](https://github.com/UnlimitedHugs/RimworldHugsLib/wiki/Custom-Tick-Scheduling), checked 2026-10-14. This is a mod-library author describing the vanilla API and its own scheduler, not published vanilla engine source. [Ludeon save-format forum](https://ludeon.com/forums/index.php?topic=1083.0) was located, but author authority and current details were not established.',[
'HugsLib documents Normal at 60/s, Rare every 250 ticks and Long every 2,000. Its distributed scheduler spreads recipients across ticks.',
'Library callbacks respect pause and time acceleration while a game is running. No closed-game wall catch-up established.',
'Not established.',
'Current format/migration chain unverified. Historical forum XML claim is not promoted to checked engine proof.',
'Different tick classes and hashed offsets lower frequency/spikes. Map-versus-world actor LOD not established here.',
'Not established.',
'API distinguishes next tick, next Unity update and next OnGUI; current vanilla rendering behavior unverified.'])
add('ER4-G15','Cataclysm: Dark Days Ahead',refs('cdda',[('src/do_turn.cpp',533,566),('src/do_turn.cpp',642,682),('src/do_turn.cpp',751,761),('src/map.cpp',9306,9311),('src/map.cpp',9953,10017),('src/savegame.cpp',84,107),('src/savegame.cpp',199,242),('src/rng.cpp',200,219),('src/game.cpp',3167,3173)]),[
'Turn/action-driven: game turn increments then actors spend move points; activity and input consume the avatar moves. In-game time is not browser wall elapsed.',
'When submaps return, `actualize` uses saved `last_touched` and current game time to age items, refill funnels, grow plants and update seasonal effects. This is offscreen in-game catch-up, not offline idle rewards.',
'Integer move/time counters and typed quantities, with floats in random/other paths. No idle-scale arbitrary-magnitude core established.',
'JSON game state with version 40 in read snapshot; legacy header detection retained. Maps/world data have separate persistence routes. Complete migration coverage not audited.',
'Loaded submaps get detailed work; unobserved maps receive selected elapsed-state updates on load. Off-map NPC movement has separate periodic work. Do not assume all interactions replay offscreen.',
'RNG engine initially seeds from high-resolution clock; explicit seeding exists. Seed control alone does not establish saved whole-run random continuation.',
'UI adaptors register redraw callbacks and render through `ui_manager`; sim turns and redraw requests are distinct.'])
add('ER4-G16','Caves of Qud','STATED: [Freehold Games Spring Molting, 2024-06-06](https://freeholdgames.itch.io/cavesofqud/devlog/744713/the-spring-molting-update-is-now-live); [2019-05-10 developer notes](https://freeholdgames.itch.io/cavesofqud/devlog/80611/feature-friday-may-10-2019), checked 2026-10-14. No original engine source inspected.',[
'Developer reports turn-by-turn performance improvements. Exact energy/action scheduler not established.',
'Zone absence and wall-clock offline behavior not established by collected primary sources.',
'Not established.',
'2019 notes add binary serialization support for mod types. 2024 notes change event processing/serialization order and improve save/load overhead. Current full save format and compatibility chain unverified.',
'Zone-related performance work is documented; full/coarse/frozen policies are unverified.',
'Prioritized events and serialization ordering matter. Full replay determinism unverified.',
'2024 update adds a new mouse/gamepad UI and retains text UI as an option. UI replacement did not require dropping the old presentation; exact scheduling unverified.'])
ck='https://steamcommunity.com/games/1158310/announcements/detail/535490230242770975'
add('ER4-G17','Crusader Kings III / Paradox daily ticks',f'STATED: [CK3 developer diary 187, 2025-10-15]({ck}), checked 2026-10-14. Full first-party body recovered through Steam news API and stored in ER4/sources/external/ck3-187.txt. Claims are specific to CK3, not all Paradox titles.',[
'Daily ticks with serial and parallel phases; profiling identifies expensive systems and irregular spikes.',
'Closed-game wall catch-up not established. Faster simulation is not an idle absence policy.',
'Exact numeric representation not established.',
'Codec and migration pipeline not established.',
'Costs reduced by skipping irrelevant AI work, reducing unnecessary updates, narrowing candidate searches and maintaining valid cached income. This is relevance/cadence control, not a proved world-freeze scheme.',
'Developer benchmarks use fixed seeds, hardware and settings. That controls performance variance; it is not full deterministic save/continuation proof.',
'Diary separates rendering from simulation and reports GUI work. Exact UI invalidation mechanism unverified.'])
add('ER4-G18','Factorio','STATED: [Wube FFF 302, 2019-07-05](https://www.factorio.com/blog/post/fff-302); [FFF 270, 2018-11-23](https://www.factorio.com/blog/post/fff-270); [FFF 370, 2022-09-23](https://www.factorio.com/blog/post/fff-370); [current data lifecycle docs](https://lua-api.factorio.com/latest/auxiliary/data-lifecycle.html), checked 2026-10-14. No private engine source inspected.',[
'Deterministic per-tick simulation; server orders input actions on ticks. Wube uses 60 UPS as a performance target.',
'Joining downloads a save then applies inputs; not evidence of wall-clock idle rewards. Closed-game catch-up unverified here.',
'Cross-architecture double-to-integer overflow broke determinism and needed fixes. Exact numeric type inventory not established.',
'Map versions, stable prototype ID mappings, migrations and mod changes affect loading. Lifecycle docs separate load, migration and configuration-change stages.',
'Full-state deterministic peers are documented. Unseen-entity LOD policies not established by these references.',
'Save/load must preserve observable future behavior. Wube compared per-tick state CRCs between ARM and x86 tests; this is developer-reported, not an ER4 measurement.',
'Authoritative Game State is separate from speculative Latency State for responsive input. Exact renderer scheduling not established.'])
add('ER4-G19','Upstream original YAIRPG',refs('upstream',[('src/main.js',232,260),('src/main.js',799,810),('src/main.js',1474,1500),('src/main.js',1571,1629),('src/main.js',3398,3411),('src/main.js',3695,3732),('src/main.js',5248),('src/main.js',5289,5318),('src/main.js',5662,5721),('src/main.js',3825),('src/main.js',4737,4750),('src/game_time.js',9,59)]),[
'Recursive timeout at tickrate 1; ordinary calendar increment one minute per callback, sleep six. Separate action interval and player/enemy combat timeouts. Drift correction clamps schedule adjustment to 100/tickrate ms.',
'Load restores calendar/progress; `saved_at` is a readable local date. No startup wall-gap reconciliation in the read load/update route. INFERRED: closed time is not paid by these loops; background callbacks may slow. Full browser behavior was not exercised.',
'Native numbers and probabilities. No big-number package/adapter established in read paths.',
'Hand-built JSON snapshot in local storage, base64 export/import, 60-second autosave and 3,600-second backup counters. Inline version checks repair economy, quality, inventory, quests and other old fields.',
'Current activity/location and combat select active work. No multi-world or general background-actor LOD in the read upstream loop.',
'`Math.random` for actions/combat; no whole-run saved random stream established.',
'Simulation directly calls display functions and mutations. Timer smoothing is not render separation or a pure core.'])
head='''# Idle and simulation engine references, 2026-10-14

## CHECKPOINT

ER4 research complete. All 17 requested candidate groups plus upstream are covered below; Candy Box includes both original and sequel, giving 19 profiles. Seven requested dimensions are explicit for each. Mechanisms are source-read or developer-stated, never claimed gameplay-tested. Closed-source and partial-source gaps remain named. Resume from [ER4 report](../gm/dispatch/engine-runtime-2026-10-14/ER4/REPORT.md) and its revision manifest; no runtime adoption is authorized.

Scope: extend the [root palette](../ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md), [E1-E10 review](../ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md) and [offline audit](OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md). Root remains read-only and owned by Claude. Research serves the current one-realm/one-prestige milestone, retained browser path and desktop/laptop priority. It selects no stack, new offline loss rule, mobile gate or general world simulation. Preserve active-branch-only eligibility and declared freeze defaults when considering adapters.

Evidence key: **READ** means inspected source with pinned file/line URLs; **STATED** means a named external developer/API document, date checked 2026-10-14; **INFERRED** means this lane's judgment. **Not established** is an evidence gap, not proof that a game lacks a feature. **MEMORY** would label unchecked recollection; no unchecked recollection is used as a mechanism here. **MEASURED** is reserved for executed probes with commands and numbers; none of the game performance claims below is MEASURED. Downloading code and reading constants is not a benchmark. Repository HEAD snapshots may differ from the live release.

## Main findings

| Code | Finding | Why it changes the choice |
| --- | --- | --- |
| ER4-F1 | READ: AD uses bounded/coarser replay, Trimps uses batched tick replay, Kittens uses subsystem fast-forward, Evolve/Idle Loops bank faster future play. | INFERRED: choose semantics per supported consumer. These are different products, not interchangeable optimizations. |
| ER4-F2 | READ: Kittens, Evolve and Progress Knight use timer workers that wake page-side code. | INFERRED: PF7 timing mitigation does not establish TS4 CPU isolation or safe suspend behavior. |
| ER4-F3 | STATED: Factorio treats save/load as a continuation invariant; Qud documents event/serialization ordering changes. | INFERRED: future behavior, pending event order and RNG continuation need checks, not just equal visible totals. |
| ER4-F4 | READ/STATED: CDDA actualizes selected absent-map effects; DF uses abstract populations with individual return paths. | INFERRED: coarse simulation needs a materialization contract for identity, stock and obligations. |
| ER4-F5 | READ: AD uses large-magnitude arithmetic, Kittens caps native numbers, Trimps targets Decimal precision to breeding. | INFERRED: range, precision and exact conservation are separate choices. No need for one numeric type everywhere. |
| ER4-F6 | STATED: CK3 narrows candidate work and caches derived values; RimWorld's mod API spreads periodic recipients. | INFERRED: a priority queue alone will not cure dense actor relationships or synchronized periodic spikes. |

## Source profiles

The limits in each row belong to the checked edition. A timer-based source can be useful as a caution even when it does not solve our scale problem. Closed games remain in the inventory, with fewer supported engine claims.

'''
parts=[head]
labels=['Tick model','Offline / background catch-up','Big numbers','Save format / migration','Simulation LOD','Determinism','UI update model']
for code,name,ev,fs in games:
 parts += [f'### {code}: {name}\n\n{ev}\n\n| Dimension | Checked mechanism or limit |\n| --- | --- |\n']
 for label,field in zip(labels,fs):parts.append(f'| {label} | {field} |\n')
 parts.append('\n')
parts.append('''## Lessons mapped to the root palette

All adoption judgments in this table are INFERRED proposals. Existing root codes keep their meaning. Costs are relative, not estimated engineer-days. Rank is value per effort for this repo, not a universal game-engine ranking.

| Code / rank / disposition | Concrete lesson and source | Root codes informed | One cost | Observable next check |
| --- | --- | --- | --- | --- |
| ER4-L1 / 1 / adapt | Keep gameplay state outside deep UI reactivity; batch dirty view updates. AD G1 and ADR G7 show two scales of this. Start with one polling panel. | RT3, RT4, PF5, TS5, CH1 | Low: identify the panel's actual inputs. | One mutation renders once; unrelated changes and paused time do not poll; listeners release on close. |
| ER4-L2 / 2 / adapt | Name offline semantics and fidelity in the adapter contract. Use Trimps replay for consequential boundaries, Kittens bulk formulas only for qualified independent rates, and keep supported policies explicit. | RT1, RT2, RT8, PF7, E5/E7; OT2/OT10 | Medium: qualify one consumer against foreground behavior. | Equal eligible elapsed time split several ways matches state, RNG and event IDs at thresholds; choice barriers retain unspent time. |
| ER4-L3 / 3 / adapt | Adopt Factorio's continuation comparison for one saved job, including pending order and random state. | RT9, DA4, CH4, CH7, OS5; E1/E3 | Low/medium: a synthetic command sequence with a roundtrip split. | Uninterrupted run equals save/reload midway followed by the same inputs. Report first differing tick/domain. |
| ER4-L4 / 4 / trial when profiled | Spread nonurgent recurring work by stable actor phase; HugsLib's distributed scheduler avoids synchronized spikes. | RT6, RT7, PF1, PF2, OS6 | Low/medium: separate periodic housekeeping from causal deadlines. | Many synthetic actors starting together do not create one spike; hard deadlines still settle at the exact due time. |
| ER4-L5 / 5 / adapt | Target numeric requirements by domain: AD huge growth, Kittens bounds, Trimps breeding precision. | PF8, DA4, TS1; E3/E7 and earlier T8 | Medium: boundary and conversion fixtures for the chosen domain. | Conservation/overflow tests at supported limits and save/catch-up roundtrip; UI formatting never changes arithmetic. |
| ER4-L6 / 6 / trial when profiled | Index relevant candidates and maintain derived aggregates. CK3's succession example targets expensive relationships, not just tick frequency. | RT4, RT6, RT7, PF1, PF6, DA5 | Medium: maintain indexes on relationship changes. | Indexed and full-scan synthetic results agree; doubling actors does not silently create all-pairs work. |
| ER4-L7 / 7 / park until one moving-world adapter | Preserve abstract populations and elapsed summaries, then materialize relevant actors/items once. DF/CDDA. | RT7, DA2, DA6; E8 and OT8 | High: identity/custody/relevance and absence rules. | Leave/reenter a synthetic area twice; named people, finite stock, jobs and relevant history survive without duplication. |
| ER4-L8 / 8 / park as a player-facing dial | Evolve/Idle Loops bank time for faster future play rather than resolving unseen events immediately. | RT8, OS1, OS6; OT3/OT4 | Medium/high: bank eligibility, spending and UI policy. | Save/reload/cancel cannot duplicate banked time; no resting branch receives a second reward. Requires a selected product policy first. |
| ER4-L9 / 9 / skip as a new template | Do not copy upstream/Progress Knight's multiple timers and inline migration/DOM coupling into new systems. They explain inherited behavior and provide bounded extraction seams. | RT1, RT2, CH1, DA4 | Medium: one owner extraction with behavior comparison. | Extracted source preserves the selected old-save/activity slice; rebuilt desktop play remains a separate gate. |

Source availability is not permission to copy implementation into this fork. This lane copies no game code into runtime. If a later slice takes code, inspect that repository's actual license and preserve attribution; publicly downloadable Cookie Clicker bytes are not an open-source license.

## New angles missing or underspecified in the palette

These extend the existing rows with specific mechanisms and tests. They do not duplicate the E-review's general requirements. New codes are local to ER4 until the root owner chooses whether to absorb them.

| New code | Proposed addition | Evidence / gap beyond existing code | Cost | Acceptance example |
| --- | --- | --- | --- | --- |
| ER4-N1 | **Adapter fidelity contract:** exact, statistical, or intentionally different, with supported interactions and invalidating boundaries. | INFERRED from AD/Kittens/Trimps. RT8 mentions equivalence; it does not describe how to refuse a bulk formula when rates, resource caps, RNG or prerequisite decisions interact. | Medium per first adapter. | A cap, resource shortage or event stops bulk integration at its boundary; approximation is never silently substituted for exact obligations. |
| ER4-N2 | **Periodic phase distribution:** stable phase offset per actor/domain for nonurgent checks. | STATED HugsLib. RT6 chooses due work; it does not spread thousands of equal-period jobs created together. | Low/medium. | Stable offsets survive reload; causal deadlines and action ordering remain unaffected. |
| ER4-N3 | **Continuation fingerprint:** canonical domain hashes at selected steps, before and after save/load, with first-divergence reporting. | STATED Factorio CRC method. RT9 seeds RNG but lacks a cheap localization method for ordering/cache/migration drift. | Low for one fixture, higher across engines. | Same input schedule, including a roundtrip, yields equal state/event/RNG hashes. Exclude wall labels and derived UI caches. |
| ER4-N4 | **Sparse interaction budget:** indexes for eligibility, locality, faction, institution and obligations, with complexity tracked separately from actor count. | STATED CK3 candidate-search problem. RT7 reduces actor detail; RT6 reduces due work; neither alone removes N-by-M relationship checks. | Medium. | Many unrelated actors do not enlarge a local appointment scan; comparison to full scan catches omitted eligible actors. |
| ER4-N5 | **Promotion/demotion contract:** coarse actors/populations become detailed without inventing stock, reassigning known identities or losing promises. | READ CDDA and STATED DF. RT7 lists tiers, but needs conservation and irreversible-fact rules at transitions. | High. | A known NPC, item custody and pending obligation cross tier boundaries twice without duplication or knowledge leaks. |
| ER4-N6 | **Catch-up presentation quarantine:** suppress per-event animation/sound/UI work while retaining consequential events and a knowledge-filtered receipt. | READ AD/Trimps and Melvor API. RT8 progress bar does not specify which side effects are replayed or withheld. Existing OT5 covers the return report, not replay-effect isolation. | Low/medium. | Long catch-up produces one bounded render/report; notifications cannot consume gameplay RNG or leak sealed facts. |
| ER4-N7 | **Range versus precision budget:** smallest meaningful delta, rounding unit and saturation policy per numeric domain, not just maximum magnitude. | READ Kittens MAX_VALUE, AD Decimal and Trimps breeding Decimal. PF8 asks about overflow; finite values can still lose a one-coin spend or tiny XP gain. | Medium for one domain. | Large balance plus/minus the minimum spend conserves exactly where required; growth displays use declared approximate semantics and migration conversions. |
| ER4-N8 | **Restore dependency order:** definitions and ID tables, migration, reference repair, scheduler/RNG restoration, derived cache rebuild, then observation-safe UI. | STATED Factorio lifecycle/Qud ordering; READ Melvor namespaced codec. DA4 versions domains but does not spell out activation order across changed packs. | Medium/high when content can change. | A removed definition with outstanding references follows declared recovery; rebuilding caches cannot award rewards or advance RNG. |

## Evidence retained and next authoritative gates

[Verified revisions](../gm/dispatch/engine-runtime-2026-10-14/ER4/VERIFIED_SOURCE_REVISIONS.json) pins each source checkout or downloaded subset. Source copies, first-party news bodies and fetch-failure records live under ER4, not runtime. [Report](../gm/dispatch/engine-runtime-2026-10-14/ER4/REPORT.md) records commands, limits and open questions.

No local engine benchmark, game execution, build, save manipulation or native browser journey was needed for this research-only lane. Performance statements from other developers are STATED. Mechanisms read in source are READ. Recommendations are INFERRED. This report does not certify the live release of any reference game.

ER4-Q1: For closed engines, exact save codec/migration, RNG continuation and absent-zone rules remain gaps unless a specific adoption needs them. NGU/DF/RimWorld/Qud/CK3 unknown cells should not be replaced with folklore. Melvor runtime behavior needs executable source or a bounded synthetic runtime probe beyond its API declarations. Cookie mirror-to-current-official agreement remains unverified after the official 403.

ER4-Q2: No new catch-up approximation, numeric type, bank-time mechanic or moving-world policy is selected. If one is selected, test a single eligible consumer, thresholds and failures, then rebuild and exercise its connected desktop route plus synthetic save/reload/import. Existing source-only tests and this report cannot close those gates.
''')
out=Path('docs/research/IDLE_AND_SIM_ENGINE_REFERENCES_2026-10-14.md');out.write_text(''.join(parts))
print('wrote',out,len(games),'profiles')
