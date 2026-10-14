# Reincarnation Paradise priority lanes, 2026-10-14: common rules

Authority: Weibao, 2026-10-14: "more to consider? send out more codex agents
accordingly, bring Reincarnation paradise to priority world too". Recorded in
docs/USER_VISION.md (canon-first section) and PROJECT.md. Related owners:
[Paradise hub brief](../../../worlds/paradise-hub/WORLD_BRIEF.md),
[world depth considerations](../../../worlds/WORLD_DEPTH_CONSIDERATIONS_2026-10-13.md),
[nonhuman starts](../../../worlds/NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md).
Everything you write is a proposal or research, never an accepted decision.

Coordinator: the Claude session that owns this folder. Workers are Codex CLI
runs (`runs/`). One writer per file: write only the outputs your prompt names.

## Rules for every lane

- Read `AGENTS.md` first (sealed secrets, novels folder stays out of git, no
  raw prose in git) and the design owner above.
- Source: the private full-read dossier docs/research/novels/trailblaze-reading/paradise-depth/
  (FULL_SYNTHESIS, SYNTHESIS, PEOPLE_AND_INSTITUTIONS, POWER_INDEX.json,
  engine_inputs/, CAUSAL_TIMELINE, MYSTERIES_AND_REVELATIONS, AUTHORING_BOUNDARIES,
  COVERAGE). English MTL; printed ch.4042-4049 missing; translation fidelity U.
  Respect AUTHORING_BOUNDARIES and its recheck_chapter flags.
- Raw book text never leaves `docs/research/novels/` (gitignored). Notes
  paraphrase; quotes under 15 words; every source claim gets a locator.
- Label every claim SHOWN / STATED (who) / INFERRED / MEMORY (from outside
  the text) / UNKNOWN. Report contradictions as they are. Code claims cite
  `file:line` from a read you actually did.
- Design writing follows the project voice: plain words, no em dashes, no
  absolutes for design (write Default + Dial + Reasonably per world), no
  either/or questions to Weibao. Keep every reasonable option reachable.
  Tables are illustrative palettes. No universal penalty for a strange body.
- Food direction 2026-10-13: hunger never kills; meals help.
- Desktop/laptop UI first; mobile deferred.
- Public franchise twists are not sealed; changed or randomized YAIRPG world
  truths are. Do not open or quote `docs/worlds/**/SECRETS*` files.
- No git commit, push, publish, download or purchase. No edits to src/,
  dist/, tests/, other lanes' outputs, the design owner, or this COMMON.md.
- Keep a `CHECKPOINT.md` in your own output folder (next pending item, counts)
  and continue from it after any compaction. Stop only when your scope is
  complete or blocked; write the blocker in CHECKPOINT.md.
- Final message: what you wrote (paths), counts, gaps, anything unverified.
