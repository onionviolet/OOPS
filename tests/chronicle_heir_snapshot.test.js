import test from 'node:test';
import assert from 'node:assert/strict';
import {createChronicle,validateChronicle,createHeirChronicle,heirPredecessorLabel} from '../src/chronicle.js';
import {GAME_YEAR} from '../src/chronicle.js';

function heir(){
  const cal={year:GAME_YEAR,month:1,day:1,hour:0,minute:0,day_count:0};
  const dead=createChronicle(0,cal,true);dead.life.endedAt=dead.life.lifespan>0?Math.round((dead.life.lifespan-dead.life.initialAge)*0):0;
  return {dead,cal};
}
test('CAE-E2 heir tie keeps snapshot and life id, old string-only tie still resolves', () => {
  const {dead,cal}=heir();
  const leftovers={schema:1,recipient:'kin',kin:null,papers:[],apprentice:[],money:0,residences:null,belongings:[],chest:[],home:false,obligations:[],archiveLine:false,debts:[]};
  let h;try{h=createHeirChronicle(dead,0,cal,'Ada',leftovers);}catch(e){assert.fail('setup: '+e.message);}
  const t=h.relationships.villageElder.ties;
  assert.equal(t.rememberedPredecessor,'Ada');assert.equal(typeof t.predecessorLife,'string');
  validateChronicle(h,0);
  const rt=JSON.parse(JSON.stringify(h));validateChronicle(rt,0);
  assert.equal(heirPredecessorLabel(rt),'Ada');
  assert.equal(heirPredecessorLabel(rt,{[t.predecessorLife]:'Ada the Elder'}),'Ada the Elder');
  assert.equal(rt.relationships.villageElder.ties.rememberedPredecessor,'Ada','snapshot is frozen');
  delete rt.relationships.villageElder.ties.predecessorLife;validateChronicle(rt,0);
  assert.equal(heirPredecessorLabel(rt,{[t.predecessorLife]:'Renamed'}),'Ada','old save renders snapshot');
});
