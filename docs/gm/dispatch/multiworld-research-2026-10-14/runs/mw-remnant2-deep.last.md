Saved the [deep report](/Users/weiwei/code/yet-another-idle-rpg/docs/research/remnant-2/pass-2026-10-15-deep/REPORT.md).

- **D1:** Recovered AES key statically; both pak indexes decrypt. Key stays private.
- **D2:** Regenerated native mappings and added the recovered serializer. Clean packages: **0 → 160/161**. Objects without logged errors: **22,228 → 24,588/24,589**.
- **D3:** Traced native weights, seeds, selection history, eligibility and required-tile failure.
- **D4:** Read **749 gameplay/data packages and 40 UI/rule packages cleanly**; checked dialogue references and save-parser source.

Top proposals: **R2D-P01** local rules change actions; **R2D-P02** crossings quote each carrier; **R2D-P03** preserve visit identity/history.

Remaining: one audio record, full connectivity solver, complete reroll retention and native save recovery. Status **PARTIAL**. No game launch or save access; first pass preserved except its checkpoint pointer.