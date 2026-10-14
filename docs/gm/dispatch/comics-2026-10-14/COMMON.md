# Comics dispatch, common rules (2026-10-14)

Request (Weibao): "Considering comic worlds and stuff and more? more to
consider? other stuff and more? Cheats that would show stuff like these and
more? ... Send out codex as usesful? Subtle stuff too? Overarching stuff?
Implementation implciations and more? Abstaction thats needed?"

Root palette (Claude owns it, read only for you):
`docs/COMIC_WORLDS_AND_MEDIUM_CONSIDERATIONS_2026-10-14.md`. Earlier work
you must read and not repeat: `docs/research/comics/REPORT.md`,
`docs/research/comics/PLAYTHROUGH_TARGETS.md`, and the "Bounded comic
comparisons" section of `docs/worlds/LORE_AND_CONTINUITY.md`.

Rules for every lane:
- Research and documentation only. Do not change gameplay source, bundles,
  tests, saves or private packs. Do not commit or push. Do not edit any file
  outside your owned list; other agents are writing nearby.
- Read `AGENTS.md`, `PROJECT.md` and `~/.claude/user-preferences.md` first.
  Style: plain short words, no em dashes and no " -- ", short codes on rows.
- Considerations, not specs. Palettes, illustrative tiers, Default + Dial +
  Reasonably where a dial fits. No absolutes, no "once" limits, no either/or
  questions for Weibao; write the per-world dial instead.
- Label evidence: SHOWN (text/source with location), STATED (author,
  publisher, official or fandom wiki with URL), INFERRED (your proposal),
  MEMORY (recall, unchecked). Root rows marked MEMORY that you check: say
  CONFIRMED, CORRECTED (with source) or UNVERIFIED. Report contradictions
  both ways.
- Web: fandom wikis via the MediaWiki API (`api.php`) are fine; be polite
  (one request at a time, a short delay). One failed fetch route, then switch
  routes. Do not download comic scans or pirated pages. Quote at most a few
  words. Wiki text is CC BY-SA: paraphrase and cite.
- Sealed secrets: never open files named `SECRETS*`. Refer to secrets by ID.
- Franchise worlds: name sources as references. Direct franchise content
  goes to the private pack only, never committed docs.
- Keep a short CHECKPOINT section at the top of your main file so a resumed
  run continues. End with your `<LANE>_REPORT.md` listing what you wrote,
  sources read, root rows confirmed or corrected, and the 3-5 most useful
  new ideas for the root palette.
