# Tooling and rerun

Date: 2026-10-14. Installs: **none**. Game/demo downloads: **none**. Public media downloaded: six store JPEGs (1920×1080). No game launch, injector, account login, Steam dialog, terms acceptance, save access, git staging/commit/push or production write.

Work area: `~/.codex/research/mw-multiverse-idle-ui/`. Private raw captures: `extract/`. Analysis generation script: `notes/write_dossier.py` (stdlib only). No foreign source repo cloned; therefore no foreign commit pin. YAIRPG observation branch `codex/gameplay-foundations`, HEAD `ad89c04ecb926ee701df03842f5b0d219f58ebe2`; no claim checkout stayed fixed while other lanes worked.

## Commands/routes that worked

- Read COMMON.md, ASPECTS.md, PROJECT top 80, USER_VISION standing UI and relevant directions, both world-kit roots, scale/thematic UI owners, synthesis REPORT and integration map. Located nested-world owner with `rg --files docs`: it lives under `docs/gm/dispatch/`, not the prompt's `docs/` root.
- `git status --short`, `git branch --show-current`, `git rev-parse HEAD`, scoped status for output dir. Main checkout already had unrelated work; untouched.
- `python3 -I` with `urllib.request.urlopen` fetched `https://store.steampowered.com/api/appdetails?appids=4122910&l=english` into `extract/appdetails.json`. Decode `['4122910']['data']`, read `screenshots`, `movies`, `demos`, `release_date`, `is_free`.
- For each `screenshots[].path_full`, fetch to S01.jpg through S06.jpg, with 1s pause. View each using `view_image`. First shell returned a live session; first two images existed while later ones were still downloading. Waited for completion before viewing S03-S06. No failed image redownload.
- Captured official Itch page/devlogs, Steam discussion index and news API with urllib (20s per-page timeout, 1s pause). Captures remain raw outside repo. News API returned zero items.
- Web route read Steam store, official Itch/three devlogs, developer-authored Reddit demo thread and replies, Steam discussion index, Godot pack docs and GDRETools readme. Steam threads could not be opened; bodies remain unread. No native browser control used.
- `python3 -I ~/.codex/research/mw-multiverse-idle-ui/notes/write_dossier.py` writes this lane's dossier only. Verify JSON with Python `json.loads`, A01-A12 keys/statuses, local Markdown links, counts and allowed output paths. SHA-256 raw files into `extract/HASHES.txt`.

## Dead ends and route switches

Steam `/allnews/` failed in web tool once. Switched to official Itch devlogs and Steam news API, not URL variants. Three thread-body requests failed; switched to already accessible developer/player discussion on Reddit and official Itch comments, leaving Steam body-specific conclusions unread. Prompt owner path absent; `rg` found canonical dispatch location. Large combined owner reads were truncated; targeted follow-up sections recovered the relevant direction and topic map.

## Conditional decompile route, not executed

Official metadata states Godot ([E02](https://kappagames.itch.io/multiverse-idle)). Engine version/language unverified. If actual demo/installed files become available under a later lane: inventory and hash read-only, identify engine and PCK/embedded pack, pin compatible recovery tool release/commit, read its help, extract into a fresh work-area directory. [Godot pack documentation](https://docs.godotengine.org/en/stable/tutorials/export/exporting_pcks.html) supports looking for scripts/scenes/resources. [GDRETools](https://github.com/GDRETools/gdsdecomp) is a candidate, not a proven extraction result. If managed assemblies appear use assembly inspection; if native-only record that boundary. Do not invent a successful extraction command without files or tool help. Preserve full recovered tables/text privately and paraphrase findings. Do not open the recovered project in an engine or run game code in this read-only lane.
