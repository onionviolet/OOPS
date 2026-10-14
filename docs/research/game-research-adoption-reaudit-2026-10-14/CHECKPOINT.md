# Adoption re-audit checkpoint

Status: PARTIAL

The requested source classification, negative re-audit and ranked unpark proposals are written. Exact adoption trace remains uncertain for the untraced rows below, so this checkpoint does not claim exhaustive semantic adoption proof. No implementation was requested or performed.

- Pinned HEAD: `70a0a8d224c0298adc7f8f96989a4f6a05266db6`. Initial HEAD: `f1fd6cf08c0f5338c7b2797a22cee7158edf674d`; final source/test diff is empty.
- Done: 597 classified row entries; 26 individually reassessed negative entries; 20 receiving packets, including split leaves; top ten ranked by next-slice payoff.
- Outputs: REPORT.md, LEDGER.json, UNPARK_PACKETS.md, CHECKPOINT.md.
- Workspace: `~/.codex/research/adoption-reaudit/`; private HEAD source/test snapshot and reproducible extraction/render scripts in `notes/`. No raw foreign game data downloaded.
- Disk at checkpoint: 10656 KiB.
- Next: receiving coordinator selects one packet or assigns exact source tracing for the listed untraced rows. Reconcile current owners and fresh HEAD; do not overwrite other lanes or treat this research as code authorization.

## Checks run

Extraction and JSON parsing; source file/symbol existence and SHA-256 binding for all nonempty citations; every landed entry has source evidence; historical negative packet references resolve; top-ten IDs resolve; source/test HEAD refresh has no changed paths. Final artifact checks are recorded under LEDGER.json validation. No gameplay suite, build or native browser exercise ran.

## Unread / unresolved evidence table

“Unread” below means exact proposed consumer/adoption trace is unestablished in this pass. It does not mean the dossier file was skipped. Broad partial-capability rows also require their stated missing-consumer check before implementation.

| Dossier / row IDs | Gap | Why |
|---|---|---|
| academagia: A0004 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| ani-idle: A0016, A0017 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| battle-brothers: A0021, A0023, A0025, A0027, A0029, A0031, A0033, A0035 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| bitburner: A0039, A0045 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| bitlife: A0051 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| citizen-sleeper: A0070 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| citizen-sleeper-2: A0058 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| cividle: A0072, A0073 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| crusader-kings-3: A0077 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| crush-crush: A0084 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| cultist-simulator: A0092 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| cultivation-idlers: A0094, A0095, A0096, A0097, A0098 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| cultivation-idlers/path-of-the-idle-cultivator: A0099, A0100, A0101, A0102, A0104, A0106, A0107, A0108, A0112, A0114 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| dcss-dda-depth: A0115 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| disco-elysium: A0119, A0120, A0121, A0122, A0124, A0126 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| discworld-mud: A0127, A0128, A0131 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| discworld-mud/pass-2026-10-14: A0133, A0135, A0138, A0143, A0144 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| endless-ascent: A0156, A0160, A0161, A0162 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| free-text-worlds-2026-10-14: A0168, A0172, A0174, A0175, A0176, A0177, A0178, A0179, A0180, A0181, A0183 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| groundhog-life: A0186, A0188, A0189, A0190 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| groundhog-life/pass-2026-10-14: A0191, A0194, A0199 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| hearts-of-iron-iv: A0202, A0204, A0205 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| hogwarts-legacy: A0216, A0217, A0219, A0221, A0225, A0229 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| idle-reincarnator: A0232, A0233, A0234, A0236, A0237, A0240, A0242, A0245 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| idle-social-engine-scout-2026-10-06: A0246, A0247 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| immortality-idle: A0252, A0255, A0257, A0260 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| immortality-idle/pass-2026-10-14: A0261, A0262, A0264, A0265, A0266, A0268, A0270 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| increlution: A0273, A0276, A0277, A0280, A0281, A0284, A0285, A0288 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| kenshi/second-pass: A0302 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| kill-the-lich-idle: A0306, A0311, A0312, A0314, A0319, A0320 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| king-of-dragon-pass: A0326 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| kingdom-of-loathing: A0327, A0328, A0329, A0330 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| kingdom-of-loathing/pass-2026-10-14: A0332, A0334, A0335, A0336, A0338, A0339, A0346 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| legends-of-idleon: A0349, A0350, A0352, A0353, A0355, A0356, A0359 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| majoras-mask: A0365 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| modding-tree: A0374, A0375, A0376, A0377 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| modding-tree/pass-2026-10-14: A0378, A0379, A0380, A0381, A0382, A0383, A0386, A0387, A0388 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| outer-wilds: A0424, A0425, A0427 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| planescape-torment: A0439, A0442, A0443, A0444, A0447, A0450, A0451, A0452 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| sucker-for-love-crush-landing: A0477, A0478, A0481, A0482 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| sunless-sea: A0485, A0487, A0489 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| sunless-skies: A0493, A0494, A0495, A0496, A0497, A0498 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| super-robot-wars: A0499, A0501, A0502 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| tale-of-immortal: A0506, A0508, A0509, A0511, A0514, A0516, A0517, A0519 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| the-lands-of-eldyn: A0523, A0524, A0526, A0527 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| theory-of-magic: A0533, A0534, A0541, A0542 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| trimps-antimatter: A0545, A0546, A0548 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| upload-labs: A0551, A0553, A0556 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| vagrus: A0558, A0559, A0560 | Exact delivered consumer and host binding not established | Conservative untraced classification; no absence claim |
| GD-D01/D02/D03/D04/D05 | Pinned upstream callers and late exceptions remain incompletely read | Prior source queue explicitly records sourceReady false; adoption audit did not re-decompile upstream games |
| All landed/partial rows | New native gameplay, save/reload/import and human acceptance | Read-only research scope; existing acceptance records were not replayed |
| Concurrent lanes after input census | New or changed packets | Snapshot boundary; next coordinator must incorporate later outputs |

## Resume commands

Run `python3 ~/.codex/research/adoption-reaudit/notes/extract.py`, then inspect the exact changed dossier/source rows. `build_ledger.py` contains explicit finite source mappings and conservative overlap rules; review these judgments before rerunning. `render_report.py` renders the review surfaces. Never relabel a keyword overlap landed. Refresh the private source snapshot at an explicitly pinned HEAD before a new source pass. Read COMMON.md and current direction first. The scripts write only this output directory and the private work area.
