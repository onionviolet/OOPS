# Color and Proto23 considerations (2026-10-13)

Weibao asked mid-pass: brighter, less muddy color? Is Proto23's UI better?
These are proposals. They are outside the five density slices and change no code.

Later source correction: “no focusable controls” below describes the observed
opening actions, not the whole game. Proto23's deeper inventory assigns focus
and keyboard handlers on mouse entry. [Source follow-up](../../../research/proto23/SOURCE_MECHANISMS_AND_ADOPTION_2026-10-13.md)
owns the exact mechanism and recommends keyboard-first access in adaptations.

## Is Proto23 better?

Better in four things, worse in the frame. Evidence: audit screenshots
`T1_opening_*_proto23.png` and audit section 6.

| Proto23 does better | Keep from the fork instead |
|---|---|
| Saturated, legible color: teal/purple/navy gradients per panel, colored item names (rarity/new), green/red state text | Responsive grid, no horizontal scroll at 1366/1440 |
| One place header: location, season, weather, weekday and clock in a single two-line block above the actions | Keyboard-reachable native actions (Proto23 has no focusable controls) |
| Tall action list that owns the center; prose is just the first row | Usable at 150% zoom (Proto23 clips with no scroll) |
| Full-height message log column | Authoring kept out of play |

A1 already moved toward Proto23's place header (time strip + place name +
clamped prose, no headers in play). A full merge of time into the location
block is a small follow-up if the feel is right.

## Why the current fork looks muddy
- Workspace "warm" theme uses brown-gray surfaces (`#241f1c`, header `#352d26`)
  and low-contrast borders (`#685b4e`). Every panel shares one tone, so nothing
  separates.
- Panel headers, buttons and body share near-equal lightness; the eye gets no
  anchor.
- Native bars (xp/stamina/mana/hp) are fully saturated, so they clash with the
  desaturated frame instead of belonging to it.

## Options (pick any; all reversible, color-only)
- **C1 Brighter accent, cooler surfaces:** surfaces toward Proto23's navy
  (`#16203a`-ish), headers one step lighter, accent stays warm gold for
  focus/active. Biggest effect for least change.
- **C2 Per-role panel tint:** actions, character, records and log each get a
  slight hue (Proto23 style), so regions read at a glance.
- **C3 Semantic text color:** item rarity/new, gains green, losses red,
  money gold, in reports and lists.
- **C4 A "Vivid" theme beside the current one:** keeps the existing look
  selectable; the existing customization/themes system can carry it.
- **C5 Contrast check:** keep body text at WCAG AA (4.5:1) on every new
  surface; the current muted text (`#c4c9da` on warm surfaces) is fine but
  several borders fall under 1.5:1.

Recommendation: C4 carrying C1+C3, as a separate bounded slice after A4, so
the density acceptance is not judged under a moving palette. Say go and it
gets its own pass.


**Update 2026-10-13:** Weibao chose C4 (with C1, C2, C3). Implemented as Layout ▸ Colors ▸ Vivid; see REPORT.md "Vivid color scheme". C5 contrast checks pass.
