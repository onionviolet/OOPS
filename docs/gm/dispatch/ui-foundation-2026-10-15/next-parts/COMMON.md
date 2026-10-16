# Next-parts plan improvement lanes, common brief (2026-10-15)

Weibao: "send out executors with codex stuff, we should plan accordingly and use the questions
workflow properly to settle things? We can just improve the plan thus far."

Scope: **improve the plan only.** Read source, captures and docs freely. Write only your own
lane file `docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/<LANE>.md` (and scratch under
`next-parts/scratch/<LANE>/`). Do not edit `NEXT_PARTS_2026-10-15.md`, UI_RULES, USER_VISION,
PROJECT, any `src/`, `styles/`, `dist/`, tests or saves. No build, no commit, no push, no messages,
no further dispatch. Other sessions are writing in this checkout; do not stash, reset or checkout.

Read first: repo `AGENTS.md`; `docs/gm/dispatch/ui-foundation-2026-10-15/NEXT_PARTS_2026-10-15.md`
(whole, including Round 7 and its corrected rows, which supersede older rows);
`R14_FOLLOWUP_CONSIDERATIONS.md` sections your lane needs; `docs/UI_RULES.md` (UR41–UR58);
`PARITY_INTENT_2026-10-15.md` K1–K9. Desktop 1366×768 at 14/21px and 1920×1080 at 21px; mobile deferred.

Rules:
- Label every claim **shown** (capture/pixels), **stated** (source line or doc), or **inferred**. Cite path:line.
- Codes: keep existing codes; new ones use your lane prefix (given in your prompt) and stay stable.
- Sealed secrets (docs/worlds/WORLD_SECRETS_AND_DISCOVERY.md): refer by ID and status only, never truth.
- "Everything possible, reasonably": write defaults plus dials, not either/or absolutes.
- Agent proposals are not accepted decisions. Weibao's quoted words and PROJECT.md accepted rows are.

## Questions workflow (mandatory output section)

Follow `docs/OVERARCHING_DESIGN_METHOD_PROMPT_2026-10-15.md#question-triage-refinement-2026-10-15`.
Classify every unresolved point you meet as one of:
1. already answered (cite the owner),
2. straightforward derivation (state it),
3. reversible implementation choice for a future slice (propose default, no question),
4. uncertainty needing focused evidence (do the inspection if bounded; else name the check),
5. consequential player preference.

Only class 5 goes to Weibao. End your file with `## Questions for Weibao`: **at most 3**, ranked,
each with: the question in one sentence, proposed default, reachable alternatives, why the answer
changes play, and which Part it blocks. Zero questions is a fine answer. Before that, a
`## Settled without asking` table listing classes 1–4 with their resolution.

## Return

Your file has: summary (5 lines max), findings table, proposed plan edits (exact row/section of
NEXT_PARTS to change and the replacement text), Settled without asking, Questions for Weibao.
Final message: file path, counts per class, and anything you could not verify.
