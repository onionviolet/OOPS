# CR3 play feel

Status: PROPOSAL ONLY, 2026-10-14. Extends root FE1–FE7 in the [crafting palette](../../../../PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md); its definitions remain the owner. P2 source findings and contradictions are in [REPORT](REPORT.md). These are original UI/process proposals, not verified claims about the palette's reference games. No images, runtime work or gameplay proof.

## FE1.a: property map as an explanation of one resolver

At 1366x768, keep the native status/inventory regions and extend the existing crafting workspace. Give the workspace three simultaneous regions: stock and quantities on the left, map in the middle, selected procedure/known forecast on the right. A bottom strip holds Mix, Save method, queue status and the last receipt. Long ingredient notes and prior trials scroll independently. At 1600x1000 enlarge comparisons and show a pinned prior brew; do not merely enlarge empty margins. Target dimensions depend on the actual host after integration, with no promise that three fixed widths fit P2's current 850px maximum.

The map plots a player-selected pair of **observed response axes**, such as observed health versus stamina regeneration for one route. Other properties remain in the adjacent summary; a 2D point is not the entire product. Axis unit, tested body/route and protocol stay visible. Unknown dimensions show an uncertain region or an unplaced point. Never calculate a narrow uncertainty band from hidden truth. Target regions come from known requirements or the player's chosen goal, not an undiscovered secret destination.

Adding an ingredient shows a before/after segment calculated from the same composition/process selection. Ratio normalization means this segment is not necessarily a constant vector. A selected process updates the end point. For P2 revision1, entry order has no physical meaning: dragging the same packs in another order produces the same resolver request. A later ordered law can show real intermediate steps only after that law exists. Annotate a changed process or dose basis so points from incompatible trials are not compared as equal.

Map preview uses observer knowledge, public laws and retained observations. Exact previously observed P2 products can have exact forecasts under their retained law; unfamiliar ratios do not inherit full identification. A sampled observation may support a hypothesis band, labeled inferred, without declaring every ingredient fraction known. Player-visible points, tooltips, colors, sort order and keyboard descriptions use the same filtered projection. No raw canonical keys, hidden profiles or secret target labels enter DOM attributes, accessibility text or copy actions.

## FE2.a: synthesis grid, with truthful links

Offer a reachable Map/Grid/Table selector per supported station, with table entry and keyboard quantity controls always available. Grid cells hold ingredient roles or quantity tokens; dragging, click-to-place and keyboard placement all compile into the same typed `CraftIntent`. P2's current resolver reads quantities and Steep/Boil, not adjacency. On that law, moving a token changes presentation only, and the UI says so. It must not invent an adjacency bonus.

A later station can declare supported link operators such as an ordered extraction stage followed by a binder stage. Valid grid edges compile into those same procedure operators used by the table and map. Invalid edges explain the known missing interface before spending; unknown compatibility stays trialable where the local law allows it. Mere shape and matching color never supply an absent ingredient, faculty or catalyst. Exact identity slots, functional roles and mixed recipes can coexist.

Both front ends produce one normalized request and call one resolver/publication path. Proposed parity gate: equivalent inputs/process/context in all three views have equal internal result, cost, product identity and draw behavior. Grid-specific mechanical choices must also be representable in the procedure editor. No exclusive bonus or discovery is awarded simply for choosing a UI.

## FE3.a: learn by tasting, touching and other routes

P2 currently drinks a whole owned vial and records its exact oral payload. Add raw-ingredient sampling only through a declared sampling/consumer adapter. A touch reveals a permitted surface observation; a taste reveals a permitted taste or body response; neither universally assays all fractions. Dose, route, body, baseline, time and actual side effects belong to the observation. True effects operate before identification.

First bounded proposal: consume one whole fictional ingredient pack using a supported oral consumer, or brew the smallest currently legal test vial. A micro-dose UI requires exact aliquot identity and exposure support beyond P2's split helper. Do not describe a smaller harmless taste while charging/applying a full pack. CR1 owns [body/dose design](../cr1/DOSE_AND_TOLERANCE.md), including susceptibility and cumulative effects.

Keep alternatives reachable: personal taste, protected touch where meaningful, paid assay, a qualified collaborator or a supported sensor. Availability comes from actual world/body/tools, with no universal taste requirement. Show known warnings and unknown response honestly; ignorance adds no independent danger roll. No action silently consumes an unknown product through an auto-test setting. Food remains optional, with comfortable unfed play and no hunger death.

## FE4.a: a journal that proposes discriminating tests

Use P11 [M2 research questions](../p11/MORE.md) and the materials audit's P8 inference contract. Store question, competing hypotheses, supporting/contradicting observation refs, proposed controlled test, expected *distinguishable observation categories*, cost and protocol. Hypotheses come from player notes, learned models or attributed recipe claims. The recommender must not use undiscovered truth to rank a perfect answer.

An original example: two already observed brews differ in recovery and preparation. The journal suggests holding quantities fixed and comparing Steep versus Boil. The question is whether process, rather than ingredient amount, explains that difference. If both process and body state change, mark the pair confounded and propose a better control. A result below measurement resolution is inconclusive; an observed zero in this protocol is not universal absence.

Rank tests by separation among the actor's current hypotheses, known cost, available stock and observation resolution. A qualitative score is enough initially; do not invent precise statistical certainty. When no known test discriminates them, say what new apparatus/protocol is needed and offer ordinary exploration. Test execution creates an actual paid job/action, not journal-only knowledge. Negative and contradictory results remain visible, with a dated retraction/scope change instead of deleting earlier evidence. Copying an incorrect recipe never changes the physical law; CR4 owns [knowledge lineage](../cr4/MAKERS.md). Its KN4 source-root rule also matters: three copied notebooks are one evidential origin, not three independent confirmations.

Suggested journal layout: left question list, center selected comparison with one changed variable highlighted, right proposed test and its cost, bottom Run test/Queue paired tests/Keep hypothesis actions. Confirmation at this point is the ordinary game action showing cost, not a new external agent approval flow.

## FE5.a: useful failures with actual consumers

Define failure relative to the intended result: a stamina brew can succeed physically while missing the player's desired recovery target. Retain its actual composition and method record. Offer the player the observed use, another supported process, storage, trade under known terms or discard as a deliberate game action. A different intended purpose does not transmute the item for free.

For broader failures, the rule allocates product, intermediate, residue, emission and recoverable material. A smoky outcome becomes a smoke item only through CR1's area consumer; residue becomes useful fertilizer only through P6 [agriculture](../p6/AGRICULTURE.md), or dye through [coatings](../p6/COATINGS.md). The name follows observed form until tested. No automatic valuable consolation or deletion of traces. A useful failed result may later become a saved method and production target.

Original candidate case: a declared overheating operator creates a colored residue and a less useful oral product. Test the residue's supported pigment use, then queue the residue method. This requires an authored transform, conservation ledger and actual cosmetic consumer; P2's Boil option currently changes availability and does not produce this residue.

## FE6.a / FE7.a: active and idle share a procedure

An active session can choose supported heat/time/stop variables; a learned routine supplies them automatically. Offer coarse preset, editable stages and active adjustment as reachable options. Reward active control only when an execution precision law reads it. If a routine is learned well, it may be equally precise. No mandatory click cadence, hidden failure for tab inactivity or global active-only progression.

P2 supports no stir timing, skill precision or multi-step process yet. First extension should add one real variable with visible before/after effect and a saved routine equivalent. Late input follows a declared stage rule; pausing play freezes eligible stage progress. A Stop simmer action publishes lawful current intermediate state, rather than rolling back transformed matter. A render delay cannot miss an undocumented timing window.

All these designs use [automation admission and scale rules](AUTOMATION.md). Acceptance needs rebuilt 1366x768 and 1600x1000, keyboard operation, retained selection/focus during polling, same-intent parity, unknown-versus-known comparison, actual experiment/use, failed persistence purity and pending/final Save/reload/literal Import. Gates are proposed and NOT RUN.
