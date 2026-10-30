// styles/manifest.txt is the single ordered list of index.html stylesheets; build.js renders it into the page.
import {readFileSync} from 'node:fs';

export const BEGIN = '<!-- stylesheets:begin';
export const END = '<!-- stylesheets:end -->';

export function readManifest(file = 'styles/manifest.txt') {
    return readFileSync(file, 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
}

/** Replace the marked block of `html` with one <link> per manifest entry; `version(href)` gives the cache-bust value. */
export function renderStylesheets(html, hrefs, version) {
    const a = html.indexOf(BEGIN), b = html.indexOf(END);
    if (a < 0 || b < a) throw Error('index.html lacks the stylesheets begin/end markers.');
    const open = html.indexOf('-->', a) + 3;
    const links = hrefs.map(h => `\n        <link rel="stylesheet" href="${h}?version=${version(h)}">`).join('');
    return html.slice(0, open) + links + '\n        ' + html.slice(b);
}
