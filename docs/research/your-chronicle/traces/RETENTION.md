Analytical source notes preserved by the coordinating GM. All recovered code, raw tables/prose/assets and logs stay in the private workspace pinned in [INTAKE](../INTAKE.json). These are selected source traces, not a whole-game or runtime review.

# Your Chronicle: native routine and reset review

Build25001959 has three different retention carriers: current routine level, proficiency/class talent retained through Dark Ritual, and completion/access records carried by the persistent Save across Reincarnation. They should not be merged into one permanent multiplier.

The selected Habit path clips allocations to available Habit and recomputes remaining capacity from total assignments. Warrior1 is RoutineKind101 and gives warriorPoint111 on completion; its interval parameter is50 progress units. Actual timing depends on Habit allocation and efficiency. Native online progress divides power by30 per call; installed Help documents the30-completions/sec cap. No live timing was measured.

Class training has a concrete later consumer. At Dark Ritual each class routine adds at most10,000 trained levels to its own proficiency sum, capped100,000; future power multiplies by1+sum/100,000. Separately, class talent uses currentPoints/(currentPoints+100,000)+0.1*retainedClassSum. The shallow callback adds the saturating point term to that class sum and zeroes points. Native floating-point operations and constants support these formulas, despite Cpp2IL ISIL marking several operations NotImplemented.

Dark Ritual checks its native one-hour timer and hardmode restriction before any mutation, replaces current talent with the computed next talent, banks current Exp, clears current routine/allocation progress via selected callbacks and recalculates effects. It keeps the same Save and SaveR rather than replacing campaign state. Installed Help supplies the broad rank/basic-routine reset description; complete callback effects remain partial.

Reincarnation runs a larger callback path, awards computed Sin, banks Exp, resets selected resources and fields, sets initialization/offline-skip flags and uses SaveManager to preserve Save while replacing SaveR and reloading the scene. Class proficiency and class sums reside in SaveR and are therefore lost at that boundary. Persistent class-school completion counts can reopen class access through the inheritance option on initialization; that option's inspected consumer does not copy proficiency. Routine PermanentLevel resides in Save, and the root separately confirmed that this record affects AHA list eligibility.

The installed Help's resource exception list is simplified. The reviewed table has ten carryover IDs: Inspiration, Sin, Gluttony Sin, three EPoints, Envy upgrade points and three marks. The Mark of the Goddess also declares retained negative regeneration for Destiny, Blessing and Fate. Carryover can therefore retain a constraint as well as progress. Exact resource-effect parser/registration topology and live rate behavior were not fully audited.

Use `FINDINGS.json` for prerequisites, choices, costs/time, mutations, consumers and failure/aftermath for each selected chain. `EVIDENCE.json` provides exact raw spans, hashes and annotated RVAs. No recovered CIL claim, whole-game parity, current YAIRPG gap assertion or extra prestige proposal is made. No runtime/save/account tests or repository writes occurred.
