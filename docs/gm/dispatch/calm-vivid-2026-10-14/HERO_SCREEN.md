# Park the hero creation screen

2026-10-14. Weibao requested skipping the current Create your hero screen for now.
Implemented and rebuilt; no commit/push. Target 1366×768: Play goes directly to
the normal game without an intermediate creation overlay. Future creation/start
redesign is deferred; its code is retained, not deleted.

Changes: `src/config.js` disables creation; `src/character_creation.js` initializes
an ordinary default identity without starting a second game loop;
`src/main.js` completes this fallback before startup and continues rendering the
Bio view even when creation is disabled. The earlier calmer UI edits are preserved.

Fresh default: Hero, human, adult, ambiguous gender, average height. No surprise
start or optional cheat is selected. Completed characters are untouched. An older
unfinished character keeps its supplied name/bio, fills only missing fields and
sets the existing `is_hero_created` flag before ordinary play. That state is saved
through the normal save path; no new save schema or forced restart.

Checks: `node build.js` passes; current main/config/creation source matches the
rebuilt sourcemap and the served bundle matches disk. Eighteen affected tests pass:
`node --test tests/character_bio.test.js tests/foundation_start_content.test.js tests/start_records.test.js`.
[Browser driver](check-skip-hero.cjs) and [five passing groups](evidence/skip-hero-results.json)
cover fresh Play/no overlay/default identity, save/reload, actual Export/download
and literal-file Import, a populated completed save with distinct identity, and
an unfinished save with one missing bio field. All use isolated disposable
browser contexts, with no page errors or personal saves read/changed.

[Direct-start screenshot](evidence/direct-start-1366.png). The preview at
`http://127.0.0.1:19064/` serves the new build; an already open tab needs a refresh.
Earlier full-suite counts in the calmer Vivid report belong to that preceding
slice; this follow-up ran the affected slice and browser checks above.
