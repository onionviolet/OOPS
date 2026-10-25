# C2 playtest: Mistglass cultivation

Status: complete for the routes exposed by the committed test tree. Input runtime source: `6f928fb9523f41ce21c8140461ba39d81ecc7a52`, driven through the isolated C2 stdio server with harness instrumentation. These are MCP text/play results, not desktop or human acceptance. The newer primary cultivation additions were uncommitted and are not represented in this C2 build.

Applied: AD6–AD8, AD22, AD32, AD34, AD36, AR3, AR7–AR8, AU1–AU7, MR1–MR7, MR10–MR12, MR16–MR22, MR27–MR32.

## Coverage

| Area | Coverage | State |
|---|---|---|
| Entry and opt-in | Fresh seed `251043`; elder hello; one minute; Options → Iona ledger enrollment → More panels → Projects → Mistglass. Entered at Day 1 08:01. Scoped panel showed the explicit opt-in Learn control. | Exercised. |
| Condensation and method practice | Learned the conservatory method, selected Threaded-breath circulation, then played 60 + 240 minutes. At Day 1 13:01 the panel showed `Condensate: 10 / 10`, conservatory mist `+0.25 per played minute`, and Threaded-breath `Integrated · 48 practiced minutes`. | Exercised. |
| Vessel geometry | No vessel-geometry controls appeared in the reachable 13-action Mistglass panel. It exposed a path reserve, path-specific hide actions, the outflow brace, and cultivation methods. | Not exposed in this committed build; newer primary work is outside this runtime identity. |
| Seedbed and brood | No seedbed or brood controls appeared in the reachable Mistglass panel. | Not exposed in this committed build; newer primary work is outside this runtime identity. |
| Formulation and medicine | Bought one of four keeper-stock Cloudseed doses for 3 coins through the native Trade flow. The dose appeared in inventory. No Mistglass formulation recipe appeared in the panel. | Dose acquisition exercised; formulation unverified. |
| Sluice / standing | Cleared the jammed outflow using 1.6 condensate after Threaded-breath integration; the panel said it earns Village standing and the sluice silts again after 60 played minutes. | Exercised. |
| Purification trial | Panel described a 12-minute trial costing one paid Cloudseed dose and 2 condensate. Its control was gated with `Learn native Meditation first.` The Village Find work list offered patrol only; `panel:'skills'` was not an available native More panels option. | Blocked for this journey; no trial result claimed. |
| Save / export / reload | `game_save` returned hash `65e0dd4cb8fe6106`; exported `/var/folders/xb/njlqv84d65zbhd229mkw85zh0000gn/T/yairpg-mcp/save-0362e96f-dd9d-4fe7-88eb-446b7d5dea92.txt`; `game_load({path})` returned Day 1 13:01, Mistglass conservatory. The loaded view retained the Cloudseed dose; reopening the Mistglass panel showed the cleared sluice and cultivated state. | Passed for this reached state. |

### Finding

**CMC1: Purification trial lacks a reachable Meditation-learning step in this Village journey (blocker for trial coverage).**

- Repro from fresh: `game_new({seed:251043})`; elder hello → center Back → `game_step({minutes:1})` → place Options → Iona ledger → Follow local people and work → More panels Projects → Optional projects → Mistglass → Enter → Learn method → Threaded-breath circulation. Step 60 then 240 minutes, buy one Cloudseed dose from the keeper and inspect the trial gate. Exit to Village, select Here and inspect `#location_actions_div`, Find work and `.choice_train`. The follow-up repeated the Village checks by resuming the exported state with `game_new({path})`; its exact export path is in the coverage table.
- Expected: a player-visible way to satisfy the panel's native Meditation prerequisite during this journey, or a clear route to that prerequisite.
- Observed: the trial says `Learn native Meditation first.` In the actual Village view the action list has only Move somewhere else, Talk to someone, Find work and Mix at the Village counter; Find work offers patrol. `game_look({scope:'.choice_train'})` returns `No view for .choice_train`, and `game_click({key:'.choice_train'})` returns `No element for .choice_train`. No Sit down and meditate action was available to try. The source defines a Village meditating activity, but that source presence did not expose a player action in this runtime. I left the trial unstarted; no failure/result was inferred.
- Severity: blocker for exercising the trial in this bounded journey. This does not establish that Meditation is unavailable elsewhere in the game.
- Receipt: `/tmp/c2-mist-session.jsonl` and `/tmp/c2-mist-resume.jsonl`.

What felt good: the player can see condensate, the active method's practice stage, and the outflow duty in one panel. Played time carried the method to an integrated state and improved the sluice cost from 2 to 1.6 condensate; the panel then explained the 60-minute resilt interval.

## Receipts and boundary

- `/tmp/c2-mist-session.jsonl`: incremental player-facing calls/results, including the full route, cultivation steps, trade, save/export/load and post-load views.
- `/tmp/c2-mist-resume.jsonl`: resumed the exported save, exited Mistglass and checked the actual Village training group. The train group and meditation action were absent from the visible player route.
- `/tmp/c2-mist-transcript.jsonl` and `/tmp/c2-mist-route.log`: earlier entry-route receipts.
- No debug state injections or raw save reads. No `game_report_limit` call was needed. Source reads clarified the existing native Meditation gate only; they are not gameplay coverage.
- Desktop viewport visibility and human acceptance remain open.
