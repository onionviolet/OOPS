# Mechanic digest

All locators are relative to installed `Potionomics/Content/`; raw and decoded counterparts are in the work area. Evidence labels follow REPORT.

## M1: Paid exchange

`BP_PlayerController.CGV2CI_GetCurrentPotionPriceInfo` adds retained card price percentage, current effect percentage, earned interest-increment percentage, shelf percentage outside Carnival, and trait percentage. It returns rounded percentage change and rounded `BasePrice * (1 + summed fractions)`. This is a decoded formula, not a measured price. The interest increment thresholds and every effect interaction were not exhaustively audited.

`CheckIsCardGameOver_Haggle` checks stress >=100 before closer/effect handling, max interest and patience <=0. A current closer may still succeed at the patience boundary. `CardGameV2GameEndReason` distinguishes close deal, closer card, out of patience, interest maxed, Carnival price exceed and stress maxed. The barter success block adds current quoted money and increments sold stats; failure routes to refusal. Cleanup is set on both branches. Whether the exact potion is retained after every failure path was not traced, so do not assume it returns to stock.

`StoreStressStats` writes the current stress level to `PlayerProfile.StressPercentage`; its caller appears in the controller's end-flow at statement 5586. Installed HUD text describes stress as a chance to draw an unplayable card in place of a useful card. Retained stress supports a later tactical cost. A direct relationship loss, grudge or worsened customer offer was not found in the inspected branches and is not claimed absent globally.

## M2: Composition, quality and competing use

`DT_Ingredients` has 206 rows, including element quantities, traits, category, biome, rarity and gift points. `DT_Magimins` uses A-E plus distinct colors. `DT_PotionPurity` has 20 target vectors. Health uses equal A and B; Mana equal B and C. MandrakeRoot supplies B and can contribute to either. This is competing material demand, not two potions from the same consumed unit.

`DT_Potions` contains six tier bands and six star ranges per tier, adventure effects and brew durations. The Health minor tier covers total magimins 1-59 with star ranges 1-9, 10-19, 20-29, 30-39, 40-49 and 50-59; its listed brew time is two segments. Higher tiers need greater totals and more time. Recipe selection and improvise selection are separate modes. Element exclusion filters and the pie chart help diagnose unwanted contributions. No runtime layout or universal side-by-side destination view was observed.

`DT_CauldronStability` has five bands: 0-49 cannot brew; 50-69 permits modifiers [-1,0]; 70-89 [0,1]; 90-99 [1,2]; 100 [2,3]. These are table values, not proof of equal probability, the native fit formula or the result RNG. `DT_CauldronCraftResults` maps -1 through +3 to result feedback and sound. Preserve distinct facts: fit, total potency, tier/star result, traits, price and practical adventure effect.

## M3: Teacher route

`DT_Relationships` points to per-character progression/hangout tables, gift likes/dislikes and coupon IDs. Mint's progression requires 5,10,15,20,20,25,25,30,30 points for entries 1-9, followed by zero-valued 10/11 entries. Do not infer maximum or endless rank behavior solely from this list. Difficulty-specific hangout tables coexist; the unqualified table's four durations trade more time for points and stress relief. Active difficulty selection must be resolved before quoting final balance.

Dialogue tables use stable row IDs, speaker, text reference, branches, traits, conditions, pre-action and post-action strings. `DT_Dialogue_MintRel01` row `MintRel01_CARD` calls GiveCard with Mint_Card_01 and a continuation row. Corresponding Roxanne scenes have the same grant structure. Their rank 4/8 scenes call GiveCoupon. At rank 10, friendship and dating branches can grant the same card. A learned strategy can therefore be socially acquired without tying its usefulness to romance.

Card data contains play conditions, abilities, costs and closer flags. `ReceiveHaggleCard` adds to the library; active deck choice is separate. `BPL_SaveLoad.GenerateUnlockedCardsFromRelationships` also reconstructs unlocks from relationship records in load handling, an important repair/redundancy seam. Exhaustive mapping and deduplication behavior remain unread.

## M4: Quote, wait, collect

Widgets `WBP_PotionToBeBrewed`, `WBP_BrewInfo`, `WBP_CauldronPieChart` and `WBP_ActiveCauldron` separate target forecast, composition, capacities, time and start/collect/discard actions. `WBP_ActiveCauldron` has completion checking, a collect-button gate and a distinct collection event. The UI assets suggest a staged completion flow, but do not prove durable idempotency.

Installed loading text says overnight adds two brew segments; fuel reduces time. The native night-clock reducer was not read. A delayed batch should therefore be described as forecast versus realized result, not as completed during real-world closed-app time. Discard text explicitly announces loss. YAIRPG has its own refundable reserved-input cancellation semantics, which this donor must not overwrite.

## M5: Save architecture

`BP_SaveGame` is settings only. Gameplay uses `Potionomics/System/SaveLoad/BP_PotionomicsSaveData` and `BPL_SaveLoad`, with a separate slots-info asset. Save/load pairs cover profile, relationships, stats/events, inventory, shelf/cauldron options, shop manager, quests, tutorials, marketing and individual vendor shops. Blueprint calls reach a native SaveLoadBlueprintLibrary, with platform-specific paths and Steam RemoteStorage calls. Autosave uses bounded slot arithmetic with separate endless-mode capacity.

LoadGame includes compatibility repairs, difficulty and relationship-mode branches and card reconstruction. Their existence is shown; exact migration versions, native on-disk format, atomic writes, checksum/rejection and corruption recovery are unread. No user save was opened.
