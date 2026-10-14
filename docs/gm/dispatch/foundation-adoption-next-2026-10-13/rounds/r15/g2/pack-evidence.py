"""Losslessly pack full QA saves after the browser steps finish."""
import hashlib
import json
from pathlib import Path
import tarfile

owner = Path(__file__).resolve().parent
evidence = owner / "evidence"
archive = evidence / "CURRENT-SAVES.tar.xz"
if archive.exists():
    raise SystemExit("Current save archive already exists; preserve it before repacking.")
files = []
for file in sorted(evidence.iterdir()):
    if file.suffix == ".json":
        data = json.loads(file.read_text())
        if isinstance(data, dict) and "expansion" in data:
            files.append(file)
    elif file.suffix == ".txt" and file.name != "current-retort-complete-frozen.txt":
        files.append(file)
manifest = [{"file": file.name, "bytes": file.stat().st_size,
             "sha256": hashlib.sha256(file.read_bytes()).hexdigest()} for file in files]
with tarfile.open(archive, "w:xz", preset=6) as output:
    for file in files:
        output.add(file, arcname=file.name)
with tarfile.open(archive) as check:
    for record in manifest:
        actual = check.extractfile(record["file"]).read()
        assert hashlib.sha256(actual).hexdigest() == record["sha256"]
(evidence / "CURRENT-SAVES-MANIFEST.json").write_text(json.dumps(manifest, indent=1) + "\n")
for file in files:
    file.unlink()
# These unasserted predecessor PNGs have preserved originals under /private/tmp;
# the asserted current screenshot and the old raw-state archive carry the proof.
for name in ("fa12-occupied-residue.png", "retort-quota-after-fail.png"):
    (evidence / name).unlink(missing_ok=True)
print(f"Packed and hash-verified {len(files)} files in {archive.stat().st_size} bytes")

fixture = owner / "fixture"
fixture_files = [file for file in sorted(fixture.glob("*.txt"))
                 if file.name not in ("TEST-FIXTURE-R15-G2-retort.txt", "TEST-FIXTURE-R15-G2-program3.txt")]
fixture_manifest = [{"file": file.name, "sha256": hashlib.sha256(file.read_bytes()).hexdigest()}
                    for file in fixture_files]
with tarfile.open(fixture / "FIXTURES.tar.xz", "w:xz", preset=6) as output:
    for file in fixture_files:
        output.add(file, arcname=file.name)
(fixture / "ARCHIVE-MANIFEST.json").write_text(json.dumps(fixture_manifest, indent=1) + "\n")
for file in fixture_files:
    file.unlink()
