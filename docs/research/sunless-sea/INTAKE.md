# Intake and extraction receipt

Technical observations are **seen in data or code**. Operational boundaries record this audit's actions, not gameplay conclusions.

- App 304650; manifest StateFlags 4; build 24946998; macOS Mono Unity 6000.3.2f1, version read by UnityPy from resources.assets.
- Install read only: `~/Library/Application Support/Steam/steamapps/common/SunlessSea/Sunless Sea.app/Contents/Resources/Data/`.
- Private retention: `~/.codex/research/sunless-sea/RETENTION.json`. Each copied assembly and extracted TextAsset has SHA-256 and size. The original resources.assets was hashed in place; the large container was not copied.
- Managed game logic is in `Sunless.Game.dll` and `Failbetter.Core.dll`. Assembly-CSharp is not the gameplay owner in this build. Retained those assemblies plus the two initial Assembly-CSharp inputs. ILSpy 9.1.0.7988 recovered C# method bodies, not just type stubs; decompilation is an approximation of compiled code.
- UnityPy 1.25.4 exported 26 TextAssets from resources.assets. The relevant tables contain 874 root event records, 4,434 branches directly on those roots, 957 qualities and 29 qualities flagged persistent. These are structural counts, not reviewed-content counts. Embedded DLL fallback tables differ: 616 events and 692 qualities. `FileHelper.LoadResourceTextfile` uses Unity Resources, so the expanded resource tables are the main installed-data evidence; user-side imported overrides were deliberately not inspected.

Tools reused read only from existing private tool installations: the tale extraction Python environment and caves-of-qud ILSpy/.NET. No tool installation, network access by the game, or execution of recovered game code occurred. ILSpy exported an unnecessary 72,720,259-byte icon archive; it was deleted from our own private output after identifying it. Current retained output is about 93 MB, including the gameplay DLL with embedded resources. No single extraction exceeded 200 MB; initial free space was 6.6 GiB. No personal saves or settings were read.

The receipt includes `STRUCTURAL_TRACES.json`, `types.txt`, C# exports in `code/` and `core/`, text tables in `text/`, and decompiler diagnostics. No raw game corpus is put in this repository. Copyright and attribution remain with Failbetter Games and the original contributors.
