# Play queue, 2026-10-24

Weibao asked for a short list of finished slices to play, each with exact steps
(action A1 from the "how to implement all of our ideas" answer). Purpose: turn
"agent-verified" into accepted, adjusted or rejected by the only player.

Build: master `8ac514f01` (committed `dist/`, not the primary checkout's
uncommitted rebuild). Target viewport 1920x1080, mobile deferred (AD34).
Rules applied: AD36, AD41, sealed secrets (no truths below).

What I checked on that build, 2026-10-24: the page loads with "No issues in the
loading process", and the first entry of every slice below exists and responds
(button names quoted exactly). For P4 I also walked start, report and the dose
offer. The later steps come from each slice's delivery record and agent browser
runs; I did not walk them. My check ran in an 800x600 pane, so it proves
routes, not layout.

## How to start

Serve master's build on a fresh origin so your real saves stay untouched:

```bash
mkdir -p ~/yair-play && git -C ~/code/yet-another-idle-rpg archive HEAD index.html dist styles style.css resources assets locales favicon.ico help.html changelog.html | tar -x -C ~/yair-play
```

```bash
python3 -m http.server 19950 --bind 127.0.0.1 --directory ~/yair-play
```

Open `http://localhost:19950/` and click PLAY. P4 and the later Primordial slice
need a URL flag, noted below. Most routes live under **More panels** at the top.

## The five slices, in play order

| # | Slice | Codes | Time |
|---|---|---|---|
| P1 | Ordinary village life: work, rent, office, successor | W2, O2 | 30–45 min |
| P2 | Workshop: kits, lots and Measured Focus | W1, O1 | 20–30 min |
| P3 | Mistglass conservatory: history and two cultivation methods | W3, W4 | 20–30 min |
| P4 | LOTM Tingen: probationer to Sequence 8 | Q1–Q6, ASC | 30–45 min |
| P5 | Away and after: prepaid absence, body, heir | O3, O4 | 20–30 min |

### P1 Ordinary village life (W2, O2)

1. Village → Actions → **Options** → **Meet Iona and her work ledger** → **Follow local people and work**. Meet the village elder, then the craftsman.
2. **Find work**: take the field job and run one paid shift (120 minutes, starting from an empty purse).
3. More panels → **Homes** → village home supplier and lodging → join as a provision worker/student.
4. Household primer → agreed ledger appointment → earn the provision office.
5. Train Toma, then fund Rowan's pantry office. Try leaving or resting: the delegate pauses. Hand the office to a successor and review the agreement.

Judge: Does this read as a life rather than a menu? Is the coin pacing fair? Is anything boring?

### P2 Workshop (W1, O1)

1. More panels → **Gear workshop** → study preparation → do the local repair shift.
2. Prepare one smoke lot and one oil lot from the same pelts, then fit a portable kit from each and compare the two grades.
3. Demonstrate fitting, then cut a precise lining.
4. **Field association & practical workshop** → join → **Learn measured focus · 2 min**.
5. Heat with charcoal, then quench or temper with focus. Read the item's stats and wear. Then try a plain hand quench with lamp oil.

Judge: Do the two routes feel different enough to care? Is focus worth its cost?

### P3 Mistglass conservatory (W3, W4)

1. **Projects** → **Enter Mistglass conservatory** → hear the keeper.
2. Inspect the outflow masonry and restore its brace with one log. Go back to the Village, then return.
3. Pick **Threaded-breath circulation** (uses ambient mist) or **Still-pool refinement** (also uses a paid Cloudseed dose from the keeper).
4. Practice → prepare the reserve → **Flow-cut** or **Set-grain** on rat pelts you own.
5. Optional: try switching methods before you've settled the current one.

Judge: Does the history reward looking? Does choosing a method feel like a real choice?

### P4 LOTM Tingen (opt-in)

1. Open `http://localhost:19950/?lotm_probe=1` → PLAY → **Begin as a Nighthawk probationer**. The Machinery team and Mandated Punisher starts are also there.
2. **Report to the supervisor in the workroom and read the terms**.
3. Accept the **Seer** or the **Corpse Collector** dose (one pathway per life). Do the acting tasks, pass the assessment, reach Sequence 8.
4. Walk to the docks or the university area. Who supervises you, and what an act costs, should change.
5. On a second run, take the other pathway or a different start.

Judge: Does acting digestion feel like LOTM? Are the districts worth the walk?

### P5 Away and after (O3, O4)

1. **Pack two dry survey kits**, or prepay a fitter or a handcart depot. Close the tab for a few real minutes, reopen, and review the return report. Try pause, resume and cancel.
2. More panels → **Lives & inheritance**.
3. **Meet Tern, a clay vessel** → **Enter the consenting clay vessel** → **Press one seal with clay hands** → return to your body.
4. **Begin an heir · they receive what this life left behind**. Check what carried over: knowledge, gear and coin.

Judge: Does what carries over and what stays behind match your intuition?

## Verdicts

Fill one line each. Agents treat these as the acceptance record.

| # | Verdict (accept / adjust / reject) | Notes |
|---|---|---|
| P1 | | |
| P2 | | |
| P3 | | |
| P4 | | |
| P5 | | |

## Not in this round

- Primordial Sect Library credit (`?primordial_probe=1`): on master, its entry is verified. Play it after P4.
- Cultivation absorption CG01–CG29: still being built in the primary checkout, uncommitted.
- Qud parity G1–G7: on master, but its combined tree has no browser pass yet.

## Added 2026-10-25: P6 LOTM frog brew (S1, integration build)

Committed on master with the rebuilt bundle (2026-10-25). Serve a fresh copy of master as at the top of this file, or the integration worktree:

```bash
python3 -m http.server 19951 --bind 127.0.0.1 --directory ~/code/yet-another-idle-rpg/.claude/worktrees/integ-potion-2026-10-25
```

1. Open `http://localhost:19951/?lotm_probe=1` → PLAY → **Begin as a Nighthawk probationer** → report to the supervisor.
2. Buy the Corpse Collector formula from Hale (5 pounds, a proposal). If short of money, that is the slice's honest limit; the proof run funded a disposable save.
3. Buy the dried black-spotted frog through the broker, start the brew at the workroom bench, wait 120 played minutes.
4. **Bottle the brewed Corpse Collector dose**, then drink it through the usual ingest; continue to the Gravedigger assessment.

Judge: does brewing your own dose feel better than being handed one? Is the price and time right?

| P6 | | |
