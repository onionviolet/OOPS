import test from 'node:test';
import assert from 'node:assert/strict';
import {mergePlaceDetails} from '../prototypes/world-atlas/place-details.mjs';
import {appendPlaceDetails,placeClaimLabel} from '../prototypes/world-atlas/place-details-view.mjs';
import {digestWorld} from '../prototypes/world-atlas/reader-findings.mjs';
const row={id:'w.place.market',crowd:'A queue gathers',access:['A ticket'],label:'T',locator:'en b2 c1 p5',
    routes:[{to:'w.place.quay',mode:'Walk',minutes:12},{to:'w.place.hill',mode:'unstated',minutes:-1}]};
test('places retain crowd and route evidence, do not invent travel time, and deduplicate repeats',()=>{
    const a=mergePlaceDetails({},row), b=mergePlaceDetails(a,row);
    assert.deepEqual(b,a);assert.equal(a.routes.length,2);assert.equal(a.routes[1].minutes,null);
    assert.equal(a.crowd[0].locator,row.locator);assert.equal(a.accessRecords[0].label,'T');
    assert.equal(placeClaimLabel('I'),'Reader inference');assert.equal(placeClaimLabel('P'),'Authored proposal');
    assert.equal(mergePlaceDetails({}, {...row,locator:'Raw private note'}).crowd[0].locator,null);
});
test('the digest retains source-qualified place details and suppresses a sealed place across shards and route targets',()=>{
    const digest=digestWorld({world:'w',shards:[{prefix:'a',places:[row]}, {prefix:'b',places:[{id:'w.place.quay',sealed:['withheld']}]}]});
    const place=digest.entities.find(e=>e.id===row.id);
    assert.equal(place.crowd[0].text,row.crowd);assert.deepEqual(place.routes.map(r=>r.to),['w.place.hill']);
    assert.ok(!digest.entities.some(e=>e.id==='w.place.quay'));
    assert.equal(mergePlaceDetails({}, {...row,sealed:['hidden']}).routes.length,0);
});
test('the DOM projection gives route targets real entity links and keeps inference labels visible',()=>{
    const sections=[];
    appendPlaceDetails({append:value=>sections.push(value)},mergePlaceDetails({}, {...row,label:'I'}),{
        el:(tag,text)=>({tag,text}),section:(title,rows)=>({title,rows}),entityLink:id=>({href:`#world/w/things/${id}`})});
    const routes=sections.find(section=>section.title==='Routes in the books');
    assert.equal(routes.rows[0][0].href,'#world/w/things/w.place.quay');
    assert.ok(routes.rows[0].some(node=>node.text==='Reader inference'));
});
