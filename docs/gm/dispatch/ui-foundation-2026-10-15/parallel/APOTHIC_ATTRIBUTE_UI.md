# Apothic Attributes UI pattern and compact YAIR stat inspection

2026-10-15. Read-only bounded primary-source audit following Weibao's new steering: the basic stat area is too large, while deeper inspection should expose subtle stats and their modifiers. No runtime edits, game acquisition/install, browser gameplay, save access, copied external code/assets or worker delegation. Root retains runtime ownership. Source reading is not rendered/native-play acceptance.

## Evidence pinned to the official owner

Official repository: [Shadows-of-Fire/Apothic-Attributes](https://github.com/Shadows-of-Fire/Apothic-Attributes). Current default branch was `26.1`; this audit pins commit `44d0a8316fcb7965c26e8ff7eda341830ca63023` returned by GitHub's tree API. URLs below use that immutable revision. The README identifies this as the attribute library used by Apotheosis and describes an attributes inspector for current values and their modifiers. That is the selected pattern. Gem sockets, affixes, rarity rolls and their gameplay are outside this inspection audit and are not selected YAIR mechanics.

| ID | Verified source pattern | Primary source |
| --- | --- | --- |
| F1 | Compact alphabetical name/current-value rows, scrollable; Hide Unchanged filters by base unequal to current. No text-search control found in the inspected screen. | [AttributesGui.java, refresh/list](https://github.com/Shadows-of-Fire/Apothic-Attributes/blob/44d0a8316fcb7965c26e8ff7eda341830ca63023/src/main/java/dev/shadowsoffire/apothic_attributes/client/AttributesGui.java#L111-L150) |
| F2 | Hover detail shows description, current/base and applicable range; dynamic-base attributes are marked and handled separately. | [AttributesGui.java, tooltip](https://github.com/Shadows-of-Fire/Apothic-Attributes/blob/44d0a8316fcb7965c26e8ff7eda341830ca63023/src/main/java/dev/shadowsoffire/apothic_attributes/client/AttributesGui.java#L207-L256) |
| F3 | Nonzero contributors are grouped by operation: additive, multiplied base and multiplied total; a derived formula follows. This is Minecraft's operation model, not a portable arithmetic assumption. | [AttributesGui.java, contributors/formula](https://github.com/Shadows-of-Fire/Apothic-Attributes/blob/44d0a8316fcb7965c26e8ff7eda341830ca63023/src/main/java/dev/shadowsoffire/apothic_attributes/client/AttributesGui.java#L263-L305) |
| F4 | Source extraction associates modifiers with equipment/effects, and source sorting orders contributors. Labels identify operations and values. | [ModifierSourceType.java](https://github.com/Shadows-of-Fire/Apothic-Attributes/blob/44d0a8316fcb7965c26e8ff7eda341830ca63023/src/main/java/dev/shadowsoffire/apothic_attributes/client/ModifierSourceType.java#L31-L91), [English labels](https://github.com/Shadows-of-Fire/Apothic-Attributes/blob/44d0a8316fcb7965c26e8ff7eda341830ca63023/src/main/resources/assets/apothic_attributes/lang/en_us.json#L2-L17) |
| F5 | Screen rendering scales long names/values down to fixed narrow columns. YAIR should wrap/expand instead, preserving chosen text size. Source colors use attribute-specific direction semantics. | [AttributesGui.java, rows](https://github.com/Shadows-of-Fire/Apothic-Attributes/blob/44d0a8316fcb7965c26e8ff7eda341830ca63023/src/main/java/dev/shadowsoffire/apothic_attributes/client/AttributesGui.java#L332-L374), [value colors](https://github.com/Shadows-of-Fire/Apothic-Attributes/blob/44d0a8316fcb7965c26e8ff7eda341830ca63023/src/main/java/dev/shadowsoffire/apothic_attributes/client/AttributesGui.java#L464-L482) |

These are paraphrased source facts. No screenshots, in-game interaction, modpack compatibility or exhaustive plugin behavior was tested. A search field is a possible YAIR addition, not a verified feature of this source.

## Comparison against current YAIR

| ID | Native YAIR evidence | Implication |
| --- | --- | --- |
| Y1 | `proto23_shell.js` reads the native `.stat_slot_div` rows under `character_stats_div`, normally twelve rows, and clones their actual tooltips. It maintains summary and All-stats views, with six core frame values and another six combat overview entries. | The default You surface can become a large near-duplicate of its expanded inspection. Shrink the always-visible summary before adding more rows there. Twelve normal slots are not a comprehensive domain inventory. |
| Y2 | `display.js`:4046–4124 maintains current values and descriptions; shield changes EP to a compound block chance/strength value. | Preserve native stat names/units and shield shape. AP/EP are ratings; they cannot be relabelled percentages. |
| Y3 | `display.js`:4230–4273 already produces base plus non-neutral flat and multiplicative contributors by native source category. Attack power and defensive points have specialized base/alias handling. | Reuse the native explanation owner. Do not infer decomposition from current minus base, or substitute Minecraft's modifier formula. |
| Y4 | `display.js`:4138–4223 includes native max-health and regeneration/loss breakdowns, max-stamina, efficiency/regeneration and global/hero/skill XP multipliers in existing bar tooltips. `display.js`:4418 includes cold tolerance. | Native subtle facts already exist outside the normal twelve rows. Expose a supported deep inspection path rather than inventing universal stat rows. |
| Y5 | Native breakdowns identify aggregate categories from `stats.flat` and `stats.multiplier`; they do not necessarily identify each individual contributing item/effect. | Source-level gear icons and contributor grouping cannot justify manufacturing per-item attribution. Say Equipment or another native category unless a public owner supplies the actual individual source. |

Current source changed under root ownership during this audit. Hash receipt below identifies the snapshot inspected; root should re-read before applying proposals. Relevant authority remains PROJECT/USER_VISION and UI_RULES UR22–23, UR35, UR37, UR41–43, UR46–48. User's latest steering supersedes any prior agent assumption that automatic screen fitting should fill the default stat area with every available stat.

## Original adapter proposal

**D1 · Compact You core.** Keep vitals and one short core-stat row with the established native attributes and explicit Stats route. Avoid permanent borders around every value, secondary duplicate combat rows and unused vertical padding. Do not shrink the selected font to make the row fit: wrap into a second compact line at 21 px when needed. Equipment/effects retain their useful summaries and explicit paths. Reclaim height for Inventory and stable current context. A wide screen may show an additional meaningful summary only after measuring its benefit; width alone does not mean every advanced stat must be permanently open.

**D2 · Comprehensive inspection in the existing Stats view.** Opening Stats uses the existing preparation/character home and shared expanded controller, with a named bottom Back/Esc and restored selection/scroll. Reuse a compact native name/current list and a selected-stat explanation beside it when space permits; stack the same regions at larger text without changing font size. Hover/focus provides an optional quick peek; clicking/Enter pins the explanation so long formulas and contributor lists can actually be read. One selected stat and one explanation, not twelve expanded cards. Categories distinguish Attributes, Offense, Defense, Resources/recovery and Progression where native projections support them. This is an original layout proposal, not an acceptance claim.

**D3 · Explain base, current and native contributors.** Start with the selected stat's full name, meaning and unit, current value, then its existing breakdown. Show additive signs and native multiplier notation separately. Keep modifier category labels literal. Preserve special attack-power, shield/block and target-context math; do not use one universal formula or assume every larger value is better. Percentage vs percentage-point vs factor must follow each native field's authoritative semantics. Exact min/max, caps, duration, source item and formula appear only if the current public stat/effect owner provides them. Missing attribution stays unavailable; never allocate a residual to a guessed source.

**D4 · Filtering is secondary.** A stable All/Modified control is useful in the deep view only after a structured native baseline/current/contributor projection exists. Source `base != current` is not automatically correct for YAIR: derived attack stats have specialized bases and aggregate fields. The safest first slice labels a filter “Has modifiers” and uses authoritative non-neutral native contributors, not parsed tooltip text or value rounding. A text filter becomes worthwhile when the real native supported rows exceed the small current twelve; it is optional, not a prerequisite. Preserve the selected row while ticking; do not hide or reorder it beneath the pointer because an effect expires. Clear unavailable selection explicitly.

**D5 · Supported depth before universal breadth.** First reuse the twelve native rows plus their tooltips and already-rendered health/stamina/XP/cold explanations. For more subtle stats, add a bounded read-only projection in the existing display owner with IDs, labels, current/base, unit/format and public contributor categories. This projection is presentation data, not an alternate stats engine. Do not enumerate arbitrary character internals into the UI: they may include intermediate, dormant, duplicate or world-private fields. Discovery/appraisal continues to govern opponents; the player's deep inspector does not authorize symmetry or hidden target stats. No gem/socket/affix system is needed to deliver modifier inspection.

## Bounded technical and visual gate

| ID | Exercise | Required evidence |
| --- | --- | --- |
| A1 | Rebuilt fresh synthetic origin at 1366×768 with actual 14/17.5/21 px; compare current default against compact core and deep Stats. | Default You height and Inventory rows, no text shrink, current work/target/Reports intact, deep route and bottom Back reachable. Include same-state side-by-side screenshots. |
| A2 | Inspect an ordinary attribute, derived Attack, crit percentage, AP/EP rating and actual native shield compound row. | Current/base/unit and breakdown preserve native semantics; selected panel and optional hover agree. No fabricated cap or formula. |
| A3 | Native worn gear and buff/debuff case, then a real effect expiry/tick. | Correct public source-category attribution, plain numeric signs/factors, stable selection/scroll/focus. Historical Reports remain historical. Unknown individual contributors are not invented. |
| A4 | Native health/stamina/XP/cold explanations and empty/no-modifier state. | Supported deeper facts match their existing native owners. Neutral or dormant fields are not treated as discoveries. A search/filter, if implemented, never exposes hidden names/counts. |
| A5 | Open Stats from selected Inventory/current work, inspect, Back/Esc. | Actual destination named, prior selection/scroll/tab restored, no engine command, simulation/work/clock/RNG/save mutation caused by inspection. |

ACT NOW: smaller core plus stable native modifier reading. ACCOUNT FOR NOW: derived baselines, operation/units, incomplete individual attribution, live updates and actual larger text. LATER: broad generic attribute registry, mod interoperability and gem/affix gameplay. Root integrates one slice and proves it; this research does not reopen unrelated engine work or accept the result for Weibao.

## Native input hashes

| Path | SHA-256 |
| --- | --- |
| `PROJECT.md` | `fef3c82e88700354f27f63461b84f036ef8786a157fe85e54088ac82cbb8976a` |
| `docs/USER_VISION.md` | `9060f93409a183e234852460f5be1261af86b83d6176796ce8c41407799e5d01` |
| `docs/UI_RULES.md` | `d3ce48569c23eb5198aa3600c12d557cc5684dad14e580e874d389e0e2f2f8a0` |
| `src/proto23_shell.js` | `0ca97116c29a1f53eea9a008f1bb243d6c482913cf53c0e9d35a512d81712d9f` |
| `src/display.js` | `685c322350702a48512f2b8d7260108c51ba56b3aaacb31e3ba5c5b6f081d1e4` |
| `src/center_modes.js` | `28a6d846863eae116747fd87a516edb70174fa10a10ff9dd92fad913a4bf2cf7` |
| `src/workspace_layout.js` | `9a71701818dbc10483e4621ce6b2374458399ad7cb764ade33da85da5fbbda31` |

## R10 implementation handback, 2026-10-15

Root explicitly transferred only `src/proto23_shell.js` for this implementation. The shell now uses one consolidated twelve-value native core grid, retaining labels, units, shield compound Block and native tooltips. Attributes › opens preparation and selects the existing native character Stats tab. The obsolete twelve-row local All-stats catalog and second combat overview were removed. The original native Stats nodes remain attached and authoritative; root owns parity-only CSS suppression of their duplicate display.

`#character_attribute_inspector` is an owned section in the existing `#character_stats_div`, fed by `readPlayerAttributeInspector()` from the separate display owner. Keyed row buttons provide click/Enter and Arrow/Home/End selection. Group and With modifiers filters read structured fields. Selected/focused rows are retained if a live change puts them outside the filter, explicitly noted in the count. The stable detail root shows current/base, native pre-multiplier total, total multiplier and non-neutral source-category rows, with native units/descriptions/availability notes. It preserves its own scroll and only replaces detail text when the selected native model changes. Filter/selection stay in memory across shared Back/Esc; no second controller or saved state was added.

Nonstats shell behavior and the R9 `.enemy-card` hover selector remain. Only the shell file was edited in runtime; no display/CSS/workspace/build/engine/main/save/clock/simulation edit was made by this worker. Root must wire top-level Stats to the native Stats tab when returning from another character tab, and supply styles for the reported class contract. Native API presence was checked after its writer added the export.

Verification: `node --check src/proto23_shell.js` passed. Focused source assertions checked consolidated core, retired catalog, preserved R9 selector, reader import, shared Stats route and absence of local/session storage. These checks do not prove browser geometry, interactive keyboard/focus, native reading stability or gameplay. Root retains build/fresh-origin browser/actual14/17.5/21px and human-feel gates.

Shell handback SHA-256: `ece2128d291a34e7393396daba9c3c530a0ed8c895ed96e3d5bc5c6d78b40600`.
