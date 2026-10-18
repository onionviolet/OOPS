# MXFP8 removal, October 14, 2026

Weibao authorized removing MXFP8 and retaining Huihui: “Do that accordingly.” This supersedes the research-only boundary for this exact cleanup; it does not select Huihui as the default or authorize inference.

MXFP8 was incomplete and unregistered, so `ollama rm qwen3.8:27b-mxfp8` returned model-not-found without removing it. Socket inspection identified Python worker PID 75330, `~/.local/share/local-ai/upgrades/2026-10-14/finish_upgrade.py`, as the holder of both active pull connections. Missing original CLI PIDs had not meant the transfers were orphaned. The worker also contained later profile/inference steps; this task did not run those steps.

Sent SIGTERM to that exact worker. After verifying it exited and the server no longer held target files open, removed only MXFP8 digest files absent from every registered manifest/metadata reference and from Gemma's pending manifest. Protected both manifests directories and metadata, including their hashes. No broad unused-blob prune was used.

Removed 269 exclusive files: 17,315,863,306 logical bytes and 17,710,530,560 allocated bytes, approximately 17.7 GB allocated. Shared MXFP8 digests remain intentionally because another retained model/package references them. The old server was not restarted and its settings were unchanged.

Because the worker held Gemma as well, continued that already-running download through a separate download-only script. It does not create profiles, promote defaults or run inference. Its progress is in [gemma-download-continuation.json](gemma-download-continuation.json); completion is not claimed by this cleanup.

Final verification: current NVFP4 Qwen and Huihui Q8 remain registered with unchanged manifests; every registered manifest layer/config still exists at its expected size. No MXFP8-exclusive files remain. `/api/ps` is empty. Layer sizes are not an independent full hash or inference test. No gameplay files, saves, runtime configuration, default model, commit or push were changed.

Evidence: [removal plan](mxfp8-removal-plan.json), [worker cancellation](mxfp8-worker-cancellation.json), [deleted-file receipt](mxfp8-removal-result.json), [final checks](mxfp8-removal-checks.json). The earlier research snapshots remain dated historical evidence. Huihui's useful-output trial and blind acceptance remain open.
