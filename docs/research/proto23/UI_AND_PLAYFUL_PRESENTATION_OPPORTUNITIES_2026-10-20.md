# UI and playful presentation opportunities for OOPS

2026-10-20. Independent review of saved Corc/Proto23 media against current
OOPS design and source. **Research complete; incorporation candidates remain
proposals.** No runtime, bundle, save, accepted default or shared owner changed.

The most useful transfer is a clearer relationship between **the thing being
looked at, the values being compared and the event that just happened**. OOPS
already supports much of the surrounding interaction. Small refinements can
make that support easier to read without replacing its shell.

## Scope, authority and evidence

Target: **1920×1080**, with actual 14px and 21px text; later selected UI work
also checks the MacBook viewport, about 1800×1040, and 1536×864 under the current
[UI rules](../../UI_RULES.md). The 1366×768 floor is retired. Mobile optimization
is deferred. Intended visible outcome: keep subject identity, useful comparison
and the next explicit action readable during inspection, work and return.

Authority: [standing desktop direction](../../USER_VISION.md#standing-ui-priority-2026-10-13),
[R14 iteration direction](../../USER_VISION.md#ui-iterates-on-r14-as-the-working-baseline-2026-10-16),
[PROJECT](../../../PROJECT.md), [rules index](../../RULES_INDEX.md), and
[player UI instructions](../../../.claude/rules/player-ui.md). Applies AD6–AD8,
AD17, AD32–AD36, AD38; UR34–UR58, especially UR35/38/43/45/48/49/52/56/58.
Making examples retain MR1/MR5/MR28/MR29/MR31; spatial examples retain
SR5/SR9/SR21 and the existing body/recovery direction. This changes no rulebook.

The more-to-consider pass extends, rather than restates, the existing
[CRL1–CRL26 synthesis](DESIGN_LESSONS_FOR_OOPS_2026-10-20.md). Its broad lessons
about nearby dependencies, local reactions, typography, quiet change cues and
small spatial scenes remain the starting point. This report adds concrete
comparison semantics, label protection, transfer orientation and transition
failure scenarios.

| Evidence layer | Reviewed here | What it establishes |
|---|---|---|
| Saved Corc media | 12 directly viewed saved images, including one excluded Morrowind reference; two existing still contact sheets | Particular captured visual arrangements. Most files are browser derivatives; dimensions are capture dimensions, not original CSS geometry. |
| Animation samples | Three existing sheets, 12 sampled frames each: logging, fall/landing and grip/debris | Visible differences and ordering across selected frames. No full playback, physics formula, measured input window or performance result. |
| Surrounding discussion | Complete normalized text of three selected windows: oxygen, alternate tooltip, long names/skill numbers | Dated statements and individual responses, with attribution. Other context-backed observations reuse their existing owners. |
| OOPS visual evidence | Three existing 1920×1080 seeded native candidate captures: nearby at 14px, service at 21px, combat at 14px | Dated composition and reading comparisons, tied to the original candidate receipt. These are not fresh browser evidence for today's dirty source. |
| OOPS source | Focused current shell, inventory, storage, tools, effects, combat log, reference, badge and recent UI-extras reads | Present producers/consumers and declared behavior. Source support does not certify current visual fit or native delivery. |

Private [analysis package](private/discord-media-2026-10-20/analysis-ui-independent-2026-10-20/)
contains image/context coverage, hashes, claim bindings and verification.
The [collection owner](CORC_MEDIA_AND_DESIGN_2026-10-20.md) retains the full
inventory and gaps: complete traversal of the displayed author/attachment
query is not full channel/thread coverage; 26 listed attachment IDs lack bytes.
Most additional representations and animation frames remain unreviewed.

Earlier exact source reads are reused from
[UI source absorption](UI_SOURCE_ABSORPTION_2026-10-13.md) and
[source mechanisms](SOURCE_MECHANISMS_AND_ADOPTION_2026-10-13.md), including
`addDesc`/`#dscr`, adjacent recipe information and separate semantic color roles.
No downloaded HTML was executed. No gallery/browser route, new collection,
exporter, workbench build or native computer control was used.

## Findings and comparison

### F1. Align the question being answered, not every cell

The [historical shell image](https://discord.com/channels/622495527485046805/811370601129705483/944926091745833050)
has aligned player/opponent frames above a differently divided inventory,
activity and log region. Its caption explicitly calls it old UI. A
[September 2026 player-card image](https://discord.com/channels/622495527485046805/811370601129705483/1550108742081716224)
groups vitals, four attributes, paired equipment slots and combat chances into
distinct horizontal bands. These are different dated states, not a documented
replacement sequence or a current final layout.

**Visual reasoning:** paired headings and label/value gutters let the eye find
the same kind of answer twice. They do not require identical information or
equal numbers of rows. In the reviewed OOPS combat capture, the opponent card
already includes contextual comparisons such as the player's attack below the
opponent's attack. That is a more relevant comparison than copying Proto23's
four-stat strip into OOPS's twelve-stat character model.

**Disposition: already supported and deliberate OOPS difference.** The current
shell, composition/layout owners and [panel kit](../../PANEL_KIT.md) already
provide distinct regions, inspection and resizing. Preserve top navigation,
Condition, full-height Reports and contextual Focus under UR49. Treat different
upper/lower column boundaries as a composition decision, not an offset patch.

For a future visual comparison, count useful complete rows and follow the
reading path: identity → current condition → relevant comparison → action.
An empty-looking lower area in one seeded screenshot is not proof that its
space is wasted during another task. Automatically lending it away while a
player reads would trade apparent occupancy for an unstable workspace.

### F2. A resource label needs a quiet backing even when its bar is lively

The [oxygen image and exchange](https://discord.com/channels/622495527485046805/811370601129705483/1515288902909427744)
show a thin oxygen stripe crossing the HP lettering. One reader identifies both
the inconsistent backing and the border through the words. Corc says the work
is in progress and posts a lighter-border revision; the reader cannot readily
see the difference. This does not establish a final fix.

The [unused blue tooltip variant](https://discord.com/channels/622495527485046805/811370601129705483/1556108309105344552)
also offers a useful independent comparison: its luminous frame matches the
surroundings, while location lettering remains visible around/through its
description area. **Inference:** frame matching and reading isolation are
separate design variables. This is not a general rejection of blue tooltips.
Creation age, replacement order and final shipped style remain unresolved.

**Useful refinement:** compare a quiet backing under the label/value with an
expressive fill or edge outside it. Protect the text from crossing separators,
trailing-loss segments, sparks and busy scene detail. Keep the bar's true end
position visible. The default is a clear label; backing strength, edge glow and
reaction intensity are dials whose cost is masking some visual texture.

OOPS already centers exact native resource text and supplies semantic palette
tokens. Its settled-effects module already supports local anchors and reduced
motion. There is no reproduced current OOPS overlap defect here. The new
question is whether the same native value stays readable at low/full fill,
selected/focused state and actual 21px text while a chosen local reaction runs.

### F3. Stable inspection still needs an explicit comparison subject

The [stick description](https://discord.com/channels/622495527485046805/811370601129705483/1022142891541409854)
shows a stat followed by a differently colored parenthesized number. The image
alone does not identify that number's baseline. Older descriptions in the
contact sheets also show current condition and modified values close together.
The gain is compactness; the cost is asking the player to remember what the
second number means.

Current OOPS has a stronger starting point:

| Current seam | Verified source behavior | Implication |
|---|---|---|
| `proto23_shell.js`, `rowForSelection` / `choose` | Inventory inspection follows an inventory key; equipment inspection follows a slot. Equip deliberately switches selection to the destination slot. | A stable panel can legitimately change its contents. “Pinned” must not imply a frozen item snapshot if the selected subject is the slot. |
| Same file, detail render | Shows Held/Equipped context, native descriptions, separate actions and missing-item/empty-slot explanations. Hover is suppressed when the stable inspector is visible. | This is already supported. A second inspector or replacement hover policy would duplicate it. |
| Same file, `showContext` | A log description can be copied from data recorded with the event and labelled accordingly. | Historical description and the subject now already have distinct evidence paths. Preserve them. |

**Useful refinement:** when comparing gear, label the baseline, for example
“Compared with your equipped [known item]”, and distinguish the effective value
from the change. On a slot update, keep the frame/focus stable and let the title
state the new known occupant. If a comparison baseline disappears, explain that
before presenting another delta. Use the actual native stat projection rather
than computing another damage formula in the UI.

Default to live inspection of its declared subject. A frozen comparison is a
separate optional dial, with a visible recorded/current distinction and the
cost of retaining a snapshot. Exact opponent values still require means. This
report neither selects a new pin mode nor reports the current mode as broken.

### F4. Dense transfer lists work through orientation and identity

The [paired storage image](https://discord.com/channels/622495527485046805/811370601129705483/910171113546477598)
puts names and quantities in two adjacent stocks. Another
[storage revision](https://discord.com/channels/622495527485046805/811370601129705483/908120873872007201)
shows many same-named daggers as distinct rows. Their matching text is not
evidence that those objects can be merged. The compact footer symbols in the
first image do not explain their commands by themselves.

**New reasoning beyond general density:** moving an item is a question about
two holders. A two-column view saves memory only if the reader knows which
side is carried, which side is stored, and where the selected identity went.
Matching row heights alone do not solve this. Both lists may have valid
different sort/filter orders. A linked selection or a small selected-item
comparison can be more stable than forcibly synchronizing their order.

OOPS already owns `storage_inventory_div`, native stock updates, shared item
descriptions and `stageNativeStorageTransfer`. That transaction checks sequence,
direction, item key and expected quantity; it preserves owned spare copies and
rejects equipped-only transfers. The shared tooltip already exposes carried
counts for eligible items. **Already supported:** inventory/storage and guarded
transfers. **Unverified visual opportunity:** add a named selected-item strip
with carried/stored counts and an explicit transfer direction, if a current
native journey demonstrates repeated hunting between the lists.

Default to a selected comparison using current known stock, with optional
cross-highlighting. Use item identity/quality, not name, to match rows. Unknown,
not held and filtered out have different wording. The cost is a little stable
space and reconciliation when a stock changes. Do not adopt Corc's capacity,
rot factor or ring restrictions as universal OOPS rules.

### F5. Long labels should give up decoration before meaning

The [long powder-name post](https://discord.com/channels/622495527485046805/811370601129705483/1492309608058847242)
reports configurable labels after text failed to fit; the saved image shows
reagents alongside short ratios. The [glyph-spacing specimen](https://discord.com/channels/622495527485046805/811370601129705483/975882233481154590)
shows how a tiny gap can matter to a distinctive typeface. Neither demonstrates
OOPS's fonts, fallback behavior or a universal abbreviation policy.

OOPS's current inventory CSS already reserves name/count tracks and inherits
text size; inventory composition decorates the same native rows. The dated
14px OOPS capture visibly separates quantity, slot, quality and price, while
the 21px service capture demonstrates a different density challenge: labels,
input stock, cost and forecast paragraphs compete within the task region.
Those old captures do not prove today's long-name fit.

**Account for now:** prioritize full active verbs, selected identity and units.
Explain short ratios with a stable heading such as Owned / Needed when that
is their real meaning. Keep time-per-attempt separate from random yield and
work already completed. A short display alias may help a repeated list, but
the complete known name should remain available through keyboard inspection.
There is no reason to create persistent nickname state for this research.

Numeric alignment and prose readability can use different typographic roles
within existing tokens. Check `0/O`, `1/l/I`, minus, multiplication, percent,
duration units and fallback scene glyphs at actual text size. A decorative
glyph failing should not make the action or resource ambiguous. This is a
test fixture consideration for CUI1/CUI3, not a separate font project.

### F6. An effect must stop referring to the previous subject

In the [logging clip](https://discord.com/channels/622495527485046805/811370601129705483/1521016485944885269),
the sampled sequence shows target depletion, a felling announcement and then
a replenished target with a different maximum while the old announcement is
still fading. This is an observation of the saved clip, not a Proto23 bug
diagnosis. A reader may understand it perfectly in motion.

**New consequence:** an effect needs both an occurrence and a subject lifetime.
A receipt can be unique while its anchor is later reused for something else.
Do not let an old target's loss, repair or completion look like the next
target's current state. A compact past-tense result may persist in Reports;
its transient local pulse can end when that scene/subject is replaced.

Current `settled_text_effects.js` deduplicates by actor/sequence/type/text,
tracks DOM anchor geometry, cancels on hidden/reduced-motion changes and lets
callers cancel. The inspected module does not itself compare a gameplay subject
revision. Callers may already replace/cancel correctly, so this is a **real
gap in the generic module's own semantic contract, not a demonstrated end-to-end
failure**. The existing combat log already keys encounters and records actor/
target identities and individual occurrences. Reuse those identities and
caller ownership before proposing a new global event layer.

For a small climb scene, keep base/summit and the command area fixed while the
character and debris move. The sampled fall retains its return strip during
the descent. Default to rendering the settled outcome; a real catch or rescue
choice needs a real input mechanism, with a paused decision or chosen policy
as the proposed default. Cosmetic animation cannot
promise a response window. Forgiving aftermath, real body/means and protective
safety stops keep their existing authority. The latter may inspect real
consequences without revealing hidden causes, as corrected in CRL1/AA10.

### F7. Presence can be lively while commands stay still

The [cat drawing](https://discord.com/channels/622495527485046805/811370601129705483/1526774084170551366)
puts a small expressive subject near ordinary care controls. The still does
not establish animation timing or the truth of a player's final-boss joke.
Likewise, debris makes the climbing scene read as height without requiring
a detailed environment renderer.

**Account for now:** let optional art occupy an internal reaction area instead
of changing panel height or moving Pet, Return, Repair or Stop. A tiny scene
can use mostly quiet space and still be useful. Fit the area by task: a vertical
climb expresses height; a tool-condition row expresses wear; neither requires
the entire workspace to become spatial. A capable traveler may bypass the old
problem. Reusing an old fall gag must not disable a working power.

Optional audio can reinforce a local action, but the saved samples establish
no audio behavior here. OOPS's current effects seam already has gesture-gated
optional tone support. A later sound choice needs meaning and mixing, not a
new audio subsystem. Do not queue missed ambient sounds for tab return, speak
unknown facts through sound, or make the static alternative less informative.

### F8. A new row and a changed familiar thing are different return cues

CRL21 already proposes quiet recent-change cues. Current OOPS has now added
`change_badges.js`: it counts new row keys, establishes a load baseline and
clears when the panel is showing/opened. That is a useful navigation hint.
`today_strip.js` reads the clock, opening hours and running commitment count;
its comments explicitly withhold a pending outcome label that would reveal
the resolved result too early.

**Real gap, narrowly stated:** these inspected features do not themselves
summarize value changes to an already known row, such as the selected tool's
condition changing while away. A panel being visible is also not proof that
every below-fold entry was read. Neither distinction makes the badge wrong.
Keep “new entries” as its meaning rather than relabelling it “unread changes.”

If a return summary is later selected, project a few relevant observed
occurrences through existing event/knowledge owners. A state difference is not
automatically evidence of its cause. Default to a quiet “since this outing”
line with a route to the corresponding record, adjustable detail and paused
pending choices. Define the outing/baseline using an existing boundary. Do not
create a second quest, completion or read-tracking authority to drive a dot.

### F9. Keep source attribution and release uncertainty visible

The Morrowind image, post `1561408824290844764`, was directly inspected and
excluded as a Proto23 feature. The inherited classification also excludes
Minecraft houses. July body/combat proposals by other developers are not
Corc's systems. Corc, SardineMilk, Mercurius and Miktaew remain distinct;
small sets of replies establish individual reactions, not community consensus.

The separate [YAIR developer owner](../yair-upstream/DISCORD_RESEARCH_2026-10-20.md)
has advanced since the dispatch note: it now reports 623 developer attachment
posts, recovery of all 166 previously missing IDs and selected design/context
review. This report only reread that current owner. It did not independently
re-audit the corpus or duplicate collection. Its owned-output-count rationale
supports preserving the already present shared tooltip count. Developer
intentions, dated demonstrations and shipped current behavior remain different
claims in both sources.

## Five connected incorporation candidates

These are a ranked local shortlist, **none selected or dispatched**. Implement
one useful slice before the next. Effort describes a bounded proposed slice,
not a verified estimate for a whole subsystem. Every selected UI slice needs
fresh rebuilt native evidence before a current behavior claim.

| Candidate | Before → after experience | Existing owner / seam | Default, dial and cost | Effort, trigger and observable player check |
|---|---|---|---|---|
| **CUI1. Protect one resource's reading band** | A lively bar can compete with its lettering → the current exact value remains legible while its edge/fill reacts. | F2/F5; [presentation](../../PRESENTATION_AND_FOURTH_WALL.md), shell resource markup, shared tokens, `settled_text_effects`. | Default quiet text backing; intensity/backing extent adjustable. Costs a little texture and one carefully scoped visual treatment. | **Small**, next time a native bar reaction is selected. Luna low for a settled leaf; Sol low for a visual comparison. At 14/21px and low/full resource, read the value during a reaction, with effects off and reduced motion; commands and bar endpoint remain visible. No current overlap defect assumed. |
| **CUI2. Name the live comparison baseline** | A stable inspector may mean an item key, a slot or recorded event → the title and delta state which subject and baseline are being read. | F3; [panel kit](../../PANEL_KIT.md), `proto23_shell` selection/detail and native stat descriptions. | Default existing live subject; recorded snapshot only as an explicit optional mode. Cost is a short context label and reconciliation on subject loss. | **Small to medium**, when gear comparison/inspection is next touched. Sol low/medium for identity trace, Luna low for a bounded labelled view. Inspect A, equip it, replace its slot occupant, consume/remove a held stack, then inspect an old event. The player identifies each current subject; missing baselines explain themselves; no command runs merely to read. |
| **CUI3. Show the two holders for one transfer** | Repeatedly locate the selected object in two stocks → read Carried / In this chest and choose a named deposit/withdraw action beside it. | F4/F5; native storage UI and `stageNativeStorageTransfer`; shared inventory projection and item inspector. | Default selected-item comparison, optional linked highlight. Keep independent list orders and identities. Cost is a compact comparison area and stale-stock reconciliation. | **Small to medium**, after reproducing transfer-planning friction on a current native journey. Sol low for the transaction/view trace; Luna low for a settled leaf. Transfer one of two same-named distinct items at 21px, then change stock before confirmation. Exact identity/count survives; stale requests refresh safely; Back restores position. |
| **CUI4. End a local reaction at subject replacement** | Old completion/loss imagery may still share an anchor with new work → history stays readable while transient emphasis belongs to its actual subject. | F6/F7; [presentation](../../PRESENTATION_AND_FOURTH_WALL.md), existing settled receipt caller and scene/selection owner; combat identity pattern as reference. | Default stop/reconcile the transient cue on subject change. Optional longer past-tense receipt belongs in history. Cost is one caller-owned identity/lifecycle check, if existing teardown is insufficient. | **Small** for one existing consumer, next time an anchored reaction is touched. Sol low for lifecycle trace; Luna low for the leaf after the contract is settled. Complete target A, switch/rebind to B during the effect, scroll/reopen and toggle reduced motion. No old pulse attaches to B, no receipt replays, and the authoritative result remains available. |
| **CUI5. One quiet return line for a familiar changed subject** | New-entry dots cannot explain a changed familiar tool → a brief supported change and its detail route restore context. | F8; [presentation attention palette](../../PRESENTATION_AND_FOURTH_WALL.md), event/knowledge owner, current badges/Today as complementary views. | Default one relevant known change at an existing outing boundary; optional detail. Cost is defining that boundary and retaining a supported event reference. | **Medium**, only when one real return/outing consumer is selected. Sol medium for knowledge and baseline semantics. Return after one known condition change and one new known entry, then reload. The summary distinguishes them, reveals no pending/hidden cause, does not replay missed VFX and leaves the real pending choice paused. |

CUI1–CUI4 fit existing interaction/presentation seams. CUI5 has the highest
semantic cost and should wait for a concrete return consumer. A long-name
fixture, matching gutters and stable controls support these comparisons; they
are not additional features to dispatch.

## Unsettled comparisons and the existing workbench route

No new mockup was built. A useful first comparison would be **CUI1**: the same
resource value, fill, label and local reaction with three text-backing/edge
treatments, including a quiet static form. Show the reading tradeoff rather
than different damage values. A second possible study is **CUI2**: follow an
inventory identity versus explicitly follow a slot, with the same scripted
equipment change. This compares meanings, not just colors.

Use [MOCKUP_SYSTEM](../../MOCKUP_SYSTEM.md) and the
[existing workbench](../../../prototypes/workbench/README.md). Its current recipe
adapter uses a pinned prior prototype build and a simplified frame. These new
studies would need their own declared fixture/adapter; this report does not
claim those exist. A pane study is sufficient for a local backing question;
inspection placement needs the surrounding native-sized shell and its log.

For either study, retain identical state across alternatives, explicit manual
steps, fixture provenance, selected subject, scroll, focus and Back/Esc. Include
a long known name, large values, a missing baseline and unknown/unavailable
states. Review at 1920×1080 and actual 14/21px, then affected desktop checks.
Record click/key cost and what remained visible. A simulated workbench action
does not prove native commands, RNG, saves or human visual acceptance.

## More-to-consider disposition and proposed folds

**ACT NOW, completed:** recovered live authority and dirty source, reviewed the
bounded visual/context set, compared current seams, preserved the historical
candidate limits, saved this report and private claim/coverage evidence. No
shared owner was edited. No implementation, publication or approval is implied.

**ACCOUNT FOR NOW:** retain UR49 differences; distinguish item/slot/event
identity and current/recorded knowledge; protect labels; treat new-key badges
as new entries; separate settled animation from real response windows. Local
reaction should not change the clock, command target, simulation RNG or read
truth through a hidden cause. Safety stops and forgiving recovery keep their
accepted exceptions and mechanisms. No new global restrictive policy follows.

**LATER / DELEGATE, not dispatched:** CUI1–CUI5 above contain capability,
effort, trigger and done check. Larger sound vocabularies, a climb/catch mechanic,
new creature behaviors, broad typography replacement and a general return
ledger are unselected. CRJ5–CRJ7 already own the small spatial/reaction/callback
experiments; this review adds the identity and stable-command constraints rather
than creating duplicates. Additional media acquisition is not needed for these
five proposed slices.

Suggested narrow owner folds, for the existing writers to reconcile later:

| Destination | Proposed addition, not applied |
|---|---|
| [Vivid/UI palette](VIVID_AND_UI_FLOW_CONSIDERATIONS_2026-10-13.md) | Link F2/F5 and CUI1 as a label-backing comparison; link F3/F4 as subject/holder comparison semantics. Preserve existing palette/default status. |
| [Presentation palette](../../PRESENTATION_AND_FOURTH_WALL.md) | Link F6/CUI4: a unique receipt also has a subject lifetime; caller teardown/rebind is the first seam. Link F8/CUI5 as changed-known-state versus new-entry attention. |
| [Granular interactions](../../GRANULAR_SYSTEMS_AND_INTERACTIONS.md) | Link F4: holder direction and object identity make transfer consequences readable. Capacity/spoilage remain per-world mechanisms. |
| [Parent synthesis](DESIGN_LESSONS_FOR_OOPS_2026-10-20.md) | Link this independent review after CRL26; do not renumber or claim it adds accepted mechanics. F6 and F8 are the principal new interaction distinctions. |

## Verification and remaining gates

Documentation-only checks: local Markdown targets resolve; external Discord
locators agree with the saved index for the cited Corc records; source/media
hash bindings and selected-file existence were checked; own diff whitespace
and scope checked; private files are ignored and no raw conversation/media was
copied into the public report. Private checks record any concurrently changed
inputs rather than overwriting or claiming them as this task's edits.

No gameplay build/test run was needed under AD36's docs-only rule. No fresh
native browser run, release verification, save/reload/import check or human
visual/play acceptance is claimed. Those gates belong to a selected future
implementation and its exact inputs. This report's completion establishes the
bounded research/documentation outcome only. No commit or push.

## Round 2: tiny oxygen meter and identified font, 2026-10-20

Weibao asked specifically about the tiny oxygen meter, whether the font could
be identified, and more to consider. This extends the existing review. The first
pass overemphasized the oxygen/HP collision and left its positive design value
underdeveloped; it also had not identified the font. The following corrects
those gaps without selecting a new UI default or oxygen mechanic.

### F10. The tiny oxygen meter is a useful contextual resource treatment

The [original oxygen post](https://discord.com/channels/622495527485046805/811370601129705483/1515288902909427744)
shows a thin, labelled strip alongside the main health resource. Corc calls it
applicable in context. Its useful property is **nearby, low-cost visibility**:
the player can monitor a temporary constraint without opening another panel
or dedicating a full-height vital row to it throughout ordinary play. It keeps
the important causal relationship, breath and bodily danger, within one glance.
That interpretation is visual reasoning, not a measured usability result.

This round directly viewed all three saved images in that exchange: Corc's
original, the reader's proposed scribble, and Corc's lighter-border revision.
The scribble belongs to John 'The Rat' Ripper; it is not an intermediate Corc
implementation. The reader still found the revised difference difficult to
see. Final style, depletion behavior and the mechanics of running out remain
unresolved. No exact oxygen formula or drowning rule follows from the images.

**OOPS proposal:** a narrow secondary resource lane within You, near the related
vitals, with an explicit expanded explanation in the existing inspection or
Condition home. Default to a clearly labelled Breath reserve when an actual
owned breath mechanic is relevant. The thin strip can remain small while its
focusable reading area and complete label remain comfortable. Fit its label
outside the HP text band. Context, thickness, intensity and whether to keep it
visible are dials; the cost is a little vital-panel space and a real data binding.

This is a concrete subcase for **CUI1**, not a sixth independent candidate or a
reason to add simulated oxygen just to fill the design. Current inspected source
has a Breathing skill affecting strength, agility and maximum stamina, plus
body capability fields. Those are not evidence of a native breath-reserve
depletion meter. A future implementation needs the resource's actual owner and
consequences rather than deriving air remaining from skill XP or stamina.

### F11. Resource visibility should follow relevance without moving commands

**Additional consideration:** reserve, supply and recovery are different facts.
A breath reserve, an equipped air supply and the surrounding air need not share
one percentage. A full reserve can coexist with a problem replenishing it.
An estimated time remaining is conditional on current consumption and supported
knowledge, not a promise while exertion or conditions change.

Default to the currently meaningful, observer-supported resource and a plain
state such as holding breath, replenishing or low. A known upcoming need can
justify preparation-time visibility before depletion begins. When the context
ends, it can become quiet without moving an active button or changing the
player's selected subject. Avoid repeatedly flashing or opening/closing the
row at a threshold. These are display choices; cosmetic timing does not govern
the body's resource or its safety stop.

The same visual family could fit a real climbing grip or channel strain when
those mechanisms exist, with their own names and meanings. It should not become
one automatically rotating slot that hides another simultaneous hazard.
Breathless bodies, alternative breathing means and protective powers use their
actual mechanisms under AD38. No universal oxygen requirement is proposed.

### F12. The specified font is MS Gothic

**Identified from source, not guessed from the screenshot.** The retained
Proto23 HTML at revision `e93a8cd617932fb698ff889b968a32f9a20d48f3`, SHA256
`a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5`, declares
`html body{font: 1.1em MS Gothic;}` at line 5. Its `#dscr` description rule at
line 77 also names MS Gothic, at `.9em`. Both downloaded February 2021 source
attachments name it too; these files were read as text and not executed.

Independently, Corc's [November 22, 2023 font post](https://discord.com/channels/622495527485046805/811370601129705483/1176824068851388426)
offers `msgothic.ttc` in response to a Mac-related font issue. A saved February
2026 effect-example caption also contains an MS Gothic declaration, although
that full source attachment is not acquired. These provide a consistent
specified-family trail across several dates, not proof that every screenshot
used one exact font file/version.

[Microsoft's font reference](https://learn.microsoft.com/en-us/typography/font-list/ms-gothic)
confirms fixed-width Latin letters for MS Gothic and lists `Msgothic.ttc` as the
collection containing MS Gothic, MS UI Gothic and MS PGothic. Naming the
collection alone would not distinguish its faces; the CSS specifies MS Gothic.

**Remaining boundary:** the actual rendered font in the oxygen screenshot is
not independently verified. A declared family can fall back if unavailable.
The font attachment's bytes are still missing from the saved collection. No
font was downloaded, installed, embedded or added to OOPS by this pass.

### F13. The font's rhythm and the interface's density are connected

**Inference from the identified family and reviewed media:** fixed-width Latin
letters help explain the source's regular columns, compact numerical rhythm and
text-art feel. That does not establish that all glyphs, scripts or fallback
characters occupy the same width. Frame edges, gradients, text sizes and glow
also contribute to the appearance; changing the family alone would not recreate
the whole visual result.

OOPS currently uses its shared CJK/sans font stack and exposes system, serif
and generic mono choices through existing customization. Generic `monospace`
does not select MS Gothic specifically. Preserve this current state while a
future optional study compares the actual available family at the same 14/21px
sizes, using the same names, prose, resource labels and numbers. State whether
the face loaded; a screenshot of an unresolved fallback is not an MS Gothic
comparison.

Default proposal: retain readable body/control text and test the distinctive
font where its rhythm helps, such as a compact scene, value band or optional
theme. Whole-interface use is another reasonable comparison if it reads well.
Scope and family are dials; the costs are changed line lengths, wrapping and
fallback behavior. This is a subcomparison supporting CUI1/CUI3, not a separate
font-replacement workstream or an accepted mixed-font design.

### F14. A tiny visual mark still needs a complete reading route

Tiny meters compress the drawing, not necessarily the interaction or meaning.
Default to a larger keyboard/focus route through the existing vital/Condition
inspection, with the full resource name and known value/state. Color and thin
fill can support glancing; they need a readable/static equivalent. A low-reserve
warning can become more explicit without relocating Stop or a pending action.
Routine updates should not flood announcements or restart a warning each tick.

Check truly empty and full states, small positive values, recovery, known
unavailability, simultaneous hazards, large text and reduced motion. An outline
should distinguish an empty meter from a missing one without inventing a
minimum filled amount. At a body or means change, reconcile the label and
resource owner before drawing the next value. Historic oxygen use remains an
event; it should not silently describe the current body.

### Round 2 disposition and checks

**ACT NOW, done:** identified the specified font through retained CSS and the
author's attachment post; checked Microsoft's family/file description; reviewed
the original oxygen image, reader scribble and lighter-border revision; saved
F10–F14 and private bindings in the
[round 2 package](private/discord-media-2026-10-20/analysis-ui-independent-2026-10-20/round-2-oxygen-font/).

**ACCOUNT FOR NOW:** contextual visibility, stable commands, independent
simultaneous resources, real resource ownership, full focus labels and actual
font loading. Tiny-meter styling does not authorize a new oxygen model or imply
an exact countdown to harm. Existing knowledge, recovery and safety-stop rules
continue to govern consequences.

**LATER / DELEGATE, unselected:** extend the existing CUI1 comparison with a
thin contextual strip, a separate narrow lane and a quiet full row, all showing
the same labelled fixture. Include MS Gothic as a variant only when its actual
availability is established. Sol low for the visual/meaning comparison and
Luna low for a bounded settled adapter; small presentation study, with resource
implementation estimated separately if needed. Trigger: a real selected
secondary-resource consumer. Done check: at the desktop targets and actual
14/21px, identify the resource and its state alongside readable HP, operate by
keyboard, compare simultaneous constraints and preserve command positions.
Fixture results remain separate from rebuilt native proof and human acceptance.

Local links, source lines/hash identity, private ignore status and the scoped
append diff were checked. No shared owner, runtime, bundle, save or default
changed. No game build, browser prototype, native resource behavior, font-load
rendering proof, commit or push is claimed.

## Round 3: future UI families and condensing messages, 2026-10-20

Weibao asked to reuse these details for future bars and other small UI aspects,
then broadened the request to useful UI types, especially progress bars and
message-condensing options. That general design direction is now recorded in
[USER_VISION](../../USER_VISION.md#small-contextual-ui-details-for-future-work-2026-10-20),
PROJECT and AD40. The live
[UI palette](../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md#small-contextual-bars-and-everyday-interface-details-2026-10-20)
owns the reusable detail rather than leaving it only in a source-specific report.

**F15. Broader absorption is a design vocabulary, not one global template.**
UF1–UF10 map bars, actor/context panels, dense lists, task workspaces, inspection,
two-stock views, little scenes, ordinary local reactions, streams/summaries and
navigation/disclosure/style to OOPS's existing owners. BD1–BD12 cover bar meaning;
LD1–LD12 expand the small physical, wording and continuity details. These new
examples are proposals, not additional claims about Proto23's implementation.
The original five CUI candidates remain a local shortlist, not an exhaustive
future feature inventory or a newly accepted queue.

**F16. A full progress bar can mean success rather than danger.** The current
stateless `src/meter_bar.js` supports pool, accumulator and track specs. Its
shared state calculation treats the high end of accumulators and tracks as
near/at the limit; CSS and accessible wording reflect that. Its near-limit
default is one unit from the endpoint. This is source support and a concrete
re-use limitation, not a browser-reproduced defect in a selected consumer.
The palette distinguishes completion, reserve, risk, a useful band, committed
stock, signed rate, discrete stages, uncertain readings, deltas, batch goals,
elapsed/readiness and repeating cycles. Mechanism owners still decide values,
valence, meaningful boundaries and consequences. No renderer was changed.

**F17. Message condensation needs separate choices for wording, grouping and
summary.** MC1–MC5 distinguish compact wording, equivalent-repeat stacking,
activity batches, encounter/return digests and filter/follow behavior. Current
`combat_log`, `display` and Reports controls already support compact combat
lines, expandable repeated occurrences, category filters, follow and Latest.
The inspected controls do not establish a standalone Detailed/Stack repeats
preference or a general activity-summary consumer. Old lines are pruned by
category, so current source also does not establish an infinite durable archive.
A new option should name what can be expanded and what was not retained.

**ACT NOW, done:** saved the accepted general direction and linked its owner;
expanded the reusable palette with source/capability distinctions, dials, costs,
capability/effort/trigger notes and player checks. **ACCOUNT FOR NOW:** retained
event identity, known subject/time, simultaneous constraints, actual clock/work
meaning, stable reading position and existing display preference ownership.
**LATER / DELEGATE, none dispatched:** apply a relevant palette entry to the
next selected native journey; the owner names bounded meter, transfer, local
reaction, return and Reports comparisons. No whole-interface replacement,
resource model, typeface, message default or implementation run was selected.

The existing rules-index checker and scoped link/append/zero-loss checks cover
these documentation changes. Exact own diffs, relevant source identities and
results are in the
[round 3 package](private/discord-media-2026-10-20/analysis-ui-independent-2026-10-20/round-3-future-details/).
Rules index: PASS, with one warning for an already untracked gear-depth owner.
Required existing rule-behavior slice: 36/36 pass, limited to its named cases;
it does not prove the new UI palette. No game build, fresh browser run or human
acceptance is claimed.

## Round 4: implementation gaps behind the UI palette, 2026-10-20

Weibao requested more-to-consider on implementation gaps and adjacent details.
This is a bounded source/data-flow review, not authorization to implement the
whole palette. AD6–AD8/AD32–AD36/AD38/AD40 and UR35/38/43/48/52/56/58 apply;
AR3/AR6/AR7 guide the future implementation seams. Current accepted direction,
desktop targets and deferrals are unchanged. The current
[90-row feature comparison](FEATURE_AUDIT_SIDE_BY_SIDE_2026-10-20.md) owns the
broader reference inventory; this pass follows concrete code boundaries rather
than repeating that census. Neither report establishes a current browser defect
from source alone.

**Most useful next implementation proposal:** fix the existing dynamic-loot
delta attribution before adding a new message mode. It is a reproduced display
error with a small existing seam. The generic meter and long-repeat cases below
also need explicit contracts before broader reuse. Findings are not fixes.

### IG1. Combined loot can put the recent gain beside the wrong item

**Reproduced in the current producer and formatter.** In a synthetic sequence,
previous total is A ×5, then the next acquisition is B ×3. The exact current
`process_current_loot` and `log_loot` functions produce:

```text
Gained "A" x5(+3), "B" x3
```

The correct meaning is A total 5 with no new gain, B total 3 with +3. The total
counts remain correct. The error is the recent-gain annotation: `log_loot`
iterates total entries and takes recent entries by the same array index instead
of the actual item identity. Subsequent subsets/reordered gains can therefore
attach an amount to another item. This is a source-level logic reproduction,
not a browser-observed acquisition or a claim that inventory/rewards are wrong.

Seams: `src/main.js`, `process_current_loot`; `src/display.js`, `log_loot`
(particularly the `gains_msg` construction). Future correction should match
recent and total by the producer's existing item ID/key, retaining quality and
identity distinctions. Do not infer the join from displayed names, issue another
reward, change tally boundaries or add another acquisition owner.

**Why this matters to condensation:** a summary can keep an accurate grand
total and still tell the wrong story about what just happened. Fixing that
reading error is more useful than first adding another compact style.

### IG2. Meter warnings assume a unit scale and treat completion as a limit

**Reproduced through current leaf functions:** `track 0/1` is already `high`
with accessible text “near the limit”; `track 1/1` is `full` / “at the limit.”
A completely full fractional reserve, `pool 0.5/0.5`, is also `high`. The
near-limit calculation uses one absolute unit, so its behavior depends on the
chosen measurement scale. The current CSS adds warning/limit outlines for those
states. A completed track can instead be a successful outcome.

These are real generic-function boundary results, not proof that today's
integer-scale native consumer displays a bad resource state. Existing pool/
accumulator tests pass for their named inputs. Before using the renderer for
the BD progress palette, define state meaning and meaningful thresholds at the
consumer/spec seam, preserving current consumers deliberately. An arbitrary
percentage replacing the current unit is not automatically the right design.

Seams: `src/meter_bar.js`, `meterState` / `normalizeMeter` /
`createMeterBar`; `styles/meter_bar.css`; `tests/meter_bar.test.js`.
Threshold explanation, fill direction and screen-reader wording must agree.
New stage/completion wording should not manufacture native job success.

### IG3. One condensed line can retain and rebuild a very large occurrence list

**Reproduced with the actual `addCombatOccurrence` function over an in-memory
DOM model:** one group retained 12,000 time labels. Opening its detail created
12,000 list items; the next occurrence recreated 12,001 list items. This is a
structural allocation/result count, not a native performance benchmark.

The main log's category pruning limits message rows, not this per-row array.
Adding a Stack repeats preference without addressing that distinction can
produce a quiet-looking stream with a large hidden occurrence list. Expanded
detail currently rebuilds the complete list on every update. Existing unit
checks for event equivalence do not cover this long-lived DOM/list behavior.

Seams: `src/combat_log.js`, `addCombatOccurrence`; `src/display.js`, category
pruning and `collapse_combat_repeat`. Future bounded detail can keep an accurate
total while rendering or retaining a manageable recent portion, explicitly
stating what remains available. Window/page size is a performance/readability
dial, not a universal gameplay limit. Prefer incremental visible updates when
the user is reading. Do not call the last few retained timestamps the complete
history, or reconstruct unique event facts from an aggregate count.

### IG4. The existing generic bar is not yet the whole tiny-meter interaction

**Source-supported capability gap, not a reproduced layout defect.** The generic
renderer supplies a value/maximum, three kinds, label, title note, meter ARIA
attributes and a fill. It requires finite values and a positive maximum; it
clamps out-of-range fill values. That does not provide signed, unknown/stale,
interval, held/free or stage semantics by itself.

Its note is a `title` attribute; the renderer itself creates no keyboard/stable
inspection route. CSS uses an overlaid single-line value, fixed-height region
and hidden overflow. There is no compact-strip variant or label collision
handling in this module. Those facts do not prove clipping in a current native
scene, but they are concrete work remaining for the oxygen-like CUI1 proposal.
The declared `token` also has no general custom-token color dispatch in the
inspected stylesheet; palette expansion should use existing theme ownership
rather than assume every new token already has a visual mapping.

The direct source consumer found here, `src/book_world_lotm_ui.js`, reuses bar
objects but clears and reattaches their container on a changed view. If a future
variant adds focusable inspection, its caller's update lifecycle needs checking
as well as the leaf. This is not a claim that its current noninteractive bars
lose an existing focus control.

Smallest useful adoption: one current known resource, truthful label/value,
comfortable focus route and stable node/subject, with compact and full forms
compared at actual 14/21px. Do not extend the renderer with every palette type
before there is a selected consumer, and do not invent oxygen gameplay to test
the shape. The current shared vitals already have an Inside/Beside value setting;
reuse that existing placement idea where suitable.

### IG5. Message choices cross different data, reset and clock boundaries

**Correction to the earlier capability map:** OOPS already has native dynamic
loot aggregation, its settings checkbox, and gathered-materials totals emitted
at activity stop when dynamic aggregation is off. Earlier review focused on
combat stacking and did not trace those existing counterparts. MC3 can refine
them; it should not begin by building another loot summary system. This is
still not a general encounter/return digest with a complete durable event store.

| Existing behavior | Owner and consequence for a future combined control |
|---|---|
| Category filters / log following | Reading controls; preserve the existing stream and reading-position semantics. Some native filter preferences also follow their own remember-filter option. |
| Stop combat log | Transient presentation flag; skips creating new matching combat reports, resets on reload, and is not the same as hiding retained lines. A later Detailed mode cannot recover those omitted reports. |
| Dynamic loot | `game_options.do_dynamic_loot_message` is stored with native game options. Its setter calls `clear_loot_information` on either choice, resetting the current displayed tally. Live dynamic messages replace earlier ones. A browser-only display toggle is not a safe alias for this setter. |
| Repeat stacking | Parity-shell behavior with occurrence details; a standalone Detailed/Stack repeats preference is not established by inspected controls. A preference needs normalization, scope/reset/import behavior and retained-data semantics. |
| Occurrence time | `combat_occurrence_time` keeps HH:MM, with an opponent ordinal where applicable. The probe gives the same `08:00` for two different dates. This supports local reading, not full cross-day/world duration reconstruction. |

A new display-only preference can use `display_settings` and its browser reset/
export/import owner. Reusing a native option should retain its native save and
reset semantics unless a deliberate change is selected. For a future digest,
retain only the additional observed event/clock identity the actual consumer
needs, or state that older records lack it. Do not add an unlimited global event
ledger merely to produce one toggle. Re-rendering a record cannot replay sounds,
rewards or discovery effects. Filtered, stopped, aggregated, pruned and unknown
are different reasons a line may not appear.

### Ranked applications, scope and done checks

These are proposals. Source probes narrow the next implementation question;
they do not authorize execution or replace fresh native verification.

| Priority / seam | Capability, effort and trigger | Observable check after selection |
|---|---|---|
| **1 · IG1, truthful dynamic-loot delta** | Luna low for a bounded formatter/regression leaf; small. Trigger: the next selected message correctness slice. | Collect A then B, reverse/subset the recent gains, and distinguish same-name keys. Totals and each +delta match the real acquisition. Toggle existing aggregation without issuing another reward. Rebuild and exercise a fresh native gathering/combat route. |
| **2 · IG2, meter meaning across scales** | Sol low to settle consumer semantics; Luna low for a bounded leaf; small. Trigger: a selected progress consumer or fractional-unit reserve. | Empty/full reserve, unstarted/finished track and accumulator states have truthful distinct words; equivalent scales do not invent different danger. Preserve current consumer behavior deliberately; verify actual labels and text size in browser. |
| **3 · IG3, bounded repeat detail** | Sol low/medium for count/retention semantics, Luna low for the leaf; small to medium. Trigger: enabling broader repeat options or long-fight reading. | One large group keeps its true count, explains retained detail, and does not rebuild every historical row on a new hit while being read. Focus/scroll/hold/unread remain stable; no native timing result is claimed without measurement. |
| **4 · IG4, one compact readable resource** | Sol low for the same-state comparison, Luna low for a settled variant; small study, native binding scoped separately. Trigger: one real resource's useful local reading need. | Read value/name at 14/21px, low/full state and supported palettes; focus explains the resource, and caller refresh/rebind preserves subject and focus. Unknown/unavailable stays honest. No new gameplay model is required by a visual fixture. |
| **5 · IG5, Reports choice over existing owners** | Sol medium for native/browser option and retention boundaries; small to medium for a narrow mode choice, more for a genuine digest. Trigger: selection of a message-mode slice. | Detailed/Stack behavior, aggregation, filter, Stop/Resume and reload/reset/import have explicit meanings. Missing historic detail is explained, clock information is sufficient for the chosen scope, and mode changes neither clear unrelated tallies nor replay outcomes. |

**ACT NOW, done:** corrected the current palette's native-loot capability map,
saved IG1–IG5 and the private reproduction script/results, and ran relevant
existing meter/combat tests. **ACCOUNT FOR NOW:** known labels can be wrong even
when totals are right; source tests and mocked DOM counts are narrower than
native journey/performance proof; time-only occurrence strings are not a future
history schema. **LATER / DELEGATE, not dispatched:** the five applications
above. No runtime fix, new tests in the committed suite, collector or new chat
was started by this analysis pass.

### Round 4 verification

`node --test tests/meter_bar.test.js tests/combat_log.test.js`: **7/7 pass**.
Those seven existing checks cover their specific leaf inputs; they pass while
the additional source probes reproduce IG1/IG2/IG3. The probe script invokes the
current meter/combat leaf functions and bounded extractions of the native loot
producer/formatter and occurrence-time expression, with synthetic items and a
small DOM model. It does not start the game, use player saves, render CSS, time a
browser or execute downloaded HTML. Results and exact input identities are in
the [round 4 package](private/discord-media-2026-10-20/analysis-ui-independent-2026-10-20/round-4-implementation-gaps/).

Scoped documentation links/diff/privacy checks cover the report and owning UI
palette correction. No source, bundle, game option, saved preference or player
save was changed; no build, commit, push or current native acceptance is claimed.

### IG execution checkpoint, 2026-10-20

Weibao authorized a new implementation chat using Luna workers and Sol integration.
This supersedes Round 4's inspection-only execution status for the bounded IG1–IG5
corrections, not the proposal status of the whole palette. Rules: AD6–AD8,
AD32–AD36/38/40; UR35/38/43/45/48/49/52/56/58; AR1–AR16.
Surface/home: existing ambient Reports stream, browser display settings and current
Tingen resource meters. Targets: 1920×1080, about 1800×1040 and 1536×864 at
actual 14px/21px. Mobile, shell redesign, new resources and global event archives deferred.

Writer reservation: root chat `01a15bc5-de54-7e50-b46c-7419cc27b266` integrates;
Luna loot worker owns `src/display.js` loot formatter and `tests/loot_log.test.js`
until return. Luna meter worker owns `src/meter_bar.js`, `styles/meter_bar.css`,
`src/book_world_lotm_ui.js`, `tests/meter_bar.test.js` and an optional dedicated
meter DOM test. Root owns `src/combat_log.js`, `tests/combat_log.test.js`, the
new preference hunk in `src/display_settings.js`, then the repeat gate in
`src/display.js` after explicit release. Root alone appends receipts to these
owning records. No `src/main.js`/shared-token edits, commits or pushes planned.
Existing A1/A2 reservation reports released; active peer chats are research lanes.
Build artifacts are reserved only for the integrated validation window.

Budget: one Sol coordinator, two fresh Luna-low workers, at most two concurrent,
no worker descendants or paid/API fallback. Included usage starts 18%; stop
expansion at 23% under AU7, counting the shared account conservatively. Worker
returns <=300 words plus paths/checks. Reuse Round 4 failures; focused regressions
then one integrated build/test/architecture/rules pass. Private `execution-start.json`
records refreshed relevant hashes, all equal to the Round 4 runtime baseline.
Browser and human acceptance remain separate gates.

### IG execution receipt: implemented candidate, 2026-10-20

The authorized implementation follow-up is complete as a source and rebuilt
browser candidate. Sol integrated two fresh Luna-low leaves (loot, meters),
reviewed their actual diffs, and corrected the remaining semantics/lifecycle and
native import boundary. No other workers, API fallback, commit or push. Included
shared-account usage moved from 18% to 19%, below the 23% task stop boundary;
this is a shared meter, not attribution of the whole increase to this chat.

| Gap | Implemented disposition and exact boundary |
|---|---|
| **IG1** | Recent gains join by the producer's item ID/key, retaining distinct same-name keys and total order. Rebuilt native producer: Rat tail ×5 followed by Rat fang +3 reads `Rat tail x5, Rat fang x3(+3)`; reordered next gains correctly label tail +1 and fang +2. Rewards, inventory and tally boundaries unchanged. Browser calls used synthetic acquisitions through the actual producer with summary observation suppression; this is not a naturally earned loot journey. |
| **IG2** | Pools say low/empty, accumulators near/at limit, tracks not started/complete. Existing multi-unit consumers retain one actual unit as the default near threshold; max ≤1 has endpoint states unless its owner supplies a finite nonnegative `warningDistance` in resource units. Full pools stay normal; complete tracks have progress styling, not a danger state. No simulation success is inferred. |
| **IG3** | Exact group count is separate from the latest **100** retained HH:MM/opponent labels. An open list is a labelled fixed snapshot, capped at 100 entries; incoming hits update the count without rebuilding it. Closing/reopening reads the latest retained window. Older labels are discarded; an already open snapshot persists until closed/pruned. This is a display retention/readability dial, not a gameplay cap or a complete historical archive. |
| **IG4** | Current Tingen spirituality/strain bars use readable label/value above a thin fill, with visible state words and keyboard-operable Details. The role belongs on the numeric track, leaving Details accessible. Existing meter IDs retain nodes/focus/open state through refresh and reorder; disappeared resources and unenrollment remove their nodes. Browser resource scene was explicitly DEV SEEDED through the actual panel renderer, not a played acquisition or proof of the whole Tingen world. |
| **IG5** | `Combat reports: Stack repeats / Detailed` lives in the existing This browser settings. Default preserves existing stacking; changes affect future reports, with existing groups retained. Native loot option remains save-owned and keeps its tally-reset setter. Stop still omits new combat reports and resets on reload; filtering hides retained lines. New preference follows browser reset/export/import. Native testing exposed automatic panel metadata persisting unrelated defaults before import: `setDisplaySettings` now persists touched keys, while normalized defaults still apply in memory. Existing stored explicit choices remain authoritative; missing exported preferences default to Stack, and explicit local values still win imported values. No new game-save schema. |

Changed runtime/style paths: `src/display.js` (loot formatter/repeat gate),
`src/combat_log.js`, `src/display_settings.js` (own hunks only, preserving the
prior contrast work), `src/meter_bar.js`, `src/book_world_lotm_ui.js`,
`styles/combat_log.css`, `styles/meter_bar.css`. Regression paths:
`tests/loot_log.test.js`, `tests/combat_log.test.js`, `tests/meter_bar.test.js`,
`tests/meter_bar_dom.test.js`. No edits to `src/main.js`, shared tokens or live
tracked bundles/index were made by this task. Existing unrelated dirty work stays.

#### Verification and input identity

Evidence home, ignored/private:
`private/discord-media-2026-10-20/analysis-ui-independent-2026-10-20/round-4-implementation-gaps/execution/`.
It contains runner sources, logs, browser JSON, source hashes and screenshots.
`final-input-identity.json` covers 973 source/style/test/build inputs;
manifest SHA-256 `f1f42424f3fb8d9ef0f19a3ed49dd7372ccad495a62ea6e38d76cb52d166492c`.
Final copied candidate and live runtime/style inputs match exactly. HEAD remained
`b0af7db5bd21770ca603fdf1e7b865b376f46857`; the candidate includes the shared
checkout's pre-existing dirty inputs, not only this task's changes.

- **V1 · Source/regressions:** focused loot, long-repeat, meter semantic/DOM and
  preference checks pass. After the native import correction, `npm test` passed
  **2314/2314**, zero failures (`tests-final.log`, about 71.3 seconds). Earlier
  full passing evidence was superseded for the changed preference input.
- **V2 · Required gates:** `npm run build` passed in the isolated final copy
  `/tmp/oops-ig-validation/candidate-final`, preserving shared bundle ownership.
  `npm run check:arch` passed: main −6/display −33/save_files 0 against their
  baselines; grandfathered 6 main imports/226 cyclic edges unchanged. The
  architecture inputs were unchanged by the final preference correction.
  `npm run check:rules` passed with one pre-existing untracked gear-document
  warning. No rulebook/AD change, so `check:rule-behavior` is not applicable.
- **V3 · Rebuilt native/browser:** exact total 12,001 with 100 retained/rendered
  labels; open snapshot node and focused button stable. Detailed creates
  separate lines; Stack merges equivalent new events; Stop omits; filters
  retain. Hold keeps `scrollTop=0` with an unread notice, Always reaches distance
  0 from bottom. Mounted native setting, reset/export/adopt/reload pass. Actual
  native `save_to_file` → `load_progress` → reload retains Detailed; Stop resets.
  All disposable contexts used the existing safe fresh fixture; no player saves.
- **V4 · Desktop/readability:** 1920×1080, 1800×1040 and 1536×864 at actual
  14px/21px body and meter label text. Page dimensions equal each viewport,
  meter scroll width equals client width, Reports remains 737–970px high.
  Keyboard Enter opens Details; value refresh retains focus/open node. Inspected
  [primary 14px screenshot](private/discord-media-2026-10-20/analysis-ui-independent-2026-10-20/round-4-implementation-gaps/execution/1920-14.png)
  and [floor 21px screenshot](private/discord-media-2026-10-20/analysis-ui-independent-2026-10-20/round-4-implementation-gaps/execution/1536-21.png).
  Native script runs report zero page errors. Counts are structural checks,
  not a benchmark or a claim that all shell text scales uniformly.

Standard final bundle SHA-256:
`caad165e848bded9d6d6ed0f2ac16e5d6857844490f98c05af18f9021b64e09b`.
Final test-instrumented bundle:
`baed910ab0528d8521a50997be6e91588b5456c52192618188d9635f18183d59`.
Instrumentation exposed existing native producer/display functions and seeded the
resource renderer, without changing their implementations. Earlier loot/repeat/
viewport observations retain their original bundle bindings in `browser-first.json`
and `browser.json`; those relevant source inputs stayed unchanged. Final controls
and supplemental checks use the final instrumented bundle. The preview candidate
was restored byte-for-byte to the standard uninstrumented bundle after testing.

#### Applicable reference-fold review

**ACT NOW, done:** RUC3/PFE19 value/state/color/accessible wording agree for the
selected meters. RUC1 retains the existing navy/teal task fields and purple
Reports; no recoloring manager or palette override was introduced. RUC5 consumes
shared tokens and browser contrast ownership; default screenshots and a high-
contrast scene retain readable words/focus. PFE01/PFE29/PK12 retain event keys,
original occurrence labels, exact count/detail distinction and fixed snapshot.
Supplemental actual pointer down → meter reorder → release opens the original
resource only; deleting that resource before release does not open its neighbor.

**ACCOUNT FOR NOW:** PFE20 uses only the supplied known resource projection and
existing event subjects, with no new hidden-state styling. PFE21 inspection/value
refresh/high-contrast updates were exercised with `Math.random` set to throw:
no draw occurred, and native clock/inventory stayed identical. This is scoped
render proof, not a deterministic comparison of every game's effects mode.
RUC6 uses existing fonts/typography and checks current labels at 14/21px.

**LATER:** RUC2's damaged-rare-gear/comparison matrix stays with the gear/UI
owners when that consumer is selected. RUC4 atmosphere, new fonts/full alias
stress, animated reactions on rebound subjects, broader command gestures,
held-stock/batch/physical-process scenes, clocks beyond HH:MM and a return digest
remain in the thematic UI, panel-kit and engine owners. Trigger: a selected real
consumer with actual state/command/knowledge contracts. No unrelated palette row
became a gate for this slice.

All task writer reservations are released. Remaining gate: Weibao's visual/play
acceptance of the candidate. Natural loot progression and native Tingen resource
acquisition were not played in this check; do not promote the seeded/producer
checks to those claims. Mobile remains deferred. No publishing or commit/push.

Preview delivery: standard uninstrumented candidate served at
[local preview](http://127.0.0.1:54346/), PID 69772 / exec session 47912.
`preview-smoke.json` verifies its fetched bundle hash matches the final standard
hash, startup has no page errors and no test binding. App tab opening returned
`queued`, so visible delivery is not claimed. This preview starts on its own
fresh browser origin; no fixture or player save is preloaded. Stop only this
server PID when no longer needed. Final rules recheck after documentation
integration passed with the same single untracked-document warning.
