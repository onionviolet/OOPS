# Three deeper systems

These were not documented by the prior Kittens lane. Bounded source traces now extend the feature answers; native execution remains untested.

## D1: Queue reason handling and ETA

`js/time.js:2048 getFirstItemEtaDay` checks the head item, skips already-held prices, rejects costs above max storage and nonpositive net rates, adds engineer production/consumption, takes the maximum ingredient wait and rounds engineer cadence then days. Unlike the tooltip ETA, this evaluator does refuse a capped wait. It returns `[eta, possible]`, not the exact failing input or remedy. `:2684 update` uses the ordinary purchase controller, reads `itemBought` and `reason`, removes successful/skippable entries, otherwise leaves the head to wait. It publishes UI updates rather than a detailed persisted blocker receipt. Queue items/sources are saved by TimeManager.

Evidence: stated, source. YAIRPG proposal: retain authoritative reason IDs and project known exact blocker/remedy on existing workPlanView, with stale commit rechecking. Do not import this queue engine. Owner: P01 UI owners and ENGINE_EXPANSION.md. Gap: all skip reasons and queue/offline edge cases not exercised.

## D2: Preview isolates storage before loading

`index.html:242` detects preview before ordinary game initialization. `js/preview.js:184 previewDetachStorage` creates an in-memory storage shim and carries only UI/language settings. `_apply` routes the blob through normal load; `_lockChrome` strips mutation links. Game save/start and purchase handlers use read-only guards as well. A token pattern constrains save IDs. This is a layered design, not evidence that every mutation is blocked. No preview token was supplied and no cloud state was fetched.

Evidence: stated, source. YAIRPG proposal: if later save review is needed, detached in-memory inspection and mutation guards should accompany a visible read-only label. Owner: ENGINE_EXPANSION.md. Gap: complete mutation coverage and live preview behavior unread/unrun. No cloud preview gate is imposed on current P01.

## D3: Capacity affects policy benefit independently of purchase state

`js/science.js:915` authocracy policy calculates a conversion leader bonus from uncapped housing types. It queries current housing prices via `isStorageLimited`, and marks the next price as `almostLimited` only after the policy is researched. The effect is a dynamic calculation, not a new permission or owned-building flag. `game.js:6038 unlock` separately resolves typed targets, evaluates optional locks, and grants buildings `unlockable`, tabs visibility, or other metadata `unlocked`.

Evidence: stated, source. YAIRPG proposal: capability displays must explain when held assets stop supplying a benefit, separately from knowing/owning them. Reuse real readers instead of inferring benefit from a registry flag. Owner: TECHNOLOGY_AND_PROGRESSION.md; ENGINE_AUTHORING.md. Gap: all policies and changing-cap boundary behavior not executed.
