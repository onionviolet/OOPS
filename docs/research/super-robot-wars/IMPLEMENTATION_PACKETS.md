# Super Robot Wars implementation packets (PROPOSALS, not accepted, not implemented)

All packets target canon-first worlds at desktop viewport. Each needs Weibao's pick before build, plus a rebuild, a fresh-origin desktop browser check and Save/reload/Export/Import proof. Codes refer to [REPORT.md](REPORT.md).

## P1: Canon beats that can be survived (F1, F2, F13)

- **Seams:** EI10 rows on `src/causal_situations.js:4-34`; `src/world_rhythm.js:20` for the date window; a `fate` field on a row, `{outcome:'dies'|'leaves'|'turns', unless:[conditions], window, abstention}`; conditions reuse `src/causal_story_ids.js` protection profiles and the knowledge basis at `causal_situations.js:52`.
- **Player path:** a public franchise beat in a priority world shows as "expected" in the canon clock. The player builds relationship, presence and preparation. At the window the beat resolves by its abstention outcome or the IF outcome, and later rows recheck whether the person exists. The reverse is allowed where a world dial permits: an unprepared-for threat can kill a canon survivor.
- **Acceptance:** idle play gives the canon outcome; meeting the conditions keeps the person and later rows read it; Save, reload, Export and Import keep the fate state.
- **Save:** additive optional fields, with a compatibility decision.

## P2: Mastery counter from optional objectives (F1, F12)

- **Seams:** per-scene optional objectives in the combat objective host (`src/audit_remainder_combat_objectives_*`) increment a per-world `mastery` count. The world card declares what reads it: P1 rescue conditions, recruit offers, a threat-scaling dial (Z's 80/30% bands) and low-mastery-only rewards. Visibility dial: hidden or shown.
- **Player path:** a fight shows "optional: finish before the patrol bell"; meeting it raises mastery, and a later rescue lists mastery 3 as satisfied.
- **Acceptance:** the counter persists; the threat dial is off by default; a low-count reward is reachable.

## P3: Two endings per arc, canon and IF (F2)

- **Seams:** arc close writes a receipt in `src/chronicle.js` and `src/life_record.js`. The first clear unlocks a free pick on later lives or copies, readable through the carryover layers in `docs/worlds/world-depth-2026-10-13/17_CARRYOVER_AND_RETROFIT.md`. Where a world wants it, the canon ending itself needs conditions.
- **Acceptance:** a fresh life sees the conditional route; after a recorded clear the picker offers both; no sealed truth appears in labels.

## P4: Theater board with key missions (F11, F10)

- **Seams:** `src/work_ledger_system.js` and `src/known_routes.js` list one arc's missions as key or optional. All key missions advance the story; optional ones change who joins and when, and feed P2.
- **Player path:** a time-poor player clears key missions only and still finishes the arc; a collector picks theaters to get a favorite companion early.
- **Acceptance:** a key-only path completes; order changes arrival; persistence holds.

## P5: Converged-world AU pack (deferred; order, not scope) (F3, F4, F5, F14)

- **Seams:** an overlay pack plus divergence metadata with a `convergence` block: merge device and date, a harmonization sheet (calendar, language, merged institutions), a resident-awareness dial (oblivious, aware, partial) and a dissolution rule (return home and forget, or stay). Imported characters use a new "canon image" equalization mode: stat shape from reputation, magnitude from the local scale. Other dials: "local ally cannot leave" per person, and "correct or prune" for distorted copies.
- **Acceptance:** one two-world converged copy runs its own canon clocks with counterpart mapping and seal lint.
