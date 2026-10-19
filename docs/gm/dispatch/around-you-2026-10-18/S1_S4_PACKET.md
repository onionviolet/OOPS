# Around you S1-S4: implementation packet (2026-10-18)

Status: **ready to brief; not authorized to build until Weibao says go.** It
turns the proposal into one playable slice. Rules: PIR1-PIR13, PIR23-PIR25 in
[presence and interaction rules](../../../PRESENCE_AND_INTERACTION_RULES.md)
(proposal), with the accepted UR35, UR42, UR52, UR13, AR1-AR16, AD34 and AD36.
Design owner: [Around you considerations](../../../AROUND_YOU_SUBJECT_ACTIONS_CONSIDERATIONS_2026-10-18.md).

## Outcome

Select a person or station in Around you; its verbs (Talk, Trade, Open) pin to
the top of the bottom Actions panel; Around you lists authored NPCs in every
location; "Talk to someone" and "Visit a merchant" are gone everywhere, and
nothing that used them breaks.

Target viewports: 1366×768 floor, 1920×1080 primary. Mobile deferred (AD34).

## Out of scope for this slice

Heard lines and new marks (AY14-AY27, PIR14-PIR18), ways out and travel
(AT1), events as subjects (TF4), routines and plans (ID4, LP4), the command bar
(AT9). Each is a later slice. Do not add a save slice in this one.

## Seams (current code, 2026-10-18)

| Area | Where | Change |
|---|---|---|
| Legacy dropdowns | `src/display.js` around 2475-2505 (talk, trade dropdowns) and `create_location_choices` categories `talk`/`trade` around 2622-2670 | Stop creating the two dropdowns when the shell presentation owns presence. Keep `create_location_choices` itself if other callers use it |
| People source | `src/main.js` `createVillageWorkspace({read})` near 10120: `authored` people are gated by `inVillage` | Lift the gate for authored NPCs at every location of the current world, using the same display check (`canBeDisplayed` on NPC and dialogue component). Keep traveler logic Village-only as it is |
| Verb dispatch | same `act` handler: `talk:<id>` calls `start_dialogue`; travelers open their panel | Add `trade:<id>` calling `window.startTrade(id)` for `tags.trader` NPCs that `canBeTradedWith`. One function per verb (PIR8) |
| Subject verbs location | `src/nearby_context_view.js` renders `actions` inside the top detail card; `src/village_workspace.js` has a bottom `groups` "Actions:" row that is hidden in parity mode | In shell mode render the selected subject's verbs in the bottom scene (pinned above place verbs) and drop them from the top card (PIR7). The top card keeps facts and Back |
| Empty selection hint | bottom scene | One quiet line when nothing is selected: "Pick someone or something above to talk, trade or use it" (S2) |
| Count bug | `src/models/npc.js` `getAvailableActions` iterates textlines and indexes `actions[actions]` | Iterate `getActions()` and index by key. Any count consumer then sees real actions |
| Text naming the dropdown | `src/absorb_c2/local_life.js` (elder message) and `src/main.js` near 1587 (moon bed hint) | Name the person in Around you instead (PIR24) |
| Player notice | log | One-time log line on first load after the change: talking and trading moved to Around you and Actions (UR13) |
| Browser scripts | 21 files in `scripts/*_browser.cjs` click "Talk to someone" or "Visit a merchant" and then `[data-dialogue=...]` | Add one shared helper (for example `scripts/lib/talk_to.cjs`: select the subject in Around you, click its Talk or Trade verb) and move every script to it in the same change (PIR24) |

`main.js` stays a composition root (AR): new logic lands in the workspace or
nearby view modules, at most one registration line in `main.js`.

## Failure scenario to guard

On a populated save in the Village, the elder is selected, the player starts a
job, then clicks Talk. Expected: Talk shows its busy reason (or names what it
interrupts), selection stays on the elder through ticks, and after the
conversation ends the elder is still selected with Talk ready (PIR9, PIR12,
PIR13). In the slums, the old woman appears in Around you and Talk starts her
dialogue; no "Talk to someone" control exists anywhere.

## Checks (AD36)

1. Focused while editing: `node --test tests/nearby_context_view.test.js tests/village_workspace.test.js tests/npc_lives.test.js`.
   Extend `village_workspace.test.js` with one regression: a selected subject's
   verbs render in the bottom scene and not in the top card, and selection
   survives a re-render with an unchanged frame.
2. Add one unit test for the fixed `getAvailableActions` count.
3. Completion gates: `npm run build`, `npm test`, `npm run check:arch`,
   `npm run check:rules`.
4. Browser, rebuilt bundle, fresh origin, at 1366×768 and 1920×1080 on a
   populated save: Village (elder, trader: Talk, Trade, back), one non-Village
   town (slums or farm), a busy-state attempt, and Esc/Leave return. Screenshot
   each viewport.
5. Run the migrated browser scripts that exercise dialogue (at least
   `people_browser`, `pursuit_browser`, `party_browser`, `lp5_browser`) and
   record which of the 21 were run.

Record commands, input identity, results and gaps in this folder's
`CHECKPOINT.md`. Anything not exercised is implemented-unverified.

## Done check

- No `Talk to someone` or `Visit a merchant` text in `src/` or `scripts/`.
- Around you lists authored NPCs outside the Village.
- Subject verbs appear only in the bottom panel in shell mode.
- All gates above pass, with screenshots at both viewports.
- Commit own paths under shared-worktree practice; push waits for Weibao.

## Suggested executor

One implementation session (mid-to-high capability, about one day including
the 21 script migrations). One writer for `src/village_workspace.js`,
`src/nearby_context_view.js`, `src/display.js` dropdown section and the
browser scripts during the slice.

## Domain rule note, 2026-10-19

The Trade verb touches economy only as a route. With the domain rulebooks accepted
2026-10-19, the slice keeps `startTrade` as the one trade function (PIR8) and adds
no money path (ECR16). A trader who cannot trade now shows the verb with its
reason (PIR9), which is also ECR32's "a merchant who can't buy says why". No
ECR, CBR, BHR or SLR change to the packet's scope or done check.
