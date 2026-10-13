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
