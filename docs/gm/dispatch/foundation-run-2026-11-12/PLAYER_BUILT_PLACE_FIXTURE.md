# Player-built place: portable roof and rainy-day drying

**Status:** headless Homes domain fixture, agent-verified, not human-reviewed.
This is evidence for “Choosing, expanding and customizing a place” in the
coordinator's in-flight `docs/PROCEDURAL_CARRY_OUT.md` at
`/Users/weiwei/code/yair-fdn-coord-3`. The [canon-first order](RUN.md) and
[engine-first boundary](../../../PROCEDURAL_CARRY_OUT.md#engine-first-tie-in-later-pc95-2026-11-12)
stand. This slice adds a proof of an existing behavior. It claims no new canon
coverage, world content or production integration.

## Fit

**Mechanic: place a paid fitting where its physical function matters.**
[DDA base camps](https://github.com/CleverRaven/Cataclysm-DDA/blob/feb2e6336fb5233b71622f51a45b81efbf1a7f74/doc/JSON/BASECAMP.md#adding-basecamp-expansions)
show completed upgrades enabling work at that expansion. OOPS already has a
smaller concrete consumer: the existing Homes `dry_grass` action converts one
damp bundle to one dry bundle in ten played minutes, requiring a sound roof
when it rains. This uses the actual roof, location and integrity (AD38, MR32).
[Vintage Story](https://www.vintagestory.at/) is the reference for local
conditions as meaningful inputs. [Valheim](https://valheim.com/faq/) motivates
outposts and farms; [Factorio](https://factorio.com/blog/post/fff-392) and
[Luanti](https://docs.luanti.org/for-creators/schematic/#placing-schematics)
motivate keeping a reusable design separate from its placement. Those latter
ideas are future comparisons, with no blueprint format or terrain builder
needed for this fixture.

The Keeper's existing [firefly colony adapter](../../../../src/gu_keeper_colony.js)
checks the Gu house annex and its existing extension permission; its shade
operation changes the colony's light through the existing colony owner. A
player-built shade frame has no caller there. The Frontier workshop
[drying rack](../../../../src/home_furnishing_content.js) already changes
offcut condition after paid construction, but its job is tied to the earned
Shack workshop. Moving either route would change existing behavior and require
new world content or native wiring. The portable roof is the smallest honest
comparison using two existing placements.

Owners (AR3, AD51, MR29–MR33, SR1): `base.frontier` registers the camp and
structure terms in [home content](../../../../src/home_content.js); the
[Homes model](../../../../src/home_model.js) owns tenure and access;
[building](../../../../src/home_building_model.js) holds actual materials,
sets the anchor and reads roof condition; [Homes domain](../../../../src/home_domain.js)
quotes and commits through native inventory, projects the one travel endpoint
at its current anchor, and stages clock settlement. The existing simulation
owns the saved work job. The W18 place graph gives a later engine-side way to
express links; this fixture reads the existing Homes paths and does not depend
on the coordinator's graph code or modify it. No runtime owner, registration,
revision, save field or import cycle changed.

## Observed in the fixture

The original Frontier camps are the **Wild willow stand** and **Village**.
Read the stand as a camp near gathering and Village as a serviced camp for the
purpose of this comparison. The coordinator's low bank and sheltered terrace,
water access and microclimate are authored proposals. Both fixture camps use
the same real rain calendar so placement is the variable. Construction still
starts at the native willow site. The same completed shelter can be packed and
pitched at either camp.

1. Starting with one pole and six dry bundles, the quote rejects construction
   and leaves the fixture save unchanged. Gathering the missing pole at the
   stand makes the same build possible. Acceptance removes two poles and six
   dry bundles from carried stock and puts those exact counts in project custody.
2. A rain contribution is saved four minutes into its ten minutes. Six minutes
   remain on the real job and the unfinished shelter has no accessible endpoint.
   Five more contributions finish the shelter. Packing produces one retained
   kit; both camps quote one kit and five played minutes to pitch it. Pitching
   spends the kit and binds the roof entrance to the chosen camp.
3. Outdoors in rain, drying remains unavailable. Inside the placed sound roof,
   the unchanged action spends one damp bundle and ten minutes and produces
   exactly one dry bundle. No construction job or material reservation remains.
   For each camp, the mid-build save is reproduced byte for byte on restore,
   and the final serialized fixture envelope equals its uninterrupted branch.

## Evidence and limits

- Write lane: primary checkout `/Users/weiwei/code/yet-another-idle-rpg`.
  Base `4d4505223bae7c097a3a1c833f195ea53f8d0e26`; coordinator proposal
  read at `d423a30fa` plus its local edits. Read only there. No overlapping
  edits were found in the primary Homes source or focused test before writing.
- Fixture: [home_domain.test.js](../../../../tests/home_domain.test.js),
  SHA-256 `27a177001fbc9bb59b9afbab0c0beb224556354794194094cda856bca50dec61`,
  Node v24.22.2, seed 19, rain day 4. Existing four tent build definitions at
  revision 1: baseline JSON SHA-256
  `c81b4cd349278faa9dc3156e933696235a2be8c5770ac0d5ef424b741e010cba`.
- Restore uses `loadExpansionState` (including simulation job validation)
  and `domainRegistry.validate/load` (including Homes title, material keys,
  project, condition and camp anchor). The harness supplies stock and a minimal
  item factory, serializes a fixture envelope, and follows projected path
  edges through its own travel driver. This is not the browser's complete save
  envelope, native travel command or Export/Import. Save format is unchanged.
- `node --test tests/home_domain.test.js tests/home_extension.test.js tests/home_weather.test.js`
  passed 21/21. Production source is unchanged. No full suite, build or
  browser run was needed for this fixture; no playable delivery is claimed.

The remaining Keeper tie-in is to route completed shelter or shade at a
world-qualified permitted site into a real local reader on the shared engine
clock. Validate with a distinct world after the applicable canon foundation
work. Preserve the annex's existing route and prove that moving the fitting
changes only the use it actually supplies. Separate bank and terrace
conditions, expansion, custom layouts and desktop play remain unproven.

## Opt-in building capability coverage, 2026-11-12

The [capability assignment](CAPABILITY_GOAL_ASSIGNMENTS.md#absorb-oops-site-choice-and-home-building)
extends the Frontier proof with an original bank, terrace, and annex in the
headless engine. These are fixture sites in one Keeper-inspired yard, with
authored work times, costs and exposure. Construction, site use and wear use
one engine clock. A named position is a place, its approach is a place link,
and a fitting with its own condition and stock is a thing. The working law
owns the build terms and rechecks materials, tenure, fit and occupancy at
settlement. Work time accrues before payment. The earlier native Homes route
continues to reserve materials when the project starts.

The design takes the site tradeoff from Vintage Story, the useful completed
improvement from DDA, and the separate saved design from Factorio and Luanti.
The outpost comparison from Valheim is covered at the level of a paid annex
and a fitting that moves to it. The implementation is independent and uses no
external code. The referenced source pages are linked in Fit above.

| Capability | Evidence and real consumer |
| --- | --- |
| Choose a site and reach supplies | The same shade plan costs two timbers and one cloth at both sites. Rain extends work from six minutes on the terrace to eight on the exposed bank. A one-bundle water trip transfers real stock in five minutes at the bank or seventeen at the terrace. A one-way approach without a return route blocks the trip. |
| Pay, build and use a fitting | Saving mid-build retains the job and leaves stock untouched until completion. The result matches uninterrupted settlement. Missing cloth, withdrawn tenure and competing work orders preserve the bill on failure. The ready shade frame changes local daylight at the next engine minute. The existing colony light pack yields 24 glow from two members there and zero at the uncovered position. |
| Lay out and repurpose a place | The same physical shade frame relocates between named positions and changes which colony glows. An occupied position blocks a move. The existing manor layout still covers cell collision, warmth and smoke around a bed, and Fortune's bed score. The native furnishing tests cover paid and installed workshop fittings, their local readiness and the difference between carried and installed furnishings. |
| Expand, move stock and do work | One timber and five minutes grant an authorized adjoining position and open a two-minute approach in the existing place graph. A named rack loads one wet bundle from the builder, keeps it when moved, and produces a dry bundle under cover. Collection transfers it to the builder. The rainy bank refuses drying until the rack moves to the terrace. |
| Upkeep and design reuse | Rain wears a bank frame past the shade threshold. A paid repair restores its effect. A 61-minute jump matches minute steps with a restore. A notebook saves the design revision, and reusing it at the annex needs fresh materials and a paid brace. Losing the brace removes shade from the weak site and leaves the sound terrace frame working. |

### Ownership and remaining work

- The [building pack](../../../../src/world_packs/player_built_place.js) opts in
  via `ownPacks` and the existing host law list. It uses the graph's public
  path and link operations, the kernel's saved working and cost receipts, and
  the creature pack's current `daylight` and `sky.daylight` contract. The graph,
  colony, engine registry, native Homes and coordinator files are outside this
  write lane. Local daylight has one writer per position. A future weather
  adapter needs to supply outdoor sunlight and rain separately from the
  sheltered daylight that the colony reads.
- The timed haul and fitting move price their routes at acceptance. Live
  obstruction, replacement of the route while work is in flight, and linked
  Keeper rig or mill outcomes remain open. Reopen when the graph or travel
  owner can supply route checks at a working boundary. Preserve the existing
  Keeper rig and annex colony routes.
- The notebook records one fitting design. Whole layouts and footprint
  placement need a case where several cells, supports or shared materials
  change a decision. Permanent outposts and building rights in other worlds
  need their own authored site and tenure terms. The present annex uses an
  explicit adjoining grant and a new path.
- A brace can support a frame and its loss removes the effect. A live Gu
  supplying support, crop growth feeding an actual Gu, and Keeper rations
  need the creature and upkeep owners to provide the corresponding stock
  or support contract. The authored colony proof concerns light and glow.
  Reopen those cross-system cases at their shared engine integration.
- Desktop use and native save, reload and Export/Import are the PC95 tie-in
  gates. The headless save carries ordinary holders, links, working records
  and condition. A registered live case can use this law once a world needs
  it. Canon coverage and source order are unchanged.

### Checks

- `node --test tests/player_built_place.test.js` passed 6/6 on the final
  fixture. The broader Homes, graph, engine and colony check passed 77/77
  before the added step-partition assertion, which passed in the final run.
- `npm run check:arch` and `npm run check:coverage` passed. The coverage
  check verified seven existing ledgers. These authored building cases are
  in the existing Node runner and do not count as canon ledger rows.
- `npm run check:rules` passed on this shared checkout with warnings in the
  Hogwarts exam clock, shared PROJECT direction check, and private packs glob.
- `BUILD_OUT=<temporary directory> npm run build` passed with the existing
  duplicate `dial` warning in `src/travel_legs.js`. Bundle SHA-256
  `ae27651a2613d9e1d89e0fbf55810aa316e67258d986a08ed8626e79527ab25e`.
  The opt-in pack is exercised by the headless runner. The full suite remains
  the integration and pre-commit gate under AD36.
- Primary `4d4505223bae7c097a3a1c833f195ea53f8d0e26`, Node v24.22.2.
  Pack SHA-256 `91b0a2f187f7aab1c600fc457d6eda25a9eaffb5e1f6d3b0bab9484de2ebf821`.
  [Fixture](../../../../tests/player_built_place.test.js) SHA-256
  `f8d7c1eb79c35e8190376753337438a8c360a0cec31d873c03bb57cdeb978099`.
  The run used the shared checkout's `engine_records.js` at SHA-256
  `0a8927b94fe69a82654498f0733e3a486bbd8b39d1095bdd5a4765e54862429e`.
  State is agent-verified at opt-in fixture scope and awaits human review.
