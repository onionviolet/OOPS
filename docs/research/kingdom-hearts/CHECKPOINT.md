# Kingdom Hearts lane checkpoint

Status: PARTIAL
Lane: mw-kingdom-hearts. Dispatch date: 2026-10-14.
Scope: read-only installed KH1/KH2 research, documented formats first. No game launch, save access, production edit, staging, commit or push.

## Done

| Code | Finished work | Evidence |
|---|---|---|
| D1 | Read dispatch/owners and reconciled scope | COMMON, ASPECTS, PROJECT first 80 lines, relevant USER_VISION, both kit owners, start/branch map, synthesis report. Nested-world owner resolved under `docs/gm/dispatch/`; prompt's direct `docs/` path absent. Current P01 priority/canon-first order unchanged. |
| D2 | Payload gate | Steam 2552430 StateFlags 4, build 15194255, download/stage totals matched. Original KH1/KH2 HED/PKG present. End-of-pass HED hashes saved privately; no full PKG integrity verification. |
| D3 | Built documented tools | Pinned OpenKH plus XeEngine submodule. Final sequential IdxImg, SpawnScript, MsgTool builds: zero errors, warnings retained. Bdxio built as dependency. Local SDK used; no new SDK/runtime/global CLI installation. |
| D4 | Indexed and extracted | 49,835 selected KH1/KH2 HED entries, 41,683 filename matches in bounded dictionary. 917 selected original payloads, 306,026,752 bytes. Three main KH2 extracted tables matched upstream EgsHdAsset bytes. |
| D5 | Deep format/data pass | 37 member rows; 13x99 levels; 45 form rows; 179 bonuses; four summons; 535 items/151 stats; 430 treasures; 20 battle-level rows. Native worldpoint is 54 populated records in 512 slots. |
| D6 | Narrative/implementation capture | 289 English KH2 ARDs; 749 room scripts, 951 events/171,811 event commands and 22 message lists/16,258 entries decoded. One fontinfo non-MSG rejection. Full private text/IDs/control tokens and commands retained. 339 selected BDX entries decoded successfully; LM musical/tutorial methods read. |
| D7 | KH1 comparison | 239 KH1 room resource lists indexed; 17 LM and 13 NM archives. Local cast resources shown; battle table preserved raw. No KH2 schema projected onto KH1. |
| D8 | Output package | REPORT, FINDINGS.json, packets, 30 small touches, tooling, source ledger, world census, three system digests, A01-A12 MD/JSON, inventory and three deeper reads. All proposals, no accepted gameplay or owner edits. |

## Unread table and next pending item

The first useful continuation is U1, or U2 when KH1-specific depth is wanted. It needs a fresh bounded native question, not a rerun of decoded inventories. All raw input is retained.

| Code | Exact gap | Why still open / next route |
|---|---|---|
| U1 | KH2 native caller/evaluator for world-map return requirements (wm 19499..19501, jm 10837/10839/10843) and complete `00progress` pointer-header bounds | Text states requirements, but text is not the validator. Read their message caller and relevant native/trap checks. Current LM flag34 exact script is read; generic pointer candidates are not a validated full program graph. |
| U2 | KH1 `btltbl.bin` semantic rows, `.ard` script sections, swimming controller, party/summon restrictions, ability/Keyblade grant sites and revisit progression | OpenKH route gives useful room resource lists but no equally complete KH1 gameplay schema here. Raw table/room bytes retained. Name the specific controller/award question before binary RE; do not apply KH2 rules by analogy. |
| U3 | KH2 Gummi route ID/unlock graph, warp exceptions, shooter/ship stats/formulas | Map/journal text and worldpoint/progress structures read; Gummi original tables/text retained. Follow actual worldmap/gumibattle consumers and source-qualified rows. |
| U4 | Native save container, autosave/recovery/migration/atomicity and complete field correctness | Only tool schema inspected. No personal save opened. Some upstream fields have uncertain comments. Use clean synthetic/public fixtures if later authorized; no need to touch a user save. |
| U5 | Most companion/enemy BDX methods and native trap implementations, main loop/frame and mission timer semantics | 339 scripts decoded, selected LM callbacks read. Decoding does not establish planning, social relationships, autonomous schedules or time policy. Pin named actor/action before deeper RE. |
| U6 | Dialogue condition/speaker/portrait graph, libretto grammar edge cases, full source-language variants | English lists/global talk references/room commands preserved. Native header 2 differs from docs' 3; terminator reader/prose disagree. Actor-specific predicate consumers mostly unread. Other locales not part of this pass. |
| U7 | Remaining named table families marked undocumented in SYSTEM_INVENTORY, including detailed damage/RNG/crafting/shops/collections and unknown 0a/stop/evtp/wldf/ipic | Raw selected tables retained, not semantically executed. Follow payoff to current YAIRPG owner rather than claim full-game absorption. |
| U8 | ReCOM, BBS and theater titles; native UI/gameplay behavior in every collection title | Installation presence only for other titles. Never launching games is a hard lane rule; native/human acceptance remains unavailable in this lane. |

## Close evidence

Observed checkout branch at close: `codex/gameplay-foundations`, HEAD `ba46670ae330cf28f56664cd0485d01eb2f1c072`. This is the main checkout path, not a claim that its branch is named main. Peer dirty state preserved; only this dossier is untracked for this lane. No shared ownership transfer or implementation reservation requested.

Disk used at close snapshot: 532 MB total work area, 375 MB extracts (`du -sh`), plus restored packages in the existing user NuGet cache. `extract/HASHES.txt` covers 4,350 extract files, excluding itself. Private index: [REFERENCE_INDEX](private/REFERENCE_INDEX.md). Tool/source/dead-end detail: [TOOLING](TOOLING.md).

Research validation: required outputs present; findings and fixed A01-A12 JSON parsed; all aspect statuses valid; local dossier Markdown file links resolved; private ignore rule confirmed; hashes verified. Checks concern research artifacts only. No YAIRPG implementation tests/build/browser or native game acceptance run.

Handoff: top proposals KH-P01 truthful earned/current usability, KH-P02 changed retained revisit, KH-P03 separate local appearance/body/permission. All extend existing synthesis packets; no global P26 assigned and no priority or mandatory gate added.
