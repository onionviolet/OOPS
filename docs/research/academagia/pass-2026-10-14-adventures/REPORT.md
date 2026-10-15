# Academagia adventure and club pass, 2026-10-14

The shipped adventures are linked stages with gates on entry, investigation, choice and continuation. This pass mechanically maps every Adventure in base and both separate patch unions, including success/failure links, checks, rewards and downstream actions. It maps all 44 explicitly club-named stages and 176 club choices. The runtime merge algorithm is now source-traced.

**Status: PARTIAL.** The complete mechanical map is delivered. Manual paraphrases of every non-club narrative branch, a census of clubs with other authoring names and the 258-page wiki crosswalk remain open. Actual selected profile, runtime cache bytes and gameplay reachability remain unverified. No game launch, assembly execution, save/cache access, bottle or installation edit, implementation, install, Git staging/commit/push or agent delegation occurred.

| Finding | Result | Evidence |
|---|---|---|
| F1 / full mechanical census | Base 1,555 stages / 237 roots; source-compatible Content 3,022 / 383; Summer 3,030 / 384. Summer has 1,632 investigation choices, 7,856 exit choices and 11,503 non-null outcome links | [Grammar](ADVENTURE_GRAMMAR.md), [counts](COUNTS.json), ROOTS files and compressed analysis ledgers |
| F2 / clubs | Bookworms: 24 stages, 78 exits, 18 investigations. Rimbal Supporters: 20 stages, 71 exits, 9 investigations. Success and failure often converge with different effects; Bookworms has loops and skips | [Club paths](CLUB_PATHS.md), [mechanical map](CLUB_PATHS.json) |
| F3 / entrance correction | Bookworms needs Library Knowledge child skill ≥2, not Research parent level ≥2. Joining grants a useful sorting job. Rimbal begins under a date-range gate | Club paths; selection XML, numeric/date checkers |
| F4 / rewards | Benefit threshold tests maximum roll power independently of the exit check; zero threshold applies without that power test. An unlocked action is distinct from a stat gain | StorySystem.ApplyBenefits and auxiliary action definitions |
| F5 / timing and dormant fields | Context duration is absent from the inspected end-date calculation; GetComplications returns no complications despite authored fields | Grammar; StorySystem.CalculateContinuanceDate/GetComplications |
| F6 / patch semantics | Modified bodies overwrite serialized fields on existing entities, new IDs append, selected mods merge in input order, resources overwrite. Shipped List<Guid> deletions are ignored by a reader that accepts string[] | [Patch merging](PATCH_MERGING.md) |

Evidence labels: **shown** for inspected code and shipped fields; **inferred** for reconstructed profiles, graph counts and scene paraphrases; **proposal** for YAIRPG changes. Source-compatible does not mean a launched or selected cache. The game remains Steam 533480, prior recorded build 2453605; original installed payload was not re-extracted or independently rehashed in this lane. Input extracted files were hashed afresh.

## Ranked PROPOSALS

| Rank/code | Proposal | Owner and purpose |
|---|---|---|
| 1 / P1 | Give institutions paths made of earned work, people, incidents and usable rewards | `docs/CHARACTERS_AND_WORLD_EVENTS.md`, school-world design; club access should open real activities |
| 2 / P2 | Let failures keep a story moving while changing cost, knowledge, relationships or later approach | `docs/ENGINE_EXPANSION.md`, world campaign owners; preserve causality without making every failed roll a dead end |
| 3 / P3 | Author multiple useful skill approaches per problem, with explicit companion contribution | `docs/worlds/ABILITY_AUTHORING.md`, character/party owners; expand reasonable choices instead of inventing one required stat |
| 4 / P4 | Keep an earned-access ledger linking each unlock to its action consumer and acquisition route | ENGINE_EXPANSION, character and school owners; a membership fact should do something visible |
| 5 / P5 | Give pending story stages explicit start/end windows and a visible reschedule or revisit policy | ENGINE_EXPANSION, calendar/world event owners; explain opportunity changes and preserve idle plans |
| 6 / P6 | Compare and validate ordered content overlays before loading them | ENGINE_EXPANSION, world authoring owners; inspect stable IDs, replacement lists and deletion formats |
| 7 / P7 | Separate successful resolution from degree-dependent bonuses | ABILITY_AUTHORING, reward/advancement owners; a check can succeed while bonus learning differs |
| 8 / P8 | Show institution work, active story and companion expertise in separate desktop panels | `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`; target 1440×900 with the useful next action and consequences visible, mobile deferred |

These remain PROPOSALS. Preserve reasonable alternatives, source-specific repeat policies and open/director-enabled routes; do not adopt the source's exclusion policies as fixed once-only YAIRPG limits. Canon-first school/book worlds retain priority. No proposal modifies an owner or creates a required gate. Packets specify future reviewable slices and checks, not current implementation authorization.

## Prior-lane reconciliation

| Prior finding or gap | Verdict | This pass |
|---|---|---|
| D07 / 258 wiki pages versus engine adventure count | Confirm and extend | All mechanical stage records now mapped; root indexes replace a flat 258 assumption. Wiki crosswalk still absent |
| D15 / no universal Club table | Confirm and extend | Both club-named graphs mapped in full mechanically, with entrance selections and downstream job reward. Other-named organizations remain a separate gap |
| Bookworms comparator unresolved | Correct ambiguity | Library Knowledge child under Research is the selected skill; ≥2 applies to that child |
| D16 / deletion cast discrepancy | Clarify | Type test returns null for List<Guid>, rather than performing an unconditional invalid cast. No-deletion profiles are source-compatible; intended-deletion reconstructions stay separate |
| Runtime patch/cache route unread | Extend | Source trace covers ordered selection, base compatibility, body replacement, resource override and cache reuse; live runtime still unverified |
| General continuation duration description | Narrow | Authored duration cannot establish actual window duration in this build because CalculateContinuanceDate omits it |
| Authored complication hooks | Narrow | GetComplications returns an empty list in the inspected path; presence is not active behavior |

Coordinator owner edits proposed only: link this pass from prior CHECKPOINT; route accepted institutional paths and failure continuity ideas to existing school/character/world owners; preserve prior unrelated unread items and the gameplay gate. No main-checkout owner was edited.

## Checks and remaining gate

Passive validation checks counts against source record sets, every linked choice and continuation, map decompression/JSON parsing, club totals, parent-child entrance resolution, and exclusion of narrative fields. See [verification](VERIFICATION.json) and [tooling](TOOLING.md). All own artifacts and input hashes stay recorded in the work area.

The remaining research work is named in [CHECKPOINT.md](CHECKPOINT.md). Any later YAIRPG playable claim needs an authorized implementation, rebuild, fresh desktop browser behavior, save/reload/import for persistence changes and separate director acceptance. This report establishes none of those states.
