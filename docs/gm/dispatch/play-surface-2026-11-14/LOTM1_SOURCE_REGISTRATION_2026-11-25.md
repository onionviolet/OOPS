# New local LOTM volume 1 registration

Status: agent-verified metadata/tooling, not human-reviewed. Reading and browser proof belong to the separate chapter-127 reading lane.

## Preflight

| Field | Scope |
|---|---|
| Reading and authority | Parent requested exactly `lotm1`, Chinese `zh-nav`, book 1, in the new `local-reading-2026-11-25` private owner. Preserve historical wave owners, prefix meaning and existing registry order. AD6, AD36, WPR19–21/27. |
| Fit | Existing [book registry](../batch-reading-2026-10-27/plans/books.json), `make_book_plans.mjs` source check, and Atlas `library-reading.mjs` held-source projection. |
| Files | Registry note/new row, small shared `book_source.mjs`, planner import/source hunk, Atlas import/held hunk, focused test and this receipt. Other active edits in `library-reading.mjs` are retained. |
| Failure scenario | New local outputs are mistaken for restored legacy reading, a changed source alias is admitted, or held bytes imply read coverage. Test explicit owner/prefix separation, absent/mismatched sources and metadata without source-path disclosure. |
| Exclusions | No older row remapping, wave regeneration, whole-book reading/preparation, source conversion, raw-source tracking, paid call or global source migration. |

## Result

The registry previously had no `lotm1` key. A new row was appended after the 152 preexisting entries: world `lotm`, language `zh`, type `zh-nav`, book `1`, nav `OEBPS/Text/nav.xhtml`, owner `docs/research/novels/lord-of-mysteries/private/local-reading-2026-11-25`, `readingOwner: new-local-manual`. The note retains the older `make_wave_plans.mjs` owners and prefixes and distinguishes this new local reading from an archive migration. All 152 earlier rows compared deep-equal to HEAD in identical order at the registration check.

The primary Mac Calibre path retains its existing meaning. An explicit Windows alias records the exact held edition path and SHA-256 from [RA21](../cross-world-systems-2026-11-07/READ_AHEAD_USE_2026-11-08.md#ra21--unused-charm-maintenance-november-25-2026): `6126274478a95dbe03eb904bc35c409067c7022563e52997a46e98be07b2d70d`. Shared `resolveBookSource` prefers an existing primary path, otherwise admits an explicitly listed alias after its byte hash matches. It creates no files, infers no aliases for older rows and returns no qualified source for absent/mismatched candidates. This host resolved the pinned Windows file successfully. Existing Mac primary-path callers retain their presence-based behavior; this lane does not add a new fingerprint claim for an unavailable Mac file.

Atlas and the planner use that same resolver. Atlas exposes the resulting held boolean and omits source paths and alias metadata. Held source, prepared shard, collected pass and complete reading remain separate. No planner command generated plans or prepared additional chapters in this lane; existing EPUB preparation dependencies are unchanged.

At the real-output metadata check, the other reading lane's private output projected one `lotm1c127` shard for `127-127`, `rules: 1`, all four other passes zero, and `complete: false`. Fourteen rows contributed keyword aspect pointers; those counts are not newly inferred source findings. This lane did not create those private reading outputs.

## Verification

| Check | Result |
|---|---|
| Registry versus HEAD comparison, excluding appended row | All 152 old rows deep-equal, same order. |
| `node --test tests/book_source.test.js tests/lead_run_books.test.js tests/atlas_reader_findings.test.js` | 30/30 passed: registry/legacy ownership, primary/alias selection, changed/absent source refusal, unchanged source bytes, no implicit migration or reading credit, planner shard identity and existing Atlas reader metadata. |
| Actual `resolveBookSource(lotm1)` and `readKey(lotm1)` | Pinned source held; genuine chapter-127 rules metadata present, other passes missing, incomplete book. |
| `node --check` on shared resolver, planner and Atlas metadata owner; `git diff --check` | Passed. |
| `npm run check:docs`; new-file whitespace check | Passed: no new doc hits or trailing whitespace. |

The focused tests remove their own temporary fixtures. No background process, scratch build, source copy, plan regeneration, commit, push or deployment was created. The parent/reading lane owns the rebuilt real chapter-127 Atlas proof and any subsequent coverage claim.
