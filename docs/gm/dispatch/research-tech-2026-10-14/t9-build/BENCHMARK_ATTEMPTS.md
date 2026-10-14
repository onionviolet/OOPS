# Benchmark attempt history

B1: initial parent deadline 60 seconds, overlapped a T16 full-suite run. Timed out; result retained in `benchmark-initial-timeout.json`. Not an authoritative performance result.

B2: explicit five-minute campaign, two-second parent watchdog, dedicated child, 10 warmups/100 samples per profile. Computation finished, but multiplexing a large JSON result with V8 GC trace on stdout broke capture. The parent raised JSON parse failure rather than saving a result. Not an accepted timing artifact. Later review edits also made those bytes historical. No stock, save, game or partial graph publication occurred.

B3: final serial run uses a separate lane-local JSON file for child results, stdout only for progress and GC telemetry. Parent watchdog is independent of child synchronous code. All structural/operation limits remain T9's initial values. External-graph phases receive only their actual graph/world/knowledge inputs. Favorable and hostile sorted-ID chains are distinct fixtures, with actual node counts reported. Smoke and sweep retain their original 60-second/five-minute campaign budgets and a two-second progress watchdog.
