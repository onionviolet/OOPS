# Dialogue, knowledge and discovery

B8 retains all 127 indexed `EventTree_*.uasset` attempts plus related speakers and lore records. Filename coverage is complete for that pattern; schema coverage is partial. The two passes contain many object errors, so serialized counts are not validated full graph sizes. Raw available line text, localization keys, IDs, references, conditions and effects stay in `extract/parsed6`, `extract/parsed7` and `extract/dialogue-reference.json` in the private work area.

SHOWN exported types include EventTreeNode_Dialog, DialogLine, Branch_DialogOption, HasItemCondition, QuestStateCondition, VariableStatementsCondition, EventTreeNode_ExecTrigger, EventTreeNode_QuestReward_C and EventTreeNode_RemoveItem_C. Graph nodes carry reference arrays; speakers are separate definitions. This is more than a list of voice files. Native condition evaluation and all branch ordering still need validation.

B9 is a different mechanism: six ActorState records sit under a Silent default state. Conditions read combat, speaking/cinematic tags, health, range, line of sight and elapsed state time; event decorators request context-specific barks. The selected state machine has no logged read error, but remains conditioned on unmatched public mappings. This supports P21's arbitration idea. It does not prove a general NPC planner, relationship simulation or autonomous daily life.

| Route label | Evidence retained privately | Public status |
|---|---|---|
| R2-S01 | Item-conditioned conversation branch families | Structure read; full hidden reward/route validation open |
| R2-S02 | Injectable quest and loot/reward definition families | Paths indexed; exact co-occurrence and acquisition rule unread |
| R2-S03 | Lore-item and quest-state-conditioned narrative families | Available text and graph fields retained; branch truth/closure partially decoded |

For YAIRPG K11/K23, preserve the distinction between a thing existing, being rolled, being witnessed, being learned, being owned and being usable. A metagame analyzer can know a roll without the character knowing it. T1 is useful author/debug research, not permission to show hidden content in the player UI. Route source discoveries through P04/P11; a useful transaction joins P19 and coherent persistence joins P24.

No YAIRPG secret truth was designed or unsealed. No source story or dialogue has been copied into public gameplay.
