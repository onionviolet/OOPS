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
Open check before B2: the Q1 checkpoint and a code comment cite a source note "X3" about a long wait; the LOTM
pass's X3 says three years. Confirm which note is meant before the dial is called source-based.

## Update 2026-10-23 16:00 EDT: runtime ownership and source consolidation

The old Claude LOTM B2 lane (extraction, assessor row, cause rows) stopped on a session rate limit and is not
restarted. The existing lotm-pathways work (`src/book_world_lotm_pathways.js`, `tests/lotm_pathway_rows.test.js`) and
the O/F/A integration (`local_5e36e0d0-18df-4629-8f2e-088a55ee0543`) now own the LOTM files; Q1 and Q2 stay recorded
in their checkpoints as built and played but uncommitted. Reconcile that checkpoint before any further LOTM runtime
step; no new writer is dispatched from here. Source consolidation continues under one fresh Sonnet coordinator
(Agent id `a91461610a5526e9f`, `claude-sonnet-5-5`, started 15:59 EDT); see the
[handoff](../claude-coordinator-continuation-2026-10-23/WORLD_CONSOLIDATION_HANDOFF.md) and the new round in
[GAP_AUDIT](../claude-coordinator-continuation-2026-10-23/GAP_AUDIT.md).

## Update 2026-10-23 evening: W1 and W2 receipt (world consolidation coordinator)

Same facts as the new round in [GAP_AUDIT](../claude-coordinator-continuation-2026-10-23/GAP_AUDIT.md#round-world-consolidation-w1-and-w2-2026-10-23-successor-coordinator). Coordinator: Sonnet, `claude-sonnet-5-5`; parent-recorded Agent id `a91461610a5526e9f` (this agent cannot read its own id); startup confirmed from files. Docs only; no LOTM runtime writer dispatched.

- LOTM reconcile: the Q1 and Q2 checkpoints (`lotm-q1-2026-10-23`, `lotm-q2-2026-10-23`) record districts and walks as built and played but uncommitted, with Q3 (second life profile) as the next seam; the lotm-pathways worktree still holds uncommitted `src/book_world_lotm_*` changes. Ownership stays with lotm-pathways and O/F/A `local_5e36e0d0-18df-4629-8f2e-088a55ee0543`. The "X3" long-wait note check (open check before B2) is unresolved and belongs to them.
- W1: Fanren, Primordial Saint Sect, TTKS, A Soldier's Life and A Regressor's Tale reached source-reviewed on listed rows (about 150 locators reopened); seven findings F1-F7 in GAP_AUDIT. No numeric misreads by pass authors.
- W2: six haiku readers, about 66,500 source words of 72,000, at most 2 at once, 7 of 9 agents, 0 Sonnet lanes; windows: Fanren ch25-29 and 37-41, PSS c26-28/33/46/65, Soldier B1 ch24-28, TTKS B1 0016/0023/0108 and B2 0377/0378/0387/0390/0520. Two named windows were swapped after a focus-term census.
- Links folded: kit cards soldiers-life, ttks-b1..b5; WORLD_CARDS; SOURCE_DEEP_DIVE_PLAYBOOK; LOCAL_LIBRARY paths.
- Remaining gates: nothing built or browser-verified; MoL calendar and mana costs and RI Shang/Jia gaps untouched; older passes (MoL, HP, Shadow Slave, Circle) still author-spot-checked only; LOTM high-rank coverage is the C5 reader's.

## Update 2026-10-24: world readiness coordinator

Source consolidation (W1/W2) is closed. One fresh Sonnet world-readiness coordinator (Agent id `ac5fff40b1e908106`,
`claude-sonnet-5-5`, startup confirmed from the agent list) now owns the next finite wave: reconcile the five reviewed
pass docs, per-world readiness dispositions and one first-slice packet, plus two bounded windows. No LOTM runtime
writer is dispatched; the lotm-pathways and O/F/A sessions still own those files. Budget and exclusions are in the
[handoff](../claude-coordinator-continuation-2026-10-23/WORLD_READINESS_HANDOFF.md) and the new
[GAP_AUDIT](../claude-coordinator-continuation-2026-10-23/GAP_AUDIT.md) round.

## Update 2026-10-24 09:40 EDT: readiness coordinator failed on a connection error, recovery under way

`ac5fff40b1e908106` stopped on ENOTFOUND (no API route); no W3/W4 output or reader return was saved, so no reader budget
was spent. The same agent is being resumed (not duplicated); see the recovery receipt in
[GAP_AUDIT](../claude-coordinator-continuation-2026-10-23/GAP_AUDIT.md). No LOTM runtime writer; same exclusions.

## Update 2026-10-24 (later): world readiness W3 and W4 receipt

Coordinator: Sonnet, `claude-sonnet-5-5`; parent-recorded Agent id `ac5fff40b1e908106`. Completed after one API-failure restart. Dispositions: Primordial Saint Sect READY (rank 1, packet thread), Soldier's Life NEEDS SPECIFIC SOURCE, Fanren NEEDS MECHANISM, Regressor NEEDS MECHANISM, TTKS NEEDS MECHANISM per book. One packet: [FIRST_SLICE_PACKET_2026-10-23](../claude-coordinator-continuation-2026-10-23/FIRST_SLICE_PACKET_2026-10-23.md). Two kit cards added (Primordial, Regressor). W4: MoL calendar and mana windows skipped as empty by census; PSS Merit Pool window read (one Haiku, 10,821 words). Agents: coordinator plus 1 reader; 0 Sonnet lanes. No LOTM runtime touched. Full detail and remaining locators: [GAP_AUDIT](../claude-coordinator-continuation-2026-10-23/GAP_AUDIT.md) round "world readiness W3 and W4 completed". Nothing built or browser-verified; next gate is Weibao's go-ahead on the packet.


## Update 2026-10-24 (latest): source-gap coordinator receipt

Coordinator Sonnet `claude-sonnet-5-5`. Budget used: me plus 2 Haiku readers (RI Shang and Jia windows, 19,000 text words of 36,000, 3 responses each), 0 Sonnet review lanes, 0 retries. Primordial blockers and MoL trade closed by census with no reader. Details: GAP_AUDIT round of the same date. Docs and private source only.

## Update 2026-10-24 (current state, supersedes the stale readiness entries above)

Viewport correction: the target is 1920x1080 primary with 1536x864 at 14px and 21px as the relevant floor, mobile deferred;
the "laptop 1366x768 checked" mention near the top is retired history. The readiness and source-gap units are closed;
the one running worker is the Primordial credit build (`ad425044b49d9f073`); the live packet summary and full state are in
[GAP_AUDIT](../claude-coordinator-continuation-2026-10-23/GAP_AUDIT.md). No LOTM runtime writer is dispatched from here.

## Update 2026-10-24 (Primordial credit slice built)

Worker `ad425044b49d9f073` finished: Primordial credit-and-restart is built and played behind `?primordial_probe=1`, not
accepted or committed. Result, seam, files, gates and remaining work: [GAP_AUDIT build round](../claude-coordinator-continuation-2026-10-23/GAP_AUDIT.md)
and the [checkpoint](../primordial-credit-2026-10-24/CHECKPOINT.md). No worker is running.

## Update 2026-10-24 (Primordial credit-loop completion)

One fresh Sonnet coordinator (`aacedef6830277543`, `claude-sonnet-5-5`, startup confirmed) now owns the bounded completion of the
Primordial credit loop (repeatable CP task, Repay verb, clock-driven interest, proof at 1920x1080 and 1536x864 14/21, truthful
`carries` resolution). The parent released the runtime area and is dispatch-only. Full record:
[GAP_AUDIT](../claude-coordinator-continuation-2026-10-23/GAP_AUDIT.md) and [handoff](../primordial-credit-2026-10-24/COMPLETION_HANDOFF.md).

### 2026-10-24: Primordial credit-loop completion (coordinator Sonnet `claude-sonnet-5-5`, proof worker `a2626f6d3de72d03f`)
Done and played on an isolated candidate: mission, atomic Repay, clock interest, Export/Import/reload, both viewports at 14 and 21 px. Owner: Weibao's acceptance; committer commits `src/progression_gates.js` then the Primordial files and runs full `npm test`. Optional: heir lane decides the `buildLifeHeirSave` copy-list line (spec in the [CHECKPOINT](../primordial-credit-2026-10-24/CHECKPOINT.md)); `drops` stays the default. Not built: Merit Pool, same-body restart, talent settling.
