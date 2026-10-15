# Tooling and mechanical rerun

No installs, clones, downloads, account access or external tools were needed. Repos/commits: none. Tools used: local python3 standard library, pathlib/json/zipfile/hashlib/re, rg, sed, ls, git status and du. The game, Chromium export and original JS callbacks were never executed. No Windows binary, injector, Steam dialog or live player save was opened.

## T1: inputs and scope

Installed archive: `~/Library/Application Support/Steam/steamapps/common/诸天刷宝录/package.nw`.
Scratch: `~/.codex/research/lib-zhutian/`.
Only repo write scope: `docs/research/zhutian-shuabao-lu/`.

Read COMMON/ASPECTS, PROJECT first 80, accepted USER_VISION direction, both kit roots, nested-world dispatch, integration map and both syntheses. Working tree was heavily dirty from other work. No branch switch, stage, commit, push, source edit, build or game test occurred. Initial broad git-status/owner output was too long and truncated; subsequent targeted owner reads recovered relevant sections. The nested-world path in the prompt did not exist at the root; read the actual dispatch path recorded in REPORT.

## T2: extraction route that worked

`python3 -I` opened the NW.js archive with `zipfile.ZipFile`, inventoried all 367 entries, rejected absolute/traversal paths, and extracted only `.json`, `.js`, `.html` and `.css` entries into scratch `extract/`. Full binary/media extraction was unnecessary. `hashlib.sha256` pinned the installed archive and each extracted file in `extract/HASHES.txt`. Source version comes from package.json, not an assumed current Steam release.

Mechanical extraction core, run only with scratch as the output:

```python
from pathlib import Path, PurePosixPath
from zipfile import ZipFile
import hashlib
work = Path.home() / '.codex/research/lib-zhutian'
archive = Path.home() / 'Library/Application Support/Steam/steamapps/common/诸天刷宝录/package.nw'
rows = [hashlib.sha256(archive.read_bytes()).hexdigest() + '  package.nw']
with ZipFile(archive) as z:
    for entry in z.infolist():
        rel = PurePosixPath(entry.filename)
        if rel.is_absolute() or '..' in rel.parts:
            raise ValueError(str(rel))
        if str(rel).endswith(('.json', '.js', '.html', '.css')):
            blob = z.read(entry)
            target = work / 'extract' / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(blob)
            rows.append(hashlib.sha256(blob).hexdigest() + '  ' + str(rel))
(work / 'extract/HASHES.txt').write_text('\n'.join(rows) + '\n')
```

Do not rerun extraction over a historical pin if the archive has changed; use a new snapshot dir and preserve the old hashes.

## T3: static decode route

Private script: `notes/decode.py`. Actual command:

```sh
python3 -I "$HOME/.codex/research/lib-zhutian/notes/decode.py"
```

It parses `C3_GetObjectRefTable` and the top-level `C3_ExpressionFuncs` entry boundaries as text, resolves event method indices and expression source by number and retains all bindings. It does not use eval, import the game's code, start a renderer or call any game callback. Output is an aid to reading; it is not a fully recovered Construct editor project or executable reconstruction. Its heuristics were spot-checked against the reference table, explicit generated expressions and selected save/drop/entry calls. Some nested custom-function actions remain numeric; raw records are retained to prevent losing that evidence.

Private additional artifacts: `events.pretty.json`, `events.decoded.json`, `event-strings.tsv`, `event-groups.tsv`, `objects.json`, `expressions.json`, selected `node-*.decoded.json`, `time.decoded.json`, `dialogue.decoded.json`, `world_unlock.decoded.json`, `prestige.decoded.json`, `dispatch.decoded.json`, `difficulty.decoded.json`, `world_price.decoded.json`, `function-*.decoded.json`, `spirit-wandering.decoded.json`. All paths are under scratch `notes/` unless stated otherwise.

The private dossier-generation script is `notes/write_dossier.py`; it is a lane-specific authoring helper that overwrites this lane's docs, not a general content extractor. Do not run it after hand edits without reviewing those edits. No fetched code was run.

## T4: dead ends and gaps

The engine hypothesis in the prompt was corrected using HTML generator, package manifest and Construct event/array formats. No failed network fetch. No archive encryption or obfuscation barrier. Broad raw-event pretty-print output was too large; switched to named subtree extraction, static method references and generated-expression joins. Table short names alone are unreliable, so exact joins not read are marked partial rather than expanded into invented names.

Literal offline-term searches in event strings and generated expressions returned no match. A compact online-display mode was then read directly; it does not settle closed-app gain policy. Runtime play is outside this dispatch, not an attempted failure. All personal save/record and DLC info files remain unread.

## T5: verification

Dossier check script: `notes/verify_dossier.py`. It parses both JSON outputs, verifies A01-A12 keys/statuses, required artifacts, 60 data table inventory rows, 28 touches, eight packets and local Markdown links; checks source hashes and source version; records hashes of private derived files. Documentation checks are not game tests, builds, save acceptance or native UI proof. Final results are recorded in CHECKPOINT.
