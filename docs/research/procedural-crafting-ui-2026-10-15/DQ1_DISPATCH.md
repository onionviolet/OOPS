# DQ1 dispatched research brief

2026-10-15. User explicitly requested a new chat for DQ1. Research and decompilation only.

Chat ID: `01a13e81-35cd-7912-8087-1719319067d2`, local YAIR project. Output owner: `docs/research/taiwu-ingredient-use-2026-10-15/`. This chat retains ownership of the parent research folder.

## Authorized brief

Run DQ1: Taiwu ingredient selection → crafting → actual use, including its UI. Research and decompilation only. User explicitly authorized this new chat and asks to save deeper details and consider other examples. No implementation.

Read AGENTS.md, PROJECT.md and docs/USER_VISION.md; follow docs/research/SOURCE_DEEP_DIVE_PLAYBOOK.md and existing source acquisition rules before acquiring anything. Recover dirty state and concurrent ownership. Your sole write area is docs/research/taiwu-ingredient-use-2026-10-15/; create it if absent. Do not edit any other research owner's files or shared/runtime/design owners. Preserve all unrelated changes. No commits, pushes, installation, purchase, personal saves or game launch. Do not dispatch additional workers/chats or enable paid fallback.

Start from docs/research/procedural-crafting-ui-2026-10-15/{DEEPER_SYNTHESIS.md,TAIWU_CRAFTING_TRACE.md,UI_EVIDENCE.md,REFERENCE_INDEX.md} and private/round2/taiwu/. Read prior docs/research/scroll-of-taiwu traces before repeating extraction. Existing local DLLs: /Users/weiwei/Library/Application Support/Steam/steamapps/common/The Scroll Of Taiwu/Backend/GameData.dll and GameData.Shared.dll. Existing ILSpy: env DOTNET_ROOT=/Users/weiwei/.dotnet /Users/weiwei/.dotnet/tools/ilspycmd --disable-updatecheck -t TYPE ASSEMBLY. Pin hashes and version receipts, never execute game assemblies.

Choose one concrete ingredient, ideally with two supported uses. Trace exact selected item/lot ID, eligibility, frontend selection/detail/quote, required tool/skill/resources, stock debit or retention, progress and completion, generated output and an actual native code consumer of that output. Follow cancellation, failure, recovery and relevant state boundaries only where the chain requires them. Resolve Material.craftableItemTypes via the correct Config.MakeItemType join; do not join directly to MakeItemSubType. IDs 140/144 are candidate materials, not required choices. All 350 parsed Material rows had primary/secondary medicinal-effect fields Invalid, so schema presence alone is not active raw-herb chemistry. Existing fresh/reused BuildingDomain source locators and hashes are in TAIWU_CRAFTING_TRACE.md. Source inspection is not native gameplay proof.

Inspect UI evidence directly: official July 22 2026 manufacturing announcement and captioned screenshots are retained in parent's private/taiwu-ui-news.json, taiwu-image-receipts.json and UI_EVIDENCE.md. Separate depicted UI from interactions you actually exercised; separate announcement version from installed DLL build. Trace frontend methods if available. Save captioned observations for selection, candidate filtering, ingredient/tool detail, quantity, costs, effect preview, result, use and navigation. For missing screens, document precise gaps; read-only public official material or attributed footage can supplement them. No foreground game launch or personal save access.

Save a paraphrased report, exact code/table/URL locator index, ingredient-to-use flow, UI evidence table and finite remaining questions. Preserve full selected method bodies, complete relevant tables, IDs/conditions and extraction/reading receipts under your own gitignored private/ directory (verify ignore first); bulk raw data may stay ~/.codex/research/taiwu-ingredient-use-2026-10-15/. Never commit raw prose/source dumps. Respect sealed game secrets in public summaries.

Also consider, rank and save bounded follow-on comparisons without dispatching them: DQ2 Amazing Cultivation Simulator material→product→artifact→actual use with actor/tool/property contributions; DQ3 Tale of Immortal alchemy, first prove compatible executable availability because backup tables alone cannot establish execution; relevant book/online cases from parent BOOK_SYSTEMS_DEEPER.md and ONLINE_COMPARISONS.md for multi-use ingredients, combining skills/powers and discovering/improving recipes. Reuse prior research; distinguish verified rules, inference and original proposals. Do not copy competing gameplay specifications or treat research as accepted design.

Completion: one source-pinned ingredient chain reaches actual output use or ends at a precise evidence blocker; UI observations are captioned and qualified; deep raw details and complete selected data saved privately; links/JSON/receipts checked; report states exactly what remains unverified. No implementation.

## Other candidates retained, not dispatched

| Rank | Candidate | Why / next evidence |
|---|---|---|
| DQ2 | Amazing Cultivation Simulator | Strong existing source chain for combined actor, tool and item properties. Reuse production traces and close one actual-use consumer before more extraction. |
| DQ3 | Tale of Immortal | Alchemy formula and furnace tables are retained. First locate a compatible existing executable; do not infer runtime behavior from configuration alone. |
| DQ4 | Mother of Learning and adjacent book cases | Build a comparison of cheaper substitutions, process improvement, combined means and recorded discoveries from the already captured passages. No invented numerical laws. |
| DQ5 | Ryza 2, Minecraft and Noita | Compare adjacent ingredient/detail/output UI, authored recipe changes and genuine multi-use roles. Keep inspected screenshots, documented mechanics and proposals distinct. |

These are reference candidates, not implementation decisions or extra chat dispatches. The new chat is asked to refine their ranking against DQ1's findings.

## Dispatch evidence

create_thread returned the ID above. Latest explicit user authorization selected this new chat after the earlier dispatch limitation was explained. Live allowance check reported ordinary usage allowed with included allowance remaining; paid-fallback configuration was not proven and no billing setting was changed. No additional workers are authorized by this brief.


## Additional games, 2026-10-15

[Ranked procedural system scouting](OTHER_PROCEDURAL_GAMES.md) adds Qud, CDDA, Mages of Mystralia, Magicraft and Magicka, and retains Noita as a distinct existing reference. No additional dispatch.
