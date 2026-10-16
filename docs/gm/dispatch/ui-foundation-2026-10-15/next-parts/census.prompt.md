Lane `census`, code prefix CN. Read next-parts/COMMON.md in docs/gm/dispatch/ui-foundation-2026-10-15/ first and obey it.

Task: Part 0 control and symbol census, for the plan only.
- Every player-visible control in every panel, center view, bar and footer of the current UI
  (src/ui modules, src/display.js, src/panel_kit.js, src/village_workspace.js, index.html, main.js wiring).
  Columns: surface, control, owner file:line, effect, changes state (y/n), canonical route,
  discovery/eligibility source, keyboard path, assumed use frequency (label as assumption).
- Visible symbols/glyphs and what they mean (F16): repeated placeholders, ♨, ◈, Material Icons dependency.
- Mark which controls are dev/authoring-only versus player-facing (F17: Authoring, dummy counter).
- Map each control to the Part (1–5) that would move it, and flag duplicates (same job, two routes) versus
  look-alikes with different semantics.
Effort: medium. Done: next-parts/census.md with the census table and the COMMON sections.
