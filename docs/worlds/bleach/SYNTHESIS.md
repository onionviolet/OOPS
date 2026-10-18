# Bleach world-pack synthesis

Status: **Develop/Research synthesis proposal r1, 2026-10-14.** This updates the 2026-10-03 pack from a dated secondary-wiki cross-check. It does not accept a new design, implement gameplay, settle unresolved canon, or claim a full manga audit.

## 1. Sources, labels and prior work

**Evidence labels.** `C` means bounded original manga/publisher evidence already recorded in the source ledger. `A` means bounded official anime corroboration. `W` means a secondary Bleach Wiki page and its dated revision, with the page's underlying citation media kept distinct. `I` is analysis. `O` is a YAIRPG proposal. `U` is unresolved. Every new gameplay/design row below is `O`; a `W` row is not silently promoted to manga canon.

**Earlier work.** The design baseline is the eight-owner pack in this folder, especially the [campaign](CAMPAIGN.md), [module catalogue](MODULE_CATALOGUE.md), [source ledger](SOURCE_LEDGER.md), [ability variants](ABILITY_VARIANTS.md), [interactions](INTERACTIONS.md), [GM prompt](GM_PROMPT.md), and [implementation packet](IMPLEMENTATION_PACKET.md). The prior [Bleach digest](../../research/power-systems/wiki-digests/DIGEST_bleach.md) records a 2026-10-10 failed live-wiki route and no revision; this work uses the separate archived-dump route and does not rewrite that historic result. [World-depth proposal rows BL1–BL33](../world-depth-2026-10-13/03_BLEACH_NARUTO_ELDEN_RING.md) and the shared [access/start options](../world-depth-2026-10-13/11_ACCESS_AND_STARTS.md) remain proposals. The [campaign framework](../CAMPAIGN_FRAMEWORK.md), [completion template](../templates/WORLD_COMPLETION_TEMPLATE.md), [sealed-secret rule](../WORLD_SECRETS_AND_DISCOVERY.md), and [canon-first priority](../../USER_VISION.md#world-depth-and-canon-first-world-priority-2026-10-13) govern composition and scope.

**Wiki materials read.** The frozen WikiTeam3 history snapshot `wiki-bleach.fandom.com-20231226` ends 2023-12-27. Shard A read retained manifest ordinals 1–731; shard B, 732–1462; shard C, 1463–2193. Their completion summaries report 2,193/2,193 selected payloads and 29,928,879 selected characters. Character pages sometimes contain selected mechanic-bearing spans, so this is full reading of the retained selections, not of every full article. Shard C additionally reports 35 named scope-repair payloads read (242,268 characters). Raw pages remain private. See the linked [shard A](../../research/power-systems/wiki-digests/full-dumps/workers/bleach-full/shard-a/SUMMARY.md), [shard B](../../research/power-systems/wiki-digests/full-dumps/workers/bleach-full/shard-b/SUMMARY.md), [shard C](../../research/power-systems/wiki-digests/full-dumps/workers/bleach-full/shard-c/SUMMARY.md), and [frozen manifest](../../research/power-systems/wiki-digests/full-dumps/bleach_SOURCES.json).

**This synthesis author's spot checks.** I searched and sampled private page payloads for the core law claims rather than reading the 29.9M-character corpus again. Direct excerpts checked: Zanpakutō rev. 582599 (Asauchi and owner/source relation); Quincy rev. 587658 and Reishi rev. 578098 (distinct source and spiritual material); Fullbringer rev. 584513; Hollow rev. 586583; Soul Society rev. 581045; plus selected Ichigo page rev. 587804. These are secondary pages whose embedded citations vary by manga, anime, character book and other sources. This check does not authenticate every embedded citation. Episode-note P1 audit reread the own payloads for every episode note in shards B and C and checked cross-page carryover; two unsupported transferred claims were excluded below and in the [ledger](SOURCE_LEDGER.md#cross-page-carryover-audit-p1).

**Visible source disagreement.** Rukia's Battle Commences! rev. 585357 gives two names for one Reiryoku-restoration event: Sōten Kisshun in the summary and Santen Kesshun in Anime Notes. The source ledger preserves both. Zanpakutō rev. 582599 itself distinguishes Shikai recovery conditions from broken-Bankai recovery and lists exceptions; this qualifies the broad regeneration wording rather than leaving an apparent contradiction. Exact primary exceptions remain open.

**Primary sources and M3.** The older ledger records bounded VIZ publisher summaries and official anime character/glossary/episode pages; it does not claim the original manga was read in full. No separate M3 fan-premise survey was run for this synthesis. The start/AU ideas listed below are drawn from existing local proposals, not reported as fan consensus.

## 2. Rules an engine would need to model

| Rule | Evidence | Proposed engine shape |
|---|---|---|
| Soul Reaper weapon/source is personal. | `W`, Zanpakutō rev. 582599 describes a spirit/source tied to its Shinigami owner and Asauchi as the common forged basis; `A`, ledger B2/B4/B5/B6. Exact original scenes remain BU1/BU2. | `O`: keep physical weapon/housing, actual personal source/bond, release state and learned technique as separate records. Ownership or repair of the housing does not grant a release. Exception leads must remain explicit: the cited wiki reports Zaraki made a dead Shinigami’s Asauchi his own outside the institution, unique Zanpakutō can be inherited with their abilities, and the Ise family’s inherited Shinken Hakkyōken prevents ordinary Asauchi imprinting. These are source-specific exceptions, not a universal transfer rule; BU1/BU2 primary scenes remain open. |
| Release development has individual gates and costs. | `A`, official glossary B5; `W`, Zanpakutō rev. 582599 and Ichigo Kurosaki rev. 587804. Ichigo's true Bankai function is specifically recorded as unknown. | `O`: source-qualified Shikai/Bankai states with distinct prerequisites, control, reserve, condition and knowledge. No universal ratio, timer, rarity tier or copied recipe. BU1 should inspect the reported Urahara device route: forced spirit materialization, three-day Bankai training, and a dangerous time bound, an exceptional and risky route rather than a general shortcut. |
| Power paths are not one ladder. | `W`, Quincy rev. 587658, Fullbringer rev. 584513, Hollow rev. 586583; `C`, VIZ vol.5 and vol.51 summaries (B11/B12). | `O`: separate eligibility, body/source, acquisition, fuel, methods, faction duties and failure rules for Soul Reaper, Quincy, Fullbring and Hollow/Arrancar profiles. Cross-source/hybrid profiles require an authored source and compatibility case. BU4 leads: Quincy power can be shared by exceptional routes; Hollow contact is described as poisonous to Quincy and Quincy strength depends on ambient Reishi. Fullbring accounts distinguish the manga-attributed parental Hollow attack origin from later novel-derived causation. Keep those causal layers separate and the novel outside default original-manga continuity. Also inspect Fullbring developmental claims: incomplete stages differ from realized function; the page notes a potentially damaging completion burst and another Fullbringer’s suppression role. These are secondary leads, not accepted career mechanics. |
| Spiritual matter and human perception are contextual. | `W`, Reishi rev. 578098 says Reishi composes spiritual bodies/worlds and is not normally perceptible to ordinary mortals; `W`, Races rev. 578082 aggregates several perception claims across media. | `O`: observer faculty, known signal, range, environment and evidence are explicit. A reported detection is knowledge for its recipients, not a new player faculty or omniscience. |
| Realm access is a body/material transition. | `W`, Soul Society rev. 581045 describes different routes for soul-form entry, human conversion and Hollow passage; `W`, Hueco Mundo rev. 586324 describes Garganta. Ledger B10–B14 retain bounded manga anchors but exact procedures remain open. The cited routes differ: Konsō sends wandering Pluses; the Senkaimon route for intruders is described as soul-form (anime-cited); Reishihenkanki converts solid matter to Reishi (official anime-cited); Hollow access/Garganta is separately described (anime-cited). Treat passage as route- and body-dependent, not a universal conversion law. | `O`: represent origin/destination, actor body, passage method, permissions, cargo compatibility, custody and return route separately. Do not treat realm labels as independent timelines or grant a new body. |
| Injury and restoration target different things. | `A`, ledger B6 distinguishes damaged Shikai from normally unrecovered destroyed Bankai; `W`, Zanpakutō rev. 582599 gives a broad blade-regeneration summary. The wiki itself limits ordinary Shikai regeneration to the wielder’s will/Reiatsu over time with the hilt intact, then says broken Bankai normally cannot return to its former state and lists exceptions: Komamura’s linked healing, Hitsugaya’s water-dependent regeneration, Mayuri’s remodeling, Nimaiya reforging and Orihime rejection. This does not establish a general recovery recipe; exact primary exceptions remain BU1/BU2. Episode 91 rev. 585341 does not state the imported Rukia/Keigo/child comparison. | `O`: body condition, ordinary blade condition, personal-source integrity and release function have separate owners and recovery rules. No generic healing or repair action crosses those boundaries. |
| Identity, soul and body can diverge. | `W`, Ichigo Kurosaki rev. 587804 describes his exceptional, event-specific power losses/restorations; Races rev. 578082 mixes manga and other-media artificial-soul claims. | `O`: actual actor identity, body, soul/source, occupied vessel, memory and learned methods remain independently owned. A pill/device/body shell cannot duplicate the source or authorize a second life. |
| `I/O` Information depends on who saw or reported it. | Existing [interaction owner](INTERACTIONS.md) and campaign; `W`, episode pages retain different speakers and page-specific events. Episode 91 rev. 585341 and episode 352 rev. 532357 received P1 correction. Other preserved conflicts include Rukia's Battle Commences! rev. 585357 (Sōten/Santen label) and Protect Ichigo! Nozomi's Determination rev. 530870 (treatment label). | `I/O`: store observation, speaker, medium, time, recipient and uncertainty. Cross-page comparisons become analyst inference with both pages named, never a fact attributed to one episode. |
| Medium and version boundaries matter. | `W`, Races rev. 578082 includes anime, film and other-media material; shard summaries preserve game, novel, guidebook and adaptation labels. | `O`: each evidence row carries continuity/media/version. Keep the original manga, anime filler, movies, novels and games distinct unless a scenario explicitly selects a combined continuity. |

## 3. Full catalog at a glance

The existing [module catalogue](MODULE_CATALOGUE.md) has eleven proposed families. This table is a coverage map, not a new rank ladder.

| Family | Coverage in existing pack | Neighbor/interaction | Remaining source or engine gap |
|---|---|---|---|
| `O` Spiritual body/capacity | perception/body qualification, sustained action and demanding capacity | sensing, contact, travel, combat | `U`: body conversion, reserve/recovery and terminal state |
| `O` Zanpakutō/source/release | unreleased source, Shikai, Bankai, relation and condition | weapon vs housing; release vs office | `U`: Asauchi/imprinting, names, exceptions and lasting-loss scenes |
| `O` Zanjutsu | guard, engagement and release integration | range, equipment and body | `U`: exact native combat consumers |
| `O` Hakuda | contact, restraint and advanced method | spiritual targeting and body compatibility | `U`: technique procedure/source conditions |
| `O` Hoho | footwork, reposition and individual specialist method | terrain, timing and control | `U`: named-method costs/limits |
| `O` Kidō | complete method, complementary method and specialist use | fuel, interruption, barrier/target | `U`: chant/control/targeting rules for selected spells |
| `O` Perception/control | observe, discriminate, test interference | reports, sensors and hidden knowledge | `U`: exact faculty/range/counter by source |
| `O` Spiritual devices | acquired tool, compatible housing and instrument project | source vs device; operator vs owner | `U`: manga-supported device recipes and interfaces |
| `O` Ordinary/spiritual craft | mundane housing through qualified materials and service | item custody and body/material interface | `U`: material compatibility and reproducible work |
| `O` Recovery/supply | ordinary care, sourced care and staffed service | bodily injury vs source damage | `U`: eligible patients, recovery effects and permanence |
| `O` Faction/workshop career | civilian, institutional and specialist access paths | office vs strength/source | `U`: admission, duty, role and era-specific availability |

`O` neighbors already named in the pack: trace reading vs qualified survey; weapon guard vs qualified defense; housing repair vs bodily care vs source-specific recovery; observation vs learning vs transfer. Reishi weapon use, Quincy control and Fullbring are separate world paths, not interchangeable upgrades. Wiki entries with mixed media, incomplete selected spans or malformed attribution stay visible in the ledger rather than being filled from memory.

## 4. Proposed data model

This is a design proposal, not a current schema.

```text
BleachDefinition(revision, continuity, era, region, scenario, sourceBoundary)
ActorIdentity(actorId, originHistory, currentKnowledge)
BodyState(bodyId, kind, realm, condition, compatibility)
SoulSource(sourceId, ownerActorId, sourceKind, lineageOrBond, integrity, provenance)
LearnedMethod(methodId, learnerActorId, teacher, prerequisites, proficiency)
PersonalRelease(sourceId, releaseStage, functionId, reserveRule, control, damageState)
Artifact(itemId, owner, holder, material, housing, condition, supportedInterface)
Observation(observer, targetSignal, range, time, medium, confidence, recipients)
Passage(actorBody, route, origin, destination, permission, cargo, returnCondition)
FactionRole(actor, institution, office, duties, access, eraValidity)
Consequence(claimId, cause, affectedActors, occurrence, discovery, resolution, aftermath)
```

`O`: keep state ownership singular. A `SoulSource` does not live inside a generic equipment bonus; `Artifact` custody does not imply source ownership; `Observation` does not confer `BodyState` faculty; `Passage` does not roll back a continuity. Freeze selected definitions/seed once a run starts. Save compatibility needs a later integrator decision; this research adds no persistence fields.

## 5. How rules could turn into play

| Proposed play loop | Existing YAIRPG seam | Evidence and missing binding |
|---|---|---|
| Street work funds shelter/records and has different outcomes from a qualified report. | Shared paid commands/jobs, participants, custody/claims and knowledge, as staged by [IMPLEMENTATION_PACKET](IMPLEMENTATION_PACKET.md). | `O`; existing local story only. Requires instance-local state, observer projection and atomic save publication. |
| A practitioner learns a technique or develops a personal release through eligible instruction and practice. | Existing power models, energy/resources, jobs and relationship/knowledge. | `O`; no source-specific eligibility/release binding exists in this design. Require exact manga evidence before calling one procedure canon. |
| Instrument work yields measured evidence while retaining actual sample/tool ownership. | Site projects, items, paid work, claims and reports. | `O`; source page Reishi rev. 578098 supports the broad material concept, not any generic sensor's range or function. |
| Realm trip preserves body/source/cargo and local consequences. | Expansion transitions, world domains and durable publication. | `O`; [campaign framework](../CAMPAIGN_FRAMEWORK.md) notes native independent instance/absence-clock gaps. This pack does not add an adapter. |
| Fixed danger can overwhelm an unqualified visitor; a genuinely sufficient compatible import can work. | Existing power/energy checks and nonlethal battle are partial seams. | `O`; general multi-actor spiritual combat, lethal outcomes and death/rebirth remain unimplemented/unselected. |

The old packet's opening routes remain the recommended smallest test: mundane repair/detour versus a paid bounded survey, different cost and observer knowledge, one shared delivery settlement, then a same-instance return/reload proof after native instance support. Setup or synthetic source checks alone would not demonstrate gameplay.

## 6. Starts, parallel versions and access proposals

No M3 fan survey ran. These are local authoring proposals from the world-depth files and existing pack; their source-fact underpinnings need individual verification before canon labels.

| Proposal | Proposed entry/use | Evidence boundary and access |
|---|---|---|
| `O` Living street / missing record | Keep the existing early Karakura-like street service opening with mundane work and optional qualified report. | Current brief/campaign. Canon-era details and any direct canon character must be source/era-gated. |
| `O` Lingering soul | A dangerous start with a fading Chain of Fate and decisions about ties, help or concealment. | BL18 in world-depth is general-knowledge proposal, not audited here; exact chain timing remains `U`. |
| `O` Rukongai gifted child / Academy student | A survival or training-life entry with actual household, food, age, institution and knowledge state. | BL19/BL20 proposals; verify original scenes and selected era before character casting. |
| `O` Low Hollow | A nonhuman ecology start with its own body/source, sustenance and risk. | BL23 proposal; requires body/identity mechanics, not a reskin of a Soul Reaper profile. |
| `O` No transfer night | Public branch where the source event differs and town service changes. | BL25 public divergence proposal; branch receives its own committed continuity. |
| `O` Quincy guilds remain public | Public-history AU with consequences to Hollow handling and institutions. | BL24 proposal; historical premise needs source verification. Methods/lineage do not cross from another copy. |
| `O` Shop never opened | Supply/technical access changes while local institutions remain causal. | BL26 proposal; treat canonical Urahara's availability and local copy as actual state. |
| `O` Parallel/copy access | Select a compatible start at new game or later through an authorized door; retain committed instance and knowledge provenance. | Follow access/start contract; no reroll on preview/revisit. Never use a canon event as a live rewind. |
| Sealed slot `BL27` | Retain only the ID, discovery route and status. | Route: Jun's ledger comparison plus Nao's report, checked against BL4 memory-edit evidence. Status: not authored. Truth remains sealed. |

## 7. More to consider

1. `O`: A world card should show three different indicators: what this actor can perceive, what tools can detect, and what evidence another person reported. Collapsing these recreates omniscience through UI.
2. `O`: Institution and office should grant duties/access only where a specific era, person and witness supports it. A captain label is not the same state as Bankai, mastery or available reserve.
3. `O`: An ability interaction needs explicit target domain: physical, spiritual, body, soul, memory, object or realm. Use strongest valid source/counter evidence, not automatic narrative balancing.
4. `O`: Build AU overlays from a base pack plus one declared divergence; record only consequences actually changed by that divergence. Do not multiply every era by every role.
5. `O`: Keep franchise-public revelations public, but any changed or randomized truth sealed behind an opaque slot and discovery route. Only `BL27` is referenced here, without its truth.
6. `O`: Source summaries often flatten dialogue, citation media and page coverage. A future canon event needs a primary locator and a separate occurrence/revelation/actor-belief record before it becomes an executable plot.

## 8. First playable slice proposal

**`O` Street record: ordinary route vs qualified report.** Keep the current scope to one living-world street and one prestige-free local arc. On desktop/laptop, the visible outcome is a clear shelter/parcel situation with three options: pay for ordinary repair and detour; commission Nao's bounded survey if she, her source and reserve are available; or decline and let the shelter fund the slower service. Both accepted routes settle the same manifest once, with distinct stock/time/fuel and observer knowledge. No Hollow fight, Bankai, spiritual travel or AU selector is required for this slice.

Prerequisites: one authoritative local instance/clock/save binding; actual actor/site/cargo custody; a qualified survey definition; observer-scoped report; unique settlement claim; atomic persistence. Acceptance later requires a rebuilt fresh-origin desktop browser run through each route and decline, then save/reload/import at the reached states. Until that future authorized implementation and playtest, this remains a proposal and all gates remain open. This small slice preserves the existing pack's one-realm/one-prestige first milestone.

## 9. Gaps that would change the design

| Gap | Why the result could change the pack | Next source/check |
|---|---|---|
| `U` Primary manga procedures for Asauchi, Shikai/Bankai, repair and exceptions | Could change release eligibility, permanent loss and acceptable training loop. | Inspect original chapters around vols.13–19 and later Nimaiya/reforging scenes; keep BU1/BU2 active. |
| `U` Exact Quincy lineage, gathering, source/body and counter rules | Could change available candidate starts, environmental fuel and cross-source compatibility. | Inspect selected original manga scenes; wiki Quincy rev. 587658 is mixed-source and secondary. |
| `U` Fullbring origin/object bond and transfer limitations | Could change eligibility and whether an artifact affects the actor's technique. | Inspect source scenes; do not derive a universal recipe from Fullbringer rev. 584513. |
| `U` Hollow/Arrancar identity, evolution, sustenance and reversal | Could change nonhuman starts, persistence and death policy. | Inspect primary scenes; Hollow rev. 586583 is a broad mixed-source summary. |
| `U` Body conversion, artificial souls, passage, death and return | Could change instance model, cargo, companion/body ownership and prestige boundaries. | Inspect specific primary scenes. Secondary Soul Society rev. 581045 is not a complete travel specification. |
| `U` Canon start point, event intervals and cast status | Could change legal starting combinations and canon participation. | Reconcile each proposed era/start with original volumes and accepted source versions. |
| `U` Wiki completeness and contradictions | The dump is 2023-12-27, selected scopes can omit page portions, and some citations/media conflict. | Resolve only design-relevant cases against primary work; do not globally harmonize the wiki. |
| `U` Fan premises and AU usage | Could change the most useful protagonist-adjacent openings and recognition mechanics. | Run a bounded M3 survey only if a later design decision needs it; no fan consensus is claimed here. |
| `U` Native implementation and save compatibility | Could change the order/cost of the first slice and whether the current state model can carry it. | Integrator review of the exact state/effect owners, migration decision, rebuilt desktop browser and persistence proof. |

No source gap blocks the current research synthesis. Each unresolved point stays visible and changes design only after evidence and a separate accepted decision.
