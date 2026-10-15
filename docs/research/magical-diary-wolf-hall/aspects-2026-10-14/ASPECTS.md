# Wolf Hall aspect pass, 2026-10-14

Source-only. Covered means the described mechanism was inspected, not that all content or runtime behavior is proven. Paths are relative to work extract, except shipped engine paths. Proposals are unaccepted.

## A01: covered

RenPy label/menu graph carries speakers, sprite/expression cues, point deltas and named history. Paid prep has a later result; deterministic stat/relationship gates can fail and change available choices. Sampled chains covered, all romance endings not read.

Evidence: `game/week9.rpy:nov_2_bookstore, nov_2_library_poems`; `game/week16.rpy:dec_20_assembly_choice`; `game/flags.rpy:on_damien_path`. Shown in code or reconstructed scripts; UI experience and design takeaway are inferred.

PROPOSAL: P19: bind paid preparation to a later useful host action; keep refusal and promise distinct.

## A02: covered

Dated scripts deliver scenes; diary entries record or derive recaps from branch facts. Yearbook reads earlier outcomes, including detention/route decisions. Whole ending catalogue not audited.

Evidence: `game/diary.rpy`; `game/week9.rpy:diary_entry_nov_2_poets`; `game/yearbook.rpy`. Shown in code or reconstructed scripts; UI experience and design takeaway are inferred.

PROPOSAL: CHARACTERS_AND_WORLD_EVENTS: recap from durable facts, without replaying rewards.

## A03: covered

RenPy 6.99.12.2 +SPIKY combines compiled label/screen scripts with Python 2.7 optimized modules. School flow is authored; dungeons use units, conditions, delayed timers and target handlers. Decompilation reconstructed 66 scripts and seven selected modules, without execution.

Evidence: `renpy/__init__.py:version_tuple`; `game/classes.rpy`; `modules/wolfhall.py`; `modules/spells.py`. Shown in code or reconstructed scripts; UI experience and design takeaway are inferred.

PROPOSAL: ENGINE_AUTHORING: keep authored scene flow and actual simulation effects joined through existing commands.

## A04: partial

Custom .whs save replaces RenPy save/load with newline records compressed with zlib and base64 under b64z header. Saves include rollback/call locations and object state, version provenance and sanitizers. Known spells serialize as class names then resolve through an allow-typed lookup. Generic autosave disabled and auto-1 explicitly ignored. No save opened or roundtrip run; migration coverage incomplete.

Evidence: `game/nopickles.rpy:nopickle_save, renpy_loadsave_load`; `nopickles.py:safesave_serialize, safeload`; `modules/sanitize_wh.py:serialize_known_spells, scrub_known_spells`; `game/options.rpy:25-27`. Shown in code or reconstructed scripts; UI experience and design takeaway are inferred.

PROPOSAL: ENGINE_EXPANSION: retain stable method/scene identities and explicit version handling; source serializer presence does not prove import.

## A05: partial

Dungeon monsters plan timed moves, attacks, casts and exploration with pathfinding grids. Patrol dummy has authored movement. Human dating routes are scripted flags, not evidence of autonomous daily lives. Full AI decision weights and all creature overrides unread.

Evidence: `modules/wolfhall.py:Monster.PotentialActions, Act, PlanExplore`; `modules/wolfhall.py:PatrolDummy`. Shown in code or reconstructed scripts; UI experience and design takeaway are inferred.

PROPOSAL: CHARACTERS_AND_WORLD_EVENTS: distinguish scene eligibility from autonomous NPC planning.

## A06: partial

Week plan, stat bar, spellbook, quick slots, dungeon minimap and target screens use RenPy screen language. Spellbook supports sort and PageUp/PageDown. Layout not visually exercised.

Evidence: `game/classes.rpy:screen scheduler`; `game/spells.rpy:spellbook_core`; `game/dungeon.rpy:2013`; `game/wolfhall.rpy:weekend_menu`. Shown in code or reconstructed scripts; UI experience and design takeaway are inferred.

PROPOSAL: THEMATIC_UI_AND_INFORMATION_DESIGN: proposed desktop 1366x768 plan, known method, capacity and useful application together; mobile deferred.

## A07: partial

Content authors use labels, menus, flags and Python subclass spell definitions collected in ordered lists. No supported public mod API or load-order contract established. Reconstructed source is a research route, not an official authoring SDK.

Evidence: `game/week9.rpy`; `game/flags.rpy`; `modules/wolfhall.py:Spell, all_spells`. Shown in code or reconstructed scripts; UI experience and design takeaway are inferred.

PROPOSAL: ENGINE_AUTHORING: validate stable scene/response IDs and route consumers; avoid copying source code.

## A08: covered

Bounded stats, inclusive integer random draws, stress gates, color thresholds and upward merit cap 50. Actual study label overwrites helper result with another draw. Matching charm halves MP cost rounded up. Sample exam results are outcome branches. Full combat balance unread.

Evidence: `game/classes.rpy:classroll, study_roll, do_study_roll`; `modules/wolfhall.py:Spell.Cost`; `game/wolfhall.rpy:gain_merits`. Shown in code or reconstructed scripts; UI experience and design takeaway are inferred.

PROPOSAL: SKILLS_AND_TALENTS: publish actual cost/gain and avoid hidden redundant RNG; keep competence separate from preparation.

## A09: covered

Five weekday plan entries plus authored weekend/date scenes and lock entries. Dungeon actions use timers and local ticks. No wall-clock offline catch-up demonstrated. Date helpers manipulate calendar explicitly.

Evidence: `game/wolfhall.rpy:standard_scheduler`; `game/classes.rpy:pop_next_activity, date_add`; `game/week35.rpy`; `game/spells.rpy:cast_spell`. Shown in code or reconstructed scripts; UI experience and design takeaway are inferred.

PROPOSAL: ENGINE_EXPANSION: preserve paid queue order; do not adopt calendar lockouts as universal idle rules.

## A10: covered

Intro requires scheduling each color once; lessons display spell cards, then early exam uses actual learned tools. Later spells depend on stat thresholds and class sources.

Evidence: `game/week1.rpy:intro_scheduler`; `game/classes.rpy:red_intro, learnt_breeze`; `game/week4.rpy:first exam flow`. Shown in code or reconstructed scripts; UI experience and design takeaway are inferred.

PROPOSAL: P03: teach a method, then provide a real useful application; do not equate high stats with acquired knowledge.

## A11: covered

Gain/failure sound cues, stat readout animation, sorted spell cards, contextual effect tabs, date recaps and a remembered surrender intervention. These are source signals, not observed audiovisual quality.

Evidence: `game/classes.rpy:gain_smart, gain_stress`; `game/spells.rpy:spellbook_core`; `game/week4.rpy:exam1_give_up`; `game/diary.rpy`. Shown in code or reconstructed scripts; UI experience and design takeaway are inferred.

PROPOSAL: UI and DIALOGUE_AND_INTERACTIONS: pair receipts with next actions and keep recaps consequence-aware.

## A12: partial

Equipment, inventory, money, merit, achievements, cosmetics and yearbook are present. Their full economy, achievement conditions and online/version features were not audited. No general ownership/title ledger demonstrated.

Evidence: `game/trophies.rpy`; `game/yearbook.rpy`; `game/wolfhall.rpy:inventory, gain_merits`; `modules/wolfhall.py:MagicalDiaryCharacter`. Shown in code or reconstructed scripts; UI experience and design takeaway are inferred.

PROPOSAL: TECHNOLOGY_AND_PROGRESSION: use equipped means separately from permanent knowledge; park broad economy adoption.
