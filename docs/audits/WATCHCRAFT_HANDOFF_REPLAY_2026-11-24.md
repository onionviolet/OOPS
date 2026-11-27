# Watchcraft handoff replay

2026-11-24 · Village patrol · Agent-verified, awaiting optional director review

At 5/5, meditation names sector scanning and offers **Finish rehearsal and find work**. It opens the existing job listing. Find work, the active patrol and Tessa’s clear report all show **50 base + 10 Watchcraft = 60 coins**.

I would follow Tessa’s first report. I could see where to go from the report text, and the existing **Local life** chip led to **Look around the well (5 min)**. The scrap made the report feel useful and the search had a small cost. I would take the lead once, then return the kit. The **Open Actions** button appears when interacting with the report and lands in the same Actions view as the Local life chip.

| Moment | What the player saw |
|---|---|
| Rehearsal | “Watchcraft earned · Sector scanning rehearsed 5/5” and “Finish rehearsal and find work.” [Meditation](../representations/evidence/watchcraft-handoff-2026-11-24/rehearsal.png) |
| Find work | “Take a loaned kit and patrol with Tessa,” two hours, 50 base + 10 Watchcraft = 60 coins. [Job listing](../representations/evidence/watchcraft-handoff-2026-11-24/work.png) |
| Start | “Sector scanning in use” and the 60-coin breakdown. The activity warns that stopping early forfeits the round's pay. [Active patrol](../representations/evidence/watchcraft-handoff-2026-11-24/active.png) |
| Finish | Tessa’s clear report shows the wage split, marks linen by the well and names Local life. The purse stays at 202 through minute 119, reaches 262 at minute 120, and the lantern and baton become due. [Clear report](../representations/evidence/watchcraft-handoff-2026-11-24/report.png) |
| Follow-up | Local life offers the existing search at the marked spot. I had the same inventory at minute 4 and one additional Linen cloth at minute 5. The search stopped, the row changed to “Nothing left to find,” and the purse stayed at 262. [Search choice](../representations/evidence/watchcraft-handoff-2026-11-24/well-lead.png) · [Find](../representations/evidence/watchcraft-handoff-2026-11-24/follow-up.png) |

Kit return worked after the follow-up. After shift five, promotion stayed disabled until I returned kit five. Tessa then promoted me to Mentor and offered Iona’s assignment. Purse at promotion was 382. The fourth and fifth reports gave the usual wage receipt without repeating the clue. [Mentor](../representations/evidence/watchcraft-handoff-2026-11-24/mentor.png)

## Scope and receipts

The prior audit’s baseline reproduced on the dirty Mac checkout at `db24d3a92`. Watchcraft changes occupy focused hunks in native activity, pay and report presentation, the existing career and Local life owners, and their tests. The pre-existing Patrol & custody wording and Iona changes were preserved. The build used scratch output. The optional follow-up uses the one existing Village Linen cloth claim and the usual search time, including darkness. A new optional schema-4 field, `village_career.watchcraft.wellLinenLead`, records only an observation actually made on the first completed skilled round. Earlier saves that lack it keep their prior history. The existing Local life found flag prevents a second claim.

| Check | Result |
|---|---|
| FLR1 · Build | `BUILD_OUT=<scratch> npm run build` exited 0. SHA-256 `c62ebdc1b9e8139897794f5d2bf475e7d5d12a09c4297ab64af4fe652b20ac25`. Build emitted two warnings outside the edited code. |
| FLR2 · Route | Headless Chrome at 1920 × 1080, fresh loopback origin, seed 7, default Village life. All actions were UI clicks. Test hooks advanced time. Two Apprentice rounds and two returns, in-person instruction, five rehearsal minutes, first 60-coin round, follow-up, then Mentor. |
| FLR3 · Shown | Screens above show the unlocked technique, direct handoff, full-pay and early-stop terms, the search cost and the exhausted search row. |
| FLR4 · Used | Native patrol pays the bonus. Local life grants its existing Linen cloth. Patrol & custody accepts all five returns and promotes at five completed shifts and five returns. |
| FLR5 · Kept | Save, reload, Export and Import preserved the learned report lead, consumed find, Linen cloth count and career state. The first import attempt hit a Chrome network suspension. The clean replay exited 0 with zero page or console errors. |
| FLR6 · Review | Browser-verified earned route. Focused tests exited 0 with 39 passing. `npm run check:arch` exited 0. `npm run check:rules` exited 1 on a pre-existing player-text hit in `src/absorb_p23/host_joins/tranche_one_ui.js:16` (“played minutes”). Zero new hits in the Watchcraft changes. The clean-commit push gate remains the release gate. |

Added player text tells the player what the rehearsal earned and where to go, names the active technique and wage split before payout, marks the find and its route in the report, quotes the search time and confirms recovery. The regular progress bar shows time elapsed. It cannot convey any of those facts by itself. The default two-hour cost and kit custody remain visible. No further progression change was needed for this test.

Rule scope: AD36, AD41, AD43, AR1–AR16, LVR18–LVR19, PRS4/6/7/9/11, RPT, SR1–SR24, UR70–UR75 and UR178. Voice sample from the same route: “Lantern and baton accounted for. Thank you.”

Raw browser receipt, replay and bounded verification logs are in `private/evidence/watchcraft-handoff-2026-11-24/`. The item-first route and the no-historical-grant case are covered in the focused tests. Iona’s later teaching and covered shifts were outside this replay.
`npm run check:docs` exited 1 on existing document issues. All seven links in this report resolved and the report produced zero diagnostics.
