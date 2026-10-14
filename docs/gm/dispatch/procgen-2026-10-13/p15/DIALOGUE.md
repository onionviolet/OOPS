# P15 dialogue and voice

2026-10-14. **PROPOSAL ONLY.** This extends [RUNTIME_TEXT](RUNTIME_TEXT.md) and existing Ink/causal hosts. Nothing here changes the game. Conversation is a supported social action with state; fluent text alone is not a conversation engine.

## V1: existing dialogue is substantial but bounded

| Code | Shown/SOURCE locator | Existing behavior / limit |
|---|---|---|
| F9 | [causal_story_actors.js](../../../../../src/causal_story_actors.js), lines 25–37; [causal_story_ids.js](../../../../../src/causal_story_ids.js), lines 9–17 | Original fixed people have different authored introductions. These are not generated personalities or canon voices. |
| F10 | [causal_story_content.js](../../../../../src/causal_story_content.js), lines 60–96 | Three original aftermath accounts are delivered through a timed, supported conversation with the actual participant. This is stateful authored dialogue, not only a log decoration. |
| F11 | [causal_story_host.js](../../../../../src/causal_story_host.js), lines 459–503; [causal_story_scenes.js](../../../../../src/causal_story_scenes.js), lines 63–103 | Known records, current admitted offers, work and heard deadline feed a scene projection. Its phase labels summarize the scene; they do not create the underlying outcome. |
| F12 | [causal_story_ui.js](../../../../../src/causal_story_ui.js), lines 274–310; [simulation_ui.js](../../../../../src/simulation_ui.js), lines 5–21, 78–88 | Existing panels render conversations/actions from owners. The workshop uses authored social commands and encounter turns; there is no general improvisational social resolver here. |
| F13 | [ink_narrative.js](../../../../../src/ink_narrative.js), lines 54–92 and 141–175 | Ink has stable choice tags, bounded continuation, retained content identity, opaque saved cursor/frame and receipts. Independent random operations/host-effect tags are restricted. |
| F14 | Same file, lines 255–303 and 312–352 | Begin/revisit/pause/resume/choice commit through a checked host, then store cursor and frame. Pure preview/view paths exist. Host scope and support are rechecked; do not discard these safeguards in a new dialogue adapter. |
| F15 | [ink_scene_content.js](../../../../../src/ink_scene_content.js), lines 7, 32–49 and 116–137 | Voice-cue data and an original relay voice already exist. Non-original profiles require a matching active native scene, era/cutoff/profile binding. This is curated voice substitution, not free NPC personality synthesis. |
| F16 | [causal_story_core.js](../../../../../src/causal_story_core.js), lines 79–87 and 390–422; [causal_story_native.js](../../../../../src/causal_story_native.js), lines 120–127 | Validated received knowledge and separate closure dimensions precede the native quest projection. Hearing an account is distinct from omniscient closure truth. |

These are current source findings, not P15 browser proof. P3 and P4 branch reports do not establish integration with these Ink actors. P4's generated people store is explicitly separate from simulation actors. Root must choose a reference adapter or supported promotion that preserves a single person before a generated traveler becomes an Ink speaker.

## V2: three composable levels

| Option | Use | What the runtime must own |
|---|---|---|
| Authored branching scenes in existing Ink | Important meetings, conflict, intimacy, source-qualified canon encounters | Existing host commands, pinned scene content/cursor and actual participant scope. New scenes need binding/compiler changes under root ownership. |
| Topic/speech-act cards with grammar realization | Ordinary requests, explanations, greetings, revisits, corrections and small negotiations | Eligible topic, speaker belief/goal, relationship context, response command, saved turn and frozen language. |
| Optional free-text input with intent matching | Let the player ask in their own words or explore | A candidate supported intent/topic with a visible action/terms preview; ambiguity asks within the game or offers matching topics. Text entry never executes arbitrary commands. |

These can share the same people and social facts. A typed question may enter an authored scene; a scene can return to an ordinary topic list. Free conversation with optional LLM realization remains an available larger experiment, under [LLM_OPTIONS](LLM_OPTIONS.md). First reusable recommendation: existing Ink for authored beats plus a small topic adapter for ordinary recurring talk. Yarn Spinner is a comparison option, not an installed dependency or necessary migration: its [variable storage](https://docs.yarnspinner.dev/2.3/getting-started/writing-in-yarn/logic-and-variables) and [commands/functions](https://docs.yarnspinner.dev/yarn-spinner-for-unity/creating-commands-functions) illustrate the same split between dialogue state and game effects. The existing Ink implementation makes immediate replacement costly. [Ink's runtime documentation](https://github.com/inkle/ink/blob/master/Documentation/RunningYourInk.md) describes choice advancement and JSON state saving; local host code adds this project's transactional boundaries. References checked 2026-10-14.

## V3: personality is more than sentence style

Proposed voice record: stable person ref and revision; preferred directness/formality/verbosity; vocabulary domains; address conventions; humor/reticence; optional habits; language competence; authored prohibitions and fallback lines. Keep private author annotations outside observer input. A voice seed chooses a coherent profile at person creation, not a new temperament every meeting. P4 traits may inform eligible style, without exposing undiscovered trait labels or counts. A visible speech pattern can be an observed clue only through its world's declared discovery route.

Separate stable disposition, current emotion, social role, relationship to listener, immediate aim and actual knowledge. A formal public clerk can speak informally to a friend; a cautious person can sometimes act boldly. Mood does not change canon identity, erase an agreed price, or reveal a hidden allegiance. Do not make every poor person curt, every powerful person grandiose, or every species share one accent. Use curated lexical/register choices rather than phonetic caricature. Named canon characters need authored evidence-linked voice briefs, original wording and selected scene review, never a fabricated quotation.

For a synthetic request with identical frozen terms, original alternative lines might be:

| Voice fixture | Original line | Invariant |
|---|---|---|
| Direct | “One piece of repair cloth would help. Can you bring it?” | Supported quantity, item and request, with no promised completion. |
| Formal | “Would you supply one piece of repair cloth?” | Same supported request; no invented title, fee or personal history. |
| Hesitant | “Could you bring one piece of repair cloth?” | Same terms; hesitation is style, not a false claim of fear or poverty. |

The terms panel supplies exact supported price/time/expiry. Do not replace it with oblique dialogue. Handcrafted character lines can be stronger than maximizing variant count.

## V4: proposed conversation state and turn lifecycle

Reuse Ink's saved state for Ink scenes. For ordinary topic cards, add only a scoped adapter record if selected: session/turn ID, speaker/listener refs, world/instance/branch/cycle, topic/node and revision, current offered response IDs, frozen semantic frame/text, knowledge/account refs, pending host quote refs, status and receipt IDs. Relationship axes, goals, inventory, beliefs, time and obligations stay in their existing owners. A dialogue variable mirrors a known owner through a reader; it does not become another purse or friendship truth.

| Stage | Proposed behavior | Observable rejection / interruption |
|---|---|---|
| Enter | Verify reachable channel, participant identity/life/availability, language and selected era/scene | No teleporting speaker, future biography or hidden alternate identity in an error. |
| Select topic | Read speaker knowledge and aims, audience-specific relationship, relevant cause and known response means | “Ask about work” does not create an unfunded need; “tell me the truth” is not a universal detector. |
| Admit utterance | Freeze speech act, allowed claim refs, voice/language and variant; save turn with owner plan | A failed save leaves no heard fact, draw or paid cost. Pure preview does not count as a conversation. |
| Respond | Select stable response ID; recheck the actual command and current supported terms | A stale offer requests a new visible quote; it never silently swaps target, cost or action. |
| Settle | Host applies real effects, then records what each participant observed/heard | A promise creates a supported obligation only through its owner. Charm text cannot grant automatic consent. |
| Leave / resume | Retain unresolved turn and exact offered commitments; recheck contact/support on return | If circumstances changed, use the saved cancellation/defer policy. No restart that pays twice or silently forgets speech. |

A speaker may say something false. Store the claim, speaker, audience, time, basis and source chain separately from truth. Deliberate deception requires an admitted speech act and limited actor belief/intent input; the renderer must not choose an arbitrary false world fact. A scripted unreliable account can contain reviewed original wording without becoming world law. General knowledge stages currently overwrite a key at equal-or-higher rank ([simulation_effects.js](../../../../../src/simulation_effects.js), lines 281–284). That is not a full conflicting-belief history. Until P14/P11 transport/belief contracts exist, use separately identified attributed accounts rather than pretending “understood” means objectively true.

Persuasion considers the specific request, stakes, evidence, willingness, jurisdiction, relationship and available means. If uncertain social resolution is selected, it gets a real seeded action resolver and paid consequences. A persuasive paragraph or model judgement cannot settle it. Negotiation, help, refusal, postponement, study, translation, intimidation and exceptional powers remain reachable where their world supports them. Do not force one diplomatic/combat route or create permanent locks for ordinary repetition. A source-qualified vow or unique role can have local terms without becoming a global once rule.

## V5: memory, branches, silence and idle play

Remember actual shared meetings and accounts, not the player's complete save. “We met before” requires the right person, branch/cycle, retained memory carrier and known recognition channel. A counterpart with the same name is a different participant. [Timelines T1–T4](../../../../TIMELINES_AND_DIVERGENCE.md), [intro rounds 10–12](../../../../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md#round-10-story-world-timelines-and-branches-2026-10-14) and P13/P16 own branch/reset semantics. Foreknowledge can be stale; preserve the date/cutoff of a claim rather than letting an NPC adopt player-layer knowledge.

No new clock or offline simulation is proposed here. Timed conversations use their host's supported played-time policy. Ordinary ongoing work need not stop for ambient talk. Pending choices, interruptions, expiry and any delegated answer must reuse the owning event/scene policy. Do not inherit E5's speculative real-time activity multipliers or closed-browser letters as existing behavior. Silence, refusal to discuss and “I do not know” are authored valid responses, not model failures. Quiet dialogue can remain texture with no reward.

Use one readable conversation area with optional account history and independent stable actions/terms. Target 1366x768 and 1600x1000; mobile is deferred. Preserve focused buttons as countdowns update, as the existing feed already attempts. Distinguish speaker text, narrator observation, received report and exact mechanical receipt visually and in screen-reader labels. A long discussion may be collapsed or summarized, while costs and unsolved choices stay visible. “Voice” here means writing; optional speech audio is discussed in MORE and is not required.

## V6: first future proof

An introduced original person has a supported request. Ask its terms, clarify the actual need, supply or decline through host controls, leave, then return and hear a different supported acknowledgment. Prove both route continuity and remembered receipt. Show two coherent voice profiles with identical mechanics, rather than claiming personality from random adjectives. An optional canon-pack follow-up uses P7/P9/P13's source and era bindings without making the original fixture an opening requirement.

Future gates, NOT RUN: same conversation resumes at the same response boundary after Save/reload and literal-file Import; old content hash remains restorable; repeated render and preview spend nothing; changed topic/voice does not bypass a price; unavailable speaker does not talk; an unintroduced alias and synthetic sealed ID remain undisclosed; repeated new conversations remain allowed under local recurrence; a failed publisher grants no knowledge/relationship/reward. Rebuilt desktop interaction and Weibao's fiction/voice acceptance remain separate from all source checks.
