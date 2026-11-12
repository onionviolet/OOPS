# W12 stored workings return

Engine foundation complete within this lane's scope. Agent-verified, pending owning-chat review. Branch `codex/w12-stored`. All changes remain uncommitted under the worker instruction to leave review and commits to the owning Claude chat.

## Changed files

| Code | File | Result |
| --- | --- | --- |
| F1 | `src/stored_working.js` | 255 lines, all ten requested exports, one `kernel.stored@1` JSON shape. SW1-SW12 over the existing effect host and caller-owned world clock. AR1-AR16, KW5, KW10, KW12 apply. |
| F2 | `tests/fixtures/stored_workings/rows.mjs` | Four family rows, rune grammar and effect mapping, pack settings, prices, clocks, quantities and expected world values. |
| F3 | `tests/stored_working.test.js` | Sixteen mechanism tests. |
| F4 | `tests/stored_working_engine.test.js` | Four engine journeys, partition mutation guard and source isolation test. |
| F5 | `CODEX_RETURN.md` | This return and owner requests. |

Zero core-owner edits, registration lines or new cyclic edges. The starting untracked `CODEX_LANE.md` and design document remain untouched.

## Verification

| Command | Final result | Counts and gaps |
| --- | --- | --- |
| `node --test tests/stored_working.test.js tests/stored_working_engine.test.js` | PASS | 22 passed, 0 failed, 0 skipped. |
| `node --test tests/kernel_working.test.js tests/kernel_compose.test.js tests/effect_host.test.js tests/engine_world.test.js tests/rune_grammar.test.js` | PASS | 59 passed, 0 failed, 0 skipped. Existing owner files unchanged. |
| `npm run check:arch` | PASS | Exit 0, 0 errors. Existing 205 cyclic edges and six grandfathered main imports. |
| `npm run check:rules` | PASS | Exit 0. Rules index has 0 warnings, receipts have 0 problems, player text has 0 new strings. Existing warnings concern `src/book_world_hp_exams.js:14` and the absent `private_packs/**` glob. |
| `grep -n "—" src/stored_working.js tests/stored_working*.test.js tests/fixtures/stored_workings/rows.mjs` | PASS | 0 matches, grep exit 1 as expected. |

Initial focused run had 16 passes and two failures. A diagnostic repeat confirmed the same pair. The held row exposed an optional `undefined` field dropping during JSON save. Store now normalizes to plain JSON. The draught row exposed W's missing saved chain payload. The caller journal below resolves it within the allowed files. The subsequent focused runs passed, with the final expanded suite at 22/0.

Build, full-suite, browser, installed-app and human-review evidence belong to the owning run. This return establishes the requested headless engine foundation. It makes no UI or packaged gameplay claim.

## Four worked rows

Each test named below compares the complete serialized engine world, stored records, accumulated receipts, kernel working, landed hit outcomes and host event journal between a single `advanceStoredWorkings` call to minute 8, partitions at 1/3/5/8, and a JSON save/restore at minute 4. The midpoint uses both stored and engine serializers/restorers, plus the kernel serializer/restorer for the ordinary working.

| Code | Exact test name | Evidence |
| --- | --- | --- |
| R1 | `strip: one clock agrees with partitions and engine plus stored save/restore` | `readTalisman` reads ember/breath/veil. The UNNAMED breath/veil pair becomes discord. Warm adds four heat and discord adds two noise through `landEffect`. The paper strip answers its current holder and becomes spent. `recharge and re-ink pay prices, reset decay anchors and rearm a spent strip` then pays three ink, rearms the actual strip, fires again and checks both effects. |
| R2 | `ward: one clock agrees with partitions and engine plus stored save/restore` | Real move ops create `arrived` rows. A bearer crosses with a pass mark for zero charge. After the mark is removed, crossings at minutes 3 and 7 each fire the repeating place ward. A second ward watches a vacant room's humidity threshold. Both ward specs decay by one every three minutes. |
| R3 | `draught: one clock agrees with partitions and engine plus stored save/restore` | A kernel hit lands through `landEffect`. The body event record releases on removal of vitality from that body. A second body record releases on the vitality threshold. Both heal through the host and become spent. The event journal retains actual applied targets, objects and signed amounts. |
| R4 | `held: one clock agrees with partitions and engine plus stored save/restore` | A held guard draws two stamina at minutes 2 and 4, making a block lasting one pulse each time. An ordinary `beginWorking`/`settleWorking` strike at minute 3 is blocked. Upkeep cannot be paid at minute 6, the guard lapses, and the second kernel strike at minute 7 lands. |

`mutation guard: pulse receipts use event boundaries even when the call ends later` asserts the unattended ward's receipt is at minute 3 while the call ends at 8. A deliberate replacement with call time disagrees with partitioned settlement.

The cross-domain supplier is the real registered `b.brew_steam` pack. Its thermal law, batch quote, steam rate and finish settings follow `tests/engine_world.test.js`. It raises the empty room's humidity from 40 to the ward threshold of 52 at minute 3. The fixture also loads registered `w.sky`. `cross-domain mechanism contains no trigger quantity, pack id or engine import` checks for the quantity name, every registered engine pack id and `engine_world` in the shared module.

## Ways around and their costs

| Code | Way and fixture cost | Test that exercises it |
| --- | --- | --- |
| W1 | Recharge pays two ink per accepted charge unit. Four units cost eight ink. It resets the decay anchor and wakes a dormant pattern. | `recharge and re-ink pay prices, reset decay anchors and rearm a spent strip` |
| W2 | Re-ink pays three ink, restores reservoir capacity, resets its anchor and rearms the spent strip. Insufficient ink leaves it spent. | Same test as W1. |
| W3 | Feed pays two ink per charge unit directly from the actor, bypassing an empty reservoir. Two charge costs four ink. | `feed and draw take actual world quantity at the quoted rate` |
| W4 | Draw pays two stamina per held pulse. Insufficient upkeep leaves the stamina untouched and lapses that pulse. | Same test as W3 and R4. |
| W5 | A far named holder or a holder bearing the beacon mark costs two extra charge per firing. A locally moved paper carrier pays its normal two charge. | `reach names far holders or marks at extra charge, and moving the carrier works locally` |
| W6 | A stranger pays a factor of two. Two normal charge becomes four. Holder transfer changes who gets the ordinary rate. Storer and named-actor attunements use the same mechanism. | `attunement costs a stranger extra and follows the current paper holder` |
| W7 | A bearer key bypasses for zero charge. Binding and releasing use the existing shared relation effects, with acquisition costs left to the binding method. | `key bypass can be bound and released through ordinary world mechanisms`, R2 |
| W8 | Weak force 1 pays one ink, wears one charge away and sets off the working at its usual firing cost. Force 5 pays five ink, breaks strength 5 and spills all twelve remaining charge onto the breaker. | `force pays a world price: a weak break wears and fires, a strong break spills on the breaker` |
| W9 | Physical force still spills onto a key bearer. Insufficient force payment preserves the world and pattern. | `force bypasses a bearer key physically and insufficient payment leaves the pattern intact` |
| W10 | A carrier with no decay setting retains charge. A broken carrier spills remaining charge locally by default, with a quiet dial. Loss ends its pattern. | `charge: absolute decay, partial firing, dormant pattern and free default`, `carrier loss, breaking spill and quiet dial are watched without a trigger actor` |

Other focused checks cover store/fire authority answers in every receipt, refusals with reasons and remaining ways, whole-interval decay, partial charge scaling, preserved fractional decay intervals during spending, quantity edges and pulse repeats, absolute time, word matching, immutable inputs, stable id order, repeat calls at the same minute, version refusal and a target leaving the world.

## Implementation proposals where the design is silent

| Code | Proposal |
| --- | --- |
| P1 | `pulse` is required pack data. First attention is `stored.at + pulse`. Event rows use substrate sequence numbers and are filtered to `row.at >= stored.at`. The caller can seed the starting sequence through `spec.watch.seq`. |
| P2 | A quantity trigger uses `{holder, quantity, op, value, again?}`. An event trigger uses `{event, where}`, with dotted paths for nested payload fields. `ports.stimuli(world, record, at)` supplies scheduled touch/word stimuli. |
| P3 | Default holder lookup reads a body carrier itself or a thing's `properties.holder`. `ports.holder(world, carrier)` can replace that lookup for another custody model. Carrier lifecycle reads `properties.lost` and `properties.broken`, with holder removal also counting as loss. |
| P4 | `draw` carries its own `per`. Direct feed is `way.feed = {from, quantity, rate}`. Recharge uses the record's `{quantity, rate}` quote, renewal its `{quantity, price}` quote, and breaking an explicit `{quantity, rate}` payment argument. All debit actual quantities through W ops and respect the quantity minimum. |
| P5 | Scaled amounts round down to whole substrate units. Held upkeep requires the whole pulse price, following SW11's lapse requirement. A resisted landed act still spends the attempted charge and a once pattern becomes spent. Its receipt retains host outcomes, a reason and remaining ways. |
| P6 | Recharge retains a spent once pattern's spent status. Renewal fills its reservoir and rearms it. A fresh fire authority answer can allow a previously refused dormant pattern. Broken and lost records retain their terminal status on maintenance. |
| P7 | Reach takes `{holders, mark, extra}`. Extra charge is assessed once per firing. Breaking a working retargets its remaining effect onto the breaker, restores the stored effect description afterward, and records the separate force cost. A key bypass applies to ordinary stimuli. |
| P8 | `ports.events(world, record, at)` can supply chain rows with retained detail. The default reads `world.chain`. The fixture journal uses actual chain seq/at values and the actual `landEffect` applied outcomes. It is included in midpoint JSON persistence and equality assertions. |
| P9 | No built-in pulse is run at storage. The held fixture's ordinary working settles through the caller's advance callback at its actual deadlines, between held pulses. Pending/incomplete world advancement throws before any result is returned. |

## Requests to owners

| Code | Owner | Smallest requested shape and status |
| --- | --- | --- |
| O1 | W | `settleContact` in `world_substrate.js` drops `e.detail` when constructing its saved chain row, even though live reactors see it. Preserve `detail: structuredClone(e.detail)` in that row. This lets event conditions identify a hit's target/object from engine saves directly. The lane works around it through P8. The payload needs preservation across W save/restore. No W file was edited. |
| O2 | K | TG1's future composition-slot lowering can emit this saved record for `hold: true`, with the composition host supplying carrier, draw quote, pulse and sustained effect duration. This lane proves an ordinary kernel working alongside a held record. Automatic composition lowering stays with K. |
| O3 | P | Existing `landEffect`, sustained `minutes` and block lowering suffice for these rows. No P change requested. Fractional scaling is rounded before landing because W accepts whole amounts. |
| O4 | Rune grammar | Existing `readTalisman` already resolves the unnamed pair. No grammar change requested. Effect-word to sentence/power mapping stays in the fixture pack. |
| O5 | W, future horizon work | Pulse-free detection of a far threshold crossing remains the explicitly deferred design item. Reopen for a long-horizon consumer with a measured pulse cost. |

## Remaining scope and review

The requested engine mechanism and focused proof are delivered. The body-hit route currently requires the documented caller journal until O1 is adopted. A host must keep that journal with its own save if it supplies payload-based events. Automatic `hold: true` lowering, consuming the carrier on once fire, game wiring and UI remain with their owning lanes or the design's deferred scope.

No build, full suite, visible window, commit, merge, push, stash, reset or checkout was performed. The owner can review the five changed paths and integrate under the foundation run's gates.

## Checked input identity

Base HEAD `0876c3906d2c94d0180793bb5311fbe73459a169`. Final focused test inputs have these SHA-256 hashes. Architecture and rules checks ran after the final mechanism edit. The final changes afterward strengthen tests and write this return.

| File | SHA-256 |
| --- | --- |
| `src/stored_working.js` | `f4117d24b7db344c2d7bb7b176a9443a0caac423c3d67baa2575d0eaae27c22a` |
| `tests/fixtures/stored_workings/rows.mjs` | `837c06b785556b63d05bdecb73b6098aca6be2fbc43e90305b469e19fa801e71` |
| `tests/stored_working.test.js` | `a1334d93415b5e1c2705a72462f60eb65a2451b7fdc89c3ac3f4f572ad1c5d01` |
| `tests/stored_working_engine.test.js` | `3ee177902c2373231e28bcf9c0711a8914cba2e6041e3a61fee5d3e896b4ab81` |

## Lead review addendum (Fable, after the Codex run)

- Codex left the work uncommitted; the lead committed it.
- Lead edits to `src/stored_working.js`: receipts list the ways that fit the reason (`WAYS_FOR`) in place of one fixed list; `renewStored` lays a broken pattern again at the renewal price while its carrier is whole; a lost carrier answers `lost` with `store-again`.
- Lead test added: `a broken pattern is laid again at the renewal price, and a lost carrier names storing again as the way`. Focused count is now 23 passed, 0 failed; the five neighbouring suites stay at 59 passed.
- The SHA-256 table above predates these edits.
