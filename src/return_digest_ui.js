// "While you were away" row (RPT6, LTU3). Home: pinned at the top of Reports, above the stream that
// keeps the raw lines. Plain DOM lists, so the row is its own text form.
import {formatCount, formatDuration} from './number_format.js';

// UR161: time away reads in human units; from a day up the exact minute count rides beside it.
const away = minutes => minutes >= 1440 ? `${formatDuration(minutes)} (${formatCount(minutes)} minutes)` : formatDuration(minutes);
const node = (doc, tag, text = '', cls = '') => {const n = doc.createElement(tag); if (text) n.textContent = text; if (cls) n.className = cls; return n;};

export function createReturnDigestRow({doc = document, markRead, openPerson = null, spendBank = null}) {
    const root = node(doc, 'section', '', 'return-digest');
    root.id = 'return_digest'; root.setAttribute('aria-label', 'While you were away'); root.hidden = true;
    const heading = node(doc, 'strong'), groups = node(doc, 'ul', '', 'return-digest-groups');
    const button = node(doc, 'button', 'Mark as read'), status = node(doc, 'p', '', 'return-digest-status');
    button.type = 'button';
    const bankLine = node(doc, 'p', '', 'return-digest-bank'), spend = node(doc, 'button', 'Spend banked time'), bankStatus = node(doc, 'p', '', 'return-digest-status');
    spend.type = 'button'; spend.id = 'away_bank_spend';
    const works = node(doc, 'p', '', 'return-digest-livelihoods'), money = node(doc, 'p', '', 'return-digest-money');
    root.append(heading, groups, money, works, button, status, bankLine, spend, bankStatus);
    let signature = '';
    button.addEventListener('click', () => {
        try {markRead(); status.textContent = '';}
        catch (error) {status.textContent = error.message;}
    });
    spend.addEventListener('click', async () => {
        spend.disabled = true; bankStatus.textContent = '';
        try {await spendBank();}
        catch (error) {bankStatus.textContent = error.message;}
    });
    return {node: root, update(digest, {writable = true, bank = null} = {}) {
        const shown = !!digest?.visible, banked = !!bank && (bank.bankedMinutes > 0 || !!bank.lastReturn);
        root.hidden = !shown && !banked;
        if (root.hidden) {signature = ''; return;}
        const r = bank?.lastReturn;
        bankLine.hidden = spend.hidden = !banked;
        if (banked) {
            bankLine.textContent = `${r ? `You were away for ${away(r.minutes)}.${r.dropped ? ` The bank holds ${formatDuration(bank.capacity)}, so ${formatDuration(r.dropped)} went unbanked.` : ''} ` : ''}Banked time: ${formatDuration(bank.bankedMinutes)}. Spending it plays your current routine forward at the normal pace and stops at any choice.`;
            spend.textContent = `Spend ${formatDuration(bank.spendMinutes)} of banked time`;
            spend.disabled = !spendBank || !writable || !bank.writable || bank.busy || !bank.spendMinutes;
            if (bank.lastSpend) bankStatus.textContent = bank.lastSpend;
        } else {bankLine.textContent = ''; bankStatus.textContent = '';}
        button.hidden = !shown; status.hidden = !shown;
        if (!shown) {groups.replaceChildren(); works.textContent = ''; money.textContent = ''; heading.textContent = 'While you were away'; signature = ''; return;}
        button.disabled = !writable;
        button.title = writable ? 'Hide this until more time passes.' : 'Saving is unavailable, so this stays unread.';
        const next = JSON.stringify([digest.spanText, digest.groups, digest.livelihoods, digest.money]);
        if (next === signature) return;
        signature = next;
        heading.textContent = `While you were away · ${digest.spanText}`;
        const m = digest.money, mtext = m ? [...m.lines.map(l => l.text), ...m.exceptions.map(e => `${e.text}.`)].join(' ') : '';
        money.hidden = !mtext; money.textContent = mtext;
        works.hidden = !digest.livelihoods?.length;
        works.textContent = digest.livelihoods?.length ? `Your work: ${digest.livelihoods.join(' ')}` : '';
        groups.replaceChildren(...digest.groups.map(g => {
            const item = node(doc, 'li'); item.dataset.digestGroup = g.id;
            const lines = node(doc, 'ul');
            lines.append(...g.lines.map(l => node(doc, 'li', `${l.text} (${l.when})`)));
            const who = node(doc, openPerson && g.kind === 'person' ? 'button' : 'span', `${g.label} · ${g.lines.length}`, 'return-digest-who');
            if (who.tagName === 'BUTTON') {who.type = 'button'; who.title = `Open People: ${g.label}`; who.addEventListener('click', () => openPerson(g.personId));}
            item.append(who, lines);
            return item;
        }));
    }};
}
