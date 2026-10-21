// Generic world meter (WDI49-WDI60). A world supplies meter specs; this renders them and owns no
// state (AR3): the value always comes from the spec's owner. Kinds: 'pool' (spends and refills),
// 'accumulator' (climbs and cools off; more is worse), 'track' (only advances).
// Meaning stays in the world: a spec carries its own note, so the bar can say why it moves.
const KINDS = ['pool', 'accumulator', 'track'];
// Thresholds use actual resource units. Existing multi-unit consumers default to one unit;
// smaller scales warn only at endpoints unless their owner supplies warningDistance.
export function meterState(kind, value, max, warningDistance) {
    if(!(max > 0)) return 'ok';
    if(kind === 'pool' && value <= 0) return 'empty';
    if(kind === 'track') return value >= max ? 'complete' : 'ok';
    if(kind === 'pool' && value >= max) return 'ok';
    const distance = Number.isFinite(warningDistance) && warningDistance >= 0
        ? Math.min(max, warningDistance) : max > 1 ? 1 : 0;
    if(kind === 'pool') return distance > 0 && value <= distance ? 'low' : 'ok';
    if(value >= max) return 'full';
    return max - value <= distance && distance > 0 ? 'high' : 'ok';
}
export function normalizeMeter(spec) {
    if(!spec || typeof spec.id !== 'string' || typeof spec.label !== 'string' || !KINDS.includes(spec.kind)) throw new Error('Invalid meter.');
    if(!Number.isFinite(spec.value) || !Number.isFinite(spec.max) || spec.max <= 0) throw new Error('Invalid meter value.');
    const value = Math.max(0, Math.min(spec.max, spec.value));
    const state = meterState(spec.kind, value, spec.max, spec.warningDistance);
    const annotations=[];let change=null;const stale=spec.observation?.stale===true;
    if(spec.band){if(!Number.isFinite(spec.band.min)||!Number.isFinite(spec.band.max)||spec.band.min>spec.band.max)throw new Error('Invalid useful band.');annotations.push(`${spec.band.label || 'Useful range'} ${spec.band.min}–${spec.band.max}${spec.band.unit ? ` ${spec.band.unit}` : ''}`);}
    if(spec.rate){if(!Number.isFinite(spec.rate.value)||typeof spec.rate.unit!=='string')throw new Error('Invalid rate.');annotations.push(`${spec.rate.value>0?'+':''}${spec.rate.value} ${spec.rate.unit}`);}
    if(spec.stock){for(const key of ['free','held','proposed'])if(spec.stock[key]!=null&&(!Number.isFinite(spec.stock[key])||spec.stock[key]<0))throw new Error('Invalid stock detail.');if(spec.stock.unit==null)throw new Error('Invalid stock unit.');annotations.push([spec.stock.free==null?null:`${spec.stock.free} free`,spec.stock.held==null?null:`${spec.stock.held} held`,spec.stock.proposed==null?null:`${spec.stock.proposed} proposed`].filter(Boolean).join(' · ')+` ${spec.stock.unit}`);}
    if(spec.observation){if(typeof spec.observation.text!=='string'||!spec.observation.text)throw new Error('Invalid observation.');annotations.push(spec.observation.text);}
    if(spec.change&&typeof spec.subject==='string'&&spec.change.subject===spec.subject){const c=spec.change;if(!Number.isFinite(c.previous)||!Number.isFinite(c.current)||c.current!==value||typeof c.lifetime!=='string'||!c.lifetime)throw new Error('Invalid subject change.');const previousMax=c.previousMax??spec.max;if(!Number.isFinite(previousMax)||previousMax<=0||c.previous<0||c.previous>previousMax)throw new Error('Invalid previous capacity.');const delta=c.current-c.previous;if(previousMax!==spec.max)annotations.push(`Capacity ${previousMax} → ${spec.max}; previous amount ${c.previous}. This is not a recovery or damage receipt.`);else {annotations.push(`${delta>0?'+':''}${delta} since previous ${c.lifetime}`);if(delta)change={from:Math.min(c.previous,c.current)/spec.max*100,width:Math.abs(delta)/spec.max*100,direction:delta>0?'gain':'loss'};}}
    return {id: spec.id, label: spec.label, kind: spec.kind, value, max: spec.max, note: spec.note || '', token: spec.token || spec.kind, compact: !!spec.compact,
        state, annotations, change, stale, discrete:spec.discrete===true&&Number.isInteger(spec.max)&&spec.max<=24, text: `${spec.label} ${value}/${spec.max}`, stateText: ({empty:'empty',low:'low',high:'near the limit',full:'at the limit',complete:'complete'})[state] || (spec.kind === 'track' && value === 0 ? 'not started' : '')};
}
export function createMeterBar(doc = document) {
    const root = doc.createElement('div'), label = doc.createElement('span'), value = doc.createElement('span'), track = doc.createElement('span'), fill = doc.createElement('span'), annotations=doc.createElement('span'),delta=doc.createElement('span'),steps=doc.createElement('span');
    root.className = 'meter-bar'; label.className='meter-bar-label'; value.className='meter-bar-value'; track.className='meter-bar-track'; fill.className = 'meter-bar-fill';
    delta.className='meter-bar-delta';steps.className='meter-bar-steps';steps.setAttribute('aria-hidden','true');
    annotations.className='meter-bar-annotations';track.append(fill,delta,steps); root.append(label, value, track, annotations);
    let details=null, summary=null, note=null;
    return {node: root, update(spec) {
        const m = normalizeMeter(spec);
        if(m.compact && !details){
            details=doc.createElement('details');details.className='meter-bar-details';summary=doc.createElement('summary');note=doc.createElement('span');note.className='meter-bar-note';details.append(summary,note);root.append(details);
        } else if(!m.compact && details){details.remove();details=summary=note=null;}
        if(details){summary.textContent='Details';note.textContent=m.note;}
        root.dataset.stale=String(m.stale);root.dataset.discrete=String(m.discrete);root.dataset.meter = m.id; root.dataset.kind = m.kind; root.dataset.token = m.token; root.dataset.state = m.state;
        track.setAttribute('role', m.kind === 'track' ? 'progressbar' : 'meter'); track.setAttribute('aria-label', m.label); track.setAttribute('aria-valuemin', '0');
        track.setAttribute('aria-valuemax', String(m.max)); track.setAttribute('aria-valuenow', String(m.value));
        track.setAttribute('aria-valuetext', `${m.stale?'Last observed: ':''}${m.text}${m.stateText ? `, ${m.stateText}` : ''}${m.annotations.length?`, ${m.annotations.join('; ')}`:''}`);
        root.title = details ? '' : m.note;
        delta.hidden=!m.change;
        if(m.change){delta.dataset.direction=m.change.direction;delta.style.left=`${m.change.from}%`;delta.style.width=`${m.change.width}%`;}
        steps.replaceChildren();if(m.discrete)for(let i=1;i<m.max;i++){const step=doc.createElement('i');step.style.left=`${i/m.max*100}%`;steps.append(step);}
        fill.style.width = `${(m.value / m.max) * 100}%`;
        label.textContent = m.label; value.textContent = `${m.value}/${m.max}${m.stateText ? ` · ${m.stateText}` : ''}`;
        annotations.textContent=m.annotations.join(' · ');annotations.hidden=!m.annotations.length;
    }};
}
