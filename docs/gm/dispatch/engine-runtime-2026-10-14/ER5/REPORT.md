# ER5 report, 2026-10-14

## CHECKPOINT

COMPLETE: engine research and requested lane report written. Research proposals,
not accepted stack decisions. No source, tests, dist, index, package, build,
private pack or save edits. No installs, engine builds, gameplay tests, commits
or pushes. Resume only for a named evidence gap or changed requirement.

## Outputs and root handback

| Code | Owned file | Result |
| --- | --- | --- |
| ER5-R1 | [GAME_ENGINE_OPTIONS_2026-10-14.md](../../../../research/GAME_ENGINE_OPTIONS_2026-10-14.md) | EG0-EG7 matrix, Godot/Unity/Rust/Bevy/Defold/JS renderer/shell fit, dated primary sources, source-area counts, INFERRED costs, converter/gate continuity, agent workflow, hybrid path and switch evidence |
| ER5-R2 | `docs/gm/dispatch/engine-runtime-2026-10-14/ER5/REPORT.md` | This handback and reproducible measurement commands |
| ER5-R3 / EG0, RT2, CH1 | INFERRED recommendation | Keep DOM/JS; extract one pure consequential boundary. Retain inkjs. A whole engine port re-expresses roughly 76k non-data-bucket lines plus reviews/converts 21.7k data/content lines and external assets. |
| ER5-R4 / EG1, EG5, TS6 | INFERRED recommendation; STATED platform limits | PixiJS for one selected visual island; trial Tauri for requested desktop delivery, Electron fallback for a demonstrated WebView defect. Shells do not automatically bypass quotas/throttling. Detailed sources are in R1's H rows and ER3-T12/T13. |
| ER5-R5 / EG2-EG4, EG-New1, DA4 | INFERRED recommendation | Typed GDScript Godot is best full-engine successor candidate if scenes become central. Reject current Unity/Defold/full-Bevy port; choose plain Rust only after RT2 and measured end-to-end gain. Add Defold and engine interchange/differential proof to palette consideration. |

Root palette remains Claude-owned and was read only. ER3 stack output and ER1
hotspot output were read and linked rather than duplicated. Prior E-review and
offline/branch-clock audit keep their contracts. Live PROJECT/USER_VISION were
read: desktop/laptop first, independent panels, mobile optimization deferred,
current Foundation native gates open. No accepted direction changed.

## Commands run and results

All commands ran from `/Users/weiwei/code/yet-another-idle-rpg`, branch observed
as `codex/gameplay-foundations`. Existing dirty/staged changes included PROJECT,
USER_VISION, dist, index and many other docs. They were preserved. The two ER5
outputs did not exist at initial inspection. No worker was delegated.

**ER5-ME1, MEASURED:** The following Python census ran inline. It reads only
non-sealed `src` files and prints physical lines including blank/comments, with
mutually exclusive buckets in this order. It does not open personal saves.

```sh
python3 - <<'PY'
from pathlib import Path
from collections import defaultdict
rows=defaultdict(lambda:[0,0])
files=[p for p in Path('src').rglob('*') if p.is_file() and not p.name.startswith('SECRETS')]
for p in files:
    n=p.name
    if n=='main.js': a='main integration'
    elif p.parts[1]=='data' or n.endswith(('_content.js','_facts.js','_ids.js')) or p.suffix in ('.json','.ink'): a='data and authored content'
    elif n=='display.js' or n.endswith(('_ui.js','_panel.js')) or n in ('workspace_views.js','workspace_layout.js','component_themes.js','display_settings.js','customization_profiles.js','panel_kit.js') or (len(p.parts)>2 and n=='panel.js'): a='UI and presentation'
    elif n.startswith(('save_','import_','native_storage')) or n=='expansion_persistence.js': a='save and import seam'
    elif n.startswith('ink_'): a='Ink bridge'
    else: a='remaining domain runtime and adapters'
    s=p.read_bytes(); lines=s.count(b'\n')+(bool(s) and not s.endswith(b'\n'))
    rows[a][0]+=1; rows[a][1]+=lines
print('ALL SRC',len(files),sum(x[1] for x in rows.values()))
for a,r in sorted(rows.items()): print(a,*r)
for n in ['main.js','display.js','expansion_engine.js','simulation.js','save_files.js','ink_narrative.js','ink_narrative_ui.js','workspace_layout.js']:
    p=Path('src')/n; print(n,len(p.read_text().splitlines()))
print('JS',sum(p.suffix=='.js' for p in files),sum(len(p.read_text().splitlines()) for p in files if p.suffix=='.js'))
PY
```

```text
ALL SRC 459 97803
Ink bridge 1 355
UI and presentation 49 10515
data and authored content 110 21740
main integration 1 8579
remaining domain runtime and adapters 292 56170
save and import seam 6 444
main.js 8579
display.js 6167
expansion_engine.js 685
simulation.js 637
save_files.js 217
ink_narrative.js 355
ink_narrative_ui.js 141
workspace_layout.js 395
JS 458 97799
```

**ER5-ME2, MEASURED:** Compression ran on the existing dirty bundle, not a new
build or served response. Raw bytes and gzip bytes are not whole-app download
size, execution time or installed footprint.

```sh
python3 - <<'PY'
import gzip
from pathlib import Path
p=Path('dist/bundle.js'); b=p.read_bytes()
print('working-tree bundle bytes',len(b),'gzip level9 bytes',len(gzip.compress(b,compresslevel=9,mtime=0)))
PY
```

Result: `working-tree bundle bytes 5100591 gzip level9 bytes 1413390`, exit 0.

**ER5-READ1, READ:** Read operations used `cat`, `sed`, `nl`, `rg`, `ls` and
`git status --short` / `git branch --show-current`. Inspected files:

| Code | Read set |
| --- | --- |
| ER5-READ2 | `COMMON.md`, lane `ER5.md`, `AGENTS.md`, `PROJECT.md`, `~/.claude/user-preferences.md`; relevant `docs/USER_VISION.md` desktop priority and standing summaries |
| ER5-READ3 | Root engine/runtime palette including EG0-EG7 and RT2; E1-E10 review; offline/branch-clock audit; ER3 research/report; ER1 hotspot research |
| ER5-READ4 | `package.json`, relevant `build.js` recipe; `src/expansion_persistence.js`, `src/expansion_engine.js:588-640`, `src/save_files.js:150-217`, `src/ink_narrative.js:1-80`, `src/main.js` writer/save/load/timer search and writer lines 580-600 |
| ER5-READ5 | Lightweight memory registry search for Foundation/transfer/runtime routing, followed by live authority checks. No memory-derived current gameplay claim. No sealed file was opened. |

External research used `web.run` searches/opens/finds, only primary vendor/manual
or project-author repositories for technical conclusions. All sources have URL
and access date in R1. Godot size-optimization page and Unity ListView page failed
to open once; switched to successful web-export/size and UI Toolkit routes rather
than retrying failed URLs. Did not rely on Reddit/search-only secondary claims.
The Defold empty-build chart has a Brotli/gzip label conflict, explicitly retained
in R1. Historical Godot 4.3 payload is dated 2024, not represented as current.

**ER5-CHECK1:** Documentation checks: local relative Markdown targets resolve,
no em dash or spaced double hyphen in owned prose, census totals sum, requested options and
MEASURED/READ/STATED/INFERRED labels present; `git diff --check` for owned paths.
No source tests are warranted for research-only output. These checks do not
qualify engine performance or gameplay.

## Open questions and evidence

| Code | Open | Revisit condition |
| --- | --- | --- |
| ER5-Q1 | Which actual scene needs a renderer, or whether desktop distribution is wanted next | A selected playable slice/delivery request; no broad redesign inferred from research |
| ER5-Q2 | Current end-to-end profile and pure kernel contribution | Named synthetic desktop workload with clone/render/save/bridge phase costs; reuse ER1/ER7 evidence for its actual slice |
| ER5-Q3 | Engine export size/startup, WebView compatibility and conversion fidelity | Pinned scratch exports, exact save fixtures and desktop UI gates; not vendor empty-project numbers |
| ER5-Q4 | Mac Godot-WebView route | A pinned plugin with actual Mac package/input/file proof; gdCEF's inspected README does not establish it |
| ER5-Q5 | Adoption and human acceptance | Explicit selected implementation scope, then rebuilt fresh-origin gameplay/save/reload/literal import and any packaged-host proof; existing native gates stay open |

Recommendations and cost bars are INFERRED. External claims are STATED, source
contracts are READ, census/compression alone are MEASURED. Nothing is installed,
gameplay-complete, human-accepted, committed or deployed by this lane.
