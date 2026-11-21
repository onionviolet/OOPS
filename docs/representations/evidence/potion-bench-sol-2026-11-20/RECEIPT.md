# Potion bench browser receipt

Agent-verified in rebuilt WebKit at 1920×1080 using the game fonts. Bundle SHA-256 `9fb0584e5a6d61bc5816a935a178d0c622cb06ad5954dbeaf8d128f2e2643b8f`. Before bundle SHA-256 `700ef55a65a0a57aff5f870831171956dc78846b1a48a542dac0db1ed6491d2c`. Both builds used a frozen worktree copy with the potion edits applied for the second build.

## Played routes

| Route | Evidence |
| --- | --- |
| Hogwarts, fresh Village life → Potioneering → Set up the Polyjuice bench → Crush and add juice → stir → hand in | The empty flask became lilac after the addition. Seven counterclockwise strokes left the colour below the pale-pink cue. The clockwise stroke made it pale pink. The teacher accepted it, and the hand-in record showed the recorded preparation and eight strokes. [Empty](step-empty.png) · [Lilac](step-lilac.png) · [Seven strokes](step-seven.png) · [Pale pink](step-pink.png) · [Handed in](after.png) |
| Hogwarts, Save at seven strokes → Reload → Export → stir once → Import → finish → Reload | The active flask, colour cue and ordered record returned both times. The teacher's assessment and its recorded factors survived a later reload. Export and Import exercised the real serializer and import loader with a disposable save. [Reloaded](step-reloaded.png) |
| Legacy Tingen workroom, prepared Spectator fixture → start → Save and reload → Return to Spectator → bottle | The fixture used the fresh perf envelope and ordinary Tingen test commands for report-in, formula purchase and ingredient acquisition. Browser play began before starting the brew. The pot showed two hours left and refused early bottling. After reload the return control restored the same formula. After advancing the game clock and reopening the formula, bottling produced a held dose with its native drink action. [Settling](tingen-settling.png) · [Bottled](tingen-bottled.png) |

The browser harness maps a disposable localhost origin to the rebuilt assets in-process. The legacy WebView needs a one-document Web Locks shim in that harness. It runs the existing game save writer, reload and import compatibility probe. It finishes the centre entrance animation before screenshots so the layer paints while the app is inactive. Chromium coverage, native Harry lesson coverage and Tingen ingestion are outside this receipt.

## Visual differences

[Before and after at eight strokes](side-by-side.png) and [Proto23 reference beside the same step](reference-side-by-side.png) use two unscaled 1920×1080 views. [Visual spec](VISUAL_SPEC.md)

| Visible difference | Choice |
| --- | --- |
| Old Hogwarts screen put the observation and three verbs down among other exercises. | The Draught now sits first in Potioneering. A header, input and yield column, central flask and ordered record give it its own working area. |
| Proto23 divides global inventory and recipe details across panes, with a selectable list and small table rows. | The single Hogwarts exercise uses three adjacent columns. Its supply, price and yield stay readable beside the live verbs. Tingen retains its selector for the multi-formula bench. |
| Proto23's navy, teal, plum and thin rules work across the whole page. The Discord sample uses a warmer prose and state palette. | The bench uses the same dark materials and Gothic type inside the existing game chrome. Thin solid and dotted rules mark divisions. Warm state and price text, teal ingredients, and the bright liquid cues have separate jobs. |
| The rite reference uses spaced circular stations. The old Hogwarts view has no drawn vessel. | The glass profile marks the single subject. The rectangular direction marks preserve order beside it, with labels for the current cue. A no-hue reading has neutral glass and a textual observation. |
| The reference Conditions card puts consequences next to their subject. | The teacher's assessment sits with the actual preparation and stirring record. Tingen's elapsed-time state, held bottle and next command sit beside the vessel. |

## Commands and gaps

| Command | Exit | Result |
| --- | --- | --- |
| `BUILD_OUT=/private/tmp/yair-potion-bench-sol/proven-build npm run build` from the frozen copy | 0 | Candidate emitted, with two existing duplicate-key warnings. Log at `/private/tmp/yair-potion-bench-sol/proven-build.log`. |
| `node --test tests/hp_brewing.test.js tests/hp_brewing_domain.test.js tests/hogwarts_potion_workshop.test.js tests/dose_process.test.js tests/lotm_brew.test.js tests/lotm_characteristic_brew.test.js tests/lotm_ui_replay.test.js` | 0 | 79 passed. |
| `node --test tests/stylesheet_manifest.test.js` against the rebuilt candidate | 0 | Six passed. The shared checkout's generated HTML is the coordinator's rebuild target. |
| `capture before-build final-proof 42961 baseline`, `capture proven-build proven 42977`, `capture-tingen proven-build proven 42979 tingen-fixture.json` from `/private/tmp/yair-potion-bench-sol` on fresh origins | 0 each | Matching before state plus Hogwarts and Tingen browser runs. Scripts and browser logs are in the scratch folder. |
| `git diff --check` on lane paths and `npm run check:arch` | 0 each | Diff and architecture checks passed. |
| `npm run check:flow` | 1 | Sandbox denies the loopback server bind, so the broader flow gate needs a runner that can listen. |
| `npm run check:rules` and `node --test tests/ui_style_ratchet.test.js` | 1 each | Shared-checkout failures point to the existing player-text edit in `src/absorb_p23/host_joins/tranche_one_ui.js` and the markup increase in `src/ui/book_craft_controls.js`. |

The lane extends the existing two UI readers and their tests. One manifest line and the appended potion tokens register the stylesheet. The flask reads the existing save and experiment log.
