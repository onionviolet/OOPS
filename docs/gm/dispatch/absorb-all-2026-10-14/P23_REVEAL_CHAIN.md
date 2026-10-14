# Proto23 reveal-chain proposal, 2026-10-14

Authorization and lane scope are in COMMON.md in the canonical absorb-all dispatch.
The implementation is an original behavioral adaptation, with no Proto23 code or
assets copied. The standing owners remain USER_VISION.md and PROJECT.md.

Target: 1366x768 desktop/laptop. Visible outcome: skills and their categories enter
at the first real level; practiced actions, learned preparations and reading
references have separate earned panels. Save, reports and settings remain reachable.
Mobile optimization is deferred. The original opening remains the default;
Effects & sound has an opt-in Staged opening setting.

The lane adapts ledger rows 19, 22, 25, 47, 69, 75, 83 and 85 (one-based rows).
Skill discovery uses the unchanged native XP curve and first-level cost. Twenty-six
previously milestone-free definitions now have a modest, explicitly authored
first-level stat perk. Running level 1 teaches the Run travel toggle; Perception
level 1 teaches an Investigate toggle over the existing Local life search owner.
Twenty held Golmoon leaves teach Weak healing powder and reveal Learned preparations.
ABC for kids or Old combat manual completion reveals a Reading reference view with
an entry to the existing Journal/Bestiary. Literacy increases study rate by 5% per
level, capped at 50%; remaining time uses the same rate.

Compatibility: XP totals, levels and book completion work thresholds are unchanged.
Old partial books restore raw work, without applying study speed during loading.
Literacy XP tracks completed work to preserve native save validation. Newly authored
perks are derived from earned levels on load, once through the existing engine.
Run, herb knowledge and per-world coin knowledge are optional actor facts; absence
means off/unlearned. Herb acquisition and unfamiliar coin settlement stage knowledge
in the existing durable transaction. Browser introduction progress is per-browser,
not part of the life save. Unsupported save schemas continue through native rejection.

Source commit: `51827c04`. Build, 18 focused tests, 626 full tests and nine rebuilt
fresh-origin desktop browser groups pass. Browser groups use controlled prerequisites
in disposable contexts, then execute native practice, craft, chest, reading, authored
work and persistence handlers. The Alchemy craft visibly grants +1 Intuition and
its existing discovery cue. Run's native comparison is 10 versus 8 travel minutes;
its nominal 2 stamina cost respects native efficiency. Partial reading, four
completed state families, Save/reload and literal-file import are verified.

[Verification](checks/reveal-verification.json), [browser results](checks/reveal-browser-results.json),
[real perk screenshot](checks/reveal-perk-1366x768.png) and
[browser harness](checks/reveal-browser.cjs) preserve evidence. Rebuild before
serving; generated dist/index versions are not committed.

The canonical lane report and per-row JSON are `reports/p23-reveal-chain.md` and
`reports/p23-reveal-chain.ledger.json` in the main dispatch. No taste acceptance,
push or merge is claimed. The remaining acceptance gate is Weibao's play/taste.

Merge review: main.js and display.js overlap UI/life/upstream lanes; items.js and
crafting_recipes.js may overlap UI/upstream work. Keep the narrow current-owner
hooks. This lane does not edit absorb_c2's life/search implementation. Reconcile
its new found/availability terms with Investigate's blocked reason if that owner
changes. Do not overwrite newer full files or rebuild another worktree's bundle.
