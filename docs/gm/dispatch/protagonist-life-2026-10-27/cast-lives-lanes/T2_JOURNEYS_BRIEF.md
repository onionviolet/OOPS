# Lane brief: T2, pack-driven journeys by means, fare and duration (travel family: 1,107 whole-book gaps, paid transport 161)

Model: `gpt-6.1-sol`, medium. Local, `/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; never stash, reset, force
or push. Read first: [D2_CHECKPOINT](D2_CHECKPOINT.md) and `src/cast_topic_talk.js` (the pack-driven command pattern, its
host registration, UI disclosure and save-validator lookup, now all committed), [H1_CHECKPOINT](H1_CHECKPOINT.md),
[X4_CHECKPOINT](X4_CHECKPOINT.md) Resume 1 (travel family), [L4C_CHECKPOINT](L4C_CHECKPOINT.md) (cast walks and districts).
Rules: `.claude/rules/runtime-code.md` AR1-AR16, AD36, AD38, AD43, AD45, MD1-MD3, CLR1-CLR12, LSD60 (work, law, needs).
Publication: public code (name-free) in `src/` and `tests/` with synthetic ids; canon rows only in private packs.

## Why

The existing walk controls cover a resolved walking destination between pack places. The book's travel is also by public
carriage, ride, boat, train, returning to a place, going somewhere in a stated time, or crossing into another realm.
Each has a means, a fare or a cost, a duration, hours it runs, and sometimes a reason it cannot. One pack-driven mechanism
carrying those rows unlocks the travel family without a per-trip special case.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Native stock a journey can reuse (movement command, time cost, purse payment, existing carriage or transit if any) | list | | yes |
| How cast walks (`castWalkId`, districts, same-district 2-minute default) compute duration and eligibility | list | | yes |
| Where D2 registered pack commands, quotes, reports and the validator lookup (to copy exactly) | list | | yes |

## Scope and seam

- A world-neutral module `src/cast_journeys.js` modeled on `cast_topic_talk.js`: `defineJourneys(data, ports)` turns pack
  rows `{id, from, to, means, label, minutes, fare, hours:[from,to], requires, report}` into native commands that move
  the actor through the single location authority on completion, charge the fare through the existing purse owner, and
  quote cost, duration and every blocked reason (closed hours, no fare, not at the origin) before commit. Arrival goes
  through the same path as cast walks (CLR10: one location authority, no second clock). Absent means silent (CLR4).
- Files owned: `src/cast_journeys.js`, `tests/cast_journeys.test.js` (synthetic ids and a disposable native fixture),
  `src/book_world_lotm_cast_host.js` (one registration site like D2's, `journeys` pack field), `src/book_world_lotm_host.js`,
  `src/book_world_lotm_state.js` (validator lookup, as D2's patch did), `src/book_world_lotm_ui.js` and
  `src/perspective_controls.js` (journey disclosure under the existing place panel with its perspective tag),
  `tests/perspective_controls.test.js`, `cast-lives-lanes/T2_CHECKPOINT.md`. No `main.js`, no `private_packs/`. Another Luna lane
  edits only `scripts/` and `build_*` tests.
- Save: pending journeys are JSON jobs validated by the owning validator; no new save slice; pre-T2 saves stay valid.
- UI: 1920×1080 desktop, the existing place panel, no new panel. Mobile deferred.
- Fixture: synthetic pack with three places, a carriage journey with fare and hours, a return-to-place journey, and one blocked case.

## Done check

Focused tests pass (quote, commit, fare, closed hours, arrival through the cast location authority, save/reload through the
real validator, Export/Import); `npm run check:arch` no growth; lane review; checkpoint with FLR lines and a plain statement
of what is below floor. Ambiguity default (CLR12): where fare has no purse owner for a cast actor, quote it as unpaid fill and name the owner needed.
