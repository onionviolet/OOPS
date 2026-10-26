# LOTM ordinary entrance, 2026-10-26

Overnight OOPS slice for the cross-project coordinator pass (L0 session "Codex
coordinator for multi-project workflow"; vault prompt
`_templates/codex_project_coordinator_prompt.md` at 86f49218, step 6). Route:
Claude lanes in this session (Codex subscription usage was not verified, so no
Codex workers). Level of work: active product. Advisor: the native advisor tool
(vault-advisor is not an available agent type here).

Branch `claude/lotm-entrance-2026-10-26`, worktree `.claude/worktrees/lotm-entrance`,
cut from `claude/m2-blocked-reasons-3cdb2b` at `e9b060849` (M2 rewrote the Tingen
begin reason this slice changes). Not merged to master.

Reserved files: `src/book_world_lotm_domain.js`, `src/book_world_lotm_ui.js`,
`src/book_world_lotm_host.js` (enroll message only), `src/progression_gates.js`
(Tingen constant only), their focused tests, this checkpoint. Live lanes avoided:
the description/tooltip lane (`src/proto23_shell.js`, `src/display.js`) and the
rules-archiving session (PROJECT, USER_VISION, RULES_INDEX in the primary checkout).

## Sharpened packet

```text
Goal: a player on an ordinary save (browser or Electron) finds Tingen from the Village and can begin an LOTM life there, with the cost shown before the click.
Done when: on a fresh ordinary origin (no ?lotm_probe), the Tingen panel is discovered in the Village, its text explains what each start does and what is left behind, a start enrolls, and Save/reload/Export/Import keep the enrolled life; focused tests and the AD36 gates pass; checkpoint records the bundle hash.
Why: Weibao 2026-10-26: depth goes to the book worlds and menus; the M1 walk found LOTM reachable only through a localhost test URL.
Scope: in: the probe gate, the unenrolled panel text, the begin reasons, persistence of an ordinary enrollment. Out: a Beginning-list entry (needs a new seam), a return road to the Village, new LOTM content.
Stop and ask if: none tonight; decisions become Q-codes.
Assumed: the probe gate was agent-chosen (q1/q2/lives checkpoints: "opt-in only, disposable saves, no default-world change"), so PRF8 lets this slice open it; enrolling stays one-way on a save, shown as a cost.
```

PRF lines (GROUND_RULES): PRF1 above. PRF2 player sentence: "Tingen: three church teams hire clerks with a chance at a Beyonder potion; or take a civil post under a new name. Choosing a start moves this character's life to Tingen for good on this save." When it cannot run: "Begin from the Village, on a writable save, with nothing else under way." PRF3 ordinary route: Village panel; exception: dev override not needed. PRF4: enrollment already moves the actor and, for the civil start, replaces the purse; nothing new. PRF5 fit: existing `definePanel` discovery plus `startable()`; no new seam. PRF6 ring: producer (gate), UI, failure (reason), persistence (ordinary-save enrollment); consumer unchanged. PRF7 screen: Village, 1920×1080, panel appears beside the place view. PRF8 constraints: Weibao's 2026-10-26 quote, AD42, AD43; the opened gate was an agent default.

## More to consider, round 1 (before building)

### ACT NOW

- **MT1. The gate checks the hostname, so Electron can never open Tingen.** `book_world_lotm_domain.js:11` requires `localhost` or `127.0.0.1` plus `?lotm_probe=1`. The new condition must not read `location`.
- **MT2. The unenrolled text fails UR70-UR73.** "A disposable test start ... Nothing here is canon; this save is for testing" is developer text. Replace with effect-first player text; canon and proposal caveats stay in docs.
- **MT3. Enrolling is one-way and, for the civil start, replaces the purse.** No route back to the Village exists in the LOTM files. The cost must be visible before the click (FLR3), not only in a hover title (UR43). The blurbs already state money; the status line states the one-way move and suggests Export first.

### ACCOUNT FOR NOW

- **MT4. Persistence (AGENTS Safety).** Ordinary saves will now carry `state.lotm`. Compatibility decision, proposed: saves made before this change have no `lotm` slice and stay valid; the existing envelope validator (`book_world_lotm_envelope.js`) governs enrolled saves; no migration needed because the slice's schema is unchanged. Exercise: pre-change-shaped save loads and can enroll; enrolled ordinary save survives Save/reload/Export/Import.
- **MT5. Discovery is placement, not an entrance in prose.** `discovered` turns true in the Village on ordinary saves; check in the browser where the panel lands and that it is not only in All panels.
- **MT6. M2's `TINGEN_START_CLOSED` becomes dead.** Remove it and the test line that pinned it, rather than keep an unreachable reason.

### LATER / DELEGATE

- **MT7. A Beginning-list entry for native-domain worlds** ("Lord of the Mysteries · Tingen" beside HP's `book.hp.*`). `structured_pack_ui.js` accepts structured pack ids only, so this needs a small start-registry seam. Sonnet medium, advisor before the seam. Done check: a fresh life picks Tingen from Beginning without visiting the Village.
- **MT8. A road between the Village and Tingen** (train, per canon era) so a life can move back and forth with custody rules. Needs a crossing design (ABR20, WA14).

## What changed

- `src/book_world_lotm_domain.js`: the localhost-plus-`?lotm_probe=1` gate is gone; Tingen can begin on any ordinary save, browser or Electron (MT1).
- `src/book_world_lotm_host.js`: `startBlockers()` returns one player reason per unmet condition (not in the Village, saving paused, work under way, already in Tingen); `view()` exposes `atVillage` and `startReasons`; the enroll refusal uses the same reasons.
- `src/book_world_lotm_ui.js`: heading "Tingen"; effect-first text with the one-way cost and "Export first" (MT2, MT3); each start's description on its own line under its button; refusal reasons shown as visible text; a Village place action "Read the Tingen hiring notice" (row grammar with a train icon, field-door pattern) that opens the panel in the center with the shared Back, like Homes (UR9, UR41). It commits nothing and disappears once enrolled.
- `src/book_world_lotm_lives.js`: civil blurb drops the developer prefix "Proposed start:" (UR73).
- `src/progression_gates.js`, `tests/progression_gates.test.js`: M2's now-unreachable `TINGEN_START_CLOSED` and the line that pinned it removed (MT6).
- `tests/lotm_lives.test.js`: one regression, "an ordinary save begins Tingen from the Village and a refusal names the unmet condition".

Persistence decision (proposed, MT4): ordinary saves may now carry `state.lotm` at its existing schema; saves without it stay valid; the existing envelope validator governs enrolled saves; no migration.

## Verification (agent-verified, not human-reviewed; AD42)

Bundle proven on (FLR1): `327421cfe6c00048258ccf0d731db369447e022ba002a32afca1e66bf5526ae0` (`npm run build` output and the headless proof bundle match).

| Check | Result | Gaps |
| --- | --- | --- |
| `node --test tests/lotm_*.test.js tests/progression_gates.test.js` | PASS 121/121 | focused |
| `npm run build` | PASS | |
| `npm test` (once, settled inputs) | PASS 3216/3216, 201 s (earlier runs this session 236 s and 168 s; before: 3215 on M2's base, wall time not logged there) | +1 test (the regression); none removed except one pinned assertion line |
| `npm run check:arch` | PASS (no growth) | |
| `npm run check:rules` | PASS, 0 warnings | |
| Headless Chrome 1920×1080, fresh context, ordinary origin without `?lotm_probe` ([result](evidence/result.txt)) | PASS: Village shows the notice row; panel does not open by itself; click opens Tingen with effect-first text and visible costs; Begin as a Nighthawk probationer enrolls (location Tingen supervised workroom); the notice row disappears; Save, reload, Export and literal Import keep the enrolled life and location | FAIL line is 17 console 404s for gitignored private assets absent from a fresh worktree (`/private_packs/manifest.json`, `resources/fonts/private/*`), unrelated to this slice |
| Electron | not run | the hostname dependency is removed in code; desktop run unverified |
| 1536×864 at 14/21 px | not run | crowded-text floor unverified |

Route kind (FLR2, FLR6): reached naturally from a fresh life by earned steps (none needed: the Village is the start). Review state: agent-verified, not human-reviewed.

Screenshots: [Village row](evidence/village-door-1920.png), [Tingen choices](evidence/tingen-village-1920.png), [enrolled](evidence/tingen-enrolled-1920.png).

## More to consider, round 2 (on the result)

### ACT NOW (done)

- **MT9. The notice looked like a stray button.** First render used the boxed `location_choices` style; switched to the native row grammar (`location_choice_dropdown`, icon). Audit L8's broader unification stays open.
- **MT10. Descriptions ran on from their buttons.** Each start's description now sits on its own line (UR7 readability).

### ACCOUNT FOR NOW

- **MT11. The post-begin notice says "You report to the workroom." for every start**, but Machinery starts in the university quarter and Storm at the docks. Small wording fix for the next touch (UR72).
- **MT12. Opening a whole new life uses the center with Back.** That is the deliberate large-task case of UR41, not the item-inspection swap of UIS1; keep inspection anchored and big choices centered.
- **MT13. Electron and the 1536×864 floor were not exercised.** Run them with the next desktop pass before adoption.

### LATER / DELEGATE

- **MT7** (Beginning-list entry for native-domain worlds) and **MT8** (a road between Village and Tingen) stand from round 1.
- **MT14. Make the headless proof reusable.** The scratch driver (fresh origin, place action, enroll, Save/reload/Export/Import, bundle hash) is the shape IPC16 asks for; move it into `scripts/playtest/` as a route check. Sonnet small; done when it runs from npm and prints PASS/FAIL per step with the bundle hash.
