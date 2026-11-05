# KJ3F implementation receipt: the five-year contract at the Chanis Gate

2026-11-02. Started on Weibao's "Start on D1" (the PF13 second-episode comparison). **Agent-verified, not human-reviewed (AD43).** Not committed, not installed, no personal save touched. Content-only: the bundle is KJ3E's (`919b17d3…`), so no runtime or UI code changed. Pack `89ff980a…` (revision `cast-reviewed-kj3f-2d45209d…`).

## Scope and source

English v1 ch17 P047-P075 (official edition, sha256 `395c9d9f…`), read from the sweep shard text; sweep rows s1.9-s1.11 were inputs. Five native intents in one situation, in the duty room before the Chanis Gate: enter and confirm, read and sign the contract, shake hands and address Dunn as Captain, the cover signboards and unit numbering, the headcount. Next boundary: ch17 P075 onward (loss of control, duties, Chanis Gate tour; sweep rows s1.12-s1.16).

| Decision | Basis |
| --- | --- |
| Signing closes `book.lotm.kj3d.offer.open` and sets `offer.accepted` | ch17 P054-062; the invitation is answered |
| Terms recorded as knowledge, no wage mechanism | P057: five years, 2 pounds 10 soli weekly plus 10 soli; no payment is made in this window, so money is unchanged (asserted) |
| Dunn is relocated by `enter`, which lists no participants | The act's own relocation places him; `enter` with Dunn as a required participant blocked because he was not at the junction |
| Thumbprint, not signature stamp | P060 |
| Unit rows are knowledge only | P068-072 |

## Verification (one line per check)

| Check | Result | Gap |
| --- | --- | --- |
| Native route, headless Chrome, fresh origin, seed = KJ3E completed checkpoint, KJ3E bundle | Passed in one uninterrupted run, 75 s of runner time: five intents, money and inventories unchanged, contract signed, offer closed, 0 page errors | no rebuild (content-only); no full `npm test` |
| Literal Export/Import | Position and `contract.signed` preserved | |
| Presence preflight (`presence-preflight.py`), prefix `kj3f.` | 0 blockers | under-called `enter` (see below) |

Not run: counterfactual blocks, 14/21 px captures, human play-through, civil clock.

## PF13 comparison point (not a speedup claim)

| | KJ3E (ch16-17 P046, no presence preflight) | KJ3F (ch17 P047-075, with preflight) |
| --- | --- | --- |
| Intents | 11 | 5 |
| Runner executions to green | 11 plus 3 probes | 4 (final run was the first full pass) |
| Late presence corrections | 3, plus a freeze | 1 |
| Other late fixes | runner key bug, empty participants list | 2 of mine: a string used for an ID in two notes; wiped the `/tmp` symlink to `private_packs` and restored it (repo data untouched) |
| Source reading | window read in full | window read in full (sweep text, one pass) |

Reading: the preflight removed the class of failure KJ3E lost about four runs to, but the sample is two episodes of different size, one builder reused from the other, and a window with a single new actor. It supports keeping the preflight and the sweep rows as inputs; it does not show the sweep tier is faster, because both episodes still needed a full source read. PF13 stays a proposal.

## Finding for the preflight

`HELD_BY_VISIT` was reported for Dunn at `enter` ("held wherever they already are", also scheduled at the Chanis Gate) while the act's own relocate is what places him. The act failed natively with "Meet all required participants at this location." Proposed rule: an act that relocates a participant and also lists them as required should be `NOT_PLACED` unless an earlier act or hours place them. Not applied here; the tool is unchanged.

## Follow-up (same day)

The preflight rule above is applied: a visit holds a participant only after its arrival act, and a schedule match with no hours is AMBIGUOUS. Re-run on KJ3E and KJ3F: still 0 blockers; the broken `enter` variant now reports AMBIGUOUS where it used to pass. The next slice is [KJ3G](KJ3G_IMPLEMENTATION_RECEIPT.md).


## Content reconciliation B484: contract and preflight chronology

Historical contract transition and corrected preflight under AD36/AD42/AD43. Five intents accept and close the pending offer; contractual wage terms and unit organization remain knowledge, not paid income or a wage schedule. The unchanged money/inventory assertion is material. A five-year contract fact does not establish five years of enforced simulation. The source window, thumbprint and private pack identity remain the original author's qualified evidence, not a new chapter read here.

The initial presence preflight's zero blockers missed a real admission failure: arrival relocation cannot satisfy its own required-participant precondition. The same-day follow-up supersedes the earlier not-applied tool status. Visit holding begins after arrival, and a no-hours schedule match is AMBIGUOUS; the broken variant subsequently reports ambiguity, not a proven blocker or universal placement solution. Native placement workaround and static preflight diagnosis remain separate.

One uninterrupted native run starts from KJ3E's completed checkpoint on its unchanged bundle, not a fresh campaign. Literal import proves position/contract at that identity. Four runner executions, a repaired temp symlink and ID-string errors are retained without attributing them to gameplay or hiding retries. The two differently sized episodes and reused builder do not establish sweep speedup; both required source reading. No counterfactual, font capture, civil-clock or human evidence is added. KJ3G owns the later duties/tour continuation; the dated next step does not dispatch it again.
