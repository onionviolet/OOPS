# Weaponcraft and runes dispatch, common rules (2026-10-14)

Request (Weibao): "Weaponcrafting, runestuff, other stuff and more? more to
consider? ... Cheats that would show stuff like these and more? ... Subtle
stuff too? Overarching stuff? Implementation implciations and more?
Abstaction thats needed?"

Root palette (Claude owns it, read only for you):
`docs/WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md`.
Existing owners to link, not duplicate:
`docs/PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md`,
`docs/PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md`,
`docs/worlds/PROGRESSION_AND_ASSEMBLY.md`,
`docs/gm/dispatch/procgen-2026-10-13/p6/REPORT.md`,
`docs/CHEAT_LIBRARY.md`, `docs/MEANS_AND_APPRAISAL.md`,
`docs/UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md`,
`docs/gm/dispatch/ui-at-scale-2026-10-14/CHEAT_UI_REFERENCES.md` (surface
kinds V1-V13, CU codes).

Rules for every lane:
- Design and documentation only. Do not change gameplay source, bundles,
  tests, saves or packs. Do not commit or push. Do not edit any file outside
  your owned list; many other agents are writing nearby.
- Read `AGENTS.md`, `PROJECT.md` and `~/.claude/user-preferences.md` first.
  Style: plain short words, no em dashes and no " -- ", short codes on rows.
- Considerations, not specs. Default plus dial; keep every reasonable option
  reachable; no either/or questions for Weibao; no fixed "once" limits (use
  per-world adjectives). True properties work whether known or not; reload
  never rerolls.
- Label evidence: SHOWN (file with lines, or a page you loaded, with URL),
  STATED (official docs, author, wiki with URL), INFERRED (your proposal),
  MEMORY (unchecked recall). Report contradictions both ways.
- Sealed secrets: never open files named `SECRETS*`. Private novels in
  `docs/research/novels/` may be read; quote at most a few words with
  file/chapter locators; never copy prose into committed docs.
- The machine is loaded: no builds, browsers or test suites.
- Keep a CHECKPOINT section at the top of your main file. End with a report
  file listing what you wrote, sources and open questions.
