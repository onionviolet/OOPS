# G2, G4 and G6: companions, mirror rivals and small moments

2026-10-14. **PROPOSAL ONLY.** Extend [root G2/G4/G6](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#g-the-social-web), [rival chronicle](../../../../RIVALS_IDENTITIES_AND_FATE.md#a-persistent-rivalry-system-for-this-game) and [E2 casting](../../../../emergent/E2_STORYLETS.md#6-casting-algorithm). Generic arcs stay in [P12](../P12.md), dialogue realization in [P15](../P15.md), history in [P14](../P14.md), and power from bonds/stories in [P17](../P17.md). P19 adds social predicates and causal bindings, not another quest, text or power engine.

## G2.1: give P4 a real past before generating from it

**F1 shown/SOURCE:** P4 worktree `src/generated_people.js:5-8,22-25` creates roles, ordinary traits, needs, one supply goal and a keepsake label. There is no saved sibling, creditor, former teacher, debt ledger or chronology. Lines 68-79 implement meeting, trait conversation, supply help and settlement, not recruitment or a personal arc. The branch REPORT states broad E3/companions remain outside its proof. Do not call a keepsake string a backstory relationship.

Proposed additive personal-history payload, attached through the selected identity owner:

```text
PastHook
  id, personRef, origin: generatedBackground | authored | lived,
  worldInstanceRef, eraRef, generatorRevision, sourceClaimRefs?,
  episodeKind, atOrInterval, participantRefs[], objectOrRecordRefs[],
  actualConsequenceRefs[], personBeliefRefs[], disclosurePolicyRef,
  unresolvedGoalRef?, retentionRefs[], committedDrawRef?
```

Generate a mutually consistent episode graph once at person admission or explicit prospective enrollment. An unnamed lost sibling needs a real identity reservation, life stage and dated trace, not a newly rolled person on each search. A debt hook needs debtor, creditor, denomination and actual terms; P11/P21 own its settlement. A former master needs a saved teaching relationship and what was actually taught; LINEAGE G3.4 owns provenance. A keepsake names a real object only after an item/custody adapter exists. Older P4 records may receive newly authored hooks on opt-in, labeled background with coverage, but their prior observed facts and completed requests remain unchanged. Unknown history can remain unknown.

## G2.2: generated arc grammar with several routes

Use a hook to bind a P12 thread: `concealed → shared → explored → changed → settled_or_reframed`. These are illustrative states; each transition requires a real cause. The companion's NPC-to-player trust and prior received/witnessed experience can make disclosure more likely. High player-to-NPC trust does not substitute. Disclosure can also arrive through a letter, public dispute, a shared object or a personal choice, so trust grinding is not the only route.

| Hook / generated beat | Compatible responses | Supported consequence and boundary |
|---|---|---|
| Debt from a prior journey | Pay, negotiate, earn funds together, dispute the claim, find documentation, refuse | Actual creditor account and terms change; companion gratitude, shame or relief depends on their interpretation, not a universal loyalty reward |
| Missing relative | Interview, inspect an actual record, travel through authored routes, commission a search, wait | Clue/evidence and search progress change; no predetermined death or reunion is exposed in menus; sealed truth remains ID/route only |
| Rival teacher or interrupted training | Reconcile, contest, learn elsewhere, establish independence, request mediated teaching | Existing appointment/method permission and actual practice change; no automatic power from the title master |
| Unfinished ordinary ambition | Help open a stall, finish a manual, arrange an audition, teach a student, choose another vocation | Funded work/object/appointment changes; successful independence may mean leaving the party while remaining a friend |
| Conflict with another companion | Hear both accounts, work separately, mediate, alter duties, decline to judge | Both directed ties and group schedule can change; no compulsory choose-one companion lock |

The hero is a participant in a person's life, not the condition for all their progress. A companion can solve a hook with their own means, change their goal or refuse help. The P12 thread records that outcome and permits later contact. Recruitment, friendship, romance, employment and arc completion are separate. There is no universal loyalty mission required for useful companionship, and no guarantee that solving a problem yields unquestioning obedience.

For idle play, queued shared work and bounded NPC investigation use played time and frozen terms. Optional disclosures remain notices with explicit safe expiry/defer policy. A companion cannot sign a new player-funded contract or spend the hero's items without a standing policy covering that act. Existing actors may independently use their own held means. Browser closure does not age companions or advance missing-person danger under this proposal.

## G2.3: party roles and independence

**F2 shown/SOURCE:** `src/simulation_effects.js:379-382` supports join/leave; `src/party_battle.js:20-38` checks a particular helper's willingness and creates a two-fighter contest; `src/party_content.js:18-20` supports rest/re-rig with actual costs. Generic companionship does not follow from those bounded examples. `src/simulation.js:586-588` carries living party members for a selected transition, without a generic travel-willingness check.

Propose scoped permissions for travel, battle, healing, shared work, correspondence and disclosure. Each references current body/source/means, local law, commitment and person willingness. A familiar companion can decline a dangerous route while offering repair or navigation help. Wounds, equipment, technique knowledge, rest and effort remain in their existing owners. Sympathy text does not heal a body or manufacture a harness. Cross-world travel needs the timeline/cargo owner, independent instance identity and carried-memory/source manifest, including cancellation if a doorway becomes unavailable.

## G4.1: mirror rivals without automatic equal strength

Create a parallel decision path, not a level multiplier. Bind a recurring original peer to a different value weighting and actual opportunities. The player learns a method through careful experiment; the peer chooses a funded apprenticeship. The player keeps a promise at a cost; the peer prioritizes a deadline and risks a professional grievance. Both choices read current world law, stock, time and witnesses.

```text
MirrorThread
  id, playerLifeRef, rivalPersonRef, sharedQuestionRef,
  playerDecisionReceiptRefs[], rivalPlanRefs[], rivalOutcomeReceiptRefs[],
  knownComparisonRefs[], sourceProfileRef, status, retirementCauseRef?
```

Player milestones can awaken a future comparison opportunity or cast the rival into a relevant local scene. They cannot instantly grant the rival matching skills, fuel, wealth or knowledge. A rival only adapts to witnessed tactics or received reports, with actual practice/equipment/mentor costs. They may lag, surpass, settle into another vocation or become an ally. Defeat, humiliation, recognition, debt and faction support are independent. An old rival being much weaker makes the player's growth legible and is a valid result. The existing rival owner explicitly rejects constant rubber banding at lines 247 and 261-265.

A rival can mirror an apprentice, crafter, scholar, parent or merchant, not just a fighter. Contest, cooperation, sabotage, avoidance, purchase, teaching and negotiation stay reachable when supported. Revenge is one per-person response, never automatic. P21 owns surviving combat enemy aftermath; P19 owns the long social comparison. A past self is an ordinary NPC by the user's recorded lean, with no special counterpart bond unless a selected premise permits it; see [intro PN/IX](../../../../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md#pn-what-just-an-npc-means).

## G6.1: banter from shared knowledge

Bind a short exchange to speakers, audience, location, recent known event, directed relationship and tone. A shared workday can yield a practical joke, professional disagreement or quiet thanks. Banter may simply be warmth; mark texture-only lines as such. If an exchange discloses something or changes a tie, it must commit a supported knowledge/social act through CONTRACT and P15 before showing text.

Proposed selection stages: check copresence or an actual communication channel; intersect speaker knowledge with audience disclosure rules; bind an eligible semantic exchange; select a bounded original phrasing using P15's saved text mechanism; store the resolved exchange and reason refs. Hearing one line never reveals all a speaker's goals. No names of unintroduced relatives, private thoughts, hidden trait counts or sealed answer mappings enter the renderer. Silencing presentation preserves already committed social consequences; skipping ambient banter does not punish the player.

Repetition memory can track speaker pair, topic family and semantic outcome. Local cadence adjectives quiet, chatty, teasing, formal or contemplative tune frequency; repeated meaningful new work remains eligible. Use a shared recent-topic window, not one limitless transcript per pair. Delayed responses should remain attached to the original exchange. A companion arriving after a private conversation cannot refer to it until someone actually tells them.

## G2.4: small first personal thread and future gates

Proposal: one existing generated traveler elects an original work ambition. A saved prior failed commission supplies a concrete hook. After witnessed help, the traveler shares their account; the hero can investigate the terms, help perform a supported funded job, or decline. The traveler can also attempt it independently. Outcome changes a later appointment and two banter variants, without granting a new unsupported ability.

**A1** SOURCE gates hook chronology/identity, forward and reverse trust, disclosure alternatives, independent progress, invalid means, frozen draws and no texture effects. **A2** NATIVE gates a useful changed appointment, continued normal idle play and two reachable outcomes on fresh rebuilt origins. **A3** PERSISTENCE gates pending hook/arc/party permission/banter plus next draws across Save/reload/Export/literal-file Import. **A4** LEAK/FAILURE gates sealed IDs only, listener-specific projections, failed writes, unsupported hook revisions and missing packs. **A5** MIRROR/UX gates actual rival budget and absence policy, a peer who can fall behind, knowledge-limited comparison, and readable desktop panels at both required viewports. All are OPEN; human character voice and attachment are untested.
