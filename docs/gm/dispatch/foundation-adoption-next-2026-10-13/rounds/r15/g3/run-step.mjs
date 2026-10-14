// node run-step.mjs steps/<name>.js. The separate harness owns Chrome, not this client.
import {readFile, writeFile} from 'node:fs/promises';
import {dirname, resolve, basename} from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = dirname(fileURLToPath(import.meta.url));
const file = resolve(dir, process.argv[2]);
const response = await fetch('http://127.0.0.1:19131/', {method: 'POST', body: await readFile(file, 'utf8')});
const result = await response.json();
await writeFile(resolve(dir, 'evidence', basename(file, '.js') + '-result.json'), JSON.stringify(result, null, 1) + '\n');
console.log(JSON.stringify(result));
if (!result.ok) process.exitCode = 1;
