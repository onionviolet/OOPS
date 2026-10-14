# Tooling and reproducible recovery

Lane work: `~/.codex/research/vagrus-2/`. No clones. No game/injector launch. Main checkout writable only at this pass directory; Province War read-only. Raw code/prose/table data remain private.

## Prior inputs and current build

Prior `INTAKE.json` names build 25598304 and `~/.codex/research/vagrus/reproduce_tables.py`. Current manifest still has that build, StateFlags 4 and SizeOnDisk 5479725761. The prior private directory does not exist in this session. A bounded path search under `.codex/research` and `.claude` found no reproduction script. Finished old reads were reused from public prior outputs; only missing evidence required for new questions was recovered.

`docs/gm/dispatch/game-source-research-2026-10-06/DEPTH_QUEUE.json` exists but has no Vagrus entry. The alternate `game-research-source` spelling is absent. No queue edits.

## Commands that worked

Run from the repository with paths as shown; keep all generated outputs private except the derived reports.

```sh
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/tools/ilspycmd" -p -o "$HOME/.codex/research/vagrus-2/extract/code" "$HOME/Library/Application Support/Steam/steamapps/common/Vagrus - The Riven Realms/Vagrus.app/Contents/Resources/Data/Managed/Assembly-CSharp.dll"
python3 -m venv "$HOME/.codex/research/vagrus-2/tools/venv"
"$HOME/.codex/research/vagrus-2/tools/venv/bin/pip" install UnityPy cryptography
"$HOME/.codex/research/heavens-vault/tools/venv/bin/python" -I "$HOME/.codex/research/vagrus-2/tools/recover.py"
python3 -I "$HOME/.codex/research/vagrus-2/tools/index_probe.py"
python3 -I "$HOME/.codex/research/vagrus-2/tools/write_reports.py"
python3 -I "$HOME/.codex/research/vagrus-2/tools/finalize.py"
```

The first actual recovery used the existing heavens-vault UnityPy interpreter while this lane's dependency download was pending. That environment was only read, not modified. Own venv later installed successfully and supports the same `recover.py` command. `recover.py` derives loader constants from private decompiled PoolLoader, selects exactly the event/AirTable bundles by prior SHA-256, reads TextAssets with UnityPy, reproduces PBKDF2-SHA1/AES-CBC via local openssl, JSON-validates and writes the tables privately. It does not execute the assembly. No keys are placed in public outputs.

Versions: .NET SDK 10.0.402 and ILSpy 11.1 were preinstalled per wave tooling; current CLI version captured in private notes. User-local install this lane: UnityPy 1.25.4, cryptography 50.0.2 and dependencies, recorded in `notes/pip-install.log`. No sudo/global installs. Cryptography remained unused in the final OpenSSL recovery path.

Recovery receipts: `extract/RECOVERY.json` gives installed bundle paths/input hashes and decoded hashes; `INPUTS.json` gives hash-matched assembly/graph copies. `extract/HASHES.txt` hashes recovered code and extracts. The two selected original data bundles are read in place, not duplicated. Mechanical table recovery needs the unchanged install or copies of the exact hashed bundles.

| Table | Decoded bytes | SHA-256, same as prior pass |
|---|---:|---|
| events | 29671814 | 46cfaa96f369f6b816fad13888c1413df30d35972e66021c8f4cf2d0cc64e84b |
| AirTable | 8671302 | dd0a614e027216ee32cf8da9c258c6447e4c522ca6652962d58aec818cae5c0d |

`INDEX.json` is a lexical census; `PROBES.json` contains independent arithmetic checks. Neither substitutes for running the parser or gameplay. `companion-script-xref.json` contains private scripts without narrative descriptions. Decompiling all types made them searchable; only the readset described in COVERAGE was semantically reviewed.

## Dead ends and route switches

- Missing prior private directory prevented reuse of reproduce_tables.py. Exact-hash selective recovery replaced it; no finished full narrative read was repeated.
- An early recover.py call reached the new venv before pip finished and failed `ModuleNotFoundError: UnityPy`. Reused existing local UnityPy and OpenSSL, then confirmed the own venv install completed. No repeated installs.
- Initial searches used generic Event.cs/EventPool.cs names that do not exist; actual scheduler is `Vagrus.Data/GameEvent.cs`. Outer Realms movement type is PathManager_OR, not the guessed OuterRealmsMovementManager filename.
- Developer site Heart of Ruin FAQ and hireling article timed out once each. Switched to official Steam product pages; no retries or login.
- Alternate companion additions looked like potential returns; root recruitment/visit flags narrowed these to alternate first-hire routes. Return exceptions remain a named gap rather than a blanket claim.

## Public source register

Official product pages, read 2026-10-14: [Patronage](https://store.steampowered.com/app/1761710/), [Vorax](https://store.steampowered.com/app/1979380/), [Seekers](https://store.steampowered.com/app/2079340/), [Sunfire](https://store.steampowered.com/app/2297000/), [Old Acquaintances](https://store.steampowered.com/app/2672530/), [Heart of Ruin](https://store.steampowered.com/app/2672540/). Descriptions are stated evidence; gameplay additions are paraphrased in DLC_CONTENT, not inferred from promotional art.

No web dumps, raw scripts, assets, secrets or personal save data are committed. Coordinator owns any later git actions.
