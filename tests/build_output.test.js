import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn, spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const trackedOutputs = ['index.html', 'dist/bundle.js', 'dist/bundle.js.map', 'dist/INKJS_NOTICE.txt', 'dist/INKJS_AUTHORS.txt'];
const hashes = () => trackedOutputs.map(file => createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex'));
const build = output => new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['build.js'], {cwd: root, env: {...process.env, BUILD_OUT: output}, stdio: 'ignore'});
    child.on('error', reject);
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`build failed: ${code}`)));
});

test('concurrent BUILD_OUT pages use their own bundles without altering existing source outputs', async () => {
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'oops-build-output-'));
    const before = hashes();
    try {
        const outputs = ['one', 'two'].map(name => path.join(temp, name));
        await Promise.all(outputs.map(build));
        await build(outputs[0]); // Reuse must recognize Windows file hard links too.
        assert.deepEqual(hashes(), before, 'preserve even pre-existing dirty build outputs');
        for (const output of outputs) {
            const page = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
            const match = page.match(/src="(dist\/bundle\.js\?version=[^"]+)"/);
            assert.ok(match);
            const bundle = fs.readFileSync(path.join(output, 'dist/bundle.js'));
            assert.ok(match[1].endsWith(createHash('sha256').update(bundle).digest('hex').slice(0, 12)));
            assert.ok(fs.existsSync(path.join(output, 'dist/bundle.js.map')));
            assert.ok(fs.existsSync(path.join(output, 'dist/INKJS_NOTICE.txt')));
            const notices = fs.readFileSync(path.join(root, 'docs/gm/feature-wave/ink/COMPILER.md'), 'utf8').replace(/\r\n/g, '\n');
            for (const [marker, file] of [['inkjs-notice', 'INKJS_NOTICE.txt'], ['inkjs-authors', 'INKJS_AUTHORS.txt']]) {
                const start = `<!-- ${marker}:start -->\n`;
                const expected = notices.slice(notices.indexOf(start) + start.length, notices.indexOf(`<!-- ${marker}:end -->`));
                assert.equal(fs.readFileSync(path.join(output, 'dist', file), 'utf8'), expected, 'retain complete LF distribution notices');
            }
            for (const asset of ['style.css', 'styles/ui_tokens.css', 'resources/js/HackTimer/HackTimer.min.js', 'assets/realm/folded-glasshouse.svg']) {
                assert.ok(fs.existsSync(path.join(output, asset)), `${asset} resolves within the output root`);
            }
        }
    } finally { fs.rmSync(temp, {recursive: true, force: true}); }
});

test('Ink verification still rejects checkout byte drift instead of silently recompiling', () => {
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'oops-ink-byte-check-'));
    try {
        const output = path.join(temp, 'feature_wave.json');
        const exact = fs.readFileSync(path.join(root, 'stories/feature_wave.json'), 'utf8');
        fs.writeFileSync(output, exact.replace(/\r?\n/g, '\r\n'));
        const result = spawnSync(process.execPath, ['scripts/compile_feature_ink.mjs', '--check', '--output', output], {cwd: root, encoding: 'utf8'});
        assert.equal(result.status, 1);
        assert.match(result.stderr, /Compiled Ink output is stale/);
        assert.equal(fs.readFileSync(output, 'utf8'), exact.replace(/\r?\n/g, '\r\n'));
    } finally { fs.rmSync(temp, {recursive: true, force: true}); }
});
