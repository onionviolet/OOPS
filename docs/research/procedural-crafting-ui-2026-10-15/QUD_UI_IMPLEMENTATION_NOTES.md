# Qud UI implementation details

2026-10-15. User requested specific Qud UI implementations and deeper decompilation. Research only: executable supplied build 2.0.211.56, original assembly hash in [ingredient trace](QUD_INGREDIENT_RECIPE_USE.md). Code establishes dispatch and source-defined behavior; it does not replace visual/native input acceptance. [Full UI exports and receipts](private/qud-cdda/qud/UI_EXPORTS.json), [shared popup source](private/qud-cdda/qud/source/XRL.UI.Popup.cs), [modern popup window](private/qud-cdda/qud/source/Qud.UI.PopupMessage.cs). No YAIR code is changed.

## UQ1: One menu description, two rendering paths

`Campfire` builds the choices. `XRL.UI.Popup.PickOption` accepts title, introduction, option text, hotkeys, icons, buttons, context object, default selection, width, spacing and cancellation flags. `Qud.UI.UIManager.UseNewPopups` resolves to `Options.ModernUI`. This is a shared service, not a separate cooking widget per action.

On the modern path, `GetPopupOption` converts an option into a menu item with its icon, optional character hotkey and `option:<index>` command. A Cancel footer item is added only when escape is allowed. A callback translates Cancel to −1 or the option command to its index. The caller still owns whether that result merely toggles a checkbox, opens a submenu or starts an operation.

On the legacy path, the service builds formatted text sections and uses a console buffer. MaxWidth is capped at 74 console units; the selected index and visible range drive scrolling. It handles mouse Choice events, supplied hotkeys, keypad movement, page commands and permitted Escape, clamping selection into the option range. These limits belong to a console path and are not physical pixel measurements or a recommendation for YAIR.

## UQ2: Selection is separate from committing work

The ingredient popup repeatedly reconstructs rows from candidate data, while a parallel boolean selection list survives those redraws. It remembers the focused row, shows checked state and available count, and makes its first row the cook-with-selected action. Exceeding the allowed ingredient count blocks confirmation rather than treating every row click as material consumption. Escape returns before final effect/debit logic.

This provides a useful mechanism to compare with single-choice menus: moving focus, marking several ingredients and confirming an operation are three different actions. The inspected popup call does not supply inline domain descriptions, despite those descriptions existing in item inspection. The historical screenshot in [UI evidence](QUD_CDDA_UI_EVIDENCE.md) depicts a different, richer ingredient view. Do not claim that all views automatically share that detail.

## UQ3: The modern popup owns layout and input handoff

`PopupMessage.ShowPopup` configures optional title, message, input field, context image/text, after-image, item list and footer buttons. It rebuilds controller elements, refreshes footer layout, shows the window and reselects the requested default item. Numeric restrictions change the input field mode. Its placement code either centers the popup or selects a pivot from the requested screen location, then clamps position.

`SizeContentToWidth` uses an 840-unit maximum preferred width and available height minus 100 layout units, with a bounded rebuild loop. These are Unity layout values affected by scaling and serialized object configuration, not proof of an 840-pixel window. Fonts, prefabs, transforms, stage scale and actual content still determine final presentation. Their source references are retained; full prefab geometry was not decoded.

`Show` suspends underlying navigation. `OnActivateCommand` and `OnSelect` consult tutorial permission, invoke their callback and hide the popup. Hide disables interaction/raycasting and delays visual deactivation by two updates; it also runs an outstanding hide callback once. This is not a general transaction rollback or a proof that every caller restores its previous focus correctly.

The exported `QudBaseMenuController<DataT, UnityT>` separately exposes focus-selection, activation, footer activation and cancellation events. It handles Accept, page scrolling and left/right movement into footer buttons; `QudTextMenuController` adds item hotkey handling. Serialized UnityEvent/prefab wiring was not fully decoded, so a method named OnSelect must not be assumed to fire on every focus change. Controller behavior and window callback names are distinct evidence.

`XRL.UI.Popup.WaitNewPopupMessage` distinguishes calls on the UI queue from calls elsewhere. The latter uses a completion source, enqueues window setup, pushes a game view and waits for a selected result or cancellation. It then pops that view and clears/reset inputs at explicit boundaries. A calling API that appears synchronous can therefore involve a separate UI thread and a modal lifecycle. This matters when tracing why an action has or has not actually completed.

## UQ4: Item actions are gathered from the object and actor

`EquipmentAPI.ShowInventoryActionMenu` collects visible actions, filters for distance/telekinetic applicability, sorts them and assigns usable hotkeys. Conflicting keys can be reassigned, while keys already mapped to navigation/menu controls are not blindly reused. `TwiddleObject` dispatches the selected inventory action against the actual actor/object.

`Food` contributes Eat, `Campfire` contributes cooking actions, and other parts contribute their own actions. This explains a useful separation: shared menu construction, contextual action discovery and native action validation remain different responsibilities. A visible action does not guarantee its execution checks pass, and a UI row does not itself implement the item effect.

## UQ5: Inventory is a live object view with multiple ways to find items

`InventoryAndEquipmentStatusScreen.UpdateViewFromData` creates pooled row data referencing actual game objects, excludes hidden-in-inventory objects, derives category filters, and supports category/A–Z sorting. It implements substring and fuzzy search routes over stripped display-name search strings. Category rows can collapse and show counts/weight. Carried weight and capacity are read from the actor.

`HandleSelectItem` distinguishes a category row from an item. A category toggles collapse. A permitted item selection dispatches `EquipmentAPI.TwiddleObject` through `APIDispatch.RunAndWaitAsync`; depending on the resulting action, it can enter tinkering, exit status screens, or rebuild the view. This is stronger than a detached static item description, but it does not prove the whole interface is responsive or observer-safe in every mod.

The display/search-name caches in `InventoryLineData` and its pooled row lifecycle are retained for reference. Persistence of every filter, selection and collapsed state was not proven. Do not treat remembered screen state as saved game knowledge automatically.

## UQ6: Recipe availability and notebook knowledge have different views

The campfire recipe list filters known recipes by hidden/diet state and availability, with an explicit way to reveal entries missing ingredients. It then offers Cook, favorite change, Forget and Back. The recipe description combines ingredient requirements and effect description. Cooking rechecks requirements before consuming, rather than trusting the previously drawn list.

The journal's recipe tab obtains revealed `JournalRecipeNote` entries. Recipe invention reaches that note through `JournalAPI.AddRecipeNote`, and `Reveal` also adds the actual recipe to the known recipe list. Modern journal code adds category/filter/map navigation where applicable. A recipe note is not necessarily a place with a map target.

**A useful divergence:** journal deletion calls `JournalAPI.DeleteRecipeNote`, whose inspected body removes the note from `RecipeNotes`. It does not itself remove the associated recipe from `CookingGameState.knownRecipies`. Campfire Forget instead sets the recipe's Hidden flag. Therefore deleting a note, hiding a recipe and unlearning a method cannot be assumed equivalent. This is a static distinction, not a tested persistence bug.

## UQ7: Show what is known, then report what actually happened

Prepared ingredients append broad effect-domain descriptions on item inspection. Inspiration choices show templated possible effects before selection; applied effects can initialize numeric values afterward. The metabolism result and later triggered notifications use different messages. Saving a known recipe preserves its component/effect structure, while some numerical rolls remain variable.

The report must therefore distinguish candidate explanation, effect template, initialized applied status, later triggering and actual stat mutation. Qud supplies separate locations for these stages. That pattern is a useful research reference; it does not grant the YAIR player access to hidden material truth or select a new universal preview rule.

## UQ8: What code tracing can and cannot settle

Code can settle which menu is called, how rows are filtered, where focus starts, which commands cancel, where stock is checked/spent, and which owner records a discovery. It can expose nominal layout constraints and callback lifetimes. It cannot establish final visual hierarchy, clipped text, controller feel, accessibility or the absence of input leakage without runtime evidence. The installed copy is available for a later isolated UI trial; this pass did not launch it or read personal saves.

Candidate adaptations remain LATER / DELEGATE: adjacent ingredient possibilities and quantity, a distinct confirm action, context-aware item actions, useful missing-requirement reasons, and notebook links tied to actual recipe records. Any selected YAIR implementation must use its existing shared components/controller and accepted Proto23 desktop composition. No replacement shell or copied proprietary source is proposed.
