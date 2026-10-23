# IM31: flat-gauge check (2026-10-23)

Checklist: IM30 (EMERGENT's flat-gauge traps). Proposal-level findings, not accepted decisions.

## What was run

- `scripts/headless/runner.mjs`, fresh hero, seed 1, **14 game days idle** (one `step(2880)` every 2 days, snapshot each time), about 5 minutes wall, 0 runner errors. Script and log are in the session scratchpad, not the repo.
- Not run: a full life. The bench does about 67 game minutes per second, and an 80-year mortal life is about 62 game years x 518,400 minutes, roughly 5.5 hours. Mortal mode was also not enrolled in the run. Everything about aging and death below is **from source, not from a run**.
- The run did not capture a health value (the save's `character` has no health field I read; the vitals live in the expansion simulation). So "flat health" is also source-based.

## Run evidence

Days 0 to 14, idle in Village: money 102 at every sample, reputation `{Village:0, Slums:0, Town:0}` at every sample, location Village, calendar advanced correctly (day_count 1 to 15).

## The five traps

| Trap | Verdict | Evidence |
| --- | --- | --- |
| T1 Passive play is too easy | **Absent** (the opposite: idle play is inert) | 14 idle days changed nothing: no income, no loss. Nothing rewards waiting. Caveat: idle only, no activities were tried. |
| T2 Reputation behaves as a timer | **Absent** in this sense, but flat | Reputation stayed 0 over 14 days and a grep of `src/reputation*.js` finds no decay or time-gain. It changes only by effects (quest rewards, an assault witness: -2 Village). It is not a timer. It also never moves by itself. At death it is halved (`heir_inheritance.js`). |
| T3 Flat health until late age | **Likely present, source only** | The only aging in the code is the 80-year lifespan deadline (`chronicle.js` `lifespanDeadline`) and a "seasons feel shorter" note in the last year. I found no age-driven change to vitals or capability before that. `body_progression.js` says plainly "no aging". Not run. |
| T4 Isolation without consequence | **Present** | 14 days alone in Village cost nothing and no source defines a loneliness or company state (grep on lonel/isolat/solitude found only unrelated causal-story "isolated" anchors). Household resentment exists but is driven by deaths of staff, not by the player being alone. |
| T5 Natural death in only one mode | **Present, by design** | Old-age ending exists only in `mortal` mode (`life.mode`); `open` mode has no old-age ending (`chronicle_ui.js`: "No old-age ending in this life"). NPCs have an authored `lifePolicy` death (`simulation.js`), which is a third path. |

## Read

T4 and T5 are real flat spots; T3 probably too. T5 is a stated dial (open versus mortal), so it needs a decision, not a fix. T1 and T2 are not traps in the form EMERGENT lists. Follow-up if wanted: enroll mortal mode, fast-forward the last game year with `lifespan` lowered in a fixture, and sample vitals each season (a run that fits in minutes).
