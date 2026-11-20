---
paths:
  - "src/ui/**"
  - "src/**/*_ui.js"
  - "style.css"
  - "styles/**"
  - "index.html"
  - "ui-preview.html"
  - "docs/UI_RULES.md"
  - "prototypes/**"
  - "docs/MOCKUP_SYSTEM.md"
---

Player-facing UI follows [UI rules](docs/UI_RULES.md). Start at its checklist
and reading order; read the codes your task names. Status of each range lives
in the [rules index](docs/RULES_INDEX.md), not here.

Always:
- Declare the surface type and home. Open centre views through the shared
  controller with a bottom back bar and Esc. Keep the full-height log column.
- Draw through `src/ui/kit.js` and the tokens in `styles/ui_tokens.css`; never
  raise the counts in `tests/ui_style_ratchet.test.js` (UR6, UR163).
- Where YAIR has a form, it is the default; draw a thing once (UR158, UR167).
  A tied variant ships as a Display › Look choice (UR169).
- Give any added or changed control, readout or overlay its element-sheet row
  and a state sheet (UR100–UR127).
- Explain the subject and effect first; no developer words (UR70–UR75).
- Scenes, choices, travel and Reports lines: SUI1–SUI19, RPT1–RPT14.
- Judge on a populated save at 1920×1080 with the real font, and run
  `npm run check:flow` for layout, movement and drawn-twice findings.

UI mocks are real-code `mock/<topic>-<date>` branches from a scenario save
([MW9](docs/MOCKUP_SYSTEM.md#standing-rules)); no new standalone pages under
`prototypes/`. Lane briefs that touch UI link UI_RULES.
