import test from 'node:test';
import assert from 'node:assert/strict';
import {generate,DEFAULT_WORLD} from '../scripts/lotm_slice/gen-runner.mjs';
import {NativeContinuation} from '../scripts/playtest/native-continuation.mjs';
import {buildCastPack,DEFAULT_PLACE_PREFIX,DEFAULT_DISTRICTS} from '../scripts/lead_run/build_cast_pack.mjs';
import {buildCrosswalk} from '../scripts/lead_run/build_crosswalk.mjs';
const review=p=>({acts:[{id:p+'zoo.wake',costs:[],effects:[{type:'fact',scope:'actor',actor:'player',key:p+'zoo.woke',value:true}]},{id:p+'zoo.snake',costs:[],effects:[{type:'knowledge',actor:'player',key:p+'zoo.snake.seen'}]}]});
const opts={sliceDir:'x',origin:'o.json'};
const body=src=>src.split('\n').slice(1).join('\n'); // line 1 names the generator script path
test('gen-runner: explicit LOTM world equals the defaults; HP fixture carries no lotm string',()=>{
  const lotm=review('book.lotm.t.');
  assert.equal(generate(lotm,opts),generate(lotm,{...opts,world:DEFAULT_WORLD}));
  assert.equal(generate(lotm,{...opts,world:{pack:null}}),generate(lotm,opts)); // unset CLI flags fall back
  assert.match(generate(lotm,opts),/new NativeContinuation\(session\)/);
  const hp=generate(review('book.hp.lead.'),{...opts,world:{pack:'private_packs/hp-cast/cast.json',idPrefix:'book.hp.lead.',panel:'hp',attrPrefix:'hp'}});
  assert.doesNotMatch(body(hp),/lotm/i);
  assert.match(hp,/private_packs\/hp-cast\/cast\.json/);
  assert.match(hp,/new NativeContinuation\(session,\{"panel":"hp","attrPrefix":"hp"\}\)/);
  assert.throws(()=>generate(review('book.hp.lead.'),opts),/world id prefix/);
});
test('native-continuation: selectors follow panel and attribute prefix, LOTM by default',async()=>{
  const seen=[];
  const page={locator:q=>{seen.push(q);return {waitFor:async()=>{},click:async()=>{},getAttribute:async a=>{seen.push(a);return 'a1';},isDisabled:async()=>false,innerText:async()=>'',first(){return this;},selectOption:async()=>{}};},
    evaluate:async(fn,arg)=>arg===undefined&&fn.toString().includes('snapshot')?{}:{arc:{next:{id:'a1'}}}};
  for(const [opt,panel,attr] of [[{},'lotm','lotm'],[{panel:'hp',attrPrefix:'hp'},'hp','hp']]){
    seen.length=0;const r=new NativeContinuation({page},opt);assert.equal(r.panelId,panel);
    await r.panel();await r.startCurrent();
    assert.ok(seen.includes(`[data-${attr}-arc]`));assert.ok(seen.includes(`[data-${attr}-task-link]`));
    assert.ok(seen.includes(`data-${attr}-task-link`));assert.ok(seen.includes(`[data-${attr}="a1"]`));
    if(attr==='hp')assert.ok(!seen.some(q=>/lotm/.test(q)));
  }
});
const loc='en b1 c1 p1',slice={from:loc,to:'en b1 c2 p999'};
function placeFixture(book,pp,district){
  const registry=[{id:pp+'cupboard',kind:'place',label:'Cupboard',firstMention:loc},{id:pp+'house',kind:'place',label:'Number Four',firstMention:loc},{id:pp+district,kind:'place',label:'Home district',firstMention:loc}];
  const scenes=[{beat:'s',pov:'lead',locator:loc,place:pp+'cupboard',present:[]}];
  const extras=[{extra:'places',id:pp+'cupboard',locator:loc,label:'S',within:pp+'house'},{extra:'places',id:pp+'house',locator:loc,label:'S',within:pp+district},{extra:'places',id:pp+district,locator:loc,label:'S'}];
  // buildCrosswalk accepts only lotm or mol today (open seam); a non-LOTM world supplies the minimal crosswalk shape itself.
  const crosswalk=book==='lotm'?buildCrosswalk({registry,scenes,extras,['wor'+'ld']:book,slice}).crosswalk:{['wor'+'ld']:book,slice,mapping:{},places:{},entities:{}};
  return {book,slice,registry,scenes,extras,crosswalk,base:{schema:'x/1',revision:'f.1',people:[],references:[],places:[]}};
}
test('build_cast_pack: place prefix and districts route through the world input',()=>{
  const lotm=placeFixture('lotm','lotm.place.','evernight');
  assert.equal(JSON.stringify(buildCastPack(lotm)),JSON.stringify(buildCastPack({...lotm,placePrefix:DEFAULT_PLACE_PREFIX,districts:DEFAULT_DISTRICTS})));
  assert.equal(buildCastPack(lotm).pack.places.find(p=>p.indexId==='lotm.place.house').district,'evernight');
  const pp='book.hp.lead.place.',hp=placeFixture('book.hp.lead',pp,'privet-drive');
  const {pack}=buildCastPack({...hp,placePrefix:pp,districts:['privet-drive']});
  assert.equal(pack.places.find(p=>p.indexId===pp+'cupboard').district,'privet-drive');
  assert.equal(pack.places.find(p=>p.indexId===pp+'cupboard').travel.district,'privet-drive');
  assert.doesNotMatch(JSON.stringify(pack),/lotm|evernight/i);
});
