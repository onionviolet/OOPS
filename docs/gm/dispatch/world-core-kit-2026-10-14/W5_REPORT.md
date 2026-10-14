# W5 report: knowledge, canon course, crossings and endings

## CHECKPOINT

2026-10-14. Documentation lane complete. Wrote only the two assigned files;
no gameplay edits, tests, builds, bundle/save/private-pack changes, sealed-file
reads, staging, commits or pushes. Later source qualification and playable
acceptance remain open; they are not unfinished W5 implementation work.

Output: [W5 world cards](../../../worlds/world-core-kit-2026-10-14/W5_KNOWLEDGE_CANON_CROSSING_END.md).
Authority: [COMMON](COMMON.md), [root palette](../../../worlds/WORLD_CORE_KIT_2026-10-14.md)
and the live PROJECT/USER_VISION direction. Other lanes and root palette stayed
read-only. Existing dirty/staged/untracked workspace state was inspected and
preserved. This report was written after the world-card draft and its first
content checks.

## What was written

| Code | Delivered documentation |
|---|---|
| W5-F1 | Pre-W5 K11/K12/K15/K16 floor matrix with bounded-inspection definitions and owner pointers for all 14 priority worlds, paused A Soldier's Life and Original Frontier. Missing/partial is not a universal absence claim or a gameplay score. |
| W5-F2 | Per-world starter-trio actor/player/world knowledge envelopes, native appraisal channel, foreknowledge confidence and plausible wrong readings. Existing part 12 trios reused; later worlds get explicitly proposed trios. Secrets appear as proposed unallocated IDs and routes only. |
| W5-F3 | 3–4 event rows per priority card, with relative/datelimited clock, abstention and small local situations. TTKS has three event templates per selected sub-book across five distinct clocks; Frontier has three original design events. Source gaps are explicit, especially detailed D&D/Fate scene clocks and public-safe Soldier canon binding. One native quest-generator shape per world, with actual issuer/means rather than omniscient free rewards. |
| W5-F4 | Per-world carry-in/out tables, dormant/support gates, differentiated outlier reactions and native cheat paths linked to part 13 acquisition codes. Closure, source/review frontier, ordinary continuing life and succession remain distinct. |
| W5-F5 | A new consideration round in each world, 12 cross-world angles extending K11/K12/K15/K16, and three ranked next suggestions. One-line routing only for Fallout, Skyrim and Elden Ring. |

No pilot graphs or private prose were copied. Proposed event selection does not
change the graphs, register starts, implement NPC planning or select a new death
or browser-closed clock policy.

## Sources read and limits

| Code | Read / inspected source set | Use and boundary |
|---|---|---|
| W5-SRC1 | COMMON first, root palette second; AGENTS.md, PROJECT.md top/Standing priorities, `~/.claude/user-preferences.md`, relevant USER_VISION text | Current authority and exact file scope. Quick memory registry lookup used only to route live-owner recovery, not as world lore or current runtime truth. |
| W5-SRC2 | Canon dispatch COMMON; pilot-mol/LESSONS.md and pilot-fv/LESSONS.md | Occurrence versus receipt/belief, source precision, finite substitutions, fixed-law restraint, reset scope and receipt identity. Their tested module belongs to their named other worktree, not this checkout. |
| W5-SRC3 | World-depth parts 12 and 13, relevant rows/sections; part 06 cross-world considerations; part 22 feature/cheat distinctions | Existing trios, acquisition routes, carried knowledge, ordinary generator versus System reward. These owners are proposals, not source laws. |
| W5-SRC4 | HP brief/ledger; D&D source contract/FIRST_SLICE; MoL brief; Paradise brief and canon-priority plan; bounded sections of JJK/Bleach/Naruto/FMA briefs, campaigns and ledgers | Existing design scope, qualified mechanical claims, absence/return limits, attribution/edition splits and candidate floors. Selected excerpts/searches are not full rereads of every long campaign. |
| W5-SRC5 | TTKS FINDINGS including effective Addendum 3; private B1–B5 DEEP_DIVE rules/source sections | Later supplied full-text summaries supersede historical metadata-only limits. Book-specific copying, ownership, inspection, loop and settlement contracts remain separate. No new raw-book reading or acquisition. |
| W5-SRC6 | Private LOTM TIMELINE opening/onboarding/source development; CoI TIMELINE dated anchors/clocks/discrepancies; Shadow Slave TIMELINE opening and reviewed early arc pointers | Attributed claim/chapter/member locators and explicit source limits, not rereading whole novels. No sealed files opened. |
| W5-SRC7 | Wiki digests for LOTM, Shadow Slave, Paradise, Fate, HxH and bounded FMA references | Blocked/unavailable digests remain source gaps. Shadow's acquired archive is historical/retired. Fate/HxH selected revision claims are secondary, not primary full canon. |
| W5-SRC8 | Frontier TIMELINE_AND_ENDINGS and relevant campaign routing; live world_knowledge, people_knowledge, capabilities, life_experience_host and book_world_mol_state sections | Current bounded source seams, with file/line locators. No runtime test or source-wide audit. |

Live web qualification is cited directly in the cards: official HP Sirius and
Triwizard summaries; official JJK episodes 32–34; official Naruto pages for Waves,
exam arrival and episode 72; official Brotherhood episodes 3 and 8; D&D Beyond
Lost Mine contents and its separately identified expanded-adventure guide.
Secondary Fate route overview, Hunterpedia arc overview and FMA Promised Day
page supply qualified leads. Search results alone were not treated as primary
chapter reads. FMA case-page fetch failures switched to official adaptation
synopses. The unavailable Fate official-story page was not retried through URL
variants; the secondary route source remains explicitly qualified.

## Corrections and disagreements preserved

| Code | Evidence tension and treatment |
|---|---|
| W5-R1 | TTKS's earlier metadata-only limit versus later supplied full-text addendum: use the effective later findings, preserve historical source limits as dated history. |
| W5-R2 | Part 13 EW33's generic Shadow Slave Name/command recap versus private holder-specific bond distinctions: report both; do not propose universal command authority from title knowledge. |
| W5-R3 | CoI March/April anchors and uncertain final frame; FMA conflicting energy accounts; Paradise Chinese/MTL trial-failure sanctions: retain both attributed readings, with no invented resolution. |
| W5-R4 | Pilot tested metadata account versus newer dispatch v2 proposal; anchor module absent in this checkout: describe evidence stages/worktrees separately, with no integrated gameplay claim. |
| W5-R5 | Naruto episode 12 title names bridge combat but its official synopsis covers training/meeting: corrected draft's episode number and retained the title/synopsis mismatch. No claim of a full scene read. |

## Checks run

V1: Python structural check found every priority/Soldier card has K11.7,
K12.7, K15.5, K16.4, a route-only proposed secret ID, generator and further
considerations. Manual readback checked the short Frontier card separately.
There are 48 individually numbered event rows, plus five three-event TTKS
sub-clocks and three Frontier design events. These are floor proposals with
mixed source qualification, not 66 verified canonical events.

V2: Table-width scan found no inconsistent Markdown column counts. Style scan
found no em dash or spaced double dash. Relative-link target check passed after
report creation; private links depend on the existing ignored local dossiers,
not a bundled source corpus. External HTTP checks are the bounded web reads,
not a claim that every linked page will always stay available.

V3: `git diff --check` scoped to the two task paths reported no errors; a direct
whitespace check also checked the new untracked files, which plain git diff
otherwise omits. Final task-path status is two untracked outputs. Only these
files were created by W5. Source/gameplay/browser/save/director acceptance was
not run or claimed, as required by COMMON.

## Open questions for later selected work

| Code | Ranked source/design qualification, not a request to repeat standing preferences |
|---|---|
| W5-Q1 | Select exact school-year/adventure/route/chapter snapshot and qualify event windows before claiming a canon clock floor. D&D contents support units but not full causal scenes; Fate route outline still needs selected scene locators. |
| W5-Q2 | Bind each proposed opaque secret ID in the relevant sealed owner, with actual discoverable route and spoiler-safe views. W5 created no truth records or approved secret IDs. |
| W5-Q3 | Qualify crossing source/fuel/authority and reset-retention by actual edge. B3 submission, B2 settlement, CoI reset and ordinary physical departure cannot share one implicit export rule. |
| W5-Q4 | Qualify succession by actual carrier, executor and consent. A record/estate/office transfer does not prove inherited faculty, contract status or copied person. |
| W5-Q5 | Later implementation owns desktop rebuilt play, persistence/import and director acceptance for the chosen slice. This lane changes no priority, save semantics, offline policy, milestone scope or paused-world status. |
