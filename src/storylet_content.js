// E2 Village cards, adapted to existing single-target effects and played time.
// Fixed original contacts are a bounded bridge; P4 owns generated residents.
import {all, not} from './basics.js';
import {moneyNativeKey as money} from './content_kit.js';
const F = (fact, op, value) => ({fact, op, value});
const is = (key, value=true) => F(key,'eq',value);
const fact = (key,value=true) => ({type:'fact',scope:'actor',key,value});
const item = (id,amount) => ({type:'item',key:JSON.stringify({id}),amount});
const xp = (skill,amount) => ({type:'xp',skill,amount});
const neighbor = 'storylet.neighbor';
const rel = (amount,text) => ({type:'relationship',target:neighbor,axis:'trust',amount,text});
const res = (key,amount) => ({type:'resource',actor:neighbor,key,amount});
const choice = (id,label,effects=[],costs=[],requires) => ({id,label,effects,costs,...(requires?{requires}:{})});
const receipt = key => fact(`storylet.${key}`);
function card(id,deck,urgency,label,options={}) {
    const {weight=3,cooldown=120,once=false,plus=[],family='daily',fallback='pass',...event}=options;
    return {id:`village.${id}`,revision:1,label,group:'storylet',interval:1,public:true,actorId:'player',targetId:neighbor,
        mode:urgency==='ambient'?'ambient':urgency==='soft'?'offer':'decision',
        lifetime:urgency==='ambient'?0:90,effects:[],responses:[],onExpire:[receipt(`${id}.passed`)],...event,
        storylet:{deck:`village.${deck}`,urgency,weight:{base:weight,plus},cooldown,once,family,fallback}};
}
export const storyletEvents = [
    card('cow_on_the_road','daily','ambient','Sela finds the missing cow by the mill and shares a coin for your directions.',
        {weight:4,effects:[money(1),rel(1,'Helped find the cow.')],cooldown:72}), // C01
    card('roof_promise','daily','ambient','Sela says the roof can wait until tomorrow. Another loose board needs attention.',
        {requires:not(is('actor.storylet.roof.fixed')),effects:[res('roof_neglect',1)],cooldown:48}), // C02
    card('shower_bench','daily','soft','A short shower reaches the Village workbench.',
        {once:true,plus:[{when:is('weather.damp'),add:4}],
         effects:[{type:'world',worldId:'base.frontier',key:'workbench.wet',value:true}],
         responses:[choice('cover','Cover the bench · 1 coin',[{type:'world',worldId:'base.frontier',key:'workbench.wet',value:false},{type:'relationship',target:'oldCraftsman',axis:'respect',amount:1,text:'Covered the bench.'}],[money(-1)]),
            choice('wait','Let it dry naturally',[{type:'world',worldId:'base.frontier',key:'workbench.wet',value:false}])],
         onExpire:[{type:'world',worldId:'base.frontier',key:'workbench.wet',value:false}],fallback:'wait'}), // C03
    card('rats_nearly_ate_cat','daily','soft','Sela’s cat came home with a torn ear. A trap could keep the rats out.',
        {effects:[receipt('rats.noticed')],responses:[choice('coin','Buy a trap · 1 coin',[fact('storylet.rats.trap'),rel(1,'Bought a rat trap.')],[money(-1)]),
            choice('hunt','Promise to help in the granary',[fact('storylet.rats.promised')]),choice('pass','Pat the cat and move on',[receipt('cat.met')])]}), // C04
    card('stray_dog','daily','soft','A thin dog follows you from the mill road. It watches your hands.',
        {once:true,requires:not(is('actor.tag.dog')),responses:[choice('feed','Share stale bread',[fact('tag.dog')],[item('Stale bread',-1)]),
            choice('pass','Let it follow at a distance',[fact('storylet.dog.seen')])],onExpire:[fact('storylet.dog.seen')]}), // C05
    card('debt_collector_visits','people','hard','A collector knocks on Sela’s door. You can help, or leave the decision with her.',
        {family:'people',requires:F('target.resource.debt','gte',20),responses:[choice('pay','Pay 20 coins toward her debt',[res('debt',-20),rel(2,'Paid toward the roof debt.')],[money(-20)]),
            choice('stand','Stand beside her',[fact('storylet.collector.delayed'),rel(1,'Stood beside me.')]),choice('pass','Leave it to Sela',[fact('storylet.collector.seen')])]}), // C06
    card('roof_gives_way','people','soft','Sela’s roof needs repair. She has the tools, but needs wood or a loan.',
        {weight:5,family:'people',requires:all(F('target.resource.roof_neglect','gte',3),not(is('actor.storylet.roof.fixed'))),
         responses:[choice('repair','Help with two rough wood logs',[fact('storylet.roof.fixed'),rel(3,'Helped repair the roof.')],[item('Rough wood log',-2)]),
            choice('lend','Lend 40 coins for repairs',[fact('storylet.roof.fixed'),rel(2,'Lent the repair money.')],[money(-40)]),
            choice('borrow','Suggest arranging a loan',[res('debt',40),fact('storylet.roof.fixed'),fact('storylet.roof.borrowed')]),
            choice('pass','Let her keep planning',[receipt('roof.known')])]}), // C07
    card('fence_feud','people','soft','Two neighbors disagree over a fence. Sela asks you to walk the boundary.',
        {family:'people',plus:[{when:is('actor.storylet.harvest.poor'),add:3}],responses:[choice('mediate','Walk the line with them',[rel(2,'Walked the disputed boundary.'),xp('Perception',8),fact('storylet.feud.settled')]),
            choice('pass','Stay out of it',[fact('storylet.feud.known')])]}), // C08
    card('child_has_fever','people','hard','Sela’s child has a fever. The healer can visit, or you can bring the message yourself.',
        {family:'people',cooldown:480,requires:not(is('actor.storylet.fever.treated')),responses:[choice('healer','Send for the healer · 6 coins',[fact('storylet.fever.treated'),rel(2,'Sent for the healer.')],[money(-6)]),
            choice('help','Carry the message yourself',[fact('storylet.fever.treated'),rel(1,'Brought the healer.')]),
            choice('pass','Ask her to seek another helper',[fact('storylet.fever.untreated')])],onExpire:[receipt('fever.passed')]}), // C10
    card('teacher_passes_through','chances','soft','A traveling survey teacher offers a short lesson before moving on.',
        {family:'opportunity',cooldown:240,responses:[choice('learn','Pay for a lesson · 8 coins',[xp('Perception',30)],[money(-8)]),
            choice('trade','Help pack the maps for a lesson',[xp('Perception',15),fact('storylet.teacher.helped')]),choice('pass','Let the teacher move on',[receipt('teacher.met')])]}), // C11
    card('peddler_with_rope','chances','soft','A peddler unrolls survey rope. “Three coins for a sound coil.”',
        {family:'opportunity',requires:not(F(`item.${JSON.stringify({id:'Survey rope'})}`,'gte',1)),responses:[choice('buy','Buy survey rope · 3 coins',[item('Survey rope',1)],[money(-3)]),
            choice('pass','Walk on',[receipt('peddler.met')])]}), // C12
    card('rats_in_the_granary','threats','soft','Rats scratch inside the granary wall. Sela offers two coins for help.',
        {family:'threat',requires:is('actor.storylet.rats.noticed'),responses:[choice('clear','Clear the nesting straw',[money(2),xp('Pest killing',12),fact('storylet.granary.cleared')]),
            choice('trap','Use the trap already bought',[money(2),fact('storylet.granary.cleared')],[],is('actor.storylet.rats.trap')),
            choice('pass','Leave the grain to its owners',[receipt('granary.known')])]}), // C14
    card('scouts_on_forest_road','threats','hard','A stranger on the Forest road counts Village doors. You have time to warn the patrol.',
        {family:'threat',cooldown:360,requires:not(is('actor.storylet.scouts.warned')),responses:[choice('warn','Bring word to the patrol',[fact('storylet.scouts.warned'),xp('Perception',10)]),
            choice('dog','Let your dog bark',[fact('storylet.scouts.warned'),fact('storylet.dog.helped')],[],is('actor.tag.dog')),
            choice('pass','Keep a note of the stranger',[fact('storylet.scouts.noted')])],onExpire:[receipt('scouts.passed')]}), // C15
    card('fever_spreads','threats','soft','More neighbors ask for the healer’s visiting hours. Sela needs help carrying the notices.',
        {family:'threat',once:true,requires:all(is('actor.storylet.fever.untreated'),not(is('actor.storylet.fever.contained'))),
         responses:[choice('help','Carry the healer’s notices',[fact('storylet.fever.contained'),rel(2,'Carried the visiting notices.'),money(1)]),
            choice('pass','Leave the notices on the board',[fact('storylet.fever.notices')])],onExpire:[fact('storylet.fever.notices')]}), // C16
];
export const storyletDefinitions = {
    people:[{id:neighbor,revision:1,label:'Sela',worldId:'base.frontier',location:'Village',inventory:'simulation',provision:false,resources:{roof_neglect:0,debt:0}}],
    commands:[{id:'village.storylets.begin',revision:1,label:'Begin Village encounters',group:'storylet',worldId:'base.frontier',actorId:'player',location:'Village',once:true,
        effects:[{type:'spawn',definitionId:neighbor,personId:neighbor},fact('storylets.enabled')]}],
    events:storyletEvents,
};
