# Coordinator handoff (2026-11-16)

Weibao: "stop them and hand off and then we will have a new coordinator handle things". This page is everything a new coordinator needs to pick up the play-surface work. Start with the open-ideas list in [HANDOFF.md](HANDOFF.md). Detail lives in [CONSIDERATIONS.md](CONSIDERATIONS.md) (rounds 1–27, PS1–PS302) and [CHECKPOINT.md](CHECKPOINT.md).

## Goal being served

Weibao's standing goal for this run: "coordinate the opus chats and create new ones accordingly to flesh out UI, make it intuitive and good like the original, but absorbing all the refinements, and applying that for each individual feature from farming to others and more? Also refining combat system to account for new possibility while still being familiar? and transferring across all the worlds, Daily day to day actions? more gameplay loops?"

## State at handoff

- origin/master was e53dbd33c, pushed with a green gate (7,758 pass, 0 fail). Commits after it are listed in the last checkpoint entry. The final close gate's result is recorded there too.
- All lanes were told to stop, commit their checked work, and write their handovers.
- Weekly usage was about 12% after the 2026-11-16 reset. The usage limit resets weekly on Monday at 18:00 UTC.

## Lanes (sessions) and their handovers

| Lane | Session id | Handover |
| --- | --- | --- |
| ui-cohesion | local_db49717e-182f-4a77-a7ed-bda0e55a69f1 | side-session notes `round14-build/RESUME.md` |
| combat | local_7da0d3f3-3a8f-4677-90e3-7e7f7d8262fc | side-session notes `combat_lane_handover_2026-11-16.md` |
| feature-ui | local_7ab5da3b-1c0d-4a12-bbfa-36858f6163fc | side-session notes `FEATURE_UI_HANDOVER_2026-11-16.md` |
| daily-loops | local_4ce8289f-19bf-4d52-8257-3471ad07236c | `docs/audits/LEAD_CORE_FLOW_AUDIT_2026-11-13.md`, handover section |
| discord-features | local_fe148da4-4c42-4d85-b454-b6ca74293a1b | `docs/audits/DISCORD_FEATURES_LEDGER_2026-11-15.md`, handover section |
| feel-finish | local_23dcdde4-6c94-4605-9bb3-01ce1547b1a7 | side-session notes `feel-finish-2026-11-15.md` (done) |
| foundation-run | local_dc54e7c3-9fdc-48f2-b137-890d64805394 | `docs/gm/dispatch/foundation-run-2026-11-12/RUN.md` resume block |
| ui-drafting | local_5b231626-8cbd-4087-861e-9bdc94b95fb5 | `docs/audits/UI_SURFACE_COVERAGE_2026-11-15.md` resume line (done) |
| pusher | local_2ce54229-0a31-4c4b-b62b-bf017aac2437 | Runs landing gates and pushes. It holds Weibao's "work with the other chats, push accordingly". |

The side-session notes folder is `~/Library/Application Support/Claude/side-session-notes/local_3d724a92-cf7e-48eb-9a33-ca6f82990aff/`, which also holds the captures.

## How the wave ran (keep what worked)

- **Commits.** Commit only your own paths from a fresh HEAD. A pathspec commit takes the whole file from disk, so for a shared file `git apply --cached` a patch of your own lines, check `git diff --cached`, then run a bare `git commit`. Default: no stash, reset, force or `pkill -f`, because other sessions share the tree. No Co-Authored-By trailer.
- **One bundle builder.** Lanes don't commit dist/ or index.html. Before each push, the coordinator runs `sh scripts/clean_bundle.sh` from a clean HEAD and commits the bundle, then hands that hash to the pusher.
- **Gate.** The pusher checks out the hash cleanly and runs the full npm test, check:arch, check:rules, check:docs, check:flow and the bundle match, then pushes as a fast-forward. Load timeouts on the cast_* live-save tests with no failed assertion can pass with evidence; anything else goes back to the owning lane.
- **Captures.** 1920×1080, headless, named with the HEAD hash, with `resources/fonts/private` linked into scratch trees (PS293).
- **Coherence.** New boxes draw through `src/ui/kit.js`, and the style and markup ratchets in `tests/ui_style_ratchet.test.js` can fall but not rise (PS245, PS292).
- **Looks.** A look pair with no clear loser ships as a choice in LOOK_OPTIONS (`src/ui/variant.js`), with today's look as default (PS264). Classic is the original YAIR look.
- **Pacing.** Lanes check `get_usage` between slices, pause above 90% of the 5-hour window, and stop at 85% weekly.
- **Direction.** Weibao's words go in `docs/gm/USER_VISION_LOG_2026-11.md`, and rounds go in CONSIDERATIONS.

## Waiting on Weibao

- The areas build session card (task_4d3df568).
- feature-ui's bench and item-sheet layout proposal (UIC236).
- Klein's rent arrears after a move: priced at the new rent (proposed) or the old.
- daily-loops' Klein shift question and the TMR2 weekday dial.
- The ideaboard starter I1–I7 and questions Q1–Q3 at the end of HANDOFF.md.
- Trying the Look choices in play: Row style, presets, Fight log and Layout.

## Known risks

- The cast_* live-save tests run close to their 270 s timeout under load.
- The 530px bare column under column 2's content: the view tabs should follow the content (queued with ui-cohesion).
- DU38 trade waits on the item card body moving onto the kit.
