# GM manifest semantic crosswalk

This packet fully reads the physical ranges of M02–M18 and matches all 18 files to the inventory byte/hash/count pins (592 lines total). M01 is a 2,243,751-byte single-line JSON: review is limited to its two array schemas and aggregate distributions at the exact semantic JSON paths recorded below. Its 2,250 case inputs are in `indexed_expected_cases` with array-qualified IDs and JSON pointers, index-only and with no per-case semantic credit. Eight IDs occur identically in both arrays, so those are duplicate inputs rather than independent runs. Expected outcomes are not run results. Manifest hashes/digests do not reverify referenced assets or proof.

## Manifest dispositions

| ID | Read claim and boundary | Source |
|---|---|---|
| M01 | T9 case-manifests: 2250 synthetic expected-input vectors, unbound-demo; no run results. | [case-manifests.json](../../gm/dispatch/research-tech-2026-10-14/t9-build/case-manifests.json) |
| M02 | Six Ages DLC intake: unverified before source; no entitlement inferred. | [DLC_COVERAGE.json](../../gm/dispatch/life-sim-sources-2026-10-07/history/six-ages-identity-correction/six-ages-1-intake/DLC_COVERAGE.json) |
| M03 | Status-window run: 44 reported passes, 1 surface failure, lint/tooling errors; server cleanup asserted. | [manifest.json](../../gm/dispatch/cheat-status-window-2026-10-13/runs/lq/manifest.json) |
| M04 | Cheats SFX isolated candidate: hashes and patch pointer; shared integration false. | [CANDIDATE_MANIFEST.json](../../gm/dispatch/cheats-sfx-implementation-2026-10-12/CANDIDATE_MANIFEST.json) |
| M05 | B8 capture: prebuilt/no rebuild; two dated source-map match assertions, not runtime proof. | [capture-manifest.json](../../gm/dispatch/body-lineage-2026-10-14/b8/evidence/capture-manifest.json) |
| M06 | Six Ages source coverage: all assigned files/chains unread; source arrival blocker preserved. | [COVERAGE.json](../../gm/dispatch/life-sim-sources-2026-10-07/history/six-ages-identity-correction/six-ages-1-intake/COVERAGE.json) |
| M07 | Theme candidate: source edit/rebuild reported; shared integration and human acceptance false. | [CANDIDATE_MANIFEST.json](../../gm/dispatch/ui-experience-completion-2026-10-12/theme/CANDIDATE_MANIFEST.json) |
| M08 | R15 G2: seven fixture archive hash pointers only. | [ARCHIVE-MANIFEST.json](../../gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g2/fixture/ARCHIVE-MANIFEST.json) |
| M09 | Combat fit: three source-ready rows; native bindings and behavior checks open. | [COVERAGE.json](../../gm/audit-implementation/remainder/combat_fit/COVERAGE.json) |
| M10 | Relay: five implemented-unverified families, each with its distinct gate. | [COVERAGE.json](../../gm/feature-wave/features/book-world-subtleties/relay/COVERAGE.json) |
| M11 | Absorption: dated registry/build snapshot; no all-source semantics or accepted gameplay/save claim. | [COVERAGE.json](../../gm/audit-absorption-2026-10-07/COVERAGE.json) |
| M12 | Second SFX foundation candidate: separate base/patch and no shared/human acceptance. | [FOUNDATION_MANIFEST.json](../../gm/dispatch/cheats-sfx-implementation-2026-10-12/FOUNDATION_MANIFEST.json) |
| M13 | Consequences: three source rows, all newBehaviorVerified=false; deferred gates retained. | [COVERAGE.json](../../gm/audit-implementation/remainder/consequences/COVERAGE.json) |
| M14 | Combat objectives: four distinct source-authored but implemented-unverified rows and required bindings. | [COVERAGE.json](../../gm/audit-implementation/remainder/combat_objectives/COVERAGE.json) |
| M15 | Daemon-review before-image archive: ten paths, superseded routing only. | [MANIFEST.json](../../gm/dispatch/steam-wave-2026-10-06/native-usage/resume-history/2026-10-07-daemon-review/MANIFEST.json) |
| M16 | Laptop/UI combined candidate: isolated reported exercise; shared G5 and human/audio gates remain open. | [CANDIDATE_MANIFEST.json](../../gm/dispatch/ui-experience-completion-2026-10-12/CANDIDATE_MANIFEST.json) |
| M17 | 1920 redesign: frozen candidate/baseline pins; currentShared null is dated metadata, integration order remains proposed. | [MANIFEST.json](../../gm/dispatch/ui-modularity-2026-10-11/redesign-1920/MANIFEST.json) |
| M18 | Pre-Heat archive: eleven distinct before-image paths, separate from M15. | [MANIFEST.json](../../gm/dispatch/steam-wave-2026-10-06/native-usage/resume-history/2026-10-07-heat-acquisition/MANIFEST.json) |

## Reading boundary

The detailed [private crosswalk](private/SEMANTIC_GM_SMALL_MANIFESTS.json) retains 83 semantic artifact/case rows plus the index-only expected-case catalog, exact source paths, physical line ranges and JSON pointers. Manifest claims are kept separate from source bytes, build identity, served/runtime behavior, persistence, and human acceptance. Recorded lint/tooling failures, unread-source blockers, false shared-integration states, and named failure/human-only proof pointers remain explicit. Before-images stay historical and distinct. No underlying candidate/proof/source payloads were opened, and no tests, builds, browser, game, saves, source changes or human acceptance were performed.
