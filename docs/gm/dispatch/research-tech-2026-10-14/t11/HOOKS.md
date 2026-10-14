# T11 hooks: quiet signs on existing surfaces

2026-10-14. Source-inspected findings and original proposals only. No runtime
change or playable verification. Prefix `N` belongs to this lane within this
wave. Read with [SIGNALS](SIGNALS.md), [EXAMPLES](EXAMPLES.md) and the
[round 8 owner](../../../../TECHNOLOGY_AND_PROGRESSION.md#subtle-layers-round-8-2026-10-14).
File:line locators describe the inspected checkout, not a built bundle.

## Source inventory

| Code | Shown in source, with locator | Small attachment and boundary |
|---|---|---|
| N1 | Village's `getDescription` branches on field clears, bridge completion and woods progress: `src/data/locations.js:330-345`. Static Shack/mill text: `:398`, `:416`; Infested field: `:469-477`; Town outskirts: `:1059-1065`; Town farms: `:1103-1108`; Town square: `:1248-1252`. Slums already branches on gang removal: `:1068-1076`. Base fallback is `src/models/location.js:109` | Replace or append one local sentence from a qualified local fact. Preserve native clear/bridge clauses. Field signs belong to the farm/work setting, not an automatic change to enemy counts, light penalties or work schedules. |
| N2 | Village and Town farms supply time-dependent noise arrays (`src/data/locations.js:346-376`, `:1109-1124`); Town square has market cries (`:1253-1262`). The caller samples with `Math.random` and logs category `background`: `src/main.js:7632-7643` | Existing eligibility fits overheard talk, but copying a line into this pool does not make delivery deterministic or durable. Prefer a stable local line or opt-in conversation for consequential clues. |
| N3 | Region mapping and saturation trickle: `src/market_saturation.js:10-12`, `:96-150`. Price modifier declines with effective sold count and never exceeds the starting value: `:159-178`. Item pricing reads quality, rarity, group/tier, region and multiplier: `src/items.js:255-305`. Trader margin also reads Haggling, reputation and accessories: `src/components/trader_component.js:141-145` | Add an explanation beside an actual quote. A low resale price can mean saturation. A high buying price can mean margin, quality or reputation, not a secret project. Native saturation cannot produce an above-base scarcity surge. |
| N4 | `eventFeed` projects existing owners, filters simulation events by `discoveredBy` and world, and excludes global unobserved logs: `src/event_feed.js:1-7`, `:34-45`. It uses selected player knowledge prefixes (`:47-54`), sorts stably and shows eight news rows (`:92-93`, `:102`). UI compares signatures, preserves lead buttons and uses collapsed Recent news: `src/event_feed_ui.js:7-15`, `:35-44` | Ambient facts are not automatically news. An optional observed transition can have a stable row ID/time. No general priority/coalescing or notification-consumption contract is shown here. Eight visible rows do not prevent upstream spam or guarantee lasting recall. |
| N5 | Native item keys ordinarily retain id/components/quality, not a maker: `src/items.js:237-252`. A special measured strip encodes schema, sample/measurement/production causes and maker: `src/world_completion_strip.js:5-17`. Exact preservation and envelope checks: `src/world_completion_native.js:10-17`, `:41-56`. Item-view projection and tooltip: `src/display.js:509-520`, `:2018` | A bounded stamped specimen is a precedent, not generic maker marks. A fixed authored shop variant can have a static description. Per-instance marks require a compatible reader, saved identity and custody checks; changing a template's description cannot establish who made each existing item. |
| N6 | Home world has a saved fact domain (`src/expansion_engine.js:73-86`); facts permit boolean/string/finite number only. Simulation effects write a scoped fact or named world's fact (`src/simulation_effects.js:243-246`) and project them (`:109`). Observation copies an existing world fact into actor facts with `observedAt` (`:228-231`); knowledge holds stage/value/time/cause/basis (`:281-284`) | One product/place fact is feasible as an additive primitive, paired with causal evidence. A nested diffusion object is not valid in this generic domain. Truth is not permission to show a distant place, an NPC's plan or an attribution. Native description getters need a narrow read-only state adapter; they currently receive no explicit expansion context. |
| N7 | Native `Textline.getText` is replaceable, with availability and required flags: `src/components/dialogue_component.js:49-94`. Village dialogue definitions include translation keys rather than all literal answer text: `src/data/dialogues.js:10-24`. Native answer context currently supplies season only: `src/main.js:3541-3545`; display translates answers: `src/display.js:4469-4471` | One repeatable, reward-free “What has changed?” answer can read observed evidence through an explicit adapter. It must not unlock rewards on every reading. A cover story with lasting beliefs needs a command/response owner, not just a dynamic answer string. Preserve localization. |
| N8 | `quietPlaceText` already returns a small known-Village weather/time line, hides with Effects off, and updates text only when it changes: `src/quiet_place_detail.js:3-14`. Main supplies knownVillage, calendar/weather/roof/effects and refreshes it: `src/main.js:8409-8415` | Cheapest cosmetic surface for one known local sign, such as a lit lane. Current module explicitly excludes durable lore. Adding adoption input is a proposed extension; preserve the weather fallback and Effects-off contract. Durable/important evidence must also remain reachable in description or dialogue. |
| N9 | Native trade refreshes stock on opening (`src/trade.js:55-60`), fingerprints the quote and refuses stale acceptance (`:77-99`). Staging moves exact item keys and quantities, updates market and creates a bounded value-summary history receipt: `src/native_trade_transaction.js:9-45`. Trader stock generation uses `Math.random`: `src/components/trader_component.js:109-129`; refresh may erase ordinary stock, retaining only designated campaign items (`:69-87`) | Record purchase evidence at successful publication, never basket preview or failed acceptance. Current history lacks item list, buyer observation and actorId; it is capped at 100. It is insufficient for durable “this observer saw a bulk purchase” or maker lineage. A copy displayed as an actual sale item needs real stock and a retention policy. |

Native saturation is saved at `src/main.js:5200` and restored at `:6783`;
daily recovery/trickle occurs at `:7320-7321`. Trader refresh markers are saved
at `:5117` and restored at `:6457`; due refreshes can be serialized as -1.
Expansion state enters the envelope at `:5240`. These are SOURCE bindings,
not proof that any proposed facts, prices or new stock survive import.

Existing local adoption-like narrative: `town.return` shares a corrected
ledger, sets `town.returned` and grants a useful route source
(`src/town_content.js:42-46`); `townScene` reads these facts without grants
(`:55-63`). This is a bounded knowledge/service precedent, not proof of soap,
lamp or tool diffusion. Field workshop separately writes and observes world
facts (`src/field_workshop.js:7-10`, `:78-84`).

The description is read into the visible location text and tooltip by
`src/display.js:2169`, `:2815-2818`. Refresh those existing projections after a
qualified transition; do not append DOM text on each tick. N8 is already a
separate bounded cosmetic refresh path.

Broader `price/vendor/shop/market/trade` search also found home-world finite
shop contracts and exchange work. Courtyard customer quotes use actual purses,
transfers, received knowledge and closed-offer facts
(`src/management/shops_auctions.js:9-23`); the auction has a disclosed competing
bid and explicit lot transfer (`:33-46`). These are local fixed offers, not a
regional demand-price simulator. The Village parcel exchange preserves a
delivery, actual recipient test and later received account
(`src/exchange_content.js:38-46`), a useful producer-to-use precedent. None proves
soap/lamp adoption or a general purchase watcher. Template trade eligibility
is separate from saved trader stock (`src/models/trade_item.js:10-19`). This
bounded audit does not inspect every world shop or claim an engine-wide absence.

## N10. Ownership and name overlaps

Read dispatch-level `*/STATUS.md`, dispatch and nested CHECKPOINT files for
the audited filenames and their shared owners. Declarations below were current
at this pass; they are not a process-liveness probe or a source-write transfer.

| Owner record | Overlap and disposition |
|---|---|
| [Wave sessions](../SESSIONS.md), [T8 checkpoint](../t8/CHECKPOINT.md), [T10 checkpoint](../t10/CHECKPOINT.md) | T11 session `01a138cd-f952-7770-8e59-e35ef3010508` writes t11 only. T8/B owns seeded diffusion/history proposals, T10/U craft text and provenance; reuse their contracts if selected, do not create competing simulation or craft catalogues. T4/H supplies adoption distinctions. |
| [Foundation R15 checkpoint](../../foundation-adoption-next-2026-10-13/CHECKPOINT.md) | R15 integration root owns shared runtime/main/save/build integration. Its latest recorded integration is 2026-10-14 00:58, with W1 integration still awaiting shared-doc clearing. This newer record supersedes older R14/World1 pause summaries for ownership routing. No T11 runtime writer is assigned. |
| [UI density checkpoint](../../ui-density-slices-2026-10-13/CHECKPOINT.md), [Vivid checkpoint](../../vivid-proto23-flow-2026-10-13/CHECKPOINT.md), [crafting checkpoint](../../crafting-screen-2026-10-13/CHECKPOINT.md) | Density and Vivid release their workers/paths; crafting is complete but does not explicitly release its `display.js` reservation. Shared display, main and quiet-place integration needs the current coordinator's exact reservation before a future build. Old completion does not establish that source is unowned now. |
| [Procgen status](../../procgen-2026-10-13/STATUS.md), [P20 checkpoint](../../procgen-2026-10-13/p20/CHECKPOINT.md), [P24 checkpoint](../../procgen-2026-10-13/p24/CHECKPOINT.md) | P20 place memory and P24 observer/news/item-story work are docs-complete. CR4 makers/economy and P36/P37 micro texture are listed running; integration root owns a separate `proc/wave1-integration` branch. These topic overlaps grant no main source authority. No narrow dedicated current owner for `event_feed*`, saturation or native locations/traders was identified by the bounded filename scan; consult the shared integrator, do not assume free ownership. |
| [Minigames checkpoint](../../minigames-2026-10-11/CHECKPOINT.md) | `shops_auctions` worker reservation is explicitly released. The later checkpoint supersedes its old no-merge boundary; main integration remains distinct from candidate/source proof. Do not redefine its finite offers as regional adoption. |

Name collisions: World1 already uses N1-N5 native proof labels
([checkpoint](../../world1-full-completion-2026-10-11/CHECKPOINT.md)); the
nonhuman wave also has N codes ([bonds checkpoint](../../nonhuman-starts-2026-10-14/bonds/CHECKPOINT.md)).
Use **T11/Nx** outside this folder. T8/B, T10/U and T4/H remain their own
codes. `Village` the native location and market region is not `villageTrader`
the NPC or `village trader` the trader definition (`src/data/npcs.js:81`,
`src/data/traders.js:9-14`). Town square is a location, not automatically a
market-region key. Use actual world/instance and native place IDs, not labels
or “town” as a new implicit shared namespace. Example product IDs below are
proposed T11 names, not registered items or existing NPC promises.
