# Proposed staged implementation packet: Black Clover first grimoire

Status: design proposal only. No source code, runtime, save, tests, build or browser were changed or checked.

## Outcome

Deliver one authored Hage-origin micro-slice in which a new candidate receives a grimoire and practices one sourced, simple spell, then chooses a village task or exam preparation. A second fixture has no grimoire and still has a useful playable route. This tests a meaningful origin and choice before importing large canon arcs.

## Boundaries

- Source: wiki snapshot 2023-12-24, with page revisions named in [SOURCE_LEDGER](SOURCE_LEDGER.md). Primary manga authentication remains open.
- Target viewport if UI work is later authorized: desktop/laptop, 1366×768 minimum. Mobile optimization deferred.
- No Asta/Yuno identity transfer, devil pact, anti-magic implementation, prestige, full campaign, canon event simulation, save schema, or sealed truth reveal in the first slice.
- All names, pay, minutes, inventory and local outcomes are fresh proposal values, not source facts.
- Source folder and all other worlds remain untouched.

## Stages

| Stage | Proposed work | Acceptance evidence needed later |
|---|---|---|
| 0 | Integrator selects existing pack/instance ownership and confirms the current authoring/runtime seam; no new world ID collision. | Owner review and declared save compatibility. |
| 1 | Add a structured start snapshot for ceremony result, grimoire ownership, attribute/spell and actor-visible knowledge. | Schema/lint check; both received and no-grimoire fixtures. |
| 2 | Add one low-risk authored practice action and one useful village job; no custom spell engine if existing action/effect seams suffice. | Two choices change distinct owned state and show actor-readable receipts. |
| 3 | Rebuild and exercise from fresh desktop origin. | Ceremony result persists; practice and job have distinct costs/results; no unsupported character lore leaks. |
| 4 | If persistence changed, save/reload/import and old-save compatibility. | Exact old-save and new-start receipts; no duplicate rewards after repeat/import. |

## Proposed test states

**Fixture A:** candidate has a grimoire, one basic spell and local mentor access. Choosing practice spends proposed time/effort and improves recorded reliability; choosing paid work instead earns proposed supplies and delays training.

**Fixture B:** candidate does not receive a grimoire. Training action is unavailable with an honest reason; paid village work and later exam preparation remain available. Do not auto-grant a grimoire on repeated refresh.

Both fixtures keep local authored pay and time values clearly marked proposal. Hage ceremony premise is sourced to `Grimoire Acceptance Ceremony` rev89662; no other story claims are needed.

## Deferred dependencies and gates

General world instance binding, richer cast scheduling, spell arrays, ambient mana, combat, source interoperability, independently running absent worlds, full AU selector and shared save/import adapters are outside the slice. The slice becomes playable only after the authorized rebuild and browser checks above; design prose does not prove behavior. Human acceptance of the fiction, values and feel remains separate.
