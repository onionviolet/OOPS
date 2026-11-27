# Klein's unused Slumber charm upkeep

## Preflight

| Field | Scope |
| --- | --- |
| Reading | One playable Old Neil upkeep interaction for an unused held Slumber charm, preserving native stock, resources, time and later use. |
| Authority | Current request; AD6, AD36, AD38, AD43, AD49; AR3, AR7, AR10, AR14; MR10, MR13, MR32; WPR5 and WPR19–21; UR70–UR75. Architecture owner: [architecture rules](../../../ARCHITECTURE_RULES.md). |
| Player sentence | “He returns the same charm, its charge renewed.” An absent or sleeping mentor says “Old Neil must be here and awake to tend the charm.” Existing workshop voice sample: “The silver takes the inscription. You put the finished charm away.” PRS4, PRS6–PRS7 apply. |
| Mechanism and route | Existing LOTM typed act compiler, silver charm settlement hook, native spirituality/item reservation, scheduled mentor presence, and native Here/Notebook controls. A faded unused charm remains usable; inscribing another and waiting for Neil remain alternatives. |
| Fit and state | Native inventory remains authoritative. A JSON string in the existing actor-fact store records held freshness cohorts and their logical identities; the shared `oldestFirst` helper orders them. No new domain or save key is introduced. |
| Screen | Tingen Here and Notebook, fresh origin, rebuilt desktop 1920×1080. The named synthetic workshop starts with two already-aged charms and a napping Old Neil. Mobile is deferred under the standing UI priority. |
| Failure scenarios | Missing/awake mentor, fresh charm, missing/spent charm, changed stock, interrupted reservation, repeated upkeep, and imported state must not grant stock or duplicate an item. A maintained unit must affect later sleep duration. |
| Scope | Slumber first. Soothing's existing five-minute calm remains as before. This does not qualify an earned Klein journey, a canonical recharge fee/procedure, or a universal charm decay law. |

## Evidence and authored tuning

[RA21](../cross-world-systems-2026-11-07/READ_AHEAD_USE_2026-11-08.md#ra21--unused-charm-maintenance-november-25-2026) freshly checked selected Chinese volume-1 passages: ch127 p025–p030, ch128 p069–p071, and ch133 p017–p025/p044–p047. It supports spirituality fading, the stated two-week maintenance practice and Old Neil's unused-charm recharge. It does not show Klein making this visit. The exact method, price and restored amount remain undisclosed; Dream burning is distinct from fresh Slumber-use proof.

This slice's gradual five-to-two-minute sleep response over fourteen played days, positive floor, ten-minute visit, one point of the player's spirituality and the described steadying/handoff are authored defaults. The fourteen-day reference is a tuning choice informed by the stated practice, not a measured decay curve. The player can use a faded charm at its current local effect; maintenance restores the local response rather than supplying a new silver item. No recharge fee is inferred from the separate shopping total.

The implemented model gives fresh inscriptions their settlement clock. Existing or newly incoming stock whose age is unrecorded keeps its prior five-minute use and can be inspected through the mentor visit. Its previews are read-only. Native stock reductions reconcile oldest free cohorts first; incoming units receive unknown age rather than a fresh timestamp. A reserved unit stays with its running upkeep. This is an authored fungible-cohort model, with unknown age retained when a trade supplied no recorded history; it is not a new source claim.

## Receipt

Native gameplay acceptance passed on the named fixture. The shared coordinator owns the final build/architecture/rules/full-suite release gate; this receipt does not claim publication, installation or an earned Klein replay.

| Check | State |
| --- | --- |
| FLR1 · Build | Fresh main-bundle esbuild input, SHA-256 `d2ba7f143317736ecc2e49deb200c0949c81bc945583ce78be5047bd82fa28cd`. Source includes the scalar cohort fact, fresh domain completion support and Notebook report key. |
| FLR2 · Route | `tests/lotm_charm_upkeep_browser.mjs`, fresh origin, synthetic aged Slumber workshop at 1920×1080. Fixture setup supplies two old unused charms, Seer access, a prepared workshop and an initially sleeping Old Neil. After setup, ordinary native buttons perform upkeep and both throws. The actual private Klein pack is unavailable here. |
| FLR3 · Shown | The disabled offer explains the awake-mentor requirement and the current fading response. The paid visit reserves the physical charm with Neil and debits one spirituality immediately. The source-default visit takes ten played minutes. Notebook records the same charm's return with its charge renewed; a fresh retry is blocked. |
| FLR4 · Used | One faded charm burns and sleeps the nearby person for two minutes. The other retains its cohort identity through upkeep and later burns for five minutes of sleep. The burned unit is gone from both native stock and the cohort ledger; the missing-stock offer stays blocked. Faded use and waiting for the mentor are live alternatives. |
| FLR5 · Kept | Save, reload, Export and literal file Import preserve native stock, spirituality, cohort identity/stamp and clock. Imported fresh state cannot award another upkeep result; later use spends that maintained charm once. |
| FLR6 · Labelled | Agent-verified on a named synthetic native fixture, not human-reviewed. The Chinese reading is bounded source evidence; the visit, timing, cost and strength curve are authored. |
| Focused unit/source/compiler | `node --test tests/lotm_charm_upkeep.test.js tests/lotm_act_engine.test.js tests/lotm_craft_rows.test.js`: 19/19 passed after the scalar-ledger and native-facts corrections. `node --test tests/lotm_charm_upkeep.test.js`: 5/5 passed after adding the Notebook consumer assertion. |
| Browser details | `node tests/lotm_charm_upkeep_browser.mjs <exact fresh bundle>` passed, including zero page errors and zero horizontal overflow. On this Windows host, `YAIRPG_PLAYWRIGHT` points to the installed Codex runtime package. [Machine proof](../../../representations/evidence/lotm-charm-upkeep-2026-11-25/proof.json), [unmet offer](../../../representations/evidence/lotm-charm-upkeep-2026-11-25/unmet-desktop.png), [renewed Notebook record](../../../representations/evidence/lotm-charm-upkeep-2026-11-25/renewed-desktop.png). |
| Change surface | One new leaf helper and the existing silver module; narrow stock/description and current-fact hooks in LOTM hosts/domain; the existing simulation settlement call receives current native stock. No composition-root registration or new persistence slice. |
| Remaining scope | Unit cases cover legacy, unknown incoming stock, outgoing stock and preservation of a reserved unit. They do not prove per-item provenance across an unrecorded same-count sale/reacquisition, a real earned Klein journey or other charm types. Native interruption beyond the shared reservation/refund contract was not exercised in this final route. |
| Shared gates | Coordinator owns `npm run build`, `npm run check:arch`, `npm run check:rules` and the wave suite. No source change, commit or deployment is inferred from this receipt beyond its named files and observed route. |

The native scalar actor fact stores the cohort list as JSON text, matching the existing fact contract. Fresh completion support is projected through the LOTM domain at the actual native settlement boundary, so a stale admission fact cannot certify a mentor's current presence. The upkeep report uses the existing `book.lotm.*` Notebook namespace.

The final capture-only pass reused that same acceptance bundle to replace the oversized unmet-panel capture with the exact native upkeep offer. Both linked images were visually inspected. The native game MCP tools were unavailable in this session's enabled tool inventory, so this receipt supplies rebuilt browser evidence rather than a separate MCP walk.

Cleanup: owned browser/server processes stopped. Automatic approval review rejected both a verified recursive cleanup command and a literal empty-folder removal as “blocked by policy.” Twelve empty `oops-charm-upkeep-*` output folders and six diagnosed failed `yairpg-playtest-bundle-*` candidates remain under the local temp directory. The accepted `yairpg-playtest-bundle-QUTWoX` candidate is retained for the coordinator's integration gate; tracked evidence includes no copied save. No unrelated process or save was touched.
