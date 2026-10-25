# Protolike UI references: crafting tabs, panels and the cultivation card, 2026-10-24

Requested by Weibao: take what fits from a set of supplied screenshots (a
crafting-tab mockup, the upstream YAIR main screen, a four-column wireframe, a
NekoRPG production panel, a Cataclysm DDA inventory, and three small dialogs
shared on Discord: craft progress, a food tooltip and a Cultivate card). Focus:
cultivation UI.

Research and proposals only (AD32). No runtime, save or priority change.
Applies UR7, UR41–UR44, UR47, UR49, UR51, UR56, UR59; MR11; AD5, AD38.
Desktop/laptop first per the standing UI priority; mobile deferred.

Evidence boundary: user-supplied screenshots only. The Cultivating All the
Above repository is unchanged since the
[2026-10-22 screening](PROTOLIKE_AND_CULTIVATION_DISCOVERY_2026-10-22.md)
(HEAD `35ef6a10`, checked with `git ls-remote` today), and its cultivation
content file is still empty. The Cultivate card is therefore a Discord-posted
experiment, not shipped code. The poster called the dialog work "not final, just
experimenting". The poster's identity, channel and date were not captured (a
UR59 gap).

## Current YAIR state compared

`src/home_cultivation.js` renders cultivation as one prose paragraph (cradle
qi left, Toma's study count, your lesson count, packet duration) followed by
three appointment buttons and per-job "minutes remain" lines with a cancel
button. No stage or realm model exists in code (`src/cultivation_root.js` and
`cultivation_items.js` have none). The facts are all present; the layout makes
the player parse them out of a sentence.

## Findings

**F1. The Cultivate card has a reusable shape: purpose, governing factor,
method, stage ladder.** Top to bottom: what the action does in one line; what
changes your gain, in warning colour, shown *before* you act ("varies by
location"); the selected method by name; then a three-row ladder with the
previous stage, the current progress bar (`Ki 866/25000`) and the next stage.
The ladder answers "where am I, how far to the next step, what is it called"
at a glance, which our paragraph does not.

**F2. Our version should show what actually governs progress, not a fixed
modifier.** Per AD38, the governing row lists the real mechanisms in play:
cradle field active and minutes left, location, tutor qualification, body
support. The card's red "varies by location" line is the right placement
(before the action) with a vaguer claim. Under MR11 the ladder appears only
when a world declares stages. A stageless world shows method plus the
governing row, and a world with unknown stages shows the current stage and
"next: unknown" until discovered (sealed-secret safe).

**F3. Running jobs get a small card instead of a sentence.** The Craft
Progress dialog is item name, time left and a cancel action on the same
surface. Our jobs already carry label, due time and cancel. Present them as
one compact row per job (UR7 shared row, UR53 explicit dismissal) under the
cultivation card, and reuse the same row for crafting and home appointments.

**F4. The food tooltip's "first try bonus" and "Tried: yes/no" flags reward
discovery cheaply.** Class plus a coloured property word ("Food (perishable)")
and a one-time first-try bonus turn tasting into a small exploration loop.
This fits existing discovery and knowledge routes. Show "Tried" only for
things the character could have tried (UR47 reuse across item, log and
inventory hovers).

**F5. The NekoRPG engine panel models a production machine as state plus
verbs.** Readouts (temperature, pressure, volume, power) beside verbs (compress,
expand, pump, release) and batch amounts (+5, +50, +500, all), with an honest
estimated time even when absurd ("9873 years"). This matches AD38: the
mechanism decides the outcome, and the UI shows the state that decides it.
Candidate pattern for distinct production activities, such as a cradle's qi
field or a forge's heat. Batch buttons fit the existing 5/10/all crafting rows.

**F6. Assembly crafting: tabs make parts, a bench finishes** (from the
crafting-tab mockup). Sort by what you are making, give finishing its own
surface where part properties combine and the projected result shows, and use
role chips ("wear alone · lines armor") instead of exclusive buckets. Stage
tabs derive from each recipe's part roles (MR11, GT9). Avoid an "Other" junk
drawer and three tabs per item.

**F7. Layout and inventory notes, lower priority.** The wireframe and
upstream screen both anchor location, date and a description at top centre
with the log beneath, which our desktop layout already does in spirit. The
skill rows (name, level/cap, percent, thin bar) are a compact stat row worth
matching where we list skills. CDDA's worn-container tree with remaining
volume, weight and max length per container is the reference if containers
gain capacity; not current scope.

## Proposed cultivation card (desktop, proposal)

```
Circulate qi                                   [Toma's breathing method]
Draw qi from the cradle field into your channels.
Governing now: cradle field 142 min left · manor room · tutor qualified
 ┌ previous   Opening (unknown name until reached, per world)
 │ current    ▓▓▓▓▓░░░░░  866 / 25,000
 └ next       ...
[Study together · 30 min, 3 coins]  [Release packet · 5 min, 2 coins]
 Running: Toma studies circulation · 18 min left            [Cancel]
```

Stage rows render only where the world declares stages. Governing factors come
from the same checks `planHomeCultivation` already performs, so the card shows
blockers as named reasons (UR7 disabled reason) instead of thrown errors after
a click.

## Not done

- No Discord collection this pass; the cultivation card's source post is uncited.
- No runtime change and no browser evidence; the card above is a sketch.
