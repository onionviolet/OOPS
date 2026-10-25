# W3 events: G26, G25, G03, G06 (2026-10-23)

Direction: Weibao's later instruction to build the leftover itch.io items, NPC-heavy ones included, small and as per-world
dials. That outranks AD33's deprioritizing for these four; AD33 still governs how far each one goes. Applied codes: AD1
(per-world dials with an in-world reason), AD9 (forecasts read only what was seen), AD19 (forgiving: every event waits, every
cost is small, a free blameless choice always exists, mourning and quarrels fade by themselves), AD38 (mechanisms, not
allowed-outcome lists), AR1-AR16 (one authority per fact, namespaced slice, one `main.js` hunk, net zero), UR/ST6 (desktop
reference dock, 1536 and 1920).

## What was built

- `src/life_events.js` (pure rules), `life_events_domain.js` (registered domain `life_events`, slice of the same name),
  `life_events_ui.js` (panel `life-events`, "Family & farewells", surface in `layout_spec.js`).
- **G26.** A yearly scan over `npc_lives` raises `orphan:<child>` (a minor with every parent dead), `grief:<survivor>:<dead>`
  (surviving spouse, adult child) and `age:<person>` (comes of age at the dial's age). The player's own `lifeStage` change
  raises `stage:<life>:<stage>`. Choices cost 0 to 30 coins; each has a free option. Orphans become wards of the player, a
  grown sibling or the Village. Grief starts a mourning window that a vigil shortens by a year and time ends anyway.
- **G25.** `defeat_domain.js` gains `DEATH_CAUSES` (`age, illness, mishap, combat, harm`), a capped `deathCauses` tally and
  `lastDeath`, with `publishDeathCause`. Native defeat stays unconsciousness (AD19); a death is a separate record. The
  life-events slice keeps who/age per cause and the panel shows the forecast ("A fever has taken 2 you knew, between 33
  and 35"). Only deaths scanned after the slice began count (AD9).
- **G03.** `npc_lives.js` gains `bondStatuses`: `spouseId` stays the authority for married; widowed derives from a death;
  the slice stores only overlays (courting, estranged, courted-married). Paths: introduce (5 coins) -> courting -> married
  after a year; married -> estranged by a yearly seeded roll; estranged -> made peace (10 coins) or heals by itself after
  `healYears`; courting or a courted estrangement can part kindly for free. A widowed or unmarried adult can be introduced again
  once mourning ends (people someone's script will marry are reserved).
- **G06.** `broadcast()` writes one fact into up to 8 people at once, deduplicated by fact id and capped at 12 memories each.
  `relationship_view.js` gains `householdRelationships` (statuses plus a `household` memory source) without changing
  `relationshipView`'s shape.
- **Hardship dial.** `createVillageLives(year, seed, 'fever_winter')` moves Maia's and Oren's deaths to year+8 with cause
  `illness` and a stated reason. The Village neighbors panel has a checkbox ("A harder village...") so the player chooses
  and is forewarned. Default is none (all deaths old age), which keeps saved lives and `npc_lives` tests unchanged.

## Decisions and why

- **Authority.** `npc_lives` stays the only record of who lives and dies; the slice never copies it. Household memories are
  a named `household` source on the slice, because these people are not simulation people.
- **Baseline.** A missing slice (old save, heir) takes the present as its start, so no retroactive grief.
- **Why a dial for orphans.** Scripted deaths are at 65+ and children are born at 21-30, so no minor is ever orphaned by
  the default household. Orphans are reachable only on the chosen hardship (or a future world pack's dial).
- **Dials** (slice `dial`, with a stated reason): adult age 18, mourning 2 years, courting 1, healing 3, quarrel 25 per
  mille per year, cost scale 1. `setLifeEventsDial` changes them.

## Checks

- Focused: `tests/life_events.test.js` (10 tests), plus `npc_lives`, `relationship_view`, `defeat_domain`, `layout_spec`,
  `domain_registry`: 53 pass. `npm run build`, `check:arch` (main.js growth 0) and `check:rules` pass.
- Browser: `scripts/life_events_browser.cjs` at 1536 and 1920 from a fresh origin: met neighbors on the hardship dial, crossed
  the winter, both orphan events and the cause tally appeared, a free and a 30-coin choice resolved, broadcast memories landed,
  16 years on both came of age and mourning faded, then save+reload and Export+Import kept the slice and the defeat tally.
  Screenshots: `docs/gm/dispatch/w3-events-2026-10-23/evidence/`.

## Gaps

- No browser exercise of introduce/estrange/mend (covered by unit tests only); no default-dial grief run in a browser.
- Heir succession (`life_experience_host.js`, not mine) drops the slice, so statuses and memories reset for an heir.
- Deaths of simulation people (e.g. the old craftsman) and generated people are a separate owner and are not covered.
- A death lesson is information only (a forecast line); it gives no stat bonus.
- The full `npm test` gate was not run here (committer's job).
