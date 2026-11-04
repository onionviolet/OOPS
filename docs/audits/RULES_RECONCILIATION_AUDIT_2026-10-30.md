# Rules reconciliation audit, 2026-10-30

**Status: proposal (AD32), except the drift fixes in F1, which restate live owners and change no rule.** Weibao asked: "Other general rules and more that we can merge and reconcile?" The same principle applied to docs earlier today (one home per fact, merge before creating, everything else links; see the [owner docs audit](OWNER_DOCS_AUDIT_2026-10-30.md) and the [systems front door](../systems/README.md)). This audit applies it to the 28 rule sets in the [RULES_INDEX register](../RULES_INDEX.md#register-of-rule-sets).

Method: a scripted pass compared every "XX1-XXn" range in AGENTS.md, `.claude/rules/`, RULES_INDEX, GROUND_RULES, the rulebooks and the systems guides with the highest code defined in each owner file; then a read of the rule text of every family named in the brief (UR, UIV, SUI, RPT, MW, DSG; Rulebook, AD, FLR, PRF, FND, CX; SLR, MR, ABR, GTR, GR; WA, WPR, WER; ECR, AR). DESIGN.md was read from branch tip `aa8a1062e` on `claude/ui-identity-449fe5` (the branch is not merged and was not touched). Evidence label for every claim below: **shown** means I read the cited line; **estimate** means arithmetic on word counts (`wc -w`), stated with its inputs.

Defaults in this audit follow the project's own framing: each merge proposal is a default with a dial (what would change it) and a reason, and accepted (AD32) rule text changes just on Weibao's yes. A code stays citable as an alias after any merge, so old citations in 1,000+ docs keep resolving.

## Findings

| Code | Finding | Evidence |
|---|---|---|
| F1 | **Twelve range or link claims had drifted from their owners; all are fixed** (table below). None changes a rule's meaning. | shown |
| F2 | **Most ranges are fine.** Of about 45 "XX1-XXn" hits where n is not the owner's highest code, 33 are intentional: dated acceptance lines ("checked against AD1-AD38" in DOMAIN_RULES and WORLD_ABSORPTION_RULES), T7's LOTM "AR1-AR11", the SUI "extends SUI1-SUI12 / SUI16" table headers, router subsets such as "UR1-64" or "WA1-WA21" in rows about a bounded slice, and standing-versus-proposed splits ("UR1-UR75; UR76-UR82 proposed"). Those stay. | shown |
| F3 | **`UIV5` is not defined anywhere** (UI_RULES has UIV1-UIV4, UIV6, UIV7). The register row and player-ui.md already say "UIV1-UIV4, UIV6, UIV7"; one router row said "UIV1-UIV7" (fixed). The gap itself is a number nobody used; keep it, do not backfill. | shown |
| F4 | **`check:rules` guards the register but not the places that restate it.** `scripts/check_rules_index.mjs` compares register ranges with owner files. AGENTS.md, `.claude/rules/`, GROUND_RULES, `docs/systems/` and the other rulebooks' related-rulebook tables are not scanned, which is why "UR1-UR69" and "GTR1-GTR30" survived. | shown (script header lines 1-3, 56-73) |
| F5 | **The LSD owner header was 29 codes behind its own table.** The design doc says "LSD1-LSD441" and the register copied it, while the table runs to LSD470 (35 rows from LSD442). Fixed in both places. A guard like F4's would have caught it. | shown |
| F6 | **Real conflict: Codex model routing.** AU5 says bounded reading runs on "GPT-6 Luna, medium"; the portable working agreement (loaded from `~/.claude/user-preferences.md`) says Codex subagents use `gpt-6-luna` at low effort. Claude routing (haiku for bounded work, sonnet for synthesis and code) agrees across AU5, WPR6, GROUND_RULES Process and the agreement. Not fixed: AU5 is accepted text and the agreement is Weibao's personal file. See Q1. | shown |
| F7 | **Mild conflict: who may move a feature to the main surface.** UR2 says just Weibao promotes a feature; DESIGN.md's lead-in to DSG6-DSG10 says a feature "is ready for the main surface when it has all six". Read as readiness, not promotion, they agree; the wording should say so. UR78 already draws the line for content inside an accepted surface. | shown |
| F8 | **The pages that restate the most are the ones every lane reads.** The core digest (250 words), GROUND_RULES Authority and Process (235), AGENTS "Design framing" (362) and "Shared principles" (203) say about 14 of the same principles in four homes. They agree today. Each edit to one needs three more edits. | shown + estimate |
| F9 | **Reading load is mostly routing, not duplication.** A UI lane reads about 20.7k words and a world pass about 29.8k; the merges below remove about 1-2k of those. Tiering what is required against what is read on a trigger removes 8-16k. | estimate, see Reading load |
| F10 | **Two path rules double-load.** An edit under `docs/audits/**` or `docs/research/**` loads both `world-passes.md` and `research-and-agents.md`. An edit under `docs/worlds/**` loads `world-passes.md` and `sites-exploration.md`. Cost is small (about 680 words) but it is the same instruction twice. | shown (frontmatter `paths:`) |

## Drift fixes applied (ACT NOW, hunk-just)

Line numbers are after the edit. No file was staged or committed.

| # | File:line | Before | After | Owner check |
|---|---|---|---|---|
| 1 | AGENTS.md:48 | `(UR1–UR69)` | `(UR1–UR75 standing, UR76–UR82 proposed)` | UI_RULES defines UR1-UR82 |
| 2 | docs/systems/COMBAT_PEOPLE_SITES_UI.md:8 | `UI UR1-UR69/AD34` | `UI UR1-UR82 (UR76-UR82 proposed)/AD34` | same |
| 3 | docs/systems/PROGRESSION_WORLD_STATE.md:16 | `GTR1-GTR30` | `GTR1-GTR35` | PROGRESSION_GATE_RULES defines GTR1-GTR35 |
| 4 | docs/systems/PROGRESSION_WORLD_STATE.md:156 | `(GTR1-GTR30)` | `(GTR1-GTR35)` | same |
| 5 | docs/systems/PROGRESSION_WORLD_STATE.md:142 | `Header says proposal (GTR1-GTR20, 2026-10-23).` | `Header says proposal (GTR1-GTR35; GTR1-GTR20 written 2026-10-23).` | register: GTR28-GTR35 added later |
| 6 | docs/RULES_INDEX.md:110 (router, Generators, RNG, seeds) | link to the 2026-10-13 procedural status map "for what is built" | GENERATION_FOUNDATION_RULES (GR1-GR17), then [procgen STATUS](../gm/dispatch/procgen-2026-10-13/STATUS.md) with the old map labelled as predating the merges (GR gaps G-a, G-b) | resolves GR gap G-c |
| 7 | docs/GROUND_RULES.md:73 (CX4) | link path `../../../../GENERATION_FOUNDATION_RULES_2026-10-14.md#gw5...` (escapes the repo) | `GENERATION_FOUNDATION_RULES_2026-10-14.md#gw5...` | resolves GR gap G-e; GW5 heading exists at line 325 |
| 8 | docs/RULES_INDEX.md:66 and :114 | `LSD1–LSD441` | `LSD1–LSD470` | design doc table ends at LSD470 |
| 9 | docs/gm/dispatch/protagonist-life-2026-10-27/LEAD_LIFE_SYSTEMS_DESIGN.md:6 | `Codes LSD1-LSD441 are this doc's` | `Codes LSD1-LSD470 are this doc's` | same |
| 10 | docs/LEAD_LIFE_GUIDE.md:9 | `(LSD1-LSD256)` | `(LSD1-LSD470; this guide covers LSD1-LSD256)` | guide's own coverage unchanged; :107 left alone (status claim about codes the guide did not review) |
| 11 | docs/RULES_INDEX.md:103 (router, any player-facing UI) | `UIV1–UIV7` | `UIV1–UIV4, UIV6, UIV7` | F3 |
| 12 | docs/WORLD_PASS_RULES.md:18, docs/WORLD_ENTRY_RULES.md:25, docs/PROGRESSION_GATE_RULES.md:25 | `WA1-WA21` (row describes the whole absorption book) | `WA1-WA53` | WA22-WA41, WA48-WA50 are accepted (AD32) and the rest proposed (register), so WA1-WA21 was not even the accepted set |

GR gaps G-c and G-e are the entries in `GENERATION_FOUNDATION_RULES_2026-10-14.md` that another session is editing today; this audit records them as resolved there instead of editing that file. Fix 6 and 7 are theirs to cross out.

Left as found: `docs/gm/PROJECT_LOG*` history; the "checked against AD1-AD38" acceptance lines; PROGRESSION_WORLD_STATE:336 ("AR1-AR5, AR14" is a chosen subset).

## Overlap clusters (proposals)

Types: **same** (the rules say the same thing), **restatement, keep** (a rule restates an accepted line by design and says so, as ECR1 does AD27), **conflict**. Proposed method for every cluster, default: the canonical home keeps its text; the other codes stay as one-line aliases ("same as X, see there") so citations resolve; the dial is that a cluster is left alone when its aliases would be longer than the text they replace. The shared homes are the existing [Shared principles](../RULES_INDEX.md#shared-principles-across-rulebooks) table and [Overlap owners](../RULES_INDEX.md#overlap-owners-proposal-2026-10-30) table, which this audit proposes to extend instead of adding a third.

### UI family: UR, UIV, SUI, RPT, MW, DSG

| Code | Cluster | Type | Canonical home | Aliases | Cost |
|---|---|---|---|---|---|
| O1 | **DSG6-DSG10 restate UR1/UR8/UR41-UR43/UR32/UR52/UR82/UIV1.** DESIGN.md says it "links to them and does not restate them", yet DSG6 = UR1+UR4+UR8, DSG7 = UR26+UR41, DSG8 = UR9+UR43, DSG9 = UR32+UR52+UR82, DSG10 = UIV1+SUI5. | same | UI_RULES (the UR/UIV lines) | DSG6-DSG10 become a six-row "feature readiness" checklist that lists the UR codes and adds just what is new: the "all six, or the Projects drawer" readiness test (F7) | Edit DESIGN.md on its branch before it merges: about 350 words lighter, one fewer place to fix. Zero cost to accepted text. |
| O2 | **Empty, blocked and "not yet" states in six places.** UR32 (empty states say how to fill), UR52 (known-empty, filtered-empty, unavailable differ), UR82 (a system shows once something is attached), DSG9, UIV1 (disabled shows reason), SUI5 (untaken options stay visible), UR7 (button with disabled reason), UR81 (stops explain themselves), GTR10/GTR23/GTR24 (reasons follow means, authored text, hiding is a knowledge decision), ECR32 (merchant says why). | same, with ECR32 and GTR10/23/24 as domain applications | UR52 for states, UIV1 for the visible reason, GTR10 for what the reason may reveal | UR32, UR7 (disabled clause), UR81, DSG9, DSG10, SUI5, ECR32 each get "see UR52/UIV1/GTR10" | One "blocked reasons" row in Shared principles. Low risk: wording already agrees. |
| O3 | **One home per fact** (DSG11) vs UR36 (known combat facts have stable homes), UR56 (summaries keep a route to detail), UR74 (one meaning across surfaces), AD7 (one record per subject), AR3 (one authority per fact). DSG11 adds the on-screen duplicate case. | restatement, keep (DSG11 extends, does not conflict) | AD7 and AR3 for data; UR74 for words; DSG11 for screen placement | Add DSG11 and UR74 to the "One authority per fact" row of Shared principles | One table row. DSG11 stays as written (Weibao asked for it). |
| O4 | **Visible-at-all-times set and baseline look.** UR11/UR12/UR49 (Proto23 baseline), DSG1/DSG2 (Proto23 composition, Luminous Gothic skin), UR60/UR68 (type roles). Not a conflict: DSG1 cites UR12 as accepted (AD32); DSG2 is a skin on the same layout. | restatement, keep | UR11/UR12; DESIGN.md for the skin | none | Say in UR12 that skin is DESIGN.md's (one clause). |
| O5 | **Scene and Reports rules repeat UR70-UR75 and UR44.** SUI9 = UR70+UR71; SUI11/RPT3 = UR44; SUI4 = RPT7 (no canon labels, twice, both name each other); SUI12 = UR14-UR16 for scenes; RPT9 = UR43. | restatement, keep (each names its source in the right-hand column) | UR rules; SUI4 for canon labels | RPT7 aliases SUI4 | None needed; they already cite each other. Listed so nobody merges them blind. |
| O6 | **Proof and evidence states for UI.** UR14 (discoverability check), UR16 (proof versus taste), UR45 (reference evidence names how state was reached), UR57 (full journey), MW4/MW5/MW8 (fixtures, journey, freshness vs fidelity), SUI12, FLR2/FLR6. | same | AD43/FLR for "done"; UR14-UR16 for UI specifics; MW8 for study status | UR16, SUI12 alias FLR6 and AD42 | See O12. |
| O7 | **Viewport wording.** UR14, UR25, the 2026-10-17 viewport note, MW4 and the player-ui rule all name 1920x1080, 1536x864 and the retired 1366x768. They agree after the 2026-10-19 retirement; UR25 still reads "1920x1080, the MacBook size and 1536x864" without the retirement note the others carry. | same | The viewport-targets note in UI_RULES | UR14, UR25, MW4 point to it | One clause. |

### Foundations: Rulebook 1-12, AD1-AD46, FLR, PRF, FND, CX, AGENTS framing

| Code | Cluster | Type | Canonical home | Aliases | Cost |
|---|---|---|---|---|---|
| O8 | **The startup principles live in four homes** (F8): the core digest in RULES_INDEX (14 rows, 250 words), GROUND_RULES Authority and Process (235), AGENTS "Design framing" (362) and Shared principles (203). Each row is the same principle: Weibao's words rule (AD32), anything is possible reasonably (AD5, AD38), limits are defaults with a dial (AD5, AD22), means decide (AD6-AD8), one authority per fact (AR3, AD7), build one slice (AD33), verify what changed (AD36). | same | GROUND_RULES for the startup page (AGENTS already points to it first); AD lines remain the citable rules | The core digest shrinks to a pointer plus the 6 rows GROUND_RULES lacks (UI target, time, recovery, secrets, budget, floor); AGENTS "Design framing" keeps its bullets because Codex reads AGENTS without the index, but each bullet ends with the AD code instead of a second explanation | Roughly 700-900 words removed from a lane's read; the cost is one coordinated edit across three accepted-text files. Proposal needs Weibao's yes because AGENTS.md is accepted direction. |
| O9 | **"Default, dial, reason; no never/always/just" appears eleven times.** AD5, AD22, MR15, PRF3, PRF8, WPR5, GTR6, ABR15, the AGENTS framing bullets, the ECR and BHR/CBR/SLR acceptance headers, LEAD_LIFE_RULES "defaults, not laws". All say the same thing; MR15, ABR15 and AD22 add "limits are adjectives". | restatement, keep | AD5 (statement) and AD22 ("limits are adjectives") | Add one Shared-principles row naming the family; do not touch the rulebooks | One row. The rulebooks restate it on purpose so a lane reading just one of them still sees it. |
| O10 | **Proof by play: the largest near-duplicate.** AD36 (Efficient rule verification, 906 words), AD43 and FLR1-FLR6 (252 + 179), AGENTS Verification (335), WPR30-WPR32, MR34-MR36, WA19, AR10/AR16, GTR27, UR16, SUI12, FND2/FND3, CX7. All say: rebuild, exercise from a fresh origin at 1920x1080, save/reload/export/import when persistence changes, label the review state. | same (the slice floor), with different scopes | "Definition of done" (AD43) for the floor; AD36 for which checks to pick | WPR32, MR36, WA19, GTR27, AR10 get "meets FLR2-FLR5 for its domain, see AD43"; keep their domain additions (MR34 golden seeds, GTR27 journey crosses the gate, AR16 architecture check) | Largest single edit; saves about 600-900 words per lane plus one source of truth for "done". |
| O11 | **Carry per reset.** GTR28 (reset names what carries per asset class), SLR20/SLR31 (layer carry rule), ECR27/ECR28/ECR33 (wealth carrier, time horizon), WER9 (carry stated per crossing), WA14 (carry per edge), AD11, ABR (cheat carry), BHR. Eight rules, one idea: every crossing or reset lists what survives, per class, with a carrier. | same, by design (domain applications of AD11) | AD11 for the principle; WER9 + WA14 for crossings; GTR28 for the per-class list | SLR31, ECR33, ECR28 alias GTR28 ("per class, per reset"); keep each domain's own classes | One row in Shared principles plus alias lines. Medium cost: SLR and ECR are accepted. |
| O12 | **"No producer without a reader."** GR12 (generator), MR32 (maker), SR12 (site), FND1 (generator ships four lines), FLR4 (the result has a consumer), WA19 (lint pass is not absorbed), GTR27 (gate counts once a journey crosses it), AR10. Shared principles lists MR32, SR12, GR12 but not FLR4, GTR27, AR10. | same | FLR4 (the floor) | Add FLR4, GTR27, WA19 to the existing "Nothing ships without a reader" row | One row edit. |

### Skills, abilities, progression

| Code | Cluster | Type | Canonical home | Aliases | Cost |
|---|---|---|---|---|---|
| O13 | **Mastery improves control, not truth; one resolver.** SLR2 = MR21, SLR5 = MR22, SLR17 = MR23. Already marked "Pointer" in the text. | restatement, keep | MAKING_RULES MR21-MR23 | none needed | None. Listed as the model for the other clusters. |
| O14 | **SLR, ABR and GTR overlap on gains, teaching and gates.** ABR8 = SLR4 + SLR8 + SLR40 (cause and layer); ABR9 = SLR14-SLR16 (teaching, copying, transfer); ABR2 = AD38 + SLR41 + GTR2 (mechanism, not name); ABR4 = WA5; ABR7 = GTR1 + GTR9 (gates are facts); ABR11 = GTR11 (admission versus support); ABR16 (cheats are abilities with terms) = AD26/AD29. Each ABR already cites its source in the heading. | restatement, keep | SLR, GTR, WA for the substance | ABR rules stay as the ability lane's one-stop read; no alias needed | None. The overlap is the design (a lane reading ABR should not also need SLR). |
| O15 | **Same rules for NPCs and the player.** MR23, GR13, GTR20, SLR15 (teachers teach what they hold), AD6, ECR (merchant judgment, ECR9), CBR, PIR. Shared principles lists AD6, MR23, GR13. | same | AD6 | Add GTR20, SLR15, ECR9 to that row | One row edit. |
| O16 | **Overflow written three times.** GTR16, GTR21, GTR29 (overflow absorbed; every cap names its overflow; rows cover five policies) and GTR22 (a finished track says what next), plus PROGRESSION_GATE_OVERFLOW doc. | same | GTR21 (rule) and the overflow doc (rows) | GTR16, GTR29 alias GTR21; GTR22 stays | Low value; GTR is proposed, so this can be done without a yes. |

### Worlds

| Code | Cluster | Type | Canonical home | Aliases | Cost |
|---|---|---|---|---|---|
| O17 | **WPR restates WA, AU and AD.** WPR4 evidence labels = WA3 canon status; WPR5 = AD5; WPR6 = AU5; WPR8 = WA11 + sealed secrets; WPR22 reconcile = AD32 + WA-conflicts; WPR27-WPR29 (save, register, commit) = AD35, WPR28's own register rule, shared-worktree practice; WPR30-WPR32 = FLR + WA19 (O10). Of 32 WPR rules about 12 restate another home. | same | WA for source-to-pack; WPR for pass shape (WPR1-WPR3, WPR9-WPR17 dimensions, WPR18-WPR21 review) | Alias the 12 restating rules | Moderate: WPR is proposed, so no acceptance needed, but WPR codes are cited in many lane briefs (aliases keep them working). |
| O18 | **Entry coverage is declared twice.** WER14 says every world pass records WER2-WER12 per start; WPR15 (starts and entry) is the same coverage row in the pass checklist. WER9 = WA14 = AD11 (O11). WA13 (starts are coherent packages) ≈ WER2/WER3. | same | WER for the nine answers; WPR15 as a one-line link | WPR15 aliases WER14 | Small. |
| O19 | **Completion standard overlaps WPR coverage.** The completion standard's S00-S14 sections and C0-C5 levels overlap WPR9-WPR17 (coverage dimensions) and WA6 (floor before deep: K2/K3/K6/K8/K13). They use three vocabularies (K codes, S sections, WPR dimensions) for "what a world needs". | same, three names | WORLD_COMPLETION_STANDARD (S and C codes are already stable identifiers) | A mapping table: K code to S section to WPR dimension, in the standard | A new table is one more place; put it in the standard and link from WPR9. Medium cost; the standard is a proposal. |
| O20 | **Lead-life and world absorption.** WA25-WA50 (action classes, loops, allies as lives, relationships by tier, dated character records) overlap LSD (top-down design, tiers LSD126-LSD137) and CLR (lane rules); WA45 says "systems that drive choices are designed top down", which is LSD's thesis. LEAD_LIFE_RULES records the accepted lines; LSD is a proposal. | restatement, keep (WA45 cites the LSD work) | LEAD_LIFE_RULES for accepted lines; WA for pack shape | none | None now. Revisit when LSD lines are accepted: those become aliases of WA rows. |

### Making and economy

| Code | Cluster | Type | Canonical home | Aliases | Cost |
|---|---|---|---|---|---|
| O21 | **Generator contract repeated in making.** MR2/MR3 (deterministic draws, freeze), MR28 (harvest keys on world/place/game time) = GR17; MR30 (law revision kept) = GR10 (`id@rev`) = WA10; MR34 (prove determinism) = GR16 (three tests); MR33 (old saves load unchanged) = AR6 = WER16 (qualified by the old-save deferral). T4 already says MR and SR are the making and site applications of GR. | restatement, keep | GR (accepted contract) | none | None. Add MR30/GR10/WA10 to the "A seen thing does not silently change" row. |
| O22 | **Economy has no conflicting duplicates found.** ECR1, ECR24, ECR27 restate AD27, AD31, AD11 (marked). ECR5/ECR9/ECR14 (price cause and belief) overlap UR72/UR75 just at the display edge. | restatement, keep | DOMAIN_RULES | none | None. |

## Reading load

Counts are `wc -w` on the files as of this audit. "Required" is what AGENTS and the router tell a lane to read; a lane that reads just the cited sections reads less, so these are upper bounds for a lane that follows the instructions literally. After-figures are **projections**, not measurements.

**Player-facing UI task, today (about 20.7k words, 9 files, 10 with DESIGN.md merged, 11 with layout comparisons):**

| Item | Words |
|---|---|
| AGENTS 2,143 + CLAUDE 227 + GROUND_RULES 1,189 + VISION_DIGEST 603 + PROJECT 842 | 5,004 |
| `.claude/rules/player-ui.md` (auto-loads on UI paths) | 277 |
| RULES_INDEX How to use, Core digest, Router (102 + 250 + 1,525) | 1,877 |
| RULES_INDEX AD section (the router says check AD rules for every aspect the task touches) | 2,290 |
| UI_RULES, whole file (356 lines) | 9,570 |
| DESIGN.md (on the branch; the systems front door sends UI lanes to it) | 1,711 |
| MOCKUP_SYSTEM (just for unsettled layouts) | 2,128 |

UI_RULES itself is mostly conditional: Checklist 175, Applying to a bounded journey 349, Descriptions 685, Before you build 660, While you build 1,420, Before you call it done 246, Getting anywhere 854 and For coordinators 136 total 4,525 words and are the ones a normal slice needs. The rest is by trigger: Proportions 352, Structural parity 152, Contextual navigation 1,834 and Discord guide 1,168 (reference-guided design, UR59-UR64), Craft 1 evidence 95, Scene and report rules 1,372 (scenes, travel, Reports lines).

**Projection after the proposals:** keep the startup read (5,004), the auto rule (277), the core digest plus the one UI router row (about 350), the UI_RULES required sections (4,525), DESIGN.md trimmed by O1 (about 1,350), and read the AD lines the router row names (AD34, AD40, AD46, AD43, about 300). Total about 11.8k words, 9 files: a saving of about 8.9k, of which the merges (O1, O8) account for about 1.2k and the tiering (a "required first" line at the top of UI_RULES plus per-AD router citations) accounts for the other 7.7k.

**World pass (new world or audit), today (about 29.8k words, 15 files; 16 with sites; 17 and 41.8k with the lead-life guide):**

| Item | Words |
|---|---|
| Startup (as above) | 5,004 |
| Auto rules: world-passes 86 + research-and-agents 505 (docs/audits, docs/research) + sites-exploration 89 (docs/worlds) | 680 |
| RULES_INDEX How/Core/Router + AD section | 4,167 |
| WORLD_PASS_RULES 2,618 + WORLD_ABSORPTION 8,184 + WORLD_ENTRY 1,812 + COMPLETION_STANDARD 3,143 | 15,757 |
| AGENT_USAGE_RULES (the router names AU1-AU15) 2,167 + LEAD_LIFE_RULES (book worlds) 2,010 | 4,177 |
| Optional: LEAD_LIFE_GUIDE 11,992; SITE_AND_EXPLORATION_RULES 1,323 | 13,315 |

**Projection after:** startup 5,004; one merged auto rule for research and world passes, about 600; core digest plus WPR/WA/WER router rows, about 450; WPR trimmed by O17 and O18 to about 2,000; WA read as WA1-WA6 plus the rows for the pass kind (about 3,500 of 8,184); WER just when starts are in scope (1,812); the completion standard by its summary and the O19 mapping (about 1,000); AU rules covered by GROUND_RULES Process for ordinary lanes (0 extra). Total about 14.4k words in 10 to 11 files: a saving of about 15k. The merges (O17, O18, O19, O10) are about 1.5k of that; routing is the rest. Dial: a lane that touches a book world adds LEAD_LIFE_RULES (2,010) and a lane that touches a site adds SR (1,323).

**Whether the core digest should absorb or point.** Default: the digest points. It keeps the rows GROUND_RULES lacks (UI target, time, recovery, secrets, shared budget, floor) and one line "Startup principles: GROUND_RULES Authority and Process", and it stops restating the other 8. Reason: the digest is labelled "read this first", GROUND_RULES also says "read before any task", and AGENTS says GROUND_RULES first. Three "first" pages is one too many. Dial: if Weibao wants the index to stand alone for agents who skip GROUND_RULES, keep the digest and shrink GROUND_RULES instead; either works, just the pairing matters.

## Rule sets with no codes

| Set | Today | Needs codes? | Reason and proposal |
|---|---|---|---|
| Sealed secrets | prose in AGENTS "Sealed secrets" and WORLD_SECRETS_AND_DISCOVERY; restated by WA11, WPR8, SUI4/RPT7, DWF37 | **Yes, strongest case.** About ten router rows cite it by bare name, and four rulebooks restate it with different wording. | Propose `SEAL1`-`SEAL5` in the discovery doc: (1) agents may read and write sealed files, (2) no truth in chat, reports, indexes, commits or UI outside the discovery route, (3) refer by ID, route and status, (4) unseal just on Weibao's ask for that secret or world, (5) public franchise twists are not sealed. WA11 and WPR8 alias them. Reserved-prefix rule requires a repo-wide grep before use (Q2). A top-level grep found no `SEAL` code; `SS` is taken (31 hits). |
| Source research | `research-and-agents.md`, SOURCE_ACQUISITION_TOOLS, AU1-AU15, deep-dive playbook | **No.** AU1-AU15 already cover the budget half; the rest is a tool registry and procedures, which read better as prose and links. | Leave as prose. If a code is wanted later, extend AU. |
| Lead-life rules | LEAD_LIFE_RULES sections A-F; CLR1-CLR13 cover just section F | **Partly.** Sections A-C are the accepted lines and are cited by section letter (for example "LEAD_LIFE_RULES A"), which is stable but unlike every other rulebook. | Keep section-letter anchors; add a register note that the cite form is `LEAD_LIFE_RULES#<section>`. New codes would collide in people's heads with CLR and LSD. |
| World completion standard | S00-S14 sections and C0-C5 levels | **No new codes.** It already has stable identifiers; the register says "none" because they are not a rule-code prefix. | Add a register note "uses S00-S14 and C0-C5" instead of "none"; reserve S and C as context-qualified (cite as `COMPLETION#S06`). |
| Means and appraisal | MN/AP/LS/IMP/ML/AA proposal identifiers | **No.** Proposal identifiers by design. | Leave. |
| Agent workflow | AGENTS sections | **No.** It is a document, not a rulebook. | Leave. |

## More to consider (round 1)

**ACT NOW (done this round).** The 12 drift fixes above; the pointer line in RULES_INDEX; the findings F1-F10; the overlap map O1-O22 as proposals.

**ACCOUNT FOR NOW (needs a decision, or changes how the proposals are read).**

| Code | Item | Level | Effort | Done check |
|---|---|---|---|---|
| A1 | **Range drift guard.** Extend `check_rules_index.mjs` to scan AGENTS.md, `.claude/rules/`, GROUND_RULES, `docs/systems/` and the rulebooks' related-rulebook tables for "XX1-XXn" ranges and fail when n differs from the owner's highest code, unless the line says "proposed", "standing" or "subset" (so UR1-UR75 with UR76-UR82 proposed passes). Default: warn first, fail after one clean week. Reason: F4 and F5 show the register is guarded and its copies are not. | tooling | about 1 hour | The script run on the pre-fix tree flags items 1-5 and 8-12; on the fixed tree it is clean. |
| A2 | **Q1: Codex Luna effort.** AU5 says medium; the working agreement says low. Weibao's call, because one is accepted text and the other is his personal file. Proposed default: follow the agreement (low) for bounded reading and say so in AU5, with "medium" as the dial for thin or contradicted shards. | rule | 5 minutes after his yes | AU5 and the agreement name the same default. |
| A3 | **O8 core digest/GROUND_RULES/AGENTS merge.** Needs Weibao's yes because AGENTS.md and the digest are accepted (AD32) text. | rule | 1 hour | The digest keeps 6 rows plus a pointer; AGENTS bullets end in AD codes; `check:rules` passes. |
| A4 | **O10 proof-by-play aliases.** Needs a yes for the accepted rules (AR10, AD43, FLR); WPR32 and GTR27 are proposed and can go first. | rule | 1-2 hours | WPR32, MR36, WA19, GTR27 each carry "meets FLR2-FLR5, see AD43" and no second definition of done. |

**LATER / DELEGATE (each with its reopen trigger).**

| Code | Item | Level | Effort | Done check | Reopen when |
|---|---|---|---|---|---|
| L1 | **Done 2026-10-30 (Weibao: "Yes, apply tiering"), with the world-pass reading order in WORLD_PASS_RULES and its router row as well.** **UI_RULES "required first" line and the tiered reading in the router** (sections 1-8 required; the reference, scene and Discord sections by trigger). Zero rule text changes. | doc | 30 minutes | UI_RULES opens with a two-line reading order; the router UI row names it; a UI lane brief cites the checklist and the required sections just. | Now; independent of any acceptance. Hand to a haiku lane with this audit. |
| L2 | **O1 on the DESIGN.md branch** (DSG6-DSG10 as a checklist of UR codes). | doc | 30 minutes | DESIGN.md DSG6-DSG10 each list their UR codes and add just the readiness test; the branch's author agrees (it is their file). | Before the branch merges to master. |
| L3 | **Extend Shared principles** with the rows from O2, O3, O9, O11, O12, O15 and O21; delete nothing. | doc | 45 minutes | The table cites each family's codes; `check:rules` passes. | After A3 settles which page is canonical. |
| L4 | **SEAL1-SEAL5** (Sealed secrets codes). | rule | 1 hour (repo-wide prefix grep done 2026-10-30: `SEAL` unused in docs, AGENTS.md and .claude; `SS`, `SRC` and `SX` are taken) | Discovery doc defines SEAL1-SEAL5; WA11/WPR8 alias them; the register row replaces "none". | Weibao's yes. |
| L5 | **O19 mapping table** (K code to S section to WPR dimension) in the completion standard. | doc | 1 hour | One table; WPR9 links to it. | Next world pass. |
| L6 | **Merge `world-passes.md` into `research-and-agents.md`** (or split paths) so audit and research files load one instruction, not two (F10). | tooling | 20 minutes | One auto rule per path set. | With L1. |
| L7 | **Retire the router rows that duplicate a systems-front-door row** (the front door now has one row per system with rulebook, representation, code map and palettes). | doc | 2 hours | Router keeps topic routing; per-system rows move to the front door. | After the front door is accepted (AD32). |

Open questions for Weibao: Q1 (Luna effort, A2), Q2 (SEAL codes and their prefix grep, L4), Q3 (which of the startup pages is canonical, A3). None blocks the drift fixes.

## Checks

Recorded in the final report of the session that wrote this file; see `npm run check:rules` and `npm run check:docs` output for this file and the 12 drift-fix files. Other sessions' files already fail `check:docs` and are out of scope here.

## More to consider, round 2: live owners and caller drift (2026-10-31)

Requested by Weibao after the October 30 work: consider the newly reconciled areas, their little interactions and a dedicated UI refinement audit. These are observations and proposals, not accepted rules (AD32). This pass read the current owners, selected callers and named receipts; it did not measure agent behavior or run the rules suite. The [broader review](REFINEMENT_PRIORITIES_2026-10-31.md#round-2-cross-system-interactions-and-reconciled-owners-2026-10-31) owns the ranked synthesis.

| Code | Observation | Disposition |
| --- | --- | --- |
| RFX1 | **Correction to F3 above:** `UIV5` does exist as the [round-7 UI check](UI_DESIGN_CORE_AUDIT.md#round-7-2026-10-26-general-ui-after-the-parallel-wave), comparing visible text across save and import. The [acceptance packet](UI_RULES_ACCEPTANCE_PACKET_2026-10-29.md#rulebook-upkeep-round-9) explicitly says it is a check, not a rule. It is therefore correct to omit it from a list of binding UI rule codes, but incorrect to say nobody used or defined the identifier. | Keep the identifier with its existing check; do not invent a new rule under it. Apply it when display or persistence behavior makes the comparison useful. |
| RFX2 | `.claude/rules/player-ui.md` still names RPT1-RPT12, while the [UI rules](../UI_RULES.md#scene-and-report-rules-sui-rpt) and index also carry standing RPT13-RPT14. The path rule links the full rulebook and router, so this is a stale abbreviated range, not proof that a worker missed the later rules. | Next scoped instruction upkeep can update the abbreviated range and its dates, preserving the distinction between original and later standing lines. A narrowly targeted range check should allow intentional subsets and historical snapshots instead of treating all older ranges as errors. |
| RFX3 | `UI_RULES` UR2 says Weibao promotes unaccepted features; DESIGN.md describes readiness for the main surface; AD42 makes human review optional. These concern direction, surface placement and verification, but read together can be mistaken for a new human sign-off on every implemented UI. | Honor explicit feature/surface direction and mark new design ideas as proposals; an authorized slice with the required agent-side evidence does not acquire a separate mandatory human taste gate. Clarify wording in the proper rule owners, without changing user direction or silently promoting proposals. |
| RFX4 | [SAVES G1](../SAVES.md#6-open-gaps) asks whether unknown retired IDs should be dropped or an import refused, while Weibao's recorded [2026-10-18 decision](../USER_VISION.md#content-id-retirement-and-frozen-world-idle-2026-10-18) already describes dropping an unknown content ID with a log line. The audit calls the current general implementation gap an inference, not a reproduced end-to-end defect. | Do not ask him to repeat the established default. Reproduce a retired ID and distinguish it from malformed, future-version or required cross-owner state; preserve the stored save on a failed import. A materially different compatibility choice still needs its own explicit decision. |
| RFX5 | SAVES G8 says AGENTS, MR33 and AR6 all read as strict migration guarantees. Current AR6 says a compatibility decision may reset/drop old state; AGENTS offers migration **or** an explicit compatibility decision; the MR33 table's older text is immediately qualified by the documented 2026-10-17 override. | A reader must see both the original line and its override. Keep new-state round-trip, literal Import and protection of private saves; do not turn preservation of every old save into a universal new gate. Update the stale G8 wording when its owner next reconciles the section. |
| RFX6 | [BALANCE](../BALANCE.md) correctly indexes adjustable dials and calls its numbers implemented defaults or proposals, but its final line says setting a felt-outcome target is Weibao's call. AD32 separates an agent's proposal from accepted direction; the project role also lets an implementer choose reversible prototype defaults. | For a selected slice, propose a world-specific range and observable comparison with a reason; invite feedback without treating routine tuning as mandatory approval. Do not impose equal difficulty, anti-exploit targets or one number across worlds. |
| RFX7 | The [systems front door](../systems/README.md#cross-cutting-owners) still said DESIGN.md was on an unmerged branch after `1f40dd9e4` landed, and its S17 row called it in progress. The separate writing draft is older than later implementation changes. | Corrected the front-door status from git and linked DESIGN.md. Keep the voice draft proposed and recheck any implementation claims before incorporating it. Other rows remain October 30 snapshots. |
| RFX8 | The RPT13 test matches literal source shapes and compares against a global set of voiced place names; it does not exercise a newly added world ID, its event carrier, and the useful control as one route. RPT13 itself permits stated exceptions. | When extending this coverage, test a real world descriptor and event against its own start/work location and reachable control. Include two worlds with a shared place name and a permitted no-voice case; do not invent a new registry solely for the test. |

**ACT NOW (done).** RFX1-RFX8 recorded; the live DESIGN front-door status was corrected; the misattributed before/after screenshot was corrected in [CG3](UI_CAPABILITY_GAPS_2026-10-30.md#gaps). No rule was changed, no worker was sent and no runtime behavior was changed.

**ACCOUNT FOR NOW.** Start from user direction, then the owning rule and actual caller. Separate a historical audit claim from live code; a rulebook name, source lookup or passing proxy test is not runtime coverage. Keep save-integrity and private-save boundaries even when old-save migration is deferred.

**LATER / DELEGATE.** RPT caller-range pointer (Luna low, small): update the one path rule and check the cited ranges when that instruction area is owned. Unknown-ID behavior (Sol medium, small after a synthetic end-to-end reproduction): the intended retired-ID case drops and logs without corrupting the stored save; malformed or future envelopes retain their own guards. RPT13 coverage (Sol medium, small): the test fails on a world whose only apparent voice belongs to another world and passes a stated generic exception. Reopen each when a corresponding save, UI or rule-maintenance slice is selected; none blocks an unrelated playable slice.

**Independent audit follow-through, 2026-10-31.** The [systems receipt](../gm/dispatch/refinement-audits-2026-10-31/SYSTEMS_RULES_AUDIT_RECEIPT.md#reconciled-routing-versus-runtime-follow-through) separates stale owner pointers from runtime gaps. The front door's rune row was corrected to the consolidated owner. Ordinary unknown simple inventory items already warn and skip; equipped and special IDs still need separate loader checks. Making rules already apply globally, while their automatic path pattern misses some rune, mixture and potion filenames. The second world-dial target is rejected today, making its missing target filter a future extension risk. No rule text or current compatibility decision changed.


## Round 3: are the rules reconciled in the right places? (2026-10-31)

Weibao: "Are all the rules reconciled in the right places and more?"

**Answer: the main ownership structure is sound, but reconciliation is incomplete.** This is an audit under AD32, not adoption of the outstanding merge proposals or authorization to implement them. This round changes this audit record; rulebooks, runtime, saves and other sessions' edits remain as found. The instruction-audit and more-to-consider skills guided the pass. WPR2, WPR4, WPR22, WPR27 and AD36 apply as relevant audit guidance, preserving WPR's proposed status.

Scope: startup documents, the complete rules index and path-rule text, selected live rule/provenance sections, earlier reconciliation findings and the checker implementation. A bounded structural scan covered 38 startup/registered-owner Markdown files and 974 relative link occurrences. A separate scan checked the maxima of 27 registered code families, including mixed ranges and three-letter families. This is not a fresh semantic reading of every rulebook, a cross-client auto-loading trial, or a gameplay compliance verdict. Evidence is the shared dirty checkout on October 31; later edits can change these findings.

### Verified findings and dispositions

| Code | Finding and evidence | Consequence and disposition |
| --- | --- | --- |
| RRV1 | **The latest direction has reached its core owners.** USER_VISION's October 31 top-down, LOTM-first and shared-engine requests agree with VISION_DIGEST, PROJECT current focus, LEAD_LIFE_RULES A, AD44–AD46, WA54–WA57 and LEAD_LIFE_GUIDE section 10. WA54–WA57 cite the actual request; earlier WA42–WA47 and WA51–WA53 remain marked proposed. | Keep this chain. Whole-known-source design does not require finishing all late systems before an early complete loop, and LOTM's mechanics do not become a template for other worlds. No new standing rulebook is needed. |
| RRV2 | **Model-effort wording still disagrees.** AU5 and research-and-agents.md name Luna medium; the working agreement supplied in this chat names gpt-6-luna low for bounded work. The original F6/Q1 remains a documentation conflict. | For this chat, the supplied user instruction resolves the default to low when delegation is authorized. Do not ask Weibao to repeat that preference. Align the stale project copies in a scoped instruction edit; preserve substantive-judgment escalation and the finite usage budget. No agent was spawned in this audit. |
| RRV3 | **The rules checker can pass a nonexistent UI citation.** Its register parser requires a whole-cell two-letter range; the UI cell contains standing/proposed qualifiers and is skipped. Its citation loop then warns that it cannot verify UR. Three-letter and mixed-family register cells are also outside that parser; citation checking uses a limited prefix list. | Disposable negative probes inserted UR999999 and AD999999 into the same router row. UR999999 passed with 13 cannot-verify-UR warnings; AD999999 failed as expected. Improve the existing checker rather than adding another universal gate. A green result currently proves its stated subset. |
| RRV4 | **Two owner-navigation links are broken outside the index.** LEAD_LIFE_SYSTEMS_DESIGN line 650 links ../../TIMELINES_AND_DIVERGENCE.md, resolving under docs/gm instead of docs. The systems front door S15 links #s15-seeded-generation-gen_kit, while the heading's anchor is #s15-seeded-generation-genkit. | Correct targets are ../../../TIMELINES_AND_DIVERGENCE.md and #s15-seeded-generation-genkit respectively. These were manually checked after the bounded scan; they are source navigation defects, not evidence of missing mechanics. Neither is checked by the index's own-link scan. |
| RRV5 | **WA summaries have drifted again.** WORLD_PASS_RULES line 20, WORLD_ENTRY_RULES line 25 and PROGRESSION_GATE_RULES line 25 advertise WA1–WA53 for the whole absorption book; the owner and register now reach WA57. | Update these summaries in the next scoped reconciliation. Keep historical snapshots and intentional subsets intact. The independent range scan found matching registered maxima across the 27 scanned families; apparent LSD15/LSD25 gaps were parser-shape misses, manually resolved to their plain-text definitions. |
| RRV6 | **Consolidation is still partly a proposal, and the lint result is not an all-clear.** O1–O22 were an overlap map, not a completed merge. Core principles and delivery proof still have several restatements; DESIGN's readiness text overlaps UI_RULES. npm run check:docs fails on the current tree and implements wording/provenance checks, not link validation, despite the systems front door's update note saying it covers links. | Preserve useful domain applications and stable codes. Treat the remaining aliases/tiering/consolidation as proposals under AD32. Inspect lint diagnostics individually: a flagged source quotation or factual capability statement is not automatically an invalid design constraint. Do not claim all docs or links are clean. |

### Earlier observations that are now closed at source level

RFX2's Reports range is current in player-ui.md: RPT1–RPT14 with the dates split. RFX3's UR2 wording now recognizes existing authorization and optional human review under AD42. RFX4/RFX5 are reflected in SAVES G1/G8: the decided retired-ID default is drop and log, old MR33 wording is read with its override, and real-loader coverage remains a separate gap. RFX7's DESIGN and rune front-door pointers are current. The making path rule now includes potion, dose, mixture, rune and brew patterns. These observations do not establish runtime correctness or prove every filename matches a path rule.

### More to consider: keep the next correction small

**ACT NOW (done):** rechecked current owners, separated resolved findings from open ones, ran structural diagnostics and a checker negative control, and appended this round to the existing audit owner. No rule meaning changed.

**ACCOUNT FOR NOW:** resolve precedence from the supplied user direction; keep direction, representation, runtime implementation and proof distinct. CLR9's no-commit instruction remains binding for its lanes, but its sandbox-cannot-write-.git rationale is not a current capability guarantee in this unrestricted host. DESIGN's "all six" readiness list should explicitly group DSG6–DSG11: DSG6–DSG10 occupy one table, while DSG11 is separated by a blank line. Neither observation authorizes dropping a user constraint or promoting a proposal.

**LATER / DELEGATE (proposals, no dispatch):** repair the existing rules checker first (Sol medium, small; detect a bogus UR citation and a three-letter-family drift while preserving standing/proposed subsets). Follow with the two link corrections and three WA summaries (Luna low, small; bounded link/range scan clean). Consolidate overlapping wording when that owner is selected (Sol medium; preserve codes, authority and domain exceptions, and compare a routine UI task with a world-source task). These are maintenance opportunities, not prerequisites for unrelated gameplay.

### Checks and limits

- npm run check:rules: PASS, 29 register rows, 46 AD codes and 167 relative index links, with 17 warnings; receipt check PASS, 18 receipts and 317 explicit legacy paths skipped. The warnings include the UR verification gap above.
- npm run check:docs before this append: FAIL on existing shared-tree additions, including the WA register provenance diagnostic and many absolute-word diagnostics. This is a wording diagnostic, not a semantic conflict count.
- Disposable RULES_INDEX_ROOT probes: UR999999 exit 0; AD999999 exit 1. Temporary shadow roots were removed; the real index was unchanged.
- Independent register scan: 27 families have matching maxima; LSD15/LSD25 exist in plain-text definitions missed by the simple scanner. Bounded link scan: 38 files, 974 relative links, two manually confirmed defects listed in RRV4. The checker's slug rules were reused; no live-renderer link-click trial was run.
- No gameplay build, full runtime suite, app installation, browser run, private-save access, commit or push. Those checks do not answer this audit's structural question.
- Post-append npm run check:docs: FAIL, 135 diagnostic lines in the shared tree, zero in this audit. git diff --check scoped to this audit: PASS. Other sessions' changes were preserved.

## Round 4: reconciliation applied (2026-10-31)

Weibao selected the fixes and owner reconciliation without changing accepted direction (AD32; [request](../USER_VISION.md#rule-owner-reconciliation-without-direction-changes-2026-10-31)). This supersedes round 3's open source-level findings for the paths below, not its historical observations. No runtime behavior or private saves changed.

| Code | Applied disposition | Owner |
|---|---|---|
| RRV1 | Latest top-down and world-specific direction retained. No proposed WA or DSG lines promoted. | USER_VISION, AD44–AD46, WA54–WA57 |
| RRV2 | Luna low now agrees across AU5 and the research path rule; named difficulty still permits explicit escalation. | AU5 and portable working agreement |
| RRV3 | Checker parses mixed and three-letter families, combines the named owners, recognizes plain-text definitions and validates citations for discovered families. Auxiliary UIV definitions are included. | scripts/check_rules_index.mjs |
| RRV4 | Corrected the timeline relative path and S15 anchor. Checker now follows registered-owner/startup/front-door links relative to their source, extending protection beyond index links. | Lead-life systems design and systems front door |
| RRV5 | Three whole-book WA summaries point to the current range in their owner, avoiding another copied maximum. | World-pass, entry and progression-gate rulebooks |
| RRV6 | Core digest points to GROUND_RULES instead of repeating authority/process; runtime floor routes to AD43 and check selection to AD36. DESIGN's six checks form one table and link interaction owners; UR2/AD42 retain authorization/review semantics. RPT7 aliases SUI4. Shared-principle routing now includes screen meaning, readers, custody/freeze and NPC domain applications. | GROUND_RULES, RULES_INDEX, UI_RULES, DESIGN |

ACT NOW (done): the fixes above; removed CLR9's stale sandbox explanation while retaining its lane no-commit policy. Corrected the front door's claim that check:docs validates links. Preserved unrelated dirty work; no staging, commit or push.

ACCOUNT FOR NOW: registered-owner link checks are deliberately bounded, not a recursive scan of every palette or historic report. Code ranges do not establish semantic consistency or runtime behavior. Missing definitions still warn for legacy owner shapes; the real register has no such warning after these changes. The dated LSD proposal owner remains a warning rather than being moved and breaking its historical role. Proposed PRF/FND prompts remain prompts, not extra stop gates.

LATER / DELEGATE: consider a narrowly scoped caller-range check when another real drift appears (small, Sol medium; distinguish full-owner summaries from accepted/proposed or historical subsets). Do not compare every abbreviated citation with the owner's maximum. Under AD32, broader O1–O22 alias proposals remain a palette: shared domain applications keep their additions, and this pass does not flatten them into one universal rule or promote earlier proposals.

Verification: the existing checker suite was extended with meaningful negative controls for bogus UI citations, three-letter range drift and owner-relative anchors, plus a passing standing/proposed split. Six focused tests pass. Final command results are recorded below. No gameplay build/full suite was required for instruction and tooling maintenance; no commit was requested.

Final checks for round 4:

- `node --test tests/check_rules_index.test.js`: PASS, six tests, including negative controls. Temporary fixture roots are cleaned up.
- `npm run check:rules`: PASS, 29 register rows, 46 AD codes, 853 deduplicated-per-source relative links; one dated-LSD-owner warning. Receipts: PASS, 18 checked, 317 explicit legacy paths skipped.
- `npm run check:docs`: FAIL, 138 shared-tree diagnostics at the final run. None in this pass's rule/checker/audit edits; other sessions' additions remain, including a USER_VISION community-lore paragraph. Existing AR10/CLR9 constraints carry explained lint exemptions rather than weakening their wording to satisfy an absolute-word heuristic.
- `git diff --check` on the task's changed paths: PASS. No gameplay build, architecture scan, full runtime suite, app install, commit or push was performed.

Concurrency note: another session added WA58–WA60 while this work ran. Those additions and their provenance were preserved. The three full-book summary rows now refer to the live owner's range instead of copying WA57 or WA60. The current focus and accepted vision digest required no direction change. Earlier audit wording remains dated evidence rather than being rewritten as if these fixes had already existed.

## Round 5: remaining document lint failures (2026-10-31)

Weibao: "Fix the remaining document lint failures too, without changing accepted direction or disturbing other chats’ work. More to consider? Save and update accordingly."

AD32 and AD36 apply. The lint diagnostics were predominantly lexical false positives, not evidence that the cited documents had invented new world laws. The pass read the flagged wording and retained source observations, proposed slice constraints, history and verification states. No gameplay implementation, adoption decision or queue order changed.

| Code | Correction | Evidence and boundary |
|---|---|---|
| DLINT1 | The wording checker distinguishes hyphenated coverage/state terms, conditional quantifiers, references to existing direction and in-world agreement terms from unconditional rules or project-adoption claims. | Regressions retain failure for a direct adoption assertion and for a universal quantifier in the same line as a conditional phrase. This remains a diagnostic heuristic, not a semantic authority. |
| DLINT2 | The generated Source Library catalogue's bibliographic row shape does not treat an author's name as a design rule. | The exemption requires the generator marker, exact catalogue path and bibliographic row shape. Prose rules in that file still fail. The generated catalogue was not edited. |
| DLINT3 | Seventy-four reviewed lines across 18 documents have explained, line-specific slip-ok comments. | Explanations distinguish factual holdings/tool observations, source-fidelity boundaries, historical evidence scope, and observer/transaction invariants of selected proposals. Visible prose was retained verbatim; no file-wide exemptions were added. An exemption does not certify the underlying claim as currently verified or accepted (AD32). |

ACT NOW (done): corrected the diagnostic false positives and documented the remaining reviewed exceptions; added positive and negative regression cases in the existing checker test file. Edits to other chats' documents add comments to exact current lines, with a read-before-write equality guard. No staging, reset, source rewrite, private-save access or worker dispatch occurred.

ACCOUNT FOR NOW: preserve strong observer, source-fidelity and save/transaction boundaries even when their wording contains an absolute. A proposal's scoped check remains proposed. An exception comment describes why lint is inapplicable to that line; it does not grant product authority. Later edits to the line should reassess the comment, rather than inheriting it as approval. A passing changed-line lint does not prove every historical document is consistent.

LATER / DELEGATE: if recurring false positives appear, extend the existing focused cases with the actual wording and a nearby failing counterexample. Avoid broader path exemptions or a second documentation checker. No new universal review gate is proposed.

Round 5 verification:

- `node --test tests/check_doc_slips.test.js`: PASS, both tests, including multiple positive/negative fixtures, untracked-document coverage and line-local exemption isolation.
- `npm run check:docs` after the audit append: PASS, no new hits across the current shared tree.
- `npm run check:rules`: PASS, 29 register rows, 46 AD codes and 854 relative links; the existing dated-LSD-owner warning remains. Receipts: PASS, 18 checked and 317 explicit legacy paths skipped.
- Exact-text preservation check: PASS for all 74 annotated lines. `git diff --check` scoped to this pass's paths: PASS.
- No full gameplay suite/build, installation, commit or push. This pass changes documentation diagnostics and explanatory comments, not runtime behavior. Results describe the checked snapshot; later concurrent edits can introduce new diagnostics.

## Round 6: proposal-source ownership and clean final gates (2026-10-31)

Weibao: "Fix the remaining dated-owner warning too, and other problems to not have to go backand forth keeping proposals and accepted rules distinct and preserving other chats’ work. More to consider? Save and update accordingly."

AD32/AD36 govern this maintenance pass. The previous warning exposed a classification problem: one register row combined binding cast-life defaults with the dated LSD proposal source. Moving the actively edited design would risk competing copies and broken citations. The register now separates these roles without moving the source or adopting its proposals.

| Code | Applied correction | Boundary |
|---|---|---|
| OWN1 | Cast-lives registration retains CLR/SUI/RPT and their existing authority. A distinct LSD proposal row links the stable reading guide, explicitly labelled proposal source, and LEAD_LIFE_RULES as the direction owner. | LSD codes and historical source remain intact. A register entry does not promote a proposal (AD32). |
| OWN2 | The dated-owner diagnostic recognizes an explicitly labelled proposal source when the register status is proposal, the source header confirms that status and an existing stable route is supplied. | An unlabelled dated owner, missing stable route/header, or standing/adopted status still warns. Link and code validation still cover the proposal source. No path-wide exemption was introduced. |
| OWN3 | A registered range with no definitions now fails rather than warning and skipping citation checks; a reversed range fails explicitly. | Focused negative controls cover both. The fixture definitions in older warning tests now represent actual defined ranges. |
| OWN4 | Three lint diagnostics appeared in concurrent additions. Two non-adoption statements now cite AD32; one research execution receipt has a line-specific scope explanation. | Source wording, research results and proposed workflow remain as written. No change to another chat's source or runtime implementation. |

ACT NOW (done): OWN1–OWN4, focused regression coverage, and this record. The active LSD design was not moved or rewritten in this pass. Current index text was read and changed by the affected register hunk; other rows, including concurrent world-absorption direction, were retained.

ACCOUNT FOR NOW: a dated proposal source is legitimate provenance, while an unexplained dated authority still deserves a warning. The checker verifies these explicit structural distinctions; it cannot authenticate a human decision from prose alone. Existing authority and source locators remain essential. Zero warnings applies to the checked snapshot, not every future edit or all semantic claims in the repository.

LATER / DELEGATE: no further correction is known from these gates. If a newly selected task exposes a real owner ambiguity or unsupported acceptance claim, extend the same owners and focused regression rather than creating a parallel audit/checker. This is a reopen condition, not an extra approval gate or implementation queue.

Checks:

- `node --test tests/check_rules_index.test.js tests/check_doc_slips.test.js`: PASS, 11 tests. Proposal-source tests include invalid/missing labels, standing or adopted status, missing header and missing stable route, plus the valid case.
- `npm run check:docs`: PASS, no new hits in the shared tree.
- `npm run check:rules`: PASS, 30 register rows, 46 AD codes, 854 relative links, zero warnings; receipt check PASS, 18 checked, 317 explicit legacy paths skipped.
- No runtime build, gameplay suite, app installation, commit or push. Accepted direction and proposal status were preserved. Final post-record document and whitespace checks follow below.

Post-record verification: `npm run check:docs` PASS; `git diff --check` on this pass's six paths PASS. No additional diagnostics remain in the checked document/rules gates. Changes remain local and uncommitted.

## Tooling follow-through proposal (2026-10-31)

The [reconciliation tooling proposal](RECONCILIATION_TOOLING_PROPOSAL_2026-10-31.md) answers Weibao's follow-up about what to make for OOPS. It separates completed structural reconciliation from connected behavioral evidence and recommends extending existing rule/evidence and receipt routes. This is a proposal under AD32, not a new rule, runtime queue or resumption of stopped lanes.
