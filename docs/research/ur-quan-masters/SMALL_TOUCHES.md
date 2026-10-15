# Twenty-eight small touches

Every source-side item is **SHOWN** in the pinned source, not natively observed. Every YAIRPG application is an **INFERRED PROPOSAL**, not implementation or an accepted decision. S codes resolve in [SOURCES](SOURCES.md). UI owner: `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`; dialogue owner: `docs/worlds/DIALOGUE_AND_INTERACTIONS.md`; other routing follows IMPLEMENTATION_PACKETS. Target 1366x768 desktop; mobile deferred.

| Code | Source-side detail | Locator | Kit / packet | YAIRPG use |
|---|---|---|---|---|
| T01 | A greeting changes after the first visit | S03: SpathiAllies | K6/K20; P19 | Choose wording from an actual meeting record. |
| T02 | An allied greeting differs from a neutral one | S03: Intro | K7/K20; P19 | Use local institutional stance without a global affinity meter. |
| T03 | A fearful speaker keeps the same agenda across jokes and offers | S03: SpathiOnPluto | K6/K27; P19 | Keep a voice cue connected to the speaker's means and goals. |
| T04 | Asked topics disappear for this encounter | S02: DISABLE_PHRASE | K6/K14; P19 | Offer read-only topic exhaustion separately from permanent completion. |
| T05 | Revisiting is not replaying every initial explanation | S04: procedure flags | K4/K20; P19 | Retain first-explanation history while keeping help reachable. |
| T06 | A merchant explains a zero-credit failure | S04: DoBuy | K8/K14; P18 | Name the known missing means and next useful route. |
| T07 | A fuel offer checks actual tank capacity | S04: DoBuy | K8/K9; P18 | Prevent a paid overfill and show current useful capacity. |
| T08 | A technology offer skips already-owned technology | S04: GetNextTechForSale/HasTech | K3/K9; P04 | Use ownership state rather than a shop-only purchase count. |
| T09 | A spoken number is assembled from numeric state | S04: NPCNumber | K14/K20; P19 | Format actual numbers without embedding rewards in prose. |
| T10 | Selling data changes the next useful offers | S04: DoSell | K8/K11; P02 | Refresh from paid stock/credit, not stale menu text. |
| T11 | A newly reported discovery has its own sold-history state | S04: MELNORME_RAINBOW_COUNT | K11/K18; P11 | Prevent reselling a unique report while preserving new opportunities. |
| T12 | A learned claim and carried proof lead to different requests | S05: NormalSyreen | K11/K31; P11 | Show only evidence the actor knows and possesses. |
| T13 | Uncertain translation has its own visual/verbal register | S20/S27: Orz | K20/K30; P19 | Keep ambiguity in original local phrasing, not hidden-fact tooltips. |
| T14 | A group takes short alternating turns | S25: NPCPhrase_cb | K6/K27; P21 | Retain speaker identity for each short turn. |
| T15 | A home contact differs from a remote encounter | S26/S06 | K6/K14; P19 | Bind scene to actual participant and place. |
| T16 | Conversation summary is a separate cancel action | S01: SelectConversationSummary | K14/K23; P20 | Make prior text reviewable without replaying effects. |
| T17 | Long choices scroll inside their own reading region | S01: RefreshResponses | K14; P19 | Use desktop space while letting local prose scroll. |
| T18 | Alien ambient motion is independent of speaking motion | S03/S20: LOCDATA | K14/K19; P21 | Keep flavor presentation independent from gameplay settlement. |
| T19 | Some ambient animations exclude simultaneous conflicting motions | S20: BlockMask | K14; P16 | Define presentation compatibility rather than random overlapping cues. |
| T20 | A map shows current fuel reach | S07: fuel-range circle | K5/K14; P18 | Show a known reachable envelope with its limits. |
| T21 | The destination estimate updates as the cursor moves | S07: UpdateFuelRequirement | K5/K8; P18 | Keep route context beside actual available means. |
| T22 | Landing fuel is shown before descent | S08: drawLandingFuelUsage | K5/K14; P18 | Reveal arrival commitment before payment. |
| T23 | A full hold has distinct feedback | S09: LANDER_FULL | K9/K14; P01 | Name the actual capacity blocker. |
| T24 | A pickup shows the collected amount and material name | S09: pickupMineralNode | K9/K14; P01 | Report actual accepted stock, including partial capacity. |
| T25 | Environmental protection has a matching feedback state | S09: shieldHit | K9/K28; P17 | Show which real protection applied without overstating immunity. |
| T26 | Cargo unloading animation can be sped up | S10: SellMinerals/AnyButtonPress | K8/K14; P01 | Let presentation speed change without changing sale totals. |
| T27 | A news report can be repeated without repeating its escort gift | S10: CheckBulletins | K12/K23; P20 | Separate delivered text from a retained settlement receipt. |
| T28 | A recurring portal has an opening and closing phase | S12/S30: arilou_entrance_event/checkArilouGate | K5/K32; P13 | Represent scheduled availability and visible transition separately. |
