# Dwarf Fortress: independent emergence and cleanup audit

Status: PARTIAL. Research only, 2026-10-15. Five selected rule chains are decoded below; native execution and most catalog content remain unread. This audit owns only `emergence-2026-10-15/audit/`. It does not replace the existing dossier or the live aspect pass.

The useful pattern is a chain of compatible rules: an actor or material changes state, that state opens or blocks a later capability, and later actions can change the world again. The shipped data and Lua expose substantial pieces of those chains. They do not expose the native decision maker, effect scheduler or rollback machinery. In particular, several named lieutenant powers are visible definitions but are not selected by the shown ordinary-Lua table traversal.

Source is the sibling's retained [extraction](../extraction/REPORT.md), from the current Steam payload. Build 24557528 matches the prior dossier. Native executable hash is `205770918fd54c96cbbcf89223ebd449e2e113c7c873ed81177c4511a3450db7`. Readable files are supplied Lua/raw definitions, not decompiled C++. No native disassembly was performed by this auditor. Exact file paths, SHA256 and reviewed line windows are in [READ_COVERAGE.json](READ_COVERAGE.json). Full retained definitions are at `/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/readable/`.

## Audited chains

| Code | Rule → state → perception/decision → world feedback | What is actually established | Consumer still missing |
|---|---|---|---|
| DF-EM01 | Curse → blood-bound interaction → another eligible blood-bearing learner → further transformed actor | Self-referencing ingestion/injection interaction, exclusions, tag changes and visibility declarations | Material transfer, dose, hidden identity, AI and removal |
| DF-EM02 | Disturb corpse → raised actor with powers → actual disturber target or nearby corpse → changed scene and further actors | Separate resurrection/animation gates, targeted retaliation, multiple granted action definitions | Disturber tracking, corpse consumption, action selection and death transition |
| DF-EM03 | Region emits material → route/anatomy-specific syndrome → different bodily capabilities → possible later eligibility | Material state, four exposure declarations, optional end times, weekly region declarations | Exposure/shelter, dosage, physical transport and syndrome engine |
| DF-EM04 | Crop/material conversion → container/media/seed items → funded future production and eligible learning → changed capability access | Exact reaction joins, preservation flags, writing/artifact transfer and secret-learning declarations | Job execution/cancel, writing, reading, teaching and knowledge correctness |
| DF-EM05 | Temporary body/luck, permanent curse, timed summons or healing → distinct altered state → later capabilities → distinct cleanup needs | Separate end/duration declarations and twelve healing channels | Native expiration, body/item reconciliation, summon destruction and cure semantics |

Detailed decoded steps, combinations, NPC qualifications and cleanup limits are in [CHAIN_DETAILS.md](CHAIN_DETAILS.md). [FINDINGS.json](FINDINGS.json) stores the six findings with precise source windows. [UNREAD.json](UNREAD.json) enumerates all 393 readable files with this audit's actual read/unread spans, plus native consumer gaps. Capturing a file is not credit for reading it.

## Corrections and extensions to prior research

| Prior position | Audit disposition |
|---|---|
| Prior dossier said native C++ engine unrecovered | Confirmed. Current same executable pin does not create source-level engine knowledge. |
| Prior dossier called generated powers and altered-body behavior declarations | Confirmed, with stronger availability qualification in DF-EM06. |
| Prior dossier described disturbance actor-specific targeting | Extended: the curse is disturber-only, but animation and intelligent resurrection have broader LOS targets and different ranges. |
| Prior dossier separated ordinary needs from curse capabilities | Extended: blood-bound transmission, temporary versus indefinite effects, anatomy and healing have separate cleanup contracts. |
| Prior dossier preserved writing through book binding | Confirmed at reaction declaration level; no native writing/reading/copying execution was recovered. |

DF-EM06 is a static reachability concern. `interactions.powers` has named `ice`, `vanish`, `propel`, `fog` fields. `basic_lieutenant_powers` traverses it with `ipairs`. No shipped Lua conversion to numeric entries or iterator override was found by recursive text search. Under ordinary Lua, this traversal sees none of those fields. Retry can still terminate when curse count becomes nonzero. The separate `add_curses(num<1)` early return would overwrite assigned tables with nil only in a branch that exits with powers and zero curses, such as after a mod adds numeric power entries. Neither issue is a reproduced native failure. Do not conclude that the retail game cannot generate powers through some other route.

## Ranked proposals, not accepted changes

| Code | Proposal | Existing owner area | Why it earns further consideration |
|---|---|---|---|
| P1 | Record a cleanup contract for each selected transformation or temporary capability: source, affected state, end trigger, item/body consequences and retained knowledge. | E8 powers, body/effect owner | Prevents treating reversal, healing, source loss and actor deletion as the same operation. |
| P2 | Keep action capability, NPC information and NPC preference separate. | E7 observation, independent actors | A valid target/usage hint establishes an available action, not a decision or omniscience. |
| P3 | Link materials to actual reaction outputs and physical information media. | E4 materials, production/knowledge owners | Makes substitutions, finite stock and knowledge access combine through real objects. |
| P4 | Keep specific responsibility attached to retaliation and its later aftermath. | E3 relationships/institutions, causal endings | Avoids converting one actor's action into automatic hostility against every nearby person. |
| P5 | Track authoring availability independently from visible definition and captured source. | Research evidence and content validation | Named-map traversal shows why a readable power must still reach an actual producer and consumer. |

These proposals authorize no YAIRPG implementation or new acceptance gates. Current one-realm/one-prestige scope and existing owners remain authoritative.

## Verification and boundaries

Source windows and source hashes were checked independently against the frozen extraction; the extraction is also backed by the sibling's current-installed-byte comparison. Machine validation checks JSON, locator ranges, source existence/hashes, all-file unread accounting and local document links. No DF executable, Lua generator or native engine was run. No world or save was accessed. No YAIRPG source, runtime, canonical design or configuration changed; no build, gameplay, persistence, install, commit or push was performed.

The finite audit is saved, but the research is partial. Next useful work is a named native consumer question or a selected unread family, not another blind full-payload copy. [CHECKPOINT.md](CHECKPOINT.md) and [UNREAD.json](UNREAD.json) preserve that distinction.

Independent sibling review: all extraction RULE_TRACES prose was read; tissue healing/vascular fields, complete alcohol syndrome rows, dwarf dilution identifier, and pig-iron/steel reagent versus FUEL joins were directly spot-checked. Those checks found no overclaim in the bounded descriptions. The extraction sibling's entire selected source slice was not independently reread; this is a scoped review, not blanket semantic certification.
