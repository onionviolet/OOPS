# R15 G4 evidence and replay

REPORT.md is the acceptance record. Raw observations/exports/fixtures are compressed in ARTIFACTS.tar.xz. MANIFEST.json gives original relative paths, byte sizes and SHA-256 hashes. Three raw encoded fixtures remain beside the generator because the regression tests read them. No browser profile is included. Earlier predecessor artifacts and failed retries are retained as history, not pass evidence.

From the worktree root:

```sh
npm run build
npm test
python3 docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g4/unpack.py /private/tmp/r15-g4-artifacts
python3 -m http.server 19140 --bind 127.0.0.1
```

Use separate terminals for the HTTP server and headless browser. First ensure those ports are free; do not interrupt another worker's server. Run:

```sh
node docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g4/harness/repl.cjs /private/tmp/r15-g4-profile-replay /private/tmp/r15-g4-artifacts
curl -s --data-binary @docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g4/harness/steps/helpers.js http://127.0.0.1:19141/
curl -s --data-binary @docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g4/harness/steps/fa14-vale-consumer.js http://127.0.0.1:19141/
```

The driver serializes submitted steps. A response with `ok:false` is a failed run. Do not submit dependent actions until the previous result is known. Most resident/combat scripts reset from an actual encoded fixture. `fa15-pad.js`, `fa15-pad-finish.js`, and some FA20 steps are staged continuations of their named prior state. The saved exports allow explicit restoration before a continuation. `pad-frost.js`, `finish-gaps.js` and `extra-persistence.js` capture final boundary checks. Browser output goes to the extracted scratch tree, avoiding changes to committed evidence. The browser is Chrome channel, headless, 1600×1100, on 19140; eval control is 19141.

`h.click` opens presentation details and selects actual Here/Practice/People tabs when needed, but requires a visible enabled real button. The clock runs actual game callbacks. HackTimer is suppressed solely to keep those callbacks on the page's controllable timer; no game bundle response or gameplay state is replaced. Long jobs use `fastForward` per played minute; incoming combat uses `runFor`.

Fixture creation follows D1/G1's temporary Node bundle. Use `node fixture/generate.mjs INPUT TAG STEPS_JS` from this directory, or absolute paths from the worktree root. `vale-consumer-prerequisites.js` schedules the real three-minute association joining concurrently with Orr's independent six-minute repair, so the subsequent Vale drying can enable harness admission at clock 19 before natural shower expiry at 20. The same toolkit-less Vale funding defect is tested against the retained raw `vale-wet` fixture. Notebook scripts complete actual research, lamp calibration/control, service, temporal deposit, compilation and return; failed source snapshots are labeled FAILED. The Cooking consumer seeds only ordinary coingredients, Cooking XP and the native crafting permission reward. None is a natural acquisition claim.

The report names accepted observations. MANIFEST's archive inventory includes diagnostics too. Generated fixtures marked FAILED/debug, `_explore.png`, old `fa14_rows.json` / `fa14_persistence.json` and initial non-current exports are not positive current acceptance evidence. Load only the named TEST FIXTURE saves into a fresh QA profile.
