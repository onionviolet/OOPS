import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('BUILD_OUT keeps lane bundles and pages outside tracked build outputs', () => {
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'oops-build-output-'));
    const first = path.join(temp, 'lane-one');
    const second = path.join(temp, 'lane-two');
    try {
        for (const output of [first, second]) {
            execFileSync(process.execPath, ['build.js'], {
                cwd: root,
                env: { ...process.env, BUILD_OUT: output },
                stdio: 'ignore',
            });
            assert.ok(fs.existsSync(path.join(output, 'dist/bundle.js')));
            assert.ok(fs.existsSync(path.join(output, 'dist/bundle.js.map')));
            const page = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
            const match = page.match(/src="(dist\/bundle\.js\?version=[^"]+)"/);
            assert.ok(match, 'copied page references the output bundle');
            assert.ok(fs.existsSync(path.join(output, match[1].split('?')[0])));
        }
        assert.equal(execFileSync('git', ['status', '--porcelain', '--', 'index.html', 'dist'], {
            cwd: root,
            encoding: 'utf8',
        }).trim(), '');
    } finally {
        fs.rmSync(temp, { recursive: true, force: true });
    }
});
