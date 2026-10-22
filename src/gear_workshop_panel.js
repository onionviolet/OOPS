import {definePanel} from './panel_kit.js';
import {GEAR_ACTIONS} from './gear_work.js';
const el = (tag, text) => {const n = document.createElement(tag); if(text != null) n.textContent = text; return n;};
const labels = {attack_points:'Attack precision',cold_tolerance:'Cold tolerance',crit_resistance:'Critical resistance',damage_taken:'Damage taken',min_damage_share:'Minimum share of a hit',stamina_efficiency:'Stamina efficiency',attack_speed:'Attack speed',attack_power:'Attack power'};
const select = label => {const n = el('select'); n.setAttribute('aria-label', label); return n;};
const choice = (value, label) => {const n = el('option', label); n.value = value; return n;};
export function createGearWorkshopPanel({read, quote, execute}) {
    const panel = el('section'); panel.id = 'gear_workshop'; panel.className = 'expedition_panel';
    const maker = select('Maker'), items = select('Carried gear'), action = select('Gear process'), material = select('Process material'), role = select('Material role'), slot = select('Structural component');
    const inspect = el('div'), details = el('div'), notice = el('p'), run = el('button', 'Apply quoted process');
    run.type = 'button'; run.dataset.gearCommit = ''; notice.setAttribute('role', 'status');
    panel.append(el('h2', 'Gear workshop'), el('p', 'Work on carried gear. Materials, process and maker control decide the result. Unequip an item before changing it.'),
        maker, items, inspect, action, material, role, slot, details, run, notice);
    for(const [id, label] of Object.entries(GEAR_ACTIONS)) action.append(choice(id, label));
    let signature = '', q;
    const request = () => ({maker: maker.value||'player',action: action.value, key: items.value, material: material.value, role: role.value, slot: slot.value});
    const fill = (node, rows, empty) => {const value = node.value; node.replaceChildren(choice('', empty), ...rows.map(([id,name]) => choice(id, name))); if(rows.some(([id]) => id === value)) node.value = value;};
    function render() {
        if(!panel.isConnected) return;
        const view = read(), sig = JSON.stringify([view, request()]); if(sig === signature) return; signature = sig;
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
        }
        const a = action.value;
        material.hidden = !['attach','swap','repair','fieldRepair','quench','socket','reforge'].includes(a);
        role.hidden = !['attach','detach'].includes(a); slot.hidden = a !== 'swap';
        q = quote(request()); run.disabled = !q.eligible;
        details.replaceChildren(el('p', q.eligible ? q.summary : q.reason));
        if(q.eligible) for(const row of q.spend.slice(1)) details.append(el('p', `Consumes ${view.materials.find(m => m.key === row.key)?.name || JSON.parse(row.key).id} ×${row.count}`));
    }
    for(const input of [maker, items, action, material, role, slot]) input.onchange = () => {signature = ''; render();};
    run.onclick = () => {
        try {const result = execute(q); notice.textContent = result.summary; signature = ''; render(); if(result.resultKey) {items.value = result.resultKey; render();}}
        catch(error) {notice.textContent = error.message; signature = ''; render();}
    };
    definePanel({id: 'gear-workshop', title: 'Gear workshop', role: 'actions', node: panel,
        home: document.getElementById('main_content'), defaultDock: 'center', discovered: () => read().discovered,
        eligible: () => read().discovered, unavailableReason: () => 'Visit a native forging station to work on gear.'});
    render(); return {render};
}
