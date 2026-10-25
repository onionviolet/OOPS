import {definePanel} from './panel_kit.js';
// Household life events: open moments with their choices, status of the people close to you, and what deaths have taught.
// Reads one projection; every button calls a domain command that revalidates (AR7). Desktop first (UR).
const el = (tag, text = '', cls = '') => {const n = document.createElement(tag);n.textContent = text;if(cls) n.className = cls;return n;};
export function createLifeEventsPanel({read, commands}) {
    const panel = el('section', '', 'expedition_panel');panel.id = 'life_events_panel';
    const body = el('div'), status = el('p');status.setAttribute('role', 'status');panel.append(body, status);
    let notice = '';
    const run = fn => {try {fn();notice = '';} catch(error) {notice = error.message;}render();};
    const button = (label, attrs, fn, disabled = false, title = '') => {
        const b = el('button', label);b.type = 'button';b.disabled = disabled;b.title = title;Object.assign(b.dataset, attrs);b.addEventListener('click', () => run(fn));return b;
    };
    const visible = () => {const v = read();return !!v && (v.hasLives || v.open.length > 0 || v.done.length > 0);};
    function render() {
        const v = read();
        panel.dataset.openCount = String(v?.open.length ?? 0);
        body.replaceChildren();
        if(!v) return;
        if(v.family){const f=v.family;body.append(el('h3','Household growth'),el('p',`Optional family decisions are ${f.enabled?'on':'off'}. Living married adults may choose a pregnancy at annual opportunities, with nine native-calendar months of gestation and rare twins. These households ordinarily plan to raise about ${f.perPair} children; a twin birth can change that plan. Turning this off pauses new conceptions; existing pregnancies keep their own course. No past births are invented when enabling it.`),button(f.enabled?'Pause new family decisions':'Allow autonomous household growth',{familyGrowth:''},()=>commands.familyPolicy(!f.enabled),!v.familyReady,'Discuss these plans while free in the writable Village.'));for(const pregnancy of f.pending)body.append(el('p',`${pregnancy.parents.join(' and ')}: expected birth in about ${pregnancy.days} calendar days.`));for(const loss of f.losses)body.append(el('p',`The pregnancy ended after ${loss.mother} died. This records its aftermath, without counting another person’s death.`));for(const child of f.children)body.append(el('p',`${child.name}: observed inherited qualities ${child.traits.map(t=>t.label+' '+t.level).join(', ')}. Their own robust-frame inheritance informs their ordinary aging; hidden alleles are not shown.`));}
        if(v.open.length) {
            const card = el('section', '', 'expedition_card');card.append(el('p', 'Moments waiting for you. Nothing is lost by leaving them.'));
            for(const e of v.open) {
                const row = el('div');row.dataset.eventId = e.id;row.dataset.eventKind = e.kind;row.append(el('p', e.text));
                for(const c of e.choices) row.append(button(c.cost ? `${c.label} · ${c.cost} coins` : c.label, {eventChoice: `${e.id}:${c.id}`}, () => commands.resolve(e.id, c.id), v.money < c.cost, c.tip));
                card.append(row);
            }
            body.append(card);
        } else body.append(el('p', 'No moments are waiting.', 'expedition_requirements'));
        if(v.mourning.length) body.append(el('p', `In mourning: ${v.mourning.map(m => `${m.name} (until year ${m.until})`).join(', ')}.`, 'expedition_requirements'));
        if(v.wards.length) body.append(el('p', `Cared for: ${v.wards.map(w => `${w.name} by ${w.by}`).join(', ')}.`, 'expedition_requirements'));
        if(v.bonds.length || v.candidates.length) {
            const card = el('section', '', 'expedition_card');card.dataset.bonds = '1';
            for(const b of v.bonds) {
                const row = el('div');row.dataset.bond = `${b.key}:${b.status}`;
                row.append(el('p', `${b.names}: ${b.status}${b.why ? ` (${b.why})` : ''}${b.status === 'widowed' ? '' : ''}`));
                if(b.actions.includes('mend')) row.append(button(`Make peace · ${v.costs.mend} coins`, {bondMend: b.key}, () => commands.bond('mend', b.a, b.b), v.money < v.costs.mend));
                if(b.actions.includes('part')) row.append(button('Part kindly', {bondPart: b.key}, () => commands.bond('part', b.a, b.b)));
                card.append(row);
            }
            for(const c of v.candidates) card.append(button(`Introduce ${c.names} · ${v.costs.introduce} coins`, {bondIntroduce: `${c.a}|${c.b}`}, () => commands.bond('introduce', c.a, c.b), v.money < v.costs.introduce));
            body.append(card);
        }
        if(v.forecast.length) {
            const card = el('section', '', 'expedition_card');card.dataset.forecast = '1';
            for(const f of v.forecast) card.append(el('p', f.text));
            body.append(card);
        }
        if(v.memories.length) body.append(el('p', `Remembered by: ${v.memories.map(m => `${m.name} (${m.count})`).join(', ')}. Latest: ${v.memories.map(m => m.last).filter(Boolean).at(-1) ?? ''}`, 'expedition_requirements'));
        for(const d of v.done) body.append(el('p', `${d.text} → ${d.choice}`, 'expedition_requirements'));
        status.textContent = notice;status.hidden = !notice;
    }
    definePanel({id: 'life-events', title: 'Family & farewells', role: 'records', node: panel, home: document.getElementById('main_content'), defaultDock: 'center', discovered: visible, eligible: visible});
    render();return {render};
}
