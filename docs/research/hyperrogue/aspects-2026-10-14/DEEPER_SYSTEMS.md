# Three deeper systems by payoff

## DS1: a local law reads foreign causes

SHOWN: `complex.cpp:elec::getCharge` derives one of four categories from actual cell walls, creatures, player powers and local electric-land status. Barrier/chasm isolate; trees and many foreign cells ground; conductive local creatures can complete a path. The graph traversal in `elec::connect` keeps stack/low-link data to identify participating connections. `elec::affect` damages actors, transforms terrain and creates Fulgurite from named eligible causes. A killed conductive creature is not merely an enemy removed from a counter.

SHOWN comparison: `livecaves` uses a two-stage neighborhood calculation and later mutation. Corpses, item support, foreign undead, dragon parts, Digging and Empathy affect the balance. Local land/chaos exceptions prevent assuming one uniform rule across all borders. `environment.cpp:monstersTurn` establishes the ordering relative to actor moves and other environment updates.

INFERRED proposal HR-P1/HR-P3, K2/K5/K10/K13/K15/K29, P14/P15: author one local effect over actual native properties and one useful resulting command. Use existing staged plans; no electrical graph is required for a first textual scene. Acceptance must compare interior and border, include an ordinary alternative and retain the real consequence on revisit. This is the new HR-N1 edge leaf, not a new world engine.

## DS2: procedural identity has multiple mechanical readers

SHOWN: `complex.cpp:tortoise` stores adult and baby bit patterns separately, with a 21-bit mask, XOR differences and match-progress calculation. `landgen.cpp:1839` derives obstacle/environment details and adult identity from local bits. `items.cpp:229` moves the selected baby's actual bits into carried seek state and can exchange another baby without losing identity. `pcmove.cpp:811` requires an exact matching adult and no obstructing item; the action at `pcmove.cpp:1256` defers completion rewards to commit. Display readers use the same seek pattern and matching cues. The 2^21 variety count describes combinations, not authored quests or relationships.

SHOWN related system: `complex2.cpp:variant::features` has 21 feature records with color change, rate change, wanderer and a terrain/monster builder. `landgen.cpp:2616` applies selected bits to hazards and treasure rate. Appearance and practical danger share causes. Exact composition ordering and all combinations were not tested.

INFERRED proposal HR-P7, K1/K9/K11/K15/K30/K34, P15/P16: one stable property should survive movement, crossing, reload and content revision while supporting both an observable cue and a useful consumer. Keep source/seed/revision explicit and do not reroll on viewing. Reuse existing generation and item owners.

## DS3: hypothetical moves must not consume run state

SHOWN: `pcmove.cpp:changes_t` keeps rollback and commit callbacks. `init` snapshots nearby cells, kills, items, orb use and RNG. `value_keep`, `value_set` and `map_value` preserve earlier values; rollback restores them and discards commit callbacks. `LATE`/`at_commit` defer effects such as messages, rewards and some achievements. `checkmove.cpp` uses this infrastructure to ask whether an action would be legal. This matters in a game where one move can touch terrain, monsters, inventory and multiple orb powers.

SHOWN limitation: this is in-memory move rollback. No claim that every write in every optional module is tracked, or that callbacks provide atomic disk persistence. A direct assignment outside captured state can still be a defect. The Orb Strategy handler (`inventory.cpp:678-688`) restores a prior tile item after activation; the forbidden-history test calls getOLR on that prior item variable. Its warning text refers to the selected orb. `complex.cpp:644` consumes usedForbidden for the rescue achievement. This is an apparent source-level mismatch, with runtime consequence untested. Do not describe the flag as a verified complete enforcement route.

INFERRED proposal HR-P2/HR-P4, K14/K15/K18/K33, P04/P05/P24: preview should read the actual command plan without consuming fuel, rolling a new identity or granting knowledge; commit must recheck revisions through YAIRPG's existing durable publisher. Keep source checks and fresh native save/import gates distinct. No foreign transaction layer needs to be copied.
