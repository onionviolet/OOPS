Lane `knowledge`, code prefix KL. Read next-parts/COMMON.md in docs/gm/dispatch/ui-foundation-2026-10-15/ first and obey it.

Task: Part 4 knowledge ladder design spike (the only save-changing part). Doc only.
- Find existing owners first: Bestiary, enemy/species records, any knowledge/observation/familiarity state
  (grep src/ for bestiary, known, familiarity, observed, kill counts; docs for knowledge owners and
  absorb-all p23-field-familiarity). Reuse rather than duplicate (R4).
- Observation provenance: per fact (HP, attack, defense, speed, special attacks, effects, traits, titles),
  what an observer can legitimately perceive and when (W1: hidden xp_value and true stats are not inputs).
  Defaults plus dials per world (status worlds, appraisal skills).
- State shape: `impression | estimate | observed | known` per fact, per species and per individual;
  seeding so estimates do not flicker; what happens when truth changes.
- Save migration: current save layout (cite main.js save/load), proposed additive field, migration from a
  pre-Part save, import/export, reset and world change.
- Leak audit: popups, search, badges, accessibility labels and log text must not reveal unknown facts or
  sealed secrets (refer to secret IDs only).
- Which Part 2 markup must read through the projection now (W4) so Part 4 changes data only.
Effort: high. Done: next-parts/knowledge.md with the design and the COMMON sections.
