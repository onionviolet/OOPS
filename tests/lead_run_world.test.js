import test from 'node:test';
import assert from 'node:assert/strict';
import {parseLocator, formatLocator, headerOf, shardLang, nameKey, nameIn, sharedWordRun, locatorsIn} from '../scripts/lead_run/world_profiles.mjs';
import {parseShard, lintCensus} from '../scripts/lead_run/lint_lead_run.mjs';
import {extractCandidates, glossaryHits, auditShard} from '../scripts/lead_run/shard_tools.mjs';
import {systemText, enQuoteIssues, lintExtra} from '../scripts/lead_run/batch_lib.mjs';
import {wordNumber, pdfChapters, epubChapterMembers, epubParagraphs, shardTextEn} from '../scripts/lead_run/prepare_shard_en.mjs';
import {locatorKey} from '../scripts/lead_run/merge_shards.mjs';

// Invented fixture text, not source prose.
const EN = '=== Chapter 3: The Market | book 2 | pages 10-11\np1: Anna Brook paid three Galleons at the stall by noon.\np2: Professor Hale waited two hours in the square.\n=== Chapter 4: Home | book 2\np1: Ann walked home.';

test('locators: Chinese unchanged, English carries the book; header and language detection', () => {
    assert.deepEqual(parseLocator('zh 第3章 p4'), {lang: 'zh', book: 0, ch: 3, p: 4, key: '3:4'});
    assert.deepEqual(parseLocator('en b2 c3 p4'), {lang: 'en', book: 2, ch: 3, p: 4, key: '3:4'});
    assert.equal(parseLocator('c3 p4'), null);
    assert.equal(formatLocator('en', {book: 2, ch: 3, p: 4}), 'en b2 c3 p4');
    assert.equal(formatLocator('zh', {ch: 3, p: 4}), 'zh 第3章 p4');
    assert.deepEqual(headerOf('=== Chapter 7: X | book 3 | pages 1-2'), {ch: 7, book: 3, lang: 'en'});
    assert.equal(shardLang(EN), 'en');
    assert.equal(shardLang('=== 第1章 测试\np1: 你好'), 'zh');
    assert.equal(locatorsIn('see en b1 c2 p3 and zh 第4章 p5').length, 2);
    assert.ok(locatorKey('en b1 c9 p9') < locatorKey('en b2 c1 p1'), 'book orders before chapter');
});

test('English names: whole-word match, titles dropped from the key, a bare title is no name', () => {
    assert.ok(nameIn('Ann walked home.', 'Ann', 'en'));
    assert.ok(!nameIn('Anna Brook paid', 'Ann', 'en'));
    assert.equal(nameKey("Professor Hale's", 'en'), 'hale');
    assert.equal(nameKey('Professor', 'en'), '');
    assert.equal(nameKey('克莱恩.莫雷蒂'), '克莱恩·莫雷蒂');
});

test('English shard: parse, candidates, glossary hits and the name-at-locator lint', () => {
    const map = parseShard(EN);
    assert.equal(map.lang, 'en');
    assert.equal(map.book, 2);
    assert.equal(map.get('3:1').startsWith('Anna'), true);
    const kinds = extractCandidates(map).map(c => `${c.kind}:${c.value}:${c.locator}`);
    assert.ok(kinds.includes('money:three Galleons:en b2 c3 p1'));
    assert.ok(kinds.includes('duration:two hours:en b2 c3 p2'));
    const g = new Map([['Ann', {id: 'hp.person.ann', label: 'Ann', kind: 'person', source: 'census'}], ['Mr· Hale', {id: 'hp.person.hale', label: 'Hale', kind: 'person', source: 'census'}]]);
    assert.deepEqual(glossaryHits(g, EN).map(h => h.id), ['hp.person.ann']);
    const row = {schema: 'census/1.3', id: 'hp.person.anna', label: 'Anna Brook', zh: 'Anna Brook', nameSource: 'pinyin-unconfirmed', kind: 'person', rung: 'M0', whereabouts: [], firstMention: 'en b2 c3 p1', aliases: [], claimant: 'narration', note: 'Buyer.'};
    assert.equal(lintCensus([row], map).filter(i => i.code === 'zh-not-at-locator').length, 0);
    assert.ok(lintCensus([{...row, firstMention: 'en b2 c3 p2'}], map).some(i => i.code === 'zh-not-at-locator'), 'a name absent from its locator paragraph is flagged');
    assert.equal(auditShard({census: [row], shardMap: map}).nameAccuracy, 1);
});

test('English prompts swap only the language rules and add the world appendix; Chinese prompts are unchanged', () => {
    const en = systemText('census', {world: 'hp'}), zh = systemText('census', {world: 'lotm'});
    assert.match(en, /en bB cN pM/);
    assert.match(en, /eight consecutive source words/);
    assert.match(en, /World appendix/);
    assert.match(en, /Galleon/);
    assert.doesNotMatch(zh, /World appendix|en bB cN pM/);
    assert.match(zh, /never copy more than five source characters/);
});

test('English quote guard flags a copied sentence, not a name; extra-pass locators accept English', () => {
    const issues = enQuoteIssues({census: [{id: 'x', zh: 'Anna Brook paid three Galleons at the stall by noon', note: 'Anna Brook paid three Galleons at the stall by noon today.'}]}, EN);
    assert.deepEqual(issues.map(i => i.field), ['note']);
    assert.equal(sharedWordRun('a short note', EN), 0);
    assert.equal(lintExtra({rules: [{label: 'T', locator: 'en b2 c3 p2'}, {label: 'T', locator: 'en b2 c9 p2'}]}, parseShard(EN)).length, 1);
});

test('English shard prep: number words, EPUB members, PDF chapters across books and pages, shard text form', () => {
    assert.equal(wordNumber('THIRTY-SEVEN'), 37);
    assert.equal(wordNumber('ELEVEN'), 11);
    assert.equal(wordNumber('PROLOGUE'), null);
    assert.deepEqual(epubChapterMembers('OEBPS/Text/0000_Information.xhtml\nOEBPS/Text/0002_2_Two.xhtml\nOEBPS/Text/0001_1_Good_Day.xhtml').map(m => [m.ch, m.title]), [[1, 'Good Day'], [2, 'Two']]);
    assert.deepEqual(epubParagraphs('<p>Chapter 001Title</p><p>Real &amp; text.</p>'), ['Real & text.']);
    const line = 'x'.repeat(70);
    const pdf = ['CHAPTER ONE\nCHAPTER TWO', // a table of contents: no body
        `CHAPTER ONE\nTHE START\n${line}\nends here.\n${line}\n12`, `${line}\nshort end.\nCHAPTER TWO\nNEXT\nbody.`, `CHAPTER ONE\nBOOK TWO START\nfirst.`].join('\f');
    const books = pdfChapters(pdf);
    assert.equal(books.length, 3);
    assert.deepEqual(books[1].map(c => [c.book, c.ch, c.title, c.paragraphs.length]), [[1, 1, 'THE START', 2], [1, 2, 'NEXT', 1]]);
    assert.equal(books[1][0].paragraphs[1].page, 2, 'a paragraph keeps the page it starts on');
    assert.equal(books[2][0].book, 2);
    const {text} = shardTextEn(books[1]);
    assert.match(text, /^=== Chapter 1: THE START \| book 1 \| pages 2-2\np1: /);
});

test('free census fixes: id kind segment follows the kind (old id kept), price amounts parsed from printed names, nothing guessed', async () => {
    const {migrateCensus, parseAmount, zhNumber} = await import('../scripts/lead_run/migrate_shard.mjs');
    const c = migrateCensus({id: 'lotm.item.notebook', kind: 'document', rung: 'M0'});
    assert.equal(c.id, 'lotm.document.notebook');
    assert.equal(c.idWas, 'lotm.item.notebook');
    assert.deepEqual(migrateCensus({id: 'lotm.price.lunch', kind: 'price', zh: '7便士', rung: 'M0'}).amount, {value: 7, unit: 'penny'});
    assert.equal(migrateCensus({id: 'lotm.price.x', kind: 'price', zh: '一点钱', rung: 'M0'}).amount, undefined);
    assert.deepEqual(parseAmount('three Galleons'), {value: 3, unit: 'galleon'});
    assert.equal(zhNumber('三百五十'), 350);
    assert.equal(zhNumber('两千'), 2000);
});

test('PDF chapter headings: bare, dashed, glued title, colon and double dash; contents lists are dropped', async () => {
    const {chapterHeading, pdfChapters} = await import('../scripts/lead_run/prepare_shard_en.mjs');
    // Invented heading lines in the forms one omnibus PDF uses.
    assert.deepEqual(chapterHeading('CHAPTER TWENTY-THREE'), {n: 23, title: ''});
    assert.deepEqual(chapterHeading('— CHAPTER ONE —'), {n: 1, title: ''});
    assert.deepEqual(chapterHeading('-CHAPTER ONEThe Old Mill'), {n: 1, title: 'The Old Mill'});
    assert.deepEqual(chapterHeading('-CHAPTER SEVENTEENA Long Road'), {n: 17, title: 'A Long Road'});
    assert.deepEqual(chapterHeading('Chapter 16: AVeryLong Night'), {n: 16, title: 'AVeryLong Night'});
    assert.deepEqual(chapterHeading('Chapter 8 -- Quiet Rooms'), {n: 8, title: 'Quiet Rooms'});
    assert.equal(chapterHeading('Chapter one of the report was long and dull.'), null);
    const prose = n => Array.from({length: 3}, (_, i) => `Line ${n}.${i} of invented prose that runs long enough to count as a full printed line here.`).join('\n') + '\n\nShort end.';
    const text = ['CHAPTER ONE\nFirst\n' + prose(1), 'CHAPTER TWO\nSecond\n' + prose(2), 'CHAPTER ONE\nCHAPTER TWO\nCHAPTER THREE', '-CHAPTER ONEThe Next Book\n' + prose(3)].join('\f');
    const books = pdfChapters(text);
    assert.deepEqual(books.slice(1).map(b => b.map(c => c.ch)), [[1, 2], [1]]);
    assert.equal(books[2][0].title, 'The Next Book');
});

test('Chinese locators carry the volume after volume 1; volume 1 keeps the old form', async () => {
    const {volumeRuns} = await import('../scripts/lead_run/prepare_shard.mjs');
    assert.deepEqual(parseLocator('zh b3 第12章 p4'), {lang: 'zh', book: 3, ch: 12, p: 4, key: '12:4'});
    assert.equal(parseLocator('zh 第12章 p4').book, 0);
    assert.equal(formatLocator('zh', {book: 3, ch: 12, p: 4}), 'zh b3 第12章 p4');
    assert.equal(formatLocator('zh', {book: 0, ch: 12, p: 4}), 'zh 第12章 p4');
    assert.deepEqual(headerOf('=== 第12章 夜 | book 3 | member x'), {ch: 12, book: 3, lang: 'zh'});
    assert.deepEqual(locatorsIn('see zh b2 第1章 p1 and zh 第2章 p3').map(l => l.book), [2, 0]);
    assert.deepEqual(volumeRuns([1, 2, 3, 1, 2, 1].map(n => ({n}))).map(r => r.length), [3, 2, 1]);
});

test('English names match whole words ignoring case and a plural ending', () => {
    assert.ok(nameIn('Three beasts came.', 'Beast', 'en'));
    assert.ok(nameIn('the Boxes', 'box', 'en'));
    assert.ok(!nameIn('Beastly weather.', 'Beast', 'en'));
});
