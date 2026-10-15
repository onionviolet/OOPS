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
