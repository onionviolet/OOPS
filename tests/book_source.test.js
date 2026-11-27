import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {resolveBookSource} from '../scripts/lead_run/book_source.mjs';
import {readKey, registeredBooks} from '../prototypes/world-atlas/library-reading.mjs';
import {bookShards} from '../scripts/lead_run/make_book_plans.mjs';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
function fixture(t) {
    const root = mkdtempSync(join(tmpdir(), 'book-source-'));
    t.after(() => rmSync(root, {recursive:true,force:true}));
    return root;
}

test('host source identity includes every chunk and its final partial tail',t=>{
    const dir=fixture(t),alias=join(dir,'large source.epub'),bytes=Buffer.alloc(65536*3+17,0xe9);
    writeFileSync(alias,bytes);const book={sourceAliases:[{path:alias,sha256:hash(bytes)}]};
    assert.equal(resolveBookSource(book),alias);bytes[bytes.length-1]=0;writeFileSync(alias,bytes);
    assert.equal(resolveBookSource(book),null);
});

test('registered lotm1 is a new book-1 manual owner; older LOTM owners and order retain their meaning', () => {
    const books = registeredBooks(), rows = books.filter(book => book.key === 'lotm1');
    assert.equal(rows.length,1);
    const book = rows[0];
    assert.deepEqual([book.world,book.lang,book.type,book.book],['lotm','zh','zh-nav',1]);
    assert.equal(book.dir,'docs/research/novels/lord-of-mysteries/private/local-reading-2026-11-25');
    assert.equal(book.readingOwner,'new-local-manual');
    assert.equal(book.nav,'OEBPS/Text/nav.xhtml');
    assert.equal(book.sourceAliases[0].sha256,'6126274478a95dbe03eb904bc35c409067c7022563e52997a46e98be07b2d70d');
    assert.match(book.sourceAliases[0].path,/^D:\/Library\/Books\/CN_Webnovels\//);
    const older = books.filter(row=>/^lotm[2-8]$/.test(row.key));
    assert.deepEqual(older.map(row=>row.key),['lotm2','lotm3','lotm4','lotm5','lotm6','lotm7','lotm8']);
    for(const row of older) {
        assert.equal(row.dir,'docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27');
        assert.equal(row.sourceAliases,undefined,'the new source alias does not rewrite legacy registration');
    }
});

test('primary paths remain preferred; an explicit host alias needs its exact bytes', t => {
    const root=fixture(t), primary=join(root,'canonical source.epub'), alias=join(root,'host source.epub');
    writeFileSync(alias,'held fixture edition');
    const book={source:primary,sourceAliases:[{path:alias,sha256:hash('held fixture edition')}]};
    assert.equal(resolveBookSource(book),alias);
    writeFileSync(primary,'legacy canonical bytes');
    assert.equal(resolveBookSource(book),primary,'preserve existing primary-path callers');
    assert.equal(readFileSync(primary,'utf8'),'legacy canonical bytes');
    rmSync(primary);writeFileSync(alias,'different edition');
    assert.equal(resolveBookSource(book),null,'a mismatched edition cannot become the held source');
    assert.equal(readFileSync(alias,'utf8'),'different edition','resolution is read-only');
    assert.equal(resolveBookSource({source:primary}),null,'missing legacy sources get no implicit remap');
});

test('Atlas held state shares source resolution, exposes no paths, and does not infer reading or migrate old shards', t => {
    const root=fixture(t), dir=join(root,'new reader'), source=join(root,'held source.epub');mkdirSync(dir);
    writeFileSync(source,'held fixture edition');
    const book={key:'lotm1',world:'lotm',lang:'zh',book:1,dir:pathToFileURL(dir).href,
        source:join(root,'absent canonical.epub'),sourceAliases:[{path:source,sha256:hash('held fixture edition')}]};
    let state=readKey(book);
    assert.equal(state.held,true);assert.equal(state.shards,0);assert.equal(state.complete,false);
    assert.deepEqual(Object.values(state.passes),[0,0,0,0,0]);
    assert.doesNotMatch(JSON.stringify(state),/held source|reader|sourceAliases|\.epub/);
    writeFileSync(join(dir,'shard_w1s1_ch127-129.txt'),'legacy-name fixture');
    assert.equal(readKey(book).shards,0,'legacy wave filenames are not silently renamed or admitted');
    writeFileSync(join(dir,'shard_lotm1_ch127-127.txt'),'new manually read chapter fixture');
    state=readKey(book);
    assert.equal(state.shards,1);assert.equal(state.complete,false);
    assert.deepEqual(bookShards(book,['shard_lotm1_ch127-127.txt']).map(row=>row.prefix),['lotm1c127']);
    rmSync(source);state=readKey(book);
    assert.equal(state.held,false);assert.equal(state.shards,1,'stored reading remains distinct from absent held source');
});
