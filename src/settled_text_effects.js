import {validatePresentationSettings} from './customization_profiles.js';
import {getDisplaySetting, effectsCap} from './display_settings.js';

export function createReceiptGate(limit = 128) {
    const seen = new Set();
    return receipt => {
        if (!receipt || typeof receipt.text !== 'string') return false;
        const key = receipt.eventId != null
            ? `${receipt.actorId || ''}:${receipt.subjectId || ''}:${receipt.eventId}:${receipt.type}`
            : `${receipt.actorId || ''}:${receipt.sequence}:${receipt.type}:${receipt.text}`;
        if (seen.has(key)) return false;
        seen.add(key); if (seen.size > limit) seen.delete(seen.values().next().value);
        return !globalThis.document?.hidden;
    };
}

// Presentation only: callers pass receipts after the authoritative save settles.
// No simulation, reward, save, or gameplay timer belongs in this module.
export function createSettledTextEffects({container, readSettings = () => ({})}) {
    const overlay = document.createElement('div');
    overlay.className = 'work-ledger-effect';
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    container.append(overlay);
    const receiptIsVisible = createReceiptGate();
    const motion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
    let animation = null, context = null, oscillator = null;
    let drawings = [], pulse = null, anchor = null, frame = null;
    const targetVisible = () => container.isConnected && (!anchor || (container.contains(anchor) && anchor.getClientRects().length > 0));
    const trackPulse = () => {
        if (!targetVisible() || effectsCap() === 'off') { cancel(); return; }
        positionPulse(); if (pulse) frame = globalThis.requestAnimationFrame?.(trackPulse);
    };
    const positionPulse = () => {
        if (!pulse || !anchor || !container.contains(anchor)) return;
        const outer = container.getBoundingClientRect(), target = anchor.getBoundingClientRect();
        Object.assign(pulse.style, {left: `${target.left - outer.left}px`, top: `${target.top - outer.top}px`, width: `${target.width}px`, height: `${target.height}px`});
        // Crafting may be a long scroll region. Place its receipt at the actual
        // recipe, not at the hidden bottom of the entire crafting sheet.
        if(container.classList.contains('settled-effects-host') || container.classList.contains('native-discovery-host')) {
            const width=overlay.getBoundingClientRect().width;
            Object.assign(overlay.style,{left:`${Math.max(4,target.right-outer.left-width-4)}px`,top:`${Math.max(4,target.top-outer.top+4)}px`,right:'auto',bottom:'auto'});
        }
    };
    const resize = globalThis.ResizeObserver ? new ResizeObserver(positionPulse) : null;
    resize?.observe(container);
    const settings = () => ({effects: 'reduced', sound: false, presentation: 'inline', ...readSettings()});
    function cancel() {
        animation?.cancel(); animation = null;
        for (const drawing of drawings) drawing.cancel(); drawings = [];
        if (frame != null) globalThis.cancelAnimationFrame?.(frame); frame = null;
        pulse?.remove(); pulse = null; anchor = null;
        try { oscillator?.stop(); } catch { /* A completed tone needs no cleanup. */ }
        oscillator = null; overlay.hidden = true; overlay.replaceChildren();
        Object.assign(overlay.style,{left:'',top:'',right:'',bottom:''});
    }
    function gesture() {
        if (!settings().sound) return;
        const Audio = globalThis.AudioContext || globalThis.webkitAudioContext;
        if (!Audio) return;
        try { context ||= new Audio(); context.resume()?.catch(() => {}); } catch { /* Text remains sufficient. */ }
    }
    function tone() {
        if (!settings().sound || context?.state !== 'running') return;
        try {
            const voice = context.createOscillator(), volume = context.createGain();
            oscillator = voice; voice.type = 'sine'; voice.frequency.value = 440;
            volume.gain.setValueAtTime(0.035, context.currentTime);
            volume.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.12);
            voice.connect(volume); volume.connect(context.destination);
            voice.start(); voice.stop(context.currentTime + 0.13);
            voice.onended = () => { voice.disconnect(); volume.disconnect(); if (oscillator === voice) oscillator = null; };
        } catch { /* An unavailable audio device never affects gameplay. */ }
    }
    function present(receipt, target = {}) {
        // Consume a settled receipt even while the tab is hidden. Returning to
        // the tab must not replay old sounds or visual cues.
        if (!receiptIsVisible(receipt)) return false;
        cancel();
        const options = settings(), cap = effectsCap();
        if (cap === 'off') return false;
        if (cap === 'reduced') options.effects = 'reduced';
        if (options.effects === 'off') return false;
        if (target.anchor && (!container.contains(target.anchor) || !target.anchor.getClientRects().length)) return false;
        let definition = null;
        if (options.effectDefinition) {
            try { definition = validatePresentationSettings({effectDefinition: options.effectDefinition}, true).effectDefinition; } catch { /* Malformed external presentation cannot affect a receipt. */ }
        }
        const kind = definition && definition.motif !== 'receipt' ? definition.motif : ['closing', 'guidance', 'seal'].includes(receipt.motif) ? receipt.motif : /disconnect|service.*end|lease.*end/.test(receipt.type) ? 'closing' : /learn|precision|acquir|unlock|applied/.test(receipt.type) ? 'guidance' : 'seal';
        const craftReceipt=receipt.type==='native-craft';
        const discoveryReceipt=['native-skill-discovery','native-title-discovery'].includes(receipt.type);
        overlay.dataset.discovery=String(discoveryReceipt);
        // Discovery includes an optional dismissal button, so it must remain
        // keyboard-accessible. The glyph remains purely decorative.
        overlay.setAttribute('aria-hidden', discoveryReceipt ? 'false' : 'true');
        overlay.dataset.craftReceipt=String(craftReceipt);
        overlay.dataset.motif = kind; overlay.dataset.presentation = options.presentation;
        overlay.dataset.plain = String(!!definition?.plain);
        overlay.style.setProperty('--settled-color', definition?.color || '');
        overlay.style.setProperty('--settled-background', definition?.background || '');
        const namespace = 'http://www.w3.org/2000/svg';
        const glyph = document.createElementNS(namespace, 'svg'); glyph.classList.add('work-ledger-effect-glyph');
        glyph.setAttribute('aria-hidden','true');
        glyph.setAttribute('viewBox', '0 0 48 48'); glyph.setAttribute('width', '48'); glyph.setAttribute('height', '48');
        const path = data => {
            const mark = document.createElementNS(namespace, 'path'); mark.setAttribute('d', data);
            mark.setAttribute('fill', 'none'); mark.setAttribute('stroke', 'currentColor'); mark.setAttribute('stroke-width', '2');
            mark.setAttribute('stroke-linecap', 'round'); mark.setAttribute('pathLength', '1'); glyph.append(mark); return mark;
        };
        // Three visible motifs describe settled causes, never unearned powers.
        const outline = path(craftReceipt ? 'M11 5H30L38 13V43H11ZM30 5V13H38' : kind === 'closing' ? 'M8 14H40M8 34H40M8 14V34M40 14V34' : kind === 'guidance' ? 'M24 4L44 24L24 44L4 24Z' : 'M24 4A20 20 0 1 1 23.99 4');
        const detail = path(craftReceipt ? 'M17 19H31M17 25H27M19 34L23 38L31 30' : kind === 'closing' ? 'M14 24H34' : kind === 'guidance' ? 'M14 29L24 19L34 29M24 19V35M14 10L10 14M34 10L38 14' : 'M13 24L21 32L35 17');
        const symbol = typeof target.symbol === 'string' ? target.symbol.slice(0, 16) : '';
        overlay.dataset.localReaction = String(!!symbol);
        if (symbol && !definition?.plain) {
            const expression = document.createElement('span'); expression.className = 'settled-reaction-symbol';
            expression.textContent = symbol; expression.setAttribute('aria-hidden', 'true'); overlay.append(expression);
        } else if (!definition?.plain) overlay.append(glyph);
        // The mark is decorative receipt ink, never item identity or a bonus.
        if(craftReceipt)overlay.setAttribute('data-mark','decorative-receipt');
        else overlay.removeAttribute('data-mark');
        // A host that keeps the sentence in its own line passes caption:false: the words show once (UR147) and the
        // card stays away, so only the outline on the host's line marks the change.
        const bare = target.caption === false;
        if (bare && !symbol) overlay.replaceChildren();
        else if (!bare && (options.presentation !== 'margin' || definition?.plain)) {
            const caption = document.createElement('span'); caption.textContent = receipt.text; overlay.append(caption);
        }
        overlay.hidden = bare && !symbol;
        tone();
        if (!overlay.animate) { overlay.hidden = true; return true; }
        const reduced = options.effects === 'reduced' || motion?.matches || definition?.static || definition?.plain;
        const duration = definition?.duration ?? (reduced ? 1000 : 1800);
        const drawDuration = Math.min(650, duration * .36);
        if (!reduced) {
            for (const mark of [outline, detail]) drawings.push(mark.animate([
                {strokeDasharray: '1', strokeDashoffset: 1}, {strokeDasharray: '1', strokeDashoffset: 0}
            ], {duration: drawDuration, fill: 'forwards', easing: 'ease-out'}));
            if (kind === 'closing') drawings.push(glyph.animate([{transform: 'scaleX(1)'}, {transform: 'scaleX(.15)', opacity: 0}], {duration: drawDuration, delay: duration * .42, fill: 'forwards'}));
            if (kind === 'guidance') drawings.push(glyph.animate([{transform: 'scale(.85)'}, {transform: 'scale(1.12)'}, {transform: 'scale(1)'}], {duration: drawDuration}));
            // Only an explicitly supplied illustration moves, never the button
            // or text being used. The command has already settled.
            if (target.subject && container.contains(target.subject) && target.subject.animate) {
                const poses = target.reaction === 'play'
                    ? [{transform:'translateX(0)'}, {transform:'translateX(-4px) rotate(-5deg)'}, {transform:'translateX(5px) rotate(4deg)'}, {transform:'translateX(0)'}]
                    : [{transform:'scale(1)'}, {transform:'scale(1.12)'}, {transform:'scale(1)'}];
                drawings.push(target.subject.animate(poses, {duration:650, easing:'ease-in-out'}));
            }
        }
        if (target.anchor && container.contains(target.anchor)) {
            anchor = target.anchor; pulse = document.createElement('div'); pulse.className = 'work-ledger-target-pulse';
            pulse.setAttribute('aria-hidden', 'true'); container.append(pulse); positionPulse(); frame = globalThis.requestAnimationFrame?.(trackPulse);
            pulse.style.borderColor = definition?.color || '';
            if (!reduced) drawings.push(pulse.animate([{opacity: 0, transform: 'scale(.98)'}, {opacity: 1, transform: 'scale(1.01)'}, {opacity: 0, transform: 'scale(1.03)'}], {duration: Math.min(900, duration), fill: 'forwards'}));
        }
        animation = overlay.animate(reduced ? [{opacity: 1}, {opacity: 1}, {opacity: 0}] : [
            {opacity: 0, transform: 'translateY(5px)'}, {opacity: 1, transform: 'translateY(0)', offset: 0.15},
            {opacity: 1, transform: 'translateY(0)', offset: 0.8}, {opacity: 0, transform: 'translateY(-3px)'}
        ], {duration, easing: 'ease-out'});
        const current = animation;
        current.finished.then(() => { if (animation === current) cancel(); }).catch(() => {});
        return true;
    }
    const visibility = () => { if (document.hidden) cancel(); };
    document.addEventListener('visibilitychange', visibility);
    const motionChange = () => cancel(); motion?.addEventListener?.('change', motionChange);
    const preferences = globalThis.MutationObserver ? new MutationObserver(motionChange) : null;
    preferences?.observe(document.documentElement, {attributes:true, attributeFilter:['data-effects']});
    return {present, cancel, gesture, destroy() {
        cancel(); document.removeEventListener('visibilitychange', visibility);
        motion?.removeEventListener?.('change', motionChange); preferences?.disconnect(); resize?.disconnect(); context?.close()?.catch(() => {}); overlay.remove();
    }};
}

// Coin spend feedback (I6, V12). Presentation only: it watches the rendered
// purse line and never reads or changes money, saves, or game timers. Saves
// load behind the start screen and imports reload the page, so the watcher
// arms only after PLAY and ignores every purse change made before that.
const COIN_UNITS = {G: 100000, S: 1000, C: 10, W: 1};
const parsePurse = text => {
    const body = String(text).split(':').slice(1).join(':');
    if (!/Your purse contains/.test(text)) return null;
    if (/nothing/.test(body)) return 0;
    let total = 0, any = false;
    for (const [, n, unit] of body.matchAll(/(\d+)\s*([GSCW])/g)) { total += Number(n) * COIN_UNITS[unit]; any = true; }
    return any ? total : null;
};
const formatCoins = value => Object.entries(COIN_UNITS).map(([unit, size]) => {
    const part = unit === 'G' ? Math.floor(value / size) : Math.floor(value / size) % (unit === 'W' ? 10 : 100);
    return part ? `${part}${unit}` : '';
}).filter(Boolean).join(' ');

export function installCoinFeedback({purse = document.getElementById('money_div'), screen = document.getElementById('loading_screen')} = {}) {
    if (!purse || typeof MutationObserver !== 'function') return null;
    const motion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
    const playing = () => !screen || getComputedStyle(screen).visibility === 'hidden' || getComputedStyle(screen).display === 'none';
    let last = parsePurse(purse.textContent), current = null, lastGesture = -Infinity;
    const clear = () => { current?.remove(); current = null; };
    // A purse drop within 1.5 s of a trusted click or key press is the player's own spend;
    // anything else (upkeep, rent, timers) is automatic and floats only when asked (AJ2).
    const gesture = event => { if (event.isTrusted) lastGesture = performance.now(); };
    document.addEventListener('pointerdown', gesture, true); document.addEventListener('keydown', gesture, true);
    function show(spent) {
        clear();
        const float = document.createElement('span');
        float.className = 'coin-float'; float.setAttribute('aria-hidden', 'true');
        float.textContent = `−${formatCoins(spent)}`;
        document.body.append(float);
        const line = purse.getBoundingClientRect(), range = document.createRange(); range.selectNodeContents(purse);
        const textEnd = Math.min(range.getBoundingClientRect().right || line.left, line.right), size = float.getBoundingClientRect();
        const centre = line.left + line.width / 2;
        const x = Math.max(centre - 200, Math.min(centre + 200, textEnd + 10 + size.width / 2));
        Object.assign(float.style, {left: `${Math.round(x - size.width / 2)}px`, top: `${Math.round(line.top + line.height / 2 - size.height / 2)}px`});
        current = float;
        const reduced = motion?.matches || effectsCap() === 'reduced';
        if (!reduced && float.animate) float.animate([
            {opacity: 0, transform: 'translateY(4px)'}, {opacity: 1, transform: 'translateY(0)', offset: .15},
            {opacity: 1, transform: 'translateY(-6px)', offset: .75}, {opacity: 0, transform: 'translateY(-14px)'}
        ], {duration: 1600, easing: 'ease-out', fill: 'forwards'});
        // Removal is a presentation timer only; nothing in play waits on it.
        setTimeout(() => { if (float.isConnected) float.remove(); if (current === float) current = null; }, reduced ? 1400 : 1700);
    }
    const observer = new MutationObserver(() => {
        const value = parsePurse(purse.textContent);
        if (value == null) return;
        const previous = last; last = value;
        if (previous == null || value >= previous || document.hidden) return;
        if (effectsCap() === 'off' || getDisplaySetting('coinFloat') === 'off') return;
        const automatic = performance.now() - lastGesture > 1500;
        if (automatic && getDisplaySetting('coinFloatAutomatic') !== 'on') return;
        if (!playing()) return;
        show(previous - value);
    });
    observer.observe(purse, {childList: true, subtree: true, characterData: true});
    return {destroy() { observer.disconnect(); clear(); document.removeEventListener('pointerdown', gesture, true); document.removeEventListener('keydown', gesture, true); }};
}

// Acknowledges activation, not command success. Delegation includes existing
// native controls and kit consumers without per-control listeners or polling.
export function installControlFeedback(doc = document) {
    const active = new Map(), motion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
    const clear = () => { for (const animation of active.values()) animation.cancel(); active.clear(); };
    const enabled = control => control?.isConnected && !control.disabled && control.getAttribute('aria-disabled') !== 'true';
    const press = (control, kit) => {
        if (!enabled(control) || doc.hidden || effectsCap() === 'off' || !control.animate) return;
        active.get(control)?.cancel();
        const still = motion?.matches || effectsCap() === 'reduced';
        const outline = still
            ? [{outlineColor:'currentColor', outlineOffset:'1px'}, {outlineColor:'transparent', outlineOffset:'1px'}]
            : [{outlineColor:'transparent', outlineOffset:'0px'}, {outlineColor:'currentColor', outlineOffset:'2px', offset:.25}, {outlineColor:'transparent', outlineOffset:'2px'}];
        // Keep the focus outline and button geometry intact throughout the press.
        const frames = kit ? [
            {filter: 'brightness(.78)'},
            {filter: `brightness(${still ? 1 : 1.08})`, offset: .48},
            {filter: 'brightness(1)'},
        ] : outline.map(frame => ({outlineStyle:'solid',outlineWidth:'1px',...frame}));
        const animation = control.animate(frames, {duration: kit ? 180 : still ? 220 : 320, easing:'ease-out'});
        active.set(control, animation);
        const forget = () => { if (active.get(control) === animation) active.delete(control); };
        animation.finished.then(forget, forget);
    };
    const click = event => {
        const control = event.target?.closest?.('button, [role="button"], summary, a[href], input[type="button"], input[type="submit"]');
        if (!enabled(control)) return;
        const key = control.dataset.kitControl;
        if (key === undefined) { press(control, false); return; }
        // An action may synchronously replace its row and restore focus to its new button.
        const surface = control.closest('[data-surface-type], .workspace-module');
        queueMicrotask(() => {
            if (control.isConnected) { press(control, true); return; }
            const replacement = doc.activeElement;
            if (surface?.contains(replacement) && replacement.dataset.kitControl === key) press(replacement, true);
        });
    };
    const keydown = event => {
        // Let the button generate its own click for Enter/Space, once per press.
        if (event.repeat && (event.key === 'Enter' || event.key === ' ') && event.target?.matches?.('button[data-kit-control]')) event.preventDefault();
    };
    const visibility = () => { if (doc.hidden) clear(); };
    const preferences = globalThis.MutationObserver ? new MutationObserver(clear) : null;
    preferences?.observe(doc.documentElement, {attributes:true, attributeFilter:['data-effects']});
    doc.addEventListener('click', click, true);
    doc.addEventListener('keydown', keydown, true);
    doc.addEventListener('visibilitychange', visibility);
    motion?.addEventListener?.('change', clear);
    return {destroy() { clear(); preferences?.disconnect(); doc.removeEventListener('click', click, true); doc.removeEventListener('keydown', keydown, true); doc.removeEventListener('visibilitychange', visibility); motion?.removeEventListener?.('change', clear); }};
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
    const start = () => {
        if (!window.__coinFeedback) window.__coinFeedback = installCoinFeedback();
        if (!window.__controlFeedback) window.__controlFeedback = installControlFeedback();
    };
    if (document.getElementById('money_div')) start(); else document.addEventListener('DOMContentLoaded', start, {once: true});
}
