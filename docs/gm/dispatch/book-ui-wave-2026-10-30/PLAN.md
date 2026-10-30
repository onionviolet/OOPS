# Book UI and feature wave (2026-10-30)

Weibao: "improving intuitive ness for areas like UI, working on unimplemented UI, working on implementing things needed for the UI, taking into consideration info from Fufture COI readings nad stuff not considered iyet in the earlier readings? Send out similar UI and feature implementators for other read books? Send out sonnets to work, that can use advisor, dont duplicate work of other chats, if the other's contexts are getting full, make them hand off and pass to this one".

Coordinator: the "Book UI and feature wave" session. Proposal status for everything a lane designs (AD32). Rules: AD36, AD38, AD43, AD45, AR1-AR16, UR1-UR75, CLR3, WPR30.

## Inputs

- Merged reading rows (private, gitignored) for eight books: `docs/research/novels/<book>/private/wb8-merged-2026-10-30/` (`registry.jsonl`, `scenes.jsonl`, `fills.jsonl`, `extras.jsonl`, `affordance.json`, `merge_report.json`) for circle-of-inevitability, harry-potter, mother-of-learning, shadow-slave, godclads, perfect-run, reverend-insanity, soldiers-life.
- Shared-seam table: [reading gap map](../../../research/READING_GAP_MAP_2026-10-28.md) (GM codes; GM20 and GM21 were unowned "until an other-book wave").
- Representations (merged views, round 2 items 17-19): `docs/representations/*.md`; bridges in `src/read_models/` (L13).
- Engine seams to consume, never fork: `src/ability_records.js`, `src/spell_seam.js` + `src/spell_adapter_hp.js` (GM40), the ladder bridge, `src/observer_view.js`, `src/ui/figure.js`, `src/ui/scene_card.js`.

## Lanes (Sonnet sessions, own worktree each)

| Lane | Book | Delivers |
| --- | --- | --- |
| `bk-coi` | Circle of Inevitability | Per-representation list of what COI needs that the view lacks (round 2 item 17), cheap data-driven fixes in unheld files, and COI queue items routed to the sonnet-wave family owners |
| `bk-hp` | Harry Potter | One host-consumed HP slice at the AD43 floor (GM20/GM21 ordinary day-one life) with its UI, on the GM40 HP adapter |
| `bk-mol` | Mother of Learning | One host-consumed MoL slice at the floor (academy access GM6 and the loop view), consuming `sw-death`'s restart model rather than building one |
| `bk-ss` | Shadow Slave | One host-consumed SS slice at the floor (rank ladder and the crossing view), consuming the shared ladder and worlds-and-crossings seams |

## Not owned here (route instead)

- LOTM families, COI's second pathway (GM9 to `sw-adv`), regions and institutions (GM19, GM6 to `sw-road`), news (`sw-calendar`): sonnet-wave lanes; COI items go to them as queue entries.
- Host registration in `src/simulation.js`, `src/domain_registry.js` and `src/book_world_lotm_*`: `floor-wire` (`local_97d3526c-5987-4205-aac9-028a22ff0fab`) is the single writer. Lanes send patches.
- `src/spell_*.js`, the HP spell adapter included: `spells-gm40`. `bk-hp` consumes it and sends patches.
- Reverend Insanity (Gu upkeep): the sonnet-wave coordinator's proposed lane card, not this wave.
- Extra input: the sonnet coordinator's reading coverage audit (COI F1-F25, per-book readiness, HP/MoL/RI briefs; COI merge covers 28 of 294 shards; `build_cast_pack.mjs` is LOTM-place-bound), forwarded to all four lanes.
- Player-facing defects from the UI audit: `ui-defects`. Homes, gathering and companions views: the General UI coordinator's queue.

## Handoff

Any session in this repo past about 70% context checkpoints and hands its remaining plan to this coordinator by message.

## Budget

Weekly all-models was 64% at launch (resets 2026-11-02 18:00), above the UI wave's 60% launch line; Weibao's request overrides it. Cap four lanes. Lanes stop new work and checkpoint at weekly 70%.

| Time | Event | Weekly | 5-hour |
| --- | --- | --- | --- |
| 10-30 14:3x | Plan written; four lanes starting | 64% | 39% |

## Round 2: more to consider (2026-10-30 14:4x)

Weibao: "also general UI, like the ability stuff and more? Also implementing whats needed and more? the relationship stuff? Foundational Engine required implementation and more? absorbing best ideas from externally and more? ... Pet UI? party ui? General UI overhaul to give mroe needed capabiltiies and address gaps? ... make sure things reach comepletion and wont leave stray stuff thats just half finished? Maybe send chat to reconciliate stuff?"

Findings (evidence at 14:4x):
- F1. The 21 `rep-*` branches show 2-8 commits ahead of master, but `git cherry` and subject matching show their work landed under other hashes (integrator rebase). The strays are the 41 worktrees and stale branches, plus "implemented, below floor" slices scattered across checkpoints. No single list exists.
- F2. Abilities: `rep-abilities` round 3 (RS1-RS24) is proposals. Next slice per CHOICES #2: ghost fill, plus the G17 `learnView` Skills tab. The owner is the General UI coordinator's abilities session.
- F3. Relationships: web and bond stages are merged. Next: G18 `whoKnows` into a Knows home with an ask action into talk, and relationship bars. P3c (loyalty, keeping quiet) feeds them. The owner is the General UI coordinator's relationship session.
- F4. Companions, party and pets have no owner. Code exists (`party_ui.js` 49 lines, `companion_roster.js`, `party_battle.js`, `tempo_allies.js`, `companion_wishes.js`), along with a palette (`COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md`). No representation round 1 or 2 (reference games) ran for it. P5 (allies by goals and orders) is CHOICES #7, after P4.
- F5. Foundational engine for UI: L13 has unbridged models (G14 gatherings, TC12 curfews, G17 `learnView`, G18 `whoKnows`). The owner is `sw-bridge` (sonnet wave).
- F6. No one owns a whole-game fresh-player capability pass: what a player needs and cannot find, see or do across views. `ui-defects` fixes listed audit defects only.

ACT NOW (done in this round): F1 to F6 recorded here; lanes below.
ACCOUNT FOR NOW: every new lane ends at the floor or writes "implemented, below floor" plus a line in the reconciliation ledger. No lane leaves an uncommitted diff or an unreported branch.
LATER / DELEGATE: F2 and F3 go to the General UI coordinator (owner of those sessions). F5 goes to the sonnet coordinator for `sw-bridge`. Gathering and seasons stays queued with the General UI coordinator.

| Lane | Delivers |
| --- | --- |
| `bk-party` | Companions, party and pets: representation rounds 1-2 (reference games), one host-consumed slice at the floor, consuming `tempo_allies` and the roster rather than P5 |
| `bk-gaps` | Whole-game fresh-player capability pass at 1920x1080. Fixes top gaps in files no one holds and routes the rest to owners |
| `bk-recon` | Reconciliation: one ledger of every half-finished slice, branch, worktree, patch and below-floor receipt, with owner and next step. It cleans only what is provably landed and idle, and lists deletions for Weibao's yes |

## Round 3: design rounds (2026-10-30 14:5x, weekly 66%)

Weibao: "Debt and stuff can be part of corportation, or like the benefits system, more to consider? Send out design rounds for stuff that need them? OVerall UI pass to make things intuitive? different design posbbilities and more?"

| Lane | Delivers |
| --- | --- |
| `bk-benefits` | Round 3 in `ECONOMY_AND_INSTITUTIONS.md`: membership, benefits and debts as one institution package, three or more UI forms with a default, and gallery prototypes. It fits `bk-mol`'s academy access. |
| `bk-ui-directions` | `docs/audits/UI_DIRECTIONS_2026-10-30.md`: four whole-UI directions (refined panels, day hub, task-first, unconventional) as static mocks, plus the list of features still lacking a design round |

Status at 14:5x: `bk-coi` committed on its branch. `bk-mol`, `bk-ss` and `bk-party` have slices written with focused tests passing and are waiting on queued builds (the slot limiter is busy). `bk-hp`, `bk-gaps` and `bk-recon` are working.
