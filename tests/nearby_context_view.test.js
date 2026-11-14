import test from 'node:test';
import assert from 'node:assert/strict';
import {projectNearbyContext} from '../src/nearby_context_view.js';

const frame=()=>({place:'Village',people:[{id:'elder',name:'Village elder',role:'Neighbor',met:true,traits:['patient']},{id:'visitor',name:'Unmet traveler',met:false,traits:['private trait'],relationship:'private relationship'}],services:[{id:'clerk',name:'Supply clerk'}],things:[{id:'mixing',name:'Mixing counter',description:'Mix ingredients.'},{id:'projects',name:'Projects'},{id:'hidden',name:'Sealed subject',known:false}],actions:[{id:'talk:elder',target:'elder',label:'Talk with elder'},{id:'mixing',target:'mixing',label:'Open mixing',disabled:true,reason:'Busy'}]});
test('nearby representation separates admitted people and stations without changing source or executing commands',()=>{
 const input=frame(),before=structuredClone(input),view=projectNearbyContext(input,'mixing','A quiet village. Paths lead outward.');
 assert.deepEqual(view.people.map(p=>p.id),['elder','visitor']);assert.deepEqual(view.services.map(p=>p.id),['clerk','mixing']);
 assert.equal(view.subject.actions[0],input.actions[1]);assert.equal(view.subject.actions[0].disabled,true);
 assert.equal(view.descriptionLead,'A quiet village. Paths lead outward.');assert.equal(view.selectedId,'mixing');assert.deepEqual(input,before);
 assert.doesNotMatch(JSON.stringify(view),/private trait|private relationship|Sealed subject|Projects/);
});
test('a disappearing selection is reconciled without selecting or acting on a sibling',()=>{
 const input=frame();assert.equal(projectNearbyContext(input,'elder').selectedId,'elder');
 input.people=input.people.filter(p=>p.id!=='elder');const view=projectNearbyContext(input,'elder');
 assert.equal(view.selectedId,null);assert.equal(view.subject,null);assert.equal(view.missing,true);
 assert.equal(view.people[0].id,'visitor');
});
test('admitted conversation owns inspection while native work remains untouched',()=>{
 const input=frame();input.dialogue='elder';input.work={id:'native-job',remaining:17};const before=structuredClone(input);
 assert.equal(projectNearbyContext(input,'mixing').selectedId,'elder');assert.deepEqual(input,before);
 assert.equal(projectNearbyContext({...input,dialogue:null},'mixing').selectedId,'mixing');
});
test('service identities deduplicate and no absent routes, hours or danger are manufactured',()=>{
 const input=frame();input.things.push({id:'clerk',name:'Duplicate clerk'});
 const view=projectNearbyContext(input);assert.equal(view.services.filter(s=>s.id==='clerk').length,1);
 assert.equal(view.subject,null);assert.doesNotMatch(view.summary,/way|night|open|danger/);
});

test('PX46: a place account shows once; a short one whole, a long one as its first sentence plus the rest behind More', () => {
    const short = projectNearbyContext({place: 'Stand', people: [], services: [], things: []}, null, 'An unclaimed willow stand. Could you make a shelter here?');
    assert.equal(short.descriptionLead, 'An unclaimed willow stand. Could you make a shelter here?'); assert.equal(short.descriptionRest, ''); assert.equal(short.summary, '');
    const long = projectNearbyContext({place: 'Stand', people: [], services: [], things: []}, null, 'First. ' + 'More words here. '.repeat(30));
    assert.equal(long.descriptionLead, 'First.'); assert.ok(long.descriptionRest.startsWith('More words')); assert.doesNotMatch(long.descriptionRest, /^First/);
});

test('UIC127: the ways out join people and stations in one list, each with its own act', async () => {
    const {projectNearbyContext, placeExits} = await import('../src/nearby_context_view.js');
    const place = (id, extra = {}) => ({id, name: id, tags: {safe_zone: true}, canBeStarted: () => true, ...extra});
    const here = {id: 'Flat', connected_locations: [{location: place('Street')}, {location: place('Sewer', {tags: {}})},
        {location: place('Trial', {is_challenge: true})}, {location: place('Sealed', {canBeStarted: () => false})}]};
    const exits = placeExits(here, {}, {Flat: {Street: 5, Sewer: 90}});
    assert.deepEqual(exits.map(e => [e.id, e.act, e.role]), [['go:Street', 'Go to Street', '5 min away'], ['go:Sewer', 'Enter Sewer', '1 h 30 min away · Not safe']]);
    assert.deepEqual(placeExits(null, {}), [], 'a fight has no ways out');
    const model = projectNearbyContext({place: 'Flat', people: [], things: [], exits,
        actions: exits.map(e => ({id: e.id, target: e.id, label: e.act}))}, 'go:Street', 'A small flat.');
    assert.equal(model.summary, '2 ways out');
    assert.equal(model.subject.kind, 'exit');
    assert.deepEqual(model.subject.actions.map(a => a.label), ['Go to Street']);
    assert.equal(model.subjects.length, 2, 'a place with ways out is not an empty place');
});

test('UIC127, PRS1: a person outside the Village goes by what the action list calls them', async () => {
    const {heardName} = await import('../src/nearby_context_view.js');
    assert.equal(heardName('Talk to the suspicious man'), 'The suspicious man');
    assert.equal(heardName('Talk with Old Hesk.'), 'Old Hesk');
    assert.equal(heardName('Enter the shop'), '');
});
