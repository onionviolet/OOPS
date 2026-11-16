// PS50 (proposal): each bestiary row names your terms for its kind of foe ("Wolf rat · your terms: Finish"). The terms come from the
// fight strip (fight_terms.js through the tempo_fight domain), so the row, the opener and the fight card say the same thing. No markup of
// its own: the row carries the words in a data attribute and styles/combat_versus.css draws them; the reason sits in the row's title.
import {domainRegistry} from '../domain_registry.js';
import {TERMS_LABEL} from '../fight_terms.js';

const KIND_WORD = {beast: 'beast', person: 'person', other: 'foe of this kind'};
// The kind of foe a bestiary name stands for, handed in by the combat display (it owns the enemy templates; importing them here makes a cycle).
let kindOf = () => null;

export function syncBestiaryTerms(doc = globalThis.document) {
    const list = doc?.getElementById?.('bestiary_list'), stripFor = domainRegistry.command('tempo_fight', 'stripFor');
    if (!list || !stripFor) return;
    for (const entry of list.querySelectorAll('.bestiary_entry_div')) {
        const kind = kindOf(entry.querySelector('.bestiary_entry_name')?.textContent.trim());
        if (!kind) continue;
        let term = null; try { term = stripFor({kinds: [kind], frame: 'original'})?.terms?.[0]; } catch { /* no strip yet: leave the row */ }
        if (!term) continue;
        const words = `your terms: ${TERMS_LABEL[term.terms]}`, why = term.set ? `You set ${TERMS_LABEL[term.terms]} for every ${KIND_WORD[kind]}. Change it in a fight's approach line.` : `Default for every ${KIND_WORD[kind]}: ${term.reason} Change it in a fight's approach line.`;
        if (entry.dataset.bestiaryTerms !== words) entry.dataset.bestiaryTerms = words;
        if (entry.title !== why) entry.title = why;
    }
}

// New rows appear when a foe is first killed or a save loads; terms change from the fight card, which calls syncBestiaryTerms itself.
export function watchBestiaryTerms({kind = null, doc = globalThis.document} = {}) {
    if (kind) kindOf = kind;
    const list = doc?.getElementById?.('bestiary_list');
    if (!list || typeof MutationObserver === 'undefined') return;
    new MutationObserver(() => syncBestiaryTerms(doc)).observe(list, {childList: true});
    syncBestiaryTerms(doc);
}
