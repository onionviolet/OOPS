# K5 report: continuity mechanics, 2026-10-14

Status: research and document verification complete. Proposals are not
accepted design, registered worlds or implemented gameplay.

## K5-O1. Written and scope preserved

Created [CONTINUITY_MECHANICS.md](CONTINUITY_MECHANICS.md) and this report,
the exact two assigned owners. The main file contains a checkpoint, seven
requested event boundaries, six deliberately selected return cases, three
handover cases, measured category counts, seven source tensions, CA5/CI3,
CI4/CK10, CA9/CA10 mappings and CO5 player-impact dials. All 21 assigned root
rows have a status and integration note in its K5-R table.

Root palette and existing owners are linked, not edited. No source, tests,
bundles, saves, private packs, commits or pushes. Existing dirty/staged work
and active neighboring lanes were preserved on `codex/gameplay-foundations`.
No subagents or foreground computer control were used.

## K5-O2. Sources read and retrieval evidence

Read COMMON first, then AGENTS, PROJECT, user preferences, GM prompt,
the pilot/target reports, root palette and the three required owners:
[lore](../../../worlds/LORE_AND_CONTINUITY.md),
[timelines](../../../TIMELINES_AND_DIVERGENCE.md) and
[multiverse](../../../worlds/MULTIVERSE_STRUCTURES.md).
Checked relevant USER_VISION direction. A quick memory lookup only routed
ownership recovery; live files established this tranche's actual authority.

Live MediaWiki API inspection used the existing
[helper](../../../research/comics/fetch_wiki.py), sequential requests and its
0.4-second delay. [K5-S source ledger](CONTINUITY_MECHANICS.md#k5-s-source-ledger-and-retrieval-limits)
links all 19 articles with observed revision IDs and inspected sections:
Marvel Sliding Timescale, Secret Wars, Earth-1610, Earth-6160, Jean Grey,
Bucky, One More Day and One Moment in Time; DC Crisis on Infinite Earths,
Zero Hour, Flashpoint timeline/event, New 52, Rebirth, Jason Todd in two
continuities, Superman, Green Lantern: Rebirth and Wally West.
Four category page counts were measured using `categoryinfo.pages`.

Publisher corroboration, fetched or indexed official text: DC multiverse
history, Zero Hour explanation, New 52 exceptions, Batman/Red Hood profiles,
Return of Superman collection, June 2016 Rebirth news, September 2025 Q&A
and November 2023 Q&A; Marvel Secret Wars/Spider-Verse guides, Maker article,
X-Men history, Bitter March #1 and Earth-6160 Iron Lad profile. Main-file
claims carry the direct URLs. Wiki issue citations remain STATED secondary
accounts; no comic issue, scan or full franchise was read.

Limit recorded: direct publisher opens failed for the DC exceptions article
and Marvel guide, so indexed official text and the successful API route
supplied evidence. The attempted Rebirth issue wiki title was missing;
publisher accounts supplied the evidence. No missing result is counted as
a successful article read.

## K5-O3. Root rows confirmed, corrected or still inferred

| Code | Readback |
|---|---|
| K5-RC1 | CONFIRMED bounded premises: CL2 sliding chronology, CL5 selective crises/reboots, CO4 snapshot/identity discipline. CL14 cancellation is confirmed as publishing practice; CL15 era labels are confirmed as labels. |
| K5-RC2 | CORRECTED: CL1 automatic/universal pull, CL3 category ratio as revival rate, CL4 every retcon deleting the old fact, CL6 every local story participating, CL13 every AU changing only one variable, CA9 counterparts being the same actual person. |
| K5-RC3 | CORRECTED or UNVERIFIED claims: CO2 a declared law resolving contradictions; CO3 the comparative “best/most” claim and universal portability; CL14 publication cancellation implying world destruction; CL15 universal era death/science rates. |
| K5-RC4 | Remain INFERRED proposals with source-supported use cases: CK8, CK10, CK11, CO5, CI3, CI4, CA5 and CA10. These were not promoted to source facts or implemented capabilities. |

The main K5-R table treats each row separately. Seven tensions remain visible
both ways: Batman exemption versus origin revision, staged Crisis memory,
Barry versus later Manhattan causation, Ultimate destruction versus later
restoration/new continuity, Jason's revival versus healing, Jean/Phoenix
identity revisions and competing definitions of reboot.

## K5-I. Five useful additions for the root palette

| Code | Addition | Root use |
|---|---|---|
| K5-I1 | Use a typed change operation: causal recovery, belief edit, historical revision, body revival, identity transplant, merge or fork. Similar final appearances do not imply identical history. | CL1/CL4/CL5, CA5 |
| K5-I2 | Facts need both in-world applicability and recorded revision time, with per-observer memory retention/awakening. A retroactive fact does not share one useful valid-from date with its publication. | CI3/CA5, CK8/CK11 |
| K5-I3 | Homeostasis schedules eligible actors and causes, rather than copying a baseline over played state. Protect ordinary earned divergence by default; anchors can extend protection into selected hostile rewrite domains. | CI4/CK10/CO5 |
| K5-I4 | A predecessor's return can create co-holders, a changed institution or a contested office. Preserve the successor's actual tenure, learned methods and reputation across the role change. | Legacy integration, CA9 |
| K5-I5 | Keep reboot survival manifests per participant: actual identity, retained body/claims, memory, local clock and dependent obligations. A shared event ID or franchise label is not a migration. | CA9/CA10, CL5/CL6 |

These are considerations for a later selected slice. K6 owns engine-fit
inspection. Default + Dial + Reasonably choices are in the main file; this
report creates no second specification or required implementation gate.

## K5-O4. Checks and remaining gates

Document verification passed: both files read back by the checker; 15 local
Markdown targets/anchors resolve, 119 table lines have consistent structure,
all 21 assigned root rows occur in the expected order, and punctuation and
whitespace checks pass. No unit, build, browser, save, reload or import check is
appropriate to this research-only edit, and none was run.

Research limits: exhaustive issue-level survivor/memory rosters and a valid
death-event frequency denominator remain unverified. Source contradictions
are recorded rather than silently reconciled into one latest canon. All new
mechanics await selection/acceptance. Any selected runtime slice would need
its own concrete compatibility and rebuilt gameplay/persistence proof.

Input snapshots read for reconciliation, SHA-256:

| Owner | Hash |
|---|---|
| Root palette | `f39b3101381b330af0dc94ac64d49326f7909f8938f62a767e93b755d97af8e2` |
| Lore and continuity | `1a3b260a1cdf2526fcc1a327c8afb5a6e2a93b82244d08c7fac246074846afc4` |
| Timelines and divergence | `ddbd89552dc53a8f830b2f43c65fcc4f639c23aca450c3e99440152f9d1588ee` |
| Multiverse structures | `de806e3c68687f185597b8083e9e3e15efcaccd6ae5e3589972b558a07464ecd` |

Handoff: root integrator reviews this bounded research and updates its own
palette if useful. K5 releases the two file areas with document checks passed;
it has no pending source request, worker or runtime operation.
