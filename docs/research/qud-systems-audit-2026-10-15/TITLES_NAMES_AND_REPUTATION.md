# S2 Titles, names, achievements and faction status

The supplied source contains several different systems. It does not justify a universal title-to-power mechanism. This distinction matters for YAIR's separately accepted interest in titles that can grant power: Qud is a reference with specific mechanisms, not a constraint on that direction.

## S2a What exists

| Code | Mechanism and actual owner | Mechanical meaning / limit |
|---|---|---|
| T1 | Display titles/epithets in DescriptionBuilder; name grammars in Naming.xml | Builder titles are text clauses, sorted/assembled and cleared. This inspected display list is not a persistent power registry. Not every producer of an epithet was audited. |
| T2 | Proper item name, item naming opportunity counters and journal accomplishment | Naming can change presentation and record an event. Optional bestowal is a separate branch that can change the item. Renaming is not a guaranteed new power. |
| T3 | PlayerReputation.ReputationValues; transient modifiers are included when read | Numeric faction standing has real service-affordability and conversation consumers. Liked/loved language is not the same field as faction rank. |
| T4 | PlayerReputation.FactionRanks; NPC FactionRank.Ranks | Named rank with faction-defined ordering. The supplied faction data includes the Barathrumite rank ladder. Generic rank-gated dialogue and promotion delegates exist; no universal stat reward is established. |
| T5 | AchievementManager.State and AchievementInfo/StatInfo | Profile-level achievements, thresholds, distinct-child counters and platform/UI notification. The selected unlock path grants no skill/stat component. Whole-game absence of achievement rewards is not proven. |
| T6 | JournalAPI.Accomplishments and historic mural/gospel text | Persistent run records and alternate narrative representations. Their text is not proof that every described event was physically simulated. |

## S2b Closed reputation-to-teaching chain

`WaterRitualBegin` checks adjacency and liquid or formal-ritual choice. The informal path uses one dram; the formal option has different rules and abort behavior. `WaterRitual.EnteredElementEvent` performs first-contact work only when the speaker lacks WaterRitualed. PerformRitual marks it, adds a journal accomplishment, awards reputation through actual mutation methods, records achievement progress and can offer item naming. The speaker's WaterRitualRecord holds its faction, remaining service/secret stocks and seed. First-contact award and buying a lesson are separate operations.

`WaterRitualLearnSkill` reads a configured offer. The supplied frog-related faction entries explicitly offer Acrobatics_Jump. Current affordability uses `PlayerReputation.Get` and the prospective reputation-change event, rather than trusting an old displayed value. `UseReputation` modifies the faction reputation and the lesson adds the skill with speaker attribution. Jump's component supplies the real action traced in [S1](SKILLS_AND_PROFICIENCIES.md). A frog-class teacher additionally reaches a specific learning achievement through Jump's before-add hook. That achievement records the learning event; it is not the source of Jump's movement power.

Reputation can later fall through Modify or Set, or change effectively through modifiers. The current lesson-cost check can then refuse a later purchase. The inspected reputation decrease does not itself remove an already taught Jump component. An earned skill and continuing social access are therefore different retention policies.

`Reputation.Write/Read` explicitly retain numeric reputation, named ranks and worship/blasphemy tracking. `XRLGame` calls that serializer and rebuilds faction feelings after load. No real profile/save was opened. Mod hooks, save corruption and all downstream faction AI remain untested.

## S2c Named ranks and NPCs

The rank map is separate from reputation magnitude. `SetFactionRank`, `PromoteIfBelow`, `GetFactionStanding`, and comparisons use the faction's rank ordering. ConversationDelegates.IfAtLeastRank reaches `GameObject.IsAtLeastFactionRank`, which routes player comparisons through PlayerReputation and NPC comparisons through rank events. `FactionRank.PromoteIfBelow` supports NPC storage as a delimited rank map. The generic promotion delegate supplies a producer; the comparison supplies a real eligibility consumer.

This is a closed generic source path, not a verified named campaign promotion or a specific spawned NPC promotion. No matching authored promotion instance was established in the selected conversation tables. Demotion/removal, all campaign scripts, every privileged service and rank changes during an open conversation remain named gaps. Faction.GetRankText also has a config gate, spelled ShowFacitonRank in source. The presence of rank state alone does not prove it is visible in the inspected user's settings.

The reputation UI separately gets visible factions, numeric standings, feeling/rank/holy-place/preferred-secret explanation text, fuzzy search, expansion and sorting. Feeling text makes AI/welcome claims; this audit treats those lines as UI descriptions unless their corresponding gameplay consumer was independently traced. Trade-performance mapping is retained, but its final trade-price caller was not read.

## S2d Naming can have a real bestowal

`ItemNaming.NameItem` sets the proper name/color, tracks opportunities and adds a journal accomplishment. When CanBestow is allowed, `CheckBestowals` uses configured chance or an optional Sifrah outcome, object type and a tier derived from owner level. It can attempt basic/elemental relic bestowals, briefly unequipping and then trying to restore the same item. For a basic armor branch, RelicGenerator directly changes Armor fields such as DV/AV or attribute modifiers. Another retained path installs EquipStatBoost, whose Apply sets owned stat shifts and Unapply removes them. This establishes actual mechanical item modification under specific branches, not supernatural force inherent in any text label.

The routine checks object subtype, can fail to obtain a compatible bestowal and conditionally announces new qualities through inspection. The base item instance, attached parts and modifiers carry the result. No general revert-on-rename rule was found in these selected methods. Full opportunity triggers, arbitrary transfer to another actor, every elemental effect, all field serializers and native results remain open.

## S2e Achievement record chain

Representative `EquippedAchievement` listens to EquippedEvent, requires the player and proper equipment, calls SetAchievement and latches its own Triggered flag. AchievementInfo.Unlock sets Achieved/time, schedules saving and calls platform presentation or local notification. AchievementManager.Update sends Save to a task; Save writes synced Achievements.json under a lock. Load merges recognized achievements/stats into current definitions. StatInfo supports distinct-child aggregation and threshold achievements. [Complete declaration catalog](private/ACHIEVEMENTS.json) retains initializer expressions and exact text privately.

Unequipping does not revoke this achievement. A manager Reset exists, but it is a distinct explicit operation. Neither the selected equipment handler nor Unlock awards gameplay power. This is bounded evidence, not a claim that no campaign script can ever react to an unlocked achievement. Notifications, local file writes, platform synchronization and failure durability were not run.

## S2f Unread boundary

The exact supplied Naming/Factions/ChiliadFactions trees, achievement declarations and relevant source are retained. Full naming distributions, all legendary creature producers, all names/titles' consumers, platform implementations and campaign rank stories are not semantically reviewed. [Coverage ledger](private/REVIEW_LEDGER.json) distinguishes windows read from complete exported classes. [UI trace](UI_IMPLEMENTATION.md) keeps presentation evidence separate.

## Core source locators

The complete methods remain private. Line starts refer to this packet’s exports; the ledger limits each claim’s semantic scope.

| Complete source | Method line |
|---|---|
| [XRL.World.DescriptionBuilder.cs](private/source/XRL.World.DescriptionBuilder.cs) | 222 |
| [XRL.World.Capabilities.ItemNaming.cs](private/source/XRL.World.Capabilities.ItemNaming.cs) | 540 |
| [XRL.World.Capabilities.ItemNaming.cs](private/source/XRL.World.Capabilities.ItemNaming.cs) | 603 |
| [XRL.World.Reputation.cs](private/source/XRL.World.Reputation.cs) | 68 |
| [XRL.World.Conversations.Parts.WaterRitual.cs](private/source/XRL.World.Conversations.Parts.WaterRitual.cs) | 110 |
| [XRL.World.Conversations.ConversationDelegates.cs](private/source/XRL.World.Conversations.ConversationDelegates.cs) | 832 |
| [AchievementInfo.cs](private/source/AchievementInfo.cs) | 61 |
| [AchievementManager.cs](private/source/AchievementManager.cs) | 95 |
