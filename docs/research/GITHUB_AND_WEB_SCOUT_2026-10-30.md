# GitHub and web scout, 2026-10-30

Lane `bk-scout` of the book UI wave. Research only: nothing installed, no dependency added, no code downloaded; pages and registry metadata were read. This is a proposal list, not a dependency selection or accepted direction. It extends [LIBRARIES_TO_INCORPORATE_2026-10-14](LIBRARIES_TO_INCORPORATE_2026-10-14.md) (state, signals, ECS, schema, RNG, audio, tests: not redone here), [PANEL_DESIGN_ABSORPTION_2026-10-15](PANEL_DESIGN_ABSORPTION_2026-10-15.md) (panel references G1-G7: not redone), [MINECRAFT_MODPACK_SCOUT report](MINECRAFT_MODPACK_SCOUT_2026-10-14-report.md), [IDLE_AND_SIM_ENGINE_REFERENCES](IDLE_AND_SIM_ENGINE_REFERENCES_2026-10-14.md) and [ENGINES_AND_FRAMEWORKS_CATALOG](ENGINES_AND_FRAMEWORKS_CATALOG_2026-10-14.md). Those did not cover docking, virtual lists, command palette, tooltips, graph layout, timeline, focus handling or save diffing; this pass fills that gap.

Evidence labels: **VERIFIED** = read from the npm registry (`npm view`, registry JSON) or the GitHub API/raw file on 2026-10-30. **INFERRED** = fit, cost and gap mapping are my judgment. Licence column is the registry/API licence unless noted. Stack: vanilla ESM, esbuild bundle, Electron; current runtime deps are only `inkjs` ([package.json](../../package.json)). "Serves" uses the real codes: UR rules from [UI_RULES](../UI_RULES.md), GM/G/L13 codes from the [reading gap map](READING_GAP_MAP_2026-10-28.md) and the wave plan (`docs/gm/dispatch/book-ui-wave-2026-10-30/PLAN.md`), and the `docs/representations/*.md` views. M2/M3/M5 are the panel doc's constraints. Target viewport for every done check is 1920×1080 on a populated save (1366×768 retired 2026-10-19 per UR14); also check 1536×864. Mobile is deferred.

## Ranked top 10 (adoption candidates, INFERRED ranking)

Order is by value to a dense desktop UI per integration effort. Each "done check" is for a later single slice at 1920×1080 on a populated save, rebuilt bundle, fresh origin, per AGENTS.md; each records bundle-size delta (esbuild minified+gzip) before keeping the dependency.

Level = the model tier for the adoption slice (AD36/AU5 convention): sonnet for code, haiku for mechanical sweeps, opus not needed. Effort is the slice size.

| Rank | Item | Serves (codes) | Level / effort | Done check |
| --- | --- | --- | --- | --- |
| 1 | **dockview** (docking, tabs, floating panels, layout save); trial behind a flag | UR24 expand, UR30 same header, UR17 saved layouts, UR9/UR8 (must coexist with the one center-mode controller and `definePanel`; a conflict means skip), all `rep-*` views | sonnet; M (2-4 days) Trial behind a flag; M (2-4 days) | Three existing panels dock, split, float and tab; `toJSON`/`fromJSON` restores arrangement after reload; Tab/arrow keyboard reaches every tab; bundle delta recorded; panels still project the same state (no duplicate owner, M2) |
| 2 | **@tanstack/virtual-core** (virtual list/table core); adopt candidate | UR27 long lists keep bearings, UR25 scroll budget; People, inventory, log | sonnet; S-M Adopt candidate; S-M | The largest people/item/log list scrolls 5k+ rows at stable row identity (M5), selection and scroll survive a tick, keyboard Up/Down/PageDown work; no change to the data owner |
| 3 | **Command palette from @leeoniya/ufuzzy + tinykeys**; adopt candidate | UR28 quick jump, UR31 shortcuts, UR80 lenses narrow knowledge, UR21; G18 `whoKnows` | sonnet; S Adopt candidate; S | Ctrl/Cmd+K opens a palette listing only observer-known destinations and actions (M3); typing "ap" ranks Apothecary; Enter routes via the existing UR21 route; Esc returns focus to the prior element |
| 4 | **@floating-ui/dom** (tooltip/popover positioning); adopt candidate | UR43 preview vs pinned vs reference, UR7 shared tooltip, UR70-UR75 descriptions | sonnet; S Adopt candidate; S | Nested tooltip (item tooltip containing a term tooltip) stays inside the viewport at all four edges, opens on focus as well as hover, closes on Esc and on panel repaint (no orphans) |
| 5 | **@dagrejs/dagre** (DAG layout); trial | Abilities with no hardcoded path (round 5; rung graphs from `book_world_lotm_pathways.js` descriptors), ladder bridge (bk-ss), GM6 institution trees (bk-benefits) | sonnet; S-M Trial; S-M | One quest/tech/lineage tree renders left-to-right with no crossing-order surprises across re-layouts; unknown nodes absent; nodes focusable and linked to their detail view |
| 6 | **Recipe-and-usage lookup pattern (JEI/EMI/Factoriopedia)**, own implementation, no dependency; design adoption | UR21, UR22 back stack, UR23 return restores place, UR29 notices link, UR80; G17 `learnView` | sonnet; M Design adoption; M | From any known item, "made by / used in" lists open the exact recipe, filtered by what the observer knows (M3); Back returns to the same scroll and selection |
| 7 | **microdiff or jsondiffpatch** (save diff and inspector); trial | UR16/UR17 proof and saves-first; L13 bridge checks, AD43 floor receipts | haiku for the sweep, sonnet for the tool; S Trial; S | Two saves from consecutive ticks diff to a readable path-level list in a dev inspector; deterministic output; import/export untouched |
| 8 | **focus-trap + tabbable** with the W3C ARIA Authoring Practices patterns; adopt candidate | UR33 larger text and reachability, UR5 full screens vs confirms, UR31 | sonnet; S Adopt candidate; S | Modal and expanded-center views trap focus, Esc restores the opener, and a keyboard-only pass reaches every command in one slice |
| 9 | **Codex/guidebook renderer: markdown-it + Patchouli-style page templates** (own templates); design adoption | UR71, UR72, UR73-UR75; reference-type representation views | sonnet; M Design adoption; M | One codex chapter loads from data (text, recipe, entity, link page types), renders with working cross-links, and unknown entries do not appear |
| 10 | **mistreevous** (behaviour trees, MIT) for NPC job choice; trial | bk-party P5 allies by goals and orders (`tempo_allies`, `companion_wishes`); UR81 stops explain themselves | sonnet; M Trial after UI items; M | One NPC routine expressed as a tree runs headless with a seeded RNG, produces the same decisions twice, and shows a reason string a panel can display |

Order of everything else, plainly: after the top 10, rank is (a) cytoscape, (b) golden-layout, (c) json-rules-engine, (d) Fuse.js / MiniSearch / FlexSearch as fuzzy-search fallbacks, (e) vis-timeline, (f) elkjs, then reference-only games and mods in the order they appear in the tables below, then skips. Rows marked reference-only in the tables are read for ideas and never copied.

## UI building blocks

| Item | Link | Licence | Last activity | Size | Serves | Fit / integration cost | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| dockview (`dockview` 8.8.2 depends only on `dockview-core` ^8.8.2) | [repo](https://github.com/dockview/dockview), [docs](https://dockview.dev/docs/overview/introduction) | MIT (npm; GitHub API reports NOASSERTION) | npm 2026-10-29; 3.5k stars | unpacked 5.7 MB incl. maps; min size unmeasured | Dockable multi-panel desktop layout, saved arrangements (representation views, UR21) | Vanilla TS API with floating panels, popouts, grids and `toJSON`/`fromJSON` per docs (search summary of docs). Our panels are DOM, so each needs a mount adapter. Medium, plus CSS theme work to match Proto23 frame | **Adopt candidate (trial)** |
| golden-layout | [repo](https://github.com/golden-layout/golden-layout) | MIT | npm 2.6.0 dated 2023-02-21; repo push 2026-09-12; 6.7k stars | 2.0 MB unpacked | Same as dockview | Vanilla; older release cadence | Reference/fallback |
| FlexLayout (`flexlayout-react`) | [repo](https://github.com/caplin/FlexLayout) | MIT | 2026-10-21 | n/a | Same | React-only (INFERRED from package name; not read) | Skip |
| @tanstack/virtual-core | [repo](https://github.com/TanStack/virtual) | MIT | npm 3.19.9, 2026-10-29 | 656 KB unpacked | Long lists/tables/logs, stable rows (M5) | Framework-agnostic core; we supply the DOM. Low-medium | **Adopt candidate** |
| @tanstack/table-core family | [repo](https://github.com/TanStack/table) | MIT | 2026-10-21; 28k stars | not measured | Sort/filter/group headless tables | Fits dense tables; only if hand-rolled sorting becomes a burden | Reference until needed |
| @leeoniya/ufuzzy | [repo](https://github.com/leeoniya/uFuzzy) | MIT | npm 1.0.19, 2025-08-22; push 2026-09-08 | 135 KB unpacked | Command palette, search-as-you-type | Zero-dependency, vanilla. Low | **Adopt candidate** |
| tinykeys | [repo](https://github.com/jamiebuilds/tinykeys) | MIT | npm 4.0.1, 2026-09-25 | 78 KB unpacked | Keyboard shortcut/chord binding | Vanilla, tiny. Low | **Adopt candidate** |
| ninja-keys | [npm](https://www.npmjs.com/package/ninja-keys) | MIT | 2022-07-01 | 163 KB | Ready-made palette web component | Stale; custom palette from uFuzzy is simpler | Skip |
| Fuse.js, MiniSearch, FlexSearch | [Fuse](https://github.com/krisk/Fuse), [MiniSearch](https://github.com/lucaong/minisearch), [FlexSearch](https://github.com/nextapps-de/flexsearch) | Apache-2.0, MIT, Apache-2.0 | Fuse push 2026-08-09; MiniSearch 2025-09; FlexSearch 2026-06 | MiniSearch 827 KB unpacked | Full-text index over codex/log if fuzzy match is not enough | Fine; MiniSearch for indexed prose | Fallback |
| @floating-ui/dom | [repo](https://github.com/floating-ui/floating-ui) | MIT | npm 1.8.0 (2026-07-11); push 2026-10-27 | 174 KB unpacked | Nested tooltips, popovers, menus | Vanilla DOM package, collision/flip handled. Low | **Adopt candidate** |
| tippy.js | [npm](https://www.npmjs.com/package/tippy.js) | MIT | 2025-06-09 | 2.1 MB unpacked | Tooltips | Built on the older Popper; floating-ui is the successor line (INFERRED) | Skip |
| focus-trap, tabbable | [focus-trap](https://github.com/focus-trap/focus-trap), [tabbable](https://github.com/focus-trap/tabbable) | MIT | 2026-10-26, 2026-10-24 | 850 KB, 424 KB unpacked | Modals, expanded views, keyboard order | Vanilla. Low | **Adopt candidate** |
| W3C ARIA Authoring Practices | [apg](https://www.w3.org/WAI/ARIA/apg/) | W3C docs | n/a | n/a | Tabs, tree, listbox, dialog, combobox keyboard patterns | Spec reference, not read in this pass beyond its known scope (INFERRED) | Reference |
| @dagrejs/dagre | [repo](https://github.com/dagrejs/dagre) | MIT | npm 3.1.3, 2026-10-24; 5.8k stars | 1.4 MB unpacked | Quest, tech and lineage trees | Layout only; we draw SVG/DOM. Low-medium | **Adopt candidate (trial)** |
| cytoscape | [repo](https://github.com/cytoscape/cytoscape.js) | MIT | npm 3.34.4, 2026-10-15 | 5.7 MB unpacked | Interactive relation graphs (people, factions, recipe webs) | Full graph engine with its own rendering; heavy for trees, good for webs | Fallback / second wave |
| elkjs | [repo](https://github.com/kieler/elkjs) | **EPL-2.0 OR GPL-3.0-or-later** (npm) | 2026-10-28 | 8.2 MB unpacked | Layered layout with ports | Weak copyleft; EPL file-level obligations if modified. Strong layout quality | Reference-only until a licence call is made |
| vis-timeline | [repo](https://github.com/visjs/vis-timeline) | Apache-2.0 OR MIT (npm) | 2026-10-26 | 77.7 MB unpacked | Timeline/calendar of life events | Very heavy package for one view (unpacked size only; bundle unmeasured) | Fallback; a hand-built timeline is likely cheaper |
| sigma, uPlot, mermaid, rete | [sigma](https://www.npmjs.com/package/sigma), [uPlot](https://www.npmjs.com/package/uplot), [mermaid](https://www.npmjs.com/package/mermaid), [rete](https://www.npmjs.com/package/rete) | MIT each | sigma 2026-10-27; uPlot 2025-03; mermaid 2026-10 (122 MB); rete 2025-06 | varies | Big graphs / small charts / diagrams / node editors | No present need | Skip |
| Dear ImGui (design reference) | [repo](https://github.com/ocornut/imgui) | MIT | 2026-10-29; 77k stars | n/a | Dense tool-window conventions: dockable panes, tables, filters | C++ immediate mode; cannot be used, but a good tool-density model (INFERRED) | Reference only |

## Game-data patterns (Minecraft and others)

| Item | Link | Licence | Last activity | What to take | Verdict |
| --- | --- | --- | --- | --- | --- |
| JEI (Just Enough Items) | [repo](https://github.com/mezz/JustEnoughItems) | MIT | 2026-10-29 | Click an item to see recipes that make it and recipes that use it; bookmarks. Description from GitHub: "Item and Recipe viewing mod for Minecraft". Pattern for rank-6 item. Java; no code reuse | Reference (pattern) |
| EMI | [repo](https://github.com/emilyploszaj/emi) | MIT | 2026-08-18 | "A featureful and accessible item and recipe viewer" (GitHub description). Recipe trees, favourites, search syntax. Pattern only | Reference (pattern) |
| Factorio Factoriopedia | [FFF-397](https://factorio.com/blog/post/fff-397), [FFF-400](https://factorio.com/blog/post/fff-400) | Blog posts | already read in the 2026-10-15 panel doc (G5) | Not redone | Already referenced |
| Patchouli (guidebook mod) | [repo](https://github.com/VazkiiMods/Patchouli) | **CC BY-NC-SA 3.0 (LICENSE file read)** | 2026-07-10 | Data-driven book: categories, entries, typed page templates (text, crafting, spotlight, entity, link), unlock advancements. Pattern for rank 9 | **Reference only** (NC-SA, no copying text or assets) |
| FTB Quests | [repo](https://github.com/FTBTeam/FTB-Quests) | Repository ships `LICENCE.md`; I could not read its terms through the API, so unknown | 2026-10-30 | Quest chapters as a node graph with dependencies, free-position nodes, rewards, visibility tied to team progress. Existing pack samples already studied in the Minecraft scout | Reference only |
| Existing pack samples | [Minecraft scout](MINECRAFT_MODPACK_SCOUT_2026-10-14-report.md) | n/a | 2026-10-14 | Quest/recipe data readable as plain files; not redone | Already covered |
| jsondiffpatch | [repo](https://github.com/benjamine/jsondiffpatch) | MIT (npm) | npm 0.7.7, 2026-10-29 | Delta objects plus readable HTML/console formatters for the save inspector | Trial (rank 7 alternative) |
| microdiff | [npm](https://www.npmjs.com/package/microdiff) | MIT | 1.6.0, 2026-08-02 | 14 KB unpacked; flat list of path-level changes. Cheapest option | Trial (rank 7) |
| fast-json-patch | [npm](https://www.npmjs.com/package/fast-json-patch) | MIT | 2022-06 | RFC 6902 patches | Skip (stale) |
| markdown-it | [npm](https://www.npmjs.com/package/markdown-it) | MIT | 15.0.3, 2026-10-16 | Codex text rendering with plugin hooks; marked is the alternative (MIT per npm) | Adopt candidate (rank 9) |

## Open idle and sim games

Existing profiles of Antimatter Dimensions, Kittens, Melvor, Evolve, Trimps, Cookie Clicker, DF, RimWorld, CDDA, Qud and Factorio are in [IDLE_AND_SIM_ENGINE_REFERENCES](IDLE_AND_SIM_ENGINE_REFERENCES_2026-10-14.md). Only licence and activity are refreshed here, because licence decides what may be copied.

| Game | Link | Licence (VERIFIED) | Last push | Use for us |
| --- | --- | --- | --- | --- |
| Antimatter Dimensions | [repo](https://github.com/IvarK/AntimatterDimensionsSourceCode) | MIT | 2026-07-17 | Only MIT game here; code could be borrowed with attribution. UI update-flush pattern already ranked in the engines catalog (P1) |
| Progress Knight | [repo](https://github.com/ihtasham42/progress-knight) | Unlicense | 2023-08-20 | Public domain; tiny job-and-skill tab UI as reference |
| Kittens Game | [repo](https://github.com/nuclear-unicorn/kittensgame) | "WET PAWS" licence: personal/educational changes only, no commercial gain or derivative works (license.txt read) | 2026-10-26 | **Reference only** |
| Evolve | [repo](https://github.com/pmotschmann/Evolve) | MPL-2.0 | 2026-10-16 | File-level copyleft; read for dense tab/tooltips design, do not copy |
| Trimps | [repo](https://github.com/Trimps/Trimps.github.io) | GPL-2.0 | 2025-03-12 | Reference only |
| Unciv | [repo](https://github.com/yairm210/Unciv) | MPL-2.0 | 2026-10-29 | Moddable JSON rules for a 4X; ideas for data-driven rule packs and civilopedia. Reference only |
| Cataclysm: DDA | [repo](https://github.com/CleverRaven/Cataclysm-DDA) | CC BY-SA 3.0 (LICENSE.txt read) | 2026-10-30 | JSON-defined content with `copy-from` inheritance and mod folders. Reference only |
| Bitburner | [repo](https://github.com/bitburner-official/bitburner-src) | NOASSERTION (not read) | 2026-10-29 | Already used for tail windows (G6); reference |
| Break Infinity | [repo](https://github.com/Patashu/break_infinity.js) | MIT | 2025-08-26 | Already in LB table (L20) |

## Simulation, rules and writing tools

| Item | Link | Licence | Last activity | Verdict |
| --- | --- | --- | --- | --- |
| mistreevous (behaviour trees; text/JSON definitions INFERRED, README not read) | [repo](https://github.com/nikkorn/mistreevous) | MIT | repo push 2026-10-11; npm 4.3.1, 2025-07-24 | Trial for NPC routines (rank 10); small. Capabilities beyond licence/date are INFERRED from the name and README I did not read |
| json-rules-engine | [npm](https://www.npmjs.com/package/json-rules-engine) | ISC | 7.3.1, 2025-02-20 | Fallback if data-driven eligibility rules outgrow our predicate code |
| xstate | [npm](https://www.npmjs.com/package/xstate) | MIT | 5.33.3, 2026-10-29 | Already ranked P9 in the engines catalog; pattern-first |
| yuka, rot.js, pure-rand, tracery-grammar, miniplex, bitecs | see LIBRARIES table | various | n/a | Already covered; not repeated |
| seedrandom | [npm](https://www.npmjs.com/package/seedrandom) | MIT | 2022-06 | Skip; pure-rand (L14) is current |
| behaviortree, behavior3js | [npm](https://www.npmjs.com/package/behaviortree) | MIT | 3.0.0-beta.1 (2026-03); 2022 | Skip |
| d3-hierarchy, d3-force | npm | ISC | 2022 | Fallback layouts if dagre is not enough; stable but unmaintained releases |
| GitHub searches for "quest tree editor", "ink inkle editor web", "game save diff viewer json", "worldbuilding wiki self-hosted" | `gh search repos` | n/a | 2026-10-30 | Searched, empty. Lore and writing tools stay covered by the existing ink/Tracery/Dendry/Yarn catalog |
| Utility AI (GitHub "utility ai", TypeScript) | [esengine/BehaviourTree-ai](https://github.com/esengine/BehaviourTree-ai) | MIT | 2026-02-23; 151 stars | Only hit with traction is a behaviour-tree library; the utility-AI repos found are tiny. Pattern first: score actions by considerations in our own code. Skip libraries |
| Melvor-like clones | [MelvorIdle/melvoridle.github.io](https://github.com/MelvorIdle/melvoridle.github.io) | no licence in API | 2025-08-13; 134 stars | No licence means all rights reserved: reference only. Other hits are GPL-3.0 mods. Melvor UI stays with panel doc G2 |

## Talks and design essays

Search coverage was thin; these are leads, not findings.

| Lead | Link | Status |
| --- | --- | --- |
| Chris King, "History and Game Design", GDC 2016, tagged Paradox in the GDC Vault listing | [GDC Vault 1023446](https://gdcvault.com/play/1023446) (page reachable, HTTP 200; content not read; the search hit naming Paradox was a sub-page) | Abstract does not say it is about UI density. Not watched. Weak lead |
| Game Developer: "UI strategy game design dos and don'ts" | [article](https://www.gamedeveloper.com/design/ui-strategy-game-design-dos-and-don-ts) | Search snippet only: argues good UI avoids overloading the player even though more information aids understanding. Not read in full |
| GDC 2024 UX Summit: immersive UI for Star Wars Jedi: Survivor | [session](https://schedule.gdconf.com/session/ux-summit-designing-immersive-ui-for-star-wars-jedi-survivor/901582) | Diegetic UI; low fit for dense desktop panels |
| Dwarf Fortress Steam UI (mouse support, scaling menus, workshop task queues) | [PCGamesN](https://www.pcgamesn.com/dwarf-fortress/menus), [PC Gamer](https://pcgamer.com/the-new-dwarf-fortress-ui-looks-so-much-better), [Gamasutra](https://www.Gamasutra.Com/programming/how-tarn-adams-upgraded-and-optimized-dwarf-fortress-for-its-official-steam-release) | Press coverage read through search snippets only. Takeaway (INFERRED fit): keep the keyboard route when adding mouse |
| Paradox EU4 UI preview | [PC Gamer](https://www.pcgamer.com/uk/europa-universalis-4-preview) | Snippet: merging information into one interface; press preview |
| RimWorld: "Contrarian, Ridiculous, and Impossible Design Methods" (Sylvester, GDC 2017) | [GDC Vault](https://gdcvault.com/play/1024232/-RimWorld-Contrarian-Ridiculous-and) | Design-philosophy talk, not a UI talk (search snippet). Searched for a RimWorld UI talk: none found |
| RimWorld console port UI (grid UI, "never more than three button presses away") | [DualShockers interview](https://www.dualshockers.com/bringing-rimworld-from-pc-to-console-interview/) | Search snippet only. Says the PC UI was tightly entangled with game logic, a caution for UR35 (inspection free, actions explicit) |

## Gaps and next steps

- Not verified: dockview bundle size, FTB Quests licence terms, mistreevous feature set, any talk's content. Rank 1 depends on a size and CSS-fit probe, which should be the first action of the adoption slice, run in a scratch directory.
- Sessions to consume (linked list, 2026-10-30): [bk-ui-directions](#local_4a85e652-a03b-429f-a541-359491f775a1) takes 1 (dockview), 4 (tooltips), 8 (focus); [bk-gaps](#local_ca305716-7886-46a3-a6b3-5b64430acac9) takes 2 (virtual lists), 3 (palette); [bk-benefits](#local_cf3a9013-a44b-4b92-b818-40117d1f0480) takes 5 (dagre for institution trees); [bk-party](#local_02186e56-4bb4-45fb-82c7-00d498e5edb1) takes 10 (behaviour trees); 6, 7 and 9 have no lane and go to the General UI coordinator's queue.
- Registry pointers: added a short "UI building blocks" section to LIBRARIES_TO_INCORPORATE. TOOL_REGISTRY.md is for launchers of extraction/verification tools, so it gets a one-line pointer only.
