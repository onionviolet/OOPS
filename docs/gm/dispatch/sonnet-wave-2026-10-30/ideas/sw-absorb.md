# Idea intake: sw-absorb

Append-only. Format and rules: [QUEUE](../QUEUE.md#idea-intake).

## 2026-10-30 L-A, volume 1 routines (ids and counts only)

- **V1, ACT NOW (done):** `build_cast_pack.mjs --whole-book` with a narrower `--from/--to` builds routine bands. Test: `tests/build_cast_pack.test.js` 18/18. [folded: done in slice]
- **V1, ACCOUNT FOR NOW:** in ch 31-213, 1,319 of 1,758 routine slots already name a place the pack knows; 54 are "unspecified" in the source and stay unusable; 318 slots (241 distinct strings) name a place as free text with no registry id. The ch 31-60 band is the place-poor stretch (39 of 163 usable). [folded: QR6a]
- **V1, LATER (level: data, effort: one Luna medium lane over 241 strings, done check: unresolved-place under 100 for ch 31-213 and focused test unchanged):** map the 241 free-text place strings to registry place ids or "new place", write the result as a `crosswalk.places` / place-seed file in private/, then rebuild the bands. [folded: QR6a]
- **V2-8, LATER (level: shape, effort: Sol medium on `build_cast_pack.mjs` plus `cast_schedule` rows, done check: A2's 14 misfit rows from `a2-sample/sample.json` build without a gap):** the sample shows city travel (8 of 21), seasonal cycles (3) and irregular timing (3) do not fit one-day Tingen anchors. City travel should come from L11's route legs through `defineJourneys`; seasonal and irregular recurrences already exist in `cast_schedule.js` (`seasonal`, `yearly`, `irregular`) and need generator output only. [folded: QR6a]
- **V1, LATER (level: content, effort: small, done check: focused test):** opening hours (ledger item 4): the band build already emits `worldHours`; ch 31-60 gives 21 rows. Roles differ by hours, so keep `roleHours` rather than one window per place. [folded: QR6a]
- **Integration, ACCOUNT FOR NOW:** L4 slices 1-3, L8 sheets, L9 harm, L10 ladder, L11 region kit, L13 bridges, L14 events landed unwired. Divination is the only one with a host consumer (`defineDivinations`, cast_host line 168), but nothing supplies its `actor.lotm.div.*` facts, so every row would be permanently ineligible. Recorded "landed, read model only" until a fact supplier exists. [folded: WA51]
