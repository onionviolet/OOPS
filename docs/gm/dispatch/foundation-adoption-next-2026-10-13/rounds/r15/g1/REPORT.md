# R15 G1 body/recovery: FA07 balm and FA18 runner

2026-10-13. Worker branch `worktree-agent-a69210d5dc7a62447` (commit
`5fca93d9`, from 4becff87); merged by root. Root saved this report from the
worker's hand-back text. Method and labels follow [the R15 brief](../BRIEF.md).

**Result.** Every open FA07 and FA18 leaf now has browser proof on rebuilt bytes.
FA18 is fully **natural**. FA07 is **seeded-native**: two Healing balms and one
log were seeded through real game code; the scrape itself came from the game's
own commands in the browser. Two small defects were fixed, each with a test.

## Setup

- Final bundle sha256 `75230b041c4b5551ec2a924d0882bb104ad2d90c92b523f9018496a976c84672`;
  the browser-loaded hash matched disk in both final runs (recorded in each evidence JSON).
- Playwright headless Chrome, 1600×1100, fresh profiles under
  `/private/tmp/r15-g1-profile-*`, served from the worktree on 127.0.0.1:19110.
- Harness: `harness.mjs` (server, browser, control port 19111), `helpers.js`
  (Save/reload, Export download, literal-file Import), `fa07-defs.js`,
  `fa07-run.js`, `fa18-run.js`. Evidence in `fa07-evidence.json` and
  `fa18-evidence.json`, with export `.txt` files and screenshots alongside.
- State comparisons read the durable save in localStorage (what Save, reload and
  Import restore). Live UI reads are recorded separately.

## FA18 runner rest consequence (natural)

Hero `TEST FIXTURE R15 G1 FA18 natural`: a new game that stayed idle in Village.
Final run in `fa18-evidence.json` (bundle 75230b04); an earlier full run on
bundle 0219035c gave the same results.

| Leaf | What was checked | Label | Result |
|---|---|---|---|
| Natural contact | Idle new game; misses at 08:18 and 08:31, runner appeared at 08:49, 102 coins | natural | PASS |
| Pending contact persistence | Save and reload while the runner waited; encounter survived, help and decline buttons shown | natural | PASS |
| Paid help | Meal: 102→97 coins, Perception 0→2 XP, runnerMealsIssued 0→1, encounter cleared; ticket button "1 left; 1 coin → 1 Stale bread" | natural | PASS |
| Ticket persistence | Save/reload, then Export, wipe origin storage, literal Import of `fa18-ticket-held-export.txt`: issued 1, used 0, 97 coins, 5 bread identical; ticket button back, no help button | natural | PASS |
| No re-mint while idle | 30 played minutes idle left tickets, coins and encounter unchanged | natural | PASS |
| Later bread purchase | Ticket used: 97→96 coins, used 0→1, Stale bread 5→6, button gone | natural | PASS |
| Native food use | Inventory [use] on Stale bread: 6→5, native Basic meal effect (Stam regen +0.5). The redeemed loaf is fungible with other Stale bread | natural | PASS |
| Positive final persistence | Save/reload, Export `fa18-final-export.txt`, wipe, literal Import: coins 96, issued/used 1/1, bread 5, Basic meal 59 identical; no ticket button | natural | PASS |
| Decline, insufficient coins, use outside Village, dead/other-world/busy refusal, legacy no-mint, failed publisher | `tests/fa18_runner_consequence.test.js` (7/7) only; one contact per game day makes repeat natural contacts slow | source | PASS (source only) |

## FA07 contextual healing balm (seeded-native)

### How the prerequisite was obtained

1. **Base.** Real browser new game `TEST FIXTURE R15 G1 FA07 balm`; talked to the
   Village elder, took the dagger, exported with the game's Export button
   (`fixture/fa07-base-new-game-export.txt`).
2. **Seed.** `fixture/generate.mjs` reuses the D1 native Node harness: real
   importSaveFile + load, `character.addToInventory` of 2 Healing balm and
   1 Rough wood log, real create_save + encodeSaveFile; a second fresh import
   confirms it (`fixture/VERIFICATION.json`, no load warnings). Ordinary play can
   produce this via Swamp trade (15% stock chance) or Alchemy; that acquisition
   was **not** done (needs Cave/Forest progress or Swamp access).
3. **Scrape (browser).** Literal Import of the fixture; Practice → Body: "Begin a
   body record", then "Shape a rough kit" (1 log + 1 coin, 3 min) gave
   body.scraped_hands until clock 24, the palm mark and 101 coins. Exported as
   `fixture/fa07-scraped-checkpoint-export.txt`; each leaf below starts from a
   literal Import of that checkpoint.

### Two harness interventions

- **Timer hold.** The dressing takes one played minute (one real second), so a
  page tick can beat the harness. For cancel, pending Save and pending Export,
  the harness clicks the real control, then clears the old page's game-loop
  timer in the same JavaScript task (like the tab closing at that instant). A
  reload restarts from the durable save. Observation, not a defect: a human has
  under a second to cancel a one-minute job.
- **Simulated full storage.** Failed-write leaves make `Storage.prototype.setItem`
  throw QuotaExceededError; the game's own error handling is under test.

### Leaves

| Leaf | What was checked | Label | Result |
|---|---|---|---|
| Obtain balm and scrape | Fixture balm 2, log 1; after the rough kit: scraped until 24, log 0, coins 101 | seeded-native (balm/log seeded; scrape native) | PASS |
| Positive effect and clock | Dress scraped palms: reserved at N, completed at N+1; scrape removed, balm 2→1; receipt cause is the job sequence; Weak healing balm 90 staged from completion (89 a minute later); tooltip "Weak healing balm 89m, Hp regen +5, Hp % regen +0.5"; palm mark and body record kept | seeded-native | PASS |
| Rest comparison | Free "Rest your hands": 3 minutes (reserved 7, due 9), clears the scrape with no balm, effect or receipt | seeded-native | PASS |
| Cancel and refund | Reserve (balm 2→1), then "Cancel work · return reserved inputs": balm back to 2, job removed, scrape kept, no receipt or effect; after reload a retry completed normally | seeded-native (timer hold) | PASS |
| Natural expiry while pending | Reserved at 23 against a scrape expiring at 24; at 24 no scrape: balm refunded to 2, no receipt, effect or job; "No current scrape to dress." | seeded-native | PASS |
| Failed write at reservation | Storage throws before the click: one write attempt; durable and live state unchanged; player saw "Your browser has no room for this life…" and "This action could not be completed…"; after reload a retry completed once | seeded-native (storage fault) | PASS |
| Failed write at completion | Reserve, then storage throws: completion write failed, game paused "Progress paused: Your browser has no room…"; durable save kept pending job and reserved balm; after reload the job completed exactly once (balm 1, effect 89, one receipt) | seeded-native (storage fault) | PASS |
| Pending Save and reload | Reserve and Save in the same task: stored save held job due N+1, balm 1, no effect; unchanged 2 s later and after reload before PLAY; completed at N+1 after PLAY | seeded-native (timer hold) | PASS |
| Pending Export and literal Import | Reserve and Export in the same task, wipe (confirmed empty), literal Import of `fa07-pending-export.txt`: matched the export; completed after PLAY | seeded-native (timer hold) | PASS |
| Completed final persistence | Save/reload, Export `fa07-completed-export.txt`, wipe, literal Import: balm 1, completion count 1, receipt cause/time and effect 89 identical across live, saved, reloaded, exported and imported; tooltip showed the effect after reload and import | seeded-native | PASS |

Source checks: `tests/contextual_balm.test.js` 15/15, including the new test below.

## Defects found and fixed

1. **Misleading treatment record** (`src/contextual_balm_host.js`): after a
   dressing the panel read "remaining: 88 played minutes before this treatment",
   but the number is the current remaining duration. Now reads "remaining now:
   N played minutes." Test in `tests/contextual_balm.test.js`.
2. **Report spam during any living-world job** (`src/main.js`, one line in
   `workLedgerContext`): the busy check called `expeditionOccupiesPlayer()`,
   which logs its reason, so every Work Ledger render during a rough kit, balm or
   rest job added "Finish your living-world work or decision first." to Reports
   (6 lines after one scrape and dressing on bundle 07d7987a). The read-only
   context now uses the silent `nativeOccupationReason()`; player actions still
   log through their own checks. Test `tests/work_ledger_busy_read.test.js`;
   browser `unrequestedBusyReportsDuringJob` 0 on bundle 75230b04. G7 made the
   identical one-line fix independently; the merge combined them cleanly.

No persistence format changed, so no migration. `npm test` 579/579 on the worker
branch.

## Still open

- FA07 natural balm acquisition (Swamp trade or Alchemy): needs combat and
  travel progress well past a short run. Every FA07 behavior leaf has
  seeded-native proof.
- FA18 negative paths (decline, refusals, failed publisher) are source-only.
- Human fiction and balance acceptance for both features is Weibao's.
