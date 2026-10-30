import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createExpansionState,createContentRegistry} from '../src/expansion_engine.js';
import {previewSimulationResponse} from '../src/simulation.js';
import {createStoryletPanel} from '../src/storylet_ui.js';
import {renderSceneCard,sceneHeaderText,sceneQuoteText,pickCurrentScene} from '../src/ui/scene_card.js';

class Element {
    constructor(tag,doc){this.tagName=tag;this.ownerDocument=doc;this.dataset={};this.children=[];this.listeners={};this.className='';this._text='';}
    get textContent(){return this._text+this.children.map(c=>c.textContent).join('');}
    set textContent(v){this._text=v;this.children=[];}
    append(...nodes){this.children.push(...nodes);for(const n of nodes)n.parentElement=this;}
    addEventListener(type,fn){this.listeners[type]=fn;}
    replaceChildren(...nodes){this.children=[];this.append(...nodes);}
    find(pred,out=[]){for(const c of this.children){if(pred(c))out.push(c);c.find(pred,out);}return out;}
}
// Own document object, not a global: the card must draw through the host's document (MDL13).
const makeDocument=()=>{const doc={createElement:tag=>new Element(tag,doc)};return doc;};

test('slots render in order from plain data and chips and onward steps call their hooks',()=>{
    const doc=makeDocument(),host=new Element('div',doc),calls=[];
    const card=renderSceneCard(host,{kind:'meeting',id:'m1',
        header:{place:'Market',time:'Evening'},stakes:'The clerk may stop trusting you.',
        people:[{id:'p1',name:'Clerk'}],
        options:[{id:'a',label:'Speak up',time:'10 min',cost:'1 coin',affects:'Clerk',onChoose:o=>calls.push(o.id)}],
        result:'The clerk nods.',onward:[{label:'Go to the gate',time:'15 min',onGo:()=>calls.push('go')}]},
        {onPerson:id=>calls.push(`person:${id}`)});
    assert.equal(host.children[0],card);assert.equal(card.dataset.sceneKind,'meeting');
    assert.deepEqual(card.children.map(c=>c.className),['scene-card-header','scene-card-stakes','scene-card-people','scene-card-option','scene-card-result','scene-card-onward']);
    assert.equal(card.children[0].textContent,'Market · Evening');
    assert.equal(card.children[1].textContent,'The clerk may stop trusting you.');
    assert.equal(card.children[3].textContent,'Speak up10 min · 1 coin · Clerk');
    assert.equal(card.children[5].textContent,'Go to the gate · 15 min');
    card.children[2].children[0].listeners.click();card.children[3].children[0].listeners.click();card.children[5].children[0].listeners.click();
    assert.deepEqual(calls,['person:p1','a','go']);
    assert.equal(sceneHeaderText({lead:'Offer',title:'Visit'}),'Offer · Visit');assert.equal(sceneQuoteText({}),'');
});

test('a blocked option prints its reason as text beside the row, not only in a title, and cannot be chosen',()=>{
    const doc=makeDocument(),host=new Element('div',doc),calls=[];
    const card=renderSceneCard(host,{options:[{id:'b',label:'Open the door',blocked:'Needs a key.',onChoose:()=>calls.push('b')},{id:'c',label:'Wait',disabled:true,onChoose:()=>calls.push('c')}]});
    const [blocked,paused]=card.children;
    assert(blocked.children[0].disabled);
    assert.equal(blocked.find(n=>'sceneBlocked' in n.dataset)[0].textContent,'Needs a key.');
    assert(paused.children[0].disabled);assert.equal(paused.find(n=>'sceneBlocked' in n.dataset).length,0);
    assert.equal(blocked.children[0].listeners.click,undefined);
    assert.equal(paused.children[0].listeners.click,undefined);
    assert.deepEqual(calls,[]);
});

test('SUI8: one current scene, the rest queue in time order',()=>{
    const {current,upcoming}=pickCurrentScene([{id:'late',at:90},{id:'soon',at:10},{id:'mid',at:40}]);
    assert.equal(current.id,'soon');assert.deepEqual(upcoming.map(s=>s.id),['mid','late']);
    assert.deepEqual(pickCurrentScene([]),{current:null,upcoming:[]});
});

test('the Village encounter panel draws the same card text as before the conversion',()=>{
    const previous=globalThis.document,doc=makeDocument(),host=new Element('div',doc);
    doc.getElementById=id=>id==='location_actions_div'?host:null;globalThis.document=doc;
    try{
        const state=createExpansionState(12),registry=createContentRegistry({worlds:[{id:'base.frontier'}]});
        state.actors.player.facts['storylets.enabled']=true;
        const event={id:'e1',storylet:true,actorId:'player',discoveredBy:['player'],status:'open',definitionId:'card.test',mode:'decision',label:'A stranger asks',expiresAt:state.clock+25,
            responses:[{id:'yes',label:'Help'},{id:'no',label:'Decline'}]};
        state.simulation={...(state.simulation||{}),events:{e1:event}};
        const context={actorId:'player',facts:{location:'Village'}};
        const panel=createStoryletPanel({registry,read:()=>({state,context,enabled:true}),command:()=>{}});
        panel.render();
        const section=host.find(n=>n.dataset.storyletCard==='card.test')[0];
        assert(section,'card keeps its data-storylet-card hook');
        // Pre-conversion text: one header paragraph, then one button per response.
        assert.equal(section.children[0].textContent,'Decision · A stranger asks · 25 min left');
        const buttons=section.find(n=>n.tagName==='button');
        assert.deepEqual(buttons.map(b=>[b.textContent,b.dataset.storyletResponse]),[['Help','yes'],['Decline','no']]);
        for(const [i,r] of event.responses.entries()) {
            const preview=previewSimulationResponse(state,registry,{kind:'event',eventId:'e1',responseId:r.id},context);
            assert.equal(buttons[i].disabled,!preview.eligible);
            if(!preview.eligible)assert.equal(buttons[i].title,preview.reasons.join(' '));
        }
    }finally{globalThis.document=previous;}
});

test('scene card styles use tokens only',()=>{
    const css=readFileSync(new URL('../styles/scene_card.css',import.meta.url),'utf8');
    assert.doesNotMatch(css,/#[0-9a-f]{3,8}\b|rgba?\(|\d+px\b/i);
});
