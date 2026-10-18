# T02 partial 1 extraction return

This batch captures the exact six-file manifest. For each file, `read_ranges` records the union of the manifest assignment and the complementary DESIGN/RESEARCH extraction ranges; all six unions cover the full document. SHA-256 values are recorded in the private JSON. The extraction preserves coded rows as separate records, including distinct variants, and records prose-level scope qualifications separately. It does not assert that every uncoded sentence is an independent finding.

**Coverage status:** full capture/parse ranges are not semantic review. Every row in this T02 return is marked `captured_indexed_only`; `semantic_ranges` and `semantic_reviewed_ids` are empty because this return did not newly check source joins or adjudicate individual records. Owner values are origin-record or explicit-link candidates, not verified current owners. The complementary DESIGN/RESEARCH ranges are prior extraction inputs, not a claim that those records were semantically reconciled here.

| Source | Rows | Role and material scope |
| --- | ---: | --- |
| `docs/INTRO_FLOW_CONSIDERATIONS_2026-10-13.md` | 711 | Proposals/palette plus F1-F5 source observations. The file says its rows are dials, not accepted rules. Current implementation adoption of proposals was not checked. |
| `docs/RULEBOOKS_FOR_WORLDS_AND_GM_CONSIDERATIONS_2026-10-14.md` | 191 | Round-staged rulebook research and proposals. Early/no-dispatch rounds, later authorized report lanes, research references, ranked book choices, and purchase decisions remain distinct. |
| `docs/research/GAME_RESEARCH_AUDIT_CHATGPT_RESPONSE_2026-10-13.md` | 3 | Prompt-review response and instructions, not downstream research execution or gameplay acceptance. |
| `docs/research/PREMISE_HOOK_AUDIT_2026-10-14.md` | 65 | Premise families and PE1-PE12 dated implementation-gap claims, plus F1-F5 from the complementary earlier extraction. Search/catalog coverage is bounded; current source gaps were not rechecked. Sealed truths are not reproduced. |
| `docs/AUDIT_PROGRESS_AND_REFINEMENT_PROMPT_2026-10-15.md` | 3 | Method-only prompt sections: authority/evidence handling, reconciliation, emergence, and the stopping boundary. |
| `docs/PLAY_BEYOND_MENU_SELECTORS_CONSIDERATIONS_2026-10-14.md` | 10 | O1-O5 interaction families, D1-D5 proposals, O6-O10 documentation comparisons, and A1 bounded experiment. All are proposals here; OD25's broad direction elsewhere does not accept these specific mechanics. |

Proposal dispositions are scoped to the originating record, and `current_adoption` is `not_checked` unless the source itself documents a historical status. Historical code observations and gap reports retain their evidence limits; this return makes no new current-implementation claim.

The response artifact and progress prompt are method/provenance records, not new design backlogs. Research documents do not establish source acquisition, current private-corpus state, or gameplay. No builds, tests, downloads, runtime actions, external messages, or edits outside these two return files were performed.
