#!/usr/bin/env node
// npm test: every tests/*.test.js, slowest first, as many at once as the machine has free cores (scripts/test_plan.mjs).
// npm test wraps this in scripts/slot_run.mjs, so one full suite runs at a time machine-wide.
import {spawnSync} from 'node:child_process';
import {concurrencyFor, nodeTestArgs} from './test_plan.mjs';
import {suiteFiles} from './test_changed.mjs';

const concurrency = concurrencyFor();
console.error(`test suite: ${concurrency} files at once (free cores now; YAIRPG_TEST_CONCURRENCY=N sets it)`);
const r = spawnSync(process.execPath, nodeTestArgs(suiteFiles(), {concurrency}), {stdio: 'inherit'});
process.exitCode = r.status ?? 1;
