You are lane `pw-intake` in the YAIRPG game research wave of 2026-10-14.
Repo: /Users/weiwei/code/yet-another-idle-rpg (main checkout, read-only for you except your output dir).
Read first: docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md (hard rules, output shape, done check). It governs this prompt.
Output dir (the only repo path you may write): `docs/audits/yairpg-game-research-v1/ (in Province War)`
Work area: `~/.codex/research/pw-intake/`

## Repo
You work in **Province War**: `/Users/weiwei/code/province-war`, not YAIRPG. YAIRPG is read-only for you. Follow Province War's own `AGENTS.md`, `docs/audits/AGENTS.md`, `docs/audits/README.md` and the ownership gate in `docs/implementation/game-master-v1/ownership/README.md`.

## Authority
Weibao, 2026-10-14, directly: "make sure the province war is able to refer and use the audits too". Under Province War AGENTS.md, direct human authority outranks the registry. Your scope is new-only: `docs/audits/yairpg-game-research-v1/**`, plus the audit-register entry and its generated views as that repo's audit rules require. Record the human instruction, your CODEX_THREAD_ID and hashes in an authority receipt, register the scope, and run the preflight before each write batch. If a shared file is blocked, keep a ready patch in your scope and say so. No gameplay, `web/`, `src/` or runtime edits.

## Task
Make YAIRPG's game research usable from Province War:
1. Build `docs/audits/yairpg-game-research-v1/README.md`: an index of YAIRPG dossiers (`/Users/weiwei/code/yet-another-idle-rpg/docs/research/<game>/`) relevant to grand strategy, economy, logistics, AI, diplomacy, research trees and UI. Must include `hearts-of-iron-iv/` (especially `PROVINCE_WAR_FIT.md`), crusader-kings-3, factorio, battle-brothers, kenshi, king-of-dragon-pass, six-ages-2, vagrus, rimworld, dwarf-fortress, oxygen-not-included, cividle, and warsim when present. Absolute paths, one-line relevance and the Province War packet IDs from `docs/implementation/AUDIT_WORK_QUEUE.md` each one informs.
2. Route each mapped finding to an existing packet, per the audit rules (reuse families and primary homes; no duplicate verdicts).
3. Register one source family for it in `docs/audits/audit-register.json` and run `node docs/audits/management/check-register.mjs --write` plus its read-only check, if the gate admits it.
4. Note in the README how a Province War agent finds new YAIRPG dossiers later (the path pattern and the YAIRPG coverage reconciliation file).
Done: README plus routing table in scope, register check passing (or a blocked patch), CHECKPOINT.md in scope.
