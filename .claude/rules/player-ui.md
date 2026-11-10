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
Scenes, choices, travel and Reports lines also follow SUI1-SUI19 and RPT1-RPT14
(SUI1-SUI19 and RPT1-RPT12 binding defaults 2026-10-28; RPT13-RPT14 standing
2026-10-30, in the "Scene and report rules" section of docs/UI_RULES.md; routed from the rules index).
For reference-informed design, apply UR59–UR64 and the linked Discord guide:
retain source context, typography roles, meter meaning, subject-bound reactions,
visible work intent and meaningful summaries. The UI_RULES reference-routing
table keeps the detailed examples; source mechanics and unresolved claims do
not become universal rules.

For descriptions, apply UR70–UR75: explain the subject and practical effect first,
use concise narrative for traits and world flavor, then support it with real
current effects and useful calculations. Trace claims to actual consumers and
known state. Keep implementation notes in developer docs and reuse the owning
subject's meaning across surfaces.

UI/prose reconciliation (2026-11-04, AD40): apply existing UR53/57/60/62/64/66/70–74 and DESIGN DSG3/5/13 for task composition, editorial roles, cadence, usable targets/focus and truthful feedback. UI/narrator/flavor whimsy does not assign a character personality, motive, knowledge or behavior. Keep world/scene/player dials and decorative freedom; risk-scaled journey checks stay under AD36, with no bulk prose or all-world redesign gate.

For a small fix, start at the checklist at the top of docs/UI_RULES.md. UR76–UR82 and
UIV1–UIV4, UIV6, UIV7 are proposed, in use as the default (CHOICES item 4, 2026-10-30);
cite them as proposed.

What the 2026-11-10 rulebooks need on screen: UR83–UR88 in docs/UI_RULES.md (working defaults under AD56; UR88 notice tiers held for Weibao). Forewarn a coming loss the character could know, give each known fact its source, day and freshness in one entry shape, let a means add a readout, mark acts the player did not choose, and keep other lives one click away.
