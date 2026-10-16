# Next UI parts after R14, 2026-10-15

Proposal. Weibao asked to "take everything into consideration and write next parts". This orders the five
consideration rounds in [R14_FOLLOWUP_CONSIDERATIONS.md](R14_FOLLOWUP_CONSIDERATIONS.md) into dispatchable parts.
It does not dispatch them. Codes (F, A, C, K, D, S, E, G, P, X, V, B, M, Q, N) refer to that file.

**Part 9 focus, 2026-10-16:** Weibao clarified “No implement, but the improve and scope direction better”.
The [focused direction and showcase proposal](next-parts/part-9-direction.md) narrows the first slice
to one known inspect/travel/return journey, compares route-diagram, ink/Hanzi and list treatments,
and separates local scenes, lenses and atlases as expansions. This is planning only; the recommended
scope and visual default remain proposals. Earlier rounds below retain their dated history.
The same proposal now includes a concrete post-unlock Village/cave/mining storyboard (P9J),
expandable place relationships (P9W), book-source/branch/coverage distinctions (P9K), and
world-specific representation examples (P9X). This follow-up remains planning only.
The [room-to-world study](next-parts/part-9-room-to-world.md) adds a concrete HP journey,
proposed panel responsibilities and a bounded approach to planetary/beyond-planet scale;
it selects no UI redesign or simulation implementation.
The [complexity and openness pass](next-parts/part-9-complexity-and-openness.md) (P9Z) answers how
other games scale, the people ladder instead of implementing each NPC, impossible scopes with achievable
versions, proposed guardrails CX1–CX8 with a deferral register, openness, generation and the core kernel.
Proposals only.

**Start here, 2026-10-16:** the [Round 15 whole-plan pass](next-parts/round-15-whole-plan.md) is the
current schedule. Weibao: R14 is the best candidate so far and the work fine-tunes it. The Parts below stay
as design detail; delivery is a ranked queue of small native rounds R15+ on the R14 baseline (IT1–IT9),
with parallel workbench studies WB1–WB6, findings NX1–NX14 and a coverage check of his requests.
R15 restores the combat place tags (L2). The W6 acceptance gate is superseded by rolling review (IT2).

Authority: [UI_RULES](../../../UI_RULES.md) UR1–UR58, [intent register](PARITY_INTENT_2026-10-15.md) K1–K9,
[ranked plan](UI_NEXT_2026-10-15.md) P1–P14, and [USER_VISION](../../../USER_VISION.md) (2026-10-15 entries,
including "Combat readability, knowledge and panel anatomy"). Target for every part: desktop 1366×768 at 14 and
21px, plus 1920×1080 at 21px. Mobile is deferred.

## Reconciled with existing decisions

**Complexity clarification, 2026-10-16:** Weibao likes some complexity and asked how to retain depth while managing implementation difficulty. The [complexity review and continuation](next-parts/IMPLEMENTATION_COMPLEXITY_REVIEW_2026-10-16.md#continuation-preserve-depth-while-controlling-implementation-difficulty) propose proving one representative interaction across farming/building and existing owners, then extending from playable evidence. Earlier suggested deferrals are candidate scopes, not a ceiling on depth. Planning only; no crop, building or new delivery priority is selected.

Some round 1–5 proposals conflicted with standing decisions. These are the corrected forms; lanes use these.

| Proposal | Conflict | Corrected form |
| --- | --- | --- |
| N1 group top bar into menus | K1: direct paths remain the current default; newer instruction says grouping could be feasible if done well | Compare visible clusters, a grouped hub and a hybrid with frequent direct paths. Grouping is eligible for exploration; no menu taxonomy or extra-click default is accepted. See UX7–UX12 below |
| N2 hide empty routes | K1 already reveals by discovery | Keep discovery reveal. Discovered but empty routes get an empty-state line saying how to start them (F16) |
| M8 move hit counter and links to Settings | Newer instruction rejects attribution and historical retention as reasons for permanent footer space | Remove the counter from the proposed gameplay footer; put credits, upstream/support links and version in a clearly labelled About/Credits home. Preserve attribution and LICENSE. Save status and safe access matter more than retaining old chrome |
| G11 gear grid beside stats | P6: gear disclosure kept to protect You space (U9, UR34) | Gear becomes a You tab (YAIR `Stats / Equipment / Tools`), or sits beside stats only where measured space allows |
| E1–E2 estimates that can be wrong | K3: no invented rank or level | Weibao's newer instruction allows estimates that can be wrong. They come from real data (size, XP value, stats vs hero) and are always marked as estimates. No level unless the world has levels |
| B2 encounter cell | 2026-10-15 "size around actual opponents rather than fixed empty slots" | The odd cell carries real encounter facts (area progress, groups left, battle controls), never an empty slot |

## Parts in order

Order weighs how often a player meets it, impact and cost; presentation-only parts come before parts that change
saves. Part 0's placement comparison precedes Part 1; independent census work can proceed alongside preparation. No production source changes in Part 0.

| Part | Name | Codes | Changes save? |
| --- | --- | --- | --- |
| 0 | Control census and layout mockups | round 5 method, F16–F19 | No, research only |
| 1 | Panel control strip, piloted on Inventory | P2, K6, K7, F19 | No |
| 2 | Combat board and Reports readability | A1, A2, A5, B1–B3, C1–C3, C5, D1, F1–F8, G1–G2 | No, but touches combat log text |
| 3 | You panel: attributes, gear, effects | A7, A8, G11–G13, X1–X3, V17–V21 | No |
| 4 | Knowledge ladder and hover popups | E1–E7, K1–K5, P1–P2, D2, O4–O5 | **Yes** |
| 5 | Pursuits box, empty states, nav and bottom bar | Q1–Q3, N1–N2, M8–M9, K8 | No |
| 6 | Special monsters and enemy effects | S1–S5, X4, L1, L3 | Gameplay content |

### Part 0: control census and mockups

- **Outcome:** a table of every control in every panel and bar (owner, effect, observed or assumed use frequency, whether it changes state, canonical route, discovery/eligibility source, keyboard path), and three mockup sets (YAIR strip, Proto23 compact, hybrid) for the same states: 3 and 8 opponents, filtered inventory, busy Reports, a pinned pursuit. Each set sits beside upstream YAIR and Proto23 captures of the same states.
- **Use:** informs Part 1's strip anatomy and Part 5's placement before code. Static mockups cannot settle menu behavior. Add the three navigation candidates in UX7 as a small disposable click-through comparison using existing routes, without changing the production default. Inspect upstream reference bytes only for claims about that reference; additional game examples below illustrate principles, not matched runtime parity.
- **Executor:** medium model, medium effort. **Done:** census table, matched mockup PNGs and disposable route comparison with journey notes under `evidence/next-parts/`; no production source edits. Unknown frequencies stay labelled assumptions.

### Part 1: panel control strip, piloted on Inventory

- **Outcome:** Inventory separates content from its controls: compare a compact header strip against the proposed bottom strip. Keep category tabs near the list, search easy to find, sort/order explicit, and one coherent selected state. Categories use native semantics; overlapping categories are allowed if the source does so. Do not invent Favs. The final strip location follows measured tasks, not a universal bottom-placement rule. Search, count, new-item dots and selection survive; see UX13–UX14.
- **Shared piece:** use panel-kit controls and existing list tools; extract a shared strip only when Inventory and a second real consumer demonstrate compatible behavior.
- **Deferred:** other panels adopting the strip; Reports category tabs (K8) come in Part 2.
- **Executor:** strong model, high effort. **Done:** matched before/after at all three sizes; category counts agree with native inventory; tab choice stored as a display setting (no save change); R13/R14 regressions pass.

### Part 2: combat board and Reports readability

- **Outcome:** a player in a fight with 3 or 8 opponents can tell which wolf rat was hit, who is dead and whether a line is damage dealt or taken, without reading every word.
- **Board:** equal room for comparable opponents (B1), without forcing empty slots or a permanent spare cell. Compare count-aware layouts for 1 / 2–4 / 5–8; keep encounter facts with the fight, in a real spare cell only when available. At 9+ or large text, compare individually addressable compact rows before aggregate groups. Defeated opponents remain identifiable; letters are stable (A2, D1). See UX17.
- **Log:** duplicate opponents carry their letter in log lines (needs the letter assigned at encounter start and carried into combat messages: a small combat-text change in `main.js`, not a simulation change). Ally and hostile name tokens, dealt and taken value tokens, misses dimmed (C2, C3, G1). Consecutive identical lines collapse to `×N` (A5). Category tabs replace the hidden Filters menu (K8).
- **Palettes:** player custom palettes currently force all log tokens to one color; map the new role tokens into custom palettes too.
- **Deferred:** knowledge gating (Part 4), name effects (Part 6), hit splats (L3).
- **Executor:** strong model, high effort. **Done:** C5 fixtures (1, 3, 5, 8, 9 identical, 8 mixed) at all sizes; contrast check against actual backgrounds (4.5:1 normal text, 3:1 where appropriate for large text and essential UI), plus labels/shape cues distinguishing roles; no RNG or combat outcome change versus baseline on a seeded run.

### Part 3: You panel

- **Outcome:** You shows a standard attribute set in a two-column block about 55–60% wide, with a set picker (Standard / Combat / Crafting / All) in the panel strip; Equipment as a named-slot grid from the native equipment frame (empty slots faint, locked slots explained); status effects as chips with native known stacks and a draining underline only for a known duration; static indication otherwise.
- **Details:** tabular numerals and one number format (V18), derived-stat hover breakdowns (V19), bar text on a solid backing (V21). You and the single-opponent card reuse semantic primitives without forcing identical detail for unequal knowledge (V17).
- **Keep:** U9 secondary stats in You with measured fitting; the full Attributes reference.
- **Deferred:** stat identity colors (L1), player title popups (Part 4).
- **Executor:** strong model, high effort. **Done:** fixtures with 0, 2 and 5 active effects, an empty and a locked slot, a nonhuman body plan; all sizes; attribute set choice persists as a display setting.

### Part 4: knowledge ladder and hover popups

- **Outcome:** a new opponent shows impressions and `???`; fighting it turns those into observed ranges; study, skills or a status world turn them exact. Hover on any opponent name, title or trait opens one popup that shows what you know, `???` for the rest and how you learned it.
- **State:** one fact projection with a knowledge state per fact (`impression | estimate | observed | known`). Observations stored per species and character, which needs a save migration. Estimates seeded so they do not flicker.
- **Verification:** a dev-only true-vs-known inspector; fixtures at 0, 1 and 10+ kills; save, reload, export and import.
- **Executor:** strongest model, high effort. **Done:** ladder visible on card, hover, log subject and Bestiary; migration test from a pre-part save; no sealed secret visible in any popup.

### Part 5: pursuits, empty states, nav and bottom bar

- **Outcome:** a small Pursuits box shows one to three pinned long-term items from supported existing owners (quests, projects, ledger, pinned recipes), each linking home. It is a summary of those owners, not a new quest system. Discovered but empty routes explain how to start them. Navigation follows the selected UX7 comparison candidate; direct paths remain the default until a replacement is accepted. The proposed footer shows truthful save state, a clear Save command, access to Export/Import, Settings and Help. About/Credits holds attribution, upstream/support links and version. The hit counter earns no permanent gameplay space; no retained counter is required.
- **Placement:** chosen from Part 0 mockups; never inside the log column (UR11).
- **Executor:** strong model, medium effort. **Done:** populated and fresh saves at all sizes; same destinations and hotkeys, measured click paths per UX12, native Import/Export and save-failure feedback checked. Move controls through their existing owners, not copied handlers. Pinned pursuit IDs persist as display settings if that is compatible with their existing owners; reconcile them on reload, import, character/world change and reset. Missing or unknown targets reveal no secrets. Credits and source/support destinations remain reachable and clearly identify their recipient. Final navigation default and visual acceptance remain Weibao's gate.

### Part 6: special monsters and enemy effects

- **Outcome:** a special opponent's name has a perceived effect (glow, smolder) driven by enemy tags, explained through the Part 4 popup once known; enemies can carry status effects shown with the same chips as You.
- **Needs:** gameplay content (tags, effects on enemies), so it follows Part 4 and a content decision.
- **Executor:** strong model, medium effort. **Done:** reduced motion on and off; name contrast unchanged; one log line on first sighting.

## Cross-cutting constraints

- **One writer per file.** Parts 1–3 all touch shared styles. Each part owns a new stylesheet (precedent: `styles/crafting_detail.css`) and edits `ui_tokens.css` only to add tokens. Run them one at a time or split owned files explicitly.
- **Shared branch.** Other sessions commit to `codex/gameplay-foundations`. Use a private index on fresh HEAD and stage only the part's paths.
- **Review backlog.** R11–R14 are still awaiting Weibao's visual acceptance. Stacking more candidates makes review harder: each part ships a frozen candidate and a short "what to look at" list.
- **Fixtures.** Extend the existing sweep and fixture libraries (C5, effects, kills, nonhuman body) instead of new harnesses.
- **Palettes and motion.** Every new color is a token with custom-palette and reduced-motion behavior.

## More to consider

| Code | Consideration | Disposition |
| --- | --- | --- |
| R1 | Letters in log lines (Part 2) are the first time combat text depends on a UI label. If letters are assigned in the UI only, old log lines lose them on reload. Assign them in the encounter and store them with the message. | ACCOUNT FOR NOW in Part 2 |
| R2 | At 21px text, eight equal compact cells may not fit the Focus region. The fallback is group rows (L4), not shrinking text (UR46). | ACCOUNT FOR NOW in Part 2 |
| R3 | Reuse existing panel-kit/list/preview primitives with one owner; extract new shared behavior only when concrete consumers demonstrate it. No universal strip or second popup owner. | ACCOUNT FOR NOW |
| R4 | Knowledge state also affects Bestiary, crafting ingredient names and people. One projection pattern across them avoids three rules for "what do I know". | LATER, after Part 4 proves it on opponents |
| R5 | Pursuits overlaps the Factorio reminder idea (U5) and notices (UR29). Pick one owner for "pinned". | ACCOUNT FOR NOW in Part 5 |
| R6 | Equal cells and Pursuits both compete for the Focus region when idle versus fighting. Part 0 mockups should show both states in the same frame. | ACCOUNT FOR NOW in Part 0 |


## Refinement: grouping, chrome and the complete journey, 2026-10-15

**Authority update.** Weibao said grouping could be feasible if done well and rejected
keeping the hit counter/links merely because they credit upstream or an earlier round
retained them. Credits may live elsewhere. This supersedes the earlier reconciliation
rows, not the original one-click preference wholesale. The proposed footer placement
is corrected now; implementation and a final grouped navigation default are not dispatched.
Reusable defaults live in [UI_RULES UR50–UR58](../../../UI_RULES.md#grouping-and-whole-journey-review-2026-10-15).

### What established games actually contribute

These are bounded primary-source examples, checked 2026-10-15, not a claim to rank
all games or evidence that their exact layout fits YAIR. Recommendations below are
our inference and still need a playable comparison.

| Reference | Verified behavior | Transfer to YAIR | Limit |
| --- | --- | --- | --- |
| [Factorio: Factoriopedia](https://www.factorio.com/blog/post/fff-397) | Links related entries, supports contextual Alt-click and navigation history | Let a subject open its record and return to the interrupted task | YAIR must project only discovered information |
| [Factorio: search and pins](https://www.factorio.com/blog/post/fff-400) | Search complements windows; pins preserve a chosen destination; alerts link to locations | Use existing source links and pins to support multi-step goals | No new map, search engine or pursuit scheduler is implied |
| [FFXIV: game screen manual](https://na.finalfantasyxiv.com/game_manual/view/) | Categorized main menu coexists with hotbar shortcuts and adjustable HUD elements | Grouped browsing and fast paths can coexist | MMO action frequency and screen density do not determine YAIR categories |
| [Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/full-list/) | Stationary targets, clear interactive elements, text size and alternatives to color are recommended | Evaluate grouping with keyboard, text scaling and semantic states | Guidelines do not choose the visual composition |

Existing Proto23/YAIR captures remain the visual reference. Melvor's bank-sidebar
search result suggested another relevant comparison, but its page returned 403;
no recommendation here depends on that unverified example.

### Navigation candidates and decision method

| Code | Candidate or constraint | Consequence / disposition |
| --- | --- | --- |
| UX7 | Compare **A: visible destination clusters**, **B: labelled category hub with local peer tabs**, **C: hybrid frequent direct routes plus a grouped directory**. Use identical known destinations and content | ACCOUNT FOR NOW, Part 0. Recommend C as the first experiment, with A as the direct-access baseline. B must demonstrate a benefit; fewer visible controls alone does not win |
| UX8 | Group by the player's question: “my character”, “what I know”, “people”, “current work”, “this world”. Treat these as candidate labels. Inventory/Crafting and People/quests cross category boundaries | Give each destination one canonical home and contextual links from real consumers. Do not duplicate panels or force the source module tree onto players |
| UX9 | Distinguish global destination, peer tab, inspection, command and preference. A category hub opens browsing; it must not silently execute its last-used child | Tabs and Back follow UR41–UR43. A menu trigger and direct action need distinct hit areas and labels; hover is optional |
| UX10 | Frequent routes depend on actual use. For the comparison, assume Here, Inventory and current work are frequent; identify this as a hypothesis | Keep stable defaults; no automatic frequency ranking or surprise rearrangement. Manual shortcut customization is LATER if demonstrated need remains |
| UX11 | New discoveries, completed quests and route eligibility can change while a menu is open | Reserve stable order, preserve focus and pointer targets, explain known-disabled routes, and show a restrained arrival cue. Unknown routes leak no names, counts or badges |
| UX12 | Judge tasks: find a known record as a newcomer; switch Inventory↔Crafting repeatedly; inspect a person then return to work; follow a pursuit then Back; resume after reload | Record first choice, wrong turns, clicks, keyboard steps, visible content/row loss and restored state at 1366×768 14/21px and 1920×1080 21px. Static geometry cannot establish findability; an agent walkthrough is provisional, human judgment remains open. If an extra-click route replaces direct access, name that tradeoff for approval |

Do not force one category row to wrap indefinitely. Test the full discovered route
set, long labels and an open menu at the laptop target. Prefer a coherent labelled
directory over clipping, smaller text or a hidden chain of “More”. The directory
is a browse surface with its own count/search only if the existing tools support it;
quick jump is an additional fast path, never the sole route for a newcomer.

### Details the parts must account for

| Code | Detail and player-visible consequence | Disposition |
| --- | --- | --- |
| UX13 | **Filters are not discovery.** A known category becoming empty must not shift neighbouring tabs under the pointer. Distinguish no possessions, empty category, search with no matches, unknown and unavailable. Counts must say whether they represent stacks or units and whether search applies; category counts may overlap | ACCOUNT FOR NOW, Part 1. Stable known tabs, an explicit clear-filter path, no speculative category semantics |
| UX14 | **Selection survives refresh.** Sorting, loot arrival, crafting consumption and category changes must not silently select a different item. If the selected row leaves the result, show a clear filtered/unavailable state with a return or clear path | ACCOUNT FOR NOW, Part 1. Use stable item identity, not row index; selecting and filtering never consume or equip |
| UX15 | **Menus have a lifecycle.** Pointer and keyboard can open/choose/dismiss; Esc closes the top transient surface first, then inspection, then uses the applicable Back. Return focus to the opener. Clicking outside never executes the control underneath. Simulation policy stays with the game | ACCOUNT FOR NOW, Parts 0/5; menus cannot require hover travel or close on each tick. Avoid replacing focused DOM during refresh |
| UX16 | **Footer safety and space.** Save is a clear command, Export is a backup, Import replaces loaded state through its existing warning/recovery flow. Keep status outside a closed menu. “Saved” follows actual success; failed storage/export is not success. Do not add a perpetual timer or pending-write model just to fill the bar | ACCOUNT FOR NOW, Part 5. Check full labels, open-menu collision, file-picker cancel and storage failure. No independent pause/autosave policy change |
| UX17 | **Grouping opponents must preserve decisions.** Same species does not imply same health, effects, identity or knowledge. An aggregate must still expose every actual opponent and selected subject, with stable log IDs through death and wave changes | ACCOUNT FOR NOW, Part 2. Rows first when cards fail fit; aggregate presentation is LATER unless it preserves these facts. No inferred shared intent or stats |
| UX18 | **Logs compress occurrences, not history.** Collapse only equivalent adjacent events with matching subject, direction, amount and outcome; do not merge defeat/unlock/status transitions or events from different opponents | ACCOUNT FOR NOW, Part 2. Preserve underlying events and access to occurrence/time details; follow, paused reading and filters must retain their meanings |
| UX19 | **Knowledge is not a kill counter.** One kill does not reveal every variant's truth; an estimate may be wrong, known facts may change, and uncertainty must be readable without weight/color alone | ACCOUNT FOR NOW, Part 4. Use authoritative observation provenance; 0/1/10 kills are fixtures, not universal unlock thresholds. Unknown facts stay unknown in search, badges, accessibility labels and historical previews |
| UX20 | **Pursuits are personal reminders.** Do not auto-pin every unlock, treat pinning as accepting a quest, or erase a reminder just because it is temporarily unavailable. Show relevant known progress and link to the owner; completion is read from that owner | ACCOUNT FOR NOW, Part 5. Resolve a completed, missing, changed-world or imported target deliberately; no task completion inferred from display state |
| UX21 | **Effects and numerals should inform.** A draining underline suggests a known duration; if duration is unknown, use a static effect indication. Standard/All stat sets and equipment affordances must name their scope. Nonhuman slots come from the actual body model | ACCOUNT FOR NOW, Parts 3/6. Explicit uncertainty, no misleading countdown, no flashing for routine changes, reduced motion/static form |
| UX22 | **Use space without churn.** Idle/fighting/working layouts can emphasize different facts while preserving homes, controls and inspection. Opening a menu, an extra opponent or a changed number must not shift a pending click or steal focus | ACCOUNT FOR NOW across selected parts. Compare an interaction journey with live ticks, not only frozen ideal screenshots |

### Corrections to the plan's own overreach

- **UX23, ACT NOW:** replace attribution-based footer retention and the blanket rejection
  of grouped navigation with the authority update above. Preserve the earlier decisions
  below as dated history; do not reinterpret an old report as current user direction.
- **UX24, ACCOUNT FOR NOW:** Part 1 does not establish a universal bottom-strip component
  until a second real consumer fits it. Reuse panel-kit primitives now; extract shared
  behavior when Inventory and Reports demonstrate it. Part 3 may share semantic
  components with opponents without forcing an identical anatomy for unequal known facts.
- **UX25, ACCOUNT FOR NOW:** equal opponent room does not require a large one-enemy
  card or a fake spare cell. Color roles need readable text and non-color cues; the
  old 1.5:1 role-pair metric alone proves neither distinguishability nor usability.
  Apply 4.5:1 to normal text and 3:1 where appropriate for large text/essential UI;
  test actual backgrounds and user palettes. These are design checks, not a claim of
  full accessibility conformance.
- **UX26, LATER:** optional editable shortcut sets, deeper search and additional pursuit
  integrations only after the selected navigation demonstrates an unmet need. No new
  universal navigation framework, content system or broad harness rewrite is authorized.

## Superseded reconciliation, preserved 2026-10-15

Earlier N1 corrected form: “Cluster visually with separators and labels; every destination
stays one click. Journal siblings stay separate buttons”. Newer direction permits a
comparison of stronger grouping; it does not accept a particular grouped default.

Earlier M8 corrected form: “Condense only Save/Export/Import and Layout/Density/Authoring
into two menus. Counter, links and version stay”. Earlier Part 5 kept the counter,
links and version in the footer. Weibao rejected that retention rationale; current
Part 5 places credits elsewhere and removes the counter from the proposed gameplay bar.

**This pass's done check:** current direction reconciled; options and tradeoffs source-linked;
constraints attached to existing parts; reusable rules saved. No UI source, build,
player save, default layout, commit or dispatch is changed by this document refinement.
Playable comparison and human acceptance remain open.

## Round 7: job split, interpretation and subtle details, 2026-10-15

Weibao asked whether interpretations and subtle features should go out as separate jobs.
Recommendation (proposal): **one separate read-only job now, no separate implementation job.**
Subtle details stay inside the part that owns their files; interpretation work runs ahead of code.

### Findings

| Code | Evidence | Disposition |
| --- | --- | --- |
| W1 | Reconciliation row E1–E2 says estimates "come from real data (size, XP value, stats vs hero)". R14 round 5 constraints say E1/E2 cannot use hidden `xp_value` or true combat stats as observations; a threat impression needs an observer-visible input, otherwise unknown | **ACT NOW**, corrected below. Part 4 follows the round 5 constraint |
| W2 | Part 3 done check requires "a locked slot" fixture. F18 says show a locked slot or reason only if native body/equipment rules supply one | **ACT NOW**, corrected below. Fixture uses a locked slot only where native rules have one; otherwise empty + unavailable |
| W3 | R1 says letters assigned only in UI "lose them on reload". The save stores message filters (`src/main.js` ~6920), not log entries, so the log does not survive reload | **ACCOUNT FOR NOW.** Still assign the letter at encounter start and carry it on the event (UR48, stable through death and waves). Part 2 stays "no save change". If log history is ever persisted, that owner adds the field |
| W4 | R14 "ACCOUNT FOR NOW": any opponent-card work builds one fact projection with a per-fact knowledge state, even if every fact starts `known`. Part 2 changes opponent cards but its outcome does not mention the projection | **ACCOUNT FOR NOW**, Part 2. Cards read through the projection shape (all `known`), so Part 4 changes data, not card markup |
| W5 | F16 symbol findings (repeated `check_box_outline_blank`, `♨` at any temperature, Google Fonts Material Icons dependency) belong to no part | **ACCOUNT FOR NOW**, Part 0 census includes visible symbols and their meaning. Replacement stays LATER |
| W6 | R11–R14 candidates still await Weibao's visual acceptance | **ACCOUNT FOR NOW.** Only research and fixture work runs before that review. Part 1 waits for at least R13/R14 acceptance or an explicit go |

### Why not a separate subtle-features job

UX13–UX22 and V17–V21 change the same DOM, styles and handlers as Parts 1–5. A separate writer
breaks one-writer-per-file, and a "subtle pass" after the fact reworks markup that just shipped.
Each part's brief carries its UX/V codes as done checks instead.

### Proposed lane I1: interpretation, census and fixture prep (read-only)

Extends Part 0. No production source edits; can run while Weibao reviews R11–R14.

1. **Control and symbol census** as Part 0 describes, plus visible symbols (W5).
2. **Reference interpretation ledger.** For each claim this plan attributes to upstream YAIR or Proto23
   (strip location, category tabs, equipment slots, log rhythm, menu grouping), record shown / stated /
   inferred with the capture or source line. Claims with no evidence get relabelled as our proposal.
3. **Subtle-detail fixture matrix.** Turn UX13–UX22 and V17–V21 into concrete states per part (empty
   category vs no match vs unknown, selected row filtered out, 9 identical opponents at 21px, effect with
   unknown duration, nonhuman body slots, open menu during a tick). Name which existing fixture library
   covers each and which states native data cannot produce yet.
4. **Mockups and UX7 click-through** as Part 0 describes.

- **Executor:** medium model, medium effort; strong model only for step 2 if references need decompiled source.
- **Done:** census, ledger and fixture matrix under `evidence/next-parts/`, mockup PNGs beside matched
  references, journey notes per UX12. Unknown frequencies and unverified reference claims stay labelled.

### LATER / DELEGATE

- **I2, Part 4 design spike** (strong model, high effort, doc only): observation provenance, what the
  character can legitimately perceive per fact, save migration shape and sealed-secret leaks. Run after
  I1 or with it; it changes the only save-touching part, so a written design before code is cheaper.
  Check for an existing Bestiary or knowledge owner first (R4).

### Corrected rows

- Reconciliation E1–E2 corrected form now reads: estimates come only from observer-visible inputs
  (seen size, witnessed attacks, a skill or world rule that grants perception) and are always marked
  as estimates. Hidden `xp_value` and true stats are not inputs. No level unless the world has levels.
- Part 3 done check now reads: an empty slot, and a locked slot only where native body/equipment rules
  define one.

Earlier wording above is preserved as history; these corrected rows supersede it.

### Dispatch, 2026-10-15 23:51

Weibao: "send out executors with codex stuff, we should plan accordingly and use the questions
workflow properly to settle things? We can just improve the plan thus far." Four docs-only Codex
lanes (census, interpret, fixtures, knowledge; I2 folded in as `knowledge`) per
[next-parts/COMMON.md](next-parts/COMMON.md) and [sessions](next-parts/runs/SESSIONS.md). Each returns
proposed edits plus triaged questions (max 3). No source, build or commit. Fold-in and one-at-a-time
questions follow their return.

## Round 8: fight location, inventory look, procedural content and system slots, 2026-10-15

Weibao (with a native YAIR combat screenshot): "in ui, consider discriptor for location of where
fighting enemy and mroe? ... make our inventory look better? consider future procedural systems and
more? What about UI for stuff like my other stuff and more? Modular system to add pop ups/spot for
cheats and more?" D2 (hybrid navigation) is UX7; F1 (subtle cases) is UX13–UX22 and the `fixtures`
lane matrix. Neither needs new work.

### Findings

| Code | Evidence | Disposition |
| --- | --- | --- |
| L1 | Native combat header shows location name, type tags (`open`) and a hover tooltip with the type description and effect (`EP x0.75`). Types are data: `src/data/locations.js:116` `LocationType` with stages; stage 2 has a different description and a stronger effect, linked to the related skill `Spatial awareness`. `update_displayed_combat_location` (`src/display.js:2966`) fills `location_types_div` and `location_tooltip` | **shown/stated.** The fight descriptor is native content, not a new feature |
| L2 | Our shell hides `#location_description_div` under parity r3 and in proto23 detail modes (`styles/ui_tokens.css:391,527,725`). Whether the type tags and their tooltip stay visible and reachable in the R14 candidate during combat is **unverified** | **ACCOUNT FOR NOW, Part 2.** The fight keeps a descriptor: place name, type tags with stage description, effects on you and related skill, plus clears and groups left (B2's real encounter facts). Keyboard and hover reach it. Verify on the rebuilt candidate before claiming it |
| L3 | The type stages are already a native knowledge ladder: understanding a place deepens with a skill | **ACCOUNT FOR NOW, Part 4.** Place facts use the same fact projection as opponents (R4 widens to places). Native shown text stays shown; the ladder adds, never hides what YAIR shows |
| L4 | Census CN44/CN80: Favorites is a **native** inventory category and star toggle (`src/proto23_shell.js:204`, `src/display.js:2182`) | **ACT NOW**, correction: Part 1 "Do not invent Favs" means do not invent categories; native Favorites stays |
| L5 | Inventory "look better" is more than the control strip. Row anatomy (name, quality/rarity cue, count, value, weight or slot) with aligned gutters and tabular numerals; detail with comparison to equipped; text-first, no icon art system (F16) | **ACCOUNT FOR NOW, Part 1** widens from "controls" to "controls + row and detail anatomy". Frozen before/after against Proto23 and native YAIR inventory captures |
| L6 | Future procedural and made items: generated names of any length, variable affixes or qualities, unknown properties, crafted variants from `src/craft_product_registry.js`, hundreds of stacks | **ACCOUNT FOR NOW, Parts 1/3/4.** Rows render from a projection, never fixed columns per item kind: long names truncate with the full name on hover and in detail; affixes live in detail, not the row; unknown properties show `???` through the Part 4 ladder; stress fixtures use the longest name, most affixes and 500 rows. Same rule for generated places (L1 tags come from data) and world stat sets (Part 3 picker reads the world's set) |
| L7 | Cheat cards already declare a placement: `src/cheat_cards.js:3` `PANELS` (`status-window`, `death-menu`, `anchor-list`, `system-shop`, `companion-voice`, `simulator`, `simulator-foresight`, `appraisal-lens`, `harvest-ledger`, `harvest-multiplier-ledger`, `cheat-library`, `cheat-settings`, `quiet`). It is a data contract only: no card or renderer uses it yet | **ACCOUNT FOR NOW.** This is the modular seam to build on, not a new one. Each panel key maps to a UI_RULES surface type and home (popup, inspection section, notice, center view, log voice line, none). The shell owns a small set of host slots; cheats and other systems contribute content through projections, never their own DOM placement |
| L8 | Other systems (companions, household, ledger, worlds, making crafts, anchors) need homes as they are discovered. UX8's player-question groups can be data-driven: a discovered system registers its canonical home and group, so new systems don't add top-bar buttons | **ACCOUNT FOR NOW, Parts 0/5.** UX7 comparison includes a "many discovered systems" state (15+ routes). Unknown systems leak nothing (UX11) |
| L9 | Appraisal-lens type cheats raise knowledge state; a status window is a structured fact popup | **ACCOUNT FOR NOW, Part 4.** The single hover popup accepts contributed sections from knowledge sources (study, skill, cheat, world rule), labelled by source. No second popup owner |

### LATER / DELEGATE

- **SL1, surfaces lane (docs only, dispatched below):** slot map for cheat `PANELS` and other systems,
  inventory row/detail anatomy with procedural stress cases, and L2 verification from candidate
  captures and CSS. Write scope `next-parts/surfaces.md`. Cheat access design stays with its own chat
  record (`docs/gm/CHEAT_ACCESS_DESIGN_DISCUSSION_2026-10-15.md`); this lane reads it only.
- **SL2:** per-world UI skins as token sets (THEMATIC_UI doc), after Parts 1–3 settle tokens.

## Round 9: visual consistency, cheat style and every activity, 2026-10-16

Weibao: "visual consistency and stuff and more? How to make it fit? or at least, give cheat distinct
style like manhuas and more? it doesnt even neet to fit existing style, just look self contained and
interact properly? ... both on future needed stuff, and current features and more? What about mining,
farming, every little thing and more?"

### Findings

| Code | Evidence | Disposition |
| --- | --- | --- |
| VC1 | Consistency already has owners: UR6 tokens only, UR7 shared components, UR12 Proto23 baseline; the thematic layer stack L1 scheme to L7 player appearance (`docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md` "Layers") composes token sets on root attributes | **ACCOUNT FOR NOW.** "Fit" means one structure (frames, rows, gutters, focus, Back, Esc) with style supplied by token sets. Parts 1–3 add tokens, not local styles |
| VC2 | Current consistency debt, from census and earlier rounds: placeholder glyphs (F16), mixed number formats (V18), several row anatomies across You, cards, inventory and menus (F20) | **ACCOUNT FOR NOW.** Each part fixes the rows it touches; a later finish slice catches the rest (R14 F20 LATER) |
| CS1 | Weibao permits cheat surfaces that ignore the base style ("just look self contained and interact properly"). System-window manhua look: translucent blue panel, bracketed titles `【 】`, glow edge, typewriter reveal, chime | **Proposal.** Add a **foreign layer** to the stack: a scoped token set (own font, colors, border, glow, reveal) applied inside a cheat's host slot (L7 `PANELS`). It is self-contained by being scoped, so UR6 still holds: no raw styles, just a separate token family. Each cheat family can pick a foreign style (system window, jade slip, ghostly voice, terminal), as data on the card |
| CS2 | "Interact properly" is the hard part | **ACCOUNT FOR NOW.** Foreign surfaces keep the base behavior contract: open and close through the shared controller or popup owner, Esc and focus return (UX15), keyboard reach, 4.5:1 text contrast on their own background, reduced-motion static form (no typewriter, no glow pulse), never cover the log column (UR11) or a pending click (UX22), and player Appearance (L7) can tone them down. Announcements also go to the log as plain text so history stays readable |
| CS3 | A distinct style is also information: the player learns "this came from my cheat, not the world" | **ACCOUNT FOR NOW, Part 4.** Popup sections contributed by a cheat (L9) carry the foreign style in that section only; world facts keep the base style. Sealed cheats show nothing until discovered |
| AC1 | Activities are native data: `LocationActivity` / `LocationGatheringActivity` (`src/models/location.js:533`), with mining, mining2, weightlifting and balancing unlocked through locations (`src/data/locations.js:585,646`); `src/activities.js` and many content modules add more | **stated.** "Every little thing" already has one model, so one UI anatomy fits all |
| AC2 | R12 recipe clarity (have/need, attempts, known effects, related uses) is the proven anatomy for one kind of work | **ACCOUNT FOR NOW.** One **activity card** for gathering, training, jobs and later farming: what it is, time per period, needs (tool, stamina, skill), gains (items, XP, money) with known ranges, chances through the Part 4 ladder, what is still `???`, and where the output goes. Same card in center view, pursuits and hover. Mining and foraging get it first because they exist now |
| AC3 | Farming and other long-running work (plots, growth stages, seasons, weather, animals, property) is persistent world state, not a timed action. Ideas exist (`docs/LIFE_SIM_NORTH_STAR.md` MG01–MG10, IDEA_INDEX I24); no runtime farming in the base game | **LATER**, with its gameplay owner. UI constraint now: such systems get a place-bound "site" surface (grid or list of plots with stage and next change), pinnable to Pursuits (Part 5), with changes reported in the log. The site anatomy is shared by farm, workshop, household and any managed place |
| AC4 | Activities differ by world (cultivation retreats, crafting worlds) and by body | **ACCOUNT FOR NOW.** Card fields come from data; worlds add fields through the same projection (L6), not new card types |

### LATER / DELEGATE

- **AV1, activities lane (docs only):** inventory of every current activity and work UI (gathering,
  training, jobs, sleeping, reading, crafting, village work) with its owner, what the player sees and
  what is missing against AC2. Propose the activity card and the AC3 site surface with stress cases.
- **CS4, cheat style addendum to `surfaces`:** after that lane returns, resume it to add foreign-layer
  tokens, two or three style examples as static mockups, and the CS2 behavior checklist.

## Round 10: lane returns folded, current Part briefs, 2026-10-16

Six docs-only lanes returned ([sessions](next-parts/runs/SESSIONS.md)): [census](next-parts/census.md),
[interpret](next-parts/interpret.md), [fixtures](next-parts/fixtures.md), [knowledge](next-parts/knowledge.md),
[surfaces](next-parts/surfaces.md), [activities](next-parts/activities.md). Their proposed replacements are
adopted below as **the current Part briefs**. Earlier Part text, reconciliation rows and Rounds 7–9 rows
remain as dated history; where they conflict, this section wins. Every item is still a proposal until
Weibao plays it. Lane codes point to the detail.

### Questions workflow result

Triage across lanes: 99 points classified (census 16, interpret 17, fixtures 12, knowledge 20, surfaces 21, activities 13); 98 settled without asking (already answered, derivation,
reversible choice, or bounded evidence done or named). **One consequential preference: KL24**
(first-sight opponent numbers), asked separately. Part 4's default waits on it; nothing else does.

### Corrections to my earlier rounds

| Code | Was | Now |
| --- | --- | --- |
| L1 | Tooltip shows related skill | Native tooltip shows stage description and effective (and base, when mitigated) penalty, `src/display.js:3019`. Related skill is in data and the penalty calculation, not printed (SF223, SF244) |
| L2 | Candidate visibility unverified | **Defect found (shown + stated):** R14 combat at all three targets shows place name and counters but no type tags or prose; `styles/ui_tokens.css:986` hides the whole native location module, and the replacement header omits tags. Tooltips are hover-only, no keyboard route (SF220–SF225, SF245) |
| L3 | Type stages are a native knowledge ladder | Wrong. Stage is the place's authored severity; the skill changes mitigation. Not a per-observer ladder (SF246) |
| L4 | — | Confirmed: Favorites is native; keep it (CN342, IL54) |
| L7 | `PANELS` unused | `status-window` already has a card, lookup, awakening and renderer; the other 12 keys have no host yet (SF248) |
| W1/W2 | Distant correction rows | Applied at point of use in the briefs below (IL51, IL56, IL59) |
| R14 refs | Several reference claims | DQ/FF suffixes, StS intent, splats, rarity tiers and color schemes are unverified recalls; Proto23's rank placeholder is a raw lookup, not learned knowledge; Proto23 is single-opponent in inspected source. Treat as our proposals (IL58) |

### Part 0: census, fixtures and mockups

- **Done already (docs):** source census CN1–CN346 including symbols; fixture catalog FX00–FX34;
  reference ledger IL; slot map SF120–SF167; activity inventory AV.
- **Remaining:** mockup sets (YAIR bottom strip, Proto23 top categories, hybrid) for the same fixtures
  with provenance captions; no matched 3/8-opponent Proto23 capture is claimed (IL53). UX7 click-through
  with a 15+ discovered-system state (SF249) and activity idle/working states (AVE9). Count global,
  local, More and Expand routes separately; test look-alikes such as overview Back vs center Back vs
  travel, game Settings vs appearance authoring, Pursuit vs reminder pin (CN341).
- **Done check:** UX12 journeys at all three targets; frequencies stay assumptions until journeys
  measure them (CN346).

### Part 1: Inventory controls, rows and item detail

- **Outcome (SF241, CN342, IL54):** controls separate from content; compare header vs bottom tools.
  Native categories including Favorites; stable known tabs; search, count scope, explicit sort. Rows:
  projected name, aligned quantity/value, native quality and slot/type where they exist (no invented
  rarity or weight). Long names truncate with a full focus/detail path; affixes and parts go in ordered
  detail sections. Detail keeps description, known effects and native equipped comparison; nothing
  equips or uses silently. Exact item-key selection survives updates.
- **Done (FX35 + SF242):** FX01–FX06 states; long-name, partial-knowledge, duplicate-name/different-key,
  multi-section and synthetic 500-row cases; native YAIR and Proto23 comparison with evidence limits;
  display preference reloads with no save change; R13/R14 routes rerun. Starts after W6 (R11–R14
  acceptance or an explicit go).

### Part 2: combat board, fight descriptor and Reports

- **Board:** as before (UX17, B1, count-aware layouts). Cards and logs read through the knowledge
  projection with current facts marked known (KL18, W4).
- **Descriptor (new, SF243/SF230), fixes the L2 defect:** one place header below the board: place name
  as an inspection trigger, native type tags with stage label, each focusable; inspection shows full
  description, effective effect on you (base when different) and related skill only where known.
  Date, season, weather, temperature stay grouped there and wrap at 21px. Clears and groups left stay
  with encounter facts. Reachable while inspecting items or center views.
- **Log (IL55, KL19, CN343):** stable per-encounter labels carried on events (not persisted, IL60);
  dealt/taken tokens, quieter misses, UX18 collapse only. Keep filters, follow, unread, Stop/Resume and
  Clear with their exact scopes.
- **Done (FX36 + SF230 check):** FX07–FX15 incl. synthetic 9-opponent stress; descriptor at stage 1 and
  another stage, many/no tags, long place text, hover/focus/Enter parity, Esc; seeded RNG unchanged;
  contrast on real backgrounds and custom palettes.

### Part 3: You panel

- **Outcome (IL56):** Standard/All attributes and embedded native gear; compare inline gear vs an
  Equipment tab with a truthful summary. Width ratio and extra sets are reversible choices. Countdown
  only for known duration. Activity tool facts appear here (AV mapping).
- **Done (FX37):** FX16–FX21; locked and nonhuman slots only with native producers, otherwise labelled
  needs-content.

### Part 4: knowledge and hover popups

- **Outcome (KL20, IL57):** observer-grounded impressions and unknowns; samples give observations and
  fallible estimates; only measurement, study or scoped status/appraisal grant exact facts. One
  projection for cards, hover, log subjects and the existing Bestiary. **First-sight default waits on
  KL24.** Places (SF246) and activities (AVE10) may use the same provenance pattern later.
- **State:** optional `bestiary_knowledge` adjunct with per-fact provenance; reuse `enemy_killcount`,
  drop observations, field familiarity and narrative knowledge with their owners (KL22). No hidden XP
  or true stats as inputs.
- **Popup sections:** status-window, appraisal, study, skill and world sections contribute with
  provenance; a ui key alone grants nothing (SF250). Cheat sections may use the foreign style (CS3).
- **Done (KL21 + FX38):** migration from pre-Part save, save/reload/export/import, failed-storage
  rollback, world/reset scopes, KL17 leak matrix across DOM, ARIA, search, badges and frozen log text.

### Part 5: pursuits, empty states, navigation and footer

- **Additions (CN344, AVE11, SF249):** Authoring is reachable in ordinary play (not dev-gated);
  keep deliberate access and guards. No dummy counter exists in current source; nothing to remove.
  Distinguish game save import, layout import and authoring draft import. Activity and site pins are
  reminders; they never start work.
- **Done (FX39):** FX26–FX31; final navigation default stays Weibao's gate.

### Part 6: special monsters and enemy effects

- **Done (FX40):** first find the real special-tag and enemy-effect producers; until then FX32–FX34 are
  needs-content.

### Part 7 (new, proposed): activity clarity, piloted on mining and foraging

- **Outcome (AVE6):** inspect and start native mining/foraging with truthful tool/skill readiness,
  cycle time, XP cadence, known yield/chance and output destination; inspect elsewhere and return
  without cancelling work. Evaluate the existing `action_legibility_ui` before a new card. No formula,
  unlock, pay or clock changes.
- **Follow-through (AVE7):** finite slices: training and jobs, then rest and books, then one making
  consumer. No giant migration.
- **Order:** after Part 4's projection agreement and shared-style ownership; prep can run in Part 0.

### Part 8 (LATER, proposed): place-bound sites

AVE3/AVE8: no persistent crop/plot simulation exists in base activities; meadow-pen, household and
workshop surfaces exist. Pick one real site consumer with its gameplay owner before UI code.

### Cheat surfaces

Slot map SF120–SF152: five shell-owned host kinds (popup section, scoped inspection, center view,
notice/log, existing status or none). Foreign style (CS1–CS2) detail arrives with the `surfaces` CS4
addendum, still running.

### Cheat style CS4 returned, 2026-10-16

[CS4 spec](next-parts/surfaces.md) and [mockup gallery](next-parts/scratch/surfaces/cs4/index.html):
system window, jade slip and terminal styles as popup section, notice and center view; 14 static exports
pass fit and sampled contrast. Runtime CS2 behavior unverified.

**CS5, coordinator review (inferred):** the interaction contract is right but the look undershoots
Weibao's "distinct style like manhuas ... doesn't even need to fit". The system-window samples are a
thin cyan border plus `【 】` on the base panel colors; at a glance they read as an ordinary panel. A
next mockup pass should push the foreign layer harder inside its slot: own background (translucent
deep blue with grid or scanline), glowing double frame, its own type face, title bar with system
glyphs, stat lines in `[ ]` columns, reveal animation with a static form. Keep CS2 behavior unchanged.
The base frame in these mockups comes from an older capture (it still shows the dummy hit counter).

## Round 11: learning routes and novel-style cheat surfaces, 2026-10-16

Weibao: "Cheats dont necissarily have to be fitting, we can have it look at ones in novels or in
manhua and more, Learn them is good, maybe they can be learned after reading a book on them or
something, or after fighting enough in general can have skill that does that? or we use an identify
style skill? more to consider?" Recorded in [USER_VISION](../../../USER_VISION.md#learned-opponent-numbers-and-novel-style-cheat-surfaces-2026-10-16)
and PROJECT accepted decisions. **KL24 is answered: learn them.** Part 4's default is unblocked.

### Learning routes (all reachable; worlds set the dials)

| Code | Route | What it reveals and how | Existing owner to reuse |
| --- | --- | --- | --- |
| LR1 | **Fighting that species** | Each witnessed hit, miss and defeat adds observations; ranges tighten with samples (KL10). Species-specific | KL10 receipts; `enemy_killcount` stays history only |
| LR2 | **General combat-sense skill** | Levels from all fights. Improves first-sight impressions for every opponent, including unseen species, and how fast LR1 tightens. Does not reveal exact numbers alone at low levels; at high levels it can | Native `Perception` (`src/data/skills.js:2505`) already says it helps "discern the true nature of what you observe" and only grants crit today. Prefer extending it, or add a combat-lore skill if Perception should stay sensory |
| LR3 | **Books about creatures** | Reading grants species facts with provenance "read". Old or bad books can be outdated or wrong, shown as such until fighting confirms | Native `Book` items and `book_stats` reading time (`src/items.js:1438`, `src/main.js:625`); "Old combat manual" is already "worn and outdated". A bestiary book is a new Book whose reward is a knowledge grant |
| LR4 | **Identify / examine** | An active action on one opponent: costs time or stamina, may fail against concealment, reveals facts in a set order with level. Status worlds turn it into a system appraisal | New skill or world rule; status-window card (SF248) already has a renderer |
| LR5 | **Appraisal cheat** | Exact facts at its grade, foreign style (CS1), may be deceived by concealment cheats | `appraisal-lens` panel key; CHEAT_LIBRARY "Appraisal eye" |
| LR6 | **Others** | Testimony from hunters or the elder (attributed, may be wrong), watching companions fight, butchering a kill for body facts ("Butchering and you" exists), trophies | Dialogue, companion and butchering owners |

### Considerations

| Code | Consideration | Disposition |
| --- | --- | --- |
| LR7 | Knowledge changes what you see, never the fight. No combat formula, RNG or reward changes from learning, except where a skill already has combat effects | **ACCOUNT FOR NOW, Part 4.** Seeded-run parity check stays |
| LR8 | Existing saves: players who already fought wolf rats would suddenly lose numbers they saw | **ACCOUNT FOR NOW, Part 4 migration (reversible default):** species with past kills start at "observed ranges · from past fights"; exact stays unknown unless another route grants it. Log one line explaining the change |
| LR9 | Early threat judgment without numbers: the player must still decide whether to enter a zone | **ACCOUNT FOR NOW.** First-sight impressions are relative words from visible cues ("looks weaker than you / evenly matched / dangerous"), sharpened by LR2. Retreat stays available. Disclosed damage in the log is an observation and stays |
| LR10 | One popup must say how you know and how to learn more | **ACCOUNT FOR NOW, Part 4.** Each fact shows its provenance (fought, read, examined, told, system) and a hint for unknowns ("fight more, read about it, examine"), without naming sealed routes |
| LR11 | Native YAIR shows exact numbers; this is a deliberate, accepted departure | **ACT NOW:** record as an accepted divergence so parity checks don't flag it. Native facts that are not opponent stats keep native disclosure |
| LR12 | Books and testimony can be wrong; fighting can correct them | **ACCOUNT FOR NOW.** Conflicting sources show both until resolved; the newer evidence wins on its own fact only |
| LR13 | Places and activities use the same routes later (a book on caves, a mining skill revealing yields) | LATER, after opponents prove the pattern (R4, AVE10) |

### Cheat style: novel and manhua references

Accepted: cheats need not fit. **CS6 (proposal):** a style catalog keyed by cheat family, each drawn
from how that cheat type is shown in its genre, inspired by and never copying art or logos:

| Cheat family | Genre look |
| --- | --- |
| System / status window | Floating translucent blue panel, glowing frame, `[ ]` stat columns, chime and line-by-line reveal (system-litRPG manhwa) |
| Sage / inner voice | No panel: italic voice lines with a speaker mark, appearing beside the subject and in the log (isekai advisor voices) |
| Grandpa in the ring / spirit companion | Faded ink portrait corner, brush-script speech bubble (cultivation manhua) |
| Jade slip / inheritance | Green jade tablet, carved characters fading in, seal stamp |
| Flaw book / library | Parchment page with red annotations circling weaknesses |
| Simulator / foresight | Branching timeline cards, greyed futures, terminal-like counters |

Rare big moments (awakening, first appraisal) may take over the center for one beat with an explicit
dismiss, then settle into their slot. All of them keep CS2 behavior (focus, Esc, keyboard, log
mirror, reduced-motion static form, contrast in their own palette, sealed until discovered).

### Dispatched (docs only)

- `knowledge` resumed: fold KL24's answer and LR1–LR12 into the KL design (routes, provenance hints,
  LR8 migration default).
- `cheat-style` (new): CS6 mockups for at least four families at 1366×768, including one takeover
  moment and its static form, replacing the timid CS4 look.

## Round 12: Around you as a place ledger, 2026-10-16

Weibao: "better representation for around you and more? a kind of math thing? how does other games
do it and mre? the climb? other Webgames? more to consider? Anything we can glean from scroll of
taiwu and the others?"

**Now:** idle Around you (`src/village_workspace.js:152–165`) lists people and things as buttons,
then the place prose. No counts, resources, exploration state or neighbouring places.

### What references do

| Code | Reference | Behavior | Label |
| --- | --- | --- | --- |
| AY1 | Scroll of Taiwu, decompiled `MapDomain` (`~/.codex/research/ds-scroll-of-taiwu/extract/`, owned copy) | Each map block reports counts by kind: characters, fixed characters, infected, animals, graves, items, enemies (`GetMapBlockCharacterCountData`, MapDomain.cs:3774); current resource levels per type with a gather formula of current × (40 or 60 ± 20)% × multiplier × building bonus (:3677); a fuzzy treasure expectation (:1380); a per-block view range that reveals neighbours (:3025, :9084) | **stated** (source) |
| AY2 | Taiwu, same | Block display switches by profession: the overlay counts what *your* profession can read (animals, infected, destroyed) (`GetMapBlockDisplayData`, :1378) | **stated**. The counts you see depend on who you are, which matches Round 11's learning routes |
| AY3 | Native YAIR | "Clears: [0]" and "Enemy groups left 15/15" already count a place's state; connected places carry travel time ("Go back to [Village] [15m]") | **shown** (Weibao's screenshot) |
| AY4 | Idle Loops (Omsi) | Exploring raises what is available: Wander expands pots and locks, each with its own visibility and unlock thresholds (RESEARCH_IDLE_GAMES) | **stated** (prior research) |
| AY5 | A Dark Room, Trimps, Kittens Game, Candy Box 2 | Text status lines; a fog-of-war grid with distance from home; a grid of cells; per-resource rates (+x/s) | **recalled, unverified**. Lane checks source |
| AY6 | The Climb | R11 kept its stable target region and context continuity; how it shows a place is **not verified** | Lane checks the published build |

### Proposal: a place ledger in Around you

| Code | Section | Content | Owner / note |
| --- | --- | --- | --- |
| AY7 | **Here, counted** | One line of counts by kind: people 3 · animals ? · items 2 · dangers 1 group · graves 0. Each count opens its list. Unknown kinds show `?`, not 0 | Taiwu count dictionary (AY1). People and things already exist in `frame` |
| AY8 | **Exploration** | Explored % and known findables remaining, Idle Loops style: "Explored 34% · herbs 4/9 found · 1 sealed door". Native clears and groups-left join this line | AY3, AY4. Only for places whose owners track these. No invented progress |
| AY9 | **Resources** | Per known resource: level word or number, gather estimate as a range, regrowth. Links to the Part 7 activity card | Taiwu resources (AY1); native gathering activities (AC1) |
| AY10 | **Nearby places** | Connected places with travel time, danger impression and known resources; unvisited ones appear as `?` within your view range | Native `connected_locations`; Taiwu view range (AY1) |
| AY11 | **Your lens** | Skills, profession and cheats change which counts are exact, which are ranges and which are `?` (a hunter counts animals; Perception sharpens items and dangers) | Taiwu profession overlay (AY2) + LR1–LR6 + Part 4 provenance |
| AY12 | **Conditions** | Time, weather, temperature and place-type effects on you, one compact row | L4 place-and-time layer; Part 2 descriptor (SF230) during combat |

### Considerations

| Code | Consideration | Disposition |
| --- | --- | --- |
| AY13 | Counts are numbers players optimise around; a wrong exact count teaches distrust | **ACCOUNT FOR NOW.** Exact only when an owner reports it and the lens allows; ranges and `?` otherwise (UX19) |
| AY14 | Sealed places, people and items must not show up as a count or a `?` that names their kind | **ACCOUNT FOR NOW.** Unknown kinds are omitted until a legitimate cue exists; counts never include sealed subjects (KL17) |
| AY15 | Ticks change counts often | **ACCOUNT FOR NOW.** No reflow under a pending click (UX22); counts update in place with tabular numerals |
| AY16 | Places with nothing to count | **ACCOUNT FOR NOW.** Sections with no owner data are absent, not empty boxes (B2 rule) |
| AY17 | Procedural and other-world places | **ACCOUNT FOR NOW.** Sections are projections from place data, so generated places and other worlds get them for free (L6) |
| AY18 | A map view (grid or node graph) is the natural next step | **LATER**, after the ledger proves useful. Taiwu-style blocks or a node graph of connected places; needs its own surface and travel owner |

**Part mapping:** AY7–AY12 become proposed **Part 9: Around you place ledger**, after Part 4 (lens and
provenance) and alongside Part 7 (resources link to activity cards). Idle Around you only; combat uses
the Part 2 board and descriptor.

**Dispatched (docs only):** `around-you` lane: verify AY5/AY6 in source (The Climb's published build;
A Dark Room, Trimps, Kittens and Candy Box 2 repositories), read more of Taiwu's extracted map and UI
code, list what native YAIR place data can fill each AY section, and make static mockups.

Follow-up, 2026-10-16. Weibao: "Also tale of immortal and the others? and other games that might have
answers". Second docs-only lane `around-you-sims` covers Tale of Immortal (research extracts), Amazing
Cultivation Simulator, Caves of Qud, Dwarf Fortress, RimWorld, Immortal Life, Warsim and a quick look at
Stardew, Project Zomboid and Rain World, and returns the five best transferable ideas mapped to AY codes.

### Correction: map and representation style, 2026-10-16

Weibao: "Oops, rather than math thing I meant map/representation style and more?" Round 12 misread
"math" as numbers. **The question is how Around you represents space.** The ledger (AY7–AY12) stays as
annotations a map can carry; the main subject is now the map. AY18 ("map view LATER") is superseded.

| Code | Style | Reference | Fit for YAIR (inferred) |
| --- | --- | --- | --- |
| MP1 | **Node graph of named places**, edges labelled with travel time | YAIR's own data: `connected_locations` with `travel_time` and `travel_time_skills` (`src/models/location.js:169–201`); text RPGs | Cheapest and truest: draws exactly what the game knows. Default for the **area** scale |
| MP2 | **Tile or block grid** with fog and per-tile markers | Scroll of Taiwu map blocks with view range and profession overlays (AY1–AY2); Trimps cells | Strong for **regions** with many similar spots (forest, cave tunnels). Needs positions the base game doesn't store |
| MP3 | **ASCII/glyph map** with fog | A Dark Room, Candy Box 2, Caves of Qud, Dwarf Fortress | Distinctive and cheap to render; fits text-first UI and per-world skins. Readability at 21px needs care |
| MP4 | **Region/world map** with zones and danger levels | Tale of Immortal, Immortal Life, Amazing Cultivation Simulator | The **world** scale, later; ties to Worlds and travel between realms |
| MP5 | **Scene sketch** of the current place: who and what is where, in a few labelled spots | Room descriptions; illustrated scene panels | **Local** scale for Around you idle: people at the well, trader's stall, cave mouth. Can be text-only (labelled spots) |
| MP6 | **List only** (today) | Current shell | Stays as the accessible fallback and keyboard path for every map style |

**Default proposal (dials, not a choice):** local Around you uses MP5 labelled spots with MP6 list
fallback; "nearby" opens an MP1 node graph through the center-mode controller (Back, Esc); regions
that store positions may use MP2 or MP3; MP4 waits for world travel. Each world can pick its map skin
(ink-brush map for cultivation worlds, parchment for fantasy, terminal grid for sci-fi), using the
same data. Fog, `?` places and lenses follow AY10–AY14 and Round 11: discovery reveals, skills sharpen,
sealed places never appear.

**Constraints (ACCOUNT FOR NOW):** never shrink the log column; keyboard and list reach every map
node; 1366×768 at 14/21px; no reflow under a pending click while ticks update markers; procedural
places come from data, never hand-drawn per place. Positions for MP2/MP3 are new place data and need
an owner before any grid is drawn.

**Lanes redirected:** `around-you` and `around-you-sims` were stopped and resumed with the correction
(`next-parts/map-correction.prompt.md`); their mockups now show map styles.

### Cheat style CY returned, 2026-10-16

[cheat-style.md](next-parts/cheat-style.md) and [gallery](next-parts/scratch/cheat-style/index.html): six
families (system interface, inner voice, voice within the ring, jade inheritance, book of small errors,
possibility engine), 47 HTML/PNG pairs at 1366 14/21px and 1920 21px, awakening and reduced-motion forms.
Static fit and contrast (min 5.2:1) pass; runtime CS2 behavior unverified. **Coordinator review:** this
meets CS6; each family reads as its own source at a glance. In the contact sheet, center views appear cut
at the bottom edge (system "QUALITY" row, ring "Quality", book "Subject"); check whether that is the
sheet's crop or real clipping before any implementation.

## Round 13: many looks per cheat, real references, every family and simulator surfaces, 2026-10-16

Weibao: "These are good start, but we shouldnt be limited by these, For voice within ring, we can pull
a standard image somewhere in the future, or acciii representation, and many more versions accordingly?
Look online for manhua's representations and more, and the ohter types of cheats we have and more, and
deeper considerations for features like simulating the future and more?"

### Many versions per cheat (CV)

| Code | Consideration | Disposition |
| --- | --- | --- |
| CV1 | One cheat, many looks: a portrait image, ASCII art, ink line art (current mockup), text-only voice, procedural SVG. The card names a **look set**; the player or world picks the variant | **ACCOUNT FOR NOW.** Style is data on the card (CS1); add `looks: [{kind, source, license}]` to the proposal, not one fixed style |
| CV2 | Looks change with the cheat's stage: dormant flicker, awakened, matured, damaged or sealed, overclocked | **ACCOUNT FOR NOW.** Stage drives the variant, using the card's existing `stages` |
| CV3 | Looks change with the world: a system window in a cultivation world can wear jade; a ring spirit in sci-fi can be a holographic AI | **ACCOUNT FOR NOW.** World skin (L3) applies inside the foreign layer too, through the same tokens |
| CV4 | Image sources. A "standard image" later can come from public-domain or CC0 art, art Weibao supplies, commissioned art or generated art with a clear license. Copyrighted manhua panels are **reference only**: link and describe, never ship | **ACCOUNT FOR NOW.** Every look records source and license; repo assets need a license line. Raw reference captures go to gitignored `docs/research/cheat-looks/private/` |
| CV5 | ASCII looks need a monospace font, fixed line width and a screen-reader text alternative; they must survive 21px text | **ACCOUNT FOR NOW.** Every look has a plain-text description; ASCII is decorative, the facts stay in text |
| CV6 | Portraits stay optional (Weibao's stated leaning, 2026-10-14, not yet a policy) | **ACCOUNT FOR NOW.** No surface depends on an image to work; images are one look among several |

### Every cheat family (CF)

`docs/CHEAT_LIBRARY.md` holds far more than six families: the 13 `PANELS` keys, the player-mechanic
cards (Echo Anchor, Patient Furnace, Heirloom Compact, Pattern Book, Seed Cartographer, Rebirth Ledger,
Instinct Inheritance, Earned Habit, Fate Steward, Loaded Dice, Hall of Selves, World Deeds), the
"Gameplay by cheat family" table, title and rule-editing cheats, and enemy cheats.
**CF1, ACCOUNT FOR NOW:** each family gets at least one look in the catalog, mapped to the surface it
needs (popup section, notice, center view, log voice, takeover, none). Enemy cheats need a hostile
variant the player can recognise as "someone else's cheat".

### Simulating the future: how it looks (SU)

The mechanics already have an owner: [SIMULATORS_AND_CHEAT_IMPLEMENTATION](../../../SIMULATORS_AND_CHEAT_IMPLEMENTATION.md)
(engines, seven modes, honesty, foresight grades, sealed secrets, timeline strip). This round adds only
**representation**; it does not change that design.

| Code | Mode or concern | Representation consideration |
| --- | --- | --- |
| SU1 | **Preview vs commit** | Every simulated result is marked as not real (the mockup's "Preview only. No action has been taken"); committing is a separate, labelled command. Nothing in a preview writes to the real log except one line that you looked |
| SU2 | **Dream run** | 3–7 decision cards in the cheat's style, then a compressed story log and one "keep" choice; the dream log is its own record, styled, and never mixed into Reports |
| SU3 | **Spread** | Odds as a small distribution ("dead before 30 in 4 of 10"), with a sample run you can open; never a bare percentage without the sample count |
| SU4 | **Probe** | A/B side by side with the first divergence highlighted, then each branch's beats |
| SU5 | **Forecast / timeline** | A strip of predicted beats with fog where the reader can't see; beats re-check against reality and the first mismatch is marked "the branch shifted" (owner already logs divergence) |
| SU6 | **Rehearsal** | Win rate plus one replayable sample fight, using Part 2's board and log tokens inside the foreign frame |
| SU7 | **Shadow** | The generated self shown as a mirrored You panel in the cheat's style |
| SU8 | **Honesty grades** | Projection, true sight and lying oracles must look different: fog for unknown, a confidence mark per beat, and a deceptive oracle that looks confident (the player learns to doubt it through outcomes) |
| SU9 | **Cost and limits** | Charges, cooldown, sanity or qi cost shown before running; a running simulation shows progress and can be cancelled |
| SU10 | **Sealed secrets** | Foresight shows the event at your discovery stage, never the sealed truth (owner rule); "something happens here" is allowed only where the owner permits |
| SU11 | **Determinism** | Seeded streams (`src/seeded_streams.js`) let a preview match reality when nothing changes; the UI must say when the world has changed since the preview |

### Dispatched (docs only)

- `cheat-refs`: online research of how manhua, manhwa, light novels, web novels and their adaptations
  show cheats (system windows, inner voices, spirits in rings, inheritances, appraisal, return by death,
  foresight, simulators, shops, gacha systems), mapped to every CHEAT_LIBRARY family, plus CV look sets
  and image/ASCII source options with licensing.
- `sim-ui`: SU1–SU11 as static mockups per simulator mode and foresight grade, reading the simulator
  owner doc and reusing the cheat-style tooling.

## Round 14: looks by cheat type, more cheats and deeper simulators, 2026-10-16

Weibao: "rather than By world:it should be by type, if it's ai ring, then its hologram, if its
cultivator in a ring, then specific art style and more? We dont need need a text always work,
considering more cheats and more? more to cnosider? Future simulator?"
Recorded in [USER_VISION](../../../USER_VISION.md#cheat-looks-follow-the-cheats-own-type-2026-10-16).

### Corrections

| Code | Was | Now |
| --- | --- | --- |
| CV3 | Looks change with the world (world skin inside the foreign layer) | **Superseded.** A cheat's look comes from what the cheat **is**, not where it is. An AI in a ring is a hologram in a fantasy world too |
| CV5 | Every look has a plain-text alternative; ASCII is decorative | **Superseded.** No text-equivalent requirement. Looks may carry meaning visually |
| CS2 | Announcements always mirror to the log as plain text | **Relaxed.** Logging is a per-cheat choice (a quiet cheat may leave no trace). Focus, Esc, keyboard and not covering the log or a pending click still hold |

### Looks composed from the cheat's identity (CT)

| Code | Consideration | Disposition |
| --- | --- | --- |
| CT1 | A cheat has identity fields: **carrier** (ring, pendant, eye, book, sword, system, voice in the head, pet, tattoo, phone), **entity** (AI, old master's soul, god, demon, future self, dead hero, nothing at all), and **mechanism** (advise, appraise, store, simulate, rewind, trade, multiply) | **ACCOUNT FOR NOW.** The look is chosen from these fields, not hand-drawn per card: ring + AI → hologram projected above the ring; ring + cultivator soul → ink-wash elder; sword + spirit → blade glow and engraved script; eye + appraisal → iris overlay with reticle; book + flaws → annotated pages; future self → mirrored You panel; demon contract → blood-seal frame |
| CT2 | New cheats get a look by composition, so the catalog scales to many more cheats without new art for each | **ACCOUNT FOR NOW.** Unusual combinations (AI in a jade slip, a god living in a phone) fall out naturally and can get a hand-made override |
| CT3 | Each identity look still has many versions: image, ASCII, line art, procedural, and stage variants (CV1, CV2) | **ACCOUNT FOR NOW.** Kind and stage are dials on the identity look |
| CT4 | Look should tell the truth about the entity, until it shouldn't: a demon posing as a kind grandpa can wear the grandpa look until exposed | **ACCOUNT FOR NOW.** Disguised entities use their claimed look; exposure swaps the look (a strong reveal moment, Round 9 takeover rules) |

### More cheat types (MC)

The library is large, but the identity axes surface gaps worth adding as proposals to its owner later:
**MC1** a phone or app cheat (modern-world system, notifications, in-app shop); **MC2** a pet or familiar
that is secretly the system; **MC3** a curse that is also a cheat (strength at a price shown on the
panel); **MC4** a shared cheat between two holders (both see each other's notices); **MC5** a parasitic
cheat that grows its own goals; **MC6** a broken or pirated system (glitched windows, wrong translations,
missing fields); **MC7** an inherited cheat from a previous life of yours (your own handwriting). These
are LATER for the [cheat access chat](../../../gm/CHEAT_ACCESS_DESIGN_DISCUSSION_2026-10-15.md) and
CHEAT_LIBRARY owners; this plan only needs their looks to compose from CT1.

### Future simulators, deeper (SD)

Mechanics stay with [SIMULATORS_AND_CHEAT_IMPLEMENTATION](../../../SIMULATORS_AND_CHEAT_IMPLEMENTATION.md);
these are representation and interaction considerations to fold there when its owner next runs.

| Code | Consideration |
| --- | --- |
| SD1 | **Simulators also look like what they are.** AI simulator: probability dashboard and branch charts. Life-simulator system (the Chinese web-novel "life simulator" genre): a scrolling text life log, talent draws, "simulation ended, choose your reward". Dream of the yellow millet: an ink scroll unrolling a whole life. Divination: hexagrams or cards, vague by design. Return by death: no preview at all, only memories after the fact |
| SD2 | **Simulated knowledge is its own provenance.** A rehearsal fight can teach opponent facts (Round 11), marked "simulated"; a lying or low-grade simulator can teach wrong facts that real fights later correct (LR12) |
| SD3 | **Simulation time.** Runs cost in-world time, offline time or none, per simulator; long runs can queue and report through notices; the real clock and the dream clock never mix in the log |
| SD4 | **Results become plans.** A chosen branch can be pinned to Pursuits as "follow this path", with checkpoints that turn red when reality diverges |
| SD5 | **Others simulate too.** An enemy with foresight acts on its own preview; the player may see a "they saw this coming" tell. Pairs with enemy cheats |
| SD6 | **Memory across rewinds.** For return-by-death and loops, what you keep is shown as a distinct "carried" mark on facts, items or skills, so the player sees what survived |
| SD7 | **Abuse is fine, bugs are not.** Solo player: re-simulating until a good seed is allowed where the simulator permits; stale previews, double rewards and leaked secrets are bugs |

### Lanes

`cheat-refs` and `sim-ui` were stopped and resumed with this round: looks by identity (CT1–CT4), no
text-equivalent rule, research into more cheat types and simulator genres (SD1), and mockups by type.

### Map lanes folded, 2026-10-16

[around-you](next-parts/around-you.md) (AW, Taiwu/native/web) and [around-you-sims](next-parts/around-you-sims.md)
(AS, ten games) returned with mockups in `next-parts/scratch/around-you/` and the sims scratch folder. No
questions for Weibao. **Current map brief (proposed Part 9, superseding the AY ledger framing):**

- **Area around you, first slice:** a graph of known named places with known routes (MP1), current place
  anchored, travel time on the selected route, list fallback (MP6). Opens as one registered center view
  (`src/center_modes.js`) with `Back to <place>` and Esc (AW17, AS17, AS19). Rain World and Warsim show that
  connections alone give a sense of space (AS11).
- **Local place:** a sketch with named landmarks and present subjects when a place supplies anchors;
  otherwise the current list (MP5, AS16). Tile, glyph or illustrated versions where real positions or art
  exist; they are dials, not the default.
- **World:** atlas of known regions only when a region owner exists (MP4, AS18); a nongeographic realm can
  stay a graph.
- **Lenses:** one purposeful overlay at a time from a known skill, tool or cheat (ACS feng shui, RimWorld
  beauty, Zomboid search; AS15). Words or bands by default, exact values when granted (Round 11).
- **Discovery:** filter before layout. Known, publicly named but unvisited, a cued unknown path (the only
  case that earns a `?`), and undisclosed (contributes nothing, not even spacing or degree) (AW17, AS21).
- **Generated worlds:** topology, coordinates, anchors and art are separate optional inputs; never invent
  distance or bearing from a layout position (AS22).
- **Fit:** Reports keeps full width and height; at 21px show fewer nodes, not smaller text (AS20).

**Corrections to Round 12 (AW15):** Taiwu's area display call passes `professionId = -1`; profession cases
exist in the helper, but which one the player's map uses is not shown by this file. `FindTreasureExpect` is
called but not implemented in this extract, so "fuzzy treasure estimate" is unverified. Count categories can
overlap and zero keys are removed, so counts are not a population total. A UI-assembly follow-up is
recorded in AW15.

### Cheat references and simulator surfaces folded, 2026-10-16

- [cheat-refs](next-parts/cheat-refs.md) (CR): public reference ledger of manhua, manhwa, web novel and
  adaptation conventions; 142 crosswalk rows mapping every CHEAT_LIBRARY family to identity looks, stages and
  hosts; asset routes (public domain, CC0, supplied, commissioned, generated) and ASCII choices; private notes
  gitignored, no images in the repo. New identity gaps beyond MC1–MC7: **CRM08** network/community advantage
  (group chat of peers), **CRM09** remote shop and delivery, **CRM10** object-self (you *are* the sword),
  **CRM11** rule or narrative authority. Simulator genres CRSIM1–CRSIM6 add **reader foreknowledge** (knowing
  the novel) as its own type: a remembered chapter, not a confidence percentage. CR50: a convincing false
  vision gets no "lying oracle" warning, palette or label the player hasn't earned.
- [sim-ui](next-parts/sim-ui.md) (SI) and its [60-mockup gallery](next-parts/scratch/sim-ui/index.html): every
  simulator mode in two identity looks (AI ring projection, jade life scroll) plus yellow-millet dream,
  divination and return-by-death memory; preview vs life marking, Back/Esc, dream-run setup and settlement.
  Static fit and contrast pass; runtime and visual acceptance open. Mechanics owner unchanged.

Both lanes: no questions for Weibao. All 13 lanes in this dispatch have returned
([sessions](next-parts/runs/SESSIONS.md)).

## Round 15: whole-plan pass and iteration rounds, 2026-10-16

Weibao: "consider ... details and expand and think accordingly?", then "can we improve the round plan
accordingly? Aren't we iterating on ideas? r14 is the best thus far but everything is working to finetune
accordingly? More to consider? everything that I mentioned?" Detail in
[round-15-whole-plan.md](next-parts/round-15-whole-plan.md). Planning only.

- **Schedule:** R14 is the working baseline (IT1). Parts become a ranked queue of one-gap rounds:
  R15 combat place tags, R16–R17 Inventory, R18–R20 combat board, log and Reports, R21 polish, R22–R23 You,
  R24 activities, R25 services, R26 polish, R27–R29 knowledge (save-touching, alone), then footer, nav,
  pursuits; Part 9, cheat pilot, Parts 6 and 8 later. Rolling review (IT2) replaces the W6 gate.
- **Workbench:** mockups and A/B comparisons run in parallel through MOCKUP_SYSTEM (WB1–WB6).
- **Corrections:** pursuit pins change the save (NX3); "display setting, no save change" holds only for
  panel-scoped settings (NX2); runtime rounds follow ARCHITECTURE_RULES and the modular-seams reservation (NX13).
- **Seams:** open knowledge route field before R27 (NX5); cheat looks render the presented identity only (NX6).
- **W6 superseded 2026-10-16:** the row and Part 1's "Starts after W6" remain as history.
- **Coverage:** a trace of 99 UI requests (WR01–WR99) found 32 partial or missing; each now has a round,
  workbench study or reopen trigger (idle Focus/Around you list R25, no-scroll check R22, view placement
  WB7, VFX WB8, farming via the existing crop flow in R24, bought maps in Part 9).
