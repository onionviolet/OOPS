// R22c browser check: fill the center and color the inventory (FC2–FC7, FC11–FC14, FC17).
// Rebuilt bundle, fresh origin per case, synthetic fixtures only. 1920×1080 14px unless noted.
// Usage: R4_URL=http://127.0.0.1:19496 node check-r22c.cjs
// D1 letters off by default: no visible letter on rows or log lines; the setting "always" shows them.
// D2 hover links: a current-wave line marks exactly one row; a row marks only its own lines.
// D3 same text, one line: a ×N line's occurrences name more than one opponent where they merged.
// D4 Target and Encounter: both halves visible; Defeated and per-kind counts agree with the rows.
// D5 idle item detail: opens beside the actions, Around you stays visible, the top row keeps its fit.
// D6 inventory color: each tab's hue equals its kind token; "new" marker reads as a word.
// D7 fight tab: Usable while fighting, the stored idle tab after the fight flag clears.
const T=require('./target-set.cjs');const {L}=T;const {fs,path,assert}=L;
const fight=fs.readFileSync(path.join(__dirname,'evidence/r20/fixtures/opponents-8-mixed.save.txt'),'utf8').trim();
const PRIMARY=[{name:'1920',w:1920,h:1080,dpr:1,font:14}];
const run=async(p,ms)=>{await p.evaluate(()=>simulationTestHooks.resume());await p.waitForTimeout(ms);await p.evaluate(()=>simulationTestHooks.pause());};
const E=path.join(__dirname,'evidence/r22c');fs.mkdirSync(E,{recursive:true});
const results={};
const one=async(b,fn,opts)=>{const [r]=await T.forTargets(b,fn,{list:PRIMARY,...opts});if(r.fail)throw new Error(r.fail);return r;};
(async()=>{const b=await T.launch(600);try{
    // D1–D4, D7 (fight half)
    results.fight=await one(b,async p=>{await run(p,7000);
        const vis=await p.evaluate(()=>{const after=n=>getComputedStyle(n,'::after');
            return {rowLetters:[...document.querySelectorAll('#opponent_list .enemy-card-name')].filter(n=>after(n).display!=='none'&&after(n).content!=='none').length,
                logLetters:[...document.querySelectorAll('#message_log_div .log-letter')].filter(n=>n.checkVisibility()).length,
                names:[...document.querySelectorAll('#opponent_list .enemy-card-name')].map(n=>n.textContent)};});
        assert.equal(vis.rowLetters,0,'D1 no letter on rows');assert.equal(vis.logLetters,0,'D1 no letter in Reports');assert.ok(vis.names.every(n=>/rat$/.test(n)),'D1 rows show names');
        // D2
        const line=p.locator('#message_log_div .message_combat[data-combat-slot]:not([data-combat-slot="many"])').last();await line.hover();await p.waitForTimeout(150);
        const fromLine=await p.evaluate(()=>document.querySelectorAll('.enemy-card[data-linked]').length);assert.equal(fromLine,1,'D2 a line marks one row');
        const row=p.locator('#opponent_list .enemy-card[data-slot]').nth(3);await row.hover();await p.waitForTimeout(150);
        const fromRow=await p.evaluate(()=>{const slot=document.querySelector('#opponent_list .enemy-card[data-linked]')?.dataset.slot;const lines=[...document.querySelectorAll('#message_log_div [data-linked]')];return {slot,lines:lines.length,same:lines.every(l=>l.dataset.combatSlot===slot)};});
        assert.ok(fromRow.same,'D2 a row marks only its own lines');
        // D3
        const merged=await p.evaluate(()=>[...document.querySelectorAll('#message_log_div .message_combat[data-combat-slot="many"]')].map(n=>(n.combatOccurrences||[]).join(' | ')));
        // D4
        const enc=await p.evaluate(()=>{const v=document.querySelector('#current_focus .encounter-summary'),t=document.querySelector('#current_focus .opponent-target');const facts=Object.fromEntries([...v.querySelectorAll('dl > div')].map(d=>[d.firstChild.textContent,d.lastChild.textContent]));
            return {enc:v.checkVisibility(),target:t.checkVisibility(),facts,defeatedRows:document.querySelectorAll('#opponent_list .enemy-card[data-defeated="true"]').length,rows:document.querySelectorAll('#opponent_list .enemy-card').length};});
        assert.ok(enc.enc&&enc.target,'D4 Target and Encounter both visible');assert.equal(enc.facts.Defeated,`${enc.defeatedRows} of ${enc.rows}`,'D4 Defeated agrees with the rows');
        // D7 fight half
        const tab=await p.evaluate(()=>document.querySelector('.inventory-tabs > button[aria-pressed="true"]')?.dataset.category);assert.equal(tab,'usable','D7 a fight opens Usable');
        await p.evaluate(()=>{document.getElementById('main_content').dataset.parityCombat='false';});await p.waitForTimeout(100);
        const back=await p.evaluate(()=>document.querySelector('.inventory-tabs > button[aria-pressed="true"]')?.dataset.category);assert.equal(back,'all','D7 the idle tab returns when the fight flag clears');
        return {vis,fromLine,fromRow,merged:merged.slice(0,3),mergedCount:merged.length,encounter:enc.facts};},{data:fight});
    // D3 on eight of one kind, where same-text lines meet often.
    results.merge=await one(b,async p=>{let m=[];for(let t=0;t<6&&!m.length;t++){await run(p,4000);m=await p.evaluate(()=>[...document.querySelectorAll('#message_log_div .message_combat[data-combat-slot="many"]')].map(n=>({repeat:Number(n.dataset.repeat),occ:n.combatOccurrences||[]})));}
        assert.ok(m.length>0,'D3 a merged line within 24s');const first=m[0],labels=new Set(first.occ.map(o=>o.split(' · ')[1]).filter(Boolean));
        assert.equal(first.occ.length,first.repeat,'D3 one occurrence per event');assert.ok(labels.size>=2,`D3 occurrences name two or more opponents: ${first.occ.join(' | ')}`);return {merged:m.length,sample:first.occ};},{data:fs.readFileSync(path.join(__dirname,'evidence/r20/fixtures/opponents-8.save.txt'),'utf8').trim()});
    // D1 with letters always on.
    results.always=await one(b,async p=>{await run(p,4000);return p.evaluate(()=>({rowLetters:[...document.querySelectorAll('#opponent_list .enemy-card-name')].filter(n=>getComputedStyle(n,'::after').display!=='none').length,logLetters:[...document.querySelectorAll('#message_log_div .log-letter')].filter(n=>n.checkVisibility()).length}));},
        {data:fight,storage:{'yairpg.display.v1':JSON.stringify({'panel.opponents.letters':'always'})}});
    assert.ok(results.always.rowLetters>=8&&results.always.logLetters>0,'D1 the setting brings letters back');
    // D5, D6 idle (populated fixture)
    results.idle=await one(b,async p=>{const top0=await p.evaluate(()=>getComputedStyle(document.querySelector('.workspace-board')).gridTemplateRows);
        await p.locator('#inventory_content_div > .inventory_item_control:visible').first().click();await p.waitForTimeout(500);
        const r=await p.evaluate(()=>{const d=document.querySelector('.workspace-module[data-module="shell-detail"]'),f=document.querySelector('.workspace-module[data-module="focus"]');
            return {detail:d?.closest('[data-region]')?.dataset.region,detailShown:!!d&&d.checkVisibility(),aroundShown:!!f&&f.checkVisibility()&&f.getBoundingClientRect().height>60,actions:document.querySelector('[data-module="local-actions"]').checkVisibility(),
                top:getComputedStyle(document.querySelector('.workspace-board')).gridTemplateRows,page:document.documentElement.scrollHeight<=innerHeight};});
        assert.equal(r.detail,'actions','D5 detail beside the actions');assert.ok(r.detailShown&&r.aroundShown&&r.actions&&r.page,'D5 detail, Around you and actions all visible');
        assert.equal(r.top.split(' ')[0],top0.split(' ')[0],'D5 the top row keeps its fit');
        const tabs=await p.evaluate(()=>{const root=getComputedStyle(document.getElementById('main_content'));const out={};for(const b of document.querySelectorAll('.inventory-tabs > button[data-category]')){const hue=getComputedStyle(b).getPropertyValue('--tab-hue').trim();out[b.dataset.category]=hue;}
            const row=document.querySelector('#inventory_content_div > .inventory_item_control');row.setAttribute('data-item-new','');const after=getComputedStyle(row.querySelector('.item_name'),'::after').content;row.removeAttribute('data-item-new');
            return {hues:out,tokens:{equipment:root.getPropertyValue('--p23-item-equipment').trim(),usable:root.getPropertyValue('--p23-item-usable').trim(),other:root.getPropertyValue('--p23-item-component').trim()},after};});
        for(const k of ['equipment','usable','other'])assert.equal(tabs.hues[k],tabs.tokens[k],`D6 ${k} tab hue`);assert.equal(tabs.after,'"new"','D6 new marker is a word');
        return {...r,tabs};});
} finally {await b.close();}
fs.writeFileSync(path.join(E,'check-r22c.json'),JSON.stringify(results,null,1));
console.log('check-r22c PASS D1-D7',JSON.stringify({merge:results.merge,encounter:results.fight.encounter}));})().catch(e=>{console.error('check-r22c FAIL',e.message);process.exit(1);});
