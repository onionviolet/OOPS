---
paths:
  - "src/ui/**"
  - "src/**/*_ui.js"
  - "style.css"
  - "styles/**"
  - "index.html"
  - "ui-preview.html"
  - "docs/UI_RULES.md"
---

Player-facing UI also follows [UI rules](docs/UI_RULES.md) (2026-10-15): declare
a surface type and home, use shared tokens (spacing from the UR65 scale) and components, own your node, open
center views through the shared controller with a bottom back bar and Esc, keep
the log column intact, give features in-world logic, and check discoverability
on a populated save at the 1920×1080 primary target
(viewport targets in UI_RULES, 2026-10-17; the 1366×768 floor was retired 2026-10-19). Choose the appropriate panel/navigation scope;
not every view opens in the lower center. Follow UR41–UR49 for disclosure,
hover/pinned inspection, clean logs/hierarchy and faithful reference evidence.
Lane briefs that touch UI link that file.
For reference-informed design, apply UR59–UR64 and the linked Discord guide:
retain source context, typography roles, meter meaning, subject-bound reactions,
visible work intent and meaningful summaries. The UI_RULES reference-routing
table keeps the detailed examples; source mechanics and unresolved claims do
not become universal rules.
