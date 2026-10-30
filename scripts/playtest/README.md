# Playtest bot

Plays a real route in headless Chrome at 1920x1080 and asks every run the same
questions: did anything throw, did a control do nothing, does a save survive a
reload, does the same seed give the same game, does the page overflow. Design and later layers:
[AI playtest harness considerations](../../docs/AI_PLAYTEST_HARNESS_CONSIDERATIONS_2026-10-20.md) (PT1-PT112, with the harness checklist).

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

## Floor runner (AD43 browser floor)

`floor_run.mjs` plays one scenario file in the same headless Chrome stack (`lib.mjs`) and writes a short receipt.

```bash
node scripts/slot_run.mjs --kind browser -- node scripts/playtest/floor_run.mjs scripts/playtest/scenarios/lotm_be_seat.json [--out dir]
```

- Scenario: JSON `{name, seed, privatePacks, steps}`. Ops: `nav {id}`, `click`, `wait {ms | target}`, `expect {target, matches?, absent?}`, `step {minutes}`, `shot {name}`, `roundtrip`. A target is `selector`, `ref` (`key=value` means `data-key="value"`) or `text`/`textRe` (matches buttons and summaries), with optional `within` and `nth`. `click` takes `reload: true` when the click starts a new life through a page reload (be seat `enroll_be`).
- `roundtrip`: Export download, reload twice (no lost or changed data, idempotent loader, same rules as `run.mjs`), then Import of the exported file must load to the reload state.
- Output (default `$TMPDIR/yairpg-floor/<name>/`, private, screenshots can show sealed text): `receipt.json` (bundle hash, steps passed, page errors, roundtrip), `export.txt`, PNGs, `fail-step-N.png`. Exit 0 only when all steps pass with no page errors. `privatePacks: true` lets the local cast pack load; otherwise the manifest is blocked.
- Scenarios: `lotm_be_seat.json`, `lotm_divination.json` (both need `private_packs/lotm-cast`). Receipt parsing is tested in `tests/floor_receipt.test.js`.
