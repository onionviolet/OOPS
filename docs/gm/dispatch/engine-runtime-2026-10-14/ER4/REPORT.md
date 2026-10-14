# ER4 report: idle and simulation engine references

## CHECKPOINT

Complete research-only lane, 2026-10-14. Main result: [IDLE_AND_SIM_ENGINE_REFERENCES_2026-10-14.md](../../../../research/IDLE_AND_SIM_ENGINE_REFERENCES_2026-10-14.md). Nineteen profiles cover all requested candidate groups and upstream, with the original Candy Box and Candy Box 2 separated. Every profile addresses tick, offline/background, big numbers, save/migration, LOD, determinism and UI. No adoption, runtime completion or release claimed.

Scope follows [COMMON.md](../COMMON.md). Root palette, gameplay source, tests, builds, saves and private packs were read-only. No files named SECRETS were opened. No personal saves, installs, commits, pushes or foreground computer control. No agent delegation needed. Relevant live PROJECT/USER_VISION direction remains unchanged: one-realm/one-prestige milestone, desktop/laptop first, and existing domain owners/policies retain authority.

## Findings for the root owner

| Code | Result | Absorption route |
| --- | --- | --- |
| ER4-F1 | Source references demonstrate coarser replay, batched replay, subsystem fast-forward and banked acceleration as distinct mechanisms. Exact equivalence is not assumed. | RT1/RT2/RT8/PF7, E5/E7 and OT2/OT10; ER4-N1 fidelity contract. |
| ER4-F2 | Worker timers in read Kittens/Evolve/Progress Knight code still drive page-side simulation. | PF7 versus TS4; distinguish timing from CPU isolation. |
| ER4-F3 | Factorio save/load continuation and per-tick CRC comparisons offer a stronger check than visible totals. Qud notes show event/serialization order is consequential. | RT9/DA4/CH4/CH7/OS5; ER4-N3 fingerprints and N8 restore dependency order. |
| ER4-F4 | DF/CDDA demonstrate abstraction and later materialization or selected elapsed updates. | RT7/DA2/DA6/E8/OT8; ER4-N5 identity/conservation contract. |
| ER4-F5 | AD broad magnitude, Kittens finite clamps and Trimps localized Decimal precision support different numeric choices per domain. | PF8 and earlier T8; ER4-N7 precision budget. |
| ER4-F6 | CK3 narrows expensive candidate work; HugsLib distributes periodic work. A due queue alone does not solve those costs. | RT4/RT6/RT7/PF1/PF2/PF6/OS6; ER4-N2 and N4. |

Recommendations are INFERRED proposals, ranked by value per effort in the main report. Leading bounded routes: one panel's dirty updates, one consumer's catch-up fidelity check, one job's save/load continuation comparison. Moving-world and bank-time mechanics remain product dials, not newly required gates. No root rows were edited.

## Files written

| Code | Path / purpose |
| --- | --- |
| ER4-A1 | `docs/research/IDLE_AND_SIM_ENGINE_REFERENCES_2026-10-14.md`: seven dimensions per profile, nine ranked lesson mappings, eight additional ideas and explicit evidence gaps. |
| ER4-A2 | This `ER4/REPORT.md`: completion, commands, constraints and unresolved questions. |
| ER4-A3 | `ER4/VERIFIED_SOURCE_REVISIONS.json`, `SOURCE_SHA256.json`, `VALIDATION.txt`: successful pinned revisions, source-byte hashes and document checks. |
| ER4-A4 | `ER4/sources/`: public source checkouts/subsets, first-party developer news/API bodies and historical posts. Scratch evidence only, not added runtime dependencies. |
| ER4-A5 | `ER4/write_report.py`, `validate_report.py`, initial `SOURCE_REVISIONS.json`: reproducible document assembly/checking and preserved first-route fetch failures. Use VERIFIED_SOURCE_REVISIONS for the successful evidence, not the initial attempt list. |

## Commands and source routes run

Working directory: `/Users/weiwei/code/yet-another-idle-rpg`.

| Code | Command / route | Result and limit |
| --- | --- | --- |
| ER4-C1 | `cat docs/gm/dispatch/engine-runtime-2026-10-14/COMMON.md`; reads of `AGENTS.md`, `PROJECT.md`, `~/.claude/user-preferences.md`, relevant `docs/USER_VISION.md`, root palette, E-review and offline audit; `git status --short`; `git remote -v`. | Recovered current scope/owners and dirty state. Large reads initially truncated; bounded follow-up reads covered the root palette, E-review and offline audit. No owner updates. |
| ER4-C2 | `rg -n 'engine\|runtime\|ER4' /Users/weiwei/.codex/memories/MEMORY.md`; read reference-scout skill. | No directly relevant engine reference evidence reused from memory. Skill used to bind comparisons to current gaps. |
| ER4-C3 | Python ThreadPoolExecutor ran `git clone --depth 1 https://github.com/<repo>.git <ER4/sources/id>` for initial public candidates; `git rev-parse HEAD` and `git remote get-url origin` for successful checkouts. | Four successful clones: Trimps, Progress Knight, Candy Box 2, upstream. AD/Kittens/Evolve/ADR clones failed transport; switched to API-pinned raw source. `omsi6/loops` was not the repository. Initial failures preserved. |
| ER4-C4 | Python `urllib.request` fetched GitHub `/repos/<repo>/commits/HEAD`, `/git/trees/<sha>?recursive=1` and `raw.githubusercontent.com/<repo>/<sha>/<path>` with 15/20-second timeouts; `rg -n`, `sed -n`, `cat` on targeted engine/save/UI files. | Verified source snapshots pinned in manifest. Correct Idle Loops source is `omsi6/omsi6.github.io` under `loops/`; Melvor source is official type declarations under `src/gameTypes/`. Missing guessed paths were resolved with tree discovery or left explicit. No runtime execution. |
| ER4-C5 | `web.run` searches/opens of primary developer/API pages; Python public URL fetches of developer posts and `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=<id>&count=100&maxlength=0&enddate=<epoch>`. CK3 used app 1158310/enddate 1760745600; NGU used app 1147690/enddate 1590192000. | Recovered CK3 diary 187 and NGU 4G patch notes through the structured Steam route after page extraction yielded boilerplate. Sources/dates are linked in each profile. Search snippets alone were not used as engine proof. |
| ER4-C6 | Official Cookie Clicker JS open and direct public fetch; then GitHub `ozh/cookieclicker` pinned source after direct 403. | Official bytes unavailable. Mirror identified explicitly, not promoted to current official release or an open-source license. Its active code was distinguished from commented rAF alternatives. |
| ER4-C7 | `python3 docs/gm/dispatch/engine-runtime-2026-10-14/ER4/write_report.py`; `python3 docs/gm/dispatch/engine-runtime-2026-10-14/ER4/validate_report.py`; `git diff --check -- docs/research/IDLE_AND_SIM_ENGINE_REFERENCES_2026-10-14.md docs/gm/dispatch/engine-runtime-2026-10-14/ER4`; direct document reads. | Static document/source-reference checks. See VALIDATION.txt. Not a game test, source performance benchmark, native journey or save roundtrip. |

The attempted targeted `kill 75251` found the initial clone had already exited. No process was terminated. Failed speculative file paths and fetches are route-discovery failures, not evidence that the game lacks a mechanism.

## Evidence limits and open questions

| Code | Open question | Closing evidence if a later adoption needs it |
| --- | --- | --- |
| ER4-Q1 | Closed-game internals: NGU, DF, RimWorld, Qud and CK3 do not have a complete seven-dimension source audit here. Unknown cells remain explicit. | Original developer code/docs or a bounded legal local artifact investigation, tied to the chosen mechanism. No community folklore relabeled as primary proof. |
| ER4-Q2 | Melvor official API declarations describe contracts, not executable current implementation. Cookie mirror-to-live-official equality is unverified. Public HEAD may differ from a deployed release. | Matching release bytes/revision or a bounded synthetic runtime probe. |
| ER4-Q3 | This repo's chosen adapter, numeric semantics, world LOD and bank-time policy are unselected. | Existing owner records the selected scope; synthetic source/threshold/failure evidence, rebuilt desktop journey and save/reload/import remain distinct gates. |

No gameplay gate is closed by this research report. No further ER4 work is required unless the root owner requests deeper evidence for a selected mechanism.
