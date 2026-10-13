import test from 'node:test';
import assert from 'node:assert/strict';
import {createContentPackPanel} from '../src/content_pack_ui.js';

// A small DOM model exercises the actual panel lifecycle, including removal
// of focused nodes, disabled controls and moving an existing panel to a host.
function withDom(run) {
    const previous={document:globalThis.document,setInterval:globalThis.setInterval,clearInterval:globalThis.clearInterval};
    let tick,cleared=false;
    const document={activeElement:null};
    class Element {
        constructor(tag) {this.tagName=tag;this.children=[];this.parentElement=null;this.dataset={};this.attributes={};this.textContent='';this.disabled=false;}
        setAttribute(name,value) {this.attributes[name]=String(value);}
        getAttribute(name) {return this.attributes[name]??null;}
        contains(node) {return node===this||this.children.some(child=>child.contains(node));}
        get isConnected() {return this===document.root||!!this.parentElement?.isConnected;}
        remove() {
            if(this.contains(document.activeElement))document.activeElement=null;
            if(this.parentElement)this.parentElement.children.splice(this.parentElement.children.indexOf(this),1);
            this.parentElement=null;
        }
        append(...nodes) {for(const node of nodes){node.remove();node.parentElement=this;this.children.push(node);}}
        prepend(node) {node.remove();node.parentElement=this;this.children.unshift(node);}
        replaceChildren(...nodes) {for(const node of [...this.children])node.remove();this.append(...nodes);}
        focus() {if(this.isConnected&&!this.disabled)document.activeElement=this;}
        click() {if(!this.disabled)this.onclick?.();}
    }
    document.createElement=tag=>new Element(tag);
    document.root=new Element('main');
    const host=new Element('div');host.id='location_actions_div';document.root.append(host);
    document.getElementById=id=>document.root.children.find(node=>node.id===id)||null;
    globalThis.document=document;
    globalThis.setInterval=fn=>{tick=fn;return 1;};
    globalThis.clearInterval=id=>{assert.equal(id,1);cleared=true;};
    const find=(node,action)=>node.dataset.packAction===action?node:node.children.map(child=>find(child,action)).find(Boolean);
    const text=node=>[node.textContent,...node.children.map(text)].join(' ');
    try {run({document,host,find,text,tick:()=>tick(),replaceHost:()=>{
        host.remove();const replacement=new Element('div');replacement.id=host.id;document.root.append(replacement);return replacement;
    },isCleared:()=>cleared});}
    finally {for(const [key,value] of Object.entries(previous)){if(value===undefined)delete globalThis[key];else globalThis[key]=value;}}
}

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
