# Village choices: every option, player's pick, 2026-10-09

Dispatched 2026-10-09 by Claude Code. Weibao: "Depends on my choice,
implement each possibility, and make that the general state of things that
anything is possible". Recorded as an accepted decision in PROJECT.md
("Anything is possible").

One writer. Follow AGENTS.md and docs/GAME_MASTER_PROMPT.md. Preserve
unrelated dirty work. No commits or pushes. Private saves untouched. The
Soldier's Life lane will wait for this lane's CHECKPOINT to say "released"
before touching src; finish promptly and say so.

## Part 1: teaching cost is the player's choice

The current [mentor slice](../village-mentor-2026-10-09/REPORT.md) withholds
10 coins from the shared round when you teach Iona. Replace the single rule
with a choice shown before teaching, each with honest previewed terms:

- **Pay:** current behavior (10 coins from the shared round).
- **Time:** no coin cost; the teaching round earns no pay and takes the full
  shift.
- **Favor:** no coin cost; Iona owes you a favor, recorded and visible.
  Spend one favor later on one concrete benefit (e.g. she covers one of your
  shifts and you still get its pay, or she fetches one item). Keep it to
  one or two authored uses.
- **Free:** no cost at all. The only tradeoff is that you cannot start
  another activity during the teaching minutes.

Iona's memory of you records which way you taught her, and one line of her
dialogue differs by choice.

## Part 2: apply the principle to the rest of the Village slices

Audit the career, study and mentor slices for any other single forced
answer where a reasonable alternative exists (e.g. the kit: return, pay, or
keep as debt already exists; study: read the notes, or have Tessa teach you
in person for time). Add at most three more choices, each small and
previewed. List the audit in REPORT.md, including places where you decided
one answer is right and why.

## Gate

`npm test`, `npm run build`, fresh-origin browser journey for every choice,
save, reload, import, older save (schema before this change) loads.
Anything not exercised goes in ACCEPTANCE_BACKLOG.md.

## Output

CHECKPOINT.md (end with "SRC RELEASED" once your last src write is done),
short REPORT.md, PROJECT.md proposal entry.

## Addendum (Weibao, 2026-10-09): teaching should not feel like paying

Weibao: "If I am teaching her, why would I need to pay?" He is right that a
fee reads wrong. Reframe and extend the options:

- **Teach on your shift (was "Pay"):** not a fee. You spend part of the
  round teaching instead of patrolling, so the post pays you 10 less for
  that round. The preview must say it this way ("lost wages, you worked
  less"), never "pay 10 coins".
- **Paid mentor (new, the default for a Mentor-rank guard):** the post or
  Tessa pays you a small teaching stipend on top of the round, because
  training recruits is part of a Mentor's job.
- **Time, Favor, Free:** as in Part 1.
- **Iona pays you (new, optional):** she offers a small tuition from her
  first solo stipend; you can accept or decline, and her memory records it.

Old saves that already used the withheld-wage teaching keep their history;
label it "taught on your shift".
