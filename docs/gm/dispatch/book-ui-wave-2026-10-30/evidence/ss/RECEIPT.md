# bk-ss receipt (2026-10-30)
- Bundle: dist/bundle.js sha256 prefix fd7b7dc434eedc47, built on branch claude/bk-ss-6f266e rebased on master 7a194cb35.
- Route (FLR2): fresh origin, Beginning panel, choose "Shadow Slave · original Second Nightmare trial", confirm; prepare, cross, rushed route, settle. Rebuilt desktop browser 1920x1080 (scripts/ss_trial_browser.cjs, 7 checks pass). MCP walk not done.
- Shown (FLR3): ladder block (compact) + action descriptions with cost/time; risk is health loss and injury, no random death.
- Used (FLR4): Ascended gates the "Rest in the Dream Realm shallows" command; promotion sets the rank fact.
- Kept (FLR5): save, reload, Export, Import exercised; rank stays Ascended.
- Tests: node --test tests/shadow_slave_trial.test.js (3 pass); neighbouring structured_pack/expedition/ascension/SS tests 66 pass (pre-rebase). check:arch and check:rules pass.
- Review state (FLR6): agent-verified, not human-reviewed.
- Defects seen: unlocking a panel (Notes, practice & people) auto-switches the centre panel mid-trial; a refused action shows two stacked reasons including the generic "required knowledge, means or circumstances are missing"; the crossing carry list (WCO1) is not wired (Enter is a plain button) = below floor for that part.
