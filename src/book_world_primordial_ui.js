import {definePanel} from './panel_kit.js';
import {node, visibleRenderer} from './reference_kit.js';
// Surface type: records panel in the main workspace (UR1), desktop first (1366x768 and 1600x1000;
// mobile deferred). Actions: ask, start the mission, repay; each reports its result or refusal in place.
export function createPrimordialPanel({read, request, askRule, startShift, repay, buy}) {
    const root = node('section', null, {id: 'primordial_credit_panel', class: 'reference-panel expedition_panel', 'data-surface-type': 'records'});
    const intro = node('p'), hall = node('div'), wallet = node('div'), repayBox = node('div'), dials = node('div'), items = node('div'), ledger = node('div'), held = node('div'), refusal = node('div'), restart = node('div'), note = node('p', '', {role: 'status', 'aria-live': 'polite'});
    root.append(node('h2', 'Sect Library · priced credit'), intro, wallet, hall, items, refusal, ledger, repayBox, held, restart, dials, note);
    let draft = '';
    const act = (fn, done) => { try { fn(); if(done) note.textContent = done; } catch(e) { note.textContent = e.message; } render(true); };
    const render = visibleRenderer(root, () => ({v: read(), n: note.textContent}), ({v}) => {
        intro.textContent = `The Library elder keeps dated paper. Credit never exceeds a disciple's whole value${v.bodyValue == null ? '' : `; yours is recorded at ${v.bodyValue.toLocaleString()} CP (AUTHORED, not canon)`}. The first exchange is zero down at ${Math.round(v.dials.ratePerYear.value * 100)} percent a year, simple interest, repaid in flat yearly installments over ${v.dials.termYears.value} years.`;
        const f = n => n.toLocaleString(), d = v.dials;
        wallet.replaceChildren(node('h3', 'Contribution points and the mission'));
        wallet.append(node('p', `CP in hand: ${f(v.cp)}. Missions done: ${v.shifts}. Rent is ${d.rent.value} CP a month (SOURCE, recorded only, not charged here).`, {'data-primordial-cp': ''}));
        const left = v.shift ? Math.max(0, Math.ceil((v.shift.startedAt + d.taskMinutes.value - v.now) / 60)) : 0;
        wallet.append(node('p', `${v.task.label}: ${d.taskMinutes.value / 60} game hours, pays ${d.taskPay.value} CP less ${d.taskCost.value} CP for lamp oil, ${d.taskPerDay.value} a day. Prototype rates (AUTHORED, see the list at the foot). ${v.shift ? `In progress: about ${left} game hours left.` : 'Not started.'}`, {'data-primordial-task': ''}));
        const sb = node('button', 'Start the mission', {type: 'button', 'data-primordial-start-task': ''}); sb.disabled = !!v.shift; sb.onclick = () => act(startShift, 'You take the mission; it ends after eight game hours.'); wallet.append(sb);
        hall.replaceChildren(node('h3', 'Treasure hall · spend contribution points'));
        hall.append(node('p', `CP in hand ${f(v.cp)}; spent at the hall so far ${f(v.hall.spent)}. The hall sells for CP only; a loan is a separate route.`, {'data-primordial-hall-balance': String(v.cp)}));
        for(const r of v.hall.rows) {
            const line = node('div', null, {'data-primordial-hall-row': r.id});
            const b = node('button', `Buy for ${f(r.price)} CP${r.left == null ? '' : ` (${r.left} left)`}`, {type: 'button', 'data-primordial-buy': r.id}); b.disabled = !r.eligible; if(!r.eligible) b.title = r.reasons.join(' ');
            b.onclick = () => act(() => { const out = buy(r.id); if(!out.ok) throw Error(out.reasons.join(' ')); }, `The hall clerk releases ${r.label} for ${r.price} CP.`);
            line.append(node('span', `${r.label}. ${r.text}${r.eligible ? '' : ` Not yet: ${r.reasons.join(' ')}`} `), b); hall.append(line);
        }
        const got = Object.entries(v.hall.bought); if(got.length) hall.append(node('p', `Bought here: ${got.map(([k, n]) => `${v.hall.rows.find(r => r.id === k).label} x${n}`).join('; ')}.`, {'data-primordial-hall-held': ''}));
        items.replaceChildren(node('h3', 'Ask the Library for'));
        for(const it of v.items) {
            const line = node('div', null, {'data-primordial-item': it.id});
            const b = node('button', 'Ask for it', {type: 'button'}); b.onclick = () => act(() => { const r = request(it.id); if(!r.ok) throw Error('Refused.'); }, `The elder lends ${it.price} CP and issues ${it.label}.`);
            line.append(node('span', `${it.label}: ${it.price.toLocaleString()} CP (${it.status}, ${it.locator}) `), b); items.append(line);
        }
        if(!v.knowsRule) { const b = node('button', 'Ask the clerk how credit is weighed', {type: 'button', 'data-primordial-ask-rule': ''}); b.onclick = () => act(askRule, 'The clerk explains how credit is weighed.'); items.append(b); }
        refusal.replaceChildren();
        if(v.last && !v.last.ok && !v.last.hall) {
            const it = v.items.find(i => i.id === v.last.itemId);
            refusal.dataset.primordialRefusal = '';
            refusal.append(node('h3', `Refused: ${it.label}`), node('p', v.last.reasons.join(' ')), node('p', v.last.shown.join(' ')));
            for(const r of v.last.routes) refusal.append(node('p', `Route: ${r.reason} Cost: ${r.cost}`));
        } else delete refusal.dataset.primordialRefusal;
        ledger.replaceChildren(node('h3', 'Ledger'));
        if(!v.ledger.length) ledger.append(node('p', 'You owe the Library nothing.'));
        for(const r of v.ledger) {
            const l = v.loan, nx = l.next, f = n => n.toLocaleString();
            ledger.append(node('p', `${r.why}. Total obligation left: ${f(l.totalRemaining)} CP of ${f(l.totalObligation)} over ${l.termYears} years (${l.installmentsLeft} installments left).`, {'data-primordial-ledger': r.id}));
            ledger.append(node('p', nx ? `Next installment: ${f(nx.amount)} CP, number ${nx.number}, due in ${Math.max(0, Math.ceil((nx.dueAt - v.now) / 1440))} days${l.overdue ? ' (overdue past the grace days; forgiving, no penalty is built yet)' : ''}.` : 'No installment left.', {'data-primordial-next': ''}));
            ledger.append(node('p', `Installment ${f(l.installment)} CP a year = ${f(l.principal / l.termYears)} principal + ${f(l.principal * l.rate)} interest (simple, flat on the original ${f(l.principal)}). Interest accrued so far: ${f(l.accruedInterest)} CP. Principal remaining: ${f(l.remainingPrincipal)} CP.`, {'data-primordial-schedule': ''}));
        }
        repayBox.replaceChildren(node('h3', 'Repay'));
        if(v.loan) {
            const input = node('input', null, {type: 'number', min: '1', step: '1', 'aria-label': 'CP to repay', 'data-primordial-repay-amount': '', value: draft || String(v.loan.next?.amount ?? '')});
            input.oninput = () => { draft = input.value; };
            const pay = node('button', 'Repay this much', {type: 'button', 'data-primordial-repay': ''});
            pay.onclick = () => act(() => { const n = Number(input.value); const paid = repay(n); draft = ''; note.textContent = `Paid ${paid} CP.`; }, '');
            const all = node('button', `Repay the whole obligation (${f(v.loan.totalRemaining)} CP)`, {type: 'button', 'data-primordial-repay-all': ''});
            all.onclick = () => act(() => { const paid = repay(v.loan.totalRemaining); draft = ''; note.textContent = `Paid ${paid} CP.`; }, '');
            repayBox.append(node('p', `Interest is covered first inside an installment (AUTHORED). A refused payment changes nothing. You hold ${f(v.cp)} CP.`), input, pay, all);
        } else repayBox.append(node('p', 'Nothing to repay.'));
        held.replaceChildren(node('h3', 'Held'));
        const keys = Object.keys(v.held);
        if(!keys.length) held.append(node('p', 'Nothing issued yet.'));
        for(const k of keys) { const it = v.items.find(i => i.id === k); held.append(node('p', `${it.label}: ${v.held[k]}.${it.halves ? ` The second half is bought; price ${v.dials.secondHalfPrice.value} CP is AUTHORED, not stated in the source.` : ''}`)); }
        restart.replaceChildren(node('h3', 'If this life ends'));
        for(const r of v.carry) restart.append(node('p', `${r.boundary} · ${r.what}: ${r.carries}, ${r.scope}. ${r.note}`));
        const owed = v.ledger[0]?.amount;
        restart.append(node('p', owed ? `Your ${owed.toLocaleString()} CP debt ${v.dials.restart.value === 'drops' ? 'does not cross a restart (SHOWN BASIS for the loop; no other restart is shown)' : 'is carried'}.` : 'No debt to carry.', {'data-primordial-restart': ''}));
        dials.replaceChildren(node('h3', 'Where the numbers come from'));
        for(const [k, d] of Object.entries(v.dials)) dials.append(node('p', `${k} = ${d.value}: ${d.status}. ${d.why} (${d.locator})`));
        note.hidden = !note.textContent;
    });
    definePanel({id: 'primordial_credit', title: 'Sect Library · priced credit', role: 'records', node: root, home: document.getElementById('main_content'),
        discovered: () => true, eligible: () => true});
    render(true);
    return {render: () => render(false)};
}
