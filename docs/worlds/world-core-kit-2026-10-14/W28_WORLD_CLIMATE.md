# W28: Per-world climate prototype (DR1)

## CHECKPOINT

2026-10-14. Pure prototype on `kit/w28-world-climate`, based on
`6947900bcc3ad2bd8a2b973b7505d4fed281e949`, in
`/Users/weiwei/code/yairpg-w28-world-climate`. W23 returned COMPLETE before
work began. Implementation and source tests only. Not integrated, not built,
not browser verified, not human accepted. No merge or push. R15 owns adoption.
The sole authorized main-checkout write is the final W28_REPORT.md.

## W28-S: authority and evidence

This lane follows the explicit prototype override to COMMON's design-only,
no-source/test/npm/commit rules. Live USER_VISION and PROJECT.md priorities
remain unchanged. No shared hosts, main.js, weather.js, bundles, saves or
private packs were edited. No UI slice is introduced; future visible proof
belongs at 1366x768 and 1920x1080 desktop/laptop. Mobile remains deferred.

| Code | Input read and implication |
|---|---|
| W28-S1 SHOWN(doc) | [Kit rounds 9-11](../WORLD_CORE_KIT_2026-10-14.md), MC28/KX67/DR1/MD1-MD4/MD11-MD12/CR4-CR5/SW1-SW8: wait for W23, derive explicitly, persist effects, branch only. The specific no-merge instruction overrides the standing merge sweep for this lane. |
| W28-S2 SHOWN(doc) | [W23](W23_GLOBALS_AND_LIFECYCLE.md), G01-G05/G18, L28, FHP.28/FDD.28/FTT4.28/FSS.28: calendars, outdoors and controlled rooms differ. These are proposed floors, not runtime acceptance. |
| W28-S3 SHOWN(source) | `src/book_world_paradise_carriers.js:30-35` already exposes native/hub/local envelopes, elapsed value and common/presence policy. Climate consumes a projection of the selected clock; it does not advance it. |
| W28-S4 SHOWN(doc) | [W33](W33_CALENDAR_ENGINE.md), P2/P4: calendarEnvironment owns absoluteLocalDay, dayFraction, seasonId/seasonPhase and daylight. Climate does not invent world years, moon cycles, solar boundaries or term dates. Its normalized daylight convention below is a prototype adapter ask. |
| W28-S5 SHOWN(doc) | [W29](W29_PARADISE_SPECIAL.md), C2-C4/C8: ordinary hub climate remains unknown; controlled habitats do not establish hub-wide climate. [W30](W30_HP_DND_MOL_SPECIAL.md), HP-C3 and local climate rows: exact school curve is unqualified. [W31](W31_NOVEL_WORLDS_SPECIAL.md), B4/DR1 rows: regions and paired realms differ. [W32](W32_ANIME_WORLDS_SPECIAL.md), R1/R3/X8: appearance, physical weather and body/item effects differ. All four were present and read from main; no franchise claim is newly verified here. |

The source profiles below are **INFERRED numerical proposals**. No primary
book, web source, private pack or sealed file was opened. SHOWN(source/test)
means code read or source behavior tested, not playable behavior.

## W28-A: pure shape

`src/world_climate.js:1` imports only the pure hash/mix helpers from
`seeded_streams.js:13-21`. No stream store, draw, cursor, render cache, wall
clock, main.js import or persistence dependency is used.

```js
const clock = {
  id: 'selected.local.clock', kind: 'local',
  value: {elapsed: 2880, unit: 'played_minutes', absence: 'freeze'},
  policy: {mode: 'presence', rate: {numerator: 1, denominator: 1}},
  environment: {
    absoluteLocalDay: 2, dayFraction: 0.5,
    seasonId: 'Summer', seasonPhase: 0.2, daylight: 1
  }
};
deriveWorldClimate(profile, place, clock, seed);
```

| Code | Contract |
|---|---|
| W28-A1 | Profile: id/revision, baseTemperature, seasons (stable ID to offset, or null), daily warm/cold fractions and offsets, nonempty finite temperatureCycle/rainCycle arrays, seededCycles flag, outdoor/indoor/sealed default and optional controlled temperature/light. Content records are immutable proposals; no saved profile registry is added. |
| W28-A2 | Place: explicit id/regionId for seeded regional phase; optional environment, legacy temperature_range_modifier/temperature_modifier, is_temperature_static/static_temperature and dark types; lightLevel for controlled rooms. Indoor/sealed suppress rain exposure and use controlled temperature. A roof alone retains legacy static/rain semantics until an adapter explicitly declares shelter. |
| W28-A3 | Clock environment is a W33-derived projection of the selected existing envelope. Policy/value fields are carried but never interpreted or advanced. daylight is 0..1, null means unknown; outdoor light maps to legacy 40..100. A non-24-hour day uses dayFraction without hour conversion. No-season means seasons:null and returned seasonId/seasonPhase:null. Unknown explicit seasonal IDs reject. |
| W28-A4 | Custom cycle arrays can have any positive integer length. Calendar-owned season cycles can have arbitrary periods, unequal seasons and different stable IDs; climate consumes their supplied ID/phase without performing date math. Seeded profiles use pure hash/mix per profile/revision/region/channel to offset daily tables. Base seed is deliberately inert for exact legacy output. There is no dependence on evaluation order or previous days. |
| W28-A5 | Result: profileId/profileRevision, absoluteLocalDay, seasonId/seasonPhase, temperature, raining, rainTemperatureModifier, lightLevel and environment. Return values are fresh derived data, not effects or event receipts. Unknown daylight remains null. Invalid cycles, seed, coordinates, environment, season or local modifiers reject rather than fabricate Frontier output. |

`legacyClimateEnvironment` is a narrow explicit base compatibility bridge,
not another world calendar engine. Default profile accepts Game_Time-shaped
fields, retaining its month-to-season order and separate day_count coordinate.
Explicit non-base profiles require the calendar environment. Translated season
labels must be mapped to stable climate IDs at the calendar seam.

## W28-P: illustrative profile proposals

| Code | Profile / floor / Default + Dial + reason |
|---|---|
| W28-P1 | highlandSchool references W23-FHP.28. Current local climate floor missing; this source prototype is partial substrate only. Default authored cooler seasonal table; Dial sourced region/era offsets and W33 daylight later, because sheltered corridors and paths have different exposure. Exact numbers are not Scottish observations or Harry Potter canon. |
| W28-P2 | noSeasonDesert is an original destination dial within W23's region/realm climate considerations, not a named franchise climate. Default no season, hotter authored daily variation and dry rain table; Dial arbitrary cycles and selected sky, because a destination need not inherit a Frontier year. |
| W28-P3 | sealedRealm references W23-FTT4.28's declared facility environment. Default authored controlled 18°C/light60/no exposed rain; Dial place controls and unknown light, because engineered habitats may differ from outside. This is not a statement that Paradise's public hub is sealed or seasonless. |

## W28-I: later adoption and save impact

**W28-I1 weather.js:** R15 can add an explicit context adapter selecting the
active world/instance/place, pinned seed/profile revision and W33 calendar
projection. First compare base unsmoothed temperature, rain and light, then
route existing consumers. The current module-level smoothing cache is not
reproduced: its output can depend on prior render history. R15 must separately
choose a versioned pure interpolation or correctly scoped compatibility cache.
This lane neither changes smoothing nor claims smoothed display parity.

**W28-I2 away ledger:** call the same derive for owner-authorized local days,
using the same region, seed, profile revision and calendar anchor. Do not
advance a frozen clock or infer elapsed from wall absence here. Enumerate day,
season and daily-temperature boundaries where a consumer needs subday effects;
a single endpoint is not an interval integral. Repeated/segmented reads are
stable, but effect settlement still requires existing idempotent transactions.

**W28-I3 MD4:** derived weather adds nothing to saves. Existing elapsed/seed
owners supply inputs; this prototype creates no stored cursor or climate state.
If adoption introduces a pinned profile binding/revision not already owned,
R15 must make that an explicit save compatibility decision first. What weather
caused belongs in existing effect/job owners: save caused effects with stable
cause IDs incorporating world instance, profile revision, place, occurrence
and relevant loop iteration. Preserve old effects on reload/import; do not
reroll or reapply them. No migration or save/import behavior is claimed here.

**W28-I4 integration ask for R15:** review/cherry-pick this bounded branch only
when authorized, reconcile W33 daylight scalar/sky adapter and profile bindings,
select one native climate slice, then test weather/live/away consumer agreement.
Keep unknown hub weather unbound. Do not treat this proposal as a new global
readiness gate or start every world at once.

## W28-T: verification

Results recorded below after execution. Tests compare the actual weather.js
function bodies in a VM with module wiring removed; main.js/DOM is never loaded.
The sampled legacy check covers 8 month positions, 11 day counts, 12 minute/peak
boundaries and 5 place variants, 5,280 combinations. It checks exact numeric
temperature, rain and light plus explicit environment equivalence. The original
static-null unsmoothed fallback and 20:00 light boundary are retained. Other
checks cover seeded replay/skip ordering, frozen inputs, no seasons, unknown
light, custom 7/3-day cycles, custom calendar season wrap, 27-hour day fractions,
indoor/sealed behavior and invalid input rejection.

**W28-T1 SHOWN(test):** `node --test tests/world_climate.test.js`, exit 0:

```text
1..7
# tests 7
# suites 0
# pass 7
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 795.647334
```

**W28-T2 SHOWN(test):** `npm test`, exit 0, after worktree-local
`npm ci --no-audit --no-fund` (3 locked packages; no tracked dependency changes):

```text
1..807
# tests 807
# suites 0
# pass 807
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 13327.937875
```

**W28-T3 correction history:** first focused run was 5 pass / 1 fail from
floating-point grouping; fixed arithmetic order, then 6/6 passed. Added the
calendar consumer fixture and final focused/full runs above cover the final
source. First full run without dependencies was 233 pass / 84 fail,
`ERR_MODULE_NOT_FOUND` for esbuild/inkjs; final installed-dependency run passed.
Node v22.23.3. No build or browser run. Whitespace check and lane-path scope
inspection passed before commit.

**W28-T4 OPEN:** R15 integration, W33 live adapter, smoothing choice,
rebuilt fresh-origin desktop browser journey, weather-effect transaction
settlement and save/reload/literal-file import, plus director acceptance.
Tests prove the pure module only. Existing bundles and live gameplay remain
unchanged by this lane.

## More to consider, other stuff

| Code | Cross-world consideration / disposition |
|---|---|
| W28-X1 ACCOUNT | Profile revision changes can alter recomputation of past weather. Pin adoption inputs or retain caused effects under their original cause identity; do not migrate history by rendering it. |
| W28-X2 LATER | A displayed curtain/night palette is not a physical temperature producer. Bind appearance and physical sky separately before weather powers or automail effects adopt this seam. |
| W28-X3 LATER | Seeded regional phases are intentionally periodic table offsets, not a simulated climate model. Authored storms, tide, humidity and supernatural overrides need their own qualified producer and effect owner. |

Ranked suggestions: **W28-N1** agree the W33 adapter and legacy smoothing
policy; **W28-N2** integrate one world/place through R15 with rebuilt browser
proof; **W28-N3** verify away settlement, saved causes and reload/literal-file
import before claiming consequences work. These are integration suggestions,
not accepted new requirements for this prototype.
