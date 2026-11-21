# Potion bench feel pass

Agent-verified in rebuilt WebKit on disposable origins using the shipped Gothic Bitmap face. Candidate SHA-256 `39511eec65066d4fea5e441bc62f6c6e8e304e123e2ecc08130fa9e55dd03b97`. The reference build used the reviewed first pass in the shared checkout and had SHA-256 `5c93bdf5dfd8f8b6d17d6795e36c5da134989cb8a65e4dcd79e53ba915042d51`. The two builds used copies of the same source snapshot with this lane's changes applied only to the candidate.

## Visual spec and comparison

The reference picture is [the first-pass OOPS Draught bench at eight strokes](before.png). [VR17's hearth sample](../../../research/DISCORD_VISUAL_REFERENCE_SHEET_2026-11-20.md#vr17--animate-work-on-its-actual-subject--p1) guides the animation on the subject. Its sampled navy `#00142c` and `#002c57`, pale cyan `#bcfefe`, edge `#3848c0` and amber `#ffa500` correspond to the existing record, place and state palette. The bench keeps its Gothic face and thin square rules. The existing worktop `#12273c`, glass `#88a7bc`, record `#24153b`, lilac `#b9a2e7` and pale pink `#f5bad4` give the worktop, vessel, written record and observed liquid distinct colours. The flame uses the theme's warm state colours. The small splash and stir arc use the pale cyan instrument ink. [First-pass visual spec](../potion-bench-sol-2026-11-20/VISUAL_SPEC.md)

The [same-size comparison](side-by-side.png) shows two freshly played eight-stroke flasks with the motion finished. These are the visible differences within the bench.

| Difference | Why |
| --- | --- |
| The liquid has a narrow rim and its own interior layer. A ring forms at the drop and a curved highlight rotates with the stir. | Movement stays on the liquid. The original text and the post-action colour remain independently readable. [Addition](addition.png) · [Swirl](swirl.png) · [Colour change](colour-change.png) |
| A hairline divides the two numbered record rows. The longer stroke strip wraps within the record. | Each group keeps its direction and count together. Normal action rows are at least 30 px and a long record has its own scroll region. [1280 px strip](wrapped-1280.png) |
| The cauldron now sits next to Simmer and Concentrate. Its flame grows when a simmer starts. | The player sees the actual heated pot during the action, with the native duration beside it. Bench durations use minutes in the changed controls. [Heat](heat.png) |
| An early Tingen bottle action stays focusable beside the settling observation. A neutral liquid layer appears in the pot and the bottle. | The ready fact changes “Still settling” to “Settled · ready to bottle.” The projection supplies no colour or cloudiness, so the neutral fill carries no hue claim. [Refusal](tingen-settling.png) · [Ready](tingen-ready.png) · [Bottled](tingen-bottled.png) |

The appearance stays steady between actions. The press reads as a short dip and settle, and the brighter landing ring makes an addition easier to distinguish from stirring. The flame rises directly under the pot. The player can start the next stroke while the previous one is still visible.

## Played acceptance

| Check | Result |
| --- | --- |
| Mouse, Enter, Space, hold and rapid repeat | One trusted WebKit click and one stroke per mouse, Enter or Space activation. Three native repeated key-downs during each hold added zero strokes. Six rapid separate activations added six strokes. The next stroke stayed available during vessel motion. |
| Refusal and focus | The real early Tingen bottle action remained focused and produced no dose or mark. The occupied Hogwarts cauldron also refused a second flask, kept focus on the quoted action, and produced no state change or animation. [Hogwarts refusal](refusal.png) |
| Effects and settled state | Full, Reduced and Off through Effects & sound, plus Auto with the OS preference emulated, produced identical fee, game-clock delta, trial and assessment. Full showed vessel motion. Reduced and Off gave the same static cues and record. |
| Geometry and width | The focused stir target had identical bounds before and during the stroke, and hit-testing still found the next button. Both 1920 and 1280 px views fit. At 1280 px, an 18-stroke sequence wrapped only between groups. [1280 px hand-in](after-1280.png) |
| Return, reload and import | Back to Village during a swirl cleared it on return. Saving, reloading, exporting and importing at seven strokes returned the exact active trial and its record. The eighth stroke shifted the observed colour to pale pink. Hand-in kept the preparation, sequence and verdict across reload with no replay. [Reloaded](step-reloaded.png) · [Handed in](after.png) |

The main route began in a fresh Village life and used the ordinary Potioneering practice bench. The quoted three-coin fee bought the class flask and the teacher's native assessment consumed the result. For the heat check, a second disposable life bought one leech from the bench, selected it and started an experimental simmer. This was a practice exercise rather than Harry's term-time lesson. The legacy Tingen workroom used the first pass's prepared Spectator fixture, then started, refused early bottling, saved, reloaded through Return to Spectator, advanced the existing clock and bottled one dose. The native drink action was available beside the bottle. The lane used animation playback time for the step shots. There was no playable cancellation action for the atomic Draught stroke.

## Commands and handoff

| Command | Exit | Result or gap |
| --- | --- | --- |
| `BUILD_OUT=/private/tmp/yair-potion-feel-sol/after-build npm run build` from the candidate copy | 0 | Two duplicate-key warnings were also present in the reference build. |
| `node --test tests/hp_brewing.test.js tests/hp_brewing_domain.test.js tests/hogwarts_potion_workshop.test.js tests/dose_process.test.js tests/lotm_brew.test.js tests/lotm_characteristic_brew.test.js tests/lotm_ui_replay.test.js tests/palette_feedback.test.js tests/tempo_kit.test.js tests/discord_kit_features.test.js` | 0 | 107 passed, including the kit redraw, blocked action and repeated key regression. |
| `node --test tests/stylesheet_manifest.test.js` from the rebuilt candidate | 0 | Six passed. |
| `npm run check:arch` and `git diff --check` on tracked lane paths | 0 each | Architecture and whitespace checks passed. |
| `./capture after-build hp1920 43321 1920` and `./capture after-build hp1280 43322 1280` | 0 each | WebKit complete brew, native Save, reload, Export and Import. |
| `./capture-input after-build input 43323 1280` and `./capture-input after-build heat 43324 1920 heat` | 0 each | Trusted input, settings parity, wrapping, flame and an occupied-cauldron refusal. |
| `./capture-tingen after-build tingen 43325 /private/tmp/yair-potion-bench-sol/tingen-fixture.json` | 0 | Legacy Spectator brewing, refusal, return and bottle action. |
| `./capture before-build sample-before 43331 1920 baseline` and `./capture after-build sample-after 43332 1920 baseline` | 0 each | Matched fresh before and after views for the comparison. |
| `npm run check:rules` and `node --test tests/ui_style_ratchet.test.js` | 1 each | Existing shared-checkout failures in `src/absorb_p23/host_joins/tranche_one_ui.js` (player text) and `src/ui/book_craft_controls.js` (markup ratchet). |
| `npm run check:flow` | 1 | Loopback bind denied by the sandbox. The background Chrome smoke launch also exited 134. Browser evidence uses offscreen WebKit with the one-document Web Locks shim and synthetic visible state for playback. |

Harness sources and logs are under `/private/tmp/yair-potion-feel-sol/`. The runtime paths are `src/hp_brewing_panel.js`, the brew renderer in `src/book_world_lotm_ui.js`, `styles/potion_bench.css`, `src/ui/kit.js` and the press installer in `src/settled_text_effects.js`. The regression is in `tests/palette_feedback.test.js`. The next lane can use `kitVerb`, actionable `kitRow` and `kitChip` directly, or mark an existing native button with `kitControl(button, stableKey)`. The existing document listener installs the response. Engine rules, save shape and registrations require no changes. Coordinator cross-surface review and human review remain open.
