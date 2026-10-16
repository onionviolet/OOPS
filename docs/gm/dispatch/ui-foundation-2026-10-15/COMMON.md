# UI foundation lane (Codex)

Authorized by Weibao, 2026-10-15: "Q4, sure", "Q5, Sure, send new chat accordingly through codex", "Q6, Mix at the villiage counter". Q4 accepts Proto23 frame language as the default look. Q5 accepts the build order below. Q6 names the Village mixing counter as a panel that left him with no way back.

## Read first

- `AGENTS.md`, then `PROJECT.md` standing priorities.
- `docs/UI_FOUNDATION_DESIGN_ROUND_2026-10-15.md` (FD1–FD3, OA1–OA8). This is the plan.
- `docs/UI_IDENTITY_AND_REPRESENTATION_CONSIDERATIONS_2026-10-14.md` (UF1–UF5 diagnosis, PX1–PX12 Proto23 values, RP4 focus panel, DU1–DU7).
- `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md` standing UI gates; `docs/PANEL_KIT.md`.
- `docs/gm/dispatch/calm-vivid-2026-10-14/REPORT.md` and `HERO_SCREEN.md`: latest uncommitted UI work in this tree. Build on it; do not revert it.
- Proto23 CSS for exact values: `/private/tmp/proto23-ui-source.html` lines 5–110 (license unresolved: copy values and shape language, never code or assets).

## Ground rules

- Work in the shared working tree `/Users/weiwei/code/yet-another-idle-rpg` on branch `codex/gameplay-foundations`. **No commits, no pushes.** Many unrelated dirty files belong to other sessions: never revert, stash, reset or reformat them. Before each edit of a shared file (`src/main.js`, `src/display.js`, `style.css`, `styles/*.css`, `index.html`, `build.js`), re-read it from disk and apply a minimal hunk.
- Another lane (`natural-play-2`, absorb-all) may be running in this tree. Check `ps` before rebuilding. If a rebuild collides, wait and retry; do not kill other processes by pattern (`pkill -f` matches prompts); use exact PIDs only if they are yours.
- Desktop/laptop first: target 1366×768, also check 1440×900 and 1920×1080. Mobile is deferred.
- Keep user saves private. Use disposable browser contexts and synthetic fixtures. Sealed world secrets stay sealed in UI text.
- Persistence: saved layouts, pins, collapse states and existing saves must load unchanged. No save schema change without a written compatibility decision in your report.
- Taste is separate from proof: report technical proof, and leave Weibao's visual-feel acceptance open.
- Write `CHECKPOINT.md` in this folder after each slice: done, evidence paths, open items, next step. A context restart resumes from it.

## Slices, in order

Finish each slice with its checks before starting the next.

### S1. Log column and way back (DU4, DU5, FD3, Q6)

1. **Reproduce Q6 first.** On a fresh game Back to local actions works. Find the state that loses it: a grown method/queue list pushing Back out of view, opening native Crafting/dialogue/trade while or after the mixing panel is open (`mixture_ui.js:23` hides `crafting_window` and siblings via `dataset.mixturePreviousDisplay`, while `display.js` toggles the same area), a running batch, reload with the panel open. Record the exact repro.
2. **One center-mode controller.** A small owner for the center column: `open(mode)` pushes, `back()` pops, Esc pops, every mode shows the same visible Back control at the top. Route the mixing panel through it and make native `display.js` modes (dialogue, trade, crafting, reading, sleep) cooperate rather than toggle the same nodes independently. Keep native behavior; where a native mode cannot be cancelled (sleep/reading stop), its existing stop button is the back route.
3. **Give the log its column back.** Move the four panels that insert into `message_box_div` (`generated_people_ui.js:74`, `life_record_ui.js:14`, `npc_lives_ui.js:17`, `event_feed_ui.js:18`) to declared homes through `definePanel` (People / Memories / Events are reasonable homes). The message log gets full available height in its column, with the existing category filters. Combat numbers and random event text must be visible during a fight at 1366×768.
4. Checks: `node build.js`; `npm test` (report counts; name pre-existing failures separately); browser driver on a fresh origin: fresh game, populated fixture, mixing counter repro now has a way back by button and by Esc, combat log lines visible during combat, save/reload, Export and literal-file Import. Screenshots at 1366×768.

### S2. Tokens, Proto23 skin and the UI contract check (DU7, DU1, DU2, OA1)

1. One token file (frame, fill, hairline, accent, text, radius, type scale of three sizes, two button variants, tooltip). Default values follow Proto23 (PX1–PX10): square corners, 3 px dark frames, horizontal navy-to-teal fills, 1 px colored hairline rows, dense centered stat rows, letter-spaced lowercase panel titles, hard-shadow tooltip, `???????` for locked tabs where the existing staged reveal already hides them. Vivid's color roles stay; existing Standard and custom palettes still apply.
2. Font: one deliberate stack that renders CJK cleanly beside Latin text (PX11, PX12). Record the choice and fallback.
3. Migrate existing CSS onto tokens. Remove local radii, shadows and fonts that fight the frame. Nested card-in-card styling in Local actions flattens to rows. Rounded remains possible only as a token override, not per-file.
4. **UI contract test** in `tests/`: fails on `border-radius`, `font-family`, raw hex/rgb colors or `style.cssText` outside the token file plus an explicit allowlist of current violators, and on new cross-panel `prepend`/`append` into foreign hosts. The allowlist should shrink with this slice.
5. Checks as S1 plus before/after screenshots of opening, populated village, combat, crafting, mixing at 1366×768, 1440×900, 1920×1080; contrast spot checks; keyboard focus visible.

### S3. Scene and focus panel (RP4, scene shape, OA2)

1. **Focus panel**, Proto23's opponent panel generalized: top area beside You shows whoever the player is dealing with. Enemy: name, level/title, HP, stats (unknown shows `???`). Person (village elder, traveler, clerk): name, role/title, known traits only, relationship, one memory line from existing receipts (`story_requests.js`, `lore_history_state.js`). Empty when there is no focus. No new simulation data; observer-safe.
2. **Scene panel** in the center for Village: location header (place, season, time, weather), people present as glyph-and-name chips (人, or known-name chip; unmet shows unmet), things here, actions grouped by target. Selecting a person or thing sets focus without spending time or rolling anything. Reuse `projectVillageScene` shape and the traveler view.
3. **Projects drawer** (OA2): opt-in proposal panels currently in Local actions (Waypost supply clerk, Mistglass conservatory, Meadow pen, Elemental preparation and similar) move to one drawer; Local actions keeps routine actions one level deep.
4. Fix the traveler callback presence bug (reconciliation F3): `story_aftermath.js` must not fire "X remembers..." while that traveler is away on the road.
5. Checks as S1, plus: talk to the elder and a traveler with focus panel shown; a delivered request's callback appears with the traveler present; focus switching spends no time.

## Report

Write `REPORT.md` here: per slice what changed (paths), checks with counts and evidence paths, the Q6 repro and fix, the token/font choices, remaining open gates, and Weibao's taste acceptance as an explicit open item. Then update the UI owner doc and `PROJECT.md` with a short dated summary (re-read from disk, hunk only). Stop after S3 or when blocked; say which.

## Correction from Weibao, 2026-10-15 (supersedes S1 step 1)

> Wait I just found the button but it wasnt obvious what it was so that is the issue

Q6 is a **discoverability** problem, not a missing route. "Back to local actions" sat mid-row among mix controls and looked like another action. Stop hunting a dead-end state. The fix is the shared back control: always at the top-left of any center mode, same look everywhere, an arrow plus the destination name ("← Village"), visually distinct from action buttons, plus Esc. Remove per-feature back buttons buried among actions once the shared one covers them. Keep the controller work already started.

Also: Weibao is reconsidering menus such as world start ("Optional worlds", "Your beginning") as separate pop-ups or screens. A separate considerations pass owns that. In S3, do not redesign those menus; only move unaccepted proposal panels into the Projects drawer as planned.

Placement update, same day. Weibao: "One assumes it would be on the bottom but it is in the center of the villige mixer". So the shared back control sits in a **bottom bar pinned to the bottom of the center mode**, always visible without scrolling, left-aligned "← Village" (destination name), visually distinct from actions. Esc does the same. Do not rename or restructure the mixing counter itself; whether it becomes an apothecary is under separate consideration.

Menu style mismatch, same day. Weibao: "menu stype mismatch stuff and more?" / "like the drop downs...", with a screenshot of Local actions at the Village. In one column: collapsible rows drawn as full-width rounded outlined boxes with bold titles ("Village practice and familiar ground", "Local life", "Optional pacing", "Equipment condition and repair", "Elemental preparation", "Meadow pen · care proposal"); then "Waypost supply clerk" as raw unframed flush-left text with no indent; then two buttons side by side, one dashed and pale (a disabled-looking "Ask for repair notes (one field clear)") and one solid. Three visual grammars in one list. In S2: one component each for a collapsible group row, a plain info block and a button (normal / disabled with reason), all on tokens; no element sits outside a frame; disabled buttons show why they are disabled. Waypost clerk and Meadow pen are S3 Projects-drawer candidates.

## UI rules (2026-10-15)

Follow `docs/UI_RULES.md` (UR1–UR20). In particular UR14: each slice report includes a 1366×768 screenshot on a populated save, checked for whether a first-time player can name the way back, current work and main actions.

## Navigation and scroll rules added (2026-10-15)

`docs/UI_RULES.md` gained UR21–UR33: nav strip with a direct path and hotkey to every large panel, a back history that names the real previous view, restored scroll and selection on return, expandable panels, a scroll budget at 1366×768 (no page scroll in ordinary play, one scroll owner per region), summary lines on collapsed groups, quick jump, notices that link to their panel, one panel header layout. Foundation lane: build the nav strip, history-aware back bar and scroll budget into S1/S2 where they belong to the shared layers; leave quick jump (UR28) for later unless it falls out cheaply. Triage lane: apply UR25/UR26 when rehoming. Report scroll measurements per UR14.
