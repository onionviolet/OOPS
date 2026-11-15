// Terms for a fight: what the player means to happen when the other side goes down (PS34-PS44, proposals; Weibao 2026-11-14:
// "a selection menu else where and earlier", then "is it a fighting style or a stakes choice"). Three layers, read by both fight views:
// stance is how you fight (combat_stances.js, Pulled Blows among them), terms are your answer when they go down (set here, once per kind
// of foe), stakes are what the fight is (set by the situation and the other side, tempo_kit.js). Pure: no DOM, no save writes.

export const TERMS = Object.freeze(['finish', 'spare', 'take_alive', 'ask']);
export const TERMS_LABEL = Object.freeze({finish: 'Finish', spare: 'Spare', take_alive: 'Take alive', ask: 'Ask me'});
export const TERMS_TEXT = Object.freeze({
    finish: 'A body that goes down is killed.',
    spare: 'A body that goes down is left alive.',
    take_alive: 'A body that goes down is bound and kept.',
    ask: 'The fight stops and asks you.',
});
// One player fact per kind of foe ("set once per kind", PS36). Old keys are not read (old saves are disposable for this setting).
export const TERMS_FACT = kind => `fight.terms.${kind}`;
export const FOE_KINDS = Object.freeze(['beast', 'person', 'other']);

// A foe's kind from its tags: the tempo fighters tag 'beast' or 'person'; the original game tags 'beast', 'insect', 'human'.
export function foeKind(f) {
    const tags = Array.isArray(f?.tags) ? f.tags : Object.keys(f?.tags || {}).filter(k => f.tags[k]);
    if(tags.includes('person') || tags.includes('human')) return 'person';
    if(tags.includes('beast') || tags.includes('insect') || tags.includes('monster')) return 'beast';
    return 'other';
}

// Take alive needs a means (PS36, PS44): a net, a capture Gu, a creature trainer. A fighter's means map names what it carries.
export const CAPTURE_MEANS = Object.freeze(['net', 'rope', 'capture_gu', 'trainer', 'shackles']);
export const canTakeAlive = fighter => CAPTURE_MEANS.some(m => (fighter?.means?.[m] ?? 0) > 0);

// The world's frame sets the default (PS36). Dial: per stakes preset and foe kind; the reason is shown under the control.
// "original" is the upstream wilds' grind: everything that attacks you fights to the death, so the default keeps today's play (PS38).
export function defaultTerms({preset = null, lethal = false, frame = null} = {}, kind = 'other') {
    if(frame === 'original') return {terms: 'finish', reason: 'Out in these wilds a fight runs to the end, as it always has.'};
    if(preset === 'duel') return {terms: 'spare', reason: 'A duel ends when one side yields or drops; a finish breaks its rules.'};
    if(preset === 'drill') return {terms: 'spare', reason: 'A drill is practice; nobody is meant to die.'};
    if(kind === 'person') return {terms: 'ask', reason: 'A person down is worth a look: a death brings witnesses, kin and the law.'};
    if(preset === 'hunt' || (lethal && kind === 'beast')) return {terms: 'finish', reason: 'On a hunt the kill is the point, and the body is worth its parts.'};
    return {terms: 'spare', reason: 'This fight ends when one side is down.'};
}

// The player's terms for a kind, or the default when unset. A setting the means cannot carry out falls back to the default, with why.
export function termsFor(facts = {}, stakes = {}, kind = 'other', {player = null} = {}) {
    const base = defaultTerms(stakes || {}, kind), set = facts[TERMS_FACT(kind)];
    if(TERMS.includes(set)) {
        if(set === 'take_alive' && player && !canTakeAlive(player)) return {...base, set: false, why: 'Nothing to bind them with; using the default.'};
        return {terms: set, reason: base.reason, set: true};
    }
    return {...base, set: false};
}

// When stakes bind terms, the strip shows the clash and its cost instead of quietly overriding (PS43). Breaking them stays possible.
export function termsClash(stakes = {}, terms) {
    if(terms !== 'finish') return '';
    if(stakes.preset === 'duel') return 'A finish here breaks the duel: the one who stops it, and everyone watching, will see a killing.';
    if(stakes.preset === 'drill') return 'A kill in a drill is a crime, whatever the reason.';
    if(stakes.arrest) return 'They are wanted alive; a body earns no reward and draws questions.';
    return '';
}

// Whether a down body asks the player now (PS27, PS40): their setting says ask, the foe is a person, or the stakes shifted in this fight.
export function asksNow({terms, kind, shifted = false}) {
    return terms === 'ask' || kind === 'person' || !!shifted;
}

// Your own terms when it goes badly (PS42): the auto loop's stop rule. "breakoff" is at about a third of health (dial).
export const LOSING = Object.freeze(['fight_on', 'yield', 'breakoff']);
export const LOSING_LABEL = Object.freeze({fight_on: 'Fight on', yield: 'Yield', breakoff: 'Break off at a third'});
export const LOSING_FACT = 'fight.losing';
export const BREAKOFF_SHARE = {value: 1 / 3, reason: 'about a third of your health left is when most people would run (PS42)'};
export const losingFor = facts => LOSING.includes(facts?.[LOSING_FACT]) ? facts[LOSING_FACT] : 'fight_on';
// The move the losing terms call for, or null to keep fighting.
export function losingMove({losing, hp, maxHp}) {
    if(losing === 'fight_on' || !(maxHp > 0)) return null;
    if(hp / maxHp > BREAKOFF_SHARE.value) return null;
    return losing === 'yield' ? 'yield' : 'withdraw';
}

// What the other side wants, as far as the character can tell (PS41). A fighter may carry its own `wants` words; these are the defaults.
export function wantsText(f, stakes = {}) {
    if(f?.wants) return f.wants;
    const kind = foeKind(f);
    if(kind === 'beast') return 'It fights to eat, and runs when it is hurt enough.';
    if(stakes.preset === 'mugging') return 'He wants your purse, not your life.';
    if(stakes.preset === 'duel') return 'They want to win, not to kill.';
    if(stakes.lethal) return 'They mean you real harm.';
    return 'They want you down, not dead.';
}

// The other side's terms when you go down (PS45, proposals): what they do with you, set by the stakes and the foe, shown before the fight
// on the same strip as yours, so a loss is never a surprise. An opener may give its own `theirs` ({terms, text}) with an in-world reason.
// Today every loss still ends with you waking hurt (the defeat record); what changes is what they take or do first.
export const THEIR_TERMS = Object.freeze(['rob', 'spare', 'capture', 'leave_for_dead']);
// Dial: a robber takes about half of what you carry, rounded up (what is in your pockets, not what is put away at home).
export const ROB_SHARE = {value: .5, reason: 'he takes what he finds in your pockets in a hurry, not everything you own'};
export function theirTerms(stakes = {}, kind = 'other') {
    if(stakes?.theirs?.terms && THEIR_TERMS.includes(stakes.theirs.terms)) return {terms: stakes.theirs.terms, text: stakes.theirs.text || ''};
    const beast = kind === 'beast';
    if(stakes?.frame === 'original') return {terms: 'leave_for_dead', text: beast ? 'It leaves you where you fall. You wake later, hurt.' : 'They leave you where you fall. You wake later, hurt.'};
    if(stakes?.arrest) return {terms: 'capture', text: 'They take you in. You wake hurt, in their keeping.'};
    if(stakes?.preset === 'mugging') return {terms: 'rob', text: 'He goes through your pockets and takes about half of what you carry. You wake hurt.'};
    if(stakes?.preset === 'duel' || stakes?.preset === 'drill') return {terms: 'spare', text: 'They stop when you drop. You get up hurt, and the bout is theirs.'};
    if(stakes?.lethal) return {terms: 'leave_for_dead', text: beast ? 'It mauls you and leaves you for dead. You wake badly hurt.' : 'They leave you for dead. You wake badly hurt.'};
    return {terms: 'spare', text: beast ? 'It loses interest once you stop moving. You wake hurt.' : 'They leave you lying. You wake hurt.'};
}
// What a robbery takes from `money` (whole units, at least one when there is any).
export const robbedAmount = money => money > 0 ? Math.min(money, Math.ceil(money * ROB_SHARE.value)) : 0;
