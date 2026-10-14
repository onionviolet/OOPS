`bash PK/check_pockets.sh` exited **0**:

```text
PASS pockets_gate_integrity
PASS gate_integrity
PASS build
PASS npm_test # pass 658 # fail 0
PASS unit_file
PASS G1–G7
PASS P1–P5
```

Pocket lines written:

| ID | Layer/item | Line |
|---|---|---|
| L1 | Vanilla pants | A rough patch inside the knee covers a tear with dried mud still caught in its edge. |
| L2 | Vanilla bread | The five pieces smell faintly of wood smoke, with flour from a shared loaf still dusting their crusts. |
| L3 | Packed bread | The two extra pieces were wrapped for the road in cloth that smells of onion. |

Files changed:

```text
src/start_records.js
src/data/start_layers_frontier.js
src/start_probe_ui.js
styles/start_probe.css
tests/start_records.test.js
dist/bundle.js
dist/bundle.js.map
```

Hidden histories are masked; vanilla values and save/reload/import checks pass. Protected checks were untouched. No staging, commits, or pushes; port 18341 is free.