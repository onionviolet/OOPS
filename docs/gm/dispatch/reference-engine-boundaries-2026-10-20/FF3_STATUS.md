# FF3 finite hearth firewood supply

release=true. Final status: FF3 shared implementation and technically verified candidate complete; human play acceptance remains open. Initial preparation and progress history follows. All FF3 source/test reservations are released. Current engine writer reserves `src/absorb_p23/household/model.js`, new `tests/household_firewood.test.js`, new focused native/browser firewood journeys and this FF3 receipt/input/evidence area. Existing lamp work is released to P2 and untouched. Palette owner retains household `host.js`, `household_scene.js`, household UI joins/styles; P2 owns shared composition after release. No host/main writes while reserved. No new chats/agents/messages, source acquisition, commit/push/publish, personal saves or shared generated bundle writes.

## Scope and selected default

FF3 from PFE10/11/17/22/23 and PFA075. AR1–AR16; AD6–9/15–18/22/32–38; ECR/MR custody/conservation and native clock rules. A player-stocked reserve stores up to **5 exact-key Rough wood logs**, initially empty, auto-feed off. Capacity is a proposal dial, not a universal world limit. Reason: a small hearth-side pile has finite space and the player's chosen supply must be paid from usable carried stock. Manual lighting stays one log / 20 played minutes. The enabled policy feeds an already burning hearth at its exhaustion boundary **while the controlled living owner is at this home**; paid fuel continues burning away, reserve does not. Extinguish keeps unburned reserve and the selected policy but requires another manual ignition. Empty/off stops feeding; restocking or toggling an unlit hearth does not ignite it. Withdraw one unburned exact-key log through the native item publisher. No free starting fuel, hidden inventory borrowing, wall-clock upkeep, scheduler or new furnace/cooking/heat system.

## Actual seams and dependencies

Existing `planHousehold` is a pure plan. Native `stageHouseholdJoin` rechecks exact-key disposition and applies item effects to `plan.gameplay`, then root publisher validates/stores household + inventory + sequence together. Retain that owner. Household validator owns the optional block in the current save envelope. A missing new reserve field means empty/off, not a grant. New storage state will retain exact keys for withdrawals.

D1: Native UI currently passes action IDs through `actP00Household`/`stageHouseholdJoin` as strings. Domain-local stock IDs will encode the exact key, so no new general command dispatcher or core payload port is needed. UI projection must use model helpers and display capacity/policy/reserve; prepare a small host patch for the palette owner/release.

D2: `stageP00Time` currently ticks household against the old location even for `plan.nativeLocation` travel. FF3 needs the tick context's location parameter to use `plan.nativeLocation || current_location?.id`, so departing travel does not auto-feed/dry clothes as though the player stayed home. Prepare this precise composition hunk for P2 or the recorded released owner; do not edit concurrently.

## Source and checks

Pinned private Proto23 source hash confirmed `a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5`; lines 1558–1572 show finite stock/capacity/restock and 8234–8277 home auto-feed. These are reference behavior, not native formula/state authority. No newer-media implementation claim. Attribution retained; no source copied.

Before edits selected: existing `tests/p23-household.test.js`, scene and native tranche-one tests. Dedicated regressions: exact-key stock transfer/capacity, stale sequence/changed stock rollback, off/empty/extinguish/no auto-ignition, departure/control loss, whole advance versus boundary-aligned advances including exact expiry, drying/smoke once across fuel boundaries, current pending/finished round-trip and malformed reserve rejection. Native journey: seeded setup separately identified; real buttons/publisher, current Save/reload/Export/literal Import, fresh rebuilt 1920×1080. Full gates in isolated dirty-input candidate; no equivalent duplicate while another authoritative run covers unchanged inputs. Human acceptance separate.

Input identity: `FF3_INPUT_STATE.json`. No runtime checks yet for this continuation. FF3 does not imply a furnace/forge/heat/cooking-quality implementation.


## Model progress

Implemented domain-local reserve in `household/model.js`: optional `hearth.firewood` `{enabled,logs}` with exact keys, 5-log proposal capacity; stock/withdraw/supply on/off commands; finite boundary-aligned auto-feed; no cold ignition or off/away/unsupported refuelling. Existing manual light, drying, smoke and animal mechanisms retained. `stockFirewoodAction(key)` and read-only `householdFirewood(state,context)` are available for the host. Legacy missing reserve remains empty/off without a grant.

`node --test tests/household_firewood.test.js tests/p23-household.test.js tests/household_scene.test.js`: **19/19 pass**, including 7 new reserve scenarios and unchanged existing consumers. This is pure/model/host-contract evidence, not native execution. `FF3_HOST_PATCH.md` names exact H1 UI projection and H2 departure-context hunks awaiting source release. No host/main/UI edits made. Native/full gates pending.


## Host release and native candidate

Palette completed with an explicit runtime/style release in its live checkpoint and REPORT. FF3 now reserves `src/absorb_p23/household/host.js` for H1 supply projection/controls only, preserving the released FF1/FF2 fixture/scene work. P2's fresh status reserves `main.js` import/configuration only; FF3 still makes no concurrent main write and waits for P2's source release before H2. Model/helper/host controls use current native string action seam without a new dispatcher.

Disposable candidate `/var/folders/xb/njlqv84d65zbhd229mkw85zh0000gn/T/oops-ff3-_0itlhcc` contains the actual dirty snapshot plus explicit candidate-only H1/H2 hunks, recorded in ignored `docs/research/proto23/private/fire-furniture-2026-10-20/ff3/candidate-inputs.json`. Build passed. Native and browser firewood journeys are running there; H2 remains a proposal until shared integration. New test paths: `tests/helpers/household_firewood_fixture.mjs`, `tests/headless/household_firewood.test.js`, `scripts/playtest/household-firewood.mjs`. Shared included usage read 29% before these checks, under the deep-group 31% boundary.


Native candidate fixes in progress: failed root writes correctly set the existing save-blocked guard until reload, so the test now compares live inventory and durable bytes before supported reload rather than calling forbidden snapshot creation. A browser action target was hidden by the native Actions/Options reset after travel; the journey now reopens the actual Options control before acting. No UI navigation change is selected. H2 is refined to set `atHome:false` throughout travel **in both directions**, including return travel crossing fuel exhaustion, rather than projecting destination warmth over the journey. Candidate-only H2 still waits for P2's main release.

FF3 also reserves `src/household_scene.js` for one explanatory meter-note update after palette release: describe the now-real selected local supply instead of the previous manual-only note. Existing flame/fixture layout, styling and animation stay with the released FF1/FF2 implementation.


Native headless on the explicit H2 candidate passed **1/1** (12.48 s): rejected durable write preserves live exact inventory and durable bytes, native pause-until-reload recovery, stock/withdraw exact key, pending/final literal persistence, boundary auto-feed, departure reserve preservation, return/no automatic ignition, extinguish and empty stop. Browser pending/exhausted exact round trips and 41-minute batch equivalence already pass. Its remaining return-action issue was an ambiguous test selector matching both `main_content` and the Options button, corrected to `button[data-place-tab="options"]`; no navigation source change.

Isolated current candidate build, architecture and rules pass (one existing untracked-doc warning). Full suite and final browser journey are running; source-identity capture distinguishes H2 candidate-only main from live P2 composition. Shared meter observed **30%**, below the applicable 31% deep-group stop boundary. No new scope selected.


## Verified candidate, shared H2 integration still pending

Candidate source build/architecture/rules pass. Full suite: **2,380/2,380**, 33.87 s. Native headless: **1/1** on exact paid stock, failed native write/paused recovery, pending/final persistence and reserve policies. Final rebuilt **1920×1080 browser PASS**: visible 2/5 finite stock; one separate manual ignition; pending/exhausted/extinguished exact Save/reload/Export/literal Import; 41-minute batch versus singles; empty stop without carried-stock debit; departure and return crossing expiry leave reserve untouched; extinguish does not ignite stored logs. Optional absent private-pack manifest is the only expected resource failure; no other JS/page error. Fixtures are explicitly seeded, never personal saves or natural acquisition proof.

Verified candidate bundle `877d0d882375387556987f5cd32356f23accb313c1cbfcae120b3dacc94b9bf6`. Local-only map/logs/screenshots/literal exports are saved under `docs/research/proto23/private/fire-furniture-2026-10-20/ff3/`. Shared model, host controls and scene explanatory note are implemented. **H2 remains candidate-only while P2 holds main.js**; this is the one remaining integration action before source release/final acceptance. The exact hunk is in `FF3_HOST_PATCH.md`, refined to suppress warmth/feeding during travel in either direction. P2 reports full/native/browser gates passed and is finishing its release receipt.


### Budget-scope correction

The first FF3 usage reading was 29%. Earlier FF3 status conservatively borrowed the deep-group 31% boundary; that boundary belongs to COMMON's explicitly budgeted five P1–P5 invocations, not this separately user-authorized FF3 continuation. FF3 uses AU7's default five-point ceiling from its 29% first reading, therefore **34%**, with no new agents, paid fallback or scope expansion. Live shared reading is 31%; attribution remains shared/unknown. This corrects an over-broad local interpretation, not an allowance expansion request. Keep the P1–P5 group's own stop intact; FF3 may finish its finite integration within its own bound.


## Shared composition release acquired

P2 completed with explicit `release=true` in its final receipt/status. FF3 now reserves only the household travel-context line in `src/main.js`, reads fresh from disk, and applies tested H2. No P2 lamp/tools/reader/factory hunk is edited. Final candidate will refresh current changed source inputs and rerun native/browser checks; prior full suite remains input-qualified evidence for the earlier snapshot.


## Final FF3 result, 2026-10-20

**release=true for all FF3 paths.** H1 controls and H2 travel handling are integrated into shared source after recorded palette/P2 releases. No pending source patch remains. The model, host, scene note, main hunk and all FF3 regression/journey files match the final isolated candidate hashes.

A1: A player-stocked local pile holds up to five real exact-key logs. Auto-feed starts off; lighting still spends a carried log. Enabled supply feeds an already burning hearth at each fuel boundary while the living controlled owner is home. Empty/off/unsupported/away stops supply. The prepaid fire keeps burning during travel, while the reserve is untouched in **both directions**. Extinguish discards active fuel, keeps reserve/policy, and requires manual relighting. Withdraw returns the original stored key. Stock, reserve, heat/drying/smoke and sequence publish through the existing native transaction. No extra clock, storage scheduler, hidden inventory spend or wall-time upkeep.

A2: Host controls expose `n/5` stock, selected policy, exact-key stock actions and withdrawal; the existing scene/meter follows actual hearth fuel and now explains the real supply mechanism. Palette's FF1 flame/vent/fixture presentation is preserved. Shared main changed by FF3 only at H2's tick context; P2's lamp construction/composition remains intact. A concurrent owner also added household redraws at load completion and save ownership acquisition; FF3 preserved those and verified immediate restored actionability without a tick.

| Evidence | Result and input |
|---|---|
| V1 Focused | `node --test tests/household_firewood.test.js tests/p23-household.test.js tests/household_scene.test.js tests/domain_instance_isolation.test.js`: **26/26 PASS** on integrated inputs. Initial dedicated household-only command: 19/19. |
| V2 Full suite | `npm test`: **2,387/2,387 PASS**, 33.98s on integrated FF3+P2 snapshot. Earlier pre-integration candidate: 2,380/2,380. The final concurrent change adds only two existing-household observer redraw calls; final rebuilt browser covers them. No third equivalent full suite was run for those observer-only calls. |
| V3 Required static/build | Isolated build, architecture and rules PASS. Architecture: main 10303/10310, display 6699/6767, save 310/310; no new cycles. Rules: one existing untracked linked-document warning. Final build covers the two redraw calls. No rulebook change, so no rule-behavior gate selected. |
| V4 Native headless | `node --test tests/headless/household_firewood.test.js`: **1/1 PASS**, 9.86s on shared H2 + P2 inputs. Exact stock transfer/withdrawal, rejected write with live inventory/durable bytes preserved, existing save-blocked recovery via reload, refill boundary, departure/return/extinguish/empty and pending/final persistence. |
| V5 Rebuilt browser | `scripts/playtest/household-firewood.mjs` **PASS**, fresh disposable origin **1920×1080** on final candidate. Paid visible pile/ignition; pending, exhausted and extinguished exact Save/reload/Export/literal Import; controls ready after restore with no time advance; 41-minute batch equals singles; return/departure crossing exhaustion does not feed reserve. Only absent optional private-pack manifest is expected. No other JS/page error. |
| V6 Preservation | H2 replacement verified zero-loss outside its one line. Own whitespace/syntax checks pass. Final FF3 source hashes equal candidate. No commit/push/publish or personal-save operation. |

One build was mistakenly launched in the shared checkout during integration. It rewrote `dist/bundle.js`, its map and index fingerprints. These three paths were recovered from HEAD plus the captured pre-existing dirty binary diff **only after every recovered hash matched the initial FF3 input map**, then written back and reverified. The shared index was untouched. Ink attribution files were already unchanged. This incident is recorded in local `generated-recovery.json`; final shared generated bytes match their captured dirty inputs. Every subsequent build ran only in the isolated candidate.

Final candidate: `/var/folders/xb/njlqv84d65zbhd229mkw85zh0000gn/T/oops-ff3-_0itlhcc`.
Final bundle SHA-256: `6dd0438c999d914b522798ba6f747fb7b12359ae367c48b7ad1674601946507b`.
Local-only input map, technical/browser receipts, complete logs, screenshots and literal exports: `docs/research/proto23/private/fire-furniture-2026-10-20/ff3/`. No sealed truth is needed in this public receipt.

Reproduce the independently runnable browser journey:

```sh
node scripts/playtest/household-firewood.mjs /var/folders/xb/njlqv84d65zbhd229mkw85zh0000gn/T/oops-ff3-_0itlhcc /tmp/oops-ff3-proof
```

G1: Human play acceptance remains open. Seeded owned-home/hearth/log setup is distinct from natural campaign acquisition. FF3 implements hearth supply, not a new furnace/forge/temperature/cooking-quality mechanism. Larger furniture/world work remains with its selected owners. All FF3 browser/server/test processes have ended; source ownership is released for the next bounded task.
