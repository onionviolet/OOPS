# TA2: per-world ask profiles (docs)

Read COMMON.md and PLAN.md in `/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/traveler-asks-2026-10-14/` first. Write only in `docs/gm/dispatch/traveler-asks-2026-10-14/ta2/`. Docs only; no code edits.

Goal: for each world the game has or plans, describe what travelers, locals and visitors reasonably ask for, so a later code lane can plug a world's ask profile into TA1's table shape (PLAN TA-L1).

Read: `docs/worlds/` (world core kit, origins), procgen `p9/` (book-world profiles), `p10/` (anime and original worlds), `p8/` (resources), `p11/CONTEXT.md`, `p21/ECONOMY_STORIES.md`, `gx1/`, `PROJECT.md` world list. Sealed secrets stay sealed: refer by ID.

For each world (playable ones first, then planned): who travels or asks (roles), common needs by season and situation, ask kinds that fit (goods, services, information, favors), what the world's economy pays in (coin, favor, lesson, standing, rumor), effort and danger bands, what must never be asked (breaks canon or tone, leaks secrets), and 6-12 example asks with fiction lines and an obtainability note. Flag canon facts with sources; mark original inventions as such.

Also write `SHAPE.md`: the smallest profile data shape that covers every world (fields, tags, per-world adjectives like cadence), checked against TA1's live ask table once TA1 commits (read its branch with `git show proc/ta1-village-asks:...`; if not there yet, say so).

Done when: REPORT ranks which world should get generated travelers next and why, with the profile ready to build.
