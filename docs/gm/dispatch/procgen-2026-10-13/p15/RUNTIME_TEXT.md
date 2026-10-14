# P15 runtime text

2026-10-14. **PROPOSAL ONLY.** Source observations below describe inspected code, not new implementation or playable proof. [REPORT](REPORT.md) ranks future slices; [DIALOGUE](DIALOGUE.md) owns conversation; [AUTHORING_PIPELINE](AUTHORING_PIPELINE.md) owns production and review.

## T1: generate expression from a real situation

The useful distinction is between generating a situation, selecting its outcome and expressing what an observer can know about it. P3 owns event selection and frozen responses; P4 owns saved people; P11 owns context; P12 owns quest/arc composition. P15 proposes a reusable expression layer that consumes their admitted records. It can create many original sentences without inventing a delivery, relative, ingredient, promise, injury or future event.

Extend [E6 grammar](../../../../emergent/E6_LORE_LAYER.md#5-grammar-format) and [P5 D8](../p5/D8_LORE_GRAMMAR.md), rather than opening another history or name registry. D8/P14 own the accounts being expressed. A generated hypothetical, fictional tale or deliberate lie is also possible, but its content is explicitly an attributed imagined/claimed account. It cannot set world facts by being rendered.

| Code / source observation | Shown in inspected source | Consequence for this proposal |
|---|---|---|
| F1 | [simulation.js](../../../../../src/simulation.js), lines 395–410, freezes label, responses and expiry effects on an occurrence; lines 423–438 apply a selected response and retain a cause | Bind text at occurrence/utterance commitment; refer to the resolved outcome for completion text. Do not say work succeeded at offer time. |
| F2 | [simulation_resolution.js](../../../../../src/simulation_resolution.js), lines 9–32, freezes spawn templates and resolves selectors/amounts | Reuse actual bound IDs. This is effect preparation, not a general prose grammar. |
| F3 | [causal_story_scenes.js](../../../../../src/causal_story_scenes.js), lines 5–28 and 63–103, combines authored openings with known accounts, work and heard deadlines | Existing state-sensitive scene presentation is a useful baseline. A deadline alone does not establish an outcome. |
| F4 | [causal_story_content.js](../../../../../src/causal_story_content.js), lines 23–29 and 60–96, authors knowledge accounts and a timed aftermath conversation | Dialogue exists as authored content and supported commands. This does not establish an arbitrary language generator. |
| F5 | [event_feed.js](../../../../../src/event_feed.js), lines 37–56 and 87–102, selects discovered events/received accounts and limits news to eight | Keep the feed read-only. An eight-line projection is neither an archive nor a source of truth for future generation. |
| F6 | [people_knowledge.js](../../../../../src/people_knowledge.js), lines 6–39 and 88–103, uses introductions and received records | Introduced names and last-known places are permissible bindings; registry membership is insufficient. This is family-specific projection, not a universal observer API. |
| F7 | [life_record.js](../../../../../src/life_record.js), lines 1–8, 32–58 and 75–77, explicitly keeps a lossy biography and avoids fabricated old history | Never reconstruct quests, dialogue promises or exact past speech from folded highlights. |
| F8 | [world_visit_history.js](../../../../../src/world_visit_history.js), lines 6–18 and 21–58, retains referenced visits and reconciles clocks before compaction | Persist actionable evidence/visit references deliberately. Saving every cosmetic line against a visit can pin it indefinitely; do not do this accidentally. |

## T2: composition contract

Proposed flow: **admitted cause → observer-safe semantic frame → eligible expression → frozen utterance → read-only display**. The semantic frame is an adapter boundary over existing owners, not another gameplay state store.

~~~json
{
  "kind": "request.open",
  "causeRef": "fixture.request.17",
  "worldInstanceRef": "fixture.instance.a",
  "speakerRef": "fixture.person.a",
  "listenerRef": "player",
  "claims": [{"ref": "fixture.need.17", "basis": "testimony"}],
  "slots": {
    "speaker": {"ref": "fixture.person.a", "display": "Mira"},
    "good": {"ref": "fixture.good.repair-cloth", "display": "repair cloth"},
    "quantity": {"value": 1, "unitRef": "fixture.unit.piece"}
  },
  "allowedSpeechActs": ["request", "clarify", "decline"],
  "toneProfileRef": "fixture.voice.direct.1"
}
~~~

All IDs/names above are synthetic. A real frame also binds current source/continuity/era, content revision, claim revision, audience, language and supported location/contact scope from [P11 CONTEXT C1–C4](../p11/CONTEXT.md). Internal facts are not passed through wholesale: [simulation_effects.js](../../../../../src/simulation_effects.js), lines 85–120, assembles ownership, body, faculties and world facts useful for execution. Those fields are not all safe dialogue context.

Templates may only read declared typed slots. Entity names come from an observer-approved display record, quantities from frozen terms, and verbs from the supported action/outcome. A pronoun or title is presentation metadata, not a fresh gender, rank or identity inference. Bind the same role consistently throughout a line; modifiers cannot reselect a person. Never render a string that contains an unresolved slot.

The request may say, in original fixture prose, “Mira asks for one piece of repair cloth.” It cannot say “Mira has repaired the cart,” “your sister Mira,” or “the guild owes you three coins” without the corresponding supported outcome, relationship or reserved terms. A field existing in author truth does not make it known to Mira or the player.

## T3: compatible text techniques

These can coexist per content type. There is no forced choice of one global system.

| Option | Good use | Required boundary / cost |
|---|---|---|
| Authored lines + typed slot filling | Exact terms, feedback, clues, close relationships and short conversations | Lowest combinatorial cost; all slots resolve and match time/basis. Few variants can be enough. |
| Weighted replacement grammar | Incidental descriptions, greetings and original low-stakes texture | A finite rule expands a symbol into eligible alternatives. Curate combinations, not independent adjectives that contradict each other. |
| Tracery-style symbols/modifiers | Reusable fragments with agreement and repeated bindings | Reuse E6's format as the starting proposal. Parse symbol paths and entity bindings separately; no eval or script callbacks. |
| Feature/unification grammar | Gender/number/case, language agreement, register and referent consistency | Extra tooling and linguistic review. Feature constraints filter incompatible branches before selection. English suffix tricks do not generalize. |
| Structured description plan | Glance → observed condition → optional explanation/evidence | Select which supported details matter, then realize them. Helps describe a complicated item without random adjective soup. |
| Ink authored scene | Multi-turn choices, authored timing and recurring dramatic beats | Reuse the existing pinned host, not a second quest/inventory owner. See DIALOGUE. |
| Optional model paraphrase | An extra expressive rendition of a bounded safe frame | [LLM_OPTIONS](LLM_OPTIONS.md); higher uncertainty and operating cost. No mechanical authority. |

External reference checked 2026-10-14: Kate Compton's [Tracery repository/readme](https://github.com/galaxykate/tracery) demonstrates rule arrays, symbol expansion, stored bindings and modifiers. P15's typed refs, save lifecycle and knowledge filters are our proposed additions, not Tracery guarantees. No new library is installed; implementation reuse needs the exact version/licence review.

## T4: deterministic admission and repetition

Use the integrated P1 text-stream lifecycle when root selects a builder. Do not assume its unmerged API exists in main. When expression variants require randomness, a newly committed utterance obtains one line seed in the same durable plan as its owning turn/occurrence. A fixed authored line needs no draw. Expansion can derive bounded local choices from line seed plus stable rule path; unrelated combat, deck and name streams stay unchanged. Previews show a stable neutral summary without draws. Failed/stale admission publishes no text draw or new knowledge.

Save final text, semantic-frame identity/minimal retained claims, grammar and voice revisions, language, selected variant IDs and content hash. A seed without frozen text/revisions cannot promise the same sentence after content edits. Display, sorting, revisiting the same receipt, reload and import never expand it again. Language switching may create a separate saved rendering of the same semantics, keyed by locale and translator revision; it cannot change the underlying outcome. A genuinely new conversation or a source-supported fictional reroll is a new cause, distinct from reloading.

Repetition control operates on expression, separately from P3 event cooldowns and D9 pacing. Proposed small state: last eight variant IDs for a speaker/topic/register, with bounded decaying weights over a curated set. Update only at committed utterances. First avoid an exact recent line when alternatives fit; then prefer a different sentence structure or detail, with a deterministic neutral fallback if exhausted. Keep necessary terms and clues legible even if repetition is inevitable. Never manufacture a new danger or reward just to sound fresh. These are prototype retention/variety settings, not lifetime conversation limits.

Test semantic repeats as well as exact text repeats: ten synonyms for “bring wood” remain one situation. Report card-family coverage separately from phrase diversity. Let familiar greetings recur deliberately; known callbacks can be more memorable than perpetual novelty. An idle digest may group cosmetic repetitions while retaining each actionable receipt in its owner. It must not conceal newly changed terms.

## T5: world register, description and naming

[P7 G2/G3/G8](../p7/GUIDELINES.md) owns reservations, culture/era, transliteration and source evidence. P15 reads that approved display record and adds sentence/register profiles: formality, sentence length, directness, technical vocabulary, metaphor domains, address conventions and silence. Profiles are original adaptation choices unless selected primary evidence establishes them. Do not use race/species, wealth or faction labels as automatic personality, literacy or moral judgments.

| World-facing application proposal | Existing source/profile owner | What stays distinct |
|---|---|---|
| School notice, pupil request and specialist explanation use different registers | [Harry Potter P9](../p9/HARRY_POTTER.md), [P7](../p7/HARRY_POTTER.md) | Original prose about a qualified scene; no invented potion instruction or famous-character quotation. |
| Local tabletop notice uses the selected setting's vocabulary | [D&D P9](../p9/DND.md), [P7](../p7/DND.md) | Rules edition and setting era remain separate; terms from multiple editions do not blend. |
| Supplier, learner and experimental explanation distinguish report from tested result | [MoL P9](../p9/MOTHER_OF_LEARNING.md), [P7](../p7/MOTHER_OF_LEARNING.md) | Current continuous visitor branch is not a loop. Remembered speech follows the selected carrier. |
| Ordinary livelihood and attributed occult testimony can sound different | [LOTM](../p9/LOTM.md), [COI](../p9/CIRCLE_OF_INEVITABILITY.md), [P7](../p7/LOTM_COI.md) | Job vocabulary grants no pathway, secret identity or ritual knowledge. |
| Five independent TTKS voice packs | [P9 TTKS index](../p9/TTKS.md), [P7](../p7/TTKS.md) | No shared cultivation diction or fictional law assumed from the source grouping. |
| Institutional report versus personal account in anime settings | [P10 profiles](../p10/REPORT.md), [P7](../p7/GUIDELINES.md) | Exact continuity and research cutoff govern vocabulary; a rank word cannot substitute for actual means. |

For other P9 worlds, inherit the profile's evidence boundary, not a guessed genre voice. A blocked digest or synopsis can suggest a research task; it cannot certify a canon character's catchphrases or everyday speech. Canon-neutral original helpers can be prototyped without making Frontier compulsory before a book world.

Description variation should reflect stable features, actual changes and observer senses. Re-observing an unchanged object can highlight a different already-known feature, with the same identity; it cannot add a scratch or owner. E7 K1–K6 governs exceptions such as deceptive or observer-dependent appearances. If perception truly changes reality, that is a supported world action and saved outcome before text, not a grammar special case. Use short glance text, optional full account and a stable readable terms block at 1366x768 and 1600x1000. Reduced effects, large text and plain presentation remain viable; mobile work is deferred.

## T6: authored anchors and known contradictions

Keep major canon events/causes, unique people and objects, critical clues, exact commitments, irreversible choices, discovery wording, important emotional turns and dramatic finales deliberately authored/reviewed. Authors can create many new scenes through the dev pipeline; “authored” need not mean manually typing every sentence. Generation surrounds these anchors with fitting expression and incidental content. Higher-order story generation remains reachable through P12/P13/P16 with its own causal admission contract.

| Code | Earlier proposal / current mismatch | Proposed reconciliation |
|---|---|---|
| R1 | E2 uses role slots and a 240-character body; E6 uses a different explicit binding syntax; current causal and Ink scenes admit longer paragraphs | Use one parsed intermediate slot model with per-surface budgets. Do not impose a universal 240-character scene limit or silently chop a condition/negation. Reject an invalid actionable line and use its reviewed fallback. |
| R2 | E6 allows empty expansion for unknown symbols and word truncation | Authoring errors must block admission; runtime failures use a complete neutral fallback. Empty or truncated clue/price text can mislead. |
| R3 | E7 suggests regenerating unobserved fixed lore cheaply; later content revisions can change that result | Pin creation context and generator revision; persist any mechanically meaningful truth when its world law requires it. Lazy texture cannot become retroactively invented evidence. D8/P14 own fact admission. |
| R4 | E6 fixed canon protection could force outcomes; timeline T3 says removed causes change natural events | Reserve authored identities/source baseline, then let the selected canon/divergence owner evaluate actual causes. Text neither forces canon nor repairs divergence. |
| R5 | E5's older away opportunity cap and E2's fixed once metadata can become universal repetition limits | Preserve the source audit as history, but propose per-world recurrence adjectives and per-occurrence settlement integrity. Text variety is no authority to restrict reasonable gameplay. |

Future proof: same supported request under two eligible voices and several seeds, exact terms preserved, no new facts, repeated render/preview consumes nothing, saved lines survive grammar revision and import. Run malformed-binding, unknown-reference, long-negation, hidden-alias and adversarial-label fixtures. Human acceptance decides whether the result sounds natural; source checks alone cannot.
