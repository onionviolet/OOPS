# Achievement deeds (2026-11-10)

Weibao, 2026-11-10: "Achievements? other stuff? relationships?" and "Feel free to also adapt and adjust things to fit our purpose better too."
Rows and names are proposals (AD32); they open play and narrow nothing (AD56).

## What changed

Achievements grew from six naming and crafting rows into **deeds** read from what actually happened. The store is unchanged:
`src/achievements.js` keeps `yairpg.profile.v1` (localStorage, outside the save, not in Export, survives a new run, AR6 decision as before).
`unlockEarned` takes an optional catalog so deeds share that one store and record shape (`{at}` per id).

- `src/deeds.js` (pure): the deed catalog in three groups, `deedFacts` over records other owners keep, and `routeIsOwn` over a beat result's `via`.
- `src/deeds_ui.js`: a Deeds panel in Records, refreshed by its domain (no save slice), with a toast, a log line and the discovery feedback.
- `src/book_world_lotm_cast_host.js`: one line hands each tick's results to `observeBeatRoutes`, because `via` is not saved.
- `src/main.js`: two ports in the existing `mountWorkspaceNavigation` line (`continuation`, `lifeRecord`); line count unchanged.
- `src/layout_spec.js`: a `deeds` surface entry (ST6, records column, proposal) so the UI contract knows the panel.

| Group | Deed (id) | Reads | Hidden until earned |
|---|---|---|---|
| Another way | By Your Own Road (`deed.own_road`) | a lead result `altered`, or `carried` with a `via` fact written by `emergent`/`divergent` play; also saved ledger rows `altered` | no |
| Another way | It Found You Anyway (`deed.found_you`) | `canonPull.records` outcome `restored` | yes |
| Another way | In Your Place (`deed.in_your_place`) | outcome `substituted` | yes |
| Another way | Off the Page (`deed.off_the_page`) | outcome `deviated` | yes |
| Firsts | Cracked Shell (`deed.first_hatch`) | manor brood roster past the egg stage | no |
| Firsts | The Same Month Twice (`deed.month_again`) | `motherOfLearning.runs` ≥ 2, or a looped continuation life's attempts | no |
| Firsts | Marks on the Board, Top of the Paper (`deed.exams_sat`, `deed.top_paper`) | saved HP exam bands `hp.lead.exam.band.*` | no |
| Lives | A Second Life, Many Lives (`deed.second_life`, `deed.many_lives`) | chronicle heir generation, ended continuation lives | no |
| Lives | Across the Threshold (`deed.crossing`) | life record `observed.crossings` | no |

## What I adapted from the bank, and why

- **KoL trophies, hidden until done:** the pull deeds are hidden rows; the panel counts them ("2 more deeds here show themselves when you do them") and never shows their text early. This is also how a deed tied to a sealed turning stays sealed: its row says nothing until earned, and receipts use the row id.
- **Melvor and Idleon tiers dropped:** both bank folders leave their achievement semantics unread, and tiers of one counter ("10, 100, 1000") are the counter shape this slice replaces. Deeds read records, so a "first" and a "lives" count are enough.
- **PX11 records, PX25 what's new:** each held deed shows the date it was done; a Records panel is the start of PX11's one Records view. PX25's build manifest is not built.
- **No power:** as before (AD38). A world may still set `grant` later.

## Gaps (named, not built)

- **First case closed:** no saved "case closed" record exists (`law_case.js` is a pure seam; the law-observation lane is active). The deed waits for that owner's record, not a new counter.
- **`via` is not saved:** the ledger keeps `{status, day, causes}` and older builds reject other keys, so the own-road deed reads `via` live through the host hook. The current LOTM pack has no `altered` rows and pins the lead's turnings in canon runs, so own-road is reachable only through open-run play or a pack that authors other branches. Tested on the Village line (`vl.route_taught`).
- **Lives across runs** come from one save's chronicle and continuation. The profile keeps the unlock across runs, not a cross-run count.

## Checks

Review state: agent-verified, not human-reviewed. Target viewport 1920×1080 desktop; mobile deferred.

- FLR build: `npm run build`, OK; probe ran on the rebuilt bundle (the `layout_spec.js` entry came after and changes no runtime path).
- Focused: `node --test tests/deeds.test.js tests/ui_contract.test.js`, 7 pass, 0 fail.
- Full: `npm test` (limiter), first run 5925 pass, 1 fail (`deeds` had no `LAYOUT_SPEC.surfaces` entry), fixed. Rerun 5925 pass, 1 fail: `beat_ledger.test.js` headless reload hit a pack-registration mismatch because the `private_packs` link was removed and restored mid-run; that file alone passes 5/5 with the link in place. The deeds and UI contract tests passed in both runs.
- `npm run check:arch`, exit 0 (main.js growth 0). `npm run check:rules`, exit 0; one new TMR1 warning sits in `book_world_hp_exams.js`, not this lane; player text 0 new engine-vocabulary strings.
- Browser (`node scripts/playtest/deeds-probe.mjs <out>`, headless, fresh origin, seed 7, earned steps): enrol as the Tingen lead, walk to the street market, wait past day 3. Pull record `lotm.v1.pull.b1` outcome `restored`; the hidden deed `deed.found_you` unlocked with a log line and toast, plus `deed.crossing` from the enrolment crossing. Before the walk the Another way group showed one open row and "3 more deeds".
- Persistence: deed rows and pull record survive save and reload, Export and Import (the export holds no profile, as designed), and a new run (save removed, world `base.frontier`) still shows both deeds from the profile. `report.json`, `deeds-panel.png` (log lines), `deeds-new-run.png`.
- Gaps: 15 console 404 resource loads during the run (same message, no URL captured; not traced). The panel screenshot shows the Reports log, not the Deeds panel opened from Records; panel text is from the DOM. `deed.own_road` is test-only (Village line), and the substituted and deviated pull deeds are covered by the seed sweep test, not a browser run.
