// Light cascade for visibility only: which elements a stylesheet hides with
// display:none or visibility:hidden (including var(--x) toggles the game sets on
// <html>). Media queries apply as at a 1366x768 desktop screen; everything else
// about CSS is ignored. Used so headless clicks need the same visibility a
// browser user (or Playwright) needs.

const PROPS = new Set(['display', 'visibility']);

function stripComments(css) {return css.replace(/\/\*[\s\S]*?\*\//g, '');}

// Desktop 1366x768, light scheme, no reduced motion.
function mediaApplies(query) {
    const q = query.toLowerCase();
    if(/\bprint\b/.test(q) && !/\bscreen\b/.test(q)) return false;
    for(const m of q.matchAll(/\((min|max)-(width|height)\s*:\s*([\d.]+)px\)/g)) {
        const v = +m[3], size = m[2] === 'width' ? 1366 : 768;
        if(m[1] === 'min' ? size < v : size > v) return false;
    }
    if(/prefers-color-scheme\s*:\s*dark/.test(q)) return false;
    if(/prefers-reduced-motion\s*:\s*reduce/.test(q)) return false;
    if(/hover\s*:\s*none|pointer\s*:\s*coarse/.test(q)) return false;
    return !/\bnot\b/.test(q);
}

/** Parse CSS text into [{selector, decls:{display?, visibility?, vars}}] in source order. */
export function parseRules(css, out = []) {
    css = stripComments(css);
    let i = 0;
    const block = start => {let depth = 0; for(let j = start; j < css.length; j++) {if(css[j] === '{') depth++; else if(css[j] === '}' && --depth === 0) return j;} return css.length;};
    while(i < css.length) {
        const open = css.indexOf('{', i);
        if(open < 0) break;
        const prelude = css.slice(i, open).trim();
        const close = block(open);
        const body = css.slice(open + 1, close);
        if(prelude.startsWith('@')) {
            if(/^@(media|supports|layer|container)\b/.test(prelude) && (!prelude.startsWith('@media') || mediaApplies(prelude.slice(6))))
                parseRules(body, out);
        } else if(prelude) {
            const decls = {}, vars = {};
            for(const part of body.split(';')) {
                const c = part.indexOf(':'); if(c < 0) continue;
                const k = part.slice(0, c).trim().toLowerCase(), v = part.slice(c + 1).replace(/!important/i, '').trim();
                if(PROPS.has(k)) decls[k] = {value:v, important:/!important/i.test(part)};
                else if(k.startsWith('--')) vars[k] = v;
            }
            if(Object.keys(decls).length || Object.keys(vars).length) out.push({selector:prelude, decls, vars});
        }
        i = close + 1;
    }
    return out;
}

function specificity(sel) {
    const s = sel.replace(/::?[\w-]+\([^)]*\)/g, m => m.startsWith(':not(') || m.startsWith(':is(') ? m.slice(m.indexOf('(') + 1, -1) : '');
    const ids = (s.match(/#[\w-]+/g) || []).length;
    const classes = (s.match(/\.[\w-]+|\[[^\]]+\]|:(?!:)[\w-]+/g) || []).length;
    const tags = (s.replace(/#[\w-]+|\.[\w-]+|\[[^\]]+\]|:[\w-]+/g, ' ').match(/(^|[\s>+~])[a-z][\w-]*/gi) || []).length;
    return ids * 10000 + classes * 100 + tags;
}

export function createVisibility(sheets) {
    const rules = [];
    let order = 0;
    for(const css of sheets) for(const r of parseRules(css)) {
        for(const sel of r.selector.split(/,(?![^(]*\))/)) {
            const selector = sel.trim();
            // Pseudo-elements and dynamic states never hide the element itself.
            if(!selector || /::|:hover|:active|:focus|:before|:after|:visited/.test(selector)) continue;
            rules.push({selector, spec:specificity(selector), order:order++, decls:r.decls, vars:r.vars});
        }
    }
    const rootVars = {};
    for(const r of rules) if(/^(:root|html)$/.test(r.selector)) Object.assign(rootVars, r.vars);
    let cache = new WeakMap();
    const bad = new Set();
    const resolveVar = (value, doc, el) => value.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^)]*))?\)/g, (_, name, fallback) => {
        for(let n = el; n && n.nodeType === 1; n = n.parentNode) {const v = n.style?.getPropertyValue?.(name); if(v) return v;}
        return doc.documentElement?.style.getPropertyValue(name) || rootVars[name] || fallback || '';
    });
    function computed(el, prop) {
        let entry = cache.get(el);
        if(!entry) cache.set(el, entry = {});
        if(prop in entry) return entry[prop];
        const inline = el.style?.getPropertyValue(prop);
        let best = null;
        for(const r of rules) {
            const d = r.decls[prop]; if(!d) continue;
            if(bad.has(r.selector)) continue;
            let hit;
            try {hit = el.matches(r.selector);} catch {bad.add(r.selector); continue;}
            if(!hit) continue;
            if(!best || d.important > best.d.important || (d.important === best.d.important && (r.spec > best.r.spec || (r.spec === best.r.spec && r.order > best.r.order)))) best = {r, d};
        }
        let value = inline && !(best?.d.important) ? inline : best ? best.d.value : '';
        if(value.includes('var(')) value = resolveVar(value, el.ownerDocument, el);
        return entry[prop] = value.trim();
    }
    function boxHiddenReason(el, checkOwnContents = false) {
        for(let n = el, child = null; n && n.nodeType === 1; child = n, n = n.parentNode) {
            if(n.hidden && !computed(n, 'display')) return 'hidden attribute';
            if(['template','script','style','head'].includes(n.localName) || (n.localName === 'dialog' && !n.open)) return `not rendered ${n.localName}`;
            const display = computed(n, 'display');
            if(display === 'none') return `display:none on ${describe(n)}`;
            if(checkOwnContents && n === el && display === 'contents') return 'display:contents has no principal box';
            if(n.localName === 'details' && !n.open && child && child.localName !== 'summary') return `closed details ${describe(n)}`;
        }
        return el.isConnected ? null : 'detached';
    }
    function cssVisibilityHiddenReason(el) {
        if(computed(el, 'visibility') === 'hidden' || computed(el, 'visibility') === 'collapse') return 'visibility hidden';
        // visibility inherits: the nearest explicit value decides.
        for(let n = el.parentNode; n && n.nodeType === 1; n = n.parentNode) {
            const v = computed(n, 'visibility');
            if(v === 'visible') break;
            if(v === 'hidden' || v === 'collapse') return `visibility hidden on ${describe(n)}`;
        }
        return null;
    }
    return {
        reset() {cache = new WeakMap();},
        /** Reason the element is not visible to a user or clickable, or null. */
        hiddenReason(el) {return boxHiddenReason(el) ?? cssVisibilityHiddenReason(el);},
        /** Narrow CSSOM checkVisibility subset: box-tree visibility plus opt-in CSS visibility. */
        checkVisibility(el, options = {}) {
            cache = new WeakMap();
            if(boxHiddenReason(el, true)) return false;
            if((options.visibilityProperty || options.checkVisibilityCSS) && cssVisibilityHiddenReason(el)) return false;
            return true;
        },
        rules:rules.length,
    };
}

function describe(n) {return n.id ? '#' + n.id : n.localName + (n.classList.length ? '.' + [...n.classList].join('.') : '');}
