# Divergence pass 2026-10-10: Er Gen haul and wave 09b

Dispatched 2026-10-10 by Claude Code at Weibao's request. The Er Gen haul
lens ([COMMON.md](../er-gen-haul-2026-10-09/COMMON.md)) primed every run with
"insight grows out of work", so their top proposals echo the prompt and
the north star. This pass fixes that from the saved notes. **Do not reread
the books** except to check a specific passage a claim depends on.

Follow AGENTS.md and the new
[lens discipline](../../NOVEL_SOURCE_GM_PROMPT.md#lens-discipline-for-book-runs-weibao-2026-10-10).

## Inputs (read-only)

- `docs/research/novels/er-gen-haul-2026-10-09/{renegade-immortal,issth,a-will-eternal,beyond-the-timescape,dao-bizarre-immortal}/`:
  chunk notes, dossiers, proposals, cards, NORTH_STAR_FINDINGS.md
- `docs/research/novels/novel-wave-2026-10-09b/` (Skill Eater 1-5, Wish 5-8)
- `docs/LIFE_SIM_NORTH_STAR.md` and `docs/WORLD_CARDS.md`

Treat the chunk notes as the primary record; dossiers and proposals were
written under the biased lens. If a book's run is not complete, use what
exists and say so.

## Questions, per book

1. What does this book do that the north star lacks? At least five points,
   each with chapter locators, ranked by how much they would change play.
2. Where does it contradict the north star, an earlier wave or the other
   books here? Contradictions are the most valuable output.
3. Re-tag each of the run's existing proposals: new, extends (cite the
   north-star section) or restates. Drop nothing; just tag.
4. What did the run under-cover because the lens pointed elsewhere? Check
   the chunk notes for it: villains' and side characters' lives, failure
   and death, economy and scarcity, humour and tone, pacing and boredom,
   time skips, what the protagonist loses for good.

Across books: count the four Er Gen books as one source family. Name which
findings are confirmed across independent authors (Er Gen family, Foxtail
Quill, Magnus Grey, Malcolm Tent) and which are single-family.

## Output

Write in `docs/research/novels/divergence-pass-2026-10-10/` (gitignored):
1. REPORT.md: short plain-language summary first; the top ten new or
   contradicting ideas across all books, ranked, each with its book family.
2. One DIVERGENCE-<book>.md per book.
3. ECHO-AUDIT.md: the re-tagged proposal table.
4. CHECKPOINT.md, saved as you go.

Then you are the single writer of one dated "Er Gen haul and divergence
findings (2026-10-10)" subsection in `docs/LIFE_SIM_NORTH_STAR.md`:
paraphrase only, proposals marked as proposals, organised by what is new or
contradicting rather than by consensus. Do not edit any other section,
`src/`, builds, saves or commits. Use subagents only for per-book passes,
at most three live, each owning its own DIVERGENCE file.

## Addendum: fold the earlier-wave passes (2026-10-10)

Five more notes-only lanes run in parallel
([assignment](../divergence-earlier-2026-10-10/ASSIGNMENT_COMMON.md)), writing
`docs/research/novels/divergence-earlier-2026-10-10/{wave-10-08,wave-10-09,secondary,full-book-1,full-book-2}/`. Before writing the north-star subsection, check their
CHECKPOINT.md files. If a lane is still running, finish your own work and
wait for it (check every few minutes; it is live if a `codex exec` process
names `divergence-earlier-2026-10-10`). Then fold each lane's
NORTH_STAR_FINDINGS.md into your subsection and add its top ideas to your
cross-wave ranking. If a lane stopped without "Status: complete", fold what
exists and say so. You remain the only writer of `LIFE_SIM_NORTH_STAR.md`.
