# W5 S1 actual source contract

State: source_ready with 36/36 focused tests; below AD43 until rebuilt native
proof. Exact hashes in source-ready.json. W4 immutable 1,859-input snapshot
plus only the seven W5 owned source/test overlays freezes this candidate.
New nursery, prices, growth and species support are ORIGINAL proposals, not a
sourced Paradise species, landmark, outdoor season or weather claim.

## Existing source engine

`defineSourceTable` accepts optional per-source `calendar`:
`{worldId,profileId,profileRevision,minutesPerHour,hoursPerDay,seasonTags}`.
seasonTags explicitly maps local season ID to a catalogue gate tag. No map
means no supported seasonal gate; actor.season cannot substitute on bound
sources. Existing unbound tables/actor gates keep prior behavior.

`nodeAt(source,node,at,calendar)`, `forecastHarvest(...,{...,calendar})` and
`harvest(...,{...,calendar})` validate actual local coordinate:
`{worldId,instanceId,profileId,profileRevision,at,minuteWithinDay,seasonId,
minutesPerHour,hoursPerDay}`. Consume W6 sourceCalendarAt directly. Missing,
stale, wrong-world/profile/revision/unit or changed-instance input refuses.
Harvest world must match source world. The caller obtains this coordinate
from its actual owning world, not a supplied label. Node `updatedAt` is local
elapsed, hourly gate uses projected anchored local minute. Exact fractional
carry uses local day length, not 1,440 universally. Frozen elapsed adds none.

Optional schema1 node.calendar retains world/instance/profile/revision and
minutesPerDay; exact validator enforces binding and carry range. Other node
fields/schema stay unchanged. Bound nodes are new state; no old unbound node
is silently reinterpreted. Native source state is validated at its owner.
`nodeKey(world,location,source,instanceId?)` qualifies bound storage keys;
regional generation scope and harvest draw address also include instance.
Generated full material records keep their ordinary freeze-on-reveal contract.
`gatherIdle` requires `calendarAt(at)` for a bound source and reprojects each
step; a single snapshot cannot authorize a whole seasonal interval.

## Native nursery and actual useful consumer

`book_world_paradise_ecology.js` exports PARADISE_ECOLOGY,
paradiseEcologySources, projectParadiseEcology, validateParadiseEcology,
nurseryWaterAssessment and existing-host planner/presentation/definitions.
The existing simulation actor is the paid rooted nursery, not another bag or
clock. Its scalar facts retain source node JSON, revision, finite care window,
care count and latest exact water key/history. The node's stock is unharvested
standing wood. Actual harvested inventory remains the sole harvested count.
No domain save slice, registration line, native item serializer or second timer.

At an actually built bench, the present existing supplier takes four actual
credits and two stamina over three played minutes to lease two rooted mature
stools in managed hub space. This once-completed command spawns the registered
station with two mature cuts. Harvest spends one standing cut and grants one
exact ordinary `PARADISE_KEYS.log`. Ordinary commodity logs coalesce because
no existing downstream reader distinguishes this wood's grade/species/age.
No claim of per-log lineage is made; source node/care history stays in nursery.
The log feeds W4's actual log1+water1+heldkit1+stamina1/four-minute preparation,
then W3's retained damp2 -> dry2 -> native kit -> finite paid commission.
Existing unwashed cutting, ordinary log/rope route and already-held/purchased
supply remain available; nothing refills a depleted source on return or load.

After depletion, care consumes exactly one suitable owned W4 liquid portion
and one stamina. This ORIGINAL clean-drip-tray coppice reads W4's complete
per-portion batch itself: volume1, solvent1,000 and no grit, dissolved salt or
contaminant. It does not reuse wash suitability as a universal crop law.
Filtering cloudy water through W4's real cloth route supplies an alternative;
brackish remains unsuitable. Water is not regenerated and no soil chemistry
or drinking-water safety is claimed. Latest exact care-water key retains its
supplier/filter receipt. One ration supports two cuts per local day for one
local day. Fractional growth stays; expiry stops new growth, preserves standing
stock and never harms the plant. Capacity2 discards overgrowth; paid care
cannot stack before expiry or when two mature cuts already fill the source.

Projection is pure. Commit clones actual state/gameplay/vitals and uses the
existing publisher; stale keys, no care, unsupported hands/busy work and wrong
calendar refuse without spending. Local instance freezes on departure; root
or wall time alone does not grow wood. Source can remain uncared safely.

## Verification / remaining coverage

Focused36: existing craft19 + source calendar2; ecology3; environment4;
drying5; source-calendar3. Ordinary source->wash->dry->kit->commission,
finite water/stamina, depletion/fallback refusal, source validation, local-day
partition/carry reload, actual departure/return freeze, pure preview and wrong
calendar/instance gates pass. All47 prior command definitions remain exact.
First test errors were a duplicate import, a one-of-two merged-stack take,
and a test advance exceeding the engine's per-call budget; fixtures now use
explicit bounded advances and exact take counts. Those failures are not
passing evidence. No source clock policy was changed to accommodate them.

Flowering/ripening/molt/migration do not acquire fabricated civil windows.
Exact current gap: MoL/Paradise source-calendar profiles explicitly have no
civil seasons, no released book-world flowering/animal source with a real
material reader supplies those windows, and habitat_care is a separate
Frontier-only owned-sheep mechanism. The qualified engine supports explicit
season-gated families, with a named ORIGINAL non-Earth fixture proving them;
that is engine evidence, not native seasonal ecology. Native nursery is an
actual finite-care regrowth alternative. Further calendar-qualified biological
windows need their actual source/era or an explicit ORIGINAL producer/reader.
Regional families are implemented/proven in the existing engine and now
instance-qualified, but this native commodity consumer does not interpret
family properties; no unread generated properties are minted. Crop soil,
flowering, animal and regional-property adoption gaps remain in W5's ledger.

Native build/hash, desktop and literal Save/reload/Export/Import for this new
nursery remain pending W5's later proof turn. W4 physical water and W3 drying
proof stay owned by those lanes; source-ready does not mean combined floor.
Shared host/content/facts joins may be consumed by W6 after current path-lock
release. Preserve this source contract and any later W4 UI-only repair.


## Final S1 native release

AD43 verified on immutable final bundle
`f8c4220cddcf009dec4076bc0b47f1813715b854b80c32e86b6369e5dde21a25`.
Eleven full-route native persistence checkpoints plus three final UI/care
checkpoints, four desktop font/viewport combinations, zero page errors.
Final nursery actions use `paradiseEcologyActions(state,context,projectLegibility)`;
the existing host injects projectActionLegibility to avoid a simulation import
cycle. Visible per-key water/stamina costs and immediate duration are explicit
for available and blocked choices. Pure physical/source APIs remain unchanged.
See native-release.json/native-final-inputs.json for exact proof bytes versus
later live W6 shared field joins. Full36 focused + final3 projection regression,
final build and architecture6/205 pass; combined W6 gates remain separate.
Source/reader gaps above remain qualified, not waived by this playable S1.
