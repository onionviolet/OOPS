# UI rules keep, merge or retire: UR1-UR176

Date: 2026-11-19. Proposal, nothing retired until Weibao says yes. Read-only audit: no rule file was edited and nothing is committed.

Method. I took the rule text from a snapshot of `docs/UI_RULES.md` taken 2026-11-19 while another session was moving history sections out and compressing UR163-UR176, so classification is by code and UR163-UR176 wording may already differ. Status comes from the "UI rules" row of `docs/RULES_INDEX.md`. Each code was tested against: (a) a check that enforces it, found by reading `tests/`, `scripts/` (check:flow, ui_contract, ui_style_ratchet, check_player_text, check_descriptions) and `src/`, with each row's own "Check" claim verified; (b) a recurring mistake, meaning a cited PX, PS, UIC or UIX finding, audit round, capture, Weibao quote or measured observation (rulebook codes such as TMR, KNW, MND and STN are requirements, not findings); (c) a lookup role (the element sheet UR102-UR127). A code that fails all three is a RETIRE or MERGE candidate. A MERGE names a target that is itself KEEP. Accepted direction codes are never RETIRE; Weibao's wording stays in the target code.

Citations are `grep -rwI "URnn" src tests scripts styles | wc -l` (matching lines). A citation is not a check. Where a count includes the `tests/ui_contract_allowlist.json` reason fields, the fixtures in `tests/check_rules_index.test.js` or the code-parsing comment in `scripts/check_rules_index.mjs`, the table shows "real (raw N)". "check:flow" runs on request and is not part of `npm test`; rows say "(on request)".

## Summary

| Verdict | Codes | Accepted direction | Working default | Proposal |
|---|---|---|---|---|
| KEEP | 149 | 77 | 69 | 3 |
| MERGE | 22 | 3 | 17 | 2 |
| RETIRE | 5 | 0 | 5 | 0 |

Rule text that would go: RETIRE 787 words (5 codes), MERGE 1949 words from non-Accepted direction sources (19 codes), 2736 words in total. Each MERGE leaves a one-line pointer or a clause in its target, so the net saving is smaller. Three MERGEs have Accepted direction sources (UR18, UR47, UR56; 197 words); they are left out of the total above because they restate Weibao's direction and need his wording call. With them the total is 2933 words of a 15780-word rule text.

Weibao's call, not mine: UR88 (accepted direction 2026-11-14, KEEP, no detector) and UR162 (held, KEEP, proposed check not built). The three Accepted direction MERGEs need his yes too.

Pairs the brief named, checked: UR6/UR65-UR68/UR164 (UR164 folds into UR6; UR65-UR68 each have their own ui_contract detector and stay). UR147/UR158/UR168 (UR158 folds into UR168 and brings its `dupway` detector; UR147 stays because `repeat` and PX46 are its own). UR145/UR174 (UR174 folds into UR145). UR32/UR143 (UR143 folds into UR32). UR45/UR167: not a merge (UR45 is how parity evidence was reached, UR167 is the fight default). Esc and dismissal (UR53, UR67, UR113, UR132, UR150): no merge; UR132 adds the order and two findings, UR150 has its own test, UR113 is a lookup. Unknown versus zero (UR36, UR52, UR122, UR136, UR157, UR173): no merge among them; UR136 holds the detector, the others apply it to their own subject.

## Table

| Code | Short name | Status | Verdict | Fold into | Evidence | Citations |
|---|---|---|---|---|---|---|
| UR1 | Declare a surface type | Accepted direction | KEEP |  | tests/ui_contract.test.js UIL1 (every panel has a type and route) | 6 (raw 9) |
| UR2 | Unaccepted features go to Projects drawer | Accepted direction | KEEP |  | finding: proposal panels crowding the action place; stray ratchet in check:flow (on request) | 3 (raw 5) |
| UR3 | Main-surface budget | Accepted direction | KEEP |  | finding: nested boxes, endless column; no count test (absorbs UR77) | 0 (raw 3) |
| UR4 | In-world logic | Accepted direction | KEEP |  | finding: "Village mixing counter" with no keeper; none enforced | 0 |
| UR5 | Full screen for weighty decisions | Accepted direction | KEEP |  | finding: world entry in a side panel; none enforced | 0 |
| UR6 | Tokens, not raw values | Accepted direction | KEEP |  | tests/ui_contract.test.js (color, font, radius, cssText) | 14 |
| UR7 | Shared components | Accepted direction | KEEP |  | tests/ui_components.test.js (reason decorator); finding: mixed dropdown rows | 0 |
| UR8 | Own your node | Accepted direction | KEEP |  | tests/ui_contract.test.js foreign-host insertion | 6 |
| UR9 | One center-mode controller | Accepted direction | KEEP |  | tests/center_modes.test.js; check:flow back (on request) | 4 |
| UR10 | Label by destination or outcome | Accepted direction | KEEP |  | finding: author-only labels; none enforced | 2 |
| UR11 | Keep always-visible set | Accepted direction | KEEP |  | tests/layout_spec.test.js | 5 |
| UR12 | Proto23 composition baseline | Accepted direction | KEEP |  | finding: rounded generic look; none enforced | 0 (raw 1) |
| UR13 | Nothing disappears silently | Accepted direction | KEEP |  | finding: features lost after reorganization; none enforced | 9 |
| UR14 | Discoverability check at 1920x1080 | Accepted direction | KEEP |  | finding: button existed, player could not find it; process | 0 |
| UR15 | Reproduce in the player's terms | Accepted direction | KEEP |  | finding: "no way back" was an unclear label; process | 0 |
| UR16 | Proof and taste are separate | Accepted direction | KEEP |  | finding: layout called accepted direction because tests pass; process | 0 |
| UR17 | Saves first | Accepted direction | KEEP |  | finding: presentation work breaking saves; no UI-specific check | 4 |
| UR18 | Lane brief contents | Accepted direction | MERGE | UR76 | none; duplicates AGENTS.md consistency gates and the preflight card | 0 (raw 1) |
| UR19 | One owner per shared layer | Accepted direction | KEEP |  | none (accepted direction); overlaps AGENTS.md one-writer rule | 0 |
| UR20 | Write corrections into the brief | Accepted direction | KEEP |  | none (accepted direction); process | 0 |
| UR21 | Direct path to large panels | Accepted direction | KEEP |  | tests/ui_contract.test.js route table (unique routes, hotkeys) | 0 |
| UR22 | Back goes where you came from | Accepted direction | KEEP |  | tests/center_modes.test.js history; check:flow back (on request) | 2 |
| UR23 | Return restores your place | Accepted direction | KEEP |  | src/center_modes.js saves scroll; no test for selection or tab | 1 |
| UR24 | Large panels can expand | Accepted direction | KEEP |  | none | 1 |
| UR25 | Scroll budget at every target | Accepted direction | KEEP |  | check:flow zoom and oversized, partial (on request) | 1 |
| UR26 | Summary first | Accepted direction | KEEP |  | none enforced (absorbs UR156) | 1 |
| UR27 | Long lists keep bearings | Accepted direction | KEEP |  | finding: lists losing place every tick; none enforced | 0 |
| UR28 | Quick jump | Accepted direction | KEEP |  | none enforced; src/command_palette.js | 1 |
| UR29 | Notices link to source | Accepted direction | KEEP |  | finding: hunting for new recipe; none enforced | 1 |
| UR30 | Same panel header | Accepted direction | KEEP |  | none enforced (UR124 is its lookup row) | 0 |
| UR31 | Shortcuts discoverable | Accepted direction | KEEP |  | none enforced | 0 |
| UR32 | Empty states say how to fill | Accepted direction | KEEP |  | none enforced (absorbs UR143) | 1 |
| UR33 | Larger text still works | Accepted direction | KEEP |  | check:flow zoom at 125% and 150% (on request) | 5 |
| UR34 | Budget space by role | Accepted direction | KEEP |  | finding: 121 px of inventory in a source-colored shell | 1 |
| UR35 | Inspection is free, actions explicit | Accepted direction | KEEP |  | scripts/check_feedback.mjs lists it as owner; finding: accidental consume | 4 |
| UR36 | Known combat facts have homes | Accepted direction | KEEP |  | tests/combat_situation.test.js | 3 |
| UR37 | Color communicates roles | Accepted direction | KEEP |  | ui_contract token rules (indirect); no check on meaning | 53 |
| UR38 | Effects keep the interface contract | Accepted direction | KEEP |  | tests/body_figure.test.js (partial); absorbs UR91 | 8 |
| UR39 | Match structure via layout owner | Accepted direction | KEEP |  | finding: parity claimed while dock constraint stayed; none enforced | 0 |
| UR40 | A chance names both sides | Accepted direction | KEEP |  | tests/combat_situation.test.js | 2 |
| UR41 | Choose navigation scope first | Accepted direction | KEEP |  | finding: every click replaces the lower panel; none enforced | 1 |
| UR42 | Progressive disclosure by frequency | Accepted direction | KEEP |  | none enforced (absorbs UR96) | 12 |
| UR43 | Preview, pin, commands, reference | Accepted direction | KEEP |  | none enforced (absorbs UR47) | 1 |
| UR44 | Log is a stream, not cards | Accepted direction | KEEP |  | finding: sparse startup log hid a tall combat wall | 0 |
| UR45 | Reference evidence names its route | Accepted direction | KEEP |  | finding: default scene shown as representative combat; not a merge with UR167 (different job) | 0 |
| UR46 | Hierarchy from grouping, not fewer facts | Accepted direction | KEEP |  | check:flow zoom (partial); finding: crowded stat cells | 3 |
| UR47 | Reuse hover descriptions | Accepted direction | MERGE | UR43 | none; UR47 itself defers to UR43 for pinning and dismissal | 0 (raw 1) |
| UR48 | Event versus subject now | Accepted direction | KEEP |  | finding: old log line showing today's gear | 0 |
| UR49 | A difference is a gap only without a YAIR reason | Accepted direction | KEEP |  | parity register (docs); finding: copying Proto23 over YAIR choices | 0 |
| UR50 | Chrome earns space | Accepted direction | KEEP |  | finding: defending clutter with precedent; none enforced | 1 |
| UR51 | Group by task, keep fast paths | Accepted direction | KEEP |  | none enforced | 0 |
| UR52 | Navigation stays stable | Accepted direction | KEEP |  | check:flow stability (partial, on request); absorbs UR154 | 22 |
| UR53 | Dismissal and focus contract | Accepted direction | KEEP |  | check:flow back; tests/native_controls.test.js (Esc order not tested) | 5 |
| UR54 | Control placement follows task | Accepted direction | KEEP |  | none enforced | 0 |
| UR55 | State and safety survive condensation | Accepted direction | KEEP |  | none enforced; finding: tidy menu hiding failure | 2 |
| UR56 | Summaries keep differences | Accepted direction | MERGE | UR64 | none; restates UR64 (grouping identity, keep changed outcomes) | 0 |
| UR57 | Review the full journey | Accepted direction | KEEP |  | scripts/check_feedback.mjs owner link; process | 1 |
| UR58 | Display preference owner and reset | Accepted direction | KEEP |  | finding: another character's reminders inherited; none enforced | 2 |
| UR59 | References keep date and status | Accepted direction | KEEP |  | finding: tooltip draft treated as shipped; none enforced | 0 |
| UR60 | Type, color, frames by role | Accepted direction | KEEP |  | font checked by hand; finding: copying colors without composition | 0 |
| UR61 | A meter says its question | Accepted direction | KEEP |  | tests/meter_bar.test.js; finding: 100% success tooltip read as readiness (absorbs UR155) | 8 |
| UR62 | Reactions follow settled occurrence | Accepted direction | KEEP |  | none direct; finding: A's pulse on B | 4 |
| UR63 | Keep dependencies and commitment together | Accepted direction | KEEP |  | finding: quantity goal spending a prized stack; none enforced | 1 |
| UR64 | Condense without flattening | Accepted direction | KEEP |  | finding: repeat counter hiding a new consequence; none enforced (absorbs UR56) | 5 |
| UR65 | Spacing from the scale | Accepted direction | KEEP |  | tests/ui_contract.test.js (spacing) | 12 (raw 366) |
| UR66 | Three control heights | Accepted direction | KEEP |  | tests/ui_contract.test.js (control-height); check:flow smalltarget cites UR64 by mistake | 7 |
| UR67 | Named stacking layers | Accepted direction | KEEP |  | tests/ui_contract.test.js (layer) | 4 |
| UR68 | Text type roles | Accepted direction | KEEP |  | tests/ui_contract.test.js (type) | 12 |
| UR69 | Regions lend free space | Accepted direction | KEEP |  | tests/layout_spec.test.js | 3 |
| UR70 | Lead with meaning and effect | Accepted direction | KEEP |  | none enforced; editorial | 14 |
| UR71 | Mechanics supporting layer | Accepted direction | KEEP |  | finding: formula replacing explanation; none enforced | 0 |
| UR72 | Describe behavior with conditions | Accepted direction | KEEP |  | finding: magic claim copied into a stat; none enforced | 1 |
| UR73 | Write for the player | Accepted direction | KEEP |  | tests/player_reasons.test.js; scripts/check_descriptions.mjs, check_player_text.mjs | 17 |
| UR74 | One meaning across surfaces | Accepted direction | KEEP |  | finding: trait card, tooltip, list disagreeing; none enforced | 7 |
| UR75 | Explain terms and comparisons | Accepted direction | KEEP |  | finding: unexplained AP bonus; none enforced | 14 |
| UR76 | Fill the UI contract first | Accepted direction | KEEP |  | docs/gm/PREFLIGHT_CARD.md (prompt, no detector); absorbs UR18 | 0 |
| UR77 | Budget the homes in numbers | Proposal | MERGE | UR3 | none; no count enforced; UIX6 (83 panels) is the one measure | 2 |
| UR78 | Content is not a promotion | Working default | MERGE | UR2 | none; UIX3 finding only | 0 |
| UR79 | One shape per kind of information | Working default | KEEP |  | finding: five ledgers, five column orders (LLR46); absorbs UR92 | 8 |
| UR80 | Lenses narrow what is known | Accepted direction | KEEP |  | none enforced (accepted direction); finding: spoiler overlay leak | 8 |
| UR81 | Stops and absences explain themselves | Working default | MERGE | RPT6 | none; RPT6 (outside UR range) already binds, tests/return_digest.test.js covers it | 1 |
| UR82 | A system shows once attached | Proposal | KEEP |  | tests/player_reasons.test.js (hides unfit refusals) | 8 |
| UR83 | Coming losses are forewarned | Working default | RETIRE |  | none; rulebook rows only (TMR13, STN15 ...); each rulebook owns its forewarning | 0 |
| UR84 | A known fact shows its source | Working default | RETIRE |  | none; rulebook rows only (KNW9, KNW10 ...); entry shape belongs to the knowledge rulebook | 0 |
| UR85 | A means can add a readout | Working default | MERGE | UR175 | none; rulebook rows only; UR175 states the same with a finding (PS332) | 0 |
| UR86 | Unchosen acts are marked | Working default | KEEP |  | Weibao quote 2026-11-10 "it should be noticible" | 0 |
| UR87 | Other lives one click away | Working default | RETIRE |  | none; owned by playability plan UT1/UT5 and TMR7/TMR17 | 0 |
| UR88 | Notices interrupt by stakes | Accepted direction | KEEP |  | Weibao accepted direction 2026-11-14; no detector. HIS CALL | 0 |
| UR89 | New surface kinds are open | Working default | KEEP |  | Weibao quote 2026-11-10 "not limited by what we have" | 0 |
| UR90 | Progression view draws real gates | Working default | KEEP |  | src/progression_gates.js is the owner; Weibao asked for trees; no check | 0 |
| UR91 | One event, several renderings | Working default | MERGE | UR38 | none; hypothetical finding; UR38 already says renderers decide nothing | 0 |
| UR92 | Every aspect keeps history | Working default | MERGE | UR79 | none; rulebook rows only; history is the UR79 timeline shape | 0 |
| UR93 | Form follows the mechanism | Working default | KEEP |  | Weibao quote 2026-11-10 ("sets of circles") | 0 |
| UR94 | Shared grammar, distinct composition | Working default | KEEP |  | Weibao reading 2026-11-10 ("every system is the same rows"); thin | 0 |
| UR95 | Surfaces react before and after commit | Working default | RETIRE |  | none; superseded by UIV4 (pre-commit effect) and UR38 (settle) | 0 |
| UR96 | Comprehensive by layers | Working default | MERGE | UR42 | none; restates UR42 and UR43 | 0 |
| UR97 | Pleasing is craft, checked | Working default | MERGE | UR176 | none; both are pre-report review steps | 0 |
| UR98 | Six levels | Working default | KEEP |  | lookup (c): level vocabulary cited by UR100, UR102, UR121, UR122, UR163, UR166 | 1 |
| UR99 | Cheap materials first | Working default | RETIRE |  | none; technique advice; "check in the app he plays" is already UR16 | 1 |
| UR100 | Every element has a state sheet | Working default | KEEP |  | finding: most 2026-10/11 audit defects were missing states; gallery shows fixtures, not a detector (absorbs UR101) | 0 |
| UR101 | Audit by element, then journey | Working default | MERGE | UR100 | none; method half of the state sheet rule | 0 |
| UR102 | Buttons and action rows | Working default | KEEP |  | lookup (c); tests/crafting_detail.test.js | 2 |
| UR103 | Names in text | Working default | KEEP |  | lookup (c) | 0 |
| UR104 | Selects and dropdowns | Working default | KEEP |  | lookup (c) | 0 |
| UR105 | Toggles and checkboxes | Working default | KEEP |  | lookup (c) | 0 |
| UR106 | Sliders and number entry | Working default | KEEP |  | lookup (c) | 0 (raw 2) |
| UR107 | Text fields and search | Working default | KEEP |  | lookup (c) | 2 |
| UR108 | Tabs and segmented controls | Working default | KEEP |  | lookup (c); tests/native_controls.test.js | 3 |
| UR109 | Disclosures | Working default | KEEP |  | lookup (c) | 1 |
| UR110 | Drag and drop | Working default | KEEP |  | lookup (c) | 0 |
| UR111 | Tooltips and hover previews | Working default | KEEP |  | lookup (c) | 0 |
| UR112 | Modals and confirms | Working default | KEEP |  | lookup (c) | 1 |
| UR113 | Popovers and menus | Working default | KEEP |  | lookup (c) | 0 |
| UR114 | Toasts | Working default | KEEP |  | lookup (c) | 0 |
| UR115 | Meters and bars | Working default | KEEP |  | lookup (c) | 2 |
| UR116 | Progress and timers | Working default | KEEP |  | lookup (c) | 1 |
| UR117 | Numbers and units | Working default | KEEP |  | lookup (c); tests/number_format.test.js | 4 |
| UR118 | Chips, badges, tags | Working default | KEEP |  | lookup (c) | 0 |
| UR119 | Lists and rows | Working default | KEEP |  | lookup (c) | 0 |
| UR120 | Tables | Working default | KEEP |  | lookup (c) | 0 |
| UR121 | Icons and glyphs | Working default | KEEP |  | lookup (c) | 2 |
| UR122 | Portraits and figures | Working default | KEEP |  | lookup (c) | 0 |
| UR123 | Logs and Reports lines | Working default | KEEP |  | lookup (c) | 0 |
| UR124 | Headers and back bars | Working default | KEEP |  | lookup (c); pure pointer to UR30, UR9, UR22 | 0 |
| UR125 | Empty, loading, error states | Working default | KEEP |  | lookup (c) | 0 |
| UR126 | Keyboard and focus | Working default | KEEP |  | lookup (c) | 0 |
| UR127 | Text inside elements | Working default | KEEP |  | lookup (c) | 0 |
| UR128 | Reason beside the control | Working default | KEEP |  | tests/crafting_detail.test.js (aria-describedby); UIC111 | 2 |
| UR129 | Decorators touch only their nodes | Working default | KEEP |  | tests/ui_components.test.js; finding: sweeper blanked craft reason, page hang | 2 |
| UR130 | Clickable is a button or link | Working default | KEEP |  | tests/ui_contract.test.js clickable-div; UIC115 | 5 |
| UR131 | Geometry from fractions and tokens | Working default | KEEP |  | tests/ui_contract.test.js pixel-geometry; UIC113 | 2 (raw 4) |
| UR132 | One Escape order | Working default | KEEP |  | finding: UIC107, UIC112; no test (shared Esc stack is LATER); checked against UR53, not a merge (adds the order) | 0 |
| UR133 | Block the whole page or nothing | Working default | KEEP |  | tests/ui_contract.test.js partial-inert (pattern is main_content only); UIC115 | 2 |
| UR134 | Facts reach the keyboard | Working default | KEEP |  | finding: UIC103 titles only; audit only | 0 |
| UR135 | Numbers through number_format.js | Working default | KEEP |  | tests/number_format_ratchet.test.js; row's "lint is LATER" is stale (ui_style_ratchet counts toFixed) | 2 |
| UR136 | Unknown is not zero | Working default | KEEP |  | tests/meter_bar.test.js; UIC114; checked against UR36, UR52, UR157, not a merge | 0 |
| UR137 | Tests find elements by hooks | Working default | KEEP |  | finding: three playtest scripts broke on "Equip"; review only | 0 |
| UR138 | Probe from the top | Working default | KEEP |  | finding: Tab walk started mid-page; audit method | 1 |
| UR139 | Every click answers on screen | Working default | KEEP |  | check:flow response (on request) | 2 |
| UR140 | One question, one answer | Working default | KEEP |  | finding: Worlds locked while Village offers Tingen; no detector despite check:flow header range | 1 |
| UR141 | A panel holds what its name says | Working default | KEEP |  | finding: Notebook mixing notes and task commands; no detector | 0 |
| UR142 | Mystery names, not bare placeholders | Working default | KEEP |  | check:flow placeholder (on request); Weibao quote 2026-11-10 | 3 |
| UR143 | List opens on a selection | Working default | MERGE | UR32 | none; finding: Journal blank half; no detector despite check:flow header range | 1 |
| UR144 | The frame holds still | Working default | KEEP |  | check:flow stability (on request) | 18 |
| UR145 | Region as big as content needs | Working default | KEEP |  | check:flow oversized (on request); finding: Reports using a fifth of its quarter (absorbs UR174) | 1 |
| UR146 | Nothing moves without a cause | Working default | KEEP |  | check:flow shift (idle) (on request) | 1 |
| UR147 | Say a thing once per view | Working default | KEEP |  | check:flow repeat; tests/nearby_context_view.test.js PX46; kept apart from UR168 (text level) | 6 |
| UR148 | An opened menu stays open | Working default | KEEP |  | PX48; comment in src/display.js; no standing test | 2 |
| UR149 | Compare where you choose | Working default | KEEP |  | tests/start_compare.test.js PX49 | 1 |
| UR150 | A sheet closes on outside press | Working default | KEEP |  | tests/native_controls.test.js PX50; checked against UR53, not a merge | 1 |
| UR151 | How a thing is shown can be earned | Working default | KEEP |  | Weibao quote 2026-11-10; no check | 2 |
| UR152 | A view eases in | Working default | KEEP |  | styles/ui_tokens.css center-mode-enter; Weibao quote 2026-11-10 | 2 |
| UR153 | Teach at a useful action | Working default | MERGE | UR159 | none; hypothetical finding | 0 |
| UR154 | Keep place through live changes | Working default | MERGE | UR52 | none; UR52 already bars stealing focus or replacing the inspected subject | 0 |
| UR155 | Progress view explains dependencies | Working default | MERGE | UR61 | none; meter and ETA clauses are UR61, gates clause is UR90 | 0 |
| UR156 | Show the active choice when folding | Working default | MERGE | UR26 | none; a folded group showing its value is a UR26 summary | 1 |
| UR157 | Unknown mark names the missing fact | Working default | KEEP |  | PX84 Mix trial; no check (two paragraphs below its table count here) | 1 |
| UR158 | One row per thing, actions on the row | Working default | MERGE | UR168 | check:flow dupway (UIC136) is built; row says "Not built", stale; finding: Village counter twice | 2 |
| UR159 | A cue marks its target | Working default | KEEP |  | finding: Reports line "In Around you ..."; observe in play (absorbs UR153) | 0 |
| UR160 | A condition says what eases it | Working default | KEEP |  | finding: cold shown four ways; observe in play | 0 |
| UR161 | Long time in human units | Working default | KEEP |  | check_player_text.mjs raw-duration ratchet; check:flow rawtime | 6 |
| UR162 | Top bar holds what is opened often | Proposal (held) | KEEP |  | finding: "All pane" cut-off; UIC137 not built. HELD FOR WEIBAO | 0 |
| UR163 | Features declare, kit draws | Working default | KEEP |  | tests/ui_style_ratchet.test.js ownMarkup (npm test) | 0 |
| UR164 | One small vocabulary, ratchet | Working default | MERGE | UR6 | tests/ui_style_ratchet.test.js (colour, px, border, toFixed); UR6 states the same rule | 0 |
| UR165 | Calm first | Working default | KEEP |  | PS247; no check ("coherence review" UR176 unbuilt) | 0 |
| UR166 | One form per meaning | Working default | KEEP |  | PS246, PS248, PS250, PS251, PS300; kit page is a gallery, not a detector (absorbs UR173) | 0 |
| UR167 | YAIR's form is default | Accepted direction | KEEP |  | check:flow twice; Weibao direction 2026-11-16; checked against UR45, not a merge | 0 |
| UR168 | Draw a thing once | Working default | KEEP |  | check:flow twice; PS296, PS301 (absorbs UR158 with dupway) | 0 |
| UR169 | Tested looks ship as choices | Accepted direction | KEEP |  | tests/look_presets.test.js; Weibao direction 2026-11-15 | 0 |
| UR170 | Looks change appearance only | Working default | KEEP |  | PS265, PS268, PS278; src/display_settings.js is an implementation, not a detector | 0 |
| UR171 | Test defaults, each choice alone | Proposal | MERGE | UR176 | none built; PS267, PS277; capture process like UR176 | 0 |
| UR172 | Compose neighbours by use | Working default | KEEP |  | check:flow stability, oversized (on request); PS325, PS331 | 0 |
| UR173 | Each mark keeps one meaning | Working default | MERGE | UR166 | none; PS327; same idea as UR166 (one form per meaning) | 0 |
| UR174 | Spare room gets a job | Working default | MERGE | UR145 | check:flow oversized covers the UR145 half; PS298, PS316-PS318 | 0 |
| UR175 | A power shows in the view it changes | Working default | KEEP |  | PS332; not built | 0 |
| UR176 | Review beside a neighbour, real font | Proposal | KEEP |  | PS285; not built (absorbs UR97, UR171) | 0 |

## Notes

1. Seven rows in the 83-99 band (UR83, UR84, UR85, UR87, UR92, UR95, UR99) rest on rulebook codes (TMR, KNW, CHT, STN) or on proposals Weibao opened, with no check and no playtest finding. The rulebooks own those requirements already. This is the weakest part of the list, and UR83, UR84 and UR87 are the RETIREs I am least sure of: other rules cite them (UR84 by UR92, UR107, UR136; UR87 by UR81).
2. Sections that cannot be checked: the 2026-10-15 to 10-26 navigation, parity and prose rules (UR34-UR64, UR70-UR75) have no detector and live on findings; the 2026-11-11 learning rules (UR153-UR156) have neither. Rules with a detector cluster in the token rules (UR65-UR68, UR130-UR133), the check:flow rows (UR139, UR142, UR144-UR147, UR161, UR168) and the kit ratchet (UR163).
3. Most detectors are check:flow, which runs on request and is outside `npm test`. Just ui_contract, ui_style_ratchet, number_format_ratchet and the named unit tests run on every test. The check:flow header lists "UR139-UR143" but has no detector for UR140, UR141 or UR143, and its `smalltarget` comment cites UR64 where UR66 is meant.
4. Stale "Check" claims to fix on the next edit: UR158 says `dupway` is not built, but it runs; UR135 says an inline `toFixed` lint is LATER, but ui_style_ratchet counts it; UR166 and UR170 name a kit page and a settings module, which are a gallery and an implementation, not detectors; UR98 is called six levels but UR166 cites "level 6" (levels run L0-L5).
5. Lookup rows (UR102-UR127) are kept whole by design, yet many restate another code with "Follow UR53" or "Standing rules, gathered here" (UR113, UR123, UR124). They are the best place to trim next if the element sheet needs to shrink, but that is a different question from keep versus retire.

Not done: this audit is not registered in `docs/gm/WRITEUP_REGISTER.md` because the task was read-only.

## Applied, 2026-11-19

Weibao: "Apply, keep UR83–87". Applied in docs/UI_RULES.md with each folded clause marked "was URnn" in its target and a pointer row left at the old code, so citations still resolve.

- Merged as proposed: UR77→UR3, UR78→UR2, UR81→RPT6, UR96→UR42, UR97→UR176, UR99→UR98 (its library and art clause kept, LLR32, LLR33), UR101→UR100, UR143→UR32, UR153→UR159, UR154→UR52, UR155→UR61, UR156→UR26, UR164→UR6, UR171→UR176, UR173→UR166, UR174→UR145.
- Reversed: UR168 folded into UR158, the older and broader rule; UR158's check now reads `dupway` and `twice`.
- Retired: UR95, covered by UIV4 and UR91.
- Kept on his word: UR83–UR87 (UR85's merge into UR175 is not applied).
- Kept by the coordinator, not duplicates: UR91 (one settled event drives log, effect, sound and recap; UR38 covers effects alone) and UR92 (every aspect keeps a history; UR79 is the shape rule).
- Not applied, his call: the merges of Accepted direction rules UR18, UR47, UR56, and UR88, UR162.
