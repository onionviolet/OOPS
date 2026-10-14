# AN1: check a generated event against its actual world

2026-10-14. **PROPOSAL ONLY.** Extends [root AN1](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#an-continuity-guard). Reuse [P11 context](../p11/CONTEXT.md), [P13 rules](../p13/RULES.md), [P14 history](../p14/HISTORY.md), [P18 hygiene](../p18/HYGIENE.md) and [AM detail](LEVEL_OF_DETAIL.md). This is a semantic admission/settlement guard, not a prose-only lint or a substitute for existing validation/publication.

## AN1.1: source seams and gaps

| ID | SHOWN/SOURCE, main checkout | Inferred extension |
|---|---|---|
| F1 | `src/simulation.js:98-107` checks alive target/participants, world, work occupancy and optional co-location for commands | Useful command gate. No proof all generated event casts run through it. |
| F2 | `src/simulation.js:501-514` event checks test initiating actor life, authored requirements/open same-definition event, chance and occurrence metadata | Actor-alive is not every participant alive/present/known, or destroyed object/era consistency. Content predicates can supply some checks; audit each selected event, not claim every event is broken. |
| F3 | `src/simulation.js:399-411` freezes event revision/responses and applies effects; `:427-440` rechecks response availability and response requirements before costs/effects | Frozen terms are useful; changing reality needs declared stale-event handling. Never rewrite an accepted event into another offer. |
| F4 | `src/simulation.js:474-499` jobs/conditions/life endings/expiry execute before event checks/controllers | Guard reads the resulting boundary state. A same-boundary death must not be missed by checking yesterday's snapshot. Preserve actual scheduler order and source-specific exceptions. |
| F5 | P4 `src/generated_people.js:69-76` rejects interactions while away and verifies met/funded supply state; P2 `src/mixture_state.js:84-98` checks holders/exposure refs | Existing narrow guard precedents. A qualified reader is needed across owners; no name-based joins or hero-stock substitutions. |

Structural validity is necessary but does not certify a story assertion. “A registered person exists” does not mean they can attend today. “An unknown material record exists” does not mean the hero knows its effect. No runtime guard is implemented by this paper.

## AN1.2: declarative obligations per role and claim

Each proposed event template declares bound role refs, required fact queries, assertion audience, local clock/era/source profile, actual cost/output owners, stale/defer/closure policy and allowed alternatives. The guard uses typed assertions before P15 renders original prose. It must not infer mechanical truth from an arbitrary sentence or ask a runtime LLM to decide whether a dead person is alive.

| Check code | Required distinction | Legal fallback for the same cause |
|---|---|---|
| AN1.G1 life | Current incarnation alive, dead, departed, dormant, transformed, unknown or unresolved; allowed spirit/echo/record route explicitly qualified | In-person visit fails for a dead actor. A retained letter or qualified spirit route can proceed only if its own cause/means exist; otherwise defer/close. No automatic resurrection. |
| AN1.G2 presence | Physical co-location/contact versus remote channel, transit, busy/reserved or inaccessible instance | Wait for an actual arrival, use an already supported remote channel, or close/refund under frozen terms. “Absent” is not death. |
| AN1.G3 object/place | Exists, destroyed, damaged, repaired, moved, unavailable, title/custody and installed capability | A visit to ruins or repair request needs an authored fitting alternative. A repaired vessel does not restore lost contents. Site identity remains after destruction. |
| AN1.G4 knowledge | World truth versus claimant belief versus listener knowledge; unknown to player versus missing author data | Unknown truth may cause a concealed physical effect. Dialogue asserts only sender knowledge/attributed claim; unresolved required law blocks execution. Neutral text is allowed only if mechanics are otherwise sound. |
| AN1.G5 era/continuity | Instance, incarnation, source edition/continuity, current local window and selected AU overlay | Use a qualified event for this era or defer/close. A historical account can discuss an earlier person with correct as-of date; no contemporary meeting outside its window. |
| AN1.G6 causality/means | Actual parent cause, funded reward, available stock/source, open promise, consumed claim and reservation ownership | Requote unadmitted work; accepted terms use declared cancellation/partial-output/refund. A new supported need can renew content; replay of one settled cause cannot pay twice. |

Negation never converts unknown/unresolved to true. Owner queries return pass, contradiction, unresolved or inapplicable with typed internal codes. A mandatory conjunct requires pass; alternate branches explicitly declare their required inputs. An optional description can omit an unsupported fact while preserving all executed consequences. Canon exceptions are laws with locators, not generic fallback flags.

## AN1.3: two guard points and one durable result

Before selection, obtain a revisioned qualified context and exclude definitely invalid bindings. A summary missing required detail requests AM promotion once; it does not privately manufacture a conveniently available NPC. At admission, revalidate current revisions/cast/means, freeze the cause/terms/draw/result and commit before publishing. A rejected or failed write consumes no new admitted draw/cost. Existing automatic check attempts may have their own draw semantics; the selected adapter must preserve those rather than silently retrofit a different PRNG policy.

Immediately before firing/applying each promised effect, recheck the template's live obligations on the current boundary plan. Recheck again when the player responds if relevant time/state has changed. Frozen historical statements retain their original as-of date; they are not rechecked as present-tense world truth. Use exact references and scoped changes to invalidate cached results. A guard cache must not survive changed life/site/clock/knowledge/reservation revisions.

Fallback priority is declared in the event, not universal: retain dated account → use supported modality/role alternative → defer within explicit local expiry → close/cancel with honest consequence → quiet for optional ambient texture. Never repeatedly redraw until something passes, silently debit another actor, substitute a canon identity, drop escrow or fabricate a clue. Before admission a lawful alternate actor can be bound deterministically; after admission substitution needs the frozen agreement's permission and retained change receipt. Old offered terms remain inspectable where known.

Persist a compact verdict ref in the existing event/thread owner when it affects gameplay: cause, obligation IDs, owner revisions, local boundary, chosen fallback, deferral due/cursor, resolution and cancellation receipt. P18 owns retained QA diagnostics and “Why?”; P32 does not create an unlimited contradiction log. Idempotent retries return the same disposition. If required semantics are unsupported, pause/reject through an actual supported host; a message promising a refund cannot execute unsupported money code.

## AN1.4: three concrete scenarios

**EX1 original absent repairer:** a repair invitation is admitted while the repairer is present; travel then departs before attendance. Guard defers to the next supported arrival under agreed terms, or cancels/refunds an actual deposit. A dated notice stays visible; no remote repair without means. Competing qualified repairers, buying a replacement, self-repair and ordinary work remain reachable.

**EX2 original destroyed workshop:** an earlier reopening account arrives after a later fire. The account retains its dispatch/as-of date and claimant. Current station access fails, prompting fresh inquiry or supported restoration work. The guard does not censor historically true news or regenerate an intact station. [P20 news](../p20/SCALES_AND_NEWS.md) owns delivery and accounts.

**EX3 canon method:** Harry Potter's ordered preparation example is attributed to J. K. Rowling, *Philosopher's Stone* ch8, inherited H02/CCF03-04 in [P6 locators](../p6/CANON_LOCATORS.md). STATED in the cited teaching account: preparation order explains a failed brew. The guard can require the selected operation order and teacher availability for an authored lesson; INFERRED original adaptations cannot turn it into universal chemistry or give every teacher all recipes. No source prose copied and no new primary authentication claimed.

## AN1.5: cases supplied to P18, no second harness

Proposed fixture matrix: dead/absent/busy required actor; destroyed then repaired site; unknown-to-observer versus unresolved model; old era versus qualified dated account; same-boundary ending/delivery; LOD promotion during admission; accepted event becoming stale; new funded cause versus replay; unsupported pack; failed persistence and duplicate retry. Each case has a legal control and declared fallback, with native and synthetic cases separately labelled.

Hard gates OPEN: no invalid effect before guard/commit; no partial debit or erased custody; same cause/draw/disposition across yield/reload/import; dated claims preserved; no unknown-as-false loophole; ordinary play remains available under supported safe closure. Public refusal/“Why?” must be known-only: neutral unavailability when a detailed reason would reveal a sealed fact. Private review reports secret IDs/routes/status only, no answer-derived IDs/hashes/candidate lists. Rebuilt fresh origin at 1366x768 and 1600x1000 proves the eventual visible outcome; human plausibility is a separate gate.
