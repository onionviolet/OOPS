# L4 slice 1 wiring (for sw-absorb, after T2 lands)

Commit 00ab553e1 adds `src/lotm_divination_rows.js` (`LOTM_DIVINATION_ROWS`, `LOTM_DIVINATION_FACTS`, `LOTM_DIVINATION_GAPS`) and its test. Nothing consumes it yet.

Wiring (your files, not edited by L4):
1. `src/book_world_lotm_cast_host.js:168`: pass `{...pack.divinations, queries:[...(pack.divinations?.queries||[]), ...LOTM_DIVINATION_ROWS.queries]}` to `defineDivinations` (or add `divinations` to the cast pack; the pack key is undefined today).
2. Provide the `actor.lotm.div.*` support facts listed in `LOTM_DIVINATION_FACTS` (means: coin, cane, altar-search; contact: return-address, bieber, deceased). They are authored proposals: tie `means.*` to inventory the lead can hold and `contact.*` to a target he has prepared. Without them every row quotes as ineligible, which is safe.
3. Gaps left out on purpose (see `LOTM_DIVINATION_GAPS`): copper whistle summon/messenger needs a messenger mechanism; pendulum, mirror and the coin club episode lack a performed question and answer.

## WB1 schema sample (volumes 2-8, 20 rite and potion rows, Luna medium; full per-row report is private: `l4/later_schema_report.md`)

Counts out of 20; 8 cited paragraphs showed no clear procedure. Needs the volume 1 shape lacks: ordered conditional or repeated branches 6; grouped material inputs with explicit transfer or consumption 6; multiple actors or a ritual leader 5; eligibility or compatibility bundles 5; persistent transformation, backlash or delayed risk 5; a distinct procedure outcome (delivery, transfer, promotion) 5; a summoned or responding entity 3; dream or sleep mode 2.

Decision (proposal): keep `lotm_divination_rows.js` as the question-and-signal shape that `defineDivinations` takes. It already holds the dream-mode and unknown-outcome cases (`unknown` stage, `effects` with an owner-needed escape). The other needs belong to different mechanisms and get their own row files when authored: a summons/messenger mechanism (entity reply, multi-actor, delivery), potion promotion rows (grouped inputs, transformation, backlash) on the existing dose process. Forcing them into `queries` would make it a second predicate language.

## Rite and craft engine path (2026-10-30, proposal; agent-verified, not human-reviewed)

`src/lotm_act_engine.js` compiles an L4 row plus an authored binding (`src/lotm_act_bindings.js`) into ordered native commands, the shape `cast_divination_adapter` already uses. Row owns source steps, eligibility and owner-needed requests; binding owns place, minutes, stock (`inputs`: key and qty, or explicit null for apparatus), `output`, `owners` (owner name to native effects) and `risk`. A row with no complete binding is returned in `unbound` with reasons. An owner with no authored effects writes an auditable `owner_needed` fact, as divination does. Risk is `{carrier, source, weight, protections:[{rule, reduces}]}`; `settleLotmBacklash` calls the host's `add(carrier, {source, weight})` once per completion, with weight reduced by protections held at settle time (limit: protections are read when settled, not frozen at the act). Tests: `tests/lotm_act_engine.test.js` (volume 1 craft plus bath aid, volume 2 sacrifice with backlash, volume 3 rite with an unresolved owner, volume 3 craft). Five of ~70 rows are bound; the rest wait for bindings, which is data work, not engine work.

Decisions (proposals, MR1-MR36, AD38):
- D1. Ritual essence oil and ritual bath oil are one product in two stages: `lotm.craft.ritual-essence-oil` makes it, `lotm.aid.ritual-oil-bath` uses it. Same item key; the bath row spends it. Not two products.
- D2. LOTM potion formulas and aid preparations belong to L4 (sw-rites) and run on this engine (make, then use). The village mixing counter stays the mixture model. Potion rule rows (procurement attention, remains as main material) are conditions on those acts, not acts; they wait for a consumer.
- D3. Reuse boundary: the generic `cast_making_adapter` recipe path (law, catalogue, resolveBatch) is for rows with real quantities and laws. L4 rows have null quantities by design, so they use bindings; a row that gains a real recipe can move to `cast_making_adapter` without changing its item keys.

Host patch (floor-wire owns the host files; not applied here):
1. In `book_world_lotm_cast_host.js` where `defineDivinations` runs: `const {commands: acts} = defineLotmActs([...LOTM_RITE_ROWS.rows, ...LOTM_CRAFT_ROWS.rows, ...LOTM_AID_PREPARATIONS.rows], LOTM_ACT_BINDINGS, {worldId, group, situationId, requires})`; register `acts` beside the divination commands.
2. Replace the fixture place `fixture.workroom` in the bindings with a real LOTM place id, and the `fixture`-free item keys with keys registered in `LOTM_NATIVE_STOCK`/item specifications (the keys in `LOTM_ACT_KEYS` are not registered yet).
3. Provide the eligibility facts (`LOTM_RITE_FACTS`, `LOTM_CRAFT_FACTS`) from lead knowledge, as for divination.
4. Where harm is ticked, call `settleLotmBacklash(state, acts, worldId, facts, (carrier, a) => addBacklash(...))` with `book_world_lotm_harm`'s carrier; `lotm.backlash.settled.<rowId>` markers live in `state.worlds[world].facts`.
5. List `quoteLotmActs(acts, preview)` rows in the existing rite/craft tab.
