// Builds the single-file playthrough page: records frames, then inlines them with the player.
//   node prototypes/fight-playthrough/build.mjs [out.html]
import {execFileSync} from 'node:child_process';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const output = resolve(process.argv[2] ?? resolve(here, '../../work/fight-playthrough/index.html'));
const framesPath = resolve(dirname(output), 'frames.json');
await mkdir(dirname(output), {recursive: true});
execFileSync(process.execPath, [resolve(here, 'record.mjs'), framesPath], {stdio: 'inherit'});
const [html, css, js, data] = await Promise.all(['index.html', 'player.css', 'player.js'].map(f => readFile(resolve(here, f), 'utf8')).concat(readFile(framesPath, 'utf8')));
const safe = text => text.replace(/<\/script/gi, '<\\/script');
await writeFile(output, html.replace('/* INLINE_CSS */', () => css).replace('/* INLINE_DATA */', () => safe(data)).replace('/* INLINE_JS */', () => safe(js)));
console.log(output);
