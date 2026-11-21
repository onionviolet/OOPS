# Combat page, third pass

## Visual specification

At 1920 × 1080 Fang Yuan reads across the screen. Hero owns his HP. Under it, Inventory and Combat share a switch. Combat shows his purple turn bar, approach, terms, conditions and the means he can spend. In the centre, the place, light and footing head a ruled opponent list. Five aligned observation slots sit above each opponent’s health and timing bars. The move strip and Back away follow the list. Reports owns the account on the right.

The native YAIR reference samples to slate `#222c45`, deep navy `#1a1e37`, grey rule `#827c7e`, red enemy HP `#fe0000`, magenta timing `#9b009a` and a muted recent-hit band `#5f2232`. Use the existing fight palette and OOPS’s selected game font. Keep the flat square borders, thin dividers and centred bar labels. Mark the current target in words, retain downed opponents in their original slots, and keep undisclosed observations as question marks. Give six rows room before scrolling. A single wolf occupies the first slot, as in the native field screenshot.

The played route starts from the same earned patrol save as the second pass. A Moonblade should reduce the left reserve and top reserve by four. A hit should reduce Hero HP once and leave a darker segment for a moment. Reload should restore the fight, the switch and the spent reserve.

## Screens

[Second pass](before.png) · [Third pass](after.png) · [Before and after](before-after.png) · [Native YAIR comparison at 1920](side-by-side.png) · [Both full screens at 1920 each](side-by-side-full.png)

The wolf screenshots use the same earned Fang Yuan checkpoint, the ordinary Beginning encounter control, and a 1920 × 1080 viewport. The comparison keeps the reference’s aspect ratio. The lower two pairs enlarge the opponent row and the left switch for inspection.

## Differences from the reference and the second pass

| Area | What the player sees |
| --- | --- |
| Hero | The second-pass centre repeated Hero’s HP. The third pass shows it once in the left Hero bar. The native red fill briefly leaves a darker segment at the previous level after a hit. OOPS keeps its XP, stamina and mana order and its existing Attributes, Equipment and Condition controls. |
| Inventory and Combat | The same two native tabs span the lower left box. Combat opens on entry with native autoswitch enabled. The purple turn bar and readiness words head the panel. The selected stance and intent open their controls. Essence, the owned Gu’s state and any combat conditions follow. The player can still select Inventory mid-fight. |
| Place and opponents | The second-pass encounter title becomes a single place, light and footing disclosure. The fight title stays in Reports. Six ruled slots give the opponent list most of the centre column. Each enemy has a right-aligned name, target mark, fixed Atk, Spd, Hit, Ddg and Def slots, red health and a thin timing track. Named conditions stay with the fighter. |
| What is known | YAIR prints numeric enemy stats. An unstudied lightning wolf shows a qualitative HP band and the strength comparison Fang Yuan can make. A landed blow can give an approximate attack. Speed uses the existing visible comparison. Hit, dodge and defense stay at `?` while undisclosed. A fallen enemy keeps its name and slot. |
| Moves and exit | The manual fight keeps one ordinary move strip with coloured edges, prices and disabled reasons. Back away occupies the full-width footer and uses the fight’s withdrawal odds. The place disclosure holds the Threat readout, further fight details and access to ordinary workspace Back. Escape also returns to the previous view. |
| Surrounding workspace | OOPS uses three columns, its chosen game font, the world status band and the bottom navigation. YAIR’s separate Quests and Skills column gives way to a wider opponent list. Reports occupies the full right column. The wolf patrol has no wave-clear counter. |

## Played receipts

| Case | Observation |
| --- | --- |
| Page-wide HP regression | The same DOM assertion found two visible 42/60 HP readouts in the frozen second pass and one on the rebuilt page. It passed with the scene disclosure open, after damage, after spending, on reload and on import. |
| Spend, save and restore | Two Moonblades took essence from 22 to 14. The wolf reached Barely standing and the move positions held. Save and reload preserved both fighters, beat 8, four resolved actions and the visible rows. The restored left panel showed 14 and the status band showed 14/44. Importing the actual Export payload preserved the same battle and the six Reports lines appeared once each. A third Moonblade settled the hunt. [Mid-fight](mid-fight.png) · [Reloaded](reloaded.png) · [Settled](settled.png) |
| Hit on Hero | After two Heavy swings, the wolf landed a 2.6-damage hit. Hero went from 42/60 to a displayed 40/60. The darker segment covered 19.06 pixels between the old 70% and new 65.67% fill, then expired. The enemy’s attack slot gained its observed estimate. [Hit on Hero](hit-on-you.png) |
| Pack | A separate seven-opponent engine fixture filled six visible slots. Selecting the sixth and seventh targets changed the mark. A Quick strike dropped the seventh. All seven DOM rows kept their identity and order, the scroll position held, and the fallen row dimmed. [Pack](pack.png) |
| Bind and withdrawal | The downed-person fixture showed Take alive on the left, offered Bind, and settled as Bound. On a separate wolf replay, the footer’s second Back away attempt succeeded. [Bind choice](downed-person-bind.png) · [Bound result](person-bound.png) |

The older essence discrepancy had already been fixed in `src/ui/status_line.js`. Its RI reserve reader overlays the live fighter’s `means.essence` on the ordinary energy pool until settlement. The left panel uses the same fighter reserve as the move quote.

## Files and checks

| Files | Change |
| --- | --- |
| `src/combat_situation_ui.js`, `styles/combat_page.css` | Left fighter panel, Hero damage trail, centre scene and opponent rows, move strip and withdrawal footer. |
| `src/workspace_views.js` | Temporarily hosts the existing stance module under the native switch, honours native autoswitch and returns the module when the fight ends. |
| `src/tempo_fight.js`, `src/opponent_board.js` | Reuse the existing perception comparisons in fixed slots and project the fight’s saved terms, Gu condition and observed attack. |
| `tests/tempo_fight.test.js`, `tests/combat_situation_page.browser.mjs` | Unknown observations, hunger versus an empty reserve, and the page-wide single-HP test. The earlier Bind and Reports regressions also ran. |
| `docs/representations/evidence/combat-page-sol-2026-11-20/third-pass/` | This report and the screenshots. |

| Command | Exit and result |
| --- | --- |
| `node build.js` in a scratch copy made by `scripts/perf/lib.mjs` | 0. The two existing duplicate-key warnings name `layout_spec.js` and `travel_legs.js`. |
| `node --test tests/{tempo_fight,tempo_fight_run,tempo_kit,fight_terms,combat_situation,combat_versus,combat_focus,opponent_board,combat_surface_types,combat_interaction,reports_dock,ui_spine_ready,workspace_composition}.test.js` | 0. All 130 passed. |
| `/private/tmp/combat-page-sol-pass3/capture-final` with `before`, `after`, `hit`, `pack`, `person` and `exit` | 0 for each. The WebKit replay ran the page assertion from the checked-in browser test. |
| `npm run check:arch` and `git diff --check` on the changed tracked paths | Both 0. |
| `node tests/combat_situation_page.browser.mjs` and `npm run check:flow` | Both 1. The sandbox denied the local listening socket with `EPERM` before Chromium could run. |
| `npm run check:rules` and `node --test tests/ui_style_ratchet.test.js` | Both 1. Existing shared changes trigger the player-text check in `src/absorb_p23/host_joins/tranche_one_ui.js` and the markup count in `src/ui/book_craft_controls.js`. |

The WebKit runs used disposable loopback origins served by an in-process URL handler and the legacy WebView test shim for Web Locks. Shared checkout HEAD was `4e6c44ea0`. Second-pass bundle SHA-256 was `c460a0297c082d4b31541e81996e101ad1c72ab7594f5cd72a2792a1d5dd2c3d`. Third-pass bundle SHA-256 was `322506464ce60d6f842134fec87a666f4af8fc76581e7d8c02cda9afd62993d1` and combat CSS was `0e74337564a29733e7393f088fdae5608988974804fc9e5f6a21da863ffcb396`. Full-suite integration and visual acceptance remain with the coordinating session and Weibao.
