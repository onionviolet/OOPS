# Mother of Learning and D&D: lore exceptions affecting UI and engines

2026-10-31. Bounded coordinator research, source spot-checks and proposals, not runtime implementation or accepted feature specifications. User requested similar debate research in these two worlds. Current LOTM-first delivery order remains. Applied AD6–AD8/AD38/AD44–AD46, WPR2/4/19/20/24/26–28, WA54–WA60. Included usage observed at 64% before research, within the existing 75% shared ceiling. No additional chat, descendants, paid fallback or recurring research created.

## Scope, source identity and deduplication

Six findings below extend the [receipt](UI_FEEDBACK_AUDIT_RECEIPT.md). They do not recount generic loop retention, source versioning, proxy identity or timed effects as new discoveries. New distinguishing cases are historical shutdown capability, changing enclosed volume, communication technology available at a particular chapter, a copy's independent report versus shared fuel, suppression while duration expires, revised recovery wording, and a self-dependent suppression dispute.

Community links below were opened on 2026-10-31. Relative timestamps and search-result dates disagreed on several pages; no exact publication date is inferred. Votes are not evidence. Sources: the existing MoL claim index/synthesis plus bounded direct prepared-source windows from chapters 50, 62, 63, 66, 67, 81 and 87; official SRDs 5.1 and 5.2.1 selected spell sections; official revised Basic Rules spell descriptions. This is not a whole-book reread, all-editions D&D survey or proof of current gameplay.

**Source route correction:** the catalogue's old Calibre EPUB path and D&D's temporary PDF paths no longer exist. MoL Royal Road chapter 50 fetch failed once; switched to the existing local prepared chapter files, without retrying site variants. Official D&D PDFs opened through the web route. MoL's dossier paragraph ordinals do not universally equal the newer prepared shard labels: the simulacrum passage is prepared chapter 62 p148–154, not the dossier's p111–154 span alone. Preserve locator scheme with every reference. Raw selected spans and hashes are private at `docs/research/novels/_local-eval/private/mol-dnd-lore-2026-10-31/primary-windows.json`; the initial extraction includes contextual windows beyond the claims used. Some broad keyword/context output was truncated; this report uses the subsequent bounded passages actually inspected, not a claim to reading omitted output.

Labels: **S** depicted action/state, **T** character exposition, **A** attributed author-account clarification, **R** selected printed rule, **I** project inference, **P** proposed engine/UI behavior. A character's explanation and an author's comment are retained with their scope, rather than silently made universal.

## Mother of Learning

### MD1. A room's shutdown and operating budget depend on its design, not its name

**Debate:** [nested pocket dimension inside a Black Room](https://www.reddit.com/r/motheroflearning/comments/d1pcrb/what_would_happen_if_you_made_a_pocket_dimension/). The premise assumes no emergency stop; another commenter questions whether that describes older designs. The `nobody103` account answers the increased-consumption alternative affirmatively. Treat this as an attributed author-account clarification, not confirmation of every dimensional workaround in the replies.

**T, direct check:** prepared chapter 50 p73–84 distinguishes enclosure, paid upfront operation and the historical inability to terminate early. The text's word “Initially” prevents making that historical restriction timeless. It does not specify the complete current shutdown procedure. Chapter 87 p104–120 describes a larger research proposal needing facility expansion, methods, funds and staff, not a completed free upgrade. **A:** the thread supports faster depletion for its particular proposed volume change. Exact cost curve, safe endpoint and current design's shutdown controls remain unqualified.

**P, UI arrangement:** one preparation workspace compares selected facility revision, interior/exterior elapsed time, occupants, provisions and admitted enclosed volume. Show outside contacts as unavailable where isolation applies. Put design/reference history in a sibling disclosure. “Request shutdown” appears as an action only for a design with an implemented command; an unknown procedure gets a research gap, not an invented universal prohibition. A volume-changing operation returns to this same preparation/operation view with its revised forecast.

**I/P, engine:** first inspect `simulation.js` command/job progression, `simulation_effects.js:applySimulationEffects` and MoL's `previewMolCommand`/`molFacts`. Needed future additions are a qualified facility policy, boundary-crossing admission, local-to-exterior time mapping and actual supplies/energy consumption. Do not multiply `state.clock` globally. Save the facility/method revision and the forecast inputs committed to a running session; changing internal volume needs the chosen method's recomputation/settlement policy. This facility is absent from the installed retained visitor branch, not proven by its clock.

**Distinguishing check / reopen:** an outside supplier cannot replenish a sealed active session through an ordinary shop purchase; a supported interior-volume change revises expenditure without charging twice after reload. Reopen when selecting a room design or source passage that establishes shutdown or capacity changes. Capability level/effort: synthesis medium; any implementation later requires coordinator-owned clock/save work and the above failure check.

### MD2. Shared identity does not supply an era-independent communication channel

**Debate:** [chapter 67 travel solution](https://www.reddit.com/r/motheroflearning/comments/1ul63nm/ch_67_i_must_have_missed_the_travel_solution_what/). Replies mix physical travel, relays, later shared-soul communication and two-ended gate coordination; another reply explicitly challenges the chronology.

**S/T, direct check:** prepared chapter 63 p10–16 uses a physical relay and treats the alternate conduit as an idea not yet understood. Chapter 67 p65–72 and p97–98 supports a copy sent to the far endpoint and a demonstrated return passage. It does not by itself prove the later conduit was already available. This pass leaves the exact later unlock chapter and the full long-distance relay chain unresolved. Do not accept either confidently narrated comment as a complete route proof.

**P, connecting screens:** the expedition roster owns “last confirmed report,” channel/device, endpoint presence and report freshness. The map's proposed gate opens a preparation pane requiring the two actual endpoint participants and their current supported link. Clicking a stale report opens its evidence/history, not a secretly current remote inventory. Return preserves the selected expedition and endpoint pair. Later communication improvements replace the channel adapter, not the identity of the expedition or its previous receipts.

**I/P, engine:** `molFacts` and `molPresentation` currently expose the visitor's local campaign, not this remote team. A future channel producer must establish sender, receiver, means, reach, clock and delivered knowledge; gate planning consumes that admitted information plus actual endpoint participation. Reuse existing facts/jobs/observer projections before introducing a world-local link adapter. Persist message identity and delivery separately from the sender's private state. A severed relay changes the available coordination route without deleting either body.

**Distinguishing check / reopen:** move a copy beyond the admitted channel or remove its relay, then request the gate: an old successful report cannot satisfy current coordination. A later qualified channel may restore coordination through its own mechanism. Reopen on the first remote-expedition slice or direct inspection of the later communication advance. Effort: substantive synthesis medium; done means route-specific channel and stale-report scenarios, not a generic “telepathy” flag.

### MD3. Copies can be autonomous workers with shared fuel and undelivered discoveries

**Debate lead:** MD2's competing explanations plus [simulacrum learning/report discussion](https://www.reddit.com/r/motheroflearning/comments/pir4gv/) found in search only. The latter was not opened and supplies no evidence here.

**T/S, direct check:** prepared chapter 62 p145–154 separates spell authenticity, an autonomous copy, shared source resources and proficiency-dependent copy quality. The older mentor's warning is advice about divergence, not a mechanically proven universal expiry. Chapter 63 p10–16 depicts divergent experience and a transmitted memory packet; chapter 66 p79 depicts delegated written work requiring review. Shared fuel therefore does not establish instant global knowledge or automatic agreement.

**P, UI grouping:** a worker card shows current task, payer/source, reported capability and last received result. “Review report” belongs with research/notebook, while “assign task” belongs with operations. Keep private remote observations out of the original's notebook until an admitted delivery/review. Show skill/source-quality assumptions in the task preview so a weak copy is not quoted as the original's full capability. The advice about duration belongs in known method notes, with its source, rather than a fabricated fixed death timer.

**I/P, engine:** actor and knowledge owners need separate IDs even where resource debits resolve to one source. Start from `simulation_effects.js:participant`, `simulationFacts` and the existing command/effect transaction; none establishes a complete source-canon copy system. Future commands resolve the real payer, worker capability and report recipient independently. Save shared-source references, task version, result carrier and receipt; avoid cloning a mana balance for every body or sharing the entire knowledge object.

**Distinguishing check / reopen:** two workers spend from the same admitted source, but losing one before its report leaves the other actor's knowledge unchanged unless another qualified route transfers it. D&D copies do not inherit this resource/learning law. Reopen with a copy-task implementation or a later source case changing autonomy or synchronization. Effort: synthesis medium; completion requires independently demonstrated fuel and report behavior.

## D&D, qualified by rules profile

These cases concern high-level exceptions to an early spell/effect model. D&D has editions, supplements, setting eras and table rulings, rather than one novel's later-book sequence. Keep those axes independent under the existing [source contract](../../../worlds/dnd/SOURCE_CONTRACT.md). The proposed first SRD 5.2.1 profile remains a proposal.

### MD4. Suppression preserves an effect's lifetime; an exception may preserve its function too

**Debate:** [concentration when entering Antimagic Field](https://www.reddit.com/r/dndnext/comments/p5fg2l/antimagic_field_question/). Replies distinguish the concentrating actor from the affected target, then debate secondary aftermath. This pass does not settle the aftermath claim.

**R:** Antimagic Field, [SRD 5.2.1 p109](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=109), suppresses ongoing spells in its area while their duration elapses, with stated source exceptions. Prismatic Wall p155 names a specific exception to antimagic and different handling for dispelling layers. The revised [official spell text](https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#AntimagicField) independently exposes the field wording. This establishes scoped suppression, not a generic rule that every magical thing is deleted or paused. Concentration/secondary end-event handling still needs its exact selected-profile passage before implementation.

**P, UI:** keep an effect row visible as “suppressed here,” showing remaining time and the admitted suppressing cause. Link to the field on the situation/map pane. Keep the concentration owner's control separate from target function. The layer view for a layered defense stays with that object; a whole-object dispel button must preview which qualified layer it can affect. Leave developer-only rule explanations outside the character's discovery view.

**I/P, engine:** inspect `simulationFacts`, `applySimulationEffects` and command progression before proposing an effect-status extension. Distinguish lifetime, suppression by context, concentration support and end-event settlement. Persist cause/profile and elapsed clock; no browser visibility callback should end or extend it. No inspected D&D runtime adapter currently proves these rules.

**Distinguishing check / reopen:** enter the field, save/reload, let the duration expire, then leave: an expired effect does not resume. A qualified exception is tested separately from ordinary suppression. Reopen for the first suppressor, layered defense or persistent spell slice. Effort: synthesis medium; runtime done check includes expiration-under-suppression and partial-target behavior.

### MD5. Resource recovery is per method and revision, not one property of every duplicate

**Debates:** [2014 sorcery-point recovery](https://rpg.stackexchange.com/questions/122502/can-a-simulacrum-of-a-sorcerer-regain-its-sorcery-points) distinguishes written text from attributed design intent; [revised-rule recharge proposal](https://www.reddit.com/r/3d6/comments/1wkw19p/recharge_your_simulacrums_spell_slot_an/) combines several methods and disputed costs. Neither establishes the entire combination here.

**R:** Simulacrum, [SRD 5.1 p180](https://media.dndbeyond.com/compendium-images/srd/5.1/SRD_CC_v5.1.pdf#page=180), explicitly restricts expended spell-slot recovery. [SRD 5.2.1 pp162–163](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=163) instead explicitly excludes short/long rests and casting this spell. These wordings are not interchangeable. This review does not verify the proposed supplemental recharge spell, glyph targeting or circle-casting combination, and does not infer that its absence from the inspected SRD proves it cannot exist.

**P, UI:** the duplicate resource card previews a selected recovery method and its actual prerequisites rather than one “refill” control. Put proposed supplemental combinations in the reference/plan pane until qualified; show required collaborators and shared costs when actually supported. A profile conversion preview must identify altered recovery options and active copies affected. MoL's shared-fuel worker model must not supply these rules.

**I/P, engine:** use existing actor/resource transactions, then add profile-specific recovery admission and supplement revision bindings where justified. Preserve current spent resources and active-copy definition when loading an older receipt. Do not silently interpret a saved 5.1 method with 5.2.1 text or grant an uninspected supplement to a core-only instance.

**Distinguishing check / reopen:** the same proposed rest is evaluated against each pinned profile without changing the other save; any later supplemental route uses actual materials, targets, participants and resource consumers. Reopen when that supplement is acquired/qualified or the first duplicate/recovery feature is selected. Effort: source qualification and synthesis medium; no “infinite/free” proposal becomes a result without the complete mechanism chain.

### MD6. Self-dependent suppression is an unresolved ruling, not a license for endless event recursion

**Debate:** [a simulacrum casting Antimagic Field](https://www.reddit.com/r/DnD/comments/vzsy4w/a_simulacrum_casts_antimagic_field_and_finish/) proposes disappearance, lost concentration, immediate return or repeated flickering, including invented random behavior. Treat those as competing rulings.

**R/gap:** older Antimagic Field, SRD 5.1 p117, contains special treatment of magically created creatures; its Simulacrum text is on p180. The printed self-dependent interaction was not fully resolved by this pass. The revised spell wording differs, so the older debate is not automatically a ruling for SRD 5.2.1. No invented 50% flicker rule or recursion outcome is adopted.

**P, engine/UI:** the selected profile's existing [rulings ledger](../../../worlds/dnd/RULINGS_LEDGER.md) is the destination for a qualified answer, revision and test before enabling that combination. Show one transaction outcome and its declared unresolved support if the combination lacks an implementation. A bounded event evaluator needs a diagnostic for a dependency cycle, rather than executing an unbounded disappearance/reappearance loop or covertly choosing a lore answer. Such a technical stop is not an in-world law or anti-exploit punishment.

**Distinguishing check / reopen:** the exact created actor is both caster and affected subject; settlement either follows the qualified ruling once or reports a bounded unsupported cycle without partially spending/publishing. Save/import cannot restart the cycle. Reopen only when this profile-specific combination enters an implementation slice. Effort: substantive rules synthesis medium, then focused event-transaction regression. This is a future scenario, not a diagnosed current engine defect.

## Long-term workflow implications

**ACT NOW (done), MD7:** retain these results in each incumbent world owner and the UI receipt, with direct links. No parallel canon registry or new world-selection priority. MD1–MD3 do not upgrade the existing non-loop MoL visitor campaign to a protagonist loop. MD4–MD6 do not qualify a D&D campaign or rules selector as implemented.

**ACCOUNT FOR NOW, MD8:** extend the existing WA56/WA58–WA60 assumption row with the *method available at that stage*, the source locator scheme and the actual dependency that must survive. Use a channel/version test for MD2, a shared-payer/separate-report test for MD3, lifetime-versus-function for MD4, and method/profile qualification for MD5. Technical cycle bounds in MD6 do not settle fictional mechanisms. Historical advice, current mechanisms, attributed author supplements, printed rules and table rulings retain their own evidence types.

**LATER, MD9:** reopen individual rows at their named consumer, not as a requirement to implement advanced systems now. One selected runtime slice gets the relevant scenario and existing AD36/AD43 proof. Route shared changes through WA57's coordinator and verify the second world's differing case before extracting a shared seam. Current source/contract review is agent-verified at the bounded reading level, not gameplay or human review.

## Verification and attribution

Document checks: new file/links, code continuity in the receipt, whitespace and private evidence hashes checked by the coordinator. No build, runtime test, browser, persistence, installed app, commit or push. Open gaps: MoL's later communication unlock and complete channel route; current room shutdown procedure and cost curve; D&D supplemental combination, concentration aftermath and self-suppression ruling. Findings intentionally preserve these gaps.

This work includes material from the System Reference Document 5.2.1 (“SRD 5.2.1”) by Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd. The SRD 5.2.1 is licensed under the Creative Commons Attribution 4.0 International License, available at https://creativecommons.org/licenses/by/4.0/legalcode.

This work includes material taken from the System Reference Document 5.1 (“SRD 5.1”) by Wizards of the Coast LLC and available at https://dnd.wizards.com/resources/systems-reference-document. The SRD 5.1 is licensed under the Creative Commons Attribution 4.0 International License available at https://creativecommons.org/licenses/by/4.0/legalcode.
