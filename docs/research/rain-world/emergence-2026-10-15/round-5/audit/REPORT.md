# Rain World round 5: actual extension and Expedition save consumers

Research only, 2026-10-15. Status: PARTIAL overall; the named built-in callback and completion chain is source-traced. Prior reports remain read-only. No game or shipped routine was executed, actual save/configuration accessed, download/install performed or runtime code changed.

The main assembly remains SHA-256 `b6be1d4e18ce219d21091b51564cb6a11c1e4106b41de903eb8e58849cb16fdb`. Nine new full class exports have private command/input/output/exit receipts. Capture is distinct from the exact reading windows in [READ_LEDGER.json](READ_LEDGER.json). [FINDINGS.json](FINDINGS.json) has method/line/hash locators, [UNREAD.json](UNREAD.json) retains cumulative complements and [validation](VALIDATION.json) checks artifacts only. Full C#/IL and the registry reference-search receipt remain private.

## RW5-F1: the shipped passage API does not establish an active callback

Round 4 correctly excluded custom callbacks from its direct snapshot result. This pass narrows that exclusion using the actual implementation rather than assuming a callback always performs some unknown save action.

`CustomPassage` is an abstract extension surface. Its base OnWin, OnDeath and ApplyHooks bodies are empty. IsAvailableForSlugcat defaults true, CreateTracker defaults null, and RequirementsMet either returns true or requires every named prerequisite to have a matching tracker with GoalAlreadyFullfilled. Its other fields provide display, combat and Expedition-score defaults. None of these base methods recaptures the world or writes a save.

`CustomPassages.RegisteredPassages` is an initially empty public readonly List. Readonly constrains replacement of the list field; consumers can still change its contents. PassageForID returns the first matching ID. Register skips an ID already present, otherwise adds the object before calling ApplyHooks. There is no local callback catch, null-entry validation or rollback. If ApplyHooks throws after insertion, this method has not removed the newly inserted entry. That is a source control-flow property, not a reproduced mod error. Direct list mutation can bypass Register's uniqueness check.

A private whole-main-assembly IL reference search found zero direct calls to Register and zero classes extending CustomPassage. It found one OnWin call and one OnDeath call in WinState, plus registry access in lookup/registration and the Expedition score consumer. This is scoped static evidence for the pinned main assembly. It is not inspection of the live registry, dynamically loaded plugins, reflection or other assemblies. The result is that no built-in passage callback performing an NPC recapture was established in this assembly, while external registrations remain a genuine unknown.

## RW5-F2: invocation order and exception boundaries are concrete

`WinState.CycleCompleted` performs built-in progression updates, including its read of the already boosted shelter-friend like, before enumerating RegisteredPassages. For each available passage whose requirements pass, it resolves/creates the associated tracker, then invokes OnWin with the WinState, game and tracker. CreateAndAddTracker can call the passage's CreateTracker and does not add a null result, so an OnWin call is not itself proof that a usable tracker exists. The base implementation accepts that call and does nothing.

Only after this passage enumeration does CycleCompleted enter its Expedition-specific completion branch. There is no local try/catch around the custom enumeration or invocation. A thrown availability, requirement, tracker-factory or OnWin callback can therefore stop this local method before later callbacks or Expedition processing. The enclosing SessionEnded also has no local catch around CycleCompleted in the read route; its later SaveWorldStateAndProgression call has not yet occurred at that point. Broader engine/plugin exception handling is not inferred.

Death uses a different entry. DeathModifyTracker first changes selected built-in tracker states, then looks up the matching custom passage and checks availability/requirements before OnDeath. The callback gets the WinState and tracker, not a game argument. It is still virtual extension code, and the absence of a game parameter is not a restriction against other global access. The base method remains empty.

The death serializer temporarily changes incomplete trackers through DeathModifyTracker before encoding them, then restores selected Float/Integer/BoolArray progress fields. Custom OnDeath side effects are not generally rolled back by those selected assignments. There is no finally-based restoration in that serialization loop, so an exception before restoration does not establish that the original values were restored. PlayerDied is another direct caller of DeathModifyTracker for unfinished trackers. These are concrete ordering and cleanup limits rather than a claim that every custom passage is dangerous or active.

The narrowed ordinary-route result is unchanged: no recapture exists in the shipped base callbacks or reviewed built-in progression path. An externally supplied implementation can intervene, but this pass does not invent its behavior or promote that possibility into an observed save event.

## RW5-F3: Expedition completion saves a separate record, then clears the current campaign owner

The exact CycleCompleted branch requires the module, Expedition mode, a nonmalnourished state and a nonnull challenge list. It checks AchievementChallenge instances against the current WinState tracker, counts completed challenges and marks the expedition complete when the count reaches list size.

AchievementChallenge.CheckAchievementProgress requires not already completed, a game and WinState, then obtains its tracker and tests GoalFullfilled. Its base CompleteChallenge sets completed before HUD work, counts remaining/revealable challenges, updates HUD modes and may grant an earned passage if the passage unlock is active. This base method does not call BringUpToDate or request a world save. Its description/HUD calls and challenge subclasses remain potential separate callback boundaries, not evidence of a recapture. The complete AchievementChallenge class was read; other challenge implementations were not exhaustively audited.

CycleCompleted next records content requirements and calls Expedition.coreFile.Save(runEnded:false). AddExpeditionRequirements records the relevant module IDs for the selected character; it does not snapshot NPCs. ExpeditionCoreFile.Save stores the runEnded flag, then only calls coreFile.Set when coreLoaded, a file instance and coreFileCanSave all admit it. Otherwise it logs and returns void. Failure to meet that gate does not prevent the subsequent completion branch from continuing.

Its ToString builds a separate Expedition payload: level/points/wins, challenge records, unlocks, earned passages, mission/time and required-content data. With runEnded false, the current character's challenge list and active unlocks are still included. It does not encode the campaign's region population or pending-friend strings through these reviewed fields. Virtual challenge ToString bodies beyond the named built-in were not all read.

If expeditionComplete is true, CycleCompleted caches run kills/deaths when not already cached, mines selected save metadata, requests the Expedition win screen, then calls PlayerProgression.WipeSaveState. MineForSaveData's live-current-state branch copies summary fields such as den, cycle, food and karma, returning a small SaveGameData object. It does not call a world snapshot there.

WipeSaveState removes the matching campaign section from the retained progression text, submits that changed save key if storage/loading gates allow, then calls Revert. Revert clears currentSaveState and map caches. It also has module-specific cleanup beyond this campaign text, preserved in the source rather than executed here. The ordinary SessionEnded method still has its later SaveWorldStateAndProgression call, but its current-state encoder requires a nonnull currentSaveState. It therefore cannot recover a fresh NPC snapshot from that cleared field through the reviewed guards. Other surviving metadata can still be encoded; this is not a claim that the later call does nothing.

The ordering is consequently separate Expedition-core save request, selected campaign wipe request, current-save pointer clear, then the remaining session-end flow. There is no wait for durable success between these steps. A failed core initialization can skip its request while campaign completion continues. Even a submitted Immediate request inherits the previously audited backend boundary; it is not a transaction or a successful cross-file save receipt. No save, wipe, OS failure or native Expedition completion was executed in this research.

## RW5-F4: the death/quit scrub helper does not directly consume pending friends

The sibling asked whether SaveDeathPersistentDataOfCurrentState's call to WarpPoint.ScrubNonDeathPersistentData invalidates its retained-FRIENDS observation. The actual helper was captured and read.

It resets two in-memory sealed-room lists from their old versions, then walks three warp-point dictionaries. It parses each warp record, checks room/trigger state, clears selected same-cycle trigger/expiry fields for admitted records, collects replacements and writes them back after the scan. Its per-dictionary scan has a catch that logs and then applies changes already accumulated. The helper does not directly clear pendingFriendCreatures, replace region strings, refresh world NPCs or call a save routine in the shown body. Its nested placed-object parser is not an audited all-purpose transaction boundary.

Thus the direct death-persistent tagged replacement remains compatible with retaining the prior FRIENDS text even though the runtime pending queue was consumed. This does not prove automatic same-session retry. The sibling's outer failure chain and engine boundary remain distinct.

An independent process-switch check confirms a fresh-session distinction. ProcessManager.PostSwitchMainProcess can resume a pending process directly, bypassing its fresh-process branch. Otherwise a transition to Game normally calls progression.Revert and constructs a new RainWorldGame. StoryGameSession's constructor then calls GetOrInitiateSaveState, whose previously read route can reuse a retained starved object or load campaign data from the stored key. A fresh process may therefore regain queued friend data from a retained earlier payload, while a resumed process need not reset the one-shot latch. Engine update exception recovery, exact transition selection and native replay remain unobserved.

## Status and remaining limits

| Code | Disposition |
|---|---|
| RW5-U1 | Shipped base passage methods and pinned-main-assembly registration references covered. Actual external registrations/plugins/reflection and callback side effects remain unread. |
| RW5-U2 | Named built-in Achievement/Expedition core/completion/wipe chain covered. Other challenge implementations, win-screen finalization and all mode-specific endings remain unread. |
| RW5-U3 | Direct WarpPoint scrub and process resume/new distinction covered. Enclosing engine exception handling, retry behavior, backend/cloud durability and native save acceptance remain unobserved. |
| RW5-U4 | Prior graph, malformed input, movement, weather, faction and captured-unread class gaps continue in the cumulative ledger. |

These are research results, not adopted YAIRPG mechanisms or authorization to implement them. The [saved research flow](../../audit/RESEARCH_FLOW.md) remains the workflow owner. Source/receipt validation establishes evidence consistency only.
