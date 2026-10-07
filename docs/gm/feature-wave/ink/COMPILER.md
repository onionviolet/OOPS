# Pinned feature-wave Ink compiler

2026-10-05. This worker owns only this file, `DEPENDENCY.json` and `scripts/compile_feature_ink.mjs`; all three are released to Ink GM after the static checks below. Features owns package/lock/build and distributed notice joins. No project dependency, parent story output, source-bank or private save was changed.

Use exact `inkjs@2.4.0` for both runtime and build compiler. The published tarball records Git commit `edccead8700e9f21be9825d87d8645d8c82a9936`; the pinned bank uses `6b1153410ab1c4bcfd9ef04eb2f0107f36be7778`, which declares the same package version. `git diff` between those commits confirms identical `src/engine`, `src/compiler`, `LICENSE.md` and `AUTHORS.md`; only four development dependency values in `package.json` differ within that inspected scope. Do not describe the published tarball as built from the bank commit. [Published source manifest](https://github.com/y-lohse/inkjs/blob/edccead8700e9f21be9825d87d8645d8c82a9936/package.json), [bank source manifest](https://github.com/y-lohse/inkjs/blob/6b1153410ab1c4bcfd9ef04eb2f0107f36be7778/package.json).

The runtime import is `import { Story } from 'inkjs'`, whose ESM export resolves to `dist/ink.mjs`. Build tooling loads the explicit `compiler/Compiler.js` module; the legacy package `main` includes the compiler and should not select browser code. There are no transitive runtime dependencies. Source inspection confirms story format21, runtime story minimum18, save output10 and runtime save minimum8. The adapter accepts exactly story21/save10 plus its own metadata/cursor/content identity guards. The engine's broader load range supplies no permission to load an incompatible host cursor. [Story format checks](https://github.com/y-lohse/inkjs/blob/edccead8700e9f21be9825d87d8645d8c82a9936/src/engine/Story.ts), [save checks](https://github.com/y-lohse/inkjs/blob/edccead8700e9f21be9825d87d8645d8c82a9936/src/engine/StoryState.ts).

## Parent compilation

The temporary install is `/tmp/yairpg-ink-wave-compiler-ztluajdz/node_modules/inkjs`, installed with npm scripts disabled. Ink GM may compile its owned story output with:

```sh
node scripts/compile_feature_ink.mjs --package-root /tmp/yairpg-ink-wave-compiler-ztluajdz/node_modules/inkjs
node scripts/compile_feature_ink.mjs --check --package-root /tmp/yairpg-ink-wave-compiler-ztluajdz/node_modules/inkjs
```

The package root also accepts an installation directory containing `node_modules/inkjs`; `INKJS_PACKAGE_ROOT` provides the same override. Without either, the script resolves the project dependency. Defaults are `stories/feature_wave.ink` and `stories/feature_wave.json`; `--source PATH` and `--output PATH` allow isolated compiler fixtures. `--check` only recompiles in memory and requires byte-identical existing output. `compileFeatureInk({packageRoot, sourcePath})` returns `{artifact, metadata, bytes, outputSha256, diagnostics}` without writing or continuing a story. `verifyInkCompilerPackage(packageRoot)` verifies the package name/version and four pinned compiler/runtime file hashes before importing the compiler. `INK_COMPILER_PIN` exports the exact bounds and identity defaults.

Source normalization removes one leading BOM and normalizes CRLF/CR to LF. Object keys are recursively sorted while array order stays fixed. The compiler emits standard Ink JSON plus `yairpgInk` metadata; its `compiledSha256` hashes compact canonical standard JSON before metadata. `contentHash` hashes compact canonical metadata excluding `contentHash`, including normalized `sourceSha256`, compiled hash and exact compiler/story/schema versions. Output uses two-space JSON and one final LF. A source edit, compiler change or byte drift fails `--check`. Any compiler error, warning or author message rejects emission. `INCLUDE` and plugins are unsupported by this single-source recipe; a bounded in-memory `JsonFileHandler` exposes only the root. No filesystem include resolution or browser compilation occurs.

## Features dependency and build joins

Only Features performs these operations inside its exclusive package/build write window:

```sh
npm install --save-exact --ignore-scripts --no-audit --no-fund inkjs@2.4.0
node scripts/compile_feature_ink.mjs
node scripts/compile_feature_ink.mjs --check
```

Record `dependencies.inkjs` as `2.4.0`, with no caret/range, and retain the lock integrity `sha512-EoPCYESIbMtfI8SqEDZCJwn+A5is0QozMLw250iic1ReJCgZpRKIezWj0VqgRUzAx0f3MmEbsUjY/ILe2815JQ==` from `https://registry.npmjs.org/inkjs/-/inkjs-2.4.0.tgz`. Add `ink:compile` and `ink:check` scripts using the commands above. Make the ordinary build require `ink:check` before esbuild so it cannot ship stale narrative source. Import the runtime and compiled JSON through the parent adapter; compiler code stays in Node. Do not copy the temporary install's lockfile, whose local `/tmp` root paths are not the project lock recipe.

The npm package includes `LICENSE.md` but omits the referenced `AUTHORS.md`. Both complete notices below come from the actual published source commit and are retained here. Features must copy both marked blocks alongside the runtime bundle and ship them with distributed artifacts. This exact build helper produces the two files without any additional source fetch:

```js
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
const inkNotices = readFileSync('docs/gm/feature-wave/ink/COMPILER.md', 'utf8');
mkdirSync('dist', { recursive: true });
for (const [marker, output] of [
    ['inkjs-notice', 'dist/INKJS_NOTICE.txt'],
    ['inkjs-authors', 'dist/INKJS_AUTHORS.txt'],
]) {
    const start = `<!-- ${marker}:start -->\n`;
    const end = `<!-- ${marker}:end -->`;
    const startIndex = inkNotices.indexOf(start);
    const endIndex = inkNotices.indexOf(end, startIndex + start.length);
    if (startIndex < 0 || endIndex < 0) throw new Error(`Missing ${marker} notice`);
    writeFileSync(output, inkNotices.slice(startIndex + start.length, endIndex));
}
```

This notice copy is required even if esbuild preserves some license comments. Existing upstream YAIRPG `LICENSE` and attribution stay intact. Ink's C# repository is a read-only reference; this integration distributes inkjs, whose notice includes inkle's original runtime attribution, rather than adding the C# engine/compiler as a second dependency.

## Static evidence and remaining gates

Nodev26.4.0/npm11.17.0 performed: `node --check` and CLI help on the compiler script; published package version/integrity/source qualification; explicit compiler and ESM runtime export imports; an original three-choice compiler fixture with zero diagnostics, compiled into memory only; identical output bytes after BOM/CRLF normalization; dependency JSON parsing and matching script hash receipt; and exact notice-block byte/hash comparison with the published source. The initial probe exposed a missing file handler, which was fixed with the bounded JSON handler and rechecked. No `Continue`, choice selection, runtime save/load or gameplay behavior was exercised. Parent story compilation/check correspondence awaits the parent's actual authored source; the worker never wrote its reserved JSON output. New gameplay remains implemented-unverified. Browser, interruption/resume, native consequences, save/reload/failure, keyboard, regression and director fiction/balance gates remain deferred under the current wave.

## Complete inkjs MIT notice

[Published-source LICENSE.md](https://github.com/y-lohse/inkjs/blob/edccead8700e9f21be9825d87d8645d8c82a9936/LICENSE.md). The full notice below is redistribution material, not game prose.

<!-- inkjs-notice:start -->
MIT License

Copyright (c) 2017 inkle Ltd.  
Copyright (c) 2017 inkjs contributors (see AUTHORS)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
<!-- inkjs-notice:end -->

## Complete inkjs AUTHORS notice

[Published-source AUTHORS.md](https://github.com/y-lohse/inkjs/blob/edccead8700e9f21be9825d87d8645d8c82a9936/AUTHORS.md).

<!-- inkjs-authors:start -->
This is the list of inkjs' main contributors.

inkle Ltd. (@inkle): original source code  
Yannick Lohse (@y-lohse): project creator, runtime port  
Frédéric Maquin (@ephread): runtime port  
furkle (@furkle): compiler port  
Julien Zamor (@smwhr): compiler port  

To see the full list of contributors, see the revision history in  
source control. Alternatively, the complete list of contributors  
can be found at https://github.com/y-lohse/inkjs/graphs/contributors  
<!-- inkjs-authors:end -->
