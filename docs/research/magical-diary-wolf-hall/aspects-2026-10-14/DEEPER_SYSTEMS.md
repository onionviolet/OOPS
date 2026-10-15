# Three systems with the highest remaining payoff

These were underdocumented in this lane's first feature pass. Findings remain source-only.

## MD-D1 Custom save identities and reconstruction

`nopickles.rpy` overrides `renpy.save`/`renpy.load`. The writer stores newline records under a b64z header in .whs files; the reader includes legacy UTF-16 header repair and decompresses before `nopickles.safeload`. It is not the generic RenPy zip/pickle format. Generic autosave is disabled by options and auto-1 is ignored at the writer.

`nopickles.py:safesave_serialize` serializes metadata and rollback history. `safeload` rebuilds contexts, call stacks, stores and scene lists, requires a rollback log, rejects duplicate store definitions, tracks started/played-in versions, then unfreezes at `_after_load`. No exhaustive migration chain proven. `sanitize_wh.serialize_known_spells` stores class names; `scrub_known_spells` resolves them to spell subclasses and warns/discards invalid entries. Its scheduler scrubber also logs a warning on the shown valid-dictionary path because the warning follows the conditional, an example where warning text alone does not prove invalid data.

PROPOSAL, ENGINE_EXPANSION: stable content identities, typed optional restoration and explicit version provenance matter as much as raw stats. Do not adopt source permissive/discard behavior without an explicit YAIRPG compatibility policy. Open: actual save roundtrip and every sanitizer/migration path.

## MD-D2 Dungeon creatures act through timed plans

`modules/wolfhall.py:Monster` has PotentialActions, Act and separate PlanAttack/PlanCastOn/PlanExplore/PlanPathfind methods. Exploration uses candidate destinations and knowledge-aware cost grids; PatrolDummy adds a constrained patrol pattern. This is distinct from human narrative schedules. The inherited `units` engine and unread pathfind/space modules mean the full timing/planning loop is only partly traced.

PROPOSAL, CHARACTERS_AND_WORLD_EVENTS: a companion can contribute an actual useful method while dialogue remains authored; do not claim life simulation merely from route flags. Open: exact action selection ordering, all rule exceptions and fairness across player/NPC knowledge.

## MD-D3 Outcome evidence becomes an institutional judgment

Sampled exams retain method and damage facts, then author separate credit, warning, injury bonus, demerit and detention responses. `exam5` can accept retrieval while awarding no magic merits; `exam7` can add credit for safe escort. `week22` remembers detention even when canceled. This is more useful than treating a pass bit as the whole event.

PROPOSAL, ENGINE_AUTHORING / P03/P04: retain actual outcome and institution response separately. Physical success should not silently stand in for learning, permission or reward eligibility. Open: every exam map solution, final group assessment and all cumulative-expulsion paths.
