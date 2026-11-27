import test from 'node:test';
import assert from 'node:assert/strict';
import {digestWorld} from '../prototypes/world-atlas/reader-findings.mjs';

test('public records keep visible actions while withholding marked nested steps, places, costs and shared identities',()=>{
    const hidden='w.person.hidden-identity', place='w.place.market', rule='w.craft.mending';
    const shard={prefix:'wc001',census:[{id:hidden,kind:'person',label:'Old public draft'},
        {id:place,kind:'place',label:'Market'},
        {id:'w.creature.bird',kind:'creature',label:'Bird',whereabouts:[{place:'PRIVATE_SIGHTING',private:true}]}],
        people:[{id:hidden,scope:'private'}],
        places:[{id:place,affordances:[{what:'Browse stalls'},{what:'PRIVATE_ACCESS',scope:'private'}]}],
        rules:[{id:rule,kind:'craft',name:'Mending',inputs:['ordinary thread',{item:'PRIVATE_MATERIAL',sealed:true}],
            costs:[{what:'PRIVATE_COST',amount:2,private:true}],enforcement:{penalty:'PRIVATE_PENALTY',scope:'private'}}],
        scenes:[{beat:'w.scene.private',scope:'private',place:'PRIVATE_SCENE'},
            {beat:'w.scene.market',place,present:[hidden],timeOfDay:{value:'PRIVATE_TIME',private:true},
                steps:[{verb:'Pay the seller',actor:hidden},{verb:'PRIVATE_STEP',scope:'private'}],
                evidence:[{locator:'en b1 c1 p123',private:true}]}]};
    const digest=digestWorld({world:'w',shards:[shard]});
    const json=JSON.stringify(digest);
    assert.doesNotMatch(json,/PRIVATE_|hidden-identity|Old public draft|w\.scene\.private|en b1 c1 p123/);
    for(const visible of ['Browse stalls','Pay the seller','ordinary thread'])assert.ok(json.includes(visible),visible);
    assert.equal(digest.sealedScenes,1);
});
import {appendCensusDetails} from '../prototypes/world-atlas/census-details-view.mjs';
const row={id:'w.item.ticket',kind:'item',label:'Ticket',zh:'票',nameSource:'pinyin-unconfirmed',firstMention:'en b2 c1 p5',aliases:['Slip'],
    whereabouts:[{place:'w.place.market',era:'During the fair',status:'claimed',locator:'en b2 c1 p5'},{place:'w.place.quay',era:'Later',status:'inferred',locator:'en b2 c2 p1'}],
    amount:{value:2,unit:'stamps',cap:5},note:'PRIVATE_NOTE'};
test('census merges later aliases and keeps names, era, claim status, locator and numeric cap without note prose',()=>{
    const d=digestWorld({world:'w',shards:[{prefix:'a',census:[row]},{prefix:'b',census:[{...row,aliases:['Token'],nameSource:'wiki'}]}]});
    const e=d.entities[0];assert.deepEqual(e.aliases,['Slip','Token']);assert.equal(e.names.length,2);
    assert.equal(e.names[0].source,'pinyin-unconfirmed');assert.equal(e.names[0].zh,'票');
    assert.deepEqual(e.whereabouts[0],{place:'w.place.market',era:'During the fair',status:'claimed',locator:'en b2 c1 p5'});
    assert.equal(e.amountRecords[0].cap,5);assert.doesNotMatch(JSON.stringify(e),/PRIVATE_NOTE/);
});
test('a later sealed or private census row suppresses earlier metadata and sealed whereabouts do not escape through places',()=>{
    for(const guard of [{sealed:['secret']},{private:true}]) {
        const d=digestWorld({world:'w',shards:[{prefix:'a',census:[row]},{prefix:'b',census:[{...row,...guard}]}]});
        assert.ok(!d.entities.some(e=>e.id===row.id));
    }
    const d=digestWorld({world:'w',shards:[{prefix:'a',census:[{...row,whereabouts:[{...row.whereabouts[0],sealed:['hidden']}]}]}]});
    assert.deepEqual(d.entities[0].whereabouts,[]);assert.deepEqual(d.entities[0].places,[]);
});
test('the shared subject disclosure presents qualified whereabouts and unconfirmed naming',()=>{
    const e=digestWorld({world:'w',shards:[{prefix:'a',census:[row]}]}).entities[0];
    const make=(tag,text)=>({tag,text,dataset:{},children:[],append(...children){this.children.push(...children);}});
    const parent=make('section');
    appendCensusDetails(parent,e,{el:make,section:(title,rows)=>({title,rows}),entityLink:id=>({href:'#'+id})});
    const rendered=JSON.stringify(parent);
    assert.match(rendered,/Claimed whereabouts/);assert.match(rendered,/Inferred whereabouts/);
    assert.match(rendered,/Pinyin name · unconfirmed/);assert.match(rendered,/cap 5/);assert.doesNotMatch(rendered,/PRIVATE_NOTE/);
});
