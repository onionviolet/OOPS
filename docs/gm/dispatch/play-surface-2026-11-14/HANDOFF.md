# Play surface wave: handoff of open ideas (2026-11-16)

The [November 23 Claude follow-up](../../../audits/CLAUDE_FOLLOWUP_2026-11-23.md)
records current branches and verification for the Skills, Graphite, Here,
fight endings, Reports and Klein handoffs.

The play-surface wave (2026-11-14 to 2026-11-16) closes here, as Weibao asked: "finishing everything here, commit push an merge, and then we can start ideaboarding after handing off all the rest ideas". Each row is open work with its code, its owner when the wave stopped, and a done check. The codes live in [CONSIDERATIONS.md](CONSIDERATIONS.md) (PS1–PS302) unless named otherwise. Each lane's own handover holds the detail. Nothing here is accepted direction unless Weibao's words are quoted.

## Waiting on Weibao

| Item | Where | What it needs |
| --- | --- | --- |
| Areas build | the "Areas inside places" session card (task_4d3df568), rounds 17 and 21 | A click to start the session. The brief is in the card. |
| Bench and item-sheet layout | feature-ui's record | His look at the two-column bench, grouped processes, the one-line sheet summary, the "you at this forge" strip and the beat-what-you-have chance. |
| Try "Grows with the life" | Display › Look › Customize › Layout | Try it in play. It stays a choice, with "Full" as default. |
| Row style, presets, fight log | Display › Look | Try them in play. Classic is the original look. |
| Klein's rent arrears after a move | daily-loops' audit note on 2d408371a | Proposal: old-flat arrears carry over as weeks, priced at the current week's rent. Keep the old price instead, if that reads better. |

## Current visual-reference follow-through, 2026-11-20

Read the [updated visual sheet and disposition table](../../../research/DISCORD_VISUAL_REFERENCE_SHEET_2026-11-20.md#current-disposition-of-every-reference--november-20-update) before applying the older lane list. The [latest direction](../../USER_VISION_LOG_2026-11.md#responsive-animated-and-expressive-ui-2026-11-20) allows animation, tactile response, small emoticons/reactions and ambient detail for pleasure and atmosphere. It corrects the earlier motion-for-change restriction; these do not need to add a decision or a simulation. The image sheet accounts for VR01–VR19, distinguishes existing mechanisms from missing runtime proof and names the owning seams. Research has not implemented or closed those runtime items.

The parent retains `prototypes/world-atlas` and `prototypes/creature-desk`; existing runtime owners retain their areas. First proposed comparison: successful refuel and pet/play response through the current household host, followed by one real making action and one actor/creature response. Judge feel and personality as well as legibility; keep effects-off/reduced motion, focus, exact result and return checks. This is a shared file handoff, not a claim that another chat has received a message or started work.

## Open work by lane (each with a handover)

| Lane | Open items, in order | Done check |
| --- | --- | --- |
| ui-cohesion | PS292 coherence pass: Skills (PS279–PS283), inventory, item sheet on the kit renderer; slice 4 Journal tabs (Knows, Notebook, People, Worlds, Beginning); PS192 Here box; PS193 log filters; PS195 stray guard; PS190 strip labels; PS275 click and blank-area table | Boxes drawn through `src/ui/kit.js`, the markup ratchet down, captures with the real font |
| combat | PS296–PS298 one fight view (if not landed in the close); PS46–PS52; D6 ally cards in a browser; slice 5, one fight that matters in each lead world end to end; PS301 drawn-twice check | Browser fights in three worlds with save, reload and import |
| feature-ui | PS250–PS251 enchanting bench from `src/rune_grammar.js`; Learning now stall reasons; D2 Klein's Beyonder tab; D4 Refine bench; D3 exams in Quests; the bench layout proposal | Bench in play, kit-drawn |
| daily-loops | Klein's streets (event owner in 0e20e2160) if unfinished; rent by home; D5 patrol count and merit ledger (needs saved history); Harry's further days | A playable day per lead, ending in "Next:" links |
| discord-features | DU38 two-pane trade (after the item sheet is on the kit); F34 per-fight yield in Reports; the walk map remembering its open state | Surfaces in play with browser proof |
| feel-finish | Apply the November 20 responsive/expressive direction: tactile clicks, local subject reactions and animated actions, plus ambient detail. Reuse existing effects and settings; take VR03/14/16/18/19 as the first proposed comparison. | Real-action before/after, static/reduced/full treatment, stable targets and durable result; existing state/receipt owners retained |
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

## Ideaboard starter, 2026-11-16 (proposals for Weibao to react to)

Weibao: "then we can start ideaboarding after handing off all the rest ideas". The starter board, to expand into rounds on his picks:

| Code | Theme |
| --- | --- |
| I1 | A week, not a day: each lead's weekly rhythm (pay week and rent, timetable and house points, the tide cycle), a small week strip and an idle run of the routine. |
| I2 | One fight in every world: the original combat screen carried to a fight that matters for each lead, then mixed fights with allies. |
| I3 | Making as a loop: gather, refine, make, reforge or enchant, then wear, sell or hand in, each step linking to the next; enchanting differs by world. |
| I4 | Crossing worlds with weight: what carries across (skills, knowledge, items, debts) and why, with the crossing opened in the world. |
| I5 | The screen that grows with you: areas, the growing layout and panels that appear when first met. |
| I6 | Knowing as play: "?", rumours and wrong estimates beyond fights (prices, intentions, recipes, maps), each with a route to learn. |
| I7 | An unusual life: a second-order role (a raised Gu, Klein's informant, a house-elf) on the same screens with a very different day. |

Questions: Q1 which lead feels complete first, or all three evenly; Q2 deeper leads or a fourth world to prove the systems carry; Q3 new features or cohesion on what exists.

## Codex review of the Gothic combat layout (2026-11-19)

**Start with [PS343 and its browser receipt](CONSIDERATIONS.md#ps343--a-shared-opponent-section-for-the-cave-and-the-road-contest).** Review the shared opponent layout and recommend the smallest improvement that makes both fights easier to read. This handoff is for design review. Treat proposed changes as options for Weibao.

**Baseline.** The local shared checkout at `/Users/weiwei/code/yet-another-idle-rpg` was dirty at `96b0b8d04`. The source changes are in that working tree. Read `src/village_workspace.js` for the native roster, `src/ui/combat_versus.js` and `src/combat_situation_ui.js` for the duel, and `styles/combat_versus.css` for their shared rows. Preserve unrelated edits. The captured build used bundle `v0.6-392f9ab2b6b6` and stylesheet `v0.6-393a7e8a82c7`. The preview answered at `http://127.0.0.1:58589/` at handoff. If it has stopped, rebuild with `node prototypes/live-layout/serve.mjs --rev WORKTREE --fixture mid --text-size 21` and use its new origin. Check for drift before comparing the rebuilt UI against the captures.

**Evidence.** The four screenshots and the `native.json` and `duel.json` receipts are in `/Users/weiwei/.codex/visualizations/2026/11/18/01a1f085-3f61-7ae2-9a7e-18c7630a8478/shared-opponents/`. The local replay scripts are `/tmp/oops-shared-native.mjs` and `/tmp/oops-shared-duel.mjs`. Each takes the preview origin and an output directory. Pass `21` as the duel script's third argument. They use disposable browser profiles. The live replay verified a first wolf defeat, continued auto-fighting, Withdraw, and Rat-step after Mara became Hurt and missed. The 54 focused tests and rules check passed. The architecture check reports the existing two-line `src/main.js` overage. Product acceptance remains open.

**Review in this order.**

1. At 1920×1080 and 1800×1072 with 21px Gothic, open the four captures. Check whether you can immediately identify the surviving rat, the opponent being inspected, and the next attack. Check the defeated label and its contrast. Both names stay Wolf rat and stable positions carry identity. Keep one Withdraw and Reports next to the fight.
2. On Mara, check whether Condition, stamina, readiness, and Opening are independently readable. Exact enemy HP remains gated by what the encounter reveals. Check that Ready, the reason Rat-step is available, and the move preview read as one decision. See whether the repeated location and opponent count can make room for stronger cues.
3. Compare the default stacked roster against one genuinely different arrangement, such as a compact overview with the inspected details below. Judge what an extra row, ally, or long opponent name would cost at 21px. Keep the native continuous clock and the duel's action-by-action control. Consider a future tempo hand-back cue only where the engine knows why it stopped.

**Done when** the review gives one ranked recommendation, a concrete advantage over the current captures, and a browser acceptance check for each scene. Cite what is visible in the captures and distinguish what would require a new replay. Keep any engine merger, new disclosure rules, and cross-world rollout as later decisions.
