# P7 backing out as an attempt, 2026-10-30

Status: **at the AD43 floor for the road contest** (fixture-seeded, see FLR2). Agent-verified, not human-reviewed. Authority: LSD368 (revising LSD345), LSD331, LSD327, LSD363, LSD340; AR3/AR5/AR9; AD36.

## What exists

| File | Role |
| --- | --- |
| `src/tempo_exit.js` | Chance a try to leave works (speed against the fastest rival, tiredness, light, footing, rival resolve), chance a surrender is taken (rival mercy and revenge), who follows a clean exit. All numbers in `EXIT_DIALS` with reasons; foes may carry optional `goals` `{revenge, mercy}`. |
| `src/tempo_fight.js` | Back away and Yield are keyed attempts. A failed try costs a free blow (4 time, guard dropped) and keeps the fight; a refused surrender keeps the fight. A clean exit records `b.exit` `{kind, followedBy, leftBehind}`; at the end an ally left behind gets a familiarity -1 note and a follower is saved as the fact `tempo.followed_by`. The view shows each exit's odds in words. |
| `src/tempo_fight_contract.js` | Validates fighter `goals`, `tries`, and `b.exit`. |
| `src/tempo_fight_domain.js` | Move buttons carry the odds ("Back away · 4 time · uncertain"). |
| `tests/tempo_exit.test.js` | 4 cases: chance factors, failed try and clean exit with ally left behind and follower, refused and accepted surrender, keyed repeat and reload. |

## Design calls (proposals, not accepted decisions)

- A failed try is a free blow, not a penalty number: the player's next turn comes later, so foes act first.
- A surrender is judged by the most vengeful and the least merciful rival; defaults are an ordinary stranger (revenge 0.2, mercy 0.6).
- Followers are drawn per rival with a reason (revenge); `tempo.followed_by` is a fact only. Nothing reads it yet, so being followed home has no consequence so far.
- Lost face and a returning grudge are not yet written; the relationship note for an ally left behind is the only reputation effect.

## Floor evidence

- **FLR1 build:** bundle hash and full-suite state are in the commit record.
- **FLR2 route:** DEV SEEDED field-workshop fixture, then real clicks at 1920x1080: Accept the road duel, Back away (first try failed), reload, Export, Import, retry until the exit worked.
- **FLR3 shown:** the button reads "Back away · 4 time · uncertain" and "Yield · 2 time · fair"; the failed try logs "You try to back away, but are cut off; the turn costs a free blow." and the rival hit twice before the next turn. Screenshot: `P7_backing-out-1920.png`.
- **FLR4 used:** the successful exit closes the road pursuit as withdrawn (`rival.lastResult` withdrawn, pursuit withdrawn).
- **FLR5 kept:** mid-fight save with a failed try reloaded identical apart from banked minutes; Export then Import left the fight identical.
- **FLR6 label:** built, browser-verified at the fixture route; not director-accepted.

## Gaps

- `tempo.followed_by` has no consumer (tracking, CBR12). Lost face, a returning grudge, dropped gear or loot, and a pursuit check are not built.
- Foes that try to leave use the same chance, but nothing writes consequences for a fleeing foe.
