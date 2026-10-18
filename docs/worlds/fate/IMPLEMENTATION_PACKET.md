# Implementation packet: Fate / TYPE-MOON first slice proposal

Status: **proposed handoff only, not assigned or implemented.** No runtime owner, save schema, UI or gameplay is changed by this pack. [CAMPAIGN_FRAMEWORK](../CAMPAIGN_FRAMEWORK.md) and the [source ledger](SOURCE_LEDGER.md) bound future work.

## Proposed slice: authority, supply, and agreement

**Outcome:** one desktop/laptop contract scene makes three distinct things visible: finite authority, available energy supply, and the other actor's willingness/ability to act. The visible action is a specific, bounded request with authored alternatives and an observable result. This starts in a tiny authored scenario, not a canon route or live Grail War. All fiction and numbers are proposals.

**Why this slice:** it tests the narrowest comparatively well-supported distinction from Fuyuki digest DF1–DF3 and does not require a full universe simulator, route graph, lethal combat, summon roster, or timeline engine. It is not selected canon gameplay and has no human acceptance.

## Proposed test fixture

| Fixture field | Proposal |
|---|---|
| Continuity | One edition-pinned *Fate/stay night* route branch; exact placement is selected only after primary-source review. The service and local people are original fan-continuity additions. |
| Scenario | A contracted helper is asked to perform one observable, non-combat service before a local deadline. |
| Actors | New local requester and autonomous helper; neither is a source character or Heroic Spirit. |
| Means | One finite authority token, a distinct supply account, and a helper with stated capability and intention. All values are invented and labeled. |
| Choices | Spend authority on a narrow request; fund the work without commanding; negotiate/ask; refuse and leave the service unresolved. |
| Failure cases | No supply; unavailable helper; interrupted command channel; broad request; helper declines; duplicate settlement on reload/import. |
| Persistence | One committed scene/settlement only if the integrator selects a save-compatible design. No schema is proposed as accepted. |

The fixture uses a canon continuity with an original local service. It must not claim a canon scene or a working canon rule until the selected primary source has been checked. It tests the authoring distinction, then needs a separately authorized source-grounded implementation proposal if passed.

## Proposed dependency order

| Stage | Needed capability | Evidence to collect |
|---|---|---|
| `P0` Ownership review | Identify current active writers, available state/effect owners and one integrator. | Fresh worktree/process/owner check; preserve existing dirty files. |
| `P1` Source qualification | Select exact source version and exact command/supply cases. | Direct primary source locator; reconcile digest DF1–DF3 and wiki revisions. |
| `P2` Authoring validation | Validate continuity, actors, authority, supply, ability, target, failure and knowledge references. | Static card contract; no runtime claim. |
| `P3` Observable scene | Show costs/known uncertainty and record actual result/refusal. | Rebuilt browser from fresh desktop origin at 1366x768; distinct acceptance per route. |
| `P4` Persistence | Preserve unique commitment, actor states, supply, authority and knowledge. | Save, reload, export and literal-file import with exact before/after comparisons. |
| `P5` Human acceptance | Let Weibao play the authored slice and accept/change it. | His separate review; no inference from tests. |

Stages are proposal order, not a claim that current APIs support these records. The integrator must name owners and decide compatibility/migration before a persistence change.

## State and ownership questions for an authorized follow-up

1. Which existing expansion state can own one independent family/continuity/instance without aliasing other worlds?
2. Which existing action/effect owner can stage a single authority spend, supply spend, interruption and settlement atomically?
3. Can observer-specific knowledge and contract counterparty behavior be represented without adding a competing writer?
4. What is the compatibility policy for older saves and missing world-pack data?
5. Which source-grounded Fuyuki scene supplies the selected positive, resistance and charge-spend cases?

Until these are answered, this packet is source/design preparation only. It does not green-light code or runtime edits.
