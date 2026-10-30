import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderCrossingThreshold, carryGroups, thresholdText} from '../src/ui/crossing_threshold.js';
import {lotmThresholdView} from '../src/book_world_lotm_threshold.js';
import {entryAnswers} from '../src/book_world_lotm_entry.js';
import {CROSSING_RETURNABLE, CROSSING_ONE_WAY_BLOCKED} from '../src/ui/preview/fixtures/worlds.js';

class Element {
    constructor(tag,doc){this.tagName=tag;this.ownerDocument=doc;this.dataset={};this.children=[];this.listeners={};this.className='';this._text='';}
    get textContent(){return this._text+this.children.map(c=>typeof c==='string'?c:c.textContent).join('');}
    set textContent(v){this._text=v;this.children=[];}
    append(...nodes){this.children.push(...nodes);}
    insertBefore(node,ref){const i=ref?this.children.indexOf(ref):-1;if(i<0)this.children.push(node);else this.children.splice(i,0,node);}
    addEventListener(type,fn){this.listeners[type]=fn;}
    find(pred,out=[]){for(const c of this.children){if(typeof c==='string')continue;if(pred(c))out.push(c);c.find(pred,out);}return out;}
}
const makeDocument=()=>{const doc={createElement:tag=>new Element(tag,doc)};return doc;};
const render=view=>{const doc=makeDocument(),host=new Element('div',doc);return renderCrossingThreshold(host,view);};
const groupIds=view=>carryGroups(view).map(g=>g.id);

test('a returnable body crossing sorts every answer once, between the stakes and the choices',()=>{
    const card=render(CROSSING_RETURNABLE);
    assert.deepEqual(card.children.map(c=>c.className),['scene-card-header','scene-card-stakes','crossing-carry','scene-card-option','scene-card-option']);
    assert.deepEqual(groupIds(CROSSING_RETURNABLE),['crosses','held','pauses','far']);
    const rows=card.find(n=>n.className==='crossing-carry-row');
    assert.equal(rows.length,CROSSING_RETURNABLE.answers.length,'no answer is dropped or repeated');
    const groups=Object.fromEntries(carryGroups(CROSSING_RETURNABLE).map(g=>[g.id,g.rows.map(r=>r.question)]));
    assert.deepEqual(groups.crosses,['Memories','Base cheat']);assert.deepEqual(groups.held,['Money and items']);assert.deepEqual(groups.pauses,['Your old life']);
    assert.match(card.textContent,/Before you cross · Village → Lanternside · as a dock clerk · Year 412/);
    assert.match(card.textContent,/pauses where you left it and can be resumed/);
});

test('in person, one way and blocked: own body crosses, the old life ends, the reason prints, unknown questions survive',()=>{
    const groups=Object.fromEntries(carryGroups(CROSSING_ONE_WAY_BLOCKED).map(g=>[g.id,g]));
    assert.deepEqual(groups.crosses.rows.map(r=>r.question),['Body','Memories','Base cheat','Language']);
    assert.equal(groups.pauses.label,'Ends here');
    assert.deepEqual(groups.other.rows.map(r=>r.question),['Omens']);
    const card=render(CROSSING_ONE_WAY_BLOCKED);
    const confirm=card.find(n=>n.tagName==='button')[0];
    assert.equal(confirm.disabled,true);assert.ok(card.find(n=>n.className==='scene-card-blocked'&&/Return to the Village first/.test(n.textContent)).length);
    const text=thresholdText(CROSSING_ONE_WAY_BLOCKED);
    assert.match(text,/^Before you cross · Village → Lanternside/);assert.match(text,/\nEnds here:\n- Your old life\. Your Village life stops/);
    assert.match(text,/\[Confirm and cross to Lanternside\] unavailable: Return to the Village first\./);
});

test('the live entry view keeps all nine answers, its hooks and its button tokens',()=>{
    const calls=[];
    for(const [key,returnable] of [['probationer',false],['probationer',true],['civil',true],['beside',false]]){
        const pick={key,label:'Begin as someone',answers:entryAnswers(key,{returnable})};
        const v={startable:true,startReasons:[],returnable,axes:[{id:'era',options:[{label:'Year one',available:true}]}]};
        const view=lotmThresholdView(v,pick,{onConfirm:()=>calls.push('confirm'),onBack:()=>calls.push('back')});
        const card=render(view);
        assert.equal(card.dataset.lotmEntryAnswers,key);
        const rows=card.find(n=>n.dataset.lotmAnswer);
        assert.equal(rows.length,9,`${key} shows nine answers`);
        assert.equal(new Set(rows.map(r=>r.dataset.lotmAnswer)).size,9);
        const [confirm,back]=card.find(n=>n.tagName==='button');
        assert.equal(confirm.dataset.lotm,key==='probationer'?'enroll':`enroll_${key}`);assert.equal(back.dataset.lotm,'entry_back');
        confirm.listeners.click();back.listeners.click();
        assert.equal(carryGroups(view).find(g=>g.id==='pauses').label,returnable?'Pauses':'Ends here');
    }
    assert.equal(calls.length,8);
    const blocked=lotmThresholdView({startable:false,startReasons:['Return to the Village first.'],axes:[]},{key:'probationer',label:'x',answers:entryAnswers('probationer')},{});
    assert.equal(blocked.options[0].blocked,'Return to the Village first.');
});

test('an independent new life shows its answers as how it begins, with no crossing groups',()=>{
    const view={from:'Village',to:'Lanternside',title:'new life',independent:true,answers:[['Beginning','A life of your own from its first morning.']]};
    assert.deepEqual(carryGroups(view).map(g=>g.label),['How it begins']);
    assert.match(thresholdText(view),/^New life · Village → Lanternside/);
});

test('carry list styles use tokens only',()=>{
    const css=readFileSync(new URL('../styles/crossing_threshold.css',import.meta.url),'utf8');
    assert.doesNotMatch(css,/#[0-9a-f]{3,8}\b|rgba?\(|\d+px\b/i);
});
