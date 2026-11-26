// An authored workshop incident. The bell and the clerk's reaction are
// independent: only the player physically muffling the clapper stops the bell.
import {LOTM_IDS} from './book_world_lotm_ids.js';
import {tingenSilverWorkshop} from './lotm_amulet_crafting.js';
import {SLUMBER_SLEEP,SOOTHING_CALM} from './lotm_silver_charms.js';

const prefix='book.lotm.workshop-bell';
const worldId=LOTM_IDS.world;
const {place,commissioned}=tingenSilverWorkshop;
export const bellRinging=prefix+'.ringing';
export const bellRopeClear=prefix+'.rope-clear';
export const bellClerk={
    id:prefix+'.clerk',revision:1,label:'The workshop clerk',worldId,location:place,inventory:'simulation',provision:false,
    body:{form:'human',hands:2,mobile:true},vitals:{health:10,max_health:10,stamina:6,max_stamina:6}
};
const eq=(fact,value)=>({fact,op:'eq',value});
const worldFact=(key,value)=>({type:'fact',scope:'world',key,value});
const ringing=eq('world.'+bellRinging,true);
const ropeClear=eq('world.'+bellRopeClear,true);
const ropeHeld=eq('world.'+bellRopeClear,false);
const calm=eq('condition.'+SOOTHING_CALM,1);
const unsettled=eq('condition.'+SOOTHING_CALM,0);
const asleep=eq('condition.'+SLUMBER_SLEEP,1);
const awake=eq('condition.'+SLUMBER_SLEEP,0);
const clerkAct=(suffix,label,requires,effects)=>({
    id:prefix+'.'+suffix,revision:1,worldId,location:place,actorId:bellClerk.id,
    group:'book_lotm_bell_clerk',duration:0,label,requires:{all:[ringing,...requires]},effects
});
export const bellClerkCommands=[
    clerkAct('pull','The clerk yanks the alarm rope',[ropeClear,awake,unsettled],[
        {type:'vital',key:'stamina',amount:-1},worldFact(bellRopeClear,false)
    ]),
    clerkAct('step-back','The clerk steps back from the alarm rope',[ropeHeld,awake,calm],[worldFact(bellRopeClear,true)]),
    clerkAct('drop-rope','The clerk’s grip goes slack',[ropeHeld,asleep],[worldFact(bellRopeClear,true)])
];
export const bellClerkController={
    id:prefix+'.clerk-routine',revision:1,label:'The workshop clerk reacts to the alarm',actorId:bellClerk.id,interval:1,
    actions:bellClerkCommands.map(command=>({commandId:command.id,priority:1,when:command.requires}))
};

const answer='lotm.workshop-bell.answer', muffle='lotm.workshop-bell.muffle';
const row=(id,label,step)=>({id,label,steps:[{id:step,kind:'use'}]});
export const bellActs={
    rows:[row(answer,'Workshop alarm','answer'),row(muffle,'Ringing bell','muffle')],
    bindings:{
        [answer]: {place,visibleWhen:commissioned,support:commissioned,steps:{answer:{
            once:true,label:'Answer the workshop alarm',minutes:1,
            description:'A clerk calls you over. The workshop bell will not stop ringing.',
            reportKey:'book.lotm.history.workshop-bell.answer',
            report:'The clerk flinches at each ring and reaches for the rope.',
            effects:[
                {type:'spawn',personId:bellClerk.id,definitionId:bellClerk.id},
                worldFact(bellRinging,true),worldFact(bellRopeClear,true),
                {type:'knowledge',key:'book.lotm.cast.met.'+bellClerk.id,stage:'seen',value:'You meet the workshop clerk.',
                    basis:{kind:'observation',attributedTo:'player',situationId:'book.lotm.tingen.canon_beside'}}
            ]
        }}},
        [muffle]: {place,visibleWhen:ringing,support:{all:[ringing,ropeClear]},
            reason:'The clerk keeps yanking the rope. Wait until their hands are clear.',
            steps:{muffle:{label:'Muffle the bell',minutes:1,
                description:'With the clerk clear of the rope, wrap the clapper to stop the ringing.',
                reportKey:'book.lotm.history.workshop-bell.muffle',
                report:'You wrap the clapper. The workshop falls quiet.',
                effects:[worldFact(bellRinging,false)]}}}
    }
};

export function bellActDescription(id,state) {
    if(id!==muffle+'.muffle')return null;
    const facts=state.worlds[worldId].facts;
    if(!facts[bellRopeClear])return 'The bell is still ringing. The clerk keeps yanking the rope.';
    const calm=state.simulation.conditions[bellClerk.id]?.[SOOTHING_CALM];
    return calm?.expiresAt>state.clock
        ? 'The bell is still ringing. The clerk has stepped back. Wrap the clapper while their hands are clear.'
        : 'The bell is still ringing. The rope is clear. Wrap the clapper to stop the ringing.';
}
