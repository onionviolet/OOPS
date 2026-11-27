# Reading-tool portability receipt

Status: agent-verified offline tooling, not human-reviewed. No paid requests or source acquisition.

## Preflight

| Field | Scope |
|---|---|
| Reading and authority | The parent integration lane requested one repeated failure family from the existing full-suite log, favoring reading-batch portability. Preserve research qualification, source immutability, stage receipts and explicit paid-run authorization. AD36, AR3, AU7. |
| Fit | Existing `scripts/lead_run/batch_lib.mjs` glossary and local migration calls; `schema_union.mjs` input staging; the existing seven-stage world lead pipeline. No game, provider request schema, client routing or grading change. |
| Files | Two tooling owners and their three existing test files; this receipt. Harry owns native-test fixture/URL fixes; player_ui owns UI/perspective fixes. No overlapping writer. |
| Failure scenario | Windows has no external `ls`, and its file symlinks require privileges. A running Node process can also have no `node` executable on PATH. Verify native glossary reads, byte-preserving input staging, source immutability, all seven pipeline stages and refusal at the intended adverse stage. |
| UI, persistence and build | n/a, because this is offline reading tooling. Existing output schemas and the pipeline's hash receipt remain the consumers. Focused CLI/native tests are the acceptance gate; the parent owns integrated/full-suite verification. |

## Reproduced failures and changes

**F1: glossary discovery depended on `ls`.** `node --test --test-name-pattern='plan requests rebuild' tests/lead_run_batch.test.js` reproduced `spawnSync ls ENOENT`. The owner now uses sorted `readdirSync`, retaining the existing filename match, sample exclusion and grade A/B filter. The regression uses a census directory with spaces. The local collection migrator now runs through `process.execPath`; an added empty-PATH regression confirms that collection still migrates its synthetic rows. A direct baseline probe of `spawnSync('node', ..., PATH='')` returned ENOENT on this host.

**F2: schema input staging required Windows symlink privileges.** `node --test tests/world_lead_pipeline.test.js` reproduced EPERM in `schema_union` before either expected pipeline result. POSIX retains its space-efficient unchanged-input symlinks. Windows now makes independent file copies with an optional CoW hint and ordinary copy fallback. This avoids both privilege dependence and source mutation through shared hard-link content. Transformed union targets remain separate files on both routes.

**F3: tests pinned a POSIX file shape.** Schema/pipeline tests now check the appropriate host staging shape plus exact staged bytes and unchanged source bytes. A Windows regression writes the staged output and proves the original input remains unchanged. The pipeline still checks all seven stages, every stage's input/output hashes, stale-owned-output replacement and the actual `merge_shards` failure for a deliberately missing overlay. Provenance, union precedence, duplicate-locator retention and backup-only rows keep their existing assertions.

The earlier full-suite log names five failed cases in this family: one batch-glossary case, two schema-union cases and two world-pipeline cases. This lane does not claim to resolve the other full-suite failures.

## Verification

| Command | Result |
|---|---|
| `node --test tests/schema_union.test.js tests/world_lead_pipeline.test.js tests/lead_run_batch.test.js` | Final run: 26/26 passed in 1.61 seconds, including all five named former failures and actual local migration with PATH empty. Log retained at `$env:TEMP/oops-reading-portability-20261125.log`. |
| `node --check` for both modified tooling owners; `git diff --check` for all five changed source/test files | Passed. |
| `npm run check:docs` | No hit in this receipt. Five findings in other active atlas documents remain for the parent integration gate; this lane makes no passing full-docs or full-suite claim. |

The source inputs are invented fixtures. Tests import the pinned SDK surface and use mock clients; they do not call a live provider or acquire book content. The batch tests now remove the exact temporary directories they create after validating their location. Pipeline/schema tests retain their existing owned scratch cleanup. The initial failing glossary fixture was inspected and removed separately. Older unrelated batch directories from the preceding full suite were left untouched.

No commit, push, installed-app update or deployment occurred. Native POSIX execution was not available in this lane; its symlink branch is preserved, while these results qualify the Windows route. Windows staging may consume more disk space than the POSIX symlink route when the filesystem cannot clone file data.
