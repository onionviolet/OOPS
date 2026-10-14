# ER7 scratch-only reproduction

These files are archived evidence. Install and execute only in a new directory outside the repo. Node 22+ is required; the measured version was 22.23.3. Results are elapsed Node microbenchmarks, not browser durability or gameplay proof.

```sh
mkdir -p /tmp/yairpg-er7-repeat
cp /Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/engine-runtime-2026-10-14/ER7/*.mjs /tmp/yairpg-er7-repeat/
cp /Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/engine-runtime-2026-10-14/ER7/scratch-package.json /tmp/yairpg-er7-repeat/package.json
cp /Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/engine-runtime-2026-10-14/ER7/scratch-package-lock.json /tmp/yairpg-er7-repeat/package-lock.json
cd /tmp/yairpg-er7-repeat
npm ci
node actors.mjs > actors-run.log
node workers.mjs > workers-run.log
node saves.mjs > saves-run.log
```

The commands above are reproduction instructions, not a second run already executed. They emit raw JSON with all samples and their own environment, overwriting only that new scratch directory's results. No repo modules are imported. `provenance.py` is an optional read-only provenance helper tied to the original repo path, not needed by the spikes.
