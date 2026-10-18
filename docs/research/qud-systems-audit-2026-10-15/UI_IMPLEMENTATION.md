# U1 Source-defined UI and evidence limits

Supplied assembly 2.0.211.56, research only. The target evidence is the code path, its exact private text/conditions, input dispatch and return route. No Qud window was opened. No current rendering, controller feel, accessibility or 1366×768 usability claim is made. YAIR's accepted desktop-first Proto23 rules remain unchanged; this report selects no new surface or implementation.

[Source index](SOURCE_INDEX.md) resolves the classes below. [Exact lexical strings](private/INTERFACE_AND_CODE_LITERALS.json) retain file/line/token, including keys, fragments and code-only labels. They are not a localized rendered-string catalog. The parent [UI report](../procedural-crafting-ui-2026-10-15/QUD_UI_IMPLEMENTATION_NOTES.md) and its [212-class archive](../procedural-crafting-ui-2026-10-15/private/qud-cdda/README.md) remain the detailed shared popup/inventory/journal owners.

## U2 Skills: details are not purchase

SkillsAndPowersStatusScreen builds tree nodes through the shared legacy logic. Both its selected and highlight callbacks update details, so neither callback alone proves a purchase. SkillsAndPowersLine.Accept separately dispatches SelectNode to the game side and rebuilds data. BodyClicked expands an already owned tree, otherwise invokes Accept. Horizontal navigation controls expansion. Selecting a child without its tree offers the prerequisite tree purchase. Confirmation, SP and stat/prerequisite checks happen in SelectNode, not in the description renderer.

The details contain icon, name, learned/partially learned state, description, costs, stat gates and required skills. BaseStat gates may differ from the sheet's displayed current stat values. The exact text and formatting fragments are saved privately; public catalog names point to the underlying row IDs. Skill-root collapse, child learning and confirmation cancellation have different meanings. No claim that every mouse or controller activation is wired correctly follows from these methods.

## U3 Mutations: inspect, compare, then spend

CharacterStatusScreen obtains current mutation data, displays effective rank and type, and supplies current/next-rank descriptions and modifier explanations. Highlight updates this panel. Selection invokes StatusScreen.ShowMutationPopup through APIDispatch. That popup checks inherent ownership and caps before offering a one-MP rank-up; rejecting it returns without the increment. Buy Mutation is a separate command to MutationsAPI, with a confirmation before selection and four-MP default.

The random mutation chooser uses a repeated selection/variant loop after initial confirmation. It does not have a general cancel-to-no-op branch inside the inspected chooser loop; the outer confirmation is the clear rejection point. The rendered `/10` rank label in the modern panel is not the authority for all subclass caps. Some powers cannot level and show different information. Calculation details come from BaseMutation's effective-rank owner, including equipment/tonic/cooking sources, not from copied label text.

## U4 Cybernetics: the text lifecycle can commit an operation

The modern CyberneticsTerminalScreen bridges actual terminal state with a scroller, footer, back control and completion task. It creates a body-text row and one row per option, each with its OptionID. Selection ignores an incomplete cursor row, records the option and dispatches CurrentScreen.Activate. It then re-renders or completes exit. Global Cancel/Back resolves the terminal completion task; model submenus also have explicit Return/Back methods. Those are different exit layers.

Install chooses a current physical implant, then a current body part. Rows expose license cost, already-installed status, replacement and destruction warnings. Refusal screens cover license shortage, duplicate-one-only implants, unsuitable condition and forbidden removal. Back from location selection returns through the terminal security method. This is nominal source navigation, not an observed security result or authorization change.

A newly closed code link is **CyberneticsTerminalRow.Update → screen.HandleTextComplete → CurrentScreen.TextComplete → BodyPart.Implant**. The row calls the completion bridge when its final text cursor finishes, or when frame commands reveal the remaining text. CyberneticsInstallResult constructs success text before its TextComplete performs the implant and sets the one-shot guard before a possible unequip refusal. Therefore the transcript animation and final menu selection are not the only possible action boundary. A native trial would have to inspect that timing; this audit does not treat a success-looking paragraph as successful installation.

Font assets, prefab row assembly, serialized references, cursor ordering in every screen, precise pixel sizes and how input maps to frame commands remain incompletely decoded. This newly traced code callback reduces one wiring gap; it does not resolve all serialized UnityEvents.

## U5 Reputation: why a number matters

FactionsStatusScreen reads visible factions, constructs row data, supports expansion/collapse, fuzzy search, and alphabetic/high-to-low/low-to-high sorting. FactionsLine renders formatted standing plus feeling text, rank/pet/holy-place text and preferred-secret explanation. Accept toggles expansion. FactionsLineData includes those explanation fields in search text and uses current reputation for sort values.

Faction.GetRankText is gated by the source configuration key ShowFacitonRank. The mere existence of FactionRanks does not establish an always-visible rank badge. Feeling/holy-place descriptions can explain consequences, but those sentences do not by themselves establish all AI, trade or holy-place enforcement. The separately traced teaching service supplies one real reputation consumer. Search/expansion memory is screen state unless its persistence is separately shown.

## U6 Ability manager and hotbar

AbilityManagerScreen suspends the underlying navigation context while its async manager is open. It groups by class or custom ordering, supports filtering/collapse, and shows current details on highlight. HandleSelectLeft expands a category, shows an unusability reason, or resolves a selected ability result. That result still needs its caller to dispatch it. Cancel resets inputs, hides and resolves a default result unless a drag is active. Custom ordering writes Unity ordering in its own method; a UI preference record is not a gameplay power grant.

AbilityBar displays enabled/cooldown state, page/hotkey mapping and target/effect links. Its Use Ability path calls TrySendCommandEventOnPlayer. AbilityBarButton.OnClick has a Stage/disabled guard and queues its command as a mouse event. These are distinct routes. ActivatedAbilityEntry.TrySendCommandEventOnPlayer captures command and current unusability text, queues a game-side task, rechecks world-map usability there, then sends CommandEvent or a message. This is not a general atomic readiness transaction. Skills/mutations then own their real target/body/cost/effect checks.

The entry serializes flags, identity and tokenized cooldown. CooldownRounds uses ceiling of segments divided by ten. Qud's scheduler units must not be silently converted to YAIR minutes. Showing a cooldown or nominal range is separate from executing an action, consuming resources and observing a result.

## U7 Items and tinkering

The parent EquipmentAPI trace gathers actions from real actor/object providers, filters reach/telekinetic eligibility, sorts and resolves usable hotkeys, then dispatches InventoryActionEvent. InventoryAndEquipmentStatusScreen provides category/name sorting, fuzzy/substring search, collapse, actual weight/capacity and live object rows. Selecting an item can open TwiddleObject, refresh, exit or enter tinkering. A visible action is not proof its execution checks will pass.

DataDisk contributes Learn/Build only when understood. Its inspection presents output, skill requirement and whether the recipe is known; learn and reference-build have different disk/knowledge effects. Modern TinkeringStatusScreen divides known recipe data into Build and Mod, has category/search/collapse and bit displays, and uses highlight for details. HandleSelectItem toggles category or dispatches PerformUITinkerBuild/PerformUITinkerMod through APIDispatch. A result requesting exit closes the parent; otherwise it redraws. Legacy TinkeringScreen.Show returns immediately when the modern character-sheet route is active, while its static helpers remain actual consumers used by modern UI.

The build helper rechecks current skill, bits, ingredient and extremity/hostile rules. It reports missing means separately. Modified bit costs, direct-disk costs and modified output are not assumed identical. Neither view is proof of controller comfort, clipped descriptions or correct modded layout.

## U8 Journal, recipes, map and generated results

JournalStatusScreen is reused from the parent export. Revealed journal notes feed their own tabs. Map-note selection toggles tracking. Highlight sets/clears map targets and, only on map-bearing tabs with a valid target, centers the map. Recipe notes need not have a map location. Deletion dispatches JournalScreen.HandleDelete with category/entry/actor. Recipe-note deletion and campfire Hidden/Forget remain separate source operations.

Generated fetch acceptance reveals its specific target secret/map note. Acquiring its ID finishes a locate step and records an accomplishment; returning it enters a separate dialogue sequence. Those producers supply concrete generated-result text, quest popups and journal records. Engine history is not automatically exposed to the player. Exact variable replacements and dialogue conditions are retained in the full quest-giver source and HistorySpice tree; no generated-world screenshot was fabricated.

## U9 Existing image comparison and open evidence

The retained historical ingredient JPEG was visually inspected again in this pass. It visibly has checkboxes, a focused-row marker, servings/drams and a lower ingredient-domain explanation panel. The supplied assembly's previously traced Campfire generic picker passes names/counts/check state but does not pass those inline domain descriptions; separate item inspection does expose domain information. These agree at the broad selection/count level and differ at the inline-explanation level. The JPEG's exact build/mod state is unknown, so it cannot establish rendering of 2.0.211.56 or the latest game.

No matching-version images of skills, mutations, cybernetics, reputation, ability bars or generated quest presentation were acquired here. The parent's public-post captures provide provenance for its image, not independent screenshots of this installation. Remaining native checks are optional future isolated-profile research. Personal saves were not opened and no native trial is required merely to keep these source findings as references.

## Core source locators

The complete methods remain private. Line starts refer to this packet’s exports; the ledger limits each claim’s semantic scope.

| Complete source | Method line |
|---|---|
| [Qud.UI.SkillsAndPowersLine.cs](private/source/Qud.UI.SkillsAndPowersLine.cs) | 72 |
| [Qud.UI.CharacterStatusScreen.cs](private/source/Qud.UI.CharacterStatusScreen.cs) | 356 |
| [Qud.UI.CyberneticsTerminalRow.cs](private/source/Qud.UI.CyberneticsTerminalRow.cs) | 73 |
| [Qud.UI.CyberneticsTerminalScreen.cs](private/source/Qud.UI.CyberneticsTerminalScreen.cs) | 206 |
| [Qud.UI.FactionsLine.cs](private/source/Qud.UI.FactionsLine.cs) | 139 |
| [Qud.UI.AbilityManagerScreen.cs](private/source/Qud.UI.AbilityManagerScreen.cs) | 439 |
| [XRL.World.Parts.ActivatedAbilityEntry.cs](private/source/XRL.World.Parts.ActivatedAbilityEntry.cs) | 539 |
| [Qud.UI.TinkeringStatusScreen.cs](private/source/Qud.UI.TinkeringStatusScreen.cs) | 454 |
