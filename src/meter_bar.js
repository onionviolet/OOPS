// Generic world meter (WDI49-WDI60). A world supplies meter specs; this renders them and owns no
// state (AR3): the value always comes from the spec's owner. Kinds: 'pool' (spends and refills),
// 'accumulator' (climbs and cools off; more is worse), 'track' (only advances).
// Meaning stays in the world: a spec carries its own note, so the bar can say why it moves.
const KINDS = ['pool', 'accumulator', 'track'];
// state: 'ok' normal, 'high' within one step of the ceiling, 'full' at it. The world decides what
// each state does; the bar only reports it. Pools read worst when empty, the others when full.
export function meterState(kind, value, max) {
    if(!(max > 0)) return 'ok';
    const worse = kind === 'pool' ? max - value : value;
    if(worse >= max) return 'full';
    return worse >= max - 1 ? 'high' : 'ok';
}
export function normalizeMeter(spec) {
    if(!spec || typeof spec.id !== 'string' || typeof spec.label !== 'string' || !KINDS.includes(spec.kind)) throw new Error('Invalid meter.');
    if(!Number.isFinite(spec.value) || !Number.isFinite(spec.max) || spec.max <= 0) throw new Error('Invalid meter value.');
    const value = Math.max(0, Math.min(spec.max, spec.value));
    return {id: spec.id, label: spec.label, kind: spec.kind, value, max: spec.max, note: spec.note || '', token: spec.token || spec.kind,
        state: meterState(spec.kind, value, spec.max), text: `${spec.label} ${value}/${spec.max}`};
}
export function createMeterBar(doc = document) {
    const root = doc.createElement('div'), fill = doc.createElement('div'), text = doc.createElement('span');
    root.className = 'meter-bar'; fill.className = 'meter-bar-fill'; text.className = 'meter-bar-text';
    root.setAttribute('role', 'meter'); root.append(fill, text);
    return {node: root, update(spec) {
        const m = normalizeMeter(spec);
        root.dataset.meter = m.id; root.dataset.kind = m.kind; root.dataset.token = m.token; root.dataset.state = m.state;
        root.setAttribute('aria-label', m.label); root.setAttribute('aria-valuemin', '0');
        root.setAttribute('aria-valuemax', String(m.max)); root.setAttribute('aria-valuenow', String(m.value));
        root.setAttribute('aria-valuetext', `${m.text}${m.state === 'ok' ? '' : m.state === 'full' ? ', at the limit' : ', near the limit'}`);
        root.title = m.note;
        fill.style.width = `${(m.value / m.max) * 100}%`;
        text.textContent = m.text;
    }};
}
