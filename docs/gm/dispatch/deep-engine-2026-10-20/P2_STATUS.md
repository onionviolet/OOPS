# P2 final status: independent domains and direct ports

release=true. P2 is finished and releases every source/test/composition reservation below. P4 may use/edit the tools integration after P5's separate release. Release means write ownership is available, not human acceptance. No commit/push/publish, extra agent, shared generated-output write or personal-save operation.

## Delivered finite outcome

A1: `createLamplightDomain` owns its state, ports, native-clock identity reader and transient elapsed-light interval. Construction enrolls no global domain and is ready for commands after configuration. Existing played-game singleton exports, `lamplight` registry commands/projection and schema-1 save slice remain compatible. This extracts one domain, not the whole game.

A2: Native composition configures Tools and Lamplight directly through `native_tool_domains.js`. Tools no longer configures another domain. `main.js` changes only its import/call name and has zero task line growth; no save_files/display edit or registry lifecycle expansion was needed. `refreshToolsPanel` preserves native lamp panel updates.

A3: Scoped `Hero.bindNativeLightSource` and `bindReadingLightReader` installers return cleanup callbacks. Reconfigure removes the old actor/reader and invalidates the interval before installing replacement ports. Dispose is terminal/idempotent, removes only this instance's callbacks, makes commands ineligible and ticks inert, and preserves its saved slice. Reader precedence is the newest remaining live binding, then the legacy fallback. Independent hosts supply their own reader destinations. Full contract and legacy-facade limits: [API.md](P2_EVIDENCE/API.md).

## Combined wave-A/B integration

P1 and P3 both completed with explicit source release before P2 writes. Palette final checkpoint then released overlapping runtime/style reservations. FF3 live status reserved only its household/model/fixtures and left lamp work released to P2; its household UI/travel hunk remains separate. [Preparation history](P2_EVIDENCE/preparation-history.md) records the waits and ownership recovery. P2 is no longer reserving main/items/hero/tools/lamp/reveal paths.

P1's exact two-hunk `items-registration.patch` is applied to current `src/items.js`: extend the existing enemy import and register the existing `getItemFromKey` factory. P3 required no composition patch; its unchanged ordinary-lamp facade journey runs before and after extraction. P1's effective stat semantics are included in focused/full integration checks. No gear-branch blanket merge or shipped encounter content change.

P1/P3 previously reported a native crafting failure, and P3 a legacy village `game_stats` failure. The intervening palette repairs are included in this candidate: both failing tests now pass (native interaction included in focused/full gates; legacy runner included in the separate 7-case headless gate). Their historical failures remain documented in their own receipts. P2 did not repair unrelated crafting/UI paths.

## Inputs, paths and preservation

HEAD `b0af7db5bd21770ca603fdf1e7b865b376f46857`; dirty input identity is required. Isolated copied candidate: `/tmp/oops-p2-domains-WqdffR`. [Initial inputs](P2_EVIDENCE/inputs.json), [final integrated inputs/revision](P2_EVIDENCE/integrated-inputs.json), [supplemental root fixtures](P2_EVIDENCE/supplemental-root-inputs.json), and [release manifest](P2_EVIDENCE/release.json) record exact hashes. Copy recorded no source drift. Supplemental root Markdown fixed a candidate-only omission of AGENTS links before the final rules pass; no runtime repair was inferred.

| Released source/test path | Final tested SHA-256 |
|---|---|
| `src/lamplight_factory.js` | `32a4cb38c1b9e466012d6a2dd970d38c39cca257788335352aca276bba54ecc1` |
| `src/lamplight_domain.js` | `fce888083f7eab9dca93079d0ba9d8b8d69fd50d5b61bb28f12255298166aaa3` |
| `src/native_tool_domains.js` | `279fa40e12f4e1e02b5d7bff605546f7cb75276a6cbd830daed5f78a32966ad3` |
| `src/tools_domain.js` | `5b976ee80401b6041daf5b53e8007e390668cd5a830a1687ba13231a49f604c3` |
| `src/reveal_chain.js` | `2d77335257cb05ce252614fe0039d0eb13305bdc554efddf4c8f2008de3f8b6f` |
| `src/models/hero.js` | `505873be1b220b2f9e0a4ed520a46dee44a38808f3aa3270bbf934bee3b926cf` |
| `src/main.js` | `82975bd830f5d5ae53e4aaf1fedda1c76dcc9bdbe9b42b9a328c203f43f3a427` |
| `src/items.js` | `65178d2dd1bd753c9acc8d3dbec499556d4cbfd6444b340bf0552ecbc088c8a4` |
| `tests/domain_instance_isolation.test.js` | `7cc579fab11ddc22a2f0e687d049bd101d67248d0ebb03a6128fbfd12e3f0d84` |

P2 also owns its packet/status/API/evidence only. [Hunk preservation](P2_EVIDENCE/hunk-preservation.json) reconstructs all five narrow old source files exactly after reversing P2 changes. [Mechanism preservation](P2_EVIDENCE/mechanism-preservation.json) verifies unchanged native fuel/notice, execute/transaction and interval-guard bodies after the structural move. [Owner preservation](P2_EVIDENCE/owner-preservation.json) proves ENGINE_EXPANSION's original prefix retained exactly. Shared index.html/dist bytes match their pre-edit hashes. Sources/tests match the tested final candidate.

## Verification

Rules: EI23; AR1-AR16, especially AR2/4/9/10/11/15/16; AD6-8/15-18/22/32-38. Seam: existing domain descriptor plus narrow injected ports, directly composed native adapters. No gameplay rule or persistence schema changed, so rule-behavior is not applicable. No presentation change; target browser 1920x1080. Laptop/14/21px layout claims and mobile optimization are not added by P2.

| Check | Final state and evidence |
|---|---|
| Focused integrated 8-file command | **36/36 PASS**, [focused.log](P2_EVIDENCE/focused.log). Domain instances, lamp/reveal/registry/tools, P1 stat/equipment consumers and native interaction. Includes real native Hero binders, two actors/stocks/readers, quote purity, interleaved commands/ticks/save/load, stale callbacks, disposal, reconfiguration and failed-write isolation. |
| Required isolated `npm run build` | PASS, [build.log](P2_EVIDENCE/build.log). Official final bundle SHA `fe54b35000ccca0ed84931c715cc84c99d419b9671d784d832682101c6c78ebe`. Official bundle restored after separate test instrumentation. |
| Required isolated `npm test` | **2383/2383 PASS**, [full-test.log](P2_EVIDENCE/full-test.log), 31.52s. Earlier input passed 2382; final direct-construction regression exposed/fixed initial null state and justified repeating after that specific source change. |
| Required isolated architecture/rules | PASS, [arch.log](P2_EVIDENCE/arch.log), [rules.log](P2_EVIDENCE/rules.log). Main 10303/10310, display 6691/6767, save 310/310; no new cycles or main imports. 96 rules warnings are isolated non-git-copy tracking warnings. Final constructor change adds no import/architecture/rule input. |
| Native headless continuity + legacy runner | **7/7 PASS**, [headless.log](P2_EVIDENCE/headless.log): actual full/fractional expiry, dawn, stop/pause, completion once, full-envelope current persistence and formerly failing village route. Final constructor change precedes the same registry initialization/load, and its final browser journeys below repeat the native route on rebuilt final inputs. |
| P3 shared before/after journey | PASS, [before](P2_EVIDENCE/before-browser.json), [final after](P2_EVIDENCE/after-browser.json). Real native commands, 1 flask spent / 240 fuel, 2 played minutes / 238 fuel; stale rejection without mutation; no observation state/storage/RNG change; headless/browser deltas agree; exact Save/reload/Export/literal Import. Visible inventory out/relight keeps 238 fuel. Official and instrumented hashes are separately recorded. |
| Final rebuilt reading journey | PASS, [continuity-browser.json](P2_EVIDENCE/continuity-browser.json). Native inventory light/read, fractional 2.5 fueled + 3.5 unlit minutes produces 6.5 work, visible estimate 98 to 113.5, supported batch/singles/fastForward agree, pending/expired/completed Save/reload/Export/literal Import exact. Existing Reader title load backfill remains explicitly separate from immediate exact book/fuel/XP. [Screenshot](P2_EVIDENCE/expired-reading.png) inspected at 1920x1080. |
| Controlled before/after native combat | PASS, [combat-light-browser.json](P2_EVIDENCE/combat-light-browser.json), [runnable verifier](P2_EVIDENCE/verify-combat-light.mjs). Restore only the six pre-P2 file bytes in the controlled before build. Same native dark-place inventory commands and actual Hero combat light multipliers: dark 0.50, lit 0.75, out 0.50 for attack/evasion in both builds. Current 240 fuel conserved. No combat formula or RNG-order change. |
| Owned whitespace and generated preservation | `git diff --check` PASS on owned source/test changes. Release manifest confirms all nine tested path hashes and exact preservation of shared index/dist. |

Lifecycle defect reproduced separately before edits: old actor still contributed 40 after reconfigure (expected 0), [before-lifecycle.json](P2_EVIDENCE/before-lifecycle.json). Final isolation fixtures prove removal. P2's direct-construction gap was also reproduced, [direct-construction-before.log](P2_EVIDENCE/direct-construction-before.log), then corrected by initializing the same existing fresh slice. These lifecycle cases are distinct from preserved native gameplay formulas.

## Remaining acceptance and downstream work

G1: Weibao's play/visual judgment remains open. Fixtures deliberately seed owned lamp/flask/book/time and native dark-place access; natural campaign acquisition and P1's ordinary equipped creature encounter are not claimed. No sealed truth, raw save export or personal-save content is published in these receipts. Literal fixture exports remain only in temporary local evidence. The optional missing private-pack manifest is recorded; unexpected browser errors fail the journeys.

G2: This is one independently constructible domain. The played game and P3 legacy runner retain their existing singleton/one-active-Node-realm limits. P4 still owns exact-target durable timed work, and P5 owns content-authoring outcome/release. FF3 household supply/UI/travel remains with its separate owner and requires its own source release/gates. None is silently closed by the P2 suite.

Included usage was 26% at preparation, 28% at wave-B start and 30% at the final check, under this dispatch's 31% shared ceiling. No paid/API fallback or allowance expansion. All P2 browser/server processes stopped. No commit/push/publish. Source release is **true** for the exact paths above.
