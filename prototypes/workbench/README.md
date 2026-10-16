# YAIR mockup workbench

The standing workflow, extension protocol and limitations live in
[docs/MOCKUP_SYSTEM.md](../../docs/MOCKUP_SYSTEM.md).

```sh
node prototypes/workbench/build.mjs
node prototypes/workbench/serve.mjs
```

Open the fresh loopback URL printed by the server. Start with recipe browsing,
switch layouts without resetting state, or enable Compare same state. Task &
limits explains simulated behavior. Fit preview is scaled; uncheck it for
actual-size inspection. No game saves or automatic storage are used.

For scoped browser checks, pass that URL to `node prototypes/workbench/check.cjs`.
See [REPORT.md](REPORT.md) for the delivered state and remaining gates.
