# Backlog-first work items and exact source return

Status: agent-verified at desktop 1366×768, not human-reviewed.

## Preflight

| Field | Scope |
|---|---|
| Request | Prepare a work item from an exact backlog entry, return to its source from Workbench, and demonstrate Harry's real backlog-first N2 work with the existing native implementation receipt. |
| Authority | Parent's explicit follow-up; AD6/AD36, AR14 and [UI rules](../../../UI_RULES.md) UR70–UR75. This task creates a proposed work item and attaches evidence; it does not change the native game or adopt the whole N2 idea. |
| Owners | Reading owns the server/schema admission in `idea-handoffs.mjs` and mixed queue adapters. This lane owns exact-entry form and source/proposal display. Klein's implementation/native-proof/build-check functions remain intact. Harry froze the existing native receipt before its fingerprint was attached. |
| Visible outcome | Ideas → exact N2 entry → Prepare a handoff from this entry → saved Workbench detail → existing native report → source-version check and stable return to that exact entry, including reload. Mobile is deferred. |
| Failure cases | No fabricated book/chapter/reading method, no source classification trusted from client input, no changed row silently substituted, no rewriting old reading handoffs or the original proposal when adding a report. |

Voice sample: “Saving it does not implement or approve the work.” The form starts from source identity and two authored proposal fields. Report, source-reading coverage and actual gameplay evidence remain separate.

## Flow and compatibility

The form submits `ownerReference`, `ideaId`, `documentHash`, `change` and `check` to `POST /idea-handoffs`. The backend re-reads the current canonical public owner. `atlas-idea-handoff/1` stores a typed `idea-owner` source, exact reference, document fingerprint, section and source lines. It stores no invented `book`, `prefix`, chapter or reading method. Existing reading packets retain their original schema and source identity.

Workbench gives backlog-first proposals their own source display and owner-version check. It distinguishes an unchanged exact entry from unrelated owner-file drift. The deep `#workbench/ideas/<encoded owner>/<exact ID>` backlink opens that entry and survives refresh; a missing exact entry is not replaced by a similar code. Legacy reading proposals retain their batch-output/source-version route. Existing implementation-report and native-proof controls are reused.

## Real Harry work item

The actual queue now retains proposal `5f0c07c35f376c6433a9967abc683ba9044ea752881f5a93cf23592ae7813f9c`, rooted in the gameplay owner's N2 row `f9dceadaf608390dd3b2a5be153162ddedc37548d8dd2ff66d985c977d673f48` and owner fingerprint `66db5cedf058a9e90f827d63ae128517167063acc8b9e5b16d14340b767de186`.

Report `5a7c2d8333dd67df6f1ef9dac6d2d605397b454b80bf5bbb0e04b0a1be31bb25` attaches:

| Input | Frozen SHA-256 |
|---|---|
| `src/hp_library_work.js` | `f26cdff0ad281b72d1ca349e5e7dab6e54da3fd9b1e17a1470d3c373d944e375` |
| [Harry's native receipt](HARRY_LIBRARY_WORK_2026-11-25.md) | `3b821d732abffad3155867dc73004ca5c8d0951b8defa66d598523a2e57647b1` |

The report explicitly separates the composed school-day chart/homework proof from normal fresh entry. The composed fixture exercised real Charms/wand and Astronomy actions, ladder and paid Levitation failure/success, copy/return, aided homework and persistence. The normal fresh life reached dressing and the day-32 refusal, with the named private-source dependency; it did not reach the chart payoff. The general N2 proposal and an earned opening-to-library route remain open. Harry agreed that subsequent public-stub/passage findings will use a separate receipt so these attached bytes remain frozen.

## Checks

| Command/evidence | Result |
|---|---|
| `node --test tests/atlas_idea_owners.test.js tests/atlas_idea_handoffs.test.js tests/atlas_reading_handoffs.test.js` | 29/29 passed. Exact source admission/drift, no forged reading identity, immutable mixed queue/report compatibility, source comparison, privacy and native-proof regressions included. |
| `node prototypes/world-atlas/prove-harry-idea-handoff.mjs` | Passed, exit 0. Real local immutable proposal and native report attached through UI, current file fingerprints match, owner comparison/deep backlink/reload work, no reading fields, no page errors or overflow. No native game state was mutated. |
| Syntax/whitespace and `npm run check:docs` | Passed; no new documentation hits. |

[Machine proof](../../../representations/evidence/atlas-harry-idea-handoff-2026-11-25/proof.json), [form](../../../representations/evidence/atlas-harry-idea-handoff-2026-11-25/backlog-first-form-1366.png), [Workbench report and proposal](../../../representations/evidence/atlas-harry-idea-handoff-2026-11-25/harry-work-item-report-1366.png). The Workbench capture was visually inspected.

The real queue records are retained because they are the requested reviewable work item and evidence. Owned proof processes and temporary test log were removed; no source owner, private corpus, game save, commit or deployment changed. The parent owns integrated release gates.
