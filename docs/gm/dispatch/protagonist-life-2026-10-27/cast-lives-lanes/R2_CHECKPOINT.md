# R2 checkpoint: lead places, 2026-10-29

Status: place compiler and private candidate generated; agent-verified, not human-reviewed. No `src/` or
`private_packs/` edits, commit or runtime adoption. Rules: AD36, AD44, CLR1–CLR4, CLR12, SR1–SR24, LSD108, LSD151.

## Resume 1: travel rows, 2026-10-29

The first candidate gave new places no usable walk records. The resumed generator gives streets, buildings and
enterable rooms a `travel` row; desk and corner locations attach to their parent and are not walk targets. Existing
base rows win. An R1 place seed retains the earlier generated place addresses without importing its people or
overwriting the live base. The live pack's `householdActs` field and all its original place rows compare deeply
equal in the candidate. Applied AD1, AD36, AD44, CLR1–CLR4, CLR12, SR1–SR24 and LSD108.

The live base has 45 places; the candidate has 89, including 31 additional walk targets and 13 additional region
records. Three added walk records retain a source route's minutes, destination and locator; 28 use a two-minute
same-district fill. The host currently calculates durations from district links, so the source route minute field
does not itself change runtime duration. Where containment cannot identify a supported district, the generator
uses the existing home district as a provisional placement, labelled `fill` with a basis. This may place a distant
location in the wrong district; the coordinator must reconcile it with a broader geography and travel bridge.

The updated X2 mapper reports **53 walks** and **446/1,491 place references resolved**, across 418 scenes and
1,491 steps. This is an offline mapping result; it does not establish travel execution or browser behavior.
Candidate: `/tmp/r2-pack/cast.json`, SHA-256 `17a6b102a4a7d8fd019ee2201f5dd09df4c9418d31dbf48ec29097bc8e704d65`.
Live base SHA-256 before and after: `2d29bf4ae70a6a79b0fafaab494fa72e05b0c30f99eb250bf48dd42e49e32a55`.
R1 place seed: `/tmp/r2-pack/r1-candidate.json`, SHA-256 `c9a2545137af515fc766c06e367b69013e5ad6b1cfa5c97f46e729075950432b`.
The seed is the reconstructed R1-style candidate discussed below, not the byte-identical historical R1 candidate.
Private receipt: [resume 1 report](../../../../../docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/r2-places-2026-10-29/resume1-report.json).

| Command | Result | Gap |
|---|---|---|
| `node --test tests/build_cast_pack.test.js` | PASS, 12/12 | Compiler fixtures; no game execution |
| `node scripts/lead_run/build_cast_pack.mjs lotm --from 'zh 第1章 p1' --to 'zh 第24章 p99999' --merged /tmp/r2-input --base private_packs/lotm-cast/cast.json --place-seed /tmp/r2-pack/r1-candidate.json --out /tmp/r2-pack/cast.json --places-only` | PASS; 44 added, zero changed or removed | Reason for the stage flag: preserve live people and timing; `/tmp/r2-input` uses M4 merged files and a slice-scoped crosswalk |
| `node scripts/check_private_cast.mjs` in `/tmp/r2-pack/validation` with the candidate copied into scratch | PASS for LOTM; MoL absent | Pack schema check |
| `node scripts/lead_run/build_replay_mapping.mjs --scenes <M4>/scenes.jsonl --crosswalk <M4>/crosswalk.json --controls <X1>/controls.json --registry <M4>/registry.jsonl --pack /tmp/r2-pack/cast.json --from 1 --to 24 --out /tmp/r2-pack/chapters-1-24-resume1.json` | PASS; 53 walks | Mapping, not gameplay proof |
| `git diff --check -- scripts/lead_run/build_cast_pack.mjs tests/build_cast_pack.test.js docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/R2_CHECKPOINT.md` | PASS | Scoped diff |
| `npm run check:docs` | FAIL on four findings in the source acquisition receipt and H1 checkpoint | No R2 finding on the final scan; those files are outside the lane |

## Initial pass, historical

## Probe (CLR2)

| Input | Expected | Observed | Result |
|---|---:|---:|---|
| Candidate unresolved place references, chapters 1–24 | about 1,150 | 1,151 step references | Pass |
| Live unresolved place references, chapters 1–24 | about 1,150 | 1,182 step references | Pass |
| Distinct candidate unresolved labels | count | 242 | Measured |
| M4 in-slice place worksheet rows for unresolved labels with containment | count | 209 | Pass; above half of distinct labels |
| Existing candidate place shape | list | `id`, `indexId`, `name`, `openingHours`, `label`, `locator`, optional `travel` | Preserved |

Probe and X2 count receipts: [private probe](../../../../../docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/r2-places-2026-10-29/probe.json), [private resolution counts](../../../../../docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/r2-places-2026-10-29/x2-counts.json). The input report files and all output records remain private.

## Candidate and outcome

The places-only stage reads exact lead scene references and M4 place rows, follows explicit `within` links, keeps sub-places attached as anchor-only rows, and preserves authored base rows when fields conflict (AD1, [LSD108](../LEAD_LIFE_SYSTEMS_DESIGN.md)). It emits 10 new rows in this run. T/S evidence labels retain their source locator as `canon`; I is `canon-derived`; travel defaults are labelled `fill` with a basis. A walk travel record uses containment evidence that resolves to a runtime district (`evernight`, `storm`, or `machinery`), the set accepted by the current pack validator and district clock. Places outside those districts retain their source address and can gain a walk target when a broader district/time bridge is selected.

X2 result on the reconstructed R1-style candidate versus the R2 candidate, using the same M4 scenes, whole-book crosswalk, registry, and X1 controls:

| Candidate | Place refs resolved | Walk | Wait | Talk | Person refs resolved |
|---|---:|---:|---:|---:|---:|
| R1-style baseline | 340/1,491 | 6 | 195 | 0 | 1,538/4,164 |
| R2 | 446/1,491 | 6 | 195 | 0 | 1,538/4,164 |

The mapping resolves 106 additional step-place references. Walk count is unchanged: the new evidence-backed places do not establish additional walks within the three supported runtime districts. Talk controls remain absent in X1. Candidate and mapping are at `/tmp/r2-pack/cast.json` and `/tmp/r2-pack/chapters-1-24.json`; the X2 mapper input controls were derived privately from the candidate’s walkable rows.

## Checks

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/build_cast_pack.test.js` | PASS, 10/10 | Focused compiler slice |
| `git diff --check -- scripts/lead_run/build_cast_pack.mjs tests/build_cast_pack.test.js` | PASS | Scoped source diff |
| `node scripts/check_private_cast.mjs` in `/tmp/r2-pack/validation` with candidate copied to scratch | PASS for LOTM; MoL skipped because absent | Schema validation; no runtime adoption |
| `node scripts/lead_run/build_replay_mapping.mjs ... --pack /tmp/r2-pack/cast.json --out /tmp/r2-pack/chapters-1-24.json` | PASS; 418 scenes, 1,491 steps; 446 place resolutions, 6 walks | Offline mapping; no gameplay/browser proof |

## Input drift and remaining review

R1's checkpoint pins its source base at SHA-256 `76bd2b74…`; during this lane the live private pack was observed at
`2d29bf4a…`, while H1 owned that file. I did not edit it. The R1-style baseline used here was regenerated from the
current observed base plus the R1 M2 input, so the numeric comparison reproduces the checkpoint's 340/1,491 and 6
walks but is not byte-identical to R1's recorded candidate. The earlier `/tmp/r1-pack/cast.json` artifact was
overwritten during an initial M4 candidate attempt; the run did not alter repository pack files. Coordinator should
review the candidate against the intended R1/H1 base before swapping it. The pack remains private and the candidate
is not an adopted runtime pack.
