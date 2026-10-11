# Noita source audit checkpoint

Revision 1, 2026-10-09. Owner: root audit agent. Assignment:
[Noita source pass](../../gm/dispatch/noita-2026-10-09/ASSIGNMENT.md).

## Scope and ownership

Read installed data, verify N1 to N11, produce all requested research outputs.
Write only this folder and `~/.codex/research/noita/`. Preserve `run.log`.
No source edits, builds, launch, Steam UI, saves, uninstall or commits.
Design owners are read-only; changes remain proposals. Other live novel and
implementation lanes have separate ownership. Working tree was already dirty.

## Progress

Install complete at 20:59:37 local, Steam build 17130612, depot 881101,
manifest 1707227655636660075. Manifest SizeOnDisk 1,639,174,567 bytes;
LastPlayed 0. Content log says Fully Installed and No Error. No waiting needed.
Read PROJECT, GM refresh protocol, inherited audit methods, E4, E4B and shared
vocabulary. Extraction tool being prepared in private tools folder.
Archive header inspected: 14,745 members; table ends at byte 797,859.
Free disk about 23 GiB. No raw data copied to the repo.

## Resume

Verify private extraction receipt, then inspect materials/reactions first.
Source-script findings must be kept distinct from opaque engine behavior and
community knowledge. Save hashes, coverage, gaps and disk use before delivery.

## Revision 2: extraction and first findings

Archive copied and SHA-256 matched:
`c95a0c01a55ec29267afef6bbec8a0cae0ba2b350638e2203674ed4dfb9227c3`.
All 14,745 archive entries validated for paths, bounds and unique names;
5,566 readable text/XML/Lua/CSV/JSON members extracted with matching hashes.
454 loose text/XML/Lua/CSV files copied with matching hashes, including mods
and official component docs. Receipt: `~/.codex/research/noita/EXTRACTION.json`.
Private full 330-record reaction structure and complete field/tag inventory
extracted. 468 materials: 224 roots, 244 children; 325 Reaction and 5
ReqReaction, 32 three-input rules. Thirty proposed rule examples saved.

Workers: `/root/composition` owns COMPOSITION_DIGEST and PERKS_FINDINGS;
`/root/body_world` owns BODY_WORLD_DIGEST and BODY_WORLD_FINDINGS. Both active.
Key corrections awaiting integration: OILED coating protects from fire while
loose oil burns; fungal shift comes from TRIP status, not a perk; containers
track mixtures. Noita engine implementation remains opaque. Community NARG
source cloned privately at fa614b2eb44c1469053a0306b48f09af0a171d90;
its recipe algorithm is community reconstruction, not installed game Lua.

Next: finish alchemy/substitution note, integrate workers, write main report
and machine-readable coverage/findings/intake/packets, then verify outputs.

## Revision 3: completed source pass, 2026-10-09 at 21:08 local

Requested audit complete. Main entry: [REPORT.md](REPORT.md). All eleven N
codes reviewed; 10 ranked proposals, 26 small touches, 30 structured
reaction examples, full material field/tag inventories, composition digest,
body/world and perk digests, substitution/seeded-alchemy note, brief gates,
INTAKE, FINDINGS, COVERAGE and IMPLEMENTATION_PACKETS saved. Shared E4/E4B
and vocabulary owners were not edited. Packets are proposals only.

Both bounded workers are complete; no active write reservations remain.
Root integrated their findings and independently checked key source claims.
Reproduced 422 action/106 perk catalogue counts using the saved comment-aware
lexer. Final [VALIDATION.json](VALIDATION.json) passed: archive original/copy
hash, 5,566 extracted member hashes, 454 loose original/copy hashes,
46 reviewed-source hash records, 120 source citation ranges, relative links,
JSON parse, 468 materials, 325+5 reactions, ingestion counts, 35 herds and
133 asymmetric pairs. All 11 N codes, 30 examples and 10 packets present.
Final review corrected proposed rule `when.extra` to native fact/op/value
syntax and namespaced digest proposal codes to avoid overlap with main P codes.

### Retention and limits

Noita remains installed, Steam size 1,639,174,567 bytes (about 1.53 GiB;
measured allocated install about 1.53 GiB). Private audit files use about
95 MiB allocated, including the 40.5 MiB archive and text-only extraction.
Exact private logical size and tool hashes: `~/.codex/research/noita/RETENTION.json`.
No game launch, Steam UI, save access, source edit, build/test, uninstall,
commit or publish occurred. Existing run.log and unrelated dirty work retained.

Native material inheritance/expansion, reaction order and dose/ignition
integration, projectile dispatch, future-terrain conversion, polymorph restore
and AI target selection remain opaque. Seeded recipe algorithm is explicitly
community reconstruction, not binary-verified. Brief secrets coverage does not
mean every secret/ending solved. These are evidence limits, not unfinished
in-scope gameplay implementation.

### Resume or handoff

No authorized audit step remains. The next owner may review REPORT and select
proposal packets. Do not resume extraction, install or implementation from this
checkpoint alone. Any later selected gameplay slice requires its own build,
fresh-origin browser and persistence acceptance. Q14 on partly understood
substitutions remains the design owner's open question.
