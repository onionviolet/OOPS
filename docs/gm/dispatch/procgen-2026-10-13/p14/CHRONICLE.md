# P14: a readable life from actual receipts

2026-10-14. **PROPOSAL ONLY.** Current source findings live in [REPORT F1–F8](REPORT.md#live-source-audit). Nothing here claims a new journal, biography or recap exists.

## C1: story with an inspectable basis

Extend [P5 D8](../p5/D8_LORE_GRAMMAR.md), [E6](../../../../emergent/E6_LORE_LAYER.md) and [P11 context](../p11/CONTEXT.md). Build the player's chronicle from committed receipts, received claims and explicit coverage intervals. A narrative sentence must point to the records supporting it. Source/world time, knowledge-acquisition time and telling time remain separate.

Live `src/life_record.js:1` explicitly forbids using biography as authority for rewards, relationships or quests. Its first-four highlight folding at `:32-46` cannot recover an action's participants, means or effects after pruning. Keep that UI-compatible summary as a projection. Do not parse it, the feed, or prose strings for missing past. Existing causal ledgers can support a qualified earlier case if their retained evidence is enough; that is a bounded import adapter, not reconstruction of all prior play.

| Readable form | Content and voice | Required basis / limit |
|---|---|---|
| Previously on | Short return-to-play recap: completed outcomes, continuing matters, useful next controls | Recorded interval since the last acknowledged cursor; no invented closed-app activity |
| Journal | Dated firsthand experiences, received accounts and player notes | Distinguish “I saw,” “I was told,” and “I think”; free notes cannot mutate truth |
| Chapter/annual summary | Connected events grouped by an actual project, relationship or local era | Grouping is editorial; do not invent causation between coincident events |
| Biography/life summary | Beginning, meaningful pursuits, changed relations, outcomes and unfinished work | Career and public fame are not total personality, happiness or moral worth |
| Epitaph | Brief chosen remembrance after a qualified ending, optionally written by a known mourner | Confirm ending type; bodily death, disappearance, departure and retirement are distinct |
| Branch chronicle | Major known changes across several lives, with parent/fork and source horizon | Readable archive does not promise a restorable playable branch |

P15 owns actual language/renderer choices. P14 supplies evidence selection, coverage and attribution. A polished sentence that exceeds its evidence should fail validation or fall back to a simpler exact sentence.

## C2: selecting and connecting a story

Proposed deterministic pass:

1. Select receipts in the chosen branch/life/time window, then project for the intended observer and current discovery route. Include received corrections. Do not select hidden events first and expose their existence with redaction counts.
2. Rank by player pin, live commitment relevance, changed relationship/capability/custody, resolution/aftermath, and ordinary personal significance. Use stable time/ID tie breaks; support quiet work, failed attempts and chosen ordinary lives. Pacing metrics belong to D9, not this selection score.
3. Form small clusters using actual project, person, object or cause links. Preserve distinct participants and contributions. Use “later” for chronological adjacency; use “because” only with an explicit causal link. Do not turn “accepted work” into “finished work,” “warned” into “saved,” or “declined” into “betrayed.”
4. Render the short narrative with source links and uncertainty markers, plus current outstanding matters from their live owners. Current status is labelled as of now, rather than changing what an old receipt meant then.
5. Save a chapter edition on explicit chapter close, ending or recap commitment. Ordinary viewing is pure. Grammar/source updates keep the stored edition; a newly requested revision is a new edition with its own basis.

Long grinding intervals can use exact aggregate receipts, such as 14 completed deliveries in a known interval with total costs/payment. They cannot fabricate dialogue or name every customer unless those identities were retained. Preserve the initiating agreement, interruptions, key turning points and settlement separately. No moral label is inferred merely from selecting a profitable route or an unusual power.

**Original fixture:** R1 accepts a funded repair; R2 supplies owned timber; R3 completes that repair with the local craftsperson; R4 receives a disputed account. A recap may say the hero completed the repair and later heard a disagreement over credit. It cannot claim the hero worked alone, ended the feud or earned universal admiration. A follow-up link opens the real still-disputed matter, not an invented reward button.

## C3: returning after idle time

Distinguish open-tab played progression, supported absence advancement, frozen time and recorded work while viewing another panel. The current inspected simulation announces played-time progression (`src/simulation.js:70`); P3's branch report states it adds no closed-app catch-up. Intro OT1–OT10 are future considerations, not a recap scheduler. P14 does not implement offline time.

Proposed recap cursor: branch/life ID, last acknowledged sequence and clock anchor, known-knowledge revision, coverage start and optional committed recap ID. Take one consistent snapshot. List completed results, changed known people/places, pending decisions and current available controls. Read receipts only from the actual advanced interval. If the clock stayed frozen, say no recorded world time passed and show existing matters. A new report about an old event belongs under “newly learned,” dated both ways.

Showing or dismissing a recap neither consumes a draw nor accepts work, spends resources, acknowledges an unread letter on the character's behalf, or applies a timeout. Acknowledgment advances only the UI recap cursor. Return after a failed write or interrupted import must not falsely mark events as read. Reopening can show the same committed recap; a later recap covers the next interval. Batch summaries of supported catch-up use the same outcome receipts as foreground play.

Desktop proposal: existing Notebook/Bio area, a readable story pane alongside an evidence/current-matters pane at 1366x768 and 1600x1000. Provide period/person/project filters, paragraph-to-receipt expansion and direct links to supported controls. Keep short recap and long archive both reachable, with comfortable text and intentional scrolling. Mobile optimization is deferred. No new UI was built or examined here.

## C4: NPC memory and the player's place in it

Current directed memories retain 32 recent lines (`src/simulation_effects.js:285-292`). Knowledge writes at an equal/higher stage replace the same key (`:281-284`). Neither is a general historical belief archive. Preserve existing axes and knownPeople projections while proposing an adapter to retained claims/episodes.

An NPC episode references actual witnessed or received evidence, personal interpretation, time and emotional salience. An NPC may accurately recall a small detail while misunderstanding its cause. They may learn a correction, conceal it, forgive, preserve a grudge, or simply cease caring. Forgetting presentation detail is separate from erasing an unsettled debt, sworn term, custody right or physical trace. World-specific perfect recall, selective amnesia or magical memory editing can alter character memory with explicit scope, not the underlying event by default.

NPC action uses their beliefs and actual means; execution checks real state. A false accusation may motivate a funded investigation or refusal where supported, but cannot silently impose a factual crime or universal reputation loss. [Rivals](../../../../RIVALS_IDENTITIES_AND_FATE.md#a-persistent-rivalry-system-for-this-game) owns adaptation and recurring relationships; P14 supplies who remembers which episode and why. [RETELLING](RETELLING.md) owns remembered content, while P11 N5 owns its actual transmission.

## C5: lives, endings and incomplete records

Before an epitaph, query the ending owner for actual scope and cause. Do not conclude “dead” from a missing body, zero display HP, expired offer or elapsed deadline. Preserve a last received report separately from current authoritative status. The player can choose a modest remembrance, an elaborate commissioned account, silence, or later annotations where supported. Existing epitaph/lesson code remains its own bounded implementation, not a universal funeral generator.

Across lives, keep controlled actor, body/occupant where applicable, branch and life IDs distinct. A former body’s accomplishments do not automatically become the new occupant's earned deeds. The public legend can misattribute them; the player ledger must retain the distinction. Source canon, original background and actual prior play all need different origin labels.

Old saves start coverage at enrollment. Legacy biography remains readable as legacy display text. Backfill only from supported retained typed records, marking exact coverage and missing intervals. “No record retained” must not become “nothing happened.” A faded archive can still tell a supported story, but cannot advertise exact replay or ghost behavior whose necessary details are absent. Link [intro BW/TB/BR/DV/OT](../../../../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md#round-9-past-selves-as-npcs-interaction-levels-story-worlds-2026-10-14) and [CONTRACT](CONTRACT.md).

Future proof: a naturally earned deed remains accurately narrated after display-window eviction; click-through supports every factual clause; correction and current status remain distinct; recap acknowledgment, old-save coverage, death/retirement distinctions and cross-life isolation survive reload/import. All NOT RUN.
