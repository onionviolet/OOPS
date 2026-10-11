# Upload Labs original adaptation packets

All proposals. Source findings are in FINDINGS.json, with private file/line anchors. No YAIR code authorized. Character prestige, offline aging and persistence policies need explicit decisions before implementation.

## P1 (1) Workshop bottleneck receipt

Center crafting action shows gather, prepare, craft, deliver rates and the current limiting input. Speeding craft alone cannot invent wood or buyers.

Source: F3, F5. Native owner: Native crafting, inventory, center actions; src/crafting_recipes.js, src/main.js. Dependency: Requires sampled actual inventory and native completion hooks.

Acceptance: One small recipe visibly stalls on missing input, recovers after gathering, then consumes and pays once.

## P2 (2) Study unlocks a working method

A mentor teaches one process improvement after either practice OR a studied text. Show the alternatives explicitly; require actual equipment to execute.

Source: F1, F2. Native owner: Native books and Watchcraft known/practiced/executable presentation; src/village_career.js:80-99. Dependency: An authored method unlock, no global research currency.

Acceptance: The two routes each unlock the same method; studying alone never grants equipped execution.

## P3 (3) Choose sale or investigation

Offer a native sample to Eda for research or sell it; consuming one sample cannot reward both branches. Research leaves a method or biography mark.

Source: F3, F5. Native owner: Actual offered-stock service; src/steam_df_runtime.js:39-61; adventure notebook. Dependency: Transactional item custody and one result.

Acceptance: One sample disappears once; research updates discovery and sale updates coins on separate attempts.

## P4 (4) Named workshop allocations

Share limited tools or labor between two native jobs using explicit priority or equal shares selected by the player. Explain which job waits.

Source: F4. Native owner: Crafting and jobs; inventory; center menu. Dependency: Bounded local allocation contract; do not add a factory graph UI.

Acceptance: Two jobs compete for one tool without duplication; changing priority changes the waiting job.

## P5 (5) Quality changes the whole chain

A careful preparation step reduces later work or improves value, with a visible extra input/time cost. Ordinary skills keep a purpose.

Source: F3, F5. Native owner: Native recipe/equipment and alloy technique; src/alloy_equipment.js; src/crafting_recipes.js. Dependency: One authored variant and item-compatible representation.

Acceptance: Prepared stock affects exactly its downstream recipe, not every item in inventory.

## P6 (6) Routine cards store method, not goods

Save a local crafting routine as an ordered plan; copying the plan retains stop rules and recipe choice but gives no materials, coins or progress.

Source: F8, F10. Native owner: Existing simulation plans plus native crafting. Dependency: Optional versioned plan data and validation.

Acceptance: Copy/import plan produces zero inventory and stops safely when its tool or ingredient disappears.

## P7 (7) Push a tool beyond comfort

Overwork a furnace or workshop for a short gain until heat/wear removes the bonus; the log identifies why. Care and ordinary maintenance restore it.

Source: F6. Native owner: Home-world craft actions, nursery care and equipment. Dependency: One local tool/wear state, no character-health inference.

Acceptance: Bonus ends at limit and returns only after the stated maintenance action.

## P8 (8) Rest reserve is an explicit policy candidate

If director wants it, bank capped preparation time while away and spend it to accelerate only a selected safe routine. Show what uses it; exclude aging, deaths, contracts and world events unless separately authorized.

Source: F7, F9. Native owner: Saved simulation clock and optional native routine state. Dependency: Needs explicit offline/aging and save policy review; proposal only.

Acceptance: With an approved policy, reload cannot duplicate reserve and acceleration cannot silently advance excluded consequences.

## Small native touches

| Code | Proposed touch | Source | Native surface |
|---|---|---|---|
| T01 | Show missing ingredient name | F3 | crafting center action |
| T02 | Show limiting stage | F3 | crafting center action |
| T03 | Separate possible rate from actual last batch | F4 | native resource tooltip |
| T04 | Show stock count beside recipe requirement | F8 | native inventory/crafting |
| T05 | Pause routine when loaned tool is returned | F4 | Village custody ledger |
| T06 | Display priority choice in plain words | F4 | native job/center menu |
| T07 | Keep two alternate study prerequisites visible | F1 | native book/method tooltip |
| T08 | Mark planned study separately from known | F1 | Watchcraft presentation |
| T09 | Warn a planned method is not yet executable | F1 | Watchcraft presentation |
| T10 | Preview next improvement cost | F2 | mentor/crafting action |
| T11 | Explain why buying capacity is different from speed | F2 | workshop tool tooltip |
| T12 | Name sample consumed by investigation | F5 | Eda offered-stock action |
| T13 | Add first successful method use to biography | F5 | life record |
| T14 | Show idle because input empty | F5 | center action status |
| T15 | Stop progress on recipe identity change explicitly | F3 | native crafting routine |
| T16 | Show prepared ingredient tag | F3 | item tooltip |
| T17 | Explain quality effect at destination | F3 | recipe result preview |
| T18 | Show maintenance limit before overwork | F6 | equipment/workshop tooltip |
| T19 | Log bonus ended due to tool heat | F6 | event feed |
| T20 | Use quiet completion feedback on batch | F6 | native crafting event log |
| T21 | Copy routine name and rules only | F8 | existing simulation plan surface |
| T22 | Reject outside references on routine import | F8 | save/plan validation |
| T23 | Describe retained and lost state before any future reset | F9 | existing character details/reset proposal |
| T24 | Show capped reserve and next drain if policy selected | F7 | existing time/routine tooltip |
