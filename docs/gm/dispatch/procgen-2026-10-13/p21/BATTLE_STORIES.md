# Battle stories and returning opponents

2026-10-14. **PROPOSAL ONLY.** Extends root **I1–I2** in the
[palette](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md).
[REPORT](REPORT.md) owns scope, evidence vocabulary and future gates. No runtime
behavior or new battle evidence is claimed here.

## F1: what live battles retain

SHOWN/SOURCE below means code inspection, not a played result. No named character
or setting in these source rows is a new generated actor or source-canon claim.

| Locator | Existing evidence | Missing consumer / precision limit |
|---|---|---|
| `src/native_battle.js:10–14,26–37,46–63` | Saved local battle seed/actions, last strike line, actual stamina and mitigated damage, one-HP floor. Finish writes last result, player-directed relationship memory, pursuit closure and completion; first qualifying win grants the existing source. | Session is deleted at finish. Last line is replaced each action; there is no retained action sequence or general turning-point capsule. Critical flag appears in transient text, not a typed terminal battle receipt. |
| `src/party_battle.js:9–30,37–40,48–59` | Consent, presence, body, source, kit and effort checks; actual helper payment. Finish retains `party.guardsTaken`, helper status, result and session ID plus relationship memories. | These facts describe the latest contest, not every contest. Relationship effects default to the player actor: a player-to-helper memory is not proof the helper independently remembers it. |
| `src/party_battle.js:61–97` | Guard costs two stamina/one effort; a supported guard redirects the next attempted blow; actual damage is resolved afterward. Release/unsupported/exhausted/yielded are distinct exits. | `guardsTaken` counts redirected attempts, including a miss or block. It cannot prove prevented damage, a successful rescue, betrayal or sacrifice. Party text drops the strike's critical flag. |
| `src/causal_story_host.js:231–275` | Paid actual-stat strike, separate intended lethality and applied health loss, source-qualified protection resolution, life outcome, guarded counter and typed strike receipt. Observers need local presence, attention and supported bodies. Target and witnesses receive their own knowledge/trust effects. | Receipt records `damage:loss` separately from `roll.damage`. Counter stores its computed result; the applied player loss is clipped to the nonlethal floor and must be captured separately for an exact injury claim. These are bounded authored proof cases, not all combat. |
| `src/causal_story_core.js:118–126,283–298` | Typed validated causal receipts, sequence/time ordering, duplicate guards and capacity reserved for closure/recovery. | Do not stuff arbitrary battle fields into its exact shape or repurpose its finite proof budget as a lifetime fight limit. |

F2: narrative infrastructure is useful but lossy. `src/simulation_effects.js:281–292`
separates knowledge basis and directed relationships; memories keep the last 32.
`src/simulation.js:398–410,423–438` freezes event responses, applies actual effects
and prunes terminal displays beyond 100. `src/event_feed.js:37–55,87–102` avoids
the global simulation log and shows known news, capped at eight.
`src/life_record.js:1,32–58` explicitly folds a lossy biography. None of those
windows should decide whether an old battle happened.

## I1.1: capture deeds before describing them

Add a battle adapter to [P14's history contract](../p14/CONTRACT.md), rather than
a second chronicle. Proposed logical payload, not a schema or API:

```text
battleRef, producerRef/revision, instance/branch/era, participants/side/role refs,
engagement terms (practice/nonlethal/lethal), location and clock refs,
actionRef/ordinal, actor, intended target, actual target,
attempt kind, computed damage, applied health/stamina/effort changes,
guard/protection/support refs, observedBy evidence refs,
terminal result, exit reason, consequence refs, draw receipt refs
```

Capture supported meaningful transitions in the staged battle plan, after the
resolver, before deleting the session and before durable publication. Ordinary
repeated strikes can be aggregated under declared coverage; keep exact actions
needed by a turning point or later callback. Terms and body/life transitions
remain battle/life owners' authority. Missing evidence stays unavailable.

| Extension | Evidence predicate | Honest generated account / useful later result |
|---|---|---|
| I1.2 Held guard | A paid guard redirected an attempt, with actual damage recorded | “Intercepted an attempt” if it missed; “took the blow” only on applied damage. A later willing collaboration can reference this exact guard. |
| I1.3 Last stand | Actor crossed an authored local low-health/effort boundary, stayed voluntarily, then achieved a supported objective | Chronicle records endurance, not an invented near-death outcome in a one-HP practice duel. A teacher may offer a funded relevant practice job. |
| I1.4 Rescue | Actual endangered objective/person became safe through a supported contribution | Record causal contribution. Claiming a fatal blow was prevented requires an actual protection rule or a declared counterfactual model; target redirection alone is insufficient. |
| I1.5 Reversal | A committed tactic/support change preceded a changed objective/terminal state | Use specific causes and uncertainty. A missed attack followed by a win is not automatically a miraculous fluke. |
| I1.6 Betrayal | Existing agreement, informed actor, actual breach and consequences | Consent withdrawal or agreed helper release is never automatically betrayal. Disputed accusations remain claims. |
| I1.7 Overwhelming victory / costly defeat | Actual objective and remaining costs | Weak foes need not scale up. Injury, spent supplies, successful retreat, protected cargo and a lost duel can coexist in the account. |

Sifting belongs to [P12](../P12.md); prose/dialogue belongs to [P15](../P15.md).
Deterministic labels can suffice first. Optional text draws use a separately
registered P1 scope, never consume combat RNG. A literary failure must retain the
valid deed with a neutral known account, without undoing it or redrawing facts.

## I1.8: three memories of one fight

The chronicle selects player-known deeds through P14. Each participant learns
only their own experience and reachable observations; directed memory references
the same typed deed. A distant faction needs a P11 message route, not mere group
membership. A witness may credit the helper while the player remembers the final
strike; both accounts can be incomplete. Propaganda can claim total victory while
the retained supply/objective receipt says otherwise. Corrections add editions
and beliefs, preserving the original account.

Reuse [P19 social-web lane](../P19.md) for relationship response and gossip,
[P20 places lane](../P20.md) for a site remembering the contest, and
[P6 creative works](../p6/CREATIVE_WORKS.md) for a battle song/manual. Receiving a
song transfers a claim, not combat mastery. Story-powered rewards stay with
[P17](../P17.md), qualified per world; fame has no automatic universal stat bonus.

## I2.1: survivors return through causes

Extend [rival chronicle](../../../../RIVALS_IDENTITIES_AND_FATE.md#a-persistent-rivalry-system-for-this-game)
using stable actor/body IDs and actual outcome receipts. Proposed continuation:
survived → learned limited evidence → selected goal → funded recovery/preparation
job → completed change → reachable reencounter. The goal can also be settlement,
withdrawal, a partnership, continued ordinary life or no response.

| Change | Required cause | Later visible difference |
|---|---|---|
| Scar or injury | A retained supported wound/healing rule | Known appearance or a real body constraint; no fabricated permanent scar after every hit |
| Counter preparation | Witnessed tactic or received credible report, own tools/funds/time | A different counter with an actual opportunity cost; no instant immunity or player-level rubber band |
| Humility / admiration | Actor-specific interpretation, not merely a loss counter | Respectful rematch, assistance or refusal; defeat does not force friendship |
| Alliance | Negotiated consent, obligations and means | Shared objective and real support; sparing someone grants no ownership of them |
| Revenge / succession | Actual informed motive and route; successor has a distinct ID | Pursuit can end, fail or change target. No death cleanup silently revives the former actor |

World-specific recovery, reincarnation, constructed bodies and exceptional returns
remain reachable under P9/P10/P16 laws. Canon people keep authored identity,
era and powers; local generated enemies fill permitted gaps. Reentering a place
or importing a save never draws a replacement rival. No punitive escalation from
browser absence, refused rematches or unselected appointments.

## First proof and open gates

S1 in REPORT: play the existing agreed solo/party contest, record one actual
guard and a no-damage intercepted attempt, finish or withdraw, then encounter a
known participant who refers to the correct result and offers one genuinely
changed interaction. A paid/timed opponent preparation can be the next increment.
Use synthetic fixtures for source cases; natural acquisition and rebuilt battle
play remain required. No causal lethal route is needed to demonstrate this slice.

OPEN: exact deltas/target/support and false-positive sifting; no rewards added by
history; stale/duplicate action and failed publication; directed witness scope;
live-reference compaction; same next combat draw after pending/completed Save,
reload, Export and literal-file Import; legacy enrollment compatibility; both
desktop viewports and human fiction acceptance. Full death/return, army battles
and world-wide observer networks need their own selected consumers.
