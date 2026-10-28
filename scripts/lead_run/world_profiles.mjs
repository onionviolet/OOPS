// World profiles for the lead-run readers (READINESS_AND_SCOPE section 10, X1-X8): language, locator form, shard header, candidate patterns,
// name matching, titles and the world appendix that rides in the cached system prefix. LOTM (Chinese) behaviour is the default and unchanged.
// Locators: Chinese `zh 第N章 pM`; English `en bB cN pM` (book, chapter, paragraph; chapter numbers restart per book, so the book is part of it).
import {existsSync, readFileSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const APPENDIX_DIR = join(here, '../../docs/gm/dispatch/batch-reading-2026-10-27/world_appendix');

export const LOCATOR_ANY = /^(?:zh 第(\d+)章 p(\d+)|en b(\d+) c(\d+) p(\d+))$/;
const LOCATOR_IN_TEXT = /zh 第(\d+)章 p(\d+)|en b(\d+) c(\d+) p(\d+)/g;

/** `zh 第3章 p4` -> {lang:'zh', book:0, ch:3, p:4, key:'3:4'}; `en b1 c3 p4` -> {lang:'en', book:1, ...}. Null when not a locator. */
export function parseLocator(loc) {
    const m = LOCATOR_ANY.exec(String(loc || '').trim());
    if (!m) return null;
    return m[1] ? {lang: 'zh', book: 0, ch: Number(m[1]), p: Number(m[2]), key: `${Number(m[1])}:${Number(m[2])}`}
        : {lang: 'en', book: Number(m[3]), ch: Number(m[4]), p: Number(m[5]), key: `${Number(m[4])}:${Number(m[5])}`};
}

/** Every locator inside a string, in order. */
export function locatorsIn(text) {
    return [...String(text || '').matchAll(LOCATOR_IN_TEXT)].map(m => parseLocator(m[0]));
}

export function formatLocator(lang, {book = 1, ch, p}) {
    return lang === 'en' ? `en b${book} c${ch} p${p}` : `zh 第${ch}章 p${p}`;
}

/** Shard header line -> {ch, book} or null. Chinese `=== … 第N章 …`; English `=== Chapter N: Title | book B | …`. */
export function headerOf(line) {
    const zh = line.match(/^=== .*?第(\d+)章/);
    if (zh) return {ch: Number(zh[1]), book: 0, lang: 'zh'};
    const en = line.match(/^=== Chapter (\d+)\b.*?(?:\|\s*book (\d+))?/);
    if (en) { const b = line.match(/\|\s*book (\d+)/); return {ch: Number(en[1]), book: b ? Number(b[1]) : 1, lang: 'en'}; }
    return null;
}

/** Language of a shard from its first header (Chinese when none is found, the old behaviour). */
export function shardLang(text) {
    for (const line of String(text).split('\n', 200)) { const h = headerOf(line); if (h) return h.lang; }
    return 'zh';
}

const EN_NUM = '(?:\\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty|thirty|forty|fifty|sixty|hundred|thousand|a few|several|a|an|half an?)';
export const EN_PATTERNS = Object.freeze({
    money: new RegExp(`\\b${EN_NUM}(?:[ -]\\w+)?\\s+(?:Galleons?|Sickles?|Knuts?|pounds?|pence|penny|shillings?|crowns?|marks?|coppers?|silvers?|golds?|coins?|dollars?)\\b`, 'gi'),
    time: new RegExp(`\\b(?:${EN_NUM}\\s+o'clock|half past \\w+|quarter (?:past|to) \\w+|\\d{1,2}:\\d{2}|midnight|noon|dawn|dusk)\\b`, 'gi'),
    duration: new RegExp(`\\b${EN_NUM}\\s+(?:minutes?|hours?|days?|weeks?|months?|years?)\\b`, 'gi'),
    measure: new RegExp(`\\b${EN_NUM}\\s+(?:feet|foot|inches?|miles?|yards?|meters?|metres?|kilometers?|pounds? of|ounces?|stone|gallons?|pints?)\\b`, 'gi'),
});

// Titles and kin words name a role, not one person (the English side of shard_tools RELATIONAL).
export const EN_RELATIONAL = new Set(['Mr', 'Mr.', 'Mrs', 'Mrs.', 'Miss', 'Ms', 'Sir', 'Madam', 'Professor', 'Headmaster', 'Headmistress', 'Uncle', 'Aunt', 'Mum', 'Mom', 'Dad',
    'Father', 'Mother', 'Brother', 'Sister', 'Lord', 'Lady', 'Captain', 'Sergeant', 'Corporal', 'Lieutenant', 'Master', 'Teacher', 'Boy', 'Girl']);

/** English name key: case-folded, possessive and leading titles or articles dropped. A bare title alone is no key. */
export function nameKey(name, lang = 'zh') {
    if (lang !== 'en') return String(name || '').replace(/[.．・]/g, '·').trim();
    let s = String(name || '').trim().replace(/['’]s$/, '');
    s = s.replace(/^(?:the|a|an)\s+/i, '');
    const words = s.split(/\s+/).filter(Boolean);
    while (words.length > 1 && EN_RELATIONAL.has(words[0])) words.shift();
    return words.length === 1 && EN_RELATIONAL.has(words[0]) ? '' : words.join(' ').toLowerCase();
}

/** Does `name` occur in `text` as whole words (English) or as a substring (Chinese)? */
export function nameIn(text, name, lang = 'zh') {
    if (lang !== 'en') return String(text).includes(name);
    const esc = String(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?:^|[^A-Za-z])${esc}(?:$|[^A-Za-z])`).test(text);
}

/** Longest run of consecutive words a field shares with the shard text (English quote guard: a copied sentence, not a name). */
export function sharedWordRun(field, shardText, min = 9) {
    const words = String(field || '').split(/\s+/).filter(Boolean);
    if (words.length < min) return 0;
    const hay = ' ' + String(shardText).replace(/\s+/g, ' ') + ' ';
    let best = 0;
    for (let i = 0; i + min <= words.length; i++) if (hay.includes(' ' + words.slice(i, i + min).join(' ') + ' ')) best = min;
    return best;
}

/** Per-world settings for prompts and plans. `lang` decides locators and matching; `appendix` is extra card text for the cached prefix. */
export const WORLDS = Object.freeze({
    lotm: {lang: 'zh', name: 'Lord of the Mysteries'},
    hp: {lang: 'en', name: 'Harry Potter'},
    mol: {lang: 'en', name: 'Mother of Learning'},
    asl: {lang: 'en', name: "A Soldier's Life"},
    ss: {lang: 'en', name: 'Shadow Slave'},
    test: {lang: 'zh', name: 'test'},
    'test-en': {lang: 'en', name: 'test'},
});

export function worldProfile(world = 'lotm') {
    const w = WORLDS[world] || {lang: 'zh', name: world};
    const path = join(APPENDIX_DIR, `${world}.md`);
    return {world, ...w, appendix: existsSync(path) ? readFileSync(path, 'utf8') : ''};
}

/** The prompt rules that differ by language (locators, the `zh` field, the quote limit). */
export function languageRules(lang) {
    return lang === 'en'
        ? {locator: 'locators are `en bB cN pM` (book, chapter, paragraph) for a paragraph inside the shard; the book number is in each chapter header',
            name: 'the `zh` field holds the name exactly as printed in this English source (the field name is historical); `aliases` hold other printed forms',
            quote: 'never copy more than eight consecutive source words outside `zh` and `aliases`'}
        : {locator: 'locators are `zh 第N章 pM` for a paragraph inside the shard', name: 'copy `zh` exactly as printed', quote: 'never copy more than five source characters outside `zh` and `aliases`'};
}
