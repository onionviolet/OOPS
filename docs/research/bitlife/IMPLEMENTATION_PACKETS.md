# BitLife implementation packets

2026-10-13. Ranked PROPOSALS. None accepted, implemented or runtime-verified. Each extends an existing owner; no other research lane is reassigned. Finding IDs refer to [REPORT.md](REPORT.md).

Shared acceptance for any later authorized UI slice: rebuild and exercise a fresh test origin at 1366x768 and 1920x1080. Keep text readable, routine controls reachable and independent panels useful. Mobile optimization is deferred. Any saved-state change needs a migration or explicit compatibility decision plus Save/reload/export/literal-file Import proof. Use synthetic test lives, not user saves. World-defined lifespans, limits, repetition rules and carry sets stay per-world adjectives. Sealed facts never enter a recap merely because the engine knows them.

## P1. A life remembered (F2, F15)

- **Smallest result:** extend the existing ended-life view with one original appraisal, `Steady hand`, when authoritative state proves one original-world promise was kept. Otherwise show an unranked personal epitaph. Include the cause and date. Do not add a reward or universal collection.
- **Seams:** `src/life_experience.js` `lifeEpitaph`/`lifeGrave`; `src/chronicle.js` `life.endedAt` and `relationships.villageElder.ties.dutyKept`; `src/life_record.js` for optional display context only. Host UI route needs tracing before a write reservation.
- **Player path:** accept duty, finish it, continue an opted-in mortal life, see what mattered at its end. A life without that duty still receives a meaningful recap.
- **Acceptance:** label derives from the authoritative tie, never biography text. Both qualifying and nonqualifying lives render truthfully. Viewing/reloading does not pay rewards, alter the estate or create events. An old save without enough evidence says that, and does not invent an accomplishment. Appraisal and inherited grave remain consistent after persistence round-trip.
- **Bound:** one existing original-world cause. A cross-life collection or new title effect is a separate proposal. Any later eligibility/award repetition is set by its world, not a global fixed grant.

## P2. An honest succession receipt (F3, F12)

- **Smallest result:** before the existing succession command, show the actual recipient basis, estate assets, settled debt, papers requiring study, taught knowledge and remaining duties. Clearly state this route creates a new kin/apprentice life. Do not label it as taking over an already-aged child.
- **Seams:** `src/heir_inheritance.js` `deriveHeirLeftovers`, `heirLeftoverLines`, `applyHeirLeftovers`; `src/chronicle.js` `createHeirChronicle`; `src/npc_lives.js` is a boundary to inspect, not a source of playable-child state.
- **Player path:** write a lesson or teach it, keep/return belongings and settle obligations, review succession after death, then continue with the existing recipient. Cancel leaves the ended life intact.
- **Acceptance:** preview agrees with the actual inherited delta, including empty estates and insufficient cash for debt. Teaching and papers stay distinct. No duplicated goods or copied predecessor XP. Revalidate the receipt before applying if state changed. Cancel, reload and import do not apply inheritance. Existing heirs are not retroactively rewritten.
- **Bound:** preview existing behavior. Choosing and inhabiting a living child needs an explicit actor identity, age/body/skills, relationship, custody and knowledge carry contract, plus conflict handling across NPC owners. That larger project is deferred.

## P3. Known people in the life view (F4, F7, F9)

- **Smallest result:** one read-only relationship card groups a known elder's role, last meeting, remembered cause, public pending invitation and next available interaction. It links to existing controls rather than adds social currency.
- **Seams:** `src/people_knowledge.js` `knownPeopleView`; `src/event_feed.js` leads; `src/chronicle.js` relationship memories and command gates. Follow the relationship lane for future architecture.
- **Player path:** meet the elder, make/keep a promise or settle a grievance, return later and see the changed relationship and available invitation.
- **Acceptance:** no private strength, hidden axes or future-family identities appear. Settled grievance is marked closed while its history remains visible. Expired invitation explains the missed window, not a broken button. Two known people with similar names never merge by display name. Rendering causes no mutation.
- **Bound:** one existing person, no romance, universal approval meter or hidden preference reveal. Role and recurrence policy belong to the world.

## P4. An optional life aim (F10)

- **Smallest result:** original `Reliable companion` aim combines two existing actions: fulfill archive duty and return a completed patrol's loaned kit. It is optional and gives an explanatory completion entry with no power reward. Derive status from current authoritative owners; persistent completion history is an explicit later schema choice.
- **Seams:** `src/chronicle.js` `dutyKept`; `src/village_career.js` completed/returned counts and `villagePromotionRequirements`; `src/life_record.js` may display a milestone, never determine eligibility.
- **Player path:** opt into the aim in an original Frontier life, do the ordinary actions in either order, see which predicate remains, finish and review the evidence.
- **Acceptance:** no player need reset or chase a real-world expiry. Leaving work early or paying for a kept kit does not count as returning a completed-shift kit. Repeated rendering does not mint milestones. Reset/succession explicitly distinguishes this person's aim from the predecessor's. No future-secret checklist, reward farming or state derived from log prose.
- **Bound:** one world-authored aim with a declared scope/repetition policy. No copied challenge names, real-money archive, network events or new prestige layer. Later canon-world aims must use that world's actual rules.

## P5. A period recap beside routine controls (F1, F5, F9, F13)

- **Smallest result:** read-only recap for a supported elapsed interval: known changes, invitations still open, and completed actions. Show it beside existing routine controls. Reuse safe routine compression proposals; do not ship a new annual jump.
- **Seams:** `src/life_record.js` `lifeRecordView` and yearly folds; `src/event_feed.js`; `src/chronicle.js` `nextChronicleBoundary`/`advanceChronicle`; `src/game_time.js` for dates. Identify the existing routine host before any follow-on implementation.
- **Player path:** let a known routine run, pause at its existing boundary, read what changed, respond to a current lead, resume.
- **Acceptance:** recap distinguishes world calendar year from character age. News never calls for a choice already resolved or missed. A decision interrupts through its existing owner; no unseen NPC event leaks. Reloading the same interval does not reroll or duplicate it. Any lossy record is described as selected highlights, not complete history.
- **Bound:** presentation only. School-year turns, catch-up scheduling, arbitrary offline replay and cross-world age-rate changes remain with existing time owners. No equivalent local tests should substitute for fresh desktop behavior proof.
