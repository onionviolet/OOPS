# L4 slice 1 wiring (for sw-absorb, after T2 lands)

Commit 00ab553e1 adds `src/lotm_divination_rows.js` (`LOTM_DIVINATION_ROWS`, `LOTM_DIVINATION_FACTS`, `LOTM_DIVINATION_GAPS`) and its test. Nothing consumes it yet.

Wiring (your files, not edited by L4):
1. `src/book_world_lotm_cast_host.js:168`: pass `{...pack.divinations, queries:[...(pack.divinations?.queries||[]), ...LOTM_DIVINATION_ROWS.queries]}` to `defineDivinations` (or add `divinations` to the cast pack; the pack key is undefined today).
2. Provide the `actor.lotm.div.*` support facts listed in `LOTM_DIVINATION_FACTS` (means: coin, cane, altar-search; contact: return-address, bieber, deceased). They are authored proposals: tie `means.*` to inventory the lead can hold and `contact.*` to a target he has prepared. Without them every row quotes as ineligible, which is safe.
3. Gaps left out on purpose (see `LOTM_DIVINATION_GAPS`): copper whistle summon/messenger needs a messenger mechanism; pendulum, mirror and the coin club episode lack a performed question and answer.
