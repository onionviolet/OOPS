# Village choices, 2026-10-09

Implemented the assignment and Weibao’s addendum as an original playable
proposal. The accepted principle is player choice; these authored numbers
and dialogue still await director acceptance. No commits or pushes.

## Play

In Village, complete the existing career and study loop to become a Mentor.
Ask Tessa to assign Iona, start a practiced Watchcraft patrol with the loaned
kit, then choose the terms in the native center menu before teaching.

| Choice | Honest terms | Full round payout |
|---|---|---:|
| Paid mentor, default | Post pays 10 extra for training a recruit as part of your job | 70 |
| Teach on your shift | 10 lost wages because you patrolled less; no fee to Iona | 50 |
| Time | Fresh full 120-minute unpaid teaching shift | 0 |
| Favor | No coin cost; five lesson minutes earn one owed favor | 60 |
| Free | No coin cost or obligation; five lesson minutes occupy you | 60 |

The other terms occupy five shared patrol minutes. Leaving a round afterward
before its full working period earns no wages or shift credit. Terms and the
named teacher remain in Iona’s memory, with a different line for each term.

After a Favor lesson, spend its one favor on Iona covering a two-hour Village
shift for 50 coins. It grants no player career credit. Normal solo patrols
retain their existing 10-coin career stipend. Her first solo return offers
five coins of tuition from her own stipend; accept or decline explicitly.
The answer and any transfer publish only after durable storage succeeds.

## Audit

| Finding | Existing forced answer or alternative | Result and reason |
|---|---|---|
| F1 Teaching payment | Every lesson previously withheld 10 coins | Five teaching terms, Paid mentor default. Old lessons are labeled taught on your shift. |
| F2 Study acquisition | Written notes were the only knowledge route | Added one alternative: six Village meditation minutes with Tessa, no book/coins. Learning grants knowledge only, followed by five separate practice minutes. Notes remain obtainable. |
| F3 Kit custody | Return, keep as 50-coin debt, or repay | Already offers choices; retained. Debt blocks another loan and payment does not fabricate returned-kit credit. |
| F4 Career credit | Full shift and returned equipment | Retained. The ledger measures completed work and actual return; opting out, leaving early, or keeping the kit remain possible with previewed consequences. |
| F5 Technique use | Knowledge, practice and the lantern/baton | Retained. Knowing a method differs from rehearsing it, and scanning dark lanes requires these tools in this bounded slice. |
| F6 Recruit/promotion | Assignment, promotion and solo dispatch | Already optional explicit actions. One junior and one active solo round keep this slice finite; deceased Iona is unavailable. Tuition adds the addendum’s explicit accept/decline answer. |

One additional study alternative was added beyond the teaching/tuition
requirements, within the cap of three. No world, prestige layer or XP track.

## Verification

Latest `npm test`: **268 passed, zero failures**. `npm run build`: passed.
`TEST.log` and `BUILD.log` are the receipts; `FINAL_INPUTS.json` binds source
and bundle hashes. Additive career schema 4 supports old schemas 1–3,
retaining work, custody and learning. Schema-3 teaching history migrates to
taught on your shift, with no invented favor or tuition.

Fresh-origin browser gate **passed** for every teaching choice, both tuition
answers, favor redemption, both study routes and older-schema migration.
The existing promotion and kit return/debt/payment choices also passed a
fresh-origin regression, including save/reload/import. Authoritative results are
[BROWSER.json](BROWSER.json) and [NORMAL_TIMER.json](NORMAL_TIMER.json).
The browser harness uses separate isolated contexts and generated saves,
with accelerated common native minute ticks for the choice matrix. The
normal-timer journey uses unmodified production HackTimer and completed
a full unpaid Time shift, blocking early exit even after the lesson finished.
The choice previews and persisted memory were visually inspected at desktop
size; see [visible menu](choices-menu-visible.png). The consolidated receipt
links the successful teaching, repaired study and additional regression runs
on the unchanged final source/build. Private saves
were never accessed. Initial harness fixture errors were corrected, and
the practice display typo was repaired before the final rebuild. The unread
fixture required explicitly resetting its native finished flag, rather than
simply deleting that flag. This was a fixture repair, not gameplay progress
injection during a journey.

Remaining acceptance belongs to [ACCEPTANCE_BACKLOG.md](ACCEPTANCE_BACKLOG.md).
