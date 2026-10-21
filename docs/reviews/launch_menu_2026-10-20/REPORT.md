# Launch menu improvement, 2026-10-20

Status: first candidate superseded by the later restoration below. Earlier evidence is historical. Writer: Codex chat 01a15c5c-b6a0-7a52-a179-880f23671876.

User request: improve the menu before PLAY, replace displayed Weibao with onionv, adjust Beginning choices. This selects presentation changes to existing beginnings. Existing options and effects remain; broader genetics/world selection proposals stay deferred. No commit or push authorized.

Surface: threshold screen, home `#loading_screen`. Primary viewport 1920×1080; also 1800×1040 and 1536×864, body text 14/21px. Visible outcome: identity, readable choices with truthful consequences, then PLAY, without overlap. Mobile deferred. Human visual acceptance separate.

Rules: AD23/32/34/36, UR1/5–7/10/14–18/25/33/35, AR3–5/8/16. [UI rules](../../UI_RULES.md), [architecture rules](../../ARCHITECTURE_RULES.md). Seam: existing DOM-only `mountNewGameBeginning`; current `main.js` start command remains owner. No new persistence or gameplay mutation path.

Writer area: `src/new_game_beginning.js`, new `styles/launch_screen.css`, narrow launch identity/button/link hunks in `index.html`, this report/evidence. Shared owner docs receive only append/prepend hunks. Current UI palette owner released runtime/style reservations on disk. Other live chats are reviewing world details/reference gaps; their work stays intact.

Baseline: shared checkout extensively dirty; `src/new_game_beginning.js` and `styles/oops_branding.css` clean. Existing index edits preserved. Reproduced fresh-origin baseline at loopback 19231 in disposable browser context; `before.png`. The baseline uses fixed coordinates; loading status crowds PLAY and PLAY visually precedes the choice. The first candidate also exposed the inherited translateX in normal flow; final CSS explicitly clears it. Existing dropdown offers no system, dormant system and Surprise me; all consequences share one paragraph.

Verification plan: UI contract, existing cheat awakening/start tests, build, full suite, architecture/rules gates. Rebuilt fresh-origin browser: all choices, keyboard activation, actual stored native start result, Save/reload, existing-save launch without fresh choices, target viewports/text, screenshot and measured overlap/overflow. Failure case: no-system start must not grant the optional system, and selecting a card must not start play.


## Delivered candidate

- C1: `index.html` now displays onionv in the launch credit and matching author metadata; OOPS and upstream credits remain. The added launch stylesheet creates one centered flow, shows the existing choices before PLAY and hides the game navigation/footer while the threshold is open. It preserves loading/error/version output and hides the redundant waiting-for-PLAY message after loading.
- C2: `src/new_game_beginning.js` renders native radio cards for the existing option values, with a short consequence for each and a selected-start explanation. Existing select remains the single value read by the unchanged PLAY command. No starting mechanics or persistence schema changed. The returned extras host still supports the local probe and qualified opening panel.
- C3: `tests/helpers/cheat_game.mjs` now uses the visible cards. Initial full-suite run timed out because the old helper required the hidden select to be visible. Stopped that owned run and its descendants after identifying the cause; the final full run below supersedes it. No assertions were weakened.

Direction recorded in USER_VISION, PROJECT and the intro-flow owner; AD23 source link updated. These record the selected scope, not human taste acceptance. Other dirty/concurrent changes remain untouched. No commit/push.

## Verification

| Check | Result and limits |
|---|---|
| `npm run build` | PASS. Candidate bundle SHA-256 `6390835051cd44876413cbb39f46544325fe0dd47690e7e29a77f08843d35e57`. [Input identity](INPUTS.json): 675 project modules match source-map contents exactly; 37 vendor embedded source modules counted separately. CSS-only layout repairs followed the build. |
| `npm test` after helper repair | PASS: 2394/2394, zero skipped/TODO/cancelled, 35.97 seconds. Shared dirty input at HEAD b0af7db5bd21770ca603fdf1e7b865b376f46857. |
| `npm run check:arch` | PASS, no growth/new cycles; main -7, display -68, save_files 0. |
| `npm run check:rules` after owner updates | PASS: 21 register rows, 40 AD codes, 101 links. Existing warning: linked gear-depth consideration owner is untracked. No rule semantics changed. |
| `node --test tests/ui_contract.test.js` on final CSS | PASS 3/3. Shared token contract respected. |
| `node docs/reviews/launch_menu_2026-10-20/check.mjs http://127.0.0.1:19232/` | PASS; [receipt](receipt.json). Uninstrumented rebuilt native bundle in disposable fresh browser contexts. Three start routes apply only on explicit PLAY; arrow keys sync selection; Enter/Space start play; no-system grants no optional card; dormant and Surprise grant the existing dormant card. Save/reload preserves the held-card state; existing saves offer no fresh choices. Zero browser page errors. |
| Desktop geometry and text | All six combinations PASS: 1920×1080, 1800×1040, 1536×864 at actual 14/21px body-token sizes. Choices centered and contained, PLAY below them and visible, launch scrollHeight equals viewport height, selection retained. This is actual CSS text-size rendering, not a separate customization-settings persistence test. |
| Visual inspection | Viewed [before](before.png), [final primary](after.png) and [final large text](large-text.png). Fixed the inherited panel translation and compressed redundant loading space after the first 21px layout overflow. |
| Whitespace | `git diff --check` on owned runtime/markup/helper/report paths PASS. |

No personal saves were read/imported. Persistence proof is the unchanged native Save/reload flow; Export/Import was not exercised because no persistence behavior changed. Dormant-awakening mechanics remain covered by the existing full-suite tests. The hidden local layered-start probe and non-visible qualified opening extras were preserved in source, not separately exercised in this pass.

## Review surface and remaining gate

Frozen candidate `/tmp/oops-launch-menu-20261020`, served at [loopback 19232](http://127.0.0.1:19232/), exec session 22907. `open_in_codex` returned queued; visible delivery is not confirmed. Browser checks closed their disposable contexts. The frozen preview omits private world packs and unused optional assets; this delivery verifies the launch threshold and existing base-world start routes, not private-world play. Original live-checkout baseline server 19231 is stopped after this report; it is not the review target. The remaining gate is Weibao's visual/play judgment of the launch presentation. Mobile, expanded genetics/world-start choices and new system mechanics remain deferred.


## Restored original PLAY screen, final direction

User requested the original appearance back, a simple PLAY screen, no newly written playful messages, and a separate start menu deferred to later. [Direction](../../USER_VISION.md#restore-the-original-loading-screen-and-defer-the-start-menu-2026-10-20). This supersedes the first candidate and LC2/LC5 recommendations.

Removed this chat's `styles/launch_screen.css` and its index link. Restored the original `new_game_beginning.js` renderer; its controls stay hidden on normal launches so PLAY remains direct. Existing values, native start capture and localhost `start_probe=1` authoring route are retained, with no new public menu. The test helper selects the retained hidden fixture value with `force: true`; this verifies existing optional-system mechanics and makes no claim of visible menu behavior. Kept onionv attribution. No changes to the Gothic profile, shared tokens, font asset or concurrent gameplay work. The rejected workbench study is marked archived and pins its prior renderer/styles separately; it is not the current game.

Validation on the restored source: `npm run build` PASS; `npm test` **2394/2394 PASS**, zero skipped/TODO/cancelled, 58.40 seconds; architecture PASS (main -7/display -68/save 0, no new cycles); rules PASS with the existing untracked gear-depth owner warning. Scoped whitespace PASS. No rule semantics changed.

Fresh-origin rebuilt browser PASS: no Beginning controls at 1920×1080, 1800×1040 or 1536×864; original styles and old launch font; onionv credit; PLAY visible and keyboard-usable. PLAY enters ordinary Village without the optional-system grant. Save/reload and returning PLAY work, zero page errors. [Receipt](restored-receipt.json), [visually inspected screenshot](restored.png). Tests use disposable contexts; personal saves remain untouched. Broader Gothic UI work is preserved, not revalidated or merged by this restoration.

Current frozen preview: http://127.0.0.1:19233/, `/tmp/oops-launch-restored-20261020`, exec session 12023. Earlier 19232/57584 screens are superseded. No commit/push/merge; human visual acceptance remains separate.
