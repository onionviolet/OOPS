# IM32: obligations ledger (2026-10-23)

Proposal, not accepted direction. Code: `src/obligations_ledger.js`, test:
`tests/obligations_ledger.test.js`. Codes: AD14 (bindings and duties carry by
their own rules), AD19 (grudges recover with decent treatment), AR1-AR16
(one authority per fact; this module is not wired into a save slice yet).

## Record shape (`obligations@1`)

`{id, kind: coin|favor|grievance|duty, debtor, creditor, amount, why, source, since, eases, carries}`

- `eases`: amount shed per season (AD19 recovery; 0 for money).
- `carries`: whether an heir inherits it (AD14).
- Write by id (upsert; amount 0 settles). Read by debtor, creditor or kind.

## Existing states mapped

| Today | Where | Becomes |
| --- | --- | --- |
| Household resentment (neglect deaths) | `household_fortunes.js` `{standing, resentment, ledger}` | `household:resentment`, grievance, eases 1, carries false |
| Village kit debt | `village_career.debt` (coins) | `career:kitDebt`, coin, carries true |
| Heir grievance and archive duty | `heir_inheritance.js` `HEIR_OBLIGATIONS` | `heir:grievance` (coin-sized, 3), `heir:archiveDuty` duty, carries true |

Gap: crafting has no live grudge state. `craft_failure_ledger.js` records what
failed per material set and is not a debt, and the crafting pack is not live.
The mapping leaves crafting grievances as a future writer (kind `grievance`,
creditor = the commissioner).

## Migration note

1. Adapters (`fromHousehold`, `fromVillageCareer`, `fromHeirObligations`) read
   the old shapes, so nothing is rewired and no save changes now.
2. To migrate a writer: add the namespaced slice `obligations` to the save with
   `createObligations()` as the absent-slice default, have the writer call
   `writeObligation`, and keep the old field as a read-through until a
   migration copies it (old saves: derive via the adapter on first load).
3. Heir settlement order stays in `heir_inheritance.js` (estate pays the kit
   debt first, shortfall written off); the ledger only records the outcome.
4. Each migrated writer needs its own save/reload/import check (not done).
