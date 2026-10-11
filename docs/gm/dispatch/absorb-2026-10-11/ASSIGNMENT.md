# Absorption wave: v0.6 dev, Proto23, forks, 2026-10-11

Dispatched 2026-10-11 by Claude Code at Weibao's request: "Send codex to
absorb useful stuff accordingly, we can have furniture and more that gives
bonuses." One writer for `src/`, `tests/`, `dist/`, `index.html` and
`style.css` for the whole run. Follow AGENTS.md and
docs/GAME_MASTER_PROMPT.md. Private saves untouched. Sealed-secret rules apply.

## New accepted decision

Furniture, fixtures, accessories and similar owned things **may give passive
bonuses** (recorded in PROJECT.md, Accepted decisions). This replaces the
Proto23 branch's "fixtures without passive bonuses" choice. Specific numbers
are proposals. Keep bonuses small, readable in the UI and derived from saved
ownership on read, the way `src/titles.js` derives title bonuses.

## Sources (read before building)

- v0.6 dev: `miktaew/yet-another-idle-rpg-dev` master `f0e32c20` (7 commits
  after our pin `25afe1a8`; already fetched, reachable by hash).
- Proto23: [audit](../../../research/proto23/PROTO23_VS_YAIRPG_2026-10-10.md)
  sections 4 and 6, its [readers](../../../research/proto23/readers-2026-10-10/),
  and the [Xeus24 mod audit](../../../research/proto23/xeus24-mod-2026-10-10/XEUS24_MOD_AUDIT_2026-10-10.md)
  section 4. Do not copy Xeus24 code or text (no license); ideas only.
  Proto23's bug list (section 6) is what not to copy.
- Forks: [CANDIDATES.json](../../world-implementation/second-pass/fork-network-absorption/CANDIDATES.json)
  and [ADOPTION.md](../../world-implementation/second-pass/fork-network-absorption/ADOPTION.md).
  FNA01, 02, 03 and 06 are already adopted.
- Existing fork modules: grep `src/` before adding an owner. Reuse native
  items, skills, activities, the life record, titles and village career.

## Parts, in order

Each part ends at a playable checkpoint. Finish and verify a part before
starting the next. If the budget runs out, stop at a finished part and write
the remaining parts as a ranked backlog.

**A. Merge v0.6 dev master.** `git merge f0e32c20` onto
`codex/gameplay-foundations`. Resolve conflicts keeping both our extensions
and the new dev content (Days 2-7 locations, enemies, items, recipes, fixes).
Old fork saves must still load. Browser-check the new content from a fresh
origin.

**B. Furniture and home bonuses.** Give home furniture and fixtures (native
and the Proto23 branch's job-station furniture and home kit) passive
bonuses in the Proto23 spirit: rest quality, XP for related skills, crafting
or cooking convenience, storage. Proto23's book-shelf bonus from read books
is a good model. Show each bonus where the item is shown.

**C. Cheap Proto23 ideas.** O3 build accessories (luck, price, drop,
cook-anywhere style utility effects), O6 bad food and resistance training,
O7 "look around" with a capped rising find chance, O8 hub encounters and a
recurring service. Add the Xeus24 section 4 ideas that fit.

**D. Fork patterns.** FNA04 known remaining clear rewards, FNA08
knowledge-gated item-source journal, FNA12 repeatable funded local work
board (check overlap with village career first), FNA05 Fort resource and
quest chain reauthored as original content. Others in CANDIDATES.json if
they are cheap and clearly useful.

**E. Pacing systems.** O2 hunger scaling efficiency, O4 weather states over
the temperature model, O5 durability with cheap repair, O9 elemental
affinities. These change pacing, so ship each behind a player setting so
both styles stay reachable; pick defaults and say why in REPORT.md.

## Rules

- Persistence changes need a migration or an explicit compatibility note.
  Old saves, including pre-merge fork saves, must load.
- Anything not exercised in a browser is implemented-unverified and goes in
  this folder's ACCEPTANCE_BACKLOG.md.
- Commit locally after each verified part on `codex/gameplay-foundations`
  with a plain message and no Co-Authored-By trailer. Do not push. Stage only
  this wave's paths.

## Verification gate (each part)

`npm test`, `npm run build`, then a fresh browser origin journey of the
changed behavior, then save, reload and import.

## Output

CHECKPOINT.md (update as you go), REPORT.md (short, plain: what changed,
what to click to see it, what was checked, what remains), PROJECT.md entries
marked proposal.
