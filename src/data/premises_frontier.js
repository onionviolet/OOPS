// G2 slice 2 premises for the Village start (proposals, 2026-10-30; palette: docs/research/PREMISE_HOOK_AUDIT_2026-10-14.md).
// Original lines. Each premise is a short text layer, no secrets: the truth is the line itself, so nothing here needs sealing.
// Tones: ordinary, odd, villain, funny. `weight` is the default draw weight; a world dial scales the odd tones (premise_generator.js).
const premise = (id, tone, text, extra = {}) => ({id, revision: 1, tags: ['premise', `tone-${tone}`], needs: ['village'], excludes: [], weight: 1, tone,
    patch: {text: [text], ...(extra.patch || {})}, ...(extra.layer || {})});
export const frontierPremises = Object.freeze([
    premise('road-weary', 'ordinary', 'You came down the road with a bad boot and a good reason, and you mean to rest before explaining either.', {layer: {weight: 3}}),
    premise('hired-hand', 'ordinary', 'A carter dropped you at the village edge, paid you in thanks, and drove on before you could ask where you were.', {layer: {weight: 3}}),
    premise('wrong-cart', 'odd', 'You woke in a cart of turnips that was meant for a different village, and the driver is sure you are his cousin.', {layer: {weight: 2}}),
    premise('echo-name', 'odd', 'Three people in the market greet you by a name that is not yours, and they all use the same one.', {layer: {weight: 2}}),
    premise('the-one-blamed', 'villain', 'The village already has a story about whoever broke the mill gate last winter. It fits you uncomfortably well.', {layer: {weight: 1}}),
    premise('quiet-debt', 'villain', 'You owe someone in this village something you took, and they have not noticed yet.', {layer: {weight: 1}}),
    premise('ring-elder', 'odd', 'The ring on your finger was not there yesterday, and something inside it clears its throat as if it has been waiting to be introduced.',
        {layer: {weight: 1}, patch: {grants: [{cheat: 'ring-spirit', why: 'An old tenant of the ring picked you.', cost: 'It boasts, and it is not always right.'}]}}),
    premise('hen-raised', 'funny', 'The hens at the end of the lane treat you as one of the flock, and you have not yet found a polite way to stop them.', {layer: {weight: 1}}),
    premise('ordered-by-mistake', 'funny', 'A merchant swears you were ordered, paid for, and are overdue. Nobody can find the order.', {layer: {weight: 1}}),
]);
