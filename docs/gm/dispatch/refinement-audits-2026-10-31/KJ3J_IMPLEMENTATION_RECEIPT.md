# KJ3J implementation receipt: Monday start, the Sleepless line, other paths and the stair

2026-11-02. Authorized by the coordinator's window brief after KJ3I. **Agent-verified, not human-reviewed (AD43).** Not committed, not installed, no personal save touched. Content-only: the run used KJ3E's bundle (`919b17d3…`, a copy at `/tmp/lotm-kj3j`; the repo `dist/bundle.js` is dirty from other sessions and was not used or touched). Pack sha256 `562a92ad…` (revision `cast-reviewed-kj3j-b586cbe1a207b514`, carrying KJ3F-KJ3J). Private files: `docs/research/novels/lord-of-mysteries/private/kj3j-ch22-2026-11-02/`.

## Scope and source

English v1 ch22 P001-P052 (official edition, sha256 `395c9d9f…`), all 52 paragraphs read from the sweep shard 2 text and checked against the brief. Five deep intents, nothing folded (fold test failed): `monday`, `ask`, `sleepless`, `spirit`, `stair`. Next boundary: ch23 P001 (Zouteland Avenue, only three pence).

| Decision | Basis |
| --- | --- |
| Pack place Reception hall for P001-P048 | The first act sits at the stairs (where ch21 ended) and moves Klein and Rozanne to the hall; the last act moves Klein to the stairs |
| One non-player relocation per act | Only `monday` moves a non-player (Rozanne); one visit holds her from `monday` to `spirit` |
| Rozanne's counts and rank list kept as her guess | Notes say "her own guess", "perhaps only the captain knows"; nothing is world truth |
| Rozanne's knowledge holds only what Klein said aloud | Wish for the basics, the dream visit, meeting Ma'am Daly. Klein's private reason and the Mystery Pryer appeal are player-only notes; the runner asserts Rozanne holds none |
| Daly is a true meeting, the Sequence 7 reading is Klein's inference | Fact `daly.seq7.inferred`, per the brief correction |
| No money moves | Twelve pound notes are a fact plus note; amount per note not modelled |

## What each intent withholds and who reads it later

| Intent | Withheld | Later reader |
| --- | --- | --- |
| `monday` | Exact Monday hour, the interview staff's names, the household chores; withdrawal is planned, not done | ch24 P034 (withdrawal visit); open fact `university.withdraw.planned` |
| `ask` | Klein's reason for wanting the path (Rozanne only hears "basics"); her father's name and death details | none named in the brief; fact `basics.only.said` stays open for a later Beyonder-interest scene |
| `sleepless` | Ranks above 7 (unknown to her); Klein's private view of Dunn stays his; counts are not confirmed | none named; `path.line`, `dunn.dream.told` for later Sequence or captain scenes |
| `spirit` | Klein's transmigration and way-back reasons; Neil's own account of Mystery Pryer; which incomplete paths exist | the next Neil conversation on paths (not scheduled in the brief); `neil.lead.paths`, `mystery.pryer.heard` |
| `stair` | Per-note amount, the dinner place and cost | ch23 P052 onward (treating Melissa); `treat.melissa.tonight` |

## Verification (one line per check)

| Check | Result | Gap |
| --- | --- | --- |
| Presence preflight, prefix `kj3j.` | 0 blockers; Rozanne `PLACED_BY_ARRIVAL_ACT` for `ask`, `sleepless`, `spirit`; warnings: RELOCATED_ACTOR_IN_OTHER_VISIT (kj3e, kj3h visits, both ended), weak DUPLICATE_PLACE (Hall) | static check only |
| Native route, headless Chrome, fresh origin, seed = KJ3I completed checkpoint, KJ3E bundle | Passed on the first run: five intents, money 2883 and inventories unchanged, Rozanne holds no private-reason text, 0 page errors, 155 s | no 14/21 px captures (headless, no screenshot step) |
| Literal Export/Import | Position (stairs), money, `treat.melissa.tonight`, `daly.seq7.inferred` and KJ3I `leonard.met` preserved | |

Not run: full `npm test` (content-only, AD36), bundle build, 14/21 px captures, human play-through, civil clock. No freeze or engine limit appeared; one non-player relocation per act held.

## PF13 comparison point (not a speedup claim)

| | KJ3H | KJ3I | KJ3J |
| --- | --- | --- | --- |
| Intents | 9 | 6 | 5 |
| Runner executions to green | 2 | 4 | 1 |
| Late presence corrections | 0 | 0 | 0 |
| New actors / places | 3 / 2 | 1 / 1 | 0 / 0 |

- Source read: about 3 minutes (52 paragraphs plus the brief); the brief matched the text on every fact checked.
- Authoring time: about 12 minutes (builder and runner adapted from KJ3I; most of it was fitting 200-character caps, which failed the builder four times before the pack was written).
- Native-proof time: about 3 minutes, one run (155 s).
- Late corrections: 0 in the native route. Pre-run builder fixes: text over the 200-character cap (counted above); a misleading act label ("meet Ma'am Daly again") fixed to the intent.
- Boot/import counts: 2 boots and 1 import (one run).
- Defects: none seen. Note: the repo `dist/bundle.js` differs from KJ3E's (dirty from other sessions), so proofs must keep using the `/tmp` copy.

## Next

ch23 from sweep row s2.14. Add the builder's 200-character check as a pre-scan so it reports every over-length string at once.


## Content reconciliation B487: distinctions, later evidence and retained gaps

Historical five-intent continuation under AD36/AD42/AD43. All five deep intents remained separate after the failed fold test. The planned university withdrawal, promised Monday start and planned dinner are not completed actions, appointments or paid meals. Rozanne's guesses, reported path counts and unknown ranks stay attributed rather than world truth; spoken basics/dream/meeting knowledge differs from private reasons. The actual Daly meeting and inferred rank remain distinct. Twelve banknotes as fact/knowledge with no modeled denomination must not be counted as another cash grant; the recorded2883 balance is unchanged.

Preserve all five withholding/later-reader rows. An open fact without a named scheduled consumer remains open, not silently complete. First-act location is the existing stairs and movement is an effect; the held visit then supports the hall interaction. The original quiet result and no freeze do not prove general actor scheduling. One seeded KJ3I route on the copied KJ3E bundle and literal import support the stated continuation, not dirty shared dist or a fresh complete campaign. No14/21 px captures were taken; no visual-floor proof follows from headless execution. Civil clock and human play are untested.

PF13 still is not a speedup finding. Four pre-write content-cap failures are distinct from one successful native route; a pre-scan is a requested lint idea, not implemented merely because it appears under Next. Keep the200-character cap as this pack's existing format, not a universal prose-length rule. The copied final bundle identity is historical evidence, not an instruction that a temporary folder remains available or should serve every future proof. This content review adds no source/shard, pack, browser or current build verification.
