import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {uiViolations,scanUiText} from './helpers/ui_contract.mjs';
test('UI changes introduce no unreviewed colors, fonts, radii, spacing (UR65), control heights (UR66), layers (UR67), type roles (UR68), cssText or foreign-host insertion',()=>{
    const root=fileURLToPath(new URL('../',import.meta.url));
    const ledger=JSON.parse(readFileSync(new URL('./ui_contract_allowlist.json',import.meta.url),'utf8'));
    const allowed=new Map(ledger.entries.map(v=>[v.key,v.count]));
    const newHits=uiViolations(root).filter(v=>v.count>(allowed.get(v.key)||0));
    assert.deepEqual(newHits,[], 'Use UI tokens in styles/ui_tokens.css (UR65 --ui-space-*, UR66 --ui-control-*, UR67 --ui-layer-*, UR68 --ui-line-*/--ui-weight-*/--ui-type-*) and a declared panel home. Shrink existing exceptions in tests/ui_contract_allowlist.json instead of granting a file-wide exemption; a kept exception may carry a reason field.');
});
test('UI contract catches new literal styling and aliased/direct foreign panel insertion',()=>{
    for(const text of ['x.style.cssText="padding:4px";', '.x {border-radius:4px;font-family:Arial;color:#abcdef;background:rgb(0,0,0)}', "const host=document.getElementById('message_box_div');\nhost.prepend(panel);", "document.getElementById('another-panel').append(panel);"])
        assert(scanUiText(text).length>0,text);
    assert.deepEqual(scanUiText('.x { color:var(--ui-text); }'),[]);
    assert.deepEqual(scanUiText('.x {border-radius:var(--ui-radius);}'),[]);
    assert.equal(scanUiText('.x {border-radius:var(--unreviewed-shape);}')[0].rule,'declaration');
    assert.equal(scanUiText('.x {border-radius:50%;}')[0].rule,'declaration');
    // UR65: literal spacing is caught; tokens, zero, auto and percentages are not.
    for(const text of ['.x {padding:4px 6px}', '.x {margin-top:.4em}', '.x {gap:calc(var(--ui-space-2) + 3px)}', "el.style.paddingTop='4px';", "Object.assign(el.style,{margin:'.5em 0'});"])
        assert.deepEqual(scanUiText(text).map(v=>v.rule),['spacing'],text);
    assert.deepEqual(scanUiText('.x {padding:0 var(--ui-space-3);margin:0 auto;gap:2%;padding-left:var(--ui-space-panel, 8px)}'),[]);
    assert.deepEqual(scanUiText("el.style.padding='var(--ui-space-2)';el.style.margin='0';"),[]);
    // UR66-UR68: control heights, layers and type roles.
    for(const [text,rule] of [['button.x {min-height:23px}','control-height'],['.x {z-index:30}','layer'],["el.style.zIndex='5';",'layer'],['.x {line-height:1.35}','type'],['.x {font-weight:600}','type'],['.x {font-size:.85em}','type']])
        assert.deepEqual(scanUiText(text).map(v=>v.rule),[rule],text);
    // UR130, UR131, UR133: clickable divs, fixed-pixel geometry and a partial inert are caught; fractions are not.
    for(const [text,rule] of [['<div id="x" onclick="go()">','clickable-div'],['bar.style.width=(385*f)+"px";','pixel-geometry'],["i.style.width='50px';",'pixel-geometry'],['main_content.inert=true;','partial-inert']])
        assert.deepEqual(scanUiText(text).map(v=>v.rule),[rule],text);
    assert.deepEqual(scanUiText('bar.style.width=`${f*100}%`;i.style.width="0px";<button onclick="go()">'),[]);
    // DL10: literal motion timing is caught; token timing and none are not.
    for(const text of ['.x {transition: width .2s}','.x {animation: pulse 900ms ease-out 1}','.x {animation-duration: 1s}'])assert.deepEqual(scanUiText(text).map(v=>v.rule),['motion'],text);
    assert.deepEqual(scanUiText('.x {transition: width var(--ui-motion-normal, .2s)} .y {transition:none;animation:none}'),[]);
    assert.deepEqual(scanUiText('button.x {min-height:var(--ui-control-sm);height:auto} .y {z-index:var(--ui-layer-popover);line-height:var(--ui-line-body);font-weight:var(--ui-weight-strong);font-size:inherit} .panel {min-height:420px}'),[]);
});
test('UI inventory uses portable ledger paths and excludes the token owner on every platform',()=>{
    const root=mkdtempSync(join(tmpdir(),'oops-ui-contract-'));
    try {
        for(const dir of ['styles','src'])mkdirSync(join(root,dir));
        for(const file of ['style.css','index.html'])writeFileSync(join(root,file),'');
        writeFileSync(join(root,'styles','ui_tokens.css'),':root {--ui-accent:#abcdef;}');
        writeFileSync(join(root,'src','example.js'),'el.style.padding="4px";');
        const hits=uiViolations(root);
        assert.equal(hits.length,1);
        assert.equal(hits[0].path,'src/example.js');
        assert.ok(hits[0].key.startsWith('src/example.js|spacing|'));
    } finally {rmSync(root,{recursive:true,force:true});}
});
test('foreign-host findings identify the receiving panel, while dynamic targets remain guarded',()=>{
    const hits=scanUiText("const actions=document.getElementById('location_actions_div');\nactions.append(panel);\ndocument.getElementById('character_combat_management')?.prepend(playerPanel);\nactions.after(section);");
    assert.deepEqual(hits.filter(h=>h.rule==='foreign-host').map(h=>h.targets),[['location_actions_div'],['character_combat_management']]);
    assert.equal(scanUiText('const host=document.getElementById(panelId);\nhost.append(panel);')[0].rule,'foreign-host');
    assert.deepEqual(scanUiText('@media (max-width:1050px) {.x {padding:var(--ui-space-2);}}'),[]);
    assert.equal(scanUiText('@media (max-width:1050px) {.x {padding:4px;}}')[0].rule,'spacing');
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
