# Ranked implementation packets

2026-10-13. All packets are **PROPOSALS**, unaccepted and unimplemented. Original fixture names are Mira, Tovin and Sela. They are not new MoL canon residents. References F1–F13 are in [REPORT](REPORT.md).

Each UI packet targets a 1440×900 desktop viewport: readable clock, routine actions and notebook visible together. Mobile optimization is deferred. Future gameplay acceptance requires an own rebuild, fresh-origin browser exercise and applicable Save/reload/literal Import and compatibility proof. No such implementation or play proof occurred in this lane.

## P1: One observed appointment on the existing clock (F1, F2)

**Smallest result:** one courier meets one archivist at a declared local window. The player can observe the meeting or arrive late and receive only a qualified report. This can first be demonstrated in an original ordinary-life fixture without introducing a reset layer.

**Seams:** `src/world_rhythm.js` window semantics; `src/chronicle.js` deadline and hearsay distinctions; `src/book_world_mol_state.js` local clock and boundary pattern; `src/book_world_mol_actions.js` co-location/attention checks. These are patterns, not permission to overwrite the existing visitor branch. Add route content through its selected owner only after acceptance.

**Player path:** follow Tovin, discover the meeting interval, choose to attend, then inspect the recorded observation. On a control path arrive after close and hear a later attributed account.

**Acceptance:** both actors are actually present in the interval; boundary checks at opening and closing agree with the UI; no reward is granted by rendering or late arrival. Reload/import preserve observed versus reported evidence and current actor location. Same inputs reproduce the same routine without rerolling.

## P2: Notebook distinguishes history from this attempt (F5, F6, F10)

**Smallest result:** one observed appointment row with time, place, attribution, remembered history and current fulfillment. Side-by-side clock and records use the desktop screen. An optional reminder is player-authored, not an omniscient quest reveal.

**Seams:** actor knowledge records used by `src/book_world_mol_actions.js` and presentation in `src/book_world_mol_host.js`; event status and hearsay in `src/chronicle.js`. A notebook is a view over qualified records, not another source of truth. Loop attempt metadata requires P4 before a cross-reset UI can claim support.

**Player path:** observe Mira’s meeting, set a reminder, return later, inspect whether it was fulfilled in the present attempt. In a later eligible reset fixture, the old observation remains marked as prior history while the present appointment is pending.

**Acceptance:** unknown people/events stay absent; rumors never become observation merely by opening the notebook; reminders fire at most as defined by the selected world policy and pause/stop setting. Save/reload/import retain attribution and alarm time. A remembered completed action cannot unlock a current delivery gate.

## P3: One intervention changes an interlocking routine (F2, F3, F12)

**Smallest result:** a delivered morning parcel changes Mira’s evening destination. Tovin’s delivery and Sela’s later request use the actual parcel owner and current event facts. Baseline and changed routes remain playable.

**Seams:** conditional jobs and NPC commands in `src/book_world_mol_actions.js`, actual actor/location context in `src/book_world_mol_host.js`, local boundaries in `src/book_world_mol_state.js`. Routine selection must honor finite attention and ongoing work rather than teleport a busy actor or create goods.

**Player path:** first learn the baseline exchange, then deliver the parcel early; discover that Mira stays at the archive instead of taking her baseline route. The notebook marks the old route as a prior expectation until newly observed.

**Acceptance:** A/B branches have distinct current locations and available actions. No-delivery control keeps baseline behavior. Late delivery follows its authored consequence. NPC-held materials and player goods remain conserved. Reload/import mid-route preserve the changed branch and current job, and repeated view calls make no changes.

## P4: A source-qualified reset contract for a separate eligible route (F4, F5, F7, F11)

**Smallest result:** an original bounded repeat fixture proves retained observation versus reset appointment and parcel. A MoL adaptation follows only after its existing private canon owner qualifies entry, remembering actors, carry, trigger and exit. Do not retrofit a three-day Zelda span into MoL or reset the current nonloop visitor save.

**Seams:** `src/book_world_mol_state.js` schema and clock contract; its actor/world state accessed by `src/book_world_mol_host.js`; `src/chronicle.js` illustrates why monotonic life clocks need separate treatment. Exact native item/save publisher and compatibility owners require a focused implementation read before writes; this lane has not audited their reset behavior.

**Player path:** observe a useful route, spend a parcel, choose the authored restart, return with remembered timing but reacquire the parcel and renew the appointment. A separate failure path uses the declared recovery rule.

**Acceptance:** explicit field policy partitions retained knowledge, reset facts, bodies, material stock, relationships, work reservations and clocks. Repeated reset/load cannot duplicate goods, jobs or experience. No unqualified actor remembers. Save/reload/import before and after reset match the chosen policy. Cancel/refund and cross-world cargo rules are decided before admission. Existing visitor saves remain supported by their matching reader or a reviewed migration.

## P5: Safe waiting and time controls (F8–F10, F13)

**Smallest result:** “wait until known appointment” advances ordinary local time to the next known opening, processes crossed boundaries, and stops at a required choice. Hour selection and slowdown are separate optional per-world mechanics, admitted only by an in-world source. UI speed is also separate from fictional time magic.

**Seams:** `src/world_rhythm.js` next-window calculation; `src/chronicle.js` and `src/book_world_mol_state.js` next-boundary functions. Shared scheduler, absence/offline and save owners need a focused follow-up read before any implementation; no new universal scheduler is selected here.

**Player path:** set a known appointment reminder, wait through ordinary work changes, review the receipt, then manually choose the meeting action. A control wait across its closing time produces a missed opportunity, not its prize.

**Acceptance:** small-step and jumped execution yield equivalent authored event state and materials; crossed choices halt advancement; past/final invalid destinations fail with a reason. No unattended gain is inferred for frozen worlds. Save/reload/import preserve queued wait and stopping condition. Slowdown does not silently increase every skill’s training yield or freeze unrelated combat.
