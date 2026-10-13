import test from 'node:test';
import assert from 'node:assert/strict';
import {createStructuredPackPanel} from '../src/structured_pack_ui.js';

function withDom(run) {
    const previous={document:globalThis.document,setInterval:globalThis.setInterval,clearInterval:globalThis.clearInterval};
    let tick,cleared=false;const document={activeElement:null};
    class Element {
        constructor(tag){this.tagName=tag;this.children=[];this.parentElement=null;this.dataset={};this.textContent='';this.disabled=false;}
        setAttribute(name,value){(this.attributes??={})[name]=String(value);}
        contains(node){return node===this||this.children.some(c=>c.contains(node));}
        get isConnected(){return this===document.root||!!this.parentElement?.isConnected;}
        remove(){if(this.contains(document.activeElement))document.activeElement=null;if(this.parentElement)this.parentElement.children.splice(this.parentElement.children.indexOf(this),1);this.parentElement=null;}
        append(...nodes){for(const n of nodes){n.remove();n.parentElement=this;this.children.push(n);}}
        prepend(n){n.remove();n.parentElement=this;this.children.unshift(n);}
        replaceChildren(...nodes){for(const n of [...this.children])n.remove();this.append(...nodes);}
        focus(){if(this.isConnected&&!this.disabled)document.activeElement=this;}
        click(){if(!this.disabled)this.onclick?.();}
    }
    document.createElement=tag=>new Element(tag);document.root=new Element('main');
    const host=new Element('div');host.id='location_actions_div';document.root.append(host);
    document.getElementById=id=>document.root.children.find(n=>n.id===id)||null;
    globalThis.document=document;globalThis.setInterval=fn=>{tick=fn;return 1;};globalThis.clearInterval=()=>{cleared=true;};
    const find=(node,key,id)=>node.dataset[key]===id?node:node.children.map(c=>find(c,key,id)).find(Boolean);
    const text=node=>[node.textContent,...node.children.map(text)].join(' ');
    try{run({document,host,find,text,tick:()=>tick(),cleared:()=>cleared});}
    finally{for(const [k,v] of Object.entries(previous)){if(v===undefined)delete globalThis[k];else globalThis[k]=v;}}
}
const view=()=>({available:true,active:true,title:'A local beginning',place:'Workroom',description:'A modest room.',people:[{name:'Keeper',details:['You met today.']}],status:[{label:'Held',value:2}],actions:[{id:'work',label:'Prepare supplies',description:'Use your actual supplies.',eligible:true,reasons:[]}],jobs:[{id:'job.1',label:'Sorting',remaining:3,cancellable:true}],canWrite:true});

test('unchanged projection retains focus and remounts the same controls',()=>withDom(({document,host,find,text,tick,cleared})=>{
    const v=view(),calls=[];const panel=createStructuredPackPanel({read:()=>v,command:r=>calls.push(r)});
    const element=host.children[0],action=find(element,'structuredAction','work');action.focus();tick();
    assert.equal(document.activeElement,action);assert.equal(find(element,'structuredAction','work'),action);
    host.replaceChildren();tick();assert.equal(host.children[0],element);assert.equal(find(element,'structuredAction','work'),action);
    action.click();assert.deepEqual(calls,[{type:'action',id:'work'}]);assert.match(text(element),/Command saved\./);
    find(element,'structuredCancel','job.1').click();assert.deepEqual(calls[1],{type:'cancel',jobId:'job.1'});
    v.canWrite=false;tick();assert.equal(find(element,'structuredAction','work').disabled,true);assert.equal(find(element,'structuredCancel','job.1').disabled,true);
    find(element,'structuredAction','work').click();assert.equal(calls.length,2);
    v.canWrite=true;v.actions[0].eligible=false;tick();assert.equal(find(element,'structuredAction','work').disabled,true);
    panel.destroy();assert.equal(host.children.length,0);assert.equal(cleared(),true);
}));

test('only projected rows render and raw extras do not change the controls',()=>withDom(({host,find,text,tick})=>{
    const v=view();v.secret='RAW_SECRET';v.people[0].truth='RAW_PERSON';v.actions[0].source='RAW_SOURCE';
    const panel=createStructuredPackPanel({read:()=>v,command:()=>{}}),element=host.children[0],action=find(element,'structuredAction','work');
    assert.match(text(element),/Keeper.*You met today.*Held: 2.*3 played minutes/s);assert.doesNotMatch(text(element),/RAW_/);
    v.secret='CHANGED_SECRET';v.actions[0].source='CHANGED_SOURCE';tick();assert.equal(find(element,'structuredAction','work'),action);
    panel.destroy();
}));

test('inactive begin is neutral and rejection shows safe host error without success text',()=>withDom(({host,find,text,tick})=>{
    const v=view();v.active=false;const calls=[];
    const panel=createStructuredPackPanel({read:()=>v,command:r=>{calls.push(r);v.error='Supplies are no longer available.';throw Error('RAW_INTERNAL_SECRET');}});
    const element=host.children[0];assert.equal(find(element,'structuredAction','work'),undefined);assert.equal(find(element,'structuredCancel','job.1'),undefined);
    find(element,'structuredBegin','begin').click();assert.deepEqual(calls,[{type:'begin'}]);assert.match(text(element),/Supplies are no longer available\./);assert.doesNotMatch(text(element),/Saved\.|RAW_INTERNAL_SECRET/);
    v.canWrite=false;tick();assert.equal(find(element,'structuredBegin','begin').disabled,true);
    v.available=false;tick();assert.equal(element.hidden,true);assert.equal(find(element,'structuredBegin','begin'),undefined);
    panel.destroy();
}));


test('countdown preserves keyboard focus and host errors outrank old saved notice',()=>withDom(({document,host,find,text,tick})=>{
    const v=view(),panel=createStructuredPackPanel({read:()=>v,command:()=>{}}),element=host.children[0];
    find(element,'structuredAction','work').click();
    find(element,'structuredCancel','job.1').focus();
    v.jobs[0].remaining=2;tick();
    assert.equal(document.activeElement,find(element,'structuredCancel','job.1'));
    v.error='Saving is unavailable.';tick();
    assert.match(text(element),/Saving is unavailable/);assert.doesNotMatch(text(element),/Saved\./);panel.destroy();
}));

test('repeated work rechecks completion and eligibility, including host reentrant render',()=>withDom(({host,find,text,tick})=>{
    const v=view();v.jobs=[];Object.assign(v.actions[0],{duration:3,completed:0,repeatable:true,costs:['1 stamina']});
    let panel,calls=0;
    panel=createStructuredPackPanel({read:()=>v,command:r=>{assert.equal(r.type,'action');calls++;v.jobs=[{id:'job.'+calls,commandId:'work',label:'Work',remaining:3,duration:3,cancellable:true}];panel.render(true);}});
    const element=host.children[0];find(element,'structuredRepeat','work').click();assert.equal(calls,1);assert.match(text(element),/2 further repetitions/);
    v.jobs=[];v.actions[0].completed=1;tick();assert.equal(calls,2);assert.match(text(element),/1 further repetitions/);
    v.jobs=[];v.actions[0].completed=2;v.actions[0].eligible=false;v.actions[0].reasons=['No stock remains.'];tick();
    assert.equal(calls,2);assert.match(text(element),/Repeated work stopped.*No stock remains/);panel.destroy();
}));

test('stopping repeats leaves current job intact; cancelled jobs never trigger another order',()=>withDom(({host,find,text,tick})=>{
    const v=view();v.jobs=[];Object.assign(v.actions[0],{duration:3,completed:0,repeatable:true});let calls=0;
    const panel=createStructuredPackPanel({read:()=>v,command:()=>{calls++;v.jobs=[{id:'job.1',commandId:'work',label:'Work',remaining:3,cancellable:true}];}}),element=host.children[0];
    find(element,'structuredRepeat','work').click();find(element,'structuredRepeat','stop').click();
    assert.equal(v.jobs.length,1);v.jobs=[];v.actions[0].completed=1;tick();assert.equal(calls,1);
    find(element,'structuredRepeat','work').click();v.jobs=[];tick();assert.equal(calls,2);assert.match(text(element),/Repeated work stopped/);panel.destroy();
}));


test('loss of write ownership stops a plan while current job is still pending',()=>withDom(({host,find,text,tick})=>{
    const v=view();v.jobs=[];Object.assign(v.actions[0],{duration:3,completed:0,repeatable:true});let calls=0;
    const panel=createStructuredPackPanel({read:()=>v,command:()=>{calls++;v.jobs=[{id:'job.1',commandId:'work',label:'Work',remaining:3,cancellable:true}];}}),element=host.children[0];
    find(element,'structuredRepeat','work').click();v.canWrite=false;tick();assert.equal(find(element,'structuredRepeat','stop'),undefined);
    assert.equal(v.jobs.length,1);v.canWrite=true;v.jobs=[];v.actions[0].completed=1;tick();assert.equal(calls,1);panel.destroy();
}));
