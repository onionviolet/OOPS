# P01 host join, proposal 2026-10-14

P00 owns all shared changes. Install against the integrated wave-1 candidate,
not this base-only lane. Target: 1366×768 desktop; mobile deferred.

## H1 Native counters and recognition

Extend the existing `readTitleCounters()` output, without another counter engine:

- `home_minutes = absorbLocalLifeState.homeMinutes` from validated wave-1 C2 state.
  The live wave-1 source counts positive common-clock steps in Shack with both
  ends in Shack. Loading, viewing, repeated clock values and wall time do not pay.
- `items_bought = absorbLocalLifeState.itemsBought` from settled native purchases,
  not trade previews, sales, cancelled trades or item acquisition from other sources.
- `weak_enemy_losses`: OPEN until a real settled-loss owner exists. P00 must supply
  an optional validated nonnegative safe integer from that owner. Count each real
  defeat to an identified known novice opponent once per native settlement receipt.
  Render/reload/import never increments it; a new loss with a new receipt may
  increment again without a fixed lifetime limit. Do not infer past losses from
  total deaths, bestiary kills or character level. Do not expose this goal until
  the opponent and occurrence are known. If no such owner exists, omit this key.

`grantEarnedTitles(character.titles, counters, titleCalendarMinute(current_game_time))`
returns new IDs and mutates only earned-title records using existing semantics.
Progress remains in the real counter owner. Five added goals have no held bonuses.
Use `titleView(titles, counters, {knownOnly:true})` for the panel: new counter goals
are omitted until the host supplies their known counter. Legacy two-argument view
retains the complete-catalog contract. No sealed names or hidden conditions belong
in this projection. Persist titles and native counter progress in the same durable
save before presenting recognition. Existing VFX must obey Effects-off; these
modules add no effects, sound, timers for progression or presentation settlement.

## H2 Training registration and restore

Import `installTrainingLink` from `src/absorb_p23/long_life/training.js` and call
`installTrainingLink(skills)` after the native catalog/reveal-chain registration,
before any character XP reconstruction. It returns `true` for a new registration,
`false` if already installed; missing native skills or a conflicting Cooking level
3 Alchemy component throw before mutation. Existing milestone stats, unlocks and
other XP targets are retained. Current native Cooking has no milestone at level 3.

Stable ID `p23.cooking.alchemy.3`: Cooking 3 gives Alchemy ×1.05 XP. Native Skill
milestone gain and `Person.addSkillMilestoneBonus` own awarding; native stat refresh
owns the current rate. No additive talent counter or persisted notification flag.
Old saves with Cooking ≥3 reconstruct this fact from their earned Cooking XP,
without reconstructing rewards a second time. Registration must precede restore
and repeated registration must not multiply it. Do not apply it separately in the
XP caller as well. No XP award recursion, changes to caps or action eligibility.

`trainingView(readSkill)` returns null unless both skills are known; otherwise
returns `{id, active, multiplier, text}`. Supply `readSkill(id) -> {known,level}`
from native discovery and earned level, not boosted temporary levels. It reads
facts only and never grants or reveals a skill. Use it as `readTraining` below.

## H3 Optional worn-title state, preflight and callbacks

Optional save field: `character.long_life_worn = {schema:1,enabled:boolean,worn:null|string}`.
Omit when absent; do not materialize on old saves. IDs must be known held titles.
Use `validateWornTitle(raw, normalizedTitles)` in both envelope validation and
import preflight before ANY game/storage mutation, also on restore. Undefined
returns undefined; null, invalid shape, unsupported schemas, extra keys or unheld
IDs throw. Return value is a fresh validated record. No save migration required.

`selectWornTitle(titles, raw, id, enabled=true)` returns new validated state; it
never mutates titles or old state. P00 must commit state and derived bonuses through
native durable save ownership before publishing the new selection. A failed write
retains the prior selection and native bonus projection.

`longLifeTitleBonuses(titles, raw)` returns the existing held-title totals plus an
opt-in additive payoff. Absent/off preserves the old totals exactly. Even on, every
held bonus stays active. Renown is count of known held catalog IDs, never a saved
number or count of unknown future IDs. With 3 held known titles, wearing quiet_hour
adds Sleeping ×1.02; pantry_keeper adds Cooking ×1.02. No automatic selected title,
no generated rank catalog, no universal collection skill or forced title mode.

Replace only the existing `character.setTitleBonus(titleBonuses(...))` projection
with this function once H3 is validated and serialized. Existing refresh/UI owners
remain authoritative. Wire `createTitlesPanel` optional callbacks:

- `read`: known-only title view from H1.
- `readWorn`: `() => wornTitleView(character.titles, character.long_life_worn)`.
- `selectWorn`: `(id,enabled) =>` host preflight/durable commit of H3 followed by
  native bonus refresh and panel render. Catch failure and show native feedback.
- `readTraining`: `() => trainingView(readSkill)` from H2.

Without those optional callbacks the old panel behavior continues. Controls are
ordinary checkbox/select with keyboard access, native DOM textContent and no VFX.

## H4 Required integrated acceptance

Earn 60 Shack played minutes and recognize quiet_hour; repeat the action beyond
recognition. Earn Cooking 3 from native crafts and observe known Alchemy XP rate
before/after with a below-cap equivalent award. Repeat training after recognition.
Save/reload/export/literal-file import pending and settled native counters, Cooking
XP, held titles and optional selected title. Verify exactly one milestone factor,
unchanged progress, no replayed talent grant, old optional absence, rejection of an
unsupported optional schema before live/storage mutation, Effects-off and known
projection. Prove old title totals unchanged. Odd-loss counter gate stays OPEN
until H1 provides a real settlement owner. Run build/full tests and record served
bundle hash. Source/unit/uncoupled browser evidence does not close this gate.
