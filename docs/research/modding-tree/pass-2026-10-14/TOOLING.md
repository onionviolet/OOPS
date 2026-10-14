# Tooling and reproducible source acquisition

Lane work root: `/Users/weiwei/.codex/research/prestige-community/`. Only report output was written under the main checkout. All repositories were newly shallow-cloned into their own empty directory. No downloaded scripts, npm installs, builds or games were run. No saves or game profiles were touched. No staging, commit or push. Existing checkout had extensive unrelated dirty files; preserved.

## Repositories

| Source | URL | Pinned HEAD | Depth | License inspected |
|---|---|---|---|---|
| prestige-tree | [prestige-tree](https://github.com/Jacorb90/Prestige-Tree) | `cec9198c8ce9a5c6d107179871cbe84fab92ae0d` | 1 | root MIT notice; TMT-derived games also bundle Prestige-tree-license |
| communitree | [communitree](https://github.com/ducdat0507/communitree) | `38efac6d1b9e68db158c260fcb343d1881b29256` | 1 | root MIT notice; TMT-derived games also bundle Prestige-tree-license |
| profectus | [profectus](https://github.com/profectus-engine/Profectus) | `d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea` | 1 | root MIT notice; TMT-derived games also bundle Prestige-tree-license |

The Profectus GitHub source is a mirror per CONTRIBUTING.md. Its current official host exists at [Incremental Social](https://code.incremental.social/profectus/Profectus); this pass pins the GitHub revision, not current-host parity. No code/assets are copied, so vendor licenses were not exhaustively audited.

## Commands that worked

Run clones only into empty paths. These are the exact acquisition routes used:

```sh
git clone --depth 1 https://github.com/Jacorb90/Prestige-Tree.git /Users/weiwei/.codex/research/prestige-community/repos/prestige-tree
git clone --depth 1 https://github.com/ducdat0507/communitree.git /Users/weiwei/.codex/research/prestige-community/repos/communitree
git clone --depth 1 https://github.com/profectus-engine/Profectus.git /Users/weiwei/.codex/research/prestige-community/repos/profectus
```

Per repo, `git rev-parse HEAD`, `git log -1 --format='%cs %s'` and `git rev-parse --is-shallow-repository` identify the snapshot. Reading used rg, sed, head and Python 3 with `-I`. Existing git, Python and shell only; **installs: none**.

`tools/write_reports.py` in the work root emits this output and hashes cloned files. `python3 -I /Users/weiwei/.codex/research/prestige-community/tools/write_reports.py` is the report generation command. Do not rerun it after manual output edits without reviewing them.

`extract/HASHES.txt` contains SHA-256 for downloaded non-git files and the source census; `extract/LAYER_CENSUS.json` records IDs and line counts. No raw code, game assets or vendor files were moved into the repo. SHA values in this report pin clones; content hashes remain in scratch as required.

## Discovery and dead ends

- Web searches located the Profectus official guide, mirror policy and creator-hosted game. Prestige Tree's own changelog identifies Rewritten. Public pages were read, no game was launched.
- [Communitree creator URL](https://ducdat0507.github.io/communitree/) redirected to [duducat.moe](https://duducat.moe/communitree/). It returned the loading shell. Source clone supplied mechanisms; no live state claim.
- A broad Communitree search also returned unrelated tree-planting projects. They were excluded; exact creator repository succeeded.
- Initial guesses `src/features/repeatable.ts` and `upgrade.ts` were absent. `rg --files` found `src/features/clickables/repeatable.tsx` and `upgrade.tsx`, then the intended files were read.
- A proposed `docs/PROGRESSION.md` owner path was absent. Reports were corrected to the existing ENGINE_EXPANSION and ENGINE_AUTHORING owners before completion.
- One memory registry search for modding-tree/research wave/prestige-community returned no match. No memory-derived fact used.
- The initial Prestige Tree clone returned an ongoing session; it completed when resumed. All three fetches succeeded. No failed page/repo was retried; no login/Discord route attempted.

## Verification and limits

Read all of Profectus requirements.tsx and layer factory/template lifecycle; read targeted content/reset/softcap/display/activation paths in both games. Existing upstream tests were inspected as evidence of expected contract coverage, **not run**. No new test suite or gameplay run was performed. Artifact checks validate JSON, source ranges, owner paths, document links, output shape and shallow state. Real pacing, usability and performance stay open.

Final artifact check: `python3 -I /Users/weiwei/.codex/research/prestige-community/tools/verify_artifacts.py` passed. It validated 18 findings, seven proposals, thirty touches, required files, source line ranges, local links, owner paths and all three shallow clones. The first check found three overlong citation ranges; they were corrected to the actual payment and contributing sections before the successful check. This is artifact validation, not runtime proof.
