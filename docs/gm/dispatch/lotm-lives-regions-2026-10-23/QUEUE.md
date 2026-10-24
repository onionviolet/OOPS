# LOTM lives, pathways and regions: build queue, 2026-10-23

Weibao, 2026-10-23: "implement each life and each required part of lifes and more?
Other potion paths? other stuff? do things for each direction? Implementation of
regions? more to consider?" This is a standing build direction for Lord of the Mysteries
(LOTM). It authorizes the queue below one slice at a time. It does not select a commit,
push, default-world change or personal-save migration.

Rules applied: WPR30-WPR32, WA1, WA5, WA6, WA13, AD5, AD38, AR1-AR16 (AR14 lane briefs),
SR1-SR24 (regions), PIR (people), the LOTM Seer laws LTS1-LTS14. Target viewport desktop
1920x1080 (laptop 1366x768 checked); mobile deferred. All values and acts are proposals.

## What exists

The opt-in Tingen branch (`?lotm_probe=1`, `book.lotm.tingen`) has one local probationer,
one original supervisor (Warden Hale), the Seer pathway as a `definePath` descriptor
(Sequence 9 Seer to Sequence 8 Clown, acting digestion, assessment, ceiling at Sequence 8)
and disposable saves. Record: [ascension-paths checkpoint](../ascension-paths-2026-10-22/CHECKPOINT.md).
Source passes this build can use: [institutions, roles and subtle details](../../../worlds/LORD_OF_THE_MYSTERIES_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md)
(church teams, pay, clearance, broker trade, promotion exam, new-identity start).

## Ranked queue (thinnest playable step first)

| Q | Slice | Why now | Seam and owners | Done check |
|---|---|---|---|---|
| Q1 | A second Sequence 9 pathway on the descriptor engine, in the existing Tingen branch | Proves "other potion paths" are data, not new code (WA1, WPR31) | `src/book_world_lotm_*.js` plus `ascension_paths.js` only if the descriptor needs a typed crossing it lacks; tests `tests/lotm_*.test.js` | Both pathways play to Sequence 8 on a fresh origin; save, reload, import; old saves load unchanged |
| Q2 | Tingen districts as a region layer: docks (Mandated Punishers), university area (Machinery team), church-held areas, with jurisdiction effects on clearance, pay and who responds | The new source pass shows jurisdiction split by faith; SR1-SR24 apply | LOTM location ids and one region owner; no map UI beyond a plain places list | Walking between two districts changes who supervises and what an act costs, shown in the log |
| Q3 | A second life profile in Tingen: the new-identity start (papers 8 pounds, clothes, passage costs) and a civil-staff life at 3 pounds a week | "Each life" is a start profile (WA13) with body, means, debts, access and knowledge | Start profile plus enrollment; no new verbs | Two profiles both enroll, earn, spend and save differently |
| Q4 | Church team roles: a clearance grade (grade 2 needs bishop or captain, grade 3 a group of three) | Required part of a life; PIR roles | Shared role or clearance mechanism with LOTM data rows | A sealed item cannot be handled without the right clearance and group |
| Q5 | Beyonder broker trade: broker holds money and item until the buyer verifies; barter at equal value | Source economy; ECR and means rules | Existing custody and quote owners | One trade completes, one fails verification, both leave records |
| Q6 | A third pathway, and the promotion exam by a senior deacon (replaces the authored Warden Hale assessor where the source differs) | Second proof of generality; fixes the authored-vs-source note X3 | Descriptor data plus one role | Exam rules read from data |

Later (named, not queued): Sequence 7 and above, rituals, mythical form, heredity, auctions
(the edition has no auction term), other cities and the sea region. Reverend Insanity and
Omniscient Reader have source passes only: no runtime, no kit card, not in the canon-first
order. Paradise has its existing branch and stays docs-only until Weibao selects it.

## Gates every slice carries

1. **Ownership.** Check `git status` on `src/book_world_lotm_*`, `src/ascension_paths.js`,
   `src/life_experience*` and `dist/` before writing. Other sessions hold uncommitted
   `src/` edits; do not touch their files, stash, reset or force.
2. **Save compatibility.** Add state only as optional fields with defaults, keep
   `state.lotm` at its current schema, test an old save loads unchanged, and write the
   decision in the lane checkpoint.
3. **Tests.** The lane runs only its focused test files. One committer runs the full
   `npm test` once, plus `check:arch` and `check:rules`.
4. **Play it.** Rebuild, then play the change in a browser from a fresh origin at the target
   viewport; when state changes, save, reload and import. Anything not exercised is labeled
   implemented-unverified.
5. **No commit or push** without Weibao's yes. Stage only the lane's own paths.

## More to consider (ACT NOW, ACCOUNT FOR NOW, LATER)

ACT NOW (this queue): the ordering above; the ownership check; the compat rule.
ACCOUNT FOR NOW: loss of control must stay tied to its stated causes (skipping sequences,
wrong-pathway potion, switching, rushed residue) so a second pathway cannot bypass the
Seer slice's failure rules; characteristics are conserved per pathway, so a world-wide
ledger is needed before more than two low-sequence lives share one city (LATER); a
pathway's acting method is its own authored dial, not the Seer's six acts; region and
life rows should be data over shared verbs (WPR31); the supervisor stand-in Warden Hale
stays authored. LATER/DELEGATE: neighbour-pathway swaps, heredity, the Tarot gathering,
newspaper and divination information trade, and a second city; each with level, effort
and a done check when selected.

## Update 2026-10-23 (after Q1 and the implementation map)

Q1 (Corpse Collector as the second Sequence 9 pathway) is built and played, uncommitted; its
checkpoint is [lotm-q1](../lotm-q1-2026-10-23/CHECKPOINT.md). The
[implementation map](../../../worlds/IMPLEMENTATION_MAP_ABILITIES_PROCEDURES_SUBTLE_INTEGRATIONS_2026-10-23.md)
(19 mechanism classes, proposals) changes the order after Q2 (one writer per file area, so these run in sequence):

1. Q2 districts (in flight; builds the jurisdiction class once).
2. B2 extraction: a per-pathway command-set factory and one data-driven assessor row merged from the two
   `request_assessment` commands. Needed before Q6; do it after Q2 returns because Q2 edits the same LOTM files.
3. Cause rows for loss of control, so a pathway added as data carries its stated causes (not a hard wall).
4. Q3 second life, then Q4 clearance and status bundle (write it world-neutral), Q5 broker trade, Q6 third
   pathway and the senior-deacon exam.

Resolved 2026-10-23: the wait is F18/X4 (three years for an ordinary member; merit-based exam for a player who digested by acting). X3 is the authored Warden Hale stand-in, not a wait. The citation is corrected in the Q1 checkpoint and the ids comment; see the lives checkpoint D2.
