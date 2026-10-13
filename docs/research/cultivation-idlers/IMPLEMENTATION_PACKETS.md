# Cultivation idlers implementation packets (PROPOSALS, not accepted, not implemented)

Each packet needs a rebuild, a fresh-origin desktop browser check and Save/reload/Import proof. Cultivation-world rules are per-world adjectives, not global. Codes refer to [REPORT.md](REPORT.md).

## P1: Revelation rule as a written design law (F1)

- **Smallest result:** record one rule in the UI design owner: unearned systems are absent; once revealed they never vanish; labels can deepen ("odd warmth" becomes "qi"). Build one cultivation-world skill whose label upgrades after a threshold.
- **Seams:** `src/native_discovery_policy.js`, `src/models/skill.js`, [thematic UI design](../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md).
- **Acceptance:** the deepened label persists across save/reload; nothing re-hides after it empties.

## P2: Breakthrough as a skill trial with a lived-years seal (F2, F9)

- **Smallest result:** a cultivation-world realm step resolves as a short staged trial (a timed body path or an untimed pattern puzzle, player's choice), with a free practice pass first. Failure applies a seal that weakens one power for a multiple of the current lifespan, counted in lived years and carried into the next life or heir. A world dial can instead make failure deadly (Path's pattern), writing what was learned into the life record.
- **Seams:** `src/techniques.js` (staged practice), `src/chronicle.js`, `src/heir_inheritance.js`, rules in `src/feature_expansion_book_cultivation.js`.
- **Acceptance:** the seal shows its remaining lived years and source; it survives reload and rebirth; completed stages are kept.

## P3: Vessel quality state (F10, F12)

- **Smallest result:** qi capacity plus a purity share. A forced or demonic route, or eating raw herbs, raises impurity with a visible cost; at a cap, cultivation stops until purified.
- **Seams:** `src/body_progression.js` conditions and capabilities, `src/power_models.js` resolveEffectAmount.
- **Acceptance:** impurity sources are listed; the cap blocks with a named reason; purification lowers it; persistence round-trips.

## P4: Time-fed discovery with a pity rise (F7)

- **Smallest result:** one region rolls a discovery per block of lived years spent there, with the chance rising per miss and resetting on a hit. Each region has a finite list of one-time discoveries, with no 1-of-N count shown.
- **Seams:** `src/world_rhythm.js`, `src/known_routes.js`, `src/skill_discovery.js`.
- **Acceptance:** rolls are seeded and do not re-roll on reload; the rising chance is deterministic; found items stay found across lives where the world carries them.

## P5: Progression-neutral regional life that tracks a threat (F8)

- **Smallest result:** one region's ambient work lines change as a regional threat escalates, with no rewards or flags, only texture. Lines are rebuilt from catalogue ids plus compact facts, not saved as text.
- **Seams:** `src/event_feed.js`, `src/everyday_life.js`, `src/causal_situations.js`.
- **Acceptance:** lines shift at each threat stage; saves store only ids and facts; no progression changes.
