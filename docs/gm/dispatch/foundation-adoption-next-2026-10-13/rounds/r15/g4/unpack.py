#!/usr/bin/env python3
"""Materialize compact QA artifacts in a scratch directory and verify hashes."""
import hashlib, json, pathlib, sys, tarfile
owner = pathlib.Path(__file__).resolve().parent
target = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '/private/tmp/r15-g4-artifacts').resolve()
target.mkdir(parents=True, exist_ok=True)
manifest = json.loads((owner / 'MANIFEST.json').read_text())
assert hashlib.sha256((owner / 'ARTIFACTS.tar.xz').read_bytes()).hexdigest() == manifest['archive']['sha256']
with tarfile.open(owner / 'ARTIFACTS.tar.xz', 'r:xz') as archive:
    for member in archive.getmembers():
        output = (target / member.name).resolve()
        if not output.is_relative_to(target) or not member.isfile():
            raise ValueError('Unexpected archive member: ' + member.name)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_bytes(archive.extractfile(member).read())
for record in manifest['artifacts']:
    f = target / record['path']
    assert hashlib.sha256(f.read_bytes()).hexdigest() == record['sha256'], f
print('Verified', len(manifest['artifacts']), 'artifacts in', target)
