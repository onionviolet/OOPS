import {build} from 'esbuild';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const output = resolve(process.argv[2] ?? resolve(here, '../../work/wang-er-duel/index.html'));
const [{outputFiles}, html, css] = await Promise.all([
    build({entryPoints: [resolve(here, 'duel.js')], bundle: true, write: false, format: 'iife', target: 'es2022', minify: true}),
    readFile(resolve(here, 'index.html'), 'utf8'),
    readFile(resolve(here, 'duel.css'), 'utf8'),
]);
await mkdir(dirname(output), {recursive: true});
await writeFile(output, html.replace('/* INLINE_CSS */', () => css)
    .replace('/* INLINE_JS */', () => outputFiles[0].text.replace(/<\/script/gi, '<\\/script')));
console.log(output);
