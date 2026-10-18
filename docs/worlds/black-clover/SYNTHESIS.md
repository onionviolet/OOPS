# Black Clover world-pack synthesis (M5)

Status: source-bounded design proposal, 2026-10-14. This synthesis adds no accepted game direction, runtime behavior or playable proof. Owner files: [brief](WORLD_BRIEF.md), [campaign](CAMPAIGN.md), [modules](MODULE_CATALOGUE.md), [source ledger](SOURCE_LEDGER.md), [ability variants](ABILITY_VARIANTS.md), [interactions](INTERACTIONS.md), [GM prompt](GM_PROMPT.md), [implementation packet](IMPLEMENTATION_PACKET.md).

## 1. Sources and prior work

- **Primary input:** WikiTeam Internet Archive snapshot of Black Clover Wiki, dated 2023-12-24; 1,102 selected retained page payloads have full bounded-read receipts. Each cited page is identified by title and revision in [SOURCE_LEDGER](SOURCE_LEDGER.md). It is secondary evidence, not manga authentication.
- **Reader work:** `docs/research/power-systems/wiki-digests/full-dumps/workers/black-clover-full/NOTES.jsonl`, `READ_LEDGER.jsonl`, `SUMMARY.md` and `NOTE_CORRECTIONS.md` are git-ignored paraphrased reader artifacts. No raw page prose is copied into this tracked pack.
- **Earlier work:** [DIGEST_black-clover](../../research/power-systems/wiki-digests/DIGEST_black-clover.md) was `blocked_no_revision`; its mappings were unverified leads. The snapshot reader upgrades evidence availability, not source primacy.
- **Method:** [SOURCE_DEEP_DIVE_PLAYBOOK](../../research/SOURCE_DEEP_DIVE_PLAYBOOK.md), its M5 outline/checklist, [lore/timeline audit contract](../../research/LORE_TIMELINE_AUDIT_CONTRACT.md), the supplied wiki spotcheck, [campaign framework](../CAMPAIGN_FRAMEWORK.md), [completion template](../templates/WORLD_COMPLETION_TEMPLATE.md), [secret standard](../WORLD_SECRETS_AND_DISCOVERY.md) and [world-depth proposal index](../WORLD_DEPTH_CONSIDERATIONS_2026-10-13.md) guided this proposal.

**Read fully:** the reader personally read the entire selected payload for all 1,102 retained manifest rows, 4,655,809 characters, in contiguous chunks of at most 4,500 characters. This includes selected full wiki articles and selected mechanics pages; it does not mean the manga or every wiki-linked primary source was read. The `Black Clover Wiki` rev92682 portal payload was read, but its transcluded templates were not expanded. 161 non-character-audit payloads were metadata-verified with mechanic-span receipts, not counted as further semantic full reads.

**Read by search / bounded audit:** the synthesis author opened relevant payloads directly for the core-law checks in [SOURCE_LEDGER](SOURCE_LEDGER.md), and searched the note index by topic/revision for supporting claims and conflicts. The 230-article scope audit searched character mechanic headings but does not prove capture of every unheaded ability. The local framework and templates were read for applicable structure, not reproduced wholesale. No manga chapters, full anime, novels, fanfiction premise survey (M3), or material after 2023-12-24 was read for this pack.

## 2. Rules an engine has to model

Each rule and engine shape below is a **proposal** derived from a cited wiki claim.

| Rule | Evidence | Proposed engine shape |
|---|---|---|
| Mana reserve and ambient mana are separate. | Mana Method rev86194; Mana Zone rev94318 | Store personal reserve, local ambient availability and control independently. |
| Grimoires, spells and magic attributes are personal access, not interchangeable equipment slots. | Asta rev96080; Yuno rev96105; Grimoire Acceptance Ceremony rev89662 | Bind spell access to actor, grimoire and actual learned method; record origin. |
| Arrays trade complexity for setup and risk; a poor array can fail/explode; carved arrays may be reusable. | Rune array rev93898 | Array grammar, carrier, preparation, caster capacity, execution result and consumed/reusable flag. |
| Mana Method has eligibility thresholds; combat use and forming arrays have different stated stage floors. | Mana Method rev86194 | Gate array formation at Fifth Stage-or-below limitation; combat use at Third Stage-or-higher, plus personal power, instincts and reflexes. Avoid collapsing these into one rank check. |
| Ultimate Magic has a distinct prerequisite chain. | Ultimate Magic rev83638 | Track soul-origin knowledge, proximity to mana and high mana capacity; human path requires Mana Method and True Magic. |
| Anti Magic is a separate negating force and weapon behavior differs by sword. | Asta rev96080; Demon-Slayer Sword rev95749; Demon-Dweller Sword rev95908 | Separate fuel/source and targets from mana; per-weapon effect and physical-target fallback. |
| Ki, mana sensing, Mana Skin and Mana Zone are separate techniques. | Ki rev95847; Mana Skin rev96042; Mana Zone rev94318 | Distinct perception/control/defense fields. No universal “sense magic” stat. |
| Spirit host bonds and devil contracts are distinct relations. | Spirit Magic rev96046; Unite rev96045 | Track spirit bond, host, transfer/succession, access and availability separately from devil ritual/contract type, control and synchronized intent. |
| Spatial Mana Domination has three named counters. | Spatial Mana Domination rev95846 | Check equal magic power; being loved by mana with greater magic control; or a spatial mage's mastered Mana Zone. Preserve failure when none holds. |
| Soul Chain Deathmatch has trigger, binding, interruption and terminal conditions. | Soul Chain Deathmatch rev95746 | Require full-body array and chest-hit trigger; equalize combined magic, persist after exhaustion, end at unconsciousness; outside mage interference disrupts. |
| Rank and merit are not birth or power. | Clover Kingdom rev93261; Wizard King rev93541 | Track institution status, mission evidence, class prejudice and raw capability independently. |
| Recovery methods have distinct effects and limits. | William Vangeance rev95875; Twilight of Valhalla rev83402; Secre Swallowtail rev95890 | Typed heal/seal/death-delay effects with source-specific limitations, not one generic heal button. |

## 3. Full catalogue at a glance

**Proposal:** The pack covers grimoire/attribute magic, mana methods, spell arrays, Anti Magic, Ki, spirits, devils, institutions, dungeons, tools, healing and kingdom contexts. Detailed modules are indexed in [MODULE_CATALOGUE](MODULE_CATALOGUE.md) and [ABILITY_VARIANTS](ABILITY_VARIANTS.md).

| Family | Coverage | Neighbor / interaction | Conflict or limit |
|---|---|---|---|
| Attribute spells | Broad selected character/spell pages | Compound magic, team roles | Spell specifics are page-level; no exhaustive primary canon roster. |
| Rune systems | Rune array, Mana Method, Ultimate Magic | Ambient mana, preparation, training | Different gates; don't make one generic rune skill. |
| Anti Magic | Asta and named sword pages | Cancels magic, ally synergy, physical targeting | Negation is not universal damage; sword effects differ. |
| Spatial magic | Portal and domain pages | Travel, counters, rescue | Destination visibility/history, opposing mana and recovery can constrain. |
| Contracts | Spirit and devil pages | Host/body, allegiance, power form | Nacht Canis × Felis actor mismatch remains unresolved. |
| Institution | Kingdom, squad, Wizard King pages | Mission, salary, stars, rank | Merit does not erase class prejudice or guarantee promotion. |
| Healing | Selected healing/support abilities | Injury, duty, combat attention | Death, fatal wounds and activation timing vary by method. |
| Regions | Clover, Heart, Diamond, Spade, dungeons | Mana ecology, law, travel | Some page content is guidebook/anime/novel, not manga fact. |

## 4. Data model proposal

Propose records for `WorldDefinition`, `ContinuityDefinition`, `EraDefinition`, `RegionDefinition`, `EntryProfile`, `ScenarioDefinition`, `PowerPolicy` and `FailurePolicy` following the shared campaign framework. Within a world pack, author `ActorSource`, `Grimoire`, `MagicAttribute`, `SpellDefinition`, `RuneArray`, `ManaEnvironment`, `Technique`, `Contract`, `Equipment`, `InstitutionRole`, `Mission`, `KnowledgeRecord` and `Consequence` as data cards compiled to existing structured pack rows where a real consumer exists.

Each ability points to one source/revision, source attribution, eligibility conditions, required actors/resources, target set, preparation, effect, failure, cancellation, duration/recovery if stated, and what a character can know. Source law and authored balance are different fields. Store actor belief separately from author truth. Keep an explicit `sourceBoundary` at 2023-12-24; unseen later canon does not fill missing fields.

AU proposal: base pack plus named divergence patch with a new pack ID. A changed or randomized truth has an opaque sealed slot ID and discovery route; player-facing cards reveal only the route/status until discovered. The pack does not select a native save schema or world-instance adapter.

## 5. Turn rules into play

**Proposal:** use the existing world composition, pack, knowledge, job, item/source, relationship, time and persistence owners only after an implementer checks their live contracts. Do not invent hooks. A spell action should check the actor's source, grimoire, body, learned method, target, personal reserve, ambient mana, preparation, and interruption, then publish one owned consequence. A mission changes the issuing institution's record and actor-specific knowledge; it is not a second quest reward manager.

The proposed first data-to-play loop is small: grimoire result → practice or useful work → an observed receipt that persists. Later slices can add one method at a time: Ki reading, Mana Skin, arrays, natural mana, contracts and teamwork. Fixed enemies preserve their sourced threat. An incompatible imported ability stays unsupported/dormant until the real body/source/fuel/target conditions are present.

## 6. Living beside the protagonist

No M3 fan-fiction or premise survey ran. The following are **proposed source-derived start shapes**, not reports of fandom convention:

- New ceremony candidate at Hage, with a randomized ordinary attribute/grimoire only if authored ranges and secrecy are clear; a no-grimoire outcome remains playable.
- New Magic Knight candidate, civilian craft worker, Heart trainee, or dungeon expedition member, each with a coherent body, era, location, knowledge and means.
- Relationship AU as an isolated overlay can change an original character's relationship with the player only after actual meetings and witnessed memory. Do not quietly rewrite canon character history.
- Start-point AU can move the opening to a sourced ceremony, exam, mission or expedition without importing future knowledge.
- Changed-outcome AU is a separate continuity; any randomized truth is sealed with an S-ID and an in-world discovery route.

## 7. More to consider

- Make the page's class gradient visible through access and testimony, while a player's work can produce specific merit without erasing prejudice.
- Let ambient mana be a location resource that can be studied and observed, not a refill timer detached from place.
- Use arrays as readable preparation: simple work under pressure, complex work with time, and real risk when rushed.
- Keep Anti Magic's ally/target consequences explicit; a counter may also cancel a teammate's magic.
- Preserve social and utility magic. Healing, portals, sensing, restraints and transport can resolve jobs without maximizing damage.
- Keep public rumor, witness knowledge and author truth apart. Research memory does not become an NPC's knowledge.
- Develop canon event schedules only after a source-qualified timeline and actor knowledge ledger exist.

## 8. First playable slice proposal

Recommend [BC-START-01 Hage candidate](CAMPAIGN.md) and the two-fixture micro-slice in [IMPLEMENTATION_PACKET](IMPLEMENTATION_PACKET.md). Its visible outcome is a candidate with either a usable grimoire practice route or a useful no-grimoire work route. It avoids the expensive combat/instance/pact systems while checking origin, choice, resource ownership, discovery and durable receipt. This is a proposal; no implementation has begun.

## 9. Gaps that would change the design

1. **Primary authentication and selected source hierarchy:** direct manga reading or an approved authoritative edition could correct wiki wording, attribution or mechanics. This can change every law claim.
2. **Post-snapshot canon:** material after 2023-12-24 may add, retire or alter power rules, political state and timeline starts. It is an explicit gap, never memory-filled.
3. **Start source and character age/body rules:** the exact intended adaptation boundary for ordinary player starts changes available ceremony, recruitment and family/career routes.
4. **Nacht contract discrepancy and age:** reconcile Canis × Felis actors and the conflicting age reported for the twins' summoning incident from primary material before any composite contract or timeline use.
5. **Full magic-stage rules and progression rates:** the pack has thresholds for Mana Method but not a validated whole ladder. A deep source pass could materially change class/progression data.
6. **M3 premise survey:** not run; it could surface popular coexistence starts or pitfalls, but it must remain fan premise evidence rather than canon.
7. **Runtime seams and save compatibility:** not inspected for an authorized build, so whether cards compile without new storage or require migration is unknown.
8. **Recovery distinctions:** Grey's tissue reassembly (Grey rev95984), Flower Princess Utopia's fatal-wound healing (rev83647), and Aquenelle Lore's inability to heal fatal wounds (rev83687) have different outcomes. Preserve them in later healing design; they do not expand the first slice.
9. **Ki progression branch:** Zetten (rev95188) trades stored power and motion speed, with weaker split strikes; Tengentsu (rev95134) requires high initial magic and permanently gives it up. Consider this distinct branch outside the first slice.
10. **Spirit succession:** Spirit Magic rev96046 allows a spirit to leave, select another host, decline return after revival, or pass through a lineage; full use also requires grimoire spells. Resolve availability and succession before implementing spirit progression.

### Checklist status

- Core laws checked directly against local payloads with title/revision: yes, see SOURCE_LEDGER.
- Surprising claims/conflicts spot-checked: yes for the core conditions, corrections and named conflicts; unresolved items remain explicit.
- Reader artifacts: existing git-ignored notes/read ledger are linked in SOURCE_LEDGER; no reader prose/raw payload was copied into tracked files.
- Private/tracked boundary: new pack contains paraphrase and proposal only; no raw source or quote over 15 words.
- Search versus full read and blocked sources: full selected-page scope and the unexpanded template, primary manga, M3 and post-snapshot gaps are listed above. No new web fetch was attempted; source inputs were supplied locally.
