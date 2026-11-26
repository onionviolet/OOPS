import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,mkdtempSync,writeFileSync,utimesSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {indexedChapterSpans,definingParagraph,checkCampaignClaim,historicalChainFrontier,campaignSequencing,testedLocalSegment,linkTestedSegment} from '../prototypes/world-atlas/campaign-sequencing.mjs';
import {CAMPAIGN_TRACKS} from '../prototypes/world-atlas/campaign-sequencing-tracks.mjs';
test('index spans keep language/book separation, gaps and privacy without implying continuity',()=>{
 const out=indexedChapterSpans({scenes:[{locator:'en b1 c2 p1',locators:['en b1 c7 p2','en b2 c3 p1']},{locator:'zh 第130章 p2'},{locator:'en b1 c999 p1',sealed:['S']}],rules:[{sources:[{locator:'en b1 c2 p1'},{locator:'en b1 c888 p1',private:true}]}]});
 assert.deepEqual(out,[{language:'en',book:1,first:2,last:7,observed:2},{language:'en',book:2,first:3,last:3,observed:1},{language:'zh',book:0,first:130,last:130,observed:1}]);
});
test('recovered first-party historical chain validates continuity without asserting current replay',()=>{
 const audit=JSON.parse(readFileSync(new URL('../docs/representations/evidence/lotm-earned-frontier-2026-11-25/historical-chain.json',import.meta.url)));
 const result=historicalChainFrontier(audit);assert.equal(result.status,'historical-chain-validated');assert.equal(result.endpoint.chapter,163);assert.equal(result.endpoint.paragraph,82);assert.equal(result.episode,'kj3bh');assert.equal(result.episodes,8);assert.match(result.statement,/not current-build/);
 const broken=structuredClone(audit);broken.episodes[1].fixtureSha256='0'.repeat(64);assert.equal(historicalChainFrontier(broken).status,'unknown');
 const incomplete=structuredClone(audit);incomplete.episodes[2].persistence=false;assert.equal(historicalChainFrontier(incomplete).status,'unknown');
 assert.equal(historicalChainFrontier({episodes:[]}).status,'unknown');
});
test('owner heading and table row isolate defining evidence from parallel updates',()=>{
 const text='# First\n\n| Route | result |\n| Klein | stable |\n| Other | old |\n\n# Second\n\n| Klein | different |';
 assert.equal(definingParagraph(text,'| Klein |','First'),'| Klein | stable |');
 assert.equal(definingParagraph(text.replace('Other | old','Other | new'),'| Klein |','First'),'| Klein | stable |');
 assert.equal(definingParagraph(text,'| Klein |','Missing'),null);
});
test('defining evidence ignores unrelated append but drift, duplicates and missing owner yield unknown',()=>{
 const paragraph='A reviewed route reaches a bounded endpoint. Fixture mechanics stay separate.';
 const claim={label:'Connected',statement:'Reviewed bounded endpoint',reviewedAt:'2026-11-25',evidence:{path:'docs/owner.md',heading:'Current route',marker:'A reviewed route',sha256:createHash('sha256').update(paragraph).digest('hex')}};
 const source='# Current route\n\n'+paragraph;
 assert.equal(checkCampaignClaim(claim,()=>source+'\n\n## Other work\n\nUnrelated append.').status,'owner-evidence-matches');
 assert.equal(checkCampaignClaim(claim,()=>source.replace('bounded','changed')).status,'unknown');
 assert.equal(checkCampaignClaim(claim,()=>source+'\n\n'+paragraph).status,'unknown');
 assert.equal(checkCampaignClaim(claim,()=>{throw Error('private path');}).status,'unknown');
 assert.equal(definingParagraph(source,'A reviewed route'),paragraph);
 assert.equal(checkCampaignClaim(claim,()=>source.replace('bounded','changed')).statement,undefined,'stale endpoint must not remain presented as current');
});
test('selected digest metadata refreshes cached spans and missing input stays unknown',t=>{
 const directory=mkdtempSync(join(tmpdir(),'campaign-index-'));t.after(()=>rmSync(directory,{recursive:true,force:true}));
 const track={world:'w',protagonist:'Test',connected:[],mechanics:[]},options={root:directory,readers:directory};
 assert.equal(campaignSequencing(track,options).indexed.status,'unavailable');
 const file=join(directory,'w.json');writeFileSync(file,JSON.stringify({world:'w',shards:1,scenes:[{locator:'en b1 c2 p1',detail:'PRIVATE VALUE'}]}));
 assert.equal(campaignSequencing(track,options).indexed.spans[0].last,2);
 writeFileSync(file,JSON.stringify({world:'w',shards:1,scenes:[{locator:'en b1 c9 p1',detail:'PRIVATE VALUE'}]}));utimesSync(file,new Date(),new Date(Date.now()+2000));
 const result=campaignSequencing(track,options);assert.equal(result.indexed.spans[0].last,9);assert.doesNotMatch(JSON.stringify(result),/PRIVATE VALUE/);
});
test('durable local segment binds served hashes and remains distinct from a later rebuild',()=>{
 const base=new URL('../docs/representations/evidence/lotm-earned-frontier-2026-11-25/',import.meta.url),scope=JSON.parse(readFileSync(new URL('current-full-bb-scope.json',base))),bytes=readFileSync(new URL('current-full-bb.json',base));
 const expected={episode:'KJ3BB',actions:21,entryLabel:'original earned BA checkpoint',proofPath:scope.proof.path};
 const result=testedLocalSegment(scope,bytes,'2026-11-25',expected);assert.equal(result.status,'tested-local-segment');assert.equal(result.testedBundleSha256,scope.actualServedHashes[0]);assert.match(result.statement,/not uninterrupted play from the opening/);assert.match(result.note,/later rebuild/);
 const unrelated={...scope,laterRebuiltBundleSha256:'a'.repeat(64)};assert.equal(testedLocalSegment(unrelated,bytes,'2026-11-25',expected).status,'tested-local-segment');
 const wrong=structuredClone(scope);wrong.actualServedHashes[0]='0'.repeat(64);assert.equal(testedLocalSegment(wrong,bytes,'2026-11-25',expected).status,'unknown');
 assert.equal(testedLocalSegment(scope,Buffer.from('{}'),'2026-11-25',expected).status,'unknown');
 const missing=structuredClone(scope);missing.nativeExportImport=false;assert.equal(testedLocalSegment(missing,bytes,'2026-11-25',expected).status,'unknown');
 assert.equal(testedLocalSegment(scope,bytes,'2026-11-25',{...expected,entryLabel:undefined}).status,'unknown');
});
test('local checkpoint links preserve separate tested builds and reject an unproven predecessor',()=>{
 const prior={status:'tested-local-segment',episode:'KJ3BB',terminalCheckpointSha256:'earned',testedBundleSha256:'earlier'};
 const next={status:'tested-local-segment',episode:'KJ3BC',entryCheckpointSha256:'earned',entryEarnedOnBundleSha256:'earlier',testedBundleSha256:'later',note:'Tested segment.'};
 const linked=linkTestedSegment(next,prior);assert.equal(linked.status,'tested-local-segment');assert.equal(linked.followsEpisode,'KJ3BB');assert.match(linked.note,/different builds/);assert.equal(linked.testedBundleSha256,'later');
 assert.equal(linkTestedSegment({...next,entryCheckpointSha256:'wrong'},prior).status,'unknown');assert.equal(linkTestedSegment(next,null).status,'unknown');
 const unverified={status:'unknown',note:'Receipt bytes changed.'};assert.equal(linkTestedSegment(unverified,prior),unverified);
});
test('bounded BB and BC list verifies both durable receipts and their exact earned cross-build link',()=>{
 const track=CAMPAIGN_TRACKS.find(t=>t.world==='lotm'),tested=new Map();assert.deepEqual(track.localSegments.map(s=>s.episode),['KJ3BB','KJ3BC']);
 for(const entry of track.localSegments){const scope=JSON.parse(readFileSync(new URL('../'+entry.scopePath,import.meta.url))),bytes=readFileSync(new URL('../'+entry.proofPath,import.meta.url));
  let result=testedLocalSegment(scope,bytes,track.reviewedAt,entry);if(entry.follows)result=linkTestedSegment(result,tested.get(entry.follows));assert.equal(result.status,'tested-local-segment');tested.set(entry.episode,result);}
 const bb=tested.get('KJ3BB'),bc=tested.get('KJ3BC');assert.equal(bc.entryCheckpointSha256,bb.terminalCheckpointSha256);assert.equal(bc.entryEarnedOnBundleSha256,bb.testedBundleSha256);assert.notEqual(bc.testedBundleSha256,bb.testedBundleSha256);assert.equal(bc.followsEpisode,'KJ3BB');
 assert.equal(linkTestedSegment({...bc,entryEarnedOnBundleSha256:'wrong'},bb).status,'unknown');
});
