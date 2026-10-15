# MR: magic research and knowledge unlocks (Minecraft corpus audit, 2026-10-14)

Labels: shown = read in data or code, stated = author text, inferred = my reading.
Deep tables (IDs, prerequisites, costs, book text): `docs/research/minecraft/private/audits/mr/` (gitignored). Reference only, no code or asset reuse.

## Top findings

- MR1 (shown) Thaumcraft 6 splits knowledge into two currencies per discipline: Observation (scanning, 16 points per unit) and Theory (table work, 32 per unit). Research stages demand specific amounts of both, so a stage is a bill of "have looked at things" plus "have thought about them".
- MR2 (shown) Thaumcraft theorycraft is a bounded card game: start inspiration 5, plus 0.5 per owned spiky entry and 0.1 per hidden entry, capped at 15; each nearby aid block costs 1 inspiration but seeds special cards. Each draw offers 2 cards (3 with a banked bonus draw). Unfinished work still pays, and all categories except the top one lose a third.
- MR3 (shown) Primal Magick study projects are a gamble with a visible odds bar: base success is 0.5 minus 0.1 per 3 completed projects (floor 0), each chosen material adds an equal share of the remaining odds, and failure consumes the materials and gives nothing. Required materials grow from 1 to 4 over 15 completions. Reward is 32 times (template multiplier plus bonuses).
- MR4 (shown) Spectrum hides content with a "cloak": the object exists and can be held, but displays as another block or scrambled text until an advancement is earned. 1558 recipes and 380 of 426 guidebook entries are gated on advancements, and 49 pages are paid hints (for example 16 citrine shards buys a "where to find" page).
- MR5 (shown) Mana and Artifice gates by tier, not research points: 70 recipe-level progression conditions across tiers 1 to 4, each pointing to a plain advancement (cast a cantrip, craft a spell of complexity 10/25, reach magic level 15/30/45/60, kill the dragon). The in-game block that lists what is locked and what to do is the Occulus; the codex shows only unlocked material.
- MR6 (shown) Eidolon Repraised research is small but concrete: only 3 registered researches (3 to 5 stars). Notes come from using note-taking tools on a specific block or mob, each star is one of three drawn tasks (item stack from a tag, 1 to 5 XP levels, or an authored special task), and finishing grants a sign or spell.
- MR7 (shown) Nature's Aura is a pure passive-field economy. Area aura has a baseline of 1,000,000 per chunk, signed "drain spots" move it, and thresholds in the millions flip on environmental effects in both directions. Surplus grows crops and ores, deficit kills grass, angers animals, makes you breathless and finally explodes.
- MR8 (shown) Thaumcraft warp is a three-bucket debt (temporary, normal, permanent) paid by random events every 2000 ticks, with severity rolled against total warp. Stages that add warp split it half permanent, half normal.
- MR9 (shown) Hexerei has no knowledge gating at all. Its guide book is an open reference; the loop is physical (fluid, up to eight items, heat).

## Answers to donor questions

**N01 Spectrum.** Yes, the same retained object yields different observations after learning. Cloaked blocks and items keep their identity but present as a stand-in until the linked advancement fires (shown in the Revelationary library branch; the Spectrum jar registers each cloak with one advancement id and a stand-in block state). Unrevealed names render scrambled by default. The mining block-break guard is a config option, default off, so you can still break unknown blocks (shown). Observation distinct from menu reveal: item pick up, entering a structure, placing a block, tapping a barrel and similar triggers (839 advancements; the common trigger types are other-advancement gates 1419 times, inventory change 292, impossible-by-script 73) each flip a gate. Hint pages cost materials to read: eg dragonbone hint 4 then 12 doombloom seeds, moonstone shards 8 then 24 (shown). One caveat: the hint advancement chain gates on a milestone advancement, so hints themselves are discoverable only after the right milestone (shown).

**N02 Primal Magick.** A study project requires: a discipline unlocked, a rolled project template, and materials from a weighted bag (items, tags, XP levels, an "observation" point, aid blocks nearby such as a bookshelf or analysis table). It retains: Theory points, a completed-projects stat that raises future material counts and lowers odds, and per-discipline expertise. It makes executable beyond point purchase: research entry stages require combinations of knowledge points, stat counts (eg items analyzed 25), item stacks or tags, expertise levels, or other research. Tiers: basic 36, expert 64, master 51, supreme 27 entries, plus 120 untiered. 27 are hidden and 38 internal (shown). Failure is real: materials burn and no progress.

**N05 Nature's Aura.** Yes, a useful local process alters later growing or crafting conditions, with alternate replenishment. Effects with thresholds (all shown, tag 41.10): plant boost needs area aura at least 1,500,000 and a positive spot, bonemeals up to 75 plants within 5 to 35 blocks, each costing 3500 aura. Ore spawning needs over 2,000,000. Grass die-off needs negative spots and negative total, radius up to 75. Explosions need below minus 5,000,000. Spread effect moves 72% of a huge spot toward the emptiest neighbour 15 blocks away and fizzles past 150 blocks (config). Replenishing comes from aura blooms (150000 on spawn), a generator set, and a drain pass; the field creator drains around 20 per 40 ticks plus 300 per use. Balance effect moves spots above 100000 toward lowest.

**N35 ElementalCraft.** Not in this lane's target list; unread here.

**N37 Eidolon Repraised.** Charged objects are wands whose use is item damage; the recharge ritual resets damage to zero when the wand sits on a ritual focus tile (shown). Two recharge ritual recipes exist (chill wand with 2 snowballs, redstone dust and a lesser soul gem; soulfire counterpart). So recovery is a consumable-fed ritual, not time. Research is code-defined, not data, and the author's "more usable research" is not delivered beyond the 3 entries (shown; branch head, not a tag).

**N38 Mana and Artifice.** Spells compose a shape, components and modifiers on an inscription table with a complexity budget (tier gates are craft spell complexity 10, then 25, shown). Rote mechanic: repeated casting makes each part "rote", then a book of rote assembles spells with more components and modifiers at no material cost; mastery spends experience and Eldrin power to cut cooldowns by up to half (stated in codex). Affinities come in opposing pairs (air/earth, water/fire, ender/arcane) and speed memorizing parts of your own element. Faction choice swaps the casting resource (mana, souls, brimstone, summer fire, winter ice) (stated). Mana regenerates over a fixed time (default 120 s) scaled by saturation (stated).

**N43 Hexerei.** One loop: fill the mixing cauldron with up to two buckets of fluid, throw in up to eight items, optionally put heat under it (13 of 37 cauldron recipes need "heated", fluids are water 21, lava 13, potion 3) and a sigil slot; output appears. Drying racks, a pestle and a dipper feed it. The page's promised coven and rituals are absent from data (shown). The book has no locks.

## Systems and patterns

- Thaumcraft 6 (shown). 148 research entries in 8 files: basics, alchemy, artifice, auromancy, infusion, golemancy (29), eldritch (5) and scan stubs. A category unlock is a spiky round entry in BASICS gated by other entries (UNLOCKALCHEMY after FIRSTSTEPS; UNLOCKARTIFICE also needs METALLURGY stage 2; UNLOCKGOLEMANCY needs three others; UNLOCKELDRITCH is hidden and needs a cult research). Meta flags: hidden entries only show once their parent is known (about 36 entries); hex entries are scan results. Stage inputs: required_knowledge (eg THEORY ALCHEMY 2 for metal purification), required_research including "!aspect" scanned flags, required item or craft. Only 17 stages add warp, from 1 to 5 (Unlock Eldritch 5, Liquid Death 3). Observation per scan = per category sqrt of weighted aspect sum. Theory table: finishing sums category totals, converts totals/100 times 32 per category, and lower-ranked categories beyond the penalty line lose a third (min 1).
- Primal Magick (shown). 8 disciplines, 298 entries, 38 project templates keyed by discipline and tier (hit the books, observation analysis, ritual practice with a quorum of 2 of 4 research requirements, expedition and trade variants). Reward multipliers 0.25 default, 0.5 for cheap ones, 1.0 for master spellwork.
- Spectrum (shown). 386 unlock advancements chain from milestone and hidden collect advancements. Book entries use a condition and hide-while-locked (418 of 426 hide). Two layers: revelation (what things look like) and book reveal (what you can read).
- Botania (shown, tag 456 exact). Lexicon is Patchouli: 227 of 246 entries gated on 14 advancements, 87 behind first mana pool, 69 behind elven lexicon, 36 runic altar, 13 pure daisy, rest are challenge kills. Entry gating is by pickups, not research. Mana economy is generator flowers fed by the world: Endoflame burns an item (fuel capped at 32000, half time) giving 3 mana per 2 ticks, 300 cap; Gourmaryllis food value squared times 70 times a streak factor (0, 1, 1.3, 1.5, 1.6, 1.7, 1.75, 1.8) with a digestion cooldown 10 per food point (repeats punished); Rafflowsia streak by flower variety; Spectrolus 1200 per wool, 5000 per sheep, 1 per baby sheep; Thermalily 750 cap with cooldowns of 400 times a rolled strength; Narslimmus 1200 per slime size doubling; Hydroangeas passive decay 72000 ticks. Cap on all: small buffer, so mana must be moved into pools.
- Nature's Aura (shown). 89 book entries, 83 advancement-gated by 15 advancement ids (22 behind infused materials, 16 behind sky ingot).
- Eidolon Repraised (shown). Codex index entries are locked by sign, fact (villager sacrifice, zombie cure, undead enthral, smite), research or deity reputation (10). Locked entries show as empty slots.
- Mana and Artifice (shown). Codex 516 entries, only 1 uses a direct required advancement; the tier lock is on recipes, so books show unlocked recipes (inferred from guide text). Categories: sorcery 158, artifice 111, constructs 80.
- Blightfall (shown, magic parts). Thaumcraft 4.2.3.5 base with research difficulty 0, aspect cap 10 per aspect and total 100, taint biomes not generated at worldgen. MineTweaker adds custom research with aspect cost lists, prerequisite lines, concealed or spiky flags and warp: TAINTEGG 25 warp and 5 on the item, TIERSIX and DAWNTOOL 5 each. HQM quests narrate research (autopsies of tainted creatures).

## Warp and corruption costs

- Warp types: temporary (decays 1 per check), normal, permanent. Check every 2000 ticks unless warded. Trigger when random under sqrt of the counter. Event strength is random up to (2 warp + counter)/3 capped 100, plus gear warp, minus mask. Tiers: 1 to 4 sound, to 8 sounds, to 12 text, 16 vis exhaustion, 20 thaumarhia, 24 unnatural hunger, 28 text, 32 mist, higher cultists, void and worse (shown; tail unread).
- Aura flux (shown partly): chunk flux capped 32766; taint spreads as a biome per config. Nature's Aura negative states are local-state-only and reversible by refilling; Thaumcraft's are permanent personal debt. Spectrum has no corruption cost.

## Coverage

- Thaumcraft: fully (tree, cards, warp events), flux effects partly.
- Primal Magick: entries and templates fully; attunement not found as a distinct mechanic (shards are the closest, unread).
- Botania: lexicon and generators partly; passive flower pool numbers not complete.
- Spectrum: advancement layer and hints fully; item/block cloak registry partly (library branch, not tag); ink and pigment systems out of scope.
- Eidolon: research and recharge read; chants and signs partly.
- M&A: progression and codex text read; spell composition code not read.
- Hexerei: recipes and book partly. Nature's Aura: effects and book read. Blightfall: scripts and config only.
- Not run: no code executed.

## YAIRPG fit (proposals only)

- Provenance owners: `src/skill_discovery.js`, `src/world_knowledge.js`, `src/people_knowledge.js`, `src/native_discovery_policy.js`, `docs/worlds/WORLD_SECRETS_AND_DISCOVERY.md`, `src/adventure_notebook.js`, `src/lore_practice_*.js`, `src/lever_lesson.js` (lesson pattern), `docs/RESEARCH_PROGRESSION_MAGIC.md`.
- Ideas, each world-specific: (a) two-currency knowledge, seen versus understood, with stages that demand both (MR1); (b) a bounded study session with visible odds and burned materials on failure, tied to practice count (MR3, MR2); (c) cloaked objects that stay the same record but present differently until a fact is known, which matches the sealed-secrets rule since the truth stays in a fact flag (MR4); (d) paid hint pages as a cost to ask a teacher where to look (MR4); (e) tier gates as plain facts instead of point purchase (MR5); (f) local ambient state with thresholds both ways and alternate refills (MR7); (g) debt buckets that decay or stick, with event severity rolled against the total (MR8).

## Gaps

- Primal Magick attunement, shards and linguistics grids unread; Botania passive flowers and mana spreader rates; Thaumcraft flux effect thresholds; Hexerei potion brewing numbers; M&A spell cost formula; ElementalCraft (N35) not in lane.
- Spectrum and Eidolon sources are branch heads, not tags; treat as likely, not exact.
