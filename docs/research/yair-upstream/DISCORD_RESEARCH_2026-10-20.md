# YAIR upstream developer media and design research

2026-10-20. **All 166 previously missing attachment IDs recovered and checked.**
The combined collection covers 623 developer attachment posts and 27 selected
discussion windows. Review covers all 663 distinct image objects at overview
level, focused original-size checks for six design anchors, all 623 developer
captions, and 72 sampled frames across all 12 videos. This is a finite research
corpus with selected discussion context, not a full-channel archive or release
certification. The [deeper media round](#deeper-media-round-2026-10-20) adds
28 readable still-image inspections, 234 video-frame inspections across ten
selected clips, eight expanded discussion windows, F25–F34 and P10–P17.
The opening overview counts describe the preceding pass, not this added depth.

Weibao requested the YAIR equivalent of the [Corc collection](../proto23/CORC_MEDIA_AND_DESIGN_2026-10-20.md), including media, accessible source files, captions, rationale, iteration and player feedback. His later instruction was to stop using Discrub and use an alternative or an extension-free fork. This pass used signed-in browser capture, the existing offline workbench and its scoped media transport. No exporter fork was needed or built. The Corc raw archive and report were not rewritten.

AD32, AD35 and AD36 apply. This report is evidence and analysis. It changes no
accepted mechanic, implementation priority, runtime code, bundle or user save.
Desktop-first UI direction remains authoritative. No commit, push or publication
was performed. The [October 15 owner](../proto23/DISCORD_RESEARCH_2026-10-15.md)
retains the earlier incomplete full-export history.

## Identity, scope and provenance

| Code | Verified result | Boundary |
|---|---|---|
| F1 | Initial Chrome access required sign-in. Weibao restored it. Opening installed Discrub then triggered Chrome's explicit extension-UI automation block; Weibao closed its panel. | Initial screenshots/status remain private history. No credentials were read or stored, no export started, and Discrub was not used again after his instruction. |
| F2 | Visible profile: handle `miktaew`, display name <code>Miktaew &#124; No Award 2026</code>, profile link to upstream YAIR. Author avatar metadata identifies account `1110590008584310805`. All 623 search records parse to that account ID. | Saved profile, screenshot and actual author-row DOM establish Discord attribution. Corc and SardineMilk are separate developers, not substitutes. |
| F3 | Historical ID `1212455523325050900` is the closed, locked **Yet Another Idle RPG** thread under `proto-23`. Two smaller search-included threads are **YAFEIRPG** (`1464834877475000456`) and **Development/contributions** (`1492621609918398585`), both under current YAIR. | Parent/title evidence is saved. Only search-included developer posts were collected from the two smaller threads; their full histories were not traversed. Modding advice there is not automatically a main-game decision. |
| F4 | Four earlier YAIR community notes remain in `seed/`, including one known message ID and three unlocated transcriptions. | They are inherited October 15 notes, separate from this new corpus. Earlier F6/F7 on temporary buffs and flavor interactions remain attributed player preferences. |

Guild `622495527485046805`; current channel
[yet-another-idle-rpg](https://discord.com/channels/622495527485046805/1458887440398942300).
No unrelated server history or DMs were collected. Surrounding windows can contain
off-topic replies; those are retained privately and are not all design evidence.

The capture helper initially retained the earlier query label on 150 historical
rows and produced seven parent-channel locators for descendant-thread results.
Some raw page checkpoint filenames were also reused. The aggregate retained all
623 distinct IDs. `normalization-notes.json` and `locator-corrections.json` record
the correction: live thread/parent identity, message IDs relative to the current
channel's creation, and attachment paths reconcile the scope. `normalized/` is the
corrected catalog input; raw observations remain in `capture/`. Do not use raw
helper labels or checkpoint filenames alone as provenance or coverage proof.

## Completed recovery and review

The earlier 166-ID gap is closed. The original snapshot below remains unchanged
as collection history. Current private outputs:
[searchable gallery](private/discord-2026-10-20/catalog-reviewed/index.html),
[catalog](private/discord-2026-10-20/catalog-reviewed/catalog.json),
[recovery receipt](private/discord-2026-10-20/recovery-166/recovery-coverage.json),
[review ledger](private/discord-2026-10-20/recovery-166/review-ledger.json), and
[verification](private/discord-2026-10-20/recovery-166/verification-reviewed.json).

| Evidence | Current result and limit |
|---|---|
| Requested gap | **166/166 IDs with saved, hash-checked bytes**, zero unresolved: 154 image/GIF IDs, 11 MP4s and one text attachment. The immutable request list is `recovery-166/requested-166.json`. |
| Combined saved media | Original 677 listed IDs all have bytes somewhere in the private package. The gallery contains 676 media IDs / 680 asset records / **675 unique media byte objects: 663 images and 12 videos**. The remaining ID is the inert `.txt` save, intentionally outside the media catalog. Image objects include byte variants; 663 does not mean 663 different screenshots. |
| GIF identity | One recovered GIF has six decodable frames. The other GIF-named attachment is served as PNG; original transport returned HTTP 200 with the same PNG hash. The catalog's two suffix-based animation warnings refer to this same source-served still, not two unresolved downloads. |
| Context | Nine additional windows bring the total to **27 windows / 807 distinct rendered context rows**, union **1,387 message IDs**. All new windows were read, with relevant exchanges analyzed below. Context introduces five additional listed attachments outside the requested 166: one off-topic response and four player wiki/stat images remain uncollected. Their surrounding text is retained; no finding depends on their unseen pixels. |
| Locators | 807 message locators are verified by context DOM; 580 remain expected search locators. 251 grouped context authors lack verified numeric account IDs. The catalog retains those gaps; the 623 developer search records still have the verified developer account ID. |
| Review depth | All 21 image contact sheets inspected; six anchors checked at native size (#35, 64, 65, 153, 353, 551). All 623 developer captions read. Each video inspected at 0/20/40/60/80/98 percent of duration. No continuous playback/audio review or full-size reading of every code screenshot is claimed. Memes, personal media and external-game images were screened out of design conclusions. |
| Checks | Every recovery record's SHA256 and byte count checked; complete decoding passed for 155 recovered browser image records and all 12 video streams; 675 workbench object hashes passed; gallery local references passed; private ignore checks passed. No game tests were run because this change is research only. |

Browser image capture used exact observed attachment URLs. Direct browser video
navigation was blocked and a visible download timed out; collection switched to
the workbench's existing serialized, scoped original-media transport. All its
requested responses were HTTP 200, without account credentials. No Discrub use,
credential extraction, message changes or observed 429 occurred in this recovery.
The developer-shared text save was downloaded as requested, kept inert, and never
decoded, imported or executed. Existing local player saves were untouched.

## Additional context-backed findings

These findings extend F5–F17 below. They are dated evidence, not accepted OOPS
requirements. The reviewed images and source discussions support the stated
layer only.

| Code | Finding | Evidence and interpretation |
|---|---|---|
| F18 | **Tell players what an interruption does before they start.** A long task's tooltip explicitly says pausing preserves progress. The next developer reply qualifies it to cases where that makes logical sense. | [January 25 task](https://discord.com/channels/622495527485046805/1458887440398942300/1464961455765061733), [qualification](https://discord.com/channels/622495527485046805/1458887440398942300/1464961516351524966). Native-size image checked. Useful communication example for OOPS's existing mechanism-dependent settlement rule; it does not justify universal resumability or refunds. |
| F19 | **Separate attempt cadence, yield chance and clock units.** The first gathering draft invites confusion with real time. A later caption says timing scales with skill and that the shown extreme value is below requirements. A suggested combined wording is rejected because different resources have different chances. | [May 17 initial draft](https://discord.com/channels/622495527485046805/1212455523325050900/1240943983622885397), [skill qualification](https://discord.com/channels/622495527485046805/1212455523325050900/1240981580420485210), [per-resource chance explanation](https://discord.com/channels/622495527485046805/1212455523325050900/1240986418071994439). Two native-size images checked. These are individual attempt probabilities, not guaranteed yields or verified expected-time formulas. |
| F20 | **Make local change visible in the place description.** A cave screenshot describes space secured by the player's efforts while retaining signs of danger farther in. The developer frames this as changing more than skill names; two nearby responses welcome it. | [March 20 preview](https://discord.com/channels/622495527485046805/1212455523325050900/1219970291145642025), [reaction](https://discord.com/channels/622495527485046805/1212455523325050900/1219988851708137535). Native-size image checked. This supports contextual aftermath text, not a verified causal trigger, persistently simulated settlement or new layout system. |
| F21 | **Show owned output where a player is deciding what to make or buy.** A player asks for finished-item counts because component juggling makes planning awkward. Miktaew puts the count in the shared item tooltip to support crafting, trader and storage inspection; the requester confirms the approach. | [Player problem](https://discord.com/channels/622495527485046805/1458887440398942300/1533369430082457803), [tooltip proposal](https://discord.com/channels/622495527485046805/1458887440398942300/1533372872922365972), [confirmation](https://discord.com/channels/622495527485046805/1458887440398942300/1533373504949584004). Native-size image shows an owned count and an explicitly unfinished NaN success rate. The owned-count feature already exists in this checkout at `src/display.js`; this is rationale for preserving it, not a new feature request. |
| F22 | **Functional substitutes can retain distinct identities.** Coal and charcoal can share a recipe input type while keeping different names, descriptions and prices. Later discussion considers recipe-specific material weights, but Miktaew doubts that the implementation effort would pay off. | [April 10 rationale](https://discord.com/channels/622495527485046805/1212455523325050900/1359992942760165397), [September 14 tradeoff](https://discord.com/channels/622495527485046805/1458887440398942300/1549112429210898463). Native-size recipe image checked; current `src/crafting_recipes.js` already has coal-type inputs and charcoal production. Do not copy the upstream effort judgment as an OOPS decision or turn one broad tag into universal equivalence. |
| F23 | **Explain changing reward rates through supported knowledge and causes.** A developer-shared critical review objects to concealed drop-rate reduction. A nearby player argues the reduction smooths loot as kills speed up; other replies point out the end of available content. | [March 2 feedback image](https://discord.com/channels/622495527485046805/1212455523325050900/1213533548070309938), [counterinterpretation](https://discord.com/channels/622495527485046805/1212455523325050900/1213550762349568030), [developer content boundary](https://discord.com/channels/622495527485046805/1212455523325050900/1213547440821764226). This is disagreement, not survey consensus or an audited loot formula. OOPS's in-world causes and observer-safe disclosure remain authoritative; no arbitrary suppression system is proposed. |
| F24 | **General combat participants and dynamic rows are useful extension seams, but demonstrations have limits.** Recovered videos show two-sided combat and changing enemy lists. The developer explains a rewrite from player-versus-enemies to general sides, calls one console-triggered example special combat, and names omitted enemy computations plus large-count lag. | [September 14 video](https://discord.com/channels/622495527485046805/1458887440398942300/1549105887292035114), [rewrite explanation](https://discord.com/channels/622495527485046805/1458887440398942300/1549347617715134566), [ordinary/special-combat distinction](https://discord.com/channels/622495527485046805/1458887440398942300/1549403737510903819), [omitted work](https://discord.com/channels/622495527485046805/1458887440398942300/1549403500109234327). Six sampled frames per video support presentation analysis. Companion/summoner remarks are player speculation, not proof those systems shipped. No enemy-count cap or performance result is adopted. |

## Ranked design ideas for OOPS, proposals only

The useful transfer is a concrete example for the existing owners. These ideas
add no current implementation gate or new required subsystem.

| Rank/code | Idea and smallest useful application | Existing owner / scope boundary |
|---|---|---|
| 1 / P5 | **Make the interruption outcome part of the action description.** For an authorized long activity, say whether completed work remains, what is already spent, and what continuing requires. Use the actual mechanism rather than a generic reassurance. | F18; MR1/MR5/MR29 and the October 18 interruption reconciliation in [making rules](../../MAKING_RULES.md#application-reconciliation-2026-10-18). Account for now when this seam is next touched; no new scheduler. |
| 2 / P6 | **Give time and chance different jobs in the UI.** State in-game attempt interval, per-resource chance and yield separately. A real-time estimate can be secondary and clearly qualified by current speed/conditions. | F19; MR28, observer-safe MR31, and existing clock/forecast consumers. Account for a future relevant activity display; do not expose unknown resource odds or promise a random yield by a deadline. |
| 3 / P7 | **Let places remember visible consequences.** A cleared room's description or available use can change while nearby unresolved evidence stays visible. Start with the already-owned site state and its actual consumer. | F20; SR5/SR12/SR14 and [site/exploration rules](../../SITE_AND_EXPLORATION_RULES.md). Later if selected; no NPC society simulation or procedural layout expansion. |
| 4 / P8 | **Preserve planning context across crafting, storage and trade.** Owned output counts and relevant known input quantities help answer “do I need more?” without repeated panel switching. Keep one reliable item projection and a labelled detail path. | F21; UR26/UR42/UR52 and MR31. Already present in part at `src/display.js:805`; use as a regression/reference case for an authorized desktop journey, not a duplicate count system. |
| 5 / P9 | **Substitute by the properties the process consumes.** Keep material identity, provenance and price even where a process treats two inputs alike. Add a density, heat or purity distinction only where an actual recipe/resolver reads it. | F22; AD38, MR8/MR11, [crafting owner](../../CRAFTING_ENGINE.md) substitution profiles. Existing coal-type recipes are a baseline; later deeper making work follows world law rather than adding a global efficiency stat. |

F23 reinforces disclosure and actual in-world causes. F24 is a later architecture
reference, not a reason to expand the present playable slice. Existing P1–P4
below remain useful and are not replaced. No rulebook, accepted direction,
implementation priority, runtime code or save schema was changed by this review.

## Deeper media round, 2026-10-20

**Research completed, proposals only.** This round follows the
[bounded brief](DEEP_MEDIA_REVIEW_BRIEF_2026-10-20.md). AD32/AD35/AD36/AD37,
AD34, the research rules and the relevant UR/MR/SLR/CBR rules apply. It selects
no implementation, changes no accepted direction and adds no release gate.
The proposed UI comparisons target **1920×1080 desktop**. Mobile optimization,
NPC-heavy systems and procedural layouts retain their existing deferrals.

Detailed evidence is local and Git-ignored:
[round notes](private/discord-2026-10-20/deep-review-2026-10-20/REVIEW.md),
[inspection ledger](private/discord-2026-10-20/deep-review-2026-10-20/review-ledger.json),
[video timelines](private/discord-2026-10-20/deep-review-2026-10-20/video-manifest.json),
[focused transitions](private/discord-2026-10-20/deep-review-2026-10-20/transitions.json),
and [fork comparison](private/discord-2026-10-20/deep-review-2026-10-20/SOURCE_COMPARISON.md).
These preserve attachment/message bindings, source hashes, exact intervals,
context boundaries, interpretations and limits without publishing raw dialogue.

### Coverage and corrections

| Evidence | Actual added review and remaining limit |
|---|---|
| Stills | **27 existing image objects**, selected by review numbers 74, 80, 88–90, 155, 179, 399–405, 407–408, 416–419, 421–422, 425–426, 429, 506 and 572, inspected at readable stored dimensions. Larger images were read individually or in native-size strips; #400–403 were also reopened separately. Some are browser derivatives, not original-resolution certifications. One new player-authored sketch was retrieved and read, making **28 still-image inspections**. This is selected depth, not full-size review of all 663 objects. |
| Video | **Ten clips, 173.267 seconds of nominal indexed duration:** all integer-second samples from the start, a near-end sample and the actual final decoded frame of each, plus 35 quarter-second transition samples. **234 frame inspections** in total: 189 regular/near-end, ten final frames and 35 focused frames. The largest ordinary sampling gap is one second; focused ranges have 0.25-second gaps. Frames span each selected clip's timeline through its final source frame. This is ordered frame review, not continuous playback, every-frame inspection, audio review, latency measurement or a played OOPS journey. |
| Video selection | Crafting `1512870099802001508`; inventory `1367532073958637699`; tooltip `1447613479736447077`; calendar/weather `1387741119412043776`; ambient stars `1395087024742076456` and `1494761585892261888`; combat `1441349938872320030`, `1544701442781356052`, `1549105886847574129`, `1549358452445290597`. The Rickroll/development joke `1263531058205429842` and personal cat clip `1480827105032929362` were screened using prior overview frames and excluded from deeper design review. No new design proposal rests on the star clips. |
| Discussions | **Eight fresh windows, 30 rendered rows each**, around broad-attack wording, the active-learning sketch, component sorting, gear generation, same-gear revision, the crafting video and two combat examples. Their 240 captured rows contain **213 distinct IDs**, including 203 outside the old context windows and 194 outside the prior combined catalog. Relevant exchanges were read alongside seven reused saved windows. Capture radius describes available rendered neighbors, not guaranteed consecutive channel history. Exact bounds are in the ledger. This remains a topic-selected corpus. |
| Media acquisition | Reused all selected recovered files. Retrieved just one newly relevant player sketch, attachment `1487822640533213334`, through the existing credential-free, channel-scoped workbench transport: HTTP 200, 43,369 bytes, SHA256 recorded privately. No Discrub, duplicate downloader or workbench repository edit. The old 166/166 recovery result remains unchanged; this new sketch is outside that request. |
| Browser correction | The first attempt used a different Chrome connection and reached login. The normal **Your Chrome** profile was then checked and was already signed in. No new login was needed. This instance was a browser-selection error, not demonstrated Discord session expiry. Later context acquisition used the verified signed-in connection and current documented browser API. No cookies, tokens or account storage were inspected. |

**ACT NOW, completed accuracy corrections:** F9's earlier unresolved case now has
a later developer explanation and video; F25 records it without erasing the
earlier checkpoint. F12's reported `max-content` improvement was followed by
another same-day width/wrapping complaint, so it must not be read as closure of
all tooltip sizing problems (F33). A failed sketch screenshot contained loading
placeholders; it was not used as pixel evidence. The subsequently retrieved
original is the reviewed artifact. Baseline media, catalog and old review ledger
were left intact.

### New findings, with source and interpretation kept separate

| Code | Finding | Inspected evidence and boundary |
|---|---|---|
| F25 | **A batch can stop at a material boundary while a renewed command permits combining leftovers.** This is more specific than a mixing toggle. | The [June 6 crafting video](https://discord.com/channels/622495527485046805/1458887440398942300/1512870100036751627), attachment `1512870099802001508`, shows the charcoal row remaining in place as total wood changes 68 → 48 → 23 → 3; the final row is unavailable while its tooltip still reports 100% conditional success. Quarter-second frames at 2.50–6.25 s show the individual leftovers changing. The [developer explains the renewed-click behavior](https://discord.com/channels/622495527485046805/1458887440398942300/1512868288168984757), [clarifies the setting](https://discord.com/channels/622495527485046805/1458887440398942300/1512881570061619260), and says the [5-to-1 ratio is test data](https://discord.com/channels/622495527485046805/1458887440398942300/1512882510470844610). A later poll revisits the options; this is dated implemented/test behavior and discussion, not final-release certification. Deepens F9/P4, with a distinct command/consumption boundary. |
| F26 | **A plausible ingredient chain can still be difficult to navigate, and community advice can confuse similar products.** | In the saved [September 14 discussion](https://discord.com/channels/622495527485046805/1458887440398942300/1549103873455562783), a player cannot locate a fishing-rod input. One reply traces string through another crafting category, then [another distinguishes the simpler rod](https://discord.com/channels/622495527485046805/1458887440398942300/1549104498159386725). The player acknowledges skimming only familiar information. The June crafting clip, 0–3 s, visibly switches craft categories while inventory stays beside it; #506 shows quality-specific component lists. These establish a navigation/variant problem, not that the advice was universally correct or that an automatic production planner exists. |
| F27 | **Component-local numbers do not establish the assembled item's usefulness.** | Readable #400–403 matrices separate head power/speed from handle effects, followed by shoe revisions #404–405, armor/shield matrices and [same-gear before/after statistics](https://discord.com/channels/622495527485046805/1458887440398942300/1486323133748084896), #421–422. The [developer calls handles troublesome](https://discord.com/channels/622495527485046805/1458887440398942300/1482101951746281563) and [says further weakening may be needed](https://discord.com/channels/622495527485046805/1458887440398942300/1486323187561140276). Players [ask for uses beyond defense](https://discord.com/channels/622495527485046805/1458887440398942300/1486328014332493864). The sequence supports testing composition and meaningful uses; it proves neither a final balance curve nor a controlled combat result. Deepens F16 rather than discovering parts anew. |
| F28 | **An apparently random choice list can be a projection defect, even when inventory and persistence look correct.** | In the [June 21 component-list context](https://discord.com/channels/622495527485046805/1458887440398942300/1518228791812427960), a player says crafting order differs from inventory and survives reload/import. The [developer identifies a nonexistent quality property](https://discord.com/channels/622495527485046805/1458887440398942300/1518228485305532476) and [reports a patch](https://discord.com/channels/622495527485046805/1458887440398942300/1518229368554520758). Readable #506 shows the intended quality/count distinction. The report does not establish lost items or a save defect. The following scroll-depth question receives no design resolution in this window. |
| F29 | **A “learning now” list needs stable membership as well as a filter.** | Beside the broad-attack draft, [alois requests currently gaining skills without category headings](https://discord.com/channels/622495527485046805/1458887440398942300/1487820503887511552), then [asks for a delay to prevent flicker](https://discord.com/channels/622495527485046805/1458887440398942300/1487821608859996241). Their [inspected sketch](https://discord.com/channels/622495527485046805/1458887440398942300/1487822640554053867), attachment `1487822640533213334`, lists seven skill/progress rows. This is a player mockup; another player doubts adoption. No developer acceptance or shipped filter is shown. The proposed ten-second value is their example, not an OOPS timer decision. |
| F30 | **A setup good for winning can be poor for a chosen kind of practice. Explain the actual cause.** | A [June player reports killing too quickly to train poison resistance](https://discord.com/channels/622495527485046805/1458887440398942300/1512853834136027186). The March gear discussion includes [using a cold-resistance penalty for training](https://discord.com/channels/622495527485046805/1458887440398942300/1486346471023575142). In the saved December tooltip window, players dispute armor versus shield effects on skin training, including [the shoes example](https://discord.com/channels/622495527485046805/1212455523325050900/1447610840420188281). Readable #80 and #404–405 show gear changing several dimensions; #74/#88 are different penalty-curve drafts. Player explanations and balance justifications are not audited world laws. OOPS source independently confirms some relevant gain conditions below. No forced niche or deliberate-harm recommendation follows. |
| F31 | **Players need evidence that a pursuit remains promising, without necessarily seeing its reward.** | The [March 9 discussion](https://discord.com/channels/622495527485046805/1458887440398942300/1480427209746550826) distinguishes a vague reminder to repeat clears from knowing whether further repetition is useful; [another captured row gives the uncertainty explicitly](https://discord.com/channels/622495527485046805/1458887440398942300/1480427969343262861). A [June player had ignored fishing because they did not know it had milestones](https://discord.com/channels/622495527485046805/1458887440398942300/1512793514998501507). Readable #179 shows an extremely long next-level estimate, while its [caption/discussion](https://discord.com/channels/622495527485046805/1212455523325050900/1383544656918216786) considers changing activity. The image and the player's “33 hours” interpretation disagree; no arithmetic or ETA formula is endorsed. The shared issue is choosing a pursuit with intelligible evidence, not exposing hidden area quotas or certifying an area's exhaustion. |
| F32 | **Combat list growth, inspecting fighters and leaving the encounter are separate interaction problems.** | The [2025 clip](https://discord.com/channels/622495527485046805/1212455523325050900/1441349939069456465), attachment `1441349938872320030`, shows travel → combat, zero-HP rows fading before a new group; the developer subsequently reports an option to disable the change. The [September 2 clip](https://discord.com/channels/622495527485046805/1458887440398942300/1544701443137609780), attachment `1544701442781356052`, shows 2–7 s scrolling through a long fighter region with departure controls below it. Its discussion calls the work unfinished and raises **whose hit/dodge chance** to display, with a player's inspect/select suggestion. The September 14 console clip shows exit at 13.00–13.25 s and another simulation appearing at 14.50–14.75 s; this is not proof of ordinary fleeing or settlement. The 40.117-second September 15 clip does not establish full encounter completion. Deepens F24 through specific interaction coverage, without selecting companions or mass combat. |
| F33 | **Tooltip stability involves width, collision and pointer behavior, not just placement.** | In `1447613479736447077`, 1–4 s visibly compress the same description as it moves; 5 s expands it again. The [reported `max-content` improvement](https://discord.com/channels/622495527485046805/1212455523325050900/1447614710668067069) is followed by [another width/wrap complaint](https://discord.com/channels/622495527485046805/1212455523325050900/1447617656810111059). August discussion [describes ancestor boundaries](https://discord.com/channels/622495527485046805/1458887440398942300/1537944119773634592), while [Corc's pointer-events remark](https://discord.com/channels/622495527485046805/1458887440398942300/1537946126928453632) concerns their own flicker fix. The latter is not Miktaew's patch and would not suit an interactive pinned panel indiscriminately. This qualifies F12; UR43/UR47 already own the OOPS behavior, so no duplicate tooltip feature is proposed. |
| F34 | **Even explicit prose about a broad attack can leave players guessing its scaling.** | Readable #429 names divided XP and reduced loot. In the [expanded replies](https://discord.com/channels/622495527485046805/1458887440398942300/1487828437296218152), the developer rejects a player's linear simplification and [states a nonlinear expression](https://discord.com/channels/622495527485046805/1458887440398942300/1487828511522816192). The expression is source clarification, not proof of measured loot/time efficiency. This extends P3/P6 with a “per target versus per encounter” example, not a new proposal to suppress OOPS rewards. Any imported comparison must separate kill rate, per-target yield, total yield and the character's actual knowledge. |

### Additional design ideas and honest fork comparison

Rank here is research usefulness, not implementation selection. Each row is a
proposal; suggested effort is qualitative and excludes unrelated integration.
**ACCOUNT FOR NOW** means a constraint to carry into the next authorized change
at that seam. **LATER** means no work is selected. No agents were spawned.

| Rank/code | Mechanism, player value and concrete example | Existing OOPS support, boundary and suggested done check |
|---|---|---|
| 1 / P10 | **Make a batch's material boundary inspectable.** Before “all,” show the known material order and whether the command stops before another lot. Example: use ordinary wood first, stop before a prized log; a fresh explicit command may combine two insufficient leftovers if the process permits it. This adds control over what is consumed, beyond P8's owned counts and P9's functional equivalence. | F25; **ACCOUNT FOR NOW**, MR5/MR11/MR27/MR31, UR35/UR43. Already present in part: `src/crafting_recipes.js:317` sorts eligible material stacks by value, supports `stop_crafting_on_material_change` and can combine leftovers when needed. Do not build a second batch engine or claim every remainder is a physical lot. Later UI/projection work: Sol, medium, small-to-medium. Done: the preview and execution use the same owner selection, known reservations/identities remain respected, and the post-boundary command cannot silently spend protected stock. |
| 2 / P11 | **Follow a known missing input to a producer and return to the original task.** Example: a known tool needs string; inspect its known string recipe, then return with the original tool variant, parts and scroll position intact. Distinguish “the basic rod uses this” from an advanced variant's chain. | F26; **LATER**, UR22/UR23/UR28/UR42, MR10/MR31, appraisal AA12. `src/display.js:3297` already follows related item recipes and restores one return, but `item_recipe_related_uses` at :3331 is explicitly same-page, named-known-input based and excludes “any type” links. Extend that route only for demonstrated cross-category journeys. Sol, medium, medium. Done: one known two-category dependency can be followed and returned without a craft, time advance or unknown recipe/name/count leak. Not an omniscient supply planner. |
| 3 / P12 | **Offer a stable view of recent learning alongside the full skill reference.** Example: after entering a cold cave, see which already-known skills actually gained XP, with short-term membership persistence and an explicit “recently gained” label. A skill does not vanish between two intermittent gain events. | F29; **LATER**, SLR4/SLR24/SLR25, UR27/UR35/UR42, AD16. The inspected source has category/name/level/progress displays, current-activity XP information and lifetime top-skill statistics; those are not a demonstrated recent-gain view. Reuse the actual XP owner and observer-safe discovery adapter, not inferred increases from modifiers. Sol, medium, medium. Done: two intermittent known skills remain readable through their gap, a hidden skill never appears early, and opening/filtering the view changes neither XP nor simulation time. Presentation dwell time does not become a world clock or alter training. |
| 4 / P13 | **Explain why the chosen practice is or is not happening.** Example: “Your coat keeps you above the cold-training threshold,” if that is the actual known rule; a separate practice view can show gains observed under the current setup. A high-power build stays good at winning even when it prevents exposure-based learning. | F30; **LATER**, SLR4–SLR7/SLR25, BHR and CBR's mechanism boundaries, AD28/AD38. Existing `src/models/combat.js:631` gates skin XP by armor and derives Fortitude XP from damage; `src/main.js:8807` checks temperature plus tolerance before cold XP. This is an explanation/observation extension, not a new universal training law or assurance of safety. Source-specific oddities stay labelled. Sol, medium, medium. Done: change one relevant item and show the correct known reason and actual gain consequence; no hidden threshold leak, auto-unequip, coerced self-injury or arbitrary enemy rescaling. |
| 5 / P14 | **Compare an assembly by its resulting useful dimensions.** Example: change one known handle while keeping head, quality and character fixed; compare resulting attack, speed and relevant handling costs, with provenance. Show a superior option plainly when it is superior. | F27/F34; **LATER**, MR8/MR21/MR29/MR32, AD28/AD38, UR35. Component stats, quality/rarity and result computation already exist in `src/items.js`, `src/crafting_component_filling.js` and the [gear-dimensions owner](../../EQUIPMENT_STAT_DIMENSIONS_CONSIDERATIONS_2026-10-20.md); the [gear-depth palette](../../GEAR_DEPTH_BLACKSMITHING_CHEMISTRY_ENERGY_POWERS_CONSIDERATIONS_2026-10-20.md) already proposes parts/traits. New value would be a controlled choice comparison, not another part system. Sol, medium, medium. Done: one part change produces the same known values in preview and the actual result, explains relevant source modifiers, and rolls no new affix merely by inspection. Avoid a single “best gear” score or forced balancing tax. |
| 6 / P15 | **Separate a credible lead from its hidden payoff.** Example: an already-earned observation says that tracks continue deeper; a known skill may say it has a next milestone while its effect remains undiscovered. If the character lacks evidence, say the state is unassessed rather than inventing “nothing left.” | F31; **ACCOUNT FOR NOW**, AD3/AD8/AD24, SLR24/SLR25, SR5/SR6/SR9/SR12, MR31. `src/display.js:5496` already shows the next native milestone level with an unknown effect; `src/skill_discovery.js` already supports separately identified public hints and blocked/available states. Preserve those and look for a particular journey that fails to expose its known lead. Sol, medium, small for one disclosed lead. Done: a player can find the lead through play without a wiki, while unknown outcomes, hidden totals and area-exhaustion truth remain undisclosed. No fixed clear quota or global main quest. |
| 7 / P16 | **Keep encounter controls stable while the fighter list changes.** Example: inspecting a known opponent or scrolling a large list leaves departure controls reachable and identifies both subjects of a displayed hit chance. If the selected fighter leaves, explicitly retain an event record or mark the selection ended rather than silently selecting a replacement. | F32/F33; **ACCOUNT FOR NOW**, UR25/UR27/UR35/UR36/UR40/UR43/UR47, CBR25, AD19. OOPS already has combat count/departure projections and the UI rules require stable selection and free inspection; source review does not certify their populated behavior. Use these clips as scenarios for the next authorized combat UI check. Sol, medium, medium. Done: a rebuilt 1920×1080 populated encounter exercises row removal, scrolling, selection and departure; inspection does not leave combat or change its target. Ordinary withdrawal semantics come from its owner, never the special-combat “Exit” clip. No companion/mass-combat expansion. |
| 8 / P17 | **Keep quality-specific choices comparable across inventory and crafting.** Example: the same glove variants remain ordered by the intended tier/name/quality fields and retain the selected exact key after another variant is crafted or depleted. Prefer a filter or expanded selector to stacking scroll regions indefinitely. | F28; **ACCOUNT FOR NOW**, UR23/UR25/UR27, MR31, AR4. `src/display.js:3950` already sorts component candidates and carries exact keys, quality and counts. The historical wrong-property bug is not claimed to remain unfixed. When the selector is next touched, check its ordering and identity against inventory before adding variety. Luna, low for a bounded source/fixture check; implementation only if selected. Done: deliberately interleaved variants yield the intended order in both surfaces, selection does not jump, and a depleted key is explicitly unavailable. No save migration inferred from display order. |

These eight additions do not relabel the earlier five: P10 concerns consumption
authorization at a stack boundary, P11 follows producers, P12 stabilizes a
temporal projection, P13 explains practice causes, P14 compares composed results,
P15 exposes known reasons to continue, P16 preserves control/subject continuity,
and P17 preserves ordering and exact selection. F33 and F34 deepen earlier
tooltip/notation findings without being counted again as new feature ideas.

### Completion checks and remaining gaps

The round checks attachment/message/time bindings, new-code uniqueness against
F1–F24/P1–P9, unchanged predecessor inputs, local Markdown links, required
private ignores, report-prefix preservation and source identities used for the
fork comparison. Detailed results are in the private verification receipt.
No blanket game suite was run: this change edits research documentation only.

Remaining limits: one-second samples can miss subsecond events outside the named
quarter-second windows; audio tracks and continuous playback were not reviewed;
the two excluded videos and most images retain overview-only coverage; no
complete channel/reply history, upstream build/branch reconciliation, measured
combat performance, ordinary save/import or current-release play was performed.
The old five uncollected context attachment IDs remain outside this pass; the
new sketch is a separate, newly selected ID. Contributor/player suggestions,
poll results, developer test claims and source inspection remain distinct from
shipped behavior and human acceptance. The signed-in route now works; there is
no remaining login blocker for these completed windows.

## What remains and further considerations, 2026-10-20

Weibao: “Whats left or should be considered?” This is a follow-up assessment,
not selection of implementation or another collection run. The completed review
above retains its exact coverage. Current PROJECT/USER_VISION and AD40 also
route small UI details to the existing
[bar, detail and message palette](../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md#small-contextual-bars-and-everyday-interface-details-2026-10-20).
That accepted attention to design does not accept every P10–P17 treatment.

| Code | Remaining work or additional angle | Disposition, scope and done check |
|---|---|---|
| DC1 | **Check one connected OOPS journey before judging transfer value.** A known craft is short of an input; follow its known producer, return to the same variant/selection, inspect consumption, craft, and read the result. Include the last available stack and one changed input. This joins P10/P11/P17 and tests whether reduced navigation actually helps. | **LATER, recommended next application**, not a new delivery gate. Existing UR22/UR23/UR35, MR31 and transaction owners apply. Sol medium; medium bounded assessment. Done: a fresh rebuilt 1920×1080 ordinary journey records actual navigation, clock behavior, stock and receipt. Follow the existing persistence gates if implementation changes persistent state. Existing source support is not repeated as a new feature; a prototype or technical pass does not close human acceptance. |
| DC2 | **Use remaining research effort on named gaps.** Candidates are the earlier crafting-layout alternatives (#68–69, message `1241712675361132574`), the empty-tab lead (#225, `1412450693037424660`), and the Firefox scrollbar/zoom lead (#598, `1543964273548591256`). These are triage leads from saved captions, not newly verified findings. Expand their own discussions and inspect readable media before drawing conclusions. | **LATER, optional research**, Sol low/medium; small per named question. Done: each selected question yields a source-qualified interaction lesson or an explicit exclusion. Full-size review of every byte variant, continuous playback and audio are still uncovered, but are not required merely to make the corpus exhaustive. Audio becomes useful work if an actual cue/narration claim depends on it. The two excluded joke/personal clips remain excluded from design review. |
| DC3 | **Shared stock creates opportunity costs between goals.** The [September 2 exchange](https://discord.com/channels/622495527485046805/1458887440398942300/1544701443137609780), saved in the combat-scroll context, disputes a long collection goal partly because the same materials could make equipment. This adds a different question from P8's owned counts or P10's stack boundary: “What other known plan uses what I am about to spend?” An optional view could show a craft competing with one explicitly tracked known goal. | **LATER, new proposal angle**, MR27/MR31, ECR8, UR42. Reuse stock and any actual reservation owner; tracking a goal does not automatically reserve its inputs, and an untracked/unknown requirement creates no warning or count. Sol medium; medium. Done: consuming one shared material updates both projections from the same stock, shows the known consequence, and neither invents a second ledger nor locks stock without the player's chosen policy. Avoid listing every possible use. |
| DC4 | **Keep readiness, outcome chance, capacity and recent activity distinct.** F25's disabled recipe can still show 100% conditional success; F29's sketch shows level progress, while its requested filter concerns recent XP events. Neither fact alone answers whether an action can run now or whether learning is occurring. Changing tools, stock, place or conditions can also make an earlier preview stale. | **ACCOUNT FOR NOW**, UR7/UR35/UR40, MR31, SLR4/SLR25 and the existing AD40 palette. Use separate labels and revalidate through the actual command owner before spending; this does not propose a global preview or meter rewrite. Done when a touched surface explains a known blocked reason and does not portray a full bar or old gain as present eligibility. Source/clock choices belong to the existing owner. |
| DC5 | **Reconcile version and scale before copying a mechanism.** The corpus mixes 2024–2026 drafts, developer tests, player requests and patched defects. The mass-fighter clips omit work and do not certify ordinary completion. An upstream control's usefulness can survive even when its implementation or artificial balance cost does not fit OOPS. | **ACCOUNT FOR NOW**, AD32/AD36/AD38, UR49. At a selected port, establish the relevant version/current consumer, distinguish known facts from generated examples, and exercise populated selection/scroll/exit behavior. Sol medium; small-to-medium per selected seam. Done: the feature is explicitly labelled existing, changed, proposed or unverified, with the one relevant playable gap named. This is not a requirement to reconcile every upstream branch before using a visual idea. |

**ACT NOW, completed:** saved this assessment, checked it against the current
owners, retained the new angles as proposals/constraints, and qualified the
private video timing table: indexed nominal durations and decoded timestamps
differ by a few frames in some files. That metadata is not a precision timing
benchmark. No new media collection, runtime edit or gameplay check was run in
this follow-up. Existing detailed-round verification remains evidence for its
recorded report revision; the follow-up has its own scoped receipt.

### Later implementation authorization, 2026-10-20

Weibao subsequently requested a new chat to finish the complete connected system,
not just the crafting journey, with Luna first and Sol for important work.
The [IS1–IS5 execution brief](../../gm/dispatch/upstream-interaction-system-2026-10-20/BRIEF.md)
and [direction owner](../../USER_VISION.md#upstream-derived-interaction-system-execution-2026-10-20)
record that later instruction, interpretation and current ownership dependency.
The successor performs implementation; this report's research, proposals and
historical no-implementation statements remain evidence of their original pass.
DC1 is one verification scenario within the larger selected outcome, not its
completion boundary. The applicable UI/engine folds are part of that brief.

## Initial collection snapshot, retained history

The following coverage and route notes describe the checkpoint **before** the
166-ID recovery. `catalog-final/`, `coverage.json` and
`missing-attachments.json` are immutable baseline evidence. For current status,
use `catalog-reviewed/` and `recovery-166/` linked above. Initial “missing” and
“unreviewed” counts below are historical, not remaining tasks.

### Initial saved evidence and coverage

Private package: [discord-2026-10-20](private/discord-2026-10-20/).
[Searchable gallery/index](private/discord-2026-10-20/catalog-final/index.html),
[catalog](private/discord-2026-10-20/catalog-final/catalog.json),
[coverage](private/discord-2026-10-20/coverage.json),
[missing attachments](private/discord-2026-10-20/missing-attachments.json).
The private package contains about 1.95 GB, mostly repeated raw browser snapshots.
Raw captions, dialogue, profile evidence, snapshots and media remain Git-ignored
under the existing `/docs/research/*/private/` rule.

| Evidence | Checked result |
|---|---|
| Current author/file search | `in:yet-another-idle-rpg from:miktaew has:file`: 311 distinct IDs, 13 pages, terminal Next disabled. 304 rows are in the current channel, six in YAFEIRPG, one in Development/contributions. Snowflake dates: January 8 to October 20, 2026. |
| Historical author/file search | `in:1212455523325050900 from:miktaew has:file`: 312 distinct IDs, 13 pages, terminal Next disabled. Dates: February 29, 2024 to January 8, 2026. A separate initial-context capture reaches February 28, 2024. |
| Page reconciliation | Each query has 25 IDs per page for pages 1–12, then 11 current / 12 historical. The queries are disjoint. A page initially captured while loading was revisited and recovered. Oldest/newest IDs and all page ID lists are in coverage. |
| Context | 18 selected windows, 535 distinct rendered message rows, including 29 posts overlapping the attachment corpus. Union: 1,129 unique message IDs. Anchor neighborhoods were reviewed; this is not a full semantic read of every surrounding row. |
| Locators and attribution | 535 records have context-DOM locators; 594 retain expected search locators not individually opened. Grouped context rows can lack an account ID, so the index leaves 160 account IDs unresolved rather than inventing attribution. All 623 developer search rows have the verified developer ID. |
| Listed attachments | 648 IDs referenced by search results, plus 29 context-only IDs: 677 total. 505 search IDs and six context-only IDs have saved bytes. **143 search IDs plus 23 context-only IDs have no saved bytes**, listed individually in the missing manifest. |
| Actual saved bytes | 512 saved asset records represent 511 attachment IDs and 509 distinct byte objects: 508 WebP images and one original MP4. Identical bytes under different records are deduplicated. Representation/source records remain separate. The images are browser derivatives, not asserted original PNG/GIF bytes. |
| Original video | Tooltip demonstration, attachment `1447613479736447077`, 946,246 bytes, H.264, 640×240, 6.5 seconds, 60 fps, 390 frames. Downloaded through the supported browser media action; full stream decoded successfully and one frame at five seconds was inspected. |
| Other media/source gaps | Two GIF-named attachments have no saved animation bytes. Other videos and some lazy-loaded/spoiler media remain missing or have only a still representation. Forty search records report an unavailable reply preview; 73 retain spoiler labels in their saved text. These counts do not imply every corresponding media resource is absent. |
| Source files | No original code attachment was acquired. Code screenshots are images, not executable source. A developer-shared `.txt` game-save attachment/preview is indexed as a save example, not source code; it was not decoded, imported or executed. Player saves on this machine were untouched. |

`capture/` holds raw rows, browser snapshots, media and the successful video
download. `normalized/` retains corrected rows, selected evidence annotations and
copied media inputs for the workbench. `catalog-final/` holds byte objects,
observations, topic/evidence tags and the searchable local gallery. `seed/` and
`workbench/` retain the initial inherited-note checkpoint. `file-manifest.json`,
`verification-final.json` and `media-verification.json` record integrity and checks.

## Context-backed mechanisms, iterations and feedback

Developer statements are dated reports or intentions. Screenshots and the video
show their captured presentation; they do not prove a current release or played
behavior. Community questions and suggestions remain attributed. These findings
add to F1–F4 above; they do not select OOPS implementation work.

| Code | Finding and rationale | Exact evidence and limit |
|---|---|---|
| F5 | Composable rewards can produce nested chance gates. Asked about random treasure and unique rewards, Miktaew describes random bonuses for clears/failures while preferring unique rewards to remain guaranteed. | [September 20, 2026 anchor](https://discord.com/channels/622495527485046805/1458887440398942300/1551320018879512690), [intended uses](https://discord.com/channels/622495527485046805/1458887440398942300/1551328721057878047), [unique reward preference](https://discord.com/channels/622495527485046805/1458887440398942300/1551328782902632539). No probability formula or current loot table was independently verified. Nearby exaggerated headpat penalties are joking discussion, not an adopted mechanic. |
| F6 | Reward summaries reduce repeated log text, but replacing the old summary with a new message can change ordering. Miktaew acknowledges the movement and considers it acceptable in that draft; a player notes the update frequency. | [October 17](https://discord.com/channels/622495527485046805/1458887440398942300/1561106186357579816). The sampled image combines clear XP and loot into one summary. The tradeoff is explicit; no independent responsiveness or usability test was run. |
| F7 | Gear comparison exposes deltas and multiplicative changes. Miktaew reports accepting a comparison commit and changing multiplier presentation to explicit multiplication rather than percentages; a reply welcomes the comparison for showing upgrades. | [August 29](https://discord.com/channels/622495527485046805/1458887440398942300/1543370765745918043), [player reaction](https://discord.com/channels/622495527485046805/1458887440398942300/1543378715050901656). Screenshot sampled. The commit, shipped build and stat computation were not independently inspected in this pass. |
| F8 | Conditional trader stock is demonstrated with an intentionally excessive test inventory after a hideout clear. The surrounding technical problem is supplying condition evaluation with state without initialization/import failures. | [August 26 test](https://discord.com/channels/622495527485046805/1458887440398942300/1542183645517717565), [import problem](https://discord.com/channels/622495527485046805/1458887440398942300/1542179224859844649). The 1000-spears image is a test, not a committed economic quantity. Another developer's state-passing approach remains their advice. |
| F9 | Mixing material kinds and requiring one kind produce different crafting availability. The sampled screenshot shows enough total raw wood but insufficient counts for either individual type; Miktaew reports a toggle working while leaving a display/handling case unsettled. | [June 6](https://discord.com/channels/622495527485046805/1458887440398942300/1512844058182287541). This is a specific recipe/material UI case, not evidence of a general chemistry system or a settled final design. |
| F10 | A dated repair report connects an older save's inventory with item knowledge. Nearby feedback leads to an ID-versus-display-name explanation for obscuring failures, followed by continued player reports. | [May 29 repair statement](https://discord.com/channels/622495527485046805/1458887440398942300/1509954839659151372), [ID/name cause](https://discord.com/channels/622495527485046805/1458887440398942300/1509957158077333676). Developer confidence and player observations coexist. No user save was imported and no migration guarantee is inferred. |
| F11 | Rarity/color text receives a black or white outline selected for contrast. A player then requests similar treatment for resource bars with bright backgrounds. | [January 20](https://discord.com/channels/622495527485046805/1458887440398942300/1463100037361045575), [bar readability feedback](https://discord.com/channels/622495527485046805/1458887440398942300/1463110542968487978). The outline image was sampled. The follow-up request is not proof that all bars were changed. |
| F12 | Tooltip work has a recoverable chronology: December 2025 content sizing/movement problems; a same-day report that `max-content` resolves the earlier sizing issue; April 2026 positioning drafts with remaining scroll issues; August 2026 arrays and a shared handler with ancestor boundaries and placement parameters. | [December video/context](https://discord.com/channels/622495527485046805/1212455523325050900/1447613479619002410), [reported sizing fix](https://discord.com/channels/622495527485046805/1212455523325050900/1447614710668067069), [April draft](https://discord.com/channels/622495527485046805/1458887440398942300/1490068709459496970), [August refactor](https://discord.com/channels/622495527485046805/1458887440398942300/1537943688288927814), [ancestor explanation](https://discord.com/channels/622495527485046805/1458887440398942300/1537944119773634592). These are dated statements and media, not a complete commit history. A tentative caption does not prove a draft was abandoned. |
| F13 | Separate day/night, weather and season signals create a density/meaning problem. Replies propose combining icons, using text or a gradient, while explicitly raising the need for a non-color explanation. | [June 14, 2025](https://discord.com/channels/622495527485046805/1212455523325050900/1383389471583502467), [ambiguity/accessibility discussion](https://discord.com/channels/622495527485046805/1212455523325050900/1383410784637554738). Suggestions are alternatives under discussion. No final layout or weather mechanism is established. |
| F14 | A visible control can precede its behavior. Miktaew explicitly calls one January mockup present in the UI but missing click logic; a later nearby post says it is clickable. | [January 29 mockup](https://discord.com/channels/622495527485046805/1458887440398942300/1466471197981151449), [later clickability report](https://discord.com/channels/622495527485046805/1458887440398942300/1466477737970503947). This establishes staged development, not a played end-to-end favorite workflow. |
| F15 | Inventory stacking and omitting redundant saved data are presented as before/after changes to the same save; a following screenshot also removes trader-inventory data. | [August 31, 2024](https://discord.com/channels/622495527485046805/1212455523325050900/1279470439927779468), [trader follow-up](https://discord.com/channels/622495527485046805/1212455523325050900/1279471403631906876). No compression ratio, restored-state equality or compatibility result is claimed. |
| F16 | Equipment component generation and character creation have explicit experimental/redesign records. Surrounding players ask about component uses and react to creation choices. | [March 9, 2026 experiment](https://discord.com/channels/622495527485046805/1458887440398942300/1480477735674712115), [July 5 creation redesign](https://discord.com/channels/622495527485046805/1458887440398942300/1523420048608329799). The generation screenshot was sampled; the creation image retains spoiler/review limits. Neither caption fixes a final formula, race roster or OOPS entry flow. |
| F17 | Asked for a map-based travel selector, Miktaew distinguishes a nice hardcoded experimental map from the desired ability to generate one dynamically. Replies separately propose text/autocomplete travel. | [August 14](https://discord.com/channels/622495527485046805/1458887440398942300/1537705244031590421). This records a requirement and prototype limitation, not a shipped dynamic map. It does not override OOPS's current procedural-layout deferral. |

No abandoned branch was conclusively identified from these selected contexts.
Alternate drafts, unresolved cases, explicit tests and later implementation
reports are indexed separately. Absence from a later screenshot does not prove
rejection; a dated developer statement does not certify current release status.

## Reusable design implications, proposals only

| Code | Disposition | Consequence and evidence still needed |
|---|---|---|
| P1 | Account for now | Preserve exact item identity beneath display names, disclosure and save state. F10 is a concrete failure mode to check when an authorized knowledge/UI change touches those seams; it does not select a new migration task. |
| P2 | Account for now | Keep an event history distinct from compact ongoing summaries, and check whether changes move entries or conceal important updates. F6 supplies a specific comparison case for an authorized desktop logging slice. |
| P3 | Account for now | Treat scalar, multiplier and comparison notation as distinct communication choices. F7/F11 suggest concrete readability checks with real values and bright backgrounds, using the existing UI owners rather than importing a whole skin. |
| P4 | Later, if selected | Recipe input-mixing, composable rewards and conditional stock can be tested through existing making/condition owners. Preserve the actual combination, cost, disclosure and stop behavior. Reference screenshots are evidence prompts, not a mandate for new abstractions or test economy values. |

These are research implications under AD32. They do not add a required gate to
current delivery or override accepted direction in PROJECT.md and USER_VISION.md.

## Initial tools, checks and boundaries

The separate **Build Discord reference workbench** chat owns
`/Users/weiwei/code/discord-reference-workbench`. Its
[comparison](/Users/weiwei/code/discord-reference-workbench/docs/EXISTING_TOOLS.md)
was read and its offline `extract-mhtml`, `catalog`, `gallery`, `verify` and
`search` capabilities were reused. This task did not edit that repository or send
messages to its chat. No overlapping exporter was observed at the read-only
status snapshot; this task used one browser collection stream.

Collection used visible author/file search, UI pagination/scrolling, read-only DOM
extraction, selected message routes and browser MHTML snapshots of loaded
resources. The workbench decoded allowlisted attachment MIME parts and retained
source URLs and hashes. The successful original video used the supported browser
media-download action. A subsequent image-download action timed out and was
stopped; cached image representations remain the fallback. No token/cookie
extraction, credential storage, account switching, message mutation or limit
evasion occurred. No 429 was observed in this pass. The [earlier 429 history](../proto23/DISCORD_RESEARCH_2026-10-15.md#load-all-failure-http-429-october-15)
remains relevant to future collection. Future attempts must follow actual
retry/reset signals, preserve progress and stop repeated access failures.

Checks passed: JSON and page/ID reconciliation; developer attribution parsing;
509 workbench byte-object hash checks with zero integrity/import errors; complete
image decoding for 508 WebP objects; full video-stream decoding; local gallery
reference checks; known-message/topic lookup; original input-source hash checks;
and Git ignore verification. Commands, tool input hashes and results are private.
The gallery is generated and its local links are checked, but browser rendering
was not tested. The earlier browser rejection of `file:` previews was not routed
around through localhost or another browser surface.

At this initial checkpoint, source gaps were the 166 listed attachment IDs without bytes, original
identity for derivatives, missing replies, unreviewed media and uncollected
non-attachment developer history/full thread context. The recovery above subsequently closed the 166-ID gap and expanded review.
Original identity for older browser derivatives, unavailable reply previews,
uncollected non-attachment history, full-size review of every image, continuous
video/audio review, five newly encountered context attachment IDs and current
playable/release verification remain outside the completed finite pass.
