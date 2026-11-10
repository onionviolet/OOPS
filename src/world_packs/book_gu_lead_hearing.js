// The academy's inquiry supplies testimony; the Gu tests have separate limits.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_CARAVAN} from './book_gu_lead_caravan.js';
import {GU_LEAD_INHERITANCE} from './book_gu_lead_inheritance.js';
import {GU_LEAD_MOONVEIL} from './book_gu_lead_moonveil.js';
import {GU_LEAD_VITAL} from './book_gu_lead_vital.js';

export const GU_LEAD_HEARING = id('hearing');
const local = name => `${GU_LEAD_HEARING}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:77d5a9fa2608ad9f996f2d9e5ed67789f0f59994e3a75e1d3ad293524a80d9c1';
const world = id('world');
const academy = id('academy');
const all = (...rules) => ({all: rules});
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const done = name => eq(`completed.${local(name)}`);
const field = (name, value) => eq(`actor.${local(name)}`, value);
const set = (name, value) => ({type: 'fact', actor: 'player', scope: 'actor', key: local(name), value});
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: local(name), stage: 'understood', value});
const status = (name, label) => ({id: local(name + '_status'), label, knowledgeKey: local(name)});

const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy));
const predecessor = all(eq(extensionFact(GU_LEAD_MOONVEIL)), eq(`completed.${GU_LEAD_MOONVEIL}.hold_gate`),
    eq(`actor.${GU_LEAD_MOONVEIL}.middle_attested`), eq(`actor.${GU_LEAD_MOONVEIL}.second_gu_priority`));
const admitted = eq(extensionFact(GU_LEAD_HEARING));
const worm = JSON.stringify({id: `${GU_LEAD_VITAL}.refined_liquor_worm`});
const bond = eq(`actor.${GU_LEAD_VITAL}.vital_bond`, 'spring_autumn_cicada');

function act(name, label, duration, previous, description, effects, {needs = [], reason} = {}) {
    const visibleWhen = all(admitted, previous);
    const support = all(ready, visibleWhen, ...needs);
    return {
        id: local(name), revision: 1, label, description, group: 'structured_local', worldId: world,
        actorId: 'player', location: academy, audience: ['$actor'], once: true, duration, visibleWhen,
        requires: {...support, reason: reason || 'Finish the earlier step and stay with the elder.'},
        completionRequires: support, completionCoLocated: true, completionFailure: 'refund',
        cancellation: 'refund', reservationReturns: 1, costs: [], effects
    };
}

export const guLeadHearing = {
    schema: 1, id: GU_LEAD_HEARING, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan at the clan hearing',
    description: 'Answer the academy elder’s summons. Jia Fu has returned to ask about his brother.',
    requires: all(ready, predecessor),
    reason: 'Finish the encounter at the academy gate.',
    status: [status('hearing', 'The clan hearing'), status('testimony', 'What the witnesses saw'),
        status('tracks', 'The Footprint Gu'), status('bamboo', 'The Bamboo Gentleman')],
    commands: [
        act('answer_summons', 'Go with the academy elder', 8, predecessor,
            'The elder comes to your room after dark. Go with him to the clan head’s pavilion and hear why Jia Fu has come back.',
            [set('hearing_state', 'questioning'), note('hearing', 'Jia Fu stands in the middle of the hall. His brother has gone missing. The woman from the stone counter looks you over and tells him he has the right person.')]),
        act('hear_witnesses', 'Let the witnesses finish', 5, done('answer_summons'),
            'Say you do not recognize the name. Hear what the stone clerk and the wine server remember before you answer again.',
            [set('worm_public', true), note('testimony', 'The clerk remembers Jia Jin Sheng bidding for the toad. The server saw you together later and remembers you feeding your Liquor Worm. The academy elder asks where you found it.')],
            {needs: [eq(`actor.${GU_LEAD_CARAVAN}.worm_seen`), eq(`completed.${GU_LEAD_CARAVAN}.offer_wall`)],
                reason: 'The wine server needs to have seen you with the worm and with Jia Jin Sheng.'}),
        act('give_account', 'Tell them about the sixth rock', 5, done('hear_witnesses'),
            'Say the Liquor Worm came out of the last rock after you took it home. Ask the clerk to tell them what she saw at the counter.',
            [set('account', 'sixth_rock'), note('testimony', 'The clerk confirms you left with one unopened rock. She cannot say what you found inside. Jia Fu asks what his brother wanted when you met again.')],
            {needs: [eq(`completed.${GU_LEAD_CARAVAN}.open_last`), eq(`item.${worm}`, 1)],
                reason: 'You need the sixth rock’s history and the Liquor Worm you brought from your room.'}),
        act('question_motive', 'Answer Jia Fu and ask about the inheritance', 5, done('give_account'),
            'Tell Jia Fu his brother wanted to buy your worm. When he presses you for a motive, ask who stands to gain from one fewer heir.',
            [set('account', 'rival_claims_raised'), note('hearing', 'The elders glance at one another when the inheritance comes up. Jia Fu still demands proof that you had no chance to harm his brother.')]),
        act('hear_elder', 'Let the academy elder speak for you', 3, done('question_motive'),
            'Say you have no witness of your own. Wait for the elder to put his records before the clan head.',
            [set('academy_testimony', true), note('testimony', 'The elder steps in front of you. He says he had your movements recorded after the breakthrough and found nothing to support Jia Fu’s charge. Jia Fu asks to see the tracks for himself.')],
            {needs: [eq(`actor.${GU_LEAD_MOONVEIL}.middle_attested`)]}),
        act('show_tracks', 'Stand still for the Footprint Gu', 6, done('hear_elder'),
            'Let Jia Fu spend his Gu to show your last thirty thousand steps. The elders will see where the trail stops.',
            [set('tracks_result', 'village_only'), note('tracks', 'Yellow-green prints lead back through the dormitory, academy and inn. The powder runs out at the thirty-thousandth step. Jia Fu takes out a jade box.')],
            {needs: [field('academy_testimony', true), eq(`completed.${GU_LEAD_INHERITANCE}.nurture_in_rain`)],
                reason: 'The elder’s testimony and your days in the village must come first.'}),
        act('accept_bamboo', 'Open the jade and take the Gu into your aperture', 2, done('show_tracks'),
            'Jia Fu says the Gu changes color if you lie. Keep it in your aperture while he asks his questions, then give it back for everyone to see.',
            [set('bamboo_custody', 'aperture'), note('bamboo', 'A faint green light spreads over the sea in your aperture. Jia Fu waits for your answer.')],
            {needs: [field('tracks_result', 'village_only')]}),
        act('quiet_bamboo', 'Let the Cicada stir', 2, done('accept_bamboo'),
            'Let a trace of the Cicada’s presence reach the Bamboo Gentleman. Keep your essence still.',
            [set('bamboo_response', 'suppressed'), note('bamboo', 'The Bamboo Gentleman curls up and trembles. Its light stays green.')],
            {needs: [field('bamboo_custody', 'aperture'), bond],
                reason: 'You need the Gu in your aperture and the bond you felt there before.'}),
        act('answer_questions', 'Answer the three questions and return the Gu', 4, done('quiet_bamboo'),
            'Deny harming Jia Jin Sheng, knowing more about him, and lying to the elders. Return the Gu for inspection.',
            [set('bamboo_custody', 'jia_fu'), set('bamboo_observed', 'green'),
                note('bamboo', 'The Gu comes out green. Jia Fu takes it back, and the elders relax. They saw its color; they did not see what happened in your aperture.')],
            {needs: [field('bamboo_custody', 'aperture'), field('bamboo_response', 'suppressed')]}),
        act('leave_hall', 'Leave when the clan head dismisses you', 4, done('answer_questions'),
            'Hear Jia Fu say what he will do next. Leave when the clan head gives you leave to go.',
            [set('hearing_state', 'dismissed'), set('inquiry', 'unresolved'),
                note('hearing', 'Jia Fu says he will ask Tie Xue Leng to investigate. He leaves without taking you. The clan head dismisses you and asks the academy elder to stay.')],
            {needs: [field('bamboo_observed', 'green'), field('bamboo_custody', 'jia_fu')]})
    ]
};

export async function registerGuLeadHearing(register, base) {
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_MOONVEIL && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    return register.extension(guLeadHearing, base);
}
