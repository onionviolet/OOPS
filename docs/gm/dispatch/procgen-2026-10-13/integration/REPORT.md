# Procgen wave 1 integration

2026-10-14, branch `proc/wave1-integration`.

- **Base and merges:** base `5c084e50`. Merges: P1 `15be8b7c` (clean), P4 `d9de8bf0` (clean), P2 `18fa41a7` (import conflicts), P3 `b6680ff2` (import and validator conflicts). Seed change `9240fefc`, proof `91666053`, tip `8e0f1138` merged at `f0f5dee5`, smoke and docs `3b53a38e`.
- **Conflicts:** main.js keeps all imports. save_files.js validator order: expansion + storylet validation, then P1 streams, encounter, and the encounter-needs-streams guard. The P1 parts match reference `83af4bba`.
- **Save compatibility:** no `game_version` bump. Four optional owners that don't overlap, each schema 1 and rejecting unknown future versions. Old saves are unchanged apart from P1's documented deterministic future draws.
- **Seeds:** P2 and P4 take their one-time seed from the P1 stream root through the pure `streamSeed()`. P3 decks stay local (B1).
- **Checks:** npm test 672 → 673 → 679, all passing; build passed. Browser proof 19/19 (natural: W1, P3a/b/d, P4a/b, P2a–c, X2–X4; seeded-native: X1, P1a/b, P3c, O1/O2). Post-tip smoke passed. Evidence: `browser_evidence.json`, `smoke_evidence.json`, screenshots.
- **Open:** see BACKLOG.md (B1–B6).
