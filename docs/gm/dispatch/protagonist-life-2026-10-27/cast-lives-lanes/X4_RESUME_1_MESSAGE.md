# X4 resume 1: make the census choose lanes

Same grants and rules as X4 (scripts, tests, checkpoint; private outputs; no canon names in tracked files; the
checkpoint lists counts and generic family names only). The first census is too coarse (classes) and too fine (phrases
with counts of 2 to 10). Do these:

1. **Actor filter.** Many appraise/research/fight rows have a person other than the lead as the subject. Tag each step
   with whether the lead is the actor (use the step's actor/POV fields in the M4 rows) and recount the gaps for
   lead-actor steps only; non-lead steps are beat or witness material and get their own count.
2. **Command families.** Cluster lead-actor gaps by head verb plus object type into parameterized families (for
   example: send or receive a letter, divination or ritual casting, paid ride or carriage, read an item or text, buy or
   hire or pay, use a named ability, speak with a person on a topic, return or travel to a place). Derive families from
   the data with a small rule table you can print; whole-book counts per family, per volume, and the share left in
   "unclustered". Aim for families that cover at least 70% of lead-actor gaps.
3. **Cheap misses.** List gap steps whose verb is wait, walk, return to <resolved place>, pay, or talk with a resolved
   person where an existing be-seat control exists; fix the mapper for them.
4. **Reason labels.** Replace "missing UI path" with the real cause per family: no control exists, control exists but
   place/person/item unresolved, or the control is a different mechanism. State which.
5. For each top family, say whether H1's pack-driven acts (`definePlaceActs`, `householdActs` operations in
   `src/book_world_lotm_cast_host.js` and its helpers) could carry it by adding operations and pack rows, or whether a
   new mechanism is needed, with a one-sentence reason. Read only; do not edit `src/`.

Update X4_CHECKPOINT.md (append "Resume 1") with the family table (generic names, counts), the lead-actor recount and
the H1-fit verdicts. Regenerate the private census. Focused tests, lane review. One line per check. Do not commit.
