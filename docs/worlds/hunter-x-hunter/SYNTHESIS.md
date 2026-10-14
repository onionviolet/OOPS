# Hunter × Hunter world-pack synthesis

Status: M5 design proposal r1, 2026-10-14. This translates the supplied research into a usable authoring pack; it is not accepted canon implementation, a complete manga audit or playable content. Every proposed rule and game mapping is labelled `P`. Evidence is `WIKI` secondary unless explicitly called otherwise. No raw source prose is included.

## 1. Sources and reading coverage

### Read directly for this synthesis

| Source | How used |
|---|---|
| [Project authority](../../../PROJECT.md), [user vision](../../USER_VISION.md#world-depth-and-canon-first-world-priority-2026-10-13) | Read the current project summary and canon-first priority. The dirty worktree's already-modified authority files were read as live state and left untouched. |
| [Source deep dive playbook](../../research/SOURCE_DEEP_DIVE_PLAYBOOK.md) | Read steps, M5 outline and checklist. The requested `source-deep-dive` skill is not present in the available local/session skill catalogs; the repository playbook was followed directly. |
| [Campaign framework](../CAMPAIGN_FRAMEWORK.md), [world completion template](../templates/WORLD_COMPLETION_TEMPLATE.md), [world secrets](../WORLD_SECRETS_AND_DISCOVERY.md) | Read composition rules, completion scope fields, knowledge routes and sealing contract. |
| [World depth proposal](../WORLD_DEPTH_CONSIDERATIONS_2026-10-13.md) and its access/start, priority, cross-world and HxH-relevant feature rows | Read relevant sections for canon-first ordering, start profiles, in-world access routes, parallel/AU boundaries and the HxH exam/bounty/treasure-hunt access palette. These rows are proposals, not accepted design. |
| [Bleach eight-owner pack](../bleach/) | Read owner structure and examples to match the local eight-file layout and source/evidence labels. No Bleach file was edited. |
| [HxH wiki digest](../../research/power-systems/wiki-digests/DIGEST_hunter-x-hunter.md) | Read its revision-backed findings and boundaries, including the statement that prior lane mappings remain unverified. |
| HxH worker notes | Parsed all supplied JSONL entries and reviewed source facts relevant to the core laws and pack design; see coverage counts below. |
| Private cached wiki payloads | Spot-checked cached page payloads for *Nen* r421055, *Hunter Exam* r419181, *Hunter License* r405166, *Hunter Association* r419296, *Greed Island* r411117, *Genthru* r420609 and *Hunter Exam arc* r418810. They are wiki text, not manga text. Their cited chapter locators are recorded in the [source ledger](SOURCE_LEDGER.md). |

### Notes coverage, not manga coverage

All 1,257 supplied note records declare `read_complete: true`; that means the wiki page or selected spans in that note were read. It does not mean all manga scenes, all wiki pages or all source claims were directly verified.

| Supplied file | Records | Scope counts |
|---|---:|---|
| `workers/hxh-full/NOTES.jsonl` | 100 | 7 full page; 82 mechanic sections; 5 reviewed in scope; 6 need scope review |
| `workers/hxh-full/r2-2026-10-13/shard-a/NOTES.jsonl` | 703 | 274 full page; 217 mechanic sections; 212 need scope review |
| `workers/hxh-full/r2-2026-10-13/shard-b/NOTES.jsonl` | 454 | 9 full page; 58 mechanic sections; 146 reviewed in scope; 17 need scope review; 224 narrative only |

`full_page` is full reading of that dated wiki article; `mechanic_sections` is the selected mechanic-bearing content; `reviewed_in_scope` and `narrative_only` are bounded to the stated use. `needs_scope_review` remains unresolved, not silently accepted as irrelevant. In the indexed corpus, 4,123 content pages were inventoried and indexing is not full reading. The manifest says 701 character articles were checked and seven supplemental spans remained unread. An adjacent [reading manifest](readers-2026-10-14/READING_MANIFEST.md) lists every page title, revision, scope and read state. The full paraphrased reader notes remain in their git-ignored research location; they are not duplicated into tracked files.

The wiki pages marked `full_page` were read in full as wiki articles; the `mechanic_sections` and `reviewed_in_scope` rows were read only in their retained spans. `needs_scope_review` rows remain explicitly unresolved, and `narrative_only` rows were read only for narrative context. The supplied three note files contain no search-only rows: every record is marked as a complete page or selected-span read. The existing digest also contains earlier search/lane mappings explicitly marked unverified. The manga was not read in full, and no manga chapter was opened directly in this synthesis. Chapter locators below were reported by wiki citations. The pack therefore treats the wiki as a research aid, not canon authority.

## 2. Rules an engine would need to model

| Rule / source evidence | Proposed engine shape (`P`) |
|---|---|
| Aura is a living actor's life energy; nodes and control matter. *Nen* r421055. | Separate body/source eligibility, node state, reserve, output and fatigue. Unknown capacity stays unknown until learned or measured. |
| Ten, Zetsu, Ren, Hatsu, then advanced applications have distinct uses and tradeoffs. *Nen* r421055. | Model each as a learned method with supported target/effect/cost. Zetsu suppresses aura but removes defense; Ren costs reserve and can expose others to hostile aura. |
| Slow training differs from forced awakening, which can be dangerous. *Nen* r421055. | Keep gradual instruction and forced exposure as distinct authored routes. Forced awakening is never a default reward/tutorial. Show only risks the actor could know. |
| Six categories have approximate affinities. Specialist ability use is categorical: an ordinary user cannot partially use Specialist abilities, and only a Specialist can create them; later transition remains possible in the wiki account. *Nen* r421055. | Store known/estimated affinity separately from actual ability semantics. Gate Specialist ability use and creation by eligibility; do not put partial Specialist proficiency on an ordinary affinity ladder. Keep efficiency numbers and individual exceptions unverified. |
| Ability conditions may be one-time or continuous; restrictions and vows have individual costs and consequences. A broken limitation loses the affected ability and risks loss of Nen capacity. *Nen* r421055. | Validate activation predicates separately from a breach event. Store creator-defined target meaning, duration, cost, counter and consequence per ability. Show the source-reported baseline risks alongside any case-specific added penalty; do not make them universal formulas. |
| Nen is secret from much of the public, with exceptions and institutional tensions. Licensed Hunters generally may not disclose it to uninformed people, with an emergency exception; the Association page reports a provisional-Hunter exception to the professional Nen requirement. *Nen* r421055; *Hunter Association* r419296. | Knowledge belongs to observers and needs communication; proposed teaching/disclosure routes must account for the reported constraint and exception. Public exam/license and concealed professional qualification are separate states. |
| Exam phases vary and licensing follows passing. The wiki reports five or six phases on average and next-year exam access for a candidate who passes phase three. *Hunter Exam* r419181; *Hunter License* r405166. | Define each exam as a versioned scenario with actual phases, expiry, alternatives and settlement. Any shorter authored sequence is a preview unless explicitly authored as exceptional; do not award a license for a partial preview. Keep the specific next-year route distinct from a universal retake right. |
| Hunter license privileges have limits, and a sold card does not transfer the holder's privileges. A lost/stolen card is not replaced; the license page also says a successful passer cannot retake. *Hunter License* r405166. | Track owner, custody, access, loss/sale status, legal scope and exam history as distinct fields. Reconcile the no-retake statement with the exam page's specific third-phase next-year access route in primary review; keep exact privilege percentages and law unresolved. |
| Heavens Arena and Greed Island couple opportunity to serious danger. *Heavens Arena* r417607; *Greed Island* r411117. | Fixed dangers, physical state, access qualification, item custody and exit conditions. No adaptive enemy level or guaranteed rescue. |
| Creatures, factions and high-stakes conflicts vary by species, person and era. *Chimera Ants* r419293; *Succession Contest* r420995. | Actor-local knowledge and evidence-backed species/ability definitions. Do not use one generic threat tier to erase specific differences. |

## 3. Full catalog at a glance

| Family | Coverage from notes | Neighboring families / joins | Main conflict or limit |
|---|---|---|---|
| Nen laws and training | Core *Nen* r421055 plus Wing, Biscuit, Zushi, Knuckle, Kurapika and character ability pages | Teacher access, combat, care, perception, instruments, teams | Secondary summaries, unresolved formulas and exceptions; see [ledger](SOURCE_LEDGER.md). |
| Hunter institution and exams | *Hunter Exam* r419181, *Hunter Association* r419296, *Hunter License* r405166, examiners and locations | Travel, income, legal access, bounties, restricted listings | Exact law, star criteria and yearly schedule need primary inspection. |
| Arena and fighting | *Heavens Arena* r417607; contestants and match rules | Training, fees, injury, public knowledge | Dangerous awakening threshold and match procedures are wiki summaries. |
| Greed Island | *Greed Island* r411117, cards, NPCs, shops, game roles, players and Risky Dice r285550 | Auction, contracts, card storage, Nen ability, co-op and violence | Game/real-island relation, card rules and bodily persistence need focused source verification. |
| Exploration and economy | Locations, currency, vehicles, auction, maps, equipment, cards and routes | Research, appraisal, logistics, habitat and player competition | Hundreds of notes vary in scope and age; presence in the notes does not certify exhaustive inventory. |
| Creature ecology | *Chimera Ants* r419293, individual species and species-adjacent pages, NGL r420505 | Field science, medicine, containment and conflict | Biology, origins and chronology vary by source/era; exact primary review missing. |
| Institutions and communities | Association, Mafia, Nostrade, Zoldyck family, Meteor City r419877, Kakin | Access, status, jurisdiction, secrecy and relationships | Character/continuity claims may mix manga, anime, databook and inference. |
| Succession Contest | *Succession Contest* r420995; Kakin offices, abilities, bodyguards and objects | Information security, parasitic effects, political appointments | Manga is ongoing; a source cutoff must be pinned before deeper timeline work. |
| Adaptation/game-only/merchandise | Many notes are reviewed in scope or narrative only | Optional separate branch or inspiration | Not manga canon. Do not merge games, anime, films, stage works or promotional sources into the base snapshot. |

The catalogue records hundreds of named pages; the pack intentionally selects engine-relevant families rather than reproducing all encyclopedic facts. Coverage is broad and secondary, not complete.

## 4. Proposed data model

Use the authoring records in [module catalogue](MODULE_CATALOGUE.md): actor aura state, training record, affinity profile plus a separate Specialist eligibility gate, personal ability, restriction record, credential with owner/custody/loss and professional-qualification states, exam scenario with phase completion and any third-phase next-year eligibility, knowledge claim, disclosure basis and world-instance state. Each remains a proposal until tied to one existing state owner and a compatibility decision.

Core invariants (`P`):

- One owner per resource, item, person, ability and local claim.
- Personal ability source and creator semantics survive learning/stealing/copying routes when that case's evidence requires it.
- Observer knowledge never writes author truth. Rumor, observation, inference and confirmed fact stay distinct.
- Proposed teaching and disclosure routes preserve the reported restriction on licensed Hunters disclosing Nen to uninformed people, including its emergency exception; primary review remains open.
- A failed predicate does not consume costs unless the authored method actually spends them; repeated response cannot pay/award twice.
- A continuity or start choice does not rewrite another live world instance. Save identity is independent from visible era labels.

## 5. From rules to play in YAIRPG

All are proposals mapped to shared systems, not proof of runtime fit. The campaign uses the current composition framework's world, continuity, era, region, entry, scenario, power and failure policy concepts. The completion template's S00–S14 detail mapping should be filled before a world is called design-complete.

| Rule | Proposed play | Candidate existing YAIRPG seam | Missing proof / dependency |
|---|---|---|---|
| Aura control | Practice, fatigue, reserve and focused defense affect actual options. | Power models, energy resources, skills and training projects (inspect live at implementation). | HxH body/source/target mapping and compatibility remain unreviewed. |
| Personal ability | Learn one creator-owned predicate and test it on a real target. | Ability authoring and simulation effects. | No world schema or Nen binding is implemented by this pack. |
| Risk / vows | Make terms visible before acceptance, then retain actual cost and breach. | Commitments, jobs, conditions and cause records. | No universal Nen vow service; source-specific policy needed. |
| Hunter exam | Paid preparation and authored test phases offer distinct paths and outcomes. A page-reported route grants next-year exam access to applicants who pass the third phase; do not generalize it to every failure. | Jobs, scenes, native interactions and knowledge. | Exact phase definitions, actor-local scenario state, special next-year eligibility and persistence unverified. |
| License | A credential unlocks source-qualified services and restricted listings; some high-profile Association jobs reportedly require Nen knowledge, a separate concealed professional step. | Item/custody, reputation/access, contracts and records. | Exact license ownership, privilege list, job gates and save compatibility open. |
| Research/information | Buy a report, compare it with evidence, choose to disclose or withhold. | Knowledge effects, notebook/events and witnesses. | Need observer-specific claims and interface checks. |
| Arena / danger | Stronger opponents remain strong; preparation, retreat or a different objective may help. | Native encounters, vitals, equipment and recovery. | HxH power scaling and lethal/failure policy unimplemented. |
| Greed Island | Card inventory and quests form a self-contained destination. | World instances, item custody, quest/scene controllers. | No proof that existing instance/persistence can support the source's entry/exit rules. |
| Ecology | Survey and research can create paid work separate from fighting. | Jobs, skills, creatures, items, site projects. | Canon-specific biology, abundance, danger and persistence need exact sources. |

## 6. Living beside the protagonist, starts and access

No M3 fanfiction survey was supplied or run; no fan-premise consensus is claimed. Proposed start candidates:

| Start | Proposal | Required mechanics / pitfall |
|---|---|---|
| `exam_candidate` | Original applicant at a locally authored exam route. | Start card shows known place, means and rumor; no hidden canon changes. Do not borrow a protagonist's history. |
| `licensed_field_assistant` | New license holder enters ordinary work after passing a distinct authored exam. | Credential grants only sourced access. Do not equate license with Nen or combat rank. |
| `whale_island_local` | Local life with a later invitation or independently pursued departure. | Starting relationship and departure route are real; the protagonist's family remains theirs. |
| `arena_student` | Later direct snapshot with a sourced teacher and explicit training terms. | Never grant aura through a menu label; high-floor danger is not beginner-safe. |
| `greed_island_player` | Qualified arrival in a dangerous game instance. | Source-compatible card/exit/persistence rules required before use. |

Potential access routes from the shared access palette (`world-depth-2026-10-13/11_ACCESS_AND_STARTS.md`) are proposed: first-run picker for known public starts; in-world exam notice, invitation or paid travel; a Notebook lead to a restricted listing; and an earned or discovered parallel copy only after its route. `QW11` in `22_FEATURES_AS_CHEATS.md` proposes exam, site bounties, Blacklist and Treasure hunting, with restricted listings as an earned option. That row is not canon evidence or accepted implementation. Keep a normal start discoverable without forcing a Frontier run. The unaccepted level of randomization, selector UI and access state remains open.

Parallel versions/AUs are proposals, not canon changes: (1) start at a different source-bounded era as a separate branch; (2) role-only bystander near an event, with actual disturbance and risk; (3) original relationship/household start that does not replace canonical relationships; (4) sealed altered truth only by an opaque ID and discovery route. No AU should be generated from a vague premise that contradicts an established source fact without being clearly marked as a changed branch.

## 7. More to consider

- Build a per-actor knowledge ledger so secrets, rumor and public awareness move through actual carriers.
- Model the Hunter license as a legal/social credential with its own owner and jurisdiction, not a universal permission token.
- Connect research, logistics, medical care and appraisal to opportunities for noncombat characters.
- Let a powerful imported character keep their power when it genuinely applies. Difficulty can come from unknown reach, supply, politics, injury or a stronger fixed opponent, not arbitrary nullification.
- Treat Greed Island as a discrete later instance with explicit risk and return; it can be its own slice after the first applicant slice succeeds.
- Add source-verified locations, minor cast and campaign arcs iteratively. The notes' breadth does not remove the need for a chapter-level authority pass.

## 8. First playable slice proposal

**P1: The exam ticket and the ordinary route.** A new original applicant reaches an original port-side settlement before an authored Hunter Exam. They have one simple repair/courier skill and finite fare. A local boat repair buys a departure ticket; the applicant can also work another shift, decline travel or miss the exam window. Once registration and the specific test are accepted, the candidate meets two genuinely different authored phases: an ordinary navigation/problem-solving route and a paid guide/equipment route. These two phases are a preview of a longer exam, not a complete typical exam, and do not award a license. The result changes the candidate's recorded exam status, relationships and funds once. A later optional instruction route is available only if an eligible, willing teacher and safe gradual curriculum have been authored; Nen is not a guaranteed reward for passing. Licensed holders who lack the concealed Nen-related professional qualification remain ineligible for jobs whose authored terms require that knowledge. An applicant who passes phase three may be offered next-year exam access as a distinct source-reported route; reconcile this with the license page's no-retake statement in primary review.

Target: desktop/laptop. Visible outcome: the player chooses between earning more preparation and departing, then sees the actual phase result, cost, evidence and lasting status. Deferred: mobile optimization, canon-protagonist interactions, broad AU selector, Greed Island, Succession Contest, lethal-mode implementation and full lore coverage.

Acceptance proposal: rebuild and exercise from a fresh origin; test both material routes, refusal, failure and success; check that no Nen appears without its route; save/reload/export/import the exact costs, evidence, knowledge and credential; use the same fixed challenge across character strengths; then request Weibao's fiction and pacing acceptance. This design session ran none of these gameplay gates.

## 9. Gaps that would change the design

1. **Direct manga audit of Nen basics and vows:** could change which methods, states, costs or condition semantics are in the first slice. Current evidence is secondary *Nen* r421055 and cited chapters only.
2. **Exam/license primary review:** could change registration, phase-three next-year eligibility, the no-retake rule, no-replacement card loss, credential privileges, legal scope, star criteria and whether the proposed exam loop is viable. The conflict between the exam page's specific next-year route and the license page's no-retake statement needs direct reconciliation. Also verify the concealed Nen qualification, its provisional exception, and the disclosure constraint before turning them into job or teaching gates. Current *Hunter Exam* r419181, *Hunter License* r405166, *Hunter Association* r419296 and *Nen* r421055 are secondary summaries.
3. **Primary Greed Island entry/exit/persistence review:** could change body danger, card inventory, multiplayer, quest and return design. Current *Greed Island* r411117 is secondary.
4. **Pinned manga continuity cutoff:** needed before placing canon characters, events, Succession Contest or timeline clocks. Current reader corpus includes revisions dated through 2026-07 and does not establish current publication status.
5. **Category and ability contradictions:** Basho's type disagreement and uncertain ability classifications can change authored character profiles. Keep unknown until primary evidence resolves them.
6. **Exhaustiveness:** the corpus includes unresolved scope review and seven supplemental unread spans; discovering omitted core mechanics could alter the full catalog.
7. **Runtime state ownership and save compatibility:** could change implementation shape and order. No existing source was inspected for this documentation-only pass.
8. **Fan premises:** M3 was not run; a later survey may add useful coexistence starts but cannot override canon facts or accepted direction.

## Pack navigation

- [World brief](WORLD_BRIEF.md)
- [Campaign](CAMPAIGN.md)
- [Module catalogue](MODULE_CATALOGUE.md)
- [Source ledger](SOURCE_LEDGER.md)
- [Ability variants](ABILITY_VARIANTS.md)
- [Interactions](INTERACTIONS.md)
- [GM prompt](GM_PROMPT.md)
- [Implementation packet](IMPLEMENTATION_PACKET.md)
