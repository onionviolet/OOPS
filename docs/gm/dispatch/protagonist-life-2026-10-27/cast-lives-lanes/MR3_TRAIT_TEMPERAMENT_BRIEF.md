# Lane brief: MR3, trait temperament on memory (P3b: grudges, gratitude, forgiveness, gossip temperament, adjustable limits)

Model: `gpt-6.1-sol`, medium (save-schema and design judgment in `src/`; Weibao 2026-10-30: "Start P3b"). Local,
`/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; never stash, reset, force or push. Publication class: public
code (name-free). Rules: `.claude/rules/runtime-code.md` AR1-AR16, `.claude/rules/player-ui.md` and
[UI rules](../../../../UI_RULES.md), AD36, AD38, AD43, AD45, MD1-MD3, CLR2, CLR3, CLR9, CLR12, FLR1-FLR6; keyed draws only
(LSD139). Design: [LEAD_LIFE_SYSTEMS_DESIGN](../LEAD_LIFE_SYSTEMS_DESIGN.md) section 38 (LSD393-LSD407, plan row LSD407),
LSD431-LSD435 (readable numbers, target tests, sensitivity, revisions), LSD437-LSD439 (lazy cached reads, benchmark) and
LSD441 (adjustable limits). Builds on [MR1](MR1_CHECKPOINT.md) and [MR2](MR2_CHECKPOINT.md): `src/person_memory.js`,
`src/person_memory_effects.js`, both integrated and committed. Write constraints as default, dial and reason.

## Why

MR1 and MR2 give people memories that change their manner, but everyone remembers the same way. Section 38 makes
traits tune memory: grudge holders keep harm, forgiving people let it go after amends, loyal people keep help, sociable
people gossip more. LSD441 makes the limits adjustable. The route already exists: the village craftsman has social
commands for asking about his habits, interrupting his work and a practical apology (`src/simulation_effects.js`
relationship effects; the workshop line in `src/simulation_ui.js`).

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Simulation people (village craftsman included) with any trait or temperament data | 0 | | no; record where person definitions live |
| Generated people trait words (`src/generated_people.js`) | 6 | | no |
| Village social commands with a negative relationship amount and with an apology | at least 1 each | | yes: needed for the amends route |

## Scope and seam

- **Temperament port (LSD393).** A per-holder read `temperamentOf(holderId)` derived from trait words, never saved
  separately. Traits are dials on MR1's constants: fade half-life per kind, recall ease per kind, telling rate and
  certainty loss, hearsay trust, amends weight. MR1's numbers are the defaults. Trait words live in one registry a world
  extends (LSD305): map the six existing generated-people words and add a `grudging`/`forgiving` pair (and `loyal`/
  `ungrateful` if cheap). Simulation people get temperament from their person definitions as authored data with a
  stated reason; give the village craftsman a temperament as a labelled proposal, not canon.
- **Amends (LSD396).** Add an `amends` episode kind (append to `MEMORY_KINDS` so existing tuple indices stay valid; say
  in the checkpoint whether a schema bump is needed). An amends episode about the same subject lowers the weight of
  harm episodes in derived reads by an amount the holder's temperament sets; the harm stays remembered. The practical
  apology command is the first writer.
- **Effects to drive:** LSD394 (grudge holders keep harm vivid; forgiving people let it fade faster, faster again after
  amends), LSD395 (gratitude), LSD398 (gossip temperament: rate, slant, listener trust), LSD399 (the workshop line can
  name the trait as seen, for example "still brings up the interruption", and the existing known-traits route fills
  only when the player sees it act), LSD401 only as a stub flag on a vivid harm in a grudging holder (no revenge behaviour).
- **Limits table (LSD441).** One table of memory limits and thresholds (caps, byte budget, fade defaults, telling loss,
  reaction vividness) read by `person_memory.js` and `person_memory_effects.js`, defaulting to today's values, with a
  per-world override port. The worst-case size test reads the table.
- **Numbers (LSD431-LSD435).** Readable units (half-lives in days, percent), one-line reason per constant, a table
  `id@rev`. Target tests in words, for example "a grudging holder is still cold 180 days after an unapologised
  interruption; a forgiving holder is warm again within 30 days of amends". A sensitivity sweep (each constant ±25%)
  records which targets break, in the checkpoint.
- **Cost (LSD437, LSD439).** A benchmark test derives every bond for 300 holders at the caps and asserts a time budget
  (start at 50 ms, record the measured number); add a per-holder/subject/day cache only if the benchmark needs it.
- Seam (AD45): keep new logic in `src/person_memory.js`, `src/person_memory_effects.js` and a new
  `src/person_temperament.js` (registry and port). Shared files (person definitions, the apology command, the workshop
  line in `src/simulation_ui.js`, any registry wiring) are small hunks; no other session currently edits them, so edit
  them directly, keep `main.js` at net zero, and list every shared hunk in the checkpoint.
- Files owned: `src/person_temperament.js`, `src/person_memory.js`, `src/person_memory_effects.js`,
  `tests/person_temperament.test.js`, `tests/person_memory*.test.js`, `cast-lives-lanes/MR3_CHECKPOINT.md`, plus the
  listed shared hunks.
- Actor parametrization (CL225): nothing reads "is the lead"; tests include two non-player holders.

## Work and done check

- Failure cases: an amends episode never deletes the harm episode; two holders with the same history and different
  traits give different derived bonds and lines, and each replays identically; an unknown trait word is ignored with
  defaults, not an error; an old save loads unchanged; a lowered limit folds or forgets on the next write.
- Route (FLR2, FLR5): headless native route through the real commands: interrupt the craftsman, see the line turn wary,
  apologise, see it soften by his temperament; Save, reload, Export and literal Import keep it. Follow
  `tests/person_memory_route.test.js`.
- Verification: `node --test tests/person_temperament.test.js tests/person_memory*.test.js` plus the existing tests of
  `simulation_effects`, `simulation_ui` and the touched content (name the files), and `npm run check:arch` with no
  growth. Report input SHA-256 of files read.
- Done when: focused tests pass; target tests and the sensitivity sweep are recorded; the benchmark number is recorded;
  the checkpoint says "implemented, below floor" with FLR lines, the trait table, the limits table, the shared hunks and
  the steps for the coordinator, who runs the rebuilt 1920x1080 browser check (Codex cannot start Chrome).
- Stop conditions: no apology or negative social command reachable in a fresh game; a needed change in a file another
  session is editing (check `git status` before editing any shared file; if dirty, write a prepared patch instead).
- Ambiguity default (CLR12): the fewest trait words that make the targets pass; derived reads over saved values.
- Out of scope: revenge behaviour, trait drift (LSD400), group grudges (LSD402), mood (LSD397), severity and secrecy
  (P3c, LSD412-LSD424), new panels.

Do not commit. Keep canon names and source text out of tracked `src/` and `tests/` (CLR3).
