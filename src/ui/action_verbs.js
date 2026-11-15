// PS120: one ordered list of what you can do, in YAIR's own order with the life verbs placed by kind (agreed with UI
// cohesion 2026-11-15). Icons are Material Icons ligature names, the font the native verbs already use. A world may rename
// a verb's label; the id and icon stay. Ready rows carry `verb` (the row's own wins, then its panel's); UI cohesion's frame
// renders the verb list, its marks, Ready now grouped by verb and the number keys from this order.
export const ACTION_VERBS = Object.freeze([
    {id: 'travel', label: 'Move somewhere else', icon: 'directions'},
    {id: 'fast_travel', label: 'Fast travel', icon: 'directions'},
    {id: 'craft', label: 'Try to craft something', icon: 'construction'},
    {id: 'refine', label: 'Refine', icon: 'auto_fix_high'},
    {id: 'sleep', label: 'Sleep', icon: 'bed'},
    {id: 'storage', label: 'Storage', icon: 'inventory_2'},
    {id: 'talk', label: 'Talk to someone', icon: 'question_answer'},
    {id: 'feed', label: 'Feed', icon: 'restaurant'},
    {id: 'trade', label: 'Visit a merchant', icon: 'storefront'},
    {id: 'hand_in', label: 'Hand in', icon: 'assignment_turned_in'},
    {id: 'work', label: 'Find work', icon: 'work_outline'},
    // D3: a school world's lessons and papers take Train's slot (Harry's Attend).
    {id: 'attend', label: 'Attend', icon: 'edit_note'},
    {id: 'train', label: 'Train', icon: 'fitness_center'},
    {id: 'study', label: 'Study', icon: 'menu_book'},
    {id: 'practise', label: 'Practise', icon: 'self_improvement'},
    {id: 'gather', label: 'Gather resources', icon: 'search'},
    {id: 'action', label: 'Take an action', icon: 'circle'},
    {id: 'patrol', label: 'Patrol', icon: 'shield'},
    {id: 'challenge', label: 'Take on a challenge', icon: 'warning_amber'},
].map((v, order) => Object.freeze({...v, order})));

const BY_ID = new Map(ACTION_VERBS.map(v => [v.id, v]));
/** The verb record for an id, or the generic action. */
export const verbById = id => BY_ID.get(id) || BY_ID.get('action');

// First match wins, so the narrower life verbs come before the broad native ones ("Feed" before "make", "Refine" before craft).
const WORDS = [
    ['feed', /\b(feed|nourish|water the)\b/i],
    ['refine', /\brefin/i],
    ['hand_in', /\b(hand in|turn in|deliver|submit|report to)\b/i],
    ['patrol', /\b(patrol|guard|keep watch|stand watch)\b/i],
    // A lesson or an exam paper (Harry's 'attend_<subject>' and '…paper…' commands read 'Go to Charms', which is not travel).
    ['attend', /\b(attend|exam|paper|sit the|lesson)\b/i],
    ['practise', /\b(practi[cs]e|drill|circulat|cultivat|meditat)/i],
    ['study', /\b(study|read|research|learn|copy out|memori[sz]e|homework|revis)/i],
    ['train', /\b(train|exercise|spar)\b/i],
    ['craft', /\b(craft|brew|forge|cook|make|build|repair|smith|sew|carve)\b/i],
    ['gather', /\b(gather|forage|collect|harvest|dig|mine|fish|hunt)\b/i],
    ['trade', /\b(buy|sell|trade|barter|shop|haggle)\b/i],
    ['talk', /\b(talk|ask|speak|visit|greet|call on)\b/i],
    ['sleep', /\b(sleep|rest|nap)\b/i],
    ['work', /\b(work a shift|find work|job)\b/i],
    ['travel', /\b(go to|travel|walk to|journey|leave for|cross to)\b/i],
    ['challenge', /\b(challenge|duel|fight)\b/i],
];
/** The verb an act belongs to: its own `verb` if it names a known one, else read from its id and label, else 'action'. */
export function verbOf(act = {}) {
    if (act.verb && BY_ID.has(act.verb)) return act.verb;
    const text = `${act.label || ''} ${String(act.id || '').replace(/[._-]+/g, ' ')}`;
    return WORDS.find(([, re]) => re.test(text))?.[0] || 'action';
}
