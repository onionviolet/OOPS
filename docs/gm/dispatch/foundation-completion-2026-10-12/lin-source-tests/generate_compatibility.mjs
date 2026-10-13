// Controlled cursor compatibility only. Native envelope and paid history remain
// byte-equivalent JSON values; no gameplay planner or durable native action runs.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {Story} from 'inkjs';
import {loadExpansionState} from '../../../../../src/expansion_engine.js';
import {expeditionRegistry as registry} from '../../../../../src/expedition_content.js';
import {validateInkNarrative,INK_RUNTIME_VERSION} from '../../../../../src/ink_narrative.js';
import {createNestedInkHost,inkObserverVariables} from '../../../../../src/ink_scene_content.js';
import {previewNestedCommand,commitNestedCommand} from '../../../../../src/feature_expansion_nested_host.js';
import {previewNestedLifeCommand,commitNestedLifeCommand} from '../../../../../src/feature_expansion_nested_life.js';
import {validateNestedEnvelope} from '../../../../../src/feature_expansion_nested_native.js';
const input=process.argv[2]||'/tmp/yairpg-lin-natural-pre-ink.json';
const sourceBytes=fs.readFileSync(input),base=JSON.parse(sourceBytes),baseState=loadExpansionState(base.expansion,registry);
assert.deepEqual(baseState,base.expansion);assert.equal(base.expansion.inkNarrative,undefined);validateNestedEnvelope(base);
const hash=value=>crypto.createHash('sha256').update(typeof value==='string'||Buffer.isBuffer(value)?value:JSON.stringify(value)).digest('hex');
const withoutInk=envelope=>{const next=structuredClone(envelope);delete next.expansion.inkNarrative;return next;};
const gameplay=Object.fromEntries(Object.entries(base.inventories.person).map(([id,items])=>[id==='main_character'?'player':id,{inventory:Object.fromEntries(Object.entries(items).map(([key,value])=>[key,value.count])),skills:{},reputation:{}}]));
// Only observer disclosure is read; no fabricated health/body material enters
// the save. Browser must provide its real native context for later acceptance.
const context={actorId:'player',worldId:baseState.actors.player.worldId,external:{money:base.character.money},gameplay,nativeAlive:baseState.simulation.people.player.life==='alive',facts:{location:base['current location']},nestedNative:{bound:true,revision:base.nested_campaign_native.revision,body:{id:'native.player.body',form:'human'}}};
const host=createNestedInkHost({state:baseState,registry,context,sceneId:'nested.hub',previewNative:previewNestedCommand,commitNative:commitNestedCommand,previewLife:previewNestedLifeCommand,commitLife:commitNestedLifeCommand});
const receipt={kind:'controlled_cursor_fixtures_from_natural_native_envelope',input,sourceSha256:hash(sourceBytes),nativeDomainSha256:hash(withoutInk(base)),sequence:baseState.sequence,clock:baseState.clock,nativeRevision:baseState.nestedCampaign.nativeRevision,resources:baseState.actors.player.resources,characterMoney:base.character.money,playerInventory:base.inventories.person.main_character,linInventory:base.inventories.person['nested.hub.employee'],originalCampaignReceipts:baseState.nestedCampaign.receipts,fixtures:[]};
for(const revision of [1,2,3]){
 const artifactPath=`docs/gm/feature-wave/ink/content/feature_wave_v${revision}.json`,artifact=JSON.parse(fs.readFileSync(artifactPath)),story=new Story(artifact);story.state.storySeed=1;story.state.previousRandom=0;
 const observed=revision===3?host.observe(baseState,context):{sceneId:'tidemark.negotiation'};
 for(const [key,value] of Object.entries(inkObserverVariables(observed)))if(story.variablesState[key]!=null)story.variablesState[key]=value;
 const paragraphs=[];while(story.canContinue){const line=story.Continue().trim();if(line)paragraphs.push(line);}
 const record={schema:1,contentId:artifact.yairpgInk.storyId,contentRevision:revision,contentHash:artifact.yairpgInk.contentHash,runtimeVersion:INK_RUNTIME_VERSION,inkFormat:21,saveFormat:10,sceneId:revision===3?'nested.hub':'tidemark.negotiation',sessionId:`ink:${baseState.sequence}`,revision:1,status:story.currentChoices.length?'active':'complete',startedAt:baseState.clock,updatedAt:baseState.clock,cursor:story.state.ToJson(),frame:{paragraphs,choices:story.currentChoices.map(c=>({id:c.tags.find(t=>t.startsWith('response:')).slice('response:'.length).trim(),label:c.text.trim()}))},receipts:[],...(revision===3?{scope:structuredClone(host.scope)}:{})};
 const envelope=structuredClone(base);envelope.expansion.inkNarrative=revision===3?{schema:2,scopes:[record]}:record;
 validateInkNarrative(envelope.expansion);assert.deepEqual(loadExpansionState(envelope.expansion,registry),envelope.expansion);validateNestedEnvelope(envelope);assert.deepEqual(withoutInk(envelope),base);
 const path=`/tmp/yairpg-lin-compat-v${revision}.json`;fs.writeFileSync(path,JSON.stringify(envelope));fs.chmodSync(path,0o600);
 receipt.fixtures.push({path,revision,wrapper:envelope.expansion.inkNarrative.schema,sha256:hash(fs.readFileSync(path)),contentHash:record.contentHash,sceneId:record.sceneId,scope:record.scope||null,choices:record.frame.choices.map(c=>c.id),receipts:record.receipts,nativeDomainSha256:hash(withoutInk(envelope)),validation:'full actual expansion reader and nested native envelope accepted; all non-Ink JSON values preserved'});
 if(revision===3){const missing=structuredClone(envelope);missing.expansion.inkNarrative.scopes[0].contentHash='sha256:'+'0'.repeat(64);const missingPath='/tmp/yairpg-lin-compat-missing-artifact.json';fs.writeFileSync(missingPath,JSON.stringify(missing));fs.chmodSync(missingPath,0o600);let rejection;try{loadExpansionState(missing.expansion,registry);}catch(error){rejection=error.message;}assert.match(rejection,/retained compiled content/);receipt.fixtures.push({path:missingPath,negative:true,rejection,nativeDomainSha256:hash(withoutInk(missing))});}
}
fs.writeFileSync('docs/gm/dispatch/foundation-completion-2026-10-12/lin-source-tests/COMPATIBILITY_GENERATION.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt.fixtures.map(({path,revision,negative,validation,rejection})=>({path,revision,negative,validation,rejection})),null,2));
