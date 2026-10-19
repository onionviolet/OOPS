import test from 'node:test';
import assert from 'node:assert/strict';
import {createContentPackPanel} from '../src/content_pack_ui.js';
import {withPanelDom} from './helpers/mini_dom.mjs';

// A small DOM model (tests/helpers/mini_dom.mjs) exercises the actual panel lifecycle, including removal
// of focused nodes, disabled controls and moving an existing panel to a host.
const withDom=run=>withPanelDom(env=>run({...env,
    find:function find(node,action){return node.dataset.packAction===action?node:node.children.map(child=>find(child,action)).find(Boolean);}}));

const definitions=new Map([['example',{
    title:'Example realm',description:'A synthetic destination.',
    locations:[{label:'Workroom',description:'A synthetic workroom.'}],people:[],
    status:{prepared:'Prepared'},
    activities:[{id:'work',label:'Do local work',description:'Prepare the bench.',requires:[{field:'prepared',op:'eq',value:true}]}]
}]]);
const freshView=()=>({state:{packs:{example:{active:false,values:{prepared:false},job:null}}},canEnter:true,canAct:true});

test('unchanged view remounts after native host clearing, retaining buttons and callbacks',()=>withDom(({host,find,text,tick,isCleared})=>{
    const view=freshView(),calls=[];
    const panel=createContentPackPanel({definitions,read:()=>view,command:(...args)=>{calls.push(args);throw new Error('Entry refused.');}});
    const element=host.children[0],enter=find(element,'example.enter');
    host.replaceChildren();
    assert.equal(element.parentElement,null);
    tick();
    assert.equal(host.children[0],element);
    assert.equal(find(element,'example.enter'),enter);
    enter.click();
    assert.deepEqual(calls,[['example','enter']]);
    assert.match(text(element),/Entry refused\./);
    const refusedEnter=find(element,'example.enter');
    host.replaceChildren();tick();
    assert.equal(find(element,'example.enter'),refusedEnter);
    assert.match(text(element),/Entry refused\./);
    panel.destroy();assert.equal(host.children.length,0);assert.equal(isCleared(),true);
}));

test('active unchanged view retains focus, eligibility and callbacks across polling and host replacement',()=>withDom(({document,host,find,text,tick,replaceHost})=>{
    const view=freshView(),calls=[];
    view.state.packs.example.active=true;
    view.state.packs.example.values.prepared=true;
    const panel=createContentPackPanel({definitions,read:()=>view,command:(...args)=>calls.push(args)});
    const element=host.children[0],work=find(element,'work');
    work.focus();tick();
    assert.equal(document.activeElement,work);
    assert.equal(find(element,'work'),work);
    assert.equal(work.disabled,false);
    const replacement=replaceHost();tick();
    assert.equal(replacement.children[0],element);
    assert.equal(find(element,'work'),work);
    work.click();assert.deepEqual(calls,[['example','work']]);assert.match(text(element),/Command saved\./);
    view.state.packs.example.job={actionId:'work',remaining:3};tick();
    const pendingWork=find(element,'work');
    assert.equal(pendingWork.disabled,true);pendingWork.click();assert.equal(calls.length,1);
    assert.match(text(element),/3 played minutes remaining/);
    view.canAct=false;tick();
    assert.equal(find(element,'example.return').disabled,true);
    view.canAct=true;tick();find(element,'example.return').click();
    assert.deepEqual(calls,[['example','work'],['example','return']]);
    panel.destroy();
}));
