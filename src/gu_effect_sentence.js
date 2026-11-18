// guFamilyEffects as an adapter (PSA27, PSA36): reads one Gu activation effect as the shared effect sentence
// that `landEffect` lands (PC8). Default: a kind or function with no row here stays a label and lands nothing;
// add a row to widen it. Dial: `amount` is the activation's magnitude; the host scales it into its own units.
// The law has already charged the essence, so the sentence carries cost 'none'. Reading follows GU_FUNCTION.
const ROWS = {
    'remove vitality line instant': ['damage', 'lightning', 'flame', 'attack'],
    'block vitality self sustained': ['water-guard', 'jade-guard', 'impact-guard', 'lightning-shield', 'guard'],
    'sense information area sustained': ['ground-hearing', 'pierce-visual-concealment', 'sense'],
    'conceal information self sustained': ['visual-concealment', 'conceal'],
    'move position self sustained': ['flight', 'fly'], 'move position self instant': ['dash', 'move'],
    'move position bound instant': ['travel'], 'transform mind area sustained': ['project-demeanor', 'mind'],
    'add vitality touched instant': ['heal'], 'transform essence touched instant': ['convert-essence'],
    'add thing self lasting': ['produce'], 'copy information area lasting': ['record'], 'add force self sustained': ['strength'],
    'alter working bound sustained': ['amplify', 'economize'], 'transform form area lasting': ['restore'],
    'block form touched sustained': ['stabilize'], 'block working area sustained': ['suppress'], 'alter law area sustained': ['formation'],
    'transform time self lasting': ['time'], 'add light area sustained': ['illuminate'], 'move relation bound instant': ['steal'],
};
const BY_KIND = Object.fromEntries(Object.entries(ROWS).flatMap(([words, kinds]) => kinds.map(kind => [kind, words.split(' ')])));
export const guSentenceKinds = () => Object.keys(BY_KIND);
export function guLanding({kind, magnitude, range}) {
    const [verb, object, target, time] = BY_KIND[kind] ?? [];
    return verb ? {sentence: {verb, object, target, time, carrier: 'gu', cost: 'none', limits: []},
        details: {amount: magnitude, ...(range !== undefined && {range})}} : {};
}
