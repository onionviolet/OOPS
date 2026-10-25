# W3 institutions notes: G62 diplomacy, schism and heresy; G27 skill floor, near miss, paths not taken (2026-10-23)

Direction: Weibao, 2026-10-23, build the leftover itch.io items as small per-world dials ([record](../../USER_VISION.md#leftover-itchio-items-built-as-small-per-world-dials-2026-10-23)). Codes applied: AD1, AD38, AD33 (named items only), SLR10/SLR11 (rust is a per-world dial, off by default, hits fluency with a stated reason; relearning is faster), AR1-AR16. UI target: desktop 1536 and 1920; mobile deferred.

## Decisions (proposals pending his play, not accepted rows)
- **G62 owner:** `src/lore_history_state.js` (IM24). `relations` stays the year-0 matrix the wars came from. Events are dated entries in an optional `events` array: `pact`, `breach`, `schism`, `heresy`, each with a `cause` (war id, or doctrine). Standing is a fold (`standingAt`), never stored twice. A schism names a child faction and its land share but does not add it to `factions`, so relation keys and war causes are untouched. Draws use new keyed names on the saved stream root, so war draws reproduce.
- **Migration:** a stored history without `events` validates unchanged and gains them from its own wars and factions through `upgradeWorldEvents`, on the player's request (the panel button reads "Recall further events"). Same commit-on-request rule as IM24; no save version bump.
- **Doctrine palette** (`DOCTRINES`) is illustrative, not canon for any named world.
- **G27 owner:** `src/skill_records.js` (pure) and `src/skill_records_domain.js` (slice `skillRecords`, migration `migrateSkillRecords`). Native `total_xp` is never lowered. Rust is a negative bonus level in a new `bonus_skill_levels.flat.rust` bucket that `src/models/person.js` sums (one added line). Peak, last-seen XP and idle minutes are tracked per skill from domain ticks.
- **Dial (SKILL_DIALS):** only worlds with a row offer rust, and even then it is off until the player switches it on per world (SLR10). `base.frontier` row: grace 14 days, a level lost per 7 further days idle, floor 60% of peak, regain 2 levels per practice tick, peak at least 5, stated reason in the row. Records (peak, near miss, paths not taken) work in every world.
- **Near miss:** a skill left a full day at 85% or more of its next level is recorded once per level ("stalled N experience short of level L").
- **Paths not taken** are derived from saved facts, not stored: declined requests (`request.decline` receipts) and discovered skill categories with no practice.
- **Surface:** both live in the existing `story-insight` surface (Stories & history, ST6). No new layout_spec entry was needed.

## Checks
- `node --test tests/institutions_records.test.js tests/story_recognizer_and_world_history.test.js tests/distinct_world_history.test.js tests/lore_history_view.test.js`: 14 pass (events deterministic, old-shape upgrade equals fresh, recording still works with events, rust off by default, floor, regain, dial off, near miss, summary).
- `npm run build` and `npm run check:arch`: pass (main.js growth 0; `skills` reaches the domain through the existing operations object, which avoids a new import cycle).
- `scripts/w3_institutions_browser.cjs` (headless, fresh origin, 1536x864 and 1920x1080): fresh events with causes, old-shape history upgraded to identical events and wars, near miss recorded with rust off, rust applied from real ticks after the dial, save/reload, Export/Import, dial off lifts rust. PASS. Evidence in `docs/gm/dispatch/w3-institutions-2026-10-23/evidence/`.

## Gaps
- Paths-not-taken lines showed none live in a fresh Village (no discovered-but-untouched category, no declined request); covered by a unit test only.
- Pacts are rare in sampled seeds (breaches and heresies dominate).
- Rust in the browser check advanced one level in 2.5 s of ticks; the full ceiling was only unit-tested.
- Not shown elsewhere: the rusty level in the Skills panel was not inspected visually.
- Nothing committed.
