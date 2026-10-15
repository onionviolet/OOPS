# Tooling and mechanical rerun

Repo: https://github.com/nuclear-unicorn/kittensgame.git. Clone: `~/.codex/research/fs-kittens/repos/kittensgame`. Pin and fetched default branch `origin/master`: `781e379f79f1e7512d168849cba21ed111502644`. Commit date2026-08-31; no diff. Main YAIRPG checkout is a shared dirty tree, preserved. Only this dossier was written. No add/commit/push, donor installs or game accounts.

Commands that worked:

```sh
git clone https://github.com/nuclear-unicorn/kittensgame.git /Users/weiwei/.codex/research/fs-kittens/repos/kittensgame
git -C /Users/weiwei/.codex/research/fs-kittens/repos/kittensgame checkout --detach 781e379f79f1e7512d168849cba21ed111502644
git -C /Users/weiwei/.codex/research/fs-kittens/repos/kittensgame diff 781e379f79f1e7512d168849cba21ed111502644 origin/master --stat
python3 -I -m http.server 18743 --bind 127.0.0.1 --directory /Users/weiwei/.codex/research/fs-kittens/repos/kittensgame
node /Users/weiwei/.codex/research/fs-kittens/tools/inspect.cjs
python3 -I /Users/weiwei/.codex/research/fs-kittens/tools/write_dossier.py
```

Read JS/HTML before source boot. Static source needs no package build/install. Browser uses existing `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`, launched headless in a new ephemeral context via existing `playwright-core` from `~/.codex/research/hogwarts-legacy/repos/rea-pinned/node_modules/playwright-core`. Dependency path is a reuse route, not a new installed tool. Browser route permits only the static server origin and aborts every other origin. Script pauses the game, gathers runtime IDs/counts, then sets controlled stock/cap/rate/tech fixtures. It creates a labelled panel through the real price renderer. No fixtures are claimed as naturally earned state. No account UI interaction or storage export/import. Browser closes its own context.

Evidence: `extract/browser-fixtures.json`, two PNGs, `notes/browser-run.txt`, selected source copies in private folder. Hash ledger: `extract/HASHES.txt`, mirrored privately. Disk usage in CHECKPOINT. Installs: **none**. Script rerun overwrites only lane-owned outputs/evidence.

Dead ends: initial source search guessed `js/core.js`; actual path is root `core.js`. React source is named `js/jsx/left.jsx.js`, not `.jsx` or `left.js`. `playwright` was not resolvable from the donor clone; reused existing playwright-core rather than installing. An initial ignore check ran inside the donor clone and therefore did not test the YAIRPG rule; final check runs in YAIRPG. No failed network fetch required a route switch. External fonts/telemetry/account bridge/price calls were intentionally blocked, recorded in browser JSON.

No donor unit suite was run; it would not validate the requested tooltip/native progression claims. Verification is targeted source plus controlled price/tech browser fixtures and dossier schema checks.
