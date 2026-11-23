# Claude work follow-up, November 23, 2026

| Preflight | Scope |
| --- | --- |
| Reading | Reconcile the recent OOPS Claude handoffs against the shared checkout and resume approved work that had stopped. |
| Authority | Weibao asked to “follow up on all of work from claude”. Prior directions included “go ahead” on dark Graphite and “Start with $40” on the reading campaign. |
| Ordinary route and player result | A returning player sees Graphite and can still select their earlier looks under Display › Look. A full profile list keeps its current look if it has no stock Graphite profile. Reports should show combat loot with item colour and no new text. |
| Mechanism and fit | The existing customization-profile migration and save entry points own Graphite. The fight-card worktree's Reports decorator owns colour and reads the item named by combat. |
| Ring and rules | Profile migration, save/reload/import, Reports rendering and existing reading budget and quality gates. AD36, AD43, AR6, UR178. |
| Files | Main checkout's customization profile owner and tests, this report, and a bounded Reports fix in the fight-card checkout. The reading resume uses its original approved plans. |
| Failure scenarios | An edited inactive Default disappears, the capped profile list loses a look, or loot decoration throws during rendering. Exercise those cases before reporting results. |

## Intake scope

Current Git base `1cd57c79a`, with `origin/master` at `bbdf44102` when inspected.
The primary checkout and several alternate worktrees contain outstanding edits.
Reviewed recent OOPS Claude project transcript tails from November 18–22, the
November 11 resume record, current play-surface and foundation handoff sections,
the reading launch record and logs, and live refs and worktree status. Transcript
claims were compared against source, branch history or receipts where they
affected a follow-up. Older chats outside the active handoffs, private saves,
source book contents and generated images were outside this pass.

## Branches and owner queues

| ID | Work | Current disposition |
| --- | --- | --- |
| F1 | Effect wave and tooling | `cd31c726d` (director cards), `261f1180a` (ordinary entry points), `e841598a8` (merge friction) and `c5954389b` (interaction oracle) are all ancestors of `master`. The November 22 Claude reply listing four waiting branches is stale. JoJo readers and the timeline documentation tip are also ancestors. The oracle's model answers are research evidence. The director-card receipt still records FLR4 open. |
| F2 | Play-surface coordinator and Klein | `0519d56b4` and its browser bundle `ad35e8ba5` are ancestors of `master`. The stranded-at-the-club item from the earlier stop message was resolved by Wave 22. The old Skills first pass, the enchanting-bench handoff and the surface mapping commits are also present. The [coordinator handoff](../gm/dispatch/play-surface-2026-11-14/COORDINATOR_HANDOFF.md) and [play-surface queue](../gm/dispatch/play-surface-2026-11-14/HANDOFF.md) own the remaining journeys, trade, feature coverage and presentation work. The native F34 multi-target loot notification remains in the queue. |
| F3 | Here panel HR1–HR6 | `claude/here-panel-041ae8` at `8ac33b48a` is two commits outside `master`. Its focused tests pass 13/13 in that worktree. The source patch conflicts with current edits in `src/nearby_context_view.js` and `styles/nearby_context_view.css`. The next integration needs to preserve the current place context and the new rows, actions and Back focus in a combined browser walk. |
| F4 | Crowd UI, fight endings, consumables and away time | The earlier playable crowd-front slice is on `master` through `c44eab8dd`. The later no-split pack and away-time commits `c5a5c54f5` and `8d0ab4a1a`, FCD display `bf0d53811`, FCD consumables `b2631d72b`, and the combined fight-card line through `12c189066` remain outside it. The latter branches carry the shared checkout snapshot `3dcdc6d3b`; integrate owned changes individually. The fight scene, alternate pack bars and forge method worktrees are comparison mocks. Q4's defeat wake-up destination remains with the RI pack owner. New integrations still require AD43 on the combined candidate. |
| F5 | World atlas and generated identities | The world-first atlas and making/reading views are on `master` and are covered by 24 focused atlas tests in this pass. Candidate recompilation stays opt-in and live journey and household rows are retained per `708d0df0b`. The [atlas ideaboard](../research/WORLD_ATLAS_IDEABOARD_2026-11-22.md) owns further WA proposals. [Generated identities and external pressure](../research/GAMEPLAY_LOOPS_AND_WORLD_IDEAS_2026-10-26.md#new-identities-in-the-same-world-and-timeline-without-endless-authoring-2026-11-22) remain design work. The carrier rules answer death/loop Q1 and Q2, and the default world-pressure choice is still open. |

## Interrupted work resumed

| ID | Work | Result and remaining gate |
| --- | --- | --- |
| F6 | Dark Graphite, DK1/DK2 | Fixed a migration that could overwrite an edited inactive Default or evict a profile at the 20-profile cap. The current behavior reuses an existing stock Graphite profile, creates one if a slot is free, and keeps the current look if every slot is occupied by a customized profile. Both legacy looks survived the fresh-browser migration, save, reload, Export and Import on a second origin. Fresh Graphite was checked at 1920 and 1280. Kept as uncommitted work with the original Graphite lane in the primary checkout. |
| F7 | Reports colors, RC1–RC10 | Fixed the fight-card worktree's loot decorator. It passed a non-global regex to `String.matchAll`, which throws when an item matches. In the Fang Yuan tide-wolf fixture, loot and the Moonblade highlight rendered at 1920 and 1280. A highlight set in Settings at 1920 survived save, reload and file import. The 1280 run loaded the saved highlight to check rendering. The branch retains the approved fight-ending commits and its uncommitted Reports work. |
| F8 | Reading campaign | Reused the seven outstanding receipt IDs and relaunched the original seven drivers at 4:06 p.m. Eastern. Each collected its outstanding stage and advanced under its existing reservation. $33.77 remains the aggregate ceiling for the seven plans under Weibao's $40 authorization. The other 22 plans remain unlaunched. [Reading status](../gm/dispatch/protagonist-life-2026-10-27/READING_STATUS.md#launch-under-the-40-ceiling-november-22) owns final collection and quality disposition. |
| F9 | Phone library | Verified the Mac shelf receipt has 1,152 files and 0 missing entries, with 1,151 local EPUBs. The iPhone is paired, but usbmux reported no transport and CoreDevice could not list the KyBook folder. The additional books still need a reachable KyBook file-sharing route, followed by Readest import and grouping on the device. The earlier 248-file transfer remains the last phone-side receipt. [Phone library plan](../research/PHONE_LIBRARY_PLAN_2026-11-22.md) |
| F10 | One-line skill bars and redundant UI copy | Saved SKC1 and the UR178 rule and lint as `8fffda403` on `codex/claude-ui-followup` from clean base `1cd57c79a`. This fulfills the pending scoped commit request without folding competing changes to Display or the rules into it. PV4 remains in the draft workflow document. The later Graphite-specific spacing remains with Graphite. |

## Verification and integration gates

| Check | Evidence |
| --- | --- |
| Primary focused tests | 49 passed, including the Graphite migration regression, skills, rule lint, project shape, Klein acting and atlas. |
| Primary architecture | `npm run check:arch` exit 0. |
| Primary rules | `npm run check:rules` exit 1 on a pre-existing uncommitted household line containing “played minutes” in `src/absorb_p23/host_joins/tranche_one_ui.js:16`. Rule-index links, receipts and direction sync passed. |
| Graphite browser | Rebuilt bundle SHA-256 `96fd1426bfc3e4640885e975e3d0389cebab0783d49cb199d7ae6e8582428ac5`. Fresh start and legacy-save fixture, 1920×1080 and 1280×800, 0 page errors. The two-profile legacy save was exported and imported on a different origin. |
| Fight-card browser | Rebuilt bundle SHA-256 `2b099b30b45f1a9043127998c5230b60f437825c05afe8e9b320affce6a8e4fd`. Tide-wolf fixture, 1920×1080 and 1280×800, 0 page errors. Four focused tests passed. |
| SKC1 and UR178 candidate | Nine focused tests passed, plus `check:skill-rows`, `check:arch` and `check:rules` (exit 0 with existing warnings and private packs absent). Rebuilt bundle SHA-256 `3d1e0c618660eacc3cfc27ac6ecdc041f298103062a32620bb0a161930220929`. Public `tests/fixtures/perf/mid.json` with populated skill XP showed compact progress counts at 1920×1080 and 1280×800 with 0 page errors. |

Browser findings are agent-verified, with human visual review open.
Full wave and publication gates remain open. The two Phone Shelf commits
ahead of the recorded remote were already local before this follow-up.
Local logs and small Reports captures are in `work/claude-followup-2026-11-23/`.

## Publication follow-up

Weibao asked to commit and push the follow-up. GitHub `master` received the
Phone Shelf commits, the follow-up notes and expanded manifest in
`9f9e85ab1`, and the UR178 copy rule and lint in `2bfd5f171`. Both push
gates passed. The UR178 gate selected 19 tests and all passed.

| Candidate | Saved revision and remaining gate |
| --- | --- |
| Compact skills and Graphite | `codex/claude-ui-followup` at `ef9ea1bf9`. The candidate passed the legacy profile browser round trip. The first flow pass found an 8px Skills overflow. The final commit includes row padding in the width; the browser probe then reported zero findings at normal width and 14em. |
| Here | `codex/claude-here-followup` at `42102dad4`. The rebuilt candidate passed flow and the crowded idle ceiling. It added zero UI contract findings compared with the published base. |
| Fight, away time, and Reports | Reports is saved in its original worktree at `335eec50a`. `codex/claude-combat-followup` at `1b3ed1c2f` carries the selected source delta on public history, excluding the mixed checkout snapshot. It passed 86 focused tests, flow and the crowded idle ceiling. The rebuilt tide-wolf browser walk showed loot and highlights at 1920 and 1280, and the highlight survived save, reload and import at 1920. |

The runtime candidates stay local. Focused reproduction confirmed
`here_kinds`, `observer_view`, and `ui_contract` fail on the published base
and all three candidates. The UI contract check counted 18 findings on the
base, with 9 additional findings on the Skills and Graphite candidate and
40 on the combined combat candidate. After confirming those failures, the
queued full runs were stopped before executing. The complete runtime push
gates remain open. Logs are under `work/claude-publish-2026-11-23/`.
