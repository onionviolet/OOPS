# World core kit, successor root (from round 16)

Claude (root), 2026-10-14. Continues the [world core kit](WORLD_CORE_KIT_2026-10-14.md)
(rounds 1-15, about 1,950 lines) as its NX11 asked. Codes, cards and the
readiness baseline (K19-K34 runtime 0 met of 288) carry over unchanged.
Method: [world core kit core audit](../audits/WORLD_CORE_KIT_CORE_AUDIT.md).

## Round 16: core stuff each world needs, with the game wave as evidence

Request (Weibao, 2026-10-14): "core stuff needed for each world to be
implemented in depth? do a 'more to consider? other stuff and more? save and
extend accordingly Send out codex as useful?' for each aspect?"

Rerun triggers fired: 10+ design docs landed since round 15, and a new
evidence set exists (21 game passes plus per-game aspect passes A01-A12 in
the [game research wave](../gm/dispatch/game-research-wave-2026-10-14/ASPECTS.md)).
That matches the audit's "W1 delta for all priority worlds, W10 references"
row.

### New angles (KW)

| Code | Angle | Do |
|---|---|---|
| KW1 | **Aspects map onto kit parts.** A01 dialogue and A02 narrative delivery have no single kit part; each world card should say how its people talk (address, honorifics, small talk, relationship-gated lines) and how story beats reach the player | Lane TW-K drafts the mapping A01-A12 to K1-K34 |
| KW2 | **Per-world dialogue grammar.** Heaven's Vault (evidence-gated lines), Vagrus (event steps), Taiwu (relationship and sect-gated talk), Discworld (canon voice) are four distinct models; a world picks one as its default | TW-K, proposal per priority world |
| KW3 | **Event engine shape per world.** Vagrus, HoI4, KoL and Warsim separate eligibility, priority, cooldown and closure; the kit's canon-event part should use the same four slots. *Corrected round 17 (FK2): the four slots are our audit contract, not an engine all four games share* | TW-K, check against canon-events lanes |
| KW4 | **Save aspect per world.** A04 findings (versioning, what is derived) become a kit row: what a world's state must save versus recompute | TW-K, with the save shape owner |
| KW5 | **Little stuff per world.** About 500 small touches from the wave; each world card gets the ones that fit it | Lane TW-S |
| KW6 | **Fidelity before breadth still holds (NX12).** New rows are proposals for card refresh (NX8), not new gates | ACCOUNT |

### Lanes this round

[Topic wave 2026-10-14](../gm/dispatch/topic-wave-2026-10-14/COMMON.md): TW-K (W1 delta for priority
worlds plus KW1-KW4), TW-S (little stuff routing), TW-L (levels consistency).

## Round 17: TW-K, TW-L and TW-S folded (2026-10-14)

Request (Weibao, 2026-10-14): "Fold the topic-wave and synthesis returns into
the four root palettes, corrections first, then pick the next playable slice."
Sources: [TW-K](../gm/dispatch/topic-wave-2026-10-14/tw-k/OUTPUT.md), [TW-L](../gm/dispatch/topic-wave-2026-10-14/tw-l/OUTPUT.md), [TW-S](../gm/dispatch/topic-wave-2026-10-14/tw-s/OUTPUT.md).

### Corrections

| Code | Correction | Source |
|---|---|---|
| FK1 | W37.H1 (home rain leaking into visitor worlds) is history for the pacing path: `homePacingContext` gates native rain by world, and the calendar and weather modules are on HEAD. Journey, native persistence and taste gates from W36 stay OPEN | TW-K-C1, TW-S-C4 |
| FK2 | KW3 overstated common evidence. The four event slots are our audit contract; Vagrus shows separate histories and recurrence, KoL's journal is a third-party adapter, Warsim shows quiet outcomes versus redraw, HoI4's evaluator is unread. Marked in place | TW-K-C2 |
| FK3 | The K19-K34 grid (288 cells, 0 met) is the pre-W36 baseline from a dated W21 join, not a new measurement; K28 has new partial evidence in MoL and Paradise; no re-score happened | TW-K-C3 |
| FK4 | AXR1 said abstractions pass because several worlds need them. Demand across worlds makes a candidate; landing needs two distinct real callers (the rule the chains, technology and genetics palettes already use) | TW-L03, TW-L45 |

### Folded picks

- **Card refresh (NX8) is now the kit's top action:** one consolidation owner
  refreshes the 18 priority cards plus the paused Soldier route from TW-K's
  D1-D9, keeping dates and unknowns (TW-K-S2).
- **KW1-KW4 bindings** stay proposals attached to cards when their owners
  proceed, starting with the selected local opening (TW-K-S4). No new
  mandatory gate.
- **Little stuff:** TW-S routed 964 touches into 51 families; kit-owned top
  touches are local dates without home-clock leaks (TW-S14), qualified weather
  and civil dates (TW-S45), refusing a changed quote before spending (TW-S51),
  keeping unknown doses and private acts out of hints (TW-S41) and a real
  import recovery route (TW-S20).

### Slice

The next playable slice is P01 work feedback on Village mixing (chains round
5). For the kit, NX12 still holds: fidelity in the two playing worlds before
breadth; a W37 mechanical reader re-checked against current source is the
kit's next build candidate (TW-K-S3).

## Round 18: multi-world research folded (2026-10-15)

Weibao, 2026-10-15: "Fold and commit and push accordingly". Sources: [multi-world audit](../research/multiworld-synthesis-2026-10-14/AUDIT.md),
[synthesis](../research/multiworld-synthesis-2026-10-14/REPORT.md) and [packets](../research/multiworld-synthesis-2026-10-14/PACKETS.md),
over HyperRogue, Siralim Ultimate, Remnant II, Kingdom Hearts HD 1.5+2.5, The Strange,
RetroMUD and 3 Kingdoms, Multiverse Idle (UI), with Naev, Ur-Quan Masters and the
deep systems sweep as supporting evidence.

### Corrections (audit, 70 checks: 34 confirmed, 17 supported, 8 qualified, none refuted)

| Code | Correction | Source |
|---|---|---|
| FK5 | Remnant II claims stay conditional on an unvalidated mappings file; `ActivateFirstValidWorld` is activation, not random world selection | Audit C4 |
| FK6 | Kingdom Hearts room, party and model changes do not show retained local stock, consent or personal memory; its save schema is the tool's, not proof of the Steam container | Audit C5 |
| FK7 | The Strange: SHOWN means inspected rules and examples, not software. Translation and unchanged physical passage are two separate crossing options | Audit C6 |
| FK8 | Multiverse Idle screenshots show visible information only; 1920x1080 media cannot pass the 1366x768 gate | Audit C8 |
| FK9 | Accepted direction OD2 to OD24 (2026-10-15) supersedes older open wording in lane proposals: memories and base cheat carry between lives, chosen away routines with stops, paused inactive worlds, means-based returns, one continuing self | Audit C9; PROJECT.md |
| FK10 | Lane UI ideas cannot replace the accepted Proto23 composition. New features start in the Projects drawer (UR2), places have keepers (UR4), panels register their own node (UR8) | Audit C10; [UI rules](../UI_RULES.md) |

### What many worlds agree on (ranked, proposals; packets MWA-P01 to P10)

| Rank | Pattern | Seen in | Kit parts |
|---|---|---|---|
| 1 | Current work explains its useful result | Multiverse Idle, RimWorld, Naev; delivered for Village mixing as P01 (`838f8052`) | K13, K14, K34 |
| 2 | **A local rule changes one useful verb** | HyperRogue (land laws, orb drain), Siralim (realm properties), Remnant II (world hazards), Kingdom Hearts (world forms), The Strange (recursion laws) | K2, K5, K10, K13, K15 |
| 3 | Earned learning and present usability shown separately | Kingdom Hearts, Naev, RimWorld, MUD multiclassing | K3, K9, K11, K14, K15 |
| 4 | A paid conversation changes the next local opportunity | Ur-Quan Masters, Naev, Magical Diary | K6, K7, K11, K12, K20, K29 |
| 5 | Return finds the place actually changed | Kingdom Hearts revisits, MUD realms | K5, K6, K12, K16, K18, K29 |
| 6 | Crossing quotes what happens to each carried thing | HyperRogue, Siralim, The Strange, Remnant II | K4, K9, K11, K15, K18 |

Ranks 7 to 10 (origin-filtered lists, settled-routine summaries, one authored
override with fallback, neighbouring rules meeting at one boundary) stay in the
packets file.

### Build note

Next multi-world build candidate: MWA-P02 on the merged T3 rule reader, in a
world that already plays, behind the Projects drawer until Weibao promotes it,
and off files the UI queue (NAV, TRIAGE, APOTHECARY) owns. Not dispatched.
