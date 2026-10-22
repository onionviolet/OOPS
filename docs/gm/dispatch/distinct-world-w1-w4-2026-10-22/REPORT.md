# W1–W4 native delivery, 2026-10-22

Weibao authorized “implement all Ws.” The four selected finite journeys extend
existing native owners. This is original Frontier/Mistglass content, not four
full campaigns, a canon adaptation or a new universal world engine. First
milestone and broader mechanically distinct-world direction are preserved.
[Authorization, ownership and checkpoints](CHECKPOINT.md), [source map](SEAM_MAP.md),
[research](../../../research/protolike-deep-2026-10-22/REPORT.md).

## Coverage and play routes

Opening prerequisite: Village → Here → Options → Iona’s work ledger → Follow
local people and work. Meet the elder and unlock/meet the native craftsman through
the existing opening. Other known panels are in More panels. Ordinary world
work remains available alongside these opted-in original journeys.

| Code | Native route and resulting behavior | Acceptance |
| --- | --- | --- |
| W1 | More panels → Gear workshop → study preparation → local repair shift → prepare smoke/oil lots → fit a portable kit → demonstrate fitting → cut a precise lining. Oil preparation uses existing Crafting 5; smoke remains an ordinary alternative. One tool uses one treated pelt and one log. The demonstration consumes one flexible prepared piece or two smoke-set pieces. | Two routes from the same stock create distinct exact lots, two usable native kit grades and different useful lining quality. The actual capability/faculty owners retain fitting; it enables a different operation. Both kit grades work with practiced fitting. Exact lots, capability and products pass native persistence. |
| W2 | More panels → Homes → Village home supplier and lodging → join as a provision worker/student → household primer → agreed ledger appointment → earned provision office → train Toma → fund Rowan’s pantry office. Leave/rest pauses the actual delegate. Handover to a qualified living successor requires review of the retained agreement before spending resumes. A qualified voluntary handover is also supported. | One finite household, actual worker/student learning, earned permissions, shared steward training, finite supplier/treasury/jobs, four-coin office floor and successor review. Handover preserves institutional stock/funds while personal mastery, actual bodies and relationships stay with their holders. |
| W3 | Projects → Mistglass conservatory → enter → learn/hear the keeper → inspect surviving outflow masonry → restore its brace with one owned log. Return through Village and revisit. | Two original seeded histories bind different present owners/obligations. One pinned cause in the incumbent lore-history owner supplies the retained origin, with player-scoped observation through the actual causal-situation/knowledge owners. A physical brace provides a useful non-condensate clearing route. Reload/import/revisit preserve each origin. Truth is disclosed through its play route, not summarized here. |
| W4 | In Mistglass, choose Threaded-breath circulation or Still-pool refinement → practice → prepare the path’s reserve → compatible Flow-cut or Set-grain. Circulation uses ambient mist; refinement also consumes one actual paid Cloudseed dose. Bring owned physical rat pelts; buy doses from the native keeper. | One condensate is committed from the native energy owner, without a second regenerating pool. Compatible work consumes its charge and exact material. Practice changes actual product quality; control freezes at preparation. Method changes wait for settlement/explicit abandonment. Foreign-world or changed-body context retains inert body/instance-bound work/reserve; knowledge stays with its observer. |

For one W1 comparison run, ordinary opening supplies were twelve rat pelts, five
logs, one oil and existing Crafting XP/craftsman access. No new W state was seeded:
lesson, work, lots, capability and products were earned through native controls.
W2 starts from ordinary entry, not a noble-family start. All proof uses fresh
localhost origins and disposable saves; private player saves were not read or
changed. Body replacement in W4 is verified by replacing the actual saved-body
owner in source tests; no new body-swap interface is claimed.

## Changed source and persistence

| Area | Paths and seam |
| --- | --- |
| Preparation and earned capability | New `src/material_apprentice.js`; existing `gear_workshop_domain.js`, `gear_workshop_panel.js`, `processed_materials.js`, `items.js`, `expedition_content.js`. Reuses the released `material_treatment.js`/lineage process and native inventory, capability, faculty and transaction owners. The bounded native portable-kit carrier retains its exact lineage key. |
| Institution and jobs | Existing/released `home_office.js`, `home_model.js`, `home_staff.js`, `home_work_content.js`, `home_panel.js`, `home_household_panel.js`. No institution-side timer, stock cache or second treasury. Existing worker/job reservations and commands settle training, deliveries and cancellation. |
| Historical entry | New `src/mistglass_history.js`; existing `lore_history_state.js` plus P12 host/planner/presenter. A narrow typed original initialization receipt extends the incumbent history seam; ordinary Frontier/Village receipts keep their original scope. No universal prehistory claim or parallel history log. |
| Path work | New `src/mistglass_path_work.js`; existing `absorb_p23/world_adaptation/index.js`, `absorb_p23/host_joins/world_adaptation.js` and `world_adaptation_ui.js`. Existing techniques, native energy/effects, physical material process and root save owner remain authoritative. |
| Composition and checks | Hunk-only `src/main.js` ports for current state, native plan/publication, inventory and material clock. New `tests/distinct_world_{history,materials,office,paths}.test.js`; one incumbent P12 fixture now selects a genuine seeded history instead of changing retained truth. Direction/navigation updated additively in USER_VISION, PROJECT and RULES_INDEX. |

New path-work state is an optional child of the existing adaptation save slice.
Earlier absent state retains its earlier meaning. Legacy E5 origins without a
causal pointer and family-office mandates without the new worker agreement are
not retroactively given invented history, training or obligations. New variants
need this matching reader. Unsupported/malformed state is rejected before native
publication. Pending purification still settles before a changed body can save;
retained dormant work does not prevent saving a body change.

Material products use the native material/calendar clock. Technique practice,
institution work and causal receipts use their existing played-clock owners.
The dated-source regression prevents a new product from being stamped earlier
than its consumed parent merely because elapsed expansion time is smaller.

## Verification and delivery boundary

Final frozen candidate: bundle `484d112cf8d3c14ff10615c0d7931f2ea2a87ff323a808a95261c7e413e19fc9`.
`npm run build`, `npm test` (**2,547 pass; zero fail/skip**),
`npm run check:arch`, `npm run check:rules` and all **36 rule-behavior checks**
pass. All 1,283 captured source/test/runtime input hashes remain unchanged across
the final isolated run. The non-git frozen copy produces untracked-file warnings
in the rules check; primary's rules check passes with three such warnings.
No missing link or rule error remains.

[Machine-readable checks](CHECKS.json) bind all four native receipts and the
18-case desktop matrix to this exact bundle. Ten native persistence states pass
across the four journeys. All 19 W-owned runtime paths match primary exactly.
Later concurrent LOTM work is preserved and is outside this task's delivery
claim. Isolation details and early fixture/navigation diagnostics remain in the
checkpoint, rather than being counted as passes.

| Proof | Final matching-bundle receipt |
| --- | --- |
| W1 | [Preparation, tools, advancement and precise work](evidence/w1-materials-e72r18/w1-materials.json) |
| W2 | [Worker, earned mandate, finite policy and reviewed successor](evidence/w2-institution-r1I5OU/w2-institution.json) |
| W3 | [Both original histories, native discovery and retained consequences](evidence/w3-two-origins-4Qowgw/w3-two-origins.json) |
| W4 | [Distinct preparation, practiced result and compatible expenditure](evidence/w4-paths-5NGa2H/w4-paths.json) |
| Desktop | [Three surfaces at all six viewport/text cases](evidence/w-desktop-EXJyXy/w-desktop.json) |

The [frozen playable preview](http://127.0.0.1:19418/) serves that verified build;
its browser tab is queued in this chat. It is separate from the user's normal
Electron snapshot. The frozen build/map and input receipts are preserved privately.
Earlier passing checkpoints remain under their individual input identities.
Native evidence includes actual Save, reload, Export and literal-file Import,
not serialization of a helper object. Primary desktop 1920×1080, 1800×1040 and
1536×864 at 14/21px; mobile remains deferred. The desktop matrix covers the
three native surfaces used by the four journeys, scroll-reachable controls,
retained log column, actual text size/font and pinned Back. Manual review of
the smallest 21px cases corrected duplicated reasons/completed steps and made
the institution’s reserve floor visible.

The combined input includes the released C9 body-carrier/exposure/status and
Options CSS fixes. [Their owner](../../../research/additional-cultivation-2026-10-22/IMPLEMENTATION.md)
retains independent C7/C9/C10 provenance, focused checks and native proof.
No duplicate engines, agents or chats were launched by this task.

Source/rebuilt browser verification is distinct from local app snapshot staging,
normal Electron adoption and human acceptance. No commit, push, package staging,
installation, app adoption or publication was performed here. Human pacing,
balance and taste remain open; no automated check substitutes for them.
