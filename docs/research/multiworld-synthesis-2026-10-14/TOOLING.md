# Tooling and rerun

Read-only audit, 2026-10-15. No installs, clone, decompiler build, game launch, save access, staging, commit, push or external messaging. No subagents dispatched. Only assigned output directory and `~/.codex/research/mw-audit/` were written.

## Observed environment and sources

Checkout was `codex/gameplay-foundations`, HEAD `ba46670ae330cf28f56664cd0485d01eb2f1c072` when sampled, heavily dirty from other work. This is an observation, not a fixed checkout lock or current main assertion. No branch change or restore. Initial memory registry search had no matching task hits; no memory facts used.

Read COMMON/ASPECTS, PROJECT first 80 lines, both kit roots/topic map, actual nested-world dispatch path, start/branch integration map, existing synthesis REPORT/PACKETS, relevant USER_VISION including new OD2/4/5/6/7 and DIRECTION_SUMMARY/UI_RULES. Read all seven lane FINDINGS/reports/proposals/checkpoints plus 84 aspect cells and their inventories/deeper reads. This is a finite multiworld dispatch scope, not the later library additions (RimWorld, Naev, UQM and other lib-* lanes).

Direct original artifacts were read in existing lane workspaces, read-only:

| Lane | Source pin / artifact route |
|---|---|
| HR | `~/.codex/research/mw-hyperrogue/repos/hyperrogue/`; lane pins C++ commit `c7c9a2993b43ee2f4bbac422e565d18fdd98f886`; content/landlock/orbgen/pcmove/savemem/inventory source. |
| SU | `~/.codex/research/mw-siralim/extract/`; build 20548371 per lane; archive/chunk/localization census and native SetFusion/AddTrait/RealmGetProperties C extracts. No fresh disassembly. |
| R2 | `~/.codex/research/mw-remnant2/extract/parsed*`; build 16320528 per lane; source paths/third-party pins in [ledger](../remnant-2/SOURCE_LEDGER.md). Existing mapping match UNKNOWN. No independent schema certification. |
| KH | `~/.codex/research/mw-kingdom-hearts/`; OpenKH commit `7a3b945c538d32c6a285128c98aefba093f52ceb` per lane; decoded tables, selected room census and Memt/Cmd tool-source schemas. Build 15194255 per lane. |
| TS | `~/.codex/research/mw-the-strange/extract/S01..S14`; original retained PDF/HTML-derived texts with SOURCES/PAGE_MAP/HASHES at source. Printed p48 conditional-law example and human-run adventure examples, no commercial corebook acquisition. |
| MD | `~/.codex/research/mw-muds/extract/`; original retained 3k-room/monster/put HTML/text and 3k-main-js, source FETCH/HASHES. Server not available. |
| MI | `~/.codex/research/mw-multiverse-idle-ui/extract/S01.jpg,S02.jpg,S03.jpg,S05.jpg,S06.jpg` viewed with view_image; promotional 1920x1080 images. Sixth screenshot S04 not independently viewed by auditor. |

## Reproduction

`python3 -I ~/.codex/research/mw-audit/tools/write_synthesis.py` authors only this output dir plus own private manifests. `python3 -I ~/.codex/research/mw-audit/tools/validate.py` checks JSON, 7x(5+5) rows, 10 ranks, 12 rollup aspects, 84 preserved cells, required documents, local links and own style. Validation is documentation-only, no tests/build/browser.

Independent recount commands used Python JSON/CSV readers, anchored C++ macro counts and pathlib file census. Exact source direct locators are in [AUDIT](AUDIT.md). Existing lane `extract/HASHES.txt` files remain their original bulk pins; this lane's `extract/INPUTS.json` hashes the delivered documentation inputs. This does not independently rehash every game package, decode or validate game files. `extract/DIRECT_SAMPLES.json` independently hashes the finite direct files/images read by this audit; file censuses also used directory entries without hashing every output. Own extract manifest in `extract/HASHES.txt` binds both manifests.

Live web route opened official Strange translation, pinned HyperRogue movement and Steam store. One failed 3K room-page fetch switched to the already captured HTML/text; no retries. Source contents were not executed. No network capture was placed in git. The stale nested-world filename was resolved with `rg --files`; no missing owner was invented.

## Limitations and refresh

All foreign native/gameplay and current-install assertions remain bounded to the original lane pins. If a source lane publishes new evidence after INPUTS.json, diff its claims and refresh affected samples only. Do not rerun the whole acquisition or force native games open. Current owners are changing during the audit; later execution must reread them and recover live file reservations. Documentation rankings do not authorize runtime edits.
