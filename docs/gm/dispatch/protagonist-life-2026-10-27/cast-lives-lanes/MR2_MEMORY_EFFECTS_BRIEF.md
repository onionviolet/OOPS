# Lane brief: MR2, memory effects (P3: bonds from episodes, a reaction that names its episode, gossip along bonds)

Model: `gpt-6.1-sol`, medium (engine, save and UI hunks; ON12; Weibao 2026-10-29: "Start P3"). Local,
`/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; never stash, reset, force or push. Publication class: public
code (name-free). Rules: `.claude/rules/runtime-code.md` AR1-AR16, `.claude/rules/player-ui.md` and
[UI rules](../../../../UI_RULES.md), AD36, AD38, AD43, AD45, MD1-MD3, CLR2, CLR3, CLR9, CLR12, FLR1-FLR6; keyed draws only
(LSD139). Design: [LEAD_LIFE_SYSTEMS_DESIGN](../LEAD_LIFE_SYSTEMS_DESIGN.md) LSD301, LSD303, LSD331, LSD333, LSD352,
LSD356, LSD357, LSD361, LSD373, plan row LSD377 (P3 part). Builds on [MR1_CHECKPOINT](MR1_CHECKPOINT.md) ("P3 needs")
and `src/person_memory.js`, `src/check_keys.js`. Write constraints as default, dial and reason.

## Why

MR1 gave people a place to keep episodes, but nothing writes or reads them, and its save-slice patch
(`MR1_INTEGRATION.patch`) is held until a first consumer exists. This lane is that consumer: one ordinary route where
something the player does to a person becomes that person's memory, changes how they treat the player, and is named
when it does.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Player actions in a fresh game that emit a `relationship` effect (`src/simulation_effects.js`, the `e.type === "relationship"` branch) | at least 1 | | yes: if none, pick the nearest existing player-to-person action and record it |
| Places the player already sees a person's attitude or relationship (people, chronicle or simulation panels) | at least 1 | | yes |
| Existing tests pinning `simulation_effects` relationship writes | some | | they must pass unchanged |

Avoid the LOTM host files (`src/book_world_lotm_*`): other sessions have uncommitted edits there. Prefer the generic
simulation route (village start or whichever fresh-start world reaches a relationship effect first).

## Scope and seam

- Outcome and player sentence: after the player helps or harms a person through an existing action, that person keeps
  an episode (`helped` or `harmed` by the effect's sign; `witnessed` for others present if the route has a present list).
  Later, where the player sees that person, a line shows their changed manner and names the episode at the player's
  perception ("Wary of you since you shoved him at the well"), never a hidden number (LSD333). When the episode has
  faded below a stated vividness, the line softens or disappears. When there is no episode, nothing new shows (CLR4).
- Bonds (LSD373): a bond axis read is derived as the existing stored axis (treated as the baseline) plus the sum over
  the holder's episodes about that subject of kind weight x feeling x current vividness. Expose this as a read only;
  do not rewrite the stored axis and do not double-count the effect that also wrote the stored axis (record how).
- Gossip (LSD356): a daily, keyed step (via `checkKey`) lets a holder tell one strong episode to one bonded person who
  is actually co-present or connected in the existing simulation, using `tellMemory`. Bounded per day; no new travel.
- Seam (AD45): a world-neutral leaf `src/person_memory_effects.js` (episode from an effect, derived bond read, reaction
  line choice, gossip step) importing `person_memory.js`, `check_keys.js` and `gen_kit.js` only. Shared hunks go in
  `cast-lives-lanes/MR2_INTEGRATION.patch` (CLR9): the MR1 domain registration (carry MR1's patch forward into this one
  so one patch applies), the hook where the relationship effect is applied, and the one UI line in the existing panel.
  Keep `main.js` at net zero (AR rules).
- Files owned: `src/person_memory_effects.js`, `tests/person_memory_effects.test.js`, `tests/person_memory_route.test.js`,
  `cast-lives-lanes/MR2_CHECKPOINT.md`, `cast-lives-lanes/MR2_INTEGRATION.patch`. You may make small fixes to
  `src/person_memory.js` and its tests if P3 needs them; list each. Everything else read-only.
- Text: lines render from kind and payload through a small template table (LSD372), not stored prose; English first,
  Chinese if the panel already has a Chinese path.
- Actor parametrization (CL225): holders and subjects are ids; nothing reads "is the lead"; tests include two
  non-player people telling each other.

## Work and done check

- Failure cases: a repeated delivery of the same cause writes one episode, as the axis receipt already guards; a told
  copy never exceeds its source's certainty; gossip with no bonded co-present person does nothing; an old save without
  the `memory` slice loads as empty and shows no new lines.
- Route test (FLR2, FLR5): in a disposable copy with the patch applied, a headless native run takes the real action,
  shows the named line in the panel's rendered text, then Save, reload, Export and literal Import keep it; a later day
  with the episode faded changes or removes the line (follow `tests/person_memory_persistence.test.js`).
- Verification: `node --test tests/person_memory_effects.test.js tests/person_memory_route.test.js tests/person_memory.test.js tests/person_memory_persistence.test.js`
  plus the existing tests of `simulation_effects` and the touched panel (name them), and `npm run check:arch` with no growth.
  `git apply --check` the patch against the current tree. Report input SHA-256 of files read.
- Done when: focused tests pass; the checkpoint says "implemented, below floor" with FLR lines, the exact action and
  panel used, a synthetic example of the line, how double counting is avoided, and the steps for the coordinator,
  who applies the patch and runs the rebuilt 1920x1080 browser check (Codex cannot start Chrome).
- Stop conditions: no player action reaches a person in a fresh game, or a change in a shared file that no prepared
  patch can carry.
- Ambiguity default (CLR12): the smallest visible line in the existing panel; derived reads over new saved values.
- Out of scope: allies' goals in fights (P5), crowds (P6), canon baselines from private packs, new panels.

Do not commit. Keep canon names and source text out of tracked `src/` and `tests/` (CLR3).
