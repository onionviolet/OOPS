# Sci-fi deep dive and JoJo audit: plan

JoJo update, 2026-10-11: Weibao authorized the expanded audit including engine
and implementation concerns. [Current audit report](jojo-audit-2026-10-11/REPORT.md)
owns execution, evidence and remaining coverage. The original JoJo evidence,
route and dispatch assumptions below are historical; the sci-fi portion is
unchanged and is not dispatched by that authorization.

Proposal, 2026-10-10. Weibao: "we might need a deep dive across scifi next,
consider what we should do to consider, need to send out a audit for Jojo's?"
Method: [source deep dive playbook](SOURCE_DEEP_DIVE_PLAYBOOK.md). Feeds
[Deep concepts](../DEEP_CONCEPTS.md). Nothing dispatched yet.

## What exists

- **JoJo:** only a blocked wiki digest
  (`power-systems/wiki-digests/DIGEST_jojo-s-bizarre-adventure.md`,
  jojowiki.com robots disallow), unverified anime-lane mappings, and text
  VFX entries (King Crimson, time stop) in
  [presentation](../PRESENTATION_AND_FOURTH_WALL.md). Source request S24 is
  open.
- **Sci-fi:** scattered. Factorio, Oxygen Not Included, RimWorld, Sunless
  Skies, Bitburner and Upload Labs are audited as games. Literary sci-fi has
  only the from-memory list in Deep concepts. **No sci-fi novels in the
  local library.** Local sci-fi-adjacent texts: *The Legendary Mechanic*,
  *Warlock of the Magus World*, *Worm*, *Wish Upon the Stars*.

## JoJo audit (wiki-first)

Why it's worth one: JoJo is the best single catalog of rule-shaped powers.
Most Stands are one precise rule with a weak point, which is exactly the
implication test (T1 to T10) and ability shapes I6, I8, I14, I15 and I19.

| Module | Scope |
|---|---|
| M1 | Stand catalog by part, focused on rule-shaped Stands (time, causality, luck, conditions, automatic Stands, Stands bound to objects or places). Hamon, Spin and Rock Humans as separate systems |
| M2 | Stand laws: one per person, shared damage, range versus power, only users see Stands, arrows and Requiem, evolution through Acts, how time-stop fights resolve, Stand counters as logic puzzles |
| M3 | Fan premises: Stand-user OCs, SI into a part, Stand generators (fans name a song and roll stats) |
| M4 | Wiki cross-check with revision IDs |
| M5 | Synthesis: each Stand checked against T1 to T10, a "Stand as one rule" authoring template, a JoJo-like world slot, VFX links |

Route: jojowiki.com blocks scripted fetches through robots.txt. Use the
in-app browser API route from the playbook only if Weibao allows it for this
site (it is not on the allowed list yet). Otherwise jojo.fandom.com, also
through the in-app browser. Label every claim CANON, WIKI-INFERRED or MEMORY.
Size: 3 readers (Parts 1 to 5, Parts 6 to 9 with alternate continuities,
laws plus fans) and a main-model synthesis.

## Sci-fi deep dive

Sci-fi is a genre, not one source, so split it into lanes by question:

| Lane | Question | Sources |
|---|---|---|
| SF1 Concept weapons | Which math and physics ideas become rules or weapons, and what engine state do they need? | *Three-Body*, Egan, Chiang, Vinge, Watts, Stross, Langford, *Hitchhiker's*. Wiki and summaries; verify the Deep concepts list |
| SF2 Civilization scale | Tech ladders, the Kardashev scale, FTL rules, post-scarcity economies, AI minds, uploads | The Culture, *The Expanse*, *Dune*, *Foundation*, *Hyperion*, Warhammer 40k, Star Wars, Mass Effect |
| SF3 Sci-fi games as mechanics | Which systems from sci-fi games fit an idle life sim? | Stellaris, FTL, Outer Wilds, EVE, Mass Effect, Star Control, Dyson Sphere Program. Skip the games already audited |
| SF4 Local sci-fi web novels | Tech-as-cheat (mechanic systems, AI chip analyzing magic); full M1, M2 and M5 from the text | *The Legendary Mechanic*, *Warlock of the Magus World* (local EPUBs) |
| SF5 Fan premises | How fans insert OCs into sci-fi worlds | Mass Effect, Star Wars, Warhammer and Culture SI fics through AO3 tag pages |

### What every lane should consider

1. **Tech versus magic.** Clarke's third law; how tech converts across
   worlds ([verse equalization](../CHEAT_COSMOLOGY.md#verse-equalization-converting-between-systems)).
   Can a phone work in a cultivation world?
2. **Scale and time.** Light-speed delay, time dilation (K24), generation
   ships. How idle time maps to interstellar travel.
3. **Minds.** AI, uploads, copies, hive minds, aliens who think differently.
   Links to [selves](../SELVES_AND_ECHOES.md) and K9.
4. **Economy.** Post-scarcity, matter printers, duplication (I18).
5. **Information.** Surveillance, cryptography (K22), memes as weapons.
6. **Deep time.** Heat death (K3), the Fermi paradox, the dark forest (K21).
7. **Implication test.** Run sci-fi tech through T1 to T10 like any power.

Size: SF4 uses the full playbook with local text (2 to 3 readers). SF1,
SF2, SF3 and SF5 are one wiki or web reader each. That's 6 to 7 Sonnet readers
plus synthesis. Run JoJo first: it's smaller and tests the "rule-shaped
power" template that sci-fi reuses.

## Open item

- Weibao's go for dispatch, and whether jojowiki.com may be browsed in the
  in-app browser despite its robots rule.
