# UQM tooling and rerun record

Lane `lib-uqm`, research date 2026-10-14 in America/New_York. Work area: `/Users/weiwei/.codex/research/lib-uqm/`. **No installs, builds, game launches, Steam/bottle/save access, git staging, commits or pushes.** Python/shell helpers written by this lane were run; no downloaded source or build script was executed.

## Inputs and pins

| Input | Revision / receipt | Use |
|---|---|---|
| Official `https://git.code.sf.net/p/sc2/uqm` main | `a0d90e239b3a8e3dcb9d732fd76a385aac2593e5` | Final primary C/text source and complete tree |
| GitHub `https://github.com/juj/sc2-uqm` | `ff2444088d42e80612fd28f79d368783e244a606`, commit API metadata retained | Preliminary selected-file fallback only; final claims rechecked on official source |
| GitHub recursive tree API | `notes/mirror-tree.json`, `truncated: false`, 14,751 entries | Located actual file names rather than guessing them |
| Official download page | `https://sc2.sourceforge.net/downloads.php`, read 2026-10-14 | Source route discovery only; released version/page is not an installed-build pin |
| YAIRPG read-only checkout | Observed `codex/gameplay-foundations`, HEAD `59b02ab6080ce7d13fcb69d0e9f96023c994f771` during owner read | Prompt's main-checkout label is not the observed branch; no checkout switch |

Source hash manifest is `extract/HASHES.txt`; derived reference hashes are `extract/EXTRACT_HASHES.txt`. Both also have ignored copies under `private/`. The official clone is the full raw archive. Full dialogues/IDs are in `private/dialogue/`; `private/table-initializers.json` retains 18 full initializer bodies from selected economy/hazard tables. Complete C conditions remain in the pinned clone; call-site contexts are not a full symbolic predicate solver.

`notes/mirror-official-comparison.json` records 73 identical files, 120 differing files and two selected mirror script paths absent from official main. Differences include source, data and headers; no blanket parity is claimed. The final census overwrote preliminary mirror-derived extracts with official results. The two mirror Lua files must not be cited as official UQM architecture.

## Commands that worked

Run from the YAIRPG checkout for owner reads, and use only the assigned output directory for repository writes. Existing owners and unrelated dirty files remain read-only. Source download and extraction use the external work area.

```sh
git clone --depth 1 --branch main https://git.code.sf.net/p/sc2/uqm /Users/weiwei/.codex/research/lib-uqm/repos/uqm
git -C /Users/weiwei/.codex/research/lib-uqm/repos/uqm rev-parse HEAD
git ls-remote https://git.code.sf.net/p/sc2/uqm refs/heads/main
python3 -I /Users/weiwei/.codex/research/lib-uqm/tools/census.py /Users/weiwei/.codex/research/lib-uqm/repos/uqm /Users/weiwei/.codex/research/lib-uqm/extract
python3 -I /Users/weiwei/.codex/research/lib-uqm/tools/dialogue-index.py /Users/weiwei/.codex/research/lib-uqm/repos/uqm /Users/weiwei/.codex/research/lib-uqm/extract
python3 -I /Users/weiwei/.codex/research/lib-uqm/tools/validate.py
git check-ignore docs/research/ur-quan-masters/private/example.json
git status --short -- docs/research/ur-quan-masters/
du -sh /Users/weiwei/.codex/research/lib-uqm docs/research/ur-quan-masters/
```

For an exact rerun, use the already-pinned clone or fetch the recorded commit in a new empty work directory. A fresh branch clone can resolve to a later revision. Do not run build/download scripts from the clone. `rg` and `sed` traced the symbols listed in SOURCES; Python indexed text records, lexical macro calls and source hashes. The parser recognizes `#(id)` records, not arbitrary executable dialogue syntax; `Response`/`NPCPhrase` census counts lexical call sites only. It does not calculate reachable edges, distinguish every speaker automatically, or prove a native UI.

## Dead ends and route changes

| Attempt | Result and route change |
|---|---|
| Prompt's `docs/NESTED_WORLDS_AND_DEEP_TROPE_CHAINS_2026_10_05.md` | Missing. `rg --files docs` found the actual brief under `docs/gm/dispatch/`; read that owner. |
| Official SourceForge Git clone | Slow, but ultimately successful. Kept running while inspecting a pinned mirror fallback. No retry needed. |
| SourceForge nested tree pages through web tool | Returned inaccessible/internal error. Switched source reading to Git/raw mirror, not repeated page variants. |
| GitHub whole master archive via codeload | 60-second timeout with 15,299,963 partial bytes. Retained partial archive as a dead-end receipt; not used as complete source and not retried. Switched to API tree plus pinned individual raw files. |
| Initial guessed raw paths, such as `spathi.c` and `hyperspace.c` | 404. Tree API supplied actual `spathic.c`, `hyper.c` and other names. Each failed URL was not retried. |
| Raw mirror `gameev.c` | TLS unexpected EOF. No retry; official clone later supplied the file. |
| Unquoted API query URL | zsh glob rejection before network access. Quoted the URL; one actual API fetch then succeeded. |
| Reading the tree JSON while download still ran | Incomplete JSON, not a valid empty result. Waited for successful process completion before parsing. |
| Initial report owner routing guesses | Checked against `rg --files docs` and corrected to actual `docs/MEANS_AND_APPRAISAL.md`, institution depth owner and `docs/TECHNOLOGY_AND_PROGRESSION.md`. |

Final outputs rely on the successful official clone, not the failed archive or preliminary incomplete reads. The source revision is not authenticated as the installed Steam Free Stars build. That comparison was outside this static lane.
