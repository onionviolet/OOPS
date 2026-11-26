// Server-side method metadata. Receipt contents and filesystem paths never enter the returned projection.
import {createHash} from 'node:crypto';
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';
import {formatLocator,parseLocator} from '../../scripts/lead_run/world_profiles.mjs';
import {readerDirectory} from './library-reading.mjs';
import {OUTPUT_KINDS, selectCollectedOutput} from './batch-output-index.mjs';

const unknown = reason => ({status: 'unknown', method: 'unknown', label: 'Reading method not attested',
    provider: 'unknown', locatorScope: null, reason});
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const digest = value => typeof value === 'string' && /^(?:sha256:)?[a-f0-9]{64}$/i.test(value) ? value.replace(/^sha256:/i, '').toLowerCase() : null;
const positive = value => Number.isSafeInteger(value) && value > 0;
function scopeOf(receipt, scope) {
    if (!scope || !['zh', 'en'].includes(scope.language) || scope.language !== receipt.language
        || !positive(scope.book) || scope.book !== receipt.book
        || !positive(scope.chapterFrom) || scope.chapterFrom !== receipt.reading?.chapter
        || !positive(scope.chapterTo) || scope.chapterTo < scope.chapterFrom
        || !positive(scope.paragraphFrom) || !positive(scope.paragraphTo)
        || !positive(receipt.verification?.preparedParagraphs)) return null;
    const {chapterFrom,chapterTo,paragraphFrom,paragraphTo}=scope;
    const total=receipt.verification.preparedParagraphs;
    let chapters=receipt.reading.chapters;
    if (chapterFrom===chapterTo && chapters===undefined) {
        if (receipt.reading.chapterTo!==undefined && receipt.reading.chapterTo!==chapterTo) return null;
        chapters=[{chapter:chapterFrom,paragraphs:total}];
    } else if (receipt.reading.chapterTo!==chapterTo || !Array.isArray(chapters) ||
        chapters.length!==chapterTo-chapterFrom+1 ||
        chapters.some((row,i)=>row?.chapter!==chapterFrom+i || !positive(row.paragraphs)) ||
        chapters.reduce((n,row)=>n+row.paragraphs,0)!==total) return null;
    if (paragraphFrom>chapters[0].paragraphs || paragraphTo>chapters.at(-1).paragraphs ||
        (chapterFrom===chapterTo && paragraphFrom>paragraphTo)) return null;
    const endpoint=(ch,p)=>formatLocator(scope.language,{book:scope.book,ch,p});
    return {chapters,endpoints:{from:endpoint(chapterFrom,paragraphFrom),through:endpoint(chapterTo,paragraphTo)}};
}

function locatorsWithin(bytes, scope, chapters) {
    const inspect = value => {
        if (Array.isArray(value)) return value.every(inspect);
        if (!value || typeof value !== 'object') return true;
        return Object.entries(value).every(([key, entry]) => {
            if (key !== 'locator' && key !== 'firstMention') return inspect(entry);
            const at = typeof entry === 'string' && parseLocator(entry);
            return !!at && at.lang === scope.language && (at.lang==='zh' ? at.book || 1 : at.book) === scope.book
                && at.ch >= scope.chapterFrom && at.ch <= scope.chapterTo
                && at.p >= (at.ch===scope.chapterFrom ? scope.paragraphFrom : 1)
                && at.p <= (at.ch===scope.chapterTo ? scope.paragraphTo : chapters[at.ch-scope.chapterFrom].paragraphs);
        });
    };
    try {return String(bytes).split(/\r?\n/).filter(line => line.trim()).every(line => inspect(JSON.parse(line)));}
    catch {return false;}
}
/** One logical output, selected by the inventory's canonical preference. No filename/provider inference.
 * Options are server-owned test/mounted-root dependencies, never public query parameters. */
export function readOutputMethodAttestation(book, {prefix, pass, kind}, options = {}) {
    if (!OUTPUT_KINDS.some(row => row.pass === pass && row.kind === kind)) return unknown('unsupported-output');
    const directory = options.directory ?? readerDirectory(book);
    const read = options.readFile ?? readFileSync;
    let receipt, selected;
    try {
        const names = options.names ?? (options.selected ? [options.selected.name] : readdirSync(directory));
        const resolved = selectCollectedOutput(names instanceof Set ? names : new Set(names), prefix, pass, kind);
        selected = options.selected ?? resolved;
        if (selected.name !== resolved.name) return unknown('output-unavailable');
        if (!selected.name || /[\\/]/.test(selected.name)) return unknown('output-unavailable');
        const chapter = /c0*([1-9]\d*)$/i.exec(prefix)?.[1];
        const chapterReceipt = chapter && join(directory, 'CH' + chapter + '_READING_RECEIPT.json');
        // Several registry books share a directory and restart their chapter numbers.
        const prefixReceipt = /^[a-z0-9_-]+$/i.test(prefix) && join(directory,prefix+'_READING_RECEIPT.json');
        const path = [prefixReceipt,chapterReceipt].find(file => file && existsSync(file)) ?? join(directory,'LOCAL_READING_RECEIPT.json');
        receipt = JSON.parse(String(read(path)));
        if (chapter && receipt?.reading?.chapter !== Number(chapter)) return unknown('scope-unverified');
    } catch {return unknown('receipt-unavailable');}
    if (receipt?.schema !== 'local-manual-reading/1' || receipt.key !== book.key || receipt.world !== book.world
        || receipt.methodAttestations?.schema !== 1 || !Array.isArray(receipt.methodAttestations.outputs)
        || !Array.isArray(receipt.verification?.schemaAndLocatorIssues) || receipt.verification.schemaAndLocatorIssues.length)
        return unknown('receipt-unverified');
    const matches = receipt.methodAttestations.outputs.filter(row => row && row.key === book.key && row.prefix === prefix
        && row.pass === pass && row.kind === kind && row.file === selected.name);
    if (matches.length !== 1) return unknown('no-unique-attestation');
    const entry = matches[0];
    if (entry.method !== 'manual-structured-reading') return unknown('method-unverified');
    const scope = scopeOf(receipt, entry.locatorScope);
    if (!scope) return unknown('scope-unverified');
    const expected = digest(entry.sha256), verified = digest(receipt.verification.outputHashes?.[selected.name]);
    if (!expected || expected !== verified) return unknown('hash-unverified');
    try {
        const bytes = Object.hasOwn(options, 'content') ? options.content : read(join(directory, selected.name));
        if (hash(bytes) !== expected) return unknown('output-changed');
        if (!locatorsWithin(bytes, entry.locatorScope,scope.chapters)) return unknown('scope-unverified');
    } catch {return unknown('output-unavailable');}
    return {status: 'verified', method: 'manual-structured-reading', label: 'Manual structured reading',
        provider: 'unknown', locatorScope: scope.endpoints};
}
