// Panel renders build their next subtree detached, then sync it onto the live one.
// Unchanged nodes are kept (focus, selection and scroll stay put); only differing
// text, attributes, handler properties and select values are written. The result
// matches what a full replaceChildren of the same build would show.
const HANDLERS = ['onclick', 'onchange', 'oninput', 'onsubmit', 'onkeydown'];

function syncAttributes(live, next) {
    for(const {name} of [...live.attributes]) if(!next.hasAttribute(name)) live.removeAttribute(name);
    for(const {name, value} of next.attributes) if(live.getAttribute(name) !== value) live.setAttribute(name, value);
    for(const key of HANDLERS) if(live[key] !== next[key]) live[key] = next[key];
}

function syncNode(live, next) {
    if(live.nodeType !== next.nodeType || live.nodeName !== next.nodeName) {live.replaceWith(next); return;}
    if(live.nodeType === 3 || live.nodeType === 8) {if(live.data !== next.data) live.data = next.data; return;}
    syncAttributes(live, next);
    syncChildren(live, [...next.childNodes]);
    if(live.nodeName === 'SELECT' && live.value !== next.value) live.value = next.value;
    // Reflected state set as properties on fresh controls (no attribute written).
    if('disabled' in next && live.disabled !== next.disabled) live.disabled = next.disabled;
}

// Make parent's children match nodes (detached or freshly built), by position.
export function syncChildren(parent, nodes) {
    const live = [...parent.childNodes];
    const n = Math.min(live.length, nodes.length);
    for(let i = 0; i < n; i++) syncNode(live[i], nodes[i]);
    for(let i = n; i < live.length; i++) live[i].remove();
    if(nodes.length > n) parent.append(...nodes.slice(n));
}

// Write a text property only when it differs (each write replaces the text node).
export function setText(node, text) {
    if(node.textContent !== text) node.textContent = text;
}
