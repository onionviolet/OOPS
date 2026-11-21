# Combat feel pass

## November 21 corrections

**MT1 and MT2.** An eight-opponent pack opens with two visible entries. Each opponent reserves a compact row up to the room above the moves, with a six-row minimum. During five Quick strikes, the visible entries grew from two to seven. The test measured the top of the move strip and the Quick strike button after each painted turn. Target selection kept focus, scroll and the existing fighter and group nodes. The health words sat at the left inset on both kinds of row. The reference diffs were `3edfaeb2d`, `4b752f611` and `a2e137432`. [Browser check](../../../../tests/combat_situation_page.browser.mjs) · [All twelve position samples](strip-positions.json)

| Viewport | Rows reserved | Roster height | Strip y at open / after five | Quick strike y at open / after five | Screenshots |
| --- | ---: | ---: | ---: | ---: | --- |
| 1920×1080 | 8 | 457 px | 586.71875 / 586.71875 px | 588.71875 / 588.71875 px | [Open](mt1-1920-open.png) · [After five](mt1-1920-after-five.png) |
| 1280×800 | 6 | 344 px | 473.71875 / 473.71875 px | 475.71875 / 475.71875 px | [Open](mt1-1280-open.png) · [After five](mt1-1280-after-five.png) |

**MT3.** In the training-yard fixture, pressing Brace let the injured rival brace and the Jade adept raise White Jade skin. Their rows read “Standing · Guarding” and “Standing · Warded”. Each word fit beside the fighter's name and exposed the observed action on hover. The Hero panel showed the player's own guard. Save, reload and file export/import preserved both defences. A hit cleared the adept's ward. A miss left the rival guarding, and a subsequent hit cleared the word. [Guarded rows at 1920](guarded-row.png) · [Guarded rows at 1280](guarded-row-1280.png)

**Target-only splits across restore remain blocked by MC3.** At turn zero, the pack opened on Wolf rat G. Choosing the fold selected H and then A, and both stayed separate after returning to G. The four manual saves contained byte-identical 5,213-byte player fight sessions. Reload and file import each restored G as the lowest-HP target and folded H and A again. The card owns the manual selection in memory. The engine computes its default target from live HP, and a selection spends no beat or hit. The existing fields cannot distinguish those histories. The smallest proposed save change is one optional `distinguished: true` bit on each fighter that first splits, including a free target choice. Absence would preserve compatibility with older saves.

| Correction check | Result |
| --- | --- |
| `node build.js` in an isolated copy of the shared working tree | Exit 0. Bundle SHA-256 `21ea42a423446cb1c54faf5478b1aaacd03e9406fa6e3ab340fd6ed5eb3bfd1c`. Combat CSS SHA-256 `201ca5b53bdc849b9998fc13384ad73aa1d26e5ee6e005a2c443c3c1305cab4d`. Two duplicate-key warnings in shared sources. |
| `node --test tests/{tempo_fight,tempo_fight_run,tempo_kit,tempo_stock,fight_terms,combat_situation,combat_versus,combat_focus,opponent_board,combat_surface_types,combat_interaction,reports_dock}.test.js` | Exit 0, 127 passed. |
| Offscreen WebKit `proof-final <case> <port>` | Exit 0 for `pack`, `pack-1280`, `guard`, `guard-1280` and `retarget`, each on a fresh origin. The last case reproduced the restore gap. [Replay output](webkit-checks.txt) |
| `npm run check:arch` and scoped `git diff --check` | Exit 0. |
| `node tests/combat_situation_page.browser.mjs` and `npm run check:flow` | Both exited 1 at localhost listen with `EPERM`. WebKit ran the same five-strike measurement. |
| `npm run check:rules`, `npm run check:docs` and `node --test tests/ui_style_ratchet.test.js` | All exited 1 on shared files. The findings were hearth text in `tranche_one_ui.js`, rule wording and acceptance claims in other documents, and markup growth in `book_craft_controls.js`. |

## Preflight and visual spec

Fang Yuan opens the ordinary wolf hunt from the Moonglow checkpoint. The pack fixture exercises crowded and different observations at 1920×1080 and 1280×800. The existing centre fight card, left Hero and right Reports remain the homes for the roster, the player's condition and the durable account.

The visual floor is the fix-pass [wolf card](../combat-page-sol-2026-11-20/fix-pass/after.png), with YAIR's Cave depths as the bar reference and the [pack mock](../combat-pack-mock-2026-11-21/fold-left-1920.png) as the fold reference. Sampled fix-pass colours are slate `#1D243C`, navy `#090D26`, rule `#797691`, health `#FF2E2E` and time `#9C009C`. Cave depths uses the same slate and time colours and `#FF0000` for HP. Keep the game font, small monospace source labels, square edges, thin rules and the existing red, amber, cyan and yellow meanings. Use a tick and a name for the next pack member. Amber marks items. A striped section previews harm and a short flash marks the row that changed.

| Field | Plan |
| --- | --- |
| Authority and seam | UR165–UR167, UR176–UR177, AD36, AD43 and the combat feel brief. Extend the tempo view, opponent roster and existing move, Reports and inventory consumers. |
| Player words | “Fresh → likely Hurt”, “5 beats · 2 of 29 stamina”, “A wolf does not bargain.” |
| Normal and blocked routes | Pick a legal move, see its beats and spend, then read what the wolf did. A wolf still refuses a plea and leaves Back away where the terms grant it. |
| Mechanism and persistence | Keep command outcomes and observer disclosures in their existing owners. Fight-local presentation reads current state and live events. Reports still saves its plain-text tail. |
| Failure and proof | Check a split keeps move controls fixed, repeat counts survive restore, and rewards animate once. Rebuild and play both viewport sizes. |
| Scope | Combat lane source, styles, tests and this receipt. Deferred channel and mass-combat mechanics, shared spacing and shared effects files. |

## Earlier browser evidence

Bundle SHA-256 `faf56bee71043c0600f73fd34209a6e874a639c37e627b73e7cc454f80a9e3d2`. Combat CSS SHA-256 `aa2f71701b615bdefa8772c40dfd74ab406af50f596c88571bc536e435fcdcf2`. The wolf opener starts from the earlier lane's earned Moonglow checkpoint. The pack, repeated miss and Bind cases use disposable fights created through the tempo engine. WebKit ran offscreen on a fresh origin per case.

[Before](before.png) · [After](after.png) · [Same-size comparison](side-by-side.png) · [Pack at 1280](pack-1280.png) · [Mixed fight at 1920](mixed-1920.png)

[Impact](hit.png) · [Learned response](observed.png) · [Finish](settled.png) · [Spare](spared.png) · [Folded Reports](reports-repeat.png)

| Area | Change and evidence |
| --- | --- |
| Fighters | Left-aligned health words leave the bar available for the preview stripe. The target, name and conditions share the compact first line. A landed swing teaches the wolf's bludgeoning response on its row. The condition title names the source when the fight has recorded it. |
| Roster | An eight-rat fixture opens with seven fresh rats sharing a row and an injured rat in its own row. The surviving pack uses the actual turn order for its brightest tick. The target splits out, a dead rat collapses to a quiet line, and the body buttons retain their position at both widths. The mixed roster grows to eight rows at 1920 and scrolls at 1280. |
| Moves | Body and weapon, Powers, Items and Terms sit under the roster. The square buttons retain their coloured edges and show costs against the current supply. The Terms line carries the real retreat and surrender actions. The wolf's refused plea stays dashed, with a reason. Native Enter and Space fired one action and kept focus. Held Enter, a repeated shortcut and the second double-click event spent no turn. |
| Reaction and aftermath | The Hero and fallen target receive brief marks in the same turn, and the centre notice names the Hero as the recipient. Effects Off and reduced motion suppress the marks. Finish gave wolf parts with a one-time gain cue. Spare left the wolf out cold and Reports recorded it limping away. A live Bind choice resolved to Bound in the person fixture. |
| Persistence | A pack save retained actors and turn timing through reload and Export/Import. Six identical misses folded into `Wolf rat misses. ×6` and kept that count through both transitions. The wolf's settled account retained the eye after reload. |
| Neighbouring panels | Reports chips fit one row in the RI wide layout. The Condition and Body line fit in the left dock at both sizes in the pack fixture. |

## Commands and gaps

| Command | Result |
| --- | --- |
| `node build.js` through `prepareTree("WORKTREE", ...)` and `build()` from `scripts/perf/lib.mjs` | Exit 0 in an isolated source copy. Two existing duplicate-key warnings. |
| `node --test tests/{tempo_fight,tempo_fight_run,tempo_kit,tempo_stock,fight_terms,combat_situation,combat_versus,combat_focus,opponent_board,combat_surface_types,combat_interaction,reports_dock}.test.js` | Exit 0, 126 passed. |
| `npm run check:arch` and `git diff --check` on the edited tracked source paths | Exit 0. |
| Offscreen WebKit, `proof-delivery <case> <port>` | Replayed the ordinary wolf opener, pack, mixed fights, effects settings, input, report count and Bind. The harness adapts the earlier pack capture and preserves the app's normal Save, Export and Import controls. |
| `node tests/combat_situation_page.browser.mjs` and `npm run check:flow` | Exit 1 before Chromium opened. The sandbox denied listen on `127.0.0.1`. |
| `npm run check:rules`, `npm run check:docs`, and `node --test tests/ui_style_ratchet.test.js` | Exit 1. Shared checkout findings include hearth player text, pre-existing document lint and a craft-control markup increase. |

### Remaining scope

The tempo fight has no legal ready-consumable action. The native item command rejects use during an open encounter. The Items row opens the real pack, and the gain cue uses the actual acquired items. The empty belt has no consumable buttons or new beat charge. The out-of-fight Powers panel remains on its own daily action model. The tempo observer currently exposes enemy health bands. A numeric preview needs an earned exact-HP read there. The target-only restore case is documented in the November 21 corrections above. The inventory-row blink is conditional on the row being visible and was not exercised by the wolf route.

Agent-verified for the routes and checks above, below the brief's full delivery floor on the remaining capabilities.
