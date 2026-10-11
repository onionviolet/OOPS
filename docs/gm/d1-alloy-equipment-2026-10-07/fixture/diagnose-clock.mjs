// Read generated test fixtures only. Same native Import/preflight/load harness
// as generate.mjs, with actual run() and fill_character_bio startup validation.
// No browser, server, real timers, personal saves or gameplay source writes.
// Optional: --expect-ready asserts startup/tick/reload success.
// Optional: D1_DIAGNOSTIC_OUTPUT=/path/to/report.json writes the report.
process.argv.push('--diagnose');
await import('./generate.mjs');
