# W36 desktop journey: local date line and weather words (2026-10-14)

Root (Claude) integration record for the slice Weibao asked for: "hand W28
climate and W33 calendar to integration as one slice, ending in a visible
local date line and weather words, proven in a rebuilt desktop journey".

## What was integrated

| Commit | What |
|---|---|
| `024d4da9` | W28 pure per-world climate module and tests |
| `b0bb853b`, `f903ec1a` | W36 calendar profiles, projector, log date headers, visitor weather words |
| `45c75e9c` | CR8: home rain no longer feeds pacing in visitor worlds (`homePacingContext`) |
| `fea26247` | Merge onto the shared branch head (one import conflict in `main.js`, resolved by keeping both) |
| `63f4b02e` | Pre-existing bug fix found during the journey: `book_world_paradise_host.js:55` read `m.extraction` with no mission, so the Paradise panel threw on enrollment (since 2026-10-07) |
| `51b045e0` | Merge of later shared-branch docs; fast-forwarded `codex/gameplay-foundations`. Not pushed. |

Tests on the merged tree: `npm test` 1381 tests, 1378 pass, 0 fail, 3 todo
(pre-existing). `npm run build` clean. Bundle `d46d820615c4`; the served
bundle hash matched the built file.

## Journey (rebuilt bytes, fresh origin http://localhost:18236, 1366x768)

| Step | Result |
|---|---|
| J1 home | Fresh game: exactly one `[ Home · 01/04/999, Summer, Mon ]` header; home weather display unchanged (numeric, smoothed). |
| J2 Cyoria | Elder hello, Notebook route, enter visitor instance: `[ Cyoria visitor · 01/01/1 ]` header; weather field `Dry · 8.0°C · climate proposal`. Screenshot `evidence/w36_cyoria_1366x768.jpg`. |
| J2 return | Back in Village: a fresh Home header, home weather back to numeric. |
| J2 Paradise | Entry first blocked by the pre-existing extraction crash; fixed (`63f4b02e`), rebuilt, reloaded. Hub: `[ Paradise hub · Shift day 1 (local elapsed; civil date unknown) ]`, weather `Weather unknown · Paradise hub`, no invented number. Screenshot `evidence/w36_paradise_hub_1366x768.jpg`. |
| J2 Goa | `[ Goa · 01/01/1 ]`, `Dry · 19.0°C · climate proposal`. |
| J3 reload | Save then reload: one current header, old headers not replayed. No calendar keys in the save (no persisted fields, as designed). |
| CR8 rain | Seeded test state: save edited on this test origin only to home day 5 (a home rain day). In Goa after local travel: no Wet, rain counter 0, local words shown. Back in Village: home rain icon and 23.5°C, so home rain still works. |
| Errors | All `extraction` console errors came from the pre-fix bundle; none on `d46d820615c4`. Only other errors: expected `private_packs/manifest.json` 404. |

## Open, stated plainly

- **Export and literal-file Import not run.** Export downloads a file and
  Import needs a file picker; both need Weibao's go-ahead in this browser.
  The slice adds no persisted fields, so the risk is low, but the gate is
  OPEN.
- **Before-fix rain leak not observed in play.** The home clock does not
  advance while you are in a visitor world, so the Wet path may never have
  been reachable through idle time; the `weather.raining` fact was. The fix
  is source-verified and the after state is clean.
- **Top time bar still shows the home date in visitor worlds** (W36.F3 by
  design). The local date is in the log header only. Next visible fix.
- The page returned to the title screen once on its own near the end; no
  error was logged. Not reproduced.
- Director acceptance (how it looks and reads) is separate and pending.
