# Ritual conditions and contribution checkpoint (DWF160, DWF162; DWF145-DWF149, DWF154, DWF155), 2026-10-25

Rules applied: AD36, AD38, AR1-AR16, MR (truth vs knowledge), UR (disclosure), WPR5 (authored figures are labelled proposals). Target viewport: desktop 1920x1080 and 1536x864; mobile deferred. Branch `claude/ritual-contribution-23b3bd`; not pushed or merged.

## Built

Slice 1, rituals (playable in Tingen):
- `src/ritual_conditions.js` (leaf, beside `dose_process.js`, which is untouched): `defineRitual`, `gradeRitual`, `fitScore`, `ritualDial`. Conditions are `evaluateRule` predicates; each has a principle (trait lists, symbolic counts double) and substitutes scored by fit against a world floor. Grades: met, substituted, partial, absent, with stated odds from dials (base 5, max 90, 7-day recovery, all PROPOSAL). Never a lock.
- `src/book_world_lotm_ritual.js`: Sun 5 (non-melting ice, pure darkness) and Visionary 5 (contracted harpy feather, strong feeling within 60 minutes). Authored proposal routes: ordinary ice, blackout canvas and non-melting ice (docks, broker), a harpy contract and a lesser messenger pact, two ways to stir a feeling (10 min). `gradeRiteAtTransition(formulaId, facts)` is the hook a drinking command calls.
- Wiring: actions (commands, flags, facts), content (5 items), host (`bench.selected.rite`), ui (rite block in the bench). `FORMULA_ROWS_REVISION` not bumped.

Slice 2, contribution:
- `src/institution_store.js` (leaf): `defineInstitution` (missions, store rows with price, stock, gate), `offerFor` (every refusal has a reason), `auditLedger`.
- Nighthawks: `src/book_world_lotm_merit.js`. Merit is a resource pair (earned, spent) plus bought counters on the player, no new save slice; assertions in `validateLotmState`. Two timed assignments (file copy 30 min for 1, cold-room watch 60 min for 2), store: Sequence 8 Light Supplicant formula copy 8 merit, crystal sunflower lot 3 merit (stock 2). Merit section in the Tingen panel.
- Sect: the existing Primordial Saint Sect slice. CP in hand is the contribution, the Library shelving mission earns it, and a treasure hall spends it: fire grass 8 CP (stock 3), breathing primer 20 CP, Killing Life Curse 300 CP (SOURCE c0011 p46). Slice gains additive `store: {spent, bought}`; `migrate` defaults it, `validateSlice` checks it.

## DWF148: the same mechanism elsewhere (not built)

- Cultivation breakthroughs: conditions over place (a spirit vein), held stones or pills, a guardian present and weather; graded at the breakthrough command; the dial sets qi-deviation odds; recovery window = the existing grace rules.
- HP Animagus preparation: conditions over weather and moon phase across days (a timed-note fact like the feeling window here), graded when the preparation ends; needs a moon fact the game lacks.

## Checks (one line each)

- `node --test tests/ritual_conditions.test.js tests/institution_store.test.js tests/primordial_credit.test.js tests/dose_process.test.js tests/lotm_*.test.js`: all pass after the final edits (ritual 8, institution 7, primordial 14 unchanged).
- `tests/lotm_commands_golden.test.js`: pass, golden fixture untouched.
- `npm run build`: ok. `npm run check:arch`: exit 0, no growth (main.js -16). `npm run check:rules`: PASS 0 warnings.
- Browser (headless, fresh origin, 1920x1080 plus 1536x864 at 14px and 21px, rebuilt bundle): `browser.cjs rites` passed. Sun 5 absent (90 percent), substituted (48), met (5); Visionary 5 absent, substituted (16), met, partial after 70 minutes, met again; save, reload and Export/Import kept every grade. No page errors.
- Browser `browser.cjs merit` passed: 0 merit, formula refused with its reason, the 30-minute copy pays only after the time, six watches give 13, reload keeps 13, formula copy and sunflower lot bought (merit 2), second lot disabled, Export/Import keeps it. No page errors.
- Browser `browser.cjs sect` (`?primordial_probe=1`) passed after one test-regex fix: CP 0, fire grass refused with reason, two shelving missions give 8 CP, reload keeps it, fire grass bought (CP 0), reload and Export/Import keep the purchase. No page errors.
- Full `npm test` once: tests 3188, pass 3186, fail 2. Both failures are `tests/school_visitor.test.js` (home school lane), which fail identically on an untouched HEAD worktree, so they are pre-existing and unrelated to these paths.

## Gaps

- Seq 5 doses are not drinkable, so rite grades are a bench preview plus the hook; no potion is consumed or made safer yet. Odds are stated, not rolled.
- No moon-phase fact exists, so the Sun 5 rite has no moon condition and Animagus needs one first.
- Fire grass and the primer are held, not used: no pill recipe or technique runtime reads them. The sect panel is behind `?primordial_probe=1`.
- Visionary 5 is inspect-only (its materials are incomplete in the notes), so the rite preview is all it offers.
- Missions are minimal rows: no deadlines, issuers other than Hale and the Library elder, or reward kinds beyond contribution (DWF155 remainder). No secrecy duty or heat (DWF153, DWF156).
- The rite commands and store figures are proposals; scale them per world.
- `dist/bundle.js` and `index.html` carry other sessions' uncommitted work and are not part of this commit.
