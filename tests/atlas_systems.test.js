import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {buildSystems,findSystems} from '../prototypes/world-atlas/systems.mjs';
import {buildFindIndex,searchAtlas} from '../prototypes/world-atlas/atlas-find.mjs';
import {checkPlayLabels} from '../scripts/check_atlas_play_labels.mjs';

const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8');
const source={census:read('docs/audits/LITRPG_SYSTEM_CENSUS_2026-11-27.md'),progression:read('docs/PROGRESSION_GATE_RULES.md')};
const proof=JSON.parse(read('docs/representations/evidence/skill-evolution-ev2-ev3-2026-11-26/proof.json'));

test('census and evolution articles preserve evidence qualification and expose actual receipts',()=>{
    const {articles}=buildSystems({...source,proofs:[proof]});
    assert.equal(articles.length,20);
    for(const row of articles){
        assert.ok(row.definition&&row.cases.length&&row.variations.length&&row.related.length,row.id);
        assert.ok(row.cases.every(cell=>cell.source&&cell.cite),row.id);
    }
    const growth=articles.find(row=>row.id==='SM1');
    const crawler=growth.cases.find(row=>row.id==='DCbg1');
    assert.equal(crawler.confidence,'stated');
    assert.match(crawler.source,/dcc\.other\.stat-points.*en b1 c4 p41/);
    assert.equal(growth.cases.find(row=>row.id==='PH3').confidence,'secondary');
    assert.equal(articles.find(row=>row.id==='EV2').playStatus,'Playable');
    assert.equal(articles.find(row=>row.id==='EV6').playStatus,'Partial');
    const checked=checkPlayLabels(articles.map(record=>({surface:'Systems',id:record.id,record,receipt:record.playReceipt,
        expected:record.playReceipt?'Playable':record.playGap?'Partial':'Reading-only'})));
    assert.deepEqual(checked.mismatches,[]);
});

test('admitted reader identifiers add comparisons without copying reader prose into Systems',()=>{
    const record={id:'az.custom.stat-points-new',col:'order',kind:'custom',name:'Private prose sentinel'};
    const systems=buildSystems({...source,digests:[{world:'az',rules:[record]}]});
    const growth=systems.articles.find(row=>row.id==='SM1');
    const extra=growth.cases.find(cell=>cell.id===record.id);
    assert.equal(extra.cite,'#world/az/things/'+record.id);
    assert.equal(extra.confidence,'reader locator');
    assert.ok(!JSON.stringify(systems).includes(record.name));
    const index=buildFindIndex({systems:findSystems(systems)});
    const results=q=>searchAtlas(index,{q,type:'systems'}).groups[0].rows;
    assert.ok(results('level up').some(row=>row.id==='SM1'));
    assert.ok(results('level up').some(row=>row.id==='EV2'));
    assert.ok(results('stat-points-new').some(row=>row.href.endsWith('?cell='+record.id)));
});

test('growth points and slots need the Village action, normal entry, build and both save receipts',()=>{
    const receipt=id=>JSON.parse(read('docs/representations/evidence/litrpg-sm1-sm5-2026-11-27/proof-'+id.toLowerCase()+'.json'));
    const growthProofs={SM1:receipt('SM1'),SM5:receipt('SM5'),
        SM4:JSON.parse(read('docs/representations/evidence/sm4-role-stack-2026-11-27/proof.json'))};
    const articles=proofs=>buildSystems({...source,growthProofs:proofs}).articles;
    for(const id of Object.keys(growthProofs)){
        const select=proofs=>articles(proofs).find(article=>article.id===id);
        const row=select(growthProofs);
        assert.equal(row.playStatus,'Playable');
        assert.equal(row.playReceipt.life,'Village');
        assert.equal(row.evidence,'/system-play/'+id.toLowerCase());
        const incomplete={...growthProofs[id],runs:growthProofs[id].runs.slice(0,1)};
        assert.equal(select({...growthProofs,[id]:incomplete}).playStatus,'Reading-only');
    }
});
