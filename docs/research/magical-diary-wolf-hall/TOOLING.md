# Tooling and rerun, 2026-10-14

## Sources and tools

Read-only install: `~/Library/Application Support/Steam/steamapps/common/Magical Diary Wolf Hall/`; game marker `WolfHall-1.1.10`; engine `renpy/__init__.py` reports 6.99.12.2 +SPIKY. The actual installed `game/modules` contains optimized Python 2.7 bytecode. Character folders inspected are sprite directories, not independent compiled route scripts. No RPA found under game.

Work: `~/.codex/research/fs-magical-diary/{repos,tools,extract,notes}`. Tool source: https://github.com/CensoredUsername/unrpyc, master commit `3ae8334ed71a05535927dcc559663d3aca51215b`, v2.0.3. README and decompiler entry/import/unpickle implementation read before use. CLI documentation explicitly supports RenPy 6.18+ using modern Python; legacy branch would require Python 2.7. This lane selected the documented master CLI for 6.99.12.2, not the injector. Reconstructed old-engine warning retained in log.

Local installs: two venvs created. Default Homebrew Python 3.14 failed on the decompiler FakePackageLoader lacking exec_module. Switched to `/usr/bin/python3` 3.9.6 and venv39. No patch to the tool or game was needed. In venv39, pip installed uncompyle6 3.9.3, xdis 6.1.8, spark-parser 1.9.0, click 8.1.8, six 1.17.0. unrpyc has no required pip install for this CLI route; it ran from the inspected clone. Pip install log: `notes/pip.log`. Venv creation used Python's bundled pip. No sudo or system package changes.

## Commands that worked

Run from this lane's repo working directory. The exact copying/decompilation and report scripts are retained in work notes. Never pass install files directly to unrpyc: it writes beside inputs. Copy first.

```sh
git clone https://github.com/CensoredUsername/unrpyc.git "$HOME/.codex/research/fs-magical-diary/repos/unrpyc"
/usr/bin/python3 -m venv "$HOME/.codex/research/fs-magical-diary/tools/venv39"
"$HOME/.codex/research/fs-magical-diary/tools/venv39/bin/python" -I -c 'import sys,runpy;sys.path.insert(0,sys.argv[1]);sys.argv=[sys.argv[1]+"/unrpyc.py","-p","2",sys.argv[2]];runpy.run_path(sys.argv[0],run_name="__main__")' "$HOME/.codex/research/fs-magical-diary/repos/unrpyc" "$HOME/.codex/research/fs-magical-diary/extract/game"
"$HOME/.codex/research/fs-magical-diary/tools/venv39/bin/python" -I -m pip install uncompyle6
```

The initial copy used isolated Python pathlib/shutil to preserve all relative *.rpyc paths. 66 inputs produced 66 successful outputs in `notes/decompile39.log`, exit 0. For selected *.pyo, copy into extract/modules then use `uncompyle6.main.decompile_file(str(copied_path), outstream=open_output)` under venv39 Python -I. Seven selected modules: wolfhall, spells, units, conditions, unroller, safepickle, sanitize_wh. All seven commands returned successfully. Read reconstructed text; never import or execute it. Standalone trailing return statements show these are reconstruction artifacts, not a runnable source release. The shipped plain `nopickles.py` was copied and read directly.

## Evidence preservation

`extract/HASHES.txt` lists SHA-256 for every copied compiled payload and reconstructed text. Private mirror has the same ledger, all 66 decoded scripts, seven modules, full shipped serializer, full direct spell subclass blocks and a label/condition/menu index. Full source/line context stays ignored, committed files paraphrase. No sprites, music, DLLs or executables copied. No executable, batch, injector, game module or save was run/opened. No Git add/commit/push or other repo path edited.

## Dead ends / limits

Default Python interpreter incompatibility was local tooling, not payload corruption. Tool's old-engine warning means success count is not full semantic equivalence; representative feature flow cross-checked across script and module text. No downloader/archive extractor needed, no failed network fetch. All route reachability, save compatibility and audiovisual/gameplay claims remain bounded by CHECKPOINT.md. No YAIRPG tests/build needed because this lane changes research docs only.
