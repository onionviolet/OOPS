# ER7 report, 2026-10-14

## CHECKPOINT

Research lane complete. Final S1/S2/S3 runs and assertions pass. All execution/install work took place in `/tmp/yairpg-er7`; lane files are copies for review. S4 links ER1's existing measurements. No runtime implementation, stack acceptance or browser persistence gate is closed.

## Files delivered

ER7-O1: [research report](../../../../research/ENGINE_SPIKES_2026-10-14.md), with measured tables, scope, exact commands, ranked palette changes and open gates.

ER7-O2: six JS scripts: `common.mjs`, `actors.mjs`, `worker.mjs`, `workers.mjs`, `fixtures.mjs`, `saves.mjs`; plus read-only `provenance.py` and the scratch report generator `write_report.py`. No runtime imports from the repo and no node_modules copied. Scratch manifests are archived as `scratch-package.json` and `scratch-package-lock.json`, so the repo package files stay untouched. [README](README.md) gives scratch-only reproduction.

ER7-O3: `actors-results.json`, `workers-results.json`, `saves-results.json`, their three `*-run.log` files, and `read-provenance.json`. Raw JSON includes samples, times, load, dimensions and correctness notes. Scripts and archives are hashed in `artifact-sha256.json`.

## Commands run

All benchmark commands below used tool working directory `/tmp/yairpg-er7`:

```sh
npm install --save-exact miniplex @sqlite.org/sqlite-wasm
node actors.mjs > actors-run.log
node workers.mjs > workers-run.log
node saves.mjs > saves-run.log
node --check common.mjs
node --check actors.mjs
node --check worker.mjs
node --check workers.mjs
node --check fixtures.mjs
node --check saves.mjs
python3 provenance.py
python3 write_report.py
python3 deliver.py
python3 verify_delivery.py
```

Preparation: `mkdir -p /tmp/yairpg-er7` and a scratch-only Python write created its private ESM package.json. Environment commands: `node -v`, `npm -v`, `sw_vers`, `uname -m`, `sysctl -n machdep.cpu.brand_string`, `uptime`. Read-only `git status --short`, branch/HEAD lookup and document/source reads recovered current authority and dirty state. No repo npm/test/build command was run.

ER7-V1, MEASURED: final actor run 2026-10-14T05:04:43.448Z to 2026-10-14T05:04:47.615Z; 1k/10k/100k, dense and 10%-active, five loop variants, five warmups plus 31 samples, equal final fields across all variants. First actor result was superseded by the final run after adding indexed/cached plain controls.

ER7-V2, MEASURED: final worker run 2026-10-14T05:05:55.888Z to 2026-10-14T05:06:03.518Z; 1k/10k object and byte modes, echo and full step, equal synchronous results, transfer detachment checked, five worker startup observations. Final rerun makes unpack baseline parse prepared result text rather than timing another stringify; raw evidence matches final script.

ER7-V3, MEASURED: save run 2026-10-14T05:04:58.381Z to 2026-10-14T05:05:47.105Z; 1k/5k developed synthetic saves, ten timed cases each, exact JSON/Unicode gzip/SQLite roundtrip, ten-actor patch and SQL rollback checks. SQLite init 26.701 ms. All final syntax checks exit 0. An initial save-script syntax preflight found one missing closing brace; fixed in scratch before its benchmark, with no affected measurement retained.

## Findings and recommendation effect

| Code | Result | Palette effect |
| --- | --- | --- |
| ER7-F1 | Container/iteration choice changes the synthetic tick; sparse active membership helps with or without ECS. | Qualify LB1; keep maintained plain arrays as a control. No EG4/TS7 trigger. |
| ER7-F2 | At 10k, full transferred JSON step is 21.0719 / 27.8941 ms versus prepacked transferred echo 0.1200 / 1.2061 ms. | TS4 needs retained-state/bounded-message proof; transfer alone does not erase codec cost. |
| ER7-F3 | Developed JSON 1,085,087 bytes → gzip 75,860; full snapshot SQLite slower than stringify sink; small patch cheaper because it changes fewer records. | DA3 optional codec prototype gains evidence; LB2 remains conditional on queries/incremental persistence. |

## Open questions and handoff

ER7-Q1 through Q4 in the research report own the unmeasured idle-host/browser, actor-churn, retained-worker and durable compatibility/recovery gates. The host was busy, and no Node tail is a browser long-task measurement. Findings are proposals; Claude's root palette remains read-only and unchanged by this lane. Existing runtime writers and dirty files were preserved. No personal save/private pack or SECRETS file was opened. No install into the repo, runtime build/test, commit or push occurred.
