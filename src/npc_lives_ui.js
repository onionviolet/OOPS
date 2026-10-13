import {villageLivesView} from './npc_lives.js';
import {partyDefinitions} from './party_content.js';
import {pursuitDefinitions} from './pursuit_content.js';
import {exchangeDefinitions} from './exchange_content.js';
// View-only: household members who share a first name with a separate authored
// person get a suffix. Saved ids and both people stay distinct.
const otherFirstNames=new Set([partyDefinitions,pursuitDefinitions,exchangeDefinitions].flatMap(d=>d.people.map(p=>p.label.split(',')[0].trim())));
const householdName=(id,name)=>otherFirstNames.has(name)?`${name} (${id==='iona'?'your patrol recruit':'Village household'})`:name;
const ids=v=>new Map(v.people.map(p=>[p.name,p.id]));
const node=(tag,text='')=>{const n=document.createElement(tag);n.textContent=text;return n;};
export function createVillageLivesPanel({read,meet}) {
    const panel=node('details');panel.id='village_lives_panel';panel.append(node('summary','Village neighbors'));
    const button=node('button','Get to know your neighbors'),list=node('ul'),news=node('ol'),status=node('p');button.type='button';button.id='meet_village_neighbors';panel.append(button,status,list,news);let signature;
    button.addEventListener('click',()=>{try{meet();status.textContent='Maia welcomes you beneath the old trees.';}catch(e){status.textContent=e.message;}render();});
    function render(){const s=read();panel.hidden=!s.state&&!s.inVillage;button.hidden=!!s.state;button.disabled=!s.canWrite||!s.inVillage;const v=villageLivesView(s.state),next=JSON.stringify(v);
        if(next!==signature){signature=next;const byName=ids(v),tag=name=>householdName(byName.get(name),name);list.replaceChildren(...v.people.map(p=>node('li',`${tag(p.name)}, ${p.alive?`age ${p.age}`:`remembered at ${p.age}`}${p.parents.length?`, child of ${p.parents.map(tag).join(' and ')}`:''}${p.spouse?`, married to ${tag(p.spouse)}`:''}.`)));news.replaceChildren(...v.news.map(e=>node('li',`Year ${e.year}: ${e.text}`)));}
        const host=document.getElementById('message_box_div');if(host&&panel.parentElement!==host)host.prepend(panel);
    }render();const timer=setInterval(render,2000);return {render,destroy:()=>{clearInterval(timer);panel.remove();}};
}
