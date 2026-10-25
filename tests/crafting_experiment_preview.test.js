import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {projectCrafting, quoteCrafting, stageCrafting} from '../src/crafting_frontier_runtime.js';
import {renderCraftingDetail} from '../src/crafting_detail.js';

test('known recipe detail retains its native numeric success chance',()=>{
    const previous=globalThis.document,dom=createDom();
    globalThis.document=dom.document;
    try {
        const detail=dom.document.createElement('div');
        renderCraftingDetail(detail,{title:'Known recipe',requirements:[],output:{name:'Ingot',count:1},chance:75,available:true,attempts:1},{});
        assert.equal(detail.querySelector('[data-craft-chance]').textContent,'75%');
        assert.match(detail.querySelector('.craft_detail_odds').textContent,/Success/);
        assert.match(detail.querySelector('[data-craft-output]').textContent,/Makes/);
    } finally {globalThis.document=previous;}
});

test('experimental steep preview does not promise a viable product for an eligible thin batch',async()=>{
    const previous=globalThis.document,dom=createDom();
    dom.loadHTML('<html><body><div id="main_content"></div></body></html>');
    globalThis.document=dom.document;
    try {
        const {createCraftingHome}=await import('../src/crafting_home.js');
        const context={clock:100,world:'base.frontier',location:'Village',blocked:'',root:7919};
        const gathered=stageCrafting(null,{},quoteCrafting(null,{},{type:'harvest'},context),context);
        let owner=gathered.state;
        const inventory=Object.fromEntries(gathered.items.map(i=>[i.key,i.amount]));
        const thin=gathered.items.find(i=>{
            const request={type:'craft',inputs:[{key:i.key,qty:1}],process:[{op:'steep',level:1}]};
            return stageCrafting(owner,inventory,quoteCrafting(owner,inventory,request,context),context).failure?.code==='thin';
        });
        assert.ok(thin,'real gathered lot can be committed but yields no preparation');
        let result;
        createCraftingHome({
            read:()=>({...projectCrafting(owner,inventory),...context,discovered:true}),
            quote:request=>quoteCrafting(owner,inventory,request,context),
            forecast:()=>({verdict:'untried'}),
            execute:quoted=>{
                result=stageCrafting(owner,inventory,quoted,context);owner=result.state;
                for(const item of result.items){inventory[item.key]=(inventory[item.key]??0)+item.amount;if(!inventory[item.key])delete inventory[item.key];}
                return result;
            },
        });
        const panel=dom.document.getElementById('crafting_engine_home');
        const choice=[...panel.querySelectorAll('[data-craft-material]')].find(n=>n.dataset.craftMaterial===thin.key);
        choice.checked=true;choice.dispatchEvent(new dom.classes.Event('change'));
        const detail=panel.querySelector('[data-craft-detail]');
        assert.equal(detail.dataset.state,'ready','eligibility means the experiment can run');
        assert.equal(detail.querySelector('[data-craft-chance]').textContent,'Unassessed');
        assert.match(detail.querySelector('.craft_detail_odds').textContent,/Viable preparation/);
        assert.match(detail.querySelector('[data-craft-output]').textContent,/Possible result/);
        assert.match(detail.textContent,/Selected materials are used even if no preparation results/);
        assert.doesNotMatch(detail.textContent,/100%|Success/);
        const before=inventory[thin.key];
        detail.querySelector('[data-craft-commit]').click();
        assert.equal(result.failure.code,'thin');
        assert.equal(inventory[thin.key]??0,before-1);
        assert.equal(Object.keys(owner.products).length,0);
        assert.match(panel.querySelector('[role="status"]').textContent,/too thin/);
    } finally {globalThis.document=previous;}
});
