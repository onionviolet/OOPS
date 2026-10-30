# L4 slice 1 wiring (for sw-absorb, after T2 lands)

Commit 00ab553e1 adds `src/lotm_divination_rows.js` (`LOTM_DIVINATION_ROWS`, `LOTM_DIVINATION_FACTS`, `LOTM_DIVINATION_GAPS`) and its test. Nothing consumes it yet.

Wiring (your files, not edited by L4):
1. `src/book_world_lotm_cast_host.js:168`: pass `{...pack.divinations, queries:[...(pack.divinations?.queries||[]), ...LOTM_DIVINATION_ROWS.queries]}` to `defineDivinations` (or add `divinations` to the cast pack; the pack key is undefined today).
2. Provide the `actor.lotm.div.*` support facts listed in `LOTM_DIVINATION_FACTS` (means: coin, cane, altar-search; contact: return-address, bieber, deceased). They are authored proposals: tie `means.*` to inventory the lead can hold and `contact.*` to a target he has prepared. Without them every row quotes as ineligible, which is safe.
3. Gaps left out on purpose (see `LOTM_DIVINATION_GAPS`): copper whistle summon/messenger needs a messenger mechanism; pendulum, mirror and the coin club episode lack a performed question and answer.

## WB1 schema sample (volumes 2-8, 20 rite and potion rows, Luna medium; full per-row report is private: `l4/later_schema_report.md`)

Counts out of 20; 8 cited paragraphs showed no clear procedure. Needs the volume 1 shape lacks: ordered conditional or repeated branches 6; grouped material inputs with explicit transfer or consumption 6; multiple actors or a ritual leader 5; eligibility or compatibility bundles 5; persistent transformation, backlash or delayed risk 5; a distinct procedure outcome (delivery, transfer, promotion) 5; a summoned or responding entity 3; dream or sleep mode 2.

Decision (proposal): keep `lotm_divination_rows.js` as the question-and-signal shape that `defineDivinations` takes. It already holds the dream-mode and unknown-outcome cases (`unknown` stage, `effects` with an owner-needed escape). The other needs belong to different mechanisms and get their own row files when authored: a summons/messenger mechanism (entity reply, multi-actor, delivery), potion promotion rows (grouped inputs, transformation, backlash) on the existing dose process. Forcing them into `queries` would make it a second predicate language.
