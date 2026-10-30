// RPX16 / LTU7 combat fixtures. Invented names only. Each runs the same adapter the game runs
// (src/ui/combat_situation.js) on a board in the projection shape, so the gallery proves the game's path.
import {fightSituation, chaseSituation, tempoSituation} from '../../combat_situation.js';
import {FIGURE_FIXTURES} from '../figure_fixtures.js';

const fact = (label, value, knowledge = 'native') => ({label, value, knowledge});
const opp = (slot, name, hp, max, facts, extra = {}) => ({id: `fx-${slot}`, slot, letter: String.fromCharCode(65 + slot), name, knowledge: 'native', defeated: hp === 0,
    health: {text: `${hp}/${max} hp`, progress: 100 * hp / max, knowledge: 'native'}, cycle: null, facts, ...extra});
const you = (current, extra = {}) => ({name: 'You', health: {current, max: 40}, speed: 0.8, defense: 2, minDamageShare: .05, damageTaken: 1, sideSize: 1, ...extra});

// A duel: one opponent, chances shown in words, and a lethal blow telegraphed.
export const DUEL_BOARD = {source: 'fixture', opponents: [opp(0, 'Ditch reaver', 22, 30, [
    fact('Attack', '9 dmg x2'), fact('Speed', '1.3 /s'), fact('Hit you', '71%'), fact('Evade you', '18%'), fact('Defense', '1'), fact('You hit them', '82%')])]};
export const DUEL_FIXTURE = {...fightSituation(DUEL_BOARD, you(14), {place: 'Reed causeway'}).spec, id: 'fight-duel', title: 'Duel at the causeway'};

// Several opponents: ratings, not chances; one not yet assessed; one down; lethal together.
export const BRAWL_BOARD = {source: 'fixture', opponents: [
    opp(0, 'Mire hound', 0, 12, [fact('Attack', '4 dmg'), fact('Speed', '1.1 /s'), fact('Attack rating', '20'), fact('Evasion rating', '14'), fact('Defense', '0')]),
    opp(1, 'Mire hound', 9, 12, [fact('Attack', '4 dmg'), fact('Speed', '1.1 /s'), fact('Attack rating', '20'), fact('Evasion rating', '14'), fact('Defense', '0')]),
    opp(2, 'Mire hound', 12, 12, [fact('Attack', '4 dmg'), fact('Speed', '1.1 /s'), fact('Attack rating', '20'), fact('Evasion rating', '14'), fact('Defense', '0')]),
    {...opp(3, 'Hooded drover', 0, 1, [fact('Attack', null, 'unknown'), fact('Speed', null, 'unknown')]), defeated: false, knowledge: 'unknown', health: {text: '', progress: null, knowledge: 'unknown'}},
]};
export const BRAWL_FIXTURE = {...fightSituation(BRAWL_BOARD, you(5), {place: 'Sunken lane'}).spec, id: 'fight-brawl', title: 'Brawl in the sunken lane'};

// A chase as stages: the pursuit model has no distance yet.
export const CHASE_VIEW = {definitionId: 'fixture.tollman', label: 'The tollman follows', status: 'contact', text: 'Someone asks to meet you at the old weighbridge.', expiresAt: 610};
export const CHASE_FIXTURE = chaseSituation(CHASE_VIEW);

export const COMBAT_FIXTURES = [DUEL_FIXTURE, BRAWL_FIXTURE, CHASE_FIXTURE];
FIGURE_FIXTURES.push(...COMBAT_FIXTURES);

// Versus-row gallery section: the same fixtures drawn by src/ui/combat_versus.js in both themes, with the text form.
// figure_gallery.js renders FIGURE_FIXTURES in its module body after this module loads, so DOM work is deferred.
const DUEL_VERSUS = fightSituation(DUEL_BOARD, you(14), {place: 'Reed causeway'}).versus;
const BRAWL_VERSUS = fightSituation(BRAWL_BOARD, you(5), {place: 'Sunken lane'}).versus;
// Tempo mode of the same card (COMBAT.md round 3): a move-by-move contest in the tempoView shape, with a typed
// hit learned on one foe, a resistance revealed by a marked cheat on the other, and the dev type-split readout.
export const TEMPO_VIEW = {fight: {title: 'Contest at the ford', result: null, yourTurn: true, next: ['You', 'Ford warden', 'Reed cutter'],
    you: {hp: 21, maxHp: 30, stamina: 7, maxStamina: 10, mix: {slashing: .7, piercing: .3}},
    moves: [{id: 'jab', label: 'Quick strike', text: 'A fast, light blow.', cost: 3, safe: false, usable: true, why: '', mix: {slashing: .7, piercing: .3}},
        {id: 'guard', label: 'Brace', text: 'Take the next blow better.', cost: 2, safe: true, usable: true, why: ''}],
    aims: [{id: 'head', label: 'Head', text: 'A small mark, easier to avoid.'}, {id: 'body', label: 'Body', text: 'A broad mark.'}], aim: null, orders: [], allies: [],
    foes: [{id: 'fx-warden', name: 'Ford warden', hurt: 'hurt', learned: {slashing: 'resisted'}},
        {id: 'fx-cutter', name: 'Reed cutter', hurt: 'fresh', learned: {}, reveal: {source: 'insight', defense: {bludgeoning: 1.3, piercing: .8}}}],
    lines: ['Both sides see each other at once.', 'You hit Ford warden for 3.6 slashing, resisted.', 'Ford warden hits you for 4 piercing.'],
    hits: [{actor: 'You', target: 'Ford warden', slot: 'body', dmg: 3.6, multiplier: .9, split: {slashing: .65, piercing: .35}}, {actor: 'Ford warden', target: 'You', slot: 'arm', dmg: 4, multiplier: 1, split: {piercing: .6, slashing: .4}}]}};
export const TEMPO_FIXTURE = tempoSituation(TEMPO_VIEW, {place: 'Shallow ford', dev: true});
export const VERSUS_FIXTURES = [DUEL_VERSUS, BRAWL_VERSUS, TEMPO_FIXTURE.versus];

if (typeof document !== 'undefined') {
    queueMicrotask(async () => {
        const main = document.getElementById('fig_gallery');
        if (!main) return;
        const {renderVersusRow, versusText} = await import('../../combat_versus.js');
        const {applyCustomizationProfile, defaultCustomizationState, neutralPresentationSettings} = await import('../../../customization_profiles.js');
        const el = (tag, attrs = {}, text = '') => { const n = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); if (text) n.textContent = text; return n; };
        const states = {luminous: defaultCustomizationState(), neutral: defaultCustomizationState()};
        states.neutral.profiles.Default.settings = neutralPresentationSettings();
        delete states.neutral.profiles.Default.modules.messages;
        const section = el('section', {class: 'fig-gallery-section', 'data-fixture': 'versus-row'});
        section.append(el('h2', {}, 'Versus row: duel and brawl (auto mode), contest at the ford (tempo mode)'));
        const pair = el('div', {class: 'fig-gallery-pair'});
        for (const theme of ['luminous', 'neutral']) {
            const cell = el('div', {class: 'fig-gallery-cell'});
            const host = el('div', {class: 'theme-preview'}), module = el('div', {'data-theme-cell': theme});
            host.append(module); cell.append(el('h3', {}, theme === 'luminous' ? 'Luminous Gothic' : 'Neutral'), host);
            pair.append(cell);
            applyCustomizationProfile(states[theme], {moduleNodes: {vitals: module}});
            for (const versus of VERSUS_FIXTURES) {
                const row = el('div', {class: 'fig-gallery-versus'});
                module.append(row);
                renderVersusRow(row, versus);
                module.append(el('pre', {class: 'fig-text'}, versusText(versus)));
            }
        }
        // Tempo mode extras: the move area, the log and the dev type-split readout, as text under the rows.
        section.append(el('pre', {class: 'fig-text', 'data-fixture': 'tempo-mode'}, [
            'Moves: ' + TEMPO_FIXTURE.moves.map(m => `${m.label} · ${m.cost} time${m.mixText ? ` · ${m.mixText}` : ''}`).join(' | '),
            'Log:', ...TEMPO_FIXTURE.log.map(l => `  ${l}`), 'Dev readout:', ...TEMPO_FIXTURE.dev.map(l => `  ${l}`)].join('\n')));
        section.append(pair);
        main.append(section);
    });
}
