# UI at scale dispatch, common rules (2026-10-14)

Request (Weibao): "Long term ui considerations for when the scope gets bigger
and more?", then "We can give specific panels and stuff for cheats and more,
but where to put accordingly", then "more to consider? other stuff and more?
save and extend accordingly Send out codex as usesful? How does other games do
it and more?"

Root palette (Claude owns it, read only for you):
`docs/UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md` (codes SC, NV, IN, MW, EN, PC,
PL, ZN, CS, MC). Related owners: `docs/PANEL_KIT.md`,
`docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`,
`docs/UI_DENSITY_AND_ORIGINAL_COMPARISON_AUDIT_2026-10-13.md`,
`docs/UI_CONSISTENCY_AND_MODULARITY_AUDIT_2026-10-11.md`,
`docs/CHEAT_LIBRARY.md`,
`docs/gm/dispatch/cheat-considerations-2026-10-13/W3_HIDING_UI_AND_INTEGRATIONS.md`,
`docs/worlds/NONHUMAN_SENSES_SCALE_AND_UI_2026-10-14.md`.

Standing direction: desktop and laptop first (1366x768 and 1920x1080), mobile
deferred (`docs/USER_VISION.md#standing-ui-priority-2026-10-13`). Do not turn
mobile into a requirement.

Rules for every lane:
- Design and documentation only. Do not change gameplay source, bundles,
  tests, saves or packs. Do not commit or push. Do not edit any file outside
  your owned list; many other agents are writing nearby.
- Read `AGENTS.md`, `PROJECT.md` and `~/.claude/user-preferences.md` first.
  Style: plain short words, no em dashes and no " -- ", short codes on rows.
- Considerations, not specs. No either/or questions for Weibao; give a
  default plus a dial and keep every reasonable option reachable.
- Label evidence: SHOWN (screenshot, source file with lines, or a page you
  actually loaded, with URL), STATED (developer post, official docs, wiki,
  with URL), INFERRED (your proposal), MEMORY (recall, unchecked). Report
  contradictions both ways. Prefer official docs, dev blogs, GDC talks,
  wikis and mod pages. Do not copy long text; paraphrase, quote a few words.
- Sealed secrets: never open files named `SECRETS*`.
- The machine is heavily loaded: do not run builds, browsers or test suites.
- Keep a short CHECKPOINT section at the top of your main file so a resumed
  run continues. End with a report file listing what you wrote, sources and
  open questions.
