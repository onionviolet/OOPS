# D4 cheat family reconciliation (2026-10-25)

This reconciles the source rows in [INVENTORY.md](INVENTORY.md) into mechanisms that can share an implementation route. An inventory ID is a source-row pointer, not proof that similarly named book powers are equivalent. Every listed source row remains individually named in INVENTORY.md; the membership sets below use its IDs and aliases. Source palettes remain proposals unless the D4 status table or an accepted rule says otherwise.

## Status key and common authority

- **Built** means the bounded D4 behavior actually runs through a native owner.
- **Buildable existing-policy adapter** means the owner and governing behavior already exist; a card adapter can call them without adding a world rule. It is a candidate, not a claim that the card is implemented or selected.
- **Unsupported prerequisite** means the needed native policy/content consumer does not exist yet. Missing cheat glue alone is not a prerequisite.
- **Larger-policy proposal** means the effect changes world time, lives/carry, actors, property, consent, fate, or cross-world compatibility beyond an existing accepted mechanism.

Authority: cheat ideas are proposals until accepted (AD32); means work by their actual mechanisms (AD6, AD38); the quiet personal faculty is the default and a talking system is a separate accompanying cheat (AD29); titles distinguish recognition from granted effect (AD30); local economies and power remain world-relative (AD27–AD28). Router: [RULES_INDEX.md:83-105, 127-200](../../../RULES_INDEX.md). The engine-family map in [SIMULATORS_AND_CHEAT_IMPLEMENTATION.md:798-818](../../../SIMULATORS_AND_CHEAT_IMPLEMENTATION.md) is explicitly palette material, not authority.

## Reconciled families

| Mechanism family and inventory membership | Existing bounded route and owner | Classification and boundary |
|---|---|---|
| **F01 Observation and information readings**: `SH2–SH6`, `SH8–SH18`, `SH19–SH26`; information-named rows in `CLF-*`, `CO-*`, and `CW-*`. Key aliases: **True Appraisal = SH4 = IM17**, **Fate Ledger = SH1 = IM20**, **Freshness Sense = SH3**. | D4 routes `observeCarcass` (`src/harvest.js:95`) and `peekStreamDecision` (`src/seeded_streams.js:47-54`) through the cheat host and UI. SH3 has one bounded target: display the timestamp/age of an already saved observation, including D4 appraisal records, without refreshing its content. Other owners (`world_knowledge.js`, `people_knowledge.js`, `causal_situations.js`) are domain data, not a universal reader. | **Built**: True Appraisal and Fate Ledger as the D4 status table defines them. **Built bounded route**: SH3 Freshness Sense over retained observer timestamps (`information_freshness.js`, `FRESHNESS_BROWSER.json`). **Unsupported prerequisite**: retained source facts for a named source power: agenda drift/rapport (SH5/13), hidden-discovery presence rules (SH9), cross-observer truth/grade (SH18), retcon/era/plot variance (SH19–26). The native loot call receipt and player observations already work; adding a view over those does not supply these absent world mechanisms. Causality/notice/debt views over already observed native records remain existing UI, not new hidden-reading powers. **Larger-policy proposal**: true sight, prophecy, or reads crossing the owner’s knowledge boundary. Similar “reveals information” wording does not establish equivalence. |
| **F02 Native random decision reading and intervention**: `PC10 / IM18` Loaded Dice; `SH1` Fate Ledger; seeded/probability rows among `CLF-*`, `CW-*`, `CW-G-*` and `CO-*`. | `src/seeded_streams.js:47-54, 88-115` owns pure keyed decisions, consuming calls, receipts and armed calls; D4 actions use `src/cheat_mechanisms.js` and `src/cheat_host.js`. | **Built**: Loaded Dice commits a low next loot call; Fate Ledger reads a visible foe's loot decision. **Unsupported prerequisite**: a source-specific stable decision key and native consumer if the referenced activity is not already addressable. **Larger-policy proposal**: fortune transfers, protected luck, probability control, branch selection, talent lottery, or cross-world RNG effects. Seeded RNG alone does not provide a source power's targets, costs, fallout, or future knowledge. |
| **F03 Finite learned routine / automation**: `PC08` Earned Habit; `CW-G-231` Earned automation; other routine/auto-production rows remain separate proposals. | D4 binds `setHarvestRoutine` to the existing carcass processor in `src/harvest.js`; action/costs are in `src/cheat_mechanisms.js`. The slice requires prior manual processing and honors native tools, time, occupation, and interruption. | **Built**: D4's finite carcass routine. **Unsupported prerequisite**: each other named activity needs its own native action owner, learned-repeat trigger, inputs, and stop conditions. **Larger-policy proposal**: broad unattended work, autonomous spending, NPC direction, or automation outside native constraints. `CW-G-231` matches only if kept to this same finite routine; no broader equivalence is inferred. |
| **F04 Offline progress and time scaling**: `PC02` Patient Furnace; `CLF-52`; time/away rows among `CW-*`, `CW-G-*`, and `CO-*`. | Accepted OD4 runs chosen routines while away, advances current-world time, and pauses for important choices or exhausted supplies; aging depends on world/settings ([DIRECTION_SUMMARY.md:14-16](../../../DIRECTION_SUMMARY.md), [USER_VISION.md:3525-3539](../../../USER_VISION.md)). TBANK accepts eligible unused time across lives/worlds, spent in a supported active world, with rates/limits open ([DIRECTION_SUMMARY.md:27-28](../../../DIRECTION_SUMMARY.md), [DIRECTION_SYNTHESIS.md:489-538](../../../DIRECTION_SYNTHESIS.md)). `src/away_ledger.js:5-48` provides accounting math; `src/chronicle.js` and existing current-world forward routines own time/events/choice boundaries. `src/main.js:9256-9257` is stale implementation commentary, not policy authority. | **Built bounded route**: Patient Furnace (`patient_furnace.js`, `FURNACE_BROWSER.json`) using actual current-world clock, finite supplies, native outputs/XP, atomic debit, and continuing-journey bank. Missing glue was implemented, not treated as a policy blocker. Native awake cadence and30-minute UI chunks are reversible data defaults, with the full unused bank retained. **Unsupported prerequisite**: a named activity without a native routine, inputs, or result owner. **Larger-policy proposal**: time dilation, simulated-life rewards, time-free gains, rewind/backward time, new cross-world conversion, or invented aging/loss. Do not promote the idea card's fuel/helper, cap, or danger examples to accepted rules. |
| **F05 Loops, checkpoints, death return, rebirth, and life carry**: `CLF-43`, `CLF-44`, `CLF-62`, `CLF-163`, `CLF-165`; `PC01`, `PC03`, `PC06`, `PC07`, `PC11`; time/carry source rows in `CW-*`, `CW-G-*` and `CO-*`. | `src/life_experience_host.js`, `src/continuation_host.js`, `src/heir_inheritance.js` and `src/carry_ledger.js` own distinct life/carry transactions. `src/expansion_engine.js` scenario rewind restores its documented scenario snapshot. RF1's registered holder power and paid rematch are built; estate bequests are a separate owner. | **Built**: RF1's witnessed-opening memory on a paid rival rematch (see `CHEAT_LIBRARY.md:1575-1579` and `CHECKPOINT.md:96-105`). **Built bounded route**: PC03 Heirloom Compact exact owned-lot nomination and actual native estate claim (`heirloom_compact.js`, `COMPACT_BROWSER.json`). **Larger-policy proposal**: Echo Anchor resets, death-menu carry choices, time loops, prestige/rebirth rewards, Instinct Inheritance, or switching concurrent selves; each needs its own reset/carry/identity policy. RF1 is not temporal rewind. |
| **F06 Craft, blueprint, item-copy, and material transformation**: `PC04` Traveler's Pattern Book; `CLF-48`, `CLF-49`, `CLF-153`, `CLF-154`; named craft/copy source rows in `B*`, `CW-*`, `CW-G-*`, `CO-*`, and `CL-BOOK-*`. | `src/craft_ledger_domain.js`, `src/craft_reference.js`, `src/craft_resolver.js` and `src/crafting_domain.js` own known recipe records, knowledge-redacted forecasts, and actual native crafting. `src/harvest.js` owns carcass processing only. | **Built bounded route**: PC04 readable native method -> retained design -> actual heir carry -> paid reconstruction into native crafting; PATTERN_BROWSER.json. Forecasts remain the crafting owner’s redacted projection; raw failure residue is not copied. **Unsupported prerequisite**: a source-specific recipe/copy consumer absent from the native content and transaction. **Larger-policy proposal**: ability copying, arbitrary duplication, perfect craft results, copying powers/identity, free materials, or revealing hidden craft residue. A blueprint record, carcass routine, and item duplicator are distinct mechanisms. |
| **F07 Inheritance, estates, debts, gifts, contracts, and patron backing**: `PC03` Heirloom Compact; relationship/economy/deal source rows in `CLF-*`, `CO-*`, `CW-*`, `CW-G-*`; `SH12` and `SH16`. | Actual estate/debt owners include `src/heirloom_items.js`, `src/economy_domain.js`, `src/heir_inheritance.js` and agreed-duty/obligation owners. D4's `carry_ledger` carries cheat development provenance, not estate property. | **Built bounded route**: PC03 counted bequest/claim over the actual estate, current successor law and debt records; actual beginHeir conservation and claim receipt verified. **Unsupported prerequisite**: a row whose named world lacks its stated estate/debt/contract record. **Larger-policy proposal**: universal inheritance, gift multipliers, imposed bargains, generic patron revocation, or inferred refusal/consent. Data for one native party/transaction is not a general ledger or contract system. |
| **F08 Skills, talents, training, body traits, and power acquisition**: skill/body-named rows in `CLF-*`, `PC-*`, `CO-*`, and `CW-*`; `SH17`. | Native learning/grants belong to `src/techniques.js`, `src/skill_discovery.js`, `src/models/skill.js`, and `src/skill_expansion_host.js`; body/health contracts live with their world owners. | **Unsupported prerequisite**: the exact source technique/trait, eligibility, body/effect consumer, or training route when absent. **Larger-policy proposal**: talent lottery, innate random traits, instant mastery, permanent body rewriting, gene economy, theft, or changing a native effect's power. The skill system is a possible carrier, not a substitute for the source's backing/fuel/cost/scope. |
| **F09 Titles, achievements, milestones, and rewards**: `CLF-45 / CARD-system-quests`; `CLF-166-167`; `PC12`; `D4-QF`, `D4-SQ`; title/achievement-named `CO-*` and `CW-*` rows. | `src/titles.js` has native titles/counters/bonuses. D4's optional system quest adds one actual won-zone counter and manual first-victory claim through `src/cheat_mechanisms.js:systemQuestProjection`. | **Built**: finite first-victory quest claim, not a general quest platform. **Partial**: the accompanying card shell predates that finite route. **Larger-policy proposal**: title collector as an added game loop, general achievement points/shop, World Deeds across lives/worlds, daily streaks, or title-granted power without a world rule. Existing title recognition remains distinct from supplied effect (AD30/SLR40-43). |
| **F10 Actors, companions, summons, clones, followers, and possession**: actor-named rows in `CLF-*`, `CO-*`, `CW-*`, `CW-G-*`; `IM19 / RF1`. | RF1 is a registered holder-owned power consumed by existing native and party combat planners; paid recovery/rematch and observer knowledge use existing owners. Other actor/companion records and world-layer actors do not automatically provide a player-use summon/controller route. | **Built**: RF1's bounded witnessed-opening/rematch mechanism. **Unsupported prerequisite**: remaining source-specific actor/controller/content route. **Larger-policy proposal**: independent multi-body agency, possession, follower growth, soul binding, cross-life summon, or unbounded clones. A saved actor or roster entry does not mean that actor is a cheat user or controllable summon. |
| **F11 Space, storage, buildings, territory, hubs, and cross-world travel**: space/travel-named rows in `CLF-*`, `CO-*`, `CW-*`, and `CW-G-*`. | `src/expansion_engine.js` has modeled places/actors and `previewCarrierTransit`; actual inventory, property, and world custody remain owned by their native domains. Cosmology backing/compatibility is a proposal framework (`CHEAT_COSMOLOGY.md:39-82`). | **Unsupported prerequisite**: the named native place/property/inventory/travel transaction where absent. **Larger-policy proposal**: pocket worlds, extra-dimensional storage, portable territory, cross-world compatibility, or new toll/reach rules. An inventory UI or carrier preview is not the source's space power. |
| **F12 World-scale edits, fortune transfer, energy absorption, curses/blessings, and combat effects**: effect/power-named rows in `CLF-*`, `CO-*`, `CW-*`, and `CW-G-*`. | Relevant native owners include `src/combat_math.js`, `src/harvest.js`, `src/rule_modules.js` and specific world ability/condition transactions. Cosmology requires per-placement backing, trigger, fuel, targets, reach, compatibility, anti-feats, and carrier (`CHEAT_COSMOLOGY.md:39-82`). | **Unsupported prerequisite**: a named effect without an active native effect transaction/target. **Larger-policy proposal**: arbitrary editing, fortune theft, universal multipliers, absorb/fuse, curses, or cross-world compatibility. Do not treat a related stat/combat/effect owner as implementation of the referenced power. |
| **F13 Simulator modes, branch tests, projections, dreams, and keeps**: all `SIM-*` rows. | Existing engine palette is at [SIMULATORS_AND_CHEAT_IMPLEMENTATION.md:24-83](../../../SIMULATORS_AND_CHEAT_IMPLEMENTATION.md): S2 forked state, S3 injected combat estimates, S1 authored coarse model. `src/seeded_streams.js` supplies seeded decisions; `src/simulation.js` and `src/expansion_engine.js` own different forward models. | **Unsupported prerequisite**: long-horizon life simulation or any unseeded native consumer outside a validated fork. **Larger-policy proposal**: dream decisions, seed locking, prophecy, unknown-truth access, cross-run keeps, or simulator charges/rewards. The source explicitly calls these modes and keeps proposals; an estimate does not implement an A.I. Chip or foreknowledge power. |

## Source-row coverage and deduplication

The membership notation above points into the row-by-row ledger, which preserves every original name and source locator. `CLF-*` points to condensed cheat-library rows; `PC*` to player-side idea cards; `SH*` to information cards; `CO-*` to cosmology placements; `SIM-*` to simulator modes/keeps; `CW-*` and `CW-G-*` to the by-world rows; `D4-*` to delivered runtime rows. The literal appendix maps every inventory row to one family code and a per-row resolution. Where a source-specific row still needs its own backing/consumer audit, the appendix keeps it in a proposal family rather than inferring an adapter from its name.

Broad equivalence must be justified from source evidence. In particular, a simulator estimate is not prophecy; a keyed loot peek is not generalized fate control; one carcass appraisal is not omniscience; a finite carcass routine is not autonomous life automation; heir cheat-development carry is not estate inheritance; native craft knowledge is not arbitrary duplication; and a native actor record is not a summoned independent self. `CHEAT_COSMOLOGY.md:39-58, 270-335` requires backing and compatibility to be stated per source. `CHEATS_BY_WORLD.md` labels its extracted rows proposals; its description says 70 additions while the table/prose enumeration is not a one-to-one 70-card set, so the inventory’s distinct row IDs, not that headline, are the accounting surface.

## Final bounded routes and remaining scope

RF1 is built in `0d9a9bce`, Pattern Book in `af60e0b2`, Heirloom Compact in `0c6f0a7e`, Patient Furnace in `0c9c0e68`, Freshness Sense in `12d778ae`. Native source adapters identified as buildable by this reconciliation are implemented and browser-verified. Broader source powers keep their distinct backing, costs and world policies. No optional substitute based solely on a similar name is promoted to an implementation claim.

## Literal row-to-family coverage

The table lists each INVENTORY.md row ID exactly once and points it to a family code and a current resolution. A source alias joined into one inventory ID stays joined in that row. The resolution is per source row: a buildable adapter is limited to the stated native owner; it does not make a broader reference power equivalent.

| Inventory row ID | Family | Current resolution |
|---|---|---|
| `SIM-K1` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-K2` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-K3` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-K4` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-K5` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `CLF-43` | F04 | larger-policy proposal: this is a time power/reset beyond ordinary supported forward offline routines |
| `CLF-44` | F04 | larger-policy proposal: this is a time power/reset beyond ordinary supported forward offline routines |
| `CLF-45 / CARD-system-quests` | F09 | partial existing card shell; finite D4 first-victory route is delivered under D4-SQ |
| `CLF-46` | F09 | larger-policy proposal: this reward loop exceeds native title recognition and finite first-victory claim |
| `CLF-47` | F07 | larger-policy proposal: source-specific parties, property, terms, and settlement effects |
| `CLF-48` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CLF-49` | F06 | larger-policy proposal: this copy/craft effect is not the bounded Pattern Book design route |
| `CLF-50` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `CLF-51` | F11 | proposal: source-specific space, ownership, custody and travel mechanism remains unselected |
| `CLF-52` | F04 | larger-policy proposal: this is a time power/reset beyond ordinary supported forward offline routines |
| `CLF-53` | F02 | larger-policy proposal: source-specific decision target, costs, fallout, and future-knowledge rules |
| `CLF-54` | F10 | proposal: source-specific actor autonomy, backing, control and sharing policy remains unselected |
| `CLF-55` | F10 | proposal: source-specific actor autonomy, backing, control and sharing policy remains unselected |
| `CLF-56` | F10 | proposal: source-specific actor autonomy, backing, control and sharing policy remains unselected |
| `CLF-57` | F10 | proposal: source-specific actor autonomy, backing, control and sharing policy remains unselected |
| `CLF-58` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CLF-59` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `CLF-60` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CLF-61` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CLF-62` | F05 | larger-policy proposal: source-specific reset, life, identity, and carry rules remain unselected |
| `CLF-63` | F11 | proposal: source-specific space, ownership, custody and travel mechanism remains unselected |
| `CLF-149` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `CLF-150` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CLF-151` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CLF-152` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CLF-153` | F06 | larger-policy proposal: this copy/craft effect is not the bounded Pattern Book design route |
| `CLF-154` | F06 | larger-policy proposal: this copy/craft effect is not the bounded Pattern Book design route |
| `CLF-155` | F10 | proposal: source-specific actor autonomy, backing, control and sharing policy remains unselected |
| `CLF-156` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CLF-157` | F07 | larger-policy proposal: source-specific parties, property, terms, and settlement effects |
| `CLF-158` | F07 | larger-policy proposal: source-specific parties, property, terms, and settlement effects |
| `CLF-159` | F07 | larger-policy proposal: source-specific parties, property, terms, and settlement effects |
| `CLF-160` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `CLF-161` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CLF-162` | F02 | larger-policy proposal: source-specific decision target, costs, fallout, and future-knowledge rules |
| `CLF-163` | F04 | larger-policy proposal: this is a time power/reset beyond ordinary supported forward offline routines |
| `CLF-164` | F02 | larger-policy proposal: source-specific decision target, costs, fallout, and future-knowledge rules |
| `CLF-165` | F05 | larger-policy proposal: source-specific reset, life, identity, and carry rules remain unselected |
| `CLF-166` | F09 | larger-policy proposal: this reward loop exceeds native title recognition and finite first-victory claim |
| `CLF-167` | F09 | larger-policy proposal: this reward loop exceeds native title recognition and finite first-victory claim |
| `CLF-168` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CLF-169` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CLF-170` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `CLF-171` | F10 | proposal: source-specific actor autonomy, backing, control and sharing policy remains unselected |
| `CLF-172` | F11 | proposal: source-specific space, ownership, custody and travel mechanism remains unselected |
| `CLF-179` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CLF-180` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CLF-181` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CLF-182` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `PC01` | F05 | larger-policy proposal: source-specific reset, life, identity, and carry rules remain unselected |
| `PC02` | F04 | built bounded native route; see final source inventory and browser receipt |
| `PC03` | F05 | built bounded native route; see final source inventory and browser receipt |
| `PC04` | F06 | built bounded native route; see final source inventory and browser receipt |
| `PC05` | F02 | larger-policy proposal: source-specific decision target, costs, fallout, and future-knowledge rules |
| `PC06` | F05 | larger-policy proposal: source-specific reset, life, identity, and carry rules remain unselected |
| `PC07` | F05 | larger-policy proposal: source-specific reset, life, identity, and carry rules remain unselected |
| `PC08` | F03 | built bounded route: finite carcass routine after prior manual processing |
| `PC09` | F02 | larger-policy proposal: source-specific decision target, costs, fallout, and future-knowledge rules |
| `PC10 / IM18` | F02 | built bounded route: paid durable next loot call |
| `PC11` | F10 | proposal: source-specific actor autonomy, backing, control and sharing policy remains unselected |
| `PC12` | F09 | larger-policy proposal: this reward loop exceeds native title recognition and finite first-victory claim |
| `SH1` | F02 | built bounded route: pure visible encounter loot-decision reading |
| `SH2` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `SH3` | F01 | built bounded native route; see final source inventory and browser receipt |
| `SH4 / IM17` | F01 | built bounded route: retained carcass observation with improved precision |
| `SH5` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `SH6` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `SH7` | F10 | proposal: source-specific actor autonomy, backing, control and sharing policy remains unselected |
| `SH8` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `SH9` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `SH10` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `SH11` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `SH12` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `SH13` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `SH14` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `SH15` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `SH16` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `SH17` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `SH18` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `IM19` | F10 | built bounded native route; see final source inventory and browser receipt |
| `IM20` | F02/F03/F04/F06/F07 | built bounded native route; see final source inventory and browser receipt |
| `B01` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `B09` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `B12` | F10 | proposal: source-specific actor autonomy, backing, control and sharing policy remains unselected |
| `B21` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CO-B-91` | F02 | larger-policy proposal: source-specific decision target, costs, fallout, and future-knowledge rules |
| `CO-B-92` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-B-93` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `CO-B-94` | F04 | larger-policy proposal: this is a time power/reset beyond ordinary supported forward offline routines |
| `CO-B-95` | F04 | larger-policy proposal: this is a time power/reset beyond ordinary supported forward offline routines |
| `CO-B-96` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CO-B-97` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-B-98` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-B-99` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-B-100` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-B-101` | F04 | larger-policy proposal: this is a time power/reset beyond ordinary supported forward offline routines |
| `CO-B-102` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-B-103` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CO-B-104` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-B-105` | F04 | larger-policy proposal: this is a time power/reset beyond ordinary supported forward offline routines |
| `CO-B-106` | F11 | proposal: source-specific space, ownership, custody and travel mechanism remains unselected |
| `CO-B-107` | F11 | proposal: source-specific space, ownership, custody and travel mechanism remains unselected |
| `CO-B-108` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-B-109` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CO-B-110` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CO-B-111` | F04 | larger-policy proposal: this is a time power/reset beyond ordinary supported forward offline routines |
| `CO-B-112` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `CO-B-113` | F11 | proposal: source-specific space, ownership, custody and travel mechanism remains unselected |
| `CO-B-114` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CO-B-115` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-S-143` | F07 | larger-policy proposal: source-specific parties, property, terms, and settlement effects |
| `CO-S-144` | F09 | larger-policy proposal: this reward loop exceeds native title recognition and finite first-victory claim |
| `CO-S-145` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-S-146` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-S-147` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-S-148` | F06 | larger-policy proposal: this copy/craft effect is not the bounded Pattern Book design route |
| `CO-S-149` | F02 | larger-policy proposal: source-specific decision target, costs, fallout, and future-knowledge rules |
| `CO-S-150` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-S-151` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-S-152` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-S-153` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-S-154` | F11 | proposal: source-specific space, ownership, custody and travel mechanism remains unselected |
| `CO-S-155` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-S-156` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-S-157` | F11 | proposal: source-specific space, ownership, custody and travel mechanism remains unselected |
| `CO-S-158` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-S-159` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CO-S-160` | F06 | larger-policy proposal: this copy/craft effect is not the bounded Pattern Book design route |
| `CO-S-161` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CO-W-887` | F04 | larger-policy proposal: this is a time power/reset beyond ordinary supported forward offline routines |
| `CO-W-888` | F10 | proposal: source-specific actor autonomy, backing, control and sharing policy remains unselected |
| `CO-W-889` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-W-890` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-W-891` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-W-892` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-W-893` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-W-894` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-W-895` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-W-896` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-W-897` | F11 | proposal: source-specific space, ownership, custody and travel mechanism remains unselected |
| `CO-W-898` | F06 | larger-policy proposal: this copy/craft effect is not the bounded Pattern Book design route |
| `CO-W-899` | F05 | larger-policy proposal: source-specific reset, life, identity, and carry rules remain unselected |
| `CO-W-900` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-W-901` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-W-902` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-W-903` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-H-1144` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-H-1145` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-H-1146` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-H-1147` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `CO-H-1148` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-H-1149` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `SIM-65` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-66` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-67` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-76` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-77` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-78` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-79` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-80` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-81` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-82` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-F-156` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-F-158` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-F-159` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-F-160` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-F-161` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-F-162` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-C-806` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-C-807` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-C-808` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-C-809` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-C-810` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-C-811` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-C-812` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-C-813` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-C-814` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-C-815` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-C-816` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-C-817` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `SIM-C-818` | F13 | larger-policy proposal: simulator mode/keep is palette material; fidelity, costs, knowledge, and reward are unselected |
| `CW-ALT-01` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-ALT-02` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-ALT-03` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-ALT-04` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-ALT-05` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-ALT-06` | F02 | larger-policy proposal: source-specific decision target, costs, fallout, and future-knowledge rules |
| `CW-ALT-07` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-ALT-08` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `CW-ALT-09` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-ALT-10` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-EN-01` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-EN-02` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-EN-03` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CO-EN-04` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CL-BOOK-01` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-43` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-44` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-45` | F10 | proposal: source-specific actor autonomy, backing, control and sharing policy remains unselected |
| `CW-46` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-47` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-48` | F10 | proposal: source-specific actor autonomy, backing, control and sharing policy remains unselected |
| `CW-49` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-50` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-51` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-52` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-53` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-59` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-60` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-61` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-67` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-68` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-69` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-75` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-76` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `CW-77` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-83` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-84` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CW-85` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CW-91` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-92` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-98` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-99` | F02 | larger-policy proposal: source-specific decision target, costs, fallout, and future-knowledge rules |
| `CW-100` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-101` | F10 | proposal: source-specific actor autonomy, backing, control and sharing policy remains unselected |
| `CW-102` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-103` | F11 | proposal: source-specific space, ownership, custody and travel mechanism remains unselected |
| `CW-109` | F02 | larger-policy proposal: source-specific decision target, costs, fallout, and future-knowledge rules |
| `CW-110` | F10 | proposal: source-specific actor autonomy, backing, control and sharing policy remains unselected |
| `CW-116` | F05 | larger-policy proposal: source-specific reset, life, identity, and carry rules remain unselected |
| `CW-117` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-123` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CW-124` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-125` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-126` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `CW-127` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-128` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-129` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-130` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-131` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-132` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-133` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CW-134` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CW-135` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CW-136` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CW-137` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-138` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-139` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-140` | F09 | larger-policy proposal: this reward loop exceeds native title recognition and finite first-victory claim |
| `CW-141` | F05 | larger-policy proposal: source-specific reset, life, identity, and carry rules remain unselected |
| `CW-147` | F07 | larger-policy proposal: source-specific parties, property, terms, and settlement effects |
| `CW-148` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-149` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CW-150` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-151` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-152` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-153` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-154` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-155` | F10 | proposal: source-specific actor autonomy, backing, control and sharing policy remains unselected |
| `CW-156` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-157` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-158` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CW-159` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-201` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-202` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-203` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-204` | F02 | larger-policy proposal: source-specific decision target, costs, fallout, and future-knowledge rules |
| `CW-G-205` | F06 | larger-policy proposal: this copy/craft effect is not the bounded Pattern Book design route |
| `CW-G-206` | F03 | unsupported prerequisite: source-specific native action, learned-repeat trigger, inputs, and stop conditions |
| `CW-G-207` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CW-G-208` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-209` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-210` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CW-G-211` | F11 | proposal: source-specific space, ownership, custody and travel mechanism remains unselected |
| `CW-G-212` | F11 | proposal: source-specific space, ownership, custody and travel mechanism remains unselected |
| `CW-G-213` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-214` | F05 | larger-policy proposal: source-specific reset, life, identity, and carry rules remain unselected |
| `CW-G-215` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-216` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-217` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-218` | F05 | larger-policy proposal: source-specific reset, life, identity, and carry rules remain unselected |
| `CW-G-219` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CW-G-220` | F01 | proposal: source-specific backing, retained facts and knowledge reach are not selected by this information-power name |
| `CW-G-221` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-222` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-223` | F04 | larger-policy proposal: this is a time power/reset beyond ordinary supported forward offline routines |
| `CW-G-224` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-225` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-226` | F04 | larger-policy proposal: this is a time power/reset beyond ordinary supported forward offline routines |
| `CW-G-227` | F04 | buildable existing-policy adapter: Melvor-like catch-up for one chosen supported current-world native routine, under OD4's important-choice and supply stops and TBANK accounting; no automatic combat, aging change, or arbitrary offline script |
| `CW-G-228` | F03 | unsupported prerequisite: source-specific native action, learned-repeat trigger, inputs, and stop conditions |
| `CW-G-229` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CW-G-230` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CW-G-231` | F03 | larger-policy proposal: source automation spans learned individual tasks and rebirth; not the finite D4 carcass routine |
| `CW-G-232` | F05 | larger-policy proposal: source-specific reset, life, identity, and carry rules remain unselected |
| `CW-G-233` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-234` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-235` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CW-G-236` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-237` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CW-G-238` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-239` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-240` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CW-G-241` | F05 | larger-policy proposal: source-specific reset, life, identity, and carry rules remain unselected |
| `CW-G-242` | F11 | proposal: source-specific space, ownership, custody and travel mechanism remains unselected |
| `CW-G-243` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-244` | F05 | larger-policy proposal: source-specific reset, life, identity, and carry rules remain unselected |
| `CW-G-245` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-246` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CW-G-247` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CW-G-248` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-249` | F10 | proposal: source-specific actor autonomy, backing, control and sharing policy remains unselected |
| `CW-G-250` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-251` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-252` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-253` | F08 | proposal: source-specific technique, bodily effect, training cost and carry policy remains unselected |
| `CW-G-254` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-256` | F12 | larger-policy proposal: source-specific backing, target, fuel/cost, reach, and effect policy |
| `CW-G-257` | F02 | larger-policy proposal: source-specific decision target, costs, fallout, and future-knowledge rules |
| `D4-QF` | F09 | built bounded route: quiet faculty and enduring development |
| `D4-SQ` | F09 | built bounded route: optional first-victory quest/manual claim |

Coverage check: 326 of 326 inventory rows mapped; unmatched IDs: 0. Built statuses include RF1, Pattern Book, Heirloom Compact, Patient Furnace and Freshness Sense, with separate native/browser evidence. Broader palette effects retain their source-specific policy/content boundaries.


## Remaining original player-side card mechanisms

The player-side ideas are separately specified at CHEAT_LIBRARY.md:387-603. D4's PC02/03/04/08/10, RF1/IM19 and SH3 have bounded native routes. These original palettes still require the larger source-specific policy/content below. This is not a claim that a missing adapter blocks implementation:

| Card / inventory ID | Source locator | Concrete mechanism | Exact gap / classification |
|---|---|---|---|
| Echo Anchor / PC01 | CHEAT_LIBRARY.md:405-423 | Save a declared area, return to that snapshot, choose what carries, and allow outside state to keep moving. | expansion_engine scenario rewind is not the live player-area save/restore contract. The explicitly paused anchor-in-card scope is CHEAT_LIBRARY.md K3/K5 “Do not build yet”; declared-area outside-time/carry selection exceeds continuation_state.js’s existing whole-native-snapshot return. No generic anchor/retention policy selected here. Paused larger-policy proposal, not an adapter blocker. |
| Seed Cartographer / PC05 | CHEAT_LIBRARY.md:480-495 | Chart seed-dependent layout/recipes; annotate, test, and reroute; people/events are outside its stated reach. | Native generation freezes material/recipe results, not a seed-to-world-layout chart that exists before discovery. Revealing undiscovered recipe truth needs its source/backing/knowledge route (CHEAT_COSMOLOGY.md backing table; AD38), beyond readable Pattern Book. Unsupported undiscovered-content prerequisite; no generic RNG peek is substituted. |
| Rebirth Ledger / PC06 | CHEAT_LIBRARY.md:497-512 | At a chosen rebirth, compare run accomplishments and choose a prestige/carry reward; the card calls for a meaningful choice. | Needs accepted prestige trigger, deed measures, reward computation, and life-carry transaction. heir_inheritance does not define those multipliers. Larger-policy proposal. |
| Instinct Inheritance / PC07 | CHEAT_LIBRARY.md:514-526 | A limited bodily/soul record accumulates across lives without the player selecting each retained item. | Needs cross-life body/skill carry state and accumulation rule. OD2 accepts memories/base-cheat carry; other carry remains means/world-dependent. Larger-policy proposal. |
| Fate Steward / PC09 | CHEAT_LIBRARY.md:543-558 | Petition a patron to tilt incident selection; refusal/future trouble and patron preference matter. | Needs an incident pool with stable alternatives plus patron terms/cost/fallout and refusal state. Seeded streams do not select incident policy. Larger-policy proposal. |
| Hall of Selves / PC11 | CHEAT_LIBRARY.md:572-587 | Enter/switch between separate character lives with narrow sharing and potentially disagreeing selves. | Needs multi-character identity/control, save ownership, independent clocks, and sharing rules. Existing actor roster/expansion actors are not separate player lives. Larger-policy proposal. |
| World Deeds / PC12 | CHEAT_LIBRARY.md:588-602 | Past-life achievements persist in a world and open later doors; world memory is the carrier. | Existing archiveLine/kin memory already persists a specific world relationship through heir_inheritance.js and chronicle.js:createHeirChronicle. The proposed class/race/account-unlock loop has no selected deed-to-reward mapping (CHEAT_LIBRARY.md:588–602); adding that policy differs from exposing native archive memory. Larger reward-policy proposal, with the existing narrow native route explicitly acknowledged. |

This is the remaining concrete PC-card list; it does not imply those mechanics are accepted or next in build order.

## Source/code discovery correction

The earlier D4 checkpoint’s missing-rematch assertion was incorrect and the checkpoint records its correction. RF1 is built in commit 0d9a9bce: registered holder-owned actor power, paid rival recovery/rematch, native/party contest planners, and observer-safe memory. See CHEAT_LIBRARY.md:1575-1579 and CHECKPOINT.md:96-105. It is a witnessed-opening mechanism, not NPC timeline rewind or a universal Echo Anchor.

## Authority boundary for remaining source palettes

- B1 / F05: K3/K5 in CHEAT_LIBRARY.md explicitly pause anchor-in-card, fusion/theft/seals and simulator expansions. G1 says not to revive paused scope. Existing continuation_* owner remains untouched; current whole-snapshot returns are not relabeled declared-area time travel.
- B2 / F08–F12: source-specific body/identity/world effects need the backing, trigger, fuel, target, reach, compatibility and carrier named in CHEAT_COSMOLOGY.md:39–82. A stat, inventory or actor object alone is not that mechanic. The named reference powers are still proposals in CHEATS_BY_WORLD.md and source-specific source capture is not authority to choose unrelated universal power rules (AD32/38).
- B3 / F13: SIMULATORS_AND_CHEAT_IMPLEMENTATION.md's modes/keeps are a palette. K3/K5 pauses more than S1 until its browser gate. Long-life keeps, seed locking and dream outcomes need their own selected payoff/knowledge policy; no source method is implemented by renaming a loot peek.
- B4 / original PC cards: the seven rows above state exact missing larger choices. D4's authorized native adapters are built. A view/serialization seam was implemented wherever an actual selected native effect existed; no missing UI or adapter is used as the sole blocker.

These are policy/source-content boundaries, not anti-cheat restrictions or allowed-outcome lists. A later selected mechanism can cross them with actual backing/costs and the appropriate native owner.
