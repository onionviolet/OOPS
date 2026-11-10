// ECC41-ECC43 (economy palette round 3, proposal): the line a shopkeeper says when you open their stall.
// Pure: the caller passes facts read from real owners (customer memory in the standing slice, the open
// stock, the stall's next delivery, price causes, today's haggle) and a `pick(key, size)` keyed draw, so
// the same save, vendor and day give the same line and opening the shop spends nothing.
// A line is an opener (who you are to them) plus at most one piece of stock news.

const days = n => n <= 1 ? 'tomorrow' : `in ${n} days`;
const lower = s => String(s || '').toLowerCase();
const upper = s => s.charAt(0).toUpperCase() + s.slice(1);
const fill = (text, f) => text.replaceAll('{item}', lower(f.item)).replaceAll('{Item}', upper(lower(f.item))).replaceAll('{when}', days(f.restockIn));

// One voice per keeper (DSG13). `default` serves any stall without its own voice.
export const SHOP_VOICES = Object.freeze({
    villageTrader: {
        first: ['New face. Bread is fresh, rope is sound, and the prices are chalked on the boards.',
            'Welcome to the market. Have a look; I don\'t bite, and the coal only bites a little.'],
        regular: ['Back again. Have a look, not much has moved since last time.',
            'There you are. Mind the coal dust, a load came in this morning.'],
        bought: ['How is the {item} holding up?', 'Back for more {item}? I had a feeling.'],
        talked: ['You again. The price we settled is still the price.'],
        soldOut: ['{Item} is gone until the next cart, {when}.', 'No {item} left, sorry. The cart brings more {when}.'],
        shortage: ['You cleared half the stall last time, so the next lot costs me more. Prices are up a little.'],
    },
    suspiciousTrader: {
        first: ['Didn\'t hear you come in. That\'s a compliment. Look all you like, touch once you pay.',
            'New here? Then you never saw this stall. Now, what are you buying?'],
        regular: ['My favourite customer. Don\'t tell the others.', 'Quiet tonight. Good for business, if you\'re buying.'],
        bought: ['That {item} treating you right? No refunds either way.', 'Another {item}? You\'ll have people asking where you get them.'],
        talked: ['We already haggled today. I\'m still sore about it.'],
        soldOut: ['{Item}? Gone. More turns up {when}, if nobody asks where from.'],
        shortage: ['You bought me thin. Everything\'s dearer till I find more.'],
    },
    swamplandTrader: {
        first: ['Mind the mud on the mat. Everything here was caught, dried or dug up near camp.',
            'Dry boots! You\'re not from the swamp. Come in, look, smell nothing too closely.'],
        regular: ['Ah, the dry-boots again. Come in out of the damp.', 'Back, and not eaten by anything. Good sign.'],
        bought: ['Did the {item} keep? Swamp food sulks if you look at it wrong.', 'More {item}? The hunters will be pleased.'],
        talked: ['No more haggling today. My throat is tired.'],
        soldOut: ['No {item} left. The hunters bring more {when}.'],
        shortage: ['You near emptied the drying racks. Prices go up till they fill again.'],
    },
    nekomimiTrader: {
        first: ['Welcome, welcome! Sit anywhere the cats aren\'t.', 'Oh, a new guest! The menu is on the wall, the cats are not for sale.'],
        regular: ['You came back! The grey one remembers you. Probably.', 'Your seat\'s warm. Somebody furry was keeping it for you.'],
        bought: ['Was the {item} good? Say yes, the cook is listening.', 'The {item} again? Good taste.'],
        talked: ['You already sweet-talked me today. Once is cute.'],
        soldOut: ['The {item} is all gone, sorry! More {when}.'],
        shortage: ['You ate us out of half the menu, so the kitchen charges a bit more till it catches up.'],
    },
    catCafeTrader: {
        first: ['Welcome to the Whisker Corner. Please don\'t feed anyone at the counter.',
            'First time? Order at the counter, then try to keep your chair.'],
        regular: ['Your usual seat is free. Mostly. There\'s a cat on it.', 'Back for the company, or the cake? Both are fine answers.'],
        bought: ['Another {item}? Twice is a choice, three times is a habit.', 'How was the {item}? The tabby wants to know too.'],
        talked: ['We talked prices already today. The cats were scandalised.'],
        soldOut: ['We\'re out of {item} until {when}, sorry.', 'The {item} sold out. More {when}.'],
        shortage: ['You cleaned out the pastry case, so things cost a little more until the oven catches up.'],
    },
    default: {
        first: ['Welcome. Have a look.'],
        regular: ['Good to see you again.'],
        bought: ['Back for more {item}?'],
        talked: ['We already settled a price today.'],
        soldOut: ['{Item} is sold out. More comes in {when}.'],
        shortage: ['Stock is thin after your last visit, so prices are up a little.'],
    },
});

// Dials, with the in-world reason for each.
export const GREETING_DIALS = Object.freeze({
    regularVisits: {value: 3, why: 'By the third day you come in, a keeper knows your face.'},
    rememberDays: {value: 7, why: 'A week later they still recall what you bought; after that it blurs into the rest of the trade.'},
});

/**
 * facts: {visits, today, lastBought, boughtDay, talked: null|{won}, soldOut: null|{item, restockIn}, shortage: bool}
 * Returns {text, why: [fact ids that chose the line]} (ECC52: the why list feeds a read-only inspector).
 */
export function shopGreeting({vendorId, facts, pick}) {
    const voice = SHOP_VOICES[vendorId] ?? SHOP_VOICES.default, why = [];
    const from = (kind, f = {}) => { const pool = voice[kind]; return fill(pool[pick(`${kind}`, pool.length)], f); };
    let opener;
    const recent = facts.lastBought && facts.boughtDay >= 0 && facts.today - facts.boughtDay <= GREETING_DIALS.rememberDays.value;
    if(facts.talked) { opener = from('talked'); why.push('talked-today'); }
    else if((facts.visits ?? 0) <= 1) { opener = from('first'); why.push('first-visit'); }
    else if(recent) { opener = from('bought', {item: facts.lastBought}); why.push('bought-recently'); }
    else { opener = from('regular'); why.push(facts.visits >= GREETING_DIALS.regularVisits.value ? 'regular' : 'returning'); }
    let news = '';
    if(facts.soldOut) { news = from('soldOut', facts.soldOut); why.push('staple-sold-out'); }
    else if(facts.shortage) { news = from('shortage'); why.push('shortage'); }
    return {text: news ? `${opener} ${news}` : opener, why};
}
