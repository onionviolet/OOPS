// R21 control box (CB1–CB5, CTL1 primitive). One button states a panel's current view; activating
// it opens that panel's choices in a popover. The choices are the panel's own controls, moved in,
// so each keeps its state owner (CB5): nothing here reads or writes game or display state.
//
// Contract (UR53): Esc closes the popover before any Back handler and returns focus to the button;
// an outside press closes it and its click does not reach what is underneath; opening and closing
// have no gameplay effect. Placement (CB3): 'below' opens over the panel's own list under the
// button; 'beside' opens to the left of the button's region, so a log column is never covered.
// A box may offer "Keep open" (CB3 dial): the choices then sit inline under the button and stay.
// Leaf module: DOM only, no game imports.

const make = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
let openBox = null;

// Label text for a set of choices: the defaults are left out, so the label names every non-default
// choice (CB4). `parts` are [{text, isDefault}]; `fallback` is shown when every choice is default.
export function controlBoxLabel(parts, fallback) {
    const shown = parts.filter(p => p && p.text && !p.isDefault).map(p => p.text);
    return shown.length ? shown.join(' · ') : fallback;
}

export function createControlBox({id, title, placement = 'below', keepOpen = null, panelHome = null, triggerLabel = ''}) {
    const root = make('div', 'control-box'); root.dataset.controlBox = id;
    const button = make('button', 'control-box-button'); button.type = 'button';
    const text = make('span', 'control-box-label'), caret = make('span', 'control-box-caret', '▾');
    caret.setAttribute('aria-hidden', 'true');
    if (triggerLabel) button.append(make('span', 'control-box-purpose', triggerLabel + ':'));
    button.append(text, caret);
    const panel = make('div', 'control-box-panel'); panel.id = `control_box_${id}`; panel.setAttribute('popover', 'manual');
    panel.setAttribute('role', 'group'); panel.setAttribute('aria-label', title);
    const heading = make('div', 'control-box-heading'), name = make('strong', '', title), close = make('button', 'control-box-close', '×');
    close.type = 'button'; close.title = `Close ${title}`; close.setAttribute('aria-label', close.title);
    heading.append(name);
    let pin = null;
    if (keepOpen) { pin = make('button', 'control-box-pin', 'Keep open'); pin.type = 'button'; pin.setAttribute('aria-pressed', 'false'); heading.append(pin); }
    heading.append(close);
    const body = make('div', 'control-box-body');
    panel.append(heading, body);
    const inline = make('div', 'control-box-inline'); inline.hidden = true;
    root.append(button);
    button.setAttribute('aria-haspopup', 'true'); button.setAttribute('aria-expanded', 'false'); button.setAttribute('aria-controls', panel.id);

    // The panel is in the page from the start (a closed popover is not rendered), so the controls
    // it holds stay reachable by their owners and checks while it is closed.
    function attach() { const home = panelHome?.() || root; if (panel.parentNode !== home) home.append(panel); }
    attach();
    let kept = false;
    const isOpen = () => panel.matches(':popover-open');
    function position() {
        const b = button.getBoundingClientRect(), region = button.closest('.parity-region')?.getBoundingClientRect() || b;
        const requestedWidth = Math.min(Math.max(region.width - 8, 220), innerWidth - 16);
        panel.style.width = `${requestedWidth}px`; panel.style.fontSize = getComputedStyle(button).fontSize;
        // Minimum widths and the current text role can widen the rendered panel.
        // Place that real box inside the viewport, including a wider Menu.
        const width = panel.getBoundingClientRect().width || requestedWidth;
        let left, top;
        if (placement === 'beside') { left = Math.max(8, region.left - width - 4); top = Math.max(8, b.top); }
        else { left = Math.min(Math.max(8, region.left + 4), innerWidth - width - 8); top = b.bottom + 2; }
        const height = panel.offsetHeight || 0;
        if (top + height > innerHeight - 8) top = Math.max(8, innerHeight - height - 8);
        panel.style.left = `${Math.round(left)}px`; panel.style.top = `${Math.round(top)}px`;
    }
    function open({focus = true} = {}) {
        if (kept) { (body.querySelector('input,select,button') || button).focus({preventScroll: true}); return; }
        if (openBox && openBox !== api) openBox.close({restore: false});
        // The panel lives in the box's own node, so it inherits the box's text and tokens; as a
        // popover it still renders in the top layer, above any clipping region.
        // `panelHome` lets a box whose choices are another owner's controls keep them inside that
        // owner's event root (the Menu holds the workspace toolbar).
        attach();
        if (body.parentNode !== panel) panel.append(body);
        panel.showPopover(); position(); openBox = api;
        button.setAttribute('aria-expanded', 'true');
        // Native strips moved in (UM5) are focusable divs with role=button; they count as controls too.
        if (focus) ([...body.querySelectorAll('input,select,button,[role="button"][tabindex="0"]')].find(n => !n.disabled && n.getClientRects().length && getComputedStyle(n).visibility !== 'hidden') || close).focus({preventScroll: true});
    }
    function hide({restore = true} = {}) {
        if (!isOpen()) return;
        panel.hidePopover(); if (openBox === api) openBox = null;
        button.setAttribute('aria-expanded', 'false');
        if (restore) button.focus({preventScroll: true});
    }
    function setKept(on) {
        kept = !!on; if (pin) { pin.setAttribute('aria-pressed', String(kept)); pin.textContent = kept ? 'Float' : 'Keep open'; }
        root.dataset.kept = String(kept);
        if (kept) { if (isOpen()) hide({restore: false}); inline.hidden = false; heading.remove(); inline.append(heading, body); const anchor = keepOpen?.anchor?.(); if (anchor) anchor.before(inline); else root.after(inline); }
        else { inline.hidden = true; inline.remove(); panel.prepend(heading); panel.append(body); }
        button.setAttribute('aria-expanded', String(kept));
    }
    button.addEventListener('click', () => { if (kept) open(); else if (isOpen()) hide(); else open(); });
    close.addEventListener('click', () => { if (kept) { setKept(false); keepOpen?.store(false); button.focus({preventScroll: true}); } else hide(); });
    pin?.addEventListener('click', () => { const next = !kept; setKept(next); keepOpen.store(next); if (!next) open(); else pin.focus({preventScroll: true}); });
    // Esc on the capture phase, so the center view's Back (center_modes.js) does not also run.
    const onKey = event => { if (event.key === 'Escape' && isOpen()) { event.preventDefault(); event.stopImmediatePropagation(); hide(); } };
    // An outside press closes without activating what was under it (UR53).
    const onDown = event => {
        if (!isOpen() || panel.contains(event.target) || button.contains(event.target)) return;
        hide({restore: false});
        const swallow = e => { e.preventDefault(); e.stopImmediatePropagation(); };
        window.addEventListener('click', swallow, {capture: true, once: true});
        setTimeout(() => window.removeEventListener('click', swallow, {capture: true}), 600);
    };
    const onResize = () => { if (isOpen()) position(); };
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('pointerdown', onDown, true);
    window.addEventListener('resize', onResize);
    if (keepOpen?.stored()) setKept(true);

    const api = {
        node: root, button, body, panel,
        open, close: hide, isOpen, attach, kept: () => kept, setKept,
        // Writes only when the text changes, so ticks leave the button alone (UR52).
        setLabel(label, description = label) {
            if (text.textContent !== label) text.textContent = label;
            const spoken = `${title}: ${description}`;
            if (button.title !== spoken) { button.title = spoken; button.setAttribute('aria-label', spoken); }
        },
        destroy() { hide({restore: false}); document.removeEventListener('keydown', onKey, true); document.removeEventListener('pointerdown', onDown, true); window.removeEventListener('resize', onResize); panel.remove(); inline.remove(); root.remove(); },
    };
    return api;
}
