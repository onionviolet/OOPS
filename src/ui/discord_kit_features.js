// PS246/PS292: the round 16 Discord features on the kit page, in each state they can show, drawn through the kit's own
// forms so a drift shows beside Ready now before it reaches a screen. Samples quote the live wording of each owner
// (clear_bonus.js, shop_greeting.js, practice_causes.js, drop_rate_causes.js); nothing here is shown in play.
import {registerKitFeature} from './kit.js';

registerKitFeature({id: 'clear-bonus', label: 'Clear bonus (PS160)', samples: {
    empty: {form: 'row', label: 'No clear bonus here', fact: 'This place gives nothing extra on a clear.'},
    ready: {form: 'row', state: 'ready', label: "a farmer left bread at the field's edge", fact: 'about 1 in 3', from: 'Clear bonus'},
    unknown: {form: 'row', label: 'something not yet seen', fact: 'about 1 in 5', from: 'Rarer bonus'},
}});

registerKitFeature({id: 'stock-news', label: 'Keeper stock news (PS161)', samples: {
    near: {form: 'row', state: 'near', label: 'Steel mail and the better blades', fact: 'with the next load, in 4 days', from: 'Quill, after the hideout clear'},
    ready: {form: 'row', state: 'ready', label: 'Steel mail on the rack', fact: 'since the hideout gang is gone', from: 'Quill'},
    empty: {form: 'row', label: 'No stock news', fact: 'Nothing changed on this shelf.'},
}});

registerKitFeature({id: 'practice-cause', label: 'Why a practice is quiet (PS168)', samples: {
    near: [{form: 'row', state: 'near', label: 'Fortitude', fact: 'it learns from wounds, and nothing has hurt you since you started', from: 'Infested field'},
        {form: 'row', state: 'near', label: 'Tough skin', fact: 'your armour takes the hits it learns from', from: 'Infested field'}],
    unknown: {form: 'row', label: 'Cooking', fact: '?', from: 'no known cause; nothing is guessed'},
}});

registerKitFeature({id: 'drop-rate-cause', label: 'Why drops changed (PS166)', samples: {
    ready: [{form: 'row', label: 'Butchering', fact: 'raises what these drop for you', from: 'Bestiary'}, {form: 'number', value: 1.22, field: 'drop factor'}],
    empty: {form: 'row', label: 'Wolf rat', fact: 'Butchering changes its processing, not its drops', from: 'Bestiary'},
}});
