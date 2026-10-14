# G5: gossip along real contacts

2026-10-14. **PROPOSAL ONLY.** Extend [root G5](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#g-the-social-web), [P11 N5 channels](../p11/INFORMATION_AND_LIBRARIES.md), [P5 X7 biased accounts](../p5/EXTRA_IDEAS.md) and [P14 claims/beliefs](../p14/CONTRACT.md). P11 owns message transit; P14 owns historical fact/account/claim identity and editions. P19 supplies edge eligibility, source independence and how listeners react. It creates no parallel universal rumor ledger.

## G5.1: a tie makes contact plausible, not automatic

A directed relationship can offer a channel: coworkers meet, relatives correspond, merchants exchange notices, rivals investigate. Actual copresence, a saved appointment, delivered correspondence or world-supported telepathy makes a transmission possible. Friendship across continents is not proof of daily conversation. A hostile relationship may suppress friendly sharing but enable threatening speech, overhearing or investigation through separate supported channels.

Binding `action:'talking'` in P4 is insufficient: it has no partner, topic, audience or outcome (`generated_people.js:53-59`). Live knowledge effects can store basis (`src/simulation_effects.js:281-284`), but do not implement general social propagation. Proposed `ContactEpisode` therefore records sender, listener, directed edge or public-channel ref, site/reach, time interval, language/sense, disclosure permission, cause and actual delivered message refs. The planner can initiate contact; P11 delivers the message; the belief owner records reception. Unsupported delivery does not grant knowledge.

## G5.2: truth, claim, transmission and belief

| Layer | Proposed owner/join | What it means |
|---|---|---|
| Actual event | Domain outcome receipt; P14 HistoricalReceipt | What happened, potentially private; never a universal visible sentence |
| Claim/account | P14 Claim/Account | What a particular speaker asserts, with basis, qualifiers and source lineage |
| Transit | P11 Message | Who sent what to whom, via which actual channel and when it arrived |
| Belief | P14 BeliefEpisode or bound current knowledge adapter | This listener's stance and confidence after receiving it; does not rewrite event truth |
| Social reaction | P19 directed effect plus cause | The listener trusts, resents, questions, investigates or disregards a person through a supported rule |

Never promote a rumor to `understood` solely because it has been repeated. The existing knowledge stage ordering is not a truth/confidence model; adapting it requires a deliberate claim reader rather than silently stuffing factual certainty into those stages. A witness may be mistaken about cause while correctly reporting an observed event. Confidence can be high and wrong. Apparent identity and attributed identity are distinct, so a disguised actor's claim does not automatically expose a hidden alias map.

Propose a P14 source lineage with original claim/witness refs plus a bounded provenance DAG or capsule. Two messengers repeating the same source are one origin, not two corroborating witnesses. Summarization retains whether roots overlap even after full transport history compacts. An exact claim receiving a correction creates a superseding belief/account; it does not erase the earlier lie or retcon a speaker's prior knowledge. Contradictory accounts remain simultaneously inspectable with attribution.

## G5.3: bounded propagation and purposeful distortion

At a due contact, gather a small stable list of claims the sender actually knows. Prefer relevance to the listener's current concern, named participants, local event and relationship. Exclude undisclosed private information unless a supported act permits revealing it. Relevance can produce silence. If selection needs randomness, consume the registered saved social/message stream only at successful commitment, never on hover or opening People.

Define distortion operators over a typed proposition: omit a qualifier, widen an estimated amount into a range, misattribute credit based on available confusion, add a explicitly marked hearsay link, translate with uncertainty or deliberately lie. Freeze the new claim and its relation to the prior one. Do not roll a different underlying truth. Names/roles mentioned must exist and be within the speaker's known vocabulary. A distortion that would reveal a sealed answer or private identity fails admission; a neutral safe paraphrase or silence is valid.

Per-world adjectives tune channel speed, publicity, discretion, memory, gossip interest and fidelity. A connected market can spread a claim quickly; a quiet household can keep it local; a mind network may communicate instantly if sourced. Prototype fan-out/time budgets protect browser responsiveness, not permanent three-hop world laws. A message can continue through many genuine contacts across time. P18 owns long-run saturation/correction measurements.

Never rescan every claim against every actor each minute. Queue due contacts/messages and maintain per-recipient recent claim-version keys. Deduplicate exact delivery operations while permitting an actual later reaffirmation or correction to have a new cause. Circular retransmission cannot create independent evidence or endlessly apply trust losses. If one cause has several same-axis effects, sum them before existing relationship effect delivery, whose receipt key otherwise applies only the first (`simulation_effects.js:289-292`).

## G5.4: concrete chain with a control

Original fixture: two NPCs complete a joint repair at a workshop. Witness A reports that both helped. B hears A, then gives C an account crediting only the better-known worker. C changes willingness to hire based on that claim. D has neither contact nor report and retains prior belief/willingness. The actual repair, contributions and custody are unchanged.

The hero can ask A, inspect the real work receipt through an authorized route, request testimony, or ignore it. C receives corrected evidence and records a revised belief; their response can include apology, continued doubt or indifference. B may have misunderstood rather than intentionally deceived. That intention is author truth until evidenced. A distant shop only learns after its messenger actually arrives. A failed or canceled trip grants no early belief. P21 may consume the changed hiring decision but owns quotes/funds; P19 never makes an unfunded wage by changing opinion.

## G5.5: privacy, discovery and exceptional routes

Claims about secrets reference owner IDs internally. Public reports use ID, route and status only; ordinary banter and hearsay cannot become a secret's discovery route by convenience. An authorized discovery route may later create a specifically scoped account under the secret owner. Public franchise twists are not sealed but NPC knowledge and optional spoiler policy still apply. Leak checks include text, IDs, CSS/accessibility labels, sorting/filtering, disabled actions, claim counts, candidate weights and delivery timing, not merely visible paragraphs.

Voluntary disclosure, accidental overhearing, bribery, censorship, false documents, threats, magical memory editing and lie detection remain reachable per-world supported acts. Relationship strength changes willingness, not the law of physics or truth. A cheap communication power can remove delay where it has reach; it must still bind actual recipient, source compatibility, knowledge and received output. No generic consent/cruelty policy is inferred from a book title. Text-generation choices stay under P15, including any optional LLM receiving only observer-safe bindings.

## G5.6: future gates, all OPEN

**A1** SOURCE: no belief before contact/arrival; distinguish truth, testimony, accepted claim and correction; shared origins never count as independent support; cyclic relay cannot multiply same-cause social effects. **A2** NATIVE: joint repair, real A→B→C transmission, D control and useful corrected hiring/conversation consumer on a fresh rebuilt origin. **A3** PERSISTENCE: pending message route, claim editions, beliefs, edge reactions, provenance capsules and next draw compare exactly across Save/reload/Export/literal-file Import. **A4** FAILURE/LEAK: canceled channel, hidden alias, sealed ID route, translation fallback, missing pack and failed write preserve precommit state; secret truth never enters a public projection. **A5** SCALE/UX: measure backlog/fan-out/save growth and readable source/confidence/correction at both desktop sizes; quiet news does not stop ordinary work. Human rumor clarity and voice remain unaccepted.
