# GA9 draw hooks over G1

2026-10-14. INFERRED proposal, docs only. Authority and vocabulary:
[root Round 2](../../../../GENERATION_FOUNDATION_RULES_2026-10-14.md#round-2-2026-10-14-comic-worlds-generation-cheats-overarching-shape-abstractions),
[E1 7-9](../../../../emergent/E1_SEEDED_STREAMS.md#7-stream-access-for-cheats-proposal),
[kit CL/CLR](../../../../worlds/WORLD_CORE_KIT_2026-10-14.md#cheats-that-show-the-kit-lens-cheats-cl).
G1 owns pure picks, P1 owns roots/cells, G3 owns table queries/overlays, G6
owns addresses/pins/freeze. GA9 coordinates their interfaces, without a second
RNG, pin map, tag store, simulator or truth history.

## H1. What is shown and where to attach

Line locators are from reads in this run. G1 locators use its worktree path,
not a claimed merged `src/gen_kit.js`. Final refresh read G1's report and
committed file at `adaa4e18` on `gen/g1-kit`; this commit is not an ancestor
of the current main-checkout HEAD. The earlier draft locators still match.
G1 reports 27 focused/661 full-suite passes; G5 did not rerun those suites.

| State | Read attachment | Meaning for a builder |
|---|---|---|
| SHOWN | `src/seeded_streams.js:23`, `:38`, `:42` | Persisted root, lazy initialization and world scoping. Craft is currently exempt from world suffixing; add world/life to new GA9 addresses explicitly. Do not silently change old roots or keys. |
| SHOWN | `src/seeded_streams.js:47` | `unitDecision` is pure and takes `n` plus `salt`; candidate preview seam, not a cheat host. |
| SHOWN | `src/seeded_streams.js:59`, `:64`, `:70`, `:75` | Ring append, ordinal advance, sequential draw and keyed draw. `keyedUnit` also appends a receipt; it is not a side-effect-free peek. `ensureStreams` can initialize state. |
| SHOWN | `src/seeded_streams.js:79`, `:83`, `:88` | Chance/int/table helpers call `unitDecision` with default salt. `rollTable` accepts floats, returns an index, and has no tag, table revision or cheat policy. GA9 must not pretend it already implements G1. |
| SHOWN | `.claude/worktrees/gen-g1-kit/src/gen_kit.js:44`, `:65` | Draft canonical `address` and addressed uint32 draw. Different hash from P1 means a port changes future outcomes and needs a compatibility note. |
| SHOWN | `.claude/worktrees/gen-g1-kit/src/gen_kit.js:96`, `:109` | Draft weighted/stratified picks return integer totals and reasons. Sorting belongs to G1. Tag filters/overlays belong before these calls. |
| SHOWN | `.claude/worktrees/gen-g1-kit/src/gen_kit.js:136`, `:152`, `:169` | Draft bag transition, pity and bounded retries. Keep bag/pity changes in the planned state, not render code. Retry attempt is separate from a paid reroll attempt. |
| SHOWN | `.claude/worktrees/gen-g1-kit/src/gen_kit.js:185`, `:191` | Draft pure cursor peek/commit returns replacement state; host must install it. Cursor ordinal is caller-owned. |
| SHOWN | `src/storylet_deck.js:29`, `:43`, `:61`, `:65`, `:69` | First proposed port: candidates with cooldown/repetition/pity weights, local xorshift, quiet outcome, top-three receipt and miss update. Port through the kit once, rather than let cards reach these internals. |
| SHOWN | `src/cheat_cards.js:2`, `:32`, `:47`, `:65` | Closed ten-field card, strict held-entry shape, grant only copies data. Hook arrays are JSON, not executed or semantically validated. |
| SHOWN | `src/save_files.js:45`, `:48`, `:71`, `:81` | Envelope/card/streams validation and newer-game-version refusal. Add GA9 validation before publishing loaded state. Unknown GA9 schema needs its own refusal. |
| SHOWN | `src/status_window.js:23`, `:36`, `src/cheat_cards.js:85` | Existing render/discovery uses the first matching awakened status card. No general lens routing. Add one projected receipt reader to this host, preserving its discovery gate. |
| SHOWN / UNKNOWN | G1 commit `adaa4e18`; no GA9 host or port shown | [G1 REPORT](../g1/REPORT.md) is now present. Committed helpers are source evidence; main integration, native persistence and gameplay remain UNKNOWN. |

G1 draft `top` contains up to five weighted candidates (`gen_kit.js:103`),
while root GI5 proposes three contributors. The host should retain three
projectable reason summaries plus the selected reason and full denominator,
without editing G1's active lane. A candidate weight is not necessarily a
causal contribution. A tag/fate/pity transformation needs its own reason.

## H2. Shared request and pure response

Proposed API names below are adapter names, not exports found in code.

```js
planDrawHook(snapshot, request, dependencies)
  -> {status, plan, receipt, observation}
// status: quoted | blocked | stale | unsupported
// plan is replacement state, installed only by the ordinary save host
```

| Input | Contract |
|---|---|
| `requestId`, `op`, `actorId`, `cardId` | Stable intent ID; one of peek/pin/reroll/bias/branchPreview/blind; held, active source checked through ordinary capabilities. UI panel visibility grants no capability. |
| `scope` | World instance, life, continuity, stream domain, subject, decision slot and optional ordinal. Match allowed scope (`own`, `party`, `near`, `any`) before reading hidden candidates. No arbitrary user-supplied wildcard execution. |
| `address` | Stable logical decision from G6. Distinct evaluated key includes table revision, `rerollAttempt`, `retryAttempt`, branch salt and all declared inputs. Logical address stays stable across table revisions so pins still match. |
| `expected` | Snapshot/version token, table `id@rev`, input fingerprint, overlay revision, current attempt, bag/pity version, clock window, collision-policy revision, freeze revision and knowledge/permission revision. |
| `args` | Operation-specific JSON below. Values use IDs/tags, never array indices or raw secret strings. |
| dependencies | G1 picker/draw, G3 effective-table reader, G6 pin/freeze reader, ordinary action-cost planner, domain capability reader, knowledge projector and branch host. Pure dependencies supplied by trusted host; not saved on cards. |

Build one immutable resolution snapshot: eligibility/quiet outcome →
world/region/person overlays → repetition/luck shape → eligible fate pull →
cheat bias → collision decision/pin → G1 selection → bounded constraint
retry/fallback → result. Actual order is a named per-world collision policy.
GCR2 reads the final resolution policy, including later overrides, not merely
the weights just before them. See [HONESTY](HONESTY.md).

Addressed decisions do not advance a global cursor. Cursor-backed decisions
map quote position `i` to the same reserved ordinal on later commit. For the
draft G1 cursor, `peek` uses `n` and `commit` installs `n+1`; P1 `drawUnit`
increments before drawing. The port must specify which ordinal it means and
test the mapping. Do not paste a P1 cell into G1 and assume they agree.

## H3. Six operations

| Hook | Arguments and result | State/effect rule |
|---|---|---|
| `peek` | `decisionIds` or bounded count, read kind odds/menu/explain/freeze/kin/pity/fallback/layout, grade/horizon. Returns knowledge-safe observation and context token. | No cursor, attempt, pity, bag, pin-use or truth-freeze change. Paid consultation is an explicit action; hover and focus use a free cached projection. Never call live `drawUnit` or `keyedUnit`. |
| `pin` | Logical address, desired eligible option ID or category tag, chosen table revision, expiry, use budget. Returns proposed overlay ID and supported option receipt. | GA5/G6 store. Cannot invent an option or bypass world constraints. Unseen truth only. Category pin preserves weighted choice within that category; exact-option pin makes that option certain. |
| `reroll` | Address, original receipt ID, expected attempt, variant `forced-new` or `choose-between`, cost profile. Returns original and replacement receipts. | Increment this decision's `rerollAttempt`, never the whole stream salt. Validator retries use their own nested attempt. Charge once on accepted paid intent even if the same value returns. Cancellation before intent acceptance charges nothing. |
| `bias` | Stream/subject scope, A2 tag query, rational multiplier `{num,den}`, duration in local game minutes or eligible decision windows, stacking policy ID. | G3 overlay reweights only eligible rows, before G1. Compile to integer weights by an explicit G3 quantization rule. Expiry is `[start,end)`. Installation paid once; renewals are new intents. |
| `branchPreview` | Anchor receipt, declared state scope, alternative known action, mode replay/fork/split, horizon and work budget. | Existing simulator/branch host evaluates a cloned envelope. Live bag, costs, receipt ring and pins untouched. Only a paid consultation cost can commit to live state. No restore/keep-result button in this hook. |
| `blind` | Target self/party scope, domains, tier, duration, mode refuse/noise/borrowed-reading, contest policy ID. | Observer-access overlay. Hides or substitutes a reading, never changes the selected result. Default honesty profile refuses. Deceptive readings require an explicitly unreliable source policy. |

For `choose-between`, store both candidate receipts and the paid cost before
selection; changing the choice cannot generate a third draw. A pending choice
has a saved ID and continuation. `keep-better` is a separate data policy with
a declared comparison metric, not an undocumented max across loot or futures.
Rejected inputs/costs cause zero attempt bump. Exhausted safe-integer counters
block visibly rather than wrap. A pin can make reroll useless; show that in the
quote. Refund or declining such a request is a world/card policy.

E1 7.2 permits an unclaimed visible result to be replaced. Root GR3/SB18
requires a named mechanism to change anything seen. Proposed G5 default is
stricter for ordinary GC7: uncommitted, unfrozen truth only. An explicit
`replace-unclaimed` variant must retain the original observation/result,
declare in-fiction revision/residue and use G6's rewrite path. A speculative
forecast is an observation of a conditional future, not a revealed settled
fact. It never freezes that future. Reading an existing settled truth does.

## H4. Receipts, publication and persistence

```json
{
  "schema": 1,
  "id": "hook:life7:op19",
  "op": "reroll",
  "actorId": "actor:rival7",
  "cardId": "gc7-reroll",
  "logicalAddress": "decision:life7:loot17:hide",
  "table": {"id": "loot.frog", "rev": 3},
  "before": {"rerollAttempt": 0},
  "after": {"rerollAttempt": 1},
  "originalReceipt": "draw:17:0",
  "replacementReceipt": "draw:17:1",
  "contextToken": "opaque-resolution-token",
  "via": {"kind": "reroll", "costReceipt": "action:19:cost"},
  "collisionPolicy": "luck.default@1",
  "at": {"worldId": "base.frontier", "minute": 720},
  "visibility": "owner-projected"
}
```

Private authoritative record also references the root owner, resolved input
snapshot/version, applied modifier IDs, fallback marker, chosen result and
full distribution certificate. Do not print root seeds/raw draws in a normal
receipt view. `contextToken` is opaque to UI, not a cryptographic protection.
Receipt provenance can point to a hidden modifier; its public reason remains
generic until discovery authorizes identity. Attempts are audit information,
not proof that somebody manipulated luck.

Host sequence: validate and quote on a clone → recheck expected state on
submit → plan costs plus hook state plus decision effects in one envelope →
save → publish result/knowledge/messages. Failed persistence publishes none
of those changes. A committed `requestId` resolves to the same receipt on
repeat; version conflicts return stale before spending. Render never invokes
the transaction. NPC requests use the same sequence.

Proposed additive location, subject to P1/G6 reconciliation:

```json
{
  "expansion": {
    "generation": {
      "schema": 1,
      "attempts": {},
      "pins": {},
      "freezes": {},
      "overlays": {},
      "pendingChoices": {},
      "operations": {},
      "receiptRing": []
    }
  }
}
```

This is ONE owner group, not six GA9-owned stores: G6 owns `pins/freezes`,
G3 owns `overlays`, P1 owns the root and cursor, ordinary transaction host owns
operation dedupe/cost receipts. If their landing chooses `streams.mods`, GA9
reads that instead. Never store the same pin or attempt in both locations.
Cards store their own `state.schema`, training/source state and versioned
hook declarations. Do not add keys to `save.cheats`, held entries or card
top levels: live validators reject them (`cheat_cards.js:13`, `:48`, `:52`).
NPC cards belong under the existing actor/source owner; the current
player-centric `save.cheats.held` is not automatically an NPC registry.

Migration M-G5-1: missing generation group means empty maps, no cheats and no
historical freezes/attempts invented. Keep all saved legacy roots, cursors,
results and receipts byte-equivalent in meaning. Activate G1 only for a named
ported domain with a recorded algorithm/version boundary; old pending results
stay on their old resolver. Current P1 derives absent roots from the legacy
seed (`seeded_streams.js:23`, `:38`), while SB17 recommends a fresh root for
new streams. GA9 must not silently settle that mismatch by reseeding P1;
root policy is a P1/coordinator decision at a separately named port.

M-G5-2: independently version card state/hook descriptors; legacy cards with
empty hooks mean no draw access. New builds validate addresses, referential
integrity, supported operations, integer attempts/weights/durations, allowed
tags, bounded maps and JSON data before any import mutation. Unknown newer
schema refuses the external import with a readable message. Quarantine of an
existing on-device card is library FR1's proposed follow-up, not a behavior
implemented by C0. Retain unsupported raw data privately for recovery only
when that path has an implemented migration and safe host.

Use E1 4.5's bounded recent receipt/access history. Frozen truth, active pins,
pending choices and originals they reference are durable owner records and
cannot be evicted with the ring. Archive completed operation detail while
keeping the owner's monotonic accepted-intent marker to stop duplicate spend.
Do not erase expired bias provenance from frozen receipts. A historical import
replaces the envelope; it never combines old rewards with newer costs.

## H5. Freeze, revisions, NPCs and cross-lane seams

| Situation | Proposed result |
|---|---|
| SB23 table revised, pinned option still exists | Resolve by stable option ID, revalidate eligibility/constraints under new revision. Keep pin's created revision and new evaluation revision in receipt. |
| SB23 option removed or now illegal | Mark pin `orphaned`, return fallback/unpinned resolution under declared policy with visible generic note and receipt. Preserve desired ID privately; do not silently remap by index, charge a fresh use or call it successful. Default does not consume the pin use. Optional refund/research repair is data. |
| Frozen option removed | Keep saved value and old revision. Changed gameplay validity needs an explicit content migration; no silent reroll or reclassification. |
| SB24 ten addressed peeks | Evaluate the same ten keys in any read order, with no live write. Later unchanged commits reproduce them. Any changed input invalidates the affected forecasts visibly. |
| Cursor future with intervening actions | Ordinal is an assumption. Mark shifted if another action consumes a reserved decision. Counterfactual sequence is conditional, not an irrevocable reservation of NPC actions. |
| Bias installed/expired, pity/bag changed, world crossed | New context token and stale old observation. Frozen past remains exact; logical pins persist only within declared world/life/backing scope. |
| Retcon/regression | Named revision transaction through G6/world host; retain old/new truth and observation residue. Ordinary pin/reroll cannot edit freezes. |
| NPC cheater | Same hook capability, costs, collision policy and save transaction. Targeting policy reads NPC knowledge; omniscient truth is not handed to it just because it is an NPC. |

E1 section 8 C1/C2/C3 are selectable collision profiles, not a universal
player-priority rule. Declare ordering by role/tier/source and stable ties,
then apply that profile equally to equivalent player and NPC sources. GC3
can notice an unexplained favorable shift, then attribute it after a lawful
observation contest. It cannot print a rival's undiscovered card name.
Blind produces no detailed access log for the viewer (E1 7.7); private owner
receipts can still support deterministic restoration and debugging.

NPC example, INFERRED: a known rival installs a threat-tag bias for one local
hour; GC1 sees the current lawful distribution, GC3 shows a known modifier or
an unattributed influence, and expiry returns the next unfrozen decision to
baseline. The rival pays its own source costs. Matching request IDs after
reload cannot apply it twice. Counterplay can expose, dispel or outlast the
overlay; no alternate NPC generator is created.

GC12 counterpart meeting/trade and GC13 frozen retcon require existing
world/actor/revision actions in addition to GA9. GA9 can preview or select
their generation inputs; it cannot itself transfer traits, teleport actors
or rewrite history. GC14 requests a domain reading, not a raw universal root.
G6 owns canonical address/continuity semantics; G3 owns overlay conflict and
integer reweight rules. A2, A5, P18, P22 and P32 keep their existing owners.

Final sibling reconciliation: read [G3 overlay rules](../g3/OVERLAYS.md) and
[G6 pin contract](../g6/PINS_AND_CANON.md). G3 v1 supports integer `add`/`set`
reweight and exact-entry pins, not rational multiplication or category pins.
GC8's rational descriptor therefore needs a follow-up G3 adapter that applies
the tag query at evaluation and compiles a transient integer weight vector.
One exact option is common-denominator scaling followed by GCD reduction;
if the resulting total exceeds G1's uint32 resolution, block with a safe
reason rather than round a reachable positive option to zero. Do not add a
new persistent copy of a table. Actual multiplication order is part of the
world policy and certificate. Category pin stays unsupported until G3 admits
that extension; the first mutation slice uses an exact eligible option.

G3 uses `invalidated` for a removed pin and preserves temporarily ineligible
pins pending until expiry. H5's `orphaned` is that projected compatibility
condition, not a competing persisted enum. A stable option ID still requires
the original entry revision or an explicit reviewed compatibility map to
the newer entry. G6's typed authority, expectedRevision and valueRefOrValue
remain authoritative. Its `readPin`/`planPinChange` is the dependency used by
GA9; the illustrative save group above is not a rival storage assignment.
G3 pin/bag policy removes only a matching remaining token on fulfillment,
does not burn an unrelated token, and counts the declared eligible window.
Carry that policy into odds and the atomic plan. A freeze retains historical
occurrence, not yesterday's health or today's custody: ordinary lawful state
changes create new causes without rewriting the frozen historical fact.
