# Maker arts dispatch, common rules (2026-10-14)

Request (Weibao): "Weaponcrafting, runestuff, other stuff and more? more to
consider? ... Cheats that would show stuff like these ... Subtle stuff too?
Overarching stuff? Implementation implciations? Abstaction thats needed?"

Root palette (Claude owns it, read only for you):
`docs/WEAPONCRAFT_RUNES_AND_MAKER_ARTS_CONSIDERATIONS_2026-10-14.md`.

Rules for every lane:
- Design and documentation only. Do not change gameplay source, bundles,
  tests, saves or private packs. Do not commit or push. Do not edit any file
  outside your owned list; other agents are writing nearby.
- Read `AGENTS.md`, `PROJECT.md` and `~/.claude/user-preferences.md` first.
  Style: plain short words, no em dashes and no " -- ", short codes on rows.
- Considerations, not specs. Palettes, illustrative tiers, Default + Dial +
  Reasonably where a dial fits. No absolutes, no "once" limits, no either/or
  questions for Weibao; write the per-world dial instead.
- Label evidence: SHOWN (text/source with location), STATED (author,
  publisher, official wiki with URL or file path), INFERRED (your proposal),
  MEMORY (recall, unchecked). Contradictions between sources are reported
  both ways, not resolved by fiat.
- Sealed secrets: never open files named `SECRETS*`. Refer to secrets by ID.
- Private novels under `docs/research/novels/` may be read; quote at most a
  few words, cite chapter/page/file lines. Never copy prose into committed docs.
- Existing owners (P6 SMITHING/PATTERNS, crafting palette, materials audit)
  are read-only; link, do not duplicate. Use the palette codes (WC, AR, RN, OM, WQ, RC, SB, OV, IM, AB).
- Keep a short CHECKPOINT section at the top of your main file so a resumed
  run continues. End with a final report file listing what you wrote, sources
  read and open questions.
