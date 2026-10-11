# Soulash 2 finite demo audit checkpoint

Status: **completed bounded data audit**, 2026-10-07. Sole writer for this dossier and the private `~/.codex/research/soulash-2/` intake.

The anonymous public Windows demo ZIP is already downloaded privately. Its recorded SHA-256 is `aecc5886a9a6f710388867a9ee28e404f6df764bc60bd35be9ee8c1c65e8dc72` (390,401,657 bytes). ZIP inventory: 14,310 entries and 432,273,504 uncompressed bytes; 10,745 JSON files. `version.txt` inside the archive says `0.9.19.7` (SHA-256 `1aeaa2ea23cf61be2d968c0cdab31db4238f657b53d2196a7f503b0caa9bfc9e`). The ZIP response Last-Modified date is 2026-03-04. This is an older demo snapshot, not a current retail source tree.

Four linked JSON traces are recorded in [FINDINGS.json](FINDINGS.json) and interpreted in [REPORT.md](REPORT.md). [COVERAGE.json](COVERAGE.json) states unread coverage; [INTAKE.json](INTAKE.json) records provenance and PE header metadata. The executable was hashed and its header inspected, not run or decompiled.

Release to parent: finite source gate passed. No further acquisition, game/tool execution, native recovery or gameplay implementation is needed for this packet. Current retail v0.10.x features remain creator-documented only. [Proposals](IMPLEMENTATION_PACKETS.md) are unaccepted and unimplemented.
