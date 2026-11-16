# Play surface wave: handoff of open ideas (2026-11-16)

The play-surface wave (2026-11-14 to 2026-11-16) closes here, as Weibao asked: "finishing everything here, commit push an merge, and then we can start ideaboarding after handing off all the rest ideas". Each row is open work with its code, its owner when the wave stopped, and a done check. The codes live in [CONSIDERATIONS.md](CONSIDERATIONS.md) (PS1–PS302) unless named otherwise. Each lane's own handover holds the detail. Nothing here is accepted direction unless Weibao's words are quoted.

## Waiting on Weibao

| Item | Where | What it needs |
| --- | --- | --- |
| Areas build | the "Areas inside places" session card (task_4d3df568), rounds 17 and 21 | A click to start the session. The brief is in the card. |
| Bench and item-sheet layout | feature-ui's record | His look at the two-column bench, grouped processes, the one-line sheet summary, the "you at this forge" strip and the beat-what-you-have chance. |
| Try "Grows with the life" | Display › Look › Customize › Layout | Try it in play. It stays a choice, with "Full" as default. |
| Row style, presets, fight log | Display › Look | Try them in play. Classic is the original look. |
| Klein's rent arrears after a move | daily-loops' audit note on 2d408371a | Proposal: old-flat arrears carry over as weeks, priced at the current week's rent. Keep the old price instead, if that reads better. |

## Open work by lane (each with a handover)

| Lane | Open items, in order | Done check |
| --- | --- | --- |
| ui-cohesion | PS292 coherence pass: Skills (PS279–PS283), inventory, item sheet on the kit renderer; slice 4 Journal tabs (Knows, Notebook, People, Worlds, Beginning); PS192 Here box; PS193 log filters; PS195 stray guard; PS190 strip labels; PS275 click and blank-area table | Boxes drawn through `src/ui/kit.js`, the markup ratchet down, captures with the real font |
| combat | PS296–PS298 one fight view (if not landed in the close); PS46–PS52; D6 ally cards in a browser; slice 5, one fight that matters in each lead world end to end; PS301 drawn-twice check | Browser fights in three worlds with save, reload and import |
| feature-ui | PS250–PS251 enchanting bench from `src/rune_grammar.js`; Learning now stall reasons; D2 Klein's Beyonder tab; D4 Refine bench; D3 exams in Quests; the bench layout proposal | Bench in play, kit-drawn |
| daily-loops | Klein's streets (event owner in 0e20e2160) if unfinished; rent by home; D5 patrol count and merit ledger (needs saved history); Harry's further days | A playable day per lead, ending in "Next:" links |
| discord-features | DU38 two-pane trade (after the item sheet is on the kit); F34 per-fight yield in Reports; the walk map remembering its open state | Surfaces in play with browser proof |
| feel-finish | Effects following the OS; an animated mock; per-world rarity glow meaning | Look choices registered, defaults unchanged |
| foundation-run | Klein's acting slice (its resume block) | Committed with `lotm_be_acting.js` and importers |
| ui-drafting (done) | D1–D12 drafts await builds by feature-ui and ui-cohesion; PS216 handover used | See `docs/audits/UI_SURFACE_COVERAGE_2026-11-15.md` resume line |

## Proposals not yet assigned

| Codes | Idea |
| --- | --- |
| PS208 | Cold by mechanism instead of a flat XP cut, in our variant's worlds |
| PS210 | The crossing opened by an in-world route, with Cross freely as a play rule |
| PS216–PS228 | Round 21's challenges still to test: palette over panel bar (PS218), readiness on verbs (PS220), learned fight habits (PS221), next-due in the status line (PS224), design by moment (PS227), blind panel (PS228) |
| PS252–PS263 | Mod patterns by question: JEI-style uses on a key, Jade hover cards, AppleSkin previews, goal tree and notebook, visible machines, one storage search |
| PS276–PS278 | First-run look picker, look choices named in captures, accessibility in the registry |
| PS301 | A drawn-twice check in check:flow |

## Standing risks

- The cast_* live-save tests run close to their 270 s worker timeout under load. The fix is a longer timeout or the slow label.
- Shared files: a pathspec commit takes the whole file from disk. Default: stage your own hunks with `git apply --cached`, then run a bare `git commit` after checking `git diff --cached`.
- Captures need `resources/fonts/private` linked into scratch trees (PS293).
