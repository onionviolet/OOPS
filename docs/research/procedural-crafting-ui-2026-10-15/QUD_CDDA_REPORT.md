# Qud and CDDA ingredient research

2026-10-15. User authorized deeper Qud/CDDA research, ingredient-to-discovery/craft/use traces, UI inspection and full detail preservation. Research only. Canonical gameplay/design owners remain unchanged.

**Later same-day update:** Weibao explicitly authorized installation and requested deeper Qud decompilation, UI implementation details and other procedural aspects. Both apps are now installed; neither was launched. [Installation and extended research](INSTALLATION_AND_EXTENDED_RESEARCH.md) owns that later phase, its version comparison and 212-class Qud archive. The no-installation wording below records the initial source-trace phase.

| Finding | Source-connected result | Detail |
|---|---|---|
| F9 | Qud: raw fruit → jam → generated cooking effect → invented/learned recipe → recooking → actual HP change | [Qud trace](QUD_INGREDIENT_RECIPE_USE.md) |
| F10 | CDDA: autolearn/reference knowledge → selected material/tool requirements → in-progress craft → cooked food → eating → digestion/body nutrients | [CDDA trace](CDDA_INGREDIENT_RECIPE_USE.md) |
| F11 | Recipe generation, acquiring an authored recipe and selecting a substitute are different operations | Both traces preserve their own knowledge, requirement and effect routes |
| F12 | Eligibility and actual use can disagree; source/UI labels alone are insufficient | CDDA's selected salt seasoning is group-listed but rejected by the ordinary actor's edibility check in this revision |
| F13 | UI can expose ingredient possibilities and means/cost/output together, but images must stay version-qualified | [Captioned UI evidence](QUD_CDDA_UI_EVIDENCE.md) |

Qud's strongest reusable principle is a recorded combination of trigger, action and required ingredients, reaching a real effect consumer. CDDA's is a preparation tied to actual materials, qualifying tools, available knowledge and retained work. These are comparisons, not accepted YAIR laws. A useful recipe discovery can change a method, cost, supplier or available means without inventing a new effect; no universal random-mixture engine is proposed here.

## Reference archive

[Private archive](private/qud-cdda/README.md) indexes complete selected decompiled Qud classes, original XML, normalized food/domain catalogs, complete CDDA source files and selected JSON tables, 195 directly matching recipes, exact interface literals, source locators, UI originals/captures and provenance/validation receipts. Raw source is gitignored and was not committed. The local CDDA revision is pinned; Qud's supplied assembly is pinned separately. None of the screenshots proves parity with those exact source inputs.

## Checks and boundary

Validation checks source hashes, selected JSON parsing, normalized-table counts, source-symbol locators, successful corrected decompilation outputs, private ignore coverage and local report links. No build or gameplay tests are relevant to this documentation-only pass. Neither source game was run, and no source library, personal save, runtime file, shared design owner or billing setting was changed. No workers or new chats were dispatched.

The two chains close statically through actual game-state consumers. Native acquisition/crafting/use, save/reload and keyboard/layout acceptance remain untested. This research is ready for reference; it does not establish implementation or human acceptance.
