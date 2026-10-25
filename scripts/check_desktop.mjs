// Runs every hidden-Electron desktop check in turn and fails if any fails.
// Needs a built bundle (npm run build). Each check uses its own temp userData.
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const checks = ['desktop_smoke', 'desktop_crash_guard', 'desktop_frozen_build', 'desktop_save_mirror', 'desktop_presence', 'desktop_offline'];
let failed = 0;
for (const name of checks) {
    const r = spawnSync(process.execPath, [fileURLToPath(new URL(`./${name}.cjs`, import.meta.url))], {encoding: 'utf8'});
    const pass = r.status === 0 && /"result": "PASS"/.test(r.stdout);
    console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}`);
    if (!pass) {failed++; console.log((r.stdout + r.stderr).split('\n').slice(-12).join('\n'));}
}
process.exit(failed ? 1 : 0);
