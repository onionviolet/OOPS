# Adventures and scripts

Shown installed managed code. `GameData.Adventure.dll.cs` mainly defines authoring/runtime data and protobuf serialization; much of execution lives in GameData.dll's AdventureDomain and Shared runtime types. The existence of MoonSharp does not establish that these adventures are Lua.

## A1: Authored data layers

`AdventureCore.LoadFrom` reads files into core adventure, element and major-event data. `AdventureData.TryLoad`, AdventureElementData.TryLoad and AdventureMajorEventData.TryLoad use protobuf Parser.ParseFrom. AdventureDomain loads `StreamingAssets/AdventureCore`. Map adventure definitions have groups, blocks, elements, actions, parameters, custom text, lighting and compiled conditions/actions. Elements have move rules, visibility and event data. Major events have character groups, node arrays, next-node links, requirements/rewards, costs and decoration. IDs and runtime instances are distinct.

`AdventureDataCompiler.Compile` deserializes editor JSON to EventScriptEditorData, accepts adventure script types, uses compiler0.0.2.0 and emits InstructionCompiled bytes. Invalid type/compile errors log and produce empty instructions. The compiler stores local string references separately. This proves an editor-data-to-compiled-script path, not that the installed protobuf files all match an available editor source project.

## A2: Grammar and binding

`IEventScriptDecompiler` reads script IDs, labels, instruction count and instructions. Each instruction has indentation, assignment target, integer function ID, argument count and UTF-8 expression strings. Condition records have indentation, reversal flag, function ID and arguments. Packages start with an8-byte version; event refs use .NET GUID byte order, options add a second GUID, adventure refs use a debug string. Script types6–10 distinguish generation condition, month action, activation, removal and abnormal repair.

`CompDevLib.Interpreter.Interpreter<TContext>` tokenizes expressions and builds ASTs. Supported operator entries include equality/order comparisons, addition/subtraction, multiplication/division/modulo, unary signs, power, AND/OR/NOT, member access and assignment, with precedence. Literals include integers, floats, booleans, strings, lists and objects. Defined function/value-selector/modifier registries bind the expression to game domains. `EventScriptRuntime.CreateInst` resolves integer event-function IDs into names and builds interpreter instructions. This is a custom host-bound expression layer.

`ScriptExecutionInstance` supplies labels, conditional/loop scopes, iteration, break and goto behavior above expression evaluation. Execution is resumable through an enumerator and event/display callbacks. Dialogue branching is not simply a list of random text strings.

`AdventureInstructionAdaptor.Check` treats empty conditions as true, caches decoded scripts, evaluates condition lists with EventArgBox and catches evaluation failures as false. Execute treats empty instructions as no-op and logs failures. Decompilation/cache setup occurs before its try block, so malformed decode is not proven to share that fallback. Do not adopt empty-on-error behavior blindly in a YAIR authoring validator.

## A3: Triggering and generation

`AdventureDomain.AutoGenerateByConfig` checks ForceDisable, permitted month, target cooldown and core AutoGenerateCondition. It counts existing instances by area, limits monthly/world counts, builds allowed area/state caches and selects weighted areas with remaining allowance.93 generation rows were structurally enumerated. Cooldowns and spawn caps are source tuning, not proposed universal limits.

Generation, activation, visibility and removal are independent. Existing instances get month/pre-month hooks; script functions can explicitly create/change/remove adventures. The selected packages include both generated code and compiled scripts. Not every story script or spatial blueprint was semantically decoded in this pass.

## A4: Resolution

Map route: `MoveInAdventure` rejects absent adventure, active event, missing instance, impassable tile or insufficient action points. It consumes move cost, writes position, triggers auto events for PlayerMove and examines living elements. `FinishAdventure` removes with Complete reason and awards legacy source39 through AddLegacyPointCompleteAdventure. Source13 belongs to the separate sword-tomb completion path. Removal reason matters to cleanup/hooks.

Major-event route: EnterMajorEvent validates instance, absence of an already running major event, cost sufficiency and a Start node before payment. Then it makes cost, generates characters, fills EventArgBox and initializes current/main/unlocked/visited state. PostEnterMajorEvent triggers the start GUID. SelectMajorEvent requires membership in UnlockedNodes, updates current state and next links, triggers that node's event and records visit. Check nodes can remove only themselves when no successors; other nodes replace the main route's available links. ChangeMajorEventNextNodes can narrow to a known unlocked key.

RemoveMajorEvent exits running state, invokes RemoveAction except on FixAbnormal, releases data and removes the instance. ExitMajorEvent resets current player state without itself removing the world instance. AdventureMajorEvent.GenerateCharacters creates only the configured temporary roles; CallCharacters binds eligible existing actors through filters and can fail to fill a requested cast. Thus authored encounters can use persistent people or temporary cast members.

Rewards remain event-specific. Nodes and reward schemas do not prove every reward is delivered or crash-safe. Full reward consumers, complete blueprint corpus, combat branches and rendered choices remain unread. This research never enters an adventure or touches a save.
