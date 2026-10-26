import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const repo = fileURLToPath(new URL('..', import.meta.url));
const script = join(repo, 'scripts/check_doc_slips.mjs');

test('doc slip lint accepts compliant additions and flags the two bad additions', () => {
  const dir = mkdtempSync(join(tmpdir(), 'doc-slips-'));
  const prepare = (text) => {
    mkdirSync(join(dir, 'docs'), {recursive: true});
    writeFileSync(join(dir, 'docs/sample.md'), text);
    const init = spawnSync('git', ['init', '-q'], {cwd: dir});
    assert.equal(init.status, 0);
    spawnSync('git', ['add', '.'], {cwd: dir});
    spawnSync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.test', 'commit', '-qm', 'base'], {cwd: dir});
    return () => spawnSync(process.execPath, [script, '--base', 'HEAD'], {cwd: dir, encoding: 'utf8'});
  };
  try {
    const run = prepare('# Fixture\n');
    writeFileSync(join(dir, 'docs/sample.md'), '# Fixture\n\n- By default, the rule applies unless a world dial changes it.\n- This behavior is accepted [owner](../PROJECT.md) AD5.\n');
    let result = run();
    assert.equal(result.status, 0, result.stderr);
    writeFileSync(join(dir, 'docs/sample.md'), '# Fixture\n\n- The rule always applies.\n- This behavior is accepted.\n');
    result = run();
    assert.equal(result.status, 1);
    assert.equal((result.stderr.match(/docs\/sample\.md:/g) ?? []).length, 2, result.stderr);
    assert.match(result.stderr, /absolute rule word/);
    assert.match(result.stderr, /acceptance claim/);
    writeFileSync(join(dir, 'docs/sample.md'), '# Fixture\n');
    writeFileSync(join(dir, 'docs/new.md'), '- The rule always applies.\n');
    result = run();
    assert.equal(result.status, 1);
    assert.match(result.stderr, /docs\/new.md:1:/);
    rmSync(join(dir, 'docs/new.md'));
    writeFileSync(join(dir, 'docs/sample.md'), '# Fixture\n');
    const clean = spawnSync(process.execPath, [script], {cwd: dir, encoding: 'utf8'});
    assert.equal(clean.status, 0, clean.stderr);
  } finally { rmSync(dir, {recursive: true, force: true}); }
});
