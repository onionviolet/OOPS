# R1 outcome 3: correction sweep and bounded comparison, 2026-10-26

Q11 / IPC49 / IPC80. Rules applied: AD32, AD35, AD36, AD41;
WPR21 and WPR27. Highest state: source and focused tests verified,
agent-verified, not human-reviewed. No runtime, installed-app, commit or
publication claim. This report adds no product rule or gameplay gate.

## What was wrong and what changed

The prior script treated user-role transport records as human authorship,
coalesced unrelated messages by their first 120 characters, scanned private
session directories on import, and printed private excerpts. The earlier
395 result is the old detector's output, **not 395 independently verified human
corrections**. It is not a valid before denominator for this comparison.

[`correction_sweep.py`](../../../audits/tools/correction_sweep.py) now requires
explicit input paths and UTC-aware start/boundary/end timestamps. Its default
and file outputs contain aggregate counts and a corpus SHA-256 fingerprint,
with no raw text, session names, log paths or individual-message hashes.
The saved sample aggregate additionally records the tool SHA-256.
Importing the module does not discover or open logs.

The filter rejects known Codex subagent/exec sessions, Claude sidechain/meta/
compact-summary/tool-origin records, injected AGENTS text, task/delegation
notices, recognizable pasted assistant transcripts and ambiguous relay mixtures.
Quoted and fenced blocks are removed while an ordinary unquoted human question
is retained. No 700-character cutoff silently drops long human messages.
Duplicate record IDs and matching event/response mirrors within five seconds
count once. Different same-transport human instructions with distinct IDs stay
separate. IPC36–IPC46 keyword groups overlap and remain screening candidates.

User-role metadata plus these exclusions establishes **human-origin candidates**,
not authenticated human authorship or confirmed correction intent. Unlabelled
pastes can survive and mixed relay messages can lose real human comments.
A repeated instruction can be intentional. Review context privately before
calling any candidate a correction; do not publish that context.

## Finite sample and result

[Aggregate result](correction-comparison-aggregate.json) records the exact
half-open boundaries and fingerprints. The reference point is the existing
primary-adoption browser proof file's modification time,
**2026-10-26 14:21:52.598030 UTC**. It is a proxy for proof completion, not an
authoritative rule-adoption timestamp. Ten minutes on each side gives equal
observation time without scheduling work or waiting for future deliveries:

| Measure | Before: 14:11:52.598030–14:21:52.598030 UTC | After: 14:21:52.598030–14:31:52.598030 UTC |
| --- | ---: | ---: |
| Human-origin candidate messages | 2 | 0 |
| Correction-keyword candidates | 0 | 0 |
| IPC36–IPC46 keyword matches, each class | 0 | 0 |
| Confirmed repeated corrections per matched delivery | unknown | unknown |
| Time from authorized start to first rebuilt playable result | unknown | unknown |
| Verification wall time, retries and paid/model cost per matched delivery | unknown | unknown |

Input inventory: Codex files created in the October 25 and 26 UTC directories,
plus the 60 most recently modified top-level primary-project Claude JSONL files;
360 files in this finite run. Codex sessions are project-filtered from session
metadata. Older-started Codex sessions and Claude files outside that cap are
not covered. The corpus fingerprint covers complete input bytes, including
records outside the observation window. Input logs remain local and mutable;
the fingerprint identifies the sampled bytes but does not archive them.
Machine-session exclusion counts cover whole input files, as explicitly marked
in JSON; they are not comparable window denominators.

**Effect on recurrence remains unknown.** Equal time windows do not create
comparable deliveries. No matched completed post-adoption delivery was
established, and zero observed post candidates is not evidence of improvement.
Neither the 3,226-test count in the adoption receipt nor a file modification
time supplies verification duration, monetary cost or time to playable result.
The adoption receipt proves tooling/browser launch at its named scope, not a
new gameplay delivery. The existing proof was reused without another game build.

## Reusable comparison method

1. **M1: define the pair before counting.** Select the nearest completed
   pre/post deliveries of the same outcome type, similar change surface and
   evidence floor. Record the exact adoption event and timestamps where
   available. If either delivery or timestamp is missing, leave that metric
   unknown. Do not substitute the prior 395 detector output.
2. **M2: freeze finite boundaries and inputs locally.** Record each input's
   byte fingerprint and selection boundary. Use explicit paths, not an
   unbounded home-directory sweep. Run the CLI below once per finite sample;
   publish aggregates only. A changed corpus fingerprint identifies input drift.
3. **M3: confirm intent privately.** Review each retained candidate with its
   adjacent request/result, determine human/relay/unknown origin and whether it
   corrects that delivery, then assign IPC36–IPC46 or unclassified. Keep unknown
   separate; report distinct corrected deliveries and corrections per completed
   delivery, alongside denominator and coverage. Do not count keyword hits as
   confirmed recurrence or force every message into one class.
4. **M4: join delivery evidence.** Use an authorized-start event and the first
   rebuilt playable proof for latency. Use recorded command durations, retry
   counts and actual billing/model usage for verification cost. Scope separate
   natural, fixture, launch-only and installed-app evidence. Missing start,
   completion, runtime or billing evidence stays unknown.
5. **M5: interpret and stop.** Compare within the matched scope, name sample
   size and confounds, and report improved/unchanged/worse only where supported.
   This report creates no automation, future wait or mandatory tooling milestone.

```sh
python3 docs/audits/tools/correction_sweep.py \
  --start 2026-10-26T14:11:52.598030Z \
  --boundary 2026-10-26T14:21:52.598030Z \
  --end 2026-10-26T14:31:52.598030Z \
  --codex /absolute/local/session.jsonl \
  --output /absolute/local/aggregate.json
```

Replace the example with an explicit bounded input inventory; `--claude` accepts
Claude paths. The CLI never emits private excerpts, including with `--output`.
The report's finite observation shows insufficient post evidence and provides
the method; it does not promise future sampling.

## Checks and limits

- **V1:** `python3 -m unittest discover -s docs/audits/tools -p test_correction_sweep.py -v`
  PASS, four tests. Relay/injected-instruction exclusion, ordinary and long
  human retention, quoted-block handling, mirrored/ID duplicate events,
  repeated-human retention, machine sessions/sidechains and no import scans.
- **V2:** finite local sweep with the boundaries/inventory above, PASS;
  aggregate JSON parsed and checked for absence of raw message fields.
- **V3:** owned-path whitespace and relative-link checks, PASS.

No full gameplay suite was needed for this Python audit tool. No raw personal
logs or excerpts were copied into repository artifacts. Candidate heuristics
have regression coverage, not a validated precision/recall estimate.
