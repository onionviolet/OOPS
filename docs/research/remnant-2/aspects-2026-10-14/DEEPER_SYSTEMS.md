# Three deeper systems

These are bounded reads, not a whole-engine audit. All proposed YAIRPG work remains unselected.

## D1: visit selection versus campaign activation

B4's three base adventure wrappers contain RemnantQuestSubQuest filters pairing Story with their world tag. B3's campaign contains generic world slots and explicit connector/final-zone quest references. This supports a useful distinction between selected content and access to an already instantiated child.

The actual traced activation function tries World1, World2 and World3 in order. Its predicate gets the subquest and checks object validity. Branches skip failed candidates and the first successful branch opens a waypoint; all failed reaches a diagnostic. It does not roll a random candidate. The companion WorldBossDefeated function reads/writes a counter with SaveGame metadata and publishes a named variable through VariableComponent. Full boss-count closure, duplicate events and native selection internals remain unproved.

R2-P06, K4/K5/K12/K17/K18: pin a visit recipe and keep activation separate from generation. A new roll is not a changed revisit. P15/P16 cover identity and definition lifetime; the local new packet supplies mandatory and optional visit roles. It does not select unrestricted hot switching.

## D2: earned faculty versus active arrangement

B6's selected archetype definitions reference an engram, an archetype UI definition, a trait type and an unlock StatTable. Several definition samples have no logged read errors; unlock tables fail StatModTableEntry schema reads. BP_Archetype contains XP parameters, but the complete advancement equation was not traced. P1 independently states earned archetype access, independent progression and ordered dual selection.

The payoff is a persistent library of earned capabilities with an active configuration. These are separate from inventory and current resource supply. YAIRPG still needs per-world means and accepted OD2 portability; a universal class slot cap would be an unsupported transfer of source rules. R2-P03 extends P03/P09/P17 without replacing power owners.

## D3: an authored conversation changes state

B8 is an exported graph with distinct dialog, branch, item-condition, trigger, reward and remove-item types. Native predicates and incomplete objects prevent a whole-tree correctness claim. Available localization keys, text, IDs, references and conditions are retained privately with errors rather than flattened into prose summaries.

B9 shows why ambient speech should be a separate lane. A Silent default state and six states read context such as speaking, cinematic, health, combat and distance; event decorators emit bark requests. This selector needs no transaction semantics. A conversation that consumes goods or awards a result does. R2-P04 maps to P19/P24; R2-P05 maps to P21. The first useful YAIRPG adaptation should reuse its existing staged narrative host and persist any paid choice with native state.

For all three, no REA/native-chain run was justified: the immediate unresolved blocker is schema/selection coverage, not a demonstrated native method whose body is needed for an accepted gameplay decision. Do not use native disassembly as a substitute for fixing bad property mapping.
