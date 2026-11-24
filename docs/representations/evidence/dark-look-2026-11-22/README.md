# Darker Graphite, on every save (DK1, DK2; 2026-11-22)

Weibao: "consider making the default a more dark arkivia style", then "go ahead". The proposals are DK1 to DK5 in the [walkthrough note](../../../gm/dispatch/play-surface-2026-11-14/PROTAGONIST_WALKTHROUGH_UI_ELEMENTS_2026-11-20.md). Everything here is uncommitted in the primary checkout.

- **DK1, every save moves once.** A save without the new mark (`customization_default: 'graphite-dark-2026-11-22'`) opens in Graphite whatever its look (`moveToDefaultLook`, `src/customization_profiles.js`; called in `src/main.js`).
  - An edited Default look is kept as a profile named "Kept look".
  - A named profile keeps its name.
  - Luminous stays selectable.
  - Before this, only a save whose look was never touched moved, which is why his saves stayed navy.
- **DK2, darker.** The tokens in `styles/ui_tokens.css`:
  - page #161616, panels #262626, stage #1e1e1e;
  - Reports drops its violet slab (#2b2430) for the same dark ground;
  - controls are flat with a thin blue-violet edge, Arkivia's #3a3a8a (`styles/skin_graphite.css`);
  - the stat grid stays plain.

| Check | Result |
| --- | --- |
| `node --test tests/presentation_style.test.js` | 7 passed, including a new DK1 test: an edited Luminous save becomes Graphite with "Kept look", a named profile keeps its name, and a second move changes nothing. |
| [probe.mjs](probe.mjs), Chromium, rebuilt bundle | Exit 0. A fresh game opens in Graphite with page rgb(22,22,22). An old save with an edited navy look opens in Graphite with "Kept look". After save, the mark is written; after reload, it is still Graphite; no page errors. [Log](probe.log) · [fresh 1920](fresh-1920.png) · [fresh 1280](fresh-1280.png) · [old save moved](old-save-moved-1920.png) |

Not covered:
- The Reports filter buttons (Growth, Events…) keep their pale lavender fill.
- The Here rows' Talk and Open buttons stay edgeless under the seam rule.
- Export and import of the customization were not run. The mark rides in the save like the old one did, through the same save part (`src/save_parts.js`).
- One edge case: if the active profile is a named one and an edited "Default" also exists, that Default is replaced by the dark default.
