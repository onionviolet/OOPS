# OD13–OD17 mechanic absorption

Authorized local sequence from the [Round 3 design review](../../reviews/OOPS_DESIGN_DIVERGENCE_2026-11-24.md) and [companion donor report](../../research/OOPS_EXISTING_MECHANICS_AND_DONORS_2026-11-24.md). Primary checkout began at `db24d3a92` with substantial unrelated changes. Builds use disposable origins and generated saves. The adjacent desktop UI capture is working in its own checkout. The play-surface checkpoint assigns feature UI, combat and daily-loop areas to incumbent lanes. Preserve their existing hunks and use the smallest joins into approved native owners. No commit, push, publication or further dispatch.

## Preflight

| Field | Scope |
| --- | --- |
| Reading and authority | Implement OD13, OD14, OD15, OD16 and OD17 in that order, finishing or identifying an actual dependency before moving on. Follow AD36, AD41, AD43 and accepted foundation order. |
| Player route | First gather rough wood, inspect Known uses, prepare stock at the woodworking station and use it in the next job. When empty, return through Known things. |
| Mechanism and fit | Native item discovery, recipe dependency index, item readiness and woodworking. The town's current station and exact inventory determine whether the known action can run. |
| Ring | Acquisition, first use, missing stock, saved discovery, record and station UI. |
| UI | Existing item sheet and bench. Desktop checks at 1920×1080 and 1536×864, using 14 and 21 px. |
| Making | Actual gathered log, existing material choice and woodworking result. Existing success, loss and component rules own the numbers. |
| Files | OD13 record, recipe links and the existing reference reader. Review each later slice's live owners before editing. |
| Failure and checks | A known route must reopen when the stack is gone, and it must remain hidden before discovery. Exercise both in a rebuilt browser and compare exact stock and discovery across reload and import. |
| Save compatibility | OD13 reads existing item and recipe knowledge. Its links add no fields. |
| Release gate | Separate project release and push gate in PROJECT.md. This record tracks the local gameplay checks. |

## OD13 • Discovery to first use

Baseline rebuilt browser, private origin, native elder and craftsman dialogs, generated craftsman access with optional route ore and trader access unused. Learning from the craftsman unlocked gathering and crafting. Equipping the granted axe and chopping for 60 minutes produced two Rough wood logs. Pack inspection linked to Woodworking and opened the actual Processed rough wood recipe at tier 1. Busy gathering correctly blocked the spend. Known things kept the discovery but had no recipe link of its own.

Known things → Items now uses the same recipe targets as Pack inspection. It reads existing saved discovery and unlocks without adding a save field. The rebuilt browser replay stopped gathering, crafted from two actual logs and used one processed piece to make a Simple wooden short handle. The pack had no logs left. Before discovery, the log was absent from Known things. After the last log was spent, its item record reopened the exact Woodworking recipe with a one-log shortfall and disabled Craft after loading the native save and after literal import. No page errors. Focused interaction tests passed 12/12. Local logs under `private/od13-od17/`.

## OD14 • Travel quote

The shared native quote owns both display and charge. Compare Walking, Running, low reserve and midnight at one ordinary Village exit. The proposed Village pace part reads the native stamina pool only at departure. Native stamina and clock are already saved. Below one quarter of native max stamina, walking time gains a ×1.25 factor. Carrying at least three ordinary Rough wood logs adds ×1.25. These are local tuning choices. The freight journey keeps its existing base-time terms. The exit inspection shows departure causes, elapsed time and arrival.

Rebuilt browser, generated Shack access and fixed 23:55 departure. Walking arrived 00:04 after 9 minutes, Running 00:03 after 8 with the existing stamina charge, and depleted stamina 00:07 after 12. The existing baseline depleted path took 9 minutes. In the other direction, three carried logs gave 13 minutes. Opening the actual Shack chest and depositing one log retained one in storage and two carried, and the quote and walk both became 10 minutes. The existing Shack chest provided the load decision. Focused quote checks passed 6/6. Logs under `private/od13-od17/`.

## OD15 • Bench preparation

Reuse the first-year Potions bench and its compiled procedures. Earn the recipe and materials from the existing lesson. Compare the authored off-fire and over-fire procedures from the same save, then hand in their distinct products. Recovery reads the existing procedure cursor and hand-in observation. No command or save definition changes.

The bench now reads exact carried/required ingredients, the school cauldron and fire, the saved preparation state, the flask and the last hand-in. It removes generic trade recovery wording from this view. Two rebuilt runs from the same earned class stock consumed two nettles, one fang, one slug and one quill entry each. Both used 40 minutes at the bench and 5 to hand in. Off-fire finished with the cure, hot with corrosive sludge. The off-fire route resumed from its saved simmered step after same-origin reload and literal Export/Import. The cure's lesson-side bonus is an existing consumer, verified by the focused checks. Focused HP making, lesson and procedure checks passed 23/23. Logs under `private/od13-od17/`.

## OD16 • Watchcraft livelihood

Reuse the native Find work route, timed notes and meditation, kit custody, rank and Iona's solo round and tuition. The readout should explain which next opportunity follows from the work and the missing prerequisite. Tingen's next offer is held under the active engine-first foundation order.

Fresh-life browser walkthrough earned all five completed and returned shifts. Rounds 1 and 2 opened Tessa's Dependable worker promotion and notes. A known-only third round paid 50. Five minutes of meditation rehearsed Watchcraft. Rounds 4 and 5 used the issued kit and each paid 60, opening Mentor. Teaching Iona for a favor used a full patrol. The solo round survived reload and literal Export/Import with 90 minutes left. Its completion paid 10 and Iona offered 5 from her first stipend. Accepting credited the other 5. The existing saved custody, terms and the favor were preserved. The changed view names missing practice, the next loan or kit return, and her later tuition response. Focused career checks passed 6/6.

## OD17 • Finite routine

Use the existing dossier comparison action and the existing saved finite routine. The selected command already costs two stamina and five minutes and awards four Perception XP. Its stop is Perception six. The browser fixture grants Town access, uses the actual parcel-work introduction to create its contacts, then supplies dossier eligibility and a Perception XP value 12 short of six. The ordinary bench and patrol routes remain independent.

The baseline woodcutting reproduction advanced 120 played minutes with the same draws in both paths. The only gameplay differences were Gathering mastery and Woodcutting idle counters of 8 live and 7 banked. Skill observation was coupled to a render refresh at gathering-work settlement. It now records that native award at settlement in both paths. The same 120-minute test passes with the bank debit as the sole save difference. The household fixture's unrelated hidden control remains outside this slice.

The same-clock program could admit a fourth comparison before native skill publication, using level five after the third comparison had already earned level six. The native Frontier reader now combines the live sixth-level XP threshold with the staged award when re-quoting. The local notes view only projects targeted offers for participants who exist. “Run to the next stop” uses the same engine timers from the saved program, including in a browser without test hooks. It stops when the routine reaches its limit or a waiting choice prevents continuing. The notes show finished comparisons, time played and stamina spent. At the cap they show the two unstarted repetitions and why the player should choose other work.

Three manual actions played 15 minutes, earned 12 Perception XP and spent 6 stamina before ordinary recovery. A five-repetition program was saved two minutes into its first job, loaded, exported and imported. It ran 13 more minutes, completed the same three awards and settled at the same clock, purse and final stamina. The paused program kept two unstarted repetitions. It showed the Perception six reason and another-work choice. The existing command and saved job terms were preserved.

## Local verification

- `BUILD_OUT=<temporary directory> npm run build` exited 0. All five final Chromium drivers exited 0 against bundle SHA-256 `11129e5b087d0489950014de85e2d794707e431661356bc5e7c296f4b06bf7e8`, matching the isolated build. The build directory was retired after proof. The 20 desktop screenshots and replay drivers are retained locally under `private/od13-od17/`.
- `node --test tests/{interaction_system,journey_quote,hp_lead_making,hp_lessons,making_procedure,village_career,routine_jobs,away_bank_domain,away_bank_lotm}.test.js` exited 0, 84/84. The targeted headless woodcutting comparison exited 0, 1/1, after reproducing the two original counter differences.
- Focused runtime suite exercises interaction, journey quotes, Hogwarts class and making, Watchcraft, routine jobs and the away bank. The short-hilt consumer conserves wood, both Potion branches consume their own flask, and each completed comparison charges the authored stamina once.
- Save compatibility uses the existing native item and recipe log, actor facts, exact carried stock, career slice, simulation jobs and programs. The command definitions and save schemas are unchanged. The Frontier job and program were revalidated by a real load and literal import. The unchanged selected action owner, `src/original_frontier_field_content.js`, retained its pre-edit SHA-256 `c846b931722616a7d4c5b0cb70c2a5c988525f5a9798536f82a2de3f0b5662e2`.
- Rebuilt Chromium browser runs use disposable origins. Viewports 1920×1080 and 1536×864 at 14 and 21 px. Screenshots, logs and replay drivers under `private/od13-od17/`.
- `check:arch` passed with no new cycles. `check:rules` is blocked by the existing Hearth copy in `src/absorb_p23/host_joins/tranche_one_ui.js`. `check:flow` exits 1 on two Tingen crossing focus targets outside this scope. `check:docs` exited 1 with findings outside this record. The project's separate clean release gate remains open.
- Candidate is local and agent-verified. Player acceptance and release remain separate.
