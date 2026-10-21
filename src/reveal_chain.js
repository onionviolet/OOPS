// Original implementation inspired by Proto23's experience/capability/UI chain.
// No foreign code, assets or reward values are used. Native owners retain progress.
export const HERB_LESSON = {material:'Golmoon leaf',count:20,recipe:'Weak healing powder'};
export function heldLesson(inventory, learned) {
    if (learned) return false;
    return Object.values(inventory).reduce((n,row)=>n+(row.item?.id===HERB_LESSON.material?row.count:0),0)>=HERB_LESSON.count;
}
// Light at the reader's place (proposal, M4 2026-10-19): a source brighter than the ambient light
// speeds reading up to x1.5 at full gain. With no reader set, or in daylight, the pace is unchanged.
let readingLight = null;
export function setReadingLightReader(reader) { readingLight = typeof reader === 'function' ? reader : null; }
// Scoped hosts may coexist. Removing one never clears another host's reader;
// the most recently bound remaining reader supplies this consumer's place.
const readingLightBindings = [];
export function bindReadingLightReader(reader) {
    if (typeof reader !== 'function') throw Error('Invalid reading light reader.');
    const binding = {reader};
    readingLightBindings.push(binding);
    return () => {
        const at = readingLightBindings.indexOf(binding);
        if (at >= 0) readingLightBindings.splice(at, 1);
    };
}
function lightFactor(light) {
    const ambient = Math.max(0, Math.min(100, light.ambient)), lit = Math.max(ambient, Math.min(100, ambient + Math.max(0, light.bonus || 0)));
    return 1 + 0.5 * (lit - ambient) / 100;
}
// Estimates read current light; completed study reads the interval just settled by the native
// clock. This keeps the last fueled fraction without making an expired lamp shine now.
export function readingLightFactor(minutes = 0) {
    const light = (readingLightBindings.at(-1)?.reader ?? readingLight)?.(minutes);
    if (!light) return 1;
    if (minutes > 0 && light.intervals) return light.intervals.reduce((sum, part) => sum + part.minutes * lightFactor(part), 0) / minutes;
    return lightFactor(light);
}
export function readingRate(level) { return 1 + Math.min(10,Math.max(0,Number.isFinite(level)?level:0))*.05; }
export function practiceMethods(progress) {
    return [
        {id:'run',label:'Run',known:(progress.Running?.current_level||0)>=1},
        {id:'investigate',label:'Investigate',known:(progress.Perception?.current_level||0)>=1}
    ].filter(row=>row.known);
}
export function knownPracticeHints(progress,inventory={},learned=false) {
    const hints=[],p=progress.Perception;
    if(p?.total_xp>0 && !p.current_level) hints.push(`Perception practice: ${Number(p.current_xp??p.total_xp).toFixed(2)} / ${p.xp_to_next_lvl??100} XP toward level 1. Known local searches and Village watch help; level 1 opens a practiced local action.`);
    const leaves=Object.values(inventory).reduce((n,row)=>n+(row.item?.id===HERB_LESSON.material?row.count:0),0);
    if(leaves>0&&!learned)hints.push(`Held Golmoon leaves: ${leaves} / ${HERB_LESSON.count}. Handling a full held stack teaches a preparation; keep exploring already-open gathering routes.`);
    return hints;
}
export function openingAllows(id, staged, step) {
    if (!staged) return true;
    const at={time:0,vitals:1,preparation:1,belongings:2,location:2,'local-actions':2,skills:3,records:3};
    return step >= (at[id]??0);
}
let acquire = ()=>{};
export function bindAcquisitionLesson(fn) { acquire=fn; }
export function observeAcquisition(inventory) { acquire(inventory); }
let denominations=()=>true;
export function bindDenominationKnowledge(fn) {denominations=fn;}
export function denominationsKnown(){return denominations();}
export function createPracticePanel({read,toggleRun,investigate,craft,register,update}) {
    const panel=document.createElement('section'); panel.id='practice_capabilities';
    const title=document.createElement('h3');title.textContent='Practiced actions (proposal)';
    const body=document.createElement('div');panel.append(title,body);
    const preparations=document.createElement('section');preparations.id='learned_preparations';
    document.getElementById('location_related_div').append(panel,preparations);
    let signature='';
    function render(){
        const view=read(),methods=practiceMethods(view.progress),next=JSON.stringify([methods,view.run,view.reason,view.runFallback,view.search,view.recipe,view.craftReason,view.hints]);
        if(next===signature)return;signature=next;
        const focused=document.activeElement?.dataset.practiceAction;
        body.replaceChildren();preparations.replaceChildren();
        for(const text of view.hints||[]){const note=document.createElement('p');note.textContent=text;body.append(note);}
        for(const row of methods){
            const reason=row.id==='run'?view.reason:view.search.reason;
            const line=document.createElement('div'),button=document.createElement('button'),status=document.createElement('span');
            button.type='button';button.dataset.practiceAction=row.id;
            button.textContent=row.id==='run'?`Run: ${view.run?'on':'off'}`:`Investigate: ${view.search.on?'on':'off'}`;
            button.disabled=!!reason;button.setAttribute('aria-pressed',String(row.id==='run'?view.run:view.search.on));
            status.textContent=reason|| (row.id==='run'?(view.runFallback?' Low stamina: travel falls back to walking. You can turn Run off.':' Travel 20% faster; costs 2 stamina per journey.'):' Uses the existing five-minute local search.');
            button.onclick=()=>{row.id==='run'?toggleRun():investigate();render();update();};line.append(button,status);body.append(line);
        }
        if(view.recipe){const note=document.createElement('p');note.textContent='Learned: Weak healing powder. Preparation uses 5 Golmoon leaves. '+(view.craftReason||'An alchemy station is available.');preparations.append(note);const button=document.createElement('button');button.type='button';button.textContent='Review learned herb preparation';button.disabled=!!view.craftReason;button.onclick=craft;preparations.append(button);}
        if(focused)body.querySelector(`[data-practice-action="${focused}"]`)?.focus();
    }
    const known=()=>{const v=read();return practiceMethods(v.progress).length>0 || !!v.hints?.length;};
    register({id:'practice-actions',title:'Practiced actions',node:panel,home:'center',eligible:known,discovered:known});
    register({id:'learned-preparations',title:'Learned preparations',node:preparations,home:'center',eligible:()=>read().recipe,discovered:()=>read().recipe});
    render();return {render};
}
export function stageRevealKnowledge(plan, previousInventory, previousMoney) {
    const facts=plan.state.actors.player.facts, inventory=plan.gameplay?.player?.inventory;
    const count=stock=>Object.entries(stock||{}).reduce((n,[key,value])=>{
        let id;try{id=JSON.parse(key).id;}catch{return n;}
        return n+(id===HERB_LESSON.material?value:0);
    },0);
    if(inventory && count(inventory)>count(previousInventory) && count(inventory)>=HERB_LESSON.count && !facts['reveal.herbLesson']) {
        facts['reveal.herbLesson']=true;
        plan.unlocks=[...(plan.unlocks||[]),{kind:'recipe',id:HERB_LESSON.recipe}];
        plan.revealLesson=true;
    }
    if(Number.isFinite(plan.external?.money) && plan.external.money!==previousMoney)
        facts['reveal.wallet.'+plan.state.actors.player.worldId]=true;
}
