# Majora's Mask (N64 US): tooling and provenance

Date: 2026-10-14. Work root: `/Users/weiwei/.codex/research/bf-public-other/`. Installs: **none**, including no game, mod loader, library or new CLI. Existing git, Python 3 and shell only. No downloaded script/build was executed. The two fetch scripts, indexer and output generator are original research helpers under `tools/`. All downloaded content was treated as data.

Read first: COMMON then ASPECTS, PROJECT top 80 lines, standing UI/deep-detail/possible-options USER_VISION sections. Prior REPORT and CHECKPOINT read for each game. No separate prior COVERAGE.md/TOOLING.md exists. Prior Rogue Legacy COVERAGE.json records bounded historical coverage; it is not proof of fresh semantic reads.

Public clone: `https://github.com/zeldaret/mm.git`, private path `repos/mm`, HEAD `bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22`. Worked: `git clone --depth 1 <URL> <empty destination>`; `git -C <destination> rev-parse HEAD`; `rg --files`; targeted `sed`/`rg`; `python3 -I tools/inventory.py`. Fresh pin equals the prior pin. See [hashes](/Users/weiwei/.codex/research/bf-public-other/extract/HASHES.txt). No submodule dependencies, ROMs or retail assets acquired.

License boundary: WIP N64 US decomp README; no root game-source reuse grant established. .schl is community reconstruction syntax. Full message prose depends on extracted generated assets and remains unavailable here.

Dead-end local lookups: some expected source paths differed from guesses (MM qrand is under src/boot/libc64; RL LocaleBuilder is under RogueCastle, diary room under Game Objects/RoomObjs; NH class is ConditionalsManager). Switched to rg file discovery. Large initial combined prior-file output was truncated, then bounded game reads supplied the missing content. No missing file was silently treated as an absent system.

Private data contains full public captures and clones, not personal saves. Committed outputs contain paraphrase and short identifiers only. No git add/commit/push, source edit, runtime build, launch or owner update. Later native acceptance belongs to a selected implementation wave.
