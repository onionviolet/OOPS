# Vivid and Proto23 UI flow: further considerations (2026-10-13)

Weibao, after seeing Vivid live: "I think vivid colors might be the best thus far,
considering the ui flow the proto23, maybe we should refer that more? More to
consider? subtle stuff and more?"

This is a palette of proposals, not specs. It adds angles that the
[UI absorption report](UI_SOURCE_ABSORPTION_2026-10-13.md), the
[deeper mechanism report](SOURCE_MECHANISMS_AND_ADOPTION_2026-10-13.md) (A6-A9)
and the [color considerations](../../gm/dispatch/ui-density-slices-2026-10-13/CONSIDERATIONS_COLOR_AND_PROTO23.md)
do not already cover. Desktop/laptop first; mobile deferred. Each entry fits only
where it makes sense for the world and moment.

## Vivid as the frame

| Code | Consideration | Why it matters |
|---|---|---|
| V1 | Make Vivid the default for fresh browsers; existing browsers keep their stored choice; Standard stays one click away. | Weibao's current favorite. Display preference only (`yairpg.colors.v1`), no save change. |
| V2 | Tune the four native bars (xp/stamina/mana/hp) to sit in the Vivid frame: same hues, slightly deeper fill, thin light edge. | The earlier muddy diagnosis named the fully saturated bars as clashing; Vivid left them untouched. |
| V3 | Check item rarity and coin colors on navy and teal; separate category color from rarity (rarity only on name or a small gem). | Vivid left rarity untouched. Proto23 colors inventory by subtype and equipped gear by rarity, two vocabularies. |
| V4 | Hue-independent region cues: a small icon in each panel header (actions, character, records, log, worlds). | Region tints differ mostly by hue; color-blind players and quick glances need a second signal. |
| V5 | A light Vivid variant for bright rooms, same role tints at high lightness. | Same identity, kinder in daylight. Optional. |

## Color that carries meaning

| Code | Consideration | Why it matters |
|---|---|---|
| V6 | Per-world frame tint: Vivid's navy shifts toward each world's identity while you are there (the Village stays navy). | Worlds are meant to feel mechanically distinct; color tells you where you are before text does. |
| V7 | Ambient place header: dusk warms, night deepens, snow and rain cool the header slightly, with Proto23-style weather glyphs. | Time and weather already exist; a quiet visual makes them felt without another meter. |
| V8 | Character-state edges: low HP, exhaustion or poison faintly tint the vitals panel edge, never the whole screen. Opt-in per world. | A subtle diegetic cue that fits the fourth-wall owner's restrained end. |
| V9 | One semantic token set used everywhere: gain green, loss red, money gold, blocked gray with a reason, selected gold underline. | Proto23's shop uses red for "can't afford" and gray for "sold out"; consistency is what makes dense UI readable. |

## Flow and subtle feedback (Proto23 "UI grows as you learn")

| Code | Consideration | Why it matters |
|---|---|---|
| V10 | A revealed panel arrives once with its role tint brightening from muted to full over about a second; reduced motion skips straight to full. | Ties A6 discovery to Vivid; the arrival itself says "this is new". Never replays on reload. |
| V11 | "New" marker as a small dot on items, recipes and records that clears once seen, instead of Proto23's blinking. | Same signal, calmer; works with keyboard focus as well as hover. |
| V12 | Anchored deltas: spent coins float from the purse, gained stats glow briefly in the teal panel, emitted after settlement. | Proto23's `mf` used fixed coordinates; anchoring to real geometry keeps it right after layout edits. |
| V13 | Log that respects reading: scrolling up pauses auto-scroll and shows "3 new" at the bottom edge. | Fixes Proto23's freeze-drops-messages behavior while keeping the tall log column. |
| V14 | Equipped gear gets a faint rarity glow; inventory copies don't. | Proto23 reserves glow for what you wear; it reads as "this is on me". |
| V15 | Compact density preset tuned for Vivid: around 30 px data rows, wider gaps between groups. | Proto23's density works because groups breathe; current Density menu can carry it. |
| V16 | Optional reveal sound through the SFX lane, off by default. | Pairs with V10 without forcing audio. |

## Suggested order

1. V1 + V2 + V3: Vivid as default, finished (bars, rarity). Small, reversible.
2. A6 discovery end to end with V10/V11: the Proto23 flow Weibao liked, one
   real learning event revealing one panel, spoiler-safe in pickers and search.
3. V9 + V12 + V13 on the same loop (A7/A8): one craft or activity explained and
   rewarded consistently.
4. V6/V7 when a second world's UI is next in play.

Acceptance for any slice follows the [UI owner's gates](../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md#standing-ui-scope-and-acceptance-gates-2026-10-13):
rebuilt fresh-origin desktop play at 1366×768, 1440×900 and 1920×1080, zoom,
reduced motion, and save/reload/import where disclosure persists.


## Corc reference round, 2026-10-20: dependencies and attention

**Proposal additions**, extending V1–V16, from
[CRL7 and CRL9–CRL12](DESIGN_LESSONS_FOR_OOPS_2026-10-20.md).
The linked report owns source chronology, evidence and private review coverage.
UR35–UR49, UR50–UR58, AD6–AD8 and AD34–AD36 apply. New UI evidence uses
**1920×1080** and the other current UI_RULES targets; the historical 1366×768
requirement in the earlier section is retired by the later viewport decision.
Mobile optimization remains deferred.

| Code | Proposal | Default, dial and reason/cost |
|---|---|---|
| V17 | Put a job's dependencies next to its progress | Target, actual means, useful known cost and stop/continue control share the task's natural home. Optional detail expands there; the existing shell, full-height log and explicit commands stay governed by their owners. Density is a preference, not a reason to reduce text size. |
| V18 | Preserve remembered positions while context grows | Keep pane home, selection, focus and scroll stable across ordinary reveals/refreshes. Contextual resources can appear where relevant without shuffling unrelated work. Compare actual ongoing tasks, not only sparse screenshots. |
| V19 | Separate progress, changed situation and receipt | Quiet ongoing feedback; clear stop/reason/next action; stronger completion/discovery signal when useful; durable receipt for later. Motion/sound/compression are dials with static equivalents. UI updates neither settle gameplay nor consume time/RNG. |
| V20 | Verify interference between simultaneous facts | The oxygen/HP exchange identifies a border through text; its lighter revision was still disputed. Test bars, long names, overlays and enlarged text together. Aesthetic similarity or attempted polish is not proof of readable results. |
| V21 | Keep the alternate tooltip's chronology unresolved | The October 3 blue matching variant is a dated unused alternate draft. Source context does not establish its creation age, replacement sequence or latest final style. Treat its glow/grouping as an option to understand, not a universally rejected design. |
| V22 | Compression preserves the events that could change a decision | Existing combat occurrences and defeat boundaries are a model to reuse. Different tool, outcome, threshold or stop reason should not disappear into a routine repeat count. Historical previews explain the event then; opening a current subject is a separately labelled action. |

**ACT NOW (done):** saved these additions and qualified the historical viewport
and tooltip labels. **ACCOUNT FOR NOW:** preserve stable workspace habits and
known information while feedback continues outside the task menu. **LATER /
DELEGATE:** when CRJ1 is selected, compare actual start, detail inspection, tool
break and restart at 1920×1080 with populated log/inventory and enlarged text.
Sol low/medium for the native integration review, small-to-medium effort; done
when the player can identify means, stop cause and next action, keyboard access
preserves work, and reduced motion gives the same facts. Human visual/play
acceptance is separate. No new visual default, mockup or runtime slice selected.


## Corc reference round 2, 2026-10-20: little scenes and physical feedback

**Proposals**, extending V1–V22. [CRL15–CRL26](DESIGN_LESSONS_FOR_OOPS_2026-10-20.md#round-2-2026-10-20-falling-little-ui-reactions-and-fun)
own source qualifications and the new physical/playful examples. UR35/UR38,
UR43/UR48, AD6–AD8 and AD34–AD36 apply. Target 1920×1080; mobile deferred.

| Code | Addition | Default, dial and reason/cost |
|---|---|---|
| V23 | Tiny spatial scene | Show a character and one useful relation, such as height over a ledge. ASCII/SVG/DOM and more elaborate art can coexist. Scene marks move while ordinary controls keep their home. Cost: a binding to real selected progress/state, not a new map or physics engine. |
| V24 | Distinct slip, response and landing | A held pose, debris and a descent can distinguish states. A genuine catch/retreat choice uses a paused decision or declared policy; animation of a settled outcome does not imply a hidden reaction-time challenge. Tone and severity follow actual world/body/recovery rules. |
| V25 | React at the subject | A trailing lost-HP segment, repaired condition accent or taut rope can explain a real change. Choose local/static/reduced treatments per preference. Existing settled-event anchors and receipts own the timing; decoration changes no outcome. |
| V26 | Quiet recent-change cues | Mark which known skill/tool/condition changed meaningfully; summarize on return rather than replay every unattended flash. Density/emphasis are dials. Keep disclosure and row position stable, and avoid restarting a pulse for every routine increase. |
| V27 | Legible toy typography | Test distinctive glyphs with fallback fonts, long names, aligned numbers and enlarged text. Compact aliases retain full identity in stable inspection. Character comes from deliberate typography, not shrinking essential verbs until they fit. |
| V28 | A little actor beside stable actions | A creature may look, stretch or inspect a real newly placed object. Local frequency and style are dials. Keep the ordinary action target stable and keyboard-reachable; a small reaction does not require a companion simulation. |
| V29 | Quiet arrival and familiarity | An earned first overlook can give one supported detail room; revisits show familiar actual changes. Later competence can bypass the old suspense. Use existing discovery/history facts, not universal rewards or a new nostalgia store. |

**ACT NOW (done):** saved the additions and source bindings. **ACCOUNT FOR NOW:**
small local scene motion represents ordinary world activity; it is not a request
for large fourth-wall effects on every action. **LATER / DELEGATE:** CRJ5–CRJ7 in
the linked round have capability, effort, trigger and done checks. A disposable
study compares clean climb, slip and landing at 1920×1080 with static equivalents;
a later native event needs its own rebuilt browser proof. No prototype or runtime
work dispatched, and no current human visual/play acceptance claimed.
