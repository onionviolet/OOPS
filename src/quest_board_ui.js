// Leads panel (G2 slice 1): quests from the world's debts, read from Ledger → Owed. Card list, no new save field.
// The Settle button calls the same settleOwed() command Standing's Repay button uses, so there is one authority for payment.
import {definePanel} from './panel_kit.js';
import {boardFor, questView} from './quest_generator.js';
import {debtNeeds} from './quest_needs.js';
import {readOwedLedger, settleOwed} from './owed_ledger_sources.js';

const node = (tag, text = '') => {const n = document.createElement(tag); n.textContent = text; return n;};

// read() -> {world: string|null (null hides the panel), seed, day}. Registered once from main.js.
export function registerQuestBoard({read, readOwed = readOwedLedger, settle = settleOwed}) {
    const panel = node('details'); panel.id = 'quest_board_panel'; panel.append(node('summary', 'Leads'));
    const status = node('p'), body = node('div'); panel.append(status, body);
    let signature;
    function render() {
        const c = read(); panel.hidden = !c.world;
        if(!c.world) return;
        let owed; try {owed = readOwed();} catch(e) {owed = {rows: [], live: {}, labels: {}};}
        const needs = debtNeeds(owed, {world: c.world}), board = boardFor({worldSeed: c.seed, world: c.world, day: c.day, needs});
        const next = JSON.stringify([board.map(q => q.id), owed.live]); if(next === signature) return; signature = next;
        body.replaceChildren();
        if(!board.length) body.append(node('p', 'Nothing presses on you right now.'));
        for(const q of board.map(questView)) {
            const card = node('section'); card.dataset.questCard = q.id; card.dataset.questWorld = c.world;
            card.append(node('strong', q.title), node('p', `${q.lead}: ${q.because}`));
            const quote = owed.live?.[q.route.rowId]?.quote, b = node('button', quote?.label ?? 'See it in Ledger → Owed'); b.type = 'button'; b.disabled = !quote || !!quote.blocked;
            b.title = quote?.blocked ?? ''; b.dataset.questSettle = q.route.rowId;
            b.addEventListener('click', () => {try {const paid = settle(quote); status.textContent = `Paid ${paid} coins.`;} catch(e) {status.textContent = e.message;} signature = null; render();});
            card.append(b); body.append(card);
        }
    }
    definePanel({id: 'quest-board', title: 'Leads', role: 'records', node: panel, home: document.getElementById('main_content'), defaultDock: 'center', after: 'records',
        discovered: () => !panel.hidden, eligible: () => !panel.hidden});
    render(); const timer = setInterval(render, 1000);
    return {render, destroy: () => {clearInterval(timer); panel.remove();}};
}
