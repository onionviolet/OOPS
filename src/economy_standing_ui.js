import {definePanel} from './panel_kit.js';
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
        factions.replaceChildren(node('h3', 'Houses'));
        for(const f of v.factions) {
            const row = node('p', `${f.label} (${f.region}): ${f.tier.label}, ${f.score}. Rival: ${f.rivalLabel}. Sells to you ${pct(f.tier.buy)}, buys from you ${pct(f.tier.sell)}.`);
            row.append(node('span', ` Why: ${f.tier.why}`, 'standing_why')); row.dataset.standingFaction = f.id; factions.append(row);
        }
        const last = v.deeds.at(-1);
        if(last) factions.append(node('p', `Last deed: ${last.deed}, ${last.moves.map(m => `${m.id.replace('_', ' ')} ${signed(m.amount)}${m.backlash ? ' (rival backlash)' : ''}`).join('; ')}.`, 'expedition_preview'));
        paths.replaceChildren(node('h3', 'Worn paths'));
        if(!v.wear.length) paths.append(node('p', 'Walk the same road often and it gets quicker: up to a quarter off.', 'expedition_preview'));
        for(const w of v.wear.slice(0, 6)) { const row = node('p', `${w.leg}: ${w.count} trips, ${Math.round(w.gain * 1000) / 10}% quicker (a worn path, capped by the ground).`); row.dataset.wornPath = w.leg; paths.append(row); }
        credit.replaceChildren(node('h3', 'Credit'));
        for(const c of v.credit) {
            const line = node('div'); line.dataset.creditRow = c.factionId;
            const f = v.factions.find(x => x.id === c.factionId);
            const status = f.loan ? ` You owe ${f.loan.owed}; ${f.loan.overdue ? 'overdue' : `due in ${f.loan.daysLeft} days`}.` : '';
            line.append(node('span', `${c.label}: limit ${c.limit}, rate ${Math.round(c.rate * 100)}% per ${c.termDays} days.${status} ${c.reason}`));
            for(const n of [10, 25]) {
                const b = node('button', `Borrow ${n}`); b.type = 'button'; b.disabled = !c.eligible || n > c.available;
                b.onclick = () => act(() => borrow(c.factionId, n), `Borrowed ${n} coins from the ${c.label}.`); line.append(b);
            }
            if(f.loan) {
                const b = node('button', `Repay ${f.loan.owed}`); b.type = 'button'; b.disabled = v.coins < 1;
                b.onclick = () => act(() => repay(c.factionId, f.loan.owed), `Paid toward the ${c.label}.`); line.append(b);
            }
            credit.append(line);
        }
        if(v.insurance) credit.append(node('p', `Policy on ${v.insurance.label}: pays up to ${v.insurance.payout} on a loss (premium paid ${v.insurance.premium}).`));
        for(const c of v.claims) credit.append(node('p', `Owed to you by the broker: ${c.amount} coins, due in ${Math.max(0, Math.ceil((c.due - v.now) / 1440))} days.`));
        if(!v.insurance) {
            const line = node('div'); line.dataset.insuranceRow = '';
            const o = v.insuranceOffer;
            const b = node('button', `Insure ${o.value} coins of cargo`); b.type = 'button'; b.dataset.insure = ''; b.disabled = !o.eligible || v.coins < o.premium;
            b.onclick = () => act(() => insure(o.value, o.danger, 'carried cargo'), 'Cargo insured.');
            const text = o.eligible
                ? `No policy. Road danger here is ${o.danger}, so the premium is ${o.premium} coins and a loss pays up to ${o.payout}. A mishap on the road (pickpockets, a dropped load) is what it pays on; the broker keeps ${o.fee} coins and settles in ${o.days} days. Why: ${o.why}`
                : `No policy. ${o.reason}`;
            const span = node('span', text); span.dataset.insuranceQuote = '';
            line.append(span, b); credit.append(line);
        }
        memory.replaceChildren(node('h3', 'What you remember of prices'));
        if(!v.memory.length) memory.append(node('p', 'Nothing yet. Trade and you will remember what things fetched.', 'expedition_preview'));
        for(const m of v.memory.slice(0, 8)) {
            const row = node('p', `${m.label} in ${m.region}: ${m.price}, ${m.ageDays} days ago${m.stale ? ' (stale, a guess now)' : ''}.`);
            row.dataset.memoryRow = m.key; memory.append(row);
        }
        rumours.replaceChildren(node('h3', 'Talk'));
        if(!v.rumours.length) rumours.append(node('p', 'No one has repeated a price to you.', 'expedition_preview'));
        for(const r of v.rumours.slice(-5).reverse()) {
            const verdict = r.verdict ? (r.verdict === 'held' ? ' It held up.' : ' It was wrong.') : '';
            const row = node('p', `${r.text}. Sounds ${r.sounds}.${verdict}`); row.dataset.rumourRow = r.id; rumours.append(row);
        }
        notice.hidden = !notice.textContent;
    }
    definePanel({id: 'economy_standing', title: 'Standing and ledger', role: 'records', node: panel, home: document.getElementById('main_content'),
        discovered: () => { const v = read(); return v.state.deeds.length > 0 || v.memory.length > 0 || Object.keys(v.state.loans).length > 0; },
        eligible: () => true, unavailableReason: () => 'Trade with a house to build standing'});
    render();
    return {render};
}
