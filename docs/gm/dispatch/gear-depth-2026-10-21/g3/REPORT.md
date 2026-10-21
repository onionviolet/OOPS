# G3: affixed stock and recoverable worn loot

Native acquisition now resolves component-armor stock affixes at stock creation,
with keyed market decisions per merchant/epoch/template row/piece. Saved item
keys carry the resulting affixes through buying, selling, reload and import.
Authored TradeItem rows may retain plain gear with roll_affixes:false. Existing
plain saved stock remains plain until its normal restock; no save schema changes.

Equipped enemies can yield their actual worn key after victory. The default
survival chance is 0.25, a per-enemy dial for battle damage; ordinary biological
loot keeps its prior chances/readers. No extra affix roll occurs on the corpse.
The combat inventory consumer now preserves item_key rather than replacing it
with the template key; biological drop observations remain item-id records.

Buying or selling the final unit also exposed a stale preview dereference during
post-commit rendering. Two display hunks fall back to reconstructing the exact
selected key when the spent stock entry is absent; stock remains authoritative,
and normal trade cancellation clears the preview afterward. The gear builder
has permission to reuse those hunks beside its native tooltip changes.

Rules: AD5/6-8/32/34/36/38/41, ESD3/4/10/11/13/15, GR1-17, AR3/5/6/7/8/10/16.
Seam: existing TraderComponent stock materialization and Combat loot award; no
new main import/registration, inventory, save owner or RNG stream.

## Verification

Focused invariants cover resolved-piece quantity conservation, canonical native
item reloads, no reroll of existing affixed stock, same-epoch replay, new-epoch
change, shop transfer identity, worn-gear recovery and mixed old/new loot keys.
The command node --test tests/gear_acquisition.test.js tests/gear_affixes.test.js
tests/seeded_streams.test.js tests/loot_log.test.js and arch/rules results are
recorded beside this file; no full suite is repeated before combined integration.

The rebuilt disposable-source browser run at 1920x1080 passes six observable
checks with zero page/console errors: native affixed stock creation, reopen
without reroll, actual buy, last-unit sale/repurchase, actual equipped native
enemy defeat and saved acquired item persistence through Save/reload/Export/
literal Import. The fixture supplies funds, high-quality stock and late access;
it establishes the real consumers, not natural pacing or discovery. Source-only
fixture exports stay in a temporary build, with production dev mode unchanged.
[Browser receipt](browser.json), [shop screenshot](shop.png), [input identity](INPUTS.json).

Source is implemented and these focused/browser checks pass. Full combined
gates and master integration are still owned by the coordinating chat. No push.
