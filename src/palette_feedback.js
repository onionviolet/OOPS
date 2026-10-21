import {createSettledTextEffects} from './settled_text_effects.js';

const text = value => typeof value === 'string' ? value.trim() : '';
const scalar = value => ['string', 'number'].includes(typeof value) && String(value).length < 100;

// Pure observer ledger. Each route supplies public projections and committed
// boundary IDs; this layer owns no game state, clock, RNG, or persistence.
export function createPaletteFeedbackLedger() {
    const tools = new Map(), returns = new Map(), boundaries = new Set(), cues = new Set(), skills = new Map(), bodies=new Map();
    const once = (set, key) => { if (!key || set.has(key)) return false; set.add(key); if (set.size > 256) set.delete(set.values().next().value); return true; };
    return {
        reset() { tools.clear(); returns.clear(); boundaries.clear(); cues.clear(); skills.clear();bodies.clear(); },
        captureReturnBaseline(subjectId, entries = []) {
            if (!subjectId || !Array.isArray(entries)) return false;
            returns.set(subjectId, new Map(entries.filter(row => row && row.id && scalar(row.value) && text(row.label)).map(row => [row.id, {label: text(row.label), value: String(row.value)}])));
            return true;
        },
        observeTool({subjectId, label, condition, maxCondition, eventId} = {}) {
            if (!subjectId || !Number.isFinite(condition) || !Number.isFinite(maxCondition)) return null;
            const value = `${condition}/${maxCondition}`, previous = tools.get(subjectId); tools.set(subjectId, value);
            if (previous == null || previous === value || !once(cues, eventId)) return null;
            return {type: 'tool-condition', subjectId, text: `${text(label) || 'Tool'} condition: ${value}.`, motif: condition < (Number(previous.split('/')[0])) ? 'closing' : 'guidance'};
        },
        observeScene({placeId, eventId, cue, label} = {}) {
            if (!placeId || !eventId || !once(cues, eventId)) return null;
            const lines = {
                'rain-exposed': 'Rain reaches the exposed edge.',
                'snow-exposed': 'Snow gathers at the exposed edge.',
                'rain-sheltered': 'The shelter keeps the rain off this spot.',
                'lamp-steady': 'The lamp steadies here.',
                'lamp-flicker': 'The lamp flickers here.'
            };
            const line = lines[cue];
            return line ? {type: 'local-scene', subjectId: placeId, text: `${text(label) ? `${text(label)}: ` : ''}${line}`, motif: cue === 'lamp-flicker' ? 'closing' : 'guidance'} : null;
        },
        observeActivityBoundary({boundaryId, activityId, outcome, destination, summary} = {}) {
            if (!boundaryId || !activityId || !outcome || !once(boundaries, boundaryId)) return null;
            const parts = [text(outcome), text(destination) ? `Output: ${text(destination)}` : '', Array.isArray(summary) ? summary.filter(scalar).map(String).join(', ') : ''].filter(Boolean);
            return parts.length ? {type: 'activity-boundary', subjectId: activityId, text: parts.join(' · '), motif: 'seal', boundaryId} : null;
        },
        observeReturn({boundaryId, subjectId = 'world', entries = []} = {}) {
            if (!boundaryId || !once(boundaries, `return:${boundaryId}`) || !Array.isArray(entries)) return null;
            const current = new Map(entries.filter(row => row && row.id && scalar(row.value) && text(row.label)).map(row => [row.id, {label: text(row.label), value: String(row.value)}]));
            const previous = returns.get(subjectId);
            returns.set(subjectId, current);
            if (!previous) return null;
            const changes = [...current].flatMap(([id, row]) => !previous.has(id)
                ? [`New ${row.label}: ${row.value}`]
                : previous.get(id).value !== row.value ? [`${row.label}: ${row.value} (previously ${previous.get(id).value})`] : []);
            for (const [id, row] of previous) if (!current.has(id)) changes.push(`No longer present: ${row.label}`);
            return changes.length ? {type: 'return-digest', subjectId, changes, text: changes.slice(0, 4).join(' · ')+(changes.length>4?` · ${changes.length-4} more changes in Details`:''), motif: 'guidance', boundaryId} : null;
        },
        observeBody({subjectId,health,maxHealth,stamina,maxStamina}={}){
            if(!subjectId||![health,maxHealth,stamina,maxStamina].every(Number.isFinite))return null;
            const before=bodies.get(subjectId),current={health,maxHealth,stamina,maxStamina};bodies.set(subjectId,current);if(!before)return null;
            const gains=[maxHealth===before.maxHealth&&health-before.health>=1?`Health recovered by ${Math.floor(health-before.health)}`:'',maxStamina===before.maxStamina&&stamina-before.stamina>=1?`Stamina recovered by ${Math.floor(stamina-before.stamina)}`:''].filter(Boolean);
            if(!gains.length){if(maxHealth===before.maxHealth&&health>=before.health)current.health=before.health;if(maxStamina===before.maxStamina&&stamina>=before.stamina)current.stamina=before.stamina;}
            return gains.length?{type:'body-recovery',subjectId,shortText:gains.length===1?gains[0].replace(' recovered by ',' +'):'Recovery',text:gains.join('; ')+'. Your posture eases.',motif:'guidance',pose:'recovery'}:null;
        },
        observeCompetence({subjectId, capabilityId, label, level, causeId} = {}) {
            if (!subjectId || !capabilityId || !Number.isFinite(level)) return null;
            const key = `${subjectId}:${capabilityId}`, previous = skills.get(key); skills.set(key, level);
            if (previous == null || level <= previous || !once(cues, causeId)) return null;
            const expression={Butchering:['steady-hands','Your hands settle into the next cut.'],Crafting:['steady-hands','The next piece sits more neatly in your grip.'],Running:['balanced-step','You find a less awkward stride.'],Breathing:['settled-breath','Shoulders down. The next breath comes easier.'],Unarmed:['balanced-step','Your stance finds its balance.'],Swordsmanship:['steady-hands','The blade comes back to a steadier guard.']}[capabilityId];
            return {type: 'competence', subjectId,shortText:`${text(label)||'Capability'} ${level}`, text: `${text(label) || 'Capability'} improves to ${level}.${expression?' '+expression[1]:''}`, motif: 'guidance',...(expression?{pose:expression[0]}:{})};
        }
    };
}

export function createPaletteFeedback({container, readSettings = () => ({}), ledger = createPaletteFeedbackLedger()}) {
    container.classList.add('palette-feedback-host');
    const effects = createSettledTextEffects({container, readSettings});
    const gesture = () => effects.gesture(), doc = container.ownerDocument;
    doc.addEventListener('pointerdown', gesture, true);
    doc.addEventListener('keydown', gesture, true);
    let sequence = 0;
    function show(receipt, anchor) {
        if (!receipt) return false;
        return effects.present({...receipt, actorId: receipt.subjectId || 'palette', sequence: ++sequence, eventId: receipt.boundaryId || receipt.eventId || sequence}, {anchor});
    }
    return {
        presentReceipt: (receipt, anchor) => show(receipt, anchor),
        observeTool: (record, anchor) => show(ledger.observeTool(record), anchor),
        observeLocalScene: (record, anchor) => show(ledger.observeScene(record), anchor),
        observeActivityBoundary: (record, anchor) => show(ledger.observeActivityBoundary(record), anchor),
        observeReturn: (record, anchor) => show(ledger.observeReturn(record), anchor),
        observeCompetence: (record, anchor) => show(ledger.observeCompetence(record), anchor),
        clear: () => effects.cancel(), destroy: () => {doc.removeEventListener('pointerdown',gesture,true);doc.removeEventListener('keydown',gesture,true);effects.destroy();}
    };
}
