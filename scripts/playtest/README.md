# Playtest bot

Plays a real route in headless Chrome at 1920x1080 and asks every run the same
questions: did anything throw, did a control do nothing, does a save survive a
reload, does the same seed give the same game, does the page overflow. Design and later layers:
[AI playtest harness considerations](../../docs/AI_PLAYTEST_HARNESS_CONSIDERATIONS_2026-10-20.md) (PT1-PT99, with the harness checklist).

```bash
node scripts/playtest/run.mjs                      # two seeded runs, all detectors, exit 0 = pass
node scripts/playtest/run.mjs --self-test          # clean run plus one injected fault per detector
node scripts/playtest/run.mjs --inject stall --runs 1 --out /tmp/pt-stall
```

Options: `--out dir` (default `$TMPDIR/yairpg-playtest`), `--seed n`, `--runs n`
(determinism needs 2), `--inject throw|stall|save|nondet|overflow`, `--shots`
(a PNG per played op in `out/shots`; screenshots can show sealed text, so they
stay in the temp out dir and are never committed).

- Route: `scripts/headless/village_route.mjs`, shared with the Node runner and
  `browser_parity.mjs`.
- Runner: the bundle is built into a temp dir and served on a private
  127.0.0.1 port with `?test_hooks=1`; each open is a fresh browser context with
  seeded randomness and a frozen clock. Tracked `dist/` is never written; no
  window opens.
- Output: `REPORT.md` (verdict table, findings, notes, save hashes) and
  `trace.json` (ops, timings, observation hashes). Neither holds raw save or
  snapshot contents, so sealed truths stay out of reports.

| Detector | Fails when | Injected fault that must trip it |
| --- | --- | --- |
| errors | a page error or console error fires | `throw`: an uncaught exception after op 4 |
| stuck | a target never appears, a click changes neither screen nor save, or 6 ops pass with no durable change | `stall`: the elder's "where am i" line swallows its click |
| roundtrip | reloading a save loses or changes a value, or a second reload still changes it | `save`: the reloaded copy drops an inventory entry |
| determinism | two seeded runs differ at any save point | `nondet`: run 2 uses ambient `Math.random` |
| ui | the page scrolls sideways at 1920x1080 | `overflow`: a 2600px-wide element |

Notes are reported but never fail a run: fields a reload adds (the loader fills
defaults on first load and is stable after that), clipped text and visible
controls with no label.

Not part of `npm test` (it needs Chrome). A clean two-run pass takes about 75 to 100 s;
`--self-test` about 6 minutes.
