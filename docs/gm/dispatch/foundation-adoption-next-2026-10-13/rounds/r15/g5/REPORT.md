# R15 G5: FA17 heir inherits what the life left behind

2026-10-13. Worker branch `worktree-agent-a09658bcd5ecc072d` (commit
`643b7f1b`), from 4becff87; merged by root. Accepted direction:
[rules from scratch, The heir](../../../../../../RULES_FROM_SCRATCH.md#the-heir)
(Weibao, 2026-10-10). Target viewport desktop 1600×1100; mobile out of scope.
Root saved this report from the worker's hand-back text.

## What changed for the player

Before this round the heir path was unreachable: `main.js` never passed
`beginHeir`, so the "fresh body, one lesson" button stayed hidden, and nothing
called `buildLifeHeirSave`. The one-lesson rule is removed and the path is wired.

When a mortal life ends, the dialog lists what will pass on, computed from the
life's saved state. **Begin an heir · they receive what this life left behind**
saves the ended life and reloads into a new beginning. The game builds the heir,
runs it through the real import check, and reloads into character creation for
the heir's own body.

| Leftover | Source of truth | What the heir gets |
|---|---|---|
| Recipient | lessons the life taught | The apprentice if one was taught, otherwise next of kin |
| Money | `character.money` | All of it, added to the heir's own 102 coins, after estate debts |
| Belongings | carried inventory and worn gear | Added to the heir's inventory (worn gear arrives unequipped) |
| Stored goods | personal chest | Kept in the heir's chest |
| Home | Shack unlocked | Shack stays unlocked |
| Records | lessons written down | Old papers; studying one (5 minutes) teaches it |
| People | lessons taught | An apprentice heir knows them; the elder remembers the predecessor by name |
| Standing | regional reputation | Half, rounded toward zero |
| Debts | Village kit debt | Paid from the estate first; any shortfall is written off |
| Obligations | unsettled elder grievance, unkept archive promise | Follow the heir; existing Settle and archive duty close them |
| Archive line | succession already claimed | Stays with the line; the manual can't be claimed twice |

Nothing else crosses: XP, skills, unwritten knowledge, quests, living-world
state and the body start fresh. All names and numbers are reversible proposals.
The single prestige layer is untouched.

**How to play it:** start a mortal chronicle. Write lessons down, teach them
once you are an elder, keep goods in the Shack chest and keep the archive
promise. When the life ends at 80, read the list and click Begin an heir, then
name the heir. Notebook → People → Elder & chronicle shows the generation, what
was received, and Study buttons for written lessons the heir doesn't know.

## Persistence and compatibility

- No schema bump. The chronicle gains an optional `life.experience.inheritance`
  record, validated when present.
- Explicit compatibility decision: old one-lesson heirs load as saved, keep their
  lesson, and are labeled "begun under the earlier one-lesson rule".
- The ended life stays in the save slot until the heir envelope passes the real
  import probe. Only a small `heir request` key crosses the reload. On failure
  the error is shown and the ended life is kept.

## Checks

| # | Check | Label | Result |
|---|---|---|---|
| C1 | Unit tests: rich life, grievance follows and is settled, debt paid with shortfall, near-empty life, old-rule heir valid, bad records rejected; `life_experience_b` updated | source | PASS |
| C2 | `npm test` in worker branch | source | 582/582 PASS |
| C3 | `fixture/generate.mjs` drives the real `main.js` in Node: elder dialogue, enrollment, attend, write, pledge, duty, inherit, chest deposits, equip, aging, teach, death at 80; coins and goods seeded the D1 way; each fixture passes real import plus load (`fixture/SEED_LOG.json`) | seeded prerequisite | PASS |
| C4 | Rich life in Chrome on rebuilt bytes (served hash = local `70684e0018858f0e`), port 19150: literal-file import, dialog list, Begin heir, import probe. Heir got 502 coins (400 + own 102), bread, manual, pants, 12 ore and 6 logs in chest, Shack, the taught lesson, Village −1 (from −2), grievance with Settle shown, archive line, XP 0 | seeded-native | PASS |
| C5 | Rich heir Save/reload identical; Export then literal-file Import into a cleared slot identical, ignoring timestamps | seeded-native | PASS |
| C6 | Near-empty life: heir got only pants plus own 102 coins, nothing else; persistence identical | seeded-native | PASS |
| C7 | Old-rule heir built by the 4becff87 code loads on the new build unchanged | seeded-native | PASS |
| C8 | Studying papers and the kit-debt path in the browser | source only | Not exercised natively: the rich heir is the apprentice and already knows its written lesson; the fixture has no real career debt |

Evidence in `evidence/`; harness `browser_heir.mjs <rich|empty|old>`. Browser
profiles stayed under `/private/tmp`.

## Shared-file hunks

Only `src/main.js`: imports, the heir request key and its startup read,
`previewHeir`/`beginHeir`/`completeHeirRequest`, `saveOwnership`, skipping
saved-game load while an heir request is pending, and the chronicle panel
arguments. Other source: new `src/heir_inheritance.js`, plus `src/chronicle.js`,
`src/chronicle_ui.js`, `src/life_experience_host.js`.

## Still open

1. Living-world holdings (expansion stock, kits, followers, people other than the elder) don't pass.
2. Camps and land other than the Shack don't pass; unlocking them in a fresh world would bypass their quest chains.
3. Debts don't follow the heir; the career ledger can't hold a debt with no shifts, so the estate pays or writes it off.
4. Refusal of inheritance, contested claims and disloyal followers (north-star proposal) are not built.
5. Worn condition isn't carried (durability is off by default).
6. Cosmetic: the grave line sits between help text and the list; character creation pre-fills "Hero".
7. Studying papers and the kit-debt path still need a browser check (C8).
