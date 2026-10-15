# System inventory

Installed marker WolfHall-1.1.10; engine 6.99.12.2 +SPIKY. Static inventory: 66 reconstructed scripts, 86,006 lines; 39 installed modules/*.pyo, seven decompiled here. Counts measure source structure, not reachability or gameplay completion. All distinct systems found in the inspected tree are grouped below; not a claim to know every hidden subsystem in unread modules.

| System | Where | Size signal | Documented? |
|---|---|---|---|
| Week plan / calendar | classes.rpy; wolfhall.rpy:standard_scheduler; week*.rpy | 5 weekday entries, authored locks | Yes, F1/A09 |
| Color classes / study / gym / sleep | classes.rpy | 5 color routes plus 3 activity types | Yes, F1; gym/sleep only surveyed |
| Spell learning / spell lists | classes.rpy; modules/wolfhall.py | 85 direct Spell subclass blocks, not all learnable | Yes, F2; whole catalogue unread |
| Spell targeting / delayed casting / MP | spells.rpy; modules/spells.py | 17 target constants | Yes, F2; every target not traced |
| Dungeon units / objects / combat | dungeon.rpy; modules/units.py; modules/wolfhall.py | Classes and method trees indexed privately | Partial, A05/A12 |
| Dungeon perception / knowledge / map | dungeon.rpy; modules/wolfhall.py; projection.pyo; manualquads.pyo | Map, minimap, known cell and sensed-event paths | Partial; render backend unread |
| NPC planning / pathfinding | modules/wolfhall.py:Monster; pathfind.pyo | Move, attack, explore, cast, patrol families | Partial, A05; pathfind.pyo unread |
| Statuses / conditions | modules/conditions.py | Condition subclasses | Partial; catalogue preserved, not every effect read |
| Exam objectives / merit / detention | week4.rpy; exam5/6/7.rpy; final.rpy | First/fifth/seventh sampled; final present | Yes F3/F6; other full paths unread |
| Dialogue / dating / clubs / history | week*.rpy; flags.rpy | 964 labels, 365 menus, 5081 conditional lines across all scripts | Yes, F4/F5; full route semantics unread |
| Diary / codex / log / yearbook | diary.rpy; codex.rpy; log.rpy; yearbook.rpy | 4 named content/UI scripts | Partial, A02 |
| Inventory / equip / charm / cosmetics | wolfhall.rpy; modules/wolfhall.py | 5 equipment slots on character | Partial, A12 |
| Money / shopping / allowance | week*.rpy; wolfhall.rpy | Price-tagged choices; money gain helper | Partial; full economy unread |
| Trophies / unlocks | trophies.rpy; modules/wolfhall.py; yearbook.rpy | Trophy script plus authored unlock calls | Partial; full list unread |
| Save / rollback / sanitization | nopickles.py; nopickles.rpy; modules/sanitize_wh.py | Custom .whs format, stable names and type scrubbers | Yes, A04 source; compatibility partial |
| Screens / input / animations / audio | screens.rpy; smartinput.rpy; animsprites.rpy; audio.rpy | 4 named surface scripts plus system screens | Partial, A06/A11; no visual proof |
| Localization | modules/xlat.pyo; translations/; wolfhall.rpy | Language init and translation call sites | Undocumented beyond inventory; module unread |
| Procedural map support | modules/randmap.pyo; spiralpath.pyo; bonus.pyo | 3 named modules | Undocumented; unread |
| Network / updater / distribution / Steam | network.rpy; updater.rpy; steam.rpy; vendor.rpy | 4 scripts | Undocumented; not executed |
| Diagnostics / debugger / safety helpers | debugging.rpy; tracebacks.rpy; modules/debugger.pyo; safepickle.pyo | Error and sanitizer support | Partial; unused helpers not traced |

## Compiled-module coverage

| Module | State |
|---|---|
| `art.pyo` | Unread; not needed for four questions |
| `bonus.pyo` | Unread; not needed for four questions |
| `cache.pyo` | Unread; not needed for four questions |
| `conditions.pyo` | Decompiled; selected paths read |
| `consts.pyo` | Unread; not needed for four questions |
| `debugger.pyo` | Unread; not needed for four questions |
| `directions.pyo` | Unread; not needed for four questions |
| `distortions.pyo` | Unread; not needed for four questions |
| `environ.pyo` | Unread; not needed for four questions |
| `events.pyo` | Unread; not needed for four questions |
| `files.pyo` | Unread; not needed for four questions |
| `flatcolor.pyo` | Unread; not needed for four questions |
| `fpquads.pyo` | Unread; not needed for four questions |
| `gpg.pyo` | Unread; not needed for four questions |
| `lograndom.pyo` | Unread; not needed for four questions |
| `manualquads.pyo` | Unread; not needed for four questions |
| `pathfind.pyo` | Unread; not needed for four questions |
| `playrandom.pyo` | Unread; not needed for four questions |
| `prefixer.pyo` | Unread; not needed for four questions |
| `projection.pyo` | Unread; not needed for four questions |
| `randmap.pyo` | Unread; not needed for four questions |
| `rpa.pyo` | Unread; not needed for four questions |
| `safepickle.pyo` | Decompiled; selected paths read |
| `sanitize.pyo` | Unread; not needed for four questions |
| `sanitize_space.pyo` | Unread; not needed for four questions |
| `sanitize_wh.pyo` | Decompiled; selected paths read |
| `ship.pyo` | Unread; not needed for four questions |
| `space.pyo` | Unread; not needed for four questions |
| `spells.pyo` | Decompiled; selected paths read |
| `spiralpath.pyo` | Unread; not needed for four questions |
| `stdout.pyo` | Unread; not needed for four questions |
| `substances.pyo` | Unread; not needed for four questions |
| `ui.pyo` | Unread; not needed for four questions |
| `units.pyo` | Decompiled; selected paths read |
| `unroller.pyo` | Decompiled; selected paths read |
| `uprint.pyo` | Unread; not needed for four questions |
| `wolfhall.pyo` | Decompiled; selected paths read |
| `wolfpc_offsets.pyo` | Unread; not needed for four questions |
| `xlat.pyo` | Unread; not needed for four questions |
