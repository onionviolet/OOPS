import test from 'node:test';
import assert from 'node:assert/strict';
import {HP_LEAD_MAKING,HP_LEAD_MAKING_KEYS as K,hpLeadMakingCommands as cmds,hpLeadMakingItems,hpPotionsIssueEffects,} from '../src/hp_lead_making.js';
import {defineCastMaking} from '../src/cast_making_adapter.js';
import {validateItemKey} from '../src/inventory_key.js';

const by=id=>cmds.find(c=>c.id===id);
const make='book.hp.lead.make.cure_boils',early='book.hp.lead.make.cure_boils_quills_early';
const bind={worldId:'book.hp.lead.world',group:'structured_local',situationId:'book.hp.lead.situation'};

test('pack defines and yields a make and a use command per row',()=>{
 assert.deepEqual(cmds.map(c=>c.id),[make,`${make}.use`,early,`${early}.use`]);
 for(const k of Object.values(K))validateItemKey(k);
});
test('make commands consume exactly the ingredients and produce their own flask',()=>{
 for(const [id,flask] of [[make,K.cure],[early,K.corrosive]]){
  const c=by(id),cost=Object.fromEntries(c.costs.map(x=>[x.key,x.amount]));
  assert.deepEqual(cost,{[K.nettles]:-2,[K.fangs]:-1,[K.slugs]:-1,[K.quills]:-1});
  assert.ok(c.effects.some(e=>e.type==='item'&&e.key===flask&&e.amount===1));
  assert.equal(c.making.productKey,flask);
 }
});
test('use commands spend the flask and set the flask fact',()=>{
 const fact=(id)=>by(id).effects.find(e=>e.type==='fact');
 assert.equal(fact(`${make}.use`).value,'cure');assert.equal(fact(`${early}.use`).value,'corrosive');
 assert.equal(by(`${make}.use`).costs[0].key,K.cure);assert.equal(by(`${early}.use`).costs[0].key,K.corrosive);
});
test('quills early gives a different product, caused by the law and not by authored outputs',()=>{
 const a=by(make).making,b=by(early).making;
 assert.notEqual(a.productId,b.productId);
 assert.equal(a.law,b.law);
 assert.deepEqual(HP_LEAD_MAKING.rows[0].inputs,HP_LEAD_MAKING.rows[1].inputs);
 assert.ok(!JSON.stringify(HP_LEAD_MAKING.rows).includes('"outputs"'),'rows author no outputs; the law resolves them');
});
test('resolved outputs: written steps keep the cure, quills on the fire burn it',async()=>{
 const {defineCatalogue}=await import('../src/craft_materials.js');
 const {defineCraftLaw,resolveBatch}=await import('../src/craft_resolver.js');
 const cat=defineCatalogue(HP_LEAD_MAKING.catalogue),law=defineCraftLaw({...HP_LEAD_MAKING.laws[0],catalogue:cat});
 const inp=HP_LEAD_MAKING.rows[0].inputs.map(({material,qty})=>({material:cat.materials[material],qty}));
 const ok=resolveBatch(law,{inputs:inp,process:HP_LEAD_MAKING.rows[0].process}).product;
 const bad=resolveBatch(law,{inputs:inp,process:HP_LEAD_MAKING.rows[1].process}).product;
 assert.ok(ok.outputs.oral.boil_cure>0);assert.equal(ok.outputs.oral.corrosion,undefined);
 assert.ok(bad.outputs.oral.corrosion>0);assert.ok((bad.outputs.oral.boil_cure??0)<ok.outputs.oral.boil_cure);
 assert.notEqual(ok.id,bad.id);
 // the same early process is also what a maker who takes it off the fire first would avoid
 const swapped=resolveBatch(law,{inputs:inp,process:[{op:'simmer',level:1},{op:'take_off_fire',level:1},{op:'add_quills_cool',level:1}]}).product;
 assert.equal(swapped.id,ok.id);
});
test('a row whose quills come early cannot be defined as the written order',()=>{
 const bad=structuredClone(HP_LEAD_MAKING);bad.rows[1].product.key=K.cure;
 assert.throws(()=>defineCastMaking(bad,bind),/product key has conflicting/i);
});
test('issue effects grant exactly one brew and the shared knowledge key',()=>{
 const items=Object.fromEntries(hpPotionsIssueEffects.filter(e=>e.type==='item').map(e=>[e.key,e.amount]));
 assert.deepEqual(items,{[K.nettles]:2,[K.fangs]:1,[K.slugs]:1,[K.quills]:1});
 const know=hpPotionsIssueEffects.find(e=>e.type==='knowledge');
 assert.equal(know.key,HP_LEAD_MAKING.rows[0].knowledgeKey);assert.equal(know.key,HP_LEAD_MAKING.rows[1].knowledgeKey);
 assert.equal(know.basis.kind,'observation');
 const ids=new Set(hpLeadMakingItems.map(i=>i.id));
 for(const k of Object.values(K))assert.ok(ids.has(JSON.parse(k).id));
 for(const i of hpLeadMakingItems)assert.ok(i.label&&i.description&&Number.isInteger(i.value));
});
test('player-facing text has no engine vocabulary',()=>{
 const strings=[];
 for(const c of cmds){strings.push(c.label,c.description);for(const e of c.effects)if(e.type==='knowledge')strings.push(e.value);}
 for(const e of hpPotionsIssueEffects)if(e.type==='knowledge')strings.push(e.value);
 for(const i of hpLeadMakingItems)strings.push(i.label,i.description);
 for(const s of strings)assert.doesNotMatch(s,/\b(batch|law|axis|catalogue)\b/i,s);
});

// W1a consumer: a cure handed in by the written steps raises the next Potions chance; a corrosive flask does not.
import {hpLessonFacts, FLASK_BONUS} from '../src/book_world_hp_lessons.js';
test('the handed-in flask feeds the next Potions chance', () => {
    const with_ = flask => hpLessonFacts({actors: {player: {facts: flask ? {'hp.lead.potions.flask': flask} : {}}}}, {gameplay: {player: {skills: {Alchemy: {xp: 0}}}}})['hp.lead.brewChance'];
    assert.equal(Math.round((with_('cure') - with_(null)) * 100), Math.round(FLASK_BONUS * 100));
    assert.equal(with_('corrosive'), with_(null));
});
