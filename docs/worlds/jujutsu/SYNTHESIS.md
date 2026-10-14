# Jujutsu Kaisen world-pack synthesis

**Status: research synthesis and design proposals.** No mechanics here are accepted runtime behavior. The wiki evidence is a dated secondary snapshot, not primary-source authentication. The pack is designed for the project’s canon-first anime/manga tier while keeping canon, AU and original premises as separate authored continuities.

## 1. Sources, labels and earlier work

- **Read in full as supplied selected text:** 501 retained rows in `workers/qualifier/NOTES.jsonl`; the full-read lane records 501 main selections and 3,887,963 characters. Six restored non-character pages were integrated separately; the parent-review lane independently reviewed all 481 pending notes, indices 20–500, against restored selected text. The review lane reports actor/condition repairs and no hallucinated mechanics or costs in its sampled semantic audit. These are complete reads of the stored selections, not every wiki page or every referenced chapter.
- **Read in full for this synthesis:** the JJK digest, lane spotcheck and JJK correction handoff; all 501 qualifier note records were indexed for title, revision, facts, inference and proposal coverage. The full note set is catalogued in [SOURCE_LEDGER.md](SOURCE_LEDGER.md). The key laws below were separately checked in their restored private payloads against manifest read hashes and character counts.
- **Checked by targeted search / not read in full here:** cross-world start/AU/access material, campaign framework, completion template, sealed-secret rules, depth considerations, and the existing JJK brief. These informed composition and gates rather than canon claims.
- **Not read:** the manga, anime episodes, databook, official guide or primary author statements. No fanfiction survey was supplied. Fandom’s scripted page request returned 403 in the digest work. Wiki-delegated and unexpanded templates, empty-input audit, nested roster dependencies, later live revisions and archive-wide pages remain incomplete.
- **Label key:** `W` = dated wiki assertion, cited by article title and revision; `I` = analyst inference; `P` = proposed world-pack behavior; `U` = unresolved/unknown. Claims about events, characters or techniques remain continuity-bound. Every proposed behavior is tagged `P`.

Related work: [existing brief](WORLD_BRIEF.md), [wiki digest](../../research/power-systems/wiki-digests/DIGEST_jujutsu-kaisen.md), [world depth considerations](../WORLD_DEPTH_CONSIDERATIONS_2026-10-13.md), [campaign framework](../CAMPAIGN_FRAMEWORK.md).

## 2. Rules an engine has to model

| Rule | Evidence and boundary | Proposed engine shape |
|---|---|---|
| P Fuel has several independent measures | `W` Cursed Energy r79259: capacity, output, flow/control, leakage and perception are described distinctly; emotion quantity is not a simple capacity formula. | `P` Track reserve, output ceiling, control/waste, presence/residuals and qualified perception separately. Do not convert grade or mood directly to a single power score. |
| P Technique source differs from learned execution | `W` Cursed Technique r79254: innate formula is brain-engraved, inherited techniques expose an existing method, extension is application, and barriers/shikigami can be learned. Gestures and words can be omitted for efficiency or deliberately retained for effectiveness. | `P` Separate body-bound source, acquired knowledge, execution recipe, practice, output and exposed information. A learned barrier is not a copied innate technique. |
| P Restriction types are not interchangeable | `W` Binding Vow r78401 distinguishes self-vows from mutual bargains; self-breach loses the gain, while mutual consequences are described as greater but not given a universal schedule. `W` Heavenly Restriction r79234 describes a birth-imposed exchange without chosen consent; a fully zero-energy body can perceive curses through heightened physical senses while evading cursed-energy detection. | `P` Use distinct records for chosen self-vow, mutual vow and imposed body condition. Unknown sanction stays unknown; no generic random penalty or consent assumption. Keep exceptional physical curse perception separate from energy sensing and physical barrier interaction. |
| P Barriers target actors and spaces under explicit conditions | `W` Barrier r74038: barriers can conceal, contain or deny entry; the page says recognition tracks cursed-energy-bearing individuals while ignoring inanimate objects and buildings. Complex selective entry requires skill. `W` Curtain r77658: the exterior view is concealed, outsiders see the pre-activation scene, and the shell is visible to qualified observers. | `P` Model boundary, geometry, target predicate, entry/exit, interior environment, shell strength and any embedded effect separately. For the first slice, use the curtain's concealed exterior view and allow qualified observers, including windows, to see its shell. Keep its authored entry predicate separate. Test who/what the rule recognizes before resolving a hit. |
| P A domain can impose several kinds of outcome | `W` Domain Expansion r78744: domains can embed sure-hit attacks, nonlethal information or procedures; incomplete forms may lack sure-hit; counters can suppress it; use can burn out the technique. Cases vary. | `P` Separate expansion, shell, imbued method, procedure, hit guarantee, clash, counter, escape/rescue and burnout. One “domain level” cannot stand in for these. |
| P Healing and reversal have different targets | `W` Reverse Cursed Technique r79210: positive energy, self-healing, external treatment, soul repair, anti-curse use and technique reversal have different access and constraints. | `P` Name target, provider, body/soul compatibility, injury, fuel and source effect. A recovery item does not restore every technique or life. |
| P Rank is evidence, not outcome | `W` Finger Bearer r73010 and Cursed Energy r79259 give examples where grade and sensed energy fail to guarantee matchup outcomes. | `P` Store institutional grade, observed capability, hidden capability and matchup evidence separately. Fixed threats retain their authored strength. |
| P Rules have history and can be changed through constrained authority | `W` Culling Game r79139 distinguishes participant entry/removal, point transfer, rule additions and barrier effects; its rule-addition text describes adding a rule to the game. | `P` Version the game-wide rule set with author, authority, effective time, admissibility and consequences. Track colony barriers and local consequences separately. A new rule does not rewrite past events. |

### Core laws checked against restored text

For Cursed Energy r79259, Cursed Technique r79254, Binding Vow r78401, Domain Expansion r78744, Heavenly Restriction r79234, Barrier r74038, Curtain r77658, Culling Game r79139 and Reverse Cursed Technique r79210, the restored payload `text` length and SHA-256 matched each manifest `read_characters`/`read_sha256`. These are wiki payload checks, not primary-source proof. The detailed selected facts and revisions are in [SOURCE_LEDGER.md](SOURCE_LEDGER.md).

## 3. Full catalog at a glance

The retained set spans 501 wiki selections: setting/era, institutions/clans, people, species/curses, tools/objects, innate and learnable techniques, barriers/domains/counters, arcs/events/battles, locations, anime/manga media, and later Simurian/Modulo material. The full title-and-revision index is in [SOURCE_LEDGER.md](SOURCE_LEDGER.md); it retains each article's own continuity and revision boundary. It is not a claim that every character or power in the franchise has been covered.

| Family | Pack role | Neighbors / conflicts to preserve |
|---|---|---|
| P Cursed energy and perception | Fuel, reinforcement, sensing, residual traces, cursed-object and curse ecology | Amount is not output; presence is not perception; concealment and zero-energy absence complicate detection. |
| P Body, soul and identity | Innate source, imposed restriction, incarnation, possession, injury and recovery | Body, brain, soul, technique, memory and legal identity may diverge. No universal transfer rule. |
| P Innate methods and learned arts | Personal techniques, inherited manuals, extension, maximum, barriers, shikigami and anti-domain | A source, a learned procedure, a tool and a copied effect are not the same capability. |
| P Vows and conditions | Self-limits, mutual contracts, disclosures, future obligations and technique-specific gates | Stated conditions may be incomplete or disputed. Mutual enforcement and coercion remain case-specific. |
| P Domains and barriers | Concealment, containment, entry rules, sure-hit, nonlethal procedures, clash and counters | Shell and inner space can differ. Open/incomplete forms do not share a universal mechanic. |
| P Social systems | Schools, assignments, grades, clans, headquarters, succession, coercion and markets | Grade, office, permission, custody, access and actual strength remain separate. |
| P Long-form events | Arc chronology, colony rules, battles, consequences and changed histories | Wiki summaries are secondary and can inherit cross-page details; claims stay attached to their own page and continuity. |
| P Future/later continuity | Simurian, Simuria and Modulo-related people, techniques and customs | Kept as a separate later continuity; never merged silently into a main-series era. |

## 4. Data model proposal

`P` Author independent records, not one all-purpose “power” object:

- `WorldDefinition`: source family, continuity, source cutoff, canon/AU/original status and allowed content.
- `EraDefinition` and `WorldInstance`: immutable starting snapshot versus durable played causal history.
- `EntryProfile`: actual body, knowledge, language, source access, custody, means, obligations and arrival condition.
- `ActorIdentity`: body, brain/source, soul, memories, status/office, consent state and known facts as separately owned fields.
- `EnergyState`: capacity/reserve, output, flow/control, leakage, observable signature and perception.
- `Capability`: source, bearer, method, learned steps, trigger, target, geometry, costs, limits, counters, failures, mastery and provenance.
- `ConditionOrVow`: voluntary/imposed type, signatories, exact restriction, duration/window, benefit, trigger, evidence, known breach rule and unresolved enforcement.
- `BarrierOrDomain`: shell/space, target predicate, entry/exit, construction, embedded method/procedure, hit guarantee, counter, clash, escape and aftermath.
- `KnowledgeRecord`: observer, evidence, confidence, timestamp, source and what remains unknown.
- `InstitutionalClaim`: rank, office, legal authority, permission, asset access, custody and actual control as independent claims.
- `ContinuityEvent`: cause, affected actors/sites, immediate result, durable consequences and knowledge propagation.

`P` Freeze chosen canon cutoff and module revisions per run. Canon names remain in the research/design pack; any direct-adaptation runtime content follows PROJECT.md’s private-pack rule. Public-facing original-world echoes use original names and explicitly changed mechanics. Persistence schema and compatibility remain unimplemented.

## 5. Turn rules into play

| Pack law | Proposed YAIRPG expression | Existing owner / gap |
|---|---|---|
| P Training/control | Idle practice, queued drills, fatigue/recovery, teacher access and paid mission work can develop control without combat grinding. | `P` Fit existing skills/jobs and projects. No runtime source/API verification was performed in this research task. |
| P Mission and grade | Dispatch includes evidence, expected grade, uncertainty, pay, authority and participants; actual threat is fixed. | `P` Use campaign occurrences, actors, organizations, claims and time. Grade remains a source-world credential. |
| P Inherited source | A clan/teacher can provide a manual, access, opposition and obligations; the player's own source remains body-specific. | `P` Connect knowledge and relationship prerequisites without granting a technique through reputation alone. |
| P Vow | Player sees the exact voluntarily accepted restriction, gain, trigger and known breach result before accepting; unresolved metaphysical enforcement stays marked uncertain. | `P` Requires one authoritative condition/reward owner and durable event history. Do not infer consent from coercive acceptance scenes. |
| P Domain | A domain changes a limited encounter by its actual embedded rule, with counters that work through their stated mechanism. | `P` Compose existing combat actions and effect owners; generic forced-hit modifiers are insufficient. No combat code changed. |
| P Curse ecology | Place pressure, fear/death history, observers, barriers and available responders can generate discoverable incidents. | `P` Use place facts and clocks only where existing systems support them; curse generation, visibility and custody still need runtime proof. |
| P Social causality | Succession, permission, evidence, asset access and control can disagree and change after witnessed actions. | `P` Use actor-specific knowledge and durable claims. No omniscient universal authority. |
| P AU/history | AU is a distinct continuity or explicit divergence with cause and downstream changes, not a replay that silently resets a live instance. | `P` Composition matches CAMPAIGN_FRAMEWORK; independent native world binding remains a runtime gap. |

## 6. Living beside the protagonist: proposed starts

No fan-premise survey was provided, so these are `P` start options derived from the supplied source coverage, not M3 fan consensus. Starts are snapshots with legal means and actor-specific knowledge.

| Start | Useful role and mechanic | Pitfall to avoid |
|---|---|---|
| P Non-sorcerer witness/helper | Records, logistics, clinic or window work; can notice consequences without seeing every curse. | Do not grant curse perception or combat eligibility by default. |
| P Student with a modest technique | Training, school access, grades and missions; build source/control/practice separately. | Do not make enrollment a universal destiny or guarantee of rank. |
| P Clan outsider or disputed heir | Inherited-method knowledge, competing claims, family pressure and asset access. | Named heir is not the same as consent, custody or effective authority. |
| P Tool-focused worker | Repair, inventory, safe handling, evidence and support can matter without an innate technique. | Tool possession does not teach its stored method or make every user compatible. |
| P Culling Game entrant | Constrained rule system, points, risk, negotiated cooperation and explicit exit stakes. | Entry, barrier transport, removal and killing the organizer are separate rules. |
| P Later-continuity traveler | Simurian/Mul/Rolloluca-era systems as a separate authored era. | Do not import later society or abilities into main-series continuity by default. |

`P` Relationship, romance and swapped-role AUs should reuse the same source laws while declaring what changed, who knows it and why the resulting timeline differs. Changed or randomized truths use sealed slot IDs and discovery routes in their runtime surface; pack text below the spoiler boundary refers only to those IDs.

## 7. More to consider

- **Source truth versus in-world belief:** institutions can misgrade, characters can lie, and a wiki can repeat an attributed claim. Keep evidence and confidence on every knowledge record.
- **Actor errors and dropped conditions:** JJK lane spotcheck P2/P3 failures included a vow user swap and explicit conditions omitted from summaries. Recheck source conditions and actors before making rules universal.
- **Contradictions and versioning:** preserve article-level continuity, cited chapter/media, and revision. Later Modulo material is not a transparent update to a main-series start.
- **Public twists versus changed truth:** public franchise revelations need no concealment. New or randomized JJK-world truths are sealed under the project standard; discovery route only in public pack text.
- **Power scale:** grade, energy, output, matchup, experience, preparation, body and authority are different dimensions. Let strong characters remain strong and let a prepared support role solve tasks it can actually reach.
- **Scope:** source breadth supports a deep pack proposal, not a complete playable adaptation. One realm and one prestige layer remain the current milestone boundary.

## 8. First playable slice proposal

`P` **The Curtain Dispatch**: a low-grade Tokyo-area assignment in one fixed modern-era continuity. A non-sorcerer window supplies an incomplete report; a student team must choose whether to investigate, request qualified help, or refuse. One curtain has an authored entry condition and conceals a bounded site. Outsiders see the scene as it appeared before activation; qualified observers, including windows, can see the shell. The player can collect witness/material evidence, use one already acquired learnable counter or tool, and decide whether to enter. A minor curse is a fixed threat; no adaptive boss or special-grade escalation is needed.

The slice demonstrates: limited curse visibility, reported-versus-known facts, a source-qualified barrier interaction, costed training/work, refusal with no invented debt, and one durable consequence for the local actor/site. It should include a positive route and an honest unsupported-action failure. `P` desktop/laptop is the intended play target; visible outcome is a compact dispatch board, evidence panel, actor status and actionable investigation/training choices. Mobile optimization is deferred. Proposed acceptance asks for a rebuilt fresh-origin browser run and, if persistence changes, save/reload/import. This research pack has no playable implementation, build or browser evidence.

## 9. Gaps that would change the design

1. Primary manga/anime and official guide verification for the core procedures, especially barrier recognition, zero-energy exceptions, vow enforcement, domain counters and soul/body transfer.
2. Unexpanded wiki templates, nested lists and the open empty-input audit; completeness of the broad technique/character catalog is not established.
3. Explicit choice of main-series cutoff and whether the post-main-series Simurian/Modulo continuity is in scope for the initial pack.
4. Source-qualified detail for individual start eras, mission economy, school/clan access and the start options above.
5. Runtime owner inspection for energy, barrier/domain combat, secrets, world binding, durable AU state and import compatibility before turning any proposal into a packet.

No gap blocks this research synthesis. The first build decision should follow a director review of the slice premise and a primary-source spot audit, not an assumption that source-read completion equals accepted canon or gameplay.
