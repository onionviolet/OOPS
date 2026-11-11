// Friends at school: the social contact acts for Harry's lead life (book_world_hp_contact.js) as their own panel, beside the household
// panel rather than inside it. It shows what each friend has on their mind about you as words, never a number (TIE24), and every act
// says why it cannot run (UR70-UR75). Desktop 1920x1080 first; mobile deferred.
import {registerDomain, domainRegistry} from './domain_registry.js';
import {definePanel} from './panel_kit.js';
import {readPort, whenPortsReady} from './ui_ports.js';
import {node} from './reference_kit.js';
import './book_world_hp_contact.js';

const WORLD = 'book.hp.lead.world';
const view = () => { try { return domainRegistry.project('socialContact'); } catch { return null; } };
const active = () => readPort('expansion')?.actors?.player?.worldId === WORLD && !!view()?.people?.length;
const act = (name, request) => domainRegistry.command('socialContact', name)(request);

function createPanel() {
    const panel = node('section', null, {id: 'hp_contact_panel', class: 'expedition_panel'});
    panel.dataset.surfaceType = 'place-service';
    const body = node('div');
    panel.append(node('h2', 'Friends at school'), body);
    let notice = '', last = '';
    const button = (label, attrs, run) => {
        const b = node('button', label, attrs); b.type = 'button';
        b.onclick = () => { try { notice = run() || ''; } catch(e) { notice = e.message; } render(true); };
        return b;
    };
    const render = (force = false) => {
        const v = view(), key = JSON.stringify(v) + notice;
        if(!force && key === last) return;
        last = key; body.replaceChildren();
        if(!v?.people?.length) { body.append(node('p', 'No one at school knows you well enough yet.')); return; }
        for(const p of v.people) {
            const s = node('section', null, {class: 'ui-panel-section', 'data-contact-person': p.id});
            s.append(node('h3', p.name));
            if(p.birthday) s.append(node('p', `It is ${p.name}’s birthday today.`, {'data-contact-birthday': ''}));
            if(p.lines.length) {
                const ul = node('ul', null, {'aria-label': `On ${p.name}’s mind lately`});
                for(const line of p.lines) ul.append(node('li', line, {'data-contact-line': ''}));
                s.append(node('p', `On ${p.name}’s mind lately:`), ul);
            } else s.append(node('p', `Nothing you did lately is on ${p.name}’s mind. Time together, or a small present, would be.`));
            const talk = button(p.talk.label, {'data-contact-talk': p.id}, () => {
                const r = act('talk', {person: p.id});
                return r.counted ? `You and ${p.name} talked for a while.` : `You and ${p.name} talked again. You have already caught up today, so it changes nothing.`;
            });
            talk.disabled = !p.here;
            s.append(talk);
            for(const g of p.gifts) {
                const b = button(g.label, {'data-contact-gift': g.key}, () => `${p.name}: ${act('give', {person: p.id, key: g.key}).line}.`);
                b.disabled = !p.here; s.append(b);
            }
            if(!p.here && p.reason) s.append(node('p', p.reason));
            else if(p.giftReason) s.append(node('p', p.giftReason));
            body.append(s);
        }
        if(v.takeables.length) {
            const t = node('section', null, {class: 'ui-panel-section', 'data-contact-table': ''});
            t.append(node('h3', 'From the house table'));
            for(const row of v.takeables) {
                const b = button(row.label, {'data-contact-take': row.id}, () => { act('take', {id: row.id}); return 'You wrapped it in a napkin and put it in your pocket.'; });
                b.disabled = !row.eligible;
                t.append(b, node('p', row.eligible ? row.description : row.reason));
            }
            body.append(t);
        }
        if(notice) body.append(node('p', notice, {role: 'status', 'data-contact-notice': ''}));
    };
    panel.render = render;
    whenPortsReady(() => render(true));
    setInterval(() => { if(panel.isConnected && panel.offsetParent !== null) render(false); }, 2000);
    definePanel({id: 'hp-contact', title: 'Friends at school', role: 'actions', node: panel, home: document.getElementById('main_content'),
        perspective: WORLD, access: active, discovered: active, eligible: active, emptyText: 'Meet someone at school to see this'});
    return panel;
}

let panel = null;
registerDomain({id: 'hp_contact_panel', deps: ['socialContact'], initialState: () => null, refresh: () => panel?.render(false), panels: [() => { panel = createPanel(); }]});
