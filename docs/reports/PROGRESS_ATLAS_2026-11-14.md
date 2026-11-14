# OOPS progress atlas, November 14, 2026

**The engines and the screens are moving fast. What lags is proof and delivery of the lives that use them.** Since November 10 the checkout took about 470 commits: a procedural foundation run (Gu, creatures, potions, spells, kernel), three live fights (one per lead world), Fang Yuan's ordinary day and UI ledger rows UIC180 to UIC200. Three things stop that work from reaching a playable, re-checkable life: Klein's late saves stall headless Chrome (G18), the new day loops are proven only on private saves (PS6), and the installed app is still on a November 10 build (AT7).

Snapshot: master `2c95b5a01` (2026-11-14 17:11), 64 dirty paths from other active writers (tempo fight, contest, LOTM UI, structured packs, RUN.md). Origin is at `5869cbff7`; 36 commits are unpushed. This carries forward the [November 8 atlas](PROGRESS_ATLAS_2026-11-08.md) and the [foundation run atlas](../gm/dispatch/foundation-run-2026-11-12/PROGRESS_ATLAS.md) (E1 to E25 stay its codes). Findings are proposals (AD32) and set no priority. [Visual source](progress-atlas-2026-11-14.html).

**Inspected:** PROJECT.md, the [lead core-flow audit](../audits/LEAD_CORE_FLOW_AUDIT_2026-11-13.md) (G1 to G18, P1 to P7), the cross-world checkpoint's later sections, the [foundation run resume block](../gm/dispatch/foundation-run-2026-11-12/RUN.md#current-resume-block) and capability assignments, the [play surface checkpoint](../gm/dispatch/play-surface-2026-11-14/CHECKPOINT.md) and [considerations](../gm/dispatch/play-surface-2026-11-14/CONSIDERATIONS.md) (PS1 to PS14), the UI ledger by grep, the Tauri builds folder, git log and origin. Three reader agents extracted the owners; I rechecked G18, PS2, PS3, PS6, the installed build, the push state and the C4 cold-reader scope myself. **Not inspected:** source per system, combat rounds 30 to 32, cultivation, Frontier, Village and Mistglass, source acquisition, the 90 unchecked earned saves. No test, build or browser run for this atlas; every status is the owner's recorded evidence.

## Where things stand

Columns are independent. Built: in code. Proven: an agent-native run or score. Integrated: a lead life or the game UI consumes it. Delivered: reachable in the installed app.

| Area | Built | Proven | Integrated | Delivered | Owner |
|---|---|---|---|---|---|
| Klein, LOTM | slices to kjw49 (ch163) as earned saves | rebuilt browser to kjw42 (ch129); later slices load (G1 fix) but are not browser-proven; wage loop headless only | uses LOTM mechanisms, live brawl | app is Nov 10 build | PROJECT current focus, audit G17 and G18 |
| Fang Yuan, Gu | to ch140 verified; ch141 to 145 below floor; earned save to ch171 | ch140 browser; day loop on private saves only (PS6) | Gu care, patrols, wild Gu refine, live hunt | not in app | audit G11, play surface CHECKPOINT |
| Harry, HP | Book 1 closed (King's Cross) | rebuilt browser with save, reload, import | live duel; Spellbook; no daily loop | not in app | cross-world CHECKPOINT |
| Zorian, MoL | Arc 1 closed (ch26) | rebuilt browser | not covered by the audit | not in app | PROJECT current focus |
| Gu foundation | catalogue, refinement, activation, aperture, wild Gu, wolf tide | coverage ledger; no held-out split | one row (refine the wild Gu) | no | RUN resume block |
| Creatures | lifecycle, populations, evolution, herds | 17 computed cases | wolf tide not hooked | engine only | RUN, coverage README |
| Potions | brew law, dose, assay, generation | held-out 13 to 15 of 17 outcome on the engine | none (Klein digests by acting: backlog) | no | coverage README |
| Spells | spell law, grammar, Hogwarts pack | held-out engine matches 13 of 99; 82 cannot run | Harry duel hook is a no-op until practice rows land | native Spellbook only | coverage README |
| Crafting, chemistry, home | modules exist | worker reports only (103 crafting checks, 27 home checks), no ledger | unknown | unknown | capability assignments |
| Fights | tempo fight, kit, lead openers, contest stakes | three live fights in headless browser screenshots | one per lead world | not in app | play surface CHECKPOINT |
| UI | UIC180 to UIC200 today | check:visual, check:flow, headless 1920×1080 on fixtures | yes | not in app | UI ledger |
| Release | v0.1.0 not cut | n/a | n/a | app current build `v0.6-39a72234ba67` (Nov 10) | PROJECT release state |

## Findings

Reused codes come from their owners. New codes continue the AT series (AT1 to AT37 are in the [November 4 audit atlas](../audits/PROGRESS_ATLAS_2026-11-04.md)).

| ID | Finding | Kind | Consequence | Locator | Next check or action |
|---|---|---|---|---|---|
| AT38 | **No lead's newest work has a proof anyone can rerun from the repo.** Klein: kjw42 and kjw33 stall headless Chrome at PLAY (G18), so the wage loop, rent fix (P7) and story cast in Around you (F3) all wait. Fang Yuan: the day and wolf-fight journey tests skip without private earned saves (PS6). The fight fixtures are DEV fixtures. | Verification gap, shared cause | A green `npm test` says nothing about the three loops built this week. Klein is named the first consumer when slices resume, and he is the one lead no browser can play. | audit G18 line 143; CONSIDERATIONS PS6 | Profile one kjw42 load in headless Chrome (where the renderer spins) before any more Klein slices; add one committed DEV fixture per lead's day (PS10). |
| AT7 | **Recurs.** The installed app's current build is `v0.6-39a72234ba67` (Nov 10 23:45); `latest.json` points at a Nov 11 build; nothing newer exists in the builds folder. | Delivery gap | None of the Nov 11 to 14 work (live fights, Fang Yuan's day, UIC180 to 200) is in what Weibao opens. AD42 human review cannot start. | `~/Library/Application Support/local.yairpg.tauri/builds/` | Done the same evening: `scripts/tauri/adopt.mjs` froze `817cff0eb` as `v0.6-63fd12a38b31`; verify ran it hidden on a copy of the newest mirrored save (Nov 11): ready in 7.3 s, no errors, save kept across quit; swap set `latest.json`. The app was closed, so `current.json` moves at its next launch. Not in it: the G18 fix (uncommitted at freeze). No visible-app smoke (needs Weibao's say-so). |
| AT39 | **Engines outpace consumers.** Gu has one integrated row, creatures and the wolf tide are engine-only, potions and the spell engine reach no player (PC95), crafting, chemistry and home have no ledger. | Missing connection (accepted sequencing) | Foundations-first is Weibao's order (2026-11-11), so this is expected. The cost is that each foundation's realism is judged by held-out scores, not by play; the settlement seam into play (foundation atlas E20 to E23) is still the one shared bridge. | RUN resume block; foundation atlas E20 to E23 | No action beyond the run's order; when tie-in starts, route one existing cast through the shared settlement and save owners first. |
| AT40 | **No life gives a reason to come back tomorrow.** Klein and Harry have no repeating day (G2), skipping a day in the keeper life costs nothing (G3), and Fang Yuan's day charges hunger nobody reads (two Gu, FLR4) and finds wild Gu with no diet. | Depth gap | The idle half of an idle RPG is thin in every lead life; the new day loops do not yet compound. | audit G2, G3, FLR4; PS5 | Close FLR4 (a reader for both hungers) before adding verbs; PS5's shared day shape before Harry's timetable. |
| AT41 | **The wolf has no single owner.** Three wolf models (patrol table, wolf tide population, combat hunt) plus the keeper's ridge, and merit paid in four places. | Missing connection, cross-lane | Foundation, daily loops and combat each changed the wolf this week. Counts and pay will drift, and Weibao's wolf-parts direction cannot land cleanly. | CONSIDERATIONS PS2, PS3 | PS2 and PS3 as written: `ri_wolf_tide.js` owns the population and parts, the board is the only merit writer, a test counts merit writers. |
| AT42 | **A Gu wave cannot move a score.** No Gu held-out split exists, and the Gu counts disagree across owners (C1 37, 44, then 41; 368 against 383 kinds). | Verification gap | Gu is the deepest foundation by code, with no held-out measure of realism. | RUN resume block; CARRY_OUT tracker; coverage README | Make the split (already queued as step 2), and refresh the carry-out tracker's Gu numbers from `check:coverage`. |
| AT43 | **Owner drift.** RUN's resume block says the OR orientation supersedes engine-first and also that PC95 still applies, and still opens with "land the primary checkout first". The Tauri checkpoint stops at Nov 6. The play surface checkpoint names two combat owners. | Stale owner | A resuming agent can pick the wrong wave order or owner. | RUN.md; tauri-host CHECKPOINT; play surface CHECKPOINT | Reconcile in the owners when their writers are idle (RUN.md is dirty now). |
| AT44 | **Decisions held for Weibao are piling up.** UI directions A to F plus UIC131, UIC132, UIC152 and UIC170, UIC168, UIC175; four potion default rows with no apply route; PROCEDURAL_CORE Q1, Q2, Q3, Q5, Q7; contest ownership; a push of 36 commits. | Pending decisions | Lanes route around them; the UI directions gate the top bar and growing-screen work. | UI_DESIGN_CORE_AUDIT; RUN resume block; git | One sitting with the [UI direction mocks](../../prototypes/ui-directions-2026-11-13/index.html) clears the largest group. |
| AT45 | **Harry's Book 2 and Zorian's Arc 2 have no plan.** Both first arcs closed in rebuilt browser play. | Opportunity, deferred by order | Not a defect: foundations come first. They are the two lives with no blocker once slices resume. | PROJECT current focus | None now. |
| AT46 | **One cold-reader run, Fang Yuan only.** The C4 cold reader reached 1 of 3 goals on his own save and 3 of 3 on the keeper life; Klein's and Harry's runs stopped at load. G10 (actions in a collapsed panel) and G15 (the whole road listed) are the named causes. | Usability gap, thin evidence | Findability is unmeasured for two of three leads. | audit C4 line 35, G10, G15 | Rerun C4 on Harry's and Klein's now-loading saves after P5 lands. |

Risk carried forward: tuning any Fang Yuan day label or number moves the pack content hash and strands adopted saves unless an alias row or revision bump comes with it (audit, P3 notes).

Not a conflict: the player-is-knocked-out line (`adefbc487`, this slice) and Weibao's 2026-11-14 direction that whether a downing blow kills depends on choice and the fight's course (`2c95b5a01`) can both hold; the later direction governs the next fight slice.

## What blocks what

- G18 (late LOTM saves stall) blocks Klein's wage proof, P7 rent and F3, and blocks Klein as first consumer when slices resume. Required.
- A frozen, adopted app build (AT7) blocks any human review of this week's work. Required for review, not for agent proof (AD42).
- PS2 and PS3 (wolf owner) block Weibao's wolf-parts direction landing cleanly. Required.
- FLR4 reader and PS5 day shape help Harry's timetable and Klein's work day. Helpful.
- Gu held-out split blocks a measurable Gu wave. Required for scoring.
- The settlement seam (E20 to E23) blocks foundation tie-in into play. Required at tie-in, deferred by order.

## Next moves

**Accepted priority** (PROJECT current focus): procedural foundations first, with feature UI, the live fight across worlds and the leads' daily loops beside them (2026-11-14); other game tie-in waits; Klein and Fang Yuan resume first.

**Suggestions, ranked** (proposals, AD32):

1. AT38 / G18: find why kjw42 spins headless Chrome. It is the only blocker on the lead Weibao put first.
2. AT7: freeze and adopt a build so this week's work is playable in the app.
3. AT38 / PS6: one committed DEV fixture per lead's day, so the merge gate covers the loops.
4. AT41: give the wolf one owner before the wolf-parts change.
5. AT42: the Gu held-out split.

Later: AT40 (close FLR4 before new verbs), AT43 owner reconciliation, AT46 cold readers on Klein and Harry.
