# Combat pack fix pass

## Visual specification

The YAIR cave uses square slate rows, a thick red health bar and a narrow purple timing bar. The native palette samples are slate `#222c45`, rule `#827c7e`, health `#fe0000` and timing `#9b009a`. Use OOPS’s existing fight colours and selected typeface. In a pack, align the five observations and the right-aligned target name across the same band. Put health and timing directly below. Fit six opponents into about half the old roster height, with the seventh reachable by scrolling.

On a hit, briefly lighten the Hero HP bar once as the darker lost-health segment appears. Reduced motion shows the segment alone. The reference for the initial state is the third-pass seven-rat fight immediately after Quick strike on Wolf rat G.

## What changed

| | Third pass | Fix pass |
| --- | --- | --- |
| F1. Learning | Five Wolf rats landed five hits. Each announced the same discovery. | Five damage lines and one discovery. The resolver checks the opponents’ saved names and first-hand observations, including fallen opponents. Each rat still earns its own attack estimate. |
| F2. Pack rows | Six rows took 672 px at 1920 × 1080. Each name occupied a separate band. | Six rows take 364 px. The five fixed stat slots share a band with the right-aligned name. Health and timing run beneath it. Wolf rat B carries the target mark and G stays dimmed in its seventh slot. |
| F3. Hero damage | The lost-health segment appeared on its own. | The full Hero bar flashes once for 180 ms on a loss of HP. At 450 ms the bar was red again with the dark segment still visible. Selecting Reduce motion produced zero flashes and the same segment. |
| F4. Laptop | Desktop proof at 1920 × 1080. | At 1280 × 800 all six moves fit on one row. The longer observations and move labels wrap inside their slots. The seventh opponent scrolls inside the roster. WebKit checked every slot, name, bar and move against its bounds. |

The cave reference shows exact HP and combat numbers and has a narrower field. OOPS uses the protagonist’s observations, a text target mark and the existing move strip and exit. The lower comparison shows both encounters at their original pixel scale.

[Desktop before](before.png) · [Desktop after](after.png) · [Before, after and cave reference](side-by-side.png) · [1280 × 800](pack-1280.png) · [Reports after five hits](reports-five-hits.png) · [Hero hit frames](hit-feedback.png)

## Replaying the evidence

Both desktop shots start from the same seven-rat test fight built by `packFightSave()`. The frozen third-pass build supplies the before. In each replay, select Wolf rat G, use Quick strike, then select B and scroll to show B through G together. The test save’s Effects preference was set to Full in both builds. A separate run selected Reduce motion with Effects still set to Full. The Hero frames are unaltered crops from those runs. The pack is a production-engine test fixture.

The five incoming hits dealt 0.6, 0.6, 0.5, 0.5 and 0.5 damage. Wolf rat C stumbled on that turn. After saving, reloading and importing the actual exported file, its first landed hit revealed its own attack estimate. Reports still contained one Wolf rat discovery. The saved fighters and turn matched after each restore, and restoring the fight produced zero damage flashes.

## Files and checks

| File | Change |
| --- | --- |
| `src/tempo_fight.js` | Gates the discovery where the damaging strike records its observation. Uses the existing fight save. |
| `src/combat_situation_ui.js` | Marks multi-opponent rosters and starts a fresh visual pulse for each observed Hero HP loss. |
| `styles/combat_page.css` | Fits pack names and stats on the same band and applies the Hero pulse according to motion preferences. |
| `tests/tempo_fight.test.js` | Checks five attackers of two kinds, the per-attacker estimates, and a late first hit after reload and log rollover. |
| `fix-pass/` | This report, six PNGs and the check output. |

| Command | Exit and result |
| --- | --- |
| `node --test --test-name-pattern='five pack hits' tests/tempo_fight.test.js` | 1 before the change. Four Wolf rat notices and one Cave rat notice reproduced the defect. 0 with the fix and reload assertion. |
| `node --test tests/{tempo_fight,tempo_fight_run,tempo_kit,fight_terms,combat_situation,combat_versus,combat_focus,opponent_board,combat_surface_types,combat_interaction,reports_dock,ui_spine_ready,workspace_composition}.test.js` | 0. All 131 passed, including the new regression, Bind and Reports restoration. |
| `node build.js` in an isolated copy of the working tree | 0. Existing duplicate-key warnings for `deeds` in `layout_spec.js` and `dial` in `travel_legs.js`. |
| `/private/tmp/combat-page-sol-fix/capture` with `before`, `after`, `laptop` and `reduced` | 0 for all four WebKit runs. Fresh origins used an in-process URL handler, the Web Locks shim and offscreen rendering with real animation frames. |
| `npm run check:arch` and scoped `git diff --check` | 0 for both. |
| `node tests/combat_situation_page.browser.mjs` and `npm run check:flow` | 1 for both. The sandbox denied the localhost listening socket with `EPERM`. Direct headless Chrome launch also exited 1. |
| `npm run check:rules` and `node --test tests/ui_style_ratchet.test.js` | 1 for both. Shared-checkout failures are “played minutes” in `src/absorb_p23/host_joins/tranche_one_ui.js` and a markup count of five against four in `src/ui/book_craft_controls.js`. |
| `npm run check:docs` | 1. The shared checkout reports 49 findings outside this pass, including the existing second-pass receipt. |

Candidate bundle SHA-256 `f32eb3fa7ef8773a1dc2a1c7f8669d92b7be25a50084028739af615b87cd99c8`. Third-pass bundle SHA-256 `322506464ce60d6f842134fec87a666f4af8fc76581e7d8c02cda9afd62993d1`. Both were compared at checkout HEAD `4e6c44ea0`. The coordinating session owns integration and commit. [Check output](checks.txt)
