# X4 resume 3: unlock the largest remaining families with rows and resolution

Committed Resume 2 (`cdf750f59`): 1,111 of 11,159 steps have a control (T 64, J 544, A 491, W 2, G 7, H 3). The biggest gap families and what blocks them (your table):
unclustered 3,143; speak or ask 1,144; reason or plan 831; handle item 807 (object unresolved 689); travel 658 (place unresolved 426); inspect 438;
observe 427; agree or refuse 306; make or write 296; rest 284; change state 282; place unresolved in 2,177 gap steps overall. Waits: 162 wait steps and 17 of the
first 150 ch1-24 steps are "no numeric day window; retained as order-only gap". The browser replay (deterministic now) reached 2 of 150 ch1-24 steps. Work these, in this order, each in
your owned files (scripts, tests, checkpoint; private outputs; no `src/`, no `private_packs/`), keeping one pack with all row sets:

1. **Objectless acts.** Reason or plan (831), observe or listen (427), inspect without a nameable object (438 minus object-resolved), agree or refuse at a place, and
   notice/realize steps need no object: in `build_place_acts.mjs` emit a place act with an `operation` that H1's adapter already accepts for knowledge-only results
   (check `src/place_acts.js`; use `inspect` with a place-level pseudo-object seeded as one fact flag per scene if the adapter requires an object, named in plain
   words like "the scene at <place>"; no canon names in tracked code), minutes from the step or a labelled one-minute fill, a short paraphrased report, a knowledgeKey so the
   result feeds knowledge. This is the cheapest large unlock; CLR1: cite the paragraph and drop rows it does not support.
2. **Wait windows.** Give wait steps a numeric day window from the day binding and schedule where the source supports it (ON6 day binding; the mapper already has
   `windowed` rows when a numeric day exists); report how many of the 162 get a window and why the rest do not.
3. **Place resolution.** Take the top unresolved scene places (2,177 steps): propose exact and containment aliases from the registry and census (X2's approach: exact alias, explicit
   containing-place component), apply the exact ones, count the steps unlocked per rule, list the remainder by reason. Same for the 3,147 unclustered steps: extend the ordered family rule
   table so each step lands in a family or a typed "needs a new mechanism" bucket; report counts only.
4. Regenerate the final pack `cast-whole-book-all-candidate-2026-10-29.json` (all row sets, same validators as Resume 2: three adapters, native registry JSON and requirement check, pack validator;
   remember `undefined` and empty `requires` each broke page load), the per-volume ladder mappings and the census. The coordinator measures cost and runs the browser replay.

Append "Resume 3" to X4_CHECKPOINT.md (counts and generic names only; before/after control totals per family and volume). Focused tests; lane review. One line per check. Do not commit.
