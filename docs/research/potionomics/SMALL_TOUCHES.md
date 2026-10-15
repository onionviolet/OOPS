# Small touches: PROPOSALS

No donor UI was run. Each suggestion must read current authoritative state. Existing controls are incumbents, not missing systems.

| ID | Touch | Owner | Evidence or status |
|---|---|---|---|
| T01 | Show due time with a game-time unit, not an unexplained number. | P01 / work-plan UI | WBP_BrewInfo, DT_Potions |
| T02 | Keep a forecast beside the actual last result; never overwrite one label with the other. | P01 / receipts | WBP_PotionToBeBrewed, DT_CauldronCraftResults |
| T03 | Show available stock after reservations beside physical stock. | P02 / mixture UI | Donor count/capacity widgets; YAIRPG reservation extension |
| T04 | Pair letter and color for every composition channel. | P02 / composition UI | DT_Magimins |
| T05 | Add an exclude filter as well as an include filter for unwanted components. | P02 / inventory filtering | IngredientFilter_*Exclude assets |
| T06 | Distinguish a chosen recipe from automatic target selection. | P02 / mixture quote | Recipe and improvise tooltips |
| T07 | Show capacity as current/maximum separately for inputs and potency. | P01 / station UI | IngredientsInCauldron and MagiminsInCauldron tooltips |
| T08 | Describe quality uncertainty as a range of possible change. | P02 / appraisal | DT_CauldronStability modifiers |
| T09 | Do not present a range as equal-probability outcomes without evidence. | P02 / appraisal | RNG weights unread |
| T10 | Label a cancellation refund and an irreversible discard differently. | P01 / work controls | Discard tooltip contrasted with current mixture cancel |
| T11 | Give a completed batch a collection control distinct from starting work. | P01 / queue UI | WBP_ActiveCauldron collection event |
| T12 | Use a collect gate to suppress animation-time double input, while host publication owns payment. | P01 / queue UI | ResetCollectButtonGate; durable safety remains unproved |
| T13 | Give feedback for each actual quality outcome without hiding its numeric change. | P01 / receipts | DT_CauldronCraftResults |
| T14 | Display learned strategy separately from equipped method. | P03 / skills UI | Card library and deck distinction |
| T15 | Link a lesson reward to its next useful application. | P03 / teacher route | GiveCard continuation actions |
| T16 | Keep friendship and romance routes able to grant the same practical reward. | P03 / relationships | MintRel10 branches |
| T17 | Show a relationship threshold and a quest requirement as different blockers. | P03 / teacher availability | RelationshipProgressionData fields |
| T18 | List a service discount as a concrete new offer, not only a relationship badge. | P03 / vendor UI | GiveCoupon and coupon IDs |
| T19 | Show the cost of a response on the response control. | P19 / dialogue UI | Patience-cost card model |
| T20 | Explain end-condition ordering at boundary states. | P19 / quote validation | Closer/patience boundary in CheckIsCardGameOver_Haggle |
| T21 | Show a retained stress-like cost only if a later supported reader uses it. | P19 / aftermath | StoreStressStats and stress-card HUD text |
| T22 | Separate price modifiers by source so the player can inspect the quote. | P19 / trading | CGV2CI_GetCurrentPotionPriceInfo |
| T23 | Let local history scroll while current stock and routine actions stay visible. | P01 / desktop owner | YAIRPG accepted desktop direction; donor layout not exercised |
| T24 | Report why the next repeat stopped immediately beside resume. | P01 / work-plan UI | Current YAIRPG mixture shortage already exists; projection extension |
