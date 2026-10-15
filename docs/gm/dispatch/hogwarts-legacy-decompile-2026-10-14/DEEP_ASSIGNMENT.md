# Hogwarts Legacy deep pass: AI, dialogue, XP, shields and more

Dispatched 2026-10-14 by Claude Code. Weibao: "Consider deeper pass to look
at AI, dialogue, xp and shield and more? We have REA installed and
everything." Standing authorization covers decompiling owned games.
Same rules as ASSIGNMENT.md and ADDENDUM_1.md in this folder (read both):
read-only install, never launch the game or run injectors, never touch
saves, raw data out of git, no `src/` edits, no commits.

## Start from the first pass

Read `docs/research/hogwarts-legacy/` fully first: REPORT, CHECKPOINT
(the unread table is your scope list), TOOLING, REA_TRIAL, BLUEPRINT_PASS,
COVERAGE.json, digests. Reuse the existing workspace
`~/.codex/research/hogwarts-legacy/` (tools, extracts, Ghidra project, the
locally built REA from the trial). Extend it; don't re-extract what is
hashed already.

## REA now

REA is built locally from the trial. This pass has several native chains,
which is where the trial said REA helps (batched multi-query evidence bound
to the exe hash). Use REA over Ghidra as the default native route here,
with direct Ghidra for spot checks. Name symbols from the public SDK dump
after checking its build match. Record each chain's exe hash, addresses and
tool versions.

## Questions, in priority order

1. **XP:** the actual consumer: cumulative vs per-level thresholds, how
   ExperienceActions rows are awarded, whether XP stops after a challenge
   fills, level-up rewards cadence (talent points, gear level), difficulty
   multipliers.
2. **Shields and damage:** the native shield-break rule (color/tag mask vs
   spell category), the Stupefy/hard-mode exception, damage formula inputs
   (spell base, gear power, level, difficulty, talents), stagger/break
   states, combo and finisher meter (Ancient Magic meter gain and spend).
3. **AI:** enemy archetype behavior trees and blackboards, perception
   (sight, noise via CastNoise/ImpactNoise, EnemyPerceptionScores), stealth
   detection fill and decay, group coordination (attack tokens, who
   attacks when), companion AI (follow, assist, wait boundaries), NPC
   schedules and overrides (QL6), creature AI in the vivarium.
4. **Dialogue:** conversation system structure, not prose. How lines,
   choices and conditions are stored; what choices change (relationship
   facts, quest branches, rewards); how speaker, quest state and schedules
   gate a conversation; examples as paraphrase or short IDs only. Never
   copy dialogue text beyond a few words.
5. **More (cheap from data):** QL1-QL8 from REPORT (accessibility/input,
   shop pricing, cosmetics vs strength, noise, purchase alternatives,
   schedule overrides, transient vs saved data, localization-key joins).
   Also: difficulty settings tables, economy sinks and faucets (gold in
   and out), the quest/mission step grammar (task types and how steps
   chain), and how world events or random encounters spawn.

For each answer cite asset path, table/column, or exe address and tool,
labelled shown / stated / inferred. Name any secret by ID only.

## Output (in `docs/research/hogwarts-legacy/deep/`)

REPORT.md (plain summary first; table of answers with codes D1.., each
mapped to which YAIRPG proposal it sharpens or which new proposal it
suggests, max ten new ranked proposals), one digest per question group
(XP_DIGEST, COMBAT_SHIELD_DIGEST, AI_DIGEST, DIALOGUE_DIGEST,
EXTRAS_DIGEST), NATIVE_CHAINS.md (each chain: REA vs direct Ghidra notes),
COVERAGE.json, CHECKPOINT.md (keep current; a restart resumes from it).

## Uninstall verdict

At the end, add an "Uninstall readiness" section to deep/CHECKPOINT.md:
is everything a later pass is likely to need extracted and hashed (list
any gap, such as the exe for future native chains)? Give a yes/no. Do not
uninstall; Weibao confirms that himself.
