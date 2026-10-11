# Sheltered nursery tray

Revision 2, 2026-10-07. Owner `/root/oni_slice`; root owns shared integration and browser proof. This is the ONI-P04 original adaptation selected by root. Four leaf modules are implemented and 14 bounded checks pass; shared scheduled ticking, publication and browser proof remain unverified. `LIFE_SIM_NORTH_STAR.md` remains a proposal. Costs, timing and botanical fiction below are proposals for creative-director review.

## Source boundary

ONI-F17 shows habitat and consumed nutrients gating plant growth. ONI-F18 distinguishes alternative nutrients in `PlantElementAbsorber` from jointly required active converter inputs. ONI-F19 creates physical harvested stock. The retained source hashes match E28–E32, with E06 read as a supplementary comparison. Exact files, inspected spans and implications are indexed in [SOURCE_SELECTION.json](SOURCE_SELECTION.json) and [SOURCE_HASHES.json](SOURCE_HASHES.json).

The tray does not port Mealwood, atmosphere/pressure/temperature simulation, source yield or growth rates, wild/tame policy, automatic harvest, seed mutation or biological claims. Its recipe treats a Cooking herbs bundle as containing one viable fresh shoot; this is authored fiction. Both that bundle and Tree sap are jointly required, not interchangeable alternatives. The five-minute propagation is an intentionally compressed game action.

## Player choice and result

At the existing earned Shack, choose to make a small sheltered nursery tray. Construction reserves two owned Rough wood logs, two coins and one stamina for four played minutes. Only successful completion creates the player-owned tray site. There is no initial crop, herb gift or autonomous refill.

Each separately chosen nursery cycle reserves one owned Cooking herbs bundle, one Tree sap and one stamina for five played minutes. The herb bundle supplies the fictional shoot; sap seals the tray. Successful completion creates two ordinary native Cooking herbs bundles in the player's existing inventory. A later cycle needs new inputs. Existing cooking recipes, including Goat stew, Pork roast and herbal dishes, consume that exact native item key.

There is no visit to another world, new NPC, population, upkeep, extra inventory, alternate timer or parallel publisher. The tray is separate from Nell's finite Village bed and cannot restart, reward or modify that old crop.

## Contract and ownership

- **D1 admission and completion:** current player world `base.frontier`, location `Shack`, unlocked Shack, supported living human native body with health above one, usable hands, current care frame with `underRoof === true`, no native battle and no active realm visit, chronicle session or simulation session. Read the actual current native inventory, vitals, equipment/custody and frame; saved permission alone is insufficient.
- **D2 construction:** one explicit optional opening establishes the plan and terms. A once-only build command reserves the declared inputs through the existing work scheduler. Site definition is `provision: false`, capacity one, owner player. No site can exist before that build completed once. A construction job cannot reserve a not-yet-created site; its one actor job provides the construction exclusion.
- **D3 cycle:** require the completed tray, current owner and capacity/reservation contract, retained plan knowledge and current habitat. The cycle uses the existing tray site and one player's work commitment. Inputs are negative native item costs; output is a positive native item effect only at completion. No render, fact projection or cancellation produces herbs.
- **D4 interruption:** cancellation and lost completion support refund the exact item, coin and stamina reservations once, return any site reservation, and produce neither a tray nor herbs. This wave deliberately uses the scheduler's refund policy instead of adding ONI-style growth stalls or death. The completed empty tray remains after a canceled later cycle.
- **D5 optional compatibility:** expansion schema 11 and the supported simulation schemas through 5 remain unchanged. Namespaced optional actor facts, knowledge, completions, current job descriptor, site and one player-only plan situation are validated. Entire absence is inert. Reject orphan tray/cycle records, fabricated completions, mismatched frozen costs/effects/participants/support, invalid chronology, other actor ownership and automated programs. No old receipt is repurposed or replayed.

The opening works without meeting Eda or previously enrolling living-world services. Reads do not enroll; the explicit opening stages ordinary enrollment, then the instant command and their acquisitions/unlocks once. The plan creates exactly one `steam.oni.nursery_plan` caused situation with one `idle` phase and no deadline. Its only private field records the explicit-paid-renewal policy, not plant truth. The unchanged shared validator requires a caused situation at simulation schema 3 and later; refundable jobs use schema 4. Root authorized this necessary narrow implementation detail. A cold opening therefore uses existing schema 3, its first refundable work uses existing schema 4, and an already-current schema 5 stays 5. No extra timer, NPC, ecology or top-level domain is created.

Reserved new areas: four `src/steam_oni_{content,runtime,facts,host}.js` leaves and this `oni/` directory. Root alone registers definitions/items, facts/validators, guard/stamp/completion hooks, Here controls and publisher routing. Implement the same public shape as the completed BOH leaves: `steamONIDefinitions`, `steamONIFacts`, `validateSteamONIState`, `steamONIContext`, `commitSteamONICommand`, `steamONIPresentation`, plus pure admission/stamping/completion-context helpers. Group/type `steam_oni`; prefix `steam.oni.`.

## In-world text proposal

Panel: **Your sheltered nursery**. Opening: “A shallow tray beside the Shack's window would keep fresh shoots out of the weather. Cut its frame from two logs and pay two coins for the lining. Four minutes and one stamina will put it together.” Cycle: “Choose a fresh shoot from one bundle of Cooking herbs and seal the tray with Tree sap. Five minutes of care and one stamina will give you two bundles to carry to the cookfire.” Pending: “The shoots need you here beneath the roof. Stop now to recover the supplies set aside for the work.” Completion: “You lift two bundles of Cooking herbs from the tray. The tray is empty again; another round will need a fresh shoot and sap.”

## Acceptance gates

**A1 leaf proof passed:** 14 bounded checks cover absence/cold UI inertness and real explicit enrollment; exact build/cycle costs; no site before build; reject missing either input; two successive cycles spend new means; cancel and lost-support refunds conserve native means; malformed optional records rejected; current schema 5 retained; Nell's finite bed untouched. Work checks use the real shared effect/refund reducer with explicit scheduler-shaped jobs. They do not execute shared scheduled ticking or native publication.

**A2 browser and persistence:** root builds a matching source snapshot and plays from a fresh test origin with a labeled generated fixture. Show construction, explicit cycle, native cooking consumer, rejected unsupported habitat, cancellation, save/reload and native import. Any uncovered path stays implemented-unverified in this wave's backlog. No private saves or installed ONI files are used.

**Resume:** root can acquire the four released leaves, join their exports and produce the matching rebuilt playable proof. All retained evidence and source inputs remain read-only. No child owns shared writes.
