// Shared presentation grammar. Callers own disclosure state, quotes and commands.
export function panelSection(title, {description, disclosure = false, open = false, className = ''} = {}) {
    const node = document.createElement(disclosure ? 'details' : 'section');
    node.className = `ui-panel-section ${className}`.trim();
    const heading = document.createElement(disclosure ? 'summary' : 'h3');
    heading.textContent = title; node.append(heading);
    if(disclosure) node.open = open;
    const body = document.createElement('div'); body.className = 'ui-panel-section-body';
    node.append(body);
    if(description) {const p = document.createElement('p'); p.textContent = description; body.append(p);}
    return {node, body, heading};
}

export function labelControl(control, text) {
    const label = document.createElement('label'); label.className = 'ui-control-field';
    const caption = document.createElement('span'); caption.textContent = text;
    label.append(caption, control);
    return label;
}

// Keep unavailable options inspectable without repeating a shared blocker under
// every button. Callers supply current eligibility; this component never quotes.
export function quotedActionList(rows, {id, activate}) {
    const root = document.createElement('div'); root.className = 'ui-quoted-actions';
    const blocked = new Map();
    for(const row of rows) {
        if(row.enabled||row.active) root.append(makeButton(row));
        else {const reason = row.reason || 'This work is not available here yet.'; if(!blocked.has(reason))blocked.set(reason, []); blocked.get(reason).push(row);}
    }
    let groupIndex = 0;
    for(const [reason, options] of blocked) {
        const group = panelSection(`Unavailable work · ${options.length}`, {description:reason, disclosure:true});
        group.node.dataset.actionGroup = options.map(r=>r.id).join('|');
        const note = group.body.firstElementChild; note.id = `${id}-reason-${++groupIndex}`;
        for(const row of options) {const b=makeButton(row); b.setAttribute('aria-describedby', note.id); group.body.append(b);}
        root.append(group.node);
    }
    function makeButton(row) {
        const b=document.createElement('button'); b.type='button'; b.textContent=row.label;
        b.disabled=!row.enabled&&!row.active; b.dataset.quotedAction=row.id;
        if(typeof row.active==='boolean')b.setAttribute('aria-pressed',String(row.active));
        if(row.active&&!row.enabled){b.setAttribute('aria-disabled','true');b.title=row.reason||'Currently selected.';}
        if(row.attributes)for(const [key,value]of Object.entries(row.attributes))b.setAttribute(key,value);
        b.onclick=()=>{if(row.enabled)activate(row.id);};
        return b;
    }
    return root;
}

// Shared row shapes for views that used to be prose (UR79: one shape per kind). A chip is a
// hairline-outline word; a row is a label, chips and actions on one line, with the longer
// explanation behind a named disclosure so no fact is dropped (UR75).
export function chip(text, {tone = '', guess = false, title = ''} = {}) {
    const node = document.createElement('span'); node.className = 'ui-chip'; node.textContent = text;
    if(tone) node.dataset.tone = tone;
    if(guess) node.dataset.guess = '';
    if(title) node.title = title;
    return node;
}

export function infoRow({label, chips = [], actions = [], more = '', moreLabel = 'Why', moreNodes = []} = {}) {
    const row = document.createElement('div'); row.className = 'ui-row';
    const name = document.createElement('strong'); name.className = 'ui-row-label'; name.textContent = label;
    const chipBox = document.createElement('span'); chipBox.className = 'ui-row-chips'; chipBox.append(...chips);
    const actionBox = document.createElement('span'); actionBox.className = 'ui-row-actions'; actionBox.append(...actions);
    row.append(name, chipBox, actionBox);
    if(more || moreNodes.length) {
        const details = document.createElement('details'); details.className = 'ui-row-more';
        const summary = document.createElement('summary'); summary.textContent = moreLabel; details.append(summary);
        if(more) { const p = document.createElement('p'); p.textContent = more; details.append(p); }
        details.append(...moreNodes); row.append(details);
    }
    return row;
}

// A reason that stays beside a disabled control instead of hiding in a title (UIV1).
export function reasonLine(text) {
    const node = document.createElement('small'); node.className = 'ui-row-reason'; node.textContent = text; return node;
}
