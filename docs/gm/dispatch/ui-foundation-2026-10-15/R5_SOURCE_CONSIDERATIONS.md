# R5 source comparison and deeper UI considerations

2026-10-15. Proposals remain distinct from accepted direction. Canonical UI conventions: [UI_RULES](../../../UI_RULES.md), especially UR41–48. Rebuilt candidate and validation: [R5 report](R5_REPORT.md).

## Verified source and YAIR differences

Pinned Proto23 SHA256 `a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5`; private source `docs/research/panel-design-2026-10-15/private/proto23.html`. Locators below refer to that exact file. Nine supplied screenshots and hashes are retained under its ignored `private/ui-reference-attachments/` folder. Screenshots are visual evidence, not proof of natural progression or mechanics not inspected in code.

| Code | Actual source | YAIR implication |
|---|---|---|
| F1 | `dscr` near10040, `addDesc` near10361 and `renderItem` near11002 attach floating descriptions. Stat/bar descriptions near9094 and enemy UI near9155 attach richer known explanations. User captures also show Sleep, energy, enemy description and perk-log hover. | Reuse native descriptions across surfaces. Item full-reference route is a YAIR addition; retain it when comparison length or deliberate reading benefits. Hover itself need not open a page. |
| F2 | `global.text.eranks` near191 is an enemy rating ladder. `You.rank()` near7316 computes a large player estimate. `Item` near2189 / `Eqp` near5595 separately own rarity and equipment properties. | Enemy threat, social/world rank, player progression, item quality/rarity and component tier are different measures. No universal ladder or equal-state comparison is established. Label meaning and knownness before exposing a number. |
| F3 | Equipment has stat multipliers, durability/maximum, slot, weapon/attack classes, rarity and other fields. These do not by themselves establish a component assembly mechanic. | YAIR already has `WeaponComponent`, `ShieldComponent`, `ArmorComponent` in `src/items.js` near398/433/455 and component-bearing equipment, quality-derived rarity near148 and component-sensitive keys near245. Native tooltips in `src/display.js` already describe components near628–650 and compare worn equipment near756. Surface that data before proposing another item model. |
| F4 | `Weather` near883, weather entries near888–901 and location/weather updates near13699/13707 drive source location context. | YAIR's existing public clock projection already supplies season, phase, weather and temperature. R5 reorganizes those facts. New environmental mechanics or source weather rules were not imported. |
| F5 | Difficulty choices near11554 call native `area_init` near10744. R5 clicked native Easiest, observed the Straw dummy, ticked native damage, and exercised native pause-next/Resume. | Source fight menu is real. Setup is DEV SEEDED, engine unchanged, natural progression unverified. YAIR's combat engine and encounters were already native; R5 did not add a copied fight system. |

## Prioritized follow-through

| Code | Disposition | Useful next step and boundary |
|---|---|---|
| C1 | ACT NOW, implemented | Subject heading; cleaner You/facts/log; season/weather near location; native effect summary with duration/modifiers; known enemy fact and recorded-message previews, keyboard/Esc. See R5 evidence. |
| C2 | ACCOUNT FOR NOW | Keep duration and real modifiers visible on demand; preserve negative signs, conditional effects and per-target chance direction. For multiple effects the compact name plus count opens the native list. Do not invent source/stacks or enemy statuses when unavailable. |
| C3 | ACCOUNT FOR NOW | Richer item inspection should group identity/capability, native composition, quality/rarity, comparison and use consequences. Capability-bearing books/documents in the reference are a good presentation example, not authorization to copy their story or mechanics. Quality is not world rank. |
| C4 | LATER, proposed | Subject-specific log hovers for actual skill/perk/item/actor references need stable event IDs or recorded payloads. R5 previews the recorded native text and keeps Open as a current-panel command. It does not retrospectively enrich old events with current hidden data. |
| C5 | LATER, proposed | Better reference coverage: active/expired/multiple effects, damage-over-time and immunities if native; victory/defeat/retreat; dense recipe components, trade comparison, journal and settings at larger fonts. Tie subtle VFX to existing settled receipts, preserve plain text and Reduced/Off, and avoid replay on inspection. No new engine or dispatch is selected. |

Inspection alternatives remain available in the prior disposable lab: hover only, hover then pin, stable inspector. Hover then pin is a recommendation, not an accepted default. No nested hover cascade; related pane changes and deliberate full references should coexist as the task needs. Source code review supplies evidence for choosing an interaction, not a mandate to reproduce every source behavior.
