// Minimal in-process DOM for the headless runner. It keeps a real node tree,
// parses HTML, matches common CSS selectors and dispatches bubbling events, so
// the game's own presentation code and UI click paths run unchanged. Layout,
// paint and CSS cascade are not modeled: geometry reads return zeros.

const VOID = new Set(['area','base','br','col','embed','hr','img','input','link','meta','source','track','wbr']);
const RAW = new Set(['script','style','textarea','title']);
const ENTITIES = {amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:'\u00a0',times:'\u00d7',middot:'\u00b7',hellip:'\u2026',mdash:'\u2014',ndash:'\u2013',rarr:'\u2192',larr:'\u2190',copy:'\u00a9',deg:'\u00b0',bull:'\u2022',plusmn:'\u00b1',minus:'\u2212',laquo:'\u00ab',raquo:'\u00bb',lsquo:'\u2018',rsquo:'\u2019',ldquo:'\u201c',rdquo:'\u201d',uarr:'\u2191',darr:'\u2193',check:'\u2713',star:'\u2606'};
const decode = s => s.indexOf('&') < 0 ? s : s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+\d*);?/gi, (m, e) =>
    e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : +e.slice(1)) : (ENTITIES[e.toLowerCase()] ?? m));
const escText = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const escAttr = s => s.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
// Reflected boolean and string properties read and write the attribute.
const BOOL_PROPS = ['disabled','hidden','open','checked','selected','required','readOnly','multiple','autofocus','inert'];
const STR_PROPS = {id:'id',className:'class',title:'title',type:'type',name:'name',href:'href',src:'src',alt:'alt',htmlFor:'for',placeholder:'placeholder',role:'role',lang:'lang',min:'min',max:'max',step:'step',pattern:'pattern',accept:'accept',download:'download',target:'target',rel:'rel',label:'label'};

export function createDom(options = {}) {
    const unsupported = options.unsupported || new Set();
    let byId = new Map();

    class Event {
        constructor(type, init = {}) {
            this.type = type; this.bubbles = !!init.bubbles; this.cancelable = !!init.cancelable; this.composed = !!init.composed;
            this.defaultPrevented = false; this.target = null; this.currentTarget = null; this.eventPhase = 0;
            this._stop = false; this._stopNow = false; this.timeStamp = 0; this.isTrusted = false;
            Object.assign(this, Object.fromEntries(Object.entries(init).filter(([k]) => !['bubbles','cancelable','composed'].includes(k))));
        }
        preventDefault() {if(this.cancelable) this.defaultPrevented = true;}
        stopPropagation() {this._stop = true;}
        stopImmediatePropagation() {this._stop = this._stopNow = true;}
        composedPath() {const p = []; for(let n = this.target; n; n = n.parentNode) p.push(n); p.push(win); return p;}
    }
    class CustomEvent extends Event {constructor(t, i = {}) {super(t, i); this.detail = i.detail ?? null;}}
    class UIEvent extends Event {}
    class MouseEvent extends UIEvent {constructor(t, i = {}) {super(t, {button:0, clientX:0, clientY:0, ...i});}}
    class PointerEvent extends MouseEvent {}
    class KeyboardEvent extends UIEvent {constructor(t, i = {}) {super(t, {key:'', code:'', ...i});}}
    class FocusEvent extends UIEvent {}
    class InputEvent extends UIEvent {}
    class DragEvent extends MouseEvent {}

    class EventTarget {
        addEventListener(type, fn, opts) {
            if(!fn) return; const capture = typeof opts === 'boolean' ? opts : !!opts?.capture;
            const list = ((this._listeners ??= new Map()).get(type) ?? (this._listeners.set(type, []), this._listeners.get(type)));
            if(!list.some(l => l.fn === fn && l.capture === capture)) list.push({fn, capture, once: !!opts?.once});
        }
        removeEventListener(type, fn, opts) {
            const capture = typeof opts === 'boolean' ? opts : !!opts?.capture;
            const list = this._listeners?.get(type); if(!list) return;
            const i = list.findIndex(l => l.fn === fn && l.capture === capture); if(i >= 0) list.splice(i, 1);
        }
        _fire(event, capture) {
            event.currentTarget = this;
            const list = this._listeners?.get(event.type);
            if(list) for(const l of event.eventPhase === 2 ? [...list.filter(l => l.capture), ...list.filter(l => !l.capture)] : [...list]) {
                if(l.capture !== capture && event.eventPhase !== 2) continue;
                if(l.once) this.removeEventListener(event.type, l.fn, l.capture);
                typeof l.fn === 'function' ? l.fn.call(this, event) : l.fn.handleEvent(event);
                if(event._stopNow) return;
            }
            if(!capture || event.eventPhase === 2) {
                const handler = this['on' + event.type];
                if(typeof handler === 'function' && handler.call(this, event) === false) event.preventDefault();
            }
        }
        dispatchEvent(event) {
            event.target = this;
            const path = []; for(let n = this.parentNode; n; n = n.parentNode) path.push(n);
            if(this.nodeType && this.isConnected && win) path.push(win);
            event.eventPhase = 1;
            for(let i = path.length - 1; i >= 0 && !event._stop; i--) path[i]._fire(event, true);
            event.eventPhase = 2; if(!event._stop) this._fire(event, false);
            event.eventPhase = 3;
            if(event.bubbles) for(const n of path) {if(event._stop) break; n._fire(event, false);}
            event.eventPhase = 0; event.currentTarget = null;
            if(!event.defaultPrevented && this._activate) this._activate(event);
            return !event.defaultPrevented;
        }
    }

    class Node extends EventTarget {
        constructor(type) {super(); this.nodeType = type; this.parentNode = null; this.childNodes = [];}
        get ownerDocument() {return doc;}
        get parentElement() {return this.parentNode?.nodeType === 1 ? this.parentNode : null;}
        get firstChild() {return this.childNodes[0] ?? null;}
        get lastChild() {return this.childNodes.at(-1) ?? null;}
        get nextSibling() {const p = this.parentNode; return p ? p.childNodes[p.childNodes.indexOf(this) + 1] ?? null : null;}
        get previousSibling() {const p = this.parentNode; if(!p) return null; const i = p.childNodes.indexOf(this); return i > 0 ? p.childNodes[i - 1] : null;}
        get isConnected() {let n = this; while(n.parentNode) n = n.parentNode; return n === doc;}
        getRootNode() {let n = this; while(n.parentNode) n = n.parentNode; return n;}
        hasChildNodes() {return this.childNodes.length > 0;}
        contains(o) {for(let n = o; n; n = n.parentNode) if(n === this) return true; return false;}
        _adopt(nodes) {
            const out = [];
            for(const n of nodes) {
                const node = typeof n === 'string' ? new Text(n) : n;
                if(node.nodeType === 11) {for(const c of [...node.childNodes]) {c.parentNode = null; out.push(c);} node.childNodes = [];}
                else {node.parentNode?.removeChild(node); out.push(node);}
            }
            return out;
        }
        _insert(nodes, index) {
            const list = this._adopt(nodes);
            for(const n of list) n.parentNode = this;
            this.childNodes.splice(index, 0, ...list);
            for(const n of list) if(n.nodeType === 1) indexIds(n);
            if(options.onConnect && this.isConnected) for(const n of list) if(n.nodeType === 1)
                for(const f of [n, ...descendants(n)]) if(f.localName === 'iframe') options.onConnect(f);
            return list;
        }
        appendChild(n) {this._insert([n], this.childNodes.length); return n;}
        append(...ns) {this._insert(ns, this.childNodes.length);}
        prepend(...ns) {this._insert(ns, 0);}
        insertBefore(n, ref) {if(!ref) return this.appendChild(n); if(n === ref) return n; this._adopt([n]); this._insert([n], this.childNodes.indexOf(ref)); return n;}
        removeChild(n) {const i = this.childNodes.indexOf(n); if(i < 0) throw new Error('NotFoundError: node is not a child'); this.childNodes.splice(i, 1); n.parentNode = null; return n;}
        replaceChild(n, old) {this.insertBefore(n, old); return this.removeChild(old);}
        replaceChildren(...ns) {for(const c of this.childNodes) c.parentNode = null; this.childNodes = []; this.append(...ns);}
        remove() {this.parentNode?.removeChild(this);}
        before(...ns) {const p = this.parentNode; if(p) {const nodes = p._adopt(ns.filter(n => n !== this)); p._insert(nodes, p.childNodes.indexOf(this));}}
        after(...ns) {const p = this.parentNode; if(p) {const nodes = p._adopt(ns.filter(n => n !== this)); p._insert(nodes, p.childNodes.indexOf(this) + 1);}}
        replaceWith(...ns) {const p = this.parentNode; if(!p) return; this.after(...ns); p.removeChild(this);}
        get textContent() {return this.childNodes.map(c => c.nodeType === 8 ? '' : c.textContent).join('');}
        set textContent(v) {this.replaceChildren(); if(v !== '' && v != null) this.appendChild(new Text(String(v)));}
        get nodeValue() {return null;}
        normalize() {}
        isEqualNode(o) {return o?.outerHTML === this.outerHTML;}
        compareDocumentPosition(o) {return this.contains(o) ? 20 : o.contains(this) ? 10 : 4;}
    }
    class Text extends Node {
        constructor(data) {super(3); this.data = String(data);}
        get nodeName() {return '#text';}
        get textContent() {return this.data;} set textContent(v) {this.data = String(v);}
        get nodeValue() {return this.data;} set nodeValue(v) {this.data = String(v);}
        get wholeText() {return this.data;}
        get length() {return this.data.length;}
        cloneNode() {return new Text(this.data);}
        get _html() {return this.parentNode && RAW.has(this.parentNode.localName) ? this.data : escText(this.data);}
    }
    class Comment extends Node {
        constructor(data) {super(8); this.data = String(data);}
        get nodeName() {return '#comment';}
        cloneNode() {return new Comment(this.data);}
        get _html() {return `<!--${this.data}-->`;}
    }
    class ParentNode extends Node {
        get children() {return this.childNodes.filter(c => c.nodeType === 1);}
        get childElementCount() {return this.children.length;}
        get firstElementChild() {return this.childNodes.find(c => c.nodeType === 1) ?? null;}
        get lastElementChild() {return this.childNodes.findLast(c => c.nodeType === 1) ?? null;}
        querySelectorAll(sel) {return queryAll(this, sel, false);}
        querySelector(sel) {return queryAll(this, sel, true)[0] ?? null;}
        getElementsByClassName(c) {
            const names = c.trim().split(/\s+/), out = [];
            const walk = n => {for(const e of n.childNodes) if(e.nodeType === 1) {const v = e._attrs.get('class'); if(v && names.every(x => v === x || (v.includes(x) && v.split(/\s+/).includes(x)))) out.push(e); walk(e);}};
            walk(this); return out;
        }
        getElementsByTagName(t) {t = t.toLowerCase(); return descendants(this).filter(e => t === '*' || e.localName === t);}
        getElementById(id) {return descendants(this).find(e => e.id === id) ?? null;}
    }
    class DocumentFragment extends ParentNode {
        constructor() {super(11);}
        get nodeName() {return '#document-fragment';}
        cloneNode(deep) {const f = new DocumentFragment(); if(deep) f.append(...this.childNodes.map(c => c.cloneNode(true))); return f;}
        get innerHTML() {return this.childNodes.map(c => c._html).join('');}
    }

    class TokenList {
        constructor(el, attr) {this._el = el; this._attr = attr;}
        _get() {return (this._el.getAttribute(this._attr) || '').split(/\s+/).filter(Boolean);}
        _set(list) {this._el.setAttribute(this._attr, list.join(' '));}
        get length() {return this._get().length;}
        get value() {return this._el.getAttribute(this._attr) || '';}
        item(i) {return this._get()[i] ?? null;}
        contains(t) {const v = this._el._attrs.get(this._attr); return !!v && (v === t || (v.includes(t) && v.split(/\s+/).includes(t)));}
        add(...ts) {const l = this._get(); let changed = false; for(const t of ts) if(!l.includes(t)) {l.push(t); changed = true;} if(changed || !this._el.hasAttribute(this._attr)) this._set(l);}
        remove(...ts) {const l = this._get(); const n = l.filter(t => !ts.includes(t)); if(n.length !== l.length) this._set(n);}
        toggle(t, force) {const has = this.contains(t); const want = force === undefined ? !has : !!force; if(want && !has) this.add(t); else if(!want && has) this.remove(t); return want;}
        replace(a, b) {if(!this.contains(a)) return false; this._set(this._get().map(t => t === a ? b : t)); return true;}
        forEach(fn) {this._get().forEach(fn);}
        [Symbol.iterator]() {return this._get()[Symbol.iterator]();}
        toString() {return this.value;}
    }
    const styleCache = new WeakMap();
    function makeStyle(el) {
        const props = new Map();
        const toCss = k => k.startsWith('--') ? k : k.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
        const api = {
            setProperty(k, v) {if(v === '' || v == null) props.delete(k); else props.set(k, String(v));},
            getPropertyValue(k) {return props.get(k) ?? '';},
            removeProperty(k) {const v = props.get(k) ?? ''; props.delete(k); return v;},
            get cssText() {return [...props].map(([k, v]) => `${k}: ${v};`).join(' ');},
            set cssText(v) {props.clear(); for(const part of String(v).split(';')) {const i = part.indexOf(':'); if(i > 0) props.set(part.slice(0, i).trim(), part.slice(i + 1).trim());}},
            get length() {return props.size;},
            item(i) {return [...props.keys()][i] ?? '';},
        };
        return new Proxy(api, {
            get(t, k) {if(typeof k !== 'string' || k in t) return t[k]; return props.get(toCss(k)) ?? '';},
            set(t, k, v) {if(k === 'cssText') {t.cssText = v; return true;} t.setProperty(toCss(k), v); return true;},
        });
    }
    const datasetKey = k => 'data-' + k.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
    const datasetName = a => a.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());

    class Element extends ParentNode {
        constructor(tag, ns) {
            super(1); this.localName = tag.toLowerCase(); this.namespaceURI = ns ?? 'http://www.w3.org/1999/xhtml';
            this._attrs = new Map(); this._value = null; this._checked = null; this._selected = null;
            this.scrollTop = 0; this.scrollLeft = 0;
        }
        get tagName() {return this.namespaceURI.endsWith('xhtml') ? this.localName.toUpperCase() : this.localName;}
        get nodeName() {return this.tagName;}
        getAttribute(k) {return this._attrs.get(k.toLowerCase()) ?? null;}
        hasAttribute(k) {return this._attrs.has(k.toLowerCase());}
        hasAttributes() {return this._attrs.size > 0;}
        getAttributeNames() {return [...this._attrs.keys()];}
        get attributes() {return [...this._attrs].map(([name, value]) => ({name, value}));}
        setAttribute(k, v) {
            k = k.toLowerCase(); v = String(v);
            if(k === 'id') {const old = this._attrs.get('id'); if(old !== v) {if(old && byId.get(old) === this) byId.delete(old); this._attrs.set(k, v); if(this.isConnected) byId.set(v, this);} return;}
            this._attrs.set(k, v);
        }
        removeAttribute(k) {k = k.toLowerCase(); if(k === 'id') {const old = this._attrs.get('id'); if(old && byId.get(old) === this) byId.delete(old);} this._attrs.delete(k);}
        toggleAttribute(k, force) {const has = this.hasAttribute(k); const want = force === undefined ? !has : !!force; if(want && !has) this.setAttribute(k, ''); else if(!want && has) this.removeAttribute(k); return want;}
        get classList() {return this._classList ??= new TokenList(this, 'class');}
        get relList() {return this._relList ??= new TokenList(this, 'rel');}
        get style() {let s = styleCache.get(this); if(!s) {s = makeStyle(this); styleCache.set(this, s); const inline = this.getAttribute('style'); if(inline) s.cssText = inline;} return s;}
        set style(v) {this.style.cssText = v;}
        get dataset() {
            return this._dataset ??= new Proxy({}, {
                get: (_, k) => typeof k === 'string' ? this.getAttribute(datasetKey(k)) ?? undefined : undefined,
                set: (_, k, v) => {this.setAttribute(datasetKey(k), v); return true;},
                deleteProperty: (_, k) => {this.removeAttribute(datasetKey(k)); return true;},
                has: (_, k) => this.hasAttribute(datasetKey(k)),
                ownKeys: () => this.getAttributeNames().filter(a => a.startsWith('data-')).map(datasetName),
                getOwnPropertyDescriptor: (_, k) => this.hasAttribute(datasetKey(k)) ? {enumerable:true, configurable:true, value:this.getAttribute(datasetKey(k))} : undefined,
            });
        }
        get innerHTML() {return this.childNodes.map(c => c._html).join('');}
        set innerHTML(html) {this.replaceChildren(); if(RAW.has(this.localName)) {if(html) this.appendChild(new Text(html));} else this.append(...parseHTML(String(html ?? '')));}
        get outerHTML() {return this._html;}
        set outerHTML(html) {this.replaceWith(...parseHTML(html));}
        get _html() {
            const attrs = [...this._attrs].map(([k, v]) => v === '' && BOOL_PROPS.includes(k) ? ` ${k}` : ` ${k}="${escAttr(v)}"`).join('');
            return `<${this.localName}${attrs}>` + (VOID.has(this.localName) ? '' : this.innerHTML + `</${this.localName}>`);
        }
        get innerText() {return this.hidden || this.localName === 'script' || this.localName === 'style' ? '' : this.childNodes.map(c => c.nodeType === 3 ? c.data : c.nodeType === 1 ? (c.localName === 'br' ? '\n' : c.innerText) : '').join('');}
        set innerText(v) {this.textContent = v;}
        get outerText() {return this.innerText;}
        insertAdjacentHTML(pos, html) {this._insertAdjacent(pos, parseHTML(html));}
        insertAdjacentElement(pos, el) {this._insertAdjacent(pos, [el]); return el;}
        insertAdjacentText(pos, text) {this._insertAdjacent(pos, [new Text(text)]);}
        _insertAdjacent(pos, nodes) {
            pos = pos.toLowerCase();
            if(pos === 'beforebegin') this.before(...nodes); else if(pos === 'afterend') this.after(...nodes);
            else if(pos === 'afterbegin') this.prepend(...nodes); else this.append(...nodes);
        }
        get nextElementSibling() {const p = this.parentNode; if(!p) return null; const l = p.childNodes; for(let i = l.indexOf(this) + 1; i < l.length; i++) if(l[i].nodeType === 1) return l[i]; return null;}
        get previousElementSibling() {const p = this.parentNode; if(!p) return null; const l = p.childNodes; for(let i = l.indexOf(this) - 1; i >= 0; i--) if(l[i].nodeType === 1) return l[i]; return null;}
        matches(sel) {return parseSelector(sel).some(chain => matchChain(this, chain, null));}
        webkitMatchesSelector(sel) {return this.matches(sel);}
        closest(sel) {const chains = parseSelector(sel); for(let n = this; n && n.nodeType === 1; n = n.parentNode) if(chains.some(c => matchChain(n, c, null))) return n; return null;}
        cloneNode(deep) {
            const e = doc.createElementNS(this.namespaceURI, this.localName);
            for(const [k, v] of this._attrs) e._attrs.set(k, v);
            e._value = this._value; e._checked = this._checked;
            if(deep) e.append(...this.childNodes.map(c => c.cloneNode(true)));
            return e;
        }
        // Inputs, selects and textareas.
        get value() {
            if(this.localName === 'select') {const o = this.options.find(o => o.selected) ?? this.options[0]; return o ? o.value : '';}
            if(this.localName === 'option') return this.getAttribute('value') ?? this.textContent;
            if(this.localName === 'textarea') return this._value ?? this.textContent;
            if(this.localName === 'input' && ['checkbox','radio'].includes(this.type)) return this.getAttribute('value') ?? 'on';
            return this._value ?? this.getAttribute('value') ?? '';
        }
        set value(v) {
            v = v == null ? '' : String(v);
            if(this.localName === 'select') {let hit = false; for(const o of this.options) {o._selected = !hit && o.value === v; hit ||= o._selected;} return;}
            if(this.localName === 'option') {this.setAttribute('value', v); return;}
            this._value = v;
        }
        get defaultValue() {return this.getAttribute('value') ?? '';} set defaultValue(v) {this.setAttribute('value', v);}
        get valueAsNumber() {return this.value === '' ? NaN : Number(this.value);} set valueAsNumber(v) {this.value = String(v);}
        get checked() {return this._checked ?? this.hasAttribute('checked');}
        set checked(v) {
            this._checked = !!v;
            if(v && this.type === 'radio' && this.name) for(const r of doc.querySelectorAll(`input[type="radio"]`)) if(r !== this && r.name === this.name) r._checked = false;
        }
        get selected() {return this._selected ?? this.hasAttribute('selected');} set selected(v) {
            if(v) {const s = this.closest('select'); if(s && !s.multiple) for(const o of s.options) o._selected = false;}
            this._selected = !!v;
        }
        get defaultChecked() {return this.hasAttribute('checked');}
        get options() {return this.localName === 'select' ? descendants(this).filter(e => e.localName === 'option') : undefined;}
        get selectedOptions() {return this.options?.filter(o => o.selected) ?? [];}
        get selectedIndex() {const o = this.options; if(!o) return -1; const i = o.findIndex(x => x.selected); return i < 0 && o.length && !this.multiple ? 0 : i;}
        set selectedIndex(i) {this.options?.forEach((o, j) => {o._selected = j === i;});}
        get length() {return this.options?.length;}
        get form() {return this.closest('form');}
        get files() {return this._files ?? [];}
        get labels() {return [];}
        get validity() {return {valid:true};}
        checkValidity() {return true;} reportValidity() {return true;} setCustomValidity() {}
        select() {} setSelectionRange() {}
        get tabIndex() {return Number(this.getAttribute('tabindex') ?? -1);} set tabIndex(v) {this.setAttribute('tabindex', v);}
        get draggable() {return this.getAttribute('draggable') === 'true';} set draggable(v) {this.setAttribute('draggable', String(!!v));}
        get contentEditable() {return this.getAttribute('contenteditable') ?? 'inherit';} set contentEditable(v) {this.setAttribute('contenteditable', v);}
        get isContentEditable() {return this.getAttribute('contenteditable') === 'true';}
        get content() {if(this.localName !== 'template') return undefined; const f = new DocumentFragment(); f.append(...this.childNodes.map(c => c.cloneNode(true))); return f;}
        // Interaction and geometry. Clicks run the browser's default activation.
        click() {if(this.disabled) return; this.dispatchEvent(new MouseEvent('click', {bubbles:true, cancelable:true}));}
        _activate(event) {
            if(event.type !== 'click') return;
            // A click inside <summary> toggles its <details>, then fires 'toggle'.
            const summary = this.closest('summary');
            if(summary && summary.parentNode?.localName === 'details') {const d = summary.parentNode; d.open = !d.open; d.dispatchEvent(new Event('toggle'));}
            if(this.localName === 'input' && ['checkbox','radio'].includes(this.type)) {this.checked = this.type === 'radio' ? true : !this.checked; this.dispatchEvent(new Event('input', {bubbles:true})); this.dispatchEvent(new Event('change', {bubbles:true}));}
            const label = this.closest('label');
            if(label && !['input','select','textarea','button'].includes(this.localName)) {const target = label.getAttribute('for') ? doc.getElementById(label.getAttribute('for')) : label.querySelector('input,select,textarea,button'); if(target && target !== this) target.click();}
            const submit = this.closest('button,input[type="submit"]');
            if(submit && (submit.localName === 'input' || (submit.getAttribute('type') ?? 'submit') === 'submit')) {const form = submit.closest('form'); if(form) form.dispatchEvent(new Event('submit', {bubbles:true, cancelable:true}));}
        }
        focus() {if(doc.activeElement !== this) {const prev = doc.activeElement; doc.activeElement = this; prev?.dispatchEvent?.(new FocusEvent('blur')); this.dispatchEvent(new FocusEvent('focus')); this.dispatchEvent(new FocusEvent('focusin', {bubbles:true}));}}
        blur() {if(doc.activeElement === this) {doc.activeElement = doc.body; this.dispatchEvent(new FocusEvent('blur'));}}
        showModal() {this.open = true;} show() {this.open = true;} close(v) {this.open = false; this.returnValue = v ?? ''; this.dispatchEvent(new Event('close'));}
        showPopover() {} hidePopover() {} togglePopover() {}
        requestSubmit() {this.dispatchEvent(new Event('submit', {bubbles:true, cancelable:true}));} submit() {} reset() {}
        scrollIntoView() {} scrollTo() {} scrollBy() {} scroll() {}
        animate() {return {finished:Promise.resolve(), cancel() {}, finish() {}, play() {}, pause() {}, addEventListener() {}, onfinish:null};}
        getAnimations() {return [];}
        getBoundingClientRect() {return {x:0, y:0, top:0, left:0, right:0, bottom:0, width:0, height:0, toJSON() {return this;}};}
        getClientRects() {return [];}
        // Layout is not modeled, so this reports the DOM-level answer: false when detached, or when this node or an
        // ancestor has the hidden attribute or an inline display:none/contents (real Chrome 105+, Firefox 106+, Safari 17.4+).
        // Stylesheet display is judged by the runner's whyHidden, not here.
        checkVisibility() {
            if(!this.isConnected) return false;
            for(let n = this; n && n.nodeType === 1; n = n.parentNode) {
                const d = (n.style?.display ?? '').trim();
                if(d === 'none' || d === 'contents' || (n.hasAttribute('hidden') && n.getAttribute('hidden') !== 'until-found')) return false;
            }
            return true;
        }
        get offsetWidth() {return 0;} get offsetHeight() {return 0;} get offsetTop() {return 0;} get offsetLeft() {return 0;} get offsetParent() {return this.parentElement;}
        get clientWidth() {return 0;} get clientHeight() {return 0;} get scrollWidth() {return 0;} get scrollHeight() {return 0;}
        setPointerCapture() {} releasePointerCapture() {} hasPointerCapture() {return false;}
        attachShadow() {return this._shadow ??= new DocumentFragment();}
        get shadowRoot() {return this._shadow ?? null;}
        // Canvas drawing is inert: every call is a no-op, reads return neutral values.
        getContext() {
            if(this.localName !== 'canvas') return null;
            return this._ctx ??= new Proxy({canvas:this, measureText:t => ({width:String(t).length * 6}), getImageData:(x, y, w, h) => ({data:new Uint8ClampedArray(Math.max(0, w * h * 4)), width:w, height:h}),
                createLinearGradient:() => ({addColorStop() {}}), createRadialGradient:() => ({addColorStop() {}}), createPattern:() => ({}), getTransform:() => ({a:1, b:0, c:0, d:1, e:0, f:0}), isPointInPath:() => false},
                {get:(t, k) => k in t ? t[k] : typeof k === 'string' && /^[a-z]/.test(k) && !['fillStyle','strokeStyle','font','globalAlpha','lineWidth','textAlign','textBaseline','globalCompositeOperation','filter','shadowColor','shadowBlur','lineCap','lineJoin','imageSmoothingEnabled'].includes(k) ? () => {} : undefined,
                 set:(t, k, v) => {t[k] = v; return true;}});
        }
        get width() {return Number(this.getAttribute('width') ?? (this.localName === 'canvas' ? 300 : 0));} set width(v) {this.setAttribute('width', v);}
        get height() {return Number(this.getAttribute('height') ?? (this.localName === 'canvas' ? 150 : 0));} set height(v) {this.setAttribute('height', v);}
        play() {return Promise.resolve();} pause() {} load() {}
    }
    for(const p of BOOL_PROPS) if(!Object.getOwnPropertyDescriptor(Element.prototype, p))
        Object.defineProperty(Element.prototype, p, {get() {return this.hasAttribute(p.toLowerCase());}, set(v) {this.toggleAttribute(p.toLowerCase(), !!v);}, configurable:true});
    for(const [p, a] of Object.entries(STR_PROPS)) if(!Object.getOwnPropertyDescriptor(Element.prototype, p))
        Object.defineProperty(Element.prototype, p, {get() {return this.getAttribute(a) ?? (p === 'type' && this.localName === 'input' ? 'text' : p === 'type' && this.localName === 'button' ? 'submit' : '');}, set(v) {this.setAttribute(a, v);}, configurable:true});

    const NodeFilter = Object.freeze({SHOW_ALL:0xFFFFFFFF, SHOW_ELEMENT:0x1, SHOW_TEXT:0x4, SHOW_COMMENT:0x80, FILTER_ACCEPT:1, FILTER_REJECT:2, FILTER_SKIP:3});
    function descendants(root, out = []) {
        for(const c of root.childNodes) if(c.nodeType === 1) {out.push(c); descendants(c, out);}
        return out;
    }
    function indexIds(el) {
        if(!el.isConnected) return;
        const walk = e => {const id = e._attrs.get('id'); if(id && !byId.has(id)) byId.set(id, e); for(const c of e.childNodes) if(c.nodeType === 1) walk(c);};
        walk(el);
    }

    // ---- HTML parsing ----
    const AUTO_CLOSE = {p:/^(address|article|aside|blockquote|details|div|dl|fieldset|figure|footer|form|h[1-6]|header|hr|main|nav|ol|p|pre|section|table|ul)$/, li:/^li$/, option:/^(option|optgroup)$/, dt:/^(dt|dd)$/, dd:/^(dt|dd)$/, tr:/^tr$/, td:/^(td|th|tr)$/, th:/^(td|th|tr)$/};
    function parseHTML(html) {
        const frag = new DocumentFragment(), stack = [frag];
        const top = () => stack.at(-1);
        let i = 0;
        const attrRe = /([^\s=\/>"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/y;
        while(i < html.length) {
            const lt = html.indexOf('<', i);
            if(lt < 0 || lt > i) {const end = lt < 0 ? html.length : lt; top().childNodes.push(Object.assign(new Text(decode(html.slice(i, end))), {parentNode:top()})); i = end; continue;}
            if(html.startsWith('<!--', i)) {const end = html.indexOf('-->', i + 4); const stop = end < 0 ? html.length : end; top().childNodes.push(Object.assign(new Comment(html.slice(i + 4, stop)), {parentNode:top()})); i = stop + 3; continue;}
            if(html[i + 1] === '!' || html[i + 1] === '?') {const end = html.indexOf('>', i); i = end < 0 ? html.length : end + 1; continue;}
            if(html[i + 1] === '/') {
                const end = html.indexOf('>', i); const name = html.slice(i + 2, end).trim().toLowerCase(); i = end < 0 ? html.length : end + 1;
                for(let s = stack.length - 1; s > 0; s--) if(stack[s].localName === name) {stack.length = s; break;}
                continue;
            }
            const m = /^<([a-zA-Z][\w:-]*)/.exec(html.slice(i, i + 64));
            if(!m) {top().childNodes.push(Object.assign(new Text('<'), {parentNode:top()})); i++; continue;}
            const name = m[1].toLowerCase();
            let j = i + m[0].length; const el = doc.createElement(name);
            for(;;) {
                while(/\s/.test(html[j] ?? '')) j++;
                if(html[j] === '>' ) {j++; break;}
                if(html.startsWith('/>', j)) {j += 2; break;}
                if(j >= html.length) break;
                attrRe.lastIndex = j; const a = attrRe.exec(html);
                if(!a) {j++; continue;}
                const key = a[1].toLowerCase(); if(!el._attrs.has(key)) el._attrs.set(key, decode(a[2] ?? a[3] ?? a[4] ?? ''));
                j = attrRe.lastIndex;
            }
            i = j;
            for(const [tag, re] of Object.entries(AUTO_CLOSE)) if(re.test(name)) {
                for(let s = stack.length - 1; s > 0; s--) {if(stack[s].localName === tag) {stack.length = s; break;} if(/^(div|ul|ol|table|tbody|select|details|section|form|dl)$/.test(stack[s].localName)) break;}
            }
            el.parentNode = top(); top().childNodes.push(el);
            if(VOID.has(name)) continue;
            if(RAW.has(name)) {
                const close = html.toLowerCase().indexOf(`</${name}`, i); const stop = close < 0 ? html.length : close;
                if(stop > i) el.childNodes.push(Object.assign(new Text(name === 'textarea' || name === 'title' ? decode(html.slice(i, stop)) : html.slice(i, stop)), {parentNode:el}));
                const gt = html.indexOf('>', stop); i = gt < 0 ? html.length : gt + 1; continue;
            }
            stack.push(el);
        }
        const nodes = [...frag.childNodes]; for(const n of nodes) n.parentNode = null; return nodes;
    }

    // ---- Selectors ----
    const selectorCache = new Map();
    function parseSelector(sel) {
        let parsed = selectorCache.get(sel);
        if(parsed) return parsed;
        parsed = splitTop(sel, ',').map(s => parseChain(s.trim()));
        selectorCache.set(sel, parsed);
        return parsed;
    }
    function splitTop(s, ch) {
        const out = []; let depth = 0, quote = null, start = 0;
        for(let i = 0; i < s.length; i++) {
            const c = s[i];
            if(quote) {if(c === '\\') i++; else if(c === quote) quote = null; continue;}
            if(c === ch && depth === 0) {out.push(s.slice(start, i)); start = i + 1;}
            else if(c === '"' || c === "'") quote = c; else if(c === '(' || c === '[') depth++; else if(c === ')' || c === ']') depth--;
        }
        out.push(s.slice(start)); return out;
    }
    // A chain is [{compound, combinator}] read right to left.
    function parseChain(s) {
        const parts = []; let i = 0, comb = null;
        while(i < s.length) {
            while(s[i] === ' ') i++;
            if('>+~'.includes(s[i])) {comb = s[i]; i++; continue;}
            let j = i, depth = 0, quote = null;
            for(; j < s.length; j++) {
                const c = s[j];
                if(quote) {if(c === '\\') j++; else if(c === quote) quote = null; continue;}
                if(c === '"' || c === "'") quote = c; else if(c === '(' || c === '[') depth++; else if(c === ')' || c === ']') depth--;
                else if(depth === 0 && (c === ' ' || '>+~'.includes(c))) break;
            }
            if(j > i) {parts.push({compound:parseCompound(s.slice(i, j)), comb:parts.length ? (comb ?? ' ') : null}); comb = null;}
            i = j;
        }
        return parts;
    }
    function parseCompound(s) {
        const tests = []; let i = 0;
        const ident = () => {const m = /^(?:\\.|[\w-])+/.exec(s.slice(i)); if(!m) throw new SyntaxError(`Bad selector: ${s}`); i += m[0].length; return m[0].replace(/\\(.)/g, '$1');};
        if(s[0] === '*') i++;
        else if(/[a-zA-Z]/.test(s[0])) {const tag = ident().toLowerCase(); tests.push(e => e.localName === tag);}
        while(i < s.length) {
            const c = s[i++];
            if(c === '#') {const id = ident(); tests.push(e => e._attrs.get('id') === id);}
            else if(c === '.') {const cls = ident(); tests.push(e => {const v = e._attrs.get('class'); return !!v && (v === cls || v.split(/\s+/).includes(cls));});}
            else if(c === '[') {
                const end = splitTop(s.slice(i), ']')[0]; i += end.length + 1;
                const m = /^\s*([\w:-]+)\s*(?:([~|^$*]?=)\s*(?:"((?:\\.|[^"])*)"|'((?:\\.|[^'])*)'|([^\s\]]+))\s*(i)?)?\s*$/.exec(end);
                if(!m) throw new SyntaxError(`Bad selector: ${s}`);
                const name = m[1].toLowerCase(), op = m[2], ci = !!m[6];
                let val = (m[3] ?? m[4] ?? m[5] ?? '').replace(/\\(.)/g, '$1'); if(ci) val = val.toLowerCase();
                tests.push(e => {
                    let v = e._attrs.get(name); if(v === undefined) return false; if(!op) return true; if(ci) v = v.toLowerCase();
                    return op === '=' ? v === val : op === '~=' ? v.split(/\s+/).includes(val) : op === '^=' ? val !== '' && v.startsWith(val) :
                        op === '$=' ? val !== '' && v.endsWith(val) : op === '*=' ? val !== '' && v.includes(val) : v === val || v.startsWith(val + '-');
                });
            } else if(c === ':') {
                if(s[i] === ':') {i++; ident(); tests.push(() => false); continue;}
                const name = ident().toLowerCase(); let arg = null;
                if(s[i] === '(') {const inner = splitTop(s.slice(i + 1), ')')[0]; arg = inner; i += inner.length + 2;}
                tests.push(pseudo(name, arg, s));
            } else throw new SyntaxError(`Bad selector: ${s}`);
        }
        return tests;
    }
    function pseudo(name, arg, s) {
        const nth = (a, f) => {const n = parseNth(arg); return e => {const sib = e.parentNode ? e.parentNode.children : [e]; const list = f ? sib.filter(x => x.localName === e.localName) : sib; const idx = a === 'last' ? list.length - list.indexOf(e) : list.indexOf(e) + 1; return n(idx);};};
        switch(name) {
        case 'not': {const chains = parseSelector(arg); return e => !chains.some(c => matchChain(e, c, null));}
        case 'is': case 'where': case 'matches': {const chains = parseSelector(arg); return e => chains.some(c => matchChain(e, c, null));}
        case 'has': {const sel = arg.trim(); return e => (/^[>+~]/.test(sel) ? (sel[0] === '>' ? e.children.some(c => c.matches(sel.slice(1).trim())) : false) : !!e.querySelector(sel));}
        case 'checked': return e => e.localName === 'option' ? e.selected : !!e.checked && e.localName === 'input';
        case 'disabled': return e => e.disabled;
        case 'enabled': return e => !e.disabled;
        case 'empty': return e => e.childNodes.every(c => c.nodeType === 8);
        case 'first-child': return e => e.previousElementSibling === null;
        case 'last-child': return e => e.nextElementSibling === null;
        case 'only-child': return e => !e.previousElementSibling && !e.nextElementSibling;
        case 'first-of-type': return nth('first', true).bind(null);
        case 'nth-child': return nth('first', false);
        case 'nth-last-child': return nth('last', false);
        case 'nth-of-type': return nth('first', true);
        case 'last-of-type': return e => !e.parentNode || e.parentNode.children.filter(x => x.localName === e.localName).at(-1) === e;
        case 'scope': return (e, scope) => e === scope;
        case 'root': return e => e === doc.documentElement;
        case 'open': return e => e.open;
        case 'focus': case 'focus-within': case 'focus-visible': return e => doc.activeElement === e || (name === 'focus-within' && e.contains(doc.activeElement));
        case 'hover': case 'active': case 'visited': case 'target': case 'popover-open': case 'modal': case 'fullscreen': return () => false;
        case 'link': case 'any-link': return e => e.localName === 'a' && e.hasAttribute('href');
        case 'required': return e => e.required;
        case 'optional': return e => !e.required;
        case 'read-only': return e => e.readOnly; case 'read-write': return e => !e.readOnly;
        case 'placeholder-shown': return e => e.hasAttribute('placeholder') && !e.value;
        case 'defined': return () => true;
        default: unsupported.add(`:${name} in ${s}`); return () => false;
        }
    }
    function parseNth(arg) {
        arg = arg.trim().toLowerCase();
        if(arg === 'odd') return i => i % 2 === 1; if(arg === 'even') return i => i % 2 === 0;
        const m = /^([+-]?\d*)n\s*([+-]\s*\d+)?$/.exec(arg);
        if(!m) {const k = +arg; return i => i === k;}
        const a = m[1] === '' || m[1] === '+' ? 1 : m[1] === '-' ? -1 : +m[1], b = m[2] ? +m[2].replace(/\s/g, '') : 0;
        return i => a === 0 ? i === b : (i - b) / a >= 0 && (i - b) % a === 0;
    }
    function matchCompound(e, tests, scope) {for(const t of tests) if(!t(e, scope)) return false; return true;}
    function matchChain(e, chain, scope, k = chain.length - 1) {
        if(!matchCompound(e, chain[k].compound, scope)) return false;
        if(k === 0) return true;
        const comb = chain[k].comb;
        if(comb === '>') {const p = e.parentNode; return p?.nodeType === 1 && matchChain(p, chain, scope, k - 1);}
        if(comb === ' ') {for(let p = e.parentNode; p && p.nodeType === 1; p = p.parentNode) if(matchChain(p, chain, scope, k - 1)) return true; return false;}
        if(comb === '+') {const p = e.previousElementSibling; return !!p && matchChain(p, chain, scope, k - 1);}
        for(let p = e.previousElementSibling; p; p = p.previousElementSibling) if(matchChain(p, chain, scope, k - 1)) return true;
        return false;
    }
    function queryAll(root, sel, first) {
        const chains = parseSelector(sel);
        // Fast path: a lone #id selector on the document.
        if(root === doc && chains.length === 1 && chains[0].length === 1 && /^#[\w-]+$/.test(sel.trim())) {const e = doc.getElementById(sel.trim().slice(1)); return e ? [e] : [];}
        const out = [], scope = root.nodeType === 1 ? root : null;
        const walk = n => {
            for(const c of n.childNodes) {
                if(c.nodeType !== 1) continue;
                if(chains.some(ch => matchChain(c, ch, scope))) {out.push(c); if(first) return true;}
                if(walk(c)) return true;
            }
            return false;
        };
        walk(root);
        return out;
    }

    // ---- Document and window ----
    class Document extends ParentNode {
        constructor() {super(9); this.activeElement = null; this.readyState = 'loading'; this.visibilityState = 'visible'; this.hidden = false; this.cookie = ''; this.title = '';}
        get nodeName() {return '#document';}
        get documentElement() {return this.childNodes.find(c => c.nodeType === 1) ?? null;}
        get head() {return this.documentElement?.children.find(c => c.localName === 'head') ?? null;}
        get body() {return this.documentElement?.children.find(c => c.localName === 'body') ?? null;}
        createElement(tag) {return new Element(String(tag));}
        createElementNS(ns, tag) {return new Element(String(tag), ns);}
        createTextNode(t) {return new Text(t);}
        createComment(t) {return new Comment(t);}
        createDocumentFragment() {return new DocumentFragment();}
        createEvent() {return new Event('');}
        createRange() {return {selectNodeContents() {}, setStart() {}, setEnd() {}, collapse() {}, getBoundingClientRect() {return {width:0,height:0,top:0,left:0};}, createContextualFragment: h => {const f = new DocumentFragment(); f.append(...parseHTML(h)); return f;}};}
        // whatToShow is a NodeFilter mask: bit (nodeType - 1), as in the DOM spec. Snapshot order is document order.
        createTreeWalker(root, whatToShow = NodeFilter.SHOW_ALL) {
            const all = [], walk = n => {for(const c of n.childNodes) {if(whatToShow & (1 << (c.nodeType - 1))) all.push(c); walk(c);}};
            walk(root); let i = -1;
            return {root, whatToShow, currentNode:root, nextNode() {i++; return this.currentNode = all[i] ?? null;}};
        }
        getElementById(id) {
            const hit = byId.get(id);
            if(hit && hit._attrs.get('id') === id && hit.isConnected) return hit;
            if(hit) byId.delete(id);
            const found = descendants(this).find(e => e._attrs.get('id') === id) ?? null;
            if(found) byId.set(id, found);
            return found;
        }
        getElementsByName(n) {return descendants(this).filter(e => e.getAttribute('name') === n);}
        elementFromPoint() {return null;} elementsFromPoint() {return [];}
        hasFocus() {return true;}
        getSelection() {return {removeAllRanges() {}, addRange() {}, toString() {return '';}, rangeCount:0};}
        execCommand() {return false;}
        get fonts() {return {ready:Promise.resolve(), load:() => Promise.resolve([]), check:() => true, addEventListener() {}};}
        get defaultView() {return win;}
        get scrollingElement() {return this.documentElement;}
        startViewTransition(cb) {cb?.(); return {finished:Promise.resolve(), ready:Promise.resolve(), updateCallbackDone:Promise.resolve()};}
    }
    const doc = new Document();
    let win = null;
    function loadHTML(html) {
        byId = new Map();
        for(const c of doc.childNodes) c.parentNode = null;
        doc.childNodes = [];
        const nodes = parseHTML(html);
        let root = nodes.find(n => n.nodeType === 1 && n.localName === 'html');
        if(!root) {root = doc.createElement('html'); root.append(doc.createElement('head'), Object.assign(doc.createElement('body'), {}));root.lastChild.append(...nodes);}
        doc._insert([root], 0);
        if(!doc.head) root.prepend(doc.createElement('head'));
        if(!doc.body) root.append(doc.createElement('body'));
        doc.activeElement = doc.body;
        indexIds(root);
    }
    return {document:doc, loadHTML, parseHTML, setWindow(w) {win = w;}, unsupported,
        classes:{NodeFilter, Event, CustomEvent, UIEvent, MouseEvent, PointerEvent, KeyboardEvent, FocusEvent, InputEvent, DragEvent, EventTarget, Node, Text, Comment, Element, HTMLElement:Element, DocumentFragment, Document}};
}
