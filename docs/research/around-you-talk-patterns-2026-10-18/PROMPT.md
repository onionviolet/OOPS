# Prompt: how other games handle finding and talking to people (2026-10-18)

Status: ready to run. Running it is research only and authorizes no code change.

## Context

Read first, in this order:

1. `AGENTS.md`, then `docs/RULES_INDEX.md` for the codes that apply (UR35,
   UR41, UR42, UR13, UR52, AD36, AU1-AU15).
2. `docs/AROUND_YOU_SUBJECT_ACTIONS_CONSIDERATIONS_2026-10-18.md`: the
   current proposal (S1-S5, AY1-AY22) and the upstream baseline.
3. `docs/UI_RULES.md` rows UR35, UR41, UR42.

The problem in one paragraph: YAIRPG shows "Around you" in the top center
(who and what is here, with an inspection card) and an Actions panel in the
bottom center (place verbs; conversations render here). The legacy "Talk to
someone" and "Visit a merchant" dropdowns duplicate the people list. The
proposal: select a subject at the top, act on it in the bottom, retire the
dropdowns, always allow talking, and mark unheard lines as new. Target
viewports are 1366×768 and 1920×1080. Mobile is deferred.

## Question

How do other games let the player find who is present, choose someone, act on
them, and know whether talking again is worth it? Where do those games put
inspection and action on screen, and what goes wrong?

Answer these for each game where evidence exists:

- **Q1. Finding.** How does the player learn who is here: list, world sprites,
  map markers, schedules, rumors? Do absent or traveling people show?
- **Q2. Inspect versus act.** Is selecting someone separate from acting on
  them? Where do the verbs appear: on the person, in a menu, in a fixed action
  area? How many clicks or keys to start talking?
- **Q3. New versus heard.** How are unheard topics, heard topics and changed
  topics marked: icons, grey text, ordering, a journal? Is there a marker on
  the person before you open the conversation?
- **Q4. Nothing new.** When a person has nothing new, does the game hide them,
  disable talk, repeat lines, vary repeats, or give ambient barks?
- **Q5. Merchants and services.** Is trade inside the conversation, a separate
  verb, or both?
- **Q6. Conversation placement.** Where does the conversation render, and how
  does the player return to the place?
- **Q7. Scale.** How does it hold up with many people in one place: filters,
  search, grouping, pinning?
- **Q8. Failure reports.** What do players complain about: missed new
  dialogue, marker spam, wasted clicks, hidden NPCs?

## Sources

Start with what this repo already holds. These folders under `docs/research/`
have prior findings, and several have private source or decompile notes in
`private/`. Read their FINDINGS, REPORT or digest files before any web search:

- Text and idle: `kingdom-of-loathing`, `melvor-idle`, `discworld-mud`,
  `magic-research-2`, `groundhog-life`, `bitlife`, `cultivation-idlers`.
- Narrative RPG: `disco-elysium`, `planescape-torment`, `citizen-sleeper`,
  `citizen-sleeper-2`, `sunless-sea`, `sunless-skies`, `book-of-hours`,
  `heavens-vault`, `majoras-mask`, `wildermyth`, `king-of-dragon-pass`,
  `six-ages`.
- Life sim and sandbox: `stardew-valley` (see `DIALOGUE_AND_EVENTS.md`),
  `rune-factory-5` (see `DIALOGUE_AND_HELPERS_DIGEST.md`), `elin`,
  `immortal-life`, `tale-of-immortal`, `scroll-of-taiwu`,
  `amazing-cultivation-simulator`, `kenshi`, `caves-of-qud`
  (see `NPC_FINDINGS.json`), `rimworld`.

Then cover well-known prior art the repo has not studied, from public sources:
Morrowind's topic list, The Witcher 3 and Mass Effect greyed heard options,
Persona social links, Fallen London storylets and A Dark Room. Owned games
not yet read can be source-read read-only under the standing acquisition
task. Buying anything needs Weibao's yes.

## Method

- Unbiased lens: report what each game actually does, including where it
  contradicts the proposal. Label every claim **shown** (seen in source, data
  or play), **stated** (developer docs, wiki, interviews) or **inferred**.
  Cite the file or URL.
- Do not rank games or turn one game into a rule.
- After one failed fetch (login wall, 403), switch routes instead of
  retrying.
- Budget (AU1, AU3, AU7): one coordinator. At most two generated readers at
  once and at most four reader invocations in total, each owning a named
  group of games. No paid or stronger-model fallback. Stop at the first
  exhausted bound and report what is uncovered.
- Long excerpts, dialogue text and decoded data go in the gitignored
  `docs/research/around-you-talk-patterns-2026-10-18/private/`. Committed files
  paraphrase and link there.

## Deliverable

Write `docs/research/around-you-talk-patterns-2026-10-18/REPORT.md` with:

1. A table with one row per game, a column for each of Q1 to Q6, and a
   shown/stated/inferred label per cell.
2. Patterns that recur across at least three games, with codes TP1, TP2 and
   so on, each naming its games.
3. Contradictions: places where good games deliberately do the opposite of
   S1-S5 or AY14-AY18, and why.
4. A mapping from patterns to proposal codes: supports, changes or
   contradicts each S and AY code, with one line of reason.
5. New proposals as a short list coded AY23 onward, labelled as proposals.
   Fold them into the considerations doc as a new round. Do not edit S1-S5
   or earlier AY rows.
6. Coverage: which games were covered, which were skipped and why, and the
   invocations used against the budget.

## Done check

- REPORT.md exists, every table cell carries a label and a citation, and at
  least twelve games are covered, including at least four from the repo's
  existing folders and at least three from outside them.
- The considerations doc has a new round with AY23 onward and links to
  REPORT.md.
- Nothing is called accepted. No runtime code is changed. Commit only these
  paths under shared-worktree practice. Pushing waits for Weibao.
