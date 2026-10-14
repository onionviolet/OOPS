import {createGeneratedPeople,advanceGeneratedPeople,validateGeneratedPeople,generatedPeopleView,interactGeneratedPerson} from './generated_people.js';
import {villageAuthoredNames} from './name_grammar.js';
let current=null;
export function restoreGeneratedPeople(save) {current=save.generated_people==null?null:structuredClone(validateGeneratedPeople(save.generated_people));}
export function generatedPeopleSnapshot(at) {return advanceGeneratedPeople(current,at);}
const node=(tag,text='')=>{const n=document.createElement(tag);n.textContent=text;return n;};
// Registration lives here, independent of simulation_content and authored households.
export function registerGeneratedPeople({read,save,persist,authoredNames=[],itemKey,canSupply,publishSupply,publishReward}) {
    const panel=node('details');panel.id='generated_people_panel';panel.append(node('summary','Village travelers'));
    const status=node('p'),body=node('div');panel.append(status,body);let signature;const expanded=new Set();
    function act(id,action) {
        try {
            const context=read();if(!context.canWrite||!context.inVillage||context.busy)throw Error('Meet travelers in Village when you are free to talk and save.');
            const envelope=JSON.parse(save());let next,reward=0,key=null;
            if(action==='enroll') {if(current)throw Error('Travelers already enrolled.');next=createGeneratedPeople(context.seed,context.at,[...villageAuthoredNames,...authoredNames]);}
            else {
                const base=generatedPeopleSnapshot(context.at),p=base.people.find(p=>p.id===id);
                if(action==='help') {
                    key=itemKey(p.goal.item);if(!canSupply(key))throw Error(`Bring one ${p.goal.item} from your own inventory.`);
                    const inventory=envelope.inventories.person.main_character;
                    if(!(inventory[key]?.count>=1))throw Error('That supply is no longer available.');
                    inventory[key].count--;if(!inventory[key].count)delete inventory[key];
                }
                ({state:next,reward}=interactGeneratedPerson(base,id,action,{inVillage:context.inVillage,suppliedItem:key?p.goal.item:null}));
            }
            envelope.generated_people=next;envelope.character.money+=reward;
            persist(JSON.stringify(envelope)); // No native reward or cost before durable publication.
            if(key)publishSupply(key);if(reward)publishReward(reward);
            status.textContent=action==='help'?`Supply delivered; earned ${reward} wood coins. They remember your help.`:action==='enroll'?'Two travelers have arrived. Another will follow tomorrow.':action==='settle'?'They choose to settle in Village.':'Meeting remembered.';
        } catch(e){status.textContent=e.message;}render();
    }
    function button(text,id,action,disabled=false){const b=node('button',text);b.type='button';b.dataset.generatedAction=action;b.dataset.personId=id||'';b.disabled=disabled;b.addEventListener('click',()=>act(id,action));return b;}
    function render() {
        const c=read(),view=generatedPeopleView(generatedPeopleSnapshot(c.at)),next=JSON.stringify([view,c.canWrite,c.inVillage,c.busy]);
        panel.hidden=!c.inVillage&&!current;
        if(signature!==next){signature=next;body.replaceChildren();const disabled=!c.canWrite||!c.inVillage||c.busy;
            if(!current){body.append(node('p','Listen for travelers on the Village road. This starts new visits from now; your existing neighbors keep their lives.'),button('Welcome road travelers',null,'enroll',disabled));}
            for(const p of view){const row=node('details');row.dataset.generatedPerson=p.id;row.open=expanded.has(p.id);row.append(node('summary',`${p.name}, ${p.role}. ${p.status==='on_road'?'Away on the road':`${p.status}; ${p.action}`}.`));row.addEventListener('toggle',()=>{if(row.open)expanded.add(p.id);else expanded.delete(p.id);});
                const away=disabled||p.status==='on_road';
                if(!p.met)row.append(button('Meet traveler',p.id,'meet',away));
                else {
                    row.append(node('p',`Known traits: ${p.traits.join(', ')||'none yet'}. ${p.undiscovered} undiscovered. Need: ${p.need}.`));
                    if(p.undiscovered)row.append(button('Talk about their travels',p.id,'talk',away));
                    if(!p.goal.fulfilled){row.append(node('p',`Request: bring one ${p.goal.item}. Reward: ${p.goal.reward} wood coins from their purse.`),button(`Give ${p.goal.item}`,p.id,'help',away));}
                    else {row.append(node('p','Remembers: you helped with supplies.'));if(p.status!=='resident')row.append(button('Offer a place in Village',p.id,'settle',away));}
                }body.append(row);
            }
        }
        const host=document.getElementById('message_box_div');if(host&&host.firstElementChild!==panel)host.prepend(panel);
    }
    render();const timer=setInterval(render,1000);return {render,destroy:()=>{clearInterval(timer);panel.remove();}};
}
