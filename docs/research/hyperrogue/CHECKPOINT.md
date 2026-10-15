# HyperRogue lane checkpoint

Status: PARTIAL

2026-10-14. Dispatch deliverables complete as a bounded static research snapshot. Whole-game and every-rule closure remain partial as listed below. A restart resumes from the named question, not from a fresh clone.

## Done

- D1: Read COMMON/ASPECTS, PROJECT top 80, relevant USER_VISION, world kit K1-K34 map and successor root, corrected nested-world dispatch, start/branch integration map and synthesis packets. Canon-first, desktop-first, one-realm first milestone and repeatable solo options preserved.
- D2: Shallow clone completed, clean, pin `c7c9a2993b43ee2f4bbac422e565d18fdd98f886`. Indexed all 95 LAND, 155 ITEM, 180 MONSTER and 121 WALL declarations. Full private source/tables and hashes retained.
- D3: Traced representative laws, candidate selection, typed borders, carried ledgers, orb generation/use/exit separation, Yendor, Hyperstone, Chaos, tactics, shmup, save/Safety and contextual help. Source-level OSM mismatch documented without runtime claim.
- D4: REPORT, FINDINGS, seven implementation proposals, 28 small touches, three system digests, tooling, all A01-A12, complete root module inventory and three deeper reads written. No owner-document or gameplay edits.

## Evidence and scope

SHOWN = static source inspected. STATED = declaration/help. INFERRED = proposed adaptation or apparent defect. No executable, build, network game code, native app, browser game, personal save, staging, commit or push. No YAIRPG behavior, UI or persistence gate closed. Remote repository/raw downloads were source acquisition only.

Primary report: [REPORT.md](REPORT.md). Source raw store: `/Users/weiwei/.codex/research/mw-hyperrogue/repos/hyperrogue/`. Full macro and land blocks: work-area `extract/content-tables.json`, `extract/lands-full.json`; checkout manifest `extract/SOURCE_HASHES.txt`; extraction hashes `extract/HASHES.txt`. Own rerun/validation scripts: `notes/`. This output directory is the only main-checkout write area.

## Unread and unverified table

| Gap | Exact next read or gate | Why still open |
|---|---|---|
| Every land's full runtime monster/power/terrain closure | Follow each LAND row through landgen/bigstuff/complex/complex2, passable, pcmove, monstermove and all orbs. Indexed locators are not read-body proof. | 95 declarations include numerous technical and experimental cases; this pass closes metadata and representative mechanisms, not every exception. |
| Full geometry and mode Cartesian product | land_validity, fix_land_structure_choice, all wall builders, custom list modifiers and optional CAP paths | Static core read only; not all tilings/build configurations traced. |
| All speech and rescue branches | complex.cpp:princess, complex2.cpp:camelot, language files and all callers | Conditional Camelot mechanism and rescue state located; not a complete text/quest audit. Full source remains private. |
| Full saves/migration/recovery | system.cpp applyBoxes and historical loads, mapstream/editor save, config and all restart consumers | Selected score/Safety path read; corruption, atomicity and all migrations unproven. No user saves touched. |
| Orb Strategy forbidden-history mismatch | inventory.cpp:678-688, complex.cpp:644; isolated runtime reproduction only if separately needed | Source appears to check previous tile item. No execution was needed for this research; runtime impact remains unverified. |
| Remaining discovered subsystems | Every inventory row marked unread, including optional devmods/rogueviz/platform modules | Catalogued for routing, outside the four deep questions. |
| Visual feel, balance and actual play | Optional source-game execution only with a concrete need and applicable authorization; later YAIRPG fresh rebuilt desktop and persistence gates | Static-only assignment. No build needed for reported source mechanisms. |

Next pending item: coordinator reviews HR-P1/HR-P2/HR-P3 for an existing selected slice. There is no selected implementation and no automatic continuation into runtime changes. For deeper source work, choose one unread row and retain the same pin.

Disk at final inspection: work area about 229 MiB, including clone; output about 180 KiB. No installs. Main checkout observed branch `codex/gameplay-foundations`; unrelated concurrent dirty state preserved.

Checks run: own static validation of required outputs, JSON parsing, all twelve aspect keys/status shapes, 95 unique census rows, source declaration counts, 7 proposal IDs, 28 touches, root C++ inventory coverage, pinned source links/line bounds, local Markdown links, plain punctuation and clean private clone. Result recorded in `notes/validation.json`; no game tests ran.
