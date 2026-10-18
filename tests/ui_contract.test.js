import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {uiViolations,scanUiText} from './helpers/ui_contract.mjs';
test('UI changes introduce no unreviewed colors, fonts, radii, cssText or foreign-host insertion',()=>{
    const root=fileURLToPath(new URL('../',import.meta.url));
    const ledger=JSON.parse(readFileSync(new URL('./ui_contract_allowlist.json',import.meta.url),'utf8'));
    const allowed=new Map(ledger.entries.map(v=>[v.key,v.count]));
    const newHits=uiViolations(root).filter(v=>v.count>(allowed.get(v.key)||0));
    assert.deepEqual(newHits,[], 'Use UI tokens and a declared panel home. Shrink existing exceptions instead of granting a file-wide exemption.');
});
test('UI contract catches new literal styling and aliased/direct foreign panel insertion',()=>{
    for(const text of ['x.style.cssText="padding:4px";', '.x {border-radius:4px;font-family:Arial;color:#abcdef;background:rgb(0,0,0)}', "const host=document.getElementById('message_box_div');\nhost.prepend(panel);", "document.getElementById('another-panel').append(panel);"])
        assert(scanUiText(text).length>0,text);
    assert.deepEqual(scanUiText('.x { color:var(--ui-text); }'),[]);
});
// UIL1 (UIM1, UIM2): every panel declares a surface type and every navigation route resolves
// through the layout spec's route table.
test('every panel declares a surface type and every route resolves through the route table',async()=>{
    const {LAYOUT_SPEC:spec,SURFACE_TYPES,UNSET,routeTable,routeById}=await import('../src/layout_spec.js');
    const src=fileURLToPath(new URL('../src/',import.meta.url));
    const {readdirSync}=await import('node:fs');
    const registered=new Set();
    for(const file of readdirSync(src,{recursive:true}).filter(f=>f.endsWith('.js'))){
        const text=readFileSync(src+file,'utf8');
        for(const m of text.matchAll(/(?:definePanel|registerWorkspaceModule|register)\(\{\s*id:\s*'([^']+)'/g))registered.add(m[1]);
        for(const m of text.matchAll(/\['([a-z-]+)','[^']+','[a-z_]+','(?:left|center|right)',(?:true|false)\]/g))registered.add(m[1]);
    }
    const inSpec=[...Object.values(spec.regions).flatMap(r=>r.panels),...Object.values(spec.boxes).flatMap(b=>b.panels),...spec.shellOrder,...Object.keys(spec.contextual),...Object.values(spec.contexts).flatMap(c=>c.companions)];
    assert(registered.size>=40,`scan found ${registered.size} registered panels`);
    for(const id of new Set([...registered,...inSpec])){
        const s=spec.surfaces[id];assert(s,`${id} has no surface entry in LAYOUT_SPEC.surfaces`);
        assert(SURFACE_TYPES.includes(s.type)||s.type===UNSET,`${id} type ${s.type}`);
        for(const key of ['home','frequency','status','gate','reads','contexts','representations'])assert(key in s,`${id} declares ${key}`);
        assert(s.status===UNSET||['proposal','accepted'].includes(s.status),`${id} status ${s.status}`);
    }
    for(const id of Object.keys(spec.surfaces))assert(registered.has(id),`${id} is in the spec but no module registers it`);
    const table=routeTable();
    assert.equal(new Set(table.map(r=>r.id)).size,table.length,'route IDs are unique');
    assert.equal(new Set(table.map(r=>r.key)).size,table.length,'hotkeys are unique');
    for(const r of table){assert(r.surface,`${r.id} resolves to a surface`);assert.equal(routeById(r.id),routeById(r.id));assert.equal(routeById(r.id).target,r.target);
        assert(r.surface.representations.includes('route'),`${r.target} lists its route representation`);}
    assert.equal(routeById('no-such-route'),null);
    const nav=readFileSync(new URL('../src/workspace_navigation.js',import.meta.url),'utf8');
    assert.match(nav,/routeTable\(\)/,'navigation reads the route table');
    assert.doesNotMatch(nav,/\['Here','h'/,'no hand-written route array');
});
