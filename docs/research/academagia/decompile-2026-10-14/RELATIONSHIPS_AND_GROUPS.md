# Relationships, clubs and factions

Evidence labels: **shown** for code/data, **inferred** for fit. Paths refer to the extract root in TOOLING.md. No relationship or group behavior was played.

## G1. Pair relationships

`GameLogic.dll/Academagia.GameSystems/RelationshipSystem.cs` uses one pair Relationship object referenced by both actors. Default bounds are -10 and +10. Same-college actors start at +1; other pairs at zero. High means ≥5; Low means ≤-5. Increase/Expand/Set routes differ: temporary change, permanent change and absolute setting should not be treated as equivalent.

Character relationships have changeable min/max statistics. Instructor-related bounds and values are explicitly clamped to -10..10 in these methods. The wiki's +12 exception is not a global cap shown by this system; it needs the specific authored effect. A favor can spend the relationship: `FavorSystem.ObtainRewards` finds the instructor's table column for the relationship level, uniformly picks one effect, and resets relationship to zero only when a non-null reward was found. Other favor routes can cancel a duel or inflict a reprimand.

## G2. Clique membership and numeric costs

The Befriend content action is a Type3 contested roll, with Charm and the Befriend parent skill on both sides. `CliqueSystem.AddFriendship` refuses to merge two existing cliques. If both actors are ungrouped it creates one; the initiating actor, higher Charm or a 50% tie choice supplies the name.

When adding a member, the roll's initiator power receives:

**sum over existing members other than the inviter of min(0, newcomer relationship to member - 5)**.

Thus a neutral pair gives -5, a +3 pair gives -2 and ≥5 gives no malus. This is a concrete cost of joining a large group, beyond a general warning about balance. Groups with fewer than two members dissolve.

Each student has a BaseCliqueAbility. Active abilities join the clique ability set; automatic abilities attach persistent conditions to members. Removal uses conditions tied to membership. `GetPatrolSkillMalus` is disabled during infighting. Adventure checks can take the group's best relevant skill; daily random events cannot. Those are distinct numeric hooks, not just a friend list.

## G3. Infighting and factions

`CliqueInfighting` tracks negative pair relationships and requires unresolved trouble across consecutive daily updates before escalation. It preserves the previous/current flags and pair keys in saves. This provides a repair interval, not an instant split on one bad interaction.

`CliqueSystem.UpdateInfighting` starts from a lowest-relationship pair, creates two camps and places others in a neutral pool. It lowers the initial pair by one. Neutral characters join based on relationship totals to each camp, with random ties. Joining raises relations to the chosen camp by one and lowers relations to the other by one. Player choices can pick a side. Split occurs when no neutrals remain, or the lowest pair reaches ≤-5 while neutrals remain; the latter can produce a third neutral clique. If trouble is repaired the infighting state clears.

These factions are temporary clique partitions, not an independent nation-level Faction entity. The content registry has College and Clique types but no Club or Faction type. There are seven Colleges, with classes, instructors, rivals, visitation rights and merit effects. The same broad institution should not be flattened into the clique pair ledger.

## G4. Authored clubs

Club stories are authored Adventure graphs, actions, abilities, lore and prerequisite/effect records. No universal membership-level formula appeared in the inspected engine. For example, the `Bookworms Club 01` root has a numeric prerequisite comparator ≥ with value 2 and a selection path referencing Research and Library Knowledge. Its exact path semantics and all downstream membership/reward gates remain unread. The presence of the record does not prove the whole club is reachable.

The patch profiles add many club stage records. A YAIRPG club could combine membership facts, scheduled practice, reputation and techniques, but this is a proposal. Do not transplant one Academagia club's numbers as a universal formula.

## G5. Institution rewards and other hooks

Merit records have prerequisites, reward ability lists and counts. The base's prerequisite values include 20, 40, 70, 100, then many higher thresholds through 900. This extends the web lane's 450+ summary; it is not proof of a simple monotonic ladder for every college. The per-college selections remain unread.

Chance-of-success/failure can come from actor, college, clique, class, skill and actor-skill statistics. Some paths independently test each chance; the estimator takes maxima. Do not add all such percentages together. Visitation rights can come from items, classes, college and clique, then join direct character rights.

Relationships also feed blackmail: when available, the bonus combines initiator Insight and Charm, subtracts the target's higher Insight/Charm, adds Insight for extra blackmail records and floors the bonus at one. Using it costs one relationship level. NPC willingness has a personality chance and a relationship ≤4 gate. The school social model therefore has information and institutional routes as well as friendship.
