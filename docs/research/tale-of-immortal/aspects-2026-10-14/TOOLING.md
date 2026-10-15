# Tale of Immortal: tooling and reproducible reads

Identity: October9 official modFQA companion JSON/workbook backup. Current executable/build unknown; historical build21758240 not promoted to current proof.

Lane work: `/Users/weiwei/.codex/research/asp-cultivation/`. No installs, clones, network fetches or game execution in this pass. Reused prior private areas read-only. No save access, Steam UI, account login, injector, native control, staging/commit/push or writes to other repo areas.

## Source paths

- `/Users/weiwei/Documents/Backups/tale-of-immortal-2026-10-09/Mod/modFQA/配置修改教程/配置（只读）Json格式/`
- `/Users/weiwei/.codex/research/tale-of-immortal-2/extract/`

Full detail retained in own extract: Path and both Groundhog formatted source copies; selected Immortality service/viewer bodies; Tale selected dialogue/option/trigger/NPC/companion/local-text tables. Full source outside those subsets remains available at the read-only paths above. Source hash ledger: `extract/HASHES.txt`. Inventories: `*-inventory.json`, Tale dialogue metrics. No proprietary code/text copied into repo.

## Mechanical rerun

```sh
python3 -I /Users/weiwei/.codex/research/asp-cultivation/tools/collect.py
python3 -I /Users/weiwei/.codex/research/asp-cultivation/notes/write_reports.py
python3 -I /Users/weiwei/.codex/research/asp-cultivation/tools/validate.py
```

Read commands used: `rg -n` symbol searches, bounded `sed -n` source ranges, Python stdlib JSON parsing/counting/hashing, named Steam install-directory listing and dirty-state inspection. These execute analysis only. collect.py regenerates browser/module and Immortality file inventories; Tale inventory was built with stdlib JSON over761 files and selected official tables copied byte-for-byte. A fully mechanical table rerun is in `tools/tale_tables.py`. No game npm/dependencies/scripts run.

Dead ends/qualification: Tale historical native work area absent and named current install not found; switched to existing official backup, not stale stubs. Path lexical IIFE count includes nested helpers and is not a gameplay-system count. Groundhog later mirror remains unidentified by author/commit despite matched bytes. No failed web fetch occurred. Large source scans were narrowed to bounded handlers. Source reviews prove implementation structure, not behavior under runtime scheduling or storage failure.
