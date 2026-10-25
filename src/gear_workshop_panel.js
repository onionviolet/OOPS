import {definePanel} from './panel_kit.js';
import {GEAR_ACTIONS} from './gear_work.js';
import {panelSection,labelControl,quotedActionList} from './ui/panel_sections.js';
const el = (tag, text) => {const n = document.createElement(tag); if(text != null) n.textContent = text; return n;};
const labels = {attack_points:'Attack precision',cold_tolerance:'Cold tolerance',crit_resistance:'Critical resistance',damage_taken:'Damage taken',min_damage_share:'Minimum share of a hit',stamina_efficiency:'Stamina efficiency',attack_speed:'Attack speed',attack_power:'Attack power'};
const select = label => {const n = el('select'); n.setAttribute('aria-label', label); return n;};
const choice = (value, label) => {const n = el('option', label); n.value = value; return n;};
export function createGearWorkshopPanel({read, quote, execute, prepareHide,repairer}) {
    const panel = el('section'); panel.id = 'gear_workshop'; panel.className = 'expedition_panel';
    const maker = select('Maker'), items = select('Carried gear'), action = select('Gear process'), material = select('Process material'), role = select('Material role'), slot = select('Structural component');
    const affix=select('Inscription to reroll');
    const focus = select('Process control');
    focus.append(choice('', 'Work by hand'), choice('focus', 'Use measured focus for precision'));
    const inspect = el('div'), details = el('div'), notice = el('p'), run = el('button', 'Apply quoted process'), hides = el('div');
    panel.classList.add('ui-workbench');
    const subject=panelSection('1 · Choose carried gear'), process=panelSection('2 · Plan the work'), review=panelSection('3 · Review and apply');
    const subjectFields=el('div'),processFields=el('div');subjectFields.className=processFields.className='ui-field-grid';
    subjectFields.append(labelControl(maker,'Maker'),labelControl(items,'Carried equipment'));
    processFields.append(labelControl(action,'Process'),labelControl(material,'Material'),labelControl(role,'Material role'),labelControl(slot,'Component to replace'),labelControl(focus,'Process control'),labelControl(affix,'Inscription to reroll'));
    subject.body.append(subjectFields,inspect);process.body.append(processFields);review.body.append(details,run);
    run.type = 'button'; run.dataset.gearCommit = ''; notice.setAttribute('role', 'status');
    panel.append(el('h2', 'Gear workshop'), el('p', 'Work on carried gear. Materials, process and maker control decide the result. Unequip an item before changing it.'),
        subject.node,process.node,review.node,notice,hides);
    for(const [id, label] of Object.entries(GEAR_ACTIONS)) action.append(choice(id, label));
    let signature = '', q;
    const request = () => ({maker: maker.value||'player',action: action.value, key: items.value, material: material.value, role: role.value, slot: slot.value,affix:affix.value,
        ...(['quench','temper'].includes(action.value) && focus.value ? {focus: true} : {})});
    const fill = (node, rows, empty) => {const value = node.value; node.replaceChildren(choice('', empty), ...rows.map(([id,name]) => choice(id, name))); if(rows.some(([id]) => id === value)) node.value = value;};
    function render() {
        if(!panel.isConnected) return;
        const view = read(), sig = JSON.stringify([view, request()]); if(sig === signature) return; signature = sig;
        const openGroups=new Set([...hides.querySelectorAll('details[open]')].map(n=>n.dataset.actionGroup||n.dataset.workshopSection));
        const focused=panel.contains(document.activeElement)?document.activeElement.dataset.quotedAction:null;
        fill(maker,(view.makers||[{id:'player',name:'You',skill:view.maker.skill}]).map(m=>[m.id,`${m.name} · Forging ${m.skill}`]),'Choose maker');
        if(!maker.value)maker.value='player';
        fill(items, view.rows.map(r => [r.key, `${r.name} · ${r.quality}% quality · ${r.count} carried`]), 'Choose carried equipment');
        fill(material, view.materials.map(r => [r.key, `${r.name} ×${r.count}`]), 'Choose material when needed');
        fill(role, view.roles.map(r => [r,r]), 'Choose role');
        const item = view.rows.find(r => r.key === items.value);
        fill(slot, Object.entries(item?.components || {}), 'Choose component to replace');
        inspect.replaceChildren();
        if(item) {
            inspect.append(el('p', `Condition ${item.condition.toFixed(2)}/${item.max} · meaningful uses ${item.uses} · treatment ${item.work?.treatment.stage || 'untreated'}`));
            for(const [s,id] of Object.entries(item.components)) inspect.append(el('p', `${s}: ${id}`));
            if(item.need?.below != null) inspect.append(el('p', item.need.active ? `Cold need: air ${item.need.temperature}° chills this metal armor; hits wear it ×${item.need.factor}${item.need.insulation ? ` (lining insulates ${Math.round(item.need.insulation * 100)}%)` : ', a warm lining would insulate it'}.` : `Cold need: below ${item.need.below}° unlined metal armor wears faster; ${item.need.insulation ? 'a lining insulates it' : 'it needs a warm lining'}.`));
            if(item.properties) inspect.append(el('p', `Material hardness ${item.properties.strength.toFixed(1)} · toughness ${item.properties.toughness.toFixed(1)} · wear ×${item.properties.scale.toFixed(3)}`));
            for(const row of item.contributions) inspect.append(el('p', `${row.label}: ${labels[row.stat] || row.stat} ${row.multiplier != null ? '×' + row.multiplier : (row.flat >= 0 ? '+' : '') + row.flat}`));
            const history = item.work?.history || [];
            if(history.length) {const h = el('details'), summary = el('summary', `Work history (${history.length})`); h.append(summary); for(const r of history) h.append(el('p', `${r.action} · ${r.maker} · ${r.location} · game minute ${r.at}`)); inspect.append(h);}
        } else inspect.append(el('p',view.rows.length?'Select a carried item to inspect its condition, materials and existing work.':'No component-built gear is carried. This bench works on weapons, shields and assembled armor with replaceable parts. Simple clothing has no such parts here. Unequip suitable worn gear in Inventory first.'));
        const a = action.value;affix.hidden=a!=='reroll';fill(affix,(item?.affixes||[]).filter(a=>a.s!=='mechanism').map(a=>[a.id,`${a.id}: ${a.v}`]),'Choose rolled inscription');
        focus.hidden = !view.focusKnown || !['quench','temper'].includes(a) || maker.value !== 'player';
        if(focus.hidden) focus.value = '';
        material.hidden = !['attach','swap','repair','fieldRepair','quench','socket','reforge'].includes(a);
        role.hidden = !['attach','detach'].includes(a); slot.hidden = a !== 'swap';
        q = quote(request()); run.disabled = !q.eligible;
        run.setAttribute('aria-describedby','gear-workshop-quote');details.id='gear-workshop-quote';
        details.replaceChildren(el('p', q.eligible ? q.summary : q.reason));
        const local=panelSection('Local repairer',{description:view.repairerStatus}),treatments=panelSection('Prepare hides',{description:'Choose a treatment to see its material needs and result.',disclosure:true});
        treatments.node.dataset.workshopSection='hides';
        const activate=(rows,fn)=>id=>{try{notice.textContent=fn(rows.find(r=>r.id===id).quote).summary;}catch(e){notice.textContent=e.message;}signature='';render();};
        local.body.append(quotedActionList((view.repairer||[]).map(r=>({...r,enabled:r.quote.eligible,reason:r.quote.reason,attributes:{'data-mender-action':r.id}})),{id:'gear-repairer',activate:activate(view.repairer||[],repairer)}));
        for(const h of view.hides || []) {const row=el('div');row.className='ui-action-row';row.append(el('p',h.note),quotedActionList([{...h,enabled:h.quote.eligible,reason:h.quote.reason,attributes:{'data-hide-treatment':h.id}}],{id:'gear-hide-'+h.id,activate:activate(view.hides,prepareHide)}));treatments.body.append(row);}
        hides.replaceChildren(local.node,treatments.node);
        for(const n of hides.querySelectorAll('details'))if(openGroups.has(n.dataset.actionGroup||n.dataset.workshopSection))n.open=true;
        if(focused)[...hides.querySelectorAll('[data-quoted-action]')].find(n=>n.dataset.quotedAction===focused)?.focus({preventScroll:true});
        if(q.eligible) for(const row of q.spend.slice(1)) details.append(el('p', `Consumes ${view.materials.find(m => m.key === row.key)?.name || JSON.parse(row.key).id} ×${row.count}`));
    }
    for(const input of [maker, items, action, material, role, slot, focus,affix]) input.onchange = () => {signature = ''; render();};
    run.onclick = () => {
        try {const result = execute(q); notice.textContent = result.summary; signature = ''; render(); if(result.resultKey) {items.value = result.resultKey; render();}}
        catch(error) {notice.textContent = error.message; signature = ''; render();}
    };
    definePanel({id: 'gear-workshop', title: 'Gear workshop', role: 'actions', node: panel,
        home: document.getElementById('main_content'), defaultDock: 'center', discovered: () => read().discovered,
        eligible: () => read().discovered, unavailableReason: () => 'Visit a native forging station to work on gear.'});
    render(); return {render};
}
