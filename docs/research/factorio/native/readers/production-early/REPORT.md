# Early native production review

The recovered Factorio production chain supports **real input expenditure, finite output custody and production that waits when outputs cannot be admitted**. An original YAIR batch with separate resin and residue trays is a useful application. Exactly two trays, sap/fuel/stamina costs and refusal before a new batch are authored YAIR choices. Native ordering proves completed-output admission; it does not establish universal output reservation before ingredient consumption.

This leaf reviewed the six assigned arm64 entries, three independently exported helpers and six supporting C-like bodies. Four additional entries received scoped inspection. This is one actual native semantic chain, not whole-game, full-native or both-architecture coverage. Parent full recovery continues independently. All source fingerprints, claim dimensions and exact references are in [FINDINGS.json](FINDINGS.json).

## Source and method

The input is the private arm64 slice of installed Factorio **2.0.77 / Steam build 23347942**, `/Users/weiwei/.codex/research/factorio/native-23347942/input/factorio-arm64.macho`. This review recomputed SHA256 `9e1d7571e0284bb4c4e0e12716143752c893cb79b266038e64d0ee41f54aab93`, matching [intake](../../INTAKE.json). The earlier revision-1 parent checkpoint predates priority recovery and is historical on decompilation counts.

The source bodies are Ghidra C-like output in `/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/`. Each referenced `.c` matches its JSON `c_like_code` and SHA256. JSON includes byte-body hash, ranges and addressed instructions. Default/undefined signatures, offset labels and many metadata types are inferred. These are recovered release-binary bodies, not original comments/types or a buildable source project.

The export `calls` array is incomplete: several named direct calls are absent from it. This review checked instruction flow targets and compressed nm symbols rather than treating an empty array as “no calls.” Symbol-derived names identify methods; they do not establish an unreviewed method's behavior.

## Resolved main virtual calls

Read-only Mach-O segment mapping located the actual qwords in the two static vtables. Zero offset-to-top and matching RTTI pointers verify the Itanium address point at symbol address plus 16. CraftingMachine vtable is `0x102da5218`, address point `0x102da5228`; AssemblingMachine is `0x102d7d350`, address point `0x102d7d360`. Pointer storage addresses and file offsets are retained in FINDINGS.json.

| Object-vptr offset | CraftingMachine target | AssemblingMachine difference |
|---|---|---|
| `0x12e8` | `0x10073b600`, `getCraftingSpeed` | Same |
| `0x1340` | `0x101b08160`, `shouldContinueCrafting` | Same |
| `0x1350` | `0x10073f37c`, `canTakeIngredients` | Same |
| `0x1358` | `0x10065ed00`, `giveProducts` | Override `0x10065ec9c` |
| `0x1360` | `0x1007418a0`, `hasProductOverload(recipe)` | Same |
| `0x1368` | `0x100741a98`, `canGiveProducts` | Same |
| `0x1378` | `0x101b0a858`, `checkChangeRecipeAfterFinishingLastCycle` | Override `0x100659984` |
| `0x1380` | `0x100740170`, `updateAnimationState` | Same |

These tables resolve this chain's main computed calls for these static classes. They do not rule out other subclass overrides. The assembling product-give override and continuation/change-recipe bodies remain semantic gaps.

## One actionable chain

| Stage | Verified native behavior | Exact recovered C evidence |
|---|---|---|
| Select and admit inputs | Missing recipe returns result 3. On a zero-progress start, ingredient eligibility must return 1 and recipe/quality identity must remain unchanged. Item mismatch/insufficient quantity/quality returns 8; fluid mismatch/amount/temperature returns 9. | `0x10073e2e4`, [lines 21–40](/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/10073e2e4.c:21); `0x10073f37c`, [lines 18–72](/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/10073f37c.c:18); `0x10073e93c`, [lines 9–16](/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/10073e93c.c:9) |
| Pay actual inputs | Positive energy extraction precedes `consumeIngredients`. Its helper calls symbol-mapped `ItemStack::remove` at `0x1001aec74` for recipe quantities, subtracts paired fluid amounts and clears empty fluid identities. | `0x10073e2e4`, [lines 36–49](/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/10073e2e4.c:36); `0x10073e99c`, [lines 33–44](/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/10073e99c.c:33); independent `0x10073f398`, [lines 187–198](/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/10073f398.c:187), [242–257](/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/10073f398.c:242), [273–292](/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/10073f398.c:273) |
| Advance work | Nonpositive energy result returns 2 before input consumption. Positive work is divided by 60 and accumulated as fractional progress. Crossing the recipe threshold invokes completion; leftover work can begin another cycle only after another eligibility check. | `0x10073e2e4`, [lines 36–49](/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/10073e2e4.c:36), [65–111](/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/10073e2e4.c:65) |
| Admit every paired output | Ordinary `ProductionHelper::giveProducts` checks admission before product collection or transfer. Each item slot uses `canGiveItemProduct`; failure returns 6. Fluid identity/capacity failure returns 7. An explicit IgnoreProductionOverload argument can bypass admission. | independent `0x10073ec44`, [lines 36–75](/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/10073ec44.c:36), [274–275](/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/10073ec44.c:274); `0x100741a98`, [lines 28–76](/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/100741a98.c:28) |
| Move products into custody | After admission, helper calls symbol-mapped `ItemProductPrototype::collectItem`, sets applicable spoil ticks and calls `ItemStack::transferReal`. Generated compatible fluid is added to its physical fluid state, with weighted temperature mixing. | `0x10073ec44`, [lines 73–81](/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/10073ec44.c:73), [98–156](/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/10073ec44.c:98), [199–243](/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/10073ec44.c:199) |
| Retain or finish | A failed product-give result exits before progress/quality reset. Success clears completed progress and result quality, optionally ejects output to a drop target, then checks continuation/recipe change. Productivity progress is debited only after its successful product-give call. | `0x10073e6b8`, [lines 33–48](/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/10073e6b8.c:33), [58–75](/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/10073e6b8.c:58); `0x10065ed00`, [lines 9–13](/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/10065ed00.c:9) |

“Progress,” “productivity progress,” and the success counter at machine `+0x21c` are analyst labels supported by callers and floating-point/control operations. No original structure member declarations were recovered. Removal/transfer primitive internals, probabilistic product generation and special flags remain open.

Capacity failure happens after native inputs may already have been spent. The completed cycle waits with its progress/quality intact. `craftWithCurrentRecipe` attempts completed output before extracting more energy or starting another batch, so an existing completed-output denial stops further advancement in this caller. This is different from guaranteeing capacity before paying for the first incomplete batch.

## Output capacity has material rules

Independent `ProductionHelper::canGiveItemProduct`, `0x101559374`, [lines 20–28](/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/101559374.c:20) and [89–122](/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/101559374.c:89), accepts an empty slot. Existing material must match the requested item and, when a quality is specified, its quality. Existing count plus the product count bound must fit the chosen stack limit. A metadata-bearing item can require an additional virtual compatibility check; that tail target is unresolved.

Its spoil-enabled branch, [lines 29–87](/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/101559374.c:29), computes a quality-scaled duration and derived deadline against MapTick. An expired product may test its spoil-result identity instead of the original item. Exact freshness labels and the product count/probability field interpretation remain inferred, so this review does not promote a universal spoilage formula or DLC completeness claim.

`hasProductOverload(recipe)`, `0x1007418a0`, [lines 23–87](/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/1007418a0.c:23), is a separate threshold rule. It selects either a recipe field or a bounded speed/time-derived multiplier and rejects stock at its threshold. That threshold can be distinct from physical capacity. YAIR can use a simple physical tray limit without copying this separate native automatic-production threshold.

`getIngredientSpoilTick`, `0x10073e1a0`, [lines 11–29](/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/10073e1a0.c:11), retrieves a captured per-item tick or returns 0. `onStackSpoiled`, `0x10073c154`, [lines 11–48](/Users/weiwei/.codex/research/factorio/native-23347942/priority-recovered/arm64/10073c154.c:11), checks that the notification belongs to the input inventory, attempts output/auxiliary inventory routing and sets a remainder bit when material remains. Virtual inventory-transfer semantics still need review before asserting universal salvage.

## Original YAIR use

The useful rule is **every concrete output needs a real owner and enough compatible space**. Two physical trays make the pressure legible: resin occupies one, residue occupies the other, and residue cannot disappear because resin is the desirable reward.

For the authorized root slice, inspect both output trays and reserve the resin/residue capacities before charging a new batch. If either fails, deny before fresh sap, fuel, stamina or time is spent. Once admitted, debit actual YAIR inventory/body resources once, use the shared played clock and durable publisher, and create the two materials in their separate custody. Collection, reuse or explicit disposal must free the correct tray before another batch. Those are original prototype rules, supported by the native custody/backpressure pattern.

No recovered native method supplies the exact tray count, resin/residue recipe, sap/fuel/stamina prices, game-minute duration, disposal policy or residue downstream recipe. Native helpers do not establish YAIR save atomicity. The original root implementation must make those joins through its existing inventory/body/clock/publisher and compatible optional state. This leaf made no runtime change.

Later playable acceptance remains deferred under the current implementation-first wave:

1. Either full tray denies the next batch without fresh input/body/time charge.
2. A paid batch creates both outputs in separate owned custody exactly once.
3. Collection, reuse and disposal free the correct capacity and consume the correct material.
4. Old absent state initializes inertly, and later save/reload preserves batch/tray custody.
5. Persistence failure publishes neither partial charges nor only one output.

Delivered gameplay remains **implemented-unverified** until the separate acceptance owner exercises those behaviors. Recovered native reading is design evidence, not playable proof.

## Recovery gaps and exclusions

Three independent helper exports now repair the first chain's largest gaps: `0x10073ec44` product-give, `0x10073f398` input-taking and `0x101559374` item-product admission. Shared `0x1007391d4` input eligibility and `0x100741abc` output eligibility still deserve independently bounded exports.

The pre-analysis `productionResultToStatus` body `0x100739184` falls through a logging/assert helper into unrelated ingredient eligibility. Only its genuine table lookup before the abort is recognized here; post-abort branches are excluded. `getStatus` likewise contains merged post-assert/helper paths, so numeric status labels are not decoded from them. `extractEnergyAndPollute` at `0x10073ebd8` includes `0x10073ec44` product-give after its logging default branch. That region is not an energy formula. The independent product-give export is used for P04/P05 instead.

Remaining work includes actual subclass/continuation bodies, item removal/transfer primitives, probabilistic generators, fluid amount/display helper, each energy family, scheduling/ejection and conveyor/inserter consumers. Both-architecture full export, source/DLC joins and wider native semantic coverage remain parent work. This review does not limit that objective.

No Factorio or recovered code was executed. No saves, profiles, entitlements, install/source libraries, runtime, canonical owners, commits or publication were changed. Only this reader directory was written; private native code remains outside Git.
