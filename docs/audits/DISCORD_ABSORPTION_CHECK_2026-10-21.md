# Discord absorption check, 2026-10-21

## November 26 inventory playtest

The earned 113% uncommon Rat pelt cape exposed a difference between seeing the star and keeping the favorite. Choosing **Favorite** from the item’s detail panel lit the star but saved an undefined item key. Clicking the small star during trade could also stage the cape for sale. The corrected inventory control uses the clicked row’s exact item identity, including quality; the trade control ignores either part of the star button.

On primary bundle `b9d9d757` and HTML `b7ec4b52`, two 1920 × 1080 playthroughs marked the earned cape while carried and while equipped. Both kept the favorite after Save, reload, Export and Import. With glow off, the item detail still offered **Unfavorite**. Four focused checks cover the icon and its surrounding control, same-name items with different quality, existing favorites and the trade interaction. Higher earned rarity tiers still need an ordinary acquisition playthrough. [Interaction checks](../../tests/inventory_favorite_click.test.js) · [Earlier earned rarity comparison](../research/GLOW_EARNED_CURRENT_A686_2026-11-25.md)

## November 25 recheck: rarity glow and the wider backlog

The 53 named palette entries received bounded native treatments. They cover a selected design list. The YAIR media review's opening sample of about 48/333 stills is superseded by its later full-still section: 662 distinct stills, including 326 interface images and six mockups inspected individually, plus selected code-image checks. Its 12 distinct MP4s were reviewed through sampled frames. That owner records colored tier text and bracketed rarity names, without observed rarity halo or pulse; it does not certify continuous motion or audio. The Proto23 reference separately describes a faint equipped-item cue. These are inherited review results, not fresh image inspections on this Windows host. [YAIR full-still review](../research/yair-upstream/DISCORD_UI_ELEMENTS_REVIEW_2026-11-15.md#still-images-full-pass-2026-11-15) · [Proto23 V14](../research/proto23/VIVID_AND_UI_FLOW_CONSIDERATIONS_2026-10-13.md)

The game has seven named rarity colors and the independent **Item glow** setting, enabled by default. Its inventory treatment gives uncommon and better rows a tier-colored edge and strengthens the edge at epic and above. Equipment and favorites carry their own marks. The Luminous Gothic Appearance preset is a separate opt-in treatment. [Palette](../../src/rarity_palette.js) · [Inventory settings and decoration](../../src/ui/feel_finish.js) · [Inventory glow styles](../../styles/feel_finish.css)

The wider absorption includes combat practice feedback, clear rewards, shop-stock causes, map cues and recipe substitutes. PS165's older handover describes a tooltip gap that the current crafting row has since closed for multiple held substitutes. Different evidence applies to each feature: the bread reward was rolled and saved in the historical browser proof, while the rarer nested ring was unit-tested. Records of specific uncollected attachments or sampled images are research gaps, not a count of missing game features. [Feature ledger](DISCORD_FEATURES_LEDGER_2026-11-15.md) · [Craft input row](../../src/crafting_detail.js)

Answer: substantial design and implementation absorption, but not everything in
the pulled corpus is implemented or deeply reviewed. The 53-entry palette is a
bounded implementation checklist, not a completion count for all Discord ideas.

Requested by Weibao: “Did we absorb everything from our discord audits? from the
style and stuff and more? double check latest with what we pulled”. This is an
assessment of the latest saved pulls, current source and execution receipts.
No new Discord collection, gameplay implementation or acceptance decision.
AD6–8, AD32, AD34–36, AD38 and AD40 apply. UI evidence targets desktop
1920×1080, including 14/21px; mobile and NPC-heavy simulation remain deferred.

## November 25 local evidence availability

A later read-only check located the original media archive on the Mac project host. Its classification file contains 662 entries: 326 game-interface stills, six mockups, 199 development/code images, 73 chat/social images and 58 art/memes. Two inventory stills were copied to this checkout's ignored evidence directory, checked against the catalogue SHA-256 and inspected at their original dimensions. The wider private archive remains on the Mac.

| Still | Current direct observation |
|---|---|
| 261 · 293×275 · SHA-256 `6cee0d4f66b60a9b572ce3888fbb4bca9224b4842c2aef53b3297965f757ca78` | The purse and inventory share a pane. Equipped rows have a yellow star and a take-off control. Bracketed quality percentages vary in color, even between two yellow equipped rows. The book has a Read action. This still shows no visible halo around those rows. |
| 336 · 273×27 · SHA-256 `8dd5e6ac9271d14795a2575b343de64cb42dd4d4570d3dc52b34d0574f961d13` | The dark row reads “[weapon] Iron spear [114%] x1000.” The weapon label and quality percentage are colored separately. Its crop cannot establish how the interface communicates a fresh acquisition or whether it animates. |

These observations distinguish item type, quality, equipment state and available action. The seven OOPS rarity tiers and optional new-item pulse have their own native proof. The path inventory below records the initial Windows-only check before the original archive was located.

The bounded follow-up checked the current Windows checkout and configured owner mount before selecting new media. `C:/` and `D:/` are present; `YAIR_TOOLS_CODE` is unset, so the tool registry resolves its Discord owner to `C:/Users/wayba/code/discord-reference-workbench`. That repository, the alternative sibling `C:/Users/wayba/dev/discord-reference-workbench`, and the original Mac owner path are absent. This is an expected-path check, not a claim that every file on either drive was searched.

| Checked local evidence | Observed state |
|---|---|
| `docs/research/yair-upstream/private/discord-2026-10-20/catalog-reviewed/catalog.json` and `objects/` | Absent. No source object hashes or distinct new image IDs could be verified from the local corpus. |
| `docs/research/yair-upstream/private/discord-2026-10-20/ui-motion-2026-11-15/stills-full/` | Absent. The per-image classification and private contact sheets cited by the full-still owner cannot be inspected here. |
| `C:/Users/wayba/.codex/research/yair-upstream`, `C:/Users/wayba/.codex/research/discord`, and `docs/research/proto23/private` | Absent; these checked fallback locations supply no distinct local review sample. |
| `python scripts/toolsets.py show discord`; `python scripts/toolsets.py doctor discord --probe` | Show reports missing owner README/collector documents and runtime. Doctor exits 1 with state `missing`, without launching the absent tool. The registry preserves original owner paths and historical document fingerprints; those are provenance, not current installation or media availability. |

The tracked [UI-elements owner](../research/yair-upstream/DISCORD_UI_ELEMENTS_REVIEW_2026-11-15.md#coverage-counts) supersedes the initial 333-object denominator with 662 (524 WebP and 138 PNG). It reports 332 interface/mockup stills, 199 developer-tool/code images, 73 chat/social images and 58 art/meme images; the latter categories are not 330 unreviewed gameplay stills. It also records zero hash-set difference between the other capture folders and the catalogued objects at that historical check. Its selected code-image observations remain individually scoped, including the hit-animation option/draft discussion; none of these counts is new coverage from this run.

Result: **zero new visual inspections, no new backlog item and no download**. The useful change is correcting the stale sample-only coverage claim. Unresolved audio, continuous motion and interpretation gaps remain with the existing owner. A later bounded visual pass needs the actual private catalogue/objects and review classification mounted first, so it can select a genuinely distinct question and identify its source objects. No runtime, other lane, source corpus or sealed material was changed.

Verification: the named-path checks, current `show`/scoped `doctor` results and bounded owner reads above were performed on this host. `npm run check:docs` passed with no new hits; `git diff --check -- docs/audits/DISCORD_ABSORPTION_CHECK_2026-10-21.md` passed. No build, tests or browser run was needed for this documentation-only availability check. No task scratch or process was created.

## Findings

| Code | Finding | Evidence and boundary |
|---|---|---|
| F1 | **Style has an actual implementation.** Luminous Gothic Appearance draft, selected MS Gothic compact font role, readable prose fallback, square frames, navy/teal fields, purple Reports, restrained glow, focus/disabled states and effects/high-contrast controls exist. | [Style receipt](../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md#tsg-implementation-receipt-2026-10-20), `createLuminousGothicDraft` in `src/customization_profiles.js`, its native button in `src/customization_ui.js`, and `styles/ui_tokens.css`. It is an explicitly applied preset, not proof every player's active profile uses it. Actual font loading was proven in the recorded candidate. The local font is private/optional; a checkout without it uses fallback. Human taste acceptance remains open. |
| F2 | **The principal connected UI/mechanism treatments landed.** All 53 named palette entries have bounded native treatments; IS1–IS5 cover known recipe chains/return, exact stock and material choices, named gear comparisons, actual session XP feedback and combat occurrence identity. Finite processing intent, interrupted session craft goals, paid finite hearth auto-feed, and learned cat play/history also exist. | [Palette report](../gm/dispatch/palette-completion-2026-10-20/REPORT.md), [coverage](../gm/dispatch/palette-completion-2026-10-20/COVERAGE.md), [interaction report](../gm/dispatch/upstream-interaction-system-2026-10-20/REPORT.md), [latest reference follow-up](../gm/dispatch/reference-gap-followup-2026-10-20/REPORT.md). Current imports/call sites were checked in display, customization, recipe and household owners. Craft goal is session-only; processing intent is durable. None of these counts imply every world/example is complete. |
| F3 | **The remaining ideas are broader than styling.** Spatial height/grip/wet-rock/fall/catch presentation, a rain-benefiting creature, wolf-stick distraction, first-food permanent reward, wider home restoration/cat-room, time-driven hair, and dynamic local news remain absent or future proposals in the latest reconciled content matrix. Separate exact-target durable repair hardening was stopped before implementation. | [F5/F6 current distinctions](../gm/dispatch/reference-gap-followup-2026-10-20/REPORT.md), [90 reference rows](../research/proto23/FEATURE_AUDIT_SIDE_BY_SIDE_2026-10-20.md), [P4 status](../gm/dispatch/deep-engine-2026-10-20/P4_STATUS.md). Existing climbing, food, ordinary repair, local-life routes and cat systems are present; these are specific extensions, not claims that the base systems are missing. Foreign world laws are not automatically selected as universal OOPS rules. |
| F4 | **The pulled material is retained and routed, but research is not exhaustive.** The plan-fold ledger contains all PFA001–PFA090 plus the broader named connection families. Source gaps and selected-review limits remain. | Current [evidence receipt](discord_absorption_2026-10-21/evidence.json) verifies the saved ledger and owner paths. [Corc collection](../research/proto23/CORC_MEDIA_AND_DESIGN_2026-10-20.md) still lists 26 missing attachment IDs. [YAIR owner](../research/yair-upstream/DISCORD_RESEARCH_2026-10-20.md) closes 166/166 requested IDs and completes the F25–F34/P10–P17 deeper round, but retains five extra uncollected context attachments, overview-only images and no continuous/audio review. Neither corpus is a full channel archive. |
| F5 | **A fresh combined playable acceptance remains open.** Frozen candidate checks are substantial, but the shared source/build has advanced. | Live hash comparison: 727/736 runtime/style files match the palette release; 731/736 match the newer reference-follow-up candidate. Five newer differences are `src/main.js`, `src/new_game_beginning.js`, `src/game_bar.js`, `styles/workspace.css`, `styles/oops_branding.css`. The shared bundle differs from both release bundles. This demonstrates drift, not a defect. The latest launch work has its own [receipt](../reviews/launch_menu_2026-10-21/REPORT.md); its checks do not replace combined gameplay proof. |

## What “absorbed” currently means

**Captured:** Corc's 308 attachment posts/17 context windows and YAIR's 623
developer attachment posts/27 windows are saved bounded corpora. YAIR's completed
deeper round supersedes the initial 166-missing checkpoint. Corc's later design
review supersedes the collection report's initial shallow-review snapshot.

**Folded into design owners:** the private plan-fold ledger maps 194 codes,
including all 90 PFA rows, to existing owners. Routing an idea is preservation,
not proof of implementation. The matrix's dated Candidate/Partial statuses also
predate later releases: loot policy, recent learning, gear comparison, finite
work intent, hearth supply and cat detail should now be read through F2's newer
receipts. Do not simply count the older matrix labels as current missing work.

**Implemented and technically checked:** the palette release records 2390/2390
tests, required build/architecture/rules checks and rebuilt desktop/persistence
journeys. The newer cat/reference follow-up records 2394/2394 tests and six
rebuilt browser checks. These are inherited receipts for their frozen inputs,
not tests rerun by this audit and not proof of the current combined build.
Many routes use declared seeded stock, home, skills or access fixtures.

## Useful remaining order, proposals

1. **A1:** Check the current combined desktop candidate through Appearance →
   known recipe producer/return → material policy → craft interruption/resume →
   compare gear → actual learning → household. Verify changed persistent state
   with Save/reload/Export/Import. This establishes what the user can play now;
   whole natural acquisition and human taste remain separate.
2. **A2:** Keep the unimplemented content families in F3 visible in their
   existing owners. Select a connected world-native slice when building them;
   a replacement framework or universal source-parity gate is not justified.
3. **A3:** Spend further research on named unanswered questions, rather than
   redownloading the recovered YAIR set: crafting-layout alternatives,
   empty-tab behavior, Firefox scrollbar/zoom, or specific unresolved Corc
   media whose interpretation would change a selected implementation.

This audit selects no new implementation or collection work.

## Checks performed here

Read the current rules router, PROJECT/USER_VISION direction, research owners,
plan-fold ledger, implementation reports and relevant source/call sites.
Compared all 736 recorded runtime/style input hashes against live files for
each of the two most relevant frozen candidates, and recorded the current shared
bundle hash. All 90 PFA codes have ledger entries and referenced owner paths exist.

Focused existing source tests: **25 passed, 0 failed**, covering style, meter
DOM, craft goals, palette feedback, native interactions, firewood and cat play.
Exact command and results: [evidence](discord_absorption_2026-10-21/evidence.json),
[test log](discord_absorption_2026-10-21/focused-tests.txt).
No build/full suite/browser was run for this documentation-only audit, so current
combined gameplay and visual behavior are not newly certified. No personal saves,
shared generated files, source code, commits, pushes or external messages changed.

## Later instruction: recovery and standing reference guide

Weibao subsequently authorized a new chat to recover the exact 26 Corc IDs and
the design-guide fold into the UI reference rules. [Rule-fold receipt](discord_absorption_2026-10-21/RULE_FOLD.md)
records UR59–UR64, the complete CRL routing, authority/index updates, checks and
observed recovery-chat start. The earlier audit's no-new-work status describes
its original assessment; it does not override this later instruction. Recovery
completion remains owned by the separate packet.


## Recovery and coverage reconciliation B104, 2026-11-04

Preserve F1–F5, 53 finite palette entries, 90 PFA rows and 194 routing codes as their separate denominators. Routed/captured content is not complete semantic research or current implementation; seeded native receipts are not natural acquisition or present combined-build proof. The old 26-ID Corc gap is superseded by the current media owner’s dated recovery: all 26 exact target attachments recovered, with deeper CRL27–CRL34 file review, while unrelated context/media/audio/current source-game behavior retain limits. It was not 26 gameplay screenshots. No recollection of an old hash comparison demonstrates current drift/defect. Keep the named content extensions and alternatives in their owners without an all-Discord parity gate or another download/dispatch. Current rules and AD42 qualify optional human taste review; actual new gameplay/UI still needs its own rebuilt proof.

**November 25 rebuilt inventory check.** At 1920 by 1080, the Effects & sound panel's Item glow toggle switched the seven native item tiers between the expected on/off row styles. The run used real inventory rows supplied through a disposable test save and did not earn the items as loot. The tier names and quality colors remained readable with glow off. The new-item pulse is a separate effect. [Proof and bundle identity](discord_absorption_2026-10-21/glow-2026-11-25/proof.json) · [On](discord_absorption_2026-10-21/glow-2026-11-25/item-glow-on-1920.jpg) · [Off](discord_absorption_2026-10-21/glow-2026-11-25/item-glow-off-1920.jpg)

**November 25 earned-item follow-up.** A fresh normal Village life earned the elder’s 50%-quality common dagger through dialogue, with no supplied inventory. Its quality stayed white/common with a plain settled row; arrival added a `new` tag and one native 0.9-second pulse, confirmed by animation events and changing frame samples. Hover cleared the tag; Equip showed the separate ◆ worn mark. Item glow off retained `new` while removing the pulse, reduced settings collapsed its motion, and New-item dot off removed both. Five rebuilt 1920×1080 routes and a native running-frame capture passed with zero page errors. No higher-tier natural loot or new media coverage is implied, and no runtime feedback defect was reproduced. The earlier seven-tier artifact hashes are preserved. [Receipt, settings matrix and evidence](discord_absorption_2026-10-21/earned-item-2026-11-25/README.md).

**Earned uncommon comparison.** In an ordinary Village life, selling starter goods and earning 230 W from nine fieldwork rounds brought the player's balance to 525 W. The player paid 500 W for a 113%-quality uncommon Rat pelt cape. Hovering cleared its new-item pulse. The steady green rarity edge remained, and equipping through **Full item → Equip** added the worn marker. Switching off Item glow removed its decoration while the item stayed equipped and its quality color remained. Reduced effects kept the static edge and worn marker. This extends the natural acquisition evidence to common and uncommon items. Higher tiers still rely on the seven-tier fixture. [Earned cape and settings checks](../gm/dispatch/play-surface-2026-11-14/GLOW_EARNED_RARITY_2026-11-25.md).

## Non-glow interaction coverage, November 25

This bounded follow-up compares the [53-entry owner](../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md#palette-by-palette-implementation-checklist-2026-10-20) with three useful interaction patterns in the existing [YAIR media catalogue](../research/yair-upstream/DISCORD_UI_ELEMENTS_REVIEW_2026-11-15.md). Attachment IDs, still IDs and time ranges below come from that recorded review; this follow-up did not acquire or newly inspect media. These are distinct native consumers, not a claim of complete Discord parity.

| Finding and exact reference | Present OOPS route and owner | Verification and remaining gap |
| --- | --- | --- |
| **NG1 · Inspect before acting.** DU27 still `32446c154e` exposes item quality, components, stats and value; DU42 stills `d88b1f16b3`, `5e1bb68322`, `7a769a5629` expose composite parts. | Inventory **Full item → Equip**; [`item_card_reader.js`](../../src/item_card_reader.js), [`item_card_model.js`](../../src/item_card_model.js) and [`equipment_comparison.js`](../../src/equipment_comparison.js). Inspection and comparison precede the native equipment command. | The current ordinary cape run exercised the full-item card and visible Equip at 1920×1080 on bundle `9a960b66…`; [frozen receipt](../gm/dispatch/play-surface-2026-11-14/GLOW_EARNED_RARITY_2026-11-25.md). Named baseline, selected parts and quality-range comparison have earlier rebuilt seeded IS3 evidence in the [interaction report](../gm/dispatch/upstream-interaction-system-2026-10-20/REPORT.md). That older comparison evidence is not a fresh current-build comparison test, and unsupported structured equipment remains explicitly qualified. |
| **NG2 · Craft with visible means and a chosen stopping point.** DU3/DU5 attachment `1512870099802001508`, 3.0–6.25 s and 3.75–5.75 s, distinguishes live have/need from success chance and a material boundary; DU43 stills `630e5bd8bd`, `9f7497c0b7`, `7eb1f7064d` show result ranges. | **Try to craft something → recipe detail → selected materials/batch**; [`crafting_detail.js`](../../src/crafting_detail.js) and [`recipe_connections.js`](../../src/recipe_connections.js). The 53-entry owner's BD5/BD10 and UF4 connect owned/blocked inputs, non-reserving batch intent, attempts and useful outputs to native commands. OOPS states its actual material-selection policy rather than inferring that every YAIR boundary is identical. | [Palette completion](../gm/dispatch/palette-completion-2026-10-20/REPORT.md) records rebuilt finite-goal continuation, native craft and persistence; [IS1/IS2](../gm/dispatch/upstream-interaction-system-2026-10-20/REPORT.md) records exact-variant inspection and native craft/assembly. These are dated, partly seeded receipts. The complete ordinary acquisition/learning chain and every current mixed-material recipe are not newly verified here. |
| **NG3 · Stage a trade, then commit its actual price.** DU38 stills `28bb728329`, `9c871c61f1`, `c4bd40bc87`, `c3b6c9ef21`, `e33b940c07`, `a52ee22d73` show two holders, pending rows, a signed total and separate acceptance/exit. | Village **Visit a merchant → select sale/purchase quantities → confirm**; [`trade.js`](../../src/trade.js) and [`native_trade_transaction.js`](../../src/native_trade_transaction.js). UF6's two-stock treatment keeps native custody and exact item identity. The catalogue's historical “trade has no surface” note describes its review checkpoint, not today's OOPS route. | The same [ordinary cape receipt](../gm/dispatch/play-surface-2026-11-14/GLOW_EARNED_RARITY_2026-11-25.md) records real starter-goods settlement of 193 W, nine fieldwork rounds paying 230 W, then the 500 W purchase reducing 525 W to 25 W. No supplied item or money fixture was used. Initial earnings used `e797966b…`; final purchase used `9a960b66…`. This verifies a current native sale/purchase and retained life, not every vendor, cancellation path or storage ordering. |

No new browser run was needed: the existing current ordinary trade/inspection evidence resolves those two routes, while the crafting row retains its dated proof boundary. No runtime, media holdings, frozen receipt or personal save changed in this follow-up.
