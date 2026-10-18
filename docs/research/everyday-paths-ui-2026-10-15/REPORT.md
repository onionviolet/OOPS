# Everyday pursuits as whole paths

Research and proposals, 2026-10-15. No implementation or replacement UI selected.

Follow-up: [path proposals](PATH_PROPOSALS.md) develops skills, powers, discovery and chosen involvement with additional farming and bait-consumer source evidence.

**Recommendation:** begin a later design trial with one fishing place, one useful catch and a repeatable chosen routine. Use a compact place view with adjacent method/detail and a linked notebook. Add a little spatial view only when position changes an available action or outcome. Quiet expertise, teaching and community contribution can supply depth without requiring a fleet, estate or institution.

## Authority and scope

D2–D4 in the [representation discussion](../../gm/REPRESENTATION_DIRECTION_DISCUSSION_2026-10-15.md) are the authority for this assignment: little pursuits can become whole paths, involvement is chosen per activity/life, and discoveries follow repeatable world-specific principles with unexpected findings possible. Exact rewards, automation means and control granularity remain open. The [north-star](../../LIFE_SIM_NORTH_STAR.md) activity/zoom ladder and economic inventory supply possibilities, not a compulsory escalation from pond to empire. Older wording that makes automation progression does not override chosen involvement.

Read [PROJECT](../../../PROJECT.md), [direction summary](../../DIRECTION_SUMMARY.md), [UI rules](../../UI_RULES.md), [foundation round](../../UI_FOUNDATION_DESIGN_ROUND_2026-10-15.md), [play beyond selectors](../../PLAY_BEYOND_MENU_SELECTORS_CONSIDERATIONS_2026-10-14.md) and the relevant existing dossiers. Proto23 remains the composition baseline. Proposed target: populated 1366×768 laptop, intact status/current work/log, shared components, destination Back/Esc and free inspection. Mobile, new shells and implementation are deferred. Only this folder is writable; overarching direction and UI owners retain integration authority.

The later user question, “for audits we can redecompile those apps accordingly?”, authorizes useful read-only redecompilation. Two missing Stardew classes were extracted with the existing ILSpy tool. No game launch, install, compatibility change or save access occurred.

## F1–F5: what the evidence supports

| Code | Finding | Evidence and practical limit |
|---|---|---|
| F1 | Fishing benefits from both local context and concise operational controls. | Stardew's newly decompiled `FishingRod.cs:408–491` reads stamina, distance to land, splash position and fish selection; `BobberBar.cs:153–156,232–235` reads skill and equipment into control tolerance. Existing assembly hash matches. The [official wiki](https://stardewvalleywiki.com/mediawiki/index.php?title=Fishing&oldid=193904) supplies the depicted bar and documented controls. No native trial. |
| F2 | A list can express meaningful fishing choices without continuous spatial control. | Enjar's [original screenshot account](https://enjargames.com/melvor-idle-or-making-money-fishing) depicts region cards, target selection, intervals, mastery and Start/Stop. Its images are an unversioned Atlas-era snapshot, not current interactive proof. The existing [Melvor source dossier](../melvor-idle/REPORT.md) separately traces fish through cooking into equipped food and healing. |
| F3 | Immortal Life is a relevant cultivation fishing reference. | Its [official description](https://store.steampowered.com/app/1201230/Immortal_Life/) names fishing and spell farming. Retained primary TextAssets contain fish, rod, location/condition and QTE records. [Attributed guide captures](https://steamcommunity.com/sharedfiles/filedetails/?id=2855330245), by worstcase11, show map/detail, repair quotations, a catch record and an NPC patrol return. Screenshot build unknown; guide mixes versions. |
| F4 | Named cultivation games should be used by capability. | [Taiwu](../scroll-of-taiwu/WORLD_AND_VILLAGE_DIGEST.md) supports workers, maintained facilities, stored-output capacity and study support. [ACS](../amazing-cultivation-simulator/traces/production.md) supports queued production, actor/workplace modifiers and real consumers. [Tale](../tale-of-immortal/pass-2026-10-14/REPORT.md) supports selected preparation/institution/calendar comparisons. These inspected dossiers do **not** establish rich rod-fishing interfaces. This is a coverage limit, not a claim the activities are absent. |
| F5 | Useful output should connect to another actual activity. | Existing Stardew [destination](../stardew-valley/DESTINATIONS.md) and [machine](../stardew-valley/MACHINES.md) traces establish real stock transfer and collection distinctions. Newly inspected retained records add fish smoking and bait production. These are data/code claims, not a filmed end-to-end run. |

[UI_EVIDENCE](UI_EVIDENCE.md) captions every selected frame and separates depicted, documented, code/data and unknown behavior. [REFERENCE_INDEX](REFERENCE_INDEX.md) points to private full tables, source receipts and exact method locators. The source playbook's bounded catalog, rule cross-check and synthesis modules apply; a whole-game or fanfiction survey is unnecessary.

## F6: one catch into a real use

**Stardew, source/data trace:** Sunfish object `145` is fish category `-4`. `Data/Machines:(BC)FishSmoker` admits one `category_fish` item and additionally requires coal `(O)382`; its declared duration is 50 game minutes and its output query retains input identity and quality in a smoked product. The existing generic machine body spends inputs, holds output and restores it when collection fails. The existing shop/shipping consumers provide a sale route. This establishes a useful catch → paid processing → collectible product → trade chain at source level. Admission, timing, collection and sale were not exercised together. No claim of exact net profit or current native price multiplier.

A competing route, `Data/Machines:(BC)BaitMaker`, declares one fish → 5–10 species-flavored bait in 10 game minutes. It demonstrates stock competition and retained input identity; this pass did not trace that bait's targeting consumer. A player must choose which fish to allocate, rather than receive both products from one catch. Full rows and hashes are private.

Melvor's existing audit independently supports fishing → cooked stock → selected equipped food → timed healing/depletion. Immortal Life's walkthrough describes taking an introductory catch to the inn; its kitchen image depicts separate preparation stations. That walkthrough is useful context, not a verified stock transaction or evidence of an unrestricted recipe system.

## P1–P5: ranked original proposals

| Rank/code | Proposal and disposition | Why, cost and boundary |
|---|---|---|
| 1 / P1 | **Adapt:** a fishing place card with adjacent preparation/result detail; optional small bank/pond view when it answers a spatial question. | Makes place, conditions, tools, likely known opportunities and current work readable together. Requires actual access/condition rules; a scenic picture alone is insufficient. Stay inside Proto23's center, with log intact. |
| 2 / P2 | **Trial:** one personal method and one supported repeat routine on the same catch/use chain. | Compare attention choices without reducing idle play to inferior rewards. Requires explicit means, stock and stop rules. No universal minigame bonus, automation tax or NPC requirement is selected. |
| 3 / P3 | **Adapt:** a notebook of observations and reusable methods, connected to output uses. | Enables quiet mastery through reading signs, testing a hypothesis, applying a discovery and teaching it. Requires truth/observation separation. Do not turn a partial observation into an omniscient fish calendar. |
| 4 / P4 | **Trial:** skills and powers change methods and useful information. | Let expertise distinguish a bite from a false nibble; a fitting perception power may expose a current or hidden feeding route; water control may make another approach possible. Each needs a world-supported cause and actual consumer. Do not preserve obsolete chores through arbitrary penalties. |
| 5 / P5 | **Park until P1–P4 are selected:** broader community/legacy roles and delegated operations. | An angler can teach, supply a kitchen, maintain access, document waters or preserve a local tradition. These can be durable goals at one pond. Boats, businesses and institutions are alternatives, not higher mandatory rungs. More roles need NPC demand, commitments and world rules, not extra progress bars. |

P1–P5 are recommendations for consideration, not accepted mechanics or a build queue.

## Representation: use the view that answers the decision

| Question | Recommended view | What would justify it | Evidence and limit |
|---|---|---|---|
| Where can I go, and why here? | Small location view or place cards | Access routes, travel or distinct banks matter | Immortal Life map/detail image and Stardew `distanceToLand` reader. No need to simulate every water tile. |
| Where should I cast or place a device? | Small pond/bank view plus textual equivalent | Reach, current, cover or other selected spatial rules change outcomes | Stardew splash/distance code; proposed YAIR rules must be selected separately. Darker painted water must not imply an unsupported depth benefit. |
| Which method and supplies? | List + adjacent detail | Compare rod, bait, technique, cost and known conditions | Melvor cards; Immortal Life repair quotation. Show held/reserved/needed separately. |
| What is happening now? | Current-work strip + ambient log | Action state, result, interruption and notable observation | Melvor Start/Stop and reward depiction; Stardew pot result bubbles and collection notices. A progress animation is not a settlement receipt. |
| What have I learned? | Reference notebook | Observed conditions, method, outcome and confidence | Stardew collection documentation; Immortal Life known-fish detail depiction. Hidden facts remain hidden. |
| When should I return? | Small calendar or dated plan | Seasonal windows, appointments or weather forecasts actually exist | Source condition fields support time relevance. A calendar tab in an image does not prove forecasts or scheduling automation. |
| What repeats, with whose help? | Routine/policy summary with expandable assignments | Means, limits, reserves, destinations and exception handling | Immortal Life patrol return depiction; Taiwu/ACS operational traces. No copied donor offline or cancellation rules. |

**Abstraction proposal:** keep a named unusual catch or experimental plant individual when its history changes a choice. Aggregate interchangeable stock or ordinary plots. Inspection, zoom and filtering read the same state and consume no time. An action explicitly commits work. Changing views must not reroll a discovery, duplicate a catch or reveal hidden properties.

## Farming/gardening contrast and sustained depth

Gardening needs a little field when the player chooses meaningful placement, coverage or access. Immortal Life's guide captures show planting, a watering tool and a movable rain-cloud tutorial. The guide describes switching from individual stamina use to an MP-funded area method. This is a method change worth comparing; exact current costs and coverage need native verification. Stardew's official older trailer depicts a productive laid-out field, but the frame alone does not establish irrigation or adjacency rules.

A single garden can sustain experimenting with one unusual plant, sharing starts and tending a personal home. A fishing life can sustain careful seasonal knowledge, improved technique, regular meals, stories with a teacher and a collection of remembered catches. Neither needs acreage or money growth every season. Commercial supply, a community fishery and an institution can also matter when chosen. This is design synthesis, not a claim that the donors simulate complete ecologies or economies.

Skill changes what the character notices and can reliably do; power can change access, environment or labor. Automation executes available means and instructions. These are independent from how closely the player wants to watch. Personally practice at one bank while delegating ordinary gathering elsewhere, or automate a familiar technique and intervene for an unfamiliar sign. A helper's work can supply fish without automatically granting the player's personal technique mastery. Exact learning allocation remains open.

Proposed guard against chores: new conditions invite a meaningful decision; established execution can repeat under chosen instructions. Show a short return summary with actual costs, outputs, discoveries and stop reason. Respect accepted OD4 important-choice pauses and supported helper exceptions; do not invent continuous production during a world pause. Any attention/reward comparison must show that the chosen less-hands-on life remains viable. No fishing donor proves that balance for YAIR.

## J1: bounded original candidate journey

Entirely fictional, unselected and unimplemented. One ordinary riverside place, one fish family, one useful food preparation, one local cook/teacher and an optional garden bait ingredient. No mandatory combat, empire, generic crafting engine or new prestige layer.

1. **Locate and prepare.** Open a known river place from its existing home. Read observed conditions and a teacher's tentative advice. Choose a supported bank/method and allocate owned rod/bait. If position has no mechanical effect, present two named place cards instead of a grid.
2. **Act and notice.** Choose personal involvement or an available established routine. Personal involvement exposes a consequential method choice and sign observation, not a required reflex test. A relevant earned skill or fitting power changes one actual decision or reachable method.
3. **Use the catch.** Inspect a receipt, reserve one fish for a known cook's preparation and choose to keep or trade the resulting useful meal. The food benefit is positive; ordinary play remains comfortably unfed. Companion production research owns detailed preparation/resolution.
4. **Learn and repeat.** Save observed conditions and method, retaining uncertainty. Set a finite routine with an actual bait reserve, destination and stop reason, or continue personally. Unexpected observations can suggest another experiment without rerolling established truth on reopening a view.
5. **Choose a life.** Continue quiet mastery, share a method with the teacher, supply occasional meals or grow a local service. These are alternative intentions. A larger operation is unnecessary to make the path worthwhile.

## G1–G4: authoritative remaining gates

| Code | Gap and smallest next evidence |
|---|---|
| G1 | **Design selection:** Weibao and the owning direction process choose a candidate and actual world rules. This research cannot promote its controls, rewards or ecology to accepted design. |
| G2 | **Donor interaction:** later authorized isolated donor trials for bite feedback, knowledge acquisition and patrol settlement. Stardew has a retained native macOS payload; no new acquisition indicated. Melvor needs an isolated new character and exact hosted/offline-client version, not an existing personal save. Immortal Life, Taiwu and ACS have prior Windows-payload receipts; each needs verified access and a working Windows-compatible environment before trial. Tale's workbook backup does not establish a playable installed build. No compatibility route was tested or purchase proposed here. |
| G3 | **Conflicting and unavailable evidence:** Immortal Life wiki says patrols gather in-season fish; guide allows out-of-season results. Retained location tables do not prove patrol filtering. Need the actual patrol method body or controlled seasonal return. No UI geometry/scrolling/keyboard/scale proof for Taiwu/ACS/Tale is added. No school of autonomous NPC anglers, breeding population or depletion model is established. |
| G4 | **YAIR acceptance, only after implementation authorization:** rebuilt fresh-origin populated 1366×768 journey, current-work/log/back discoverability, keyboard/text scaling, same-state view switching, useful output, viable attention alternatives and one qualitative skill/power change. Persistence changes also require save/reload/literal import and compatibility decision. Human visual/play acceptance stays separate. No tests/build/native gameplay were run in this research assignment. |

Stop condition reached: the selected representation questions have concrete references and a bounded candidate; uncertain execution is attached to named trials. No messages, workers, commits, pushes or shared-owner edits.

## Focused farming and delegation follow-up

The user's later request is covered in [FARMING_DELEGATION_DEEP_DIVE](FARMING_DELEGATION_DEEP_DIVE.md) and [FARMING_DELEGATION_UI](FARMING_DELEGATION_UI.md): thirteen fresh ACS managed exports, complete selected definitions, full IL care/growth/progression/localization tables and actual historical UI frames. FD1–FD3 separate proof layers; FP1–FP5 remain proposals. No implementation or accepted direction changed.

## Existing-system fit, gaps and Taiwu

The user's next request is covered in [EXISTING_SYSTEM_FIT_AND_PROPOSALS](EXISTING_SYSTEM_FIT_AND_PROPOSALS.md): current activity/skill/MG06/power/knowledge/UI seams, eight bounded source findings, three Taiwu takeaways and five concrete proposal packets. Riverbank XP timing versus presentation is a source discrepancy, not a reproduced runtime bug. MG06 skill integration, one method, attributed discovery, one chore delegation and suitable UI homes remain proposals. Later D2–D4 resolve older manual-first/scale-ladder wording; shared owners were not edited.

## Two fleshed-out paths, land area and chosen involvement

The user's latest request is covered by [FISHING_PATH_PROPOSAL](FISHING_PATH_PROPOSAL.md), [FARMING_PATH_PROPOSAL](FARMING_PATH_PROPOSAL.md) and [LAND_AREA_AND_INVOLVEMENT_UI](LAND_AREA_AND_INVOLVEMENT_UI.md). RF1–RF5 and CG1–CG5 provide original concrete lives, skills, powers, discoveries, assignments and UI choices. LA1–LA3/UX1–UX2/DS1–DS2 distinguish land count, area, capacity, meaningful spatial relationships, attention, instruction and actual executor. Numerical/world-law examples are illustrative; no accepted law, new behavior, save migration or implementation follows. The current one-plot model remains a legitimate minimal representation.


## Interactive studies and broader implications, 2026-10-15

User authorized mockups and subsequently requested better ideas/parity, potion and other menus, future cheat menus, studio improvements, future abstractions/integration, and direct farming-block interaction. Saved [interactive viewer and guide](mockups/README.md), [parity/menu/studio/abstraction proposals](MOCKUP_PARITY_AND_IMPLICATIONS.md), and [current mining flow versus proposed path](MINING_FLOW_AND_PATH_PROPOSAL.md). The viewer includes21 main scenes plus adjacent-pursuit cards and bed-specific previews; actual farm blocks now select their target directly. Full captures and browser/interaction receipts are in mockups/. All fixtures remain fictional proposals. No gameplay, source, persistence, build, save, canonical-owner or accepted-product change. Previous entries describing paper-only/no-prototype scope remain dated history; a standalone interactive design artifact now exists.

Current mining source spans and hashes retained privately; new Factorio primary documentation locators supplement existing ACS/IL/Taiwu/Stardew/Melvor comparisons. Factorio documentation is not native UI proof. Full native IL behavior, selected donor interaction and production parity remain separate open evidence. Browser checks cover this mockup at1366×768, not a rebuilt YAIR populated save. Mobile and engine implementation deferred. Only this research folder was written; no workers, messages, commit or push.


## Selectable fishing/mining targets, 2026-10-15

Completed the requested mockup-only follow-up in [FISHING_MINING_INTERACTIVE_CHOICES](FISHING_MINING_INTERACTIVE_CHOICES.md). Three fishing reaches and three faces of the same known seam are directly selectable; target, skill, sensing/control and method change the inspector, blocked reasons and preview. Investigation/delegation retain selected context and responsibility. Existing Current flow remains separate.36 scenario combinations plus targeted interactions checked;21 main captures refreshed at1366×768. No game implementation, actual-world balance, native parity, save or accepted-product change. Larger-text and native acceptance remain open if a candidate is later selected. All writes stayed in this research folder; no new donor acquisition, workers, messages, commit or push.
