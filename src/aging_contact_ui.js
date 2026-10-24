// Body-aging and contact panel. Reads one projection; every button calls a domain command that revalidates (AR7).
export function createAgingContactPanel({read, commands, stances}) {
    const node = (tag, text = '', cls = '') => {const n = document.createElement(tag);n.textContent = text;if(cls)n.className = cls;return n;};
    const panel = node('details', '', 'expedition_panel');panel.id = 'aging_contact_panel';panel.append(node('summary', 'Years & company'));
    const body = node('div'), status = node('p');status.setAttribute('role', 'status');panel.append(body, status);
    let notice = '';
    const run = (fn) => {try {fn();notice = '';} catch(error) {notice = error.message;}render();};
    function button(label, attrs, fn, disabled = false) {
        const b = node('button', label);b.type = 'button';b.disabled = disabled;Object.assign(b.dataset, attrs);b.addEventListener('click', () => run(fn));return b;
    }
    function render() {
        const {view, contacts, here, money, enrolled} = read(), host = document.getElementById('location_actions_div');
        if(!panel.isConnected)host?.append(panel);
        panel.hidden = false;
        body.replaceChildren();
        if(!enrolled || !view) {body.append(node('p', 'Begin a life chronicle in the People notebook to follow how years and company change your body.'));return;}
        body.append(node('p', view.summary, 'aging_summary'));
        const why = [...view.reasons.health.map(r => `Health: ${r}`), ...view.reasons.stamina.map(r => `Stamina: ${r}`)];
        if(why.length)body.append(node('p', `Why: ${why.join(' · ')}. ${view.dial.reason}`, 'expedition_requirements'));
        for(const c of view.conditions) {
            const card = node('section', '', 'expedition_card');card.dataset.agingCondition = c.id;
            card.append(node('p', c.diagnosed ? `${c.title} · stage ${c.severity}/3 · ${c.treated ? 'in care' : c.stance}` : `${c.symptom} (cause not yet known)`), node('p', c.next, 'expedition_requirements'));
            for(const [stance, def] of Object.entries(stances)) {
                const b = button(`${stance === 'ignore' ? 'Ignore' : 'Manage'}`, {agingStance: `${c.id}:${stance}`}, () => commands.stance(c.id, stance), c.stance === stance);
                b.title = def.text;card.append(b);
            }
            const t = button(`Treat · ${c.cost} coins`, {agingTreat: c.id}, () => commands.treat(c.id), money < c.cost || !here);
            t.title = 'A season of care from the Village healer: eases one stage and slows the condition to a tenth of its pace. The ceiling recovers; age itself does not.';
            card.append(t);body.append(card);
        }
        const k = view.contact, card = node('section', '', 'expedition_card');card.dataset.agingContact = k.phase;
        card.append(node('p', `Company: ${k.label} (${k.score}/100). ${k.text}`));
        if(!contacts.length)card.append(node('p', 'No one yet knows you well enough to visit or write to.', 'expedition_requirements'));
        for(const c of contacts) {
            card.append(button(`Sit with ${c.label}`, {agingCompany: c.id}, () => commands.company(c.id), !here));
            card.append(button(`Write to ${c.label} · 1 coin`, {agingLetter: c.id}, () => commands.letter(c.id), money < 1 || k.letters.some(l => l.to === c.id && l.status === 'pending') ));
        }
        for(const l of k.letters.filter(l => l.status === 'pending'))card.append(node('p', `A letter to ${l.name} is on its way.`, 'expedition_requirements'));
        if(!here)card.append(node('p', 'Treatment and visits happen in the Village. Letters can be written anywhere.', 'expedition_requirements'));
        body.append(card);
        status.textContent = notice;status.hidden = !notice;
    }
    render();return {render};
}
