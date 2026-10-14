# H3 extended: several story scales and news with a journey

2026-10-14. **PROPOSAL ONLY.** Extends [root H3](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#h-places-that-remember). [P11 N5](../p11/INFORMATION_AND_LIBRARIES.md) owns messages/channels/corrections; [P14](../p14/CONTRACT.md) owns accounts/claims; [P19](../p19/CHECKPOINT.md) owns social contact; [P21](../p21/CHECKPOINT.md) owns conflict/supply events. P20 adds scale-qualified scheduling and place-sensitive arrival/use. **Offline advancement remains unselected.**

## H3.1: separate cadence and exposure, one scheduling authority

A clock domain says which elapsed time is meaningful. A story scale says what area/people an event affects. A cadence says how often its causes are reconsidered. They are not interchangeable. Use the existing scheduler with persisted due boundaries, cursors and deterministic ordering; no independent wall timers for village, region and cosmos.

| Scale | Proposed cadence/trigger, world-qualified | Consumer and causal link |
|---|---|---|
| Personal | Action completion, conversation/contact or admitted routine boundary | A neighbor's repair/request and individual knowledge. |
| Local | Actual site/occupancy/occasion transition; optional local daily summary | Work availability, new household needs and local notices. |
| Regional | Real shipment/control/ecological transition; a coarser review window where selected | Prices/transport/services via P21/P8 owners and dated messages. |
| World | Source event window or actual institution/world-level cause | P13's natural course and generated aftermath; not a random disaster per year. |
| Cosmic | Actual actor reach, supported omen/intervention sequence | [COSMIC_EVENTS](../../../../COSMIC_EVENTS.md), actor/target-dependent consequences and relevant local effects. No default god tick. |

Several scales can be active in the same eligible played interval. One regional event can create local consequences and personal requests using shared cause refs; it should not count as three independently sampled catastrophes. Same-time order must respect prerequisites: due domain outcome, local effect, account composition, dispatch, arrival, then recipient decision. A cause committed at a boundary cannot retroactively inform an earlier choice. Use temporal edges plus stable IDs, not universal sorting by literary importance.

World instance clocks currently require freeze absence (`src/world_instances.js:108-111`); `planWorldClock` merges occupied intervals so simultaneous visitors do not double-advance (`:309-344`). Narrow supported activity leases also exist (`src/realm_state.js:74-83`, `src/realm_clock_leases.js:1-6,64-65`); their existence is not a general absent-world simulator. Baseline simulation explicitly advances played time (`src/simulation.js:48-72`), and exposes due jobs/checks/controllers to the common scheduler (`:456-465`). These are SHOWN/SOURCE only.

For different world calendars/rates, reference the selected mapping and exposure owner. Store origin local date, clock-domain ID and dispatch/arrival anchors; do not subtract incomparable dates or divide expansion minutes by a guessed year. Temporal/branch owners [T1–T5](../../../../TIMELINES_AND_DIVERGENCE.md) and [intro TA/TB/BR/DV/OT](../../../../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md) decide mappings, resets and resting-branch policy. OT's offline proposals do not select them for P20. A tab closing creates no years, news arrivals, home losses or delayed payment.

## H3.2: append metadata to N5, not another rumor system

Use N5's single message/account lineage with additional optional place/scale refs:

```text
originPlaceRef, impactPlaceRefs, scaleRef, sourceClockAnchor,
routeOrContactRef, destinationPlaceRef, destinationClockAnchor,
latencyPolicyRef, dispatchReceiptRef, arrivalReceiptRef,
knownAsOf, transformationRef, parentAccountRef, correctionRef
```

A geographic distance is not automatically a delay law. Ordinary courier, public notice, letter, institution relay, magical contact and qualified cross-world carrier each have their own means. Cheap or instantaneous channels remain reachable where supported. Same-room speech can arrive immediately at its committed contact boundary. A frozen destination has no free elapsed local travel; a message can wait at a supported gateway under its own selected custody/exposure policy. No implicit conversion of future news into current knowledge.

Dispatch freezes what the sender actually knows/claims and the allowed original text. An event's actual state may change en route. On arrival the player receives that dated account, not a silently refreshed truth. Delivery makes a belief possible; corroboration and investigation remain separate. Duplicate arrival grants no duplicate knowledge/payment. A correction is a new linked message; the old edition remains as history.

## H3.3: distortion is a transformation of an account

| Transformation, INFERRED/proposal | Meaning preserved / changed | Concrete use |
|---|---|---|
| Compression | Drop detail under a declared summary policy; never add witnesses | A town notice reports reopening but omits the repairers. |
| Misattribution | Saved claimant/credited-actor change, only among legal introduced identities | A commission for credit investigation. Original cause/contributors remain unchanged. |
| Translation/register | Fixed claim meaning plus a saved interpretation with uncertainty | A translator clarifies an unfamiliar work term; translation never reveals an unknown secret. |
| Sensationalism/censorship | A speaker selects or exaggerates permissible claims; omission is recorded internally | Different institutions describe the same disruption differently, without omniscient motive claims. |
| Intentional forgery | Actual authored fabrication action plus custody/publication and a false claim | A traceable fake notice creates an investigation, not a mutation of the place's history. |

Distance and hop count alone should not force distortion. A dated official letter may retain exact content through many carriers; neighbors can mishear at one hop. Link E6 §11's garbling palette as an option, not its fixed three-hop/five-year law. Parent-source lineage prevents ten copies of one claim from becoming ten corroborating witnesses. Source facts and sealed causes are absent from distortion inputs unless the sender legitimately learned them through their route.

## H3.4: make old news playable

Original fixture: an actual installed repair at a fixed Village site creates a local witness account. A declared courier departs for a second authored node. Before arrival its shopkeeper has no new knowledge. One saved retelling credits fewer contributors; a retained source link and actual witness allow correction. The buyer uses known news to offer a nonbinding inspection quote, while execution still checks real current access and stock. If the site closes again en route, the arrival reports the earlier reopening and visibly dates it. A fresh inquiry can resolve current condition.

This extends H1 causality and P11 N5's relay proof with two different story cadences and stale news affecting a genuine offer. P12 owns any longer arc. It does not promise dynamic trade routes, wars or telepathy from one courier fixture. Existing feed already has an eight-played-minute late-hear route for missed chronicle events (`src/event_feed.js:17-20,101`), and read-only discovered-event news (`:37-47,102`). That is a narrow delayed report, not a transport network. `src/event_feed_ui.js:4-13,31-42` renders known events; arrival cannot be implemented inside rendering.

Future gates, all OPEN: recipient ignorance before committed arrival; exact origin/as-of/received dates; same source/cause lineage through distortion/correction; action differs on old versus current evidence without execution trusting false claims; packet waits/cancels on lost channel support; long vs segmented advancement agrees; two visitors never advance local time twice; closed-browser/wall-time-only interval changes nothing under the retained policy; pending message and next draw survive Save/reload/Export/literal import. Rebuilt desktop views show local work beside dated news without forcing every distant story into a decision prompt.
