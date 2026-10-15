# System inventory

This is a static inventory of the available pinned artifacts, not an inventory of unavailable live server builds. Size signals are physical source lines or indexed objects, not gameplay scope. Identified-only rows are **UNDOCUMENTED** behavior. The private full tracked-file/hash census is `~/.codex/research/asp-text/extract/SOURCE_CENSUS.json`. No semantic completeness is claimed for every source file.

| System | Location | Size signal / prior coverage |
|---|---|---|
| TMT resets/challenges/automation | `js/game.js` | 1299 source lines across 3 files; prior plus targeted read |
| TMT persistence | `js/utils/save.js` | 637 source lines across 2 files; extended read |
| TMT derived cache | `js/technical/temp.js` | 528 source lines across 3 files; prior |
| TMT layer registration | `js/technical/layerSupport.js` | 813 source lines across 3 files; prior |
| TMT particles | `js/technical/particleSystem.js` | 372 source lines across 2 files; new read |
| Profectus persistent refs | `game/persistence.ts` | see locator; no inferred content count; extended deep read |
| Profectus save slots/encoding | `util/save.ts` | see locator; no inferred content count; new deep read |
| Profectus clock | `game/gameLoop.ts` | see locator; no inferred content count; new deep read |
| Profectus global events | `game/events.ts` | see locator; no inferred content count; new read |
| Profectus boards | `game/boards/board.tsx` | see locator; no inferred content count; new deep read |
| Profectus infoboxes | `features/infoboxes/infobox.tsx` | see locator; no inferred content count; new read |
| Profectus requirements | `game/requirements.tsx` | see locator; no inferred content count; prior community pass |
| PT mastery/softcaps | `js/layers.js / js/sc.js` | see locator; no inferred content count; prior |
| Communitree creator hubs | `js/layers` | 12631 source lines across 5 files; prior |

## Available build census

| Snapshot | Tracked files | Commit |
|---|---:|---|
| tmt | 64 | `4d8a86cfb3c59ef3ef4c222f21ef4fbee980c621` |
| prestige-tree | 133 | `cec9198c8ce9a5c6d107179871cbe84fab92ae0d` |
| communitree | 56 | `38efac6d1b9e68db158c260fcb343d1881b29256` |
| profectus | 161 | `d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea` |

## Discovered module and subsystem catalogue

Rows below are mechanically named modules. Size and existence are SHOWN; behavior is UNDOCUMENTED unless a row links to an aspect or prior digest. Deeper payoff is ranked in [DEEPER_SYSTEMS.md](DEEPER_SYSTEMS.md).

| Module / subsystem | Path | Size signal | Documentation |
|---|---|---:|---|
| tmt/demoMod | `tmt/js/Demo/demoMod.js` | 83 lines | **UNDOCUMENTED** remainder / identified only |
| tmt/demoTree | `tmt/js/Demo/demoTree.js` | 54 lines | **UNDOCUMENTED** remainder / identified only |
| tmt/a | `tmt/js/Demo/layers/a.js` | 64 lines | **UNDOCUMENTED** remainder / identified only |
| tmt/c | `tmt/js/Demo/layers/c.js` | 395 lines | **UNDOCUMENTED** remainder / identified only |
| tmt/f | `tmt/js/Demo/layers/f.js` | 146 lines | **UNDOCUMENTED** remainder / identified only |
| tmt/components | `tmt/js/components.js` | 665 lines | **UNDOCUMENTED** remainder / identified only |
| tmt/game | `tmt/js/game.js` | 435 lines | selected ASPECT / prior pass; full semantics may be unread |
| tmt/layers | `tmt/js/layers.js` | 28 lines | selected ASPECT / prior pass; full semantics may be unread |
| tmt/mod | `tmt/js/mod.js` | 77 lines | **UNDOCUMENTED** remainder / identified only |
| tmt/break_eternity | `tmt/js/technical/break_eternity.js` | 3266 lines | **UNDOCUMENTED** remainder / identified only |
| tmt/canvas | `tmt/js/technical/canvas.js` | 88 lines | **UNDOCUMENTED** remainder / identified only |
| tmt/displays | `tmt/js/technical/displays.js` | 197 lines | **UNDOCUMENTED** remainder / identified only |
| tmt/layerSupport | `tmt/js/technical/layerSupport.js` | 293 lines | selected ASPECT / prior pass; full semantics may be unread |
| tmt/loader | `tmt/js/technical/loader.js` | 9 lines | **UNDOCUMENTED** remainder / identified only |
| tmt/particleSystem | `tmt/js/technical/particleSystem.js` | 186 lines | selected ASPECT / prior pass; full semantics may be unread |
| tmt/systemComponents | `tmt/js/technical/systemComponents.js` | 223 lines | **UNDOCUMENTED** remainder / identified only |
| tmt/temp | `tmt/js/technical/temp.js` | 178 lines | selected ASPECT / prior pass; full semantics may be unread |
| tmt/tree | `tmt/js/tree.js` | 22 lines | **UNDOCUMENTED** remainder / identified only |
| tmt/utils | `tmt/js/utils.js` | 411 lines | **UNDOCUMENTED** remainder / identified only |
| tmt/NumberFormating | `tmt/js/utils/NumberFormating.js` | 110 lines | **UNDOCUMENTED** remainder / identified only |
| tmt/easyAccess | `tmt/js/utils/easyAccess.js` | 82 lines | **UNDOCUMENTED** remainder / identified only |
| tmt/options | `tmt/js/utils/options.js` | 81 lines | **UNDOCUMENTED** remainder / identified only |
| tmt/save | `tmt/js/utils/save.js` | 323 lines | selected ASPECT / prior pass; full semantics may be unread |
| tmt/themes | `tmt/js/utils/themes.js` | 51 lines | **UNDOCUMENTED** remainder / identified only |
| prestige-tree/layers | `prestige-tree/js/layers.js` | 9915 lines | selected ASPECT / prior pass; full semantics may be unread |
| prestige-tree/mod | `prestige-tree/js/mod.js` | 134 lines | **UNDOCUMENTED** remainder / identified only |
| prestige-tree/sc | `prestige-tree/js/sc.js` | 435 lines | selected ASPECT / prior pass; full semantics may be unread |
| communitree/aarex | `communitree/js/layers/aarex.js` | 1031 lines | **UNDOCUMENTED** remainder / identified only |
| communitree/acamaeda | `communitree/js/layers/acamaeda.js` | 3165 lines | **UNDOCUMENTED** remainder / identified only |
| communitree/despacit | `communitree/js/layers/despacit.js` | 6101 lines | **UNDOCUMENTED** remainder / identified only |
| communitree/jacorb | `communitree/js/layers/jacorb.js` | 1453 lines | **UNDOCUMENTED** remainder / identified only |
| communitree/thefinaluptake | `communitree/js/layers/thefinaluptake.js` | 881 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/common | `profectus/src/data/common.tsx` | 520 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/prestige | `profectus/src/data/layers/prestige.tsx` | 72 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/projEntry | `profectus/src/data/projEntry.tsx` | 121 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/themes | `profectus/src/data/themes.ts` | 137 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/achievement | `profectus/src/features/achievements/achievement.tsx` | 257 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/bar | `profectus/src/features/bars/bar.tsx` | 109 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/challenge | `profectus/src/features/challenges/challenge.tsx` | 315 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/action | `profectus/src/features/clickables/action.tsx` | 186 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/clickable | `profectus/src/features/clickables/clickable.tsx` | 136 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/repeatable | `profectus/src/features/clickables/repeatable.tsx` | 198 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/upgrade | `profectus/src/features/clickables/upgrade.tsx` | 174 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/conversion | `profectus/src/features/conversion.ts` | 320 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/feature | `profectus/src/features/feature.ts` | 137 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/hotkey | `profectus/src/features/hotkey.tsx` | 137 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/infobox | `profectus/src/features/infoboxes/infobox.tsx` | 79 lines | selected ASPECT / prior pass; full semantics may be unread |
| profectus/links | `profectus/src/features/links/links.tsx` | 54 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/particles | `profectus/src/features/particles/particles.tsx` | 99 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/reset | `profectus/src/features/reset.ts` | 120 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/resource | `profectus/src/features/resources/resource.ts` | 166 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/tab | `profectus/src/features/tabs/tab.ts` | 45 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/tabFamily | `profectus/src/features/tabs/tabFamily.tsx` | 147 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/tree | `profectus/src/features/trees/tree.tsx` | 284 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/board | `profectus/src/game/boards/board.tsx` | 475 lines | selected ASPECT / prior pass; full semantics may be unread |
| profectus/events | `profectus/src/game/events.ts` | 65 lines | selected ASPECT / prior pass; full semantics may be unread |
| profectus/formulas | `profectus/src/game/formulas/formulas.ts` | 1590 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/operations | `profectus/src/game/formulas/operations.ts` | 940 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/types.d | `profectus/src/game/formulas/types.d.ts` | 82 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/gameLoop | `profectus/src/game/gameLoop.ts` | 112 lines | selected ASPECT / prior pass; full semantics may be unread |
| profectus/layers | `profectus/src/game/layers.tsx` | 401 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/modifiers | `profectus/src/game/modifiers.tsx` | 365 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/notifications | `profectus/src/game/notifications.ts` | 54 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/persistence | `profectus/src/game/persistence.ts` | 373 lines | selected ASPECT / prior pass; full semantics may be unread |
| profectus/player | `profectus/src/game/player.ts` | 76 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/requirements | `profectus/src/game/requirements.tsx` | 393 lines | selected ASPECT / prior pass; full semantics may be unread |
| profectus/settings | `profectus/src/game/settings.ts` | 122 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/state | `profectus/src/game/state.ts` | 34 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/break_eternity | `profectus/src/lib/break_eternity.ts` | 2991 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/collapseTransition.d | `profectus/src/lib/collapseTransition.d.ts` | 1 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/lru-cache | `profectus/src/lib/lru-cache.ts` | 138 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/pixi | `profectus/src/lib/pixi.ts` | 4 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/pwa-register.d | `profectus/src/lib/pwa-register.d.ts` | 16 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/vue-panzoom.d | `profectus/src/lib/vue-panzoom.d.ts` | 1 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/vue-textarea-autosize.d | `profectus/src/lib/vue-textarea-autosize.d.ts` | 1 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/main | `profectus/src/main.ts` | 84 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/bonusAmount | `profectus/src/mixins/bonusAmount.ts` | 15 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/bignum | `profectus/src/util/bignum.ts` | 46 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/break_eternity | `profectus/src/util/break_eternity.ts` | 196 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/common | `profectus/src/util/common.ts` | 40 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/computed | `profectus/src/util/computed.ts` | 12 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/galaxy | `profectus/src/util/galaxy.ts` | 185 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/proxies | `profectus/src/util/proxies.ts` | 92 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/save | `profectus/src/util/save.ts` | 206 lines | selected ASPECT / prior pass; full semantics may be unread |
| profectus/vue | `profectus/src/util/vue.tsx` | 187 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/mark | `profectus/src/wrappers/marks/mark.tsx` | 46 lines | **UNDOCUMENTED** remainder / identified only |
| profectus/tooltip | `profectus/src/wrappers/tooltips/tooltip.tsx` | 102 lines | **UNDOCUMENTED** remainder / identified only |

prestige-tree literal addLayer registrations: 38. Includes utility nodes, not a visible panel count.

- `c` at `js/Demo/demoLayers.js`, prior community pass/system-level only.
- `f` at `js/Demo/demoLayers.js`, prior community pass/system-level only.
- `a` at `js/Demo/demoLayers.js`, prior community pass/system-level only.
- `tree-tab` at `js/Demo/demoTree.js`, prior community pass/system-level only.
- `p` at `js/layers.js`, prior community pass/system-level only.
- `b` at `js/layers.js`, prior community pass/system-level only.
- `g` at `js/layers.js`, prior community pass/system-level only.
- `t` at `js/layers.js`, prior community pass/system-level only.
- `e` at `js/layers.js`, prior community pass/system-level only.
- `s` at `js/layers.js`, prior community pass/system-level only.
- `sb` at `js/layers.js`, prior community pass/system-level only.
- `sg` at `js/layers.js`, prior community pass/system-level only.
- `h` at `js/layers.js`, prior community pass/system-level only.
- `q` at `js/layers.js`, prior community pass/system-level only.
- `o` at `js/layers.js`, prior community pass/system-level only.
- `ss` at `js/layers.js`, prior community pass/system-level only.
- `m` at `js/layers.js`, prior community pass/system-level only.
- `ba` at `js/layers.js`, prior community pass/system-level only.
- `ps` at `js/layers.js`, prior community pass/system-level only.
- `hn` at `js/layers.js`, prior community pass/system-level only.
- `n` at `js/layers.js`, prior community pass/system-level only.
- `hs` at `js/layers.js`, prior community pass/system-level only.
- `i` at `js/layers.js`, prior community pass/system-level only.
- `ma` at `js/layers.js`, prior community pass/system-level only.
- `ge` at `js/layers.js`, prior community pass/system-level only.
- `mc` at `js/layers.js`, prior community pass/system-level only.
- `en` at `js/layers.js`, prior community pass/system-level only.
- `ne` at `js/layers.js`, prior community pass/system-level only.
- `id` at `js/layers.js`, prior community pass/system-level only.
- `r` at `js/layers.js`, prior community pass/system-level only.
- `ai` at `js/layers.js`, prior community pass/system-level only.
- `c` at `js/layers.js`, prior community pass/system-level only.
- `a` at `js/layers.js`, prior community pass/system-level only.
- `sc` at `js/layers.js`, prior community pass/system-level only.
- `ab` at `js/layers.js`, prior community pass/system-level only.
- `info-tab` at `js/technical/layerSupport.js`, prior community pass/system-level only.
- `options-tab` at `js/technical/layerSupport.js`, prior community pass/system-level only.
- `tree-tab` at `js/tree.js`, prior community pass/system-level only.

communitree literal addLayer registrations: 9. Includes utility nodes, not a visible panel count.

- `aar` at `js/layers/aarex.js`, prior community pass/system-level only.
- `aca` at `js/layers/acamaeda.js`, prior community pass/system-level only.
- `des` at `js/layers/despacit.js`, prior community pass/system-level only.
- `jac` at `js/layers/jacorb.js`, prior community pass/system-level only.
- `tfu` at `js/layers/thefinaluptake.js`, prior community pass/system-level only.
- `info-tab` at `js/technical/layerSupport.js`, prior community pass/system-level only.
- `options-tab` at `js/technical/layerSupport.js`, prior community pass/system-level only.
- `changelog-tab` at `js/technical/layerSupport.js`, prior community pass/system-level only.
- `tree-tab` at `js/tree.js`, prior community pass/system-level only.
