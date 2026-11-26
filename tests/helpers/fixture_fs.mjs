// Disposable fixture dependencies: keep directory links cheap without requiring Windows symlink privileges.
// File dependencies are immutable inputs to these tests, so Windows copies them; mutable source is copied by each caller.
import {copyFile, symlink} from 'node:fs/promises';
import {copyFileSync, symlinkSync} from 'node:fs';
import {resolve} from 'node:path';
export const linkFixtureInput = (source, target, type = 'file') => process.platform === 'win32'
    ? type === 'dir' ? symlink(resolve(source), target, 'junction') : copyFile(source, target)
    : symlink(source, target, type);
// Synchronous staging callers retain the same input identity and link policy.
export const linkFixtureInputSync = (source, target, type = 'file') => process.platform === 'win32'
    ? type === 'dir' ? symlinkSync(resolve(source), target, 'junction') : copyFileSync(source, target)
    : symlinkSync(source, target, type);
