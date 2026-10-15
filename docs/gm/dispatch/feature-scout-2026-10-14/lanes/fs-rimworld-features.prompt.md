You are lane `fs-rimworld-features` in the YAIRPG feature scout wave of 2026-10-14.
Repo: /Users/weiwei/code/yet-another-idle-rpg (main checkout, read-only for you except your output dir).
Read first, in order: docs/gm/dispatch/feature-scout-2026-10-14/FEATURES.md, then docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md (hard rules) and docs/gm/dispatch/game-research-wave-2026-10-14/ASPECTS.md. They govern this prompt.
Work area: `~/.codex/research/fs-rimworld-features/`
Weibao, 2026-10-14: "send out the free game stuff accordingly, using codex, some of the steam ones are installing, did we consider rimworld yet? more to consider?"

Output dir (the only repo path you may write): `docs/research/rimworld/feature-pass-2026-10-14/`
Private deep details: `docs/research/rimworld/private/fs-rimworld-features/`

## Game and payload
Owned. Not installed on Steam, but the earlier supplied macOS DMG is at `~/Downloads/rimworld_enUS_1_6_4871_rev588_.dmg` (same 1.6.4871 rev588 build as the prior dossier's INTAKE). The prior private ILSpy export is gone. Prior dossier: docs/research/rimworld/ (REPORT, COVERAGE, FINDINGS). Separately, lane `bf-rimworld` (game research wave backfill) waits for a Steam install to run a full aspect pass into `docs/research/rimworld/aspects-2026-10-14/`; do not write there. Make your extract reusable for it: keep it under `~/.codex/research/fs-rimworld-features/extract/` with HASHES.txt and say so in TOOLING.md.

## Route
Mount the DMG read-only and without Finder (`hdiutil attach -readonly -nobrowse -mountpoint <work>/mnt <dmg>`), copy the main managed assembly and the Data folder (Core plus any DLC folders present) to `extract/`, then `hdiutil detach`. Never run the game or its installer scripts. ilspycmd on the assembly.

## Questions (answer each in the Feature answers table)
1. P01: When a pawn cannot do a bill or job, how are the reasons built (JobFailReason, WorkGiver checks, bill 'cannot find materials' messages) and shown? Which reasons are truthful and which are generic?
2. P02: Bills and stockpiles: how one material competes between bills, priorities, ingredient filters and 'do until X'; how the UI quotes it.
3. RT: Research projects, techprints, benches and tech level: prerequisites, evidence (techprints), and whether anything is revised.
4. P03: Skill learning: passion, learning rate, daily caps, and (if Biotech data is present) children learning and teaching.
5. BD: Genes and xenotypes (if present): how genes, body type, head type, gender and hediffs are separate fields, and which systems read each.
6. Correct the prior dossier where it was wrong; mark which of its five paths you reconfirmed.

## Done
Per FEATURES.md and COMMON.md. CHECKPOINT.md stays current so a restart resumes. Final message: the answers in one line each, top three proposals, gaps.
