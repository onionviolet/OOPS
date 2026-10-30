# Canon pull, first slice (G1), 2026-10-30

Status: **proposal, implemented, below floor** (AD43). Agent-verified, not human-reviewed. Canon pull stays a
proposal in [LEAD_LIFE_RULES section D](../../../LEAD_LIFE_RULES.md) until Weibao accepts it. Direction it serves:
USER_VISION "Cast lives: canon-holding is a default for the lead, widened later into emergent play and fate"
(2026-10-29). Formula and inputs: LSD233-LSD245 in [the LSD doc](LEAD_LIFE_SYSTEMS_DESIGN.md). Gap: G1 in
[the gap audit](../../../audits/GAP_AUDIT_2026-10-30.md).

## Mechanism (AD38: a mechanism, not an outcome list)

Code: `src/canon_pull.js`. A beat opts in with a `pull` field; beats without it resolve exactly as before.

| Piece | Default | Dial | Reason |
| --- | --- | --- | --- |
| Pull strength | seat ceiling x world dial x beat weight, then redundancy | `PULL_SEATS` (be .9, beside .75, follow .7, bystander .6, ordinary .5); `cfg.worldDial`; `beat.kind` weight (great 1, detail .6, routine .15) or `pull.weight`; `pull.fixed` | The lead's seat holds canon, other seats widen; facts nothing later needs may drift (LSD235); more routes to a fact make it robust (LSD243) |
| Chance the story acts | `pull + (1 - pull) x p`, `p` = what the rules alone give (default 0 when a precondition is broken) | `cfg.rulesChance` | LSD233; one keyed draw per beat (`fate` stream, key `[canon.pull, world, beat]`), so a different pull moves only that beat's draw (LSD244) |
| Disturbance | each recorded push reaches its named beats and halves per dependency hop; unlinked beats are untouched | `cfg.cap` (default 3): inertia = disturbance / cap lowers pull | Divergence damps unless a link carries it (LSD222); a bigger push beats the pull (LSD241) |
| Agents | each has a reason code, a `sign` line, a cost and its own finite budget; they restore a precondition or substitute the beat | per-agent `budget`, `cost` | Fate, an organisation or the book's own causes push back in-world (LSD239); when budgets are spent, the deviation stands |
| Substitute | used when the cause is not a plain precondition (a missing dependency or mechanism), or when the restoring agent is spent | `agent.substitute` effects | The beat still happens by other means, and dependants proceed |
| Outcomes | `restored`, `substituted`, `deviated` (reason `draw`, `spent` or `no_hand`) | | Held beats record nothing |

Pull is derived at resolve time and never saved (LSD245). The `canonPull` save slice (additive; absent loads
empty, empty writes no key) holds pushes, agent spend and outcome records. `resolveWithPull` wraps
`resolveBeats` by replaying the day with a modified beat table, so `beat_records.js` is unchanged.

## Read and chronicle (no spoilers, no ring)

`pullRead` returns a headline ("The story leans this way." / "...strains against you." / "...slipping its
course.") and per-beat words (holds firm, leans, loosening, drifting) by id only. `deviationChronicle` gives
lines such as "Beat b1 was set right: <sign>"; the sign says that something intervened, never what the beat was.

## LOTM volume 1 slice

`src/world_packs/lotm_pull_slice.js`: three stand-in beats (ids authored for the slice, not read from the sealed
pack). `lotm.v1.pull.b1` needs one precondition fact; fate can restore it (budget 2), the church can substitute
(budget 1). `tests/canon_pull.test.js` shows every outcome across 300 keyed seeds, determinism, the seat
dial, damping, finite budgets, and the slice round trip.

## Not built (stops and next steps)

- Host binding (floor-wire owns `book_world_lotm_*`): map `lotm.v1.pull.b1` to a real pack beat id and its
  window fact, replace the `resolveBeats` call in the cast host with `resolveWithPull`, and call
  `domainRegistry.command('canonPull', 'push')` when a player action changes a fact a pulled beat reads.
- Panel: render `pullRead` through `definePanel` (UR rules, desktop first) and push `deviationChronicle`
  lines into the life chronicle log.
- Browser floor at 1920x1080 (deviate, see the pull, save, reload, import): not run; needs the two items above.
- Later: per-world curves (LSD234), fate traces readable by divination (LSD240), relationship-driven change.
