// Static source/JSON reconciliation only. No source-rule helper is invoked.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const base = 'docs/gm/feature-wave/features/book-world-subtleties';
const out = `${base}/source-reconciliation`;
const authority = 'docs/gm/world-implementation/IMPLEMENTATION_PLAN.md';
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const json = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const fileRecord = p => fs.existsSync(p) ? {path:p, sha256:hash(p), bytes:fs.statSync(p).size} : {path:p, missing:true};
const groups = {
    cultivation: {module:'src/feature_expansion_book_cultivation.js', coverages:[`${base}/cultivation/COVERAGE.json`], integration:`${base}/cultivation/INTEGRATION.json`, receipt:`${base}/cultivation/DELIVERY.json`},
    recognition: {module:'src/feature_expansion_book_recognition.js', coverages:['mother-of-learning','lord-of-mysteries','circle-of-inevitability','shadow-slave'].map(id=>`${base}/recognition/${id}/COVERAGE.json`), integration:`${base}/recognition/INTEGRATION.md`, receipt:`${base}/recognition/DELIVERY.json`},
    situated: {module:'src/feature_expansion_book_situated.js', coverages:[`${base}/situated/COVERAGE.json`], integration:`${base}/situated/INTEGRATION.json`, receipt:`${base}/situated/DELIVERY.json`},
    roster: {module:'src/feature_expansion_book_roster.js', coverages:[`${base}/roster/COVERAGE.json`], integration:`${base}/roster/INTEGRATION.md`, receipt:`${base}/roster/DELIVERY.json`}
};
const capturedAt = new Date().toISOString();
const snapshots = {};
for (const [group,g] of Object.entries(groups)) {
    const before = hash(g.module);
    const module = await import(path.resolve(g.module));
    const after = hash(g.module);
    const receipt = fs.existsSync(g.receipt) ? json(g.receipt) : null;
    const expected = receipt?.sha256 ?? (Array.isArray(receipt?.files)
        ? Object.fromEntries(receipt.files.map(f=>[f.path,f.sha256])) : receipt?.files ?? {});
    const receiptMismatches = Object.entries(expected).flatMap(([p,digest])=>
        !fs.existsSync(p) || hash(p)!==digest ? [{path:p, expected:digest, actual:fs.existsSync(p)?hash(p):null}] : []);
    const receiptCoversCore = [g.module,...g.coverages,g.integration].every(p=>typeof expected[p]==='string');
    const released = group==='cultivation' || receipt?.released===true ||
        /released/i.test(`${receipt?.status ?? ''} ${JSON.stringify(receipt?.release ?? '')}`);
    const provisional = !receipt || !released || !receiptCoversCore || receiptMismatches.length>0 || before!==after;
    snapshots[group] = {module, coverages:g.coverages.filter(fs.existsSync).map(json), public:{
        group, module:fileRecord(g.module), exports:Object.keys(module), coverageFiles:g.coverages.map(fileRecord),
        integration:fileRecord(g.integration), receipt:fileRecord(g.receipt),
        receiptStatus:receipt?.status ?? 'absent', releaseDeclared:released,
        releaseEvidence:group==='cultivation'?'Prior completed cultivation return explicitly released this writer scope.':g.receipt,
        receiptCoversCore, receiptMismatches, sourceSnapshotStable:before===after,
        disposition:provisional?'provisional-final-receipt-or-snapshot-gap':'released-hash-matched-snapshot'
    }};
}

// Labels/ordinal/line are copied from the canonical table. The table contains no
// machine ID column; these IDs reconcile the existing module aliases explicitly.
const canonicalIds = {
    'Original Frontier':'original-frontier', 'Reincarnation Paradise':'reincarnation-paradise',
    'Fated Villain':'fated-villain', 'Reverend Insanity':'reverend-insanity',
    'Shadow Slave':'shadow-slave', "Regressor's Tale":'regressors-tale',
    'Omniscient Reader':'omniscient-reader', 'Labyrinth of the Mad God':'labyrinth-mad-god',
    'Mother of Learning':'mother-of-learning', 'Lord of the Mysteries':'lord-of-mysteries',
    'Circle of Inevitability':'circle-of-inevitability', 'Worm':'worm',
    'Legendary Mechanic':'legendary-mechanic', 'Skyrim':'skyrim', 'Fallout 4':'fallout4',
    'Elden Ring':'elden-ring', 'Naruto':'naruto', 'Bleach':'bleach', 'Harry Potter':'harry-potter'
};
const lines = fs.readFileSync(authority,'utf8').split('\n');
let inTable=false;
const roster=[];
for(let i=0;i<lines.length;i++) {
    if(lines[i].startsWith('## Proposed world roster and local identity')) inTable=true;
    else if(inTable && lines[i].startsWith('## ')) inTable=false;
    if(!inTable || !lines[i].startsWith('| ')) continue;
    const cells=lines[i].split('|').slice(1,-1).map(x=>x.trim());
    if(!Object.hasOwn(canonicalIds,cells[0])) continue;
    const ownerRefs=[...cells[3].matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map(match=>({
        label:match[1],path:path.normalize(path.join(path.dirname(authority),match[2]))
    }));
    roster.push({canonicalRowId:canonicalIds[cells[0]],canonicalLabel:cells[0],ordinal:roster.length+1,
        authority:{path:authority,heading:'Proposed world roster and local identity',line:i+1,tableRowLabel:cells[0],ownerReferences:ownerRefs},
        canonicalCampaign:cells[1],canonicalEntryPossibilities:cells[2]});
}
if(roster.length!==19) throw Error(`Canonical table changed: expected19rows, found${roster.length}`);

const candidates=[];
const add=(group,canonicalId,data)=>candidates.push({group,canonicalId,...data});
const cv=snapshots.cultivation.module;
for(const [id,p] of Object.entries(cv.cultivationBookProfiles)) add('cultivation',id,{
    profileId:p.id,sourceAliases:{getterArgument:id,worldId:p.worldId,sourceLanes:[id]},
    api:{profileExport:'cultivationBookProfiles',getter:'getCultivationBookProfile(worldId)',getterArgument:id,
        ruleExports:['evaluateCultivationBookRule(worldId,ruleId,snapshot)'],sceneExport:'cultivationBookSceneSpecs',sourcePinExport:'cultivationBookSourcePins'},
    source:{editions:[p.edition],citations:p.evidence,memberPins:cv.cultivationBookSourcePins[id]},
    era:{sourceWindows:p.context.eras,entryScope:'Only declared ordinary-local/qualified-outsider snapshots.',actualBranchId:p.context.actualBranch,proposedBranchId:p.context.proposedBranchId,branchCause:p.context.originalBranchCause},
    topology:p.topology,deepChain:p.deepChain,rules:p.rules,replacement:p.replacementExceptions,
    localInteractions:p.interactions,originalScenes:cv.cultivationBookSceneSpecs.filter(s=>s.worldId===id),
    unknowns:p.unknowns,native:{actualDirectWorldConsumer:null,existingConsumers:[],bindings:p.bindingNeeds,
        disposition:'unactivated-source-world/profile; source-compatible original scene specifications only'}
});
const rc=snapshots.recognition.module;
for(const p of rc.BOOK_RECOGNITION_PROFILES) add('recognition',p.id,{
    profileId:p.id,sourceAliases:{getterArgument:p.id,sourceLanes:[p.id]},
    api:{profileExport:'BOOK_RECOGNITION_PROFILES',getter:'getBookRecognitionProfile(id)',getterArgument:p.id,
        ruleExports:['recognizeBookWorld(profileId,input)','bookRecognitionSceneView(profileId,input)'],sceneExport:'BOOK_RECOGNITION_SCENE'},
    source:{editions:[p.source],citations:Object.values(p.evidenceIndex)},
    era:{sourceWindows:[p.era],actualBranchId:null,proposedBranchDescription:p.era.branch},
    topology:p.topologyDisposition,deepChain:p.deepChainDisposition,rules:p.rules,replacement:p.replacementAndContinuity,
    localInteractions:p.smallInteractions,originalScenes:[rc.BOOK_RECOGNITION_SCENE],
    unknowns:p.unknowns,native:{actualDirectWorldConsumer:null,existingConsumers:[],bindings:p.missingNativeBindings,
        disposition:p.nativeWorldStatus,profileNativeBound:p.nativeBound,
        originalComparison:'Shared original Village reference desk targets the parent relay scene. This comparison is not four source-world instances.'}
});
const st=snapshots.situated.module;
const situatedAliases={'book.omniscient_reader':'omniscient-reader','book.worm':'worm','book.legendary_mechanic':'legendary-mechanic','book.labyrinth_mad_god':'labyrinth-mad-god'};
for(const p of st.SITUATED_BOOK_PROFILES) {
    const coverage=snapshots.situated.coverages[0].rows.find(r=>r.worldId===p.id);
    add('situated',situatedAliases[p.id],{
        profileId:p.id,sourceAliases:{getterArgument:p.id,worldId:p.id,sourceLanes:p.sourceEditions.map(e=>e.lane)},
        api:{profileExport:'SITUATED_BOOK_PROFILES',getter:'getSituatedBookProfile(id)',getterArgument:p.id,
            ruleExports:['evaluateSituatedBookRule(worldId,ruleId,context)','evaluateSituatedRecognition(worldId,context)','situatedBookProjection(worldId,context)'],
            topologyGetter:'getSituatedBookTopology(worldId)',chainGetter:'getSituatedBookChain(chainId)',sceneGetter:'getSituatedBookScene(id)',sceneExport:'SITUATED_BOOK_SCENES'},
        source:{editions:p.sourceEditions,citations:p.evidence,reviewedExtentAuthority:coverage.reviewedExtentAuthority},
        era:{sourceWindows:st.SITUATED_BOOK_SCENES.filter(s=>s.worldId===p.id).map(s=>({eraId:s.eraId,place:s.place,entry:s.entry,branch:s.branch})),actualBranchId:null},
        topology:st.SITUATED_BOOK_TOPOLOGIES.find(t=>t.worldId===p.id),deepChain:st.SITUATED_BOOK_CHAINS.find(c=>c.worldId===p.id),
        rules:st.SITUATED_BOOK_RULES.filter(r=>!r.worldId||r.worldId===p.id),replacement:p.replacement,localInteractions:p.smallInteractions,
        originalScenes:st.SITUATED_BOOK_SCENES.filter(s=>s.worldId===p.id),unknowns:p.unknowns,
        native:{actualDirectWorldConsumer:null,existingConsumers:coverage.actualCurrentConsumers,bindings:coverage.requiredNativeJoins,
            gap:p.nativeBindingGap,disposition:'unactivated-source-world/profile; original source-qualified local scene specifications only'}
    });
}
const ro=snapshots.roster.module;
for(const p of ro.bookRosterProfiles) add('roster',p.id,{
    profileId:p.id,sourceAliases:{getterArgument:p.id,nativeWorldId:p.nativeWorldId,sourceLanes:p.id==='reincarnation-paradise'?['paradise-depth']:[p.id]},
    api:{profileExport:'bookRosterProfiles',getter:'getBookRosterProfile(profileId)',getterArgument:p.id,
        ruleExports:['evaluateBookRosterRule(profileId,ruleId,input)','evaluateBookRosterRecognition(profileId,observerRuleId,input)',
            ...(p.id==='original-frontier'?['evaluateOriginalFrontierOfficeReplacement(snapshot)']:[])],
        topologyExport:'bookRosterTopologyProfiles',chainExport:'bookRosterDeepChains',sceneExport:'bookRosterScenes'},
    source:{editions:[p.source],citations:p.sourceRefs},
    era:{sourceWindows:[p.baseline],actualBranchId:null,profileNativeWorldId:p.nativeWorldId},
    topology:p.topology,deepChain:p.deepChain,rules:p.rules,replacement:p.replacement,localInteractions:p.smallInteractions,
    originalScenes:ro.bookRosterScenes.filter(s=>s.profileId===p.id||s.worldId===p.id),unknowns:p.sourceGaps,
    native:{actualDirectWorldConsumer:p.id==='original-frontier'?'Existing original native Frontier; new source-profile consumer null':null,
        existingConsumers:p.binding.actualExistingConsumers,newProfileConsumer:p.binding.newProfileConsumer,gap:p.binding.gap,
        disposition:p.id==='original-frontier'?'existing-original-campaign; new profile/scenes inert':'unactivated-direct-world/reference-profile',status:p.status}
});

const rows=roster.map(canonical=>{
    const matches=candidates.filter(c=>c.canonicalId===canonical.canonicalRowId);
    if(matches.length!==1) return {...canonical,matchCount:matches.length,fieldGaps:['exactly-one-profile-match']};
    const p=matches[0],g=snapshots[p.group].public;
    const fieldGaps=[];
    for(const key of ['source','era','topology','deepChain','api','native']) if(!p[key]) fieldGaps.push(key);
    if(!p.source.citations?.length) fieldGaps.push('source-citations');
    if(!p.deepChain?.phases?.length) fieldGaps.push('deep-chain-phases');
    if(!p.originalScenes.length) fieldGaps.push('original-scene-specification');
    return {...canonical,profileId:p.profileId,workerGroup:p.group,workerReceiptStatus:g.disposition,
        modulePath:g.module.path,moduleSha256:g.module.sha256,coverageFiles:g.coverageFiles,integrationFile:g.integration,
        sourceAliases:p.sourceAliases,api:p.api,source:p.source,era:p.era,topology:p.topology,deepChain:p.deepChain,
        rules:p.rules,replacement:p.replacement,localInteractions:p.localInteractions,originalScenes:p.originalScenes,
        unknowns:p.unknowns,native:p.native,fieldGaps,
        adaptationBoundary:'A frozen/importable profile or original comparison is not a completed direct adaptation. Native activation/build/playable acceptance requires its actual parent-owned receipt.'};
});
const refs=[];
const collect=(v)=>{
    if(!v||typeof v!=='object') return;
    for(const [k,x] of Object.entries(v)) {
        if(typeof x==='string' && ['path','file','owner','notesPath','coveragePath'].includes(k) && /^(docs|src|PROJECT\.md|AGENTS\.md)/.test(x)) refs.push(x);
        else if(typeof x==='object') collect(x);
    }
};
rows.forEach(collect);
const referenceRecords=[...new Set(refs)].sort().map(fileRecord);
const duplicateCanonicalIds=Object.keys(canonicalIds).map(label=>canonicalIds[label]).filter((id,i,a)=>a.indexOf(id)!==i);
const missingRows=rows.filter(r=>r.matchCount===0).map(r=>r.canonicalRowId);
const duplicateMatches=rows.filter(r=>r.matchCount>1).map(r=>({id:r.canonicalRowId,count:r.matchCount}));
const unclaimedProfiles=candidates.filter(p=>!rows.some(r=>r.canonicalRowId===p.canonicalId)).map(p=>p.profileId);
const result={schema:1,capturedAt,writer:'/root/cultivation_subtleties',scope:'Only source-reconciliation directory; source/profile/research owners read-only.',
    canonicalAuthority:{...fileRecord(authority),rowCount:19,machineIdPolicy:'Canonical table labels/ordinals are verbatim. Table has no machine-ID column; canonicalRowId explicitly reconciles existing module aliases, and is not claimed printed in that table.'},
    releaseSnapshots:Object.values(snapshots).map(s=>s.public),rows,
    parentRuntimeSeparation:{owner:'Features sole shared integrator',relay:'Parent-owned original relay office; assembly does not attest its registration or playable acceptance.',
        nestedCampaign:'Parent-owned Paradise-derived hub plus two original destinations; these are not a completed Reincarnation Paradise direct adapter or all-world launch.',
        missingDefault:'Absent source/profile data remains inert; actual carrier/mission/clock/persistence commits belong to native owners.'},
    readback:{rowCount:rows.length,profileCount:candidates.length,workerCounts:Object.fromEntries(Object.keys(groups).map(g=>[g,candidates.filter(p=>p.group===g).length])),
        provisionalRows:rows.filter(r=>r.workerReceiptStatus!=='released-hash-matched-snapshot').map(r=>r.canonicalRowId),
        missingRows,duplicateCanonicalIds,duplicateMatches,unclaimedProfiles,
        fieldGaps:rows.filter(r=>r.fieldGaps.length).map(r=>({rowId:r.canonicalRowId,gaps:r.fieldGaps})),
        missingSourceReferenceFiles:referenceRecords.filter(r=>r.missing),
        intentionalSharing:['Labyrinth volumes1/2 occupy one canonical setting row with two exact edition/source endings.', 'LOTM first novel and COI remain distinct rows/eras.', 'Recognition reference desk is one original shared comparison spec, not four world scenes.', 'Literal recognition rule ID is reused across three cultivation profiles; composite worldId/ruleId remains distinct.']},
    sourceReferenceFiles:referenceRecords,
    allowedChecks:'Static ESM exports/imports, JSON/source record/path/hash review only. No source-rule/helper/gameplay invocation, book rereading, browser/save/reload/failure/keyboard/regression/director checks.'};
fs.writeFileSync(`${out}/ASSEMBLED_ROWS.json`,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result.readback));
