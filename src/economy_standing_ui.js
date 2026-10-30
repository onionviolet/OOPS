import {definePanel} from './panel_kit.js';
import {chip, infoRow, reasonLine, panelSection} from './ui/panel_sections.js';
// Desktop-first (UI target 1536/1920; mobile deferred, AD/standing UI priority). Surface type:
// records panel in the main workspace (UR1). Read-only except the Borrow/Repay buttons, which
// call the domain and report its refusal text in place.
const node = (tag, text = '', className = '') => {
    const n = document.createElement(tag);
    if(text) n.textContent = text;
    if(className) n.className = className;
    return n;
};
const pct = m => `${m >= 1 ? '+' : '−'}${Math.abs(Math.round((m - 1) * 1000) / 10)}%`;
const signed = n => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n)}`;

// The per-part breakdown shown beside the trade total (one line per term).
export function renderStandingTerms(box, terms) {
    box.replaceChildren();
    if(!terms || !terms.parts.length) { box.hidden = true; return; }
    box.hidden = false;
    box.append(node('strong', 'Standing in this price'));
    for(const part of terms.parts) {
        const row = node('p', `${part.label}: selling ${pct(part.sell)}, buying ${pct(part.buy)}`);
        row.append(node('span', ` Why: ${part.why}`, 'standing_why')); row.dataset.standingPart = part.id;
        box.append(row);
    }
    const total = node('p', `Together: selling ${pct(terms.sell)}, buying ${pct(terms.buy)}. Item prices listed above are before standing.`);
    total.dataset.standingTotal = ''; box.append(total);
}

export function createEconomyStandingPanel({read, borrow, repay, insure}) {
    const panel = node('section', '', 'expedition_panel');
    panel.id = 'economy_standing_panel'; panel.dataset.surfaceType = 'records';
    const factions = node('div'), paths = node('div'), credit = node('div'), memory = node('div'), rumours = node('div'), notice = node('p');
    notice.setAttribute('role', 'status');
    panel.append(node('h2', 'Standing and ledger'), factions, paths, credit, memory, rumours, notice);
    let signature = '';
    const act = (fn, done) => { try { fn(); notice.textContent = done; } catch(e) { notice.textContent = e.message; } render(); };
    function render() {
        const v = read();
        const next = JSON.stringify([v.factions.map(f => [f.score, f.loan]), v.credit, v.wear, v.claims, v.memory, v.rumours, v.insurance, v.insuranceOffer, v.coins, notice.textContent]);
        if(next === signature) return; signature = next;
        // Houses are one table (UR79): standing and both price shifts in columns, the rival and the reason one disclosure away.
        factions.replaceChildren(node('h3', 'Houses'));
        const table = node('table', '', 'ui-table'); table.dataset.standingTable = '';
        const head = node('tr'); for(const h of ['House', 'Standing', 'Sells to you', 'Buys from you']) { const th = node('th', h); th.scope = 'col'; head.append(th); }
        const body = node('tbody'); table.append(node('thead'), body); table.firstChild.append(head);
        for(const f of v.factions) {
            const tr = node('tr'); tr.dataset.standingFaction = f.id;
            const who = node('td', f.label); who.append(node('small', ` ${f.region}`));
            const stand = node('td'); stand.append(chip(f.tier.label, {tone: f.tier.buy > 1 ? 'warn' : f.tier.sell > 1 ? 'good' : ''}), ` ${f.score}`);
            const sells = node('td', pct(f.tier.buy), 'ui-num'), buys = node('td', pct(f.tier.sell), 'ui-num');
            tr.title = `Rival: ${f.rivalLabel}. Why: ${f.tier.why}`;
            tr.append(who, stand, sells, buys); body.append(tr);
        }
        factions.append(table);
        const why = panelSection('Why each house stands here', {disclosure: true}); why.node.dataset.standingWhy = '';
        for(const f of v.factions) { const p = node('p', `${f.label}: ${f.tier.why} Rival: ${f.rivalLabel}.`); p.className = 'standing_why'; why.body.append(p); }
        factions.append(why.node);
        const last = v.deeds.at(-1);
        if(last) factions.append(node('p', `Last deed: ${last.deed}, ${last.moves.map(m => `${m.id.replace('_', ' ')} ${signed(m.amount)}${m.backlash ? ' (rival backlash)' : ''}`).join('; ')}.`, 'expedition_preview'));
        const wear = panelSection(`Worn paths · ${v.wear.length}`, {disclosure: true}); wear.node.dataset.section = 'worn-paths';
        paths.replaceChildren(wear.node);
        if(!v.wear.length) wear.body.append(node('p', 'Walk the same road often and it gets quicker, up to a quarter off.', 'expedition_preview'));
        for(const w of v.wear.slice(0, 6)) { const row = infoRow({label: w.leg, chips: [chip(`${w.count} trips`), chip(`${Math.round(w.gain * 1000) / 10}% quicker`, {tone: 'good'})], more: 'A worn path is capped by the ground.', moreLabel: 'Limit'}); row.dataset.wornPath = w.leg; wear.body.append(row); }
        credit.replaceChildren(node('h3', 'Credit'));
        for(const c of v.credit) {
            const f = v.factions.find(x => x.id === c.factionId);
            const chips = [chip(`limit ${c.limit}`), chip(`${Math.round(c.rate * 100)}% per ${c.termDays} days`)];
            if(f.loan) chips.push(chip(`owe ${f.loan.owed}`, {tone: 'warn'}), chip(f.loan.overdue ? 'overdue' : `due in ${f.loan.daysLeft} days`, {tone: f.loan.overdue ? 'limit' : ''}));
            const actions = [], reasons = [];
            for(const n of [10, 25]) {
                const b = node('button', `Borrow ${n}`); b.type = 'button'; b.disabled = !c.eligible || n > c.available;
                if(b.disabled) reasons.push(!c.eligible ? c.reason : `Only ${c.available} left to borrow.`);
                b.onclick = () => act(() => borrow(c.factionId, n), `Borrowed ${n} coins from the ${c.label}.`); actions.push(b);
            }
            if(f.loan) {
                const b = node('button', `Repay ${f.loan.owed}`); b.type = 'button'; b.disabled = v.coins < 1;
                if(b.disabled) reasons.push('You have no coins to repay with.');
                b.onclick = () => act(() => repay(c.factionId, f.loan.owed), `Paid toward the ${c.label}.`); actions.push(b);
            }
            // The disabled reason sits beside the buttons, once, not in a tooltip.
            if(reasons.length) actions.push(reasonLine([...new Set(reasons)].join(' ')));
            const line = infoRow({label: c.label, chips, actions, more: c.reason}); line.dataset.creditRow = c.factionId; credit.append(line);
        }
        if(v.insurance) credit.append(node('p', `Policy on ${v.insurance.label}: pays up to ${v.insurance.payout} on a loss (premium paid ${v.insurance.premium}).`));
        for(const c of v.claims) credit.append(node('p', `Owed to you by the broker: ${c.amount} coins, due in ${Math.max(0, Math.ceil((c.due - v.now) / 1440))} days.`));
        if(!v.insurance) {
            const o = v.insuranceOffer;
            const b = node('button', `Insure ${o.value} coins of cargo`); b.type = 'button'; b.dataset.insure = ''; b.disabled = !o.eligible || v.coins < o.premium;
            b.onclick = () => act(() => insure(o.value, o.danger, 'carried cargo'), 'Cargo insured.');
            const actions = [b];
            if(b.disabled) actions.push(reasonLine(!o.eligible ? o.reason : `You need ${o.premium} coins for the premium.`));
            const chips = o.eligible ? [chip('no policy'), chip(`premium ${o.premium}`), chip(`pays up to ${o.payout}`)] : [chip('no policy')];
            const more = o.eligible
                ? `Road danger here is ${o.danger}, so the premium is ${o.premium} coins and a loss pays up to ${o.payout}. A mishap on the road (pickpockets, a dropped load) is what it pays on; the broker keeps ${o.fee} coins and settles in ${o.days} days. Why: ${o.why}`
                : o.reason;
            const line = infoRow({label: 'Cargo insurance', chips, actions, more, moreLabel: 'Terms'}); line.dataset.insuranceRow = '';
            line.querySelector('.ui-row-more p').dataset.insuranceQuote = ''; credit.append(line);
        }
        const mem = panelSection(`What you remember of prices · ${v.memory.length}`, {disclosure: true}); mem.node.dataset.section = 'price-memory';
        memory.replaceChildren(mem.node);
        if(!v.memory.length) mem.body.append(node('p', 'Nothing yet. Trade and you will remember what things fetched.', 'expedition_preview'));
        if(v.memory.length) {
            const mt = node('table', '', 'ui-table'), mh = node('tr'); for(const h of ['Good', 'Where', 'Price', 'Seen']) { const th = node('th', h); th.scope = 'col'; mh.append(th); }
            const mb = node('tbody'); mt.append(node('thead'), mb); mt.firstChild.append(mh);
            for(const m of v.memory.slice(0, 8)) {
                const tr = node('tr'); tr.dataset.memoryRow = m.key;
                const seen = node('td', `${m.ageDays} days ago`); if(m.stale) seen.append(' ', chip('a guess now', {guess: true}));
                tr.append(node('td', m.label), node('td', m.region), node('td', String(m.price), 'ui-num'), seen); mb.append(tr);
            }
            mem.body.append(mt);
        }
        const talk = panelSection(`Talk · ${v.rumours.length}`, {disclosure: true}); talk.node.dataset.section = 'talk';
        rumours.replaceChildren(talk.node);
        if(!v.rumours.length) talk.body.append(node('p', 'No one has repeated a price to you.', 'expedition_preview'));
        for(const r of v.rumours.slice(-5).reverse()) {
            const row = infoRow({label: r.text, chips: [chip(`sounds ${r.sounds}`, {guess: !r.verdict}), ...(r.verdict ? [chip(r.verdict === 'held' ? 'held up' : 'was wrong', {tone: r.verdict === 'held' ? 'good' : 'limit'})] : [])]});
            row.dataset.rumourRow = r.id; talk.body.append(row);
        }
        notice.hidden = !notice.textContent;
    }
    definePanel({id: 'economy_standing', title: 'Standing and ledger', role: 'records', node: panel, home: document.getElementById('main_content'),
        discovered: () => { const v = read(); return v.state.deeds.length > 0 || v.memory.length > 0 || Object.keys(v.state.loans).length > 0; },
        eligible: () => true, unavailableReason: () => 'Trade with a house to build standing'});
    render();
    return {render};
}
