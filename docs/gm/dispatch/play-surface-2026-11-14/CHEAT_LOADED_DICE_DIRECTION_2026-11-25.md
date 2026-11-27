# Loaded Dice: choose the direction

| Preflight | Scope |
| --- | --- |
| Reading | Flesh out a separate existing cheat by adding a real choice to its existing native consumer; preserve the opening-insight work. |
| Authority | User's new separate-cheat implementation instruction through coordinator; [CHT4/CHT8/CHT12/CHT19](../../../CHEAT_RULES.md), [AD38/AD55/AD56 and AD36/AD43](../../../RULES_INDEX.md), [AR2–AR8](../../../ARCHITECTURE_RULES.md). |
| Player sentence | “Commit next loot roll high · 1 charge” or the existing low roll. The queued direction stays visible until the next loot decision uses it. |
| Ordinary route | No call uses the unchanged native draw. Low values favor chance-based drops; some material traits favor high values. Neither direction is a promise that every consumer improves. |
| Mechanism | Existing Loaded Dice arms the existing world-scoped loot stream. Choose low0 or the highest native32-bit unit value. Existing charge, pending-call, keyed replay and writer owners still apply. |
| Fit | Existing Loaded Dice implementation and `seeded_streams` transport already support a chosen finite unit value. Existing native carcass draw and processed-part quality are the sampled downstream consumer. No RNG engine, CCG, enemy change or new save slice. |
| Comparison | Pattern Book currently recognizes one method; widening its law/reference admission needs more making ownership. Patient Furnace is more developed and changing its clock control would touch shared time. Loaded Dice's low-only action already reaches native consumers with opposing value directions. |
| UI | Existing Loaded Dice card,1920×1080 plus1536×864 at14/21px. One added high button and explicit pending feedback; no new surface, mobile deferred. |
| Voice | Same-surface sample: “Commit next loot roll low · 1 charge.” Player text names the roll, cost and saved pending state without revealing hidden specimen traits. |
| Compatibility | Existing card state and saved stream calls unchanged. Missing command direction remains low. Existing saved pending values remain valid and execute unchanged under [AR6](../../../ARCHITECTURE_RULES.md). |
| Files | New cheat_loaded_dice leaf; call/projection hunks in cheat_mechanisms, Loaded Dice DOM hunk in cheat_ui, its description in cheat_definitions; focused tests/native proof/own receipt. No Atlas, catalogue, main, Tingen, RNG-owner or default-build edits. |
| Failures/checks | Invalid direction, depleted reserve, duplicate pending call, failed commit, legacy low call, keyed replay, foreign-world draw and native before/after persistence. |

Status: implemented and agent-verified on the isolated and final normal builds below. This is an authored extension to an existing original mechanic, not a new canon claim or universal cheat restriction. No prior receipt or normal bundle was overwritten by this lane.

## Delivered behavior and comparison

The existing Loaded Dice card now offers LOW and HIGH at the same one-charge price. Its pending direction stays visible and both call buttons are disabled while that world has a queued call. HIGH uses the largest native 32-bit unit value below 1; the native stream and downstream consumers remain unchanged. Chance-based drops can favor LOW, while some physical material traits favor HIGH. No counter, enemy adjustment, luck debt or forced weakness was added.

The declared fixture grants a held card to an otherwise fresh native life. It does not prove acquisition of Loaded Dice. Each branch earns the same elder sword and field access through existing dialogue, equips that weapon, fights the actual field enemy and uses the existing “Take only pelt” action. Body, tool, enemy and work are unchanged; all three fights take nine native ticks. The native UI and inventory show one damaged Rat pelt in each branch:

| Choice | Pelt quality | Charge accounting | Override receipts |
| --- | --- | --- | --- |
| Ordinary, no call | 75% | 2 remaining, 0 used | 0 |
| LOW | 70% | 1 remaining, 1 used | 1 |
| HIGH | 80% | 1 remaining, 1 used | 1 |

Save, reload, native Export and fresh-context Import preserve the queued call, the working processing job and the completed result. HIGH additionally rejects a deliberately failed native storage write without spending or queuing, then succeeds once on retry. No raw specimen traits or private story saves are retained in public evidence.

## Checks and evidence

| Check | Result and scope |
| --- | --- |
| `node --test tests/cheat_loaded_dice.test.js tests/cheat_mechanisms.test.js tests/cheat_starting_insight.test.js` | Final PASS 23/23, zero skipped. Preserves the opening-insight and existing mechanism tests. |
| `node --test tests/cheat_loaded_dice.test.js` | PASS 5/5 on the final test file: direction validation, old request/save compatibility, genuine harvest quality, reserve/replay/world ownership, failed writer and Fate Ledger primitive compatibility. The latter is not a claim of native Fate forecasting UI coverage. |
| `BUILD_OUT=.lane-builds/cheat-loaded-dice-20261125 npm run build` | PASS; isolated bundle `ee41b923e2510bafcd2736c3568907e1d6b0e2cc02e783b8a56bcf57bf19ecec`. Four runtime files match their built source bytes in [source identity](../../../representations/evidence/cheat-loaded-dice-2026-11-25/source-identity.json). |
| `node tests/cheat_loaded_dice_browser.mjs` with that exact expected hash | PASS; [native proof](../../../representations/evidence/cheat-loaded-dice-2026-11-25/proof.json), [run log](../../../representations/evidence/cheat-loaded-dice-2026-11-25/run.log). Ordinary was completed on the first invocation and reused on identical pinned bytes; LOW/HIGH were rerun after correcting proof-only receipt-field and scoped-stream assertions. The initial failing receipt probe is retained separately, not described as a runtime fix. |
| `npm run check:arch` | PASS; existing grandfathered architecture baseline retained. |
| `npm run check:rules` | PASS with existing warnings. |
| `npm run check:docs` | PASS after final receipt update. |

Desktop screenshots were inspected at 1920×1080 and 1536×864, including 21px text. The pending cost/direction and both buttons remain readable; the actual processing result and held graded item are visible. The browser runner checks button clipping and records page errors; final isolated `errors` is empty.

Runtime ownership is released after these four files: `src/cheat_loaded_dice.js`, and narrow Loaded Dice hunks in `src/cheat_mechanisms.js`, `src/cheat_ui.js`, `src/cheat_definitions.js`. Legacy calls without direction remain LOW; existing arbitrary valid pending numeric calls remain unchanged and display “Chosen”. There is no save migration. The lane retains its cited isolated candidate and evidence for integration. Native runner closes its owned browser/server in `finally`; normal integration and the wave-wide full gate belong to the coordinator. Agent-verified, not human-reviewed.

## Final normal adoption

The coordinator's final normal bundle is `06758b45d2e5de05aa4e2cb6819e7cc8dc757188e73f4d51fa8dceb34b791634`. Its [source identity](../../../representations/evidence/cheat-loaded-dice-normal-2026-11-25/source-identity.json) verifies the four Loaded Dice files against actual normal source-map bytes. No runtime files changed for this replay.

The first normal invocation completed ordinary and LOW, including all three persistence checkpoints, then timed out while Playwright waited for HIGH's panel to become stable for scrolling. Its [timeout log](../../../representations/evidence/cheat-loaded-dice-normal-2026-11-25/scroll-timeout.log) is retained. The coordinator confirmed competing full-suite and two Tingen browser runs. The runner closed before retry. The bounded HIGH retry retains all assertions/timeouts and reuses only completed separate ordinary/LOW proofs after checking their exact bundle, successful case and empty errors. The timeout is not described as a runtime defect or fixed by runtime edits.

Final command: `CHEAT_EXPECTED_BUNDLE=06758b45d2e5de05aa4e2cb6819e7cc8dc757188e73f4d51fa8dceb34b791634 CHEAT_DICE_CASES=high node tests/cheat_loaded_dice_browser.mjs . docs/representations/evidence/cheat-loaded-dice-normal-2026-11-25`.

PASS, exit0. The [normal native proof](../../../representations/evidence/cheat-loaded-dice-normal-2026-11-25/proof.json) pins both disk and served bytes to that exact hash, reproduces the 75/70/80 comparison above and records zero page errors. HIGH's failed-write/retry and all pending/working/used persistence checks passed. Its [successful run log](../../../representations/evidence/cheat-loaded-dice-normal-2026-11-25/run.log) is distinct from the retained timeout log. Browser/server closed through the runner's `finally`; no temporary exported save remains. Normal source adoption is verified; wave-wide full suite remains coordinator-owned.

### Ordinary acquisition directions in the Atlas, 2026-11-26

The Loaded Dice Workbench card now explains the route from fresh default play. Take and equip the elder’s sword, fight in the Infested field, retain earned insight in Continuing Insight, then develop True Appraisal followed by Loaded Dice. A 1920×1080 built-in-browser check confirmed the ordinary acquisition instructions and the separately labeled held-card use comparison. The [ordinary opening receipt](../../../representations/evidence/cheat-starting-insight-normal-2026-11-25/ordinary-proof.json) was earned on b691. The comparison on 06758 starts with the held card. Neither receipt establishes an end-to-end run on the current efcf build.

On the efcf175d game build, a fresh ordinary Village life earned two insights and developed True Appraisal in native headless play. The built-in desktop browser loaded that earned save at day-one 08:42 with one insight unspent. Spending it on the unnamed next facet revealed Loaded Dice and both LOW/HIGH buttons. Calling HIGH consumed one of its two charges. The native exported save contained the HIGH endpoint on the frontier loot stream with one charge left. This run stops at committing the call. [Current acquisition and queued call](../../../representations/evidence/cheat-loaded-dice-normal-2026-11-25/ordinary-acquisition-2026-11-26.json).

### Earned-save consumption and Atlas receipt, 2026-11-26

The [compact continuation receipt](../../../representations/evidence/cheat-loaded-dice-normal-2026-11-25/earned-consumption-2026-11-26.json), SHA-256 `3472d3b0d1a7c932dd5f3542e5d525e008e4b6d10ec06c071b5f2ac4c41263b7`, follows that earned state through actual native combat and pelt work in separate matched headless cases. HIGH imports the desktop queued-call export; no-call and LOW develop Loaded Dice from the same pre-development checkpoint. No save contents or specimen lineage are published. The public summary was checked for raw save envelopes and private paths, then copied byte-for-byte without replacing the private original.

| Earned continuation | Pelt quality | Count and condition | Call cost |
| --- | --- | --- | --- |
| No call | 75% | One scrap pelt, integrity 35 | No reserve spent |
| LOW | 70% | One scrap pelt, integrity 35 | One reserve |
| HIGH | 80% | One scrap pelt, integrity 35 | One reserve |

Each case took 26 fighting ticks with the same skill and tool. The first loot decision was the carcass specimen draw, not a direct chance-based item drop. HIGH improved this material-quality result but did not undo battle damage; no universally favorable outcome follows.

Scope is narrower than a clean combined run. Case assertions, saved outputs and native-file encode/decode passed. The process ended exit 1 at its final whole-tree source guard after concurrent unrelated edits. The summary retains the initial mapped-source difference, later source drift and eleven unchanged relevant consumers. This is a native headless measurement, not browser consumption or reload/import acceptance, and not a passed whole-run verification. Its actual executed headless bundle is `df6cfe6cfb58ba0ce6d598910f98cf906d1c8f476ceaf3c5913c724d52c1709f`; `db58757be1df194ac5193c357d176c71eec4f235ff831065038d8913342b57a1` is the separately qualified normal-build reference. Neither replaces the earlier efcf desktop development/queue evidence.

The existing Atlas card at `#workbench/play-evidence/loaded-dice` now distinguishes those two November 26 receipts from historical b691 ordinary acquisition and the 06758 held-card comparison. Its metadata uses the actual headless execution hash, preserving a different-build label instead of treating the reference normal build as executed browser evidence. The card states the guard caveat and keeps browser persistence claims attached to the older comparison.

The coordinator verified that updated card in the hidden built-in desktop browser at 1920×1080 on served checkout `fb7b7f08`. Focus landed on the Loaded Dice heading; Enter expanded the earned-consumption receipt, which displayed matching SHA `3472d3b0…`, headless hash `df6cfe6c…` and the whole-run guard caveat, visibly separated from the desktop queue receipt. This is Atlas rendering/navigation verification, not another gameplay consumption run. No browser was launched by the evidence-model lane.

Focused evidence-model checks: `node --test tests/atlas_native_evidence.test.js` passed 11/11. They cover the actual thirteen registered receipt references, desktop development/charge accounting, matched normal/LOW/HIGH inputs and results, wrong execution-build substitution, missing relevant-source comparisons, undisclosed relevant drift and attempted removal of the guard qualification. Module syntax and scoped whitespace checks passed. Model SHA-256 `6510d5411f342baf05ba662cf51102e72bbeda3381ff3fc5ad9ba9d8f94afed5` and test SHA-256 `ca10e3d01f146466e360b9769b91340fbe55b53c7fc27d17cb88931095e78138` identify the checked source. No full suite, native rebuild or commit was run by this lane.

### Completed-call feedback: desktop verification, 2026-11-26

The coordinator verified the gameplay feedback in the built-in browser at 1920×1080 on served bundle `032ce64baa27998214069396b6dc7559db19cfe003d516498a12c29e056dfec4`. The genuine earned HIGH-after save, SHA-256 `6e3a031d7b40f5e69b88a6b55fd6742e4b0618cb7ca82238f243278c84441ca7`, was loaded through normal PLAY, then Continuing insight → Explore. The Loaded Dice card visibly showed “Completed call: High · Wolf rat carcass.” and “Processed result: 1 Rat pelt, scraps, quality 80%.” This imports the earned continuation's completed result; it does not repeat combat in this browser run.

The coordinator then committed LOW using the remaining charge. The LOW queued message appeared, the previous HIGH result remained visible beside it, and both call buttons were disabled. This verifies queued and completed feedback together. It does not extend this desktop check into another consumed LOW outcome or a new save/reload/import claim; those earlier checks retain their own inputs and scope above.

The feedback is a read-only projection of current-world consumed-call records already retained by the stream owner. One completed call is shown without claiming recency. An exact match to a held carcass, working specimen or settled harvest result supplies the subject; otherwise the line says “a loot decision here.” Processed output is shown only for that same settled specimen. The projection neither draws randomness nor exposes raw keys, hidden traits, the ordinary alternative roll or a future result. Save shape, charge accounting and mechanics are unchanged.

Focused command `node --test tests/cheat_loaded_dice_feedback.test.js tests/cheat_loaded_dice.test.js tests/cheat_mechanisms.test.js tests/cheat_starting_insight.test.js` passed 27/27. The four feedback regressions cover consumption rather than queue attribution, immutable reads, durable records after audit-log rollover, keyed replay, queued/completed coexistence, JSON reload, exact settled-result matching, legacy records and world isolation. A separate pure-projection check on the genuine HIGH-after save returned the displayed result without changing the save or RNG state. `npm run check:arch` and `npm run check:rules` passed with existing warnings. The coordinator owns the build and desktop verification; this lane launched no browser or default build. Agent-verified, not human-reviewed.
