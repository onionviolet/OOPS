# Three deeper systems

Priority here means the highest payoff among gaps in the prior dossier, not a new required implementation scope. All behavior is SHOWN statically, with INFERRED original proposals.

## D1: Dialogue as typed, interruptible presentation

Source: prior private `extract/csharp/StoryScript.cs:738-851,1179-1475`, `ScriptParser.cs:56-141`, `StoryMoment.cs`, `DialogueLine.cs`, `GameChoice.cs`.

The path is compiled Ink state -> budgeted continuation -> parsed instruction or line -> typed moment -> presenter -> selected Ink index -> new state. The same output channel can carry speech, narration, a timeline update, translation work, camera instructions or physical movement. This keeps prose from becoming the only place a consequence exists. Player speech, NPC speech, passing remarks and world actions have separate collections. A nonverbal response is explicit data. The parser assigns emotion from tags and handles recipient/pose instructions independently from the text.

The host rejects a choice while asynchronous evaluation is busy. It also restores the prior choice moment if continuation would step past a choice into empty content. That is a bounded defensive rule, not an exhaustive proof against soft locks.

A direct reread of compiled `core.root.showing_uncertain_translation` and `note_learned_word` confirms the confidence bridge. The first asks separate host queries for incorrect and correct-but-unconfirmed readings, selects which kind of feedback to supply, and can call learning or inscription reload paths. It can also recognize an unknown word without supplying its meaning. The second checks whether a word is already known before emitting a timeline instruction; its description depends on who supplied the evidence. This is authored variation and attribution, not arbitrary generated dialogue. Full compiled helper nodes are retained privately in this lane; source prose is not reproduced here. The helper names and call sites do not prove every relationship route.

PROPOSAL P1: extend `docs/DIALOGUE_AND_INTERACTIONS.md` with stable speaker/recipient, response ID, preconditions, presentation and effect receipt. One original appraisal conversation should respond differently after a real correction, with a nonverbal option where sensible. At 1440x900 the player should see current evidence beside the response and useful consequence. Alternative reasonable routes remain reachable. Save/import, interruption and re-entry should not repeat a committed reward.

## D2: Save a coherent boundary across interpreter and host

Source: `SaveThread.cs`, `Saver.cs`, `CryptSaving.cs`, `Game.cs:1208-1420,1601-1640`, `StoryScript.cs:1440-1475`, `Player.cs:278-300`, `StorySequencer.cs:2708-2724` in the prior private C# root.

There are two states to preserve: Ink execution and host-owned objects/presentation. Initial synchronous work writes metadata and takes an Ink background-save snapshot. Host serialization runs under a save lock in a low-priority thread. StoryScript copies the pending moments before the save and swaps its buffers around completion. The Player save list explicitly includes learned material, observations, tutorial progress and map/timeline state; transient dictionaries can be rebuilt from saved list form.

Autosaving is conditional on a stable choice moment. It excludes busy story evaluation, pending travel or presentation, translation activity, routing, active sequences, and critical invalid navigation state. This is why simply saving every animation frame would not be an equivalent implementation.

Version 2 accepts 1 and 2, with a v1 river-knowledge upgrade and translation validation on load. Version, metadata, state info, host state and Ink JSON are distinct sections. The desktop wrapper is obfuscation, with a legacy text read route. Temp writing and optional scene backup are present. The old destination is deleted before move, so the code does not establish a crash-atomic filesystem transaction. Error handling renames bad/incompatible files; this pass read those methods without opening actual saves. A real roundtrip, interrupted-write test and all load-repair paths remain unrun.

PROPOSAL P2: `docs/ENGINE_EXPANSION.md` should name the durable boundary and saved-vs-derived fields. Preserve pending decisions and exact receipts rather than half an animation. Test a selected change using synthetic fixtures and a fresh desktop origin, including rejection that leaves the current state unchanged. Do not borrow the wrapper or file replacement method as a reliability guarantee.

## D3: Learning-specific help that survives reload

Source: `Translation/PlayerTutorialManager.cs`, `PlayerTutorialItem.cs`, `Player.cs:278-300,400-430`, `UserSettings.cs`, `StoryPacer.cs`.

Seventeen named translation practice items cover distinct actions rather than one global tutorial-complete flag. Required counts vary, including a larger threshold for using similarity. Practice increments a counter under the save lock and marks learned when a positive threshold is reached. The tutorial manager is part of the Player save list; downstream support checks inspect individual learned flags.

This means a returning player can retain learned interaction knowledge while different support remains eligible. It does not prove the exact visible hint sequence or that every threshold is well tuned. Text/input settings and presentation pacing are separate systems, so adjusting reading speed need not be interpreted as learning the mechanic.

PROPOSAL P3: route help retirement and recall through `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`; keep actual capability under its existing gameplay owner. Test one hint with zero practice, first use, learned threshold, reload and import. The count is a reversible UI choice, not a fixed limit on future learning or retries.
