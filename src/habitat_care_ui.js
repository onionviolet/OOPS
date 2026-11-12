import {HABITAT as H,HAY_KEY,WOOL_KEY,habitatFacts,planHabitatAction} from './habitat_care.js';
import {SHELL_ACTIONS} from './meadow_shell_state.js';
import {COURIER} from './meadow_courier.js';
import {FINE_WOOL_KEY} from './meadow_fleece.js';
import {MEADOW_BAIT_KEY} from './meadow_wildlife.js';
const node=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
export function createHabitatPanel({parent,read,act}){
    const panel=node('details');panel.id='meadow_pen_panel';panel.className='expedition_panel';
    panel.append(node('summary','Meadow pen'));
    const body=node('div'),status=node('div'),controls=node('div'),notice=node('p');notice.setAttribute('role','status');
    controls.style.cssText='display:flex;flex-wrap:wrap;gap:6px';
    const policy=node('details');policy.append(node('summary','Care and away policy'),
        node('p','Policy: feeding and brushing each last 12 played minutes. Six minutes of overlapping care produce one batch of 5 Wool. Progress pauses without support; at most one batch waits. Collection starts a new care cycle. Welfare stays safe in the shelter even when routine care lapses.'),
        node('p','Away policy: the open game’s native calendar advances care and production while you work or travel elsewhere. Closed-game wall time adds nothing. No offline feed use, harm, automatic collection or stock. Ready wool remains available when care expires.'));
    body.append(node('p','A sheltered grass pen with clean water. Feed and brush your ewe for wool. Add a stall if you want to raise a lamb.'),status,controls,policy,
        node('p','Use the wool: after the craftsman teaches Crafting, open Crafting → Tinkering → Wool cloth (5 Wool per attempt). Native skill, station and success chance apply. Fine wool from a grown lamb weaves into more valuable Fine wool cloth.'),notice);
    panel.append(body);parent.append(panel);let message='',signature='';
    const buttons=new Map();
    for(const [action,label]of [['build',`Obtain sheltered pen · ${H.buildCost} coins`],['adopt',`Adopt fleece sheep · ${H.adoptCost} coins`],['buy_feed',`Buy 1 Meadow hay · ${H.feedCost} coins`],['feed','Feed sheep · consume 1 Meadow hay'],['attend','Brush and inspect sheep'],['collect',`Collect ready wool · ${H.yield} Wool`],
        ['rescue_ewe',`Take in the injured ewe · ${H.rescueCost} coins`],
        ['extend_pen',`Add a lamb stall · ${H.extensionCost} coins`],
        ['breed_sheep',`Hire the shepherd’s ram · ${H.breedingCost} coins`],
        ['tend_lamb','Feed and brush the grown lamb · 1 Meadow hay'],
        ['shear_lamb','Shear the grown lamb'],
        ['sell_lamb',`Sell the grown lamb · receive ${H.lambPrice} coins`],
        ['hire_courier',`Hire a reed construct · ${COURIER.hire} coins`],
        ['fit_courier','Fit a carrying sling · 1 Wool cloth'],
        ['dispatch_courier','Send 2 Stale bread to the shepherd'],
        ['recall_courier','Recall the construct with the bread'],
        ['receive_courier',`Confirm delivery · receive ${COURIER.fee} coins`],
        ['rescue_shell','Take in a hurt reed terrapin · 5 coins'],
        ['feed_shell','Feed the terrapin · 1 Meadow hay'],
        ['fit_inlet','Fit a shell-linked inlet · 1 Wool cloth'],
        ['open_inlet','Hold the inlet open'],['close_inlet','Hold the inlet closed'],['link_inlet','Link the inlet to the terrapin'],
        ['collect_driftwood','Collect the terrapin’s driftwood'],['spar_shell','Practice with the reed terrapin'],['check_shell','Check the chamber again'],
        ['survey_copse','Check tracks in the copse'],['hunt_rabbit','Hunt one rabbit · 1 Stale bread for bait']]){
        const b=node('button',label);b.type='button';b.dataset.habitat=action;
        b.onclick=()=>{try{act(action);message=action==='spar_shell'?'':action==='hunt_rabbit'?'You bring back one Rabbit meat.':
            action==='survey_copse'?'You check the tracks by the meadow.':'Meadow pen progress saved.';}catch(e){message=e.message;}signature='';render();};
        controls.append(b);buttons.set(action,b);
    }
    function render(){
        if(panel.parentElement!==parent)parent.append(panel);
        const r=read();panel.hidden=r.location!==H.location||r.world!==H.world||r.inDialogue||r.inCombat;
        if(panel.hidden)return;
        const next=JSON.stringify(r);if(next===signature)return;signature=next;
        const f=habitatFacts(r.owner,r.clock),s=f.state;status.replaceChildren();
        for(const [key,text]of [['ownership',s?`Site: your sheltered meadow pen · ${s.site.capacity} stalls. Animal: ${s.animal?'your fleece sheep, housed here':'none; adoption requires this pen'}.`:'Site: not owned. Animal: none. No inherited animals or materials.'],
            ['welfare',`Welfare: ${f.welfare}.`],['care',`Care: ${f.fed?'fed':'needs hay'}; ${f.attended?'brushed and inspected':'needs attention'}. Carried hay: ${r.inventory[HAY_KEY]||0}.`],
            ['harvest',`Harvest: ${f.ready?'ready, 5 Wool':`${s?.progress||0}/${H.batchMinutes} supported minutes`}. Collected batches: ${s?.collected||0}. Carried Wool: ${r.inventory[WOOL_KEY]||0}.`]]){
            const p=node('p',text);p.dataset.habitatFact=key;status.append(p);
        }
        if(f.wound?.remaining){
            const p=node('p',`The ewe has a cut. She needs ${f.wound.remaining} more minutes with hay and brushing before she grows wool again.`);
            p.dataset.habitatFact='injury';
            status.append(p);
        }
        if(s?.broodId||f.lamb){
            const waiting=f.lamb ? f.lamb.matureAt-r.clock : s.lifecycle.broods[s.broodId].dueAt-r.clock;
            const text=f.lamb ?
                `A ${f.lamb.traits.coat} lamb occupies the spare stall. ${waiting>0?`Grown in ${waiting} minutes.`:`You can tend it for ${f.lamb.traits.fleece==='fine'?'fine wool':'wool'}, or sell it to the shepherd.`}` :
                `The ewe is expecting. Keep the spare stall open for ${waiting} more minutes.`;
            const p=node('p',text);
            p.dataset.habitatFact='lamb';
            if(f.lamb?.traits.fleece==='fine') p.append(document.createTextNode(` Fine wool in your pack: ${r.inventory[FINE_WOOL_KEY]||0}.`));
            status.append(p);
        }
        if(f.shellAnimal){
            const {state:animal,condition,pending}=f.shellAnimal;
            const {regulator}=animal;
            const posture=animal.shell==='open'?'out of its shell':'tucked into its shell';
            const recovery=condition.injury?.remaining?
                `Its leg needs ${condition.injury.remaining} more minutes with food and damp air.`:'Its leg has healed.';
            const inlet=regulator.pending?` A change is due in ${regulator.pending.at-regulator.clock} minutes.`:'';
            const p=node('p',pending?'Check the chamber again to see how the terrapin is doing.':
                `The terrapin is ${posture}. ${recovery} Humidity ${regulator.humidity}%. Inlet ${regulator.inlet}.${inlet} ${animal.work===4?'One driftwood bundle ready.':`Driftwood work ${animal.work}/4.`}`);
            p.dataset.habitatFact='terrapin';status.append(p);
        }
        if(s?.courier){
            const {order,sling}=s.courier;
            const text=order.status==='delivered'?'The shepherd received two loaves.':
                order.status==='en_route'?(order.dueAt>r.clock?
                    `The construct is carrying two loaves to the shepherd. Arrives in ${order.dueAt-r.clock} minutes.`:
                    'The construct is at the shepherd’s gate with both loaves.'):
                    sling?'The sling can hold both loaves for the shepherd.':'The bare frame cannot carry both loaves. Fit a wool-cloth sling.';
            const p=node('p',text);p.dataset.habitatFact='courier';status.append(p);
        }
        if(f.wildlife){
            const {rabbits,foxes}=f.wildlife;
            const p=node('p',f.wildlife.pending?'The tracks need another look.':
                `The copse has ${rabbits} ${rabbits===1?'rabbit':'rabbits'} and ${foxes} ${foxes===1?'fox':'foxes'}. Foxes may leave if rabbits grow scarce.${!r.inventory[MEADOW_BAIT_KEY]?' Bring Stale bread to bait a hunt.':''}`);
            p.dataset.habitatFact='wildlife';
            status.append(p);
        }
        for(const [action,b]of buttons){
            b.hidden=action==='build'?!!s:action==='adopt'?!!s?.animal:action!=='buy_feed'&&!s?.animal;
            if(action==='rescue_ewe')b.hidden=!s||!!s.animal;
            if(action==='extend_pen')b.hidden=!s||s.site.capacity===2;
            if(action==='breed_sheep')b.hidden=!s?.animal||s.site.capacity!==2||!!s.broodId||!!s.lambId;
            if(action==='tend_lamb'||action==='shear_lamb')b.hidden=!f.lamb||f.lamb.matureAt>r.clock;
            if(action==='sell_lamb')b.hidden=!f.lamb;
            if(SHELL_ACTIONS.includes(action)){
                const shell=f.shellAnimal;
                b.hidden=action==='rescue_shell'? !s||!!shell :
                    !shell||(action==='check_shell'&&!shell.pending)||(action==='fit_inlet'&&!!shell.state.fitting)||
                    (action==='link_inlet'&&(!shell.state.fitting||shell.state.mode==='linked'));
            }
            if(action==='spar_shell'){
                b.hidden=!f.shellAnimal;
                b.disabled=!r.ready||!r.spar?.eligible;
                b.title=b.disabled?(r.spar?.reason||'Follow local people and work before starting a practice bout.'):'';
                continue;
            }
            if(action==='hire_courier')b.hidden=!s||!!s.courier;
            if(action==='fit_courier')b.hidden=!s?.courier||!!s.courier.sling;
            if(action==='dispatch_courier')b.hidden=s?.courier?.order.status!=='open';
            if(action==='recall_courier'||action==='receive_courier')b.hidden=s?.courier?.order.status!=='en_route';
            if(action==='survey_copse')b.hidden=!s||!!f.wildlife&&!f.wildlife.pending;
            if(action==='hunt_rabbit')b.hidden=!f.wildlife;
            if(!s&&action!=='build')b.hidden=true;
            try{planHabitatAction(r.owner,action,r);b.disabled=false;b.title='';}
            catch(e){b.disabled=true;b.title=e.message;}
        }
        notice.textContent=message;
    }
    render();setInterval(render,500);return {render};
}
