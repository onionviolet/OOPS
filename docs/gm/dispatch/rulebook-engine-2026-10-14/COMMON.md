# Rulebook engine lanes, 2026-10-14: common rules

Authority: Weibao, 2026-10-14: "send out codex accordingly, but consider next
best set of rulebooks and whatever that can help incorproated and more?"
Root doc (Claude owns it; read only for you):
`docs/RULEBOOKS_FOR_WORLDS_AND_GM_CONSIDERATIONS_2026-10-14.md`. It holds
RB, R, GM, GMA, MV, NR, OS, EX, EP, EC, EA, HD, NB and MC5 codes. Extend its
codes in your report; do not restate them.

Coordinator: the Claude session that owns this folder. Workers are Codex CLI
runs. Everything you produce is a proposal until root and Weibao review it.

## Rules for every lane

- First read `AGENTS.md`, `PROJECT.md` top sections, `~/.claude/user-preferences.md`
  and the root doc sections your lane names. Style: plain short words, no em
  dashes and no " -- ".
- Write only the paths your lane prompt names. Many other agents are active
  and machine load is high; keep test runs targeted.
- Code lanes work only in their own worktree and branch. Add new files; do not
  edit existing `src/` files (wrap or import them instead). Run targeted
  `node --test` files, then `npm test` once at the end. Commit on your own
  branch with a plain message and no Co-Authored-By trailer. Do not merge,
  push, rebuild `dist/` or touch saves.
- Docs and research lanes write in the main checkout only under
  `docs/gm/dispatch/rulebook-engine-2026-10-14/<lane>/` plus any private path
  the lane names. Do not stage or commit.
- Existing seams to reuse, not duplicate: `src/rule_modules.js` (layered rule
  modules, rule lock), `src/rules.js` (reasons), `src/gen_kit.js` (addressed
  draws, tables), `src/tag_store.js`, `src/power_models.js`,
  `src/realm_traveler_profiles.js`, `src/storylet_deck.js`, `src/conditions.js`,
  `src/active_effects.js`. Also read `docs/GENERATION_FOUNDATION_RULES_2026-10-14.md`
  GR1-GR17 and follow them for anything random.
- Code claims cite `file:line` from a read you actually did. Label claims
  SHOWN (read), INFERRED (your proposal) or UNKNOWN.
- Rulebook text: private full text is under
  `docs/research/tabletop-library-2026-10-14/private/text/` and searchable with
  `python3 docs/research/tabletop-library-2026-10-14/search.py '<fts query>'`.
  Keep exact rules, tables and quotes in a gitignored `private/` folder under
  your lane folder; committed or shared files paraphrase and cite page or
  heading. Only CC-BY or other verified open text (D&D SRD 5.1/5.2.1,
  Ironsworn) may be copied into data meant to ship, with attribution.
- One edition per world. D&D uses SRD 5.2.1 unless your lane says otherwise.
- Any proposed save shape change names its migration or compatibility
  decision. Old saves must stay inert.
- Sealed secrets: never open files named `SECRETS*`; refer by ID.
- Keep every reasonable option reachable; limits are per-world adjectives,
  never fixed "once" rules.
- Keep `CHECKPOINT.md` in your lane folder (main checkout) so a resumed run
  continues. Finish with `REPORT.md` there: what changed, checks run with
  counts, what stays open. Never claim gameplay works; no browser proof is
  part of this wave.
