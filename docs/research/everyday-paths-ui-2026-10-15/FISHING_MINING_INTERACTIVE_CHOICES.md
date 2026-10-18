# Fishing spots and mining faces: interactive choice study

2026-10-15. Original, unselected proposals and standalone mock interactions only. User requested selectable fishing spots/mining faces, meaningful choices and skill/power consequences, with saved mockups and no game implementation. [Viewer](mockups/index.html), [guide](mockups/README.md), [36 scenario checks](mockups/TARGET_CHOICE_CHECKS.json), [interaction receipts](mockups/TARGET_INTERACTION_CHECKS.json).

Surface/home: proposed Fishing activity detail at the known riverbank; proposed Mining activity detail at the accessible known seam. Desktop/laptop target1366×768. Visible outcome: select a represented target, inspect conditions and available means, choose a method, and preview the next plan while current work and journal remain intact. Mobile, real simulation, save migrations, native shared-component integration and live donor play remain deferred. [UI rules](../../UI_RULES.md) govern any later production candidate. Accepted chosen-involvement direction remains in [D3](../../gm/REPRESENTATION_DIRECTION_DISCUSSION_2026-10-15.md#d3-accepted-direction-in-this-discussion).

## TC1. Interaction that changes a decision

The diagram is a target selector. Each named region supports click, Tab and Enter/Space. Alternate labelled buttons select the same region. Selection changes the inspector and carries into Investigate, Routine and Delegation, including when returning from another family. It neither redirects ongoing work nor repeats a committed result.

Personal view has mock scenario controls for basic practice versus a practiced technique, and no power versus sensing versus control. These are authoring comparisons, not player training or on/off ability controls. A method selector and explicit preview stay pinned above Back. Selecting an unavailable method displays the reason and disables its preview; it does not silently replace the choice with a valid one. Changing scenario retains the selected method so its dependency is visible.

The inspector separates local condition, evidence, skill contribution, power contribution and predicted method effect. Scope overlay visibility does not change the selected means. No chance percentages, power costs, species catalogue, reserves or new ore grades are invented to fill the UI. Power costs, reach and execution would need the selected world's actual rule.

## TC2. Three fishing targets

All three reaches are fictional named regions of the already-known riverbank, not newly discovered game locations. Coarse cover/flow/reach attributes suffice for this comparison.

| Target | Meaningful ordinary choice | Skill changes | Power changes | Evidence and responsibility |
|---|---|---|---|---|
| Reed margin | Float beside cover for a steady known routine, or observe before changing presentation | Better interpretation distinguishes a snag from a feeding sign; practiced drift remains an option | Surface sense supplies movement evidence; water control can open a small presentation gap | Movement is not species or appetite. Ivo retains the existing assignment; a different plan needs handoff or separate agreed scope |
| Moving seam | Controlled drift through a particular band versus a float that passes through quickly; retain observations instead of prioritizing catch | Practiced technique keeps the presentation in the intended band, favoring repeatability/selectivity | A held eddy can make this approach possible with basic practice. Sensing alone does not supply control | Your running cast remains committed. Planning applies at a future supported boundary, without reset/reroll |
| Shaded bank | Short float presentation under cover versus observation that helps distinguish shade from time-of-day effects | Better placement and interpretation; no automatic species reveal | Sense movement beneath the represented overhang or hold the presentation nearby | Different response is an observation, not proof of a shade law. No helper is currently assigned |

Worked example RF-I1: choose Moving seam, Basic practice, None, Controlled drift. Preview is unavailable and explains the missing technique/control. Ordinary float or observation remains a viable choice. Switch only power to Hold an eddy: the method becomes previewable because the flow is stabilized, while handling and interpretation remain basic. This is an alternate means, not a free skill-level increase.

RF-I2: keep the same reach and practiced drift, then compare None with Surface sense. Evidence changes from a surface sign to sensed movement at the boundary. Identity and appetite remain unconfirmed. The power gives a reason to target a band, not a guaranteed catch or a hidden fish list.

RF-I3: select Reed margin and inspect delegation. Retain unfamiliar catches, use actual supplies, stop at the stated goal/shortage and preserve Ivo's existing scope. Your personal practiced technique or power is not transferred to him by opening this view. A helper needs their own capability and agreement.

## TC3. Three mining faces

These are proposed subdivisions of one already-known exposed seam. The current source-backed pickaxe→timed cycle→Mining practice/actual ore loop remains available in Current flow. No underground map, finite depletion or geology engine is implied. See [source-backed boundaries](MINING_FLOW_AND_PATH_PROPOSAL.md).

| Target | Meaningful ordinary choice | Skill changes | Power changes | Evidence and responsibility |
|---|---|---|---|---|
| Exposed rib | Ordinary useful ore versus a retained labelled piece | Useful cut placement without preserving every fragment | Sense a local discontinuity or separate a reachable section | A broad face is not a reserve estimate. Current cycle and output custody stay intact |
| Fractured edge | Ordinary extraction versus controlled fracture work favoring an intact comparison sample | Practiced cuts can follow the visible fracture | Stone sense supplies local structural evidence; separation force can replace a levering step | Unknown composition remains unknown. Nell's hauling permission is not extraction authority |
| Banded face | Ordinary ore versus labelled cross-band sampling for a later comparison | Preserve origin/context for a useful sample | Structural sensing does not perform chemical analysis; separation can supply a piece | Color is not richer grade. A retained sample competes with delivering the same piece for smelting |

MN-I1: choose Fractured edge, Basic practice, Stone sense, Follow fracture. Preview stays unavailable: seeing the structure does not perform controlled extraction. Switch to Separation force: the missing levering step can be supplied, while basic handling still limits sample control. No mastery, grade or reserve is granted.

MN-I2: choose Exposed rib with practiced technique. Follow fracture is unavailable because this target has no established usable fracture. The character can inspect the fractured edge or choose ordinary extraction/sampling. A high skill value should not fabricate an appropriate target property.

MN-I3: choose Banded face and Retain labelled sample. The useful decision is custody and purpose: reserve a piece with known provenance for a possible analysis consumer, or deliver usable ore now. A sample label has value only if a real downstream comparison/analysis uses it. This study proposes that consumer; it does not claim native assays exist.

## TC4. Involvement, discovery and learning

| View | What changes | What persists |
|---|---|---|
| Personal | Target inspector and method/means comparison; explicit next-plan preview | Actual current work, stocks and committed outcomes |
| Routine | Existing actor/method/status table plus selected-inspection reminder | A selected target is a draft, not an automatic work redirection |
| Investigate | Target-specific question and reference-versus-changed-method comparison | No new observation or discovery just from changing controls |
| Delegation | Selectable diagram plus target-specific claims, actor scope and agreement preview | Ivo remains at the reed margin; Nell remains carry-only; skills/powers belong to actual executors |

Skill practice belongs to the actor performing qualifying work. Choosing a closer view gives no practice bonus. A personally followed routine can use a learned technique; delegation can generate useful reports without silently awarding the player the helper's unperformed practice. Discoveries require attributed evidence, communication, interpretation and a real rule. A teacher or fitting power may support a method without compulsory manual grinding.

The comparison view warns when changing both skill and power would confound the inference. It distinguishes a sign, a report, an uncertain explanation and a supported method. A controlled method can be useful before the cause is completely understood. No predetermined discovery is awarded in this mockup.

## TC5. Integration seams and limits

Target identity, target condition, method, executor, actual means, work claim, stock allocation and attributed evidence should remain distinguishable. Shared inspect/preview behavior can connect farming, fishing and mining without forcing all three into plot area. Fishing reach is coarse access/flow; a mining face is exposed structure; neither is measured land coverage or reserve volume.

Do not derive yield multipliers from these qualitative previews. Before a real candidate, select which authored rule changes effort, access, selectivity, fragment preservation or useful stock, and connect it to a consumer. Preserve existing activity IDs, RNG outcomes and stock/persistence owners. No generic shared engine is selected by this study.

The held-eddy/separation examples intentionally offer alternate means without a mandatory punishment, mana system or universal cap. Stronger actual powers may legitimately bypass more work. The UI should describe that supported rule rather than impose difficulty for symmetry.

## TC6. Inspection and remaining decision

CUA exercised36 target × skill × power combinations in an isolated tab at1366×768. All preserved the current-work text and had no whole-page overflow; preview and Back remained within the viewport. Long inspector content scrolls in the center; maximum measured scene ratio before a long preview was approximately1.40. Method and preview controls remain outside that scrolling explanation.

Separate interaction checks exercised keyboard target selection, blocked versus power-enabled methods, unchanged work after preview, hidden-overlay state, sample tradeoffs, target-specific investigation, helper scope and Escape/return continuity. All21 family comparison captures were refreshed. These checks prove the standalone design behavior, not simulation correctness, native YAIR parity or user acceptance. Larger-text behavior, real shared navigation/history and actual world/ability integration remain unverified. No source/build/test/save or shared design owner was edited.

Recommendation, unselected: retain directly selectable named targets and contribution-specific explanations. Keep Routine viable without opening the map. Before implementation, choose one meaningful method-to-consumer rule in each pursuit; the mockup has made those decisions concrete without selecting their balance or engine design.
