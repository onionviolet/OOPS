Audit and expand the relationship prerequisites proposal in YAIRPG
(yet-another-idle-rpg). Weibao asked "stuff required for relationship stuff
and more?" and then "more to consider? Send out codex to audit and expand
accordingly?". Claude wrote a first pass. Your job: check it against the code
and existing docs, correct what is wrong, and add what is missing.

This is a design and documentation pass. Do not change gameplay source,
bundles, tests, saves or private packs. Do not commit or push.

## Read first

- `AGENTS.md` (sealed secrets, multi-agent ownership, voice) and `PROJECT.md`.
- `~/.claude/user-preferences.md` for writing style: plain short words, no em
  dashes, no " -- ", lead with the point, short codes on rows.
- Target: `docs/worlds/world-depth-2026-10-13/29_RELATIONSHIP_PREREQUISITES.md`.
- Its design owners: parts 10 (PE3, PE4), 19 (dialogue), 20 (friends and
  relationships), 21 (renown), 22 (features as cheats), 23 (synthesis), 28
  (foundational functions), all in `docs/worlds/world-depth-2026-10-13/`.
- `docs/LIFE_SIM_NORTH_STAR.md` sections on romance, lineage, heirs and
  companions (search; it is long, do not read whole).
- `docs/CHARACTERS_AND_WORLD_EVENTS.md` and `docs/ENGINE_EXPANSION.md`
  sections on favorability, relationship conditions and open-world consequence.
- Relevant `docs/USER_VISION.md` entries (search "relationship", "romance",
  "bond", "friend", "passive"). Note the accepted direction that progression
  can be passive in an idle game.
- Memory notes in `~/.claude/projects/-Users-weiwei-code-yet-another-idle-rpg/memory/`:
  `everything-possible-reasonably.md`, `considerations-not-specs.md`,
  `solo-player-no-once-limits.md`, `unbiased-lens.md`.

## Code to check (source-read; cite file:line)

`src/simulation_contracts.js`, `src/simulation_effects.js`, `src/simulation.js`
(reset policy), `src/chronicle.js`, `src/chronicle_ui.js`, `src/npc_lives.js`,
`src/village_career.js`, `src/people_knowledge.js`, `src/people_ui.js`,
`src/promise_content.js`, `src/crush_social_*.js`, `src/party_content.js`,
`src/book_world_mol_*.js`, `src/world_rhythm.js`, save import/export and
migration code (find it). Grep for every writer of `type:'relationship'` and
every reader of `relationship.` facts.

## Part A: audit (write to the dispatch folder)

Write `docs/gm/dispatch/relationship-prereqs-2026-10-14/AUDIT.md`:

1. Verify every "Have" claim and file:line in part 29 sections 1 to 3.
   Mark each CONFIRMED, WRONG (with the correct fact) or UNVERIFIED.
2. Find prerequisites part 29 missed or misordered. Check especially: save
   size limits (memories cap 32, chronicle owners cap 64), performance with
   many people, offline catch-up mechanics that already exist, the anti-farm
   receipt and how it interacts with passive or idle ties, how combat,
   party and travel owners would read ties, and pack (structured pack)
   support for authoring people and ties in private book-world packs.
3. Contradictions between part 29 and parts 19, 20, 22, 23, 28 or accepted
   USER_VISION direction. Report both sides; do not resolve by assumption.
4. A ranked list of the five cheapest real next steps with save impact.

Label every claim shown (in code), stated (in docs) or inferred.

## Part B: expand (edit part 29 only)

You own `29_RELATIONSHIP_PREREQUISITES.md` for this run. Keep Claude's
existing rows unless the audit shows one is wrong; fix wrong ones in place
and note the fix in the audit. Then add new sections after section 3, with
new code prefixes that do not clash with existing ones in parts 0 to 28.
Consider, as palettes not specs:

- Romance, partnership and family prerequisites beyond SH4/SH5 (consent,
  attraction axes, households, children, opt-out).
- Passive and idle relationship progress (accepted passive-progression
  direction): what can grow while away, what must not, and the tell for
  automated upkeep (part 28 SF4).
- Authoring prerequisites: a person card schema for packs, tie templates,
  validation and lint, test fixtures, so content authors can add people
  cheaply.
- Cross-world and cross-life needs (carriers, counterparts, loop resets)
  that part 20 RX assumes.
- Information and UI prerequisites at 1366x768 desktop first (mobile
  deferred), discovery-gated: information appears only when it comes up.
- Failure, harm and consent edges: compelled ties (SF5), grief, betrayal,
  estrangement; what the data must keep for these.
- Per-world differences in prerequisites for the priority worlds (Harry
  Potter, D&D, TTKS, Mother of Learning, A Soldier's Life, home Village).
- Anything else the audit shows is needed.

Rules for the expansion:
- Every option stays reachable where reasonable. Use Default + Dial +
  Reasonably where a dial fits. Never write either/or questions for Weibao.
- No fixed "once" limits; limits are per-world adjectives.
- Rows carry a short code, the consideration, and why it matters.
- Sealed secrets: refer to any sealed truth by ID only.
- Mark everything proposal, not accepted.
- Update the row count in `docs/worlds/WORLD_DEPTH_CONSIDERATIONS_2026-10-13.md`
  for part 29 only; leave every other row and file alone.

## Finish

End your last message with: files changed, counts of CONFIRMED / WRONG /
UNVERIFIED claims, new sections and code prefixes added, and open questions
that need Weibao's decision (at most five).
