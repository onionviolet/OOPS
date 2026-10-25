# GTL10 report: overflow-policy pilot (2026-10-23)

**Outcome: stopped, no candidate meets the brief's four tests. No policy code was
written.** The brief names this as a valid result. Everything here is a proposal;
nothing is accepted direction. Worktree `gtl10-overflow-pilot-49f9f4`, branch
`claude/gtl10-overflow-pilot-49f9f4`.

Task record (AGENTS UI direction): target viewport 1920x1080; intended visible
outcome was a "converted/spilled/pressured" line on the skill XP row with the row's
reason; deferred scope was the other four worlds, mobile, and the native settlement
cap. Not reached because no row qualified.

## Choice and rejected candidates

Tests: T1 consumer runs today in a reachable world; T2 row backed by a stated or
shown source claim (inferred-only fails); T3 conservation checkable; T4 no LOTM,
gear workshop or Qud edits.

| Candidate | Policy | Fails | Evidence |
|---|---|---|---|
| MLP1 `book.mol.cyoria` | banked | "Beyond lost/banked" on its face. Its dials and reason are the author's own ("dials are mine"); the reason text is a reading, not a source claim | `MOTHER_OF_LEARNING.md:116-131` |
| MoL pressure (MLG3, Taiven Ch 22 para 55-57, label stated) | pressure | T1/T2 mismatch. The stated claim is about forced mana-reserve growth wrecking shaping, not single-gain skill XP; moving it onto the XP cap is the unsupported pressure fiction the brief forbids. Code has no player reserve: independent entry asserts no personal mana (`src/book_world_mol_state.js:45`); only Nora has one (`:39`) | `MOTHER_OF_LEARNING.md:30`, MLX6 `:162` |
| GTO2 child-to-parent skill spill as a `spill` row | spill | T3. The child keeps its full gain and the parent also receives up to `min(child_total - parent_total, xp_to_add)` (`src/components/levelable_component.js:153-161`), so XP is copied, not moved. Recasting it as a conserving spill changes every world, frontier included. No world audit states the link | GTO2 in `PROGRESSION_GATE_OVERFLOW_2026-10-23.md` |
| Mistglass `p23.mistglass` GTO6 convert/strain, GTO7 depth | converted / pressure | T2. The world is an "original-proposal", `defaultEnabled: false`, no canon (`src/absorb_p23/world_adaptation/profile.js:2-3,14`; `techniques.js:1-2`). Strain and dose conversion are agent proposals, not source claims. The dose route would also need an item-grant effect; only consume and skill-XP effects exist in `prepareAdvance`/`prepareTrial` | overflow doc section 2 |
| Stubborn Skill Grinder SKG9 pressure, SG 5.1 | pressure / banked | T1. World id is a placeholder (`book.stubborn-skill-grinder`); no world pack in `src/world_packs/` (only `book_hp_pack.js`, `book_mol_pack.js`) | `STUBBORN_SKILL_GRINDER.md:241-273` |
| Shadow Slave SSO1-SSO8 | converted / spill / pressure | T1, and T2 for the spill and pressure rows (labelled "proposed"). No live world; the XP cap is not the counter these rows describe | `SHADOW_SLAVE.md:146-153` |
| Reverend Insanity RIE6/RIG rows | lost / template | T1: no live world; rows reuse the Mistglass template | `REVEREND_INSANITY.md:92-97` |
| LOTM LMP4 (lost then pressure at strainLimit 6) | pressure | T4: the consumer lives in `src/book_world_lotm_*`. It is also not a skill XP cap | `LORD_OF_THE_MYSTERIES.md:107` |

What would qualify (for a future pass): an MoL, Mistglass or other live-world row that
states, with a stated or shown label, what happens to excess on a capped consumer
that exists in code. Concretely: (a) a player reserve in `book.mol.cyoria` with a
growth cap, plus the Taiven claim as a `pressure` row against it; or (b) a decision
by Weibao that GTO2 may change to a conserving spill, with a per-world dial; or
(c) a live Grinder or Shadow Slave pack that owns the cap its row describes.
Each also needs the policy executor in `skill_overflow_domain.js`
(`settleCappedSkillGain` returns `Math.min(xp, cap)` for any non-banked policy,
`src/skill_overflow_domain.js:33`).

## Files changed

Imports only, copied from the primary checkout; no new source changes by this lane.
This report is the only new file beyond them.

## Input receipts (sha256 prefix, matched the checkpoint for all 13)

```
3e7cf4951422a890 src/progression_gates.js
c4157ab7d7b49f8c src/skill_overflow_domain.js
a813ed42b198f435 src/components/levelable_component.js   (primary diff applied)
b8c3dbf0cf97ba93 src/display.js                           (primary diff applied)
467b840551d0a0b1 src/reveal_chain.js                      (primary diff applied)
edbda4a5a177d959 src/chain_inspector.js                   (primary diff applied)
c0f94b730e18ac1e src/chain_inspector_ui.js                (primary diff applied)
7ba437e03dd2a60c tests/progression_gates.test.js
c6ed52a36c88647c tests/skill_overflow.test.js
d39935b55885b5ff tests/micro_p1_xp.test.js                (primary diff applied)
86bf219c0ee7d395 tests/chain_inspector.test.js            (primary diff applied)
c877800541e9e160 docs/PROGRESSION_GATE_RULES.md
66cbbdb96899d7d4 docs/PROGRESSION_GATE_OVERFLOW_2026-10-23.md
```

Also copied: `docs/worlds/progression-gates-2026-10-23/*`,
`docs/gm/dispatch/progression-gates-2026-10-23/*`. HEAD 547209e82.

## Checks

- `node --test tests/skill_overflow.test.js tests/progression_gates.test.js`: 9/9 pass. Proves the import is sane only; no gaps beyond that.
- `npm run build`, headless 1920x1080, `check:arch`, `check:rules`, full `npm test`: not run, since no code or UI changed. Gap: the GTL6 imports were not rebuilt here; the parent's own rebuilt evidence stands.

## Findings for the parent (worth a decision)

- F1 GTO2 duplicates XP into the parent rather than spilling it. This may be intended (a specialty teaches the general craft), but the overflow doc calls it "the one true absorption". Suggested wording fix: "mirrored into the parent, up to the gap". Proposed hunk for `PROGRESSION_GATE_OVERFLOW_2026-10-23.md` GTO2 row; not applied.
- F2 GTR29's example list (SG Celestial, LMP4-LMP6, RIG37-RIG40, SSO1-SSO8, MLP1) has no entry that is both live and source-stated. Suggested note under GTL10 in `PROGRESSION_GATE_RULES.md`: "Pilot blocked pending a live consumer; see GTL10_REPORT". Not applied.

## Remaining gates

Weibao's choice among (a), (b), (c) above, or a different consumer. Nothing committed,
pushed or published. Proposal status throughout.
