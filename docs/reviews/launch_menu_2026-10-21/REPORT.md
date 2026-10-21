# Launch counter and emoji follow-up, 2026-10-21

Implemented and technically verified; visual acceptance remains separate. User: “is the dummy hit counter even useful? Remove accordingly what happened to the emojis? more to consider?” Standing direction retains the original loading screen and direct PLAY, with the separate start menu deferred.

Surface: existing loading threshold and game-bar Menu. Target: 1920×1080, 1800×1040, 1536×864. No new layout/theme/mobile/persistence scope. Rules: AD32/34/36/40, UR6/14/16/25/35/53/55, AR1/3/5/16. Existing dirty/shared work preserved; main edit is only the old visitor-badge injection and its now-unused exact-URL helper. Gothic source/asset selection and gameplay remain untouched.

## Findings and dispositions

| Code | Evidence, implication and action | Disposition |
| --- | --- | --- |
| LUI1 | `src/main.js` injected an external visits image on every host, using upstream visitor URLs on the two exact upstream origins and a dummy badge elsewhere. This counted website visits, not combat hits. Removed the image producer, dead `is_on_main` helper, game-bar Menu membership/per-refresh relocation and stale counter CSS | ACT NOW, done. The development-origin `noindex` metadata is preserved |
| LUI2 | `git show master:index.html` preserves `Miktaew 🐱`; commit `e38d600a9` changed the full credit to Weibao while reapplying OOPS branding. Later onionv replacement retained that omission. Restored the decorative cat beside onionv, with `aria-hidden` so the decoration does not inflate the author label. Loading-error `😭`, combat shield and existing scene/calendar symbols remain in source | ACT NOW, done. No newly written joke/tip text added |
| LUI3 | Hiding the counter with CSS would leave the external image request and periodic relocation alive. Removal reaches the producer and shell consumer. Emoji should use per-glyph fallback rather than forcing it into a compact Gothic face | ACCOUNT FOR NOW, applied. Native CDP reports Apple Color Emoji, glyph count 1, for the restored cat; no font/theme rule changed |
| LUI4 | `src/ui/combat_display.js` still appends literal `2345` after `r.block` on its shield branch. Confirmed in working source and HEAD. This is a separate combat-display source defect; this pass did not reproduce that shield branch in a live fight or edit it | LATER, useful next repair. Balanced implementer, S effort; reproduce an actual shield readout, remove the suffix, add a meaningful display regression and check the rebuilt known block value/emoji at 14/21px |

These are bounded findings, not a whole-UI cleanup audit or acceptance of new styling. The original screen's fixed-coordinate composition remains by the user's restoration instruction. No new start/world or extra emoji decoration is selected.

## Changes

`src/main.js`: remove all hit-counter image branches, retain upstream-dev noindex. `src/game_bar.js`: remove counter entry and relocation lookup. `style.css` and `styles/workspace.css`: remove obsolete counter-only styles. `index.html`: restore the original cat decoration next to onionv. Generated bundle/cache fingerprints rebuilt. [Input hashes](INPUTS.json) record exact candidate and live paths; unrelated mixed edits are not claimed as this change.

## Verification

- `npm run build`: PASS.
- `npm test`: **2394/2394 PASS**, zero fail/skipped/TODO/cancelled, 33.88 seconds.
- `npm run check:arch`: PASS, main -24/display -68/save 0; no new cycles.
- Focused `tests/shell_composition.test.js`: 8/8 PASS. Full suite also covers UI contract.
- `node docs/reviews/launch_menu_2026-10-21/check.mjs`: PASS. [Receipt](receipt.json). Local fresh-origin startup plus exact upstream main/dev URL branches emulated entirely with local build assets. No real visit/publication to upstream. All three branches have zero counter elements and zero hit-counter requests before PLAY, in game and after native Save/reload. Dev-only noindex stays present. Native Menu/Escape remain usable. Zero page errors.
- Browser typography/geometry: actual Apple Color Emoji renders the cat. Credit stays within all three target viewports. [Screenshot](launch.png) visually inspected at 1920×1080; old launch composition retained.
- Scoped `git diff --check`: PASS. `npm run check:rules`: PASS, with the existing untracked gear-depth-owner link warning.

No personal saves were read or changed. Browser contexts are disposable. No persistence schema or save behavior changed; Export/Import was not rerun. No commit/push/merge. The shield source finding remains open; human visual acceptance remains open.

Current frozen preview: http://127.0.0.1:19234/, `/tmp/oops-launch-counter-20261021`, exec session 14187. Earlier preview origins retain their older builds. Current normal launch has no Beginning picker.


## Creator-specific signatures, later 2026-10-21 direction

Weibao asked to keep each reference author's own fun identity and give onionv a distinct one, then specified **guinea-pig themed**, rather than onion themed. This supersedes placing Miktaew's cat beside onionv in LUI2 above.

Moved 🐱 into Miktaew's upstream credit. Added an original small SVG guinea pig beside onionv: `resources/img/guinea-pig.svg`, styled through the existing `styles/oops_branding.css`. This is an ordinary local image with descriptive alt text, not a hamster emoji or borrowed mascot. 23html's attribution remains literal/plain: inspected the [published source at the retained revision](https://github.com/23html/23html.github.io/blob/e93a8cd617932fb698ff889b968a32f9a20d48f3/index.html), which did not supply a separate creator-signature badge to reproduce. The live site had no readable extracted content, so the lookup switched once to raw GitHub source. No new loading messages, animation, font setting or start-menu panel.

Validation: UI contract 3/3 PASS, rules index PASS with existing untracked-owner warning, scoped whitespace PASS. Browser PASS at 1920×1080, 1800×1040 and 1536×864: image loaded, author credit contained, cat belongs to Miktaew, onionv signature contains the guinea-pig image, no hit counter, keyboard PLAY works, zero page errors. [Receipt](credits-receipt.json), [visually inspected screenshot](credits.png). This is markup/CSS/SVG only; existing rebuilt runtime bundle is unchanged, so the previous full-runtime 2394-test result is reused for unchanged JavaScript. No new claim about the broader Gothic candidate.

Latest credit preview: http://127.0.0.1:19234/credits/ . It uses the same served candidate's unchanged bundle with updated presentation files in a separate subpath, preserving the older root preview. No new server or personal-save operation. Source edits remain uncommitted; visual taste acceptance stays open.


## Existing guinea-pig PNG, later 2026-10-21 replacement

Weibao suggested using a PNG, possibly the one from his AI fellowship application. Found the existing `guinea_pig_aviators.png` in his local application-data folder. Its use in the submitted application was not independently established, but the file is the matching guinea pig wearing aviator sunglasses. Replaced the new SVG with this existing PNG, unchanged, as `resources/img/guinea-pig-aviators.png`; source/copy SHA-256 both `f790888542f4557b531e931d83281f48680ca9af0c5869373258d52da1ec036e`. Removed this chat's unused SVG. Image keeps its native aspect ratio at a 3em display height, with descriptive alt text. No image generation or editing. No download was needed.

UI contract 3/3 PASS, whitespace PASS. Browser PASS at all three desktop sizes: original 1225×1284 image loaded, signature contained, Miktaew's cat retained and keyboard PLAY works, zero page errors. [Screenshot](credits-png.png), [receipt](credits-png-receipt.json). Initial browser attempt found the old preview server stopped; restarted that same local port and reran successfully. Preview remains http://127.0.0.1:19234/credits/ , current server exec session 24285. Runtime JavaScript is unchanged. No commit/push.


## Edited source, distinct flair, corner links and transparent cutout

The earlier application PNG choice was wrong: Weibao requested **his edited file**, not the generated aviator image. Found `goated pig.png` in Downloads and its byte-identical `goated_pig.png` application-data copy. The application builder explicitly references the latter. Source dimensions 1632×920; SHA-256 `d5872e381ac49272376192813b430550937f83302ece765b3f30b4f433beb6db`. The game retains this source as `resources/img/guinea-pig-edited.png`. Removed the wrongly selected generated-image copy from the game assets.

Later requests add separate diagonal flair for the original authors, an individual onionv treatment, corner arrows with author-support links, GitHub links, and transparent background removal. Implemented in `index.html` / `styles/oops_branding.css`: both reference credits angle −10°; onionv is upright with a small gold underline and his edited guinea-pig image. Miktaew keeps his cat. No new loading messages or start menu.

The image-editing tool removed the external white background from the edited source into a new sibling `resources/img/guinea-pig-transparent.png`. Original source is preserved. Output is a 1670×942 RGBA PNG with genuine alpha (0–254, 874342 fully transparent pixels), not a checkerboard/white matte. The flat user-added glasses and white fur remain visible; this is a background-removal derivative, not a claim of byte-identical photo preservation. Tool output was copied from the Codex generated-images folder into the project and inspected on the actual plum screen.

Corner links: Miktaew's official Ko-fi and upstream source are bottom right; Proto23's playable page and source repository are bottom left. Ko-fi is the prominent support action, GitHub a smaller source link. Verified Miktaew's exact donation URL from [his own current index](https://github.com/miktaew/yet-another-idle-rpg/blob/master/index.html) and retained [help page](../../../help.html); Proto23 source from its [official repository](https://github.com/23html/23html.github.io). Links are ordinary user-opened links, target a new tab, and use noopener/noreferrer; no donation, star, message or external write was performed. No official Proto23/Corc Ko-fi was found in the bounded source/search pass; an asynchronous question requests the URL. That link remains pending, rather than guessing a recipient.

Final validation: UI contract 3/3 PASS; scoped whitespace PASS. `check-final-credits.mjs` PASS with six size/text combinations (1920×1080, 1800×1040, 1536×864 at 14/21px). Native image loads; reference-credit rotation and upright signature correct; corner destinations/keyboard focus/new-tab safety correct; both corners contained and below PLAY without overlapping; PLAY keyboard activation still enters the game and hides the support callouts; no new Beginning picker or visitor counter; zero page errors. [Receipt](final-credits-receipt.json), [visually inspected screenshot](final-credits.png). Runtime JavaScript remains the previously rebuilt bundle; no gameplay or save change. Current preview stays http://127.0.0.1:19234/credits/ . No commit/push; visual acceptance and the unverified Proto23 Ko-fi remain open.
