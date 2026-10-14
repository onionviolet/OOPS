# Hiding UI and integrations

2026-10-13. Docs-only worker proposal for coordinator review. Considerations, not specs. No gameplay, schema, settings or gate changes.
This file is the worker's only write. Existing owners remain authoritative. No sealed world truth is described. Secret references use ID, route and status.

Target: laptop/desktop at 1366x768, 1440x900 and 1920x1080.
Visible outcome to consider: deliberate concealment with a clear way back, plus cheat effects shown beside the ordinary systems they actually affect.
Mobile optimization, new world implementation and universal cheat runtime are deferred.
Minimal mode is a player choice, not a replacement for using laptop space.
That follows `docs/USER_VISION.md`, “Standing UI priority”, and `PROJECT.md`.

## Grounding and proposal boundaries

| Evidence label | Meaning in this note |
| --- | --- |
| shown | Present in inspected repo source. No browser execution implied. |
| stated | An existing owner says this. Its own proposal status still applies. |
| inferred | A possible integration or consequence, not existing behavior. |

The integration matrices below are entirely inferred candidate mappings. Hook names are stated in `docs/CHEAT_LIBRARY.md`, “Implementation”.
They are not proof of an implemented shared event dispatcher. World rarity, recharge, concealment strength and information limits remain dials.
Repeatable, unlimited and exceptionless variants stay possible where they fit. The reveal-once rule concerns presentation arrivals, not limits on a power's uses.

| Owner and section | What this note adds |
| --- | --- |
| `docs/CHEAT_LIBRARY.md`, families and “What a library card holds” | Separate observer visibility from player display choice; map hooks to ordinary UI. |
| Same file, “Acquiring cheats” AQ and “Unlocking the optional start” US/ST | Conceal dormant identity without hiding known start costs or imposing a new unlock route. |
| Same file, “More to consider” SW/UP/RS/WR/LB/CT | Restore, safe captures and world-relative standing across several panels. |
| `docs/CHEAT_COSMOLOGY.md`, backing, placement and meetings | Concealment has a carrier, reach, targets and counters; hiding is not a universal defense. |
| `docs/CHEATS_BY_WORLD.md`, game cheats | Keep player controls separate from fictional powers and retain source qualifications. |
| `docs/worlds/FEATURE_UNLOCK_AND_CHEAT_ACQUISITION_PROCESS_2026-10-13.md`, placement and journey | Separate encounter, access, activation, useful use and panel discovery. |
| `docs/worlds/FIRST_CHEATS_AND_DEATH_REWARDS_2026-10-13.md`, death rewards | Hidden interface history does not grant a new character the old holder's knowledge. |
| `docs/PANEL_KIT.md`, Contract and Acceptance | Apply existing discovery, reasons, keyboard and restore gates to concealment. |
| `docs/PRESENTATION_AND_FOURTH_WALL.md`, UI powers and the Clerk | Preserve fictional darkness and playful interference while keeping controls usable. |
| `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`, Vivid frame onward | Place disguise in appropriate layers without replacing role tints or player palettes. |
| `docs/research/proto23/CRAFTING_SCREEN_AND_ADJUSTABILITY_CONSIDERATIONS_2026-10-13.md`, AJ/ST/PK/CH | Reuse adjustability and panel templates instead of creating another settings system. |

## Hiding UI

### HU1. Four different meanings of hidden

| Meaning | Who is denied access? | Candidate consequence |
| --- | --- | --- |
| Undiscovered | This character has not learned the function exists | No panel name, setting, count or picker entry. |
| Concealed in fiction | An observer cannot perceive the window or its evidence | World observation rules decide what that observer learns. |
| Hidden by the player | The player has put away a known surface | Restore remains available; mechanics do not change. |
| Unavailable or lost | The known source cannot supply its function now | Keep its known record and a specific reason. |

Stated: these distinctions extend SW7/SW8/SW12 and the panel kit's Contract.
Shown: `src/workspace_layout.js` stores layout `hidden` separately from predicates.
Inferred: treating these four states as one boolean would lose useful meaning.

### HU2. Private windows

Consider a window only its holder can see, hear or touch. Opening it in the player UI need not expose it to an NPC standing nearby.
An observer may still notice muttering, distracted eyes or an impossible result. Privacy of the window and privacy of its consequences are separate dials.
This extends library SW8 and the cosmology placement card's observer fields.
No new franchise claim is needed to author an original private-window variant.

### HU3. Observers who can read it

Consider consent-based sharing, specialist sight, linked party access or interception. Each route can read different parts: presence, family, current message or full values.
Show the holder only exposure evidence they have actually learned.
Do not announce an unknown observer with an eye icon or hidden-observer count.
A known guild inspection can ask for a limited public reading rather than full access.
Limits and counters follow the world's meeting rules, not an automatic grade winner.

### HU4. A notebook disguise

Consider a held window presented as ordinary notes, a receipt book or a ledger. In fiction, this may need an object, illusion, cover story or learned method.
Player-side reskinning alone does not supply that method. Keep a stable accessible function label inside the known interface.
If the disguise creates observer risk, quote its known upkeep beside its action.
Use existing Notebook and library forms, extending LB11 rather than adding a second journal.

### HU5. Public stealth mode

Consider quiet mental reading, muted voice, no projection or selective message suppression. Different worlds may permit all, some or none of those methods.
The character chooses a fictional mode through an authored action when it has a cost.
The player chooses display quietness independently through existing display controls.
A public-use tell can remain even when the player turns effects off.
Never convert reduced motion or muted audio into an in-world stealth bonus.

### HU6. The window going dark

Stated: “The system dies” in the presentation owner and SW7 allow this fiction. Consider a known panel showing “Connection lost” and last-read values with a timestamp.
Distinguish fresh observations, cached readings and unavailable predictions.
The underlying ordinary controls remain reachable through their ordinary owners.
If the power truly stops, remove its live contribution through the mechanical owner.
Cosmetic darkness alone changes no contribution, clock, reward or permission.
This extends SW12 with a readable recovery path, not guaranteed resurrection of the system.

### HU7. Cracked readings and the Clerk

Stated: presentation “Shattering panels and UI damage” defaults to cosmetic cracks. Consider a static crack ornament, delayed readings or a fallible Clerk as separate options.
Only an authored state change can make the reading inaccurate.
Keep actual action quotes, save results and failure messages outside that unreliable voice.
The Clerk may misread a fictional stat but cannot invent the price charged by a control.
Use attribution such as “Clerk's estimate” when its fallibility is known.
An accessible plain view can replace a visual effect without granting new knowledge.

### HU8. Hide a known panel

Shown: workspace Hide records a layout choice; its picker can Show the known panel.
Consider grouping related cheat surfaces in that existing picker after discovery.
Hiding one panel need not hide its known notebook entry or disable its source.
Keep hidden, collapsed, unavailable and quiet-passive states distinct in labels.
Restoring the panel restores placement and focus, not an acquisition reward.
There is no need to charge fictional currency for player layout recovery.

### HU9. A quick boss key

Consider one remappable shortcut plus a visible “Hide cheat views” control.
Use a temporary mask over known cheat surfaces, not repeated saved-layout mutations.
Retain the pre-mask layout and each panel's prior hidden state for exact restoration.
Ignore the shortcut while typing, composing input or using a conflicting browser command.
Keep a plainly labelled restore control outside the masked surfaces.
Default to session scope; a lasting preference could be a separate explicit choice.
This extends AJ/ST adjustability. No boss key is shown in the inspected source.

### HU10. Minimal mode

Consider a user-chosen view with current action, essential context and relevant costs.
Existing Focus layout is a starting surface to compare, not proof of cheat filtering.
Keep independent useful panels available at the normal desktop layout.
Let the player choose which known optional panels to omit.
Minimizing a view never pauses an activity or changes its automatic spending policy.
If a hidden activity needs a decision, offer a neutral, reachable attention control.

### HU11. Screenshot-safe mode

Consider a dedicated preview with names, private notes, seeds and cheat details masked.
Offer a curated share card as another option, extending SW10.
The mode can redact already-known spoilers for the player's audience.
It never reveals something the current character does not know.
Apply masking to tooltips, focus descriptions, log snippets, titles and overlays too.
Do not alter the browser clipboard or export a save merely to produce a share card.
A masked screenshot is presentation privacy, not encryption or save anonymization.
No fictional concealment benefit follows from sharing a masked image.

### HU12. Unknown names and silhouettes

Current baseline: undiscovered panels are absent under `docs/PANEL_KIT.md`, Contract.
UP2, thematic “Proto23 flow per world” and crafting AJ9/PK4 allow silhouettes as proposals.
Consider silhouettes only where a known clue establishes an unnamed object or function.
An unnamed Notebook clue can be discovered without discovering the full cheat panel.
Counts of entirely unknown panels would extend the current kit contract.
The coordinator should record that extension explicitly if selected for a world.
Silhouettes, absence and full disclosure remain reasonable per-world alternatives.

### HU13. Redaction by grade

Consider known rows with “Unreadable at your current grade” only when the gap is known.
Otherwise omit the field or use the actual clue's unnamed wording.
Do not encode secret length, exact grade or hidden category through redaction width.
Stated: CH7 in the panel-card JSON is a grade-limited hover/focus overlay.
Its accessible description must use the same redacted reading as the visible text.
Source provenance can say shown, stated or inferred without confirming a sealed cause.

### HU14. Diegetic and player-side placement

| Surface | Candidate placement | Boundary |
| --- | --- | --- |
| A held status window | Character panel or optional local reading | Its existence and knowledge follow the card/world. |
| Disguised notes | Existing Notebook tab or adjacent detail | Notes retain their actual author and confidence. |
| Appraisal | Focusable local overlay | No separate workspace panel for CH7. |
| Companion voice | Log channel, later its known panel | CH5 growth remains distinct from first contact. |
| Cheat policies | Inside that cheat's known panel | CH10 remains embedded; spending policy is mechanical. |
| Hide, restore and screenshot controls | Layout or This browser | No in-world acquisition gate. |

### HU15. Theming a concealed view

Consider a notebook ornament in L3, local lighting in L4 and damage accents in L6.
Keep L2 role orientation and L1 contrast intact.
L7 player palettes win over a world's preferred disguise colors.
A screenshot mask is a display filter, not a new world layer.
Avoid revealing an unreached world's style through a hidden panel's preview.
This extends thematic “Layers, from base to most personal”, without reordering it.

### HU16. What must remain reachable

| Essential surface | Treatment to consider while cheat views are hidden |
| --- | --- |
| Save, export and import | Retain genuine controls and truthful success/error status. |
| Recovery and restore | One obvious route, usable without the hidden panel. |
| Costs and obligations | Show the real quote before acting and a receipt after settlement. |
| Current dangerous action | Keep cancellation, exit, continuation and required choice reachable. |
| Access and eligibility reasons | Explain known blockers without exposing hidden causes. |

Costs may be compacted, but an active purchase cannot omit its real payment.
Screenshot preview may mask the recipient while preserving an amount and cost kind.
If it cannot safely describe a transaction, leave it noninteractive until normal view returns.
Disagreement: presentation “The Trickster” suggests hiding the save button behind a joke.
Prefer hiding a decorative duplicate while the genuine save/recovery controls remain visible.
This follows that owner's own meta safety line, “Never actually alter, delete or hide a save.”

### HU17. Accessibility of hidden things

Consider removing masked content from focus and the accessibility tree together.
Do not make visual opacity the only hiding mechanism.
Restore should move focus to a stable known control, with a visible ring.
Hidden panels stay outside F6/Shift+F6 navigation, as the kit already states.
Appraisal works by keyboard focus as well as hover.
Use a short neutral announcement for hide/restore, not repeated live stat narration.
Large text and reduced motion keep the same knowledge, costs and action reach.
Screenshot-safe masking must not leave the unmasked name in an accessible label.

### HU18. Discovery while hidden

Consider committing the discovery fact even when the player's temporary mask is active.
Suppress the identifying cue, sound, target pulse and toast while masked.
Keep the known entry recoverable after the mask ends.
A neutral pending-notice indicator is optional and must reveal no unknown counts.
Restoration can offer an ordinary “Review recent notices” action.
Do not replay the arrival animation as if the source had been acquired again.
Loss, repair, reshow and crossing worlds are state updates, not fresh discovery arrivals.

### HU19. Reveal-once and save reconstruction

Shown: `moduleKnown` uses `discovered()` or eligibility and keeps knowledge in session.
Shown: `revealArmed` suppresses reconstruction cues around the start screen.
Neither function is evidence of a durable discovery ledger for every proposed cheat.
Consider deriving discovery from settled save facts, including first messages where relevant.
For a dormant unknown card, both predicates must avoid making it known prematurely.
An explicit `discovered: false` result alone does not defeat true eligibility here.
Reload/import should reconstruct known state silently; hiding never clears discovery facts.
See `src/workspace_layout.js`, `moduleKnown`, `revealArmed` and `reveal`.

### HU20. Settings and scope

Consider browser-owned hide preferences and session-owned emergency masks.
World concealment, source suppression and paid auto-use belong to game state.
Stated: acquisition placement keeps player controls available without a power grind.
Shown: `src/display_settings.js` stores presentation in `yairpg.display.v1`.
Layout export includes display choices; game-save import is a different operation.
A preset, layout import or reset must not grant, spend, erase or reactivate a cheat.

## Integrations

### IG1. Reading the full hook matrix

Each cell suggests an optional use of that hook, not a required subscription. “None” means no direct mechanical hook is proposed for that pair.
Select only the hooks the particular card and world need. Read the same system row in both matrices for all nine hooks.
The UI and owner table below identifies where each row would surface and be merged.

| System | onDayBoundary | onAction | onKill | onDeath | onRestart |
| --- | --- | --- | --- | --- | --- |
| Crafting | Fuel or workshop upkeep | Costed assisted craft | Eligible harvested input | Decide unfinished-work fate | Restore retained designs, not free output |
| Combat | Known charges recover | Costed special move | Validated extraction or bounty | Resolve revival or loss | Rebuild eligible kit |
| Skills | Authored training settles | Method practice or copying | Relevant combat learning | Decide memory carrier | Apply retained competence explicitly |
| Titles | Calendar deed check | Relevant deed check | Slayer deed check | Life-end recognition | Apply carried title only if backed |
| Notebook/people/routes | Age known reports | Record witnessed interaction | Record known encounter outcome | Preserve entitled records | Rebuild this character's knowledge |
| Work ledger | Authored contract upkeep | Quote and settled modifier | None unless contract requires it | Resolve contract terms | Carry only supported obligations |
| Home/furniture | Supported territory production | Build, repair or attune | None unless defense condition | Determine custodianship | Apply actual inherited property |
| Weather/pacing | Supported forecast refresh | Costed weather intervention | None unless event changes weather | End holder-bound effect | Reconstruct supported clock policy |
| Durability | Authored maintenance | Wear, repair or preservation | Authored trophy wear effect | Resolve item/bond state | Carry exact condition if retained |
| Heir/death | None unless an anchor ages | Name carrier or set anchor | None unless death card needs it | Resolve offers and recipient | Apply chosen carry manifest |
| Content packs/optional worlds | Local supported cadence | Local cheat verb | Local eligible reward | Local continuation rule | Reconstruct supported pack state |
| Authoring/site editor | None | Preview authored binding | Fixture preview only | Fixture preview only | Fixture preview only |
| Settings/display | None | Presentation response only | Display settled receipt only | Display known outcome only | Rebuild preferences without rewards |
| Save/import | Persist settled boundary | Persist settled action | Persist settled outcome | Persist pending/final choice | Persist new life atomically |

| System | onTravel | onObserve | onGift | onLevel |
| --- | --- | --- | --- | --- |
| Crafting | Recheck recipe/material/fuel/operator | Learn supported reading or method | Register accepted design or ingredient | Unlock authored assistance stage |
| Combat | Recheck local support and counters | Learn tell or copy eligible move | Transfer eligible summon/item support | Unlock authored combat verb |
| Skills | Translate known methods, not mastery | Copy only observed supported content | Teach or accept supported lesson | Record new usable method |
| Titles | Reevaluate local standing/effect | Learn a publicly shown title | None unless bestowed title is authored | Relevant milestone deed |
| Notebook/people/routes | Known route and compatibility note | Grade-limited entry with evidence | Record accepted gift and recipient | Update known readings, not hidden people |
| Work ledger | Recheck contract reach | Show known terms or forgery clues | Accepted multiplier return | Unlock authored contract control |
| Home/furniture | Recheck remote support | Inspect known installed effect | Transfer eligible furnishing custody | Unlock authored territory stage |
| Weather/pacing | Recheck local season and time basis | Forecast with age/confidence | None unless weather gift is authored | Expand authored forecast reach |
| Durability | Recheck environment and repair support | Read known wear and repair quote | Transfer custody with exact wear | Expand authored preservation capability |
| Heir/death | Recheck anchor jurisdiction | Learn known carry eligibility | Make supported bequest | Unlock authored carry option |
| Content packs/optional worlds | Per-edge Works/Reread/Rechannel/Weakened/Blocked | Local known rules only | Supported transfer contract | Local authored stage |
| Authoring/site editor | Preview declared compatibility | Preview redacted reading | Fixture preview only | Fixture preview only |
| Settings/display | Known frame and readable reason | Display authorized knowledge only | Display receipt only | Budgeted settled notice only |
| Save/import | Persist actual crossing outcome | Persist earned observation | Persist accepted transfer | Persist earned advancement |

### IG2. UI and candidate source owners for every system row

Paths here are merge destinations to assess, not authorization to edit them. Shown: these named modules exist; candidate cheat wiring remains inferred.
Shared wiring would also involve `src/cheat_cards.js` and the relevant host.
No claim is made that one file owns every native and expansion variant.

| System | UI would show | Candidate mechanical owner | Candidate presentation owner |
| --- | --- | --- | --- |
| Crafting | One quote, source contribution, consumed inputs, final receipt | `src/native_craft_transaction.js`, `src/crafting_recipes.js` | `src/crafting_detail.js` |
| Combat | Known source beside move/cost; extraction result after actual outcome | `src/main.js`, `src/combat_math.js`, `src/models/combat.js` | `src/ui/combat_display.js` |
| Skills | Known method, acquisition evidence, usable or blocked reason | `src/models/skill.js`, `src/skill_discovery_native.js`, `src/skill_expansion_host.js` | `src/skill_expansion_ui.js` |
| Titles | Earned title and known local effect; no unknown title checklist | `src/titles.js` | `src/titles_ui.js` |
| Notebook/people/routes | Evidence, last observed time, confidence, known travel blocker | `src/adventure_notebook.js`, `src/people_knowledge.js`, `src/known_routes_host.js` | `src/people_ui.js`, `src/known_routes_ui.js` |
| Work ledger | Source terms, real quote delta, settlement and outstanding obligation | `src/work_ledger_system.js` | `src/work_ledger_ui.js` |
| Home/furniture | Installed source, upkeep, occupancy/custody and supported benefit | `src/home_furnishing_host.js`, `src/home_furnishing_facts.js` | `src/feature_expansion_ui.js` |
| Weather/pacing | Observation versus forecast; local clock, cost and stopping cause | `src/weather.js`, `src/absorb_e1/pacing.js` | `src/display.js`, `src/feature_expansion_ui.js` |
| Durability | Exact item, condition, selected repair cost and retained wear | `src/absorb_e2/durability.js` | `src/display.js` |
| Heir/death | Recipient, carrier, what stays, what transfers and known costs | `src/life_experience_host.js`, `src/heir_inheritance.js` | `src/life_record_ui.js`; future death-menu adapter |
| Content packs/optional worlds | Known local source, declared mode and specific compatibility reason | `src/content_packs.js`, `src/structured_pack_runtime.js` | `src/content_pack_ui.js`, `src/structured_pack_ui.js` |
| Authoring/site editor | Preview label, validated binding and separate apply action | `src/authored_site.js`, `src/customization_profiles.js` | `src/authored_site_ui.js`, `src/work_ledger_author_ui.js` |
| Settings/display | Browser preference versus gameplay policy, description and reset | `src/display_settings.js`, `src/workspace_layout.js` | `src/customization_ui.js`, `src/panel_kit.js` |
| Save/import | Genuine save result, compatibility failure, preserved current state | `src/save_files.js`, `src/save_migration.js`, `src/expansion_persistence.js` | `src/main.js` save/import host |

### IG3. Reuse ordinary transactions

Consider a cheat modifier entering the same quote/validation path as ordinary work. The button, final settlement and receipt should use the same authoritative result.
Do not apply a second bonus because the crafting panel and cheat ledger both rendered.
Shown: `observeWorkLedgerCraft` and quote modifiers exist in `src/work_ledger_system.js`.
Shown: `persistExpansionPlan` in `src/expansion_persistence.js` owns persistence/publication.
Inferred: a future hook adapter could follow that boundary rather than bypassing it.

### IG4. Event meaning and duplicate delivery

Consider explicit actor, source, world, target, cause and settled sequence identifiers.
Distinguish attempted action, committed action and actual kill outcome.
An accepted gift is not merely opening a gift dialog or moving between owned inventories.
Observation records what the means actually read, not the full target definition.
Give a selected adapter a deterministic order and a durable duplicate-delivery policy.
Repeated legitimate actions remain possible; rendering, reload and import are not new actions.
Hook-generated effects should not recursively trigger themselves without an authored rule.

### IG5. Death and restart are different boundaries

Consider persisting a pending choice before presenting a death menu. Resolve recipient and carrier before building the next save.
Heir, revival, rewind and player-profile unlock need separate retained-field manifests.
Shown: `buildLifeHeirSave` uses actual leftovers in `src/life_experience_host.js`.
It does not establish every proposed afterlife selector or regression rule.
This extends “Death rewards: distinguish recipient and effect”, not the allowed reward palette.
Hiding the menu cannot choose a default carry, redraw a reward or spend a charge.

### IG6. Travel and standing

Consider separate answers for carried, known, supported and locally exceptional. An item can arrive while its activation is blocked; its known record can stay readable.
Use the cosmology's compatibility modes and library WR standing fields as separate views.
Do not label an ordinary local status window as a cheat merely because it uses CH1.
WR6 permits world-fact and held-card discovery routes as an extension to the panel cards.
Known reasons can name missing signal or fuel, but not an undiscovered destination rule.

### IG7. Presentation follows settlement

Shown: `src/settled_text_effects.js` is presentation only and consumes receipts.
It deduplicates recent visual effects in memory; that is not durable reward deduplication.
Consider one stored receipt feeding ordinary log, cheat record and optional effect.
During hiding, suppress identifying effects without dropping the authoritative receipt.
Restoring or enabling sound must not rerun its gameplay event.

### IG8. Authoring and optional content

Consider declarative hook conditions/effects with supported vocabularies and validation.
No executable function enters an imported cheat card.
Authoring previews should use synthetic data and carry a clear preview label.
Applying a cosmetic site draft does not establish earned acquisition history.
Content packs declare canon, OC, AU/crossover or sandbox placement under the existing owner.
Pack removal or missing support should preserve recoverable state, with a known reason.
No optional pack may remove genuine save/import or ordinary restore controls.

### IG9. Current card-to-panel contract

Shown: `src/cheat_cards.js` accepts exactly these top-level card fields:
`id`, `family`, `name`, `ui`, `terms`, `hooks`, `state`, `stages`, `observers`, `sources`.
Cards and nested values must be JSON data; unknown top-level keys are rejected.
The held entry contains `card`, `acquired: {route, at}` and `messages`.
`grantCheat` rejects an already-held ID and runs no hooks.
That current duplicate-ID constraint is not a universal “one copy ever” design rule.
Multiple instances or reacquisition would need an explicit contract/compatibility choice.

### IG10. Adapting design cards instead of passing them through

| Input | Adapter consideration | Output boundary |
| --- | --- | --- |
| `card.ui` | Resolve a supported panel template, or `quiet` | Known panel registration; no automatic grant. |
| Card ID and instance | Choose stable UI identity distinct from family/template | Saved layout survives a renamed visible title. |
| Persisted messages/known facts | Derive actual discovery route | `discovered()`; not JSON `discoveredBy` prose. |
| World support and source state | Compute present usability independently | `eligible()` plus a specific known reason. |
| Knowledge and appraisal grade | Build a filtered view model before rendering | Same redaction for visual and accessible output. |
| Panel settings metadata | Normalize names, choices and descriptions | Browser presentation settings only. |
| Card hooks and gameplay policy | Validate and resolve through mechanical host | Settled state first, then UI receipt. |

Stated: `CHEAT_PANEL_CARDS.json` contains reusable design cards, not runtime bindings.
Its `needsFoundation` flags do not prove that all ten panels are currently active.
The inspected C0 source proves a validator exists, not every phase or acquisition route.

### IG11. Two concrete adapter gaps

Shown: JSON setting keys are already namespaced and options are strings.
Shown: `registerPanelSettings` prefixes `panel.${id}.` and consumes value/label pairs.
Passing JSON rows unchanged would duplicate namespaces and misread option values.
Consider local setting keys, paired choices and useful descriptions in the adapter.
Also separate CH10 auto-use/confirmation policies from display-only preferences.
Shown: `definePanel` does not currently forward the registry's `critical` parameter.
Consider an explicit adapter extension or a protected existing host for required choices.
Do not assume a future death-menu wrapper already prevents Hide or Collapse.

### IG12. Instance, template and loss

Consider several held cheats sharing one ledger template with distinct source rows.
One lost instance need not erase another instance's usable screen.
Keep the known record separate from current possession and world-law access.
CH7 remains a local overlay; CH10 remains embedded; quiet cards need no blank shell.
New observer, masking or standing fields would require a selected schema extension.
Do not insert speculative top-level fields into the current strict card validator.

## Acceptance notes

These AC notes reuse `docs/PANEL_KIT.md`, Acceptance, including its K1-K7 names.
They propose evidence for a later selected slice. None has been run by this worker.
The coordinator owns frozen gates, changes to existing owners and implementation dispatch.

| Code | Reused gate | Candidate check and evidence |
| --- | --- | --- |
| AC1 | K1 Contract | Known cheat region has marker, allowed role, label and decorative icon; ordinary vitals/actions still work. Treat CH7 separately as overlay. |
| AC2 | K2 Reasons | Lose support, leave a domain or go dark; known entry remains with a specific reason. Assert cached values are labelled as old. |
| AC3 | K3 Keyboard | Hide from a focused panel, restore by keyboard, then F6/Shift+F6 skip hidden content and preserve visible focus. |
| AC4 | K4 Settings | Known-only settings have descriptions, valid paired choices and correct namespace; reset/export/import changes display only. |
| AC5 | K5 Frame | Exercise world frame, disguise, cracked state and player palette; L7 wins and unreached world fingerprints stay absent. |
| AC6 | K6 Fit | Rebuilt fresh-origin browser at all three target desktop sizes; reachable headers, no horizontal overflow, text contrast at least 4.5:1 and UI edges 3:1. |
| AC7 | K7 Docs | Document selected HU/IG choices, adapter fields and exclusions. A docs pass proves no runtime or browser behavior. |
| AC8 | Discovery | Inspect picker, search, settings, counts, tooltips and accessibility labels before discovery; live arrival once; masks suppress identifying cues. |
| AC9 | Restore | Save/reload/export/literal-file import preserve acquisition, messages, pending choices and discovery with no replayed arrival or reward. Verify layout transfer separately. |
| AC10 | Protected controls | Boss key, minimal mode, Clerk tricks and darkness leave save, recovery, actual costs and required choices reachable; no silent spending. |
| AC11 | Integration outcome | For each selected hook, demonstrate one useful change, a blocked/control case and duplicate-delivery resistance; cite exact owner and receipt. |
| AC12 | Sealed and capture views | Grade redaction and screenshot masking cover visible and accessible channels; fixtures/logs use secret IDs/status only, without publishing truths. |

For AC8, compare initial unknown, live discovery, hidden discovery and ordinary restoration.
For AC9, use a fresh synthetic origin and literal exported file, never Weibao's private save.
For AC10, include typing fields, a pending death choice and an active costed action.
For AC11, failed persistence leaves the prior state and publishes no bonus receipt.
For AC12, use a neutral synthetic secret to test leaks without naming a sealed world truth.
Reduced motion and Effects off must preserve readable outcomes and recovery.
Source checks, rebuilt desktop behavior, persistence compatibility and taste stay separate.
No research-only result closes a playable acceptance gate.

## Suggested next

1. HU8/HU9/HU16: compare ordinary Hide with a temporary cheat-view mask and a protected restore control.
2. IG10/IG11: settle one adapter contract, especially settings normalization and required-choice protection.
3. HU6/HU19: compare known-but-dark, dormant-unknown and user-hidden status views using synthetic facts.
4. IG3/IG7: choose one existing transaction and show its cheat contribution through the same quote and receipt.
5. AC1-AC12: use the existing panel-kit template for that selected slice; leave unselected integrations as options.

## Open questions for Weibao

- HU9: Would you prefer the quick hide control to mask only cheat surfaces, or let you choose a broader personal set?
- HU11: Is a curated share card the more useful first option, or a screenshot-safe view of the whole workspace?
- HU12: In mystery worlds, do you enjoy unnamed clues before a panel is known, or complete absence until discovery?
