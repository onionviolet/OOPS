# Prompt: conceptual abilities and the engine (audit brief, 2026-10-27)

Status: a brief for a research-and-design session, docs only. Proposals, not accepted.
Request: Weibao asked how to add seeding more inherently, how to save generated things,
and for a prompt to audit hard-to-grasp conceptual attacks and abilities (for example
"having one's name erased erases certain things") and their engine implications, with more to consider
([record](../USER_VISION.md#conceptual-abilities-and-inherent-seeding-request-record-2026-10-27)).
Builds on [time travel and seeded worlds](TIME_TRAVEL_AND_SEEDED_WORLDS_2026-10-27.md) Parts C and D.

## The brief (paste into a fresh session)

Task: research-and-design pass, docs only (no src/, no index.html). Deliver
`docs/research/CONCEPTUAL_ABILITIES_ENGINE_AUDIT_2026-10-27.md`. Follow WPR1-WPR32, AR1-AR16, MR1-MR36, AD22, AD38 (things work by how
they work), WA5 (engine owns verbs, worlds own nouns), and the sealed-secrets rule. Label claims [S] sourced, [U] unverified memory, [I] inference.
Commit only your own paths from a fresh HEAD; no push, stash, reset, force or Co-Authored-By. Never state any world's sealed truths.

Goal: decide how the engine represents *conceptual* effects (name, fate, memory, record, causality, concept, rule, distance, luck, existence)
so a world can author them without engine special cases, and so they compose with seeded worlds and time travel.

Part A, repo reality (grep and read selectively):
1. Where identity lives today: names, ids, chronicle (`chronicle.js`), relationships, `npc_lives.js`, `generated_people.js`, facts/`factsFor`, knowledge/journal, grave records, carry ledger rows.
2. Where effects live: `active_effects.js`, cheat mechanisms (`cheat_mechanisms.js`), storylet outcomes (`lore_history_state.js`), world events, status/combat code, any existing "erase", "forget", "curse", "seal", "fate" or "name" mechanics in worlds (LOTM Sequence abilities, HP, Proto23, Village, YAIR). Search docs for existing conceptual-ability notes before writing new ones (`docs/worlds/`, TIMELINES_AND_DIVERGENCE, cheat library).
3. Which state is a pure derivation (seeded base) versus saved delta (see Part D of the time travel report), and where an effect would have to attach.
4. Cite file and line locators; list which facts are read by many consumers (the blast radius of erasing one).

Part B, sourced research (cite links): how other games and fiction implement concept-level powers and what they cost. Include at least: Fullmetal-style true-name or alchemical identity, Earthsea true names, Naruto-like or Jujutsu-like concept techniques, Bleach/JoJo ability rules (Gold Experience Requiem, King Crimson skipped time), Toaru/Index-style authority, Fate/Type-Moon concepts and "erasure from the Root", Mushishi-style folklore rules, Dwarf Fortress/Caves of Qud memory and name systems, Disco Elysium thoughts, Pillars of Eternity/Planescape Torment names and mortality, Hades/Undertale knowledge of resets, Hollow Knight/Dark Souls "unkindled" erasure, Outer Wilds knowledge-only, Crusader Kings or Dwarf Fortress "forgotten history", Rimworld "psychic" abilities, Magic: The Gathering "exile / can't be the target / lose all abilities" layer system (the rules for applying and ordering effects), Dominions/Paradox "removal from history". For each: what the effect targets (the thing, the name, the record, the memory, the idea), what it leaves behind (traces), reversibility, how contradictions are handled, how it is limited (cost, range, resistance), and how the game keeps the rules checkable.
Also cover narrative patterns: retroactive vs prospective erasure; erasure with residue (people feel a gap); who remembers (the target, the wielder, observers, the world); "the name is the handle" ideas in web novels and tabletop (Ars Magica, Mage: the Ascension).

Part C, proposals (default, dial, reason; limits as adjectives; no either/or open questions):
1. **A channel model.** One entity has separable channels: *existence/body, name/reference, record (chronicle, graves, documents), memory (who knows), effects (what it causes), relations (bonds), and claim (ownership/duty/debt)*. A conceptual ability is an operation on one or more channels with a scope (who perceives it), a timing (prospective, retroactive-with-residue, or retroactive-total), a duration, a cost and a reversal. Show how "erase a name" becomes: mask the reference channel, leave body and effects, optionally propagate to records and memories by authored dials, leave a residue fact ("a gap where someone was").
2. **Seeded-base compatibility.** The entity still exists in the regenerable base; the ability is a logged delta (a *mask*, *rewrite* or *seal*), so revisiting, rewinding and branching treat it like any other delta, and un-erasing is removing the delta. State what a rewind restores and what carries (carry ledger).
3. **Resolution order.** A layered effect system (like MTG layers or a rules stack): base, then authored rewrites, then masks, then ability effects, with a stated order and conflict rule, so two conceptual effects on one thing are deterministic and testable.
4. **Observer model.** Per-viewer truth: what the world knows, what a character knows, what the player is shown (AR8 observer-safe projections). An erased name should not crash UI: every consumer reads a resolved reference with a fallback ("someone", residue text).
5. **Per-ability cards.** For 8 to 12 representative abilities across the five worlds (a name erased, a debt forgiven by fate, a death undone, a place forgotten, a skill borrowed, a luck swap, an oath binding, a distance folded, a record rewritten, a concept denied), fill a card: target channel, scope, timing, cost, residue, reversibility, resistance, seeded-base interaction, tests. Mark which need no new engine verb.
6. **Engine implications** with owner AR codes: reference resolution service (one authority for "how is X named/known"), delta kinds (mask, rewrite, seal, swap, bind), save slice additions (additive), validation (no dangling references, no orphaned bonds), projections, headless test hooks, cost, and what Import does. Ordered engine changes (smallest first) with level, effort, done check.
7. **Interactions** with time travel (do masks survive a rewind; do regressors remember), heirs and continuation, clocks, the return note, frozen worlds, and exploit limits as adjectives (AD22).
8. **Inherent seeding.** Propose the one-call generator API that makes seeding unavoidable for new content: `generated(kind, key)` returns `{entityId, value}` from the keyed draw, registers its `genVersion`, and refuses cursor draws for ambient kinds; saves store only the key plus deltas, except entities that diverged (recruited, renamed, transformed) which become saved entities with an `origin` key. List which existing generators migrate first and how `check:arch` enforces it.

End with a more-to-consider round (ACT NOW / ACCOUNT FOR NOW / LATER with level, effort, done check) and the top three recommendations.
Append a verbatim request record to `docs/USER_VISION.md` and one pointer line to the end of `docs/MASTER_PLAYABILITY_PLAN_2026-10-25.md` (hunk-only appends from fresh disk, run the zero-loss check in `docs/gm/SHARED_WORKTREE_PRACTICE.md`).
Report: file path, commit hash, unreachable sources, top three recommendations.

## More to consider (for the brief itself)

- **Ask for a channel list per world, not per ability.** Names matter in LOTM and Earthsea-like worlds; records matter in Village; claims matter in debt-driven worlds. The brief asks for cards from all five worlds so the model is not shaped by one.
- **Residue by default.** Total erasure with no trace breaks cause and effect (AD38: things work by how they work); the default is erasure with a residue fact, and "no residue" is a costly dial.
- **Retroactive effects touch the delta log, not the base.** That keeps seeds honest and lets rewinds undo them.
- **Testing.** Ask for a property test: apply, save, reload, Import, then assert no dangling references and that unmasking restores the original view.
- **Do not let this become a permission list.** It models channels and operations; whether a particular method reasonably works is decided by its mechanism (AD38).
