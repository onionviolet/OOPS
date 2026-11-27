import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {once} from 'node:events';
import {prepareHandoff} from '../prototypes/world-atlas/reading-handoffs.mjs';
import {submitReadingBatch, submitReadingHandoffs} from '../scripts/atlas/submit_reading_handoffs.mjs';

test('one stale reference fails independently and a rerun sends the same proposal', async t => {
    const file = {book:'toy',prefix:'toyc001',pass:'rules',kind:'rules',contentHash:'sha256:version'};
    const record = {key:'r1',label:'Training',type:'rule',route:'#world/toy/things/r1',fileLines:[[2,2]]};
    const references = {schema:'atlas-reading-references/1',file,page:{offset:40},records:[record,
        {...record,key:'old',route:'#world/toy/things/old'}]};
    const accepted = [];
    const server = createServer(async (req,res) => {
        assert.equal(req.url,'/reading-handoffs');
        let bytes = '';
        for await (const chunk of req) bytes += chunk;
        try {
            const request = JSON.parse(bytes);
            assert.equal(request.offset,40);
            const packet = prepareHandoff(request,{...file,inspected:true,records:[{...record,href:record.route}]});
            accepted.push(packet); res.end(JSON.stringify({id:'a'.repeat(64)}));
        } catch (error) {res.writeHead(400).end(error.message);}
    });
    server.listen(0,'127.0.0.1'); await once(server,'listening');
    t.after(() => new Promise(resolve => server.close(resolve)));
    const base = 'http://127.0.0.1:' + server.address().port;
    const idea = {key:'r1',change:'Train with the tutor.',check:'Use the skill during a lesson.'};
    const byLine = {...idea,key:undefined,route:record.route,line:2,contentHash:file.contentHash};
    const result = await submitReadingHandoffs(references,[{...idea,key:'old'},idea,byLine,
        {...byLine,contentHash:'earlier-version'}, {...byLine,line:1}],base);
    assert.match(result[0].error,/changed/);
    assert.equal(result[1].id,'a'.repeat(64));
    assert.equal(result[2].id,result[1].id);
    assert.match(result[3].error,/version changed/);
    assert.match(result[4].error,/one record/);
    assert.deepEqual(accepted[0],accepted[1]);
    await assert.rejects(submitReadingHandoffs(references,[idea],'https://example.org'),/local Atlas/);
});

test('a mixed batch finds the exact output page, reuses reads and isolates stale files', async t => {
    const gets = [], posts = [];
    const server = createServer(async (req,res) => {
        if (req.method === 'POST') {
            let body = '';
            for await (const chunk of req) body += chunk;
            posts.push(JSON.parse(body));
            return res.end(JSON.stringify({id:'b'.repeat(64)}));
        }
        const url = new URL(req.url,'http://localhost');
        const [, ,book,prefix,pass,kind] = url.pathname.split('/');
        const offset = Number(url.searchParams.get('offset'));
        gets.push([prefix,offset]);
        const contentHash = prefix === 'changing' && offset ? 'changed' : 'original';
        res.end(JSON.stringify({schema:'atlas-reading-references/1',file:{book,prefix,pass,kind,contentHash},
            page:{offset,total:2},records:[{key:'r'+offset,route:'#r'+offset,fileLines:[[offset+1,offset+1]]}]}));
    });
    server.listen(0,'127.0.0.1'); await once(server,'listening');
    t.after(() => new Promise(resolve => server.close(resolve)));
    const proposal = {book:'lotm1',prefix:'first',pass:'rules',kind:'rules',route:'#r1',line:2,
        change:'Try the chosen method.',check:'Exercise it at the destination.'};
    const results = await submitReadingBatch([proposal,{...proposal,prefix:'changing'}, {...proposal,route:'#r0',line:1},
        {...proposal,prefix:'second'},{...proposal,book:undefined},{...proposal,contentHash:'stale'}],
        'http://127.0.0.1:' + server.address().port);
    assert.deepEqual(gets,[['first',0],['first',1],['changing',0],['changing',1],['second',0],['second',1]]);
    assert.deepEqual(posts.map(p => [p.prefix,p.offset,p.recordKey]),[['first',1,'r1'],['first',0,'r0'],['second',1,'r1']]);
    assert.deepEqual(results.map(r => r.index),[0,1,2,3,4,5]);
    assert.match(results[1].error,/changed while loading/);
    assert.match(results[4].error,/book, prefix, pass and kind/);
    assert.match(results[5].error,/version changed/);
});
