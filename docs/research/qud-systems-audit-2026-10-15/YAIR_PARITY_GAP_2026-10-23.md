# YAIR vs Caves of Qud: systems parity gap audit (2026-10-23)

Research and proposals only. Selects nothing, changes no priority, authorizes no runtime work (AD32, AD36). Weibao asked which Caves of Qud systems YAIR already matches and where the biggest gaps are.

Method and limits: two Sonnet readers graded the Qud findings in this folder ([REPORT](REPORT.md), [SYSTEM_CATALOG](SYSTEM_CATALOG.md) and the topic files) against `src/` by grep plus partial reads. The Qud side is as these audit docs state it. A NONE means the greps found no owner, not proof of absence. Nothing was run, built or browser-checked, and FULL means a mechanism exists in source, not that it was played or accepted. Paths are relative to `src/`. DBD means different by design, not a gap.

## Parity summary

| Area | Parity | Notes |
|---|---|---|
| Ability sources, faculty, eligibility, timed refund | Strong | Substrate exceeds Qud in places (rollback craft transactions, charges, breach, recharge). |
| Identification as per-observer state | Strong | State side done; action side missing. |
| Generated-world persistence, run records, discovery | Strong | Seeded streams, idempotent derivation, capped typed history. |
| Ability UI (description, rehearsal, unusable reason) | Strong | Confirmation and an ability bar are unverified. |
| Reputation, named rank, achievements, naming | Weak | One reputation consumer, no rank ladder, no achievement registry. |
| Reference access, books, psychometry | Absent | Three separate Qud acquisition owners with no YAIR counterpart. |
| Implants, borrowed body, temporary copies | Proof only | Single finite specimen; copy-with-expiry is a label. |
| Generated history, villages, relic items | Thin | History is derived but inert. |
| Physical field layer (gas, gravity, spread) | None | Conflicts with no accepted direction; design-heavy. |

## Gaps, ranked (A = action, each is a proposal)

1. **G1 Reference access and learnable objects.** No held book or disk that supplies a method while present, no learn-and-consume variant, no training book with a read key. Add as a distinct owner beside `craft_state.js:37-61` (known recipe vs `knows`). Also covers psychometry and the examine attempt with failure (`craft_state.js` has the state only).
2. **G2 Faction rank and reputation consumers.** `reputation.js` feeds only trader price (`components/trader_component.js:164`). No rank ladder, rank-gated service, or reputation-priced teaching. Pairs with `skill_expansion_content.js:98` (lesson fees) and `titles.js` (AD38: a title may grant a power if a world says so).
3. **G3 Fetch quests with unique identity.** `story_requests.js:9-72` uses ordinary stackable items from a closed list; no early-acquisition credit, no recovery of a lost item. `material_lineage.js:105` heirloom keys are the natural identity carrier.
4. **G4 Temporary copies and implants.** `temporary-construct` (`structured_ability_runtime.js:14`) is only a label. `backlog_expansion_body.js` proves one implant and one borrowed body; a reusable install/remove service with skill-dependency counting is missing. Same-id sources collapse (`simulation_effects.js:382`), so two suppliers of one source do not both count.
5. **G5 Inert world history.** `lore_history_state.js:75-120` derives factions and wars with no consumer; no villages, murals or quest sources follow. Confirm wiring before treating it as a gap.
6. **G6 Naming, relics, achievements.** No player naming act, relic bestowal, item/place grammar (`name_grammar.js` is people only), or profile-level achievement registry (`discovery_codex.js` is the nearest). Cheap on `titles.js` plus the codex.
7. **G7 Physical field layer.** No gas, spread, gravity or flammability simulation. Check against AD38 before any build; the most design-heavy item here.

Lower: no random-option mutation purchase, no zero-cost child skills on parent buy, no per-part anatomy tree, no generic equip-event grant hook, no generated books, skill removal does not clear owned shifts, no map pin or journal-to-map link.

## Design differences (not gaps)

Learning is a priced lesson command rather than an SP economy. Crafting uses material-property recipes, not a bit economy. Zone freeze and thaw becomes a clock-derived, capped away ledger (`away_ledger.js:6-30`). Heir and lineage succession has no Qud counterpart.

## Full row tables

Row-level evidence (about 60 rows with file and line cites) is in the two reader reports; summarized above. Re-run with `rg` against the cited paths if a row decides a build.

## Next step if selected

G1 and G2 would give the most parity per effort and fit existing owners. Either needs a task record naming rule codes (RULES_INDEX router), a focused test, and a rebuilt desktop-viewport check before any parity claim.
