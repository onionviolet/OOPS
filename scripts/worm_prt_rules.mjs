// Worm PRT class and rating rules (derive-worm lane, PWC80 family; proposal). Written from the page's own class definitions
// (POWERS_SHARDS section 3, "Definitions on the page") BEFORE any scorer ran. Nothing here is fitted to a label.
// Inputs: the Luna grammar sentence (verb, object, target, time; read only when valid) and the effect sentence, both from
// docs/coverage/worm_power_labels.json. Rows of kind named_device and entity_or_endbringer abstain (not PRT-rated by cape class).
// Each class rule answers "does what this power does match the class definition"; the set of firing classes is the derived
// class set and the first firing class in PRIMARY_ORDER is the primary. Constants below were fixed before scoring.

export const CLASSES = ['Mover', 'Shaker', 'Brute', 'Breaker', 'Master', 'Tinker', 'Blaster', 'Thinker', 'Striker', 'Changer', 'Trump', 'Stranger'];
// Most specific definition first; Brute, Mover and Shaker last because they ride along as secondaries on many capes.
export const PRIMARY_ORDER = ['Tinker', 'Trump', 'Master', 'Thinker', 'Stranger', 'Breaker', 'Changer', 'Blaster', 'Striker', 'Shaker', 'Brute', 'Mover'];

const T = {
    tinker: /\b(build|builds|builder|design|designs|engineer|engineers|device|devices|technolog\w*|gadgets?|bombs?|inventions?|armou?r|weapons?|equipment|suits?|machines?|robots?|mechanical)\b/i,
    control: /\b(control|controls|command|commands|obey|obeys|puppet\w*|summon\w*|dominat\w*|compel\w*|instructions|orders)\b/i,
    brute: /\b(tough\w*|strong\w*|strength|durab\w*|invulnerab\w*|regenerat\w*|resilien\w*|armou?red|unharmed|damage[- ]resist\w*)\b/i,
    breaker: /\b(phase|phasing|permeable|intangib\w*|pass through|passes through|teleport\w*|stops? (?:her|his|its) own time|own time|storm form|light form|shadow form|energy form|bypass\w* (?:physical )?laws?)\b/i,
    move: /\b(fly|flies|flight|speed|run|runs|portals?|travel\w*|swift\w*|teleport\w*)\b/i,
    blast: /\b(blasts?|beams?|bolts?|shoots?|fires?|projectiles?|lasers?|lightning|ranged|explo\w+|flames?|napalm)\b/i,
    trump: /\b(negat\w*|nullif\w*|suppress\w* powers?|copies? (?:another|others|powers?)|borrow\w* powers?|other capes' powers|powers? of others|cancel\w* powers?)\b/i,
    sense: /\b(senses?|reads?|perceives?|predict\w*|precog\w*|probabilit\w*|clairvoy\w*|infer\w*|extrapolat\w*|computes?|detects?|sees? through|knows?)\b/i,
    hide: /\b(unnoticed|not notice\w*|evad\w+ notice|forget\w*|hide\w*|conceal\w*|unseen|imperceptible|undetect\w*|not perceive\w*)\b/i,
    form: /\b(shape|form|forms|shifts?|becomes?|turns? into|transforms? into|body)\b/i,
};

export function features(row) {
    const g = row.grammar && row.grammar.valid ? row.grammar : null;
    return {g, text: row.effect ?? '', kind: row.kind};
}

export function classSet(row) {
    const {g, text, kind} = features(row);
    if (kind !== 'cape') return null;                  // devices and Entities abstain
    if (!g && !text) return null;
    const v = g?.verb, o = g?.object, t = g?.target, tm = g?.time;
    const none = !g || v === 'none';
    if (none && !text) return null;
    if (none && /no effect is established|does not establish/i.test(text)) return null;
    const hit = new Set();
    const touch = t === 'touched', self = t === 'self', area = t === 'area' || t === 'cone', other = ['bound', 'marked', 'line', 'area', 'cone', 'touched'].includes(t);
    const energy = ['heat', 'light', 'force', 'vitality'].includes(o);
    // Tinker: science-grasp device work. Matches by what the sentence says is made, not by verb.
    if (T.tinker.test(text) && !T.blast.test(text.replace(T.tinker, ''))) hit.add('Tinker');
    else if (T.tinker.test(text) && /\b(build|builds|design|designs|engineer|engineers)\b/i.test(text)) hit.add('Tinker');
    // Trump: acts on other powers' working, or on the law that bounds them.
    if ((['working', 'law'].includes(o) && ['alter', 'copy', 'block', 'end', 'remove'].includes(v)) || T.trump.test(text)) hit.add('Trump');
    // Master: controls other creatures, minds or things.
    if ((v === 'bind' && ['mind', 'thing', 'relation'].includes(o) && other) || (v === 'alter' && o === 'mind' && other) || (T.control.test(text) && !hit.has('Tinker') && other)) hit.add('Master');
    if (v === 'add' && o === 'thing' && t === 'bound' && !hit.has('Tinker')) hit.add('Master');     // creates things that act for it
    // Thinker: information powers.
    if (v === 'sense' || (v === 'copy' && ['information', 'memory'].includes(o)) || (T.sense.test(text) && ['information', 'memory'].includes(o))) hit.add('Thinker');
    // Stranger: evades senses or records; acts on what others perceive or remember.
    if ((v === 'conceal' && ['information', 'memory', 'mind'].includes(o)) || (v === 'bind' && o === 'mind' && T.hide.test(text)) || T.hide.test(text) && ['information', 'memory', 'mind'].includes(o)) hit.add('Stranger');
    // Breaker: breaks a natural law about oneself or its immediate vicinity (phase, own time, change without stress).
    if (T.breaker.test(text) || (self && o === 'law')) hit.add('Breaker');
    // Changer: changes its own shape or form, or holds other forms.
    if ((v === 'transform' && o === 'form' && self) || (v === 'add' && o === 'form')) hit.add('Changer');
    // Brute: unnaturally tough or strong body; self-directed.
    if ((T.brute.test(text) && (self || !g)) || (self && o === 'vitality')) hit.add('Brute');
    // Blaster: ranged attack, an energy thing sent out along a line, cone or at marked targets.
    if (((v === 'add' || v === 'move') && energy && ['line', 'cone', 'area', 'marked'].includes(t)) || (T.blast.test(text) && !self && !hit.has('Tinker'))) hit.add('Blaster');
    // Striker: effect by touch or at point blank.
    if (touch && ['add', 'move', 'transform', 'remove', 'alter', 'bind', 'block'].includes(v) && !hit.has('Tinker')) hit.add('Striker');
    // Shaker: area effect on surroundings (battlefield control), not on minds.
    if (area && ['alter', 'transform', 'add', 'move', 'block', 'conceal'].includes(v) && o !== 'mind' && !hit.has('Tinker')) hit.add('Shaker');
    if (v === 'conceal' && ['light', 'sound', 'moisture'].includes(o)) hit.add('Shaker');
    // Mover: moves itself.
    if ((v === 'move' && o === 'position' && self) || (T.move.test(text) && (self || !g))) hit.add('Mover');
    if (!hit.size) return null;                         // no rule fires: abstain, fall back to the baseline
    return hit;
}

export function primaryOf(set) { return PRIMARY_ORDER.find(c => set.has(c)) ?? null; }

// Numeric rating (1 to 12): reach and output. Constants fixed before scoring: a base of 2, two points per step of reach,
// one for an effect that lasts or is held up, one for an effect on a high-output object.
const REACH = {self: 0, touched: 0, bound: 1, marked: 1, line: 1, cone: 2, area: 3};
const OUTPUT = new Set(['heat', 'light', 'force', 'law', 'working', 'time', 'mind']);
export function ratingOf(row) {
    const {g} = features(row);
    if (!g || g.verb === 'none') return null;
    const r = 2 + 2 * (REACH[g.target] ?? 0) + (g.time === 'sustained' || g.time === 'lasting' ? 1 : 0) + (OUTPUT.has(g.object) ? 1 : 0);
    return Math.max(1, Math.min(12, r));
}
