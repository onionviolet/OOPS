// Public evidence metadata, never a campaign engine or source-text reader.
import {readFileSync,statSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {parseLocator} from '../../scripts/lead_run/world_profiles.mjs';
import {publicLifeRow} from './texture-life.mjs';
import {boundedCache} from './bounded-cache.mjs';
const sha=value=>createHash('sha256').update(value).digest('hex');
const spans=boundedCache({maxEntries:2,maxWeight:128*1024,ttlMs:3600000});
const array=value=>Array.isArray(value)?value:[];

export function indexedChapterSpans(digest){
 const groups=new Map();
 const observe=value=>{const loc=parseLocator(value);if(!loc)return;const key=loc.lang+':'+loc.book;
  if(!groups.has(key))groups.set(key,{language:loc.lang,book:loc.book,chapters:new Set()});groups.get(key).chapters.add(loc.ch);};
 for(const family of ['entities','rules','scenes','life','notes'])for(const row of array(digest?.[family])){
  if(!publicLifeRow(row))continue;
  for(const value of [row.locator,typeof row.first==='string'?row.first:null,...array(row.locators)])observe(value);
  for(const source of array(row.sources))if(publicLifeRow(source))observe(source.locator);
 }
 return [...groups.values()].map(g=>({language:g.language,book:g.book,first:Math.min(...g.chapters),last:Math.max(...g.chapters),observed:g.chapters.size}))
  .sort((a,b)=>a.language.localeCompare(b.language)||a.book-b.book);
}

// Fingerprint the defining paragraph, not unrelated appended owner text.
export function definingParagraph(text,marker,heading){
 text=String(text).replace(/\r\n/g,'\n');
 if(heading){const lines=text.split('\n'),heads=lines.flatMap((line,i)=>{const m=/^(#{1,6})\s+(.+?)\s*$/.exec(line);return m?[{i,level:m[1].length,title:m[2]}]:[];});
  const selected=heads.filter(h=>h.title===heading);if(selected.length!==1)return null;const start=selected[0],end=heads.find(h=>h.i>start.i&&h.level<=start.level)?.i??lines.length;text=lines.slice(start.i+1,end).join('\n');}
 const matchingLines=text.split('\n').filter(line=>line.includes(marker));
 if(matchingLines.length===1&&matchingLines[0].trim().startsWith('|'))return matchingLines[0].trim();
 const paragraphs=text.split(/\n\s*\n/).map(p=>p.trim());
 const matches=paragraphs.filter(p=>p.includes(marker));return matches.length===1?matches[0]:null;
}
export function checkCampaignClaim(claim,readOwner){
 const inputs=Array.isArray(claim.evidence)?claim.evidence:[claim.evidence],evidence=inputs.map(e=>({path:e.path,heading:e.heading}));
 try{
  if(!inputs.every(e=>{const paragraph=definingParagraph(readOwner(e.path),e.marker,e.heading);return paragraph&&sha(paragraph)===e.sha256;}))return {label:claim.label,status:'unknown',note:'Defining owner evidence changed or could not be identified. Review the source before using this endpoint.',evidence};
  return {label:claim.label,status:'owner-evidence-matches',statement:claim.statement,reviewedAt:claim.reviewedAt,evidence,
   ...(claim.href?{href:claim.href}:{})};
 }catch{return {label:claim.label,status:'unknown',note:'Owner evidence is unavailable.',evidence};}
}
export function historicalChainFrontier(audit){
 const episodes=array(audit?.episodes),hash=/^[a-f0-9]{64}$/;
 const unknown=()=>({label:'Recovered historical chain',status:'unknown',note:'Compact historical chain is incomplete or inconsistent; no endpoint inferred.'});
 if(!episodes.length||episodes[0].episode!=='kj3ba')return unknown();
 let previous=null,last=null;const bundles=new Set(),differences=[];
 for(const [i,row]of episodes.entries()){
  const range=/^official English v(\d+) ch(\d+) P(\d+)–(?:ch(\d+) )?P(\d+)$/.exec(row.sourceRange||'');
  if(!range||row.episode!=='kj3b'+String.fromCharCode(97+i)||!['sourceSha256','receiptSha256','reviewSha256','saveSha256','bundleSha256','packSha256','fixtureSha256'].every(key=>hash.test(row[key])))return unknown();
  const start={book:+range[1],chapter:+range[2],paragraph:+range[3]},end={book:+range[1],chapter:+(range[4]||range[2]),paragraph:+range[5]};
  if(!Number.isSafeInteger(row.clock)||row.clock<0||!Number.isSafeInteger(row.steps)||row.steps<=0||row.persistence!==true||row.pageErrors!==0||row.viewport!=='1920x1080'||row.receiptOrderMatchesReview!==true||row.allSavedStepsCompleted!==true||row.lastClockMatchesSave!==true||start.book<1||start.chapter<1||start.paragraph<1||end.paragraph<1||end.chapter<start.chapter||end.chapter===start.chapter&&end.paragraph<start.paragraph)return unknown();
  if(previous&&(row.fixtureSha256!==previous.row.saveSha256||row.fixtureMatchesPriorSave!==true||row.sourceSha256!==previous.row.sourceSha256||row.clock<previous.row.clock||start.book!==previous.end.book||!(start.chapter===previous.end.chapter+1&&start.paragraph===1||start.chapter===previous.end.chapter&&start.paragraph===previous.end.paragraph+1)))return unknown();
  bundles.add(row.bundleSha256);if(row.currentPackActsMatchReview===false)differences.push(row.episode);
  previous={row,end};last={row,end};
 }
 return {label:'Recovered historical connected route',status:'historical-chain-validated',episodes:episodes.length,endpoint:last.end,episode:last.row.episode,saveSha256:last.row.saveSha256,clock:last.row.clock,bundles:[...bundles],recordedReviewDifferences:differences,
  statement:`Recovered historical BA→${last.row.episode.toUpperCase().replace('KJ3','')} receipt/save segment reaches official English v${last.end.book} chapter ${last.end.chapter} P${String(last.end.paragraph).padStart(3,'0')} (${last.row.episode.toUpperCase()}). ${episodes.length} linked episodes record completed steps, persistence and zero page errors. This is historical evidence, not current-build end-to-end replay.`,
  note:'Hash continuity and completion flags were checked in the compact first-party audit; underlying private runs were not rerun.'};
}
export function testedLocalSegment(scope,proofBytes,reviewedAt,expected){
 const unknown=()=>({label:'Tested local segment',status:'unknown',note:'Local-segment scope, served identity or durable receipt could not be confirmed.'});
 try{
  const proof=JSON.parse(proofBytes),segment=scope.testedSegment,hash=/^[a-f0-9]{64}$/;
  if(!expected||typeof expected.entryLabel!=='string'||!expected.entryLabel.trim()||!Number.isSafeInteger(expected.actions)||expected.actions<1||scope.schema!=='lotm-earned-segment-proof/1'||scope.status!=='agent-verified-not-human-reviewed'||scope.proof?.path!==expected.proofPath||scope.proof.sha256!==sha(proofBytes)||!hash.test(scope.testedBundleSha256)||proof.bundle!==scope.testedBundleSha256||!hash.test(scope.entry?.sha256)||!hash.test(scope.terminal?.newCurrentCheckpointSha256))return unknown();
  const served=hashes=>Array.isArray(hashes)&&hashes.length>0&&hashes.every(value=>value===scope.testedBundleSha256);
  if(!served(scope.actualServedHashes)||!served(proof.servedBundleSha256)||!Array.isArray(proof.steps)||proof.steps.length!==segment.actions||segment.actions!==expected.actions||segment.episode!==expected.episode||new Set(proof.steps.map(row=>row.id)).size!==segment.actions)return unknown();
  if(!proof.steps.every(row=>row.id?.startsWith('book.lotm.'+expected.episode.toLowerCase()+'.')&&Number.isSafeInteger(row.clock))||proof.steps.at(-1).id!==scope.terminal?.lastAction||proof.steps.at(-1).clock!==scope.terminal.clock||proof.fixture!==scope.entry?.sha256||proof.pack!==scope.candidatePackSha256)return unknown();
  if(proof.persistence!==true||scope.pendingSaveReload!==true||scope.finalSaveReload!==true||scope.nativeExportImport!==true||scope.defaultDiskGuardPassed!==true||scope.originalInputUnchanged!==true||proof.pageErrors!==0||scope.pageErrors!==0||proof.viewport!=='1920x1080'||scope.viewport!=='1920x1080')return unknown();
  if(!['officialEnglishVolume','fromChapter','fromParagraph','toChapter','toParagraph'].every(key=>Number.isSafeInteger(segment[key])&&segment[key]>0))return unknown();
  return {label:'Tested local '+segment.episode+' segment · '+reviewedAt,status:'tested-local-segment',reviewedAt,episode:segment.episode,testedBundleSha256:scope.testedBundleSha256,entryCheckpointSha256:scope.entry.sha256,terminalCheckpointSha256:scope.terminal.newCurrentCheckpointSha256,
   ...(scope.entry.earnedOnBundleSha256?{entryEarnedOnBundleSha256:scope.entry.earnedOnBundleSha256}:{}),
   statement:`All ${segment.actions} ${segment.episode} actions, official English v${segment.officialEnglishVolume} chapter ${segment.fromChapter} P${String(segment.fromParagraph).padStart(3,'0')}–chapter ${segment.toChapter} P${String(segment.toParagraph).padStart(3,'0')}, were tested from the ${expected.entryLabel} on served bundle ${scope.testedBundleSha256.slice(0,16)}. Pending/final Save and reload plus native Export/Import passed. This is one earned continuation segment, not uninterrupted play from the opening.`,
   note:'This result remains evidence for its tested served bytes. A later rebuild has a different identity and is not covered by this receipt.'+(scope.literalFilePickerImport===false?' Literal file-picker import was not tested.':'')};
 }catch{return unknown();}
}
export function linkTestedSegment(result,prior){
 if(result.status!=='tested-local-segment')return result;
 if(prior?.status!=='tested-local-segment'||result.entryCheckpointSha256!==prior.terminalCheckpointSha256||result.entryEarnedOnBundleSha256!==prior.testedBundleSha256)return {label:result.label,status:'unknown',note:'The expected prior tested checkpoint and its earned-build identity could not be linked to this local segment.'};
 return {...result,followsEpisode:prior.episode,note:result.note+` Entry matches the terminal checkpoint from tested local ${prior.episode}. `+(result.testedBundleSha256!==prior.testedBundleSha256?'These local segments were tested on different builds; their checkpoint link does not establish one current-build replay from the opening.':'This checkpoint link does not establish a replay from the opening.')};
}
export function campaignSequencing(track,{root,readers,snapshot}){
 const owners=new Map(),readOwner=path=>{if(!owners.has(path))owners.set(path,readFileSync(join(root,path),'utf8'));return owners.get(path);};
 let indexed={status:'unavailable',spans:[],note:'No admitted reader digest is available for this world.'};
 try{
  const file=join(readers,track.world+'.json'),s=statSync(file),key=file+':'+s.size+':'+s.mtimeMs+':'+s.ctimeMs;
  indexed=spans.get(key);
  if(!indexed){const bytes=readFileSync(file),digest=JSON.parse(bytes);if(digest.world!==track.world)throw Error();
   indexed={status:'indexed',spans:indexedChapterSpans(digest),indexedSlices:Number.isSafeInteger(digest.shards)?digest.shards:null,digestSha256:sha(bytes),
    note:'Observed chapter locators in the admitted index, with language/book labels as stored. The span does not establish continuous reading, every source fact, edition alignment, or connected gameplay.'};spans.set(key,indexed,JSON.stringify(indexed).length*2);}
 }catch{}
 const connected=track.connected.map(claim=>checkCampaignClaim(claim,readOwner));
 if(track.historicalChain){const evidence=[{path:track.historicalChain,heading:'Recovered historical receipt/save chain'},...(track.historicalOwner?[{path:track.historicalOwner,heading:'Recovered historical frontier'}]:[])];
  try{const bytes=readFileSync(join(root,track.historicalChain));connected.unshift({...historicalChainFrontier(JSON.parse(bytes)),evidence,reviewedAt:track.reviewedAt,auditSha256:sha(bytes)});}catch{connected.unshift({label:'Recovered historical chain',status:'unknown',note:'Historical audit is unavailable.',evidence});}}
 const tested=new Map();
 for(const segment of track.localSegments||[]){const {scopePath,proofPath}=segment,evidence=[{path:scopePath,heading:'Explicit tested segment and served identity'},{path:proofPath,heading:'Durable native receipt'}];
  try{const scope=JSON.parse(readFileSync(join(root,scopePath),'utf8')),bytes=readFileSync(join(root,proofPath));let result=testedLocalSegment(scope,bytes,track.reviewedAt,segment);
   if(segment.follows)result=linkTestedSegment(result,tested.get(segment.follows));tested.set(segment.episode,result);connected.push({...result,evidence});}
  catch{connected.push({label:'Tested local segment',status:'unknown',note:'Local-segment evidence is unavailable.',evidence});}}
 return {world:track.world,protagonist:track.protagonist,indexed,snapshot:{builtAt:snapshot?.builtAt||null,commit:snapshot?.commit||null},
  currentReplay:'No reviewed current-build uninterrupted end-to-end replay is registered in this view. Historical route receipts and independent mechanic proofs retain their own scope.',
  connected,
  mechanics:track.mechanics.map(claim=>checkCampaignClaim(claim,readOwner)),
  readingHref:'#world/'+track.world+'/reading',workbenchHref:'#workbench/handoffs'};
}
