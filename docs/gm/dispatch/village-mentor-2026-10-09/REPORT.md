# Village Mentor delivery, 2026-10-09

Mentor now teaches one recruit, Iona. Five minutes together on a practiced
Watchcraft patrol give her known/practiced progress. That completed shared
round pays 50 instead of 60 coins, with the 10-coin cost shown before teaching.
Her two-hour solo patrol pays a 10-coin career stipend, remembers her teacher
and adds one first-patrol biography. Names, fiction and balance are proposals.

## What to click

[Rebuilt preview](http://127.0.0.1:18330/). Use a separate test origin for this
[generated Mentor save](mentor-ready.txt); import it with the bottom Import
button. It contains generated prior study-proof state, no personal save.
Or reach Mentor normally and learn/practice Tessa's Watchcraft.

1. A1: In Village, **Ask Tessa to assign Iona**. Use **Find work → patrol** with practiced Watchcraft and the loaned kit.
2. A2: **Teach Iona Watchcraft**. After five game minutes she is practiced. Finish the round for 50 coins, then **Return loaned kit**. Early departure pays nothing; completed lesson minutes remain.
3. A3: **Send Iona on a solo patrol**. Stay in Village for 120 game minutes, then see the 10-coin stipend, teacher memory and first-solo entry in **Remembered years**. Further solo rounds pay without duplicating that entry.

## Checks and compatibility

`npm test`: 264/264 passed ([log](TEST.log)). `npm run build`: passed
([log](BUILD.log)). [Fresh browser journey](BROWSER.json) proves schema-2
loading, assignment quota rejection, partial lesson export/import, shared
50-coin payout, partial solo reload/import, report quota failure and safe
retry, 10-coin stipend, teacher memory, first biography and repeat solo
without duplicate entry. No browser exceptions. The harness accelerates
native ticks with Playwright clock and suppresses HackTimer only in that test.
A separate [unmodified production worker-timer journey](NORMAL_TIMER_BROWSER.json)
passed five teaching minutes, early departure with completed lesson retained,
and the full 120-minute solo round with stipend, memory and biography. No
clock patch or route interception. [Normal-timer result](normal-timer-result.png)
was visually inspected.

Career schema 3 adds an absent recruit to old schema 1/2 without changing
history, study, loan or debt. Iona's public life reuses npc_lives; her method,
teacher and patrol state stay with the career. There is one common native
minute hook, no per-NPC timer or party system. Report, stipend and biography
are staged and stored before publication. Source/build hashes: [inputs](INPUTS.json).

Private saves stayed untouched; no commits or pushes.
Remaining director review and unexercised interactions are in the
[acceptance backlog](ACCEPTANCE_BACKLOG.md). [Checkpoint](CHECKPOINT.md).
