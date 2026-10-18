# Format reconciliation, parts 1–3

2026-10-14. Executes sections 1–3 of [NEXT_PROMPT.md](NEXT_PROMPT.md) at Weibao's request ("lets work on the first 3 parts? /moretoconsider?"), with a more-to-consider pass. Sections 4–5 (prototype, verification, recommendation) are not started. Status: source-read findings and proposals. No runtime edit, build, browser check or commit.

## Section 1: Authority recovered

| Code | Authority | What it fixes for this work |
| --- | --- | --- |
| AU1 | [PROJECT standing priorities](../../../PROJECT.md#standing-priorities-and-document-authority) | Desktop/laptop first at 1366×768; mobile deferred; canon-first world order; agent prompts cannot add gates |
| AU2 | [USER_VISION Hanzi entries](../../USER_VISION.md#hanzi-field-preference-and-blending-with-the-base-game-2026-10-02) and [WANDERING owner](../../WANDERING_ZONES_AND_INSIGHT.md#hanzi-field-preference-and-native-screen-composition-2026-10-02) | Hanzi style is endorsed. **The center action menu stays the primary exploration surface** (Weibao, 2026-10-02); Hanzi is an optional supporting view bound to the same targets and commands |
| AU3 | [Format assessment](../../YAIR_FORMAT_AND_STORY_DELIVERY_2026-10-14.md) and [art/reference report](REPORT.md) | O2 (text-led scenes plus small views) is the best current hypothesis; portraits optional; all proposals |
| AU4 | [Play beyond menus D6](../../PLAY_BEYOND_MENU_SELECTORS_CONSIDERATIONS_2026-10-14.md#d6-proposed-end-to-end-flow) | Read → local draft → submit through the existing host → publish → render receipt. Preview never spends or rerolls |

**F1. Authority gap.** Weibao's format and portrait questions on 2026-10-14 are quoted in REPORT.md but have no USER_VISION entry. Account for now: record them when section 5 updates owners, with "question answered by proposal, not accepted policy" status.

**F2. Correction to the prompt's framing.** The prompt says to preserve Hanzi as "the preferred local wandering style". True for style. It must not be read as "Hanzi becomes primary". The prototype in section 4 should put a view beside the center menu, not replace it.

**Dirty state.** All three format docs and this folder are untracked and owned by this thread. Several Codex runs are active in this repo and a worktree; none owns these paths. This pass wrote only this file.

## Section 2: What YAIR should preserve and improve

### C1 verified: how characters became recognizable

The earlier C1 table holds up against source. One refinement matters for the prototype: the current fork already has a **portrait-free recognizability loop** in the Village traveler system, and it is the strongest existing example.

| Code | Source | Recognition mechanism actually present |
| --- | --- | --- |
| CH1 | Original YAIR dialogues (per REPORT C1, upstream `e3356432`) | Named speaker, conditioned textlines, unlocks and rewards. Identity through what they give access to |
| CH2 | Proto23 capture (per REPORT C1) | Small repeated interactions (the cat counter) that change availability and end in a retained companion |
| CH3 | Current fork `src/generated_people.js` | Each traveler has a name, role, 2–3 hidden traits revealed one per **Talk**, a need, a supply goal, a purse, a keepsake, a schedule (visiting 3 days of 5, then on the road), a current action chosen by traits, and a relationship that changes to "helped with supplies" |
| CH4 | `src/story_requests.js` + `src/lore_history_state.js` | Request is funded from the traveler's own purse into escrow; deliver/decline writes a receipt with audience, known facts and exact deltas |
| CH5 | `src/story_aftermath.js` | A later storylet names the traveler and the item, and its text and XP differ for delivered vs declined |

This loop already hits most of the section 2 checklist without art: a named person with a life schedule, gradual disclosure, ordinary work, a real cost, and a later callback that reads the actual outcome. What it lacks is **voice and place**: the UI is a `details` list ("Known traits: … Need: …") and the callback is a generic chance storylet, not a scene with that person.

### Preserve and improve

| Code | Preserve | Improve (proposal) |
| --- | --- | --- |
| PI1 | Center menu, simultaneous character/inventory/log panels | Add a scene surface beside it, not instead |
| PI2 | Text and stable name as the complete baseline; no portrait dependency | Short per-person voice lines keyed by trait and relationship; reuse CH3 traits rather than new data |
| PI3 | Gradual disclosure (traits learned by talking) | Show it in the scene: unknown traits stay unknown; no silhouette or token implies role the player hasn't learned |
| PI4 | Receipts as the only source of "what happened" | The callback should happen *with the person present*, in the place, not as an anonymous chance card |
| PI5 | Book worlds keep their own rules and voices | The same situation shape (CH3–CH5) is reusable; world packs supply institutions, vocabulary and exceptional rules. B1–B9 in REPORT stand |

**Reference comparisons needed for section 4:** none new. Wildermyth's role casting answers "who can fill this scene" and YAIR does not need it yet: the traveler loop binds a specific person by id. Endless Sky's offer conditions match what `salientRequestPerson` already does. Skip further reference reads.

## Section 3: Causal model traced through one real situation

Traced situation: **a Village traveler's supply request** (CH3–CH5). Chosen because it is native, reachable after the elder enables storylets, persists, and already has a later reader. The richer causal-story proofs (Tarin, Asha, Orin delivering a kit to Nell) are covered below as the exceptional-rules test bed.

| Causal field | Where it lives today | Status |
| --- | --- | --- |
| Participants | Player + one generated traveler (`generated_people` save block, ids `traveler_1`–`traveler_3`) | Real ids. **Not** simulation actors |
| Place | Hard-coded `Village`; plan rejects outside Village | Real, single-place |
| Prerequisites | `storylets.enabled` fact (elder talk); traveler met, present, goal unmet, purse ≥ reward, no pending request | Real, checked at commit |
| Intentions | `goal:{id:'supply',item,reward}`; `action` chosen from need pressure and traits | Real but shallow; one goal type |
| Means | Player inventory holds the exact item | Real; one means only |
| Time and cost | Fee escrowed at raise; item −1 on deliver; traveler away on road blocks settlement; "no absence penalty" expiry | Real |
| Committed outcome | `r.status` delivered/declined; traveler `goal.fulfilled`, `relationship`, supplies; optional `settle` makes them resident | Real |
| Knowledge | Receipt `audience:['player',p.id]`, `known:{person,item,need}` | Real, attributed |
| Later consequence | `story_aftermath` storylet 12+ min later reads the receipt; text/XP differ by result | Real but see F3–F5 |

### Findings

**F3. Callback ignores presence (ACT in section 4 if this situation is used).** `bindStoryAftermath` reads only receipts. It does not check whether the traveler is in Village or on the road, so the card can say a traveler "remembers…" while that traveler is away on the road. Fix in the existing owner: require the receipt's `targetPerson` to be present, or defer. Small, no schema change.

**F4. Four person owners, no bridge.** Generated travelers (`generated_people`), simulation people/actors (`causal_situations` requires `s.people[id] && state.actors[id]`), Village yearly lives (`npc_lives.js`), and native NPCs (`models/npc.js`) are separate. `people_knowledge.js` projects witnessed content across some of them. A traveler cannot be a `causal_situations` participant today. **Smallest missing connection:** none is needed for the prototype; the traveler loop is self-contained. Do not build an identity service for a demo. Revisit only when one situation needs a traveler and a simulation actor together.

**F5. History is scoped and finite.** `lore_history_state` accepts only `worldId:'base.frontier'`, `targetPlace:'Village'`, six action kinds, 96 receipts with pinned eviction. That is honest for Village. It must not be advertised as book-world memory; a book world needs its own receipt kinds or a widened validator with a compatibility decision.

**F6. Exceptional rules already have a test bed.** The causal-story profiles give the same delivery three protection laws: `none` (Tarin), `covenant` (Asha), `future_anchor` (Orin, identity-local anchor). That is the right pattern for "named canon identity fixed, power needs actual rules": the law is a profile with its own handlers, not a role tag. `projectVillageScene` already turns admitted records into a scene with phase label, deadline text and grouped approaches.

### Convergence without erasure

Delivered and declined both reach the same aftermath scene. The scene reads the receipt, so it differs in line, offer and XP, and the traveler's relationship, purse and supplies stay different afterward. This is the pattern to keep: **shared later scene, branch facts read from receipts**. Expected canon events work the same way in a book world: a scene is eligible only if the receipts and facts it presupposes exist. If the item never arrived, a scene premised on its arrival does not fire, and nothing restores it.

### Separation of truth, knowledge, presentation

| Layer | Traveler loop | Causal-story loop |
| --- | --- | --- |
| Simulation truth | `generated_people` state, inventories, escrow | `simulation.situations[*].privateTruth`, phases, receipts |
| Participant knowledge | `knownTraits`, `met`, receipt `audience`/`known` | `validateKnowledgeBasis` (recollection/observation/instruction/inference, attributed) |
| Presentation | `generated_people_ui.js` list; storylet label | `projectVillageScene` read-only projection |

The traveler loop lacks a scene projection; the causal-story loop has one. **That asymmetry is the prototype target.**

## More to consider

**ACCOUNT FOR NOW**

- **M1.** Prototype target for section 4: a scene view for the traveler loop that reuses `projectVillageScene`'s shape (title, phase label, paragraphs, latest account, grouped actions), fed by the existing traveler view and request commands. Compare it against the current list with the same commands. This tests the real uncertainty: does placing a person in a scene make the callback memorable, with no art.
- **M2.** Selection is free: the scene and list share traveler ids and call the same `planStoryRequest`/`talk` commands. Opening a person does not reveal undiscovered traits or count as Talk.
- **M3.** The callback must be shown inside the person's scene when they are present (F3). That is the visible payoff the comparison is judged on.
- **M4.** Hanzi stays a supporting view (AU2). The prototype can add a small Village glyph strip with travelers as marks only if it binds to the same ids; it is optional for this comparison.
- **M5.** Persistence is unchanged if the prototype is presentation-only. If F3's fix lands, it changes eligibility, not schema; still needs reload of a save with a pending aftermath.

**LATER / DELEGATE**

- **L1.** Voice lines per trait and relationship (PI2). Small authoring task after the comparison shows a scene is worth it.
- **L2.** A second goal type or second means for travelers (e.g. introduce another traveler who has the item). Gives "different approaches, shared later scene" a real second branch.
- **L3.** Person-owner bridge (F4) only when a situation needs both kinds of person.
- **L4.** Widened history scope for a book world (F5), with a save compatibility decision.

## Next

Section 4 builds M1 with M2–M3, at 1366×768. Section 5 verifies, records F1 in USER_VISION, and recommends.
