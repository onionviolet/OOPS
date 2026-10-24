# Proof B: O5 family tree, habit and social rows, estate label (combined build, dist untouched)
Headless Chrome 1920x1080 (1536x864 where noted), static server on a fresh port per run, bundle hash asserted equal to dist/bundle.js.
Run from the worktree root. Evidence under `docs/gm/dispatch/o-f-a-proof-2026-10-23/b/evidence/`. Page errors: none in any PASS run (helper asserts `[]`).
Rerun: `node docs/gm/dispatch/o-f-a-proof-2026-10-23/b/serve-and-run.cjs docs/gm/dispatch/o-f-a-proof-2026-10-23/b/<script>.cjs`

## O5a family tree: PASS for heir + ancestor via real UI; relative NOT REACHABLE through UI
- Script `o5a-family.cjs`; shots `evidence/o5a-family-sYNh3l/family-native-1920x1080.png`, `family-1920x1080.png`, `family-1536x864.png`, `family-after-import.png`.
- Native: ended-life modal, "Begin heir" button, Family panel via More panels. Tree shows `Hero (gen 1, died at 80)` and `You (this life) (gen 2, took the estate as next of kin)`.
- Relative: nothing in the game creates `kin`, and the save serializer drops a top-level `kin` field (verified: kin absent after load+save). So the relative row is GENERATED FIXTURE: Bram (spouse, 60) pushed into the heir chronicle lineage and imported by file. Panel then shows Hero, Bram ("spouse of Hero, 60"), You on one tree.
- Persistence: native Save, reload, Export, file Import all assert equal lineage; panel text identical after import.
- Layout: indented list, clear, no overflow or overlap.

## O5b habit + social rows: PASS (start state is a generated fixture)
- Script `o5b-habits.cjs`; shots `evidence/o5b-habits-wmvjwx/habit-formed-1920x1080.png`, `social-routine-1920x1080.png`, `habit-1536x864.png`, `after-import-1920x1080.png`.
- Start: owner's enrolled-life fixture (needs Notebook tabs); labelled. Real button presses (Notebook > People, `[data-simulation]`): "Share a word at the bench after work" x3 gives familiarity 3; commissioning makes the craftsman busy and "Ask for a moment between cuts" appears and is pressed. Scene line: "He glances up and nods before you speak; he will answer between cuts."
- Habit: "Take a quiet break in the Shack" x3 (completed=3) then scene line "Stepping away to settle has become a habit..." and a new row "Settle with a quick pause · 1 min"; pressing it applies mood.reassured. This is one habit shaping a mood.
- Non-click steps, labelled: time via `advanceTicks` test hook; Shack/Village travel via the game's `window.change_location`.
- Persistence: Save, reload, Export, file Import keep the habit row and the social row (asserted, shot after import).
- Layout: readable, but the People panel is cluttered by long disabled-command reasons (many "required knowledge missing", "belongs to another world... Tingen supervised workroom" lines) under the new rows. The new rows are findable but buried. Not an O5 defect; fixture carries Tingen state.

## Estate label: PASS (1920x1080 and 1536x864 with 21px type)
- Script `estate-label-proof.cjs`; shots `evidence/estate-proof-hqLYnS/estate-1920x1080.png`, `estate-1536x864.png`, `mixed-native.png`; text `estate-preview.txt`.
- Native: buy River bellleaf + Spring water, "Mix one vial: steep" makes the unknown mixture. Ended-life preview reads: "Stale bread x5, Rough wood log x6, Charcoal x3, Lamp oil, Cheap iron dagger, Amber glass vial with a square stopper." No "gearwork", "components", "e2_instance", "fractions" or JSON. Raw mixture key saved in `mixture-raw-key.txt`.
- Fixture edits (labelled): owner's age-boundary fixture with Tingen entries stripped, life age moved back 5 years so mixing works, then returned to the boundary and file-imported to end the life. One filler item (leather pants) removed.
- Note F-cap: the preview lists at most 6 names then "and N more". With 7 kinds, the mixture was folded into "and 1 more" (first run). Existing cap, not a regression.
- Reload keeps the preview identical (asserted). 1536 shot: modal text readable; modal body clipped at bottom with page scroll, no horizontal overflow.

## The H8TfWK failure: stale fixture, not an estate defect
`evidence/estate-label-after-H8TfWK`: "Import rejected ... incompatible or malformed". Console on the combined build: `No such element with availability as "location" -> "Tingen university area"`. The owner's fixture carries Tingen locations/items/availabilities that this build no longer defines. Stripping those keys loads fine. Worth a look by the LOTM/integration owner: saves made on the primary build that contain Tingen state are rejected here (possible save-compat gap). Not investigated further (no source access).
