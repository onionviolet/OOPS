# S1: second frontier potion (toxin binder), 2026-10-22

Applies AR1, AR2, AR6, AR11, AD36, AD38, MR1/MR4, GN5/GN11 (generation seam second proof, named fixture).
Target viewport: desktop 1920x1080 (standing UI priority); mobile deferred. Small panel edit in `src/crafting_home.js`
(follow-up, Weibao asked to address the gaps): wording now "Village experiments", gather button "Gather from the Village verge",
and a steep level select (1-3). Grind/boil still need a station the runtime does not supply.

**Journey.** Harvest the Village verge (now also yields riversalt, weight 1 of 4) -> brew salt alone (steep 1) ->
drink. The law gained an oral output `bind` on the `ash` axis (per 150); a preparation with `bind > 0` shortens every
poison-tagged active condition by that many minutes (ending it at zero) and saves a `Toxin binding` mark
(60 min, dose recorded, no other stat). Herbal tonics are unchanged except boiled ones also gain ash and so bind.
A pure binder leaves the tonic effect alone. Poison shortening is in `shortenPoison` (pure); `crafting_domain.js` applies it
inside the existing native rollback transaction.

**Second proof (AR11).** `binderGrammar` on the same law, no engine edit. 500-seed check in `tests/craft_engine.test.js`:
no fallback, unique ids, bind 5..33 (median 15, p95 29), ceiling 45, tail not runaway.

**AR6.** `frontier.brew` revision 1 -> 2 (new output row). Old products fail law-ref validation; permitted by the 2026-10-17
reset/drop decision for old state. Newly created state round-trips (browser check). Saved effects are keyed by id, with
`Toxin binding` validated like the herbal exposure.

**Files.** src/craft_content_frontier.js, src/crafting_frontier_runtime.js, src/crafting_domain.js, tests/craft_engine.test.js,
tests/crafting_runtime.test.js, scripts/field_fixtures.mjs (`BINDER_FIXTURE`, `seedBinderPoison`, DEV SEEDED), scripts/binder_browser.cjs.
`main.js` untouched.

**Gaps.** The binding mark has no stat reader beyond poison shortening (a ward against new poison needs a hook in the
native effect-apply path, outside these files). The browser run uses a DEV SEEDED venom, not one met in play. Human acceptance not
claimed. Panel clicks are real Playwright clicks (three consecutive passes). Private fonts are untracked in a worktree, so
404s under /resources/fonts/private/ are ignored by the script; any other failed request fails it.
Evidence: evidence/BINDER_BROWSER.json.
