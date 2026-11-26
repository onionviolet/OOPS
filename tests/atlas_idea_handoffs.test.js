import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,readdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {readOwnerIdeas} from '../prototypes/world-atlas/owner-ideas.mjs';
import {prepareIdeaHandoff,saveIdeaHandoff} from '../prototypes/world-atlas/idea-handoffs.mjs';
import {readHandoffs,saveHandoff,attachImplementationReport,attachNativePlaytest} from '../prototypes/world-atlas/reading-handoffs.mjs';

const owner='docs/MECHANISM_BACKLOG.md';
const document='# Mechanism backlog\n\n## Feature proposals\n\n| Code | Idea | Check |\n| --- | --- | --- |\n| N1 | Return a borrowed tool | Compare custody after reload |\n\n## Acceptance checks\n\n| Code | Idea | Check |\n| --- | --- | --- |\n| N1 | Preserve the earlier promise | Run the later consumer |\n';
async function fixture(t){
    const root=await mkdtemp(join(tmpdir(),'atlas-idea-handoff-'));
    t.after(()=>rm(root,{recursive:true,force:true}));
    await mkdir(join(root,'docs'));await mkdir(join(root,'src'));
    await writeFile(join(root,'docs','IDEA_INDEX.md'),'# Ideas\n\n[Mechanisms](MECHANISM_BACKLOG.md)\n');
    await writeFile(join(root,owner),document);
    const page=readOwnerIdeas(root,owner),row=page.rows[0],directory=join(root,'queue');
    const request={ownerReference:row.ownerReference,ideaId:row.id,documentHash:page.documentHash,change:'Return the actual tool to its lender.',check:'Reload and verify custody changes once.'};
    return {root,directory,page,row,request};
}

test('idea packet binds the exact current owner row, preserving source classification without fabricated reading identity',async t=>{
    const f=await fixture(t);
    assert.equal(f.page.rows.length,2);assert.equal(f.page.rows[0].code,f.page.rows[1].code);
    const packet=prepareIdeaHandoff({...f.request,label:'CLIENT OVERRIDE',excerpt:'CLIENT OVERRIDE',stage:'implemented',book:'fake'},f.page);
    assert.equal(packet.schema,'atlas-idea-handoff/1');assert.equal(packet.stage,'proposed');
    assert.equal(packet.proposal.backlog,f.row.reference);
    assert.equal(packet.source.kind,'idea-owner');assert.equal(packet.source.ideaId,f.row.id);
    assert.equal(packet.source.documentHash,f.page.documentHash);
    assert.deepEqual([packet.source.lineStart,packet.source.lineEnd],[f.row.lineStart,f.row.lineEnd]);
    assert.deepEqual(packet.source.section,f.row.section);
    assert.equal(packet.record.label,f.row.title);assert.equal(packet.record.classification,'feature-proposal');
    assert.equal(packet.record.excerpt,f.row.excerpt);
    const url=new URL(packet.record.route,'http://localhost');
    assert.equal(url.searchParams.get('owner'),owner);assert.equal(url.searchParams.get('idea'),f.row.id);
    assert.doesNotMatch(JSON.stringify(packet),/CLIENT OVERRIDE|fake/);
    assert.equal(packet.source.book,undefined);assert.equal(packet.source.prefix,undefined);assert.equal(packet.source.method,undefined);
    const other=prepareIdeaHandoff({...f.request,ideaId:f.page.rows[1].id},f.page);
    assert.notEqual(other.source.ideaId,packet.source.ideaId);assert.equal(other.record.classification,'acceptance-check');
});

test('current owner lookup rejects stale document or changed exact entry and does not publish',async t=>{
    const f=await fixture(t);
    await writeFile(join(f.root,owner),document+'\nUnrelated later wording.\n');
    await assert.rejects(saveIdeaHandoff(f.directory,f.root,f.request),error=>error.status===409);
    await writeFile(join(f.root,owner),document.replace('Return a borrowed tool','Return a different tool'));
    const current=readOwnerIdeas(f.root,owner);
    await assert.rejects(saveIdeaHandoff(f.directory,f.root,{...f.request,documentHash:current.documentHash}),error=>error.status===404);
    await assert.rejects(readdir(f.directory),{code:'ENOENT'});
});

test('public owner admission and required bounded proposal fields cannot be replaced by client metadata',async t=>{
    const f=await fixture(t);
    await mkdir(join(f.root,'docs','private'));await writeFile(join(f.root,'docs','private','backlog.md'),document);
    await writeFile(join(f.root,'docs','unlisted.md'),document);
    for(const reference of ['docs/private/backlog.md','docs/unlisted.md','../docs/MECHANISM_BACKLOG.md'])
        await assert.rejects(saveIdeaHandoff(f.directory,f.root,{...f.request,ownerReference:reference}));
    for(const change of ['', ' ', 'x'.repeat(501)])assert.throws(()=>prepareIdeaHandoff({...f.request,change},f.page),/gameplay change/);
    assert.throws(()=>prepareIdeaHandoff({...f.request,check:' '},f.page),/playable check/);
    assert.throws(()=>prepareIdeaHandoff({...f.request,documentHash:'0'.repeat(64)},f.page),/changed/);
    assert.throws(()=>prepareIdeaHandoff(f.request,{...f.page,rows:[{...f.row,citable:false}]}),/changed/);
});

test('concurrent retries share immutable storage and coexist with an unchanged reading packet',async t=>{
    const f=await fixture(t),saved=await Promise.all([saveIdeaHandoff(f.directory,f.root,f.request),saveIdeaHandoff(f.directory,f.root,f.request)]);
    assert.equal(saved[0].id,saved[1].id);
    const path=join(f.directory,saved[0].id+'.json'),bytes=await readFile(path);
    assert.equal(createHash('sha256').update(bytes).digest('hex'),saved[0].id);
    assert.deepEqual(await readdir(f.directory),[saved[0].id+'.json']);
    const original={schema:'atlas-reading-handoff/1',stage:'proposed',proposal:{backlog:null,change:'Original reading proposal',check:'Original consumer'},source:{book:'x1',prefix:'xc1'},record:{label:'Existing reading',type:'rule',route:'#world/x/things/a'}};
    const originalId=await saveHandoff(f.directory,original),originalBytes=await readFile(join(f.directory,originalId+'.json'));
    const queue=await readHandoffs(f.directory);
    assert.equal(queue.unreadable,0);assert.equal(queue.entries.length,2);
    assert.deepEqual(await readFile(join(f.directory,originalId+'.json')),originalBytes);
    assert.deepEqual(queue.entries.find(e=>e.id===originalId),{id:originalId,...original});
});

test('an idea proposal uses existing immutable implementation and native proof sidecars',async t=>{
    const f=await fixture(t),proposal=await saveIdeaHandoff(f.directory,f.root,f.request);
    await writeFile(join(f.root,'src','borrow.js'),'export const borrow=true;\n');
    await writeFile(join(f.root,'docs','RECEIPT.md'),'A named fixture used the actual consumer.\n');
    const report=await attachImplementationReport(f.directory,f.root,proposal.id,{consumerName:'Borrowed tool return',consumerPath:'src/borrow.js',playerRoute:'Visit the lender and return the tool.',receiptPath:'docs/RECEIPT.md'});
    assert.equal(report.proposalId,proposal.id);
    const queue=await readHandoffs(f.directory,{root:f.root});
    assert.equal(queue.entries[0].implementationReports[0].id,report.id);
    assert.equal(queue.entries[0].implementationReports[0].files.consumer.status,'unchanged');
    await writeFile(join(f.root,'docs','native-proof.json'),JSON.stringify({bundleSha256:'a'.repeat(64),
        viewport:{width:1920,height:1080},route:'Synthetic protocol fixture; no real gameplay claimed',setup:'Synthetic attachment fixture'}));
    const attached=await attachNativePlaytest(f.directory,f.root,proposal.id,report.id,{proofPath:'docs/native-proof.json'});
    const refreshed=await readHandoffs(f.directory,{root:f.root});
    assert.equal(refreshed.entries[0].implementationReports[0].playtests[0].id,attached.id);
    const proposalBytes=await readFile(join(f.directory,proposal.id+'.json'));
    assert.equal(createHash('sha256').update(proposalBytes).digest('hex'),proposal.id);
});
