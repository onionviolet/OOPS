# ER15 report: cheat-to-engine capability matrix

## CHECKPOINT

Complete as a documentation/source audit on 2026-10-14. No implementation, gameplay completion or director acceptance claimed. Owned outputs only: this report and [capability matrix](../../../../research/CHEAT_ENGINE_CAPABILITY_MATRIX_2026-10-14.md). Root palette, source, tests, build outputs, saves and private packs stayed read-only. No file named SECRETS was opened. Resume by refreshing live source and root O–Q; select one bounded slice before creating runtime work.

## Files written

| Code | File | Contents |
| --- | --- | --- |
| ER15-R1 | [CHEAT_ENGINE_CAPABILITY_MATRIX_2026-10-14.md](../../../../research/CHEAT_ENGINE_CAPABILITY_MATRIX_2026-10-14.md) | 103 main rows across 49 base families, CT1–CT18, SH1–SH18 and 18 distinct named mechanisms; ten N/H/none foundation columns and current READ file:line support. Separate 18-row CX crosswalk, eight engine-facing additions, seven named-variant obligations, effort ranking and bounded implementable-now slices. |
| ER15-R2 | REPORT.md | Scope, checks, command record and open gates. |

## Findings for root synthesis

| Code | Finding | Root codes informed |
| --- | --- | --- |
| ER15-F3 | Current native named RNG consumers supersede older blanket unseeded-native claims. Key/ordinal/salt and retained resolved outcomes still matter; whole-game replay is unproven. | RT9, IM4, CX2/CX3, MC11 |
| ER15-F6 | Filtered read models have the best immediate cheat return per incremental effort. Single-clock ownership has the strongest temporal reach; full commands/snapshots belong to broad rewind/fork promises. Existing DA5 needs an executable hook bridge, not another inert card schema. | RT4, AI6/E9, DA5, SB5, RT5, LB3/DA2, IM1 |
| ER15-F5 | CX8's tier lens, CX13's runtime-load lens and CX18's pseudo-source lens are distinct additions within the requested owners. Fifteen other CX rows reuse or extend documented ideas; none is automatically implemented. | CX1–CX18 |
| ER15-F8 | Native encounter snapshot/restore and idle authored-site replacement exist in current source. These are partial support, not full historical snapshots, headless combat or arbitrary module reload. | LB3/DA2, OE3, SB4, RT9 |
| ER15-F9 | Proposed additions: snapshot diff, commit seal, boundary step, cursor ward, rule-version anchor, resumable dream thread, provenance compass and counterpart conflict sense. Candidate CX19–CX26 are local suggestions only; root palette was not edited. | RT4, E3/E8/E9, RT6/RT9, OE3, TS4, DA2/DA6 |

## Commands and evidence

READ commands, executed in this lane:

- `cat docs/gm/dispatch/engine-runtime-2026-10-14/COMMON.md`; `cat AGENTS.md PROJECT.md /Users/weiwei/.claude/user-preferences.md`; `git status --short`.
- `rg -n 'engine.runtime|cheat|palette' /Users/weiwei/.codex/memories/MEMORY.md` returned no match. No memory fact was used. `wc -l` inventoried the eight owners and required prior audits.
- `rg -n` heading/table and capability searches plus bounded `sed -n` reads across the eight named docs, USER_VISION, root palette and E/offline reports. Source inspection used `rg --files src`, explicit source paths, `cat`, `nl -ba`, and `sed`. Any broad source search excluded `SECRETS*`; no private pack or save contents were read.
- `python3 /tmp/er15_matrix.py` generated the main matrix in its owned output; a follow-up Python tally counted N/H dependencies for all 103 rows and the first 49. A shell heredoc added the CX/effort/today/addition sections and this report. Scratch script is in `/tmp`, not a repo runtime path.
- Python static checks resolved relative links/heading anchors and source line ranges, checked ten-column matrix widths, 103 main rows, 18 CX rows and eight additions, and rejected em dashes and spaced double hyphens. Final result recorded below.

These are READ/document checks, not runtime measurements. Dependency counts are deterministic table tallies, not benchmark data. No tests, build, install, server, browser, commit, push or gameplay commands were run.

Some exploratory commands named absent files (`src/traders.js`, `src/realm_host.js`, `src/containers.js`, `src/knowledge.js`), and one zsh glob `src/procgen*.js` had no match. They changed nothing; actual owners were found through `rg --files` and explicit paths. Long tool output was sometimes truncated; substantive claims use targeted source reads, not unseen portions of that output. Initial link validation found only the not-yet-written REPORT link; it was resolved by writing this file.

## Open questions and acceptance

No user answer is required to finish ER15. Selection of the next cheat/world, grade, time policy, carried scope and horizon remains a design decision. Every new state owner needs migration or an explicit compatibility choice. Root/other lanes can absorb this analysis without treating proposals as new authority.

The open playable gate belongs to the selected future slice: rebuild, use a fresh desktop/laptop test origin, exercise its actual changed behavior and persistence via save/reload/literal import, including failure and retention boundaries. No native acceptance was attempted here. Existing implementation and human acceptance states stay distinct. No sealed truth, secret selection or personal save was disclosed.

Final documentation verification: **READ/static check passed**, 334 local links/anchors/line ranges valid, zero errors; 103 + 18 + 8 matrix row counts and ten foundation columns passed; style check passed. No runtime test result implied.
