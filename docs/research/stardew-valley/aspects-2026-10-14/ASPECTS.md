# Stardew Valley aspect pass

Status: PARTIAL. All twelve rows recorded. Covered means bounded source/table coverage, not whole-system or runtime verification. Installed 1.6.15.24356, Steam manifest build 16826371. Private paths are linked from [REPORT](../REPORT.md). No game launch, save access or gameplay edits.

## A01 Dialogue and conversation

Status: covered. Basis: SHOWN in installed source/table declarations; UI is source-only. Wider usefulness is a PROPOSAL.

Selected dialogue dictionaries and event streams have condition keys, portraits/speakers, questions, signed relationship effects and paid branches. Tables store original keys; plain dialogue and event interpreters are separate.

Implementation evidence: `NPC.loadCurrentDialogue`; `Dialogue.chooseResponse`; `Event.DefaultCommands`; `Data/Events/Farm`; `Characters/Dialogue/Abigail,Gus,Caroline`.

YAIRPG: Retain stable response IDs and earned preference knowledge; stage cost plus cursor through existing dialogue owners.

## A02 Narrative delivery

Status: partial. Basis: SHOWN in installed source/table declarations; UI is source-only. Wider usefulness is a PROPOSAL.

Letters can attach items, knowledge and conversation topics. Events are scheduled through location preconditions and recorded as seen; relationship/time/mail conditions select branches. Quest classes are inventoried but quest lifecycle and all narrative closure routes remain unread.

Implementation evidence: `Data/mail`; `GameLocation.mailbox`; `LetterViewerMenu`; `Event.DefaultCommands`; `Farmer.eventsSeen/mailReceived`.

YAIRPG: Use a retained event/letter receipt with an actual useful consequence; do not let prose alone grant rewards. Owner: CHARACTERS_AND_WORLD_EVENTS.md.

## A03 Implementation architecture

Status: covered. Basis: SHOWN in installed source/table declarations; UI is source-only. Wider usefulness is a PROPOSAL.

C#/.NET game assembly uses XNA/MonoGame-style GameTime/graphics APIs, Netcode state wrappers, structured GameData models and legacy string script tables. Host clock dispatches ten-minute work; daily updates and event commands are distinct. Machine model rules call generic queries or explicit output delegates. Exact graphics-package version and full architecture performance are not audited.

Implementation evidence: `Game1.UpdateGameClock/performTenMinuteClockUpdate`; `MachineDataUtility`; `Object`; `GameStateQuery`; `GameData.cs`.

YAIRPG: Keep domain reducers with existing shared clock/predicate/seed primitives; two real readers justify a reusable rule. Owner: ENGINE_EXPANSION.md and modular chains.

## A04 Save and persistence

Status: covered. Basis: SHOWN in installed source/table declarations; UI is source-only. Wider usefulness is a PROPOSAL.

XML serialization retains location machine objects, pending times/held items, structured relationships, dates/counters, event and dialogue knowledge. Temp and _old paths plus save-version/fix progress exist. Schema read does not prove crash atomicity or save compatibility across every version. Full migrations and live roundtrip remain unread.

Implementation evidence: `SaveGame`; `SaveSerialization.SaveSerializer`; `Object XML fields`; `Objects.Cask`; `Farmer`; `Friendship`.

YAIRPG: Freeze accepted job terms and record pending work plus relationship cause. Owner: engine saves review; reuse staged publication.

## A05 AI and NPC behavior

Status: partial. Basis: SHOWN in installed source/table declarations; UI is source-only. Wider usefulness is a PROPOSAL.

NPC schedules select entries using context and friendship, then use routes/locations; spouse behavior reads relationship state. Character models include home, temperament, family and social availability independently. Combat planners/pathing failure and full schedule tables unread.

Implementation evidence: `NPC.parseMasterScheduleImpl/loadCurrentDialogue`; `Data/Characters`; `GameLocation`.

YAIRPG: World-authored daily availability can feed teacher/action blockers without a new population sim. Owner: CHARACTERS_AND_WORLD_EVENTS.md.

## A06 UI and information design

Status: covered. Basis: SHOWN in installed source/table declarations; UI is source-only. Wider usefulness is a PROPOSAL.

Source separates unknown cooking silhouettes, known shortage dimming, ingredient deficit text, numeric shop quotes, contribution quality/quantity slots, last-shipped recovery and learned taste categories. No combined item-destination quote in reviewed paths. No native screenshot or viewport inspection.

Implementation evidence: `CraftingPage`; `CraftingRecipe.drawRecipeDescription`; `JunimoNoteMenu`; `ShopMenu`; `ProfileMenu`; `ItemGrabMenu`.

YAIRPG: Use 1366x768 width for stock and destination quotes together, with readable blockers and local scrolling. Owner: thematic UI and UI at scale; mobile deferred.

## A07 Content authoring and modding

Status: partial. Basis: SHOWN in installed source/table declarations; UI is source-only. Wider usefulness is a PROPOSAL.

Structured data uses optional model fields, stable entry IDs and conditions; legacy recipes/events remain compact string formats. Event command registration and machine output delegates exist. Third-party mod API, content load order and validation tools not reviewed.

Implementation evidence: `GameData.cs`; `Data/Machines`; `Data/Shops`; `Event.RegisterCommand/RegisterPrecondition`; `GameStateQuery`.

YAIRPG: Author one original method/event with stable IDs and validators on existing engine seams. Do not import donor code or install a mod framework. Owner: ENGINE_EXPANSION.md.

## A08 Balance and numbers

Status: partial. Basis: SHOWN in installed source/table declarations; UI is source-only. Wider usefulness is a PROPOSAL.

Gift effects use signed points, quality/birthday modifiers; XP has fixed level thresholds; item price combines held quality and applicable modifiers; machines encode times/counts by rule. No broad economy calibration, RNG statistical test or pity-system coverage.

Implementation evidence: `NPC.receiveGift`; `Farmer.checkForLevelGain/getLevelForExperience`; `Object.sellToStorePrice`; `Data/Machines`.

YAIRPG: Expose real units and costs; choose original world balance rather than importing constants. Owner: SKILLS_AND_TALENTS.md and chains.

## A09 Time and scheduling

Status: covered. Basis: SHOWN in installed source/table declarations; UI is source-only. Wider usefulness is a PROPOSAL.

Game-time ten-minute clock, overnight work and daily cask aging are distinct. Multiplayer pause differs from single-player menus. Generic machine blockers exist but selected five do not use them. External offline catch-up not established.

Implementation evidence: `Game1.shouldTimePass/UpdateGameClock`; `Object.minutesElapsed/DayUpdate`; `Objects.Cask.DayUpdate`; `Utility.CalculateMinutesUntilMorning`.

YAIRPG: Label minutes, next morning and daily maturity precisely; select YAIRPG offline/interruption policy explicitly. Owner: chain and engine clock owners.

## A10 Onboarding and reveal

Status: partial. Basis: SHOWN in installed source/table declarations; UI is source-only. Wider usefulness is a PROPOSAL.

Defaults, levels, TV, friendship-related letters and purchases introduce knowledge; unknown cooking and earned gift disclosure stage information. Tutorial flags/quests and full early-game reveal sequence unread.

Implementation evidence: `Farmer.LearnDefaultRecipes/AddMissedMailAndRecipes`; `LevelUpMenu`; `Data/Shops:SeedShop`; `TV`; `ProfileMenu`.

YAIRPG: Separate learned, owned and usable-now without turning acquisition routes into required global progression. Owner: skill and introduction owners.

## A11 Little touches

Status: covered. Basis: SHOWN in installed source/table declarations; UI is source-only. Wider usefulness is a PROPOSAL.

Working wobble/sounds, ready-output icons with stack/quality, missing-count messages, advanced ingredient counts, taste notebook and last shipment recovery provide small source-shown feedback. Accessibility settings and controller ergonomics not comprehensively audited.

Implementation evidence: `Object.draw/minutesElapsed`; `MachineData.LoadEffects/WorkingEffects`; `CraftingRecipe.drawRecipeDescription`; `ProfileMenu`; `ItemGrabMenu`.

YAIRPG: Adapt the 26 touches after confirming which already exist. Owner: UI at scale and thematic UI.

## A12 Other systems

Status: partial. Basis: SHOWN in installed source/table declarations; UI is source-only. Wider usefulness is a PROPOSAL.

Collections distinguish learned from actually cooked/crafted. Build also contains farming, animals, buildings, fishing, combat, quests, multiplayer, festivals, special orders and minigames. Census is complete for discovered class/model names; these wider systems are not mechanically audited.

Implementation evidence: `types.txt namespace census`; `GameData.cs model census`; `Utility.getCookedRecipesPercent/getCraftedRecipesPercent`; `Data/Bundles`.

YAIRPG: A first useful application can deserve a receipt independently of recipe ownership; broader donor systems remain options, not new gates. Owner: existing world/skill/chain owners.
