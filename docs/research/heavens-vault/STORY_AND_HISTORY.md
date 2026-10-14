# Ink story and history

## F5: Authored story plus host state

SHOWN: `extract/csharp/StoryScript.cs` constructs an `Ink.Runtime.Story` from a Unity TextAsset. The shipped runtime declares current ink format 19 and minimum compatible 18. The open-source JSON format describes named containers, diverts, variable reads/writes, visit flags and lists. These are control structures, not a ready-made semantic history graph. [Ink format documentation](https://github.com/inkle/ink/blob/master/Documentation/ink_JSON_runtime_format.md).

SHOWN: host bindings expose physical presence, characters, artefacts, translation state, elapsed time and knowledge. `reached` checks knowledge-state lists; `recently`, `just_set` and rotating recent-state buckets distinguish newly acquired from old information. `viewedStateFrom` tracks reviewed knowledge for callbacks. Thus a later line can depend on what was learned and recently reviewed, rather than only the current room.

SHOWN: `Player::EstablishImplication` stores an output InkList with alternative source InkLists. `ProcessRecombinationsInKnowledgeModel` loops until no new implication can fire, reaches new knowledge via ink, and removes satisfied implications. This is a concrete small inference graph. It is authored logical recombination, not unrestricted natural-language reasoning. No cycle stress test was run.

## F6: The timeline is a read model with revision hooks

SHOWN: `TimelineDatabase` reads a JSON entries table. `TimelineEventData` has unlock, remove, confirm and notify state names, title/description functions, date, location, artefact, links, tags and an upgrade chain. `StoryScript` processes requested knowledge changes against these hooks.

SHOWN: `TimelineEvent` stores start/end times, uncertainty, fuzzy and ongoing flags, location/artefact references and inscription links. Unconfirmed card titles gain a question mark. Titles and descriptions can be refreshed through ink functions. `Player` holds known events, significant states and ongoing events; learning, confirming and forgetting are separate operations. Removal/confirmation can precede a later attempted reveal because significant state is retained.

INFERRED: this gives the player an evolving account of history, not an omniscient event log. The inspected schema and consumer do not prove a simulation that recomputes every historical cause. `linked` and upgrade IDs are authored relationships, not proof of a causal DAG. YAIRPG should retain the stricter occurrence-time versus reveal-time distinction in `docs/TIMELINES_AND_DIVERGENCE.md`.

## PROPOSAL: the smallest useful trial

An original maker's mark is encountered on two objects. The first supports two possible origins; a second independent source contradicts one. A notebook entry keeps the original attribution and source beside its correction. A merchant's response and one optional survey destination change. Ordinary travel and another useful livelihood remain possible throughout. This tests knowledge as useful progress without making a guessed label the universal plot key.

Route implementation through `docs/ENGINE_EXPANSION.md`, `docs/emergent/E7_OBSERVATION_AND_MYSTERY.md`, `docs/CHARACTERS_AND_WORLD_EVENTS.md` and `docs/TIMELINES_AND_DIVERGENCE.md`; do not treat this research as an accepted feature.

## Extracted story confirmation

SHOWN: TextAsset `sharedassets0.assets`, path ID 51, is valid compiled ink JSON format 19. Its root named-content dictionary has 3165 entries and its list definitions number 655. Static generic helpers `showing_uncertain_translation` and `note_learned_word` use the confidence/knowledge bindings described above. The 302-row timeline asset has actual unlock/remove/confirm fields, not only fields declared by C#. See [data census](DATA_CENSUS.md) for counts and coverage limits.
