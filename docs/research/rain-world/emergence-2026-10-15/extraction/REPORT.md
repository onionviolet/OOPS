# Rain World emergence extraction, 2026-10-15

Research-only static decompilation. The live Steam manifest reports app312520, build22785462. Its managed assembly is readable directly with ILSpy. No native executable or game was run, and no game file, save, account, configuration or runtime YAIRPG source was changed. Findings describe this build's code, including optional DLC/mod-manager branches whose current activation was not inspected.

## Provenance and scope

Input: `/Users/weiwei/Library/Application Support/Steam/steamapps/common/Rain World/RainWorld_Data/Managed/Assembly-CSharp.dll`.

SHA256: `b6be1d4e18ce219d21091b51564cb6a11c1e4106b41de903eb8e58849cb16fdb`.

Full raw source: `/Users/weiwei/.codex/research/rain-world-emergence-2026-10-15/extract/`. Complete command, return code, source hash, byte/line count and semantic reading status for each type: [SOURCE_INDEX.json](SOURCE_INDEX.json). The assembly inventory contains3295 class entries including nested types. This pass captured30 full outer classes, not the whole game. Three class bodies were read in full; eleven additional classes have named reviewed windows. Sixteen complete captures remain semantically unread in this extraction lane. A sibling auditor has an independent reading ledger; their work does not silently change this lane's coverage.

No prior Rain World source corpus was found under `docs/research/` or the existing `~/.codex/research/` workspaces. No earlier hash equality is claimed. Existing independent Qud and Dwarf Fortress workers were seen; their paths were left untouched. Native Ghidra work is unnecessary for these managed consumers.

## Five connected code chains

Locators below are exact local source filenames and one-based line windows beneath the private source root. They are deliberately paraphrased. Full classes remain available for later rereading.

### RWX1. Perception becomes uncertain memory, then target competition

`Tracker.cs:32-168` distinguishes actual visual contact, elapsed ticks, the last seen coordinate, and estimated probability of finding the target. Visual contact is forced false if the target is no longer realized in the observer's realized room, or is a hidden Player with visibility bonus at most-1. `TicksSinceSeen` subtracts the configured see-around-corners allowance. After that allowance expires, Update samples target body chunks through the AI's visual-contact predicate. A successful observation records the current coordinate and zeroes the forgetting counter. HeardThisCreature reduces a stale tick count; it does not set exact visual contact.

A missing target is not replaced with a live exact position. The simple representation returns lastSeenCoord; elaborate representations also have ghost hypotheses. Their full movement algorithm remains unread here. `EstimatedChanceOfFinding` combines elapsed ticks and lowest available ghost generation, using a bounded logistic branch below its internal threshold and a reciprocal tail above it. It is a heuristic confidence, not a simulated sensory probability proof.

`PreyTracker.cs:103-158` multiplies dynamic relationship intensity by path accessibility, ability to return, prey reachability, estimated finding chance, room attraction and ghost-age terms, then divides by a distance-derived term. The code also changes interest in another creature's catch by ancestor relationship and optional configuration. A Watcher muddy-body branch adjusts this score from mud saturation and age; its denominator can differ substantially from the baseline. Treat this as version-specific code, not a universal ecological law.

`PreyTracker.cs:283-320` resets each tracked prey's forget counter, adds a persistence bias to the current target, chooses the highest score, removes representations already marked for deletion, and accumulates frustration when same-room prey cannot be reached. Frustration rises by0.0125 per update and falls four times faster otherwise. Thus the shared Tracker timeout is not an independent universal target lifetime: owning modules can keep representations alive.

`LizardAI.cs:735-742` can turn Hunt into Frustrated above0.75 frustration subject to species, distance, confidence and room conditions. `LizardAI.cs:828-838` routes a Hunt toward AggressiveBehavior rather than declaring an automatic hit. The physical end of the chain is gated again by `Lizard.cs:1064-1112`: empty grasp, consciousness, jaw readiness, bite chance, actual body-chunk distance and tongue state precede Bite. `Lizard.cs:1165-1254` then checks room-entry invulnerability, tries an actual grasp, and conditionally calls Violence with separate player and creature damage branches. An AI-selected victim is not a guaranteed capture or kill.

**Emergence supported by these consumers:** targets can stay attractive after losing sight, be abandoned because of accessibility or a better target, or attract competing hunters through interest-in-catches rules. A gameplay example of a resulting chase was not observed.

### RWX2. Worn equipment changes a remembered relationship and reroutes behavior

`LizardAI.cs:1372-1487` computes the dynamic relationship, rather than relying only on the species template. For a tracked Slugcat, spear/mask state is refreshed when visual contact exists and the target is realized. The remembered state can therefore outlast the observation. A vulture mask can produce Afraid or Ignores for eligible lizard species; red/black exclusions, the green-lizard nonking exception, mask type and a habituation counter change the result. Thresholds are700 for a normal mask and1200 for a king mask. `usedToVultureMask` increments while the remembered mask state is positive and the relevant branch runs. Do not label this strictly 'seconds wearing a visible mask': this method does not recheck visual contact inside the habituation branch.

`RelationshipTracker.cs:27-46` recomputes the relationship through the owning AI, changes modules if the relationship type changes, and updates representation priority from intensity and module weight. `RelationshipTracker.cs:326-387` removes a creature from its former prey/threat/aggression module, temporarily suppresses abandonment propagation, and adds it to its new owner. A relationship-type change is therefore a transfer of concrete consumer responsibility.

`ThreatTracker.cs:34-80` derives current threat from remembered findability and relationship severity. A threat in another connected room is represented at the relevant local shortcut at half intensity. Threat utility feeds the weighted comparer and can produce Flee in `LizardAI.cs:683-695`, leading to an actual flee destination in lines797-822. This composes observed equipment, memory, habituation, relationship sorting, spatial danger and action selection.

**Cleanup limit:** `ThreatCreature.Destroy(bool stopTracking)` does not branch on its parameter. It always notifies RelationshipTracker and removes its threat point and wrapper. Correct transfer relies on `ignoreModuleAbandon`, not the parameter name. RelationshipTracker destroys the shared representation when an owning module abandons it outside the suppression window. An independent auditor first flagged this trap; the source was then inspected here.

### RWX3. Rain pressure competes with hunger, injury and friendship

`RainTracker.cs` returns an urgency curve, not a direct movement order. Story sessions use time-until-rain bounds800..4000 ticks; other sessions use80..400. The S-curve shapes differ. Night creatures and ignoreCycle creatures normally return0, but an earlier Scavenger locust branch can return1 when a swarm has progressed and no held PuffBall exists. Optional corruption, deer-rider and precycle branches also alter urgency. It is wrong to summarize this as all NPCs fleeing on one global timer.

`UtilityComparer.cs` computes `pow(module.Utility(), exponent) * weight`, optionally smooths it, and selects the largest score. The stored continuationBonus field is not used by this class's comparison Update. Consequently it is not evidence of a working hysteresis bonus. Modules and owning AI may implement persistence elsewhere.

`LizardAI.cs:620-651` assembles den, rain, prey, threat, aggression, utility, mission, relationship, stuck and friend modules. Initial example weights include prey0.6, rain0.9 and threat1. At lines779-790, aggression weight is scaled by health, threat relaxation depends on recent distress, and rain weight becomes0.9 or0.1 according to FriendTracker.CareAboutRain. `DetermineBehavior` can override the winner: held edible prey selects ReturnPrey unless fleeing; stranded return/escape selects Frustrated; low utility can select travel.

`LizardAI.cs:961-988` maps EscapeRain, ReturnPrey and Injured to a discovered den destination when available, with different speed updates. `AbstractCreature.cs:879-917` decides whether an actual opportunity to enter a den is accepted. doesNotUseDens blocks the route. End-of-cycle desire can set remainInDenCounter=-1; food stowing or precycle routes set finite counters. `AbstractCreature.cs:1023-1067` supplies further stay-in-den tests, including death, health below0.6, rain timing, night/ignore-cycle, challenge and species exceptions.

**Ordering limit:** `LizardAI.Update` calls `base.Update()` at its end, line1159. `ArtificialIntelligence.cs:245-250` updates modules in insertion order. The comparer precedes RelationshipTracker in the constructor. Decision selection is therefore not a same-instant atomic perception→relationship→utility computation. Modifying the design to do all stages synchronously would change behavior.

### RWX4. Offering food creates a temporary ownership event, then lasting social bias

`SocialEventRecognizer.cs:31-112` creates an OwnedItemOnGround with an owner, item, optional receiver, age and active flag. A Slugcat moving more than50 world units away from the item can trigger offering. `ItemOffered`, lines197-231, rejects previously stolen property for Slugcat gifts and searches eligible living realized AI observers within an initially500-unit radius. The observer must already track the giver with TicksSinceSeen below120. Closest eligible observer wins. It is not a global gift broadcast to every NPC.

An ownership record expires after `(receiver?30:10) * (living creature item?20:40)` updates, or becomes inactive when grabbed or the owner leaves the room. A grab by the offered receiver emits ItemTransaction and may call its FriendTracker.GiftRecieved while the record still exists. `FriendTracker.cs:112-131` separately recognizes grasped offered items and clears inactive offers. GiftRecieved clears its own pointer after notifying the AI. Ownership list removal is deferred to its update loop.

`LizardAI.cs:1878-1910` changes persistent like and temporary like for the concrete owner ID. Rot-state lizards return early. When existing persistent like is greater than-0.9, dead creature gifts add1.2/tamingDifficulty persistent and1.7/tamingDifficulty temporary like, versus0.6 and0.9 for the other branch. Challenge settings can substitute a divisor. These deltas still pass through SocialMemory clamps and familiarity scaling. A player gift also influences community liking, even when the personal-like threshold branch does not run.

`FriendTracker.cs:137-156` only picks a nearby realized friend whose persistent and temporary like both exceed0.5. This is a conjunction of two state layers. A later zero Urgency clears the friend pointer and relationship pointer. It does not by itself erase the saved relationship.

`SocialMemory.cs` clamps like/fear/temp channels to[-1,1]. Persistent like and fear changes are scaled by `lerp(1,0.1,know)`. Temporary channels settle toward their persistent values. LizardAI performs this settling at0.0005 per update. Serialization writes subject ID, persistent like/fear/know and preserved unknown tokens, omitting temporary channels. Load seeds tempLike/tempFear from the saved baselines. `CycleTick` decays weak values and deletes relationships when both absolute like and fear are below0.25, regardless of know. `CreatureState.cs:53-55` serializes social memory only when alive; lines171-175 forward its own CycleTick into SocialMemory. Higher-level save scheduling was not traced here.

**Emergence supported:** an observed material gift, recent familiarity, personal disposition, community attitude, temporary emotion and persistent memory jointly change subsequent prey/friend decisions. 'Gift means permanently tamed' is not supported.

### RWX5. A successful hunt enters a den and crosses simulation representations

Hunt→Bite→Grab is only the front of the lifecycle. When carrying a Creature with Eats relationship, `LizardAI.DetermineBehavior` chooses ReturnPrey unless currently fleeing. The den destination is requested; reachability and actual entry remain separate.

`AbstractCreature.cs:918-990` handles a CreatureGripStick carried into a den. It asks the predator's PreyTracker to forget the carried creature, invokes death on the abstract prey and any realized prey, then drops it when the abstract AI's item policy permits. Optional challenge and cooperative-player consequences have additional branches. The method kills captured prey at den entry; no animation or nutritional model needs to be inferred to explain that specific state change.

`AbstractCreature.cs:749-859` distinguishes destroyOnAbstraction, unavailable realized-room state, and normal abstraction. The destruction branch clears the realized reference and RealAI, removes the entity and destroys it. The early absent/not-ready branch merely clears realizedCreature and returns. The normal route calls the realized creature's Abstractize, derives an abstract node/path, converts held objects, preserves or computes a path, clears RealAI only within the AI+nonnull-pathfinder branch, then clears realizedCreature. It is therefore false to claim every abstraction always fully discards AI state by the same path.

The optional MMF grasp traversal explicitly detects two-object circular grasps and self-grasps before recursively abstracting held objects, releasing offending grasps to prevent infinite recursion. This is a concrete lifecycle limit arising from combining independently valid object relations.

**Open:** full abstract offscreen movement scheduling, SaveState/CreatureState roundtrip caller order, non-MMF circular-grasp behavior, unusual missing-pathfinder cleanup and pathological relationship transfer reentrancy remain unresolved. These are static research gaps, not observed bugs.

## Reusable research flow

1. Inventory the live install without launching it. Pin manifest/build and SHA256 of the actual code input; avoid copying account-specific manifest fields into reports.
2. Check earlier capture hashes and live workers. Reuse exact matches; reserve a unique writable evidence area before extraction.
3. List types first, then decompile full selected outer classes plus their actual consumers, owner state and cleanup code. Keep raw output private and record exact commands, exit status and source hashes.
4. Trace rule→observation/state→arbitration→action→world mutation. Follow the reverse lifecycle as carefully: timeout, transfer, death, room change, abstraction, load and ownership removal.
5. Preserve three inventories: uncaptured types, captured but unread, and reviewed with exact windows/full-class status. Validate hashes and links; leave gameplay/native observation as a separate gate. Independent audit checks consumer semantics and failure order rather than equating capture volume with understanding.

This is a reusable workflow saved for future reference. It selects no YAIRPG feature or implementation priority. Proposed uses belong to the parent synthesis/audit, while current one-realm/one-prestige and research-only scope remain in force.

## Remaining extraction and reading

The exact captured-unread list and selected-window list are in SOURCE_INDEX. The raw UNEXTRACTED_TYPES inventory preserves all other class entries, including nested names; nested classes inside a captured outer file can already be present in that file and are not necessarily missing code. It is a type-list complement, not a deduplicated uncaptured-code count.

Highest payoff next consumers: LizardPather/PathFinder for action reachability, Creature.Violence and Creature.Grasp for terminal damage/release, CreatureState/HealthState plus save owners for persistence scheduling, FloatTweener for smoothing, and AbstractCreatureAI/RainCycle for full offscreen scheduling. Existing captured ScavengerAI, Room and World remain unread here rather than being implicitly covered by the lizard chain.
