# E6: “Why did this happen?”

2026-10-14. **PROPOSAL ONLY.** Extends root E6, using P3 receipts,
[P11 KnownContext](../p11/CONTEXT.md), [P14 accounts](../p14/RETELLING.md),
[P15 expression](../p15/RUNTIME_TEXT.md) and
[E7 observation](../../../../emergent/E7_OBSERVATION_AND_MYSTERY.md).
No UI or explanation resolver was added here.

## E6.1: answer cause, selection and knowledge separately

Original fictional example, not canon: after a real repair commitment, a known
neighbor invites the hero to paid shared work. The details button could say:

> You kept this neighbor's repair agreement. That made shared work available.
> Your current pacing style favored a people event at this time. You accepted
> the quoted work, and its recorded completion paid the agreed fee.

Show that only if each clause has its own retained cause/setting/settlement
receipt. An offer is not a completed job; a scheduled deadline is not proof of
success or death. If only testimony exists, say “The neighbor said …” using
original safe summary, with speaker and date. Unknown causes remain unknown.

| Question | Evidence needed | Safe public answer |
|---|---|---|
| Why was this possible? | Public/known prerequisite and actual trigger refs | Known deed, place, availability or declared world law |
| Why this timing? | Saved due boundary/cooldown/clock policy | Played time and known wait; absence baseline if relevant |
| Why this person? | Actual role binding and permitted salience inputs | Introduced person and witnessed shared history |
| Why this event among others? | Saved selection factors and selected result | Known style/preferences and chance, without hidden alternatives |
| Why this cost or consequence? | Frozen accepted terms and actual applied deltas | Quoted/paid amounts and completion/cancellation, separately |
| Why automatic? | Enabled standing-policy/rule revision and actual response | “Your ‘help neighbors’ policy chose the free messenger response” if that is what happened |
| Why different from remembered canon? | Known anchor, continuity and admitted intervention/overlay refs | Qualified known divergence and evidence basis; no future event list |

P3 branch `storylet_deck.js:65-67` saves roll/total and three largest weights.
Shown/SOURCE: that is partial selection evidence, not a complete probability
explanation or player-safe candidate list. Main `simulation.js:398-400` freezes
occurrence definition revision, roll and cause; `423-438` records response
settlement. Main causal ledger/presentation provides a stronger cause/account
example (`causal_story_host.js:437-503`). None is a general explanation API.

## E6.2: proposed projection contract

`explainEvent(observer, occurrenceRef)` resolves existing owners and returns only
known nodes, as plain read-only data:

```text
id, occurrenceRef, asOf, knownTitle,
clauses:[{kind:eligibility|timing|cast|selection|policy|outcome|account,
          safeText, knownEvidenceRefs, basis:shown|stated|inferred|unknown,
          attributedSpeakerRef?, evidenceTime?, contradictionRefs?}],
knownSettings, actualKnownCosts, actualKnownEffects,
historyDetail:retained|summarized|unavailable
```

These are proposed field names. A truth-level internal causal graph is not
returned. Resolve visibility for each node **and edge**, including identity,
time and location. An opaque cause token visible internally need not be
rendered. Unknown hidden parents do not create a suspicious empty bullet,
secret count, special icon or “something hidden caused this” badge. Use a
uniform “Available records explain this much” only when the surface needs it,
without identifying secret existence.

Use shown/stated/inferred for claim provenance, not arbitrary numeric confidence:
shown means received direct evidence; stated means attributed testimony/rule;
inferred is the observer's supported interpretation. Distinguish content
evidence from adaptation proposal. A setting or purchase receipt is exact
mechanical evidence, but that does not certify an NPC's account as world truth.
Contradictory accounts remain attributed, with an optional reachable inquiry.

Snapshot explanation-relevant causes at commitment, then retain referenced
authority under F3. Later discovery can add known evidence with its own received
time; it cannot replace the original hidden cause or rewrite past speech. If
old exact detail was legitimately summarized, show supported summary and mark
detail unavailable, without inventing a receipt. Existing pending terms remain
frozen even if current weather, skills, style or source pack changes.

## E6.3: selection explanation is not a deterministic prediction

Known salience/style factors explain influence, not inevitability. Do not say
“this happened because Gentle selected it” if the saved trace only shows chance
and no director. Exact odds may be exposed when the complete legal candidate
set and its existence are already known and the world/settings allow it.
Otherwise say “chance among currently available events” without counts, hidden
names, rank or top alternatives. Authorized divination uses its own E7 means
and disclosure fidelity, not a free explanation-menu preview.

Root A3 says the next draws are already present. Inferred correction for QA:
the PRNG sequence is reproducible conditional on stream state and later
consumption; future event identity is not fixed when actions, means, cast,
weights or timing change. An explanation does not roll, look ahead, clone-run
all branches, or promise a future event. A3 remains a reachable divination
proposal requiring its selected conditional-forecast contract. Root E6 is not
authorization to expose seeds or sealed futures.

## E6.4: desktop surface and future acceptance

Proposed first surface: a “Why?” button beside a known storylet in its existing
panel/feed destination; one short cause paragraph and an optional expandable
record list. Keep ordinary actions visible and use desktop width: 1366x768 and
1600x1000. Mobile deferred. Do not add a compulsory new Stories tab merely to
ship explanations. Keyboard activation, labelled details control, readable text,
screen-reader-safe content and reduced-motion settings apply. Debug internals
stay in private QA traces, not the player's advanced drawer by default.

| Gate ID | Future check |
|---|---|
| E6.G1 | Same occurrence ID yields same committed cause/terms after reload/import and pack revision; new knowledge appears only after valid discovery |
| E6.G2 | One hundred repeated explanation/projection reads leave state, sequence, RNG, costs and cooldowns identical; explain failed and cancelled work honestly |
| E6.G3 | Before discovery, paired secret states reveal no extra fields/counts/IDs/labels/errors outside declared clue routes; even accessibility text stays safe |
| E6.G4 | Known antecedent, actual selection factor, policy choice and actual settlement can be independently traced; compaction keeps the needed queries; contradictory accounts retain basis |
| E6.G5 | Rebuilt fresh-origin journey shows the real known cause and changed result on both desktop sizes, then Save/reload/Export/literal-file Import; human clarity/fiction acceptance remains separate |

All gates **NOT RUN**. Test with an original repair/shared-work example or one
integrated P3 event whose cause is real. Generated P4 casting and D9 style clauses
are conditional additions after their joins, not fake facts in the first UI.
