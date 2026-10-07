# Caves of Qud decompilation and source research

Completed 2026-10-05 for Weibao's instruction: "I downloaded caves of qud, feel free to decompile accordingly."

The supplied Mac package's main gameplay assembly **2.0.211.56** was successfully exported into **5,437 C# files** with ILSpy 9.1.0.7988. The export is available for further source reading in a private workspace outside this Git repository. Five selected mechanic paths were reviewed; this is not a claim that all recovered code was read or behaviorally verified.

## Source and reproducibility

- [Intake, version, hashes and command](INTAKE.json) records the original DMG, main DLL, exact tool/runtime, source-copy and export paths. The DMG was mounted read-only and its installer package expanded without executing installer scripts or launching the game. The packaged assembly's version agrees with the download filename; its app bundle has a separate generic short version of 2.0.4.
- [Private workspace manifest](/Users/weiwei/.codex/research/caves-of-qud/2.0.211.56/INPUT_MANIFEST.json) fingerprints 615 copied files, including 181 managed DLLs and base definitions. References remain binaries; only the main gameplay assembly was decompiled. The included Pets Pack installer was not extracted or activated.
- [Private export manifest](/Users/weiwei/.codex/research/caves-of-qud/2.0.211.56/DECOMPILATION_MANIFEST.json) fingerprints the generated files. The decompiler exited successfully, produced no stderr and no recognized decompiler error comments. The recovered project was not compiled or executed; original comments and design intent are not recovered by this process.
- [Type index](/Users/weiwei/.codex/research/caves-of-qud/2.0.211.56/types.txt) supports targeted future reading. Raw proprietary code, definitions and assets stay outside Git; this directory contains evidence and paraphrased research only. Personal saves and achievement profiles were not opened.

## Five inspected mechanic paths

| Path | Code-observed result | Useful YAIR qualification |
|---|---|---|
| Blueprint composition | Inheritance, ordered mixins and named-node overrides are baked before the factory instantiates and registers actual parts. Unknown part types can fail construction. | Current registries, material/tool functions and power consumers already implement much of this distinction. Use the pattern to deepen one real object; another general component engine is not required by this finding. |
| Cold, effects and action eligibility | An eligible cast pays action energy/cooldown and creates a timed field. Field effects change temperature; thresholds apply/remove states; supported mental actions can have explicit exceptions to frozen-body restrictions. | A selected material/temperature interaction could supply practical uses and different action possibilities. Whole spatial thermal simulation would need substantial new consumers. Qud's default field is independent after casting; optional declared dependency has narrower existence/placement semantics. |
| Achievements and combination goals | The assembly contains 150 static achievement declarations. Thresholds and distinct-child progress share definitions; an equipment event checks a simultaneous set of distinct states. Unlocks have local persistence and platform presentation hooks. | This extends the earlier DCSS/DDA feat proposal with concrete unique-set and combination-state patterns. Keep one achievement/feat owner over actual committed results. Character/run/account retention remains an explicit future decision. |
| NPC action selection | Brain dispatches an actual goal. Kill validates the target/context, asks for currently eligible abilities/items/weapons, tries candidate kinds and falls back. Default candidate order is shuffled; authored custom orders also exist. | Join current NPC command previews and power/equipment consumers in one readable decision profile. This does not establish a universal best-action planner or require a new power framework. |
| Attributed social services | A ritual lesson has configured offer/prerequisite checks and a current reputation affordability recheck. Skill addition receives the speaker/context. First ritual memory/award is distinct from the lesson. | Existing consent, taught methods, reputation, directed memories and person knowledge can support a new original local service. Qud's provenance argument alone does not prove every downstream persistence/display behavior. |

[Root findings](FINDINGS.json) and [bounded NPC/social findings](NPC_FINDINGS.json) contain exact recovered files, symbols, spans, SHA-256 evidence, observed limits, original proposals and later playable gates. The NPC reader completed and released its one JSON output; root owns this report and intake.

## Follow-through

The strongest next design use is the already identified feat catalogue: recognize committed outcomes once, count different earned methods by distinct IDs, and allow a few exceptional combination goals. Qud's separate asynchronous achievement profile is a reference pattern, not a selected replacement for YAIR's durable native save publisher or proof of failure atomicity.

Other original candidates are a cooling method with practical material consequences, a contextual NPC battle profile and an attributed reputation-priced service. These are proposals against existing owners, not gameplay delivered by this research. The present one-prestige scope, live Features ownership and test deferral remain with their current project owners. Any implementation must refresh the recorded moving YAIR inputs and declare saved-state compatibility and later playable acceptance.

## Coverage and limits

The complete main-assembly export is available, while semantic coverage is limited to the five paths above. The top-level ObjectBlueprints.xml is an empty scaffold; object definitions are split across 14 XML files below Base/ObjectBlueprints. Python's standard XML1.0 parser rejected numeric control-character references in Items.xml, Furniture.xml and Creatures.xml. Original files were not edited. Qud's loader uses its XmlTextReader-derived XmlDataHelper; this research did not execute that loader, validate every blueprint, install the game or check platform services.

No gameplay/build/browser/save/regression suite ran. Source hashes and reference bounds establish the reviewed recovered artifact, not balance, performance, exploit resistance or a playthrough. [Validation](VALIDATION.json) records the final scoped checks.
