CHECKPOINT: K5 base-cheat growth, 2026-10-23. Read-only design lane; this file is the only write. Proposals, not accepted decisions. Labels: SHOWN (read in code/doc this pass), STATED (a doc says it), INFERRED (my reasoning). Codes: F finding, D decision, R risk, T test, N do-not-build.

# K5: How the base cheat grows

Direction used, not re-litigated: CA5/D13 (enduring base-cheat upgrades carry; local research facilities, anchors and expended inputs do not), CA13/D24 (quiet faculty by default; systems and voices arrive through accompanying cheats or means), AD11 (base cheat carries and can improve; every crossing needs a carrier), AD26, AD28 (any cheat can become OP), AD29, AD30 (STATED: RULES_INDEX.md:160-199, CHEAT_ACCESS_DESIGN_DISCUSSION CA5 answer ~573, CA13 answer ~1349).

## F. Findings

- F1 SHOWN: `cheat_cards.js` card keys are `id, family, name, ui, terms, hooks, state, stages, observers, sources`. `validateCheatCard` checks only that `hooks/stages/observers/sources` are arrays and the whole card is JSON; element shapes are free. `state.awakened` (boolean) and `state.points` (non-negative safe integer) are the only validated state keys.
- F2 SHOWN: `stages` is empty in `SYSTEM_QUESTS_CARD` and read by nothing. `status_window.js` shows points (`entry.card.state.points`) and a fixed placeholder for quests. `awakenedStatusCard` picks the first held card with `ui === 'status-window'`, messages, and awakened !== false.
- F3 SHOWN: the shipped card is the quest system (`id: system-quests`, `ui: status-window`). Under AD29 that is an accompanying cheat, not the quiet base faculty. INFERRED: the base faculty needs its own card (`ui: 'quiet'`, allowed in PANELS) or the "base cheat" in a system world is the system itself. D1 below.
- F4 SHOWN: `ui` is one panel name per card. A stage that adds a second surface (an appraisal lens) cannot change `ui` without moving the card out of `awakenedStatusCard`. INFERRED: surfaces for later stages ride in `hooks` entries, not `ui`.
- F5 SHOWN (K1): cheat state is never reset on death but is dropped on heir succession; `buildLifeHeirSave` copies no `cheats` (K1 F2, life_experience_host.js:20-27). So any carry rule here needs that one copy line plus a test; it is not free.
- F6 SHOWN: the pilot quest design (AUDIT_REPORT.md:119, "D1") is one finite milestone row on a known skill, manual Claim, one point, "points buy nothing", claimed rows stay readable.

## D. Decisions this note proposes

- D1 Slots on one card for the faculty's own growth; sibling cards for anything with a different means, owner, carrier or loss condition (system, voice, companion, anchor artifact, patron). Reason: a stage is the same faculty getting better (carries, AD11). A sibling is a thing someone could steal, seal or lose separately (CA6/CA13). Default one card plus siblings; dial: a world may make the faculty itself a sibling of the host's institution (Paradise, RD10).
- D2 Stage definitions live in code (a table keyed by card id and stage id). The card stores only which stages are unlocked and how. Reason: balance fixes reach old saves, saves stay small, and a renamed stage cannot corrupt a card.
- D3 Per-life data goes in `card.state`; enduring data goes in `card.stages`. The heir carry rebuilds a fresh card and copies `stages` only (D4 section 2).

## 1. Growth model with existing fields

Field use, no new top-level keys:

| Field | Growth use |
| --- | --- |
| `stages` | Array of unlock records, append-only: `{id, at, via, carried}`. This is the enduring part. |
| `state` | Per-life working data: `awakened`, `points` (validated), `rows` (quest rows and claim status), `charges`, `cooldowns`. |
| `hooks` | Declarative surface and effect ids the stage turns on, e.g. `{stage:"S2", surface:"appraisal-lens", reads:[...]}`. Granting runs none (C0 contract holds); a consumer reads them. |
| `observers` | Who can notice the stage: `{stage:"S2", noticedBy:"appraisers", chance:"low", why:"..."}`. Feeds AD28 (power is relative) and CA13 exposure; inert until a consumer exists. |
| `sources` | Where each stage came from, one entry per unlock (route and world), so provenance survives the carry. |

Unlock is one pure function, `advanceCheat(state, id, stageId, {via, at})`, patterned on `awakenCheats` (validate the whole transition, push the record and the matching `sources` entry together, never leave a half state). Trigger predicates are code in the stage table and read live game facts through an injected read function (AR4), never from the card.

### Worked example: four stages on one card (system world, accompanying system card)

Stage table (code, not saved):

```
S0 dormant      trigger: granted at start                    reads: -        writes: state.awakened=false
S1 known-skill  trigger: awakened && player knows >=1 skill  reads: skills known, next displayed level
                with a visible native training method        writes: state.rows, state.points (+1 on claim)
S2 appraisal    trigger: any route in ROUTES_S2 (below)       reads: item/person facts the player has met
   lens                                                       writes: stages[], hooks surface "appraisal-lens"
S3 recovery /   trigger: S2 held && a means exists (an anchor reads: anchor ledger, current checkpoint
   anchor faculty  object, a teacher, a rite) and is held      writes: stages[], capacity of the replaceable
                                                              later checkpoint (CA7)
```

Card JSON as saved after S0 through S3 (S0 and S1 are the shipped `system-quests` shape plus the new fields):

```json
{"id":"system-quests","family":"system","name":"Quest system","ui":"status-window","terms":"gift",
 "hooks":[{"stage":"S1","surface":"status-window.quest-board"},
          {"stage":"S2","surface":"appraisal-lens","reads":["items.met","people.met"]},
          {"stage":"S3","surface":"anchor-list","reads":["anchors","checkpoint"]}],
 "state":{"awakened":true,"points":1,"rows":[{"id":"reach_skill:running:2","have":1,"need":2,"claimed":true}]},
 "stages":[{"id":"S0","at":{"day":0},"via":"start","carried":false},
           {"id":"S1","at":{"day":4},"via":"awakening+known-skill","carried":false},
           {"id":"S2","at":{"day":31},"via":"practice:examine-5","carried":false},
           {"id":"S3","at":{"day":90},"via":"anchor:held","carried":false}],
 "observers":[{"stage":"S2","noticedBy":"appraisers","chance":"low","why":"a lens that reads value leaves traces on the object"}],
 "sources":[{"stage":"S2","route":"practice","world":"home-world"}]}
```

S2 routes (default list, any one; "research is one route among others", CA stated in task brief): (a) practice, five distinct objects examined with an ordinary inspect action; (b) a teacher or appraiser who shows the trick; (c) a found text or tool; (d) spending points where the world's system sells it; (e) research in a facility (the facility itself does not carry, the stage does). Every route is reachable without the system. INFERRED reason: AD38, if a method reasonably works it works.

S1 specifics (SHOWN design from AUDIT D1): one finite row, only after awakening, targets the next displayed level of a skill the player already knows and can train, truthful empty board otherwise, manual Claim, one point, claimed row stays readable. Not a universal limit on later boards.

Read/write summary: S1 reads skills and writes `state.rows`, `state.points`, one status message. S2 and S3 write `stages`, `sources`; S3 additionally writes through the anchor owner (the card does not hold anchors; the anchor ledger does, CA6/CA7). The card never writes character stats; effects are the consumer's job.

Save impact (INFERRED from SHOWN validators): schema stays 1. Old saves have `stages: []` and `state` without `rows`, which validate. New code must (a) add a stage-record validator (new check, same file), (b) treat missing `rows` as empty, (c) never require a stage. A new build that adds a stage id an older build lacks is harmless to the older build only if it ignores unknown ids; add a "unknown stage id kept, inert" rule so a downgrade does not throw. Save and reload is a required completion check per AGENTS.md.

### Quiet-faculty variant (AD29 default)

Same mechanics on a card with `ui:"quiet"`, no status window, no points. S1 becomes a one-line notice in the log ("you handle this kind of work more easily than you should"), S2 shows as a lens row only where the world gives it a plain surface, S3 as the anchor list. The system world adds a sibling `system-quests` card; the faculty card still grows by the same table. Never evolve the faculty into a voice (D24).

## 2. Death, rebirth, heir

Default and dial per row (reason in brackets):

| Item | Same life | Heir / independent life | Rebirth (same mind, new body) |
| --- | --- | --- | --- |
| `stages` (enduring upgrades) | Held | Carried by default. Dial: partial, if the heir is not the faculty's holder and the world says the faculty follows blood or mind only (AD11: every crossing needs a carrier) | Carried (the mind crosses) |
| `state.awakened` | Held | Re-earned at the stage trigger, but a carried S1 or higher makes awakening immediate on the first fitting event (the faculty is already known) | Immediate |
| `state.points` | Held | Reset to 0 by default (expended inputs do not carry, CA5). Dial: bank up to N when the world keeps a ledger the carrier keeps | Reset by default |
| `state.rows`, claimed history | Held | Reset; the lifetime counter in `state.lifetime` (optional) can carry for display | Reset |
| Charges, cooldowns | Held | Follow means (CA5: preserving an upgrade is not refilling it) | Follow means |
| Anchors, checkpoint objects (S3 carrier) | Held | Do not carry (external objects, CA6); the S3 stage carries the ability to hold one | Per means |
| Siblings (system, voice, companion) | Held | Each by its own carrier; none inherits from the base card | Per means |
| Stolen / sealed / suppressed faculty | Stage stays recorded; effect gated by the world's rule | Same | Same |

Mechanics: the carry function takes the previous card, builds a fresh card from `optionalStartCard()` or the base-faculty template, then `advanceCheat` for each prior stage with `carried: true` and `via:"carry"`. It does not copy `state` wholesale. This is one new function and one `cheats` line in `buildLifeHeirSave` (K1 F5), on a defined list of crossings. An independent new character defaults to no carry; dial: carry when the player takes a "keep your faculty" start.

## 3. Points economy

- Sources (default): milestone rows only, one point per claimed row, each row tied to something the player actually did (a skill level, a first of a kind). Rows are finite and discovered, not a daily board.
- No attendance: no login streak, no daily reset, no "missed" state. Elapsed time grants and expires nothing. A row sits unclaimed forever; claiming later gives the same point.
- No offline expiry: loading a save after any wall-clock gap changes no row, count or availability. Idle gains from game time follow the existing idle rules, not the points system.
- Sinks (default): none in the first slice (SHOWN design: "points buy nothing"). Later sinks, each a route not the only route: stage unlocks where the world's system sells them (S2d), a re-roll of one row, a respec of nothing (no punishment sinks). Dial per world: price from 0 (free grant) to high.
- Shown honestly: status window row reads `System points: have 3 (earned 7, spent 4)`. Each row states have/need and why. Prices show before the spend. The panel says plainly when points cannot yet buy anything. No hidden multipliers; a world that rate-limits says the reason ("the system pays once per new skill level").
- Boundaries: points are a system-card number. A quiet-faculty world has none; progress there is stages only. A comic world may inflate the number (dial), never the honesty of the display.

## 4. Per-world dials

| World type | Faculty form | S1 | S2 | S3 | Reason |
| --- | --- | --- | --- | --- | --- |
| System world (litRPG, isekai tutorial) | Faculty quiet, sibling system card shows | Quest row, points visible | Bought or practiced | Anchor or checkpoint line in the system | The world's law is a visible ledger; it can say so |
| Cultivation | Quiet faculty; "insight" | Row replaced by a breakthrough-hint log line | Taught or found (an elder, a manual); the lens reads qi grade | Recovery as a rite tied to a cave or jade; anchor is an object | Sects trade knowledge; the cost is a debt or a rival who notices (observers) |
| Comic / farce | Faculty as a running gag, system loud | Points large, rows silly, still honest | Instant but wrong half the time, labelled | Respawn nonsense with real cost | Dial tone, not honesty; the counter still tells the truth |
| No-system world | Quiet intuition, never a window | One log line, no points | Better judgment of value and danger, no number readout | A habit of preparing a fallback (hearth, rented room); anchor is ordinary | There is no interface to host one; growth is skill and judgment |
| Paradise-style hub (host system exists) | Personal faculty distinct from the host's interface | Host quests are host cards, not these | Not guaranteed to hide from host detection (RD10) | Personal; host extraction rules still apply | Distinct reach and costs (STATED RD10) |

Defaults for all: quiet, no mandatory voice, stages unlocked by at least two routes, no stage required to finish the game (AD28, keep progression: ST13/ST17 STATED).

## 5. Failure scenarios and pinning tests

Per AGENTS.md lean tests: one focused file by system, `tests/cheat_growth.test.js`; extend, do not duplicate `cheat_cards.test.js`.

- T1 Half-advance: a throw inside `advanceCheat` (e.g. bad record) leaves the original state valid and unchanged (same invariant as awakening requires a message). Catches F-style torn state.
- T2 Old save: a card with `stages: []`, no `rows` loads and renders; S1 not offered before awakening; unknown stage id in a save loads inert.
- T3 Heir carry: after `beginHeir` + `completeHeirRequest` the heir save has the carried stages, `points` is 0, `awakened` follows the immediate rule, anchors absent. Today this fails (K1 F2); that is the regression.
- T4 No attendance/offline: advance a fake clock by 400 days on load; rows, points, availability unchanged and no message appears.
- T5 Claim idempotence: double Claim (click, then key) adds one point and one receipt; a claimed row stays readable.
- T6 No leak: S1 with no eligible skill shows a truthful empty board without naming an undiscovered skill; a stage not yet unlocked never appears in the DOM or log.
- T7 Quiet default: a base-faculty grant with `ui:"quiet"` creates no status window and no points field; the sibling system card adds them.
- T8 Route equivalence: S2 reachable by practice with no system card held.
- T9 Stolen/sealed gate: a gated stage keeps its record and stops its effect; ungating restores without a new unlock.
- Browser check at the target viewport (desktop/laptop first): status window with S1 row, claim, save, reload, heir start. Mobile deferred (AGENTS.md UI priority).

Risks: R1 stage records drift from code table (mitigation D2 plus T2). R2 points quietly become a daily grind (T4 and no reset clocks). R3 carry copies the status window into worlds that never had one (T7). R4 `ui` single-panel limit blocks lens surfaces (F4; use hooks, test before building a second panel).

## 6. Do not build yet

- N1 A new schema version or top-level card keys. The existing fields cover S0-S3.
- N2 A points shop, price curves, or refunds. Pilot says points buy nothing.
- N3 Daily/weekly boards, streaks, or any wall-clock timer.
- N4 Evolution of the faculty into a voice, patron or personality (D24 forbids mandatory).
- N5 An anchor/checkpoint implementation inside the card. The anchor owner and CA7 slots come first; S3 only grants the ability.
- N6 The appraisal lens surface and consequences of observers. Stage records and hooks as inert data first; a consumer later.
- N7 Cross-world fusion of base cheats, theft and seals. Keep the gate field open, build nothing.
- N8 More than S1 shipped as playable. S2 and S3 stay table rows and tests until S1 passes a rebuilt browser check.
