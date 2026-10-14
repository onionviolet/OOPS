Read docs/gm/dispatch/engine-runtime-2026-10-14/COMMON.md and follow it.

Lane ER7: throwaway engine spikes. Output
docs/research/ENGINE_SPIKES_2026-10-14.md and
docs/gm/dispatch/engine-runtime-2026-10-14/ER7/REPORT.md.

Work ONLY in a scratch directory outside the repo (mkdir under /tmp,
e.g. /tmp/yairpg-er7) with its own package.json; npm install there is
allowed. Copy (do not import from the shared checkout's live writes) any
pure repo modules you need. Never touch repo src/tests/dist/package files.
Spikes, each with MEASURED numbers and the exact commands:
S1. Actor loop: current-style array of plain objects vs bitECS or miniplex
    for 1k/10k/100k actors doing a needs-decay + utility pick tick.
S2. Worker step: Node worker_threads round trip cost of posting a
    realistic synthetic state slice and a step result, structuredClone vs
    transferable buffers. Note browser differences as INFERRED.
S3. Saves: JSON stringify + localStorage-sized string vs CompressionStream
    gzip vs sqlite-wasm (in-memory in Node) for a synthetic developed save
    shape modeled on src/save_files.js and expansion_persistence.js.
S4. Optional: expansion advanceSimulation pure-path timing if ER1 has not.
Report which results would change a palette recommendation.
Copy your spike scripts (not node_modules) into the lane folder.
