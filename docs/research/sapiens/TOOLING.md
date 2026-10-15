# Tooling and reproduction

Lane: fs-sapiens. No tools installed, no network fetch, no clone and no game/native code executed. No git add/commit/push. No save or account state copied.

## Source snapshot

Installed source: `~/Library/Application Support/Steam/steamapps/common/Sapiens/Sapiens.app/Contents/Resources/GameResources/`. App 1060230, manifest build ID 19991669. Mac `.app` is present; prior Windows-only/not-installed guesses corrected from local payload. Manifest read only for build identity; do not copy its account fields.

481 `.lua` files, 8,066,276 bytes. Work extract: `/Users/weiwei/.codex/research/fs-sapiens/extract`. SHA-256 manifest: `extract/HASHES.txt`, paths relative to GameResources. Selected full reference: `docs/research/sapiens/private/fs-sapiens/source/`; private hashes `SOURCE_HASHES.json`. Whole extract inventory: `notes/inventory.json`.

## Commands that worked

- Read FEATURES.md, COMMON.md, ASPECTS.md in prompt order, then PROJECT top 80, USER_VISION relevant sections, P01/P03/P04 packets and chain round 5.
- `git status --short` before writes confirmed many unrelated live changes. Only this output dir is written.
- Python 3 isolated `Path.rglob('*.lua')`, `shutil.copy2` and `hashlib.sha256` copied and hashed plain Lua to lane extract. No imports from donor.
- `rg -n` over research, skillLearning, serverSapienSkills, serverWorld, planManager, resource manager, evolution, craftable, social/mod/tutorial and UI files traced tables and callers.
- Whole scripts search for teach/teacher/teaching/taught found action-learning names, no actor-to-actor transfer. Follow-up social and active-order reads distinguish this from interpersonal instruction.
- `sed -n` read bounded function bodies. `rg --files` inventoried every module. Native `.app` was not launched.
- `git check-ignore docs/research/sapiens/private/fs-sapiens/example.json` confirmed private root ignored.
- `python3 -I /Users/weiwei/.codex/research/fs-sapiens/tools/write_dossier.py` writes the dossier, source-preserving private registration JSON, and module inventory. This is the reproducible output generator. It never evaluates donor Lua.

## Dead ends and limits

`docs/research/sapiens/` did not exist before this lane. A guessed `server/serverSocial.lua` is absent; route switched to `common/social.lua` plus AI consumers. Broad output was truncated once, then bounded file/line reads replaced it. Memory registry search returned no relevant Sapiens/wave hit; no memory facts used. No fetch failures.

Registration JSON contains raw Lua expression bodies, not evaluated runtime values. 35/77 are registration-call counts, not a claim that all entries remain current content. No exact recipe duration inferred from cadence alone. Native engine and physical database encoding excluded; runtime UI, interruption and reload not tested.

## Verification

Final isolated structural checker verifies required public files, all twelve aspect keys/statuses, five feature rows, six proposals, 26 touches, 481 exact source hashes and private ignore. Results recorded in CHECKPOINT. Output-only diff inspected. Source documentation validation is not playable acceptance.
