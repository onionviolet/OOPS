# Watchcraft play audit

2026-11-24 · Agent playtest · OOPS Village patrol

**Verdict.** I wanted to take one more shift to see what sector scanning would do. After the shift, I had 10 extra coins and a log entry about a clearer report. I did not see a finding I could investigate or a decision I could make because I knew the technique. Iona's covered shift was the first payoff that made me think about what else I could do in the Village.

## What I played

Fresh default Village life on the Mac, headless Chromium at 1920 × 1080. The game was rebuilt from the current working tree on `master` at `db24d3a92`, with existing local edits included. Bundle SHA-256 prefix `11129e5b087d0489`, seed 7. Career actions were ordinary UI clicks. The test clock advanced native game minutes. No progress was seeded. The successful run exited 0 with zero page errors and zero console errors. It covered the in-person lesson and one mentoring contract, and stopped after the covered shift and tuition offer.

| Stage | Observed outcome |
| --- | --- |
| Apprentice | Two full two-hour patrols and two kit returns. Purse 102 → 202. Tessa promoted the player to Dependable worker. |
| Learn | Six minutes with Tessa. Instruction ended automatically and the career panel showed the rehearsal button at 0/5. |
| Rehearse | At 5/5 the log announced that sector scanning could be used on a new full patrol. Meditation was still active. After leaving it, Patrol & custody pointed to Find work → Patrol and quoted 60 coins. |
| First use | Borrowing the kit automatically applied the method. The active patrol showed no Watchcraft status in the default activity view. At minute 119 the purse was still 202. At minute 120 the shift finished, the purse reached 262, the clearer report appeared in the log, and the kit became due. The work listing still quoted 50 coins. |
| Mentor | Five completed shifts and five returns opened promotion and Iona's assignment. On the sixth shift, opening Patrol & custody from workspace navigation kept the shift active and enabled the teaching terms. Using Escape first had ended it early on the previous run. |
| Favor | Five teaching minutes earned one favor. The completed teaching shift paid 60. Spending the favor sent Iona on a 120-minute covered shift. She returned with 50 coins, the player's completed-shift count stayed at six, and her tuition offer appeared. |

## Findings

- **F1 · The next action is easier to find in the ledger than during play.** The training log tells the player to go on patrol when rehearsal reaches 5/5, but the view still says Stop meditating. The player has to leave that activity and then use a separate work entry. During the patrol, the default view gives no sign that this round is using the earned technique.
- **F2 · The two surfaces disagree about pay.** The career panel correctly forecasts 60 coins with Watchcraft. The Find work listing still says 50, and the 10-coin difference appears only in the completion log and purse on the observed default route.
- **F3 · The interesting decision arrives at Mentor.** The first skilled round has the same duration and observable work as the first two rounds. Iona's terms introduce a decision about immediate pay, time and a future covered shift. The Favor route delivered the promised effect. The first report could give the player a smaller decision while that later role still has room to grow.

## Draft follow-up chat

> Playtest Watchcraft from a fresh Village life and tighten the handoff from rehearsal to first use. At 5/5, show the earned technique and a clear next action. Keep Find work, the active patrol and the completion report consistent about base pay and the Watchcraft bonus. Then investigate one small use for Tessa's first clear report, such as an optional observation the player can follow up on. Prefer an existing Village action or clue surface. Show what the player can actually do with it before proposing a wider progression change.
>
> Rebuild and replay from Apprentice through the first 60-coin payout. Capture what is visible at rehearsal completion, when the next patrol starts, and when it ends. Confirm kit return still works and Mentor still opens at five completed shifts and five returns. Record whether the follow-up is apparent from the report and whether you would take it.

Related direction: [OOPS goal discovery](../reviews/OOPS_GOAL_DISCOVERY_2026-11-24.md) · [Village loop checkpoint](../gm/dispatch/village-loop-2026-10-27/VILLAGE_LOOP_CHECKPOINT.md)
