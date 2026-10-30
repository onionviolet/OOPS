// "While you were away" row (RPT6, LTU3). Home: the World events panel, above its leads; the raw
// lines stay in Recent news, Life and Reports. Plain DOM lists, so the row is its own text form.
const node = (doc, tag, text = '', cls = '') => {const n = doc.createElement(tag); if (text) n.textContent = text; if (cls) n.className = cls; return n;};

export function createReturnDigestRow({doc = document, markRead}) {
    const root = node(doc, 'section', '', 'return-digest');
    root.id = 'return_digest'; root.setAttribute('aria-label', 'While you were away'); root.hidden = true;
    const heading = node(doc, 'strong'), groups = node(doc, 'ul', '', 'return-digest-groups');
    const button = node(doc, 'button', 'Mark as read'), status = node(doc, 'p', '', 'return-digest-status');
    button.type = 'button';
    root.append(heading, groups, button, status);
    let signature = '';
    button.addEventListener('click', () => {
        try {markRead(); status.textContent = '';}
        catch (error) {status.textContent = error.message;}
    });
    return {node: root, update(digest, {writable = true} = {}) {
        root.hidden = !digest?.visible;
        if (root.hidden) {signature = ''; return;}
        button.disabled = !writable;
        button.title = writable ? 'Hide this until more time passes.' : 'Saving is unavailable, so this stays unread.';
        const next = JSON.stringify([digest.spanText, digest.groups]);
        if (next === signature) return;
        signature = next;
        heading.textContent = `While you were away · ${digest.spanText}`;
        groups.replaceChildren(...digest.groups.map(g => {
            const item = node(doc, 'li'); item.dataset.digestGroup = g.id;
            const lines = node(doc, 'ul');
            lines.append(...g.lines.map(l => node(doc, 'li', `${l.text} (${l.when})`)));
            item.append(node(doc, 'span', `${g.label} · ${g.lines.length}`, 'return-digest-who'), lines);
            return item;
        }));
    }};
}
