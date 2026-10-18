# Remnant II: deeper static pass

Status: PARTIAL. 2026-10-15, installed Steam build 16320528. The AES gap is closed, the failed sample is almost entirely repaired, and the main quest-selection chain is now read in native code. No game, injector or Windows executable was run. No player save was opened.

## What each step reached

| Step | Result | Remaining boundary |
|---|---|---|
| D1, AES | A Python scan adapted from inspected public AESDumpster source recovered a candidate from the shipping executable. repak successfully decrypted both pak indexes. Config independently identifies internal build 453438. Key stays private. | No key or raw extract in the repo. This validates these archives, not every future build. |
| D2, mappings | Regenerated 7,552 native property lists from this executable, built a hybrid usmap, and implemented the native VariableValue serializer recovered with REA. | Hybrid retains 223 archive fallback types and 1,770 archive enum-label tables. One animation-notify record remains incompatible. |
| D3, native generation | Traced subquest chance, tag filters, usage limits, rarity weights, seed updates, saved failed-selection history, root-mode eligibility, root create/destroy and required-tile failure. Addresses and limits are in SYSTEMS. | Full spatial solver, every generator caller, complete reroll carrier settlement and failure recovery remain partial. |
| D4, wider systems | Clean reads for 749 selected gameplay/data packages, 20 world-menu packages and 20 rule/portal packages. Inspected the public save parser's source. | Static parse and reference integrity do not establish runtime reachability, balance or save recovery. |

## Before and after

For the **same 161 formerly failing packages**, clean packages rose from **0 to 160**. Export objects without a named/logged read error rose from **22,228/24,589 to 24,588/24,589**. This is a log-based read metric, not a claim that every decoded value is semantically correct. The remaining object is an audio-notify parameter record in one animation. No error was hidden or skipped to make these counts pass.

The additional 749-package pass has 34,818 exports, 58 DataTables with 911 rows, 223 CraftingRecipe exports, and all 127 selected EventTree assets. Those graphs contain 8,787 text-bearing dialogue nodes and 2,207 choice branches. **43,096 same-package references** passed export-index existence and terminal-name agreement. This does not test every branch's eligibility, termination or external reference.

## Ranked PROPOSALS

These refine existing packets; they do not dispatch implementation or change current slice priorities.

| Rank / code | Proposal | Owner / existing packet | Kit |
|---|---|---|---|
| 1 / R2D-P01 | A local rule changes a supported action and cleans up only its own temporary support on departure. Reuse the same carried method in two lawful local contexts. | MWA-P02; selected world law owner, RULES_FROM_SCRATCH, ABILITY_AUTHORING | K2/K5/K10/K13/K15 |
| 2 / R2D-P02 | Crossing terms separately quote the actual person, learned method, fuel, goods, quest custody, local obligations and destination instance. Keep the quote and settlement coherent. | MWA-P06; crossing/native persistence owners, MULTIVERSE_STRUCTURES | K4/K9/K11/K15/K18 |
| 3 / R2D-P03 | Generate a new identified visit from eligible content; preserve the history and changed state of an existing visit. Treat weights, exclusion and repeat support as authored policy. | MWA-P05/P09; selected instance/content owners | K4/K5/K12/K17/K18/K33/K34 |
| 4 / R2D-P04 | Dialogue commits an actual item or service effect, then retains the resulting variable and continuation. Source graph integrity is an author check, not player foreknowledge. | MWA-P04; existing staged narrative/native-host owner | K6/K11/K12/K23/K29 |
| 5 / R2D-P05 | Earned faculties, active slots, local usability and item custody remain separate. Use actual progression rows to explain an unlock rather than a decorative level. | MWA-P03; ability/means owner | K3/K9/K11/K15 |

Do not import the source's one-shot restrictions as universal YAIRPG limits. Keep reasonable repeat routes and accepted world-dependent means. Memory and the base cheat persist under OD2; the source's portable equipment framework does not override that direction. Any future selected UI packet follows UI_RULES at 1366×768 with the log intact; mobile remains deferred.

## Corrections to the first pass

| Code | First pass | New evidence |
|---|---|---|
| R2D-F01 | Pak index unread, no validated key | CLOSED for installed archives. Both indexes list successfully with the statically recovered key. |
| R2D-F02 | Public mappings unmatched; trinket, quest and unlock defaults partial | 205 compared native type layouts differ. Added fields explain many shifted reads. The exact failed slice is now 160/161 clean. |
| R2D-F03 | Selection weights and pity unread | Native rarity weights are 100/50/25/10/5 before history adjustment. Saved QuestFailCount multiplies eligible unselected entries' later weight; this is not an unconditional guaranteed drop. |
| R2D-F04 | Adventure tags seen, eligibility unread | Reflected root-mode listing filters root type, game mode, required award and prior one-shot roll state. DLC defaults separately carry entitlement references. Full entitlement enforcement across callers is still open. |
| R2D-F05 | Dialogue output retained but many records partial | Clean conditional graph reads and local reference integrity now provide stronger authoring evidence. External reachability and gameplay effects remain unplayed. |
| R2D-F06 | Overlapping-container precedence unaudited | The complete IoStore export-path census has zero paths present in both containers. The paks contain no .uasset entries. There is no duplicate asset winner to resolve in this observed payload. |

The first dossier is unchanged except its checkpoint's one-line pointer. Full text, table rows, decoded scripts, native pseudocode, hashes, source revisions and mapping inputs remain in `~/.codex/research/mw-remnant2/deep/`. The key is private there. [SYSTEMS](SYSTEMS.md) owns the detailed findings, [TOOLING](TOOLING.md) the repeat route, and [CHECKPOINT](CHECKPOINT.md) the exact remaining gaps. No gameplay or canonical-owner edit is proposed as already accepted.
