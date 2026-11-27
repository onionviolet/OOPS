import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, readFile, readdir, rm, symlink, unlink, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {prepareHandoff, readHandoffs, saveHandoff, attachImplementationReport, attachNativePlaytest, compareNativePlaytest, compareQueuePlaytests, attachProposalQualification} from '../prototypes/world-atlas/reading-handoffs.mjs';
import {createHash} from 'node:crypto';
import {compareHandoffSource} from '../prototypes/world-atlas/reading-reference-bundle.mjs';

const record = {key:'entry',label:'A hospital visit',type:'scene',href:'#world/w/reader-scenes/visit',
    fileLines:[[4,5]],fileLocators:['en b1 c2 p3']};
const page = {key:'w1',world:'w',prefix:'w1c002',pass:'scenes',kind:'scenes',offset:0,records:[record],inspected:true,contentHash:'version'};
test('a saved proposal can distinguish file drift from an unavailable or unconfirmed source', () => {
    const saved = {source:{book:page.key,prefix:page.prefix,pass:page.pass,kind:page.kind,contentHash:'version',fileLines:[[4,5]]},
        record:{route:record.href}};
    assert.equal(compareHandoffSource(saved,page),'matched');
    assert.equal(compareHandoffSource(saved,{...page,contentHash:'edited'}),'changed');
    assert.equal(compareHandoffSource(saved,{...page,records:[{...record,fileLines:[[7,8]]}]}),'unmatched');
    assert.equal(compareHandoffSource(saved,{...page,inspected:false}),'unavailable');
});
const request = {recordKey:'entry', recordRoute:record.href, fileLines:record.fileLines, contentHash:'version',backlog:'W1',change:'Offer the patient a visit.',check:'Return another day.'};

test('handoffs preserve the admitted version and a playable proposal separately', () => {
    assert.throws(() => prepareHandoff({...request,contentHash:'previous'},page), /changed/);
    assert.throws(() => prepareHandoff({...request,recordKey:'missing'},page), /changed/);
    assert.throws(() => prepareHandoff({...request,recordRoute:'#world/w/things/other'},page), /changed/);
    assert.throws(() => prepareHandoff({...request,fileLines:[[6,7]]},page), /changed/);
    assert.throws(() => prepareHandoff({...request,check:' '},page), /playable check/);
    const packet = prepareHandoff({...request,stage:'verified',label:'source override'},page);
    assert.equal(packet.stage,'proposed');
    assert.equal(packet.record.label,record.label);
    assert.deepEqual(packet.source.fileLines,record.fileLines);
});

test('retry and concurrent saves publish one complete file; bad files are reported separately', async t => {
    const dir = await mkdtemp(join(tmpdir(),'atlas-reading-handoffs-'));
    t.after(() => rm(dir,{recursive:true,force:true}));
    const packet = prepareHandoff(request,page);
    const ids = await Promise.all([saveHandoff(dir,packet),saveHandoff(dir,packet)]);
    assert.equal(ids[0],ids[1]);
    assert.deepEqual(await readdir(dir),[ids[0]+'.json']);
    await writeFile(join(dir,'0'.repeat(64)+'.json'),'{}');
    const {entries,unreadable} = await readHandoffs(dir);
    assert.equal(unreadable,1);
    assert.deepEqual(entries,[{id:ids[0],...packet}]);
});

const implementation = {consumerName:'Visit follow-up',consumerPath:'src/visit.js',
    playerRoute:'Visit the office, speak with the visitor, then return the next day.',receiptPath:'docs/receipts/visit.md'};
async function workspace(t) {
    const root = await mkdtemp(join(tmpdir(),'atlas-handoff-workspace-'));
    t.after(() => rm(root,{recursive:true,force:true}));
    await mkdir(join(root,'src'),{recursive:true});
    await mkdir(join(root,'docs','receipts'),{recursive:true});
    await writeFile(join(root,'src','visit.js'),'export const visit = true;\n');
    await writeFile(join(root,'docs','receipts','visit.md'),'# Local implementation receipt\n');
    const directory = join(root,'work','handoffs'), packet = prepareHandoff(request,page);
    const id = await saveHandoff(directory,packet);
    return {root,directory,id,packet};
}

test('explicit qualifications attach idempotent forward/back links without changing original packets or review states',async t=>{
    const {root,directory,id:earlier,packet}=await workspace(t);
    const later=await saveHandoff(directory,{...packet,proposal:{...packet.proposal,change:'A later source qualifies the earlier choice.'}});
    const original=await Promise.all([earlier,later].map(id=>readFile(join(directory,id+'.json'))));
    const request={earlierProposalId:earlier,qualification:'The later evidence qualifies one earlier promise.',evidencePath:'docs/receipts/visit.md'};
    const [a,b]=await Promise.all([attachProposalQualification(directory,root,later,request),attachProposalQualification(directory,root,later,request)]);
    assert.equal(a.id,b.id);assert.deepEqual(await readdir(join(directory,'proposal-qualifications')),[a.id+'.json']);
    let queue=await readHandoffs(directory,{root}),newer=queue.entries.find(e=>e.id===later),older=queue.entries.find(e=>e.id===earlier);
    assert.equal(newer.qualifiesEarlier[0].earlierProposalId,earlier);assert.equal(older.qualifiedByLater[0].laterProposalId,later);
    assert.equal(newer.qualifiesEarlier[0].files.evidence.status,'unchanged');assert.equal(newer.stage,'proposed');assert.equal(older.stage,'proposed');
    assert.deepEqual(await Promise.all([earlier,later].map(id=>readFile(join(directory,id+'.json')))),original);
    await writeFile(join(root,'docs/receipts/visit.md'),'Changed public evidence');
    queue=await readHandoffs(directory,{root});assert.equal(queue.entries.find(e=>e.id===later).qualifiesEarlier[0].files.evidence.status,'changed');
    await unlink(join(root,'docs/receipts/visit.md'));
    queue=await readHandoffs(directory,{root});assert.equal(queue.entries.find(e=>e.id===earlier).qualifiedByLater[0].files.evidence.status,'unavailable');
});

test('qualification bindings reject unknown/self/private/traversal/URL inputs and omit unrecognized sidecar fields',async t=>{
    const {root,directory,id,packet}=await workspace(t),later=await saveHandoff(directory,{...packet,stage:'later-proposal'});
    const request={earlierProposalId:id,qualification:'A bounded qualification.',evidencePath:'docs/receipts/visit.md'};
    await assert.rejects(attachProposalQualification(directory,root,id,request),/different/);
    await assert.rejects(attachProposalQualification(directory,root,later,{...request,earlierProposalId:'a'.repeat(64)}));
    await assert.rejects(attachProposalQualification(directory,root,later,{...request,earlierProposalId:'https://example.com'}));
    for(const evidencePath of ['docs/private/evidence.md','docs/../src/visit.js','https://example.com/proof','docs/sealed.md'])
        await assert.rejects(attachProposalQualification(directory,root,later,{...request,evidencePath}),/public/);
    await assert.rejects(attachProposalQualification(directory,root,later,{...request,qualification:' '}));
    await assert.rejects(attachProposalQualification(directory,root,later,{...request,accepted:true}));
    const relation={schema:'atlas-proposal-qualification/1',laterProposalId:later,earlierProposalId:id,qualification:request.qualification,
        evidence:{path:request.evidencePath,resolvedPath:request.evidencePath,sha256:createHash('sha256').update(await readFile(join(root,request.evidencePath))).digest('hex')},privateExtra:'DO NOT PROJECT'};
    await saveHandoff(join(directory,'proposal-qualifications'),relation);
    assert.doesNotMatch(JSON.stringify(await readHandoffs(directory,{root})),/DO NOT PROJECT|privateExtra/);
    await writeFile(join(directory, id+'.json'),'{}');
    const broken=await readHandoffs(directory,{root});assert.equal(broken.unreadableQualifications,1);
    assert.equal(broken.entries.find(e=>e.id===later).qualifiesEarlier,undefined);
});

test('implementation reports are idempotent separate records; the immutable proposal is never promoted', async t => {
    const {root,directory,id,packet} = await workspace(t);
    const before = await readFile(join(directory,id+'.json'));
    const results = await Promise.all([implementation,{...implementation,consumerPath:'src\\visit.js'}].map(input =>
        attachImplementationReport(directory,root,id,{...input,stage:'verified',release:'published'})));
    assert.equal(results[0].id,results[1].id);
    assert.equal(results[0].status,'implementation-report-attached');
    assert.deepEqual(await readFile(join(directory,id+'.json')),before);
    const {entries} = await readHandoffs(directory,{root});
    const entry = entries[0], [report] = entry.implementationReports;
    assert.equal(entry.stage,'proposed');
    assert.deepEqual(entry.proposal,packet.proposal);
    assert.equal(entry.implementationReports.length,1);
    assert.equal(report.proposalId,id);
    assert.equal(report.consumer.path,'src/visit.js');
    assert.match(report.consumer.sha256,/^[a-f0-9]{64}$/);
    assert.equal(report.playerRoute,implementation.playerRoute);
    assert.deepEqual(report.files,{consumer:{status:'unchanged'},receipt:{status:'unchanged'}});
    assert.equal(report.stage,undefined); assert.equal(report.release,undefined);
    const other = await saveHandoff(directory,{...packet,proposal:{...packet.proposal,change:'A different proposal.'}});
    assert.equal((await readHandoffs(directory,{root})).entries.find(e=>e.id===other).implementationReports,undefined);
});

test('later file bytes drift or disappear without changing the saved implementation statement', async t => {
    const {root,directory,id} = await workspace(t);
    const saved = await attachImplementationReport(directory,root,id,implementation);
    const reportFile = join(directory,'implementation-reports',saved.id+'.json');
    const bytes = await readFile(reportFile);
    await writeFile(join(root,'src','visit.js'),'export const visit = false;\n');
    let report = (await readHandoffs(directory,{root})).entries[0].implementationReports[0];
    assert.equal(report.files.consumer.status,'changed');
    assert.equal(report.files.receipt.status,'unchanged');
    await unlink(join(root,'docs','receipts','visit.md'));
    report = (await readHandoffs(directory,{root})).entries[0].implementationReports[0];
    assert.equal(report.files.receipt.status,'unavailable');
    assert.deepEqual(await readFile(reportFile),bytes);
});

test('registration refuses traversal, external paths, private or sealed files and absent receipts', async t => {
    const {root,directory,id} = await workspace(t);
    for (const consumerPath of ['../src/visit.js','/src/visit.js','C:\\src\\visit.js','src/../docs/receipts/visit.md',
        'src/private/visit.js','src/visit.sealed.js','src/.hidden/visit.js','src/visit.js:stream','src/visit.js?raw']) {
        await assert.rejects(attachImplementationReport(directory,root,id,{...implementation,consumerPath}));
    }
    for (const receiptPath of ['docs/private/visit.md','docs/receipts/SEALED_VISIT.md','src/visit.js','docs/absent.md'])
        await assert.rejects(attachImplementationReport(directory,root,id,{...implementation,receiptPath}));
    await assert.rejects(attachImplementationReport(directory,root,'0'.repeat(64),implementation));
    assert.equal((await readHandoffs(directory,{root})).entries[0].implementationReports,undefined);
});

test('realpath boundaries reject links outside the workspace and into private or wrong-area files', async t => {
    const {root,directory,id} = await workspace(t);
    const outside = await mkdtemp(join(tmpdir(),'atlas-handoff-outside-'));
    t.after(() => rm(outside,{recursive:true,force:true}));
    await writeFile(join(outside,'visit.js'),'outside');
    await symlink(outside,join(root,'src','outside'),'junction');
    await assert.rejects(attachImplementationReport(directory,root,id,{...implementation,consumerPath:'src/outside/visit.js'}));
    await mkdir(join(root,'src','private'));
    await writeFile(join(root,'src','private','visit.js'),'private');
    await symlink(join(root,'src','private'),join(root,'src','alias'),'junction');
    await assert.rejects(attachImplementationReport(directory,root,id,{...implementation,consumerPath:'src/alias/visit.js'}));
    await symlink(join(root,'docs','receipts'),join(root,'src','docs'),'junction');
    await assert.rejects(attachImplementationReport(directory,root,id,{...implementation,consumerPath:'src/docs/visit.md'}));
});

test('a retargeted public link is drift even when the replacement bytes are identical', async t => {
    const {root,directory,id} = await workspace(t);
    for (const name of ['one','two']) {
        await mkdir(join(root,'src',name));
        await writeFile(join(root,'src',name,'visit.js'),'same bytes');
    }
    await symlink(join(root,'src','one'),join(root,'src','alias'),'junction');
    await attachImplementationReport(directory,root,id,{...implementation,consumerPath:'src/alias/visit.js'});
    await unlink(join(root,'src','alias'));
    await symlink(join(root,'src','two'),join(root,'src','alias'),'junction');
    const report = (await readHandoffs(directory,{root})).entries[0].implementationReports[0];
    assert.equal(report.files.consumer.status,'changed');
    await mkdir(join(root,'src','private'));
    await writeFile(join(root,'src','private','visit.js'),'withheld bytes');
    await unlink(join(root,'src','alias'));
    await symlink(join(root,'src','private'),join(root,'src','alias'),'junction');
    const unavailable = (await readHandoffs(directory,{root})).entries[0].implementationReports[0];
    assert.equal(unavailable.files.consumer.status,'unavailable');
    assert.equal(unavailable.consumer.resolvedPath,'src/one/visit.js','readback keeps the admitted public path');
    assert.doesNotMatch(JSON.stringify(unavailable),/private|withheld bytes/);
});

test('damaged report bytes are counted separately and do not poison legacy proposals', async t => {
    const {root,directory,id} = await workspace(t);
    const report = await attachImplementationReport(directory,root,id,implementation);
    await writeFile(join(directory,'implementation-reports',report.id+'.json'),'{}');
    const result = await readHandoffs(directory,{root});
    assert.equal(result.unreadable,0);
    assert.equal(result.unreadableReports,1);
    assert.equal(result.entries[0].stage,'proposed');
    assert.equal(result.entries[0].implementationReports,undefined);
});

const sha = value => createHash('sha256').update(value).digest('hex');
async function nativeWorkspace(t) {
    const w = await workspace(t),report = await attachImplementationReport(w.directory,w.root,w.id,implementation);
    await mkdir(join(w.root,'dist'));
    await writeFile(join(w.root,'dist','bundle.js'),'tested game');
    const proofPath='docs/receipts/native.json';
    const proof={bundleHash:sha('tested game'),viewport:'1920x1080',route:'Named prerequisite fixture; ordinary borrow and return controls.',
        rawText:'not projected',checks:['not projected'],state:'not a release claim'};
    await writeFile(join(w.root,proofPath),JSON.stringify(proof));
    return {...w,reportId:report.id,proofPath,proof};
}

test('native playtest attachments are idempotent, strictly projected and do not rewrite older reports',async t=>{
    const w=await nativeWorkspace(t),{directory,root,id,reportId,proofPath}=w;
    const reportFile=join(directory,'implementation-reports',reportId+'.json'),before=await readFile(reportFile);
    const attached=await Promise.all([proofPath,proofPath.replaceAll('/','\\')].map(path=>attachNativePlaytest(directory,root,id,reportId,{proofPath:path})));
    assert.equal(attached[0].id,attached[1].id);
    assert.deepEqual(await readFile(reportFile),before);
    const report=(await readHandoffs(directory,{root})).entries[0].implementationReports[0];
    assert.equal(report.playtests.length,1);
    const [proof]=report.playtests;assert.equal(proof.files.proof.status,'unchanged');
    assert.equal(proof.testedBundleSha256,w.proof.bundleHash);assert.equal(proof.entry.route,w.proof.route);
    assert.deepEqual(proof.entry.viewport,{width:1920,height:1080});
    assert.equal(proof.proof.sha256,sha(JSON.stringify(w.proof)));
    assert.doesNotMatch(JSON.stringify(proof),/rawText|not projected|release claim/);
    const match=await compareNativePlaytest(directory,root,id,reportId,proof.id);
    assert.equal(match.status,'exact-match');
    const queue = () => compareQueuePlaytests(directory,root);
    assert.deepEqual(await queue(),{bundleSha256:w.proof.bundleHash,unreadable:0,entries:[{id,exact:1,other:0,unverified:0}]});
    await writeFile(join(root,'dist','bundle.js'),'a later game build');
    const different=await compareNativePlaytest(directory,root,id,reportId,proof.id);
    assert.equal(different.status,'different-build');assert.equal(different.testedBundleSha256,w.proof.bundleHash);
    assert.equal((await queue()).entries[0].other,1);
    assert.doesNotMatch(JSON.stringify(different),/absent|not implemented/);
    await unlink(join(root,'dist','bundle.js'));
    assert.equal((await compareNativePlaytest(directory,root,id,reportId,proof.id)).unavailable,'bundle');
    assert.deepEqual(await queue(),{bundleSha256:null,unreadable:0,entries:[{id,exact:0,other:0,unverified:1}]});
    await writeFile(join(root,'dist','bundle.js'),'a later game build');
    await writeFile(join(root,proofPath),JSON.stringify({...w.proof,route:'Changed receipt route'}));
    assert.equal((await compareNativePlaytest(directory,root,id,reportId,proof.id)).status,'changed-proof');
    assert.equal((await queue()).entries[0].unverified,1);
    await unlink(join(root,proofPath));
    const missing=await compareNativePlaytest(directory,root,id,reportId,proof.id);
    assert.equal(missing.status,'unavailable');assert.equal(missing.unavailable,'proof');
});

test('native receipt admission requires recognized hash, viewport and independent route scope',async t=>{
    const w=await nativeWorkspace(t),{directory,root,id,reportId,proofPath}=w;
    for(const invalid of [null,[],{bundle:{sha256:w.proof.bundleHash}},
        {...w.proof,bundleHash:'not a digest'},{...w.proof,bundleSha256:'0'.repeat(64)},
        {...w.proof,viewport:null},{...w.proof,route:''},{...w.proof,setup:{fixture:'unrecognized shape'}},
        {...w.proof,proposalId:'0'.repeat(64)}]) {
        await writeFile(join(root,proofPath),JSON.stringify(invalid));
        await assert.rejects(attachNativePlaytest(directory,root,id,reportId,{proofPath}));
    }
    await writeFile(join(root,proofPath),JSON.stringify({bundleSha256:w.proof.bundleHash,
        viewport:{width:1920,height:1080},route:'Normal entry',setup:'Earned ordinary steps, no fixture'}));
    const attached=await attachNativePlaytest(directory,root,id,reportId,{proofPath});
    const result=await compareNativePlaytest(directory,root,id,reportId,attached.id);
    assert.equal(result.entry.route,'Normal entry');assert.equal(result.entry.setup,'Earned ordinary steps, no fixture');
    assert.equal(result.status,'exact-match');
    await assert.rejects(attachNativePlaytest(directory,root,id,reportId,{proofPath,testedBundleSha256:'0'.repeat(64)}));
    await assert.rejects(compareNativePlaytest(directory,root,id,'0'.repeat(64),attached.id));
});

test('native attachments preserve public path boundaries, report binding and damaged-sidecar accounting',async t=>{
    const {directory,root,id,reportId,proofPath,proof}=await nativeWorkspace(t);
    for(const path of ['../docs/receipts/native.json','src/visit.js','docs/private/proof.json','docs/receipts/native.json?raw',
        'docs/receipts/native.json:stream','C:/proof.json','docs/receipts/visit.md','docs/absent.json'])
        await assert.rejects(attachNativePlaytest(directory,root,id,reportId,{proofPath:path}));
    const other=await saveHandoff(directory,{...prepareHandoff(request,page),proposal:{change:'Other',check:'Other',backlog:null}});
    await assert.rejects(attachNativePlaytest(directory,root,other,reportId,{proofPath}));
    const privateDir=join(root,'docs','private');await mkdir(privateDir);await writeFile(join(privateDir,'proof.json'),JSON.stringify(proof));
    await symlink(privateDir,join(root,'docs','public-alias'),'junction');
    await assert.rejects(attachNativePlaytest(directory,root,id,reportId,{proofPath:'docs/public-alias/proof.json'}));
    const attached=await attachNativePlaytest(directory,root,id,reportId,{proofPath});
    await writeFile(join(directory,'playtest-attachments',attached.id+'.json'),'{}');
    const list=await readHandoffs(directory,{root});
    assert.equal(list.unreadablePlaytests,1);assert.equal(list.entries[0].implementationReports[0].playtests,undefined);
    assert.equal(list.entries[0].implementationReports[0].files.consumer.status,'unchanged');
});
