# DCSS and Cataclysm: DDA source-depth GM

Authorized 2026-10-05 by Weibao: "We can send a GM to check out DCSS and DDA and then I can source the others part by part?"

## Goal and ownership

Research both public source repositories for original YAIR gameplay improvements, especially achievements, difficult accomplishments, mastery, collection, replay and interacting systems. Complete a bounded deeper source review and a reusable implementation handoff. This is research, not authorization to implement runtime changes or acquire commercial games.

Root owns this assignment and `DISPATCH.json`. The GM exclusively owns new `REPORT.md`, `FINDINGS.json`, `CHECKPOINT.md` and optional evidence files beneath `docs/research/dcss-dda-depth/`. Other project owners remain read-only. User sourcing of commercial games is independent and does not block this work.

## Existing context and baseline

Read `AGENTS.md`, the latest `PROJECT.md`, relevant source, `docs/GAME_MASTER_PROMPT.md`, and current capacity/succession guidance. Preserve the ongoing Features GM's moving source and global documents.

Reuse the completed repository-bank review rather than repeat it:

- `docs/research/repository-bank/SOURCES.json` and `README.md`.
- `docs/gm/world-implementation/second-pass/repository-bank-absorption/REPORT.md`, `FINDINGS.json`, and `COVERAGE.json`.
- Prior DCSS commit: `ea329046556431e4bb9d3cc38c39ec998495ab69`; existing RB-POW-02 covers spell execution blockers/failure.
- Prior DDA commit: `09a75ac67df6043f831ca41753f7cc5fe1545244`; RB-LIV-01/02/03 already cover teaching, proficiency and bounded funded work.

Assignment-time SHA-256 pointers, not locks on unrelated live work:

- PROJECT.md: `d7e2d1cac93c80d1e91d75a1b5549af637745bc5daf66befe7dce2db6551ac78`
- Prior REPORT.md: `03646681cd6820619cd03b958ca58a3f77b89ce41af53f3a09e7831a4b5ccef4`
- Prior FINDINGS.json: `e022e14adfb85fda17faef49264e49a01773b7a2f33e5fbe920402433e38cf5b`
- SOURCES.json: `d92b2ddb511c09f4720682f1304a5f69c8164e978fbf52c29d51215dbdac43b2`

## Research scope and evidence

Sources: https://github.com/crawl/crawl and https://github.com/CleverRaven/Cataclysm-DDA. Resolve and record exact inspected revisions. Use temporary source checkouts outside YAIR or pinned primary-source reads; do not vendor the source into this project.

Trace at least three concrete source paths per game from data/eligibility through execution to recorded result or consequence. Cover achievement-like records or hard accomplishment structure, one interacting combat/effect/item system, and one mastery/work/NPC progression system where the actual source supports it. If DCSS lacks a formal achievement catalogue, report that distinction and inspect scoring, wins, conducts or other actual accomplishment records instead of inventing one.

For each finding record upstream revision, files, symbols, line anchors, actual behavior, known limits, what adds to the prior bank findings, relevant existing YAIR owners and the smallest original player-facing application. Separate code-observed facts from design inference. Inspect both JSON/data and runtime consumers where applicable. Source reading alone is not gameplay or balance verification.

Return no more than five ranked transfer recommendations total. Each needs a concrete player goal/choice, early-to-late development or repeat value, reward/aftermath, integration cost and an observable later playable gate. Do not pad the list with already implemented systems. Identify a feature as covered, extension, new consumer or poor fit against the latest YAIR source.

## Limits and completion gate

No changes to `src`, `dist`, dependencies, build, saves, source libraries, global GM registries, PROJECT/USER_VISION, existing research owners, Git commits/pushes or external messages. Do not install or launch the reference games. No gameplay/browser/save/regression suites; current implementation-first deferral remains. No wholesale raw source corpus in project output. Record source terms for attribution/reuse without selecting code imports or claiming general reuse permission.

Completion requires both game reviews, six traceable source paths, source/current-YAIR qualification, a checked prior-review delta, at most five useful recommendations and truthful coverage/limits. Check JSON and local document references. Finish the authorized finite goal; checkpoints are resume points, not stops. Return changed paths, evidence checked and unresolved limits to root.
