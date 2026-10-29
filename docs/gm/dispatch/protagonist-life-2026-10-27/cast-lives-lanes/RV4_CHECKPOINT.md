# RV4 checkpoint: opening chapters 1-3

Status: paragraph review complete for the actual shard; 18/18 verdicts appended,
12 adapter-and-registry-validated rows and 6 gaps. Offline private research,
agent-verified, not human-reviewed. No runtime integration, pack write, commit,
staging or push. Ownership of the files below is released to the coordinator.
Rules: CLR1, CLR2, CLR3, CLR4, CLR6, CLR12; AD36, AD44; sealed secrets.

## F1: data probe and source boundary

The supplied estimate of about 175 steps does not match the opening shard in
the named ladder and its source scenes. There are **5 scenes, 18 steps, 5 mapped
gaps and 13 previously mapped steps**. All 18 have a verdict, including review
of the previously mapped steps. Step count was not a CLR2 stop gate.

Thirteen later-volume scenes also have unqualified opening-chapter locators.
They were excluded using their source shard provenance, rather than treating
an unqualified locator as sufficient evidence of the opening volume. No source
or mapping input was changed. The private probe records the boundary.

All 11 distinct scene citations were retrieved with zero missing paragraphs.
The scene bridge uses the existing citation module with a registry-shaped
locator wrapper because its CLI ID lookup does not select a scene by beat ID.
The full three source chapters were also read through that module: 69, 77 and
73 paragraphs respectively. Each verdict names the particular supporting
paragraph or range; the private scene-citation artifact stores context.

## F2: result and publication

| Verdict | Kind or reason | Count |
|---|---|---:|
| row | act | 10 |
| row | journey | 1 |
| row | topic | 1 |
| gap | no mechanism | 4 |
| gap | not an action | 1 |
| gap | actor not the lead | 1 |

The journey fare is null, durations are explicitly labelled scheduling fills,
and the topic has one canon choice. Place/person IDs come from the live pack.
Rows use knowledge and paragraph-supported facts; an existing supported cost
is retained without creating stock. Unsupported allocation, retention and
numeric concealment assumptions were excluded. No empty requires arrays or
undefined values are emitted. All twelve generated commands install together.

Owned files in the private `reviewed-rows-2026-10-29/` folder:
`RV4.jsonl`, `RV4_review.mjs`, `RV4_validate.mjs`, `RV4_probe.json`,
`RV4_citations.json`, `RV4_validation.json`. This checkpoint is the sole public
output. The validation receipt records SHA-256 identities for content, pack,
scene/mapping inputs and the four adapter/registry source files. The review
script refuses to overwrite an existing verdict file; each verdict was appended
in inherited scene/step order. The validator can be rerun independently.

## F3: top gap descriptions for the next lane

There are only six gap instances and three allowed gap-reason categories, so
there is no padded top-ten list. Ranked by mechanism family:

| Rank | Generic description | Instances | Next mechanism or correction |
|---:|---|---:|---|
| 1 | Mental recall and remembered activity | 2 | Recollection attribution, fragmented memory and distinction between present and remembered acts |
| 2 | Involuntary bodily transition | 1 | Body/life transition rather than an inspection receipt |
| 3 | Time passing during another activity | 1 | Supported time window with concurrent activity; do not invent a numeric target |
| 4 | Shared consumption with unspecified allocation | 1 | Resource allocation that does not manufacture source quantities |
| 5 | Another actor performs the work | 1 | Cast action or schedule; do not attribute the act to the lead |

## F4: checks and remaining gate

Commands below use private directory
`docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/reviewed-rows-2026-10-29/`
as `<private>/`.

| Command | Result | Gaps |
|---|---|---|
| `node <private>/RV4_review.mjs` | PASS, 5 scenes, 18 verdicts, 12 rows, 6 gaps; 11 scene citations retrieved, 0 missing | First launch failed on an import path before any verdict was written; path corrected. Offline source review only; no replay claim |
| Node `cite()` chapter-reading route through `scripts/lead_run/cite_paragraphs.mjs` | PASS, 69/77/73 source paragraphs read | Local source reading, not adapter or gameplay proof |
| `node <private>/RV4_validate.mjs` | PASS, 12/12 rows through real adapters and simulation registry individually and together; 18/18 expected identities/order, pack IDs, citations, effect restrictions and JSON round trips | Initial knowledge attribution rejected; corrected to the supported instruction basis and rerun. No command execution or natural route proof |
| `node --check <private>/RV4_review.mjs` and `node --check <private>/RV4_validate.mjs` | PASS | Syntax only |
| Scoped whitespace, publication and output-file checks | PASS | Local static checks only; private artifacts remain private |
| Build, full tests, architecture/rule gates and browser/save proof | Not run | Offline private review lane; no runtime, persistence or rules changed |

The coordinator owns ingestion and replay measurement. Private verdicts flag a
source chronology discrepancy in the inherited step ordering. Ingestion must
also preserve actual places and intermediate returns rather than assuming
scene-level location is sufficient. Prior mapped controls are not endorsed
merely because they existed: reviewed rows and gaps are the source dispositions.
The five previously mapped gaps yield three candidate rows and two retained
gaps. These counts measure reviewed content, not additional playable coverage.
