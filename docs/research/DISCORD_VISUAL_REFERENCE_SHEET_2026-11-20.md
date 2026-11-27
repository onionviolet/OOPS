# Discord visual reference sheet · November 20, 2026

Research and implementation accounting. The November 20 responsive/expressive UI direction is recorded in USER_VISION, DESIGN and UI_RULES; the individual visual treatments below remain proposals, not runtime delivery. Owner: this sheet; parent owns `prototypes/world-atlas` and `prototypes/creature-desk`; implementation chats own game changes. Bounded pass: both local archive indexes, all generated still sheets, promising full-size captures, representative GIF frames and existing video samples. No network collection, paid calls, native control, source execution or runtime edits. This update reconciles direction, existing mechanisms and missing player-facing proof; it does not close the implementation gaps.

Open the [browsable visual sheet](DISCORD_VISUAL_REFERENCE_SHEET_2026-11-20.html). It has priority/topic search, expandable evidence and direct local pictures. Private media stay in their existing ignored folders. Sharing the HTML alone does not package those assets. [Current responsive-UI direction](../gm/USER_VISION_LOG_2026-11.md#responsive-animated-and-expressive-ui-2026-11-20) replaces restrictive interpretations in the first pass.

The transfer has two equal aims: make actions and changing subjects readable, and make the interface pleasurable and expressive to use. Hearth flicker, tactile presses, small emoticons and ambient detail do not need to earn their place by creating a new decision. The P1 cards below are ranked by usefulness to current work, not by source quality. Existing behaviour deserves a replay before a new system.

Baseline: [activity review F12–F27](../gm/dispatch/play-surface-2026-11-14/ACTIVITY_UI_REVIEW_2026-11-20.md), [Corc context review](proto23/CORC_MEDIA_AND_DESIGN_2026-10-20.md), and [YAIR DU catalogue](yair-upstream/DISCORD_UI_ELEMENTS_REVIEW_2026-11-15.md). VR codes are new review findings and do not renumber those owners. SKR1/3/7/18 apply: medium and locator remain explicit, developer claims differ from observed media, local evidence answers this pass, raw assets remain private.

## Ranked references

### VR01 · Put the observed effect on the affected creature · P1

[V172 picture](proto23/private/discord-media-2026-10-20/captured-media/1496163523208675398-a421131dfe22.webp) · [V172 Discord post](https://discord.com/channels/622495527485046805/811370601129705483/1496163523716452543) · [V657 picture](yair-upstream/private/discord-2026-10-20/catalog-reviewed/objects/6f662c14244de1a942d45cc5b9cac0259eb28981de237bd593b9d8f34bf40fc9.webp) · [V657 Discord post](https://discord.com/channels/622495527485046805/1458887440398942300/1467218373237674068)

**Visible.** Corc’s Green Slime has two effect icons and an expanded Liquid Metabolism card: rain enjoyment, HP 19/s and an infinite-duration symbol. YAIR’s frog log names bare-hand contact as the cause of toxins between attack lines.

**Provenance and limits.** The slime caption only says “but look”; several reply previews are unavailable. The frog caption explicitly discusses reusing the damage colour. Neither picture establishes a general weather or contact-trait engine.

**OOPS already has.** OOPS has living kinds/body/layers, observer-filtered opponent facts and combat situation views. This review did not demonstrate a runtime slime/rain or frog/contact encounter.

**Proposed comparison.** Attach a learned or currently observed effect to the selected individual, beside its posture. Reveal the cause only through observation or an earned explanation. Keep an unknown cause as an unanswered observation, not a guessed stat.

**Acceptance check.** Use one supported encounter with and without its actual condition. Inspect the same opponent before and after learning the cause; confirm that the result stays attributable in Reports after leaving and returning. Do not invent a counter or weakness to make the example work.

**Owners inspected.** [living_kinds.js](../../src/living_kinds.js), [living_body.js](../../src/living_body.js), [creature_layers.js](../../src/creature_layers.js), [opponent_board.js](../../src/opponent_board.js), [combat_situation_ui.js](../../src/combat_situation_ui.js).

### VR02 · A home’s condition should explain what the resident can do · P1

[V036 picture](proto23/private/discord-media-2026-10-20/captured-media/1141633192604995624-37c04a1e37a4.webp) · [V036 Discord post](https://discord.com/channels/622495527485046805/811370601129705483/1141633192869232670) · [V073 picture](proto23/private/discord-media-2026-10-20/captured-media/1309576852100218971-f7e6d70c625c.webp) · [V073 Discord post](https://discord.com/channels/622495527485046805/811370601129705483/1309576851987107841)

**Visible.** The dwelling page names its current state, describes cracked walls, roof holes, dirt flooring and the dry section used for bed and belongings, and singles out Wooden Tableware as the most valuable possession. A separate storage-box upgrade preview names the repaired result and shows Wood Splint 182/300 plus an obscured requirement.

**Provenance and limits.** The August 2023 caption proposes house restoration and a cat room. The picture proves the condition page, not a completed restoration or a cat-room action. The November 2024 box image is a separate upgrade example.

**OOPS already has.** OOPS home overview already joins fittings, rooms, soundness, dampness, rest eligibility and capacity. F27’s atlas already compares restoration and storage 20 to 30. These are separate from a freshly replayed live home route.

**Proposed comparison.** In the existing home page, pair each actionable condition with its concrete consequence and relevant repair. A singled-out possession can link to its actual owned object when available; do not infer “most valuable” from sale price or invent sentimental history.

**Acceptance check.** Compare the same dwelling before and after one supported repair. Can the player identify what changed about rest, exposure or capacity, what was spent, and where the fitting is now? Preserve the selected home on return.

**Owners inspected.** [home_overview_model.js](../../src/home_overview_model.js), [home_overview_panel.js](../../src/home_overview_panel.js), [home_building_model.js](../../src/home_building_model.js), [index.html](../../prototypes/world-atlas/index.html).

### VR03 · Finite household automation needs a visible stock and switch · P1

[V221 picture](proto23/private/discord-media-2026-10-20/captured-media/821624988351332352-f78370b88802.webp) · [V221 Discord post](https://discord.com/channels/622495527485046805/811370601129705483/821624988531556362) · [E29 picture](proto23/private/discord-media-2026-10-20/supplied/1320812.gif)

**Visible.** The Firewood Pile tooltip says it automatically supplies the fireplace but needs refuelling, with Supply 0 to 5. In sampled fireplace GIF frames, a low fuel bar becomes nearly full after the firewood action, and the description changes from slight flickering to energetic fire. The two fuel choices stay in place.

**Provenance and limits.** Pile: March 2021 Corc post. Fireplace: August 2026 post plus a supplied GIF whose filename alone does not prove original byte identity. The GIF shows replenishment; it does not demonstrate the pile’s automatic consumption.

**OOPS already has.** OOPS already has exact stocked log keys, five-log capacity, an explicit supply toggle, played-minute fuel, ventilation, smoke and learned animal behaviour. Its household scene already renders fuel, vent and smoke. This is primarily a presentation/replay candidate.

**Proposed comparison.** Keep stocked logs, automatic-feed state and remaining lit fuel visible together beside the existing hearth controls. Explain the active scope from the owner, including what happens while away. Let the flame flicker for atmosphere, brighten briefly on successful refuelling and settle into its current burning state. Put a short local response on the acted-on object; the text and fuel readout retain the actual result.

**Acceptance check.** Stock two owned logs, enable supply, light once, leave and return across a fuel boundary, then reload. Account for each log and distinguish automatic stock from the burning fuel pool. Repeat with supply off and reduced motion.

**Owners inspected.** [model.js](../../src/absorb_p23/household/model.js), [household_scene.js](../../src/household_scene.js), [host.js](../../src/absorb_p23/household/host.js).

### VR04 · Show failure at the point where progress changed · P1

[E03 picture](proto23/private/discord-media-2026-10-20/linked/1534830287748333619-63.gif) · [E04 picture](proto23/private/discord-media-2026-10-20/linked/1534727563640049695-123.gif) · [E01 picture](proto23/private/discord-media-2026-10-20/linked/1535071007105351832-32f.gif) · [V203 picture](proto23/private/discord-media-2026-10-20/captured-media/1535156142454472824-fb8a91bc8d10.webp) · [V203 Discord post](https://discord.com/channels/622495527485046805/811370601129705483/1535156142798413954)

**Visible.** The climb samples keep Base and Summit fixed. Debris appears near the @ marker; an exclamation mark accompanies a loss of height. The fall sample turns the gauge red, shows a skull at the fall point and a later impact near Base. The wet-rock sample adds moving rain. A separate log gives fatigue, dislodged edge, failed footing and lethal fall damage.

**Provenance and limits.** Corc’s captions distinguish debris, wet rock and a fall outcome. These are separate demonstrations, not one controlled comparison. No exact risk formula, intervention timing or recoverability is established.

**OOPS already has.** F15 already discussed wet-rock motion. OOPS has work/status navigation and activity owners; this pass did not verify a native equivalent climbing route. The useful additional detail is retaining failure location and state after motion ends.

**Proposed comparison.** For an existing risky activity, keep the changed object or progress position visible and write the consequence there. Keep a real stop/retreat action reachable when the owner allows it. Do not add an arbitrary gauge to activities without a meaningful changing state.

**Acceptance check.** Replay a supported interruption and failure with motion disabled. Can the player tell what failed, what progress or material remains, and which next actions are legal? Reload after the outcome and confirm the same state.

**Owners inspected.** [status_line.js](../../src/ui/status_line.js), [structured_pack_ui.js](../../src/structured_pack_ui.js), [meter_bar.js](../../src/meter_bar.js).

### VR05 · Make alternative means legible around one objective · P1

[V845 picture](yair-upstream/private/discord-2026-10-20/catalog-reviewed/objects/e087a1c216244bd42873a5e7d0702e8e0f501126d6f80dee8998116ec18811c8.webp) · [V845 Discord post](https://discord.com/channels/622495527485046805/1458887440398942300/1534580168947925052) · [V051 picture](proto23/private/discord-media-2026-10-20/captured-media/1206946733880246292-d102c25d544e.webp) · [V051 Discord post](https://discord.com/channels/622495527485046805/811370601129705483/1206946734094163968)

**Visible.** YAIR’s action list offers carrying grain bags, pulling a cart, convincing the horse and carrying cart plus horse, alongside search and construction. Corc’s log says a wolf is briefly confused by a stick before several damage entries.

**Provenance and limits.** The YAIR caption warns availability was not saved at that date. The list proves alternatives were offered, not that every branch worked. Corc’s “we’re doing that” caption and missing reply preview do not establish why the wolf reacts or a universal improvised-weapon rule.

**OOPS already has.** OOPS tempo already models intent, surrender, withdrawal, binding and disarming; F22 covers those. Public world commands and knowledge have existing owners. No new command implementation is authorized by this sheet.

**Proposed comparison.** At a supported encounter, present legal approaches in terms of the shared goal: get past, recover the object, stop pursuit, obtain help. After choosing a means, show the other actor’s observable response in its own card. Preserve source-specific constraints.

**Acceptance check.** Try two legal approaches to the same objective with the same actor. Check time/resource costs and the actor’s changed response after the encounter and after reload. Confirm blocked options explain the real prerequisite rather than silently vanishing.

**Owners inspected.** [tempo_fight.js](../../src/tempo_fight.js), [opponent_board.js](../../src/opponent_board.js), [knowledge_view.js](../../src/knowledge_view.js), [fight_terms.js](../../src/fight_terms.js).

### VR06 · Keep a recognizable individual across visits · P2

[V005 picture](proto23/private/discord-media-2026-10-20/captured-media/1021670663121027113-dea43572f4e3.webp) · [V005 Discord post](https://discord.com/channels/622495527485046805/811370601129705483/1021670663569809418) · [V012 picture](proto23/private/discord-media-2026-10-20/captured-media/1065591404140711976-50797e35f838.webp) · [V012 Discord post](https://discord.com/channels/622495527485046805/811370601129705483/1065591404358795294) · [V193 picture](proto23/private/discord-media-2026-10-20/captured-media/1526774083654516987-2cf00e005787.webp) · [V193 Discord post](https://discord.com/channels/622495527485046805/811370601129705483/1526774084170551366)

**Visible.** The testing-save cat has birthday, age, striped pattern, grey colour and two likes. A later crop adds an individual characteristic beside the cat’s name. A separate ASCII cat picture places Rename and Pet Cat directly below the subject.

**Provenance and limits.** Dated Corc development captures from 2022, 2023 and 2026. These are not one individual’s demonstrated progression. The ASCII cat crop does not show the effect of either command.

**OOPS already has.** F26 and F27 already use identity, appearance and learned preferences; the creature-desk and atlas drafts are parent-owned. OOPS household projection already exposes posture, known duration, visits and learned preference.

**Proposed comparison.** Keep stable identity and appearance above changing condition and current observation. Place supported interaction on the individual’s page. Retain “learned by playing” provenance for likes; only show inner thought through an actual perception.

**Acceptance check.** Meet the same individual, learn one preference through play, return later and inspect again. Identity remains constant while state/history changes. A novice and a mind-reading observer should see different justified information.

**Owners inspected.** [model.js](../../src/absorb_p23/household/model.js), [household_scene.js](../../src/household_scene.js), [living_body.js](../../src/living_body.js), [index.html](../../prototypes/creature-desk/index.html).

### VR07 · Obscuring a name can still leak the answer’s shape · P2

[V740 picture](yair-upstream/private/discord-2026-10-20/catalog-reviewed/objects/a15a2a946ac4bbb0987bf729da3fee415f41015a89a4f381374c6c0196b56b59.webp) · [V740 Discord post](https://discord.com/channels/622495527485046805/1458887440398942300/1502748183346811032) · [V192 picture](proto23/private/discord-media-2026-10-20/captured-media/1525632185858523307-a2484fec82ec.webp) · [V192 Discord post](https://discord.com/channels/622495527485046805/811370601129705483/1525632186236145846)

**Visible.** YAIR’s goat loot table has a ??? name but still displays a distinct row and exact current/base probabilities. Corc’s underground strip retains summer and time while replacing weather fields with question marks.

**Provenance and limits.** YAIR caption explicitly calls this bestiary name obscuring. Corc explicitly states weather cannot be seen deep underground. They are examples of different knowledge boundaries, not interchangeable hiding policies.

**OOPS already has.** OOPS bestiary loot rendering already obscures names while showing chance fields. Its knowledge view explicitly builds open questions only from the observer’s own questions. F27 already covers underground weather in the atlas.

**Proposed comparison.** Choose the disclosure rule per world and field. If only the label is unknown, retain the known row. If the character does not know an item or event exists, suppress its row and probabilities too. Explain unavailable weather without revealing hidden weather values.

**Acceptance check.** Inspect a fresh observer, one who has encountered the creature and one who acquired its loot. Check names, row count, ordering, rates, tooltips and search results for unintended disclosure. Separately go below ground and return.

**Owners inspected.** [display.js](../../src/display.js), [fork_discovery_views.js](../../src/fork_discovery_views.js), [knowledge_view.js](../../src/knowledge_view.js), [world_sky.js](../../src/world_sky.js).

### VR08 · Calendar atmosphere works best as a small readable signal · P2

[V036 picture](proto23/private/discord-media-2026-10-20/captured-media/1141633192604995624-37c04a1e37a4.webp) · [V036 Discord post](https://discord.com/channels/622495527485046805/811370601129705483/1141633192869232670) · [V217 picture](proto23/private/discord-media-2026-10-20/captured-media/812154188737806336-8eafbe2a4519.webp) · [V217 Discord post](https://discord.com/channels/622495527485046805/811370601129705483/812154188913049630) · [V192 picture](proto23/private/discord-media-2026-10-20/captured-media/1525632185858523307-a2484fec82ec.webp) · [V192 Discord post](https://discord.com/channels/622495527485046805/811370601129705483/1525632186236145846) · [V323 picture](yair-upstream/private/discord-2026-10-20/catalog-reviewed/objects/672cc6a27bd10a3ae97ed27cd6a2acc5530b857e45a0b5d0890e3d2fb29d1e86.webp) · [V323 Discord post](https://discord.com/channels/622495527485046805/1212455523325050900/1220092336323825765)

**Visible.** Corc uses a green 夏 summer marker, a weekday glyph and date; the dwelling capture gives Sunrise a warm pink/orange fill. A different capture spells Autumn in English and Foggy beside it. YAIR pairs an ordinary date/time with a sun glyph; sampled video frames add Day/Night, season and temperature.

**Provenance and limits.** Corc’s February 2021 caption questions whether the season indicator is too eye-catching. The stills show alternatives across dates, not a user-tested final style or a continuous sunrise transition.

**OOPS already has.** F27’s atlas already offers named season glyphs and distinct light states under independent preview controls. OOPS world calendars and sky owners exist; the atlas is not evidence of live clock integration.

**Proposed comparison.** Compare a quiet glyph plus written season and a short sunrise/day/night word in the existing time strip. Let world-clock state drive live presentation, and apply observer access independently. Preserve text when colour or motion is disabled.

**Acceptance check.** At the same place, read dawn, daylight, sunset and underground states at 21px Gothic. Can the player distinguish time from weather and identify which information is unavailable? Verify the production strip with the real clock before calling it integrated.

**Owners inspected.** [world_calendar.js](../../src/world_calendar.js), [world_sky.js](../../src/world_sky.js), [world_weather_display.js](../../src/world_weather_display.js), [status_line.js](../../src/ui/status_line.js), [index.html](../../prototypes/world-atlas/index.html).

### VR09 · Map useful services, and keep travel cost beside them · P2

[V792 picture](yair-upstream/private/discord-2026-10-20/catalog-reviewed/objects/ea44eed1b389826d745f5bed93b2a25690c19908c9c57a0f06b8bcc43dc4bcb3.webp) · [V792 Discord post](https://discord.com/channels/622495527485046805/1458887440398942300/1516503107377299656) · [V853 picture](yair-upstream/private/discord-2026-10-20/catalog-reviewed/objects/206e635927c3a7a81c3f529b2006d402e3bb179c51a9379cc1b7a0bb6b129bab.webp) · [V853 Discord post](https://discord.com/channels/622495527485046805/1458887440398942300/1537705244031590421) · [V090 picture](proto23/private/discord-media-2026-10-20/captured-media/1395035222004990104-a09ba5947c91.webp) · [V090 Discord post](https://discord.com/channels/622495527485046805/811370601129705483/1395035222243807314) · [V842 picture](yair-upstream/private/discord-2026-10-20/catalog-reviewed/objects/5861ed20ee629edcdb7c5c77211cee849afa36702d8991da3f503cf026cd63ae.webp) · [V842 Discord post](https://discord.com/channels/622495527485046805/1458887440398942300/1534286374948175976)

**Visible.** YAIR fast travel prefixes some destinations with a bed and shows durations on each row; some other rows have a removal X. The experimental node map connects named places with a green node and coloured dots. Corc has a tiny corridor grid with coloured cells. Another YAIR image is a hand-drawn mountains/village/desert sketch.

**Provenance and limits.** The node diagram and sketch are development references, not evidence of implemented travel, route finding or discoverability. The bed’s service meaning is a reasonable inference from destinations, not proved by the still alone.

**OOPS already has.** F23 covers known-place walk maps; F26 covers public topology in the parent-owned atlas. Current prototype positions are schematic. No new atlas changes belong to this chat.

**Proposed comparison.** Attach already-known service words such as lodging or workbench to destinations using real place/service ownership, alongside travel time and closure reason. Keep topology, current actor location and available movement separate.

**Acceptance check.** Find a discovered bench or lodging, check a blocked destination, travel through legal commands and return. Confirm no icon invents a service or converts a map dot into a command. Keep undiscovered sites hidden.

**Owners inspected.** [world_calendar.js](../../src/world_calendar.js), [index.html](../../prototypes/world-atlas/index.html).

### VR10 · Break and dismantle should quote different outcomes · P2

[V102 picture](proto23/private/discord-media-2026-10-20/captured-media/1424795106078101706-569d2b7b781b.webp) · [V102 Discord post](https://discord.com/channels/622495527485046805/811370601129705483/1424795106522828971)

**Visible.** Corc’s Break preview names Cheap Cloth and Thread: 1 as its result.

**Provenance and limits.** The caption says breaking without large tools was added, can coexist with disassembly for some objects, and generally yields less. Only the break preview is visible; no paired disassembly execution is shown.

**OOPS already has.** OOPS already has a bounded salvage route for an identified Leather vest, exact kit/copy selection, condition-dependent yield and receipt. This does not establish a general tool-free break command.

**Proposed comparison.** If a world supplies both operations, put their actual tools, time, retained parts and output side by side on the selected item. Keep immediate breakage a deliberate action with a concrete quote.

**Acceptance check.** Use two disposable copies of the same item. Compare quotes, commit each legal operation once and inspect goods, tool wear and source-copy removal after reload. Do not broaden the current salvage contract just to match the screenshot.

**Owners inspected.** [salvage.js](../../src/absorb_p23/salvage/salvage.js), [inspector.js](../../src/ui/inspector.js).

### VR11 · Keep exact item identity through comparison · P2

[V878 picture](yair-upstream/private/discord-2026-10-20/catalog-reviewed/objects/7d47eadf3b8ea7a3c976918c1da3910fb1f8464b0a743ebb638b8709ea9f4627.png) · [V878 Discord post](https://discord.com/channels/622495527485046805/1458887440398942300/1543244495259312228) · [V879 picture](yair-upstream/private/discord-2026-10-20/catalog-reviewed/objects/f99919cb00328b3caaffceef8b3f03f0f7360a3fcd4a4a23fa018dc6aa44ccad.webp) · [V879 Discord post](https://discord.com/channels/622495527485046805/1458887440398942300/1543370765745918043) · [V116 picture](proto23/private/discord-media-2026-10-20/captured-media/1435208947182338080-2e4a76746460.gif) · [V116 Discord post](https://discord.com/channels/622495527485046805/811370601129705483/1435208947869941880)

**Visible.** YAIR’s hammer tooltip compares attack, attack speed, crit rate and EP to equipped gear with mixed positive/negative colours. A later crop uses explicit multipliers. Corc’s Dead Ember GIF shows many identical names opening different stat/durability cards.

**Provenance and limits.** YAIR captions distinguish a PR feature from a comparison commit the caption says was merged and a later formatting tweak. Corc describes randomized accessories that degrade; sparse GIF samples establish different displayed instances, not a wear-rate formula.

**OOPS already has.** OOPS already has equipmentComparison with an explicit baseline, additive versus multiplier rows, empty-slot text, quality ranges and a reforge preview. F11 already covers quality-stack selection.

**Proposed comparison.** Treat this as a regression check: show which exact owned instance is the baseline and preserve the selected candidate through sort/filter or inventory updates. Use words as well as colour for mixed tradeoffs.

**Acceptance check.** Compare two copies with the same name and different quality/affixes, sort the list, then equip or reforge one. Verify baseline identity, preview values and the exact committed copy. Do not add another comparison system.

**Owners inspected.** [equipment_comparison.js](../../src/equipment_comparison.js), [display.js](../../src/display.js), [reforge_preview.js](../../src/ui/reforge_preview.js).

### VR12 · Freshness can be an observation rather than an expiry stopwatch · P3

[V054 picture](proto23/private/discord-media-2026-10-20/captured-media/1223511074155003945-5e61ded910b2.webp) · [V054 Discord post](https://discord.com/channels/622495527485046805/811370601129705483/1223511074372845630)

**Visible.** Raw Meat pairs a very-fresh observation with an average shelf life of three days. It also identifies a perishable food class, a tried flag and energy restoration.

**Provenance and limits.** The caption is a design question about whether players should know food lifespan. It is not an accepted project policy, nor proof that the average predicts a specific stack’s expiry.

**OOPS already has.** OOPS has item/knowledge owners and prepared-batch working state. This review did not establish a general live food-spoilage route or source-qualified shelf-life data.

**Proposed comparison.** When an actual perishable model exists, show the observed freshness and storage context. Offer precise remaining time only through supported knowledge. Keep expected lifespan separate from the current item’s state.

**Acceptance check.** Compare two real stacks of different age/storage with a novice and knowledgeable observer. Verify selection and actual consumption order; avoid inventing new decay merely to populate a tooltip.

**Owners inspected.** [knowledge_view.js](../../src/knowledge_view.js), [inspector.js](../../src/ui/inspector.js), [items.js](../../src/items.js).

### VR13 · Trade is a pending transaction, then a committed result · P3

[V303 picture](yair-upstream/private/discord-2026-10-20/catalog-reviewed/objects/c4bd40bc8776a927f83f9ca978ac56ff76b9e7b6d2455d5d810229efbf4220ea.png) · [V303 Discord post](https://discord.com/channels/622495527485046805/1212455523325050900/1213610432879665304) · [V311 picture](yair-upstream/private/discord-2026-10-20/catalog-reviewed/objects/9c871c61f13cce42079034f5ab4a4ff2cf2820fa8fdacaae0c84658bf8db0c6e.webp) · [V311 Discord post](https://discord.com/channels/622495527485046805/1212455523325050900/1215020570517962812) · [V312 picture](yair-upstream/private/discord-2026-10-20/catalog-reviewed/objects/28bb7283295e9b73daf837350014c8bacde7d6dd7d35256a3ad86c2b08f2099f.webp) · [V312 Discord post](https://discord.com/channels/622495527485046805/1212455523325050900/1215020987591036968)

**Visible.** YAIR trade captures show two inventories, selected rows, price percentage, signed total, Accept, Cancel and Exit. Different stills show different directions of exchange.

**Provenance and limits.** Separate stills do not establish a single mixed purchase/sale execution or the correctness of settlement.

**OOPS already has.** Baseline F23 follow-on already recommends staging a purchase and sale. OOPS trade.js owns the staged ledger and settlement. This is previously covered material with useful reference pictures.

**Proposed comparison.** Use a plainly worded net amount and direction beside the existing confirmation controls. Preserve separate purchase and sale quantities. Keep staging reversible until acceptance.

**Acceptance check.** Stage a purchase and sale, remove one line, accept, then repeat and cancel. Account for purse and exact stacks after exit/reload. Test keyboard access to the same preview.

**Owners inspected.** [trade.js](../../src/trade.js), [display.js](../../src/display.js).

### VR14 · A tiny scene can keep the subject and action together · P3

[V193 picture](proto23/private/discord-media-2026-10-20/captured-media/1526774083654516987-2cf00e005787.webp) · [V193 Discord post](https://discord.com/channels/622495527485046805/811370601129705483/1526774084170551366) · [V475 picture](yair-upstream/private/discord-2026-10-20/catalog-reviewed/objects/eadea83ca6efc042bb74ef856636ded37d4819e510b7592f3a07b37a47185600.webp) · [V475 Discord post](https://discord.com/channels/622495527485046805/1212455523325050900/1386715561756459131) · [E29 picture](proto23/private/discord-media-2026-10-20/supplied/1320812.gif)

**Visible.** The ASCII cat has Rename and Pet Cat immediately below it. YAIR’s dialogue opens with an observable greeting and offers a reply. The fireplace GIF changes its description and bar without adding a separate full scene.

**Provenance and limits.** These are three independent formats. None proves spatial navigation or a fully simulated room. The supplied fireplace clip’s provenance has the limits noted in VR03.

**OOPS already has.** OOPS household_scene already draws the current animal and hearth from a bounded public projection, says the layout is illustrative and keeps actual controls in its host. F27’s household page is parent-owned.

**Proposed comparison.** Keep a small subject illustration beside the existing observation and legal actions when it helps identify what changes. A small drawing, motion or expressive flourish may earn its place through pleasure, tactility or atmosphere without adding a decision. Preserve focus and target after interaction.

**Acceptance check.** Pet or refuel through the existing control, then inspect the updated subject with motion off and keyboard only. Confirm the picture adds no simulated location, hidden knowledge or inaccessible action.

**Owners inspected.** [household_scene.js](../../src/household_scene.js), [scene_card.js](../../src/ui/scene_card.js), [scene_layer.js](../../src/scene_layer.js).

### VR16 · Make clicks feel tactile without requiring a world change · P1

[V193 picture](proto23/private/discord-media-2026-10-20/captured-media/1526774083654516987-2cf00e005787.webp) · [V193 Discord post](https://discord.com/channels/622495527485046805/811370601129705483/1526774084170551366)

**Visible.** The cat picture puts Rename and Pet Cat beside the subject; the still does not demonstrate a floating emoticon or click animation. These additions come from Weibao’s November 20 direction, not a claim about the archive.

**Provenance and limits.** Current direction explicitly includes click-triggered pop-ups/emoticons and subtle detail. A rename disclosure, a rejected command and successful petting need different responses.

**OOPS already has.** OOPS kit controls share renderer and styles; settled_text_effects provides subject-anchored event presentation. This review has not demonstrated a general tactile press or subject-reaction caller across kit consumers.

**Proposed comparison.** Give ordinary controls a restrained press/settle response. After successful pet/play, a brief decorative note or expressive face can appear beside the animal. Keep it nonmodal and pointer-transparent, and leave focus on the action. UI navigation may respond without consuming game time.

**Acceptance check.** Activate with mouse, Enter and Space; hold and rapidly repeat. Verify each legal activation occurs once, no disabled action produces success feedback, no focus is stolen and temporary marks are cleaned up. Compare with effects off and reduced motion. Judge satisfaction as well as legibility.

**Owners inspected.** [kit.js](../../src/ui/kit.js), [settled_text_effects.js](../../src/settled_text_effects.js), [ui_tokens.css](../../styles/ui_tokens.css), [household_scene.js](../../src/household_scene.js).

### VR17 · Animate work on its actual subject · P1

[E29 picture](proto23/private/discord-media-2026-10-20/supplied/1320812.gif) · [E06 picture](proto23/private/discord-media-2026-10-20/linked/1521016485898883134-23t32t.gif)

**Visible.** The fireplace changes its fuel bar and description after refuelling; logging samples name the target and tool while durability falls, then show the felled result. These do not show a stirring vessel or repaired seam.

**Provenance and limits.** Action-specific brewing, forging and repair motion are original OOPS applications of the reference, not behaviours attributed to Corc. A flourish can depict an atomic action without adding a new timed simulation.

**OOPS already has.** OOPS has bench forms, mixture feedback, native discovery/settled-text effects, current work and activity-owned quote/commit paths. Which live stations use subject-specific animated feedback remains to be replayed.

**Proposed comparison.** At the existing station, animate the acted-on part: a swirl on stirring, a small strike on a workpiece or a brightening flame on fuel. An ongoing process may loop locally; a committed atomic action may get a short depiction. Do not delay availability just to finish an animation.

**Acceptance check.** Commit one successful action, one refusal and one supported interruption. Keep exact costs and saved result unchanged by motion settings. Verify switching away clears obsolete effects and returning shows the actual workpiece or mixture. Compare felt responsiveness with the static baseline.

**Owners inspected.** [bench_form.js](../../src/ui/bench_form.js), [mixture_feedback.js](../../src/mixture_feedback.js), [settled_text_effects.js](../../src/settled_text_effects.js), [household_scene.js](../../src/household_scene.js).

### VR18 · Allow quiet ambient life between decisions · P2

[E29 picture](proto23/private/discord-media-2026-10-20/supplied/1320812.gif) · [V036 picture](proto23/private/discord-media-2026-10-20/captured-media/1141633192604995624-37c04a1e37a4.webp) · [V036 Discord post](https://discord.com/channels/622495527485046805/811370601129705483/1141633192869232670) · [V217 picture](proto23/private/discord-media-2026-10-20/captured-media/812154188737806336-8eafbe2a4519.webp) · [V217 Discord post](https://discord.com/channels/622495527485046805/811370601129705483/812154188913049630)

**Visible.** Corc’s fireplace includes changing flame presentation; sunrise has a warm tint and season labels vary in form. The pictures do not establish that every animation encodes a decision.

**Provenance and limits.** The earlier review wrongly narrowed flame motion to redundant information and small scenes to decision support. Weibao’s clarification allows pleasant atmosphere and subtle detail in their own right.

**OOPS already has.** OOPS already has full-effects hearth flicker, world sky/calendar state and player effects settings. The parent atlas has illustrative sunrise/daylight/sunset controls. Live world-clock uptake is a separate claim.

**Proposed comparison.** Keep a modest lit-hearth loop; try local rain, a soft sunrise tint or a tiny idle subject movement where it suits the place. Reserve geometry so ambience never moves a reading or click target. Decorative accents need not be labelled as game statistics.

**Acceptance check.** Compare the same populated screen during action and eight idle seconds, then effects off/reduced and tab hidden. Inspect target stability, readability and frame cost on the existing performance route. Ask whether the world feels more inhabited, not merely whether another decision became possible.

**Owners inspected.** [palette_feedback.css](../../styles/palette_feedback.css), [world_sky.js](../../src/world_sky.js), [status_line.js](../../src/ui/status_line.js), [display_settings.js](../../src/display_settings.js), [particles.js](../../src/particles.js).

### VR19 · Carry the result beyond the transient flourish · P2

[V657 picture](yair-upstream/private/discord-2026-10-20/catalog-reviewed/objects/6f662c14244de1a942d45cc5b9cac0259eb28981de237bd593b9d8f34bf40fc9.webp) · [V657 Discord post](https://discord.com/channels/622495527485046805/1458887440398942300/1467218373237674068) · [V740 picture](yair-upstream/private/discord-2026-10-20/catalog-reviewed/objects/a15a2a946ac4bbb0987bf729da3fee415f41015a89a4f381374c6c0196b56b59.webp) · [V740 Discord post](https://discord.com/channels/622495527485046805/1458887440398942300/1502748183346811032) · [V878 picture](yair-upstream/private/discord-2026-10-20/catalog-reviewed/objects/7d47eadf3b8ea7a3c976918c1da3910fb1f8464b0a743ebb638b8709ea9f4627.png) · [V878 Discord post](https://discord.com/channels/622495527485046805/1458887440398942300/1543244495259312228)

**Visible.** The frog log retains the contact consequence, the loot table retains its known/obscured information, and the gear sheet retains comparison values. Their lasting information is separate from any transient animation.

**Provenance and limits.** These references support keeping readable results available. They do not require every event to open a popup or claim all OOPS activities currently have a complete return path.

**OOPS already has.** OOPS settled_text_effects already deduplicates receipts, consumes hidden-tab receipts without replay and anchors visual feedback. Existing Reports, item sheets and knowledge owners preserve different outcomes. Coverage across consumers is not yet demonstrated.

**Proposed comparison.** Reuse the effects seam for event feedback and leave durable consequences in their existing subject/readout or Reports. Route animated and static presentations from the same owner result. A decorative local click flourish needs no saved event; a reward flourish follows settlement.

**Acceptance check.** Perform the action, navigate away/back, reload and import where persistence is touched. The outcome stays readable and the celebration does not replay as a new reward. Open another subject mid-effect and check that it receives no stale reaction.

**Owners inspected.** [settled_text_effects.js](../../src/settled_text_effects.js), [reports_dock.js](../../src/reports_dock.js), [knowledge_view.js](../../src/knowledge_view.js), [equipment_comparison.js](../../src/equipment_comparison.js).

## Current disposition of every reference · November 20 update

This accounts for the whole selected image set. **Present** means inspected source supports the mechanism; **prototype** means illustrative/local comparison; **open** means the specified live behaviour has not been demonstrated here. Neither a source scan nor an archived screenshot closes runtime acceptance. The latest [responsive-UI direction](../gm/USER_VISION_LOG_2026-11.md#responsive-animated-and-expressive-ui-2026-11-20) governs the treatment; timings, glyphs and particular examples remain proposals.

| Code | Current evidence | Missing comparison or delivery | Existing owner / disposition |
| --- | --- | --- | --- |
| VR01 | Living/observer/combat seams present; environmental/contact examples source-visible | Learned creature effect, cause and reaction together on a live individual | Creature and combat owners; carry into selected-opponent view |
| VR02 | Home condition/capacity/rest model present; restoration prototype exists | Live repair before/after tied to consequence and owned possession, with return | Home owner; parent atlas retains illustrative comparison |
| VR03 | Finite firewood, toggle, fuel, smoke and flicker present | One visible hearth grouping plus a refuel reaction; verify actual home/away scope | Household and feel-finish; reuse household state |
| VR04 | Source climb progress, debris and fall samples visible | Persistent local failure cue and legal retreat on a supported risky activity | Activity owner; no new climbing simulation inferred or required |
| VR05 | Combat approaches/end states present; archive offers alternate means | Two approaches to one goal with visible actor response and lasting aftermath | Combat/world command owners; preserve actual legal means |
| VR06 | Identity/preferences projection present; creature-desk prototype exists | Same individual across visits, local expressive response and observer-specific information | Creature/household owners; parent retains creature-desk |
| VR07 | Name obscuring and observer knowledge present | Audit whether unknown row counts/probabilities are permitted for that world/observer | Knowledge/bestiary owner; source concern, not a blanket removal decision |
| VR08 | World calendar/sky present; atlas light states illustrative | Production clock-driven sunrise/season/weather treatment and obscured-sky return | Status/world look owner; no inference of live integration from atlas |
| VR09 | Walk-map/public topology routes and atlas prototype present | Known service words plus genuine cost/closure on a live legal route | Travel/place owner; parent owns atlas; bed meaning remains inferred |
| VR10 | Bounded exact-copy vest salvage present | Paired break/dismantle quote where a world actually supplies both | Making owner; general tool-free breaking remains a capability proposal |
| VR11 | Gear comparisons and exact-stack preview seams present | Re-sort/same-name/affix baseline replay; selected-instance continuity | Making/inventory owners; improve existing comparison |
| VR12 | Freshness source-visible; broad OOPS spoilage route unverified | Observed freshness/storage through a real perishable owner | Item owner; defer a new decay mechanic unless selected separately |
| VR13 | Staged trade present; baseline already covers it | Mixed buy/sell amount direction, cancel and settlement replay | Trade owner; regression and clarity pass |
| VR14 | Household illustration and scene-card seams present | Subject/action continuity plus a pleasant expressive response in play | Household/activity owners; optional scene treatment, not a spatial-home mandate |
| VR15 | Cross-cutting acceptance principle | Check feel, pleasure and atmosphere alongside action/result/return correctness | Every selected slice; no separate implementation module |
| VR16 | Kit controls and anchored event effects present | Common tactile press/settle; appropriate local transient symbol on success | UI cohesion/feel-finish; one reusable interaction route |
| VR17 | Bench/mixture/work/receipt seams present | Actual stirring, strike, repair or refuel depiction at an existing action | Making/potion/household owners; no new timer for an atomic action |
| VR18 | Full-effects hearth loop present; sky and player settings present | Selective ambient uptake and measured idle/readability comparison | Feel-finish/world look; local motion with stable geometry |
| VR19 | Receipt deduplication and hidden-tab handling present | Consumer coverage, stale-target cleanup and durable-result replay | Existing settled-text-effects callers and Reports owners |

Implementation order proposal: first compare hearth refuel plus pet/play response (VR03/14/16/18/19), then one existing making action (VR11/17), then a creature/environment or actor-response encounter (VR01/05/06). These three comparisons exercise the reusable feel vocabulary without demanding all worlds or a new core engine first. The remaining rows stay with their named owner and gate above. The research pass is complete; this table explicitly retains open runtime work.

## Coverage and limits

| Inventory | This pass |
| --- | --- |
| Corc primary | Read the complete 308-post index and its asset records; screened all selected image representatives, including non-game references and tiny code crops. Captions were consulted in depth for the shortlist, not every surrounding conversation. |
| Corc recovery | Included the recovery catalogue: 179 message records, 33 attachment records, 27 asset records and 26 objects. Source HTML, font/audio/binary attachments are not pictures; none was executed. |
| YAIR | Surveyed the fuller `catalog-reviewed/catalog.json`: 1,387 messages, 682 attachment records, 680 assets, 675 objects. The older `catalog-final` has 509 objects and is not the coverage ceiling. |
| Deduplication | 1,012 asset records across the two indexes and Corc recovery produced 987 attachment groups. Collapsed alternate re-encodes by source plus attachment ID, selecting the largest image area; collapsed eight additional representatives with identical decoded RGB pixels. Result: 950 image representatives (279 Corc primary, nine recovery, 662 YAIR), all screened on 20 sheets. This does not claim 950 semantically distinct screens. Similar crops, resized reuploads and successive states can remain separate. |
| Auxiliary Corc media | Screened all 30 files in linked/supplied manifests. Seven linked files are alternate representations of known attachments; the 23 supplied files include crops and GIF variants. They are supplemental evidence, not 30 new Discord discoveries. |
| Animation | Inspected representative start/intermediate/end frames from ten Corc GIF representations, up to nine evenly spaced frames each: V049, V116, V283, E01, E03, E04, E06, E07, E29, E30. Sampled existing first/middle/last extracted frames from all ten YAIR game-interface MP4s. This is a new sparse-frame check, not a claim to have watched them all continuously. The DU owner records the earlier full sampling. Audio was not reviewed. |
| Not image-decodable | 29 records rejected by PIL: 17 Corc recovery HTML/binary attachments and 12 YAIR MP4s. This is an image-decoder boundary, not 29 corrupt files. Ten game MP4s were screened through existing frame sequences; the developer-editor/music clip and unrelated pet video remain outside the UI shortlist, as identified by the earlier motion review. |
| Remaining limits | Some still derivatives cannot preserve animation, some reply previews/context are missing, and signed URLs may have expired. Archived captions and IDs remain usable. Media availability is bounded by the original author/attachment searches, not complete Discord history, deleted posts or current releases. Full-resolution archived captures were used for shortlisted stills; these are often WebP derivatives, not authenticated original source bytes. Tiny code/font crops and decorative/reference-only media were screened but cannot support interaction claims. |

Private reproducible evidence: [inventory and aliases](discord-visual-review/private/2026-11-20/inventory.json), [auxiliary representations](discord-visual-review/private/2026-11-20/extras.json), [screening sheets](discord-visual-review/private/2026-11-20/index.html), [shortlist data](discord-visual-review/private/2026-11-20/shortlist.json). Every inventory ID maps to a local file, archived caption, attachment ID and post locator where available. Private files are ignored by Git. No source media were copied into a public asset directory.

## Previously covered and parked

| Reference family | Disposition |
| --- | --- |
| Native YAIR bars, fallen rows, place-to-fight replacement, quiet log | F14–F15 / DU9–16 already cover these. Retain as regressions for the combat owner; do not restart the shell redesign. |
| Logging durability and tool power; recipe material counts and quantity buttons | F15 and F11 already cover these. E06 adds a useful sampled fell-tree result and persistent tool identity; no new generic progress-bar system is proposed. |
| Glove stacks, known recipe uses, selected/favourite stance, use/auto-use, seasonal work closures | Existing activity review and DU catalogue own the ideas. Screened again; exact-instance comparison adds a focused check here. |
| Maps, cat identity, dwelling restoration, sunrise and underground weather | F23 / F26 / F27 and the parent’s two prototypes already cover the direction. VR02/06/08/09 add evidence and checks, not another implementation lane. |
| Giant stat tables, exposed AI attack probabilities, full loot probabilities | Useful developer/reference views, not a default for all player knowledge. Exactness needs a world and observer justification. |
| Random accessory debuffs and degradation; punishing climb death | Reported as source behaviour, not required balance or mandatory weaknesses for OOPS. |
| Whole spatial home, illustrated portraits, particle-rich shell | Functional Proto23-style information remains the baseline. A whole spatial home is a separate scope choice; small illustrations, ambient motion and expressive details are in scope without needing another decision. Compare their feel as well as usability. |
| Unrelated memes, food photos, personal media, performance charts, editor/code snippets | Screened for classification; no design claim or public reproduction needed. |

## What else changes the choice

**VR15 · Test the experience and the result.** A native route, an observer’s knowledge, persistent identity and the result after return decide whether a transfer works. The proposed tests belong to the implementation owner’s next bounded comparison. Include pleasure, tactility, atmosphere and subject personality in that comparison alongside readable outcomes. Colour, motion and metaphors may be decorative, atmospheric or tactile. When they claim temperature, danger, a service, an NPC motive or a gameplay result, that claim follows the actual owner and observer. Keep novel interactions original and keep the private screenshots local.

Verification for this research artifact: local picture/owner link existence, HTML image targets, ignored private evidence and whitespace checks. No runtime acceptance, build, installation, commit or push is claimed.

## Verification of the November 20 clarification

The direction update changes documentation and the reference viewer, with no runtime or prototype source edits. Chromium loaded 45/45 picture elements across 18 cards; P1 filtering returned seven, combined slime search returned one, zero page errors, and no horizontal overflow at 390px. The 1440px capture was inspected. [Browser receipt](discord-visual-review/private/2026-11-20/browser-receipt.json). Local report picture/owner links resolve. Rules-index check and direction-sync check returned 0. Rule lints returned 0 with nine pre-existing warnings in shared runtime edits. `check:docs` returned 1 on unrelated shared additions; this task’s new passages and visual report have no diagnostics. `git diff --check` for touched documentation returned 0. No build, installation, commit, push or runtime acceptance is claimed.
