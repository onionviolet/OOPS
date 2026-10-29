# X4 resume 2: coverage after topic talks, journeys and place acts; the next mechanism families

Committed since Resume 1: D3 topic rows, J3 journey rows, A3 place-act rows, all folded into the live pack (now the whole-book acts candidate,
`pack-backups/cast-whole-book-acts-candidate-2026-10-29.json`, also at `private_packs/lotm-cast/cast.json`; 1,500 people, 1,516 places, 616 journeys,
551 acts, 64 topic rows). Regenerate the whole-book mapping and the census with that pack (same inputs and command as before, `--pack` set to it), then:

1. Coverage table by family (generic names, counts only): whole-book family steps, steps with an exact control now, the share, split by control kind
   (talk topic, journey, place act, walk, wait, household). Also by volume.
2. What remains, by family, with the real reason per step class: (a) no row because person/place/object unresolved, count by which; (b) no control kind
   exists for the verb (list the remaining verb families with whole-book counts, biggest first, for example reasoning or planning, divination or ritual casting,
   using an ability, fighting, buying or hiring, sending or receiving a message, writing or making an item, directing another actor, obtaining information, other);
   (c) step actor unknown. For each (b) family: the nearest existing mechanism (H1 place act, topic talk, journey, native trade, native combat, native dialogue)
   and whether it could carry the family by rows alone (yes/no with one sentence), so the next Sol lane can be chosen.
3. Quick wins: group (a) by the single missing resolution (a person alias, a place alias, an object noun) and list the top 30 by steps unlocked; apply the
   ones that are exact-alias fixes to the mapper's resolution tables or to the row builders' resolution (your files and the builders `build_topic_talks.mjs`,
   `build_journeys.mjs`, `build_place_acts.mjs` with their tests), regenerate the three candidates on top of the whole-book candidate (keep their pipeline order so the
   result is one pack with all three row sets), and write the final pack as `cast-whole-book-all-candidate-2026-10-29.json` in private `pack-backups/` plus a mapping per
   volume range (arc-sized, about 100 chapters) for the replay ladder under the private `x4-whole-book-mapping-2026-10-29/ladder/`.
4. Validate the final pack by loading rows through the three real adapters, the native registry JSON/requirement check (empty `requires`, `undefined` fares and
   similar broke page load twice), and the pack validator.
Append "Resume 2" to X4_CHECKPOINT.md (counts and generic names only; no canon names or phrases). Focused tests; lane review. One line per check. Do not commit.
