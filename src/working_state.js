// Shared "working" state for any action that takes seconds or reloads the page (life start, and
// later import, reset or world entry). It never shows a percentage: the duration is not measured,
// so it names the step instead (UR61). Two layers:
//   withWorking   in the page: disables the control, says what is happening, refuses a second run,
//                 and puts everything back if the action fails.
//   markWorking / resumeWorking   across a reload: a one-line session note says what the player was
//                 doing, the loading screen repeats it, and Play is pressed once on their behalf when
//                 the load is clean. Session storage only; the save is never touched.
const KEY = 'oops.working.v1', STALE_MS = 2 * 60 * 1000, active = new WeakSet();

export async function withWorking({button, line, label, onStart, onFail}, run) {
    if (active.has(button)) return undefined;
    active.add(button);
    const wasDisabled = button.disabled;
    button.disabled = true; button.setAttribute('aria-busy', 'true');
    if (line) { line.textContent = label; line.setAttribute('role', 'status'); line.dataset.working = 'true'; }
    try { onStart?.(); return await run(); }
    catch (error) { onFail?.(error); throw error; }
    finally {
        active.delete(button);
        // A success that reloads leaves the page; one that stays gets its control back.
        button.disabled = wasDisabled; button.removeAttribute('aria-busy');
        if (line) delete line.dataset.working;
    }
}

// A page-level note for actions that have no button of their own to hold the state (a crossing card,
// a menu route). Plain text, no motion: it reads the same with effects off.
export function showWorkingNote(label, doc = globalThis.document) {
    if (!doc?.body) return null;
    let note = doc.getElementById('working_note');
    if (!note) { note = doc.createElement('div'); note.id = 'working_note'; note.setAttribute('role', 'status'); note.setAttribute('aria-live', 'polite'); doc.body.append(note); }
    note.textContent = label; doc.body.setAttribute('aria-busy', 'true');
    return note;
}
export function hideWorkingNote(doc = globalThis.document) {
    doc?.getElementById('working_note')?.remove(); doc?.body?.removeAttribute('aria-busy');
}

const safe = fn => { try { return fn(); } catch { return undefined; } };

export function markWorking(label, storage = globalThis.sessionStorage, now = Date.now()) {
    safe(() => storage.setItem(KEY, JSON.stringify({label: String(label), at: now})));
}

// Read once, then forget. A note older than two minutes belongs to some earlier session.
export function takeWorking(storage = globalThis.sessionStorage, now = Date.now()) {
    const raw = safe(() => storage.getItem(KEY));
    safe(() => storage.removeItem(KEY));
    if (!raw) return null;
    const note = safe(() => JSON.parse(raw));
    return note && typeof note.label === 'string' && now - note.at >= 0 && now - note.at < STALE_MS ? note.label : null;
}

// Runs at boot. Returns the label shown, or null when nothing was in progress.
export function resumeWorking({doc = globalThis.document, storage, now, observe = true} = {}) {
    const label = takeWorking(storage, now);
    if (!label || !doc) return null;
    const progress = doc.getElementById('loading_screen_loading_progress');
    const line = doc.createElement('div');
    line.id = 'loading_screen_working'; line.setAttribute('role', 'status'); line.textContent = label;
    progress?.before(line);
    if (!observe) return label;
    const play = doc.getElementById('loading_screen_play_button'), status = doc.getElementById('loading_screen_status');
    const clean = () => !status || !/loading_screen_status_(errors|warnings)/.test(status.className);
    const press = () => { if (play && !play.classList.contains('none_display') && clean()) { observer?.disconnect(); play.click(); return true; } return false; };
    const observer = typeof MutationObserver === 'function' && play ? new MutationObserver(press) : null;
    observer?.observe(play, {attributes: true, attributeFilter: ['class']});
    press();
    // Never wait forever: after the stale window the player takes over.
    setTimeout(() => observer?.disconnect(), STALE_MS).unref?.();
    return label;
}
