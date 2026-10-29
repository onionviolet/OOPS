# A3 resume 1: the acts candidate breaks load

Repro (coordinator, headless Chrome 1920×1080, scratch build of HEAD `1767a7925`): with `pack-backups/cast-whole-book-acts-candidate-2026-10-29.json`
as the scratch build's `private_packs/lotm-cast/cast.json`, the page throws `Invalid simulation requirement.` twice during load and never
shows the play button. The same build with `cast-whole-book-journeys-candidate-2026-10-29.json` (the same pack without the new acts) loads
in 16 s with zero page errors. So one or more of the 542 new acts has a `requires` (or `completionRequires`) object the native
simulation registry rejects. Your adapter check passed, so the test must also run the real registry check
(`createSimulationRegistry` install of every `definePlaceActs` command, the same call the page makes in `src/book_world_lotm_cast_host.js`)
in Node on the real candidate; find which requirement shapes it rejects (for example an unknown fact path, operator, a missing `reason`,
an empty `all`, or a requirement on a fact that no object seeds), fix the generator (`scripts/lead_run/build_place_acts.mjs`, yours), regenerate the
candidate, and add a synthetic regression test that installs generator-shaped acts through the real registry. If the adapter
`src/place_acts.js` should reject or normalize it with a clear typed pack-load error, write the prepared patch `A3_INTEGRATION.patch`
(src is not in your grant). Append "Resume 1" to A3_CHECKPOINT.md with one line per check. Run the focused tests listed in the brief.
Do not commit.
